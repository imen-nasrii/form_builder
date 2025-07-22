import React, { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Save, Download, Upload, Eye, Settings, Trash2, Edit, Plus, X, Code, Package, Users, Help, FileJson, Star, Archive, Copy, RotateCcw, Grid, Layout, Type, Calendar, CheckSquare, List, RadioIcon, Palette, Bug, Home, ChevronDown, ChevronRight, HelpCircle, Monitor, Layers, Paintbrush, Share } from 'lucide-react';
import { ComponentTypes, type FormData, type FormField } from '@/lib/form-builder-types';

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
    'SELECT': {
      Id: `SELECT_${timestamp}`,
      Type: 'SELECT',
      Label: 'Select List',
      DataField: `select_${timestamp}`,
      Entity: 'SelectData',
      Width: '200px',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: true,
      Value: '',
      Options: [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' }
      ],
      SelectedValue: '',
      VisibleWhen: '',
      EnabledWhen: ''
    },
    'RADIOGRP': {
      Id: `RADIOGRP_${timestamp}`,
      Type: 'RADIOGRP',
      Label: 'Radio Group',
      DataField: `radiogrp_${timestamp}`,
      Entity: 'RadioData',
      Width: '200px',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: false,
      Value: '',
      Options: [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' }
      ],
      SelectedValue: '',
      VisibleWhen: '',
      EnabledWhen: ''
    },
    'CHECKBOX': {
      Id: `CHECKBOX_${timestamp}`,
      Type: 'CHECKBOX',
      Label: 'Checkbox',
      DataField: `checkbox_${timestamp}`,
      Entity: 'CheckboxData',
      Width: '200px',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: false,
      Value: false,
      CheckedValue: true,
      UncheckedValue: false,
      VisibleWhen: '',
      EnabledWhen: ''
    },
    'GROUP': {
      Id: `GROUP_${timestamp}`,
      Type: 'GROUP',
      Label: 'Field Group',
      DataField: `group_${timestamp}`,
      Entity: 'GroupData',
      Width: '100%',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: true,
      Value: '',
      ChildFields: []
    },
    'NUMERIC': {
      Id: `NUMERIC_${timestamp}`,
      Type: 'NUMERIC',
      Label: 'Numeric Input',
      DataField: `numeric_${timestamp}`,
      Entity: 'NumericData',
      Width: '150px',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: false,
      Value: '',
      MinValue: 0,
      MaxValue: 999999,
      DecimalPlaces: 2,
      Format: '#,##0.00'
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
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar - Component Palette */}
        <Card className="w-80 rounded-none border-r">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Component Palette
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Primary Components */}
            <div>
              <h4 className="font-medium mb-2">Primary Components</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(ComponentTypes).map(([key, component]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => addField(key)}
                    className="justify-start text-xs"
                  >
                    {component.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">Form Builder</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-6 overflow-auto">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Form Canvas</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.fields.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No components added yet. Drag components from the palette to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.fields.map((field) => (
                      <div
                        key={field.Id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedField?.Id === field.Id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedField(field)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{field.Label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {field.Type}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeField(field.Id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          ID: {field.Id} | Entity: {field.Entity} | Width: {field.Width}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Properties Panel */}
        {selectedField && (
          <Card className="w-80 rounded-none border-l">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label>Label</Label>
                <Input
                  value={selectedField.Label}
                  onChange={(e) => updateFieldInFormData(selectedField.Id, { Label: e.target.value })}
                />
              </div>
              <div>
                <Label>Data Field</Label>
                <Input
                  value={selectedField.DataField}
                  onChange={(e) => updateFieldInFormData(selectedField.Id, { DataField: e.target.value })}
                />
              </div>
              <div>
                <Label>Entity</Label>
                <Input
                  value={selectedField.Entity}
                  onChange={(e) => updateFieldInFormData(selectedField.Id, { Entity: e.target.value })}
                />
              </div>
              <div>
                <Label>Width</Label>
                <Input
                  value={selectedField.Width}
                  onChange={(e) => updateFieldInFormData(selectedField.Id, { Width: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedField.Required}
                  onCheckedChange={(checked) => updateFieldInFormData(selectedField.Id, { Required: checked })}
                />
                <Label>Required</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedField.Inline}
                  onCheckedChange={(checked) => updateFieldInFormData(selectedField.Id, { Inline: checked })}
                />
                <Label>Inline</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedField.Outlined}
                  onCheckedChange={(checked) => updateFieldInFormData(selectedField.Id, { Outlined: checked })}
                />
                <Label>Outlined</Label>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}