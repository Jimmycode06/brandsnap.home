# BaoraHome - Home Staging Virtuel par IA

Une application Next.js 14 qui génère des visuels marketing et des slogans à partir de vos logos en utilisant l'IA Gemini 2.5 Flash Image.

## ✨ Fonctionnalités

- **Upload d'images** : Supportez PNG, JPG, JPEG jusqu'à 10MB
- **Styles visuels** : Minimal Instagram, Premium poster, Tech startup, E-commerce, Cyberpunk, etc.
- **Tons de slogan** : Accrocheur, Amical, Premium, Tech
- **Couleurs de marque** : Personnalisez avec vos codes hex
- **Variantes multiples** : Générez 1 à 4 versions différentes
- **Export ZIP** : Téléchargez tous vos assets en un clic
- **Interface responsive** : Dashboard moderne avec sidebar et design adaptatif
- **Mode sombre** : Interface élégante avec support du thème sombre

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <your-repo-url>
   cd baorahome
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**
   ```bash
   cp env.example .env.local
   ```
   
   Modifier `.env.local` avec vos valeurs :
   ```
   GEMINI_API_KEY=votre_clé_gemini_ici
   GEMINI_MODEL=gemini-2.5-flash-image-preview
   ```

4. **Lancer en développement**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans votre navigateur**
   Aller sur [http://localhost:3000](http://localhost:3000)

## 🛠️ Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build pour la production
- `npm run start` - Lance le serveur de production
- `npm run lint` - Vérifie la qualité du code

## 📁 Structure du projet

```
BaoraHome/
├── app/                      # Pages Next.js 14 (App Router)
│   ├── layout.tsx           # Layout principal avec métadonnées
│   ├── page.tsx             # Page d'accueil avec dashboard
│   └── api/                 # Routes API
│       ├── generate-assets/ # Génération d'assets IA
│       └── download-zip/    # Téléchargement ZIP
├── components/              # Composants React
│   ├── ui/                  # Composants shadcn/ui
│   ├── dashboard-shell.tsx  # Layout dashboard
│   └── marketing-generator.tsx # Composant principal
├── lib/                     # Utilitaires
├── styles/                  # Styles globaux Tailwind
└── README.md
```

## 🎨 Stack technique

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript strict
- **Styles** : Tailwind CSS + shadcn/ui
- **Icons** : Lucide React
- **IA** : Gemini 2.5 Flash Image API
- **Utilitaires** : Sharp (fallback), JSZip, Zod
- **Deployment** : Optimisé pour Vercel

## 🔑 Obtenir une clé API Gemini

1. Aller sur [Google AI Studio](https://aistudio.google.com/)
2. Créer un nouveau projet ou utiliser un existant
3. Générer une clé API
4. Ajouter la clé dans votre fichier `.env.local`

## 🚀 Déploiement sur Vercel

1. **Pousser votre code sur GitHub**

2. **Connecter à Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Importer votre repository GitHub
   - Configurer les variables d'environnement :
     - `GEMINI_API_KEY`
     - `GEMINI_MODEL`

3. **Déployer**
   Vercel va automatiquement builder et déployer votre app.

## 🎯 Utilisation

1. **Upload** : Sélectionnez votre logo ou capture d'écran
2. **Configurer** : Choisissez le style visuel, ton de slogan, couleurs de marque
3. **Générer** : Cliquez sur "Générer mes visuels" 
4. **Télécharger** : Récupérez vos assets en ZIP

## 🔧 Développement

### Composants principaux

- `DashboardShell` : Layout avec sidebar responsive
- `MarketingGenerator` : Interface de génération avec upload, options et résultats
- Composants UI shadcn/ui : Button, Card, Input, Select, Slider, etc.

### APIs

- `POST /api/generate-assets` : Génère les visuels et slogans
- `POST /api/download-zip` : Crée un ZIP des assets générés

### Types TypeScript

Le projet utilise TypeScript strict avec typage complet des props, états et APIs.

## 🐛 Résolution de problèmes

### Erreur "API Key manquante"
Vérifiez que `GEMINI_API_KEY` est bien définie dans `.env.local`

### Images ne se chargent pas
Vérifiez les permissions CORS et la configuration Next.js `images`

### Build échoue
Lancez `npm run lint` pour identifier les erreurs TypeScript/ESLint

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**BaoraHome** - Home Staging Virtuel pour Agences Immobilières ⚡
