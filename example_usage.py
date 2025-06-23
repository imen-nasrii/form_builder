#!/usr/bin/env python3
"""
Example usage and training script for the AI FormBuilder Chatbot
This demonstrates how to use the parser classes independently
"""

import json
from ai_chatbot import DelphiFormParser, OperatorParser, JSONGenerator, ComponentTypeMapper

def example_dfm_parsing():
    """Example of parsing DFM content"""
    print("=== DFM Parsing Example ===")
    
    # Sample DFM content (simplified)
    sample_dfm = """
    inherited frmACCADJ: TfrmACCADJ
      Left = 958
      Top = 105
      Caption = 'Fixed Income Accrual Adjustments'
      ClientHeight = 399
      ClientWidth = 594
      
      object fndlkup1: TMFWFndAliasLookup
        Left = 178
        Top = 4
        Width = 85
        Height = 21
        LabelCaption = 'Fund'
        Required = False
        ShowButton = True
      end
      
      object cbReportOnly: TSSICheckBox
        Left = 12
        Top = 36
        Width = 144
        Height = 18
        Caption = 'Process Report Only'
        TabOrder = 2
      end
    end
    """
    
    parser = DelphiFormParser()
    result = parser.parse_dfm_content(sample_dfm)
    
    print("Parsed Form Properties:")
    print(json.dumps(result['form_properties'], indent=2))
    print("\nParsed Components:")
    print(json.dumps(result['components'], indent=2))
    
    return result

def example_info_parsing():
    """Example of parsing info file content"""
    print("\n=== Info File Parsing Example ===")
    
    sample_info = """
    LogicalOperator
    {
        And,
        Or
    }
    
    Operators 
    [EnumMember(Value = "EQUAL")] EQ,     //EQUAL
    [EnumMember(Value = "NEQUAL")] NEQ,    //NOT EQUAL 
    [EnumMember(Value = "CONTAIN")] CT,     //CONTAINS
    
    Types
    STRING,
    DATE,
    NUMERIC,
    INTEGER,
    BOOL
    """
    
    parser = OperatorParser()
    result = parser.parse_info_content(sample_info)
    
    print("Parsed Operators and Types:")
    print(json.dumps(result, indent=2))
    
    return result

def example_json_generation():
    """Example of complete JSON generation"""
    print("\n=== JSON Generation Example ===")
    
    # Get sample data
    form_data = example_dfm_parsing()
    operators_info = example_info_parsing()
    
    # Generate JSON
    generator = JSONGenerator(operators_info)
    json_result = generator.generate_form_json(form_data)
    
    print("\nGenerated JSON Configuration:")
    print(json.dumps(json_result, indent=2))
    
    # Save to file
    with open('example_output.json', 'w') as f:
        json.dump(json_result, f, indent=2)
    
    print("\n✅ JSON saved to 'example_output.json'")
    
    return json_result

def example_component_mapping():
    """Example of component type mapping"""
    print("\n=== Component Mapping Example ===")
    
    delphi_components = [
        'TSSICheckBox',
        'TSSIComboBox', 
        'TMFWFndAliasLookup',
        'TButton',
        'TSsiRadioGroup',
        'TGisDateEdit',
        'TEdit',
        'TMemo'
    ]
    
    print("Delphi Component → Modern Field Type:")
    for component in delphi_components:
        mapped_type = ComponentTypeMapper.map_component_type(component)
        print(f"  {component} → {mapped_type}")

def training_data_examples():
    """Generate training examples for AI model"""
    print("\n=== Training Data Examples ===")
    
    training_examples = [
        {
            "input": "How do I convert a TSSICheckBox to JSON?",
            "output": "A TSSICheckBox maps to a CHECKBOX field type with properties like 'CheckboxValue' for the default state and 'Required' for validation."
        },
        {
            "input": "What is the JSON structure for a lookup component?",
            "output": "Lookup components (GRIDLKP/LSTLKP) include properties like 'KeyColumn' for the primary key, 'showAliasBox' for button display, and 'EntityKeyField' for data binding."
        },
        {
            "input": "How are validation rules structured?",
            "output": "Validation rules have an 'Id', 'Type' (ERROR/WARNING), 'Message', and 'CondExpression' with LogicalOperator and Conditions array using operators like EQ, NEQ, CT, etc."
        }
    ]
    
    print("Sample Training Data:")
    for i, example in enumerate(training_examples, 1):
        print(f"\nExample {i}:")
        print(f"Input: {example['input']}")
        print(f"Output: {example['output']}")
    
    # Save training data
    with open('training_examples.json', 'w') as f:
        json.dump(training_examples, f, indent=2)
    
    print("\n✅ Training examples saved to 'training_examples.json'")

def analyze_complex_form():
    """Analyze a more complex form structure"""
    print("\n=== Complex Form Analysis ===")
    
    # Read the actual uploaded DFM file content
    with open('attached_assets/ui_AccAdj (2) (1)_1750678776188.dfm', 'r') as f:
        dfm_content = f.read()
    
    with open('attached_assets/Information (1) (2)_1750678776189.txt', 'r') as f:
        info_content = f.read()
    
    # Parse the files
    dfm_parser = DelphiFormParser()
    form_data = dfm_parser.parse_dfm_content(dfm_content)
    
    operator_parser = OperatorParser()
    operators_info = operator_parser.parse_info_content(info_content)
    
    # Generate comprehensive JSON
    generator = JSONGenerator(operators_info)
    final_json = generator.generate_form_json(form_data)
    
    # Analysis
    print(f"Form Name: {final_json['menuId']}")
    print(f"Form Label: {final_json['label']}")
    print(f"Total Fields: {len(final_json['fields'])}")
    print(f"Total Validations: {len(final_json['validations'])}")
    print(f"Available Operators: {len(operators_info['operators'])}")
    print(f"Available Types: {len(operators_info['types'])}")
    
    # Save comprehensive output
    with open('comprehensive_form.json', 'w') as f:
        json.dump(final_json, f, indent=2)
    
    print("\n✅ Comprehensive form saved to 'comprehensive_form.json'")
    
    return final_json

if __name__ == "__main__":
    print("🤖 AI FormBuilder Chatbot - Example Usage & Training")
    print("=" * 60)
    
    try:
        # Run all examples
        example_dfm_parsing()
        example_info_parsing()
        example_json_generation()
        example_component_mapping()
        training_data_examples()
        analyze_complex_form()
        
        print("\n🎉 All examples completed successfully!")
        print("Files generated:")
        print("  - example_output.json")
        print("  - training_examples.json")
        print("  - comprehensive_form.json")
        
    except Exception as e:
        print(f"\n❌ Error during execution: {e}")
        import traceback
        traceback.print_exc()