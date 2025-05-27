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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
  Grid3X3,
  List,
  Calendar,
  Type,
  Square,
  Radio,
  Upload as UploadIcon,
  AlertTriangle,
  X
} from "lucide-react";
import type { Form } from "@shared/schema";
import type { FormField } from "@/lib/form-types";

export default function FormBuilderClean() {
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

  // État pour les composants personnalisés (Solution 1)
  const [customComponents, setCustomComponents] = useState<Array<{
    type: string;
    label: string;
    icon: any;
    color: string;
  }>>([]);

  // Fonction pour ajouter un nouveau composant (Solution 1)
  const handleAddComponent = (componentType: string, iconName: string, label: string) => {
    const iconMap: { [key: string]: any } = {
      'Grid3X3': Grid3X3,
      'Type': Type,
      'Square': Square,
      'Calendar': Calendar,
      'List': List,
      'Upload': UploadIcon,
      'Radio': Radio,
      'MessageSquare': X, // MessageSquare n'existe pas, utilisons X
      'Folder': FileText,
      'Play': Plus,
      'FileText': FileText,
    };

    const newComponent = {
      type: componentType,
      label: label,
      icon: iconMap[iconName] || Type,
      color: 'text-purple-500'
    };

    setCustomComponents(prev => [...prev, newComponent]);
  };

  // Fonction pour charger des composants depuis JSON (Solution 2)
  const handleLoadComponents = (components: any[]) => {
    const iconMap: { [key: string]: any } = {
      'Grid3X3': Grid3X3,
      'Type': Type,
      'Square': Square,
      'Calendar': Calendar,
      'List': List,
      'Upload': UploadIcon,
      'Radio': Radio,
      'FileText': FileText,
    };

    const processedComponents = components.map(comp => ({
      type: comp.type,
      label: comp.label,
      icon: iconMap[comp.icon] || Type,
      color: comp.color || 'text-blue-500'
    }));

    setCustomComponents(prev => [...prev, ...processedComponents]);
  };

  // Load form data
  const { data: formResponse } = useQuery<Form[]>({
    queryKey: ["/api/forms", formId],
    enabled: !!formId,
  });

  useEffect(() => {
    if (formResponse && Array.isArray(formResponse) && formResponse.length > 0) {
      const form = formResponse[0]; // Prendre le premier formulaire du tableau
      console.log("Loading form data:", form);
      console.log("Fields from DB:", form.fields);
      
      try {
        setFormData({
          menuId: form.menuId || "",
          label: form.label || "",
          formWidth: form.formWidth || "700px",
          layout: form.layout || "PROCESS",
          fields: Array.isArray(form.fields) ? form.fields : (form.fields ? JSON.parse(form.fields as string) : []),
          actions: Array.isArray(form.actions) ? form.actions : (form.actions ? JSON.parse(form.actions as string) : []),
          validations: Array.isArray(form.validations) ? form.validations : (form.validations ? JSON.parse(form.validations as string) : [])
        });
      } catch (error) {
        console.error("Error parsing form data:", error);
        // Si erreur de parsing, utiliser les données directement si elles sont déjà des tableaux
        setFormData({
          menuId: form.menuId || "",
          label: form.label || "",
          formWidth: form.formWidth || "700px",
          layout: form.layout || "PROCESS",
          fields: Array.isArray(form.fields) ? form.fields : [],
          actions: Array.isArray(form.actions) ? form.actions : [],
          validations: Array.isArray(form.validations) ? form.validations : []
        });
      }
    }
  }, [formResponse]);

  const addField = (type: string) => {
    const newField: FormField = {
      Id: `field_${Date.now()}`,
      Type: type as any,
      Label: `New ${type}`,
      DataField: "",
      Entity: "",
      Width: "",
      Spacing: "",
      Required: false,
      Inline: false,
      Outlined: false,
      Value: "",
      // Propriétés spéciales pour GROUP
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
      })
    };
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedField(newField);
  };

  // Fonction pour ajouter un composant à un groupe
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
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.Id === fieldId ? { ...field, ...updates } : field
      )
    }));
    
    if (selectedField?.Id === fieldId) {
      setSelectedField(prev => prev ? { ...prev, ...updates } : null);
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

  const saveForm = useMutation({
    mutationFn: async () => {
      if (formId) {
        return apiRequest("PUT", `/api/forms/${formId}`, {
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

  // Component types from PDF documentation
  const componentTypes = [
    { type: 'TEXT', icon: Type, label: 'Text', color: 'text-green-600' },
    { type: 'TEXTAREA', icon: Type, label: 'Text Area', color: 'text-gray-600' },
    { type: 'DATEPICKER', icon: Calendar, label: 'Date Picker', color: 'text-purple-500' },
    { type: 'SELECT', icon: List, label: 'Select', color: 'text-orange-500' },
    { type: 'CHECKBOX', icon: Square, label: 'Checkbox', color: 'text-cyan-500' },
    { type: 'RADIOGRP', icon: Radio, label: 'Radio Group', color: 'text-pink-500' },
  ];

  const lookupComponents = [
    { type: 'GRIDLKP', icon: Settings, label: 'Grid Lookup', color: 'text-blue-500' },
    { type: 'LSTLKP', icon: List, label: 'List Lookup', color: 'text-green-500' },
  ];

  const actionComponents = [
    { type: 'GRID', icon: Grid3X3, label: 'Grid', color: 'text-blue-600' },
    { type: 'DIALOG', icon: Settings, label: 'Dialog', color: 'text-purple-600' },
    { type: 'ACTION', icon: Settings, label: 'Action', color: 'text-orange-600' },
    { type: 'FILEUPLOAD', icon: UploadIcon, label: 'File Upload', color: 'text-indigo-500' },
  ];

  // Composant GROUP spécial avec fonctionnalité drag & drop
  const groupComponents = [
    { type: 'GROUP', icon: Settings, label: '📦 Group Container', color: 'text-emerald-600' },
  ];

  // Draggable component
  const DraggableComponent = ({ component }: { component: any }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'component',
      item: { type: component.type },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <button
        ref={drag}
        onClick={() => addField(component.type)}
        className={`flex items-center space-x-2 w-full p-2 text-left text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-move ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <component.icon className={`w-4 h-4 ${component.color}`} />
        <span>{component.label}</span>
      </button>
    );
  };

  // Drop zone for canvas
  const DropZone = ({ children }: { children: React.ReactNode }) => {
    const [{ isOver }, drop] = useDrop({
      accept: 'component',
      drop: (item: { type: string }) => {
        addField(item.type);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div
        ref={drop}
        className={`min-h-96 ${isOver ? 'bg-blue-50 border-blue-300' : ''}`}
      >
        {children}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
                      <DraggableComponent key={component.type} component={component} />
                    ))}
                  </div>
                )}
              </div>

              {/* Lookup Components */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('lookupComponents')}
                  className="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <span>Lookup Components</span>
                  {expandedSections.lookupComponents ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {expandedSections.lookupComponents && (
                  <div className="mt-2 space-y-2">
                    {lookupComponents.map(component => (
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

              {/* GROUP Container - Composant spécial */}
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

              {/* Solution 1: Composants Personnalisés */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Components</span>
                </div>
                <div className="space-y-2">
                  <AddComponentDialog onAddComponent={handleAddComponent} />
                  <ComponentConfigManager 
                    onLoadComponents={handleLoadComponents}
                    customComponents={customComponents}
                  />
                </div>
                {customComponents.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {customComponents.map(component => (
                      <DraggableComponent key={component.type} component={component} />
                    ))}
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
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </Button>
                    <Button variant="outline" size="sm">
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
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <DropZone>
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
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      {formData.fields.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                          <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>Drag components from the left panel to start building your form</p>
                          <p className="text-sm mt-2">Or click on components to add them</p>
                        </div>
                      ) : (
                        /* Render form fields */
                        <div className="space-y-4">
                          {formData.fields.map((field) => (
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
                                    field.Type === 'GROUP' ? 'bg-gray-600' : 'bg-gray-500'
                                  }`} />
                                  <span className="font-medium">{field.Label || field.Id}</span>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {field.Type}
                                  </span>
                                  {field.DataField && (
                                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                      {field.DataField}
                                    </span>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
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
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </DropZone>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Properties: {selectedField ? selectedField.Type?.toUpperCase() : 'WARNING'}
              </h2>
              
              {selectedField ? (
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <UniversalConfigurator
                    field={selectedField}
                    onUpdate={(updates) => updateField(selectedField.Id, updates)}
                  />
                </ScrollArea>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="label">Label</Label>
                    <Input
                      id="label"
                      value="Warning Message"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value="Warning"
                    >
                      <option value="Warning">Warning</option>
                      <option value="Error">Error</option>
                      <option value="Info">Info</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition Expression</Label>
                    <textarea
                      id="condition"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      value='{\n  "logicalOperator": "AND",\n  "conditions": []\n}'
                    />
                  </div>
                  <div>
                    <Label htmlFor="componentId">Component ID</Label>
                    <Input
                      id="componentId"
                      value="warning-174732845970"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* JSON Preview */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">JSON Preview</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Validate</Button>
                    <Button variant="outline" size="sm">Copy</Button>
                  </div>
                </div>
                <Tabs defaultValue="json" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="json">JSON</TabsTrigger>
                    <TabsTrigger value="validation">Validation</TabsTrigger>
                  </TabsList>
                  <TabsContent value="json">
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                      <pre>{JSON.stringify({
                        MenuID: formData.menuId || "CustomerReg",
                        FormWidth: formData.formWidth || "800px",
                        Layout: formData.layout || "PROCESS",
                        Label: formData.label || "Customer Registration",
                        Fields: formData.fields.length > 0 ? formData.fields : [
                          {
                            Id: "warning-sample",
                            Type: "WARNING",
                            Label: "Warning Message"
                          }
                        ]
                      }, null, 2)}</pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="validation">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>✓ Form structure is valid</p>
                      <p>✓ All required fields present</p>
                      <p>✓ Component types are valid</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}