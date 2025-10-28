# Visualisation de l'activité des commerciaux - Page Admin

## Objectif
Permettre aux administrateurs de visualiser l'activité des commerciaux sur la page d'accueil admin.

## Contexte actuel
- Page d'accueil admin : Bonjour + Date + Météo Marseille
- Dashboard commercial : Gestion des actes AN par commercial
- Données disponibles : Collection `acts` dans Firestore

## Données disponibles dans Firestore

### Collection `acts`
Chaque acte contient :
```typescript
{
  id: string;
  userId: string;              // Commercial qui a créé l'acte
  kind: "AN" | "M+3" | "PRETERME_AUTO" | "PRETERME_IRD";
  clientNom: string;
  numeroContrat: string;
  contratType: string;
  compagnie: string;
  dateEffet: Date;
  dateSaisie: Date;
  primeAnnuelle?: number;
  montantVersement?: number;
  commissionPotentielle: number;
  commissionReelle?: number;
  moisKey: string;             // "2024-11" pour novembre 2024
  note?: string;
}
```

### Collection `users`
```typescript
{
  id: string;
  email: string;
  role: "ADMINISTRATEUR" | "CDC_COMMERCIAL";
  active: boolean;
  createdAt: Date;
}
```

## Questions à explorer

### 1. Quelles informations afficher ?
- [ ] Nombre d'actes créés aujourd'hui
- [ ] Nombre d'actes créés ce mois
- [ ] Répartition par type d'acte (AN, M+3, etc.)
- [ ] Commercial le plus actif
- [ ] Graphique d'activité mensuelle
- [ ] Montant de CA total
- [ ] Taux de commission
- [ ] Liste des derniers actes créés

### 2. Par qui filtrer ?
- [ ] Tous les commerciaux
- [ ] Commercial spécifique
- [ ] Par équipe/service

### 3. Quelle période ?
- [ ] Aujourd'hui
- [ ] Ce mois
- [ ] Ce trimestre
- [ ] Derniers 6 mois
- [ ] Personnalisable

### 4. Format de visualisation
- [ ] KPI Cards (comme dashboard commercial)
- [ ] Tableau de données
- [ ] Graphiques (bar, line, pie)
- [ ] Timeline/activité en temps réel
- [ ] Liste des actes avec détails

## Idées de sections

### Section 1 : Vue d'ensemble
**KPIs globaux**
- Total actes aujourd'hui
- Total actes ce mois
- Total CA ce mois
- Nombre de commerciaux actifs
- Commercial du mois (celui avec le plus d'actes)

### Section 2 : Top commerciaux
**Classement des commerciaux**
- Top 3 commerciaux du mois
- Nombre d'actes chacun
- CA généré
- Commission moyenne

### Section 3 : Répartition des actes
**Par type d'acte**
- AN : X actes
- M+3 : X actes
- Préterme Auto : X actes
- Préterme IRD : X actes

### Section 4 : Activité récente
**Derniers actes créés**
- Liste des 5-10 derniers actes
- Nom du client
- Type d'acte
- Commercial
- Date de création

### Section 5 : Graphiques
**Visualisations**
- Graphique évolution mensuelle (ligne)
- Répartition par type (camembert)
- Top commerciaux (barres)

## Questions ouvertes

1. **Niveau de détail** : 
   - Vue globale seulement ?
   - Possibilité de cliquer pour voir les détails ?
   - Pagination ou lazy loading ?

2. **Temps réel** :
   - Update automatique toutes les X secondes ?
   - Refresh manuel seulement ?

3. **Performance** :
   - Combien de commerciaux au total ?
   - Estimation du nombre d'actes à charger ?
   - Caching nécessaire ?

4. **Export** :
   - Export PDF/Excel des données ?
   - Rapport hebdomadaire/mensuel automatique ?

## Suggestion de structure initiale

```
┌─────────────────────────────────────────────────────────┐
│ Bonjour ! | Date | Météo                                │
└─────────────────────────────────────────────────────────┘

┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│ Actes     │ │ CA Mensuel│ │ Actifs    │ │ Top 1     │
│ Aujourd'hui│ │           │ │ Commerciaux│ │Commercial │
│   15      │ │  45 200€   │ │    8      │ │  Dupont   │
└───────────┘ └───────────┘ └───────────┘ └───────────┘

┌──────────────────────────────┐ ┌──────────────────┐
│ Répartition par type         │ │ Top commerciaux   │
│ [Graphique camembert]        │ │ [Graphique barres]│
└──────────────────────────────┘ └──────────────────┘

┌──────────────────────────────────────────────────────┐
│ Derniers actes créés                                 │
│ [Liste des 10 derniers actes avec détails]          │
└──────────────────────────────────────────────────────┘
```

## Tâches à prioriser

1. **Phase 1 - MVP** (priorité haute)
   - [ ] KPI Cards (4-5 KPIs principaux)
   - [ ] Liste des derniers actes

2. **Phase 2 - Analytics** (priorité moyenne)
   - [ ] Graphiques d'évolution
   - [ ] Top commerciaux
   - [ ] Répartition par type

3. **Phase 3 - Advanced** (priorité basse)
   - [ ] Filtres avancés
   - [ ] Export de données
   - [ ] Notifications temps réel

## Prochaines étapes

1. Valider la structure avec l'utilisateur
2. Définir les KPIs exacts à afficher
3. Créer les composants nécessaires
4. Implémenter les appels Firestore
5. Ajouter les graphiques si besoin

---

## Notes
- Date de création : 26 novembre 2024
- Projet : SaaS Allianz
- Page : `/admin` (accueil)

