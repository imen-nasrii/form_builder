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
import ComponentPalette from "@/components/form-builder/component-palette";
import FormCanvas from "@/components/form-builder/form-canvas";
import PropertiesPanel from "@/components/form-builder/properties-panel";
import ExportDialog from "@/components/form-builder/export-dialog";
import AdvancedValidator from "@/components/form-builder/advanced-validator";
import MultiFrameworkExport from "@/components/form-builder/multi-framework-export";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Save, Eye, Download, Upload, Code2, FileText, Settings, Copy } from "lucide-react";
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
        
        {/* Ultra Modern Full-Width Header */}
        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
          <div className="w-full px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    FormBuilder Pro
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Advanced Form Designer & Code Generator</p>
                </div>
              </div>
              
              {/* Advanced Controls */}
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  {isCollapsed ? "Expand" : "Collapse"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={handleSave}
                  disabled={saveFormMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveFormMutation.isPending ? "Saving..." : "Save"}
                </Button>
                
                <MultiFrameworkExport 
                  formData={generateLiveJson()}
                  trigger={
                    <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
                      <Download className="w-4 h-4 mr-2" />
                      Export Code
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Revolutionary Full-Width Layout */}
        <div className={`flex h-[calc(100vh-90px)] w-full transition-all duration-500 ${isCollapsed ? 'gap-2 p-2' : 'gap-6 p-6'}`}>
          
          {/* Dynamic Left Panel - Components */}
          <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl transition-all duration-500 overflow-hidden ${
            isCollapsed ? 'w-16 rounded-lg' : 'w-80 rounded-3xl'
          }`}>
            {!isCollapsed && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Components</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop to build</p>
                </div>
                <ComponentPalette onAddField={addField} />
              </div>
            )}
            {isCollapsed && (
              <div className="p-2 space-y-2">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
              </div>
            )}
          </div>

          {/* Ultra-Wide Canvas Area */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-8 overflow-hidden">
            <div className="h-full bg-white dark:bg-black rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 transition-colors duration-300">
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

          {/* Advanced Right Panel - JSON & Properties */}
          <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden transition-all duration-500 ${
            isCollapsed ? 'w-16 rounded-lg' : 'w-96 rounded-3xl'
          }`}>
            {!isCollapsed && (
              <Tabs defaultValue="json" className="h-full">
                <TabsList className="w-full bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-1 rounded-none rounded-t-3xl">
                  <TabsTrigger 
                    value="json" 
                    className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
                  >
                    <Code2 className="w-4 h-4 mr-2" />
                    JSON Live
                  </TabsTrigger>
                  <TabsTrigger 
                    value="properties" 
                    className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Properties
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="json" className="h-full p-6 m-0">
                  <div className="h-full bg-black dark:bg-gray-950 rounded-2xl p-6 shadow-inner relative overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-sm font-medium">Real-time Generation</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                            onClick={() => {
                              navigator.clipboard.writeText(JSON.stringify(generateLiveJson(), null, 2));
                              toast({ title: "Copied!", description: "JSON copied to clipboard" });
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <ScrollArea className="h-[calc(100%-4rem)]">
                        <pre className="text-green-300 text-xs leading-relaxed font-mono selection:bg-green-400/20">
                          {JSON.stringify(generateLiveJson(), null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="properties" className="h-full p-6 m-0">
                  <ScrollArea className="h-full">
                    <PropertiesPanel
                      selectedField={selectedField}
                      onUpdateField={updateField}
                      formData={formData}
                    />
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            )}
            {isCollapsed && (
              <div className="p-2 space-y-2">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg animate-pulse"></div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
