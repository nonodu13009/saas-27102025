# 📚 Documentation du Projet Allianz SaaS

Bienvenue dans la documentation du projet Allianz SaaS. Ce document répertorie tous les guides et documentations disponibles.

## 📖 Table des matières

### 🏗️ [Architecture de l'application](./ARCHITECTURE.md)
**Description :** Vue d'ensemble de l'architecture technique du projet  
**Contenu :**
- Structure du projet
- Authentification
- Données Firestore
- Sécurité
- Déploiement

**Audience :** Développeurs, chefs de projet

---

### 🔐 [Gestion des Rôles Utilisateur](./ROLES.md)
**Description :** Documentation complète du système RBAC (Role-Based Access Control)  
**Contenu :**
- Rôles disponibles (ADMINISTRATEUR, CDC_COMMERCIAL)
- Architecture d'implémentation
- Protection des routes
- Utilisation pratique
- Règles de sécurité
- Guide d'ajout d'un nouveau rôle

**Audience :** Développeurs

---

### 📊 [Dashboard Commercial CDC](./DASHBOARD_COMMERCIAL.md)
**Description :** Documentation exhaustive du dashboard commercial  
**Contenu :**
- 10 KPIs détaillés avec calculs
- Critères de validation des commissions
- Gestion des actes commerciaux
- Types d'actes et contrats disponibles
- Timeline du mois
- Interface utilisateur
- État actuel et prochaines étapes

**Audience :** Développeurs, CDC commerciaux, administrateurs

---

### 👥 [Configuration Manuelle des Utilisateurs](./MANUAL_USER_SETUP.md)
**Description :** Guide pour créer manuellement les documents utilisateurs dans Firestore  
**Contenu :**
- Récupération des UID Firebase Auth
- Création des documents Firestore
- Structure des données utilisateur
- Liste des utilisateurs avec leurs rôles

**Audience :** Administrateurs

---

### 🔄 [Synchronisation des Utilisateurs](./USER_SYNC.md)
**Description :** Guide pour utiliser le script de synchronisation automatique  
**Contenu :**
- Prérequis
- Installation de Firebase Admin SDK
- Utilisation du script
- Configuration des rôles
- Résultat et vérification
- Dépannage

**Audience :** Développeurs, administrateurs

---

## 🚀 Démarrage rapide

### Nouveau développeur ?

1. Lisez [Architecture.md](./ARCHITECTURE.md) pour comprendre la structure
2. Consultez [ROLES.md](./ROLES.md) pour comprendre le système d'authentification
3. Voyez [DASHBOARD_COMMERCIAL.md](./DASHBOARD_COMMERCIAL.md) pour les fonctionnalités

### Configuration utilisateurs ?

1. Pour un setup manuel : [MANUAL_USER_SETUP.md](./MANUAL_USER_SETUP.md)
2. Pour un setup automatique : [USER_SYNC.md](./USER_SYNC.md)

### Comprendre le dashboard ?

Consultez [DASHBOARD_COMMERCIAL.md](./DASHBOARD_COMMERCIAL.md) pour tous les détails

## 📋 Résumé des fonctionnalités

### ✅ Implémenté

- [x] Authentification Firebase
- [x] Système RBAC (2 rôles)
- [x] Dashboard commercial avec 10 KPIs
- [x] Création d'actes commerciaux
- [x] Timeline du mois
- [x] Protection des routes
- [x] Interface responsive
- [x] Thème sombre/clair

### 🚧 En cours

- [ ] Intégration Firestore complète
- [ ] Chargement des actes depuis Firestore
- [ ] Filtrage par mois

### 📅 À venir

- [ ] Édition/Suppression d'actes
- [ ] Export des données
- [ ] Graphiques d'évolution
- [ ] Tableau de bord administrateur complet

## 🛠️ Technologies

- **Framework :** Next.js 16 (App Router)
- **UI :** React 19, TypeScript, Tailwind CSS v4
- **Composants :** Radix UI, shadcn/ui
- **Backend :** Firebase (Authentication + Firestore)
- **Formulaires :** React Hook Form + Zod
- **Dates :** date-fns
- **Notifications :** Sonner

## 📞 Contact

Pour toute question sur la documentation ou le projet, consultez les fichiers individuels mentionnés ci-dessus.

## 📝 Notes

- Tous les documents sont en français
- Les exemples de code sont en TypeScript
- Les chemins de fichiers sont relatifs à la racine du projet
