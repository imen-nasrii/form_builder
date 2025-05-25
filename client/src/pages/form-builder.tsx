import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import ComponentPalette from "@/components/form-builder/component-palette";
import FormCanvas from "@/components/form-builder/form-canvas";
import PropertiesPanel from "@/components/form-builder/properties-panel";
import ExportDialog from "@/components/form-builder/export-dialog";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Save, Eye, Download, Upload } from "lucide-react";
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
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        
        {/* Form Builder Toolbar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h2 className="text-lg font-semibold text-slate-900">
                {formId ? 'Edit Form' : 'Form Designer'}
              </h2>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="menuId" className="text-sm font-medium">Menu ID:</Label>
                  <Input
                    id="menuId"
                    value={formData.menuId}
                    onChange={(e) => setFormData(prev => ({ ...prev, menuId: e.target.value }))}
                    className="w-32"
                    placeholder="ACCADJ"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="label" className="text-sm font-medium">Label:</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    className="w-32"
                    placeholder="Form Label"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="width" className="text-sm font-medium">Width:</Label>
                  <Select 
                    value={formData.formWidth} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, formWidth: value }))}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="600px">600px</SelectItem>
                      <SelectItem value="700px">700px</SelectItem>
                      <SelectItem value="800px">800px</SelectItem>
                      <SelectItem value="100%">100%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="layout" className="text-sm font-medium">Layout:</Label>
                  <Select 
                    value={formData.layout} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, layout: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROCESS">PROCESS</SelectItem>
                      <SelectItem value="ENTRY">ENTRY</SelectItem>
                      <SelectItem value="INQUIRY">INQUIRY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleValidate} disabled={validateFormMutation.isPending}>
                <Eye className="w-4 h-4 mr-2" />
                Validate
              </Button>
              
              <ExportDialog formData={formData} />
              
              <Button variant="outline" onClick={handleExport} size="sm">
                <Download className="w-4 h-4 mr-2" />
                JSON
              </Button>
              
              <label>
                <Button variant="outline" asChild size="sm">
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              
              <Button onClick={handleSave} disabled={saveFormMutation.isPending} className="enterprise-gradient">
                <Save className="w-4 h-4 mr-2" />
                Save Form
              </Button>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex">
          {/* Component Palette */}
          <ComponentPalette onAddField={addField} />

          {/* Form Canvas */}
          <FormCanvas
            formData={formData}
            selectedField={selectedField}
            onSelectField={setSelectedField}
            onUpdateField={updateField}
            onRemoveField={removeField}
            onAddField={addField}
          />

          {/* Properties Panel */}
          <PropertiesPanel
            selectedField={selectedField}
            onUpdateField={updateField}
            formData={formData}
          />
        </div>
      </div>
    </DndProvider>
  );
}
