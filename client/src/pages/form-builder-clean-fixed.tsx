import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import FormCanvas from "@/components/form-builder/form-canvas";
import UniversalConfigurator from "@/components/form-builder/component-configurators/universal-configurator";
import AddComponentDialog from "@/components/form-builder/add-component-dialog";
import ComponentConfigManager from "@/components/form-builder/component-config-manager";
import { SimpleGroupContainer } from "@/components/form-builder/simple-group-container";

import { 
  Save, 
  Download, 
  Upload, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  X, 
  FileText,
  Grid3X3,
  Type,
  Square,
  Calendar,
  List,
  Upload as UploadIcon,
  Radio
} from "lucide-react";

import type { FormField, FormDefinition } from "@/lib/form-types";

export default function FormBuilderClean() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // États principaux
  const [formData, setFormData] = useState({
    menuId: "",
    label: "",
    formWidth: "700px",
    layout: "PROCESS",
    fields: [],
    actions: [],
    validations: []
  });

  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    inputControls: true,
    dataComponents: true,
    actionValidation: true,
    groupContainers: true,
    customComponents: true
  });

  // Composants personnalisés ajoutés via le dialog
  const [customComponents, setCustomComponents] = useState<Array<{
    type: string;
    label: string;
    icon: string;
    color: string;
  }>>([]);

  // Fonction pour ajouter un nouveau composant
  const handleAddComponent = (componentType: string, iconName: string, label: string) => {
    const iconMap: { [key: string]: any } = {
      'Grid3X3': Grid3X3,
      'Type': Type,
      'Square': Square,
      'Calendar': Calendar,
      'List': List,
      'Upload': UploadIcon,
      'Radio': Radio,
      'MessageSquare': X,
      'Folder': FileText,
      'Play': Plus,
      'FileText': FileText,
    };

    const newComponent = {
      type: componentType,
      label: label,
      icon: iconName,
      color: 'text-yellow-600'
    };

    setCustomComponents(prev => [...prev, newComponent]);
    
    toast({
      title: "Composant ajouté !",
      description: `${label} (${componentType}) a été ajouté à votre palette.`,
    });
  };

  // Charger les données du formulaire si un ID est fourni
  const formResponse = useQuery({
    queryKey: ["/api/forms", id],
    enabled: !!id,
  });

  // Charger les données depuis la réponse de l'API
  useEffect(() => {
    if (formResponse.data && !formResponse.isLoading) {
      const form = formResponse.data;
      setFormData({
        menuId: form.menuId || "",
        label: form.label || "",
        formWidth: form.formWidth || "700px",
        layout: form.layout || "PROCESS",
        fields: typeof form.fields === 'string' ? JSON.parse(form.fields) : (form.fields || []),
        actions: typeof form.actions === 'string' ? JSON.parse(form.actions) : (form.actions || []),
        validations: typeof form.validations === 'string' ? JSON.parse(form.validations) : (form.validations || [])
      });
    }
  }, [formResponse]);

  const addField = (type: string) => {
    const isCustomComponent = customComponents.some(comp => comp.type === type);
    
    const newField: FormField = {
      Id: `field_${Date.now()}`,
      Type: type as any,
      Label: isCustomComponent ? customComponents.find(comp => comp.type === type)?.label || `New ${type}` : `New ${type}`,
      DataField: "",
      Entity: "",
      Width: "",
      Spacing: "",
      Required: false,
      Inline: false,
      Outlined: false,
      Value: "",
      ...(type === 'GROUP' && {
        IsGroup: true,
        Children: [],
        GroupLayout: 'vertical',
        GroupStyle: {
          border: true,
          background: 'transparent',
          padding: '16px',
          borderRadius: '8px'
        }
      }),
      ...(isCustomComponent && {
        IsCustom: true,
        CustomType: type
      })
    };
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedField(newField);
  };

  const addFieldToGroup = (groupId: string, field: FormField) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(f => 
        f.Id === groupId 
          ? { 
              ...f, 
              Children: [...(f.Children || []), field],
              children: [...(f.children || []), field]
            }
          : f
      )
    }));
    setSelectedField(field);
  };

  // Fonctions d'import/export
  const handleExport = () => {
    const exportData = {
      MenuID: formData.menuId,
      Label: formData.label,
      FormWidth: formData.formWidth,
      Layout: formData.layout,
      Fields: formData.fields,
      Actions: formData.actions,
      Validations: formData.validations,
      CustomComponents: customComponents
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.menuId || 'form'}_schema.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export terminé",
      description: "Le fichier JSON du formulaire a été téléchargé",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        setFormData({
          menuId: jsonData.MenuID || "",
          label: jsonData.Label || "",
          formWidth: jsonData.FormWidth || "700px",
          layout: jsonData.Layout || "PROCESS",
          fields: jsonData.Fields || [],
          actions: jsonData.Actions || [],
          validations: jsonData.Validations || []
        });
        
        if (jsonData.CustomComponents && Array.isArray(jsonData.CustomComponents)) {
          setCustomComponents(jsonData.CustomComponents);
        }
        
        toast({
          title: "Import réussi",
          description: "Les données du formulaire ont été chargées depuis le fichier JSON",
        });
      } catch (error) {
        toast({
          title: "Échec de l'import",
          description: "Format JSON invalide",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.Id === fieldId ? { ...field, ...updates } : field
      )
    }));
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

  const saveForm = useMutation({
    mutationFn: () => {
      if (id) {
        return apiRequest("PUT", `/api/forms/${id}`, {
          menuId: formData.menuId,
          label: formData.label,
          formWidth: formData.formWidth,
          layout: formData.layout,
          fields: JSON.stringify(formData.fields),
          actions: JSON.stringify(formData.actions),
          validations: JSON.stringify(formData.validations)
        });
      } else {
        return apiRequest("POST", "/api/forms", {
          menuId: formData.menuId,
          label: formData.label,
          formWidth: formData.formWidth,
          layout: formData.layout,
          fields: JSON.stringify(formData.fields),
          actions: JSON.stringify(formData.actions),
          validations: JSON.stringify(formData.validations)
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      toast({
        title: "Success",
        description: "Form saved successfully",
      });
    },
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Composants disponibles
  const inputComponents = [
    { type: 'TEXT', icon: Type, label: 'Text Input', color: 'text-green-600' },
    { type: 'TEXTAREA', icon: FileText, label: 'Text Area', color: 'text-gray-600' },
    { type: 'SELECT', icon: List, label: 'Select', color: 'text-orange-600' },
    { type: 'CHECKBOX', icon: Square, label: 'Checkbox', color: 'text-cyan-600' },
    { type: 'RADIOGRP', icon: Radio, label: 'Radio Group', color: 'text-pink-600' },
    { type: 'DATEPICKER', icon: Calendar, label: 'Date Picker', color: 'text-purple-600' },
    { type: 'FILEUPLOAD', icon: UploadIcon, label: 'File Upload', color: 'text-indigo-600' },
  ];

  const dataComponents = [
    { type: 'GRIDLKP', icon: Grid3X3, label: 'Grid Lookup', color: 'text-blue-600' },
    { type: 'LSTLKP', icon: List, label: 'List Lookup', color: 'text-green-600' },
    { type: 'GRID', icon: Grid3X3, label: 'Data Grid', color: 'text-blue-500' },
  ];

  const actionComponents = [
    { type: 'ACTION', icon: Plus, label: 'Action Button', color: 'text-orange-700' },
    { type: 'DIALOG', icon: FileText, label: 'Dialog', color: 'text-purple-700' },
  ];

  const groupComponents = [
    { type: 'GROUP', icon: Settings, label: '📦 Group Container', color: 'text-emerald-600' },
  ];

  // Draggable component - utilise HTML5 drag & drop natif
  const DraggableComponent = ({ component }: { component: any }) => {
    const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData('text/plain', component.type);
      e.dataTransfer.effectAllowed = 'copy';
    };

    return (
      <button
        draggable
        onDragStart={handleDragStart}
        onClick={() => addField(component.type)}
        className="flex items-center space-x-2 w-full p-2 text-left text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-move transition-opacity hover:opacity-75"
      >
        <component.icon className={`w-4 h-4 ${component.color}`} />
        <span>{component.label}</span>
      </button>
    );
  };

  // Drop zone for canvas - utilise HTML5 drag & drop natif
  const DropZone = ({ children }: { children: React.ReactNode }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsOver(false);
      
      const componentType = e.dataTransfer.getData('text/plain');
      if (componentType) {
        addField(componentType);
      }
    };

    return (
      <div
        className={`min-h-96 transition-colors ${isOver ? 'bg-blue-50 border-blue-300' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {children}
      </div>
    );
  };

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
                  {inputComponents.map(component => (
                    <DraggableComponent key={component.type} component={component} />
                  ))}
                </div>
              )}
            </div>

            {/* Data Components */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('dataComponents')}
                className="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <span>Data Components</span>
                {expandedSections.dataComponents ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedSections.dataComponents && (
                <div className="mt-2 space-y-2">
                  {dataComponents.map(component => (
                    <DraggableComponent key={component.type} component={component} />
                  ))}
                </div>
              )}
            </div>

            {/* Action & Validation */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('actionValidation')}
                className="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <span>Action & Validation</span>
                {expandedSections.actionValidation ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedSections.actionValidation && (
                <div className="mt-2 space-y-2">
                  {actionComponents.map(component => (
                    <DraggableComponent key={component.type} component={component} />
                  ))}
                </div>
              )}
            </div>

            {/* GROUP Container */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('groupContainers')}
                className="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <span>📦 Group Containers</span>
                {expandedSections.groupContainers ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedSections.groupContainers && (
                <div className="mt-2 space-y-2">
                  {groupComponents.map(component => (
                    <DraggableComponent key={component.type} component={component} />
                  ))}
                  <div className="text-xs text-gray-500 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    💡 Glissez d'autres composants dans le Group Container pour les organiser ensemble
                  </div>
                </div>
              )}
            </div>

            {/* Custom Components */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => toggleSection('customComponents')}
                  className="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <span>🔧 Custom Components</span>
                  {expandedSections.customComponents ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
              {expandedSections.customComponents && (
                <div className="mt-2 space-y-2">
                  {customComponents.map(component => (
                    <DraggableComponent key={component.type} component={component} />
                  ))}
                  <AddComponentDialog onAddComponent={handleAddComponent} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center - Form Builder */}
        <div className="flex-1 flex flex-col">
          {/* Form Builder Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-medium text-gray-900 dark:text-white">Form Builder</h1>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('import-file')?.click()}>
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
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <Button 
                onClick={() => saveForm.mutate()}
                disabled={saveForm.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Form
              </Button>
            </div>
          </div>

          {/* Form Canvas */}
          <DropZone>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  {formData.fields.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Drag components from the left panel to start building your form</p>
                      <p className="text-sm mt-2">Or click on components to add them</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.fields.map((field) => 
                        field.Type === 'GROUP' ? (
                          <SimpleGroupContainer
                            key={field.Id}
                            field={field}
                            onUpdateField={updateField}
                            onRemoveField={removeField}
                            onSelectField={setSelectedField}
                            onAddFieldToGroup={addFieldToGroup}
                            isSelected={selectedField?.Id === field.Id}
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
                                  field.Type === 'GRID' ? 'bg-blue-500' :
                                  field.Type === 'GRIDLKP' ? 'bg-blue-400' :
                                  field.Type === 'LSTLKP' ? 'bg-green-400' :
                                  field.Type === 'SELECT' ? 'bg-orange-500' :
                                  field.Type === 'DATEPICKER' ? 'bg-purple-500' :
                                  field.Type === 'CHECKBOX' ? 'bg-cyan-500' :
                                  field.Type === 'RADIOGRP' ? 'bg-pink-500' :
                                  field.Type === 'TEXTAREA' ? 'bg-gray-500' :
                                  field.Type === 'FILEUPLOAD' ? 'bg-indigo-500' :
                                  field.Type === 'ACTION' ? 'bg-orange-600' :
                                  field.Type === 'DIALOG' ? 'bg-purple-600' :
                                  field.Type === 'GROUP' ? 'bg-emerald-600' :
                                  field.IsCustom ? 'bg-yellow-500' : 'bg-gray-500'
                                }`} />
                                <span className="font-medium">{field.Label || field.Id}</span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {field.Type}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeField(field.Id);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            {field.Entity && (
                              <div className="mt-2 text-sm text-gray-600">
                                Entity: {field.Entity}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DropZone>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <Tabs defaultValue="form" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form">Form</TabsTrigger>
                <TabsTrigger value="field">Field</TabsTrigger>
              </TabsList>
              
              <TabsContent value="form" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Form Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="menuId">Menu ID</Label>
                      <Input
                        id="menuId"
                        value={formData.menuId}
                        onChange={(e) => setFormData(prev => ({ ...prev, menuId: e.target.value }))}
                        placeholder="Enter Menu ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        value={formData.label}
                        onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Enter form label"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="field" className="space-y-4">
                {selectedField ? (
                  <UniversalConfigurator
                    field={selectedField}
                    onUpdateField={updateField}
                  />
                ) : (
                  <Card>
                    <CardContent className="text-center py-8 text-gray-500">
                      Select a field to edit its properties
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}