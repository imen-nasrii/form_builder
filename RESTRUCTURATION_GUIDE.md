# 🏗️ Restructuration FormBuilder Pro - Guide

## 📁 Nouvelle Architecture Tri-Dossiers

Votre application a été restructurée en 3 grands dossiers pour une meilleure organisation :

```
FormBuilder Pro/
├── backend/           # Serveur et API
├── frontend/          # Interfaces utilisateur  
└── ia/               # Intelligence artificielle
```

## 🔧 Dossier Backend

```
backend/
├── server/            # Express.js + Node.js
│   ├── index.ts       # Point d'entrée
│   ├── routes.ts      # Routes API
│   ├── auth.ts        # Authentification
│   ├── anthropic.ts   # IA Claude
│   └── db.ts          # PostgreSQL
├── shared/            # Schémas partagés
│   └── schema.ts      # Drizzle schemas
├── config/            # Configurations
│   ├── vite.config.ts # Config Vite
│   └── drizzle.config.ts # Config DB
├── package.json       # Dépendances backend
└── tsconfig.json      # TypeScript config
```

**Commandes backend :**
```bash
cd backend
npm install
npm run dev          # Démarrage port 5000
npm run db:push      # Migration DB
```

## 🎨 Dossier Frontend

```
frontend/
├── react/             # Interface React principale
│   ├── client/        # App React + Vite
│   ├── components.json # shadcn/ui config
│   └── tailwind.config.ts # Tailwind CSS
└── blazor/            # Interface .NET alternative
    ├── Components/    # Composants Blazor
    ├── Pages/         # Pages Blazor
    ├── Models/        # Modèles EF Core
    └── Program.cs     # Configuration .NET
```

**Commandes frontend :**
```bash
# React (via backend)
cd backend && npm run dev

# Blazor
cd frontend/blazor
dotnet watch run --urls="https://localhost:7000"
```

## 🤖 Dossier IA

```
ia/
├── streamlit/         # Interface Streamlit
│   └── ai_assistant.py # Assistant "Alex"
├── models/            # Modèles MFact
│   └── MfactModels/   # 100+ modèles C#
├── formbuilder_ai_env/ # Environnement Python
└── pyproject.toml     # Configuration Python
```

**Commandes IA :**
```bash
cd ia
source formbuilder_ai_env/bin/activate  # Linux/Mac
# ou
formbuilder_ai_env\Scripts\activate     # Windows

streamlit run streamlit/ai_assistant.py --server.port=8501
```

## 🚀 Démarrage Multi-Stack

### Méthode 1: Séparée (3 terminaux)
```bash
# Terminal 1 - Backend + React
cd backend && npm run dev

# Terminal 2 - Blazor 
cd frontend/blazor && dotnet watch run --urls="https://localhost:7000"

# Terminal 3 - IA
cd ia && streamlit run streamlit/ai_assistant.py --server.port=8501
```

### Méthode 2: Stack unique
```bash
# React + Express uniquement
cd backend && npm run dev
# Accès: http://localhost:5000
```

## 🔗 Ports et Accès

- **React + Express:** http://localhost:5000
- **Blazor Server:** https://localhost:7000
- **Assistant IA:** http://localhost:8501

## 📋 Variables d'Environnement

Créer `.env` dans le dossier `backend/` :
```bash
DATABASE_URL=postgresql://neondb_owner:password@host.neon.tech/db?sslmode=require
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
NODE_ENV=development
PORT=5000
SESSION_SECRET=your-secret-key
```

## ✅ Avantages de la Restructuration

**Organisation claire :**
- Séparation des responsabilités
- Configuration indépendante par stack
- Déploiement modulaire possible

**Développement efficace :**
- Équipes spécialisées par dossier
- Build et test indépendants
- Maintenance simplifiée

**Scalabilité :**
- Microservices ready
- Déploiement séparé possible
- Technologies indépendantes

Votre application conserve toutes ses fonctionnalités mais avec une architecture plus propre et professionnelle !