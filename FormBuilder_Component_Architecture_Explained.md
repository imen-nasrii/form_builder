# Architecture Détaillée : Palette FormBuilder

## 🎯 Vue d'Ensemble de la Palette

```
FormBuilder Component Palette
├── 🏢 CORE COMPONENTS (Internes - APIs Prédéfinies)
│   ├── GRIDLKP → MFact APIs (/api/mfact/*)
│   ├── LSTLKP → Données hardcodées  
│   └── SELECT → OptionValues figées
└── 🔌 EXTERNAL COMPONENTS (Externes - APIs Dynamiques)
    ├── Custom APIs → URLs configurables
    ├── Headers dynamiques → Bearer tokens
    └── Mapping personnalisé → Response transformation
```

## 🏢 CORE COMPONENTS (Composants Internes)

### Architecture Interne
**Stockage :** Code source TypeScript + Schema PostgreSQL
**Performance :** Ultra-rapide (pas de requête DB pour la définition)
**Évolution :** Nécessite redéploiement pour modifications

### 1. GRIDLKP → MFact APIs
```typescript
// Localisation : shared/mfact-models.ts
const GRIDLKP_COMPONENT = {
  type: 'GRIDLKP',
  label: 'Grid Lookup',
  category: 'LOOKUP_COMPONENTS',
  
  // API prédéfinie MFact
  defaultProperties: {
    LoadDataInfo: {
      DataModel: 'ACCADJ',           // Modèle figé
      Entity: 'ACCOUNTS',            // Table prédéfinie
      API: '/api/mfact/ACCADJ'       // Route hardcodée
    },
    ColumnsDefinition: [
      {
        DataField: 'AccountNumber',   // Champ fixe
        Caption: 'N° Compte',
        DataType: 'Chaîne de caractères',
        Visible: true
      }
    ]
  }
};

// Route API correspondante (server/routes.ts)
app.get('/api/mfact/:model', (req, res) => {
  const model = MFACT_MODELS[req.params.model];
  // Données figées dans le code
  res.json(model.data);
});
```

**Modèles MFact Disponibles :**
- `ACCADJ` - Ajustements comptables (10 champs)
- `BUYTYP` - Types d'achat (9 champs)
- `PRIMNT` - Maintenance des prix
- `SRCMNT` - Maintenance des sources
- `BUYLONG` - Achats long terme

### 2. LSTLKP → Données Hardcodées
```typescript
const LSTLKP_COMPONENT = {
  type: 'LSTLKP',
  label: 'List Lookup',
  
  // Données statiques prédéfinies
  defaultProperties: {
    LoadDataInfo: {
      Items: [
        { id: 1, label: 'Option A', value: 'A' },
        { id: 2, label: 'Option B', value: 'B' },
        { id: 3, label: 'Option C', value: 'C' }
      ]
    },
    ItemInfo: {
      ValueField: 'value',
      LabelField: 'label'
    }
  }
};
```

### 3. SELECT → OptionValues Figées
```typescript
const SELECT_COMPONENT = {
  type: 'SELECT',
  label: 'Dropdown Select',
  
  // Options statiques
  defaultProperties: {
    OptionValues: [
      { key: 'yes', value: 'Oui' },
      { key: 'no', value: 'Non' },
      { key: 'maybe', value: 'Peut-être' }
    ],
    UserIntKey: true,
    Required: false
  }
};
```

## 🔌 EXTERNAL COMPONENTS (Composants Externes)

### Architecture Externe
**Stockage :** Base de données PostgreSQL (table `external_components`)
**Performance :** Légère latence (requête DB + API externe)
**Évolution :** Modification via interface web sans redéploiement

### Structure Base de Données
```sql
CREATE TABLE external_components (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  description TEXT,
  
  -- Configuration API dynamique
  properties JSONB NOT NULL,
  config JSONB NOT NULL,
  
  created_by VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

### 1. Custom APIs → URLs Configurables
```json
{
  "id": "CUSTOM_CRM_LOOKUP",
  "name": "CRM Customer Lookup",
  "type": "GRIDLKP",
  "properties": {
    "LoadDataInfo": {
      "API": "https://api.your-crm.com/customers",
      "Method": "GET",
      "Timeout": 5000
    }
  },
  "config": {
    "baseUrl": "https://api.your-crm.com",
    "endpoint": "/customers",
    "method": "GET",
    "timeout": 5000,
    "retries": 3
  }
}
```

### 2. Headers Dynamiques → Bearer Tokens
```json
{
  "properties": {
    "LoadDataInfo": {
      "API": "https://api.salesforce.com/data/v1/accounts",
      "Headers": {
        "Authorization": "Bearer {{USER_TOKEN}}",
        "Content-Type": "application/json",
        "X-API-Version": "v1.0",
        "X-Client-ID": "FormBuilder-Pro"
      }
    }
  },
  "config": {
    "authentication": {
      "type": "bearer",
      "tokenField": "access_token",
      "refreshEndpoint": "/oauth/refresh"
    },
    "security": {
      "validateSSL": true,
      "allowSelfSigned": false
    }
  }
}
```

### 3. Mapping Personnalisé → Response Transformation
```json
{
  "properties": {
    "ResponseMapping": {
      "dataPath": "result.customers",
      "columns": [
        {
          "sourceField": "customer_id",
          "targetField": "id",
          "dataType": "string"
        },
        {
          "sourceField": "customer_name",
          "targetField": "name",
          "dataType": "string"
        },
        {
          "sourceField": "created_date",
          "targetField": "dateCreated",
          "dataType": "date",
          "format": "YYYY-MM-DD"
        }
      ]
    }
  },
  "config": {
    "transformation": {
      "filterEmpty": true,
      "sortBy": "name",
      "limit": 100,
      "pagination": {
        "enabled": true,
        "pageSize": 20,
        "pageParam": "page"
      }
    }
  }
}
```

## 🔄 Flux de Données Comparé

### Core Components (Internes)
```
User Interface → FormBuilder → Core Component
                              ↓
                    Propriétés hardcodées
                              ↓
                    Route API prédéfinie (/api/mfact/ACCADJ)
                              ↓
                    Données MFact statiques
                              ↓
                    Réponse immédiate
```

### External Components (Externes)
```
User Interface → FormBuilder → External Component
                              ↓
                    Base de données (external_components)
                              ↓
                    Configuration dynamique (JSON)
                              ↓
                    API externe avec headers personnalisés
                              ↓
                    Transformation de réponse
                              ↓
                    Données formatées pour FormBuilder
```

## 🎯 Cas d'Usage Détaillés

### Exemple 1: Programme ACCADJ (Core Component)
```typescript
// Utilisation GRIDLKP interne
const accadjField = {
  type: 'GRIDLKP',
  DataModel: 'ACCADJ',              // Modèle prédéfini
  LoadDataInfo: {
    Entity: 'ACCOUNTS',              // Table MFact
    API: '/api/mfact/ACCADJ'        // Route hardcodée
  },
  ColumnsDefinition: [               // Colonnes figées
    {
      DataField: 'AccountNumber',
      Caption: 'N° Compte',
      DataType: 'Chaîne de caractères'
    }
  ]
};

// Performance : ~50ms (aucune requête DB externe)
```

### Exemple 2: Intégration CRM (External Component)
```typescript
// Utilisation GRIDLKP externe
const crmField = {
  type: 'GRIDLKP',
  ComponentId: 'CUSTOM_CRM_LOOKUP',  // Référence externe
  LoadDataInfo: {
    API: 'https://api.salesforce.com/data/v1/accounts',
    Headers: {
      'Authorization': 'Bearer sk-live-...',
      'X-API-Version': 'v52.0'
    }
  },
  ResponseMapping: {                 // Transformation dynamique
    idField: 'Id',
    nameField: 'Name',
    emailField: 'Email__c'
  }
};

// Performance : ~200-500ms (DB + API externe + transformation)
```

## 🛠 Interface de Gestion

### Administration Core Components
```
FormBuilder Admin → MFact Models Management
├── View Available Models (ACCADJ, BUYTYP, etc.)
├── Edit Model Properties (Read-only)
└── Deploy New Models (Requires code change)
```

### Administration External Components
```
FormBuilder Admin → External Components Library
├── Create New Component
│   ├── JSON Validation Method
│   └── Step-by-Step Form
├── Manage Existing Components
│   ├── Edit Configuration
│   ├── Test API Connection
│   └── Delete Component
└── Import/Export Library
    ├── Export All Components
    └── Import Component Pack
```

## 💡 Avantages de l'Architecture Hybride

### Core Components (Internes)
✅ **Performance maximale** - Pas de latence réseau
✅ **Fiabilité absolue** - Données toujours disponibles
✅ **Validation stricte** - Types TypeScript contraints
✅ **Maintenance centralisée** - Évolution contrôlée

### External Components (Externes)
✅ **Flexibilité totale** - APIs personnalisées illimitées
✅ **Évolution rapide** - Modifications sans redéploiement
✅ **Intégration simple** - CRM, ERP, APIs tierces
✅ **Configuration utilisateur** - Interface web intuitive

Cette architecture offre le meilleur des deux mondes : la robustesse des composants internes pour les besoins standards et la flexibilité des composants externes pour les intégrations sur-mesure.