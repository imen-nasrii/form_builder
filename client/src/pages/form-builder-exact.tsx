import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { 
  ChevronDown,
  ChevronRight,
  Trash2,
  User,
  Home,
  LogOut,
  Grid3x3,
  List,
  Square,
  Diamond,
  AlertTriangle,
  Zap,
  Type,
  Calendar,
  CheckSquare,
  Circle,
  Upload,
  Menu,
  MousePointer,
  X
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

// Composant draggable pour la sidebar
function DraggableComponent({ 
  type, 
  label, 
  icon: Icon,
  color = "blue" 
}: { 
  type: string; 
  label: string; 
  icon: any;
  color?: string;
}) {
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
      className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:shadow-md transition-all duration-200 active:cursor-grabbing group"
    >
      <div className={`p-3 rounded-lg bg-${color}-50 group-hover:bg-${color}-100 transition-colors`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <span className="text-xs font-medium text-gray-700 mt-2 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// Composant pour les sections repliables de la sidebar
function SidebarSection({ 
  title, 
  children, 
  defaultExpanded = true 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded"
      >
        <span>{title}</span>
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {isExpanded && (
        <div className="mt-2 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

// Composant droppable pour le canvas
function DroppableCanvas({
  formData,
  selectedField,
  setSelectedField,
  updateField,
  removeField
}: {
  formData: any;
  selectedField: FormField | null;
  setSelectedField: (field: FormField) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  removeField: (fieldId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'form-canvas',
  });

  return (
    <div 
      ref={setNodeRef}
      className={`bg-white rounded-lg border-2 border-dashed min-h-96 p-8 transition-colors ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      {formData.fields.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-lg">Drag components here to build your form</p>
          <p className="text-sm mt-2">Components will appear in this area</p>
        </div>
      ) : (
        <SortableContext 
          items={formData.fields.map((field: FormField) => field.Id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {formData.fields.map((field: FormField) => (
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
  );
}

// Composant sortable pour les champs dans le canvas
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

  const getFieldIcon = () => {
    switch (field.Type) {
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'ACTION': return <MousePointer className="w-4 h-4 text-red-600" />;
      case 'GRIDLKP': return <Grid3x3 className="w-4 h-4 text-blue-600" />;
      case 'LSTLKP': return <List className="w-4 h-4 text-green-600" />;
      case 'GROUP': return <Square className="w-4 h-4 text-purple-600" />;
      case 'TEXT': return <Type className="w-4 h-4 text-blue-600" />;
      case 'TEXTAREA': return <Menu className="w-4 h-4 text-blue-600" />;
      case 'SELECT': return <ChevronDown className="w-4 h-4 text-blue-600" />;
      case 'CHECKBOX': return <CheckSquare className="w-4 h-4 text-blue-600" />;
      case 'DATEPICKER': return <Calendar className="w-4 h-4 text-blue-600" />;
      default: return <Square className="w-4 h-4 text-gray-600" />;
    }
  };

  const getFieldColor = () => {
    switch (field.Type) {
      case 'WARNING': return 'bg-yellow-50 border-yellow-200';
      case 'ACTION': return 'bg-red-50 border-red-200';
      case 'GRIDLKP': return 'bg-blue-50 border-blue-200';
      case 'LSTLKP': return 'bg-green-50 border-green-200';
      case 'GROUP': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // Si c'est un GROUP, utiliser un composant spécialisé
  if (field.Type === 'GROUP') {
    return (
      <GroupField
        field={field}
        isSelected={isSelected}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onRemove={onRemove}
        listeners={listeners}
        attributes={attributes}
        nodeRef={setNodeRef}
        style={style}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={onSelect}
      className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : getFieldColor() + ' hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div {...listeners} className="cursor-grab active:cursor-grabbing">
            {getFieldIcon()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              {getFieldIcon()}
              <span className="font-medium text-sm">{field.Type}</span>
            </div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded mt-1">
              {field.Label || `${field.Type} Field`}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 h-6 w-6 text-gray-400 hover:text-red-500"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// Composant GROUP avec drag & drop interne
function GroupField({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onRemove,
  listeners,
  attributes,
  nodeRef,
  style
}: {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
  listeners?: any;
  attributes?: any;
  nodeRef?: any;
  style?: any;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Zone droppable pour le groupe
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `group-${field.Id}`,
  });

  const addChildField = (componentType: string) => {
    const newChildField: FormField = {
      Id: `${field.Id}_child_${Date.now()}`,
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

    const updatedChildFields = [...(field.ChildFields || []), newChildField];
    onUpdate({ ChildFields: updatedChildFields });
  };

  const removeChildField = (childFieldId: string) => {
    const updatedChildFields = (field.ChildFields || []).filter(
      child => child.Id !== childFieldId
    );
    onUpdate({ ChildFields: updatedChildFields });
  };

  const updateChildField = (childFieldId: string, updates: Partial<FormField>) => {
    const updatedChildFields = (field.ChildFields || []).map(child =>
      child.Id === childFieldId ? { ...child, ...updates } : child
    );
    onUpdate({ ChildFields: updatedChildFields });
  };

  return (
    <div
      ref={nodeRef}
      style={style}
      onClick={onSelect}
      className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'bg-purple-50 border-purple-200 hover:border-purple-300'
      }`}
    >
      {/* Header du groupe */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
            <Square className="w-4 h-4 text-purple-600" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center space-x-2"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span className="font-medium text-sm">GROUP</span>
          </button>
          <div className="text-xs bg-purple-100 px-2 py-1 rounded">
            {(field.ChildFields || []).length} items
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 h-6 w-6 text-gray-400 hover:text-red-500"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Contenu du groupe */}
      {isExpanded && (
        <div 
          ref={setDropRef}
          className={`min-h-24 p-4 border-2 border-dashed rounded transition-colors ${
            isOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          {(field.ChildFields || []).length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Square className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Drop components here</p>
            </div>
          ) : (
            <SortableContext 
              items={(field.ChildFields || []).map(child => child.Id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {(field.ChildFields || []).map((childField) => (
                  <div
                    key={childField.Id}
                    className="p-3 bg-white border border-gray-200 rounded shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          childField.Type === 'TEXT' ? 'bg-blue-500' :
                          childField.Type === 'SELECT' ? 'bg-orange-500' :
                          childField.Type === 'CHECKBOX' ? 'bg-cyan-500' :
                          childField.Type === 'WARNING' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`} />
                        <span className="text-sm font-medium">
                          {childField.Label || childField.Id}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {childField.Type}
                        </span>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeChildField(childField.Id);
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
          )}
        </div>
      )}
    </div>
  );
}

export default function FormBuilderExact() {
  const params = useParams();
  const formId = params.formId ? parseInt(params.formId) : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    menuId: "CustomerReg",
    label: "Customer Registration",
    formWidth: "800px",
    layout: "PROCESS",
    fields: [] as FormField[],
    actions: [] as any[],
    validations: [] as any[]
  });
  
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [jsonView, setJsonView] = useState<'JSON' | 'Validation'>('JSON');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Composants organisés par catégories comme dans l'image
  const componentCategories = {
    "Input Controls": [
      { type: 'TEXT', label: 'Text', icon: Type, color: 'blue' },
      { type: 'TEXTAREA', label: 'Textarea', icon: Menu, color: 'blue' },
      { type: 'SELECT', label: 'Select', icon: ChevronDown, color: 'blue' },
      { type: 'CHECKBOX', label: 'Checkbox', icon: CheckSquare, color: 'blue' },
      { type: 'RADIOGRP', label: 'Radio', icon: Circle, color: 'blue' },
      { type: 'DATEPICKER', label: 'Date', icon: Calendar, color: 'blue' },
      { type: 'FILEUPLOAD', label: 'File', icon: Upload, color: 'blue' }
    ],
    "Layout Components": [
      { type: 'GROUP', label: 'Group', icon: Square, color: 'purple' },
      { type: 'PANEL', label: 'Panel', icon: Square, color: 'purple' }
    ],
    "Lookup Components": [
      { type: 'GRIDLKP', label: 'Grid Lookup', icon: Grid3x3, color: 'orange' },
      { type: 'LSTLKP', label: 'List Lookup', icon: List, color: 'green' }
    ],
    "Action & Validation": [
      { type: 'ACTION', label: 'Action', icon: MousePointer, color: 'red' },
      { type: 'ERROR', label: 'Error', icon: X, color: 'red' },
      { type: 'WARNING', label: 'Warning', icon: AlertTriangle, color: 'yellow' }
    ]
  };

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
    
    // Si on drag un composant de la palette
    if (active.data.current?.type === 'component') {
      const componentType = active.data.current.componentType;
      const newField: FormField = {
        Id: `${componentType.toLowerCase()}-${Date.now()}`,
        Type: componentType,
        Label: componentType === 'WARNING' ? 'Warning Message' : `${componentType} Field`,
        DataField: "",
        Entity: "",
        Width: "",
        Spacing: "",
        Required: false,
        Inline: false,
        Outlined: false,
        Value: "",
        ChildFields: []
      };

      // Si on dépose dans la zone principale
      if (over.id === 'form-canvas') {
        setFormData(prev => ({
          ...prev,
          fields: [...prev.fields, newField]
        }));
        setSelectedField(newField);
      }
      // Si on dépose dans un groupe
      else if (over.id && over.id.toString().startsWith('group-')) {
        const groupId = over.id.toString().replace('group-', '');
        setFormData(prev => ({
          ...prev,
          fields: prev.fields.map(field => {
            if (field.Id === groupId) {
              return {
                ...field,
                ChildFields: [...(field.ChildFields || []), newField]
              };
            }
            return field;
          })
        }));
        setSelectedField(newField);
      }
    }
  };

  // Fonction pour mettre à jour un champ (y compris dans les groupes)
  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    const updateFieldRecursive = (fields: FormField[]): FormField[] => {
      return fields.map(field => {
        if (field.Id === fieldId) {
          return { ...field, ...updates };
        }
        if (field.ChildFields && field.ChildFields.length > 0) {
          return {
            ...field,
            ChildFields: updateFieldRecursive(field.ChildFields)
          };
        }
        return field;
      });
    };

    setFormData(prev => ({
      ...prev,
      fields: updateFieldRecursive(prev.fields)
    }));
    
    if (selectedField?.Id === fieldId) {
      setSelectedField(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Fonction pour supprimer un champ (y compris dans les groupes)
  const removeField = (fieldId: string) => {
    const removeFieldRecursive = (fields: FormField[]): FormField[] => {
      return fields.filter(field => field.Id !== fieldId).map(field => {
        if (field.ChildFields && field.ChildFields.length > 0) {
          return {
            ...field,
            ChildFields: removeFieldRecursive(field.ChildFields)
          };
        }
        return field;
      });
    };

    setFormData(prev => ({
      ...prev,
      fields: removeFieldRecursive(prev.fields)
    }));
    
    if (selectedField?.Id === fieldId) {
      setSelectedField(null);
    }
  };

  if (formLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const generatedJson = {
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
      Value: field.Value
    })),
    Actions: formData.actions,
    Validations: formData.validations
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Header - exact comme l'image */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">FB</span>
                </div>
                <span className="text-lg font-semibold text-blue-600">FormBuilder</span>
              </div>
              <nav className="flex items-center space-x-6">
                <a href="#" className="text-gray-700 hover:text-blue-600">Dashboard</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, imen</span>
              <Button variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button 
                onClick={() => saveForm.mutate()}
                disabled={saveForm.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Form
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-65px)]">
          {/* Left Sidebar - Components comme dans l'image */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-4 h-4 bg-blue-600 rounded" />
                <span className="font-medium text-blue-600">Components</span>
              </div>

              {/* Categories de composants comme dans l'image */}
              {Object.entries(componentCategories).map(([category, components]) => (
                <SidebarSection key={category} title={category}>
                  <SortableContext 
                    items={components.map(c => `component-${c.type}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {components.map(component => (
                        <DraggableComponent
                          key={component.type}
                          type={component.type}
                          label={component.label}
                          icon={component.icon}
                          color={component.color}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </SidebarSection>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Form Builder Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-medium text-gray-900">Form Builder</h1>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Import</Button>
                  <Button variant="outline" size="sm">Export</Button>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <DroppableCanvas formData={formData} selectedField={selectedField} setSelectedField={setSelectedField} updateField={updateField} removeField={removeField} />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Properties exactement comme l'image */}
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              {selectedField ? (
                <>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Properties: {selectedField.Type}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fieldLabel" className="text-sm font-medium">Label</Label>
                      <Input
                        id="fieldLabel"
                        value={selectedField.Label || ''}
                        onChange={(e) => updateField(selectedField.Id, { Label: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fieldType" className="text-sm font-medium">Type</Label>
                      <Select 
                        value={selectedField.Type} 
                        onValueChange={(value) => updateField(selectedField.Id, { Type: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WARNING">Warning</SelectItem>
                          <SelectItem value="ERROR">Error</SelectItem>
                          <SelectItem value="ACTION">Action</SelectItem>
                          <SelectItem value="TEXT">Text</SelectItem>
                          <SelectItem value="GRIDLKP">Grid Lookup</SelectItem>
                          <SelectItem value="LSTLKP">List Lookup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="conditionExpression" className="text-sm font-medium">Condition Expression</Label>
                      <Textarea
                        id="conditionExpression"
                        value={`{
  "logicalOperator": "AND",
  "conditions": []
}`}
                        className="mt-1 font-mono text-xs"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="componentId" className="text-sm font-medium">Component ID</Label>
                      <Input
                        id="componentId"
                        value={selectedField.Id}
                        onChange={(e) => updateField(selectedField.Id, { Id: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <button className="flex items-center text-sm text-gray-700 hover:text-gray-900">
                        <ChevronRight className="w-4 h-4 mr-1" />
                        Advanced JSON
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a component to configure</p>
                </div>
              )}

              {/* JSON Preview Section - exactement comme l'image */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">JSON Preview</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Validate</Button>
                    <Button variant="outline" size="sm">Copy</Button>
                  </div>
                </div>

                <div className="flex space-x-1 mb-3">
                  <button
                    onClick={() => setJsonView('JSON')}
                    className={`px-3 py-1 text-sm rounded ${
                      jsonView === 'JSON' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => setJsonView('Validation')}
                    className={`px-3 py-1 text-sm rounded ${
                      jsonView === 'Validation' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Validation
                  </button>
                </div>

                <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono max-h-96 overflow-y-auto">
                  <pre>{JSON.stringify(generatedJson, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-lg">
              <span className="text-sm font-medium">
                {activeId.startsWith('component-') ? 
                  activeId.replace('component-', '') :
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