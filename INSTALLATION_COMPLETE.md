# 🚀 FormBuilder Pro - Installation Complète

## 📁 Architecture Tri-Stack

FormBuilder Pro est maintenant organisé en 3 dossiers principaux :

```
FormBuilder Pro/
├── 📁 backend/     # Node.js + Express + PostgreSQL
├── 📁 frontend/    # React + Blazor Server
└── 📁 ia/         # Python + Streamlit + IA Claude
```

## ⚙️ Installations Requises

### 1. Node.js 20.x
```bash
# Windows/Linux/Mac
https://nodejs.org/download/release/v20.19.3/
```

### 2. .NET 8.0 SDK
```bash
# Windows/Linux/Mac
https://dotnet.microsoft.com/en-us/download/dotnet/8.0
```

### 3. Python 3.11+
```bash
# Windows/Linux/Mac
https://www.python.org/downloads/release/python-3118/
```

### 4. Git (si pas installé)
```bash
# Windows
https://git-scm.com/download/win

# Linux
sudo apt install git

# Mac
https://git-scm.com/download/mac
```

## 🔧 Configuration Environnement

### Variables d'environnement (.env dans backend/)
```bash
DATABASE_URL=postgresql://neondb_owner:password@ep-host.neon.tech/database?sslmode=require
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
NODE_ENV=development
PORT=5000
SESSION_SECRET=your-session-secret-key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=FormBuilder Pro <your-email@gmail.com>
```

## 🎯 Démarrage Multi-Stack

### Option 1: Stack Complet (3 terminaux)

**Terminal 1 - Backend + React:**
```bash
npm run dev
# Accès: http://localhost:5000
```

**Terminal 2 - Blazor (optionnel):**
```bash
cd frontend/blazor
dotnet watch run --urls="https://localhost:7000"
# Accès: https://localhost:7000
```

**Terminal 3 - Assistant IA (optionnel):**
```bash
cd ia
source formbuilder_ai_env/bin/activate  # Linux/Mac
# ou
formbuilder_ai_env\Scripts\activate     # Windows

streamlit run streamlit/ai_assistant.py --server.port=8501
# Accès: http://localhost:8501
```

### Option 2: Stack Principal Uniquement
```bash
npm run dev
# Interface complète sur: http://localhost:5000
```

## 🏗️ Architecture Technique

### Backend (Node.js + Express)
- **Port:** 5000
- **Stack:** TypeScript + Express + Drizzle ORM
- **Base de données:** PostgreSQL (Neon)
- **Auth:** Express Sessions + bcrypt
- **IA:** Anthropic Claude API

### Frontend React  
- **Framework:** React 18 + TypeScript
- **UI:** shadcn/ui + Tailwind CSS
- **Drag & Drop:** @dnd-kit
- **Forms:** React Hook Form + Zod
- **State:** TanStack Query

### Frontend Blazor
- **Framework:** .NET 8 Blazor Server
- **UI:** MudBlazor
- **ORM:** Entity Framework Core
- **Auth:** ASP.NET Core Identity

### IA Assistant
- **Framework:** Python Streamlit
- **IA:** Anthropic Claude API
- **Fonctions:** Parsing DFM, Génération JSON
- **Modèles:** 100+ modèles MFact C#

## ✅ Vérification Installation

### Backend Running
```bash
✓ Express server: http://localhost:5000
✓ API endpoints: /api/auth, /api/forms, /api/notifications
✓ Database: PostgreSQL connecté
✓ IA: Claude API configuré
```

### Frontend Running
```bash
✓ React: Interface drag & drop
✓ Authentification: Login/Register
✓ Forms: Créer/Éditer/Gérer
✓ 18+ types de propriétés
```

### IA Assistant Running  
```bash
✓ Streamlit: http://localhost:8501
✓ Claude API: Réponses intelligentes
✓ Parsing DFM: Fichiers Delphi → JSON
✓ Modèles MFact: 100+ structures disponibles
```

## 🔍 Diagnostic Erreurs

### Erreur Port 5000 occupé
```bash
# Changer de port
export PORT=5001
npm run dev
```

### Erreur Database
```bash
# Vérifier connection
cd backend
npm run db:push
```

### Erreur IA Claude API
```bash
# Vérifier clé API
echo $ANTHROPIC_API_KEY
```

### Erreur Blazor
```bash
# Restaurer packages
cd frontend/blazor
dotnet restore
dotnet ef database update
```

## 📚 Documentation Complète

- **Architecture:** `ARCHITECTURE_GUIDE.md`
- **Configuration:** `COMPREHENSIVE_SETUP_GUIDE.md`  
- **Déploiement:** `DEPLOYMENT_GUIDE.md`
- **Dépannage:** `TROUBLESHOOTING.md`
- **API:** `API_DOCUMENTATION.md`

## 🎉 Succès !

Si tous les services démarrent sans erreur, votre FormBuilder Pro tri-stack est opérationnel avec :
- Interface principale React
- Alternative Blazor Server  
- Assistant IA intelligent
- Base de données PostgreSQL
- Authentification complète
- 18+ types de propriétés de formulaires

**Accès principal:** http://localhost:5000