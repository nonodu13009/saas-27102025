import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Fonction d'initialisation paresseuse de Firebase Admin
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    // Utiliser des variables d'environnement (pour Vercel) ou le fichier local (pour dev)
    let serviceAccount;
    
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      // Production : utiliser les variables d'environnement (Vercel)
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };
    } else {
      // Développement local : utiliser le fichier JSON
      try {
        serviceAccount = require("../../../../saas-27102025-firebase-adminsdk-fbsvc-e5024f4d7c.json");
      } catch (error) {
        console.error("Firebase Admin credentials missing");
        throw new Error('Firebase Admin credentials are missing. Check environment variables or local JSON file.');
      }
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  
  return admin;
}

// GET - Liste tous les utilisateurs
export async function GET(request: NextRequest) {
  try {
    const adminInstance = initializeFirebaseAdmin();
    const auth = adminInstance.auth();
    const db = adminInstance.firestore();

    console.log("🔍 Début récupération des utilisateurs...");

    // Récupérer tous les utilisateurs Auth
    const listUsersResult = await auth.listUsers();
    console.log(`✅ ${listUsersResult.users.length} utilisateur(s) trouvé(s) dans Firebase Auth`);
    
    // Récupérer les données Firestore
    const usersSnapshot = await db.collection("users").get();
    console.log(`✅ ${usersSnapshot.size} document(s) trouvé(s) dans Firestore`);
    
    const usersData = new Map();
    usersSnapshot.forEach((doc) => {
      usersData.set(doc.id, doc.data());
    });

    const usersWithData = listUsersResult.users.map((user) => {
      const userData = usersData.get(user.uid) || {};
      return {
        uid: user.uid,
        email: user.email,
        role: userData.role || "CDC_COMMERCIAL",
        active: userData.active !== false,
        createdAt: user.metadata.creationTime,
        emailVerified: user.emailVerified,
      };
    });

    console.log(`✅ ${usersWithData.length} utilisateur(s) préparé(s) pour l'envoi`);
    return NextResponse.json({ users: usersWithData });
  } catch (error: any) {
    console.error("❌ Erreur GET users:", error);
    console.error("Stack:", error.stack);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel utilisateur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password et role requis" },
        { status: 400 }
      );
    }

    // Vérifier le domaine email
    const ALLOWED_DOMAINS = ["@allianz-nogaro.fr"];
    const isValidDomain = ALLOWED_DOMAINS.some(domain => email.endsWith(domain));
    if (!isValidDomain) {
      return NextResponse.json(
        { error: `Email doit se terminer par ${ALLOWED_DOMAINS.join(' ou ')}` },
        { status: 400 }
      );
    }

    const adminInstance = initializeFirebaseAdmin();
    const auth = adminInstance.auth();
    const db = adminInstance.firestore();

    // Créer l'utilisateur dans Auth
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: false,
    });

    // Créer le document Firestore
    await db.collection("users").doc(userRecord.uid).set({
      id: userRecord.uid,
      email,
      role,
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        role,
      },
    });
  } catch (error: any) {
    console.error("Erreur POST user:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour un utilisateur
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, role, active } = body;

    if (!uid) {
      return NextResponse.json(
        { error: "UID requis" },
        { status: 400 }
      );
    }

    const adminInstance = initializeFirebaseAdmin();
    const auth = adminInstance.auth();
    const db = adminInstance.firestore();

    // Mettre à jour le rôle dans Firestore
    if (role) {
      await db.collection("users").doc(uid).update({ role });
    }

    // Mettre à jour active dans Firestore
    if (typeof active === "boolean") {
      await db.collection("users").doc(uid).update({ active });
      // Désactiver/Activer l'utilisateur dans Auth aussi
      if (!active) {
        await auth.updateUser(uid, { disabled: true });
      } else {
        await auth.updateUser(uid, { disabled: false });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur PATCH user:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { error: "UID requis" },
        { status: 400 }
      );
    }

    const adminInstance = initializeFirebaseAdmin();
    const auth = adminInstance.auth();
    const db = adminInstance.firestore();

    // Supprimer de Auth
    await auth.deleteUser(uid);

    // Supprimer de Firestore
    await db.collection("users").doc(uid).delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur DELETE user:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

