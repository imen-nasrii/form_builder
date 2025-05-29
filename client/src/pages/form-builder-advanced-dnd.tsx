import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { 
  Save, 
  Download, 
  Upload, 
  FileText, 
  Settings, 
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  X,
  FolderOpen,
  GripVertical
} from "lucide-react";

// Interface pour les champs du formulaire
interface FormField {
  Id: string;
  Type: string;
  Label: string;
  DataField: string;
  Entity: string;
  Width: string;
  Spacing: string;
  Required: boolean;
  Inline: boolean;
  Outlined: boolean;
  Value: string;
  ChildFields?: FormField[];
}

// Composant draggable pour la palette
function DraggableComponent({ type, label, color }: { type: string; label: string; color: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id: `component-${type}`,
    data: {
      type: 'component',
      componentType: type,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-grab active:cursor-grabbing hover:border-${color}-400 hover:bg-${color}-50 transition-colors`}
    >
      <div className="flex items-center space-x-2">
        <GripVertical className="w-4 h-4 text-gray-400" />
        <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}

// Composant sortable pour les champs
function SortableField({ 
  field, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onRemove 
}: {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.Id,
    data: {
      type: 'field',
      field,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (field.Type === 'GROUP') {
    return (
      <div ref={setNodeRef} style={style}>
        <GroupField
          field={field}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={onUpdate}
          onRemove={onRemove}
          listeners={listeners}
          attributes={attributes}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={onSelect}
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <div className={`w-3 h-3 rounded-full ${
            field.Type === 'TEXT' ? 'bg-green-500' :
            field.Type === 'SELECT' ? 'bg-orange-500' :
            field.Type === 'CHECKBOX' ? 'bg-cyan-500' :
            field.Type === 'GRIDLKP' ? 'bg-blue-500' :
            field.Type === 'LSTLKP' ? 'bg-green-400' :
            field.Type === 'DATEPICKER' ? 'bg-purple-500' :
            field.Type === 'TEXTAREA' ? 'bg-indigo-500' :
            field.Type === 'FILEUPLOAD' ? 'bg-yellow-500' :
            field.Type === 'ACTION' ? 'bg-red-500' :
            'bg-gray-500'
          }`} />
          <span className="font-medium text-gray-900 dark:text-white">
            {field.Label || field.Id}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {field.Type}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// Composant GROUP avec drag & drop
function GroupField({ 
  field, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onRemove,
  listeners,
  attributes
}: {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
  listeners?: any;
  attributes?: any;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // Si on drag un composant de la palette
    if (active.data.current?.type === 'component') {
      const componentType = active.data.current.componentType;
      const newField: FormField = {
        Id: `group_field_${Date.now()}`,
        Type: componentType,
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
      const updatedChildFields = [...(field.ChildFields || []), newField];
      onUpdate({ ChildFields: updatedChildFields });
    }
  };

  const handleRemoveChildField = (childFieldId: string) => {
    const updatedChildFields = (field.ChildFields || []).filter(
      childField => childField.Id !== childFieldId
    );
    onUpdate({ ChildFields: updatedChildFields });
  };

  return (
    <div
      className={`
        relative group p-4 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer
        ${isSelected ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}
        hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20
      `}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {listeners && (
            <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 h-6 w-6"
          >
            <FolderOpen className={`w-4 h-4 text-emerald-600 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
          </Button>
          
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-sm">
              {field.Label || "Group Container"}
            </span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {(field.ChildFields || []).length} items
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div 
              className="min-h-16 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800/50"
            >
              {(field.ChildFields || []).length > 0 ? (
                <SortableContext 
                  items={(field.ChildFields || []).map(child => child.Id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {(field.ChildFields || []).map((childField) => (
                      <div
                        key={childField.Id}
                        className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              childField.Type === 'TEXT' ? 'bg-green-500' :
                              childField.Type === 'SELECT' ? 'bg-orange-500' :
                              childField.Type === 'CHECKBOX' ? 'bg-cyan-500' :
                              'bg-blue-500'
                            }`} />
                            <span className="text-sm font-medium">
                              {childField.Label || childField.Id}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {childField.Type}
                            </span>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveChildField(childField.Id);
                            }}
                            className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </SortableContext>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Drag components here to add to group</p>
                </div>
              )}
            </div>
          </DndContext>
        </div>
      )}
    </div>
  );
}

export default function FormBuilderAdvancedDnd() {
  const params = useParams();
  const formId = params.formId ? parseInt(params.formId) : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    menuId: "",
    label: "",
    formWidth: "700px",
    layout: "PROCESS",
    fields: [] as FormField[],
    actions: [] as any[],
    validations: [] as any[]
  });
  
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Composants disponibles
  const componentTypes = [
    { type: 'TEXT', label: 'Text Input', color: 'green' },
    { type: 'TEXTAREA', label: 'Textarea', color: 'blue' },
    { type: 'SELECT', label: 'Select', color: 'orange' },
    { type: 'CHECKBOX', label: 'Checkbox', color: 'cyan' },
    { type: 'RADIOGRP', label: 'Radio Group', color: 'purple' },
    { type: 'DATEPICKER', label: 'Date Picker', color: 'pink' },
    { type: 'FILEUPLOAD', label: 'File Upload', color: 'indigo' },
    { type: 'GRIDLKP', label: 'Grid Lookup', color: 'blue' },
    { type: 'LSTLKP', label: 'List Lookup', color: 'green' },
    { type: 'GROUP', label: 'Group Container', color: 'emerald' },
    { type: 'ACTION', label: 'Action Button', color: 'red' },
    { type: 'SUBMIT', label: 'Submit Button', color: 'blue' },
    { type: 'RESET', label: 'Reset Button', color: 'gray' },
    { type: 'CANCEL', label: 'Cancel Button', color: 'red' }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Charger les données du formulaire
  const { data: form, isLoading: formLoading } = useQuery({
    queryKey: ['/api/forms', formId],
    enabled: !!formId,
  });

  // Mutation pour sauvegarder
  const saveForm = useMutation({
    mutationFn: async () => {
      const payload = {
        menuId: formData.menuId,
        label: formData.label,
        formWidth: formData.formWidth,
        layout: formData.layout,
        definition: formData
      };

      if (formId) {
        return await apiRequest(`/api/forms/${formId}`, 'PUT', payload);
      } else {
        return await apiRequest('/api/forms', 'POST', payload);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Form saved successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save form",
        variant: "destructive"
      });
    }
  });

  // Charger les données du formulaire
  useEffect(() => {
    if (form && (form as any).definition) {
      setFormData((form as any).definition);
    }
  }, [form]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;
    
    // Si on drag un composant de la palette vers la zone principale
    if (active.data.current?.type === 'component' && over.id === 'form-canvas') {
      const componentType = active.data.current.componentType;
      const newField: FormField = {
        Id: `field_${Date.now()}`,
        Type: componentType,
        Label: `${componentType} Field`,
        DataField: "",
        Entity: "",
        Width: "",
        Spacing: "",
        Required: false,
        Inline: false,
        Outlined: false,
        Value: ""
      };

      setFormData(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));
      setSelectedField(newField);
    }
  };

  // Fonction pour mettre à jour un champ
  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.Id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  // Fonction pour supprimer un champ
  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.Id !== fieldId)
    }));
    if (selectedField?.Id === fieldId) {
      setSelectedField(null);
    }
  };

  if (formLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">FormBuilder Advanced</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => saveForm.mutate()}
                disabled={saveForm.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Form
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Sidebar - Components */}
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">Drag Components</span>
              </div>

              {/* Components - Draggable */}
              <SortableContext 
                items={componentTypes.map(c => `component-${c.type}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {componentTypes.map(component => (
                    <DraggableComponent
                      key={component.type}
                      type={component.type}
                      label={component.label}
                      color={component.color}
                    />
                  ))}
                </div>
              </SortableContext>

              {/* Form Settings */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Form Settings</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="menuId" className="text-xs">Menu ID</Label>
                    <Input
                      id="menuId"
                      value={formData.menuId}
                      onChange={(e) => setFormData(prev => ({ ...prev, menuId: e.target.value }))}
                      className="h-8 text-xs"
                      placeholder="Enter menu ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="label" className="text-xs">Form Label</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                      className="h-8 text-xs"
                      placeholder="Enter form label"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div 
                  id="form-canvas"
                  className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 min-h-96 p-6"
                >
                  {formData.fields.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Drag components here to build your form</p>
                      <p className="text-sm mt-2">Components will appear in this area</p>
                    </div>
                  ) : (
                    <SortableContext 
                      items={formData.fields.map(field => field.Id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4">
                        {formData.fields.map((field) => (
                          <SortableField
                            key={field.Id}
                            field={field}
                            isSelected={selectedField?.Id === field.Id}
                            onSelect={() => setSelectedField(field)}
                            onUpdate={(updates) => updateField(field.Id, updates)}
                            onRemove={() => removeField(field.Id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Properties & JSON */}
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Properties
              </h2>
              
              {selectedField ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fieldLabel" className="text-sm">Label</Label>
                    <Input
                      id="fieldLabel"
                      value={selectedField.Label || ''}
                      onChange={(e) => updateField(selectedField.Id, { Label: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fieldDataField" className="text-sm">Data Field</Label>
                    <Input
                      id="fieldDataField"
                      value={selectedField.DataField || ''}
                      onChange={(e) => updateField(selectedField.Id, { DataField: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fieldEntity" className="text-sm">Entity</Label>
                    <Input
                      id="fieldEntity"
                      value={selectedField.Entity || ''}
                      onChange={(e) => updateField(selectedField.Id, { Entity: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fieldWidth" className="text-sm">Width</Label>
                    <Input
                      id="fieldWidth"
                      value={selectedField.Width || ''}
                      onChange={(e) => updateField(selectedField.Id, { Width: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="fieldRequired"
                      checked={selectedField.Required || false}
                      onChange={(e) => updateField(selectedField.Id, { Required: e.target.checked })}
                    />
                    <Label htmlFor="fieldRequired" className="text-sm">Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="fieldInline"
                      checked={selectedField.Inline || false}
                      onChange={(e) => updateField(selectedField.Id, { Inline: e.target.checked })}
                    />
                    <Label htmlFor="fieldInline" className="text-sm">Inline</Label>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a component to configure</p>
                </div>
              )}

              {/* JSON OUTPUT */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  JSON Output
                </h3>
                <div className="bg-gray-100 dark:bg-gray-900 rounded p-3 max-h-96 overflow-y-auto">
                  <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
{JSON.stringify({
  MenuID: formData.menuId,
  FormWidth: formData.formWidth,
  Layout: formData.layout,
  Label: formData.label,
  Field: formData.fields.map(field => ({
    Id: field.Id,
    Type: field.Type,
    Label: field.Label,
    DataField: field.DataField,
    Entity: field.Entity,
    Width: field.Width,
    Spacing: field.Spacing,
    Required: field.Required,
    Inline: field.Inline,
    Outlined: field.Outlined,
    Value: field.Value,
    ...(field.ChildFields && field.ChildFields.length > 0 ? {
      Children: field.ChildFields.map(child => ({
        Id: child.Id,
        Type: child.Type,
        Label: child.Label,
        DataField: child.DataField,
        Entity: child.Entity,
        Width: child.Width,
        Required: child.Required,
        Value: child.Value
      }))
    } : {})
  })),
  Actions: formData.actions,
  Validations: formData.validations
}, null, 2)}
                  </pre>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const jsonOutput = JSON.stringify({
                      MenuID: formData.menuId,
                      FormWidth: formData.formWidth,
                      Layout: formData.layout,
                      Label: formData.label,
                      Field: formData.fields,
                      Actions: formData.actions,
                      Validations: formData.validations
                    }, null, 2);
                    navigator.clipboard.writeText(jsonOutput);
                    toast({
                      title: "Copied!",
                      description: "JSON copied to clipboard"
                    });
                  }}
                  className="w-full mt-2"
                >
                  Copy JSON
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-lg">
              <span className="text-sm font-medium">
                {activeId.startsWith('component-') ? 
                  componentTypes.find(c => `component-${c.type}` === activeId)?.label :
                  formData.fields.find(f => f.Id === activeId)?.Label || activeId
                }
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}