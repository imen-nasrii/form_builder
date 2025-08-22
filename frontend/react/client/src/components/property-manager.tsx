import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Trash2, 
  Edit, 
  Plus, 
  Save, 
  X, 
  Type, 
  Code, 
  Database,
  Globe,
  Key,
  Hash,
  Calendar,
  CheckSquare,
  List
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface ComponentProperty {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date' | 'url' | 'email' | 'enum' | 'GRIDLKP' | 'LSTLKP' | 'SELECT' | 'DATEPICKER' | 'CHECKBOX' | 'RADIOGRP' | 'GROUP' | 'TEXTBOX';
  defaultValue: any;
  required: boolean;
  description?: string;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    enum?: string[];
  };
  category?: 'basic' | 'api' | 'validation' | 'display' | 'behavior';
  // Additional properties for complex types
  width?: string;
  inline?: boolean;
  keyColumn?: string;
  itemInfo?: {
    mainProperty?: string;
    descProperty?: string;
    showDescription?: boolean;
  };
  loadDataInfo?: {
    dataModel?: string;
    columnsDefinition?: Array<{
      dataField: string;
      caption: string;
      dataType: string;
      visible?: boolean;
    }>;
  };
  optionValues?: { [key: string]: string };
  childFields?: ComponentProperty[];
  spacing?: string;
  enabledWhen?: {
    conditions: Array<{
      rightField: string;
      operator: string;
      value?: any;
      valueType?: string;
    }>;
  };
}

interface PropertyManagerProps {
  properties: ComponentProperty[];
  onChange: (properties: ComponentProperty[]) => void;
  className?: string;
}

const PropertyTypeIcons = {
  string: Type,
  number: Hash,
  boolean: CheckSquare,
  array: List,
  object: Code,
  date: Calendar,
  url: Globe,
  email: Database,
  GRIDLKP: Database,
  LSTLKP: List,
  SELECT: List,
  DATEPICKER: Calendar,
  CHECKBOX: CheckSquare,
  RADIOGRP: CheckSquare,
  GROUP: Code,
  TEXTBOX: Type,
  enum: List
};

const PropertyCategories = [
  { value: 'basic', label: 'Basic Properties', color: 'bg-blue-100 text-blue-800' },
  { value: 'api', label: 'API Configuration', color: 'bg-green-100 text-green-800' },
  { value: 'validation', label: 'Validation', color: 'bg-orange-100 text-orange-800' },
  { value: 'display', label: 'Display', color: 'bg-purple-100 text-purple-800' },
  { value: 'behavior', label: 'Behavior', color: 'bg-gray-100 text-gray-800' }
];

export default function PropertyManager({ properties, onChange, className = '' }: PropertyManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<ComponentProperty | null>(null);
  const [newProperty, setNewProperty] = useState<Partial<ComponentProperty>>({
    name: '',
    type: 'string',
    defaultValue: '',
    required: false
  });
  const { toast } = useToast();

  const generateId = () => `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addProperty = (propertyData: Partial<ComponentProperty>) => {
    if (!propertyData.name?.trim()) {
      toast({
        title: "Error",
        description: "Property name is required",
        variant: "destructive"
      });
      return;
    }

    // Check if name already exists
    if (properties.some(p => p.name === propertyData.name)) {
      toast({
        title: "Error",
        description: "A property with this name already exists",
        variant: "destructive"
      });
      return;
    }

    const property: ComponentProperty = {
      id: generateId(),
      name: propertyData.name!,
      type: propertyData.type as ComponentProperty['type'] || 'string',
      defaultValue: getTypedDefaultValue(propertyData.type as ComponentProperty['type'] || 'string', propertyData.defaultValue),
      required: propertyData.required || false,
      description: propertyData.description,
      category: 'basic' as ComponentProperty['category'],
      validation: propertyData.validation
    };

    console.log("Adding property:", property);
    console.log("Current properties before adding:", properties);
    const updatedProperties = [...properties, property];
    console.log("Updated properties after adding:", updatedProperties);
    onChange(updatedProperties);
    
    // Reset form
    setNewProperty({
      name: '',
      type: 'string',
      defaultValue: '',
      required: false
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Success",
      description: "Property added successfully"
    });
  };

  const updateProperty = (propertyData: Partial<ComponentProperty>) => {
    if (!propertyData.id) return;
    
    const updatedProperty: ComponentProperty = {
      id: propertyData.id,
      name: propertyData.name!,
      type: propertyData.type as ComponentProperty['type'] || 'string',
      defaultValue: getTypedDefaultValue(propertyData.type as ComponentProperty['type'] || 'string', propertyData.defaultValue),
      required: propertyData.required || false,
      description: propertyData.description,
      category: 'basic' as ComponentProperty['category'],
      validation: propertyData.validation
    };
    
    onChange(properties.map(p => p.id === updatedProperty.id ? updatedProperty : p));
    setEditingProperty(null);
    
    toast({
      title: "Success",
      description: "Property updated successfully"
    });
  };

  const deleteProperty = (propertyId: string) => {
    onChange(properties.filter(p => p.id !== propertyId));
    
    toast({
      title: "Success",
      description: "Property deleted successfully"
    });
  };

  const getTypedDefaultValue = (type: ComponentProperty['type'], value: any) => {
    switch (type) {
      case 'number':
        return value ? Number(value) : 0;
      case 'boolean':
        return Boolean(value);
      case 'array':
        try {
          return Array.isArray(value) ? value : JSON.parse(value || '[]');
        } catch {
          return [];
        }
      case 'object':
        try {
          return typeof value === 'object' ? value : JSON.parse(value || '{}');
        } catch {
          return {};
        }
      default:
        return value || '';
    }
  };

  const PropertyForm = ({ 
    property, 
    onSave, 
    onCancel 
  }: { 
    property: Partial<ComponentProperty>; 
    onSave: (prop: Partial<ComponentProperty>) => void; 
    onCancel: () => void; 
  }) => {
    const [formData, setFormData] = useState<Partial<ComponentProperty>>(property);

    const handleSave = () => {
      if (!formData.name?.trim()) {
        toast({
          title: "Error",
          description: "Property name is required",
          variant: "destructive"
        });
        return;
      }

      onSave(formData);
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Property Name *</Label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="placeholder, validation, defaultValue..."
            />
          </div>
          <div>
            <Label>Type</Label>
            <Select 
              value={formData.type || 'string'} 
              onValueChange={(v) => setFormData({...formData, type: v as ComponentProperty['type']})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">Text (string)</SelectItem>
                <SelectItem value="number">Number (number)</SelectItem>
                <SelectItem value="boolean">Boolean (boolean)</SelectItem>
                <SelectItem value="date">Date (date)</SelectItem>
                <SelectItem value="email">Email (email)</SelectItem>
                <SelectItem value="url">URL (url)</SelectItem>
                <SelectItem value="textarea">Text Area (textarea)</SelectItem>
                <SelectItem value="enum">Dropdown (enum)</SelectItem>
                <SelectItem value="array">Array (array)</SelectItem>
                <SelectItem value="object">Object (object)</SelectItem>
                <SelectItem value="TEXTBOX">Text Box</SelectItem>
                <SelectItem value="GRIDLKP">Grid Lookup</SelectItem>
                <SelectItem value="LSTLKP">List Lookup</SelectItem>
                <SelectItem value="SELECT">Select List</SelectItem>
                <SelectItem value="DATEPICKER">Date Picker</SelectItem>
                <SelectItem value="CHECKBOX">Checkbox</SelectItem>
                <SelectItem value="RADIOGRP">Radio Group</SelectItem>
                <SelectItem value="GROUP">Group Container</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.required || false}
              onChange={(e) => setFormData({...formData, required: e.target.checked})}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Required property</span>
          </label>
        </div>

        <div>
          <Label>Default Value</Label>
          {formData.type === 'boolean' ? (
            <Select 
              value={String(formData.defaultValue)} 
              onValueChange={(v) => setFormData({...formData, defaultValue: v === 'true'})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">false</SelectItem>
                <SelectItem value="true">true</SelectItem>
              </SelectContent>
            </Select>
          ) : formData.type === 'array' || formData.type === 'object' ? (
            <Textarea
              value={typeof formData.defaultValue === 'string' ? formData.defaultValue : JSON.stringify(formData.defaultValue, null, 2)}
              onChange={(e) => setFormData({...formData, defaultValue: e.target.value})}
              placeholder={formData.type === 'array' ? '["option1", "option2"]' : '{"key": "value"}'}
              className="font-mono"
              rows={3}
            />
          ) : formData.type === 'enum' ? (
            <Select 
              value={formData.defaultValue || ''} 
              onValueChange={(v) => setFormData({...formData, defaultValue: v})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default option..." />
              </SelectTrigger>
              <SelectContent>
                {formData.validation?.enum?.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : formData.type === 'number' ? (
            <Input
              type="number"
              value={formData.defaultValue || ''}
              onChange={(e) => setFormData({...formData, defaultValue: e.target.value ? Number(e.target.value) : ''})}
              placeholder="0"
            />
          ) : formData.type === 'string' ? (
            <Textarea
              value={formData.defaultValue || ''}
              onChange={(e) => setFormData({...formData, defaultValue: e.target.value})}
              placeholder="Default text area content..."
              rows={3}
            />
          ) : formData.type === 'date' ? (
            <Input
              type="date"
              value={formData.defaultValue || ''}
              onChange={(e) => setFormData({...formData, defaultValue: e.target.value})}
              placeholder="YYYY-MM-DD"
            />
          ) : formData.type === 'email' ? (
            <Input
              type="email"
              value={formData.defaultValue || ''}
              onChange={(e) => setFormData({...formData, defaultValue: e.target.value})}
              placeholder="example@email.com"
            />
          ) : formData.type === 'url' ? (
            <Input
              type="url"
              value={formData.defaultValue || ''}
              onChange={(e) => setFormData({...formData, defaultValue: e.target.value})}
              placeholder="https://example.com"
            />
          ) : formData.type === 'textarea' ? (
            <Textarea
              value={formData.defaultValue || ''}
              onChange={(e) => setFormData({...formData, defaultValue: e.target.value})}
              placeholder="Default text area content..."
              rows={4}
            />
          ) : (
            <Input
              value={formData.defaultValue || ''}
              onChange={(e) => setFormData({...formData, defaultValue: e.target.value})}
              placeholder="Default value..."
              type={formData.type === 'number' ? 'number' : 'text'}
            />
          )}
        </div>

        {/* Conditional fields based on type */}
        {(formData.type === 'GRIDLKP' || formData.type === 'LSTLKP') && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm">Lookup Configuration</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Key Column</Label>
                <Input
                  value={formData.keyColumn || ''}
                  onChange={(e) => setFormData({...formData, keyColumn: e.target.value})}
                  placeholder="fund, tkr, seccat..."
                />
              </div>
              <div>
                <Label>Width</Label>
                <Input
                  value={formData.width || ''}
                  onChange={(e) => setFormData({...formData, width: e.target.value})}
                  placeholder="32, 100px..."
                />
              </div>
            </div>

            <div>
              <Label>Data Model</Label>
              <Input
                value={formData.loadDataInfo?.dataModel || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  loadDataInfo: { ...formData.loadDataInfo, dataModel: e.target.value }
                })}
                placeholder="Fndmas, Secrty, Seccat..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Main Property</Label>
                <Input
                  value={formData.itemInfo?.mainProperty || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    itemInfo: { ...formData.itemInfo, mainProperty: e.target.value }
                  })}
                  placeholder="fund, tkr..."
                />
              </div>
              <div>
                <Label>Description Property</Label>
                <Input
                  value={formData.itemInfo?.descProperty || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    itemInfo: { ...formData.itemInfo, descProperty: e.target.value }
                  })}
                  placeholder="acnam1, tkr_DESC..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.itemInfo?.showDescription || false}
                onChange={(e) => setFormData({
                  ...formData, 
                  itemInfo: { ...formData.itemInfo, showDescription: e.target.checked }
                })}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Show Description</span>
            </div>
          </div>
        )}

        {formData.type === 'SELECT' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm">Select Options</h4>
            
            <div>
              <Label>Option Values (JSON format)</Label>
              <Textarea
                value={formData.optionValues ? JSON.stringify(formData.optionValues, null, 2) : ''}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({...formData, optionValues: parsed});
                  } catch {
                    // Invalid JSON, keep the current valid value
                    // setFormData({...formData, optionValues: e.target.value});
                  }
                }}
                placeholder={`{\n  "0": "",\n  "1": "GNMA I",\n  "2": "GNMA II"\n}`}
                className="font-mono"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width</Label>
                <Input
                  value={formData.width || ''}
                  onChange={(e) => setFormData({...formData, width: e.target.value})}
                  placeholder="32, 100px..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.inline || false}
                  onChange={(e) => setFormData({...formData, inline: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Inline</span>
              </div>
            </div>
          </div>
        )}

        {(formData.type === 'DATEPICKER' || formData.type === 'TEXTBOX') && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm">Field Configuration</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width</Label>
                <Input
                  value={formData.width || ''}
                  onChange={(e) => setFormData({...formData, width: e.target.value})}
                  placeholder="32, 100px..."
                />
              </div>
              <div>
                <Label>Spacing</Label>
                <Input
                  value={formData.spacing || ''}
                  onChange={(e) => setFormData({...formData, spacing: e.target.value})}
                  placeholder="0, 30..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.inline || false}
                onChange={(e) => setFormData({...formData, inline: e.target.checked})}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Inline</span>
            </div>
          </div>
        )}

        {formData.type === 'RADIOGRP' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm">Radio Group Options</h4>
            
            <div>
              <Label>Option Values (JSON format)</Label>
              <Textarea
                value={formData.optionValues ? JSON.stringify(formData.optionValues, null, 2) : ''}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({...formData, optionValues: parsed});
                  } catch {
                    // Invalid JSON, keep the current valid value
                  }
                }}
                placeholder={`{\n  "dfCurrent": "DFCURRENT",\n  "dfPosting": "DFPOST",\n  "dfReval": "DFVAL"\n}`}
                className="font-mono"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width</Label>
                <Input
                  value={formData.width || ''}
                  onChange={(e) => setFormData({...formData, width: e.target.value})}
                  placeholder="100, 600px..."
                />
              </div>
              <div>
                <Label>Spacing</Label>
                <Input
                  value={formData.spacing || ''}
                  onChange={(e) => setFormData({...formData, spacing: e.target.value})}
                  placeholder="0, 30..."
                />
              </div>
            </div>
          </div>
        )}

        {formData.type === 'CHECKBOX' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm">Checkbox Configuration</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width</Label>
                <Input
                  value={formData.width || ''}
                  onChange={(e) => setFormData({...formData, width: e.target.value})}
                  placeholder="600px..."
                />
              </div>
              <div>
                <Label>Spacing</Label>
                <Input
                  value={formData.spacing || ''}
                  onChange={(e) => setFormData({...formData, spacing: e.target.value})}
                  placeholder="0, 30..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.inline || false}
                onChange={(e) => setFormData({...formData, inline: e.target.checked})}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Inline</span>
            </div>
          </div>
        )}

        {formData.type === 'enum' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm">Enum Configuration</h4>
            
            <div>
              <Label>Enum Options (one per line)</Label>
              <Textarea
                value={formData.validation?.enum?.join('\n') || ''}
                onChange={(e) => {
                  const options = e.target.value.split('\n').filter(opt => opt.trim());
                  setFormData({
                    ...formData, 
                    validation: { ...formData.validation, enum: options }
                  });
                }}
                placeholder={`Option 1\nOption 2\nOption 3`}
                rows={6}
                className="font-mono resize-none"
                style={{ whiteSpace: 'pre-wrap' }}
                onKeyDown={(e) => {
                  // Force Enter key to work in textarea
                  if (e.key === 'Enter') {
                    e.stopPropagation();
                    e.preventDefault();
                    const target = e.target as HTMLTextAreaElement;
                    const start = target.selectionStart;
                    const end = target.selectionEnd;
                    const currentValue = target.value;
                    const newValue = currentValue.substring(0, start) + '\n' + currentValue.substring(end);
                    
                    // Update the form data
                    const options = newValue.split('\n').filter(opt => opt.trim());
                    setFormData({
                      ...formData, 
                      validation: { ...formData.validation, enum: options }
                    });
                    
                    // Set cursor position after the inserted newline
                    setTimeout(() => {
                      target.selectionStart = target.selectionEnd = start + 1;
                    }, 0);
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Appuyez sur <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Entrée</kbd> pour ajouter une nouvelle option
              </p>
            </div>
          </div>
        )}

        {formData.type === 'GROUP' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm">Group Configuration</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Spacing</Label>
                <Input
                  value={formData.spacing || ''}
                  onChange={(e) => setFormData({...formData, spacing: e.target.value})}
                  placeholder="0, 30..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.inline || false}
                  onChange={(e) => setFormData({...formData, inline: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Inline</span>
              </div>
            </div>

            <div>
              <Label>Child Fields (JSON format)</Label>
              <Textarea
                value={formData.childFields ? JSON.stringify(formData.childFields, null, 2) : ''}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({...formData, childFields: parsed});
                  } catch {
                    // Invalid JSON, keep the current valid value
                  }
                }}
                placeholder={`[\n  {\n    "Id": "Doasof",\n    "type": "RADIOGRP",\n    "value": "dfCurrent"\n  }\n]`}
                className="font-mono"
                rows={6}
              />
            </div>
          </div>
        )}

        <div>
          <Label>Description (optional)</Label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Description of this property..."
            rows={2}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  // Debug logging
  console.log("PropertyManager - Current properties:", properties);
  console.log("PropertyManager - Properties length:", properties.length);
  
  const groupedProperties = properties.reduce((acc, prop) => {
    const category = prop.category || 'basic';
    if (!acc[category]) acc[category] = [];
    acc[category].push(prop);
    return acc;
  }, {} as Record<string, ComponentProperty[]>);
  
  console.log("PropertyManager - Grouped properties:", groupedProperties);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Component Properties</h3>
          <p className="text-sm text-gray-600">
            Define the configurable properties of your external component
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Property</DialogTitle>
              <DialogDescription>
                Add a new configurable property to your external component
              </DialogDescription>
            </DialogHeader>
            <PropertyForm
              property={newProperty}
              onSave={addProperty}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Properties List */}
      <div className="border border-red-300 p-4 bg-red-50">
        <p className="text-sm text-red-700">DEBUG: Properties count: {properties.length}</p>
        <p className="text-xs text-red-600">Properties: {JSON.stringify(properties, null, 2)}</p>
      </div>
      
      {properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Code className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No properties defined yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Click "Add Property" above to start creating your component properties
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add first property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {PropertyCategories.map(category => {
            const categoryProps = groupedProperties[category.value] || [];
            if (categoryProps.length === 0) return null;

            return (
              <Card key={category.value}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={category.color}>{category.label}</Badge>
                    <span className="text-sm text-gray-500">({categoryProps.length})</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryProps.map(property => {
                      const IconComponent = PropertyTypeIcons[property.type];
                      
                      return (
                        <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-4 h-4 text-gray-500" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{property.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {property.type}
                                </Badge>
                                {property.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              {property.description && (
                                <p className="text-sm text-gray-600">{property.description}</p>
                              )}
                              <p className="text-xs text-gray-500">
                                Default: {typeof property.defaultValue === 'object' 
                                  ? JSON.stringify(property.defaultValue)
                                  : String(property.defaultValue)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Edit Property</DialogTitle>
                                </DialogHeader>
                                <PropertyForm
                                  property={property}
                                  onSave={updateProperty}
                                  onCancel={() => setEditingProperty(null)}
                                />
                              </DialogContent>
                            </Dialog>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteProperty(property.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {properties.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-blue-800">
              <Key className="w-4 h-4" />
              <span className="text-sm font-medium">
                Total: {properties.length} propert{properties.length > 1 ? 'ies' : 'y'} • 
                {properties.filter(p => p.required).length} required
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}