# FormBuilder Pro - Guide Pratique d'Utilisation

## 🚀 Démarrage Rapide avec les Fonctionnalités Avancées

### Scenario 1 : Création d'un Programme ACCADJ avec Alex

**Étape 1 : Accéder à Alex**
1. Connectez-vous à FormBuilder Pro
2. Cliquez sur l'icône "AI Assistant" dans la barre de navigation
3. Alex s'ouvre dans une interface de chat moderne

**Étape 2 : Demander la génération**
```
Vous : "Alex, génère-moi un programme ACCADJ complet avec validation des montants"
Alex : "Je vais créer un programme ACCADJ avec toutes les validations requises..."
```

**Étape 3 : Utiliser le JSON généré**
1. Alex affiche le JSON complet dans le chat
2. Copiez le code JSON
3. Retournez au FormBuilder
4. Utilisez "Import" pour charger le JSON
5. Le programme apparaît automatiquement dans la Construction Zone

---

## 🔍 Validation et Correction avec le JSON Validator

### Scenario 2 : Corriger un Formulaire Existant

**Problème** : Vous avez un formulaire qui ne fonctionne pas correctement

**Solution avec le Validator :**

1. **Accès au Validator**
   - Menu Actions → "Validate JSON"
   - Le Validator s'ouvre avec votre formulaire actuel

2. **Analyse automatique**
   ```
   Errors Found: 3
   - Field "Amount" missing required property "Required"
   - Invalid component type "TEXTBOX" (should be "TEXT")
   - EnabledWhen condition syntax error
   ```

3. **Correction automatique**
   - Cliquez "Auto-Fix Simple Errors"
   - Le Validator corrige automatiquement :
     * "TEXTBOX" → "TEXT"
     * Ajoute `"Required": true` à Amount
     * Corrige la syntaxe EnabledWhen

4. **Score de qualité**
   ```
   Quality Score: 85/100
   Suggestions:
   - Add accessibility labels (+5 points)
   - Optimize field ordering (+3 points)
   - Add validation messages (+7 points)
   ```

---

## 🧩 Extension avec External Components

### Scenario 3 : Ajouter un Composant Personnalisé

**Besoin** : Créer un composant "CURRENCY_SELECTOR" pour sélectionner des devises

**Méthode JSON Directe :**

1. **Accès aux External Components**
   - Menu Admin → "External Components"
   - Sélectionnez "JSON Validation Method"

2. **Définition du composant**
   ```json
   {
     "Id": "CurrencySelector",
     "Type": "CURRENCY_SELECTOR",
     "Label": "CURRENCY",
     "DataField": "CurrencyCode",
     "Entity": "Currency",
     "Width": "150px",
     "Spacing": "md",
     "Required": true,
     "Inline": true,
     "Outlined": false,
     "Value": "USD",
     "CurrencyOptions": {
       "USD": "US Dollar",
       "EUR": "Euro", 
       "GBP": "British Pound",
       "JPY": "Japanese Yen"
     },
     "ShowFlag": true,
     "ShowSymbol": true
   }
   ```

3. **Validation et intégration**
   - Le système valide automatiquement
   - Le composant apparaît dans la palette
   - Catégorie : "Selection Controls"

**Méthode Formulaire Guidé :**

1. Sélectionnez "Step-by-Step Form Method"
2. **Étape 1 - Informations de base**
   - Type: CURRENCY_SELECTOR
   - Label: CURRENCY
   - DataField: CurrencyCode
   
3. **Étape 2 - Propriétés spécifiques**
   - Currency Options: USD, EUR, GBP, JPY
   - Show Flag: Oui
   - Show Symbol: Oui
   
4. **Étape 3 - Validation**
   - Required: Oui
   - Default Value: USD
   
5. **Prévisualisation et validation**

---

## 🔄 Workflows Intégrés Avancés

### Scenario 4 : Workflow Complet de A à Z

**Objectif** : Créer un formulaire de transaction financière complexe

**Étape 1 : Planification avec Alex**
```
Vous : "Alex, j'ai besoin d'un formulaire pour enregistrer des transactions financières. 
Il doit inclure : fund selection, account, transaction type, amount, date, et validations."

Alex : "Je vais créer une structure complète. Voulez-vous un modèle basé sur BUYTYP ou 
une structure personnalisée ?"

Vous : "Structure personnalisée avec validation de montant minimum 1000$"
```

**Étape 2 : Génération et validation**
1. Alex génère le JSON complet
2. Automatically analyse par le Validator
3. Score initial : 78/100
4. Corrections suggérées appliquées
5. Score final : 94/100

**Étape 3 : Extension avec composants externes**
1. Ajout du CURRENCY_SELECTOR créé précédemment
2. Ajout d'un composant APPROVAL_WORKFLOW
3. Intégration dans la palette

**Étape 4 : Construction finale**
1. Import du JSON dans FormBuilder
2. Placement des composants dans la grille 4x6
3. Configuration des propriétés via le panneau
4. Test de la logique conditionnelle

---

## 💡 Conseils et Bonnes Pratiques

### Optimisation avec Alex

**Pour des résultats optimaux :**
- Soyez précis dans vos demandes
- Mentionnez les entités métier (Fndmas, Actdata)
- Spécifiez les validations requises
- Demandez des exemples concrets

**Exemples de bonnes demandes :**
```
✅ "Génère un ACCADJ avec validation montant minimum 100$ et sélection fund obligatoire"
✅ "Crée un BUYTYP avec grille de sélection de securities et date limite"
❌ "Fais-moi un formulaire"
❌ "Génère quelque chose"
```

### Validation Efficace

**Bonnes pratiques Validator :**
- Validez après chaque import
- Appliquez les corrections simples automatiquement
- Examinez manuellement les suggestions complexes
- Visez un score ≥ 90/100 pour la production

### Gestion des External Components

**Organisation recommandée :**
- Créez des catégories logiques
- Documentez chaque composant personnalisé
- Testez l'intégration avant déploiement
- Maintenez une bibliothèque de composants réutilisables

---

## 🎯 Cas d'Usage Métier Réels

### Finance & Comptabilité
- **ACCADJ** : Ajustements comptables avec validations de solde
- **Reconciliation** : Rapprochements bancaires automatisés
- **Budget Planning** : Saisie budgétaire avec contrôles d'autorisation

### Trading & Investissement
- **Trade Entry** : Saisie d'ordres avec validations marché
- **Portfolio Management** : Gestion de portefeuille avec calculs automatiques
- **Risk Assessment** : Évaluation des risques avec matrices de décision

### Compliance & Audit
- **Regulatory Reports** : Formulaires réglementaires avec validations métier
- **Audit Trails** : Journaux d'audit avec traçabilité complète
- **Documentation** : Gestion documentaire avec workflow d'approbation

Cette approche intégrée garantit des formulaires robustes, maintenables et parfaitement adaptés aux besoins métier financiers.