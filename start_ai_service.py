#!/usr/bin/env python3
"""
Service launcher for the AI chatbot to ensure it's always running
"""
import subprocess
import sys
import os
import time
import requests

def is_streamlit_running():
    """Check if Streamlit is running on port 8501"""
    try:
        response = requests.get('http://localhost:8501/_stcore/health', timeout=2)
        return response.status_code == 200
    except:
        return False

def start_streamlit():
    """Start the Streamlit service"""
    print("Starting AI chatbot service...")
    
    # Set environment variables
    env = os.environ.copy()
    env['STREAMLIT_SERVER_PORT'] = '8501'
    env['STREAMLIT_SERVER_ADDRESS'] = '0.0.0.0'
    
    # Start Streamlit in background
    subprocess.Popen([
        sys.executable, '-m', 'streamlit', 'run', 
        'ai_chatbot.py',
        '--server.port=8501',
        '--server.address=0.0.0.0',
        '--server.headless=true',
        '--browser.gatherUsageStats=false'
    ], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def main():
    """Main service manager"""
    if not is_streamlit_running():
        start_streamlit()
        # Wait a moment for startup
        time.sleep(3)
        
        if is_streamlit_running():
            print("AI chatbot service started successfully on http://localhost:8501")
        else:
            print("Failed to start AI chatbot service")
    else:
        print("AI chatbot service is already running on http://localhost:8501")

if __name__ == "__main__":
    main()