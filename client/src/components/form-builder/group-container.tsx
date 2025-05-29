import React from 'react';
import { useDrop } from 'react-dnd';
import { FormField } from '@/lib/form-types';
import { Settings, Trash2 } from 'lucide-react';

interface GroupContainerProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onRemoveField: (fieldId: string) => void;
  onSelectField: (field: FormField) => void;
  onAddFieldToGroup: (groupId: string, field: FormField) => void;
  isSelected: boolean;
}

export const GroupContainer: React.FC<GroupContainerProps> = ({
  field,
  onUpdateField,
  onRemoveField,
  onSelectField,
  onAddFieldToGroup,
  isSelected
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'component',
    drop: (item: { type: string }) => {
      // Créer un nouveau champ pour le groupe
      const newField: FormField = {
        Id: `field_${Date.now()}`,
        Type: item.type as any,
        Label: `New ${item.type}`,
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
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

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

  const dropZoneClass = `
    min-h-32 p-4 border-2 border-dashed rounded-lg transition-all
    ${isOver && canDrop ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
    ${isSelected ? 'ring-2 ring-blue-500' : ''}
    ${field.GroupStyle?.border ? 'border-solid' : ''}
  `;

  const containerStyle = {
    backgroundColor: field.GroupStyle?.background || 'transparent',
    padding: field.GroupStyle?.padding || '16px',
    borderRadius: field.GroupStyle?.borderRadius || '8px',
  };

  return (
    <div
      ref={drop}
      className={dropZoneClass}
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
            <p className="text-sm">Glissez des composants ici</p>
            <p className="text-xs">pour les organiser en groupe</p>
          </div>
        ) : (
          children.map((child) => (
            <div
              key={child.Id}
              className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm"
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
      {isOver && canDrop && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center">
          <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
            Déposez ici pour ajouter au groupe
          </div>
        </div>
      )}
    </div>
  );
};