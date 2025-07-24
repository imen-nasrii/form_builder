# FormBuilder Pro - FAQ Technique

## 🏗 Architecture du Projet

### Q: Quelle est l'architecture générale ?
**R:** 
- **Frontend :** React 18 + TypeScript + Tailwind CSS
- **Backend :** Node.js + Express + Drizzle ORM
- **Base de données :** PostgreSQL (production) / MySQL (développement)
- **IA :** Python + Streamlit + OpenAI/Anthropic
- **Build :** Vite pour le frontend, esbuild pour le serveur

### Q: Structure des dossiers ?
**R:** 
```
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Types partagés
├── MfactModels/     # Modèles MFact
├── ai_assistant.py  # Assistant IA Python
└── replit.md        # Documentation projet
```

## 💾 Base de Données

### Q: Comment gérer les migrations ?
**R:** 
- Utilisez `npm run db:push` pour pousser les changements de schéma
- Jamais d'édition manuelle SQL, tout via Drizzle ORM
- Schémas définis dans `shared/schema.ts`

### Q: Tables principales ?
**R:** 
- `users` - Comptes utilisateurs avec rôles
- `sessions` - Stockage des sessions
- `forms` - Définitions des programmes
- `formTemplates` - Templates réutilisables
- `notifications` - Système de notifications

### Q: Comment basculer entre PostgreSQL et MySQL ?
**R:** 
- Configuration automatique via `DATABASE_URL`
- PostgreSQL pour production (Neon)
- MySQL pour développement local (XAMPP)

## 🔐 Authentification

### Q: Système d'authentification utilisé ?
**R:** 
- Sessions basées sur cookies sécurisées
- Hachage bcrypt pour les mots de passe
- Stockage des sessions en base PostgreSQL
- Pas de vérification email (accès immédiat)

### Q: Comment ajouter un nouveau rôle ?
**R:** 
```typescript
// Dans shared/schema.ts
export const users = pgTable("users", {
  role: varchar("role").default("user"), // 'admin' | 'user' | 'nouveau_role'
});

// Mise à jour du middleware d'autorisation
const isAdmin = user && (user as any).role === 'admin';
```

## 🎨 Frontend

### Q: Comment ajouter un nouveau composant de formulaire ?
**R:** 
1. Définir dans `client/src/components/enterprise-form-components.tsx`
2. Ajouter à la palette de composants
3. Implémenter le rendu dans `renderFormComponent`
4. Configurer les propriétés spécifiques

### Q: Comment personnaliser le thème ?
**R:** 
- Modifiez les variables CSS dans `client/src/index.css`
- Format HSL requis : `--background: 210 11% 98%;`
- Support mode sombre avec classes `.dark`

### Q: Gestion d'état ?
**R:** 
- **Server State :** TanStack Query (React Query)
- **Local State :** useState/useReducer
- **Forms :** React Hook Form + Zod validation

## 🤖 Assistant IA

### Q: Comment l'IA Alex fonctionne ?
**R:** 
- Script Python avec Streamlit (`ai_assistant.py`)
- Intégration OpenAI pour génération intelligente
- Parseur DFM pour fichiers Delphi
- Mapping des composants vers JSON

### Q: Comment ajouter un nouveau type de programme ?
**R:** 
```python
# Dans ai_assistant.py
PROGRAM_TEMPLATES = {
    "NOUVEAU_TYPE": {
        "description": "Description du nouveau type",
        "template": {
            "menuId": "NOUVEAU_TYPE",
            "fields": [...]
        }
    }
}
```

### Q: Où modifier les prompts IA ?
**R:** 
- Système prompt principal dans `ai_assistant.py`
- Templates de programmes dans `training_examples.json`
- Contexte business dans le code Python

## 🎯 Système de Tâches Kanban

### Q: Comment fonctionne le drag & drop ?
**R:** 
- Librairie `@dnd-kit` pour les interactions
- Contextes DndContext pour gérer les zones de drop
- Sensors pour souris et tactile
- Mise à jour automatique en base

### Q: Ajouter une nouvelle colonne Kanban ?
**R:** 
```typescript
// Nouvelle colonne
const TASK_STATUSES = {
  // existants...
  'nouvelle_colonne': { 
    name: 'Nouvelle Colonne', 
    color: 'bg-purple-100' 
  }
};

// Mise à jour du schéma DB
status: varchar("status").default("todo") // ajouter 'nouvelle_colonne'
```

## 📊 Import/Export

### Q: Format JSON supporté ?
**R:** 
```json
{
  "formMetadata": {
    "menuId": "FORM_ID",
    "label": "Nom du formulaire",
    "formWidth": "700px",
    "layout": "PROCESS"
  },
  "fields": [...],
  "customComponents": [...]
}
```

### Q: Comment valider un JSON importé ?
**R:** 
- Validation Zod dans le frontend
- Vérification de structure côté serveur
- Auto-correction pour formats legacy
- Messages d'erreur détaillés

## 🔧 Développement

### Q: Comment démarrer en développement ?
**R:** 
```bash
npm install
npm run dev  # Lance frontend + backend
```

### Q: Variables d'environnement requises ?
**R:** 
```env
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-...
OPENAI_API_KEY=sk-...
EMAIL_USER=...
EMAIL_PASS=...
SESSION_SECRET=...
```

### Q: Comment déboguer ?
**R:** 
- Logs côté serveur dans la console Express
- DevTools React pour le frontend
- Network tab pour les requêtes API
- PostgreSQL logs pour la base

## 🚀 Déploiement

### Q: Configuration de production ?
**R:** 
- Build Vite pour le frontend
- esbuild pour bundler le serveur
- PostgreSQL Neon pour la base
- Variables d'environnement via Replit Secrets

### Q: Comment optimiser les performances ?
**R:** 
- Lazy loading des composants lourds
- Mise en cache TanStack Query
- Compression des assets Vite
- Optimisation des requêtes DB

## 🛠 Maintenance

### Q: Comment ajouter une nouvelle page ?
**R:** 
1. Créer dans `client/src/pages/`
2. Ajouter la route dans `client/src/App.tsx`
3. Mettre à jour la navigation si nécessaire
4. Ajouter les permissions si page protégée

### Q: Monitoring des erreurs ?
**R:** 
- Logs Express pour les erreurs serveur
- Console.error pour le frontend
- TanStack Query pour les erreurs API
- Validation Zod pour les erreurs de données

### Q: Comment mettre à jour une dépendance ?
**R:** 
```bash
# Vérifier les versions
npm outdated

# Mettre à jour (une à la fois)
npm install package@latest

# Tester l'application
npm run dev
```

## 📚 Ressources

### Q: Documentation des librairies principales ?
**R:** 
- [TanStack Query](https://tanstack.com/query/latest)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@dnd-kit](https://dndkit.com/)

### Q: Patterns de code recommandés ?
**R:** 
- Types partagés dans `shared/`
- Composants réutilisables
- Hooks personnalisés pour la logique
- Validation Zod partout
- Error boundaries pour React

---

**Dernière mise à jour :** 24 Juillet 2025
**Équipe :** Développement FormBuilder Pro