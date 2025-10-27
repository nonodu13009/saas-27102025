# Dashboard Commercial CDC - Fonctionnalités

Ce document décrit toutes les fonctionnalités implémentées pour le dashboard commercial destiné aux utilisateurs CDC (Centre de Développement Commercial).

## 📋 Vue d'ensemble

Le dashboard commercial permet aux CDC de suivre leurs performances commerciales à travers des KPIs, de gérer leurs actes commerciaux et de visualiser leur timeline d'activité.

**URL :** `/dashboard`

**Accès :** Tous les utilisateurs ayant le rôle `CDC_COMMERCIAL` ou `ADMINISTRATEUR`

## 🔐 Système d'authentification

### Protection des routes
- Le dashboard est protégé par le composant `RouteGuard`
- Seuls les utilisateurs authentifiés et actifs peuvent y accéder
- Redirection automatique vers `/login` si non authentifié

### Gestion de session
- Bouton de déconnexion disponible dans le header
- Authentification via Firebase Authentication
- Récupération des données utilisateur depuis Firestore

## 📊 Tableaux de bord (KPIs)

Le dashboard affiche 10 KPI cards permettant de suivre les performances commerciales :

### 1. CA Mensuel
**Type :** Monétaire  
**Icône :** DollarSign  
**Calcul :** Somme de toutes les primes annuelles et montants versés  
**Format :** Currency (€)

### 2. CA Auto / Moto
**Type :** Monétaire  
**Icône :** Car  
**Calcul :** Somme des primes annuelles pour les contrats AUTO_MOTO et PRETERME_AUTO  
**Format :** Currency (€)

### 3. CA Autres
**Type :** Monétaire  
**Icône :** Building2  
**Calcul :** Somme des primes annuelles et montants versés pour tous les autres types de contrats  
**Format :** Currency (€)

### 4. Nombre de contrats
**Type :** Entier  
**Icône :** Receipt  
**Calcul :** Nombre total d'actes  
**Format :** Entier

### 5. Contrats Auto / Moto
**Type :** Entier  
**Icône :** Car  
**Calcul :** Nombre de contrats AUTO_MOTO et PRETERME_AUTO  
**Format :** Entier

### 6. Contrats Autres
**Type :** Entier  
**Icône :** Building2  
**Calcul :** Nombre de contrats autres que AUTO_MOTO et PRETERME_AUTO  
**Format :** Entier

### 7. Ratio
**Type :** Pourcentage  
**Icône :** Scale  
**Calcul :** (nbContratsAutres / nbContratsAuto) × 100  
**Sous-titre :** "Objectif ≥ 100%"  
**Trend :** 
- ✅ UP si ratio ≥ 100%
- ❌ DOWN si ratio < 100%

### 8. Nombre de process
**Type :** Entier  
**Icône :** FileText  
**Calcul :** Nombre d'actes de type M+3, PRETERME_AUTO ou PRETERME_IRD  
**Sous-titre :** "M+3, Pré-terme auto, Pré-terme IRD"

### 9. Commissions potentielles
**Type :** Monétaire  
**Icône :** Award  
**Calcul :** Somme de toutes les commissions potentielles  
**Sous-titre :** 
- "Validées" si commissionValidee = true
- "En attente" si commissionValidee = false  
**Trend :** 
- ✅ UP si validées
- ⚪ NEUTRAL si en attente

### 10. Commissions réelles
**Type :** Monétaire  
**Icône :** Award  
**Calcul :** 
- Si validation OK : commissions potentielles
- Sinon : 0  
**Sous-titre :** 
- "Actives" si validées
- "Non validées" sinon  
**Trend :** 
- ✅ UP si actives
- ⚪ NEUTRAL si non validées

### Critères de validation des commissions
Les commissions sont validées si **TOUS** ces critères sont remplis :
1. **Commissions potentielles ≥ 200 €**
2. **Nombre de process ≥ 15**
3. **Ratio ≥ 100%**

Si tous les critères sont remplis : `commissionValidee = true`  
Sinon : `commissionValidee = false`

## 📅 Sélecteur de mois

**Fonctionnalité :**  
- Affichage des données pour un mois spécifique
- Sélection parmi les 7 derniers mois (mois actuel + 6 mois précédents)
- Format : "Janvier 2025", "Février 2025", etc.
- Mise à jour automatique des KPIs et actes lors du changement de mois

**Affichage :**  
- Select dropdown avec liste déroulante
- Format localisé en français

## 📝 Gestion des actes commerciaux

### Création d'un nouvel acte

**Bouton :** "Nouvel acte" (icône +)  
**Modal :** `NewActDialog`

#### Types d'actes disponibles
1. **AN** - Apport Nouveau
2. **M+3** - Renouvellement
3. **PRETERME_AUTO** - Préterme Auto
4. **PRETERME_IRD** - Préterme IRD

#### Types de contrats disponibles
1. **AUTO_MOTO** - Auto / Moto
2. **IRD_PART** - IRD Particulier
3. **IRD_PRO** - IRD Professionnel
4. **PJ** - Protection Juridique
5. **GAV** - GAV (Garantie Accident Vie)
6. **NOP_50_EUR** - NO Promise 50€
7. **SANTE_PREV** - Santé / Prévoyance
8. **VIE_PP** - Vie en Préparation
9. **VIE_PU** - Vie en Publication

#### Compagnies disponibles
1. **ALLIANZ** - Allianz
2. **AUTRE** - Autre compagnie

#### Champs du formulaire
- **Type d'acte*** (obligatoire)
- **Nom du client*** (obligatoire, texte libre)
- **Numéro de contrat*** (obligatoire, texte libre)
- **Type de contrat*** (obligatoire)
- **Compagnie*** (obligatoire)
- **Date d'effet*** (obligatoire, sélecteur de date)
- **Prime annuelle** (optionnel, conditionnel au type de contrat)
- **Montant versé** (optionnel, uniquement pour VIE_PU)

#### Règles de gestion
- La **Prime annuelle** s'affiche pour : AUTO_MOTO, IRD_PART, IRD_PRO, PJ, GAV, NOP_50_EUR, SANTE_PREV, VIE_PP
- Le **Montant versé** s'affiche uniquement pour : VIE_PU
- Validation côté client avant soumission
- Sauvegarde automatique dans Firestore
- Attribution automatique à l'utilisateur connecté
- Message de succès et fermeture automatique de la modal

### Liste des actes

**Section :** "Actes commerciaux"  
**Affichage :** Liste des actes du mois sélectionné

**Informations affichées :**
- Nom du client (gras)
- Type de contrat - Compagnie (texte secondaire)
- Commission potentielle (montant en gras, aligné à droite)
- Date d'effet (format DD/MM/YYYY)

**États :**
- **Chargement :** Message "Chargement..."
- **Vide :** Message "Aucun acte pour ce mois"
- **Données :** Liste des actes avec design de card

## 📆 Timeline

**Section :** "Timeline"  
**Objectif :** Visualisation des actes sur le mois sélectionné

**Fonctionnalités :**
- Affichage de tous les jours du mois
- Distinction visuelle des jours :
  - **Samedi :** Fond orange clair (bg-orange-100 / dark:bg-orange-900/20)
  - **Dimanche :** Fond rouge clair (bg-red-100 / dark:bg-red-900/20)
  - **Jours ouvrés :** Fond muted
- Affichage du jour de la semaine (3 premières lettres)
- Affichage du numéro du jour
- Compteur d'actes par jour (format : "X acte(s)")

**Scroll horizontal :** Disponible sur mobile pour visualiser tous les jours du mois

## 🎨 Interface utilisateur

### Header
- **Logo Allianz** (SVG)
- **Titre :** "Dashboard Commercial"
- **Actions :**
  - Switch thème (Dark/Light)
  - Bouton "Déconnexion"

### Layout
- **Container centré** avec padding responsive
- **Grid responsive** pour les KPI cards :
  - Mobile : 1 colonne
  - Tablette : 2 colonnes
  - Desktop : 5 colonnes

### Thème
- Support du mode sombre/clair
- Utilisation des tokens de couleur du système
- Cohérence visuelle avec le reste de l'application

## 🔄 État actuel

### Données
- **Mockée :** Les données sont actuellement mockées
- **Prête :** La structure est en place pour charger depuis Firestore

### Intégration Firestore
- Fonction `createAct` disponible dans `lib/firebase/acts.ts`
- Structure Firestore prête à recevoir les actes
- Attribution automatique à l'utilisateur (`userId`)

## 📈 Prochaines étapes

1. **Intégration Firestore** : Remplacer les données mockées par de vraies données
2. **Chargement des actes** : Récupérer les actes de l'utilisateur connecté
3. **Filtrage par mois** : Implémenter le filtre par moisKey
4. **Édition/Suppression** : Ajouter les actions de modification et suppression d'actes
5. **Export** : Ajouter la possibilité d'exporter les données
6. **Graphiques** : Ajouter des graphiques d'évolution temporelle

## 🛠️ Technologies utilisées

- **Framework :** Next.js 16 (App Router)
- **UI :** React 19, TypeScript
- **Styling :** Tailwind CSS v4
- **Composants :** Radix UI
- **Formulaires :** React Hook Form + Zod
- **Dates :** date-fns
- **Notifications :** Sonner (toast)
- **Firebase :** Authentication + Firestore
- **Icônes :** Lucide React

## 📚 Fichiers clés

- `app/dashboard/page.tsx` - Page principale du dashboard
- `components/acts/new-act-dialog.tsx` - Modal de création d'acte
- `components/dashboard/kpi-card.tsx` - Composant de KPI card
- `lib/utils/kpi.ts` - Calculs des KPIs
- `lib/firebase/acts.ts` - Gestion des actes Firestore
- `types/index.ts` - Types TypeScript

## ✅ Checklist de validation

- [x] Authentification et protection des routes
- [x] Affichage des KPIs
- [x] Calcul des indicateurs clés
- [x] Sélecteur de mois
- [x] Création d'actes commerciaux
- [x] Timeline du mois
- [x] Liste des actes
- [x] Bouton de déconnexion
- [ ] Intégration Firestore (en cours)
- [ ] Filtrage des données par mois
- [ ] Édition/Suppression d'actes
