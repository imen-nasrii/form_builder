# Guide Python venv + Streamlit pour FormBuilder

## 🐍 Python Virtual Environment (venv)

### Qu'est-ce que venv ?
Un **environnement virtuel Python** qui isole les dépendances de votre projet FormBuilder des autres projets Python sur le système.

### Pourquoi utiliser venv ?
- **Isolation** : Évite les conflits entre versions de packages
- **Propreté** : Garde votre système Python principal propre
- **Reproductibilité** : Même environnement sur tous les systèmes
- **Sécurité** : Contrôle précis des versions installées

## 📊 Streamlit

### Qu'est-ce que Streamlit ?
Un **framework Python** pour créer rapidement des applications web interactives pour la data science et l'IA.

### Pourquoi Streamlit pour FormBuilder ?
- **Interface IA rapide** : Créer une UI pour Alex en quelques lignes
- **Upload de fichiers** : Interface drag & drop pour DFM/Info
- **Visualisation JSON** : Affichage temps réel des résultats
- **Développement rapide** : Prototype IA en minutes

## 🔧 Configuration venv pour FormBuilder

### Création de l'environnement virtuel
```bash
# Créer venv dans le dossier formbuilder_ai_env
python -m venv formbuilder_ai_env

# Structure créée:
formbuilder_ai_env/
├── bin/           # Exécutables (Linux/Mac)
├── Scripts/       # Exécutables (Windows)
├── lib/           # Packages Python installés
├── include/       # Headers C
└── pyvenv.cfg     # Configuration
```

### Activation de l'environnement
```bash
# Linux/Mac
source formbuilder_ai_env/bin/activate

# Windows
formbuilder_ai_env\Scripts\activate

# Votre prompt change:
(formbuilder_ai_env) user@computer:~/FormBuilder$
```

### Installation des packages
```bash
# Avec venv activé
pip install streamlit==1.46.0
pip install anthropic>=0.7.0
pip install openai>=1.3.0
pip install pandas>=2.0.0
pip install python-dotenv>=1.0.0

# Vérification
pip list
```

## 🚀 Lancement Streamlit avec venv

### Méthode 1: Activation manuelle
```bash
# 1. Activer venv
source formbuilder_ai_env/bin/activate

# 2. Lancer Streamlit
streamlit run ai_assistant.py --server.port 8501

# 3. Désactiver après usage
deactivate
```

### Méthode 2: Script automatique
```bash
# Contenu du run_ai_assistant.py (déjà créé)
#!/usr/bin/env python3

import subprocess
import sys
import os

def activate_venv_and_run():
    # Activation automatique venv + lancement Streamlit
    venv_path = "formbuilder_ai_env"
    
    if os.path.exists(venv_path):
        # Utilise l'environnement virtuel
        python_path = f"{venv_path}/bin/python"
        streamlit_cmd = [
            python_path, "-m", "streamlit", "run", "ai_assistant.py",
            "--server.port", "8501"
        ]
    else:
        # Utilise Python système
        streamlit_cmd = [
            "streamlit", "run", "ai_assistant.py",
            "--server.port", "8501"
        ]
    
    subprocess.run(streamlit_cmd)

if __name__ == "__main__":
    activate_venv_and_run()
```

## 📁 Structure Projet avec venv

### Votre projet FormBuilder
```
FormBuilder/
├── formbuilder_ai_env/     # Virtual environment
│   ├── bin/python          # Python isolé
│   └── lib/site-packages/  # Packages IA
├── ai_assistant.py         # App Streamlit
├── run_ai_assistant.py     # Script de lancement
├── server/                 # Express backend
├── client/                 # React frontend
└── .env                    # Variables partagées
```

## 🎯 Interface Streamlit pour FormBuilder

### Fonctionnalités disponibles dans ai_assistant.py
```python
import streamlit as st
import anthropic
import openai

# Interface utilisateur
st.title("🤖 FormBuilder AI Assistant")

# Upload de fichiers
uploaded_dfm = st.file_uploader("Upload DFM File", type=['dfm'])
uploaded_info = st.file_uploader("Upload Info File", type=['txt'])

# Chat avec IA
user_message = st.text_input("Message à Alex:")
if st.button("Send"):
    # Appel Claude API
    response = claude_chat(user_message)
    st.json(response)

# Génération programmes
program_type = st.selectbox("Type de programme:", 
                           ["ACCADJ", "BUYTYP", "PRIMNT", "SRCMNT"])
if st.button("Générer"):
    json_result = generate_program(program_type)
    st.download_button("Télécharger JSON", json_result)
```

## 💡 Avantages venv + Streamlit

### Pour le développement FormBuilder
- **Test IA isolé** : Environnement séparé pour expérimenter
- **Déploiement propre** : venv portable sur tout système
- **Interface rapide** : UI Streamlit en quelques minutes
- **Debugging facile** : Interface visuelle pour logs IA

### Pour la production
- **Stabilité** : Versions figées, pas de surprises
- **Performance** : Packages optimisés pour votre usage
- **Maintenance** : Mise à jour contrôlée
- **Sécurité** : Isolation des dépendances

## 🚀 Commandes rapides

### Création complète venv FormBuilder
```bash
# 1. Créer et activer venv
python -m venv formbuilder_ai_env
source formbuilder_ai_env/bin/activate

# 2. Installer dépendances IA
pip install streamlit anthropic openai pandas python-dotenv

# 3. Lancer Streamlit
streamlit run ai_assistant.py --server.port 8501

# 4. Accéder à l'interface
# http://localhost:8501
```

### Usage quotidien
```bash
# Lancement simple
python run_ai_assistant.py

# Accès simultané:
# - FormBuilder: http://localhost:5000
# - Streamlit AI: http://localhost:8501
```

L'environnement virtuel garantit que votre IA FormBuilder fonctionne de manière identique sur tous les systèmes, tandis que Streamlit offre une interface web moderne pour interagir avec Alex et traiter les fichiers DFM.