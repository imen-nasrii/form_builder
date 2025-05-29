import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  AlignLeft, 
  CheckSquare, 
  List, 
  Calendar, 
  Upload, 
  Table, 
  Search, 
  Square, 
  Play, 
  RotateCcw, 
  X, 
  AlertTriangle,
  Trash2,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

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

const ComponentTypes = {
  TEXT: { icon: Type, label: 'Text Input', color: 'blue' },
  TEXTAREA: { icon: AlignLeft, label: 'Text Area', color: 'green' },
  SELECT: { icon: List, label: 'Select', color: 'orange' },
  CHECKBOX: { icon: CheckSquare, label: 'Checkbox', color: 'cyan' },
  DATEPICKER: { icon: Calendar, label: 'Date Picker', color: 'purple' },
  FILEUPLOAD: { icon: Upload, label: 'File Upload', color: 'pink' },
  GRIDLKP: { icon: Table, label: 'Grid Lookup', color: 'indigo' },
  LSTLKP: { icon: Search, label: 'List Lookup', color: 'teal' },
  GROUP: { icon: Square, label: 'Group', color: 'violet' },
  ACTION: { icon: Play, label: 'Action Button', color: 'red' },
  WARNING: { icon: AlertTriangle, label: 'Warning', color: 'yellow' }
};

function DraggableComponent({ componentType, label, icon: Icon, color }: {
  componentType: string;
  label: string;
  icon: any;
  color: string;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('componentType', componentType);
      }}
      className={`p-3 border-2 border-dashed rounded-lg cursor-move transition-all hover:shadow-md bg-${color}-50 border-${color}-200 hover:border-${color}-400`}
    >
      <div className="flex items-center space-x-2">
        <Icon className={`w-4 h-4 text-${color}-600`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}

function FieldComponent({ 
  field, 
  onSelect, 
  onRemove, 
  isSelected,
  addField 
}: { 
  field: FormField; 
  onSelect: () => void;
  onRemove: () => void;
  isSelected: boolean;
  addField: (type: string, groupId?: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  if (field.Type === 'GROUP') {
    return (
      <GroupField 
        field={field} 
        onSelect={onSelect} 
        onRemove={onRemove} 
        isSelected={isSelected}
        addField={addField}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
    );
  }

  const componentType = ComponentTypes[field.Type as keyof typeof ComponentTypes];
  const Icon = componentType?.icon || Type;
  const color = componentType?.color || 'gray';

  return (
    <div
      onClick={onSelect}
      className={`p-3 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`w-4 h-4 text-${color}-600`} />
          <div>
            <div className="font-medium text-sm">{field.Label || field.Id}</div>
            <div className="text-xs text-gray-500">{field.Type}</div>
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

function GroupField({
  field,
  onSelect,
  onRemove,
  isSelected,
  addField,
  isExpanded,
  setIsExpanded
}: {
  field: FormField;
  onSelect: () => void;
  onRemove: () => void;
  isSelected: boolean;
  addField: (type: string, groupId?: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'bg-purple-50 border-purple-200 hover:border-purple-300'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Square className="w-4 h-4 text-purple-600" />
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

      {isExpanded && (
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const componentType = e.dataTransfer.getData('componentType');
            if (componentType) {
              addField(componentType, field.Id);
            }
          }}
          className="min-h-24 p-4 border-2 border-dashed rounded transition-colors border-gray-200 bg-gray-50 hover:border-blue-500 hover:bg-blue-50"
        >
          {(field.ChildFields || []).length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Square className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Glissez des composants ici</p>
            </div>
          ) : (
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PropertiesPanel({ field, onUpdate }: { 
  field: FormField; 
  onUpdate: (updates: Partial<FormField>) => void;
}) {
  const renderTypeSpecificProperties = () => {
    switch (field.Type) {
      case 'TEXTAREA':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Textarea Properties</h4>
            
            <div>
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="Tapez votre texte ici..."
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-rows">Rows</Label>
              <Input
                id="field-rows"
                value={field.Value || "3"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="3"
                className="text-sm"
                type="number"
                min="2"
                max="10"
              />
            </div>
          </div>
        );

      case 'SELECT':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Select Properties</h4>
            
            <div>
              <Label htmlFor="field-options">Options</Label>
              <Textarea
                id="field-options"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="Option1,Option2,Option3"
                className="text-sm"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="field-multiple">Type</Label>
              <Input
                id="field-multiple"
                value={field.Value || "single"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="single ou multiple"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'GRIDLKP':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Grid Lookup Properties</h4>
            
            <div>
              <Label htmlFor="field-source">Source Table</Label>
              <Input
                id="field-source"
                value={field.Entity}
                onChange={(e) => onUpdate({ Entity: e.target.value })}
                placeholder="Table ou vue source"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-columns">Display Columns</Label>
              <Textarea
                id="field-columns"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="Col1,Col2,Col3"
                className="text-sm"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="field-filter">Filter Expression</Label>
              <Input
                id="field-filter"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="WHERE condition"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'LSTLKP':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">List Lookup Properties</h4>
            
            <div>
              <Label htmlFor="field-lookup-table">Lookup Table</Label>
              <Input
                id="field-lookup-table"
                value={field.Entity}
                onChange={(e) => onUpdate({ Entity: e.target.value })}
                placeholder="LookupTable"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-display-field">Display Field</Label>
              <Input
                id="field-display-field"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="DisplayColumn"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-value-field">Value Field</Label>
              <Input
                id="field-value-field"
                value={field.DataField}
                onChange={(e) => onUpdate({ DataField: e.target.value })}
                placeholder="ValueColumn"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'DATEPICKER':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Date Picker Properties</h4>
            
            <div>
              <Label htmlFor="field-format">Date Format</Label>
              <Input
                id="field-format"
                value={field.Value || "dd/MM/yyyy"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="dd/MM/yyyy"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-minDate">Min Date</Label>
              <Input
                id="field-minDate"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="01/01/2020"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-maxDate">Max Date</Label>
              <Input
                id="field-maxDate"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="31/12/2030"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'ACTION':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Action Properties</h4>
            
            <div>
              <Label htmlFor="field-actionType">Action Type</Label>
              <Input
                id="field-actionType"
                value={field.Value || "submit"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="submit, reset, cancel, custom"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-url">URL/Endpoint</Label>
              <Input
                id="field-url"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="/api/submit"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-method">HTTP Method</Label>
              <Input
                id="field-method"
                value={field.Value || "POST"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="GET, POST, PUT, DELETE"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'WARNING':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Warning Properties</h4>
            
            <div>
              <Label htmlFor="field-message">Message</Label>
              <Textarea
                id="field-message"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="Message d'avertissement"
                className="text-sm"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="field-severity">Severity</Label>
              <Input
                id="field-severity"
                value={field.Value || "warning"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="info, warning, error, success"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'GROUP':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Group Properties</h4>
            
            <div>
              <Label htmlFor="field-groupTitle">Group Title</Label>
              <Input
                id="field-groupTitle"
                value={field.Label}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Titre du groupe"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-collapsible">Behavior</Label>
              <Input
                id="field-collapsible"
                value={field.Value || "static"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="static, collapsible, accordion"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-childCount">Child Fields Count</Label>
              <Input
                id="field-childCount"
                value={(field.ChildFields || []).length.toString()}
                readOnly
                className="text-sm bg-gray-100"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Propriétés</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="layout">Mise en page</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div>
              <Label htmlFor="field-label">Label</Label>
              <Input
                id="field-label"
                value={field.Label}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Nom du champ"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-datafield">Data Field</Label>
              <Input
                id="field-datafield"
                value={field.DataField}
                onChange={(e) => onUpdate({ DataField: e.target.value })}
                placeholder="nom_colonne"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-entity">Entity</Label>
              <Input
                id="field-entity"
                value={field.Entity}
                onChange={(e) => onUpdate({ Entity: e.target.value })}
                placeholder="TableName"
                className="text-sm"
              />
            </div>

            <Separator className="my-4" />
            
            {renderTypeSpecificProperties()}
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div>
              <Label>Width</Label>
              <Input
                value={field.Width}
                onChange={(e) => onUpdate({ Width: e.target.value })}
                placeholder="100%"
                className="text-sm"
              />
            </div>

            <div>
              <Label>Spacing</Label>
              <Input
                value={field.Spacing}
                onChange={(e) => onUpdate({ Spacing: e.target.value })}
                placeholder="md"
                className="text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="field-inline"
                checked={field.Inline}
                onChange={(e) => onUpdate({ Inline: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="field-inline">Inline</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="field-outlined"
                checked={field.Outlined}
                onChange={(e) => onUpdate({ Outlined: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="field-outlined">Outlined</Label>
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="field-required"
                checked={field.Required}
                onChange={(e) => onUpdate({ Required: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="field-required">Required</Label>
            </div>

            <div>
              <Label htmlFor="field-minLength">Min Length</Label>
              <Input
                id="field-minLength"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="0"
                className="text-sm"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="field-maxLength">Max Length</Label>
              <Input
                id="field-maxLength"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="255"
                className="text-sm"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="field-pattern">Pattern (Regex)</Label>
              <Input
                id="field-pattern"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="^[a-zA-Z0-9]+$"
                className="text-sm"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default function FormBuilderFixed() {
  const [formData, setFormData] = useState({
    menuId: 'FORM001',
    label: 'Mon Formulaire',
    formWidth: '700px',
    layout: 'PROCESS',
    fields: [] as FormField[]
  });

  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const formBuilderRef = useRef<HTMLDivElement>(null);

  const createDefaultField = (componentType: string): FormField => {
    const timestamp = Date.now();
    return {
      Id: `${componentType}_${timestamp}`,
      Type: componentType,
      Label: `${ComponentTypes[componentType as keyof typeof ComponentTypes]?.label || componentType}`,
      DataField: `field_${timestamp}`,
      Entity: 'TableName',
      Width: '100%',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: false,
      Value: '',
      ChildFields: componentType === 'GROUP' ? [] : undefined
    };
  };

  const addField = (componentType: string, targetGroupId?: string) => {
    const newField = createDefaultField(componentType);
    
    if (targetGroupId) {
      setFormData(prev => ({
        ...prev,
        fields: prev.fields.map(field => {
          if (field.Id === targetGroupId) {
            return {
              ...field,
              ChildFields: [...(field.ChildFields || []), newField]
            };
          }
          return field;
        })
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));
    }
    
    setSelectedField(newField);
  };

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
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
            <p className="text-sm text-gray-600">Créez et configurez vos formulaires</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button size="sm">
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Composants</h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(ComponentTypes).map(([type, config]) => (
                <DraggableComponent
                  key={type}
                  componentType={type}
                  label={config.label}
                  icon={config.icon}
                  color={config.color}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg border h-full">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Zone de construction</h3>
            </div>
            <div 
              ref={formBuilderRef}
              className="p-6"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const componentType = e.dataTransfer.getData('componentType');
                if (componentType) {
                  addField(componentType);
                }
              }}
            >
              {formData.fields.length === 0 ? (
                <div className="text-center py-16 text-gray-400 border-2 border-dashed rounded-lg">
                  <Type className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Commencez à construire</p>
                  <p className="text-sm">Glissez des composants ici pour créer votre formulaire</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.fields.map((field) => (
                    <FieldComponent
                      key={field.Id}
                      field={field}
                      onSelect={() => setSelectedField(field)}
                      onRemove={() => removeField(field.Id)}
                      isSelected={selectedField?.Id === field.Id}
                      addField={addField}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-80 bg-white border-l overflow-y-auto">
          <Tabs defaultValue="properties" className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="properties">Propriétés</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="h-full">
              {selectedField ? (
                <PropertiesPanel
                  field={selectedField}
                  onUpdate={(updates) => updateFieldInFormData(selectedField.Id, updates)}
                />
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez un composant pour voir ses propriétés</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="json" className="h-full p-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Schema JSON</h3>
                <Textarea
                  value={JSON.stringify(formData, null, 2)}
                  readOnly
                  className="h-96 text-xs font-mono"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}