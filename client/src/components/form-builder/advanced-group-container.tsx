import React, { useCallback, useState } from 'react';
import { useDrop } from 'react-dnd';
import { FormField } from '@/lib/form-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings, 
  Trash2, 
  Edit, 
  Plus, 
  GripVertical, 
  LayoutGrid, 
  Columns, 
  Rows3,
  Type,
  CheckSquare,
  Calendar
} from 'lucide-react';

interface AdvancedGroupContainerProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onRemoveField: (fieldId: string) => void;
  onSelectField: (field: FormField) => void;
  onAddFieldToGroup: (groupId: string, field: FormField) => void;
  isSelected: boolean;
}

export const AdvancedGroupContainer: React.FC<AdvancedGroupContainerProps> = ({
  field,
  onUpdateField,
  onRemoveField,
  onSelectField,
  onAddFieldToGroup,
  isSelected
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(field.Label || 'Groupe');
  
  const children = field.Children || field.children || [];

  // Layouts disponibles pour le groupe
  const layouts = [
    { value: 'vertical', label: 'Vertical', icon: Rows3 },
    { value: 'horizontal', label: 'Horizontal', icon: Columns },
    { value: 'grid', label: 'Grille', icon: LayoutGrid }
  ];

  // Types de composants rapides à ajouter
  const quickComponents = [
    { type: 'TEXT', label: 'Texte', icon: Type, color: 'bg-blue-100 text-blue-700' },
    { type: 'CHECKBOX', label: 'Checkbox', icon: CheckSquare, color: 'bg-green-100 text-green-700' },
    { type: 'DATEPICKER', label: 'Date', icon: Calendar, color: 'bg-purple-100 text-purple-700' }
  ];

  const getLayoutClass = () => {
    const layout = field.GroupLayout || 'vertical';
    switch (layout) {
      case 'horizontal':
        return 'flex flex-row gap-4 flex-wrap';
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
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

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'component',
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [handleDrop]);

  const addQuickComponent = (type: string) => {
    const newField: FormField = {
      Id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      Type: type as any,
      Label: `Nouveau ${type}`,
      DataField: `field_${type.toLowerCase()}`,
      Entity: "",
      Width: "100%",
      Spacing: "normal",
      Required: false,
      Inline: false,
      Outlined: true,
      Value: ""
    };
    
    onAddFieldToGroup(field.Id, newField);
  };

  const updateLayout = (layout: string) => {
    onUpdateField(field.Id, { GroupLayout: layout as 'vertical' | 'horizontal' | 'grid' });
  };

  const saveLabel = () => {
    onUpdateField(field.Id, { Label: editLabel });
    setIsEditing(false);
  };

  const removeChildField = (childId: string) => {
    const updatedChildren = children.filter(c => c.Id !== childId);
    onUpdateField(field.Id, { 
      Children: updatedChildren,
      children: updatedChildren 
    });
  };

  const containerClass = `
    relative border-2 rounded-xl p-6 min-h-[200px] transition-all duration-300
    ${isSelected ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-300 bg-white'}
    ${isOver && canDrop ? 'border-green-500 bg-green-50 shadow-xl' : ''}
    hover:border-gray-400 hover:shadow-md
  `.trim();

  const groupStyle = {
    background: field.GroupStyle?.background || 'transparent',
    padding: field.GroupStyle?.padding || '24px',
    borderRadius: field.GroupStyle?.borderRadius || '12px',
  };

  return (
    <Card 
      ref={drop}
      className={containerClass}
      style={groupStyle}
      onClick={(e) => {
        e.stopPropagation();
        onSelectField(field);
      }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-500" />
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="h-8 w-48"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveLabel();
                    if (e.key === 'Escape') setIsEditing(false);
                  }}
                  autoFocus
                />
                <Button size="sm" onClick={saveLabel}>OK</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {field.Label || 'Groupe'}
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            )}
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {children.length} composant{children.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sélecteur de layout */}
            <Select value={field.GroupLayout || 'vertical'} onValueChange={updateLayout}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {layouts.map(layout => (
                  <SelectItem key={layout.value} value={layout.value}>
                    <div className="flex items-center gap-2">
                      <layout.icon className="w-4 h-4" />
                      {layout.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveField(field.Id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Boutons d'ajout rapide */}
        <div className="flex gap-2 mt-4">
          {quickComponents.map(comp => (
            <Button
              key={comp.type}
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                addQuickComponent(comp.type);
              }}
              className={`h-8 px-3 ${comp.color} border-0`}
            >
              <comp.icon className="w-4 h-4 mr-1" />
              + {comp.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {/* Zone de contenu */}
        <div className={getLayoutClass()}>
          {children.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <Plus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">Groupe vide</h4>
              <p className="text-sm text-gray-500 mb-4">
                Glissez des composants depuis le panneau de gauche ou utilisez les boutons ci-dessus
              </p>
              {isOver && canDrop && (
                <div className="text-green-600 text-base font-medium animate-pulse">
                  🎯 Relâchez pour ajouter le composant
                </div>
              )}
            </div>
          ) : (
            children.map((child, index) => (
              <Card
                key={child.Id}
                className="p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectField(child);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {child.Label || child.Type}
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                        {child.Type}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChildField(child.Id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Indicateur de drop */}
        {isOver && canDrop && children.length > 0 && (
          <div className="absolute inset-0 bg-green-100 bg-opacity-50 border-2 border-green-400 border-dashed rounded-xl flex items-center justify-center pointer-events-none">
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium">
              🎯 Relâchez ici pour ajouter
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};