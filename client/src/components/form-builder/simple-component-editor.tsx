import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus } from "lucide-react";
import type { FormField } from "@/lib/form-types";

interface SimpleComponentEditorProps {
  editingComponent: FormField | null;
  isOpen: boolean;
  onClose: () => void;
  setEditingComponent: (component: FormField) => void;
  onSave: () => void;
  isDarkMode: boolean;
}

export default function SimpleComponentEditor({
  editingComponent,
  isOpen,
  onClose,
  setEditingComponent,
  onSave,
  isDarkMode
}: SimpleComponentEditorProps) {
  if (!editingComponent) return null;

  // Propriétés requises qui ne peuvent pas être supprimées
  const requiredProperties = ['type', 'id', 'label'];
  
  // Définitions détaillées des propriétés avec descriptions
  const propertyDefinitions: Record<string, { name: string; description: string; type: string }> = {
    // Propriétés de base
    type: { name: 'Component Type', description: 'Type of the form component', type: 'String' },
    id: { name: 'Id', description: 'Unique field identifier.', type: 'String' },
    label: { name: 'Label', description: 'Field display label.', type: 'String' },
    
    // Propriétés d'apparence et comportement
    icon: { name: 'Icon', description: 'Icon configuration for the component', type: 'Object' },
    color: { name: 'Color', description: 'Color theme for the component', type: 'String' },
    category: { name: 'Category', description: 'Component category classification', type: 'String' },
    
    // Propriétés de mise en page
    inline: { name: 'Inline', description: 'Indicates if the field should be displayed inline.', type: 'Boolean' },
    width: { name: 'Width', description: 'Field width (e.g. "32")', type: 'String' },
    
    // Propriétés spécifiques aux lookups et grilles (GRIDLKP, LSTLKP)
    keyColumn: { name: 'Key Column', description: 'Key column in the data model for search/lookup', type: 'String' },
    mainProperty: { name: 'Main Property', description: 'Main property to display for the element', type: 'String' },
    descriptionProperty: { name: 'Description Property', description: 'Property containing the element description', type: 'String' },
    showDescription: { name: 'Show Description', description: 'Indicates if the description should be displayed', type: 'Boolean' },
    loadDataInfo: { name: 'Data Model', description: 'MFact model name for data loading', type: 'String' },
    columnsDefinition: { name: 'Columns Definition', description: 'Defines columns configuration (JSON format)', type: 'Array of Objects' },
    
    // Propriétés spécifiques aux options (Radio, Select, Checkbox)
    options: { name: 'Options', description: 'List of available options', type: 'Array of Objects' },
    orientation: { name: 'Orientation', description: 'Layout orientation (horizontal/vertical)', type: 'String' },
    selectedValue: { name: 'Selected Value', description: 'Currently selected option value', type: 'String' },
    name: { name: 'Name', description: 'Field name attribute', type: 'String' },
    
    // Propriétés spécifiques aux inputs
    size: { name: 'Size', description: 'Field size (small, medium, large)', type: 'String' },
    variant: { name: 'Variant', description: 'Field variant style', type: 'String' },
    
    // Propriétés spécifiques aux boutons
    buttonType: { name: 'Button Type', description: 'Type of button (submit, button, reset)', type: 'String' },
    buttonStyle: { name: 'Button Style', description: 'Button visual style', type: 'String' },
    
    // Propriétés spécifiques aux grilles/tables
    columns: { name: 'Columns', description: 'Table column definitions', type: 'Array of Objects' },
    rows: { name: 'Rows', description: 'Table row data', type: 'Array of Objects' },
    sortable: { name: 'Sortable', description: 'Enable column sorting', type: 'Boolean' },
    filterable: { name: 'Filterable', description: 'Enable column filtering', type: 'Boolean' },
    
    // Propriétés spécifiques aux lookup/dropdown
    dataSource: { name: 'Data Source', description: 'Data source for lookup values', type: 'String' },
    displayField: { name: 'Display Field', description: 'Field to display in dropdown', type: 'String' },
    valueField: { name: 'Value Field', description: 'Field to use as value', type: 'String' },
    
    // Propriétés de validation avancées
    validationRules: { name: 'Validation Rules', description: 'Custom validation rules', type: 'Array of Objects' },
    customValidator: { name: 'Custom Validator', description: 'Custom validation function', type: 'Function' },
    placeholder: { name: 'Placeholder', description: 'Placeholder text for the input field', type: 'String' },
    defaultValue: { name: 'Default Value', description: 'Default value for the field', type: 'String' },
    helpText: { name: 'Help Text', description: 'Help text displayed below the field', type: 'String' },
    required: { name: 'Required', description: 'Indicates if the field is mandatory', type: 'Boolean' },
    disabled: { name: 'Disabled', description: 'Indicates if the field is disabled', type: 'Boolean' },
    readonly: { name: 'Read Only', description: 'Indicates if the field is read-only', type: 'Boolean' },
    minLength: { name: 'Min Length', description: 'Minimum length for text input', type: 'Number' },
    maxLength: { name: 'Max Length', description: 'Maximum length for text input', type: 'Number' },
    pattern: { name: 'Pattern', description: 'Regular expression pattern for validation', type: 'String' },
    errorMessage: { name: 'Error Message', description: 'Custom error message for validation', type: 'String' },
    cssClasses: { name: 'CSS Classes', description: 'Custom CSS classes for styling', type: 'String' },
    dataAttributes: { name: 'Data Attributes', description: 'Custom data attributes', type: 'String' },
    height: { name: 'Height', description: 'Field height', type: 'String' },
    margin: { name: 'Margin', description: 'Field margin', type: 'String' },
    padding: { name: 'Padding', description: 'Field padding', type: 'String' },
    fontSize: { name: 'Font Size', description: 'Text font size', type: 'String' },
    fontWeight: { name: 'Font Weight', description: 'Text font weight', type: 'String' },
    textColor: { name: 'Text Color', description: 'Text color', type: 'String' },
    backgroundColor: { name: 'Background Color', description: 'Background color', type: 'String' },
    border: { name: 'Border', description: 'Border style', type: 'String' },
    borderRadius: { name: 'Border Radius', description: 'Border radius', type: 'String' },
    opacity: { name: 'Opacity', description: 'Element opacity', type: 'Number' },
    zIndex: { name: 'Z-Index', description: 'Z-index for layering', type: 'Number' },
    display: { name: 'Display', description: 'CSS display property', type: 'String' },
    position: { name: 'Position', description: 'CSS position property', type: 'String' },
    overflow: { name: 'Overflow', description: 'CSS overflow property', type: 'String' },
    textAlign: { name: 'Text Align', description: 'Text alignment', type: 'String' },
    lineHeight: { name: 'Line Height', description: 'Line height', type: 'String' },
    letterSpacing: { name: 'Letter Spacing', description: 'Letter spacing', type: 'String' },
    tabIndex: { name: 'Tab Index', description: 'Tab navigation index', type: 'Number' },
    title: { name: 'Title', description: 'Element title attribute', type: 'String' },
    autocomplete: { name: 'Autocomplete', description: 'Autocomplete attribute', type: 'String' },
    spellcheck: { name: 'Spellcheck', description: 'Enable/disable spellcheck', type: 'Boolean' },
    
    // Propriétés de conteneur et layout
    containerClass: { name: 'Container Class', description: 'CSS class for container element', type: 'String' },
    flexDirection: { name: 'Flex Direction', description: 'Flex container direction', type: 'String' },
    justifyContent: { name: 'Justify Content', description: 'Flex justify content alignment', type: 'String' },
    alignItems: { name: 'Align Items', description: 'Flex align items alignment', type: 'String' },
    
    // Propriétés d'état et interaction
    loading: { name: 'Loading', description: 'Loading state indicator', type: 'Boolean' },
    error: { name: 'Error', description: 'Error state indicator', type: 'Boolean' },
    success: { name: 'Success', description: 'Success state indicator', type: 'Boolean' },
    onClick: { name: 'On Click', description: 'Click event handler', type: 'Function' },
    onChange: { name: 'On Change', description: 'Change event handler', type: 'Function' },
    onFocus: { name: 'On Focus', description: 'Focus event handler', type: 'Function' },
    onBlur: { name: 'On Blur', description: 'Blur event handler', type: 'Function' }
  };

  // Propriétés pertinentes par type de composant
  const getRelevantProperties = (componentType: string): string[] => {
    const commonProperties = ['inline', 'width', 'required', 'disabled', 'readonly', 'placeholder', 'defaultValue', 'helpText', 'cssClasses', 'title'];
    
    const typeSpecificProperties: Record<string, string[]> = {
      'RADIOGRP': [
        'options', 'orientation', 'selectedValue', 'name', 
        'keyColumn', 'mainProperty', 'descriptionProperty', 'showDescription',
        'loadDataInfo', 'columnsDefinition'
      ],
      'INPUT': [
        'size', 'variant', 'minLength', 'maxLength', 'pattern', 'errorMessage',
        'autocomplete', 'spellcheck'
      ],
      'BUTTON': [
        'buttonType', 'buttonStyle', 'onClick', 'loading', 'size', 'variant'
      ],
      'SELECT': [
        'options', 'selectedValue', 'dataSource', 'displayField', 'valueField',
        'keyColumn', 'mainProperty', 'loadDataInfo'
      ],
      'GRIDLKP': [
        'keyColumn', 'mainProperty', 'descriptionProperty', 'showDescription',
        'loadDataInfo', 'columnsDefinition', 'dataSource', 'sortable', 'filterable'
      ],
      'LSTLKP': [
        'keyColumn', 'mainProperty', 'descriptionProperty', 'showDescription',
        'loadDataInfo', 'columnsDefinition', 'dataSource', 'displayField', 'valueField'
      ],
      'TABLE': [
        'columns', 'rows', 'sortable', 'filterable', 'height'
      ],
      'CHECKBOX': [
        'options', 'selectedValue', 'orientation'
      ]
    };
    
    const specificProps = typeSpecificProperties[componentType] || [];
    return [...commonProperties, ...specificProps];
  };
  
  // Liste des propriétés disponibles selon le type de composant
  const relevantProperties = getRelevantProperties(editingComponent.type || 'INPUT');
  const availableProperties = relevantProperties.filter(prop => propertyDefinitions[prop]);

  // Propriétés actuellement définies - inclure TOUTES les propriétés pour TOUS les composants
  const currentProperties = Object.entries(editingComponent).filter(([key, value]) => 
    key in editingComponent  // Affiche toutes les propriétés du composant, quel que soit le type
  );

  // S'assurer que les propriétés requises sont toujours affichées
  const ensuredCurrentProperties = [...currentProperties];
  requiredProperties.forEach(reqProp => {
    if (!ensuredCurrentProperties.find(([key]) => key === reqProp) && editingComponent[reqProp] !== undefined) {
      ensuredCurrentProperties.push([reqProp, editingComponent[reqProp]]);
    }
  });

  // Propriétés disponibles pour ajout (pas encore définies ET pas dans les requises)
  const propertiesForAddition = availableProperties.filter(prop => 
    !(prop in editingComponent) && !requiredProperties.includes(prop)
  );

  const handleDeleteProperty = (propertyKey: string) => {
    // Vérifier si la propriété est requise
    if (requiredProperties.includes(propertyKey)) {
      console.log('Cannot delete required property:', propertyKey);
      return;
    }
    
    console.log('Deleting property:', propertyKey);
    const updatedComponent = { ...editingComponent };
    
    // Supprimer complètement la propriété pour qu'elle retourne dans la palette
    delete updatedComponent[propertyKey];
    
    console.log('Property deleted and will return to palette:', propertyKey);
    console.log('Updated component after deletion:', updatedComponent);
    setEditingComponent(updatedComponent);
  };

  const handleAddProperty = (propertyName: string) => {
    console.log('Adding property:', propertyName);
    
    const defaultValue = ['required', 'disabled', 'readonly', 'spellcheck'].includes(propertyName) ? false : '';
    
    const updatedComponent = {
      ...editingComponent,
      [propertyName]: defaultValue
    };
    
    console.log('Updated component after addition:', updatedComponent);
    setEditingComponent(updatedComponent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? 'text-white' : ''}>
            Edit Component - {editingComponent.type}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Properties */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : ''}`}>
              Current Properties ({ensuredCurrentProperties.length})
            </h3>
            
            <div className="space-y-2">
              {ensuredCurrentProperties.length > 0 ? (
                ensuredCurrentProperties.map(([propertyKey, propertyValue]) => {
                  const propDef = propertyDefinitions[propertyKey] || { name: propertyKey, description: '', type: 'String' };
                  const displayValue = (() => {
                    if (propertyValue === null || propertyValue === undefined) {
                      return 'null';
                    }
                    if (typeof propertyValue === 'boolean') {
                      return propertyValue ? 'true' : 'false';
                    }
                    if (typeof propertyValue === 'object') {
                      if (Array.isArray(propertyValue)) {
                        return propertyValue.length === 0 ? '[]' : JSON.stringify(propertyValue, null, 2);
                      }
                      return Object.keys(propertyValue).length === 0 ? '{}' : JSON.stringify(propertyValue, null, 2);
                    }
                    if (typeof propertyValue === 'string' && propertyValue === '') {
                      return '""';  // Empty string representation
                    }
                    if (typeof propertyValue === 'string' && propertyValue === 'Ex:') {
                      return '""';  // Replace "Ex:" with proper empty string
                    }
                    return String(propertyValue);
                  })();
                  
                  return (
                    <div key={propertyKey} className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {propDef.name}
                          </h4>
                          {requiredProperties.includes(propertyKey) && (
                            <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                              Required
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            {propDef.type}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProperty(propertyKey)}
                            disabled={requiredProperties.includes(propertyKey)}
                            className={`p-1 ${
                              requiredProperties.includes(propertyKey) 
                                ? (isDarkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed')
                                : (isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50')
                            }`}
                            title={requiredProperties.includes(propertyKey) ? 'Required property cannot be deleted' : `Remove ${propertyKey}`}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {propDef.description}
                      </p>
                      <div className={`p-2 rounded border font-mono text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-green-300' : 'bg-white border-gray-200 text-gray-800'}`}>
                        {displayValue}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p>No properties added yet.</p>
                  <p className="text-sm">Add properties from the palette →</p>
                </div>
              )}
            </div>
          </div>

          {/* Available Properties Palette */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : ''}`}>
              Available Properties for {editingComponent.type} ({propertiesForAddition.length})
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              {propertiesForAddition.map((propertyName) => {
                const propDef = propertyDefinitions[propertyName] || { name: propertyName, description: '', type: 'String' };
                return (
                  <Button
                    key={propertyName}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddProperty(propertyName)}
                    className={`p-3 text-left justify-start ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    title={`Add ${propDef.name}: ${propDef.description}`}
                  >
                    <Plus size={14} className="mr-2" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{propDef.name}</span>
                      <span className="text-xs opacity-70">{propDef.type}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
            
            {propertiesForAddition.length === 0 && (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <p>All properties have been added!</p>
                <p className="text-sm">Remove properties to make them available again.</p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSave}
            className={isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}