# Guide Vite.js dans FormBuilder Pro

## 🚀 Qu'est-ce que Vite.js ?

**Vite.js** est un outil de build moderne et rapide pour le développement web, utilisé dans votre FormBuilder pour :

- **Développement ultra-rapide** avec Hot Module Replacement (HMR)
- **Build optimisé** pour la production
- **Serveur de développement** intégré
- **Support TypeScript/React** natif

## 🔧 Architecture Vite dans FormBuilder

### Configuration Actuelle
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    proxy: {
      '/api': 'http://localhost:5000'  // Proxy API vers Express
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### Structure du Projet avec Vite
```
FormBuilder/
├── client/              # Frontend React + Vite
│   ├── src/
│   │   ├── pages/       # Pages React
│   │   ├── components/  # Composants UI
│   │   └── App.tsx      # Application principale
│   └── index.html       # Point d'entrée Vite
├── server/              # Backend Express
│   ├── index.ts         # Serveur Express
│   ├── routes.ts        # APIs REST
│   └── anthropic.ts     # Service IA
├── vite.config.ts       # Configuration Vite
└── package.json         # Scripts NPM
```

## 📊 Workflow Vite + Express

### Développement (npm run dev)
```
1. Vite démarre serveur développement (port 5000)
2. Express API s'exécute en parallèle (même port)
3. Vite proxy /api/* vers Express backend
4. Hot reload automatique lors des changements
5. TypeScript compilation temps réel
```

### Production (npm run build)
```
1. Vite compile React → HTML/CSS/JS statiques
2. Express sert les fichiers statiques
3. APIs /api/* continuent de fonctionner
4. Application optimisée et minifiée
```

## 🎯 Services Intégrés avec Vite

### Serveur de Développement Vite
- **Port 5000** : Interface FormBuilder React
- **Hot Reload** : Changements instantanés
- **TypeScript** : Compilation automatique
- **CSS/Tailwind** : Processing optimisé

### Express Backend (via Vite)
- **APIs /api/*** : Routes Express servies
- **Authentification** : Sessions utilisateur
- **Base de données** : PostgreSQL
- **IA Claude** : 6 routes AI actives

### Python Streamlit (Séparé)
- **Port 8501** : Interface IA développement
- **Upload DFM** : Traitement fichiers
- **Chat IA** : Interface alternative Alex

## 🚀 Commandes Vite FormBuilder

### Développement
```bash
# Démarre Vite + Express
npm run dev

# Accès application:
# http://localhost:5000
```

### Build Production
```bash
# Compile pour production
npm run build

# Preview build local
npm run preview
```

### Debug Vite
```bash
# Mode verbose
npm run dev --debug

# Vérifier configuration
npx vite --help
```

## 🔧 Configuration Avancée Vite

### Hot Module Replacement (HMR)
```typescript
// Configuration automatique pour React
if (import.meta.hot) {
  import.meta.hot.accept()
}

// Logs HMR dans la console
console.log('[vite] connecting...')
console.log('[vite] connected.')
```

### Proxy API Configuration
```typescript
// vite.config.ts - Proxy vers Express
server: {
  proxy: {
    '/api/ai': 'http://localhost:5000',      // Routes IA
    '/api/forms': 'http://localhost:5000',   // CRUD programmes
    '/api/auth': 'http://localhost:5000'     // Authentification
  }
}
```

### Variables d'Environnement
```bash
# Frontend (préfixe VITE_)
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=FormBuilder Pro

# Backend (process.env)
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://...
```

## 🎯 Avantages Vite pour FormBuilder

### Performance Développement
- **Démarrage rapide** : ~100ms vs 10s+ webpack
- **HMR instantané** : Changements en <50ms
- **Build natif** : ESBuild ultra-rapide

### Developer Experience
- **TypeScript intégré** : Pas de configuration
- **React Fast Refresh** : État préservé lors des changements
- **Error overlay** : Erreurs visuelles dans le navigateur

### Production Optimisée
- **Tree shaking** : Code mort supprimé
- **Code splitting** : Chargement par chunks
- **Compression** : Gzip/Brotli automatique

## 🚀 Intégration Multi-Services

### Architecture Complète
```
Vite Development Server (port 5000)
├── React Frontend (FormBuilder UI)
├── Express Backend (APIs + Auth)
└── Proxy vers services externes

Python Streamlit (port 8501)
├── IA Assistant Alex
├── Upload DFM processing
└── Claude API calls

APIs Externes
├── Anthropic Claude (IA)
├── OpenAI (alternative)
└── PostgreSQL (données)
```

### Communication Services
```typescript
// Frontend React → Express API
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({ message })
})

// Express → Python Streamlit (optionnel)
const pythonResponse = await fetch('http://localhost:8501/api/process')

// Express → Claude API
const aiResponse = await anthropic.messages.create({...})
```

## 💡 Utilisation Pratique

### Pour l'Interface FormBuilder
1. **Modifier components React** → Hot reload automatique
2. **Ajouter routes** → Vite proxy vers Express
3. **Styling Tailwind** → Processing temps réel
4. **TypeScript** → Vérification instantanée

### Pour l'API Backend
1. **Routes Express** servies via Vite proxy
2. **Base de données** PostgreSQL connectée
3. **IA Claude** intégrée dans /api/ai/*
4. **Authentification** sessions sécurisées

### Pour le Debug
1. **Console browser** : Logs Vite HMR
2. **Network tab** : Requêtes API proxifiées
3. **React DevTools** : Components inspection
4. **Vite error overlay** : Erreurs TypeScript/Build

Vite.js orchestre parfaitement votre stack moderne React + Express + IA, offrant une expérience de développement fluide et des performances optimales en production.