import streamlit as st
import json
import re
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional
import openai
from datetime import datetime
import io

# Configure OpenAI
openai.api_key = st.secrets.get("OPENAI_API_KEY", "")

class DelphiFormParser:
    """Parser for Delphi DFM files to extract form components and properties"""
    
    def __init__(self):
        self.components = []
        self.form_properties = {}
        
    def parse_dfm_content(self, content: str) -> Dict[str, Any]:
        """Parse DFM file content and extract form structure"""
        lines = content.split('\n')
        current_component = None
        indent_level = 0
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith('//'):
                continue
                
            # Extract form properties
            if line.startswith('inherited') or line.startswith('object'):
                self._parse_component_declaration(line)
            elif '=' in line and not line.startswith('end'):
                self._parse_property(line, current_component)
                
        return {
            "form_properties": self.form_properties,
            "components": self.components
        }
    
    def _parse_component_declaration(self, line: str):
        """Parse component declaration line"""
        if 'inherited' in line:
            # Parse inherited form
            match = re.search(r'inherited\s+(\w+):\s*(\w+)', line)
            if match:
                self.form_properties['name'] = match.group(1)
                self.form_properties['type'] = match.group(2)
        elif 'object' in line:
            # Parse object component
            match = re.search(r'object\s+(\w+):\s*(\w+)', line)
            if match:
                component = {
                    'name': match.group(1),
                    'type': match.group(2),
                    'properties': {}
                }
                self.components.append(component)
    
    def _parse_property(self, line: str, component=None):
        """Parse property assignment"""
        if '=' in line:
            parts = line.split('=', 1)
            prop_name = parts[0].strip()
            prop_value = parts[1].strip()
            
            # Clean property value
            prop_value = prop_value.strip("'\"")
            
            if component:
                component['properties'][prop_name] = prop_value
            else:
                self.form_properties[prop_name] = prop_value

class ComponentTypeMapper:
    """Maps Delphi components to modern form field types"""
    
    COMPONENT_MAPPING = {
        'TSSICheckBox': 'CHECKBOX',
        'TSSIComboBox': 'SELECT', 
        'TMFWFndAliasLookup': 'GRIDLKP',
        'TMFWTkrLookup': 'LSTLKP',
        'TMFWSccLookup': 'LSTLKP',
        'TMFWScgLookup': 'LSTLKP',
        'TButton': 'BUTTON',
        'TSsiRadioGroup': 'RADIOGRP',
        'TGisDateEdit': 'DATEPKR',
        'TgisAsOfFileDateEdit': 'DATEPICKER',
        'TListBox': 'GRID',
        'TPanel': 'GROUP',
        'TLabel': 'LABEL',
        'TEdit': 'TEXT',
        'TMemo': 'TEXTAREA'
    }
    
    @classmethod
    def map_component_type(cls, delphi_type: str) -> str:
        """Map Delphi component type to modern form field type"""
        return cls.COMPONENT_MAPPING.get(delphi_type, 'TEXT')

class OperatorParser:
    """Parse operators and types from info file"""
    
    def __init__(self):
        self.logical_operators = []
        self.operators = []
        self.types = []
    
    def parse_info_content(self, content: str) -> Dict[str, List[str]]:
        """Parse information file content"""
        lines = content.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if 'LogicalOperator' in line:
                current_section = 'logical'
            elif 'Operators' in line:
                current_section = 'operators'
            elif 'Types' in line:
                current_section = 'types'
            elif line.startswith('{') or line.startswith('}'):
                continue
            elif current_section and line:
                self._parse_section_item(line, current_section)
        
        return {
            'logical_operators': self.logical_operators,
            'operators': self.operators,
            'types': self.types
        }
    
    def _parse_section_item(self, line: str, section: str):
        """Parse individual items in each section"""
        # Remove comments and clean line
        line = re.sub(r'//.*', '', line).strip()
        line = line.rstrip(',')
        
        if section == 'logical':
            if line and not line.startswith('['):
                self.logical_operators.append(line)
        elif section == 'operators':
            # Extract operator codes
            match = re.search(r'\[EnumMember\(Value = "(\w+)"\)\]\s*(\w+)', line)
            if match:
                self.operators.append({
                    'code': match.group(1),
                    'name': match.group(2)
                })
            elif line and not line.startswith('['):
                self.operators.append({'code': line, 'name': line})
        elif section == 'types':
            if line and not line.startswith('['):
                self.types.append(line)

class JSONGenerator:
    """Generate JSON configuration from parsed components"""
    
    def __init__(self, operators_info: Dict[str, Any]):
        self.operators_info = operators_info
        
    def generate_form_json(self, form_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate complete form JSON configuration"""
        
        form_json = {
            "menuId": form_data['form_properties'].get('name', 'UNKNOWN_FORM'),
            "label": self._extract_caption(form_data['form_properties']),
            "formWidth": "700px",
            "layout": "PROCESS",
            "fields": [],
            "actions": [],
            "validations": []
        }
        
        # Process components
        for component in form_data['components']:
            field = self._convert_component_to_field(component)
            if field:
                form_json['fields'].append(field)
        
        # Add validation rules based on operators
        form_json['validations'] = self._generate_validation_rules()
        
        return form_json
    
    def _extract_caption(self, properties: Dict[str, Any]) -> str:
        """Extract form caption/title"""
        caption = properties.get('Caption', '')
        if caption:
            # Clean up caption
            caption = caption.replace("'", "").strip()
        return caption or 'Form'
    
    def _convert_component_to_field(self, component: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Convert Delphi component to modern form field"""
        component_type = ComponentTypeMapper.map_component_type(component['type'])
        
        field = {
            "Id": f"{component_type}_{int(datetime.now().timestamp() * 1000)}",
            "Type": component_type,
            "Label": self._extract_label(component),
            "DataField": f"field_{component['name'].lower()}",
            "Entity": "TableName",
            "Width": "100%",
            "Spacing": "md",
            "Required": False,
            "Inline": False,
            "Outlined": False,
            "Value": ""
        }
        
        # Add component-specific properties
        self._add_component_specific_properties(field, component)
        
        return field
    
    def _extract_label(self, component: Dict[str, Any]) -> str:
        """Extract label from component properties"""
        properties = component.get('properties', {})
        
        # Try different caption properties
        label_candidates = ['Caption', 'LabelCaption', 'Text', 'Name']
        for candidate in label_candidates:
            if candidate in properties:
                return properties[candidate].replace("'", "").strip()
        
        # Fallback to component name
        return component.get('name', 'Field').replace('_', ' ').title()
    
    def _add_component_specific_properties(self, field: Dict[str, Any], component: Dict[str, Any]):
        """Add component-type specific properties"""
        component_type = field['Type']
        properties = component.get('properties', {})
        
        if component_type == 'SELECT' or component_type == 'RADIOGRP':
            # Extract options from Items.Strings
            items = properties.get('Items.Strings', '')
            if items:
                field['OptionValues'] = self._parse_string_list(items)
        
        elif component_type == 'CHECKBOX':
            field['CheckboxValue'] = properties.get('Checked', 'False') == 'True'
        
        elif component_type == 'DATEPKR' or component_type == 'DATEPICKER':
            field['format'] = 'DD/MM/YYYY'
            if 'EditMask' in properties:
                field['editMask'] = properties['EditMask']
        
        elif component_type == 'GRIDLKP' or component_type == 'LSTLKP':
            field['KeyColumn'] = properties.get('DisplayPanelField', 'ID')
            field['showAliasBox'] = properties.get('ShowButton', 'True') == 'True'
        
        # Add common properties
        if 'Required' in properties:
            field['Required'] = properties['Required'] == 'True'
        if 'Visible' in properties:
            field['Visible'] = properties['Visible'] != 'False'
    
    def _parse_string_list(self, items_string: str) -> Dict[str, str]:
        """Parse Delphi string list into options dictionary"""
        options = {}
        # Extract items from parentheses
        match = re.search(r'\((.*?)\)', items_string, re.DOTALL)
        if match:
            items = match.group(1).split("'")
            for item in items:
                item = item.strip().strip("'").strip()
                if item and item not in [',', '']:
                    options[item] = item
        return options
    
    def _generate_validation_rules(self) -> List[Dict[str, Any]]:
        """Generate validation rules based on available operators"""
        validation_rules = []
        
        for i, operator in enumerate(self.operators_info.get('operators', [])[:3]):  # Limit to 3 examples
            rule = {
                "Id": f"validation_{i+1}",
                "Type": "ERROR",
                "Message": f"Validation rule using {operator.get('name', operator.get('code', 'UNKNOWN'))}",
                "CondExpression": {
                    "LogicalOperator": "AND",
                    "Conditions": [{
                        "Operator": operator.get('code', 'EQ'),
                        "Value": "sample_value",
                        "ValueType": "STRING"
                    }]
                }
            }
            validation_rules.append(rule)
        
        return validation_rules

# Streamlit UI
def main():
    st.set_page_config(
        page_title="AI FormBuilder Chatbot",
        page_icon="🤖",
        layout="wide"
    )
    
    st.title("🤖 AI FormBuilder Chatbot")
    st.markdown("### Intelligent DFM to JSON Converter with AI Assistant")
    
    # Sidebar for file uploads
    with st.sidebar:
        st.header("📁 File Upload")
        
        dfm_file = st.file_uploader(
            "Upload DFM File", 
            type=['dfm', 'txt'],
            help="Upload your Delphi form file (.dfm)"
        )
        
        info_file = st.file_uploader(
            "Upload Info File", 
            type=['txt'],
            help="Upload your operators/types information file"
        )
        
        st.header("⚙️ Settings")
        auto_generate = st.checkbox("Auto-generate on file upload", value=True)
        include_validations = st.checkbox("Include validation rules", value=True)
        
        if st.button("🔄 Clear Chat History"):
            st.session_state.messages = []
            st.rerun()
    
    # Initialize session state
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "generated_json" not in st.session_state:
        st.session_state.generated_json = None
    
    # Main content area
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header("💬 AI Chat Interface")
        
        # Display chat messages
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
        
        # Chat input
        if prompt := st.chat_input("Ask me anything about form generation or discuss your files..."):
            # Add user message to chat history
            st.session_state.messages.append({"role": "user", "content": prompt})
            
            # Display user message
            with st.chat_message("user"):
                st.markdown(prompt)
            
            # Generate AI response
            with st.chat_message("assistant"):
                with st.spinner("Thinking..."):
                    response = get_ai_response(prompt, st.session_state.generated_json)
                    st.markdown(response)
            
            # Add assistant response to chat history
            st.session_state.messages.append({"role": "assistant", "content": response})
    
    with col2:
        st.header("📋 Generated JSON")
        
        # Process files if uploaded
        if dfm_file and info_file and auto_generate:
            process_files(dfm_file, info_file, include_validations)
        
        # Manual processing button
        if dfm_file and info_file and not auto_generate:
            if st.button("🚀 Generate JSON", type="primary"):
                process_files(dfm_file, info_file, include_validations)
        
        # Display generated JSON
        if st.session_state.generated_json:
            with st.expander("📝 View Generated JSON", expanded=True):
                st.json(st.session_state.generated_json)
            
            # Download button
            json_str = json.dumps(st.session_state.generated_json, indent=2)
            st.download_button(
                label="📥 Download JSON",
                data=json_str,
                file_name="generated_form.json",
                mime="application/json"
            )
            
            # Analysis metrics
            st.subheader("📊 Analysis Metrics")
            fields_count = len(st.session_state.generated_json.get('fields', []))
            validations_count = len(st.session_state.generated_json.get('validations', []))
            
            col_a, col_b = st.columns(2)
            with col_a:
                st.metric("Fields", fields_count)
            with col_b:
                st.metric("Validations", validations_count)

def process_files(dfm_file, info_file, include_validations):
    """Process uploaded files and generate JSON"""
    try:
        # Read file contents
        dfm_content = dfm_file.read().decode('utf-8')
        info_content = info_file.read().decode('utf-8')
        
        # Parse files
        dfm_parser = DelphiFormParser()
        form_data = dfm_parser.parse_dfm_content(dfm_content)
        
        operator_parser = OperatorParser()
        operators_info = operator_parser.parse_info_content(info_content)
        
        # Generate JSON
        json_generator = JSONGenerator(operators_info)
        generated_json = json_generator.generate_form_json(form_data)
        
        # Store in session state
        st.session_state.generated_json = generated_json
        
        # Add success message to chat
        success_msg = f"✅ Successfully processed files! Generated form with {len(generated_json['fields'])} fields and {len(generated_json['validations'])} validation rules."
        st.session_state.messages.append({"role": "assistant", "content": success_msg})
        
        st.success("Files processed successfully!")
        
    except Exception as e:
        error_msg = f"❌ Error processing files: {str(e)}"
        st.error(error_msg)
        st.session_state.messages.append({"role": "assistant", "content": error_msg})

def get_ai_response(prompt: str, context_json: Dict[str, Any] = None) -> str:
    """Generate AI response using OpenAI"""
    try:
        # Check if OpenAI API key is available
        if not openai.api_key:
            return "⚠️ OpenAI API key not configured. Please add your OPENAI_API_KEY to the secrets."
        
        # Build context
        context = "You are an AI assistant specialized in form generation and Delphi/DFM file analysis. "
        context += "You help users convert legacy Delphi forms to modern JSON configurations. "
        
        if context_json:
            context += f"\n\nCurrent generated JSON context: {json.dumps(context_json, indent=2)[:1000]}..."
        
        # Create conversation
        messages = [
            {"role": "system", "content": context},
            {"role": "user", "content": prompt}
        ]
        
        # Get AI response
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        return f"❌ Error generating AI response: {str(e)}"

if __name__ == "__main__":
    main()