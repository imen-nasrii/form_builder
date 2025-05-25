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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <Navigation />
        
        {/* Beautiful Modern Header */}
        <div className="bg-white/70 backdrop-blur-xl border-b border-indigo-100 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Générateur de formulaires
                </h1>
                <p className="text-sm text-indigo-600/60">Créez des formulaires professionnels en quelques clics</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl px-6"
                onClick={handleSave}
                disabled={saveFormMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {saveFormMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
              
              <MultiFrameworkExport 
                formData={generateLiveJson()}
                trigger={
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl px-6 shadow-lg">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                }
              />
            </div>
          </div>
        </div>

        {/* Premium Layout */}
        <div className="flex h-[calc(100vh-140px)] max-w-7xl mx-auto p-6 gap-6">
          {/* Palette Élégante */}
          <div className="w-80 bg-white/80 backdrop-blur-xl rounded-2xl border border-indigo-100 shadow-xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Composants</h3>
              <p className="text-sm text-indigo-600/70">Glissez et déposez pour construire</p>
            </div>
            <ComponentPalette onAddField={addField} />
          </div>

          {/* Zone de Conception Principale */}
          <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl border border-indigo-100 shadow-xl p-8">
            <div className="h-full bg-white/50 rounded-xl border-2 border-dashed border-indigo-200 p-6">
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

          {/* Panneau JSON & Propriétés Premium */}
          <div className="w-96 bg-white/80 backdrop-blur-xl rounded-2xl border border-indigo-100 shadow-xl overflow-hidden">
            <Tabs defaultValue="json" className="h-full">
              <TabsList className="w-full bg-indigo-50/50 border-b border-indigo-100 p-1 rounded-none rounded-t-2xl">
                <TabsTrigger 
                  value="json" 
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm rounded-xl"
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  JSON Live
                </TabsTrigger>
                <TabsTrigger 
                  value="properties" 
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm rounded-xl"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Propriétés
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="json" className="h-full p-6 m-0">
                <div className="h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 shadow-inner">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Génération temps réel</span>
                  </div>
                  <ScrollArea className="h-[calc(100%-3rem)]">
                    <pre className="text-green-300 text-xs leading-relaxed font-mono">
                      {JSON.stringify(generateLiveJson(), null, 2)}
                    </pre>
                  </ScrollArea>
                  
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(generateLiveJson(), null, 2));
                        toast({ title: "Copié !", description: "JSON copié dans le presse-papiers" });
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      onClick={handleExport}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
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
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
