#!/usr/bin/env python3
"""
Script de lancement pour le service IA FormBuilder
Lance Streamlit avec configuration optimale pour l'intégration API
"""

import subprocess
import sys
import os
from pathlib import Path

def setup_environment():
    """Configure l'environnement pour le service IA"""
    
    # Vérification des API Keys
    required_keys = ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY']
    missing_keys = []
    
    for key in required_keys:
        if not os.getenv(key):
            missing_keys.append(key)
    
    if missing_keys:
        print(f"❌ API Keys manquantes: {', '.join(missing_keys)}")
        print("Configurez ces variables d'environnement avant de continuer.")
        return False
    
    print("✅ API Keys configurées")
    return True

def launch_streamlit():
    """Lance le service Streamlit avec configuration optimale"""
    
    if not setup_environment():
        sys.exit(1)
    
    # Configuration Streamlit
    config_args = [
        'streamlit', 'run', 'ai_assistant.py',
        '--server.port', '8501',
        '--server.address', '0.0.0.0',
        '--server.headless', 'true',
        '--server.enableCORS', 'false',
        '--server.enableXsrfProtection', 'false',
        '--browser.gatherUsageStats', 'false'
    ]
    
    print("🚀 Lancement du service IA Alex...")
    print(f"📡 Service disponible sur: http://localhost:8501")
    print(f"🔧 Configuration: {' '.join(config_args[2:])}")
    
    try:
        # Lancement du processus Streamlit
        process = subprocess.run(config_args, check=True)
        return process.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur lors du lancement: {e}")
        return False
    except KeyboardInterrupt:
        print("\n⏹️  Service arrêté par l'utilisateur")
        return True

if __name__ == "__main__":
    success = launch_streamlit()
    sys.exit(0 if success else 1)