# Q&A : Stack Technologique et Logique Métier FormBuilder

## 🏗️ Architecture Générale

### Q: Quelle est l'architecture de la logique métier ?
**R:** FormBuilder utilise une architecture en couches bien séparées :

**Frontend (React + TypeScript)**
- Interface utilisateur drag & drop
- Validation côté client
- State management avec TanStack Query
- Logique d'interface uniquement

**Backend (Express + Node.js)**
- APIs REST pour CRUD operations
- Authentification et autorisation
- Validation serveur des données
- Logique métier centrale

**Base de données (PostgreSQL)**
- Persistance des données
- Contraintes d'intégrité
- Schéma relationnel optimisé

### Q: Où se trouve la logique métier principale ?
**R:** La logique métier est répartie stratégiquement :

```
server/
├── routes.ts           # Logique API et validation
├── storage.ts          # Logique d'accès aux données
├── anthropic.ts        # Logique IA et génération
└── notification.ts     # Logique notifications

shared/
├── schema.ts           # Validation Drizzle/Zod
└── mfact-models.ts     # Modèles métier MFact
```

## 🔧 Logique Métier par Composant

### Q: Comment fonctionne la logique des composants GRIDLKP ?
**R:** GRIDLKP implémente une logique sophistiquée :

**Côté Client (React)**
```typescript
// Logique d'affichage et interaction
const GridLookupComponent = ({ properties }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Logique de filtrage local
  const filteredData = useMemo(() => 
    data.filter(row => 
      row[properties.searchColumn]?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    ), [data, searchTerm]);
};
```

**Côté Serveur (Express)**
```typescript
// Logique de récupération données MFact
app.get('/api/mfact/:model', async (req, res) => {
  const model = req.params.model;
  const filters = req.query;
  
  // Logique métier : validation du modèle
  if (!MFACT_MODELS[model]) {
    return res.status(404).json({ error: 'Model not found' });
  }
  
  // Logique métier : application des filtres
  const data = await applyBusinessFilters(model, filters);
  res.json(data);
});
```

### Q: Comment gérer la logique de validation ?
**R:** Validation à plusieurs niveaux :

**Schéma Drizzle (shared/schema.ts)**
```typescript
// Logique de validation de base
export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  menuId: varchar("menu_id").notNull(),
  label: varchar("label").notNull(),
  formWidth: varchar("form_width").default("700px"),
  layout: varchar("layout").default("PROCESS"),
  fields: jsonb("fields").notNull(),
  // Contraintes métier
  createdBy: varchar("created_by").notNull(),
  assignedTo: varchar("assigned_to"),
  status: varchar("status").default("todo"),
  priority: varchar("priority").default("medium")
});
```

**Validation Zod (API Routes)**
```typescript
// Logique de validation avancée
const formSchema = z.object({
  menuId: z.string().min(1, "Menu ID requis"),
  label: z.string().min(1, "Label requis"),
  fields: z.array(z.object({
    type: z.enum(['GRIDLKP', 'LSTLKP', 'SELECT', 'TEXT']),
    id: z.string(),
    label: z.string(),
    required: z.boolean().optional()
  }))
});

app.post('/api/forms', async (req, res) => {
  // Logique métier : validation des données
  const validatedData = formSchema.parse(req.body);
  
  // Logique métier : règles d'affaires
  if (await isDuplicateMenuId(validatedData.menuId)) {
    return res.status(400).json({ error: 'Menu ID déjà utilisé' });
  }
  
  const form = await storage.createForm(validatedData);
  res.json(form);
});
```

## 🤖 Logique IA et Génération

### Q: Comment fonctionne la logique de génération IA ?
**R:** Architecture sophistiquée avec Claude API :

**Service IA (server/anthropic.ts)**
```typescript
class AIAssistant {
  // Logique métier : analyse de contexte
  async createInteractiveSession(message: string, context?: any[]) {
    const systemPrompt = this.buildBusinessPrompt();
    
    // Logique métier : construction du contexte
    const conversationMessages = this.buildConversationContext(context);
    
    // Logique métier : appel IA avec règles métier
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      system: systemPrompt,
      messages: [...conversationMessages, { role: 'user', content: message }]
    });
    
    return this.processAIResponse(response);
  }
  
  // Logique métier : règles de génération ACCADJ
  private buildBusinessPrompt(): string {
    return `Vous êtes un expert en génération de programmes financiers.
    
    RÈGLES MÉTIER STRICTES :
    1. ACCADJ doit avoir exactement 10 champs
    2. BUYTYP nécessite 9 champs avec validations
    3. Tous les GRIDLKP doivent avoir un DataModel
    4. Les dates doivent utiliser DATEPICKER
    5. Les montants utilisent NUMERIC avec validation
    
    TYPES DE COMPOSANTS AUTORISÉS :
    - GRIDLKP : Recherche dans grilles de données
    - LSTLKP : Listes déroulantes avec données
    - SELECT : Options fixes prédéfinies
    - DATEPICKER : Sélection de dates
    - NUMERIC : Saisie numérique avec validation
    - TEXT : Saisie texte libre
    `;
  }
}
```

## 🔐 Logique Authentification et Autorisation

### Q: Comment fonctionne la logique de sécurité ?
**R:** Système à plusieurs couches :

**Middleware d'authentification**
```typescript
// Logique métier : vérification session
export const requireAuth = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

// Logique métier : vérification rôle admin
export const requireAdmin = async (req: any, res: any, next: any) => {
  const user = await storage.getUser(req.user.id);
  
  // Logique métier : contrôle d'accès
  if (user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
```

**Logique de rôles métier**
```typescript
// Règles d'accès selon le rôle
app.get('/api/forms', requireAuth, async (req: any, res) => {
  const userId = req.user.id;
  const user = await storage.getUser(userId);
  
  let forms;
  
  // Logique métier : accès selon rôle
  if (user?.role === 'admin') {
    // Admin : voit tous les programmes
    forms = await storage.getAllForms();
  } else {
    // User : voit seulement ses programmes assignés
    forms = await storage.getForms(userId);
  }
  
  res.json(forms);
});
```

## 📊 Logique de Données et État

### Q: Comment gérer l'état et la synchronisation ?
**R:** État distribué avec TanStack Query :

**Frontend State Management**
```typescript
// Logique métier : cache intelligent
const { data: forms, isLoading } = useQuery({
  queryKey: ['/api/forms'],
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});

// Logique métier : mutations avec invalidation
const updateFormMutation = useMutation({
  mutationFn: (formData) => apiRequest('/api/forms', {
    method: 'POST',
    body: JSON.stringify(formData)
  }),
  onSuccess: () => {
    // Logique métier : invalidation du cache
    queryClient.invalidateQueries(['/api/forms']);
    queryClient.invalidateQueries(['/api/notifications']);
    
    toast({
      title: "Succès",
      description: "Programme sauvegardé avec succès"
    });
  }
});
```

## 🔄 Logique de Workflows

### Q: Comment fonctionnent les workflows d'assignation ?
**R:** Logique sophistiquée avec notifications :

```typescript
// Logique métier : assignation avec notifications
app.patch('/api/forms/:id/assign', requireAuth, requireAdmin, async (req: any, res) => {
  const formId = parseInt(req.params.id);
  const { assignedTo } = req.body;
  const adminUserId = req.user.id;
  
  // Logique métier : assignation
  await storage.assignFormToUser(formId, assignedTo);
  
  // Logique métier : notification automatique
  const form = await storage.getForm(formId);
  if (form && assignedTo) {
    await notificationService.notifyProgramAssignment(
      assignedTo,    // Destinataire
      adminUserId,   // Expéditeur admin
      formId,        // Programme assigné
      form.label     // Nom du programme
    );
  }
  
  res.json({ message: "Assignation réussie" });
});
```

## 🎯 Bonnes Pratiques Logique Métier

### Séparation des Responsabilités
- **Frontend** : Interface et expérience utilisateur uniquement
- **Backend** : Validation, logique métier, persistance
- **Base de données** : Contraintes d'intégrité et cohérence

### Validation Multi-Niveaux
1. **Client** : Feedback immédiat utilisateur
2. **Serveur** : Validation authoritative
3. **Base de données** : Contraintes d'intégrité finale

### Gestion d'Erreurs
- Erreurs métier explicites avec codes
- Logging détaillé pour debugging
- Messages utilisateur compréhensibles

Cette architecture garantit une logique métier robuste, maintenable et évolutive pour votre système FormBuilder Pro.