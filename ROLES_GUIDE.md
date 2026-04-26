# Guide des Rôles et Équipes - JOJ OPS HUB

## Rôles Disponibles

### 1. Chef d'équipe (admin)
**Email:** moussa.diallo@joj2026.sn  
**Mot de passe:** n'importe quel mot de passe  
**Équipe:** Aucune (accès global)

**Permissions:**
- ✅ **Créer des tâches** dans toutes les catégories (bouton "Nouvelle tâche" visible)
- ✅ Voir toutes les tâches de toutes les équipes
- ❌ Ne peut PAS assigner les tâches (réservé aux managers)
- ❌ Ne peut PAS créer d'incidents (réservé aux managers)
- ✅ Accès à toutes les pages de consultation
- ✅ Gestion des utilisateurs et sites

### 2. Manager Opérationnel
**Email:** abdoulaye.seck@joj2026.sn  
**Mot de passe:** n'importe quel mot de passe  
**Équipe:** Accréditations

**Permissions:**
- ❌ Ne peut PAS créer de tâches (bouton "Nouvelle tâche" masqué)
- ✅ **Assigner les tâches** de son équipe aux membres
- ✅ Voir uniquement les tâches de son équipe
- ✅ Créer des incidents
- ✅ Assigner des incidents aux agents
- ✅ Gérer les opérations de son équipe
- ✅ Voir le bouton "Nouvel incident"

## Équipes Disponibles

### 🛡️ Équipe Sécurité
**Membres:**
- Fatou Ndiaye (Chef de la sécurité)
- Ousmane Faye (Chef de la sécurité)
- Rokhaya Gueye (Opérateur)

**Tâches:** Inspections, contrôles, surveillance, rapports de sécurité

### 🚌 Équipe Transports
**Membres:**
- Ibrahima Sarr (Responsable transport)

**Tâches:** Coordination des déplacements, gestion des navettes, transport VIP

### 🎫 Équipe Accréditations
**Membres:**
- Abdoulaye Seck (Manager) ⭐
- Maryam Bâ (Opérateur)

**Tâches:** Gestion des badges, contrôle des accès, renouvellements

### 📅 Équipe Protocole
**Membres:**
- Aminata Touré (Officier de protocole)

**Tâches:** Événements officiels, cérémonies, réceptions diplomatiques

### 📸 Équipe Médias
**Membres:**
- Cheikh Mbaye (Responsable médias)

**Tâches:** Demandes presse, équipements audiovisuels, accréditations médias

## Comment se Connecter

1. Allez sur la page de connexion
2. Entrez l'email de l'utilisateur souhaité
3. Entrez n'importe quel mot de passe
4. Cliquez sur "Se connecter"

## Différences Clés

| Fonctionnalité | Chef d'équipe | Manager |
|----------------|---------------|---------|
| Voir toutes les tâches | ✅ | ❌ (uniquement son équipe) |
| Voir tous les utilisateurs | ✅ | ❌ (uniquement son équipe) |
| Voir toutes les pages opérations | ✅ | ❌ (uniquement sa page) |
| Sidebar complet | ✅ | ❌ (filtré) |
| **Créer des tâches** | ✅ | ❌ |
| **Assigner des tâches** | ❌ | ✅ (dans son équipe) |
| Créer des incidents | ❌ | ✅ |
| Assigner des incidents | ❌ | ✅ |
| Voir "Nouvelle tâche" | ✅ | ❌ |
| Voir "Nouvel incident" | ❌ | ✅ |
| Accès Métriques/Rapports | ✅ | ❌ |
| Accès Admin (Users/Sites) | ✅ | ❌ |

## Flux de Travail des Tâches

### 📝 Création de Tâche (Admin uniquement)

1. **L'admin crée une tâche**
   - Se connecte avec `moussa.diallo@joj2026.sn`
   - Va sur la page "Tâches"
   - Clique sur "Nouvelle tâche"
   - Remplit le formulaire:
     - Titre
     - Description
     - **Catégorie** (Sécurité, Transports, Accréditations, Protocole, Médias)
     - Priorité
     - Site
     - Heure prévue
   - Crée la tâche **sans l'assigner**

2. **La tâche est créée et visible**
   - Statut: "En attente"
   - Assigné à: "Non assigné"
   - Visible par l'admin et le manager de la catégorie concernée

### 👥 Assignation de Tâche (Manager uniquement)

1. **Le manager voit les tâches de son équipe**
   - Se connecte avec `abdoulaye.seck@joj2026.sn` (Manager Accréditations)
   - Va sur la page "Tâches"
   - Voit uniquement les tâches de catégorie "Accréditations"

2. **Le manager assigne une tâche**
   - Clique sur une tâche non assignée
   - Dans le modal, voit la section "Assigner cette tâche"
   - Liste des membres de son équipe s'affiche
   - Clique sur un membre pour assigner
   - La tâche est maintenant assignée ✅

### 🔄 Exemple Complet

**Scénario: Contrôle des accréditations**

1. **Admin crée la tâche** (Moussa Diallo)
   ```
   Titre: Contrôle accréditations
   Catégorie: Accréditations
   Priorité: Haute
   Assigné à: Non assigné
   ```

2. **Manager voit la tâche** (Abdoulaye Seck)
   - La tâche apparaît dans sa liste
   - Statut: "Non assigné"

3. **Manager assigne la tâche**
   - Ouvre le détail de la tâche
   - Voit les membres: Abdoulaye Seck, Maryam Bâ
   - Assigne à Maryam Bâ
   - Tâche maintenant assignée ✅

4. **Maryam Bâ exécute la tâche**
   - Reçoit la notification
   - Démarre la tâche
   - Complète la tâche

### Pour le Manager
Quand un manager se connecte:
1. **Sidebar filtré:** Il voit uniquement:
   - Pages générales: Dashboard, Incidents, Tâches
   - Sa page d'opération: Accréditations (pour l'équipe Accréditations)
   - Pas d'accès aux autres opérations (Sécurité, Transports, etc.)
   - Pas d'accès aux pages Métriques, Rapports, Utilisateurs, Sites

2. **Bandeau d'équipe** en haut de la page Tâches:
   - Le nom de son équipe
   - Le nombre de membres
   - La liste des membres de l'équipe

3. **Filtrage automatique:**
   - Ne voit que les **tâches de sa catégorie** (ex: Accréditations)
   - Ne voit que les **membres de son équipe** dans la page Utilisateurs
   - Dashboard affiche uniquement les tâches urgentes de son équipe

### Pour le Chef d'équipe (Admin)
- Sidebar complet avec toutes les pages
- Pas de bandeau d'équipe
- Voit toutes les tâches de toutes les catégories
- Voit tous les utilisateurs
- Peut créer des tâches dans n'importe quelle catégorie
- Accès à toutes les pages d'opérations, métriques, rapports, admin

## Exemple Pratique

### Connexion en tant que Manager Accréditations
```
Email: abdoulaye.seck@joj2026.sn
Mot de passe: (n'importe lequel)
```

**Ce que vous verrez:**
- **Sidebar:** Dashboard, Incidents, Tâches, Accréditations (4 items seulement)
- **Dashboard:** Tâches urgentes de l'équipe Accréditations uniquement
- **Tâches:** Bandeau "Équipe Accréditations" avec 2 membres + 1 tâche visible
- **Utilisateurs:** 2 membres (Abdoulaye Seck, Maryam Bâ)
- **Accréditations:** Page complète de gestion
- Bouton "Nouvel incident" visible
- Pas d'accès aux pages: Sécurité, Transports, Protocole, Médias, Métriques, Rapports, Sites

### Connexion en tant que Chef d'équipe
```
Email: moussa.diallo@joj2026.sn
Mot de passe: (n'importe lequel)
```

**Ce que vous verrez:**
- **Sidebar:** Toutes les pages (12 items de navigation)
- **Dashboard:** Toutes les tâches urgentes
- **Tâches:** Toutes les 12 tâches (Sécurité, Transports, Accréditations, Protocole, Médias)
- **Utilisateurs:** Tous les 9 utilisateurs avec leurs équipes
- Accès complet à toutes les pages d'opérations
- Bouton "Nouvel incident" masqué
- Possibilité de créer des tâches mais pas de les assigner

## Notes Importantes

- Le rôle "chef d'équipe" est l'équivalent de l'admin système
- Le rôle "manager" gère une équipe spécifique
- Chaque utilisateur peut appartenir à une seule équipe
- Les tâches sont automatiquement filtrées selon l'équipe du manager
- Les managers ne peuvent assigner des tâches qu'aux membres de leur équipe
