import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  Plus, 
  Check,
  Type,
  Calendar,
  Square,
  List,
  ToggleLeft
} from 'lucide-react';

interface ExternalComponentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComponent: (component: any) => void;
  isDarkMode?: boolean;
}

const iconOptions = [
  { value: 'Type', label: 'Text', icon: Type },
  { value: 'Calendar', label: 'Calendar', icon: Calendar },
  { value: 'Square', label: 'Square', icon: Square },
  { value: 'List', label: 'List', icon: List },
  { value: 'ToggleLeft', label: 'Toggle', icon: ToggleLeft },
];

export function ExternalComponentsDialog({ isOpen, onClose, onAddComponent, isDarkMode = false }: ExternalComponentsDialogProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'create'>('import');
  const [jsonInput, setJsonInput] = useState('');
  const [componentForm, setComponentForm] = useState({
    name: '',
    type: '',
    description: '',
    icon: 'Type',
    color: 'blue',
    category: 'Input',
    label: '',
    dataField: '',
    entity: '',
    width: '',
    required: false,
    inline: false,
    outlined: false
  });

  const handleImportJSON = () => {
    try {
      const component = JSON.parse(jsonInput);
      onAddComponent(component);
      onClose();
      setJsonInput('');
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const handleCreateComponent = () => {
    const newComponent = {
      id: `custom-${Date.now()}`,
      name: componentForm.name,
      type: componentForm.type.toUpperCase(),
      description: componentForm.description,
      icon: componentForm.icon,
      color: componentForm.color,
      category: componentForm.category,
      label: componentForm.label || componentForm.name,
      dataField: componentForm.dataField,
      entity: componentForm.entity,
      width: componentForm.width,
      required: componentForm.required,
      inline: componentForm.inline,
      outlined: componentForm.outlined,
      isCustom: true
    };
    onAddComponent(newComponent);
    onClose();
    setComponentForm({
      name: '',
      type: '',
      description: '',
      icon: 'Type',
      color: 'blue',
      category: 'Input',
      label: '',
      dataField: '',
      entity: '',
      width: '',
      required: false,
      inline: false,
      outlined: false
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            External Components
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tab Buttons */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'import' ? 'default' : 'outline'}
              onClick={() => setActiveTab('import')}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import JSON
            </Button>
            <Button
              variant={activeTab === 'create' ? 'default' : 'outline'}
              onClick={() => setActiveTab('create')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Visual Form
            </Button>
          </div>

          {/* Import JSON Tab */}
          {activeTab === 'import' && (
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <CardHeader>
                <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Import Component JSON
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Component JSON
                  </Label>
                  <Textarea
                    placeholder={`{
  "name": "My Component",
  "type": "CUSTOM",
  "description": "Custom component description",
  "icon": "Type",
  "color": "blue",
  "category": "Input"
}`}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className={`mt-2 h-40 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                  />
                </div>
                <Button 
                  onClick={handleImportJSON}
                  className="w-full"
                  disabled={!jsonInput.trim()}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Import Component
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Visual Form Tab */}
          {activeTab === 'create' && (
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <CardHeader>
                <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Create Component
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Component Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Component Name
                    </Label>
                    <Input
                      value={componentForm.name}
                      onChange={(e) => setComponentForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Component"
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Label
                    </Label>
                    <Input
                      value={componentForm.label || ''}
                      onChange={(e) => setComponentForm(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="Display Label"
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                </div>

                {/* Data and Entity Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Data Field
                    </Label>
                    <Input
                      value={componentForm.dataField || ''}
                      onChange={(e) => setComponentForm(prev => ({ ...prev, dataField: e.target.value }))}
                      placeholder="datepkr_1753171590916"
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Entity
                    </Label>
                    <Input
                      value={componentForm.entity || ''}
                      onChange={(e) => setComponentForm(prev => ({ ...prev, entity: e.target.value }))}
                      placeholder="DateFields"
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                </div>

                {/* Component Type and Width */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Component Type
                    </Label>
                    <Select 
                      value={componentForm.type} 
                      onValueChange={(value) => setComponentForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEXT">Text Input</SelectItem>
                        <SelectItem value="DATEPICKER">Date Picker</SelectItem>
                        <SelectItem value="DATEPKR">Date Picker (DATEPKR)</SelectItem>
                        <SelectItem value="SELECT">Select List</SelectItem>
                        <SelectItem value="GRIDLKP">Grid Lookup</SelectItem>
                        <SelectItem value="LSTLKP">List Lookup</SelectItem>
                        <SelectItem value="CHECKBOX">Checkbox</SelectItem>
                        <SelectItem value="TEXTAREA">Text Area</SelectItem>
                        <SelectItem value="NUMERIC">Numeric Input</SelectItem>
                        <SelectItem value="RADIOGRP">Radio Group</SelectItem>
                        <SelectItem value="GROUP">Field Group</SelectItem>
                        <SelectItem value="BUTTON">Button</SelectItem>
                        <SelectItem value="HIDDEN">Hidden Field</SelectItem>
                        <SelectItem value="LABEL">Label</SelectItem>
                        <SelectItem value="CUSTOM">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Width
                    </Label>
                    <Input
                      value={componentForm.width || ''}
                      onChange={(e) => setComponentForm(prev => ({ ...prev, width: e.target.value }))}
                      placeholder="150px"
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                </div>

                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Description
                  </Label>
                  <Textarea
                    value={componentForm.description}
                    onChange={(e) => setComponentForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Component description"
                    className={`mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Icon
                    </Label>
                    <Select 
                      value={componentForm.icon} 
                      onValueChange={(value) => setComponentForm(prev => ({ ...prev, icon: value }))}
                    >
                      <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="w-4 h-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Color
                    </Label>
                    <Select 
                      value={componentForm.color} 
                      onValueChange={(value) => setComponentForm(prev => ({ ...prev, color: value }))}
                    >
                      <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="gray">Gray</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Category
                    </Label>
                    <Select 
                      value={componentForm.category} 
                      onValueChange={(value) => setComponentForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Input">Input</SelectItem>
                        <SelectItem value="Display">Display</SelectItem>
                        <SelectItem value="Layout">Layout</SelectItem>
                        <SelectItem value="Action">Action</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Boolean Properties */}
                <div className="border-t pt-4">
                  <Label className={`mb-3 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Component Properties
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="required"
                        checked={componentForm.required || false}
                        onChange={(e) => setComponentForm(prev => ({ ...prev, required: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="required" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Required
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="inline"
                        checked={componentForm.inline || false}
                        onChange={(e) => setComponentForm(prev => ({ ...prev, inline: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="inline" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Inline
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="outlined"
                        checked={componentForm.outlined || false}
                        onChange={(e) => setComponentForm(prev => ({ ...prev, outlined: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="outlined" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Outlined
                      </Label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleCreateComponent}
                  className="w-full"
                  disabled={!componentForm.name || !componentForm.type}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Palette
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ExternalComponentsDialog;