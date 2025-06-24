#!/usr/bin/env python3
"""
Lanceur pour l'assistant IA FormBuilder
"""

import subprocess
import sys
import os

def main():
    """Lance l'assistant IA Streamlit"""
    try:
        # Vérification que streamlit est installé
        try:
            import streamlit
        except ImportError:
            print("Installation de Streamlit...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "streamlit"])
        
        # Lancement de l'assistant IA
        print("🚀 Lancement de l'Assistant IA FormBuilder...")
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", 
            "ai_assistant.py", 
            "--server.port", "8501",
            "--server.address", "0.0.0.0"
        ])
    
    except KeyboardInterrupt:
        print("\n👋 Assistant IA fermé")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    main()