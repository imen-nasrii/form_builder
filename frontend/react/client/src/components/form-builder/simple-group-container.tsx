import React, { useState } from 'react';
import { FormField } from '@/lib/form-types';
import { Settings, Trash2, Plus, Move } from 'lucide-react';
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
  const [isDropZone, setIsDropZone] = useState(false);
  
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropZone(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only hide drop zone if we're actually leaving the container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDropZone(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopPropagation(); // Prevent bubbling to parent drop handlers
    setIsDropZone(false);
    
    try {
      const componentType = e.dataTransfer.getData('componentType') || e.dataTransfer.getData('text/plain');
      if (componentType) {
        const newField: FormField = {
          Id: `group_field_${Date.now()}`,
          Type: componentType as any,
          Label: `${componentType} in Group`,
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
      }
    } catch (error) {
      console.error('Error in drop handler:', error);
    }
  };

  const addQuickComponent = (type: string) => {
    const newField: FormField = {
      Id: `group_field_${Date.now()}`,
      Type: type as any,
      Label: `${type} in Group`,
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

  const containerClass = `
    min-h-32 p-4 border-2 rounded-lg transition-all
    ${isDropZone ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 border-dashed' : 'border-gray-300 dark:border-gray-600'}
    ${isSelected ? 'ring-2 ring-blue-500' : ''}
    ${field.GroupStyle?.border ? 'border-solid' : 'border-dashed'}
  `;

  const containerStyle = {
    backgroundColor: field.GroupStyle?.background || 'transparent',
    padding: field.GroupStyle?.padding || '16px',
    borderRadius: field.GroupStyle?.borderRadius || '8px',
  };

  return (
    <div
      className={containerClass}
      style={containerStyle}
      data-group-drop="true"
      onClick={(e) => {
        e.stopPropagation();
        onSelectField(field);
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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

      {/* Zone de contenu */}
      <div className={getLayoutClass()}>
        {children.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm mb-2">Glissez des composants ici ou utilisez les boutons</p>
            <div className="flex gap-2 justify-center">
              <Button size="sm" variant="outline" onClick={() => addQuickComponent('TEXT')}>
                + TEXT
              </Button>
              <Button size="sm" variant="outline" onClick={() => addQuickComponent('SELECT')}>
                + SELECT
              </Button>
              <Button size="sm" variant="outline" onClick={() => addQuickComponent('CHECKBOX')}>
                + CHECKBOX
              </Button>
            </div>
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
                <span className="text-sm font-medium">
                  {child.Label || child.label || `${child.Type || child.type}`}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {child.Type || child.type}
                </span>
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

      {/* Indicateur de zone de drop */}
      {isDropZone && (
        <div className="mt-2 border-2 border-blue-500 border-dashed bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
          <Plus className="w-6 h-6 mx-auto text-blue-500 mb-1" />
          <p className="text-sm text-blue-600 font-medium">Release to add to group</p>
        </div>
      )}
    </div>
  );
};