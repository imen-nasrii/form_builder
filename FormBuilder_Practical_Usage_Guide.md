# Guide Pratique : Composants Internes vs Externes

## 🎯 Architecture des Composants FormBuilder

### ✅ Composants INTERNES (APIs Prédéfinies)
**Stockés dans :** Code source + Base de données schema
**Localisation :** `shared/mfact-models.ts` + `shared/schema.ts`

```typescript
// Exemples de composants internes
const INTERNAL_COMPONENTS = [
  'GRIDLKP',   // Grid lookup avec MFact models
  'LSTLKP',    // List lookup avec DataModel
  'SELECT',    // Dropdown avec OptionValues
  'DATEPICKER',// Date picker avec validations
  'CHECKBOX',  // Boolean avec EnabledWhen
  'RADIOGRP',  // Radio group avec options
  'GROUP',     // Container avec ChildFields
  'TEXT'       // Text input avec validations
];
```

### 🔌 Composants EXTERNES (APIs Dynamiques)
**Stockés dans :** Base de données PostgreSQL
**Table :** `external_components`

```sql
-- Structure table external_components
CREATE TABLE external_components (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  description TEXT,
  icon VARCHAR DEFAULT 'Package',
  properties JSONB NOT NULL,     -- Configuration API
  config JSONB NOT NULL,         -- Paramètres dynamiques
  created_by VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

## 🔄 Différences Clés

### Composants INTERNES
| Caractéristique | Description |
|------------------|-------------|
| **APIs** | Prédéfinies dans MFact models (ACCADJ, BUYTYP, etc.) |
| **Structure** | Figée dans le code TypeScript |
| **Validation** | Hardcodée avec types stricts |
| **Évolution** | Nécessite modification du code |
| **Performance** | Ultra-rapide (pas de DB lookup) |
| **Exemples** | GRIDLKP, LSTLKP, SELECT, DATEPICKER |

### Composants EXTERNES
| Caractéristique | Description |
|------------------|-------------|
| **APIs** | Définies dynamiquement par l'utilisateur |
| **Structure** | Flexible, stockée en JSON |
| **Validation** | Intelligente avec JSON Schema |
| **Évolution** | Mise à jour sans redéploiement |
| **Performance** | Légère latence (DB query) |
| **Exemples** | Composants métier personnalisés |

## 🛠 Utilisation Pratique

### Scenario 1: Programme ACCADJ Standard
**Utilise :** Composants INTERNES
```json
{
  "fields": [
    {
      "type": "GRIDLKP",
      "DataModel": "ACCADJ",
      "LoadDataInfo": {
        "Entity": "ACCOUNTS",
        "API": "/api/mfact/accounts"  // API prédéfinie
      }
    }
  ]
}
```

### Scenario 2: Composant Métier Personnalisé
**Utilise :** Composants EXTERNES
```json
{
  "id": "CUSTOM_TRADE_LOOKUP",
  "name": "Trade Lookup Custom",
  "type": "GRIDLKP",
  "properties": {
    "DataModel": "CUSTOM_TRADES",
    "API": "https://api.votre-systeme.com/trades"  // API externe
  },
  "config": {
    "headers": {"Authorization": "Bearer token"},
    "method": "GET",
    "responseMapping": {
      "id": "trade_id",
      "name": "trade_name"
    }
  }
}
```

## 🚀 Interface External Components

### Menu Administration
```
Navigation Admin → External Components
├── Import Methods
│   ├── JSON Validation (Direct)
│   └── Step-by-Step Form
├── Component Library
│   ├── View All Components
│   ├── Edit/Delete Components
│   └── Export Component JSON
└── Integration Test
    ├── API Connection Test
    └── Data Validation
```

### Création Composant Externe

**Méthode 1: JSON Direct**
```json
{
  "name": "CustomLookup",
  "type": "GRIDLKP",
  "category": "Custom",
  "description": "Lookup personnalisé",
  "properties": {
    "DataModel": "CUSTOM_ENTITY",
    "LoadDataInfo": {
      "API": "https://your-api.com/data",
      "Method": "GET",
      "Headers": {
        "Authorization": "Bearer your_token"
      }
    },
    "ColumnsDefinition": [
      {
        "DataField": "id",
        "Caption": "ID",
        "DataType": "Chaîne de caractères",
        "Visible": true
      }
    ]
  },
  "config": {
    "authentication": "bearer",
    "timeout": 5000,
    "retries": 3
  }
}
```

**Méthode 2: Formulaire Étapes**
1. **Informations de base** : Nom, type, catégorie
2. **Configuration API** : URL, méthode, headers
3. **Mapping de données** : Colonnes, types, validations
4. **Test de connexion** : Validation automatique
5. **Intégration** : Ajout à la palette

## 📊 APIs et Intégration

### Composants Internes → MFact APIs
```typescript
// Routes API prédéfinies
app.get('/api/mfact/:model', (req, res) => {
  const model = MFACT_MODELS[req.params.model];
  // Données figées dans le code
  res.json(model.data);
});

// Modèles disponibles
const MFACT_MODELS = {
  'ACCADJ': { /* 10 champs prédéfinis */ },
  'BUYTYP': { /* 9 champs prédéfinis */ },
  'PRIMNT': { /* Données price maintenance */ },
  'SRCMNT': { /* Données source maintenance */ }
};
```

### Composants Externes → APIs Dynamiques
```typescript
// Routes API configurables
app.get('/api/external-components/:id/data', async (req, res) => {
  const component = await db.select()
    .from(externalComponents)
    .where(eq(externalComponents.id, req.params.id));
    
  const apiConfig = component.config;
  
  // Appel API dynamique selon configuration
  const response = await fetch(apiConfig.url, {
    method: apiConfig.method,
    headers: apiConfig.headers
  });
  
  res.json(response.data);
});
```

## 🎯 Cas d'Usage Recommandés

### Utiliser Composants INTERNES pour :
- ✅ Programmes financiers standards (ACCADJ, BUYTYP)
- ✅ Logiques métier stables et éprouvées
- ✅ Performance maximale requise
- ✅ Validation stricte des données

### Utiliser Composants EXTERNES pour :
- ✅ Intégration APIs tierces (CRM, ERP)
- ✅ Composants métier spécifiques à l'entreprise
- ✅ Évolution rapide des besoins
- ✅ Tests et prototypage

## 🔧 Workflow d'Intégration

### Étape 1: Analyse des Besoins
```
Nouveau composant requis ?
├── Données MFact standards → Composant INTERNE
├── API externe existante → Composant EXTERNE
└── Logique métier custom → Composant EXTERNE
```

### Étape 2: Implémentation
**Composant Interne:**
1. Modifier `shared/mfact-models.ts`
2. Ajouter validation TypeScript
3. Redéployer application

**Composant Externe:**
1. Accéder External Components
2. Configurer via interface web
3. Test automatique de l'API
4. Activation immédiate

### Étape 3: Utilisation
```
FormBuilder → Palette Composants
├── Section "Core Components" (Internes)
└── Section "External Components" (Externes)
```

## 💡 Avantages de l'Architecture Hybride

### Flexibilité
- **Base solide** : Composants internes fiables
- **Extensibilité** : Composants externes illimités
- **Évolutivité** : Ajout sans redéploiement

### Performance
- **Composants critiques** : Performance native
- **Composants auxiliaires** : Flexibilité maximale
- **Cache intelligent** : Optimisation automatique

### Maintenance
- **Code stable** : Composants internes versionnés
- **Configuration dynamique** : Composants externes modifiables
- **Tests séparés** : Validation indépendante

Votre système FormBuilder offre le meilleur des deux mondes : la robustesse des composants internes avec APIs prédéfinies pour les besoins standards, et la flexibilité des composants externes pour les intégrations personnalisées et l'évolution métier.