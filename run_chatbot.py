#!/usr/bin/env python3
"""
Launch script for the AI FormBuilder Chatbot
"""
import subprocess
import sys
import os

def main():
    """Launch the Streamlit application"""
    print("🚀 Starting AI FormBuilder Chatbot...")
    
    # Set environment variables
    os.environ['STREAMLIT_SERVER_PORT'] = '8501'
    os.environ['STREAMLIT_SERVER_ADDRESS'] = '0.0.0.0'
    
    try:
        # Launch Streamlit
        subprocess.run([
            sys.executable, '-m', 'streamlit', 'run', 
            'ai_chatbot.py',
            '--server.port=8501',
            '--server.address=0.0.0.0',
            '--server.headless=true',
            '--browser.gatherUsageStats=false'
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Chatbot stopped by user")
    except Exception as e:
        print(f"❌ Error starting chatbot: {e}")

if __name__ == "__main__":
    main()