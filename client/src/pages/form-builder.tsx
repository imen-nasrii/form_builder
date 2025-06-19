import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import CollapsibleComponentPalette from "@/components/form-builder/collapsible-component-palette";
import FormCanvas from "@/components/form-builder/form-canvas";
import PropertiesPanel from "@/components/form-builder/properties-panel-clean";
import ExportDialog from "@/components/form-builder/export-dialog";
import AdvancedValidator from "@/components/form-builder/advanced-validator";
import MultiFrameworkExport from "@/components/form-builder/multi-framework-export";
import IntelligentFieldSuggestions from "@/components/intelligent-field-suggestions";
import ProfessionalFormComponents from "@/components/professional-form-components";

import ComponentImportPanel from "@/components/form-builder/component-import-panel";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Save, Eye, Download, Upload, Code2, FileText, Settings, Copy, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Database } from "lucide-react";
import type { Form } from "@shared/schema";
import type { FormField } from "@/lib/form-types";

export default function FormBuilder() {
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
  const [showJsonPreview, setShowJsonPreview] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);


  // Generate live JSON preview
  const generateLiveJson = () => {
    return {
      MenuID: formData.menuId || "NEW_FORM",
      FormWidth: formData.formWidth,
      Layout: formData.layout,
      Label: formData.label || "New Form",
      Fields: formData.fields,
      Actions: formData.actions.length > 0 ? formData.actions : [
        {
          ID: "PROCESS",
          Label: "PROCESS",
          MethodToInvoke: "ExecuteProcess"
        }
      ],
      Validations: formData.validations
    };
  };

  const { data: form, isLoading } = useQuery<Form>({
    queryKey: [`/api/forms/${formId}`],
    enabled: !!formId,
  });

  const saveFormMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (formId) {
        return await apiRequest("PUT", `/api/forms/${formId}`, data);
      } else {
        return await apiRequest("POST", "/api/forms", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      toast({
        title: "Success",
        description: formId ? "Form updated successfully" : "Form created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save form",
        variant: "destructive",
      });
    },
  });

  const validateFormMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/forms/validate", { formData: data });
      return response.json();
    },
    onSuccess: (result) => {
      if (result.valid) {
        toast({
          title: "Validation Success",
          description: "Form JSON is valid",
        });
      } else {
        toast({
          title: "Validation Failed",
          description: result.errors?.join(", ") || "Invalid form structure",
          variant: "destructive",
        });
      }
    },
  });

  useEffect(() => {
    if (form) {
      setFormData({
        menuId: form.menuId,
        label: form.label,
        formWidth: form.formWidth,
        layout: form.layout,
        fields: Array.isArray(form.fields) ? form.fields : [],
        actions: Array.isArray(form.actions) ? form.actions : [],
        validations: Array.isArray(form.validations) ? form.validations : []
      });
    }
  }, [form]);

  const handleSave = () => {
    saveFormMutation.mutate(formData);
  };

  const handleValidate = () => {
    validateFormMutation.mutate(formData);
  };

  const handleExport = () => {
    const exportData = {
      MenuID: formData.menuId,
      FormWidth: formData.formWidth,
      Layout: formData.layout,
      Label: formData.label,
      Fields: formData.fields,
      Actions: formData.actions,
      Validations: formData.validations
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
      title: "Export Complete",
      description: "Form JSON downloaded successfully",
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
        toast({
          title: "Import Successful",
          description: "Form data loaded from JSON",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid JSON format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const addField = (field: FormField) => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, field]
    }));
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse-soft">
            <i className="fas fa-cube text-primary-600 text-2xl"></i>
          </div>
          <p className="text-slate-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <Navigation />
        
        {/* Compact Action Bar */}
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                {formData.label || "Formulaire sans titre"}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Formulaire {formData.layout}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="text-black dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={handleSave}
                disabled={saveFormMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2 text-green-500" />
                {saveFormMutation.isPending ? "Saving..." : "Sauvegarder"}
              </Button>
              
              <Button 
                size="sm" 
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                onClick={() => {
                  const jsonData = JSON.stringify(generateLiveJson(), null, 2);
                  const blob = new Blob([jsonData], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${formData.menuId || 'form'}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  toast({
                    title: "Download Complete!",
                    description: "JSON file has been downloaded successfully."
                  });
                }}
              >
                <Download className="w-4 h-4 mr-2 text-blue-500" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Clean Full-Width Layout with Collapsible Panels */}
        <div className="flex h-[calc(100vh-90px)] w-full">
          
          {/* Left Panel with Arrow Toggle */}
          <div className={`bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
            leftPanelOpen ? 'w-80' : 'w-12'
          }`}>
            <div className="h-full flex flex-col">
              {/* Panel Header with Toggle */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                {leftPanelOpen && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                      <Code2 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-black dark:text-white">Components</span>
                  </div>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                  className="w-6 h-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {leftPanelOpen ? 
                    <ChevronLeft className="w-4 h-4 text-orange-500" /> : 
                    <ChevronRight className="w-4 h-4 text-orange-500" />
                  }
                </Button>
              </div>
              
              {/* Panel Content */}
              {leftPanelOpen && (
                <div className="flex-1 p-4 overflow-auto">
                  <CollapsibleComponentPalette onAddField={addField} />
                </div>
              )}
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
            <div className="h-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <FormCanvas
                formData={formData}
                selectedField={selectedField}
                onSelectField={setSelectedField}
                onUpdateField={updateField}
                onRemoveField={removeField}
                onAddField={addField}
              />
            </div>
          </div>

          {/* Right Panel with Arrow Toggle */}
          <div className={`bg-white dark:bg-black border-l border-gray-200 dark:border-gray-800 transition-all duration-300 ${
            rightPanelOpen ? 'w-96' : 'w-12'
          }`}>
            <div className="h-full flex flex-col">
              {/* Panel Header with Toggle */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setRightPanelOpen(!rightPanelOpen)}
                  className="w-6 h-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {rightPanelOpen ? 
                    <ChevronRight className="w-4 h-4 text-cyan-500" /> : 
                    <ChevronLeft className="w-4 h-4 text-cyan-500" />
                  }
                </Button>
                {rightPanelOpen && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded flex items-center justify-center">
                      <Settings className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-black dark:text-white">Tools</span>
                  </div>
                )}
              </div>
              
              {/* Panel Content */}
              {rightPanelOpen && (
                <Tabs defaultValue="json" className="flex-1">
                  <TabsList className="w-full bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-1 rounded-none">
                    <TabsTrigger 
                      value="json" 
                      className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-black dark:data-[state=active]:text-white"
                    >
                      <Code2 className="w-3 h-3 mr-1 text-green-500" />
                      JSON
                    </TabsTrigger>
                    <TabsTrigger 
                      value="properties" 
                      className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-black dark:data-[state=active]:text-white"
                    >
                      <Settings className="w-3 h-3 mr-1 text-purple-500" />
                      Props
                    </TabsTrigger>

                    <TabsTrigger 
                      value="import" 
                      className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-black dark:data-[state=active]:text-white"
                    >
                      <Upload className="w-3 h-3 mr-1 text-orange-500" />
                      Import
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="json" className="flex-1 p-4 m-0">
                    <div className="h-full bg-black rounded-lg p-4 relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-xs font-medium">Live JSON</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-gray-400 hover:text-white h-6 w-6 p-0"
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(generateLiveJson(), null, 2));
                            toast({ title: "Copied!", description: "JSON copied to clipboard" });
                          }}
                        >
                          <Copy className="w-3 h-3 text-blue-500" />
                        </Button>
                      </div>
                      
                      <ScrollArea className="h-[calc(100%-2.5rem)]">
                        <pre className="text-green-300 text-xs leading-relaxed font-mono">
                          {JSON.stringify(generateLiveJson(), null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="properties" className="flex-1 p-4 m-0">
                    <ScrollArea className="h-full">
                      <PropertiesPanel
                        selectedField={selectedField}
                        onUpdateField={updateField}
                        formData={formData}
                      />
                    </ScrollArea>
                  </TabsContent>
                  

                  
                  <TabsContent value="import" className="flex-1 m-0">
                    <ComponentImportPanel
                      onImportComponent={(component) => {
                        addField(component);
                        toast({
                          title: "Component Imported! ✅",
                          description: `"${component.label}" is now available in your palette`
                        });
                      }}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
