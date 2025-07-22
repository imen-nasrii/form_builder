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
  Sun,
  FileText, 
  ToggleLeft, 
  Radio, 
  Image, 
  Monitor, 
  MessageSquare,
  ListOrdered,
  FileImage,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Star,
  Percent,
  Link,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Globe,
  Code
} from 'lucide-react';

// Form field interface with all possible attributes
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
  ReadOnly?: boolean;
  Visible?: boolean;
  Enabled?: boolean;
  Height?: string;
  MaxLength?: number;
  MinValue?: number;
  MaxValue?: number;
  DefaultValue?: string;
  Placeholder?: string;
  ToolTip?: string;
  ValidationRule?: string;
  LookupSource?: string;
  LookupCategory?: string;
  DisplayColumns?: string[];
  ValueColumn?: string;
  TextColumn?: string;
  FilterExpression?: string;
  SortExpression?: string;
  Items?: string[];
  MultiSelect?: boolean;
  ShowCheckboxes?: boolean;
  DateFormat?: string;
  MinDate?: string;
  MaxDate?: string;
  ShowTime?: boolean;
  TimeFormat?: string;
  DecimalPlaces?: number;
  ShowSpinner?: boolean;
  Step?: number;
  Formula?: string;
  OnClick?: string;
  ButtonType?: string;
  BackgroundColor?: string;
  TextColor?: string;
  FontSize?: string;
  FontWeight?: string;
  BorderRadius?: string;
  Padding?: string;
  Margin?: string;
  CssClass?: string;
  TabIndex?: number;
  AccessKey?: string;
  VisibleWhen?: string;
  EnabledWhen?: string;
  RequiredWhen?: string;
  Children?: FormField[];
  Columns?: number;
  Rows?: number;
  ResizeMode?: string;
  WrapMode?: string;
  AcceptedFileTypes?: string[];
  MaxFileSize?: number;
  AllowMultiple?: boolean;
  ShowProgress?: boolean;
}

interface FormData {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}



// Comprehensive component configurations with ALL business components
const ComponentTypes = {
  // Basic Input Components
  TEXT: { 
    icon: Type, 
    label: 'Text Input', 
    color: 'blue',
    category: 'Basic',
    defaultProps: {
      MaxLength: 255,
      Placeholder: 'Enter text...',
      ValidationRule: 'Required'
    }
  },
  TEXTAREA: { 
    icon: Grid3X3, 
    label: 'Text Area', 
    color: 'teal',
    category: 'Basic',
    defaultProps: {
      Rows: 4,
      Columns: 50,
      MaxLength: 1000,
      ResizeMode: 'vertical',
      Placeholder: 'Enter detailed text...'
    }
  },
  NUMERIC: { 
    icon: Hash, 
    label: 'Number', 
    color: 'indigo',
    category: 'Basic',
    defaultProps: {
      DecimalPlaces: 2,
      MinValue: 0,
      MaxValue: 999999,
      ShowSpinner: true,
      Step: 1
    }
  },
  PERCENTAGE: { 
    icon: Percent, 
    label: 'Percentage', 
    color: 'orange',
    category: 'Basic',
    defaultProps: {
      DecimalPlaces: 2,
      MinValue: 0,
      MaxValue: 100,
      ShowSpinner: true,
      DefaultValue: '0.00'
    }
  },
  EMAIL: { 
    icon: Mail, 
    label: 'Email', 
    color: 'red',
    category: 'Basic',
    defaultProps: {
      ValidationRule: 'Email',
      Placeholder: 'email@example.com',
      MaxLength: 100
    }
  },
  PHONE: { 
    icon: Phone, 
    label: 'Phone', 
    color: 'green',
    category: 'Basic',
    defaultProps: {
      ValidationRule: 'Phone',
      Placeholder: '+1 (555) 123-4567',
      MaxLength: 20
    }
  },
  URL: { 
    icon: Link, 
    label: 'URL', 
    color: 'cyan',
    category: 'Basic',
    defaultProps: {
      ValidationRule: 'URL',
      Placeholder: 'https://example.com',
      MaxLength: 200
    }
  },
  PASSWORD: { 
    icon: Lock, 
    label: 'Password', 
    color: 'gray',
    category: 'Basic',
    defaultProps: {
      MinLength: 8,
      MaxLength: 50,
      ValidationRule: 'Password',
      Placeholder: 'Enter secure password'
    }
  },

  // Selection Components  
  SELECT: { 
    icon: List, 
    label: 'Select Dropdown', 
    color: 'purple',
    category: 'Selection',
    defaultProps: {
      Items: ['Option 1', 'Option 2', 'Option 3'],
      DefaultValue: 'Option 1',
      Required: true
    }
  },
  LSTLKP: { 
    icon: ListOrdered, 
    label: 'List Lookup', 
    color: 'indigo',
    category: 'Selection',
    defaultProps: {
      LookupSource: 'DataTable',
      ValueColumn: 'ID',
      TextColumn: 'Name',
      DisplayColumns: ['Name', 'Description'],
      FilterExpression: 'Active = true'
    }
  },
  GRIDLKP: { 
    icon: Table, 
    label: 'Grid Lookup', 
    color: 'green',
    category: 'Selection',
    defaultProps: {
      LookupSource: 'DataTable',
      ValueColumn: 'ID',
      TextColumn: 'Name',
      DisplayColumns: ['ID', 'Name', 'Category', 'Status'],
      ShowCheckboxes: false,
      MultiSelect: false,
      Height: '300px'
    }
  },
  CHECKBOX: { 
    icon: CheckSquare, 
    label: 'Checkbox', 
    color: 'cyan',
    category: 'Selection',
    defaultProps: {
      DefaultValue: 'false',
      TextColor: '#333333'
    }
  },
  RADIO: { 
    icon: Radio, 
    label: 'Radio Button', 
    color: 'orange',
    category: 'Selection',
    defaultProps: {
      Items: ['Yes', 'No', 'Maybe'],
      DefaultValue: 'Yes',
      Inline: true
    }
  },
  TOGGLE: { 
    icon: ToggleLeft, 
    label: 'Toggle Switch', 
    color: 'blue',
    category: 'Selection',
    defaultProps: {
      DefaultValue: 'false',
      OnText: 'ON',
      OffText: 'OFF'
    }
  },

  // Date & Time Components
  DATEPICKER: { 
    icon: Calendar, 
    label: 'Date Picker', 
    color: 'orange',
    category: 'DateTime',
    defaultProps: {
      DateFormat: 'DD/MM/YYYY',
      ShowTime: false,
      MinDate: '01/01/2020',
      MaxDate: '31/12/2030',
      DefaultValue: 'Today'
    }
  },
  DATETIMEPICKER: { 
    icon: Clock, 
    label: 'Date Time Picker', 
    color: 'purple',
    category: 'DateTime',
    defaultProps: {
      DateFormat: 'DD/MM/YYYY HH:mm',
      ShowTime: true,
      TimeFormat: '24H',
      DefaultValue: 'Now'
    }
  },
  TIMEPICKER: { 
    icon: Clock, 
    label: 'Time Picker', 
    color: 'indigo',
    category: 'DateTime',
    defaultProps: {
      TimeFormat: '24H',
      ShowSeconds: false,
      Step: 15,
      DefaultValue: '09:00'
    }
  },

  // File & Media Components
  FILEUPLOAD: { 
    icon: Upload, 
    label: 'File Upload', 
    color: 'red',
    category: 'Media',
    defaultProps: {
      AcceptedFileTypes: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
      MaxFileSize: 10,
      AllowMultiple: false,
      ShowProgress: true
    }
  },
  IMAGEUPLOAD: { 
    icon: FileImage, 
    label: 'Image Upload', 
    color: 'pink',
    category: 'Media',
    defaultProps: {
      AcceptedFileTypes: ['.jpg', '.jpeg', '.png', '.gif'],
      MaxFileSize: 5,
      AllowMultiple: true,
      ShowPreview: true
    }
  },
  IMAGE: { 
    icon: Image, 
    label: 'Image Display', 
    color: 'green',
    category: 'Media',
    defaultProps: {
      Width: '200px',
      Height: '150px',
      BorderRadius: '4px',
      Alt: 'Image description'
    }
  },

  // Layout & Display Components
  LABEL: { 
    icon: FileText, 
    label: 'Label', 
    color: 'gray',
    category: 'Display',
    defaultProps: {
      FontWeight: 'bold',
      FontSize: '14px',
      TextColor: '#333333'
    }
  },
  HEADER: { 
    icon: Type, 
    label: 'Header', 
    color: 'blue',
    category: 'Display',
    defaultProps: {
      FontSize: '24px',
      FontWeight: 'bold',
      TextColor: '#1a1a1a',
      Margin: '0 0 20px 0'
    }
  },
  SEPARATOR: { 
    icon: FileText, 
    label: 'Separator', 
    color: 'gray',
    category: 'Display',
    defaultProps: {
      Height: '1px',
      BackgroundColor: '#e0e0e0',
      Margin: '20px 0'
    }
  },
  PANEL: { 
    icon: Monitor, 
    label: 'Panel', 
    color: 'indigo',
    category: 'Layout',
    defaultProps: {
      BorderRadius: '8px',
      Padding: '20px',
      BackgroundColor: '#f9f9f9',
      Children: []
    }
  },
  TAB: { 
    icon: Monitor, 
    label: 'Tab Container', 
    color: 'purple',
    category: 'Layout',
    defaultProps: {
      TabTitles: ['Tab 1', 'Tab 2', 'Tab 3'],
      ActiveTab: 0,
      Children: []
    }
  },
  GROUP: { 
    icon: Package, 
    label: 'Group Box', 
    color: 'teal',
    category: 'Layout',
    defaultProps: {
      BorderRadius: '4px',
      Padding: '15px',
      BorderColor: '#cccccc',
      Children: []
    }
  },

  // Action Components
  BUTTON: { 
    icon: Square, 
    label: 'Button', 
    color: 'red',
    category: 'Action',
    defaultProps: {
      ButtonType: 'submit',
      BackgroundColor: '#007bff',
      TextColor: '#ffffff',
      BorderRadius: '4px',
      Padding: '10px 20px',
      OnClick: 'HandleClick'
    }
  },
  LINK: { 
    icon: Link, 
    label: 'Link Button', 
    color: 'blue',
    category: 'Action',
    defaultProps: {
      TextColor: '#007bff',
      OnClick: 'Navigate',
      Target: '_self'
    }
  },

  // Advanced Components
  GRID: { 
    icon: Table, 
    label: 'Data Grid', 
    color: 'green',
    category: 'Advanced',
    defaultProps: {
      DataSource: 'TableName',
      DisplayColumns: ['ID', 'Name', 'Status', 'Created'],
      ShowPaging: true,
      PageSize: 25,
      ShowFilters: true,
      AllowSorting: true,
      Height: '400px'
    }
  },
  CHART: { 
    icon: Star, 
    label: 'Chart', 
    color: 'orange',
    category: 'Advanced',
    defaultProps: {
      ChartType: 'Bar',
      DataSource: 'ChartData',
      XAxisColumn: 'Category',
      YAxisColumn: 'Value',
      Width: '100%',
      Height: '300px'
    }
  },
  MAP: { 
    icon: MapPin, 
    label: 'Map', 
    color: 'green',
    category: 'Advanced',
    defaultProps: {
      MapType: 'roadmap',
      Zoom: 10,
      Width: '100%',
      Height: '400px',
      ShowMarkers: true
    }
  },
  CALCULATOR: { 
    icon: Hash, 
    label: 'Calculator', 
    color: 'purple',
    category: 'Advanced',
    defaultProps: {
      Formula: 'SUM(Field1, Field2)',
      DecimalPlaces: 2,
      ReadOnly: true,
      AutoCalculate: true
    }
  },
  RATING: { 
    icon: Star, 
    label: 'Rating', 
    color: 'yellow',
    category: 'Advanced',
    defaultProps: {
      MaxRating: 5,
      DefaultValue: 3,
      ShowLabels: true,
      StarSize: 'medium'
    }
  },
  SIGNATURE: { 
    icon: FileText, 
    label: 'Signature Pad', 
    color: 'indigo',
    category: 'Advanced',
    defaultProps: {
      Width: '400px',
      Height: '200px',
      BackgroundColor: '#ffffff',
      PenColor: '#000000',
      PenWidth: 2
    }
  },
  QR: { 
    icon: Code, 
    label: 'QR Code', 
    color: 'black',
    category: 'Advanced',
    defaultProps: {
      DataSource: 'QRData',
      Size: '150px',
      ErrorCorrection: 'M'
    }
  },
  BARCODE: { 
    icon: Code, 
    label: 'Barcode', 
    color: 'gray',
    category: 'Advanced',
    defaultProps: {
      DataSource: 'BarcodeData',
      BarcodeType: 'Code128',
      Width: '200px',
      Height: '50px'
    }
  }
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

  // Create new field from component type with all default properties
  const createField = useCallback((componentType: string): FormField => {
    const timestamp = Date.now();
    const config = ComponentTypes[componentType as keyof typeof ComponentTypes];
    
    const baseField: FormField = {
      Id: `${componentType}_${timestamp}`,
      Type: componentType,
      Label: config?.label || componentType,
      DataField: `${componentType.toLowerCase()}_${timestamp}`,
      Entity: 'DefaultEntity',
      Width: '100%',
      Required: false,
      Inline: false,
      Outlined: false,
      ReadOnly: false,
      Visible: true,
      Enabled: true,
      ...config?.defaultProps // Merge all the specific default properties for this component type
    };

    return baseField;
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
          <div className={`w-80 border-r overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="p-4">
              <h3 className="font-semibold mb-4">All Components</h3>
              
              {/* Group components by category */}
              {['Basic', 'Selection', 'DateTime', 'Media', 'Display', 'Layout', 'Action', 'Advanced'].map(categoryName => {
                const categoryComponents = Object.entries(ComponentTypes).filter(([_, config]) => 
                  config.category === categoryName
                );
                
                if (categoryComponents.length === 0) return null;
                
                return (
                  <div key={categoryName} className="mb-6">
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {categoryName} Components
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {categoryComponents.map(([type, config]) => (
                        <PaletteItem
                          key={type}
                          componentType={type}
                          config={config}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
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
                <CardContent className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Basic Properties */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-sm">Basic Properties</h5>
                    
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
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Width</Label>
                        <Input
                          value={selectedField.Width}
                          onChange={(e) => updateField(selectedField.Id, { Width: e.target.value })}
                        />
                      </div>
                      {selectedField.Height && (
                        <div>
                          <Label>Height</Label>
                          <Input
                            value={selectedField.Height || ''}
                            onChange={(e) => updateField(selectedField.Id, { Height: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* State Properties */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm">State & Behavior</h5>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedField.Required || false}
                        onCheckedChange={(checked) => updateField(selectedField.Id, { Required: checked })}
                      />
                      <Label>Required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedField.Visible !== false}
                        onCheckedChange={(checked) => updateField(selectedField.Id, { Visible: checked })}
                      />
                      <Label>Visible</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedField.Enabled !== false}
                        onCheckedChange={(checked) => updateField(selectedField.Id, { Enabled: checked })}
                      />
                      <Label>Enabled</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedField.ReadOnly || false}
                        onCheckedChange={(checked) => updateField(selectedField.Id, { ReadOnly: checked })}
                      />
                      <Label>Read Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedField.Inline || false}
                        onCheckedChange={(checked) => updateField(selectedField.Id, { Inline: checked })}
                      />
                      <Label>Inline</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedField.Outlined || false}
                        onCheckedChange={(checked) => updateField(selectedField.Id, { Outlined: checked })}
                      />
                      <Label>Outlined</Label>
                    </div>
                  </div>

                  {/* Input Validation */}
                  {(selectedField.Type === 'TEXT' || selectedField.Type === 'TEXTAREA' || selectedField.Type === 'EMAIL') && (
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">Input Properties</h5>
                      
                      {selectedField.Placeholder !== undefined && (
                        <div>
                          <Label>Placeholder</Label>
                          <Input
                            value={selectedField.Placeholder || ''}
                            onChange={(e) => updateField(selectedField.Id, { Placeholder: e.target.value })}
                          />
                        </div>
                      )}
                      
                      {selectedField.MaxLength !== undefined && (
                        <div>
                          <Label>Max Length</Label>
                          <Input
                            type="number"
                            value={selectedField.MaxLength || ''}
                            onChange={(e) => updateField(selectedField.Id, { MaxLength: parseInt(e.target.value) || undefined })}
                          />
                        </div>
                      )}
                      
                      {selectedField.ValidationRule !== undefined && (
                        <div>
                          <Label>Validation Rule</Label>
                          <Input
                            value={selectedField.ValidationRule || ''}
                            onChange={(e) => updateField(selectedField.Id, { ValidationRule: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Numeric Properties */}
                  {(selectedField.Type === 'NUMERIC' || selectedField.Type === 'PERCENTAGE') && (
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">Numeric Properties</h5>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Min Value</Label>
                          <Input
                            type="number"
                            value={selectedField.MinValue || ''}
                            onChange={(e) => updateField(selectedField.Id, { MinValue: parseFloat(e.target.value) || undefined })}
                          />
                        </div>
                        <div>
                          <Label>Max Value</Label>
                          <Input
                            type="number"
                            value={selectedField.MaxValue || ''}
                            onChange={(e) => updateField(selectedField.Id, { MaxValue: parseFloat(e.target.value) || undefined })}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Decimal Places</Label>
                          <Input
                            type="number"
                            value={selectedField.DecimalPlaces || ''}
                            onChange={(e) => updateField(selectedField.Id, { DecimalPlaces: parseInt(e.target.value) || undefined })}
                          />
                        </div>
                        <div>
                          <Label>Step</Label>
                          <Input
                            type="number"
                            value={selectedField.Step || ''}
                            onChange={(e) => updateField(selectedField.Id, { Step: parseFloat(e.target.value) || undefined })}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedField.ShowSpinner || false}
                          onCheckedChange={(checked) => updateField(selectedField.Id, { ShowSpinner: checked })}
                        />
                        <Label>Show Spinner</Label>
                      </div>
                    </div>
                  )}

                  {/* Lookup Properties */}
                  {(selectedField.Type === 'GRIDLKP' || selectedField.Type === 'LSTLKP') && (
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">Lookup Properties</h5>
                      
                      <div>
                        <Label>Lookup Source</Label>
                        <Input
                          value={selectedField.LookupSource || ''}
                          onChange={(e) => updateField(selectedField.Id, { LookupSource: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Value Column</Label>
                        <Input
                          value={selectedField.ValueColumn || ''}
                          onChange={(e) => updateField(selectedField.Id, { ValueColumn: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Text Column</Label>
                        <Input
                          value={selectedField.TextColumn || ''}
                          onChange={(e) => updateField(selectedField.Id, { TextColumn: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Filter Expression</Label>
                        <Input
                          value={selectedField.FilterExpression || ''}
                          onChange={(e) => updateField(selectedField.Id, { FilterExpression: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Date Properties */}
                  {(selectedField.Type === 'DATEPICKER' || selectedField.Type === 'DATETIMEPICKER') && (
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">Date Properties</h5>
                      
                      <div>
                        <Label>Date Format</Label>
                        <Input
                          value={selectedField.DateFormat || ''}
                          onChange={(e) => updateField(selectedField.Id, { DateFormat: e.target.value })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Min Date</Label>
                          <Input
                            value={selectedField.MinDate || ''}
                            onChange={(e) => updateField(selectedField.Id, { MinDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Max Date</Label>
                          <Input
                            value={selectedField.MaxDate || ''}
                            onChange={(e) => updateField(selectedField.Id, { MaxDate: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      {selectedField.Type === 'DATETIMEPICKER' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={selectedField.ShowTime || false}
                              onCheckedChange={(checked) => updateField(selectedField.Id, { ShowTime: checked })}
                            />
                            <Label>Show Time</Label>
                          </div>
                          <div>
                            <Label>Time Format</Label>
                            <Input
                              value={selectedField.TimeFormat || ''}
                              onChange={(e) => updateField(selectedField.Id, { TimeFormat: e.target.value })}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Style Properties */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm">Appearance</h5>
                    
                    {selectedField.BackgroundColor !== undefined && (
                      <div>
                        <Label>Background Color</Label>
                        <Input
                          value={selectedField.BackgroundColor || ''}
                          onChange={(e) => updateField(selectedField.Id, { BackgroundColor: e.target.value })}
                        />
                      </div>
                    )}
                    
                    {selectedField.TextColor !== undefined && (
                      <div>
                        <Label>Text Color</Label>
                        <Input
                          value={selectedField.TextColor || ''}
                          onChange={(e) => updateField(selectedField.Id, { TextColor: e.target.value })}
                        />
                      </div>
                    )}
                    
                    {selectedField.FontSize !== undefined && (
                      <div>
                        <Label>Font Size</Label>
                        <Input
                          value={selectedField.FontSize || ''}
                          onChange={(e) => updateField(selectedField.Id, { FontSize: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  {/* Advanced Properties */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm">Advanced</h5>
                    
                    <div>
                      <Label>Default Value</Label>
                      <Input
                        value={selectedField.DefaultValue || ''}
                        onChange={(e) => updateField(selectedField.Id, { DefaultValue: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label>Tooltip</Label>
                      <Input
                        value={selectedField.ToolTip || ''}
                        onChange={(e) => updateField(selectedField.Id, { ToolTip: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label>CSS Class</Label>
                      <Input
                        value={selectedField.CssClass || ''}
                        onChange={(e) => updateField(selectedField.Id, { CssClass: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label>Tab Index</Label>
                      <Input
                        type="number"
                        value={selectedField.TabIndex || ''}
                        onChange={(e) => updateField(selectedField.Id, { TabIndex: parseInt(e.target.value) || undefined })}
                      />
                    </div>
                  </div>

                  {/* Conditional Properties */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm">Conditional Logic</h5>
                    
                    <div>
                      <Label>Visible When</Label>
                      <Textarea
                        value={selectedField.VisibleWhen || ''}
                        onChange={(e) => updateField(selectedField.Id, { VisibleWhen: e.target.value })}
                        placeholder="Conditional expression"
                        className="min-h-[60px]"
                      />
                    </div>
                    
                    <div>
                      <Label>Enabled When</Label>
                      <Textarea
                        value={selectedField.EnabledWhen || ''}
                        onChange={(e) => updateField(selectedField.Id, { EnabledWhen: e.target.value })}
                        placeholder="Conditional expression"
                        className="min-h-[60px]"
                      />
                    </div>
                    
                    <div>
                      <Label>Required When</Label>
                      <Textarea
                        value={selectedField.RequiredWhen || ''}
                        onChange={(e) => updateField(selectedField.Id, { RequiredWhen: e.target.value })}
                        placeholder="Conditional expression"
                        className="min-h-[60px]"
                      />
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