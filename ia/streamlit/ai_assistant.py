#!/usr/bin/env python3
"""
AI Assistant pour FormBuilder Pro
Système intelligent de génération de formulaires JSON à partir de fichiers DFM et Info
"""

import streamlit as st
import json
import re
import os
from typing import Dict, List, Any, Optional
import pandas as pd
from datetime import datetime

# Configuration de la page
st.set_page_config(
    page_title="FormBuilder AI Assistant",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

class FormGeneratorAI:
    """Intelligence artificielle pour la génération de formulaires"""
    
    def __init__(self):
        self.component_mappings = {
            'TDBEdit': 'TEXT',
            'TDBComboBox': 'SELECT',
            'TDBDateTimePicker': 'DATEPICKER',
            'TDBCheckBox': 'CHECKBOX',
            'TDBRadioGroup': 'RADIO',
            'TDBMemo': 'TEXTAREA',
            'TDBSpinEdit': 'NUMERIC',
            'TDBLookupComboBox': 'LSTLKP',
            'TDBGrid': 'GRIDLKP',
            'TPanel': 'GROUP',
            'TGroupBox': 'GROUP',
            'TButton': 'BUTTON',
            'TLabel': 'LABEL'
        }
        
        self.validation_operators = {
            'required': 'ISNN',
            'not_null': 'ISNN',
            'is_null': 'ISN',
            'equal': 'EQ',
            'not_equal': 'NE',
            'greater_than': 'GT',
            'less_than': 'LT',
            'greater_equal': 'GE',
            'less_equal': 'LE'
        }

    def parse_dfm_content(self, content: str) -> Dict[str, Any]:
        """Parse le contenu d'un fichier DFM et extrait les composants"""
        try:
            components = []
            form_properties = {}
            
            # Extraction du nom du formulaire
            form_match = re.search(r'object\s+(\w+):\s*TForm', content, re.IGNORECASE)
            if form_match:
                form_properties['name'] = form_match.group(1)
            
            # Extraction des propriétés du formulaire
            caption_match = re.search(r'Caption\s*=\s*[\'"]([^\'"]+)[\'"]', content)
            if caption_match:
                form_properties['caption'] = caption_match.group(1)
            
            # Extraction de la largeur
            width_match = re.search(r'Width\s*=\s*(\d+)', content)
            if width_match:
                form_properties['width'] = f"{width_match.group(1)}px"
            
            # Extraction des composants
            component_pattern = r'object\s+(\w+):\s*(\w+).*?end'
            matches = re.finditer(component_pattern, content, re.DOTALL | re.IGNORECASE)
            
            for match in matches:
                component_name = match.group(1)
                component_type = match.group(2)
                component_block = match.group(0)
                
                # Skip le formulaire principal
                if component_type.lower() in ['tform', 'form']:
                    continue
                
                component = self._parse_component_properties(component_name, component_type, component_block)
                if component:
                    components.append(component)
            
            return {
                'form_properties': form_properties,
                'components': components
            }
            
        except Exception as e:
            st.error(f"Erreur lors du parsing DFM: {str(e)}")
            return {'form_properties': {}, 'components': []}

    def _parse_component_properties(self, name: str, comp_type: str, block: str) -> Dict[str, Any]:
        """Parse les propriétés d'un composant individuel"""
        component = {
            'name': name,
            'delphi_type': comp_type,
            'json_type': self.component_mappings.get(comp_type, 'TEXT'),
            'properties': {}
        }
        
        # Extraction des propriétés communes
        properties_to_extract = [
            ('Caption', r'Caption\s*=\s*[\'"]([^\'"]+)[\'"]'),
            ('Text', r'Text\s*=\s*[\'"]([^\'"]+)[\'"]'),
            ('Enabled', r'Enabled\s*=\s*(\w+)'),
            ('Visible', r'Visible\s*=\s*(\w+)'),
            ('Required', r'Required\s*=\s*(\w+)'),
            ('Left', r'Left\s*=\s*(\d+)'),
            ('Top', r'Top\s*=\s*(\d+)'),
            ('Width', r'Width\s*=\s*(\d+)'),
            ('Height', r'Height\s*=\s*(\d+)'),
            ('TabOrder', r'TabOrder\s*=\s*(\d+)')
        ]
        
        for prop_name, pattern in properties_to_extract:
            match = re.search(pattern, block, re.IGNORECASE)
            if match:
                value = match.group(1)
                # Conversion des valeurs boolean
                if value.lower() in ['true', 'false']:
                    component['properties'][prop_name] = value.lower() == 'true'
                elif value.isdigit():
                    component['properties'][prop_name] = int(value)
                else:
                    component['properties'][prop_name] = value
        
        return component

    def parse_info_content(self, content: str) -> Dict[str, Any]:
        """Parse le contenu du fichier Info pour extraire les métadonnées"""
        try:
            info_data = {
                'fields': [],
                'validations': [],
                'entities': [],
                'endpoints': []
            }
            
            lines = content.split('\n')
            current_section = None
            
            for line in lines:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                
                # Détection des sections
                if line.startswith('[') and line.endswith(']'):
                    current_section = line[1:-1].lower()
                    continue
                
                # Parse selon la section
                if current_section == 'fields':
                    field_info = self._parse_field_info(line)
                    if field_info:
                        info_data['fields'].append(field_info)
                        
                elif current_section == 'validations':
                    validation_info = self._parse_validation_info(line)
                    if validation_info:
                        info_data['validations'].append(validation_info)
                        
                elif current_section == 'entities':
                    entity_info = self._parse_entity_info(line)
                    if entity_info:
                        info_data['entities'].append(entity_info)
            
            return info_data
            
        except Exception as e:
            st.error(f"Erreur lors du parsing Info: {str(e)}")
            return {'fields': [], 'validations': [], 'entities': [], 'endpoints': []}

    def _parse_field_info(self, line: str) -> Optional[Dict[str, Any]]:
        """Parse une ligne d'information de champ"""
        try:
            # Format: FieldName|Type|Required|Entity|Description
            parts = line.split('|')
            if len(parts) >= 3:
                return {
                    'name': parts[0].strip(),
                    'type': parts[1].strip(),
                    'required': parts[2].strip().lower() == 'true',
                    'entity': parts[3].strip() if len(parts) > 3 else None,
                    'description': parts[4].strip() if len(parts) > 4 else None
                }
        except:
            pass
        return None

    def _parse_validation_info(self, line: str) -> Optional[Dict[str, Any]]:
        """Parse une ligne d'information de validation"""
        try:
            # Format: FieldName|Operator|Value|Message|Type
            parts = line.split('|')
            if len(parts) >= 4:
                return {
                    'field': parts[0].strip(),
                    'operator': parts[1].strip(),
                    'value': parts[2].strip(),
                    'message': parts[3].strip(),
                    'type': parts[4].strip() if len(parts) > 4 else 'ERROR'
                }
        except:
            pass
        return None

    def _parse_entity_info(self, line: str) -> Optional[Dict[str, Any]]:
        """Parse une ligne d'information d'entité"""
        try:
            # Format: EntityName|KeyField|Endpoint|Columns
            parts = line.split('|')
            if len(parts) >= 2:
                return {
                    'name': parts[0].strip(),
                    'key_field': parts[1].strip(),
                    'endpoint': parts[2].strip() if len(parts) > 2 else None,
                    'columns': parts[3].strip().split(',') if len(parts) > 3 else []
                }
        except:
            pass
        return None

    def generate_form_json(self, dfm_data: Dict[str, Any], info_data: Dict[str, Any], form_id: str) -> Dict[str, Any]:
        """Génère la configuration JSON finale du formulaire"""
        
        form_props = dfm_data.get('form_properties', {})
        components = dfm_data.get('components', [])
        
        # Structure de base du formulaire
        form_json = {
            "MenuID": form_id.upper(),
            "Label": form_props.get('caption', form_id.upper()),
            "FormWidth": form_props.get('width', '700px'),
            "Layout": "PROCESS",
            "Fields": [],
            "Actions": [
                {
                    "ID": "PROCESS",
                    "Label": "PROCESS",
                    "MethodToInvoke": f"Execute{form_id.title()}"
                }
            ],
            "Validations": []
        }
        
        # Génération des champs
        for component in components:
            if component['json_type'] in ['LABEL', 'BUTTON']:
                continue  # Skip les labels et boutons pour les champs
                
            field = self._generate_field_json(component, info_data)
            if field:
                form_json["Fields"].append(field)
        
        # Génération des validations
        validations = self._generate_validations(components, info_data)
        form_json["Validations"] = validations
        
        return form_json

    def _generate_field_json(self, component: Dict[str, Any], info_data: Dict[str, Any]) -> Dict[str, Any]:
        """Génère la configuration JSON d'un champ"""
        
        field = {
            "Id": component['name'],
            "label": component['properties'].get('Caption', component['name']).upper(),
            "type": component['json_type'],
            "required": component['properties'].get('Required', False)
        }
        
        # Ajout de propriétés spécifiques selon le type
        if component['json_type'] in ['GRIDLKP', 'LSTLKP']:
            entity_info = self._find_entity_info(component['name'], info_data)
            if entity_info:
                field.update({
                    "EntitykeyField": entity_info['key_field'],
                    "Entity": entity_info['name'],
                    "endpoint": entity_info.get('endpoint'),
                    "ColumnDefinitions": self._generate_column_definitions(entity_info)
                })
        
        elif component['json_type'] == 'SELECT':
            # Recherche des options dans info_data
            options = self._find_field_options(component['name'], info_data)
            if options:
                field["Options"] = options
        
        elif component['json_type'] == 'NUMERIC':
            field["DataType"] = "NUMERIC"
        
        elif component['json_type'] == 'DATEPICKER':
            field["DataType"] = "DATE"
        
        # Propriétés de visibilité et activation
        if not component['properties'].get('Enabled', True):
            field["EnabledWhen"] = {
                "Conditions": [
                    {
                        "RightField": "AlwaysFalse",
                        "Operator": "IST"
                    }
                ]
            }
        
        if not component['properties'].get('Visible', True):
            field["VisibleWhen"] = {
                "Conditions": [
                    {
                        "RightField": "AlwaysFalse",
                        "Operator": "IST"
                    }
                ]
            }
        
        return field

    def _find_entity_info(self, field_name: str, info_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Trouve les informations d'entité pour un champ"""
        for field_info in info_data.get('fields', []):
            if field_info['name'].lower() == field_name.lower() and field_info.get('entity'):
                for entity in info_data.get('entities', []):
                    if entity['name'].lower() == field_info['entity'].lower():
                        return entity
        return None

    def _generate_column_definitions(self, entity_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Génère les définitions de colonnes pour une entité"""
        columns = []
        for col in entity_info.get('columns', []):
            columns.append({
                "DataField": col.strip(),
                "Caption": col.strip().replace('_', ' ').title(),
                "DataType": "STRING"
            })
        return columns

    def _find_field_options(self, field_name: str, info_data: Dict[str, Any]) -> Optional[List[Dict[str, str]]]:
        """Trouve les options pour un champ SELECT"""
        # Cette méthode peut être étendue pour parser des options spécifiques
        return None

    def _generate_validations(self, components: List[Dict[str, Any]], info_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Génère les validations du formulaire"""
        validations = []
        validation_id = 1
        
        # Validations basées sur les propriétés des composants
        for component in components:
            if component['properties'].get('Required', False):
                validations.append({
                    "Id": str(validation_id),
                    "Type": "ERROR",
                    "Message": f"{component['properties'].get('Caption', component['name'])} is required",
                    "CondExpression": {
                        "Conditions": [
                            {
                                "RightField": component['name'],
                                "Operator": "ISN"
                            }
                        ]
                    }
                })
                validation_id += 1
        
        # Validations basées sur les informations du fichier Info
        for validation_info in info_data.get('validations', []):
            validations.append({
                "Id": str(validation_id),
                "Type": validation_info.get('type', 'ERROR'),
                "Message": validation_info['message'],
                "CondExpression": {
                    "Conditions": [
                        {
                            "RightField": validation_info['field'],
                            "Operator": self.validation_operators.get(validation_info['operator'], validation_info['operator']),
                            "Value": validation_info['value'] if validation_info['value'] != 'NULL' else None,
                            "ValueType": self._detect_value_type(validation_info['value'])
                        }
                    ]
                }
            })
            validation_id += 1
        
        return validations

    def _detect_value_type(self, value: str) -> str:
        """Détecte le type de valeur pour les validations"""
        if value.upper() in ['TRUE', 'FALSE']:
            return "BOOL"
        elif value.replace('.', '').replace('-', '').isdigit():
            return "NUMERIC"
        elif value.upper() in ['SYSDATE', 'NOW()']:
            return "DATE"
        else:
            return "STRING"

def main():
    """Interface principale Streamlit"""
    
    # En-tête avec style
    st.markdown("""
    <div style="text-align: center; padding: 2rem 0;">
        <h1 style="color: #2E86AB; font-size: 3rem; margin-bottom: 0.5rem;">🤖 FormBuilder AI Assistant</h1>
        <p style="color: #666; font-size: 1.2rem;">Intelligence artificielle pour la génération de formulaires JSON</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Initialize session state
    if 'form_generator' not in st.session_state:
        st.session_state.form_generator = FormGeneratorAI()
    
    # Sidebar pour les options
    with st.sidebar:
        st.markdown("### ⚙️ Configuration")
        form_id = st.text_input("ID du formulaire", value="NEWFORM", help="Identifiant unique du formulaire")
        
        st.markdown("### 📤 Upload de fichiers")
        dfm_file = st.file_uploader("Fichier DFM/Delphi", type=['dfm', 'txt'], help="Fichier de définition Delphi")
        info_file = st.file_uploader("Fichier Info", type=['txt', 'info'], help="Fichier d'informations complémentaires")
        
        st.markdown("### 🎯 Actions rapides")
        if st.button("🔥 Générer BUYTYP", use_container_width=True):
            st.session_state.generate_buytyp = True
    
    # Interface principale à deux colonnes
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 📝 Chat avec l'IA")
        
        # Zone de chat
        if 'messages' not in st.session_state:
            st.session_state.messages = [
                {"role": "assistant", "content": "Bonjour ! Je suis votre assistant IA FormBuilder. Uploadez vos fichiers DFM et Info, ou posez-moi des questions sur la génération de formulaires."}
            ]
        
        # Affichage des messages
        chat_container = st.container()
        with chat_container:
            for message in st.session_state.messages:
                with st.chat_message(message["role"]):
                    st.markdown(message["content"])
        
        # Input de chat
        if prompt := st.chat_input("Posez votre question..."):
            st.session_state.messages.append({"role": "user", "content": prompt})
            
            with st.chat_message("user"):
                st.markdown(prompt)
            
            with st.chat_message("assistant"):
                response = generate_ai_response(prompt, dfm_file, info_file, form_id)
                st.markdown(response)
                st.session_state.messages.append({"role": "assistant", "content": response})
    
    with col2:
        st.markdown("### 🔧 Génération de formulaire")
        
        # Génération automatique BUYTYP
        if st.session_state.get('generate_buytyp', False):
            generate_buytyp_form()
            st.session_state.generate_buytyp = False
        
        # Traitement des fichiers uploadés
        if dfm_file is not None or info_file is not None:
            process_uploaded_files(dfm_file, info_file, form_id)

def generate_ai_response(prompt: str, dfm_file, info_file, form_id: str) -> str:
    """Génère une réponse IA contextuelle"""
    
    form_generator = st.session_state.form_generator
    
    if dfm_file is not None and info_file is not None:
        if 'field' in prompt.lower() or 'champ' in prompt.lower():
            return f"Votre formulaire {form_id} contient plusieurs champs avec des composants de lookup et des validations. Je peux analyser la structure détaillée si vous le souhaitez."
        elif 'validation' in prompt.lower():
            return "Le formulaire inclut des règles de validation avec des opérateurs logiques et des conditions. Je peux générer les validations appropriées."
        elif 'génér' in prompt.lower() or 'crée' in prompt.lower():
            return "Je vais analyser vos fichiers et générer la configuration JSON complète. Veuillez patienter..."
        else:
            return "Je peux vous aider à comprendre la structure du formulaire, analyser les composants, ou générer la configuration JSON. Que souhaitez-vous faire ?"
    else:
        return "Veuillez d'abord uploader vos fichiers DFM et Info pour que je puisse vous fournir une assistance personnalisée sur votre formulaire."

def generate_buytyp_form():
    """Génère le formulaire BUYTYP basé sur le fichier attaché"""
    
    buytyp_config = {
        "MenuID": "BUYTYP",
        "Label": "BUYTYP",
        "FormWidth": "600px",
        "Layout": "PROCESS",
        "Fields": [
            {
                "Id": "FundID",
                "label": "FUND",
                "type": "GRIDLKP",
                "required": True,
                "showAliasBox": True,
                "EntitykeyField": "fund",
                "Entity": "Fndmas",
                "EndpointOnchange": True,
                "ColumnDefinitions": [
                    {"DataField": "fund", "Caption": "Fund ID", "DataType": "STRING"},
                    {"DataField": "acnam1", "Caption": "Fund Name", "DataType": "STRING"},
                    {"DataField": "inactive", "ExcludeFromGrid": True, "DataType": "STRING"}
                ]
            },
            {
                "Id": "Ticker",
                "label": "TKR",
                "type": "GRIDLKP",
                "required": True,
                "EntitykeyField": "tkr",
                "Entity": "Secrty",
                "EndpointOnchange": True,
                "ColumnDefinitions": [
                    {"DataField": "tkr", "Caption": "Ticker", "DataType": "STRING"},
                    {"DataField": "tkr_DESC", "Caption": "Ticker Desc", "DataType": "STRING"}
                ]
            },
            {
                "Id": "TradeDate",
                "label": "TRADEDATE",
                "type": "DATEPKR",
                "required": True
            },
            {
                "Id": "Broker",
                "label": "BROKER",
                "type": "GRIDLKP",
                "required": True,
                "EntitykeyField": "broker",
                "Entity": "Broker"
            },
            {
                "Id": "Quantity",
                "label": "QUANTITY",
                "type": "NUMERIC",
                "required": True
            }
        ],
        "Actions": [
            {
                "ID": "PROCESS",
                "Label": "PROCESS",
                "MethodToInvoke": "ExecuteBuyTyp"
            }
        ],
        "Validations": [
            {
                "Id": "1",
                "Type": "ERROR",
                "Message": "Fund is required",
                "CondExpression": {
                    "Conditions": [{"RightField": "FundID", "Operator": "ISN"}]
                }
            },
            {
                "Id": "2",
                "Type": "ERROR",
                "Message": "Ticker is required",
                "CondExpression": {
                    "Conditions": [{"RightField": "Ticker", "Operator": "ISN"}]
                }
            }
        ]
    }
    
    st.success("✅ Configuration BUYTYP générée avec succès !")
    
    # Affichage du JSON
    st.json(buytyp_config)
    
    # Bouton de téléchargement
    json_str = json.dumps(buytyp_config, indent=2, ensure_ascii=False)
    st.download_button(
        label="📥 Télécharger BUYTYP.json",
        data=json_str,
        file_name="buytyp_form.json",
        mime="application/json"
    )

def process_uploaded_files(dfm_file, info_file, form_id: str):
    """Traite les fichiers uploadés et génère le formulaire"""
    
    form_generator = st.session_state.form_generator
    
    try:
        dfm_data = {}
        info_data = {}
        
        if dfm_file is not None:
            dfm_content = dfm_file.read().decode('utf-8')
            dfm_data = form_generator.parse_dfm_content(dfm_content)
            st.success(f"✅ Fichier DFM analysé: {len(dfm_data.get('components', []))} composants trouvés")
        
        if info_file is not None:
            info_content = info_file.read().decode('utf-8')
            info_data = form_generator.parse_info_content(info_content)
            st.success(f"✅ Fichier Info analysé: {len(info_data.get('fields', []))} champs, {len(info_data.get('validations', []))} validations")
        
        if dfm_data or info_data:
            if st.button("🚀 Générer configuration JSON", use_container_width=True):
                with st.spinner("Génération en cours..."):
                    form_json = form_generator.generate_form_json(dfm_data, info_data, form_id)
                    
                    st.success("✅ Configuration JSON générée avec succès !")
                    st.json(form_json)
                    
                    # Téléchargement
                    json_str = json.dumps(form_json, indent=2, ensure_ascii=False)
                    st.download_button(
                        label=f"📥 Télécharger {form_id.lower()}_form.json",
                        data=json_str,
                        file_name=f"{form_id.lower()}_form.json",
                        mime="application/json"
                    )
    
    except Exception as e:
        st.error(f"Erreur lors du traitement: {str(e)}")

if __name__ == "__main__":
    main()