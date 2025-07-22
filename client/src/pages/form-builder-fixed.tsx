import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Type, 
  AlignLeft, 
  CheckSquare, 
  List, 
  Calendar, 
  Upload, 
  Table, 
  Square,
  Search, 
  Grid3X3,
  Hash,
  ChevronDown,
  ChevronRight,
  Settings,
  Save,
  Download,
  Eye,
  Trash2,
  Package,
  X,
  Moon,
  Sun,
  Home,
  HelpCircle,
  Code,
  FileUp,
  Users,
  GripVertical,
  Move,
  MoreVertical
} from 'lucide-react';
import { type FormData, type FormField } from '@/lib/form-builder-types';

// ComponentCategories based on your exact specifications
const ComponentCategories = {
  inputFields: {
    name: 'Input Fields',
    icon: Type,
    color: 'blue',
    components: {
      TEXT: { icon: Type, label: 'Text Field', color: 'blue' },
      TEXTAREA: { icon: AlignLeft, label: 'Text Area', color: 'blue' },
      DATEPKR: { icon: Calendar, label: 'Date Picker', color: 'purple' }
    }
  },
  selection: {
    name: 'Selection Controls',
    icon: List,
    color: 'orange',
    components: {
      LOOKUP: { icon: List, label: 'Lookup Dropdown', color: 'orange' },
      RADIO: { icon: CheckSquare, label: 'Radio Buttons', color: 'purple' }
    }
  },
  lookup: {
    name: 'Lookup Components',
    icon: Search,
    color: 'indigo',
    components: {
      GRIDLKP: { icon: Grid3X3, label: 'Grid Lookup', color: 'indigo' }
    }
  },
  dataDisplay: {
    name: 'Data & Display',
    icon: Table,
    color: 'emerald',
    components: {
      GRID: { icon: Table, label: 'Data Grid', color: 'emerald' },
      LABEL: { icon: Type, label: 'Label', color: 'gray' },
      HIDDEN: { icon: Eye, label: 'Hidden Field', color: 'gray' }
    }
  },
  containerLayout: {
    name: 'Container & Layout',
    icon: Square,
    color: 'violet',
    components: {
      GROUP: { icon: Square, label: 'Group Container', color: 'violet' }
    }
  },
  actions: {
    name: 'Actions',
    icon: Settings,
    color: 'red',
    components: {
      BUTTON: { icon: Settings, label: 'Button', color: 'red' }
    }
  }
};

// Flatten for compatibility
const ComponentTypes = Object.values(ComponentCategories).reduce((acc, category) => {
  return { ...acc, ...category.components };
}, {} as Record<string, { icon: any; label: string; color: string }>);

// Draggable Component for Palette
function DraggableComponent({ componentType, label, icon: Icon, color, isDarkMode = false, addField }: {
  componentType: string;
  label: string;
  icon: any;
  color: string;
  isDarkMode?: boolean;
  addField: (type: string) => void;
}) {
  const getColorClasses = () => {
    if (isDarkMode) {
      return {
        bg: 'bg-gray-700 hover:bg-gray-600',
        border: 'border-gray-500 hover:border-gray-400',
        text: 'text-gray-200',
        icon: 'text-gray-300'
      };
    }
    return {
      bg: `bg-${color}-50 hover:bg-${color}-100`,
      border: `border-${color}-200 hover:border-${color}-400`,
      text: 'text-gray-900',
      icon: `text-${color}-600`
    };
  };

  const getIconBackgroundClass = (color: string, isDarkMode: boolean) => {
    if (isDarkMode) {
      return 'bg-gray-600';
    }
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      purple: 'bg-purple-100',
      orange: 'bg-orange-100',
      cyan: 'bg-cyan-100',
      indigo: 'bg-indigo-100',
      teal: 'bg-teal-100',
      emerald: 'bg-emerald-100',
      gray: 'bg-gray-100',
      violet: 'bg-violet-100',
      pink: 'bg-pink-100',
      red: 'bg-red-100'
    };
    return colorMap[color] || 'bg-gray-100';
  };

  const colorClasses = getColorClasses();

  return (
    <div
      onClick={() => addField(componentType)}
      className={`
        relative cursor-pointer border rounded-lg p-2 transition-all duration-200
        ${colorClasses.bg} ${colorClasses.border} ${colorClasses.text}
        transform hover:scale-105 hover:shadow-md
        flex flex-col items-center space-y-1
      `}
      title={label}
    >
      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${getIconBackgroundClass(color, isDarkMode)}`}>
        <Icon className={`w-3 h-3 ${colorClasses.icon}`} />
      </div>
      <span className="text-xs font-medium text-center leading-tight">{label}</span>
    </div>
  );
}

// Component Templates based on user specifications
const createDefaultField = (componentType: string, customComponent?: any): FormField => {
  const timestamp = Date.now();
  
  const componentTemplates: Record<string, FormField> = {
    'GRIDLKP': {
      Id: `GRIDLKP_${timestamp}`,
      Type: 'GRIDLKP',
      Label: 'Grid Lookup',
      DataField: `gridlkp_${timestamp}`,
      Entity: 'LookupData',
      Width: '100%',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: true,
      Value: '',
      LookupTable: 'DefaultTable',
      DisplayField: 'name',
      ValueField: 'id',
      Columns: [
        { field: 'id', header: 'ID', width: '80px' },
        { field: 'name', header: 'Name', width: '200px' },
        { field: 'description', header: 'Description', width: '300px' }
      ],
      MultiSelect: false,
      Searchable: true,
      PageSize: 10
    },
    'LSTLKP': {
      Id: `LSTLKP_${timestamp}`,
      Type: 'LSTLKP',
      Label: 'List Lookup',
      DataField: `lstlkp_${timestamp}`,
      Entity: 'LookupList',
      Width: '200px',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: true,
      Value: '',
      LookupList: 'DefaultList',
      DisplayMember: 'name',
      ValueMember: 'id',
      Sorted: true,
      AutoComplete: true
    },
    'DATEPKR': {
      Id: `DATEPKR_${timestamp}`,
      Type: 'DATEPKR',
      Label: 'Date Picker',
      DataField: `datepkr_${timestamp}`,
      Entity: 'DateFields',
      Width: '150px',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: false,
      Value: '',
      ValueFormat: 'dd-MMM-yyyy',
      DefaultToToday: false,
      Readonly: false,
      VisibleWhen: '',
      EnabledWhen: '',
      DateValidation: ''
    },
    'TEXT': {
      Id: `TEXT_${timestamp}`,
      Type: 'TEXT',
      Label: 'Text Input',
      DataField: `text_${timestamp}`,
      Entity: 'TextData',
      Width: '200px',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: false,
      Value: '',
      MaxLength: 255,
      Placeholder: 'Enter text...',
      Validation: ''
    },
    'TEXTAREA': {
      Id: `TEXTAREA_${timestamp}`,
      Type: 'TEXTAREA',
      Label: 'Text Area',
      DataField: `textarea_${timestamp}`,
      Entity: 'TextData',
      Width: '300px',
      Height: '100px',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: true,
      Value: '',
      Readonly: false,
      Multiline: true,
      WordWrap: true,
      VisibleWhen: '',
      EnabledWhen: ''
    },
    'RADIO': {
      Id: `RADIO_${timestamp}`,
      Type: 'RADIO',
      Label: 'Radio Buttons',
      DataField: `radio_${timestamp}`,
      Entity: 'RadioData',
      Width: '200px',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: false,
      Value: '',
      Options: [
        { label: 'Option A', value: 'optA' },
        { label: 'Option B', value: 'optB' },
        { label: 'Option C', value: 'optC' }
      ],
      SelectedValue: '',
      VisibleWhen: '',
      EnabledWhen: ''
    },
    'LOOKUP': {
      Id: `LOOKUP_${timestamp}`,
      Type: 'LOOKUP',
      Label: 'Lookup Dropdown',
      DataField: `lookup_${timestamp}`,
      Entity: 'LookupData',
      Width: '200px',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: true,
      Value: '',
      Options: [
        { label: 'Select an option', value: '' },
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ],
      SelectedValue: '',
      LookupCategory: 'General',
      VisibleWhen: '',
      EnabledWhen: ''
    },
    'GROUP': {
      Id: `GROUP_${timestamp}`,
      Type: 'GROUP',
      Label: 'Group Container',
      DataField: `group_${timestamp}`,
      Entity: 'GroupData',
      Width: '100%',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: true,
      Value: '',
      Children: [],
      VisibleWhen: '',
      EnabledWhen: ''
    },
    'GRID': {
      Id: `GRID_${timestamp}`,
      Type: 'GRID',
      Label: 'Data Grid',
      DataField: `grid_${timestamp}`,
      Entity: 'GridData',
      Width: '100%',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: true,
      Value: '',
      Columns: [
        { name: 'Column1', width: '100px', type: 'string' },
        { name: 'Column2', width: '100px', type: 'string' }
      ],
      DataSource: '',
      Editable: false,
      RowActions: ['Edit', 'Delete'],
      VisibleWhen: ''
    },
    'LABEL': {
      Id: `LABEL_${timestamp}`,
      Type: 'LABEL',
      Label: 'Label',
      DataField: `label_${timestamp}`,
      Entity: 'LabelData',
      Width: '200px',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: false,
      Value: 'Label Text',
      TextColor: '#000000',
      Formula: '',
      VisibleWhen: ''
    },
    'HIDDEN': {
      Id: `HIDDEN_${timestamp}`,
      Type: 'HIDDEN',
      Label: 'Hidden Field',
      DataField: `hidden_${timestamp}`,
      Entity: 'HiddenData',
      Width: '0px',
      Spacing: 'none',
      Required: false,
      Inline: false,
      Outlined: false,
      Value: '',
      Formula: '',
      VisibleWhen: 'false',
      EnabledWhen: ''
    },
    'BUTTON': {
      Id: `BUTTON_${timestamp}`,
      Type: 'BUTTON',
      Label: 'Button',
      DataField: `button_${timestamp}`,
      Entity: 'ButtonData',
      Width: '120px',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: true,
      Value: '',
      OnClick: '',
      ActionType: 'submit',
      ButtonStyle: 'primary',
      VisibleWhen: '',
      EnabledWhen: ''
    }
  };

  // Use specific template or create a base template for custom components
  if (customComponent) {
    return {
      Id: `${componentType}_${timestamp}`,
      Type: componentType,
      Label: customComponent.label,
      DataField: `field_${timestamp}`,
      Entity: 'CustomEntity',
      Width: '100%',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: false,
      Value: JSON.stringify(customComponent.properties),
      ChildFields: componentType === 'GROUP' ? [] : undefined
    };
  }

  // Return complete template or base template
  return componentTemplates[componentType] || {
    Id: `${componentType}_${timestamp}`,
    Type: componentType,
    Label: ComponentTypes[componentType as keyof typeof ComponentTypes]?.label || componentType,
    DataField: `field_${timestamp}`,
    Entity: 'DefaultEntity',
    Width: '100%',
    Spacing: 'md',
    Required: false,
    Inline: false,
    Outlined: false,
    Value: '',
    ChildFields: componentType === 'GROUP' ? [] : undefined
  };
};

// Sortable Field Component for Excel-like Grid
function SortableFieldItem({ field, onSelect, onRemove, isSelected, isDarkMode }: {
  field: FormField;
  onSelect: () => void;
  onRemove: () => void;
  isSelected: boolean;
  isDarkMode: boolean;
}) {
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
    opacity: isDragging ? 0.5 : 1,
  };

  const componentType = ComponentTypes[field.Type as keyof typeof ComponentTypes];
  const Icon = componentType?.icon || Type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`
        group flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all
        ${isSelected 
          ? `border-blue-500 ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-50'}` 
          : `${isDarkMode ? 'border-gray-600 hover:border-gray-500 bg-gray-700' : 'border-gray-200 hover:border-gray-300 bg-white'}`
        }
      `}
    >
      <div className="flex items-center space-x-3 flex-1">
        <div 
          {...attributes} 
          {...listeners}
          className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} cursor-grab active:cursor-grabbing`}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex-1">
          <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {field.Label}
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {field.Type} • {field.Id}
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
        className={`opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  );
}

// Excel-like Grid Drop Zone
function ExcelGrid({ formData, setFormData, selectedField, setSelectedField, isDarkMode }: {
  formData: FormData;
  setFormData: (data: FormData) => void;
  selectedField: FormField | null;
  setSelectedField: (field: FormField | null) => void;
  isDarkMode: boolean;
}) {
  const [draggedField, setDraggedField] = useState<FormField | null>(null);
  const [gridSize] = useState({ rows: 20, cols: 12 });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const field = formData.fields.find(f => f.Id === event.active.id);
    setDraggedField(field || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !active) {
      setDraggedField(null);
      return;
    }

    const activeIndex = formData.fields.findIndex(f => f.Id === active.id);
    const overIndex = formData.fields.findIndex(f => f.Id === over.id);

    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      const newFields = arrayMove(formData.fields, activeIndex, overIndex);
      setFormData({
        ...formData,
        fields: newFields
      });
    }

    setDraggedField(null);
  };

  // Generate grid cells
  const gridCells = [];
  for (let row = 0; row < gridSize.rows; row++) {
    for (let col = 0; col < gridSize.cols; col++) {
      const cellId = `${row}-${col}`;
      gridCells.push(
        <div
          key={cellId}
          className={`
            border border-dashed border-gray-300 min-h-[60px] p-2 transition-colors
            ${isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-400'}
            hover:bg-blue-50 dark:hover:bg-blue-900/20
          `}
          style={{ gridColumn: col + 1, gridRow: row + 1 }}
        >
          {/* Cell content can be added here */}
        </div>
      );
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full overflow-auto">
        <div 
          className="grid gap-1 p-4 min-h-full"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize.cols}, minmax(100px, 1fr))`,
            gridTemplateRows: `repeat(${gridSize.rows}, 60px)`
          }}
        >
          {gridCells}
        </div>

        {/* Field List Overlay */}
        <div className="absolute top-4 right-4 w-80">
          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Form Fields ({formData.fields.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              <SortableContext items={formData.fields.map(f => f.Id)} strategy={verticalListSortingStrategy}>
                {formData.fields.map((field) => (
                  <SortableFieldItem
                    key={field.Id}
                    field={field}
                    onSelect={() => setSelectedField(field)}
                    onRemove={() => {
                      const newFields = formData.fields.filter(f => f.Id !== field.Id);
                      setFormData({ ...formData, fields: newFields });
                      if (selectedField?.Id === field.Id) {
                        setSelectedField(null);
                      }
                    }}
                    isSelected={selectedField?.Id === field.Id}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </SortableContext>
              {formData.fields.length === 0 && (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Grid3X3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No fields added yet</p>
                  <p className="text-xs mt-1">Drag components from the palette</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <DragOverlay>
        {draggedField ? (
          <div className="bg-white border border-blue-500 rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4" />
              <span className="font-medium">{draggedField.Label}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default function FormBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State management
  const [formData, setFormData] = useState<FormData>({
    id: id || '',
    title: 'New Program',
    description: '',
    fields: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '',
    assignedTo: '',
    status: 'created',
    priority: 'medium'
  });

  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [customComponents, setCustomComponents] = useState<any[]>([]);

  // Clean up duplicate components that appear both in groups and root level
  const cleanupDuplicateComponents = (fields: FormField[]): FormField[] => {
    const componentIdsInGroups = new Set<string>();
    
    // First pass: collect all component IDs that are inside groups
    fields.forEach(field => {
      if (field.Type === 'GROUP' && field.ChildFields) {
        field.ChildFields.forEach(child => {
          componentIdsInGroups.add(child.Id);
        });
      }
    });
    
    // Second pass: remove root-level components that also exist in groups
    return fields.filter(field => {
      if (field.Type === 'GROUP') {
        return true; // Keep all groups
      }
      return !componentIdsInGroups.has(field.Id); // Remove if exists in a group
    });
  };

  const addField = (componentType: string, targetGroupId?: string) => {
    const newField = createDefaultField(componentType);
    
    if (targetGroupId) {
      // Adding to a specific group
      setFormData(prev => {
        const updatedFields = prev.fields.map(field => {
          if (field.Id === targetGroupId) {
            return {
              ...field,
              ChildFields: [...(field.ChildFields || []), newField]
            };
          }
          return field;
        });
        
        // Clean up any duplicates after adding to group
        return {
          ...prev,
          fields: cleanupDuplicateComponents(updatedFields)
        };
      });
    } else {
      // Adding to main form
      setFormData(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));
    }
    
    setSelectedField(newField);

    // Show notification with generated template details
    const smartComponents = [
      'GRIDLKP', 'LSTLKP', 'DATEPICKER', 'DATEPKR', 'SELECT', 'RADIOGRP', 'CHECKBOX', 
      'GROUP', 'NUMERIC', 'TEXT', 'TEXTAREA', 'BUTTON', 'HIDDEN', 'LABEL', 'SEPARATOR', 
      'IMAGE', 'PASSWORD', 'EMAIL', 'PHONE', 'URL', 'TIME', 'COLOR', 'RANGE', 'FILE', 
      'RATING', 'TOGGLE', 'PROGRESS', 'GRID', 'DIALOG', 'FILEUPLOAD'
    ];
    if (smartComponents.includes(componentType)) {
      toast({
        title: "Smart Component Added!",
        description: `${componentType} component with advanced properties generated (like ACCADJ/BUYTYP templates)`,
        variant: "default"
      });
    } else {
      toast({
        title: "Component Added",
        description: `${componentType} component added to form`,
        variant: "default"
      });
    }
  };

  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.Id !== fieldId)
    }));
    
    if (selectedField?.Id === fieldId) {
      setSelectedField(null);
    }
  };

  const updateFieldInFormData = (fieldId: string, updates: Partial<FormField>) => {
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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex h-screen">
        {/* Sidebar - Component Palette */}
        <div className={`w-64 border-r overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Components</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(ComponentCategories).map(([categoryKey, category]) => (
                <div key={categoryKey} className="space-y-1">
                  <div className={`flex items-center space-x-2 text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <category.icon className="w-3 h-3" />
                    <span>{category.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pl-2">
                    {Object.entries(category.components).map(([type, config]) => (
                      <DraggableComponent
                        key={type}
                        componentType={type}
                        label={(config as any).label}
                        icon={(config as any).icon}
                        color={(config as any).color}
                        isDarkMode={isDarkMode}
                        addField={addField}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Navigation with Dark Mode & External Components */}
          <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Primary Navigation */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className={`flex items-center gap-2 ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formData.title}
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Dark Mode Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                
                {/* Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className={isDarkMode ? 'border-gray-600 text-white hover:bg-gray-700' : ''}>
                      <MoreVertical className="h-4 w-4 mr-2" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                    <DropdownMenuItem onClick={() => setIsPreviewMode(!isPreviewMode)} className={isDarkMode ? 'text-white hover:bg-gray-700' : ''}>
                      <Eye className="h-4 w-4 mr-2" />
                      {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      // External Components functionality
                      toast({
                        title: "External Components",
                        description: "Opening component library...",
                      });
                    }} className={isDarkMode ? 'text-white hover:bg-gray-700' : ''}>
                      <Package className="h-4 w-4 mr-2" />
                      External Components
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSave} className={isDarkMode ? 'text-white hover:bg-gray-700' : ''}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Program
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExport} className={isDarkMode ? 'text-white hover:bg-gray-700' : ''}>
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Quick Actions */}
                <Button 
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  variant="outline"
                  size="sm"
                  className={isDarkMode ? 'border-gray-600 text-white hover:bg-gray-700' : ''}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {isPreviewMode ? 'Edit' : 'Preview'}
                </Button>
                <Button 
                  onClick={handleSave}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Secondary Toolbar */}
            <div className={`px-4 py-2 border-t ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-100 bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className={isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600'}>
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Guide
                  </Button>
                  <Button variant="ghost" size="sm" className={isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600'}>
                    <FileUp className="h-4 w-4 mr-1" />
                    Import
                  </Button>
                  <Button variant="ghost" size="sm" className={isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600'}>
                    <Code className="h-4 w-4 mr-1" />
                    Generate Code
                  </Button>
                  <Button variant="ghost" size="sm" className={isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600'}>
                    <Users className="h-4 w-4 mr-1" />
                    Collaborate
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
                    {formData.fields.length} Components
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, fields: [] }));
                      setSelectedField(null);
                      toast({
                        title: "Form Cleared",
                        description: "All components have been removed.",
                      });
                    }}
                    className={`${isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Excel-like Grid Construction Zone */}
          <div className={`flex-1 relative ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <ExcelGrid
              formData={formData}
              setFormData={setFormData}
              selectedField={selectedField}
              setSelectedField={setSelectedField}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Enhanced Properties Panel with Dark Mode */}
        {selectedField && (
          <Card className={`w-80 rounded-none border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className={isDarkMode ? 'border-gray-700' : ''}>
              <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Settings className="h-5 w-5" />
                Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Label</Label>
                <Input
                  value={selectedField.Label}
                  onChange={(e) => updateFieldInFormData(selectedField.Id, { Label: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Data Field</Label>
                <Input
                  value={selectedField.DataField}
                  onChange={(e) => updateFieldInFormData(selectedField.Id, { DataField: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Entity</Label>
                <Input
                  value={selectedField.Entity}
                  onChange={(e) => updateFieldInFormData(selectedField.Id, { Entity: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Width</Label>
                <Input
                  value={selectedField.Width}
                  onChange={(e) => updateFieldInFormData(selectedField.Id, { Width: e.target.value })}
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>
              
              {/* Advanced Properties based on component type */}
              {selectedField.Type === 'TEXT' && (
                <>
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : ''}>Max Length</Label>
                    <Input
                      value={(selectedField as any).MaxLength || ''}
                      onChange={(e) => updateFieldInFormData(selectedField.Id, { MaxLength: parseInt(e.target.value) || 255 })}
                      type="number"
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : ''}>Placeholder</Label>
                    <Input
                      value={(selectedField as any).Placeholder || ''}
                      onChange={(e) => updateFieldInFormData(selectedField.Id, { Placeholder: e.target.value })}
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                </>
              )}

              {selectedField.Type === 'GRIDLKP' && (
                <>
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : ''}>Lookup Source</Label>
                    <Input
                      value={(selectedField as any).LookupSource || ''}
                      onChange={(e) => updateFieldInFormData(selectedField.Id, { LookupSource: e.target.value })}
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : ''}>Display Columns</Label>
                    <Input
                      value={(selectedField as any).DisplayColumns || ''}
                      onChange={(e) => updateFieldInFormData(selectedField.Id, { DisplayColumns: e.target.value })}
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                </>
              )}

              <Separator className={isDarkMode ? 'bg-gray-600' : ''} />
              
              {/* Universal Properties */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedField.Required}
                  onCheckedChange={(checked) => updateFieldInFormData(selectedField.Id, { Required: checked })}
                />
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Required</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedField.Inline}
                  onCheckedChange={(checked) => updateFieldInFormData(selectedField.Id, { Inline: checked })}
                />
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Inline</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedField.Outlined}
                  onCheckedChange={(checked) => updateFieldInFormData(selectedField.Id, { Outlined: checked })}
                />
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Outlined</Label>
              </div>

              {/* Advanced Field Properties */}
              <Separator className={isDarkMode ? 'bg-gray-600' : ''} />
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Visible When</Label>
                <Textarea
                  value={(selectedField as any).VisibleWhen || ''}
                  onChange={(e) => updateFieldInFormData(selectedField.Id, { VisibleWhen: e.target.value })}
                  placeholder="Conditional expression"
                  className={`min-h-[60px] ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                />
              </div>
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Enabled When</Label>
                <Textarea
                  value={(selectedField as any).EnabledWhen || ''}
                  onChange={(e) => updateFieldInFormData(selectedField.Id, { EnabledWhen: e.target.value })}
                  placeholder="Conditional expression"
                  className={`min-h-[60px] ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}