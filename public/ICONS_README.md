# Icônes PWA - Instructions

## Icônes Requises

Pour que la PWA fonctionne correctement, vous devez créer les icônes suivantes:

### 1. icon-192.png (192x192 pixels)
- Format: PNG
- Taille: 192x192 pixels
- Fond: Vert JOJ (#006B3C)
- Logo: Bouclier doré avec "JOJ 2026"

### 2. icon-512.png (512x512 pixels)
- Format: PNG
- Taille: 512x512 pixels
- Fond: Vert JOJ (#006B3C)
- Logo: Bouclier doré avec "JOJ 2026"

### 3. apple-touch-icon.png (180x180 pixels)
- Format: PNG
- Taille: 180x180 pixels
- Pour les appareils iOS

## Génération des Icônes

### Option 1: Utiliser un outil en ligne
1. Allez sur https://realfavicongenerator.net/
2. Uploadez le fichier `icon.svg`
3. Téléchargez le package d'icônes
4. Placez les fichiers dans le dossier `public/`

### Option 2: Utiliser ImageMagick (ligne de commande)
```bash
# Installer ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Convertir SVG en PNG
magick icon.svg -resize 192x192 icon-192.png
magick icon.svg -resize 512x512 icon-512.png
magick icon.svg -resize 180x180 apple-touch-icon.png
```

### Option 3: Utiliser un éditeur graphique
- Photoshop, GIMP, Figma, etc.
- Créez les icônes aux dimensions requises
- Exportez en PNG

## Couleurs JOJ

- **Vert principal:** #006B3C
- **Or/Doré:** #D4AF37
- **Blanc:** #FFFFFF
- **Rouge Sénégal:** #E31B23

## Vérification

Une fois les icônes créées, vérifiez:
1. Les fichiers sont bien dans `public/`
2. Les noms correspondent exactement
3. Les dimensions sont correctes
4. Le format est PNG (pas JPG)

## Test PWA

Pour tester la PWA:
1. Build l'application: `npm run build`
2. Servez en production: `npm run preview`
3. Ouvrez dans Chrome/Edge
4. Cliquez sur l'icône d'installation dans la barre d'adresse
