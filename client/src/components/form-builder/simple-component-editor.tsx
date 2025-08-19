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

  // Liste des propriétés disponibles
  const availableProperties = [
    'id', 'label', 'placeholder', 'defaultValue', 'helpText', 'required', 'disabled', 'readonly',
    'minLength', 'maxLength', 'pattern', 'errorMessage', 'cssClasses', 'dataAttributes',
    'width', 'height', 'margin', 'padding', 'fontSize', 'fontWeight', 'color', 'backgroundColor',
    'border', 'borderRadius', 'opacity', 'zIndex', 'display', 'position', 'overflow',
    'textAlign', 'lineHeight', 'letterSpacing', 'tabIndex', 'title', 'autocomplete', 'spellcheck'
  ];

  // Propriétés actuellement définies (existent dans l'objet et ne sont pas type)
  const currentProperties = Object.entries(editingComponent).filter(([key, value]) => 
    key !== 'type' && key in editingComponent
  );

  // Propriétés disponibles pour ajout (pas encore définies ou supprimées)
  const propertiesForAddition = availableProperties.filter(prop => 
    !(prop in editingComponent) // La propriété n'existe pas dans l'objet
  );

  const handleDeleteProperty = (propertyKey: string) => {
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
              Current Properties ({currentProperties.length})
            </h3>
            
            <div className="space-y-2">
              {currentProperties.length > 0 ? (
                currentProperties.map(([propertyKey, propertyValue]) => (
                  <div key={propertyKey} className={`flex items-center justify-between p-3 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex flex-col">
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {propertyKey}
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {typeof propertyValue === 'boolean' ? (propertyValue ? 'true' : 'false') : String(propertyValue)}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProperty(propertyKey)}
                      className={`p-2 ${isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'}`}
                      title={`Remove ${propertyKey}`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))
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
              Available Properties ({propertiesForAddition.length})
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {propertiesForAddition.map((propertyName) => (
                <Button
                  key={propertyName}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddProperty(propertyName)}
                  className={`p-3 text-left justify-start ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  title={`Add ${propertyName} property`}
                >
                  <Plus size={14} className="mr-2" />
                  {propertyName}
                </Button>
              ))}
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