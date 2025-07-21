import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, Trash2, Type, Hash, ToggleLeft, Calendar, 
  Upload, Grid3X3, List, CheckSquare, RadioIcon,
  Star, Heart, Eye, Lock, User, Mail, Phone,
  MapPin, Globe, Code, Database, Settings,
  Palette, PenTool, Image, FileText, Folder,
  Tag, Bookmark, Clock, Shield, Zap
} from 'lucide-react';

interface CustomProperty {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  defaultValue: any;
  required: boolean;
  description?: string;
}

interface ComponentCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateComponent: (component: any) => void;
  isDarkMode?: boolean;
}

const availableIcons = [
  { name: 'Type', icon: Type, category: 'Input' },
  { name: 'Hash', icon: Hash, category: 'Input' },
  { name: 'CheckSquare', icon: CheckSquare, category: 'Input' },
  { name: 'RadioIcon', icon: RadioIcon, category: 'Input' },
  { name: 'Calendar', icon: Calendar, category: 'Input' },
  { name: 'Upload', icon: Upload, category: 'Input' },
  { name: 'Grid3X3', icon: Grid3X3, category: 'Display' },
  { name: 'List', icon: List, category: 'Display' },
  { name: 'Star', icon: Star, category: 'Display' },
  { name: 'Heart', icon: Heart, category: 'Display' },
  { name: 'Eye', icon: Eye, category: 'Display' },
  { name: 'User', icon: User, category: 'Profile' },
  { name: 'Mail', icon: Mail, category: 'Communication' },
  { name: 'Phone', icon: Phone, category: 'Communication' },
  { name: 'MapPin', icon: MapPin, category: 'Location' },
  { name: 'Globe', icon: Globe, category: 'Location' },
  { name: 'Lock', icon: Lock, category: 'Security' },
  { name: 'Shield', icon: Shield, category: 'Security' },
  { name: 'Database', icon: Database, category: 'Data' },
  { name: 'Code', icon: Code, category: 'Development' },
  { name: 'Settings', icon: Settings, category: 'System' },
  { name: 'Zap', icon: Zap, category: 'Action' },
  { name: 'Palette', icon: Palette, category: 'Design' },
  { name: 'PenTool', icon: PenTool, category: 'Design' },
  { name: 'Image', icon: Image, category: 'Media' },
  { name: 'FileText', icon: FileText, category: 'Document' },
  { name: 'Folder', icon: Folder, category: 'Organization' },
  { name: 'Tag', icon: Tag, category: 'Organization' },
  { name: 'Bookmark', icon: Bookmark, category: 'Organization' },
  { name: 'Clock', icon: Clock, category: 'Time' }
];

const componentCategories = [
  'INPUT_CONTROLS',
  'SELECTION_CONTROLS', 
  'LOOKUP_COMPONENTS',
  'CONTAINER_LAYOUT',
  'DATA_DISPLAY',
  'FILE_UPLOAD',
  'ACTION_VALIDATION'
];

const defaultProperties = [
  { name: 'DataField', type: 'string', defaultValue: '', description: 'Database field name' },
  { name: 'Label', type: 'string', defaultValue: 'My Component', description: 'Display label' },
  { name: 'Width', type: 'string', defaultValue: '100%', description: 'Component width' },
  { name: 'Required', type: 'boolean', defaultValue: false, description: 'Is field required' },
  { name: 'Disabled', type: 'boolean', defaultValue: false, description: 'Is component disabled' },
  { name: 'Placeholder', type: 'string', defaultValue: '', description: 'Placeholder text' },
  { name: 'Tooltip', type: 'string', defaultValue: '', description: 'Help tooltip' },
  { name: 'CssClass', type: 'string', defaultValue: '', description: 'Custom CSS classes' }
];

export default function AdvancedComponentCreator({ 
  isOpen, 
  onClose, 
  onCreateComponent, 
  isDarkMode = false 
}: ComponentCreatorProps) {
  const { toast } = useToast();
  
  // Component basic info
  const [componentName, setComponentName] = useState('');
  const [componentLabel, setComponentLabel] = useState('');
  const [componentDescription, setComponentDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [componentColor, setComponentColor] = useState('text-blue-500');
  const [componentCategory, setComponentCategory] = useState('INPUT_CONTROLS');
  
  // Properties management
  const [selectedDefaultProps, setSelectedDefaultProps] = useState<string[]>(['DataField', 'Label', 'Width', 'Required']);
  const [customProperties, setCustomProperties] = useState<CustomProperty[]>([]);
  const [currentStep, setCurrentStep] = useState<'basic' | 'properties' | 'preview'>('basic');
  
  // JSON generation
  const [generatedJson, setGeneratedJson] = useState('');

  const addCustomProperty = () => {
    const newProp: CustomProperty = {
      id: `custom_${Date.now()}`,
      name: '',
      type: 'string',
      defaultValue: '',
      required: false,
      description: ''
    };
    setCustomProperties(prev => [...prev, newProp]);
  };

  const updateCustomProperty = (id: string, updates: Partial<CustomProperty>) => {
    setCustomProperties(prev => 
      prev.map(prop => prop.id === id ? { ...prop, ...updates } : prop)
    );
  };

  const removeCustomProperty = (id: string) => {
    setCustomProperties(prev => prev.filter(prop => prop.id !== id));
  };

  const generateComponent = () => {
    if (!componentName || !componentLabel || !selectedIcon) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Build properties object
    const properties: Record<string, any> = {};
    
    // Add selected default properties
    selectedDefaultProps.forEach(propName => {
      const defaultProp = defaultProperties.find(p => p.name === propName);
      if (defaultProp) {
        properties[propName] = defaultProp.defaultValue;
      }
    });

    // Add custom properties
    customProperties.forEach(prop => {
      if (prop.name.trim()) {
        properties[prop.name] = prop.defaultValue;
      }
    });

    const component = {
      type: componentName.toUpperCase().replace(/\s+/g, '_'),
      label: componentLabel,
      icon: selectedIcon,
      color: componentColor,
      category: componentCategory,
      description: componentDescription,
      properties: properties,
      customProperties: customProperties.filter(prop => prop.name.trim()),
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    const json = JSON.stringify(component, null, 2);
    setGeneratedJson(json);
    setCurrentStep('preview');
  };

  const handleCreateComponent = () => {
    try {
      const component = JSON.parse(generatedJson);
      onCreateComponent(component);
      toast({
        title: "Component Created!",
        description: `${component.label} has been added to your palette.`
      });
      handleReset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create component. Please check the JSON.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    setComponentName('');
    setComponentLabel('');
    setComponentDescription('');
    setSelectedIcon('');
    setComponentColor('text-blue-500');
    setComponentCategory('INPUT_CONTROLS');
    setSelectedDefaultProps(['DataField', 'Label', 'Width', 'Required']);
    setCustomProperties([]);
    setGeneratedJson('');
    setCurrentStep('basic');
  };

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find(icon => icon.name === iconName);
    return iconData?.icon || Type;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
            <Plus className="w-5 h-5" />
            Advanced Component Creator
          </DialogTitle>
        </DialogHeader>

        <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="preview">Preview & Create</TabsTrigger>
          </TabsList>

          <div className="max-h-[60vh] overflow-y-auto mt-4">
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Component Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Component Name *</Label>
                      <Input
                        id="name"
                        value={componentName}
                        onChange={(e) => setComponentName(e.target.value)}
                        placeholder="CUSTOM_FIELD"
                        className="uppercase"
                      />
                    </div>
                    <div>
                      <Label htmlFor="label">Display Label *</Label>
                      <Input
                        id="label"
                        value={componentLabel}
                        onChange={(e) => setComponentLabel(e.target.value)}
                        placeholder="Custom Field"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={componentDescription}
                      onChange={(e) => setComponentDescription(e.target.value)}
                      placeholder="Describe what this component does..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Select value={componentCategory} onValueChange={setComponentCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {componentCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>
                              {cat.replace(/_/g, ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Color</Label>
                      <Select value={componentColor} onValueChange={setComponentColor}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-blue-500">Blue</SelectItem>
                          <SelectItem value="text-green-500">Green</SelectItem>
                          <SelectItem value="text-purple-500">Purple</SelectItem>
                          <SelectItem value="text-red-500">Red</SelectItem>
                          <SelectItem value="text-yellow-500">Yellow</SelectItem>
                          <SelectItem value="text-indigo-500">Indigo</SelectItem>
                          <SelectItem value="text-pink-500">Pink</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Icon *</Label>
                    <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto mt-2 border rounded-lg p-2">
                      {availableIcons.map((icon) => {
                        const IconComponent = icon.icon;
                        return (
                          <button
                            key={icon.name}
                            onClick={() => setSelectedIcon(icon.name)}
                            className={`p-2 rounded-lg border transition-all ${
                              selectedIcon === icon.name
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            title={`${icon.name} (${icon.category})`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                    {selectedIcon && (
                      <div className="mt-2 text-sm text-gray-600">
                        Selected: {selectedIcon}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Default Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {defaultProperties.map((prop) => (
                      <div key={prop.name} className="flex items-center space-x-2">
                        <Switch
                          checked={selectedDefaultProps.includes(prop.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedDefaultProps(prev => [...prev, prop.name]);
                            } else {
                              setSelectedDefaultProps(prev => prev.filter(p => p !== prop.name));
                            }
                          }}
                        />
                        <div>
                          <Label className="text-sm font-medium">{prop.name}</Label>
                          <p className="text-xs text-gray-500">{prop.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Custom Properties</CardTitle>
                  <Button size="sm" onClick={addCustomProperty}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Property
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customProperties.map((prop) => (
                    <div key={prop.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-2 gap-3 flex-1">
                          <Input
                            placeholder="Property Name"
                            value={prop.name}
                            onChange={(e) => updateCustomProperty(prop.id, { name: e.target.value })}
                          />
                          <Select 
                            value={prop.type} 
                            onValueChange={(value) => updateCustomProperty(prop.id, { type: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                              <SelectItem value="array">Array</SelectItem>
                              <SelectItem value="object">Object</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCustomProperty(prop.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <Input
                        placeholder="Default Value"
                        value={prop.defaultValue}
                        onChange={(e) => updateCustomProperty(prop.id, { defaultValue: e.target.value })}
                      />
                      
                      <Input
                        placeholder="Description (optional)"
                        value={prop.description || ''}
                        onChange={(e) => updateCustomProperty(prop.id, { description: e.target.value })}
                      />
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={prop.required}
                          onCheckedChange={(checked) => updateCustomProperty(prop.id, { required: checked })}
                        />
                        <Label>Required</Label>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Component Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {componentName && componentLabel && selectedIcon ? (
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${componentColor.replace('text-', 'bg-').replace('-500', '-100')} border`}>
                        {(() => {
                          const IconComponent = getIconComponent(selectedIcon);
                          return <IconComponent className={`w-5 h-5 ${componentColor}`} />;
                        })()}
                      </div>
                      <div>
                        <h4 className="font-medium">{componentLabel}</h4>
                        <p className="text-sm text-gray-500">{componentName}</p>
                        {componentDescription && (
                          <p className="text-xs text-gray-400 mt-1">{componentDescription}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {componentCategory.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Complete the basic information to see preview
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Generated JSON</CardTitle>
                  {!generatedJson && (
                    <Button onClick={generateComponent}>
                      Generate JSON
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {generatedJson ? (
                    <Textarea
                      value={generatedJson}
                      onChange={(e) => setGeneratedJson(e.target.value)}
                      rows={15}
                      className="font-mono text-sm"
                    />
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Click "Generate JSON" to create the component definition
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep === 'preview' && generatedJson && (
                <Button onClick={handleCreateComponent}>
                  Create Component
                </Button>
              )}
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}