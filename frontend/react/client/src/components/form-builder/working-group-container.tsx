import React, { useState } from 'react';
import { FormField } from '@/lib/form-types';
import { Settings, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkingGroupContainerProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onRemoveField: (fieldId: string) => void;
  onSelectField: (field: FormField) => void;
  onAddFieldToGroup: (groupId: string, field: FormField) => void;
  isSelected: boolean;
}

export const WorkingGroupContainer: React.FC<WorkingGroupContainerProps> = ({
  field,
  onUpdateField,
  onRemoveField,
  onSelectField,
  onAddFieldToGroup,
  isSelected
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
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

  const addComponentToGroup = (componentType: string) => {
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
  };

  const containerClass = `
    min-h-32 p-4 border-2 rounded-lg transition-all cursor-pointer
    ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
    ${isHovered ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : ''}
    border-dashed
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
      onClick={(e) => {
        e.stopPropagation();
        onSelectField(field);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* En-tête du groupe */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-600" />
          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {field.Label || field.label || 'Group Container'}
          </span>
          <span className="text-xs text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded">
            {children.length} items
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveField(field.Id);
          }}
          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Zone de contenu */}
      <div className={getLayoutClass()}>
        {children.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="mb-4">
              <Settings className="w-12 h-12 mx-auto mb-2 opacity-50 text-emerald-500" />
              <p className="text-sm mb-2">Ce groupe est vide</p>
              <p className="text-xs mb-4">Ajoutez des composants en utilisant les boutons ci-dessous</p>
            </div>
            
            {/* Boutons pour ajouter des composants */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button size="sm" variant="outline" onClick={(e) => {
                e.stopPropagation();
                addComponentToGroup('TEXT');
              }} className="text-xs">
                <Plus className="w-3 h-3 mr-1" />
                TEXT
              </Button>
              <Button size="sm" variant="outline" onClick={(e) => {
                e.stopPropagation();
                addComponentToGroup('SELECT');
              }} className="text-xs">
                <Plus className="w-3 h-3 mr-1" />
                SELECT
              </Button>
              <Button size="sm" variant="outline" onClick={(e) => {
                e.stopPropagation();
                addComponentToGroup('CHECKBOX');
              }} className="text-xs">
                <Plus className="w-3 h-3 mr-1" />
                CHECKBOX
              </Button>
              <Button size="sm" variant="outline" onClick={(e) => {
                e.stopPropagation();
                addComponentToGroup('DATEPICKER');
              }} className="text-xs">
                <Plus className="w-3 h-3 mr-1" />
                DATE
              </Button>
              <Button size="sm" variant="outline" onClick={(e) => {
                e.stopPropagation();
                addComponentToGroup('TEXTAREA');
              }} className="text-xs">
                <Plus className="w-3 h-3 mr-1" />
                TEXTAREA
              </Button>
            </div>
          </div>
        ) : (
          children.map((child) => (
            <div
              key={child.Id}
              className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm hover:shadow-md transition-all hover:border-emerald-300 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSelectField(child);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    child.Type === 'TEXT' ? 'bg-green-500' :
                    child.Type === 'SELECT' ? 'bg-orange-500' :
                    child.Type === 'CHECKBOX' ? 'bg-cyan-500' :
                    child.Type === 'DATEPICKER' ? 'bg-purple-500' :
                    child.Type === 'TEXTAREA' ? 'bg-gray-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="text-sm font-medium">
                    {child.Label || child.label || `${child.Type || child.type}`}
                  </span>
                </div>
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

      {/* Note d'aide */}
      {isHovered && children.length === 0 && (
        <div className="mt-3 p-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded text-center">
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            💡 Utilisez les boutons ci-dessus pour ajouter des composants à ce groupe
          </p>
        </div>
      )}
    </div>
  );
};