import React from 'react';
import { FormField } from '@/lib/form-types';
import { Settings, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimpleGroupContainerProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onRemoveField: (fieldId: string) => void;
  onSelectField: (field: FormField) => void;
  onAddFieldToGroup: (groupId: string, field: FormField) => void;
  isSelected: boolean;
}

export const SimpleGroupContainer: React.FC<SimpleGroupContainerProps> = ({
  field,
  onUpdateField,
  onRemoveField,
  onSelectField,
  onAddFieldToGroup,
  isSelected
}) => {
  const children = field.Children || field.children || [];
  const layout = field.GroupLayout || 'vertical';

  const getLayoutClass = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-row gap-4 flex-wrap';
      case 'grid':
        return 'grid grid-cols-2 gap-4';
      default:
        return 'flex flex-col gap-4';
    }
  };

  const containerClass = `
    min-h-32 p-4 border-2 rounded-lg transition-all
    ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
    ${field.GroupStyle?.border ? 'border-solid' : 'border-dashed'}
    hover:border-gray-400 dark:hover:border-gray-500
  `;

  const containerStyle = {
    backgroundColor: field.GroupStyle?.background || 'transparent',
    padding: field.GroupStyle?.padding || '16px',
    borderRadius: field.GroupStyle?.borderRadius || '8px',
  };

  const addSimpleComponent = (type: string) => {
    const newField: FormField = {
      Id: `field_${Date.now()}`,
      Type: type as any,
      Label: `New ${type}`,
      DataField: "",
      Entity: "",
      Width: "",
      Spacing: "",
      Required: false,
      Inline: false,
      Outlined: false,
      Value: ""
    };
    
    onAddFieldToGroup(field.Id, newField);
  };

  return (
    <div
      className={containerClass}
      style={containerStyle}
      onClick={(e) => {
        e.stopPropagation();
        onSelectField(field);
      }}
    >
      {/* En-tête du groupe */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {field.Label || field.label || 'Group'}
          </span>
          <span className="text-xs text-gray-500">
            ({children.length} {children.length === 1 ? 'composant' : 'composants'})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Boutons d'ajout rapide */}
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              addSimpleComponent('TEXT');
            }}
            className="h-6 px-2 text-xs"
          >
            + Text
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              addSimpleComponent('SELECT');
            }}
            className="h-6 px-2 text-xs"
          >
            + Select
          </Button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveField(field.Id);
            }}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Zone de contenu */}
      <div className={getLayoutClass()}>
        {children.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm mb-2">Aucun composant dans ce groupe</p>
            <p className="text-xs mb-3">Utilisez les boutons ci-dessus pour ajouter des composants</p>
          </div>
        ) : (
          children.map((child) => (
            <div
              key={child.Id}
              className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm hover:shadow-md transition-shadow"
              onClick={(e) => {
                e.stopPropagation();
                onSelectField(child);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {child.Label || child.label || `${child.Type || child.type}`}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {child.Type || child.type}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Supprimer l'enfant du groupe
                    const updatedChildren = children.filter(c => c.Id !== child.Id);
                    onUpdateField(field.Id, { 
                      Children: updatedChildren,
                      children: updatedChildren 
                    });
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              {child.DataField && (
                <p className="text-xs text-gray-500 mt-1">
                  Champ: {child.DataField}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};