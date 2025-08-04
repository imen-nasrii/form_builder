import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date' | 'url' | 'email';
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
  email: Database
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
    required: false,
    category: 'basic'
  });
  const { toast } = useToast();

  const generateId = () => `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addProperty = () => {
    if (!newProperty.name?.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la propriété est requis",
        variant: "destructive"
      });
      return;
    }

    // Check if name already exists
    if (properties.some(p => p.name === newProperty.name)) {
      toast({
        title: "Error",
        description: "A property with this name already exists",
        variant: "destructive"
      });
      return;
    }

    const property: ComponentProperty = {
      id: generateId(),
      name: newProperty.name!,
      type: newProperty.type as ComponentProperty['type'],
      defaultValue: getTypedDefaultValue(newProperty.type as ComponentProperty['type'], newProperty.defaultValue),
      required: newProperty.required || false,
      description: newProperty.description,
      category: newProperty.category as ComponentProperty['category'],
      validation: newProperty.validation
    };

    onChange([...properties, property]);
    
    // Reset form
    setNewProperty({
      name: '',
      type: 'string',
      defaultValue: '',
      required: false,
      category: 'basic'
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Success",
      description: "Property added successfully"
    });
  };

  const updateProperty = (updatedProperty: ComponentProperty) => {
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
    onSave: (prop: ComponentProperty) => void; 
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

      onSave({
        id: formData.id || generateId(),
        name: formData.name!,
        type: formData.type as ComponentProperty['type'],
        defaultValue: getTypedDefaultValue(formData.type as ComponentProperty['type'], formData.defaultValue),
        required: formData.required || false,
        description: formData.description,
        category: formData.category as ComponentProperty['category'],
        validation: formData.validation
      });
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
                <SelectItem value="boolean">Boolean (true/false)</SelectItem>
                <SelectItem value="array">Array (array)</SelectItem>
                <SelectItem value="object">Object (object)</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <Select 
              value={formData.category || 'basic'} 
              onValueChange={(v) => setFormData({...formData, category: v as ComponentProperty['category']})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PropertyCategories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          ) : (
            <Input
              value={formData.defaultValue || ''}
              onChange={(e) => setFormData({...formData, defaultValue: e.target.value})}
              placeholder="Default value..."
              type={formData.type === 'number' ? 'number' : 'text'}
            />
          )}
        </div>

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

  const groupedProperties = properties.reduce((acc, prop) => {
    const category = prop.category || 'basic';
    if (!acc[category]) acc[category] = [];
    acc[category].push(prop);
    return acc;
  }, {} as Record<string, ComponentProperty[]>);

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
      {properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Code className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No properties defined</h3>
            <p className="text-gray-500 text-center mb-4">
              Start by adding properties to configure your external component
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
                                  <DialogTitle>Modifier la Propriété</DialogTitle>
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
                Total: {properties.length} propriété{properties.length > 1 ? 's' : ''} • 
                {properties.filter(p => p.required).length} requise{properties.filter(p => p.required).length > 1 ? 's' : ''}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}