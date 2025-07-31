# Intégration Python/Streamlit avec FormBuilder API

## Architecture Hybride Multi-Technologies

### Vue d'Ensemble du Système
```
FormBuilder React Frontend (port 3000/5000)
        ↓ HTTP Requests
Express.js Backend API (port 5000)
        ↓ Service Calls
Python Streamlit AI (port 8501)
        ↓ API Calls
OpenAI/Anthropic Services
```

## 1. Configuration Python/Streamlit

### Installation et Configuration
```bash
# Installation dépendances Python
pip install streamlit openai anthropic pandas python-dotenv requests

# Lancement service Streamlit
python run_ai_assistant.py
# ou
streamlit run ai_assistant.py --server.port 8501 --server.address 0.0.0.0
```

### Structure des Fichiers Python
```
FormBuilder/
├── ai_assistant.py          # Service Streamlit principal
├── run_ai_assistant.py      # Script de lancement optimisé
├── pyproject.toml          # Configuration Python
├── uv.lock                 # Lock file dépendances
└── requirements.txt        # Dépendances Python
```

## 2. Service Python AI (ai_assistant.py)

### Fonctionnalités Principales
```python
class FormGeneratorAI:
    def __init__(self):
        self.component_mappings = {
            'TDBEdit': 'TEXT',
            'TDBComboBox': 'SELECT', 
            'TDBDateTimePicker': 'DATEPICKER',
            'TDBGrid': 'GRIDLKP',
            'TDBLookupComboBox': 'LSTLKP'
        }
    
    def parse_dfm_content(self, content: str) -> Dict:
        """Parse fichiers DFM Delphi → JSON FormBuilder"""
        
    def parse_info_content(self, content: str) -> Dict:
        """Parse fichiers Info → Règles validation"""
        
    def generate_program_json(self, program_type: str) -> Dict:
        """Génération programmes ACCADJ, BUYTYP, PRIMNT, SRCMNT"""
```

### Interface Streamlit
```python
# Configuration page
st.set_page_config(
    page_title="FormBuilder AI Assistant",
    page_icon="🤖",
    layout="wide"
)

# Interface utilisateur
uploaded_dfm = st.file_uploader("Upload DFM File", type=['dfm'])
uploaded_info = st.file_uploader("Upload Info File", type=['txt', 'info'])

if st.button("Generate JSON"):
    result = ai.generate_form_from_files(dfm_content, info_content)
    st.json(result)
```

## 3. Intégration API Express ↔ Python

### Routes API Express (server/routes.ts)
```typescript
// Route chat avec Python AI
app.post("/api/ai/chat", requireAuth, async (req, res) => {
    const response = await aiAssistant.createInteractiveSession(message, context);
    res.json({ response: response.response });
});

// Route conversion DFM
app.post("/api/ai/convert-dfm", requireAuth, async (req, res) => {
    const response = await aiAssistant.convertDFMToJSON(dfmContent, infoContent);
    res.json(response);
});

// Route génération programmes
app.post("/api/ai/generate-form", requireAuth, async (req, res) => {
    const response = await aiAssistant.generateFormType(formType, specifications);
    res.json(response);
});
```

### Communication Express → Python
```typescript
// Appel service Python depuis Express
const pythonResponse = await fetch('http://localhost:8501/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        dfm_content: dfmContent,
        info_content: infoContent,
        program_type: 'ACCADJ'
    })
});

const result = await pythonResponse.json();
```

## 4. Configuration Environnement Python

### Variables d'Environnement (.env)
```bash
# API Keys pour IA
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Configuration Streamlit
STREAMLIT_SERVER_PORT=8501
STREAMLIT_SERVER_ADDRESS=0.0.0.0
```

### Script de Lancement (run_ai_assistant.py)
```python
#!/usr/bin/env python3

def setup_environment():
    """Vérification API Keys et configuration"""
    required_keys = ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY']
    for key in required_keys:
        if not os.getenv(key):
            print(f"❌ API Key manquante: {key}")
            return False
    return True

def launch_streamlit():
    """Lance Streamlit avec configuration optimale"""
    config_args = [
        'streamlit', 'run', 'ai_assistant.py',
        '--server.port', '8501',
        '--server.address', '0.0.0.0',
        '--server.headless', 'true'
    ]
    subprocess.run(config_args, check=True)
```

## 5. Flux de Données Complet

### Workflow de Génération ACCADJ
```
1. User → React Frontend: "Génère ACCADJ"
2. Frontend → Express API: POST /api/ai/generate-form
3. Express → Anthropic API: Chat completion
4. Express → Python Service: Validation/Enhancement
5. Python → FormBuilder: JSON ACCADJ complet
6. FormBuilder → User: Programme généré prêt
```

### Workflow Upload DFM
```
1. User → React: Upload fichier DFM
2. React → Express: POST /api/ai/convert-dfm
3. Express → Python: Parse DFM content
4. Python AI: Analyse + Conversion
5. Python → Express: JSON FormBuilder
6. Express → React: Programme converti
```

## 6. Avantages Architecture Hybride

### Séparation des Responsabilités
- **React Frontend**: Interface utilisateur, drag-and-drop
- **Express Backend**: APIs, authentification, base de données
- **Python AI**: Intelligence artificielle, parsing DFM, génération JSON
- **Streamlit**: Interface de développement et test IA

### Scalabilité
- Services indépendants sur ports différents
- APIs REST pour communication inter-services
- Possibilité de déployer services séparément

### Flexibilité
- Python pour logiques IA complexes
- JavaScript pour interface web moderne
- Streamlit pour prototypage rapide IA

## 7. Commandes de Démarrage

### Lancement Complet du Système
```bash
# Terminal 1: FormBuilder principal
npm run dev

# Terminal 2: Service Python AI
python run_ai_assistant.py

# Accès interfaces:
# - FormBuilder: http://localhost:5000
# - Python AI: http://localhost:8501
```

### Debug et Développement
```bash
# Test API Python directement
curl -X POST http://localhost:8501/api/generate \
  -H "Content-Type: application/json" \
  -d '{"program_type": "ACCADJ"}'

# Monitor logs Express
npm run dev --verbose

# Monitor logs Python
streamlit run ai_assistant.py --logger.level debug
```

## 8. Intégration avec Virtual Environment

### Configuration Python venv
```bash
# Création environnement virtuel
python -m venv formbuilder_ai_env
source formbuilder_ai_env/bin/activate  # Linux/Mac
# ou
formbuilder_ai_env\Scripts\activate     # Windows

# Installation dépendances
pip install -r requirements.txt

# Lancement avec venv
source formbuilder_ai_env/bin/activate
python run_ai_assistant.py
```

Cette architecture vous permet d'avoir le meilleur des deux mondes : la puissance de Python pour l'IA et la modernité de React/Node.js pour l'interface web.