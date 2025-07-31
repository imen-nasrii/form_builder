# Guide Pratique : Intégration Python/Streamlit avec FormBuilder

## 🚀 Lancement Rapide du Système Complet

### Étape 1: Démarrage FormBuilder (déjà actif)
```bash
# Votre serveur Express est déjà en cours d'exécution sur port 5000
# Status: ✅ RUNNING
```

### Étape 2: Lancement Service Python AI
```bash
# Méthode 1: Script automatique
python run_ai_assistant.py

# Méthode 2: Lancement manuel Streamlit  
streamlit run ai_assistant.py --server.port 8501 --server.address 0.0.0.0 --server.headless true

# Méthode 3: Avec environnement virtuel
source formbuilder_ai_env/bin/activate
python run_ai_assistant.py
```

## 🔧 Architecture API Hybride Active

### Services Actifs dans Votre Système
```
✅ Express Backend (port 5000) - RUNNING
   ├── /api/ai/chat           → Anthropic Claude API  
   ├── /api/ai/generate-form  → Génération ACCADJ/BUYTYP
   ├── /api/ai/convert-dfm    → Parser DFM → JSON
   ├── /api/ai/analyze-dfm    → Analyse fichiers DFM
   ├── /api/ai/validate       → Validation JSON
   └── /api/ai/analyze-code   → Analyse de code

⏳ Python Streamlit (port 8501) - À LANCER
   ├── Interface AI développement
   ├── Upload DFM/Info files
   ├── Parsing Delphi avancé
   └── Génération JSON interactive
```

## 📁 Fichiers Python Disponibles

### Service AI Principal
- **ai_assistant.py** (25KB) - Service Streamlit complet avec:
  - Parser DFM/Info intelligent
  - Génération programmes ACCADJ, BUYTYP, PRIMNT, SRCMNT
  - Interface chat interactive
  - Conversion Delphi → JSON automatique

### Script de Lancement  
- **run_ai_assistant.py** - Script optimisé avec:
  - Vérification API Keys (ANTHROPIC_API_KEY, OPENAI_API_KEY)
  - Configuration Streamlit automatique
  - Gestion erreurs et logging

## 🤖 Fonctionnalités IA Disponibles

### 1. Génération Programmes JSON
```python
# Dans ai_assistant.py - Fonctions disponibles
def generate_accadj_program():
    """Génère ACCADJ complet avec 10 champs comme version originale"""
    
def generate_buytyp_program():
    """Génère BUYTYP avec grilles et validations métier"""
    
def parse_dfm_to_json(dfm_content, info_content):
    """Convertit fichiers Delphi → JSON FormBuilder"""
```

### 2. Interface Streamlit Interactive
- **Upload Files**: DFM + Info files drag & drop
- **Chat AI**: Discussion contextuelle avec Alex
- **JSON Preview**: Aperçu en temps réel
- **Export**: Téléchargement automatique JSON

## 💡 Comment Ça Fonctionne

### Workflow Complet 
```
1. User utilise FormBuilder React (port 5000)
2. Clic "AI Assistant" → Navigue vers interface Alex
3. Alex utilise Express API → Appels Anthropic Claude
4. Résultats JSON → Chargés dans Construction Zone
5. User édite avec drag & drop → Sauvegarde programme

PARALLÈLEMENT:
1. User peut lancer Streamlit (port 8501)
2. Upload fichiers DFM directement
3. Parsing Python avancé → JSON optimisé  
4. Import JSON dans FormBuilder principal
```

### APIs Configurées et Prêtes
- ✅ **ANTHROPIC_API_KEY** configurée
- ✅ **OPENAI_API_KEY** configurée  
- ✅ **6 routes Express** actives (/api/ai/*)
- ✅ **Python dependencies** installées
- ✅ **Service Streamlit** prêt à lancer

## 🔥 Commandes de Test

### Test API Express 
```bash
# Test chat AI (depuis FormBuilder web)
# Naviguer vers "AI Assistant" dans le menu

# Test direct API
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Génère un programme ACCADJ complet"}'
```

### Test Service Python
```bash
# Après lancement python run_ai_assistant.py
# Accéder à: http://localhost:8501
# Interface web Streamlit avec upload DFM
```

## 🎯 Prochaines Étapes

### Pour Utiliser Alex (IA FormBuilder)
1. Ouvrir FormBuilder → Menu "AI Assistant"
2. Chatter: "Génère ACCADJ version originale 10 champs"
3. Alex génère le JSON → Import automatique

### Pour Utiliser Python Direct
1. Lancer: `python run_ai_assistant.py`
2. Accéder: http://localhost:8501
3. Upload fichiers DFM → Conversion automatique

Votre système est 100% prêt ! Les APIs Claude/OpenAI sont configurées et Alex peut immédiatement générer la version ACCADJ originale que vous souhaitez.