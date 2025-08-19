# FormBuilder Pro - Guide d'Intégration IA

## Description de l'Application

### Vue d'Ensemble
FormBuilder Pro est une **plateforme de création de formulaires intelligente** qui combine un éditeur visuel avancé avec des capacités d'intelligence artificielle pour automatiser et optimiser la création de formulaires complexes.

### Architecture Technique
- **Frontend** : React 18 + TypeScript avec interface drag & drop
- **Backend** : Express.js + Node.js pour les API REST
- **Base de Données** : PostgreSQL avec Drizzle ORM
- **IA** : Integration Claude 4.0 (Anthropic) pour l'assistant "Alex"
- **Alternative** : Support .NET Blazor Server pour environnements entreprise

### Fonctionnalités Clés

#### 1. Éditeur de Formulaires Avancé
- **Palette de Composants** : 25+ types de champs (TEXTBOX, RADIOGRP, LSTLKP, CHECKBOX, etc.)
- **Drag & Drop** : Interface intuitive avec @dnd-kit
- **Propriétés Avancées** : 50+ propriétés configurables par composant
- **Validation Temps Réel** : Règles de validation personnalisées
- **Aperçu Live** : Rendu en temps réel des modifications

#### 2. Assistant IA "Alex"
- **Génération Automatique** : Création de formulaires à partir de descriptions textuelles
- **Analyse de Fichiers DFM** : Conversion de formulaires Delphi en JSON
- **Suggestions Intelligentes** : Recommandations basées sur le contexte
- **Conversation Naturelle** : Interface ChatGPT-style pour interactions

#### 3. Système de Gestion
- **Authentification** : Système complet avec rôles utilisateur
- **Gestion de Projets** : Organisation par formulaires et versions
- **Notifications** : Système de notifications en temps réel
- **Export Multi-Format** : React, Vue, Blazor, JSON

---

## Configuration de l'Intelligence Artificielle

### Étape 1 : Obtenir une Clé API Anthropic

#### Création du Compte
1. **Accéder au site** : https://console.anthropic.com/
2. **Créer un compte** ou se connecter avec Google/GitHub
3. **Vérifier l'email** si nouveau compte

#### Génération de la Clé API
1. **Navigation** : Aller dans "API Keys" dans le menu latéral
2. **Créer une clé** : Cliquer sur "Create Key"
3. **Nommer la clé** : Ex: "FormBuilder-Pro-Production"
4. **Copier la clé** : Format `sk-ant-api03-...` (très long)

#### Tarification Anthropic (2025)
- **Modèle Claude 4.0 Sonnet** (utilisé par défaut)
- **Input** : $3.00 / 1M tokens
- **Output** : $15.00 / 1M tokens
- **Limites gratuites** : $5 de crédit initial

### Étape 2 : Configuration React/Express.js

#### Variables d'Environnement
```bash
# Créer/éditer le fichier .env
cp .env.example .env

# Ajouter la configuration IA
ANTHROPIC_API_KEY=sk-ant-api03-votre-cle-complete-ici
AI_MODEL=claude-sonnet-4-20250514
AI_MAX_TOKENS=4000
AI_TEMPERATURE=0.7
```

#### Configuration du Service IA
```javascript
// server/services/aiService.js
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const generateForm = async (description) => {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    temperature: 0.7,
    system: `Tu es Alex, assistant IA spécialisé dans la génération de formulaires JSON...`,
    messages: [
      { role: 'user', content: description }
    ],
  });
  
  return response.content[0].text;
};
```

#### Vérification de la Configuration
```bash
# Tester la connexion IA
npm run test:ai

# Ou curl direct
curl -X POST http://localhost:5000/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Teste la connexion IA"}'
```

### Étape 3 : Configuration .NET Blazor

#### Configuration appsettings.json
```json
{
  "ApiKeys": {
    "AnthropicApiKey": "sk-ant-api03-votre-cle-complete-ici"
  },
  "AI": {
    "Model": "claude-sonnet-4-20250514",
    "MaxTokens": 4000,
    "Temperature": 0.7,
    "SystemPrompt": "Tu es Alex, assistant IA spécialisé..."
  }
}
```

#### Service IA en C#
```csharp
// Services/AIService.cs
public class AIService
{
    private readonly Anthropic _anthropicClient;
    
    public AIService(IConfiguration configuration)
    {
        _anthropicClient = new Anthropic(
            configuration["ApiKeys:AnthropicApiKey"]
        );
    }
    
    public async Task<string> GenerateFormAsync(string description)
    {
        var response = await _anthropicClient.Messages.CreateAsync(
            model: "claude-sonnet-4-20250514",
            maxTokens: 4000,
            messages: new[] { 
                new { role = "user", content = description } 
            }
        );
        
        return response.Content[0].Text;
    }
}
```

#### Injection de Dépendances
```csharp
// Program.cs
builder.Services.AddScoped<IAIService, AIService>();
```

---

## Fonctionnalités IA Détaillées

### 1. Génération Automatique de Formulaires

#### Prompt Système Optimisé
```
Tu es Alex, assistant IA expert en création de formulaires pour FormBuilder Pro.

Contexte :
- Tu génères des formulaires JSON sophistiqués
- Tu supportes 25+ types de composants
- Tu respectes les bonnes pratiques UX/UI
- Tu optimises pour l'accessibilité

Types de composants disponibles :
- TEXTBOX, RADIOGRP, LSTLKP, CHECKBOX
- DATEPICKER, NUMBR, EMAIL, PHONE
- TEXTAREA, BUTTON, LABEL, etc.

Format de sortie : JSON valide uniquement
```

#### Exemples de Prompts Utilisateur
```
"Crée un formulaire d'inscription utilisateur avec email, mot de passe, confirmation et acceptation CGV"

"Génère un formulaire de commande e-commerce avec informations client, adresse livraison et mode de paiement"

"Formulaire d'évaluation employé avec échelles de notation et commentaires"
```

### 2. Analyse de Fichiers DFM (Delphi)

#### Capacités d'Analyse
- **Parsing Automatique** : Extraction des propriétés de composants
- **Mapping Intelligent** : Conversion TEdit → TEXTBOX, TRadioGroup → RADIOGRP
- **Préservation Layout** : Maintien de la disposition spatiale
- **Validation Syntaxe** : Vérification de la cohérence

#### Exemple de Conversion
```pascal
// Fichier .DFM
object Edit1: TEdit
  Left = 24
  Top = 56
  Width = 200
  Height = 21
  TabOrder = 0
  Text = 'Default Text'
end
```

```json
// JSON Généré
{
  "id": "edit1",
  "type": "TEXTBOX",
  "label": "Edit1",
  "defaultValue": "Default Text",
  "position": { "x": 24, "y": 56 },
  "size": { "width": 200, "height": 21 }
}
```

### 3. Suggestions Contextuelles

#### Intelligence Contextuelle
- **Analyse du Domaine** : Reconnaissance du type de formulaire
- **Suggestions de Champs** : Proposition de champs manquants
- **Optimisation UX** : Amélioration de l'expérience utilisateur
- **Conformité Standards** : Respect des normes d'accessibilité

---

## Optimisation et Performance

### 1. Cache Intelligent
```javascript
// Mise en cache des réponses IA
const cache = new Map();

const getCachedResponse = (prompt) => {
  const hash = crypto.createHash('sha256').update(prompt).digest('hex');
  return cache.get(hash);
};

const setCachedResponse = (prompt, response) => {
  const hash = crypto.createHash('sha256').update(prompt).digest('hex');
  cache.set(hash, response);
};
```

### 2. Limitation de Débit
```javascript
// Rate limiting pour éviter les dépassements
const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requêtes par minute
  message: 'Trop de requêtes IA, veuillez patienter.'
});

app.use('/api/ai', rateLimiter);
```

### 3. Gestion d'Erreurs
```javascript
// Gestion robuste des erreurs IA
try {
  const response = await anthropic.messages.create({...});
  return response.content[0].text;
} catch (error) {
  if (error.status === 429) {
    throw new Error('Limite de débit dépassée, réessayez dans 1 minute');
  } else if (error.status === 401) {
    throw new Error('Clé API invalide, vérifiez votre configuration');
  } else {
    throw new Error(`Erreur IA: ${error.message}`);
  }
}
```

---

## Sécurité et Bonnes Pratiques

### 1. Protection de la Clé API
```bash
# Variables d'environnement sécurisées
# JAMAIS dans le code source !
ANTHROPIC_API_KEY=sk-ant-...
```

### 2. Validation des Entrées
```javascript
// Validation stricte des prompts utilisateur
const validatePrompt = (prompt) => {
  if (!prompt || prompt.length > 10000) {
    throw new Error('Prompt invalide');
  }
  
  // Filtrage de contenu sensible
  const dangerousPatterns = [/password/i, /api.?key/i];
  if (dangerousPatterns.some(pattern => pattern.test(prompt))) {
    throw new Error('Contenu non autorisé détecté');
  }
};
```

### 3. Audit et Logging
```javascript
// Log détaillé pour audit
console.log(`AI Request: ${userId} - ${prompt.substring(0, 100)}...`);
console.log(`AI Response: ${response.length} characters`);
console.log(`Tokens Used: ${usage.total_tokens}`);
```

---

## Tests et Validation

### 1. Tests Unitaires IA
```javascript
// test/aiService.test.js
describe('AI Service', () => {
  test('should generate valid form JSON', async () => {
    const result = await aiService.generateForm('formulaire de contact');
    expect(JSON.parse(result)).toBeDefined();
    expect(result).toContain('TEXTBOX');
  });
});
```

### 2. Tests d'Intégration
```bash
# Tests complets avec vraie API
npm run test:integration:ai
```

### 3. Métriques de Performance
- **Temps de Réponse** : < 3 secondes
- **Précision** : > 95% de JSON valides
- **Coût par Requête** : ~$0.05 en moyenne

---

## Dépannage Fréquent

### Problème : Clé API Invalide
```bash
# Vérification de la clé
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     https://api.anthropic.com/v1/messages
```

### Problème : Limite de Débit
```
Error 429: Rate limit exceeded
Solution: Attendre 1 minute ou upgrader le plan
```

### Problème : Réponse JSON Invalide
```javascript
// Validation et correction automatique
try {
  return JSON.parse(aiResponse);
} catch (e) {
  // Tentative de nettoyage
  const cleaned = aiResponse.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}
```

---

## Surveillance et Monitoring

### 1. Métriques Clés
- Nombre de requêtes IA / heure
- Coût total / jour
- Taux de succès des générations
- Temps de réponse moyen

### 2. Alertes
- Budget dépassé (> $50/jour)
- Taux d'erreur élevé (> 5%)
- Latence excessive (> 10s)

---

## Feuille de Route IA

### Version Actuelle (1.0)
- Assistant Alex basique
- Génération de formulaires simples
- Analyse DFM

### Version Future (2.0)
- IA multimodale (images + texte)
- Apprentissage personnalisé
- Suggestions proactives
- API REST publique

---

**Configuration estimée** : 30-45 minutes pour l'IA complète  
**Coût mensuel typique** : $20-50 selon l'utilisation  
**Support technique** : Documentation complète + exemples