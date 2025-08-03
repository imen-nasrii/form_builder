import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  Check,
  Square,
  Package,
  Type,
  Code,
  Database,
  Globe,
  Hash,
  Calendar,
  CheckSquare,
  List,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PropertyManager, { ComponentProperty } from '@/components/property-manager';

interface VisualCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (component: any) => void;
}

interface ComponentFormData {
  // Step 1: Basic Information
  name: string;
  displayLabel: string;
  icon: string;
  color: string;
  category: string;
  description: string;
  
  // Step 2: Properties
  properties: ComponentProperty[];
  
  // Step 3: Styling & Configuration
  defaultWidth: string;
  defaultHeight: string;
  allowsChildren: boolean;
  isContainer: boolean;
  styling: {
    backgroundColor: string;
    borderRadius: string;
    padding: string;
    margin: string;
  };
  
  // Step 4: Preview & Validation
  validationRules: {
    required: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

const iconOptions = [
  { value: 'Square', label: 'Square', icon: Square },
  { value: 'Package', label: 'Package', icon: Package },
  { value: 'Type', label: 'Type', icon: Type },
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Database', label: 'Database', icon: Database },
  { value: 'Globe', label: 'Globe', icon: Globe },
  { value: 'Settings', label: 'Settings', icon: Settings }
];

const colorOptions = [
  { value: 'blue', label: 'Blue', color: '#3B82F6' },
  { value: 'green', label: 'Green', color: '#10B981' },
  { value: 'purple', label: 'Purple', color: '#8B5CF6' },
  { value: 'red', label: 'Red', color: '#EF4444' },
  { value: 'orange', label: 'Orange', color: '#F59E0B' },
  { value: 'gray', label: 'Gray', color: '#6B7280' }
];

const categoryOptions = [
  'Input Controls',
  'Selection Controls', 
  'Lookup Components',
  'Container & Layout',
  'Data Display',
  'File Upload',
  'Action & Validation'
];

export default function VisualComponentCreator({ isOpen, onClose, onSubmit }: VisualCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ComponentFormData>({
    name: '',
    displayLabel: '',
    icon: 'Square',
    color: 'blue',
    category: 'Input Controls',
    description: '',
    properties: [],
    defaultWidth: '100%',
    defaultHeight: 'auto',
    allowsChildren: false,
    isContainer: false,
    styling: {
      backgroundColor: 'transparent',
      borderRadius: '6px',
      padding: '12px',
      margin: '0px'
    },
    validationRules: {
      required: false
    }
  });

  const { toast } = useToast();

  const steps = [
    { number: 1, title: 'Component & Properties', icon: Package },
    { number: 2, title: 'Styling & Config', icon: Code },
    { number: 3, title: 'Preview & Save', icon: Check }
  ];

  const updateFormData = (updates: Partial<ComponentFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      // Validation before moving to next step
      if (currentStep === 1 && (!formData.name || !formData.displayLabel)) {
        toast({
          title: "Required Fields",
          description: "Please fill in the component name and display label",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Convert to External Component format
    const externalComponent = {
      name: formData.name,
      type: formData.name.toUpperCase().replace(/\s+/g, '_'),
      category: formData.category,
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
      properties: formData.properties.reduce((acc, prop) => {
        acc[prop.name] = prop.defaultValue;
        return acc;
      }, {} as Record<string, any>),
      config: {
        defaultWidth: formData.defaultWidth,
        defaultHeight: formData.defaultHeight,
        allowsChildren: formData.allowsChildren,
        isContainer: formData.isContainer,
        styling: formData.styling,
        validation: formData.validationRules,
        propertyDefinitions: formData.properties
      }
    };

    onSubmit(externalComponent);
    
    // Reset form
    setFormData({
      name: '',
      displayLabel: '',
      icon: 'Square',
      color: 'blue',
      category: 'Input Controls',
      description: '',
      properties: [],
      defaultWidth: '100%',
      defaultHeight: 'auto',
      allowsChildren: false,
      isContainer: false,
      styling: {
        backgroundColor: 'transparent',
        borderRadius: '6px',
        padding: '12px',
        margin: '0px'
      },
      validationRules: {
        required: false
      }
    });
    setCurrentStep(1);
    onClose();
  };

  const StepIndicator = ({ step }: { step: typeof steps[0] }) => {
    const isActive = step.number === currentStep;
    const isCompleted = step.number < currentStep;
    const IconComponent = step.icon;

    return (
      <div className="flex flex-col items-center">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
          ${isActive ? 'bg-blue-500 border-blue-500 text-white' : 
            isCompleted ? 'bg-green-500 border-green-500 text-white' : 
            'bg-gray-100 border-gray-300 text-gray-400'}
        `}>
          {isCompleted ? <Check className="w-5 h-5" /> : 
           isActive ? step.number : 
           <IconComponent className="w-5 h-5" />}
        </div>
        <span className={`text-xs mt-2 font-medium ${
          isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
        }`}>
          {step.title}
        </span>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Basic Information Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <p className="text-sm text-gray-600 mb-6">
          Define the basic information for your new component
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Component Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              placeholder="customButton"
            />
          </div>
          <div>
            <Label>Display Label *</Label>
            <Input
              value={formData.displayLabel}
              onChange={(e) => updateFormData({ displayLabel: e.target.value })}
              placeholder="Custom Button"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Icon</Label>
            <Select value={formData.icon} onValueChange={(v) => updateFormData({ icon: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map(option => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Color</Label>
            <Select value={formData.color} onValueChange={(v) => updateFormData({ color: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: option.color }}
                      />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(v) => updateFormData({ category: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Description of your custom component..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="border-t pt-6">
        <PropertyManager
          properties={formData.properties}
          onChange={(properties) => updateFormData({ properties })}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Styling & Configuration</h3>
        <p className="text-sm text-gray-600 mb-6">
          Configure the default appearance and behavior
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Default Width</Label>
          <Input
            value={formData.defaultWidth}
            onChange={(e) => updateFormData({ defaultWidth: e.target.value })}
            placeholder="100%"
          />
        </div>
        <div>
          <Label>Default Height</Label>
          <Input
            value={formData.defaultHeight}
            onChange={(e) => updateFormData({ defaultHeight: e.target.value })}
            placeholder="auto"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="allowsChildren"
            checked={formData.allowsChildren}
            onChange={(e) => updateFormData({ allowsChildren: e.target.checked })}
            className="rounded border-gray-300"
          />
          <Label htmlFor="allowsChildren">Allows child components</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isContainer"
            checked={formData.isContainer}
            onChange={(e) => updateFormData({ isContainer: e.target.checked })}
            className="rounded border-gray-300"
          />
          <Label htmlFor="isContainer">Is container component</Label>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Default Styling</Label>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <Label>Background Color</Label>
            <Input
              value={formData.styling.backgroundColor}
              onChange={(e) => updateFormData({ 
                styling: { ...formData.styling, backgroundColor: e.target.value }
              })}
              placeholder="transparent"
            />
          </div>
          <div>
            <Label>Border Radius</Label>
            <Input
              value={formData.styling.borderRadius}
              onChange={(e) => updateFormData({ 
                styling: { ...formData.styling, borderRadius: e.target.value }
              })}
              placeholder="6px"
            />
          </div>
          <div>
            <Label>Padding</Label>
            <Input
              value={formData.styling.padding}
              onChange={(e) => updateFormData({ 
                styling: { ...formData.styling, padding: e.target.value }
              })}
              placeholder="12px"
            />
          </div>
          <div>
            <Label>Margin</Label>
            <Input
              value={formData.styling.margin}
              onChange={(e) => updateFormData({ 
                styling: { ...formData.styling, margin: e.target.value }
              })}
              placeholder="0px"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const selectedIcon = iconOptions.find(opt => opt.value === formData.icon)?.icon || Square;
    const selectedColor = colorOptions.find(opt => opt.value === formData.color)?.color || '#6B7280';
    const IconComponent = selectedIcon;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Preview & Save</h3>
          <p className="text-sm text-gray-600 mb-6">
            Review your component before saving
          </p>
        </div>

        {/* Component Preview */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">Component Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: selectedColor + '20' }}
              >
                <IconComponent className="w-5 h-5" style={{ color: selectedColor }} />
              </div>
              <div>
                <div className="font-medium">{formData.displayLabel || 'Component Name'}</div>
                <div className="text-sm text-gray-500">{formData.category}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">Properties defined</div>
              <div className="text-2xl font-bold">{formData.properties.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">Component type</div>
              <div className="text-2xl font-bold">
                {formData.isContainer ? 'Container' : 'Standard'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Summary */}
        {formData.properties.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Configured Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.properties.map(prop => (
                  <div key={prop.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{prop.type}</Badge>
                      <span className="text-sm font-medium">{prop.name}</span>
                      {prop.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                    </div>
                    <span className="text-xs text-gray-500">
                      {typeof prop.defaultValue === 'object' ? 
                        JSON.stringify(prop.defaultValue) : 
                        String(prop.defaultValue)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>External Components - CRUD Properties Manager</DialogTitle>
            <div className="text-sm text-gray-500">Step {currentStep} of 3</div>
          </div>
          <p className="text-sm text-gray-600">
            Create your custom external component with configurable properties
          </p>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-4 py-6">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <StepIndicator step={step} />
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 rounded ${
                  step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="px-2">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={previousStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" />
              Create Component
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}