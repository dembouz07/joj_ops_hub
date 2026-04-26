# Guide de Dépannage — Génération de Rapports

## Corrections Appliquées

### 1. Edge Function Améliorée
- ✅ Gestion d'erreurs détaillée
- ✅ Logs de débogage console
- ✅ Vérification de la structure de réponse
- ✅ Support de sites vides

### 2. Frontend Amélioré
- ✅ Vérification des variables d'environnement
- ✅ Messages d'erreur plus clairs
- ✅ Logs de débogage
- ✅ Meilleure gestion des erreurs réseau

### 3. Configuration Supabase
- ✅ Secret `ANTHROPIC_API_KEY` configuré
- ✅ Edge Function déployée

---

## Tester la Génération

### Étape 1 : Vérifier la Configuration

```bash
# Vérifier que les variables .env existent
cat .env

# Devrait afficher :
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJxxxxxx...
```

### Étape 2 : Lancer l'Application

```bash
npm run dev
```

Allez à : http://localhost:5173

### Étape 3 : Tester la Génération

1. **Connexion**
   - Email : `moussa.diallo@joj2026.sn`
   - Mot de passe : `admin2026`

2. **Aller sur la Page Rapports**
   - Menu → Rapports

3. **Cliquer "Générer un rapport"**

4. **Remplir le Formulaire**
   ```
   Type : Incidents
   Titre : Rapport de Test - Semaine 1
   Période : 1er - 7 Mai 2026
   Incidents : 5
   Alertes : 3
   Sites : Sélectionner 2-3 sites
   ```

5. **Cliquer "Générer le Rapport"**
   - Attendre 3-5 secondes
   - Un rapport doit apparaître

---

## Dépannage

### ❌ "ANTHROPIC_API_KEY is not configured"

**Cause** : La clé API n'est pas dans les secrets Supabase

**Solution** :
1. Allez au Dashboard Supabase
2. Projet → Settings → Edge Functions → Secrets
3. Vérifiez que `ANTHROPIC_API_KEY` existe
4. Sinon, créez-le avec votre clé depuis https://console.anthropic.com

### ❌ "Variables Supabase non configurées"

**Cause** : `.env` incomplet ou mal formaté

**Solution** :
```bash
# Vérifier le .env
cat .env

# Doit contenir :
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Si absent, ajouter en relançant npm run dev
npm run dev
```

### ❌ Rapport vide ou "null"

**Cause** : Réponse API incorrecte

**Solution** :
1. Ouvrir DevTools (F12)
2. Onglet Network
3. Filtrer par "generate-report"
4. Vérifier la réponse
5. Partager le message d'erreur

### ❌ "Erreur 401 ou 403"

**Cause** : Token Supabase expiré ou invalide

**Solution** :
1. Vider localStorage
2. Déconnexion complète
3. Se reconnecter
4. Réessayer

### ❌ Timeout (pas de réponse après 30s)

**Cause** : API Anthropic lente ou indisponible

**Solution** :
1. Vérifier la clé API Anthropic : https://console.anthropic.com
2. Vérifier les quotas/limites de débit
3. Réessayer dans 1 minute

---

## Vérification Rapide de la Clé API

### Via curl (terminal)

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_KEY_HERE" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Bonjour"}]
  }'
```

Doit retourner un contenu de réponse (pas une erreur 401)

---

## Architecture du Flux

```
Frontend (React)
    ↓
    [Remplir formulaire]
    ↓
    POST /functions/v1/generate-report
    ↓
Edge Function (Deno)
    ↓
    [Récupère ANTHROPIC_API_KEY du secret]
    ↓
    POST https://api.anthropic.com/v1/messages
    ↓
Anthropic Claude API
    ↓
    [Génère le rapport en Markdown]
    ↓
Edge Function retourne le rapport
    ↓
Frontend affiche et permet téléchargement
```

---

## Logs de Débogage

### Vérifier les Logs Edge Function

```bash
# Via Supabase Dashboard
# Fonction → Logs → Filtrer par "generate-report"

# Affichera :
# - Erreurs d'authentification
# - Erreurs API Anthropic
# - Logs console() de la fonction
```

### Via DevTools (F12)

1. Console → Filtrer par "generate-report"
2. Network → Cliquer sur la requête POST
3. Onglet "Response" → Voir la réponse complète

---

## Succès — Qu'est-ce que Cela Ressemble

```
1. Modal avec le formulaire rempli
2. Bouton grisé : "Génération en cours..." (spinner)
3. Après 3-5s : Modal bascule en "Rapport Généré"
4. Affichage du rapport complet en Markdown
5. Boutons : "Télécharger" et "Générer un Autre"
```

---

## Demander de l'Aide

Si le problème persiste :

1. **Vérifiez** :
   - ANTHROPIC_API_KEY dans Supabase Secrets
   - .env contient VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
   - Edge Function déployée (vérifier Dashboard)

2. **Testez** :
   - curl vers l'API Anthropic (voir ci-dessus)
   - Ouvrir DevTools et vérifier les erreurs

3. **Contactez** :
   - Email : security@joj2026.sn
   - Incluez les logs de la console et de la réponse API

---

**Mise à jour** : 22 Avril 2026
**Status** : Testé et fonctionnel
