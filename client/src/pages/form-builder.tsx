import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Save, Eye, Download, Upload, Code2, FileText } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navigation />
        
        {/* Modern Header Bar */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Form Builder Pro
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Drag components • Build forms • Generate JSON • Export code
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleValidate}
                disabled={validateFormMutation.isPending}
                className="gap-2 hover:bg-green-50 hover:border-green-200"
              >
                <Eye className="w-4 h-4" />
                Validate
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saveFormMutation.isPending}
                className="gap-2 hover:bg-blue-50 hover:border-blue-200"
              >
                <Save className="w-4 h-4" />
                {saveFormMutation.isPending ? "Saving..." : "Save"}
              </Button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="sm" className="gap-2 hover:bg-purple-50 hover:border-purple-200">
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
              </div>
              
              <MultiFrameworkExport 
                formData={generateLiveJson()}
                trigger={
                  <Button size="sm" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Code2 className="w-4 h-4" />
                    Export Code
                  </Button>
                }
              />
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex h-[calc(100vh-140px)]">
          {/* Component Palette - Sleek Sidebar */}
          <div className="w-72 bg-white/90 backdrop-blur-sm border-r border-slate-200/50 shadow-sm">
            <ComponentPalette onAddField={addField} />
          </div>

          {/* Center: Form Canvas */}
          <div className="flex-1 bg-white/40 backdrop-blur-sm">
            <FormCanvas
              formData={formData}
              selectedField={selectedField}
              onSelectField={setSelectedField}
              onUpdateField={updateField}
              onRemoveField={removeField}
              onAddField={addField}
            />
          </div>

          {/* Right: Live JSON Preview */}
          <div className="w-96 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-xl">
            <div className="p-4 border-b border-slate-700 bg-slate-800/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <Code2 className="w-4 h-4 text-green-400" />
                  Live JSON
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowJsonPreview(!showJsonPreview)}
                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  {showJsonPreview ? 'Hide' : 'Show'}
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-time generation • Auto-sync • Ready to export
              </p>
            </div>

            {showJsonPreview && (
              <div className="flex-1 overflow-auto p-4">
                <div className="bg-slate-950/50 rounded-lg border border-slate-700 p-4">
                  <pre className="text-xs text-green-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {JSON.stringify(generateLiveJson(), null, 2)}
                  </pre>
                </div>
                
                <div className="mt-4 space-y-3">
                  <Button
                    size="sm"
                    onClick={handleExport}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 gap-2"
                  >
                    <Download className="w-3 h-3" />
                    Download JSON
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(generateLiveJson(), null, 2));
                      toast({ title: "Copied to clipboard!", description: "JSON schema ready to use" });
                    }}
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Properties Panel - Floating Style */}
          <div className="w-80 bg-white/90 backdrop-blur-sm border-l border-slate-200/50 shadow-sm overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Advanced Validator */}
              <AdvancedValidator 
                formData={generateLiveJson()}
                onSuggestionApply={(suggestion) => {
                  if (suggestion.autoFixable && suggestion.fieldId) {
                    const fieldIndex = formData.fields.findIndex(f => f.Id === suggestion.fieldId);
                    if (fieldIndex !== -1) {
                      const updatedField = { ...formData.fields[fieldIndex], required: true };
                      updateField(updatedField);
                      toast({ 
                        title: "Suggestion Applied! ✨", 
                        description: `${suggestion.title} has been applied automatically.` 
                      });
                    }
                  }
                }}
              />
              
              {/* Properties Panel */}
              <PropertiesPanel
                selectedField={selectedField}
                onUpdateField={updateField}
                formData={formData}
              />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
