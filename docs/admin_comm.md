# Visualisation de l'activité des commerciaux - Page Admin

## ✅ Décision prise

**Affichage identique au dashboard commercial, avec filtrage par commercial.**

## Structure

### 1. Page d'accueil (`/admin`)
- Message de bienvenue (Bonjour ! + Date + Météo)
- Même affichage que le dashboard commercial mais en mode "cumulé" par défaut

### 2. Affichage
- **KPIs** : Calculés sur tous les commerciaux ou un commercial sélectionné
- **Timeline** : Vue mensuelle calendrier (même système que commercial)
- **Tableau** : Liste des actes (même format que commercial)
- **Navigation mensuelle** : Flèches gauche/droite pour naviguer entre les mois

### 3. Filtres
**Sous la navigation mensuelle :**
- **Par défaut** : "Tous" → Affichage cumulé de tous les commerciaux
- **Select déroulant** : Choix d'un commercial spécifique
- Les KPIs, timeline et tableau s'adaptent au filtre sélectionné

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

## Décisions validées

### 1. Informations à afficher
✅ **Identique au dashboard commercial** :
- KPI Cards (CA Mensuel, CA Auto, CA Autres, Nb contrats, etc.)
- Timeline calendrier avec actes
- Tableau récapitulatif des actes avec actions (modifier, supprimer, voir note)

### 2. Filtrage
✅ **Deux modes** :
- **"Tous"** (par défaut) → Cumule les données de tous les commerciaux
- **Select commercial** → Filtre les données pour un commercial spécifique

### 3. Période
✅ **Même navigation mensuelle** :
- Flèches gauche/droite pour naviguer entre les mois
- Mois sélectionné affiché au centre
- Calcul des KPIs pour le mois sélectionné

### 4. Format de visualisation
✅ **Structure identique au dashboard commercial** :
- KPI Cards (8 KPIs identiques)
- Timeline calendrier (7 jours avec actes)
- Tableau récapitulatif (liste avec actions)

## Structure de la page

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Header avec sidebar                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Message Bienvenue + Date + Météo - 3 colonnes]           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Navigation mensuelle : [<] Novembre 2024 [>]               │
│  Filtre : [Tous ▼] ou [Commercial ▼]                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ KPI 1  │ │ KPI 2  │ │ KPI 3  │ │ KPI 4  │ │ KPI 5  │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
│  ┌────────┐ ┌────────┐ ┌────────┐                          │
│  │ KPI 6  │ │ KPI 7  │ │ KPI 8  │                          │
│  └────────┘ └────────┘ └────────┘                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Timeline calendrier (7 jours avec actes)                  │
├─────────────────────────────────────────────────────────────┤
│  Tableau récapitulatif                                      │
│  [Liste des actes avec actions]                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Réutilisation du code
- **Composant `KPICard`** : Déjà existant, réutilisable
- **Timeline** : Fonction `generateTimeline()` à adapter
- **Tableau** : Même structure que dashboard commercial
- **Navigation mensuelle** : Même système (flèches + mois)

## Détails techniques

### Filtres
**Sous la navigation mensuelle :**
```jsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-4">
    {/* Navigation mensuelle existante */}
    <ChevronLeft onClick={previousMonth} />
    <span>{currentMonth}</span>
    <ChevronRight onClick={nextMonth} />
  </div>
  
  {/* Nouveau filtre commercial */}
  <div className="flex items-center gap-2">
    <Label>Voir :</Label>
    <Select value={selectedCommercial} onValueChange={setSelectedCommercial}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les commerciaux</SelectItem>
        {commerciaux.map(com => (
          <SelectItem key={com.id} value={com.id}>{com.email}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>
```

### Logique de calcul
**Pour "Tous"** :
```typescript
// Récupérer tous les actes du mois sélectionné
const allActs = await getActsByMonth(null, selectedMonth); // null = tous
const kpi = calculateKPI(allActs); // Calcul global
```

**Pour un commercial** :
```typescript
// Récupérer les actes du commercial sélectionné
const acts = await getActsByMonth(selectedCommercial, selectedMonth);
const kpi = calculateKPI(acts); // Calcul pour ce commercial
```

## Structure finale

```
┌──────────────────────────────────────────────────────────────┐
│ Bonjour ! | Date | Météo (3 colonnes égales)                │
└──────────────────────────────────────────────────────────────┘

[Navigation mensuelle : < Novembre 2024 >]  [Voir : Tous ▼]

┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ CA      │ │ CA Auto │ │ CA     │ │ Nb      │ │ Contrats│
│ Mensuel │ │         │ │ Autres │ │ Contrats│ │ Auto    │
│ 45 200€ │ │ 12 000€ │ │ 33 200€│ │   25    │ │   15    │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Contrats│ │ Ratio   │ │ Nb      │
│ Autres  │ │  150%   │ │ Process │
│   10    │ │         │ │    5    │
└─────────┘ └─────────┘ └─────────┘

[Timeline calendrier 7 jours avec actes]

[Tableau récapitulatif des actes]
```

## Tâches à implémenter

### Phase 1 - Structure de base ✅
- [x] Message de bienvenue + météo
- [x] Layout admin avec sidebar
- [ ] **Adapter la page admin pour afficher KPIs + Timeline + Tableau**

### Phase 2 - Fonctionnalités Core 🔄
- [ ] Créer composant `admin/activity-overview.tsx`
- [ ] Ajouter navigation mensuelle (réutiliser système commercial)
- [ ] Ajouter filtre "Tous" / Select commercial
- [ ] Adapter fonction `getActsByMonth` pour gérer userId ou "all"
- [ ] Calculer KPIs en mode "Tous" (tous les commerciaux)
- [ ] Calculer KPIs en mode "Commercial" (filtre par userId)

### Phase 3 - Timeline et tableau ✅
- [ ] Adapter `generateTimeline` pour filtrer par commercial
- [ ] Tableau avec actions (même comportement que commercial)
- [ ] Gérer permissions : admin peut voir/modifier/supprimer tous les actes

### Phase 4 - Optimisations
- [ ] Performance : Chargement optimisé des actes
- [ ] Cache des données si nécessaire
- [ ] Gestion des erreurs

## Prochaines étapes

1. ✅ Décision validée : Même affichage que commercial + filtre
2. **Créer la page `/admin` avec KPIs + Timeline + Tableau**
3. **Ajouter navigation mensuelle + filtre commercial**
4. **Implémenter logique de cumul "Tous" vs filtre commercial**
5. **Tester et valider**

---

## Notes
- Date de création : 26 novembre 2024
- Projet : SaaS Allianz
- Page : `/admin` (accueil)

