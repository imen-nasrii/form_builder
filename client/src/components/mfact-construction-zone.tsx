import { useState, useCallback, useRef } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, useDndMonitor } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import MFactDataModelViewer from './mfact-data-model-viewer';
import { 
  Grid3X3, 
  Settings, 
  Plus, 
  Trash2, 
  Move, 
  ChevronDown,
  ChevronRight,
  Type,
  FileText,
  Hash,
  CheckSquare,
  Circle,
  Calendar,
  List,
  Users,
  Upload,
  Zap,
  Copy,
  Maximize2
} from 'lucide-react';
import type { MFactField, MFactForm, ComponentDefinition, ComponentCategory } from '@shared/mfact-models';
import { COMPONENT_REGISTRY, MFACT_TEMPLATES } from '@shared/mfact-models';

interface MFactConstructionZoneProps {
  formData: MFactForm;
  selectedField: MFactField | null;
  onFormUpdate: (form: MFactForm) => void;
  onFieldSelect: (field: MFactField | null) => void;
}

// Icon mapping for components
const iconMap = {
  Type,
  FileText,
  Hash,
  CheckSquare,
  Circle,
  Calendar,
  Grid3X3,
  List,
  Users,
  Upload,
  Zap,
  ChevronDown
};

interface DraggableComponentProps {
  component: ComponentDefinition;
  isNew?: boolean;
}

function DraggableComponent({ component, isNew = false }: DraggableComponentProps) {
  const IconComponent = iconMap[component.icon as keyof typeof iconMap] || Type;
  
  return (
    <div
      className={`
        relative w-full p-3 border border-dashed border-gray-300 rounded-lg cursor-move transition-all duration-200
        hover:shadow-md hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20
        flex items-center gap-3 text-sm
        ${isNew ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30' : 'bg-white dark:bg-gray-800'}
      `}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
          type: 'component',
          componentType: component.type
        }));
      }}
    >
      <div className={`p-2 rounded ${component.color} bg-opacity-10`}>
        <IconComponent className={`w-4 h-4 ${component.color}`} />
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900 dark:text-white">{component.label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{component.description}</div>
      </div>
      <Badge variant="secondary" className="text-xs">
        {component.type}
      </Badge>
    </div>
  );
}

interface SortableFieldProps {
  field: MFactField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function SortableField({ field, isSelected, onSelect, onRemove }: SortableFieldProps) {
  // Special handling for DATAMODEL components
  if (field.Type === 'DATAMODEL') {
    return (
      <div className="relative group">
        <MFactDataModelViewer
          field={field}
          isSelected={isSelected}
          onClick={onSelect}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.Id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const component = COMPONENT_REGISTRY.find(c => c.type === field.Type);
  const IconComponent = component ? iconMap[component.icon as keyof typeof iconMap] || Type : Type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative p-4 border rounded-lg cursor-pointer transition-all duration-200
        ${isDragging ? 'opacity-50 scale-105' : ''}
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 hover:shadow-sm'
        }
      `}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 right-2 opacity-60 hover:opacity-100">
        <Move className="w-4 h-4 text-gray-400" />
      </div>

      {/* Field Content */}
      <div className="flex items-start gap-3 pr-8">
        <div className={`p-2 rounded ${component?.color || 'text-gray-600'} bg-opacity-10`}>
          <IconComponent className={`w-4 h-4 ${component?.color || 'text-gray-600'}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-white truncate">
            {field.Label || `${field.Type} Field`}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {field.DataField && `Data: ${field.DataField}`}
            {field.Entity && ` • Entity: ${field.Entity}`}
          </div>
          
          {/* Field Properties */}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {field.Type}
            </Badge>
            {field.Required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
            {field.Width && (
              <Badge variant="secondary" className="text-xs">
                {field.Width}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <Trash2 className="w-3 h-3" />
      </Button>

      {/* Container Indicator */}
      {field.Type === 'GROUP' && field.Children && field.Children.length > 0 && (
        <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded border-l-4 border-emerald-500">
          <div className="text-xs text-gray-600 dark:text-gray-300">
            Contains {field.Children.length} component{field.Children.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}

interface ComponentPaletteProps {
  onTemplateSelect: (templateKey: string) => void;
  expandedSections: Record<string, boolean>;
  onToggleSection: (section: string) => void;
}

function ComponentPalette({ onTemplateSelect, expandedSections, onToggleSection }: ComponentPaletteProps) {
  // Group components by category
  const componentsByCategory = COMPONENT_REGISTRY.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<ComponentCategory, ComponentDefinition[]>);

  const categoryLabels: Record<ComponentCategory, string> = {
    INPUT_CONTROLS: 'Input Fields',
    SELECTION_CONTROLS: 'Selection Controls',
    LOOKUP_COMPONENTS: 'Lookup Components',
    CONTAINER_LAYOUT: 'Container & Layout',
    DATA_DISPLAY: 'Data & Display',
    FILE_UPLOAD: 'File & Upload',
    ACTION_VALIDATION: 'Action & Validation'
  };

  return (
    <div className="space-y-4">
      {/* MFact Templates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            MFact Program Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(MFACT_TEMPLATES).map(([key, template]) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => onTemplateSelect(key)}
            >
              <div>
                <div className="font-medium">{template.label}</div>
                <div className="text-xs text-gray-500">{template.metadata?.description}</div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Component Categories */}
      <div className="space-y-3">
        {Object.entries(componentsByCategory).map(([category, components]) => (
          <Card key={category}>
            <CardHeader 
              className="pb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => onToggleSection(category)}
            >
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>{categoryLabels[category as ComponentCategory]}</span>
                {expandedSections[category] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </CardTitle>
            </CardHeader>
            
            {expandedSections[category] && (
              <CardContent className="space-y-2">
                {components.map((component) => (
                  <DraggableComponent key={component.type} component={component} isNew />
                ))}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function MFactConstructionZone({ 
  formData, 
  selectedField, 
  onFormUpdate, 
  onFieldSelect 
}: MFactConstructionZoneProps) {
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState({
    INPUT_CONTROLS: true,
    SELECTION_CONTROLS: false,
    LOOKUP_COMPONENTS: true,
    CONTAINER_LAYOUT: true,
    DATA_DISPLAY: true,
    FILE_UPLOAD: false,
    ACTION_VALIDATION: true
  });

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDraggedItem(event.active);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedItem(null);

    if (!over) return;

    // Handle component from palette
    if (active.id.toString().startsWith('component-')) {
      const componentType = active.id.toString().replace('component-', '');
      const componentDef = COMPONENT_REGISTRY.find(c => c.type === componentType);
      
      if (componentDef) {
        const newField: MFactField = {
          Id: `${componentType}_${Date.now()}`,
          Type: componentDef.type,
          Label: componentDef.defaultProperties.Label || componentDef.label,
          DataField: componentDef.defaultProperties.DataField || `field_${Date.now()}`,
          ...componentDef.defaultProperties
        };

        onFormUpdate({
          ...formData,
          fields: [...formData.fields, newField]
        });
      }
      return;
    }

    // Handle reordering existing fields
    if (active.id !== over.id) {
      const oldIndex = formData.fields.findIndex(field => field.Id === active.id);
      const newIndex = formData.fields.findIndex(field => field.Id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newFields = arrayMove(formData.fields, oldIndex, newIndex);
        onFormUpdate({
          ...formData,
          fields: newFields
        });
      }
    }
  }, [formData, onFormUpdate]);

  const handleTemplateSelect = useCallback((templateKey: string) => {
    const template = MFACT_TEMPLATES[templateKey];
    if (template) {
      onFormUpdate({
        ...formData,
        ...template,
        fields: template.fields || []
      } as MFactForm);
    }
  }, [formData, onFormUpdate]);

  const handleFieldRemove = useCallback((fieldId: string) => {
    onFormUpdate({
      ...formData,
      fields: formData.fields.filter(field => field.Id !== fieldId)
    });
    
    if (selectedField?.Id === fieldId) {
      onFieldSelect(null);
    }
  }, [formData, selectedField, onFormUpdate, onFieldSelect]);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Component Palette */}
        <div className="col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Component Palette</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-4">
                  <ComponentPalette
                    onTemplateSelect={handleTemplateSelect}
                    expandedSections={expandedSections}
                    onToggleSection={toggleSection}
                  />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Construction Zone */}
        <div className="col-span-9">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Move className="w-5 h-5" />
                Construction Zone
                <Badge variant="secondary" className="ml-auto">
                  {formData.fields.length} Component{formData.fields.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-200px)]">
                {formData.fields.length === 0 ? (
                  <div 
                    className="flex flex-col items-center justify-center h-96 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg relative"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                      
                      try {
                        const data = JSON.parse(e.dataTransfer.getData('application/json'));
                        if (data.type === 'component') {
                          const componentDef = COMPONENT_REGISTRY.find(c => c.type === data.componentType);
                          if (componentDef) {
                            const newField: MFactField = {
                              Id: `${componentDef.type}_${Date.now()}`,
                              Type: componentDef.type,
                              Label: componentDef.defaultProperties.Label || componentDef.label,
                              DataField: componentDef.defaultProperties.DataField || `field_${Date.now()}`,
                              ...componentDef.defaultProperties
                            };

                            onFormUpdate({
                              ...formData,
                              fields: [...formData.fields, newField]
                            });
                          }
                        }
                      } catch (error) {
                        console.error('Error handling drop:', error);
                      }
                    }}
                  >
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
                      <Maximize2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Start Building Your MFact Program
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      Drag components from the palette anywhere in this area to get started. 
                      Build professional financial programs with our comprehensive component library.
                    </p>
                  </div>
                ) : (
                  <div 
                    className="relative min-h-96 w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-lg p-4"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('bg-blue-50', 'dark:bg-blue-900/20');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/20');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900/20');
                      
                      try {
                        const data = JSON.parse(e.dataTransfer.getData('application/json'));
                        if (data.type === 'component') {
                          const componentDef = COMPONENT_REGISTRY.find(c => c.type === data.componentType);
                          if (componentDef) {
                            // Calculate position based on drop location
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            
                            const newField: MFactField = {
                              Id: `${componentDef.type}_${Date.now()}`,
                              Type: componentDef.type,
                              Label: componentDef.defaultProperties.Label || componentDef.label,
                              DataField: componentDef.defaultProperties.DataField || `field_${Date.now()}`,
                              ...componentDef.defaultProperties,
                              Position: {
                                x: Math.max(0, x - 100), // Offset for center positioning
                                y: Math.max(0, y - 20)
                              }
                            };

                            onFormUpdate({
                              ...formData,
                              fields: [...formData.fields, newField]
                            });
                          }
                        }
                      } catch (error) {
                        console.error('Error handling drop:', error);
                      }
                    }}
                  >
                    {/* Grid overlay for visual guidance */}
                    <div 
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, #9ca3af 1px, transparent 1px),
                          linear-gradient(to bottom, #9ca3af 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px'
                      }}
                    />

                    {/* Render positioned components */}
                    {formData.fields.map((field, index) => (
                      <div
                        key={field.Id}
                        className="absolute cursor-move"
                        style={{
                          left: field.Position?.x || (index % 3) * 250 + 20,
                          top: field.Position?.y || Math.floor(index / 3) * 100 + 20,
                          zIndex: selectedField?.Id === field.Id ? 10 : 1
                        }}
                        onMouseDown={(e) => {
                          const startX = e.clientX - (field.Position?.x || 0);
                          const startY = e.clientY - (field.Position?.y || 0);
                          
                          const handleMouseMove = (e: MouseEvent) => {
                            const newX = e.clientX - startX;
                            const newY = e.clientY - startY;
                            
                            const updatedFields = formData.fields.map(f => 
                              f.Id === field.Id 
                                ? { ...f, Position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
                                : f
                            );
                            
                            onFormUpdate({
                              ...formData,
                              fields: updatedFields
                            });
                          };

                          const handleMouseUp = () => {
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                          };

                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                      >
                        <SortableField
                          field={field}
                          isSelected={selectedField?.Id === field.Id}
                          onSelect={() => onFieldSelect(field)}
                          onRemove={() => handleFieldRemove(field.Id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <DragOverlay>
        {draggedItem ? (
          <div className="transform rotate-3 scale-105 opacity-90">
            <DraggableComponent 
              component={COMPONENT_REGISTRY.find(c => 
                `component-${c.type}` === draggedItem.id
              ) || COMPONENT_REGISTRY[0]} 
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}