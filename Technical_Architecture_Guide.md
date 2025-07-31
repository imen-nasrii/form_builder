# FormBuilder Pro - Guide Technique d'Architecture

## Vue d'ensemble technique

FormBuilder Pro est une application web enterprise qui combine intelligemment plusieurs stacks technologiques pour créer une plateforme de création de formulaires avancée avec intelligence artificielle intégrée.

## Architecture des Services

### 1. Frontend React + Vite.js (Port 5000)

```typescript
// Structure des composants principaux
src/
├── pages/
│   ├── form-builder-fixed.tsx     // Interface principale drag & drop
│   ├── ai-assistant.tsx           // Interface chat IA intégrée
│   └── dashboard.tsx              // Tableau de bord utilisateur
├── components/
│   ├── form-builder/              // Composants de construction
│   ├── ui/                        // Composants UI (shadcn/ui)
│   └── enterprise-form-components.tsx // Composants métier
└── lib/
    ├── mfact-models-parser.ts     // Parser des modèles MFact C#
    └── form-types.tsx             // Types TypeScript partagés
```

**Technologies utilisées :**
- React 18 avec TypeScript pour la type safety
- Vite.js pour le bundling et HMR ultra-rapide
- TanStack Query pour la gestion d'état serveur
- Wouter pour le routing côté client
- Tailwind CSS + shadcn/ui pour l'interface

### 2. Backend Node.js + Express (Port 5000 - API routes)

```typescript
// Structure du backend
server/
├── index.ts                 // Point d'entrée Express
├── routes.ts                // Routes API REST
├── db.ts                    // Configuration Drizzle + PostgreSQL
└── storage.ts               // Interface de données
```

**API Endpoints principaux :**
```typescript
// Authentification
GET  /api/auth/user          // Récupération utilisateur courant
POST /api/auth/login         // Connexion utilisateur
POST /api/auth/logout        // Déconnexion

// Gestion des formulaires
GET    /api/forms            // Liste des formulaires
GET    /api/forms/:id        // Détail d'un formulaire
POST   /api/forms            // Création nouveau formulaire
PATCH  /api/forms/:id        // Mise à jour formulaire
DELETE /api/forms/:id        // Suppression formulaire

// Intelligence artificielle
POST /api/ai/chat            // Chat avec assistant IA
POST /api/ai/analyze-dfm     // Analyse fichiers DFM
POST /api/ai/generate-form   // Génération automatique formulaire
```

### 3. Python IA Assistant + Streamlit (Port 8501)

```python
# Structure de l'assistant IA
ai_assistant.py              # Interface Streamlit principale
run_ai_assistant.py         # Script de lancement
MfactModels/                # Modèles C# parsés (178 classes)
├── AATRR.cs               # Modèle Accounting Attributes
├── BUYTYP.cs              # Modèle Buy Type
├── PRIMNT.cs              # Modèle Prime Interest
└── ... (175 autres modèles)
```

**Fonctionnalités IA :**
- Analyse intelligente de fichiers DFM (Delphi Form Files)
- Génération automatique de JSON forms
- Chat interactif avec context awareness
- Parsing des modèles C# MFact pour suggestions

### 4. Base de données PostgreSQL

```sql
-- Schéma principal (via Drizzle ORM)
CREATE TABLE users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    role VARCHAR DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE forms (
    id SERIAL PRIMARY KEY,
    menu_id VARCHAR NOT NULL,
    label VARCHAR NOT NULL,
    form_width VARCHAR DEFAULT '700px',
    layout VARCHAR DEFAULT 'PROCESS',
    fields JSONB NOT NULL DEFAULT '[]',
    user_id VARCHAR REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id),
    title VARCHAR NOT NULL,
    message TEXT,
    type VARCHAR DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Communication Inter-Services

### 1. Frontend ↔ API Backend

```typescript
// Utilisation de TanStack Query pour la communication
import { useQuery, useMutation } from '@tanstack/react-query';

// Récupération des formulaires
const { data: forms } = useQuery({
  queryKey: ['/api/forms'],
  // La queryFn par défaut utilise fetch() configuré
});

// Sauvegarde d'un formulaire
const saveFormMutation = useMutation({
  mutationFn: (formData) => apiRequest('/api/forms', {
    method: 'POST',
    body: JSON.stringify(formData)
  }),
  onSuccess: () => {
    queryClient.invalidateQueries(['/api/forms']);
  }
});
```

### 2. Backend ↔ PostgreSQL

```typescript
// Utilisation de Drizzle ORM pour les requêtes typées
import { db } from './db';
import { forms, users } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Récupération avec relations
const formWithUser = await db
  .select()
  .from(forms)
  .leftJoin(users, eq(forms.userId, users.id))
  .where(eq(forms.id, formId));
```

### 3. Frontend ↔ Python IA

```typescript
// Communication via API bridge
const analyzeWithAI = async (dfmContent: string) => {
  const response = await fetch('/api/ai/analyze-dfm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dfmContent })
  });
  return response.json();
};
```

```python
# Assistant IA Streamlit
import streamlit as st
import openai
from pathlib import Path

def analyze_dfm_file(dfm_content):
    """Analyse un fichier DFM et génère un JSON form"""
    
    # Parse DFM components
    components = parse_delphi_components(dfm_content)
    
    # Use OpenAI for intelligent analysis
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert in Delphi DFM files..."},
            {"role": "user", "content": f"Analyze this DFM: {dfm_content}"}
        ]
    )
    
    return generate_json_form(response.choices[0].message.content)
```

## Intégration Blazor/.NET Core

### Approche Hybride

FormBuilder Pro utilise une approche hybride pour intégrer Blazor :

```csharp
// Modèles C# partagés (MfactModels/)
public class BUYTYP
{
    public string Id { get; set; }
    public string BuyTypeCode { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
}

// Services .NET Core pour logique métier complexe
[ApiController]
[Route("api/[controller]")]
public class MfactController : ControllerBase
{
    [HttpGet("models")]
    public IActionResult GetAvailableModels()
    {
        var models = MfactModelParser.GetAllModels();
        return Ok(models);
    }
}
```

### MudBlazor Integration

```razor
@* Composants MudBlazor pour interfaces complexes *@
<MudDataGrid T="FormModel" 
             Items="@forms"
             Filterable="true"
             Sortable="true">
    <Columns>
        <PropertyColumn Property="x => x.MenuId" Title="ID" />
        <PropertyColumn Property="x => x.Label" Title="Label" />
        <PropertyColumn Property="x => x.CreatedAt" Title="Created" />
    </Columns>
</MudDataGrid>
```

## Workflow de Développement

### 1. Démarrage simultané des services

```bash
# Terminal 1: Frontend + Backend Node.js
npm run dev

# Terminal 2: Assistant IA Python
python run_ai_assistant.py

# Terminal 3: Migrations base de données
npm run db:push
```

### 2. Hot Reload et Synchronisation

```typescript
// Vite.js configuration pour HMR
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',  // API Node.js
      '/ai': 'http://localhost:8501'    // Streamlit IA
    }
  }
});
```

### 3. Gestion des types partagés

```typescript
// shared/schema.ts - Types partagés
export const formSchema = pgTable('forms', {
  id: serial('id').primaryKey(),
  menuId: varchar('menu_id').notNull(),
  label: varchar('label').notNull(),
  fields: jsonb('fields').notNull().default('[]'),
  userId: varchar('user_id').references(() => users.id)
});

export type Form = typeof formSchema.$inferSelect;
export type InsertForm = typeof formSchema.$inferInsert;
```

## Déploiement et Production

### Configuration Replit

```yaml
# .replit configuration
run = "npm run dev"

[deployment]
build = ["npm", "run", "build"]
run = ["npm", "start"]

[env]
NODE_ENV = "production"
DATABASE_URL = "${POSTGRES_URL}"
PYTHON_PATH = "/opt/virtualenvs/python3/bin/python"
```

### Variables d'environnement

```bash
# Production environment
DATABASE_URL=postgresql://...          # PostgreSQL connection
ANTHROPIC_API_KEY=sk-...              # IA Assistant
EMAIL_SERVICE=smtp                     # Email notifications
SESSION_SECRET=...                     # Session security
PYTHON_VENV_PATH=/opt/virtualenvs/     # Python environment
```

## Monitoring et Performance

### Logs centralisés

```typescript
// Express middleware pour logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.path}`);
  next();
});
```

### Métriques de performance

```python
# Streamlit performance monitoring
import time
import streamlit as st

@st.cache_data
def analyze_dfm_cached(dfm_content):
    start_time = time.time()
    result = analyze_dfm_file(dfm_content)
    execution_time = time.time() - start_time
    st.sidebar.metric("Analysis Time", f"{execution_time:.2f}s")
    return result
```

## Sécurité Multi-Couches

### Authentification et autorisation

```typescript
// Middleware de sécurité Express
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
```

Cette architecture multi-technologique permet à FormBuilder Pro d'offrir une expérience utilisateur moderne tout en maintenant la robustesse et la sécurité nécessaires pour un environnement enterprise.