# AI FormBuilder Chatbot

An intelligent Streamlit application that converts Delphi DFM files to modern JSON form configurations using AI assistance.

## Features

- **DFM File Parser**: Analyzes Delphi form files and extracts components
- **Info File Processing**: Parses operator and type definitions
- **JSON Generation**: Creates modern form JSON configurations
- **AI Chat Interface**: Interactive AI assistant for discussions and help
- **Real-time Processing**: Auto-generates JSON on file upload
- **Download Support**: Export generated JSON files

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure OpenAI API key in `.streamlit/secrets.toml`:
```toml
OPENAI_API_KEY = "your-actual-openai-api-key"
```

3. Run the application:
```bash
streamlit run ai_chatbot.py
```

## Usage

1. **Upload Files**: 
   - Upload your DFM file (Delphi form)
   - Upload your Info file (operators and types)

2. **AI Chat**: 
   - Ask questions about the generated form
   - Discuss improvements or modifications
   - Get help with form configuration

3. **JSON Output**:
   - View the generated JSON configuration
   - Download the JSON file
   - See analysis metrics

## Supported Delphi Components

The application maps common Delphi components to modern form fields:

- `TSSICheckBox` → `CHECKBOX`
- `TSSIComboBox` → `SELECT`
- `TMFWFndAliasLookup` → `GRIDLKP`
- `TMFWTkrLookup` → `LSTLKP`
- `TButton` → `BUTTON`
- `TSsiRadioGroup` → `RADIOGRP`
- `TGisDateEdit` → `DATEPKR`
- And many more...

## JSON Structure

Generated JSON includes:
- Form metadata (ID, label, layout)
- Component fields with properties
- Validation rules based on operators
- Type definitions and constraints

## AI Features

The AI assistant can help with:
- Explaining generated JSON structure
- Suggesting improvements
- Answering questions about form components
- Providing guidance on best practices