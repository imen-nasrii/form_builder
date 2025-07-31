# FormBuilder Pro - Intégration API de l'IA et Configuration Python

## 🤖 Configuration API de l'Intelligence Artificielle

### Architecture de l'IA Alex

**FormBuilder Pro** utilise une architecture hybride pour l'IA Alex :

```
Frontend (React/TypeScript) 
    ↓ API Calls
Backend (Node.js/Express)
    ↓ HTTP Requests  
Python AI Service (Streamlit + venv)
    ↓ API Calls
External AI APIs (OpenAI/Anthropic)
```

### Endpoints API de l'IA

**1. Route principale de chat (/api/ai/chat)**
```typescript
// client/src/pages/ai-assistant.tsx
const sendMessage = async (message: string) => {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message, 
      conversationId: currentConversation 
    })
  });
  return response.json();
};
```

**2. Route d'analyse DFM (/api/ai/analyze-dfm)**
```typescript
// Analyse de fichiers DFM avec upload
const analyzeDFM = async (file: File) => {
  const formData = new FormData();
  formData.append('dfmFile', file);
  
  const response = await fetch('/api/ai/analyze-dfm', {
    method: 'POST',
    body: formData
  });
  return response.json();
};
```

**3. Configuration côté serveur (server/routes.ts)**
```typescript
// Route de chat avec l'IA
app.post('/api/ai/chat', isAuthenticated, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    
    // Appel au service Python Streamlit
    const pythonResponse = await fetch('http://localhost:8501/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        conversationId,
        userId: req.user.claims.sub
      })
    });
    
    const aiResponse = await pythonResponse.json();
    res.json(aiResponse);
  } catch (error) {
    res.status(500).json({ error: 'AI service unavailable' });
  }
});
```

### Configuration des API Keys

**Variables d'environnement requises :**
```bash
# .env
ANTHROPIC_API_KEY=sk-ant-api03-xxx
OPENAI_API_KEY=sk-xxx
AI_SERVICE_URL=http://localhost:8501
```

**Gestion sécurisée dans le code :**
```typescript
// server/config.ts
export const aiConfig = {
  anthropicKey: process.env.ANTHROPIC_API_KEY,
  openaiKey: process.env.OPENAI_API_KEY,
  serviceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8501'
};

if (!aiConfig.anthropicKey) {
  throw new Error('ANTHROPIC_API_KEY is required');
}
```

---

## 🐍 Configuration Python Streamlit avec Environnement Virtuel

### Étape 1 : Création de l'Environnement Virtuel

**Installation et configuration :**
```bash
# Créer l'environnement virtuel
python -m venv formbuilder_ai_env

# Activation (Windows)
formbuilder_ai_env\Scripts\activate

# Activation (Linux/Mac)
source formbuilder_ai_env/bin/activate

# Vérification
which python  # Doit pointer vers le venv
```

### Étape 2 : Installation des Dépendances

**requirements.txt :**
```txt
streamlit==1.28.1
openai==1.3.7
anthropic==0.7.8
pandas==2.1.3
numpy==1.24.3
python-dotenv==1.0.0
requests==2.31.0
json5==0.9.14
pydantic==2.5.0
```

**Installation :**
```bash
# Activer le venv d'abord
source formbuilder_ai_env/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Vérifier l'installation
pip list
```

### Étape 3 : Structure du Service IA Python

**ai_assistant.py - Service principal :**
```python
import streamlit as st
import openai
import anthropic
import os
from dotenv import load_dotenv
import json
import pandas as pd

# Configuration
load_dotenv()

class FormBuilderAI:
    def __init__(self):
        self.openai_client = openai.OpenAI(
            api_key=os.getenv('OPENAI_API_KEY')
        )
        self.anthropic_client = anthropic.Anthropic(
            api_key=os.getenv('ANTHROPIC_API_KEY')
        )
        
    def generate_program(self, program_type: str, requirements: str):
        """Génère un programme JSON selon le type demandé"""
        system_prompt = f"""
        Vous êtes Alex, expert en génération de formulaires financiers.
        Générez un programme {program_type} complet en JSON avec :
        - Tous les champs requis
        - Validations appropriées
        - Structure conforme aux standards MFact
        """
        
        if self.use_anthropic():
            return self._generate_with_anthropic(system_prompt, requirements)
        else:
            return self._generate_with_openai(system_prompt, requirements)
    
    def _generate_with_anthropic(self, system_prompt: str, user_message: str):
        """Génération avec Anthropic Claude"""
        response = self.anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}]
        )
        return response.content[0].text
    
    def _generate_with_openai(self, system_prompt: str, user_message: str):
        """Génération avec OpenAI GPT-4"""
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=4000
        )
        return response.choices[0].message.content
        
    def use_anthropic(self) -> bool:
        """Détermine quel modèle utiliser"""
        return bool(os.getenv('ANTHROPIC_API_KEY'))

# API Streamlit
ai_service = FormBuilderAI()

@st.cache_data
def process_dfm_file(file_content: str) -> dict:
    """Analyse un fichier DFM et retourne la structure JSON"""
    # Logique d'analyse DFM
    return {"status": "processed", "components": []}

# Interface Streamlit
def main():
    st.title("🤖 Alex - AI Assistant for FormBuilder")
    
    # Chat interface
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    # Display chat history
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Demandez à Alex de générer un programme..."):
        # Add user message
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Generate AI response
        with st.chat_message("assistant"):
            with st.spinner("Alex réfléchit..."):
                response = ai_service.generate_program("ACCADJ", prompt)
                st.markdown(response)
                st.session_state.messages.append({"role": "assistant", "content": response})

if __name__ == "__main__":
    main()
```

### Étape 4 : Lancement du Service

**Script de démarrage (start_ai_service.sh) :**
```bash
#!/bin/bash
# Activation de l'environnement virtuel
source formbuilder_ai_env/bin/activate

# Variables d'environnement
export ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY
export OPENAI_API_KEY=$OPENAI_API_KEY

# Lancement Streamlit
streamlit run ai_assistant.py --server.port 8501 --server.address 0.0.0.0
```

**Lancement manuel :**
```bash
# 1. Activer l'environnement
source formbuilder_ai_env/bin/activate

# 2. Lancer Streamlit
streamlit run ai_assistant.py

# 3. Le service sera disponible sur http://localhost:8501
```

### Étape 5 : Intégration avec FormBuilder

**Communication Node.js ↔ Python :**
```typescript
// server/ai-service.ts
export class AIService {
  private baseUrl = 'http://localhost:8501';
  
  async generateProgram(type: string, requirements: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, requirements })
    });
    
    if (!response.ok) {
      throw new Error('AI service unavailable');
    }
    
    return response.text();
  }
  
  async analyzeDFM(fileContent: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/analyze-dfm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: fileContent })
    });
    
    return response.json();
  }
}
```

---

## 🔧 Configuration Avancée

### Gestion des Environnements

**Développement :**
```bash
# .env.development
AI_SERVICE_URL=http://localhost:8501
DEBUG_AI=true
AI_TIMEOUT=30000
```

**Production :**
```bash
# .env.production  
AI_SERVICE_URL=https://ai-service.formbuilder.com
DEBUG_AI=false
AI_TIMEOUT=10000
```

### Monitoring et Logs

**Configuration des logs Python :**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ai_service.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
```

### Sécurité

**Authentification API :**
```python
# ai_assistant.py
def verify_request(request_headers):
    api_key = request_headers.get('X-API-Key')
    expected_key = os.getenv('AI_SERVICE_API_KEY')
    return api_key == expected_key
```

Cette configuration permet une intégration complète entre FormBuilder Pro et le service IA Python, avec une architecture robuste et sécurisée.