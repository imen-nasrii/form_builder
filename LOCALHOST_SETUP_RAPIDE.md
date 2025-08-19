# FormBuilder Pro - Configuration Localhost Rapide

## Description Générale de l'Application

FormBuilder Pro est un **constructeur de formulaires visuel avancé** avec double architecture (React/Express.js + .NET Blazor) permettant de créer des formulaires sophistiqués par glisser-déposer avec assistant IA intégré.

### Fonctionnalités Principales
- **Interface Drag & Drop** : Création de formulaires visuels
- **Assistant IA "Alex"** : Génération intelligente avec Claude API
- **Éditeur Avancé** : 50+ propriétés par composant
- **Gestion Utilisateurs** : Contrôle d'accès basé sur les rôles
- **Export Multi-Framework** : React, Vue, Blazor
- **Base de Données** : PostgreSQL avec validation temps réel

---

## Configuration Localhost - Étape par Étape

### Option A : Stack React/Express.js (Recommandé pour développement rapide)

#### Étape 1 : Prérequis
```bash
# Vérifier Node.js (18+)
node --version

# Installer PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Linux: sudo apt install postgresql postgresql-contrib
```

#### Étape 2 : Cloner et Installer
```bash
# Cloner le projet
git clone https://github.com/imen-nasrii/formbuilder-pro.git
cd formbuilder-pro

# Installer les dépendances
npm install
```

#### Étape 3 : Configuration Base de Données
```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE formbuilder_pro;
CREATE USER formbuilder_user WITH ENCRYPTED PASSWORD 'motdepasse123';
GRANT ALL PRIVILEGES ON DATABASE formbuilder_pro TO formbuilder_user;
\q
```

#### Étape 4 : Variables d'Environnement
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos configurations
DATABASE_URL=postgresql://formbuilder_user:motdepasse123@localhost:5432/formbuilder_pro
ANTHROPIC_API_KEY=votre_cle_anthropic_ici
```

#### Étape 5 : Démarrage
```bash
# Démarrer l'application
npm run dev

# Accéder à l'application
# http://localhost:5000
```

### Option B : Stack .NET Blazor (Recommandé pour entreprise)

#### Étape 1 : Prérequis
```bash
# Installer .NET 8.0 SDK
# Windows: https://dotnet.microsoft.com/download
# macOS/Linux: instructions sur le site Microsoft

# Vérifier l'installation
dotnet --version
```

#### Étape 2 : Configuration Projet
```bash
# Cloner le projet (si pas déjà fait)
git clone https://github.com/imen-nasrii/formbuilder-pro.git
cd formbuilder-pro

# Restaurer les packages .NET
dotnet restore
```

#### Étape 3 : Configuration appsettings.Development.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=formbuilder_pro;Username=formbuilder_user;Password=motdepasse123"
  },
  "ApiKeys": {
    "AnthropicApiKey": "votre_cle_anthropic_ici"
  }
}
```

#### Étape 4 : Migration Base de Données
```bash
# Installer EF Core CLI
dotnet tool install --global dotnet-ef

# Créer et appliquer les migrations
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### Étape 5 : Démarrage
```bash
# Démarrer avec hot reload
dotnet watch run

# Accéder à l'application
# https://localhost:7000 ou http://localhost:5000
```

---

## Obtenir la Clé API Anthropic (Requis)

1. **Aller sur** : https://console.anthropic.com/
2. **Créer un compte** ou se connecter
3. **Naviguer vers** : API Keys
4. **Créer une nouvelle clé** : Commençant par `sk-ant-`
5. **Copier la clé** dans votre fichier `.env` ou `appsettings.json`

---

## Test Rapide de Fonctionnement

### Vérification React/Express.js
```bash
# L'application doit répondre
curl http://localhost:5000/api/health

# Connexion à la base de données
npm run db:verify
```

### Vérification .NET Blazor
```bash
# L'application doit répondre
curl https://localhost:7000/health

# Vérifier les migrations
dotnet ef migrations list
```

---

## Première Utilisation

1. **Accéder à l'application** : `http://localhost:5000` (React) ou `https://localhost:7000` (Blazor)
2. **Créer un compte** : S'inscrire comme nouvel utilisateur
3. **Créer un formulaire** : Cliquer sur "New Form"
4. **Glisser-déposer** : Ajouter des composants depuis la palette
5. **Éditer propriétés** : Double-cliquer sur un composant pour l'éditer
6. **Tester l'IA** : Utiliser l'assistant "Alex" pour générer des formulaires

---

## Résolution Rapide des Problèmes

### Problème de Base de Données
```bash
# Vérifier le statut PostgreSQL
sudo systemctl status postgresql

# Redémarrer PostgreSQL
sudo systemctl restart postgresql
```

### Problème de Port Occupé
```bash
# Trouver le processus utilisant le port 5000
sudo lsof -i :5000

# Tuer le processus
sudo kill -9 [PID]
```

### Problème de Dépendances
```bash
# React : Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# .NET : Nettoyer et restaurer
dotnet clean
dotnet restore
```

---

## Commandes Utiles

### React/Express.js
```bash
npm run dev          # Démarrage développement
npm run build        # Build production
npm run db:migrate   # Migrations base de données
npm test             # Tests
```

### .NET Blazor
```bash
dotnet watch run     # Démarrage avec hot reload
dotnet build         # Build du projet
dotnet test          # Tests
dotnet ef database update  # Mise à jour base de données
```

---

## Support et Documentation Complète

- **Guide Complet** : [COMPREHENSIVE_SETUP_GUIDE.md](./COMPREHENSIVE_SETUP_GUIDE.md)
- **API Documentation** : [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Dépannage** : [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Architecture** : [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md)

---

**Temps de setup estimé** : 15-30 minutes  
**Configuration optimale** : React/Express.js pour développement rapide, .NET Blazor pour production entreprise