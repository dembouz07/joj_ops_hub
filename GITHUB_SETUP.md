# Guide — Pousser le Code sur GitHub

## 🚀 Étapes pour Synchroniser votre Projet

### **Prérequis**
- Un compte GitHub (gratuit sur https://github.com)
- Git installé sur votre machine (`git --version`)
- Accès SSH configuré (recommandé) ou HTTPS

---

## **OPTION 1 — Utiliser SSH (Recommandé)**

### 1️⃣ Configurer votre clé SSH

```bash
# Générer une clé SSH
ssh-keygen -t ed25519 -C "votre@email.com"

# Appuyez sur Entrée 3 fois (accepte les valeurs par défaut)
# Affiche la clé publique
cat ~/.ssh/id_ed25519.pub
```

### 2️⃣ Ajouter la clé SSH à GitHub

1. Allez à : https://github.com/settings/keys
2. Cliquez "New SSH key"
3. Collez votre clé publique (entière)
4. Cliquez "Add SSH key"

### 3️⃣ Configurer Git Localement

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
```

### 4️⃣ Initialiser le Repo et Pousser

```bash
cd /path/to/joj-ops-hub

# Si git n'est pas initialisé
git init

# Ajouter le remote GitHub
git remote add origin git@github.com:VotreUsername/joj-ops-hub.git

# Ajouter tous les fichiers
git add .

# Créer un commit initial
git commit -m "Initial commit: JOJ OPS HUB avec carousel et génération de rapports"

# Pousser vers GitHub
git branch -M main
git push -u origin main
```

---

## **OPTION 2 — Utiliser HTTPS (Plus Simple)**

### 1️⃣ Créer un Personal Access Token (PAT)

1. Allez à : https://github.com/settings/tokens
2. Cliquez "Generate new token (classic)"
3. Sélectionnez les scopes :
   - `repo` (accès complet aux repos)
   - `workflow` (actions GitHub)
4. Cliquez "Generate token"
5. **Copier le token** (vous ne le verrez plus après)

### 2️⃣ Configurer Git

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
```

### 3️⃣ Pousser avec HTTPS

```bash
cd /path/to/joj-ops-hub

git init
git remote add origin https://github.com/VotreUsername/joj-ops-hub.git

git add .
git commit -m "Initial commit: JOJ OPS HUB avec carousel et génération de rapports"

git branch -M main
git push -u origin main

# À la demande : collez votre token comme mot de passe
```

---

## **OPTION 3 — Via Interface GitHub Web (Le Plus Simple)**

### 1️⃣ Créer un Repo Vide

1. Allez à https://github.com/new
2. Entrez le nom : `joj-ops-hub`
3. Optionnel : "Public" ou "Private"
4. Cliquez "Create repository"

### 2️⃣ Initialiser Localement

```bash
cd /path/to/joj-ops-hub

git init
git add .
git commit -m "Initial commit"
```

### 3️⃣ Connecter et Pousser

GitHub affiche des instructions. Exécutez :

```bash
# SSH
git remote add origin git@github.com:VotreUsername/joj-ops-hub.git

# ou HTTPS
git remote add origin https://github.com/VotreUsername/joj-ops-hub.git

git branch -M main
git push -u origin main
```

---

## **Vérifier que Tout a Fonctionné**

```bash
# Voir l'historique
git log --oneline

# Voir le remote
git remote -v

# Vérifier le status
git status
```

Allez sur https://github.com/VotreUsername/joj-ops-hub — le code doit être visible !

---

## **Commandes Git Utiles par la Suite**

### **Ajouter des Changements**
```bash
git add .                              # Ajouter tous les fichiers
git commit -m "Décrire les changements"
git push                               # Pousser vers GitHub
```

### **Créer une Branche**
```bash
git checkout -b feature/nouvelle-fonction
# Faire des changements
git add .
git commit -m "Nouvelle fonction"
git push -u origin feature/nouvelle-fonction
```

### **Synchroniser avec la Branche Principale**
```bash
git pull origin main   # Récupérer les derniers changements
git push               # Pousser vos changements
```

### **Voir les Changements**
```bash
git diff               # Avant de commit
git log --oneline      # Historique
git status             # État actuel
```

---

## **Fichiers à Ignorer (.gitignore)**

Le fichier `.gitignore` exclut automatiquement :
- `node_modules/` (dépendances)
- `dist/` (build)
- `.env` (secrets)
- Fichiers de système (`.DS_Store`, Thumbs.db)

Vérifiez que votre `.gitignore` contient :

```
node_modules/
dist/
.env
.env.local
.DS_Store
Thumbs.db
*.log
```

---

## **GitHub Actions (Optionnel)**

Pour auto-builder et déployer à chaque push :

### Créer `.github/workflows/deploy.yml`

```yaml
name: Build & Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy to Vercel
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## **Troubleshooting**

### ❌ "Permission denied (publickey)"
→ Votre clé SSH n'est pas configurée. Suivez l'OPTION 1 étape 2.

### ❌ "fatal: 'origin' does not appear to be a git repository"
→ Exécutez `git remote add origin ...` avec votre URL GitHub.

### ❌ "fatal: could not read Username"
→ Utilisez un token GitHub (OPTION 2) au lieu d'un mot de passe.

### ❌ Token expiré
→ Générez un nouveau token sur https://github.com/settings/tokens

---

## **Résumé Rapide (30 secondes)**

```bash
# 1. Configurer Git
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"

# 2. Initialiser et ajouter les fichiers
git init
git add .
git commit -m "Initial commit"

# 3. Connecter à GitHub (remplacez par votre URL)
git remote add origin git@github.com:VotreUsername/joj-ops-hub.git

# 4. Pousser
git branch -M main
git push -u origin main
```

Voilà ! Votre code est maintenant sur GitHub !

---

## **Ressources Utiles**

- GitHub Help : https://docs.github.com/en/github
- Git Cheat Sheet : https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf
- SSH Setup : https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Personal Access Tokens : https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

---

**Besoin d'aide ?** Contactez security@joj2026.sn
