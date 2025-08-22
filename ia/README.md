# FormBuilder Pro - Intelligence Artificielle

## Assistant IA "Alex"

### Configuration
```bash
cd ia
python -m venv formbuilder_ai_env
source formbuilder_ai_env/bin/activate  # Linux/Mac
# ou
formbuilder_ai_env\Scripts\activate  # Windows

pip install streamlit anthropic pandas numpy python-dotenv
```

### Variables d'environnement
```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### Démarrage
```bash
streamlit run streamlit/ai_assistant.py --server.port=8501
```

## Fonctionnalités
- Parsing de fichiers DFM (Delphi)
- Génération JSON pour formulaires
- Assistant contextuel intelligent
- Intégration Claude API

## Accès
- Interface IA: http://localhost:8501
- Modèles MFact: ./models/MfactModels/