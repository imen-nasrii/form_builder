import React, { useState, useCallback } from 'react';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { 
  Type, 
  Calendar, 
  Square,
  List, 
  Settings,
  Home,
  Trash2,
  Save,
  Download,
  Upload,
  Table,
  CheckSquare,
  Hash,
  Grid3X3,
  Package,
  Moon,
  Sun
} from 'lucide-react';

// Form field interface
interface FormField {
  Id: string;
  Type: string;
  Label: string;
  DataField: string;
  Entity: string;
  Width: string;
  Required: boolean;
  Inline: boolean;
  Outlined: boolean;
}

interface FormData {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

// Component configurations
const ComponentTypes = {
  TEXT: { icon: Type, label: 'Text Input', color: 'blue' },
  GRIDLKP: { icon: Table, label: 'Grid Lookup', color: 'green' },
  SELECT: { icon: List, label: 'Select', color: 'purple' },
  DATEPICKER: { icon: Calendar, label: 'Date Picker', color: 'orange' },
  CHECKBOX: { icon: CheckSquare, label: 'Checkbox', color: 'cyan' },
  NUMERIC: { icon: Hash, label: 'Number', color: 'indigo' },
  TEXTAREA: { icon: Grid3X3, label: 'Text Area', color: 'teal' },
  BUTTON: { icon: Square, label: 'Button', color: 'red' },
};

// Simple draggable component
function PaletteItem({ componentType, config }: { componentType: string, config: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${componentType}`,
    data: { componentType }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = config.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center p-3 border rounded-lg cursor-grab hover:bg-gray-50 transition-colors"
    >
      <Icon className="w-6 h-6 mb-2 text-blue-600" />
      <span className="text-xs text-center">{config.label}</span>
    </div>
  );
}

// Simple drop zone
function DropZone({ fields, onFieldSelect, selectedField }: {
  fields: FormField[];
  onFieldSelect: (field: FormField) => void;
  selectedField: FormField | null;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'drop-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[500px] border-2 border-dashed rounded-lg p-6 transition-colors ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
    >
      {fields.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <Square className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">
            {isOver ? 'Drop component here!' : 'Start building your form'}
          </h3>
          <p>Drag components from the left to build your form</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field) => (
            <div
              key={field.Id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedField?.Id === field.Id
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onFieldSelect(field)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{field.Label}</div>
                  <div className="text-sm text-gray-500">
                    {field.Type} • {field.DataField}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Remove field logic will be handled by parent
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SimpleFormBuilder() {
  const { id } = useParams<{ id: string }>();
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  // State
  const [formData, setFormData] = useState<FormData>({
    id: id || '',
    title: 'New Program',
    description: '',
    fields: [],
  });

  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeField, setActiveField] = useState<FormField | null>(null);

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Create new field from component type
  const createField = useCallback((componentType: string): FormField => {
    const timestamp = Date.now();
    const config = ComponentTypes[componentType as keyof typeof ComponentTypes];
    
    return {
      Id: `${componentType}_${timestamp}`,
      Type: componentType,
      Label: config?.label || componentType,
      DataField: `${componentType.toLowerCase()}_${timestamp}`,
      Entity: 'DefaultEntity',
      Width: '100%',
      Required: false,
      Inline: false,
      Outlined: false,
    };
  }, []);

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event.active.id);
    setActiveField(null); // Will be set properly in actual implementation
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('Drag ended:', { activeId: active.id, overId: over?.id });

    setActiveField(null);

    // Handle drop from palette to construction zone
    if (active.id.toString().startsWith('palette-') && over?.id === 'drop-zone') {
      const componentType = active.id.toString().replace('palette-', '');
      const newField = createField(componentType);
      
      setFormData(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));

      setSelectedField(newField);
      
      toast({
        title: "Component Added",
        description: `${componentType} component added to form`,
      });
    }
  };

  // Remove field
  const removeField = useCallback((fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.Id !== fieldId)
    }));
    
    if (selectedField?.Id === fieldId) {
      setSelectedField(null);
    }
  }, [selectedField]);

  // Update field
  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.Id === fieldId ? { ...field, ...updates } : field
      )
    }));

    if (selectedField?.Id === fieldId) {
      setSelectedField(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedField]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        {/* Header */}
        <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              <div className="w-px h-6 bg-gray-300" />
              <h1 className="text-xl font-bold">{formData.title}</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="default" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-screen">
          {/* Component Palette */}
          <div className={`w-64 border-r ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="p-4">
              <h3 className="font-semibold mb-4">Components</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(ComponentTypes).map(([type, config]) => (
                  <PaletteItem
                    key={type}
                    componentType={type}
                    config={config}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Construction Zone */}
          <div className="flex-1 p-6">
            <DropZone
              fields={formData.fields}
              onFieldSelect={setSelectedField}
              selectedField={selectedField}
            />
          </div>

          {/* Properties Panel */}
          {selectedField && (
            <div className={`w-80 border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <Card className="h-full rounded-none border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Properties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={selectedField.Label}
                      onChange={(e) => updateField(selectedField.Id, { Label: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Data Field</Label>
                    <Input
                      value={selectedField.DataField}
                      onChange={(e) => updateField(selectedField.Id, { DataField: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Entity</Label>
                    <Input
                      value={selectedField.Entity}
                      onChange={(e) => updateField(selectedField.Id, { Entity: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Width</Label>
                    <Input
                      value={selectedField.Width}
                      onChange={(e) => updateField(selectedField.Id, { Width: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedField.Required}
                        onCheckedChange={(checked) => updateField(selectedField.Id, { Required: checked })}
                      />
                      <Label>Required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedField.Inline}
                        onCheckedChange={(checked) => updateField(selectedField.Id, { Inline: checked })}
                      />
                      <Label>Inline</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedField.Outlined}
                        onCheckedChange={(checked) => updateField(selectedField.Id, { Outlined: checked })}
                      />
                      <Label>Outlined</Label>
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    onClick={() => removeField(selectedField.Id)}
                    className="w-full mt-6"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Component
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeField ? (
          <div className="p-3 border rounded-lg shadow-lg bg-white">
            <div className="font-medium">{activeField.Label}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}