import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import CleanGroupField from "@/components/form-builder/clean-group-field";

import { 
  Save, 
  Download, 
  Upload, 
  FileText, 
  Settings, 
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  X
} from "lucide-react";
import type { FormField } from "@/lib/form-types";

export default function FormBuilderFinal() {
  const params = useParams();
  const formId = params.formId ? parseInt(params.formId) : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    menuId: "",
    label: "",
    formWidth: "700px",
    layout: "PROCESS",
    fields: [] as FormField[],
    actions: [] as any[],
    validations: [] as any[]
  });
  
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    inputControls: true,
    layoutComponents: false,
    lookupComponents: true,
    actionValidation: true,
    groupContainers: true
  });

  // Composants disponibles
  const componentTypes = [
    { type: 'TEXT', label: 'Text Input', color: 'green' },
    { type: 'TEXTAREA', label: 'Textarea', color: 'blue' },
    { type: 'SELECT', label: 'Select', color: 'orange' },
    { type: 'CHECKBOX', label: 'Checkbox', color: 'cyan' },
    { type: 'RADIOGRP', label: 'Radio Group', color: 'purple' },
    { type: 'DATEPICKER', label: 'Date Picker', color: 'pink' },
    { type: 'FILEUPLOAD', label: 'File Upload', color: 'indigo' },
    { type: 'GRIDLKP', label: 'Grid Lookup', color: 'blue' },
    { type: 'LSTLKP', label: 'List Lookup', color: 'green' },
    { type: 'GROUP', label: 'Group Container', color: 'emerald' },
    { type: 'ACTION', label: 'Action Button', color: 'red' }
  ];

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

  // Fonction pour ajouter un champ
  const addField = (componentType: string) => {
    const newField: FormField = {
      Id: `field_${Date.now()}`,
      Type: componentType as any,
      Label: `${componentType} Field`,
      DataField: "",
      Entity: "",
      Width: "",
      Spacing: "",
      Required: false,
      Inline: false,
      Outlined: false,
      Value: ""
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedField(newField);
  };

  // Fonction pour mettre à jour un champ
  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.Id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  // Fonction pour supprimer un champ
  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.Id !== fieldId)
    }));
    if (selectedField?.Id === fieldId) {
      setSelectedField(null);
    }
  };

  // Fonctions d'import/export
  const handleExport = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `form-${formData.menuId || 'export'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setFormData(importedData);
          toast({
            title: "Success",
            description: "Form imported successfully"
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Invalid JSON file",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (formLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">FormBuilder</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, imen</span>
            <Button variant="outline" size="sm">Logout</Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Components */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-white">Components</span>
            </div>

            {/* Input Controls */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('inputControls')}
                className="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <span>Input Controls</span>
                {expandedSections.inputControls ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedSections.inputControls && (
                <div className="mt-2 space-y-2">
                  {componentTypes.map(component => (
                    <Button
                      key={component.type}
                      variant="outline"
                      size="sm"
                      onClick={() => addField(component.type)}
                      className="w-full justify-start text-xs h-8"
                    >
                      <span className="ml-2">{component.label}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Form Settings */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Form Settings</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="menuId" className="text-xs">Menu ID</Label>
                  <Input
                    id="menuId"
                    value={formData.menuId}
                    onChange={(e) => setFormData(prev => ({ ...prev, menuId: e.target.value }))}
                    className="h-8 text-xs"
                    placeholder="Enter menu ID"
                  />
                </div>
                <div>
                  <Label htmlFor="label" className="text-xs">Form Label</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    className="h-8 text-xs"
                    placeholder="Enter form label"
                  />
                </div>
                <div>
                  <Label htmlFor="formWidth" className="text-xs">Form Width</Label>
                  <Input
                    id="formWidth"
                    value={formData.formWidth}
                    onChange={(e) => setFormData(prev => ({ ...prev, formWidth: e.target.value }))}
                    className="h-8 text-xs"
                    placeholder="700px"
                  />
                </div>
              </div>
            </div>

            {/* Import/Export */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div className="space-y-2">
                <Button variant="outline" size="sm" onClick={() => document.getElementById('import-file')?.click()} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={handleImport}
                />
                <Button variant="outline" size="sm" onClick={handleExport} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button 
                  onClick={() => saveForm.mutate()}
                  disabled={saveForm.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Form
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Form Canvas */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 min-h-96">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedField ? selectedField.Type?.toUpperCase() : 'Form Builder'}
                      </span>
                    </div>
                    {selectedField && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(selectedField.Id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {formData.fields.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Cliquez sur les composants à gauche pour commencer à construire votre formulaire</p>
                      <p className="text-sm mt-2">Les composants apparaîtront ici</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.fields.map((field) => 
                        field.Type === 'GROUP' ? (
                          <CleanGroupField
                            key={field.Id}
                            field={field}
                            isSelected={selectedField?.Id === field.Id}
                            onSelect={() => setSelectedField(field)}
                            onUpdate={(updates) => updateField(field.Id, updates)}
                            onRemove={() => removeField(field.Id)}
                          />
                        ) : (
                          <div
                            key={field.Id}
                            onClick={() => setSelectedField(field)}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedField?.Id === field.Id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  field.Type === 'TEXT' ? 'bg-green-500' :
                                  field.Type === 'GRIDLKP' ? 'bg-blue-400' :
                                  field.Type === 'LSTLKP' ? 'bg-green-400' :
                                  field.Type === 'SELECT' ? 'bg-orange-500' :
                                  field.Type === 'DATEPICKER' ? 'bg-purple-500' :
                                  field.Type === 'CHECKBOX' ? 'bg-cyan-500' :
                                  field.Type === 'RADIOGRP' ? 'bg-pink-500' :
                                  field.Type === 'TEXTAREA' ? 'bg-indigo-500' :
                                  field.Type === 'FILEUPLOAD' ? 'bg-yellow-500' :
                                  field.Type === 'ACTION' ? 'bg-red-500' :
                                  'bg-gray-500'
                                }`} />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {field.Label || field.Id}
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                  {field.Type}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeField(field.Id);
                                }}
                                className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Properties: {selectedField ? selectedField.Type?.toUpperCase() : 'No Selection'}
            </h2>
            
            {selectedField ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fieldLabel" className="text-sm">Label</Label>
                  <Input
                    id="fieldLabel"
                    value={selectedField.Label || ''}
                    onChange={(e) => updateField(selectedField.Id, { Label: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="fieldDataField" className="text-sm">Data Field</Label>
                  <Input
                    id="fieldDataField"
                    value={selectedField.DataField || ''}
                    onChange={(e) => updateField(selectedField.Id, { DataField: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="fieldEntity" className="text-sm">Entity</Label>
                  <Input
                    id="fieldEntity"
                    value={selectedField.Entity || ''}
                    onChange={(e) => updateField(selectedField.Id, { Entity: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="fieldWidth" className="text-sm">Width</Label>
                  <Input
                    id="fieldWidth"
                    value={selectedField.Width || ''}
                    onChange={(e) => updateField(selectedField.Id, { Width: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="fieldRequired"
                    checked={selectedField.Required || false}
                    onChange={(e) => updateField(selectedField.Id, { Required: e.target.checked })}
                  />
                  <Label htmlFor="fieldRequired" className="text-sm">Required</Label>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a component to configure its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}