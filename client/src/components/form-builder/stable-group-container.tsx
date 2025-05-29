import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { FormField } from '@/lib/form-types';
import { Settings, Trash2 } from 'lucide-react';

interface StableGroupContainerProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onRemoveField: (fieldId: string) => void;
  onSelectField: (field: FormField) => void;
  onAddFieldToGroup: (groupId: string, field: FormField) => void;
  isSelected: boolean;
}

export const StableGroupContainer: React.FC<StableGroupContainerProps> = ({
  field,
  onUpdateField,
  onRemoveField,
  onSelectField,
  onAddFieldToGroup,
  isSelected
}) => {
  const children = field.Children || field.children || [];

  const getLayoutClass = () => {
    const layout = field.GroupLayout || 'vertical';
    switch (layout) {
      case 'horizontal':
        return 'flex flex-row gap-4';
      case 'grid':
        return 'grid grid-cols-2 gap-4';
      default:
        return 'flex flex-col gap-4';
    }
  };

  const handleDrop = useCallback((item: { type: string }) => {
    try {
      const newField: FormField = {
        Id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        Type: item.type as any,
        Label: `Nouveau ${item.type}`,
        DataField: `field_${item.type.toLowerCase()}`,
        Entity: "",
        Width: "100%",
        Spacing: "normal",
        Required: false,
        Inline: false,
        Outlined: true,
        Value: ""
      };
      
      onAddFieldToGroup(field.Id, newField);
    } catch (error) {
      console.error('Erreur lors du drop:', error);
    }
  }, [field.Id, onAddFieldToGroup]);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'component',
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const containerClass = `
    relative border-2 border-dashed rounded-lg p-4 min-h-[120px] transition-all
    ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
    ${isOver && canDrop ? 'border-green-500 bg-green-50' : ''}
    hover:border-gray-400 bg-white dark:bg-gray-900
  `.trim();

  const containerStyle = {
    border: field.GroupStyle?.border ? `1px solid #e5e7eb` : 'none',
    background: field.GroupStyle?.background || 'transparent',
    padding: field.GroupStyle?.padding || '16px',
    borderRadius: field.GroupStyle?.borderRadius || '8px',
  };

  return (
    <div
      ref={drop}
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
          <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
            <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm mb-2 font-medium text-gray-600 dark:text-gray-400">Groupe vide</p>
            <p className="text-xs mb-4 text-gray-500">Glissez des composants depuis le panneau de gauche</p>
            {isOver && canDrop && (
              <div className="text-green-600 text-sm font-medium">
                Relâchez pour ajouter le composant
              </div>
            )}
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
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {child.Label || child.Type}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {child.Type}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Supprimer le composant du groupe
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
            </div>
          ))
        )}
      </div>

      {/* Indicateur de drop */}
      {isOver && canDrop && (
        <div className="absolute inset-0 bg-green-100 bg-opacity-50 border-2 border-green-400 border-dashed rounded-lg flex items-center justify-center">
          <span className="text-green-700 font-medium">Relâchez ici</span>
        </div>
      )}
    </div>
  );
};