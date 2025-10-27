import { collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./config";

export interface Act {
  id: string;
  userId: string;
  kind: "AN" | "M+3" | "PRETERME_AUTO" | "PRETERME_IRD";
  clientNom: string;
  numeroContrat: string;
  contratType: string;
  compagnie: string;
  dateEffet: Date;
  dateSaisie: Timestamp;
  primeAnnuelle?: number;
  montantVersement?: number;
  commissionPotentielle: number;
  commissionReelle?: number;
  moisKey: string;
}

export interface CommissionRule {
  id: string;
  contratType: string;
  montant: number;
  pourcentage?: number;
  active: boolean;
}

export const createAct = async (act: Omit<Act, "id" | "dateSaisie" | "moisKey" | "commissionPotentielle">): Promise<Act> => {
  if (!db) throw new Error('Firebase not initialized');
  
  const dateSaisie = new Date();
  const moisKey = dateSaisie.toISOString().slice(0, 7); // YYYY-MM

  // Calculer la commission potentielle (logique à implémenter)
  const commissionPotentielle = calculateCommission(act.contratType, act.primeAnnuelle || 0, act.montantVersement || 0);

  const actData = {
    ...act,
    dateSaisie: Timestamp.fromDate(dateSaisie),
    moisKey,
    commissionPotentielle,
  };

  const docRef = await addDoc(collection(db, "acts"), actData);

  return {
    id: docRef.id,
    ...actData,
    dateEffet: act.dateEffet,
  };
};

export const getActsByMonth = async (userId: string, monthKey: string): Promise<Act[]> => {
  if (!db) return [];
  
  const q = query(
    collection(db, "acts"),
    where("userId", "==", userId),
    where("moisKey", "==", monthKey)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Act[];
};

export const calculateCommission = (
  contratType: string,
  primeAnnuelle: number,
  montantVersement: number
): number => {
  const rules: Record<string, number> = {
    AUTO_MOTO: 10,
    IRD_PART: 20,
    PJ: 30,
    GAV: 40,
    NOP_50_EUR: 10,
    SANTE_PREV: 50,
    VIE_PP: 50,
  };

  // IRD_PRO: 20 € + 10 €/tranche de 1000 € > 999 €
  if (contratType === "IRD_PRO") {
    return 20 + Math.floor((primeAnnuelle - 1000) / 1000) * 10;
  }

  // VIE_PU: 1% du montant versé
  if (contratType === "VIE_PU") {
    return montantVersement * 0.01;
  }

  return rules[contratType] || 0;
};

export const getActsByUser = async (userId: string) => {
  if (!db) return [];
  
  const q = query(collection(db, "acts"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

