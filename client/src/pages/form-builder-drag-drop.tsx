import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import UniversalConfigurator from "@/components/form-builder/component-configurators/universal-configurator";
import { AdvancedGroupContainer } from "@/components/form-builder/advanced-group-container";
import { DraggableComponent } from "@/components/form-builder/draggable-component";
import { MainDropZone } from "@/components/form-builder/main-drop-zone";
import { 
  Save, 
  Download, 
  FileText, 
  Settings, 
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  Type,
  Square,
  Calendar,
  Grid3X3,
  List
} from "lucide-react";
import type { Form } from "@shared/schema";
import type { FormField } from "@/lib/form-types";

export default function FormBuilderDragDrop() {
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
    groupComponents: true,
    lookupComponents: false,
    actionValidation: false,
    customComponents: false
  });

  // Types de composants
  const componentTypes = [
    { type: 'TEXT', icon: Type, label: '📝 Text Input', color: 'text-blue-500' },
    { type: 'SELECT', icon: List, label: '📋 Select', color: 'text-purple-500' },
    { type: 'CHECKBOX', icon: Square, label: '☑️ Checkbox', color: 'text-orange-500' },
    { type: 'DATEPICKER', icon: Calendar, label: '📅 Date Picker', color: 'text-indigo-500' },
  ];

  const groupComponents = [
    { type: 'GROUP', icon: Settings, label: '📦 Group Container', color: 'text-emerald-600' },
  ];

  const lookupComponents = [
    { type: 'GRIDLKP', icon: Grid3X3, label: '🔍 Grid Lookup', color: 'text-cyan-500' },
    { type: 'LSTLKP', icon: List, label: '📜 List Lookup', color: 'text-teal-500' },
  ];

  const { data: formResponse } = useQuery<Form>({
    queryKey: ["/api/forms", formId],
    enabled: !!formId,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = formId ? `/api/forms/${formId}` : "/api/forms";
      const method = formId ? "PUT" : "POST";
      return await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Formulaire sauvegardé",
        description: "Vos modifications ont été enregistrées avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le formulaire.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (formResponse) {
      let parsedFields = [];
      try {
        parsedFields = typeof formResponse.fields === 'string' 
          ? JSON.parse(formResponse.fields) 
          : formResponse.fields || [];
      } catch (error) {
        console.error('Erreur parsing fields:', error);
        parsedFields = [];
      }

      setFormData({
        menuId: formResponse.menuId || "",
        label: formResponse.label || "",
        formWidth: formResponse.formWidth || "700px",
        layout: formResponse.layout || "PROCESS",
        fields: parsedFields,
        actions: (formResponse.actions && Array.isArray(formResponse.actions)) ? formResponse.actions : [],
        validations: (formResponse.validations && Array.isArray(formResponse.validations)) ? formResponse.validations : []
      });
    }
  }, [formResponse]);

  const addField = (type: string) => {
    const newField: FormField = {
      Id: `field_${Date.now()}`,
      Type: type as any,
      Label: `Nouveau ${type}`,
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
      })
    };
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedField(newField);
  };

  const addFieldToGroup = (groupId: string, field: FormField) => {
    try {
      setFormData(prev => {
        const updatedFields = prev.fields.map(f => {
          if (f.Id === groupId) {
            const currentChildren = f.Children || f.children || [];
            return { 
              ...f, 
              Children: [...currentChildren, field],
              children: [...currentChildren, field]
            };
          }
          return f;
        });
        
        return {
          ...prev,
          fields: updatedFields
        };
      });
      
      setSelectedField(field);
      
      toast({
        title: "Composant ajouté",
        description: `${field.Type} ajouté au groupe avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du composant au groupe:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le composant au groupe",
        variant: "destructive",
      });
    }
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
    setSelectedField(null);
  };

  const saveForm = () => {
    const formPayload = {
      ...formData,
      fields: JSON.stringify(formData.fields),
      actions: JSON.stringify(formData.actions),
      validations: JSON.stringify(formData.validations)
    };
    saveMutation.mutate(formPayload);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const DraggableFormComponent = ({ component }: { component: any }) => {
    return (
      <DraggableComponent
        type={component.type}
        label={component.label}
        icon={<component.icon className={`w-4 h-4 ${component.color}`} />}
        onClick={() => addField(component.type)}
      />
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
                <span className="text-xl font-semibold text-gray-900 dark:text-white">Générateur de formulaires</span>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Nom du formulaire"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  className="w-64"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={saveForm} disabled={saveMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Sidebar - Components */}
          <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Composants</h2>
              
              {/* Input Controls */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('inputControls')}
                  className="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <span>Contrôles d'entrée</span>
                  {expandedSections.inputControls ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {expandedSections.inputControls && (
                  <div className="mt-2 space-y-2">
                    {componentTypes.map(component => (
                      <DraggableFormComponent key={component.type} component={component} />
                    ))}
                  </div>
                )}
              </div>

              {/* Group Components */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('groupComponents')}
                  className="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <span>Conteneurs</span>
                  {expandedSections.groupComponents ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {expandedSections.groupComponents && (
                  <div className="mt-2 space-y-2">
                    {groupComponents.map(component => (
                      <DraggableFormComponent key={component.type} component={component} />
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
                  <span>Recherche de grille</span>
                  {expandedSections.lookupComponents ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {expandedSections.lookupComponents && (
                  <div className="mt-2 space-y-2">
                    {lookupComponents.map(component => (
                      <DraggableFormComponent key={component.type} component={component} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center - Form Builder */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formData.label || "Nouveau formulaire"}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {formData.fields.length} composant{formData.fields.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Form Fields avec zone de drop */}
                  <div className="min-h-96 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <MainDropZone onDrop={addField} hasFields={formData.fields.length > 0}>
                      {formData.fields.map((field) => 
                        field.Type === 'GROUP' ? (
                          <AdvancedGroupContainer
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
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {field.Label || field.Type}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Type: {field.Type}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeField(field.Id);
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </MainDropZone>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">Propriétés</span>
              </div>

              {selectedField ? (
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <UniversalConfigurator
                    field={selectedField}
                    onUpdate={(updates) => updateField(selectedField.Id, updates)}
                  />
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Sélectionnez un composant pour modifier ses propriétés</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}