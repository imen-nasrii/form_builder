import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import MFactConstructionZone from "@/components/mfact-construction-zone";
import MFactPropertiesPanel from "@/components/mfact-properties-panel";

import { 
  Save, 
  Download, 
  Upload, 
  ArrowLeft,
  Settings,
  Play,
  Eye,
  Code,
  FileJson,
  Wand2
} from "lucide-react";
import type { Form } from "@shared/schema";
import type { MFactForm, MFactField, FormLayout, ProgramCategory } from "@shared/mfact-models";
import { MFACT_TEMPLATES } from "@shared/mfact-models";

export default function MFactFormBuilder() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const formId = params.formId ? parseInt(params.formId) : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<MFactForm>({
    menuId: "",
    label: "",
    formWidth: "700px",
    layout: "PROCESS" as FormLayout,
    fields: [],
    actions: [],
    validations: [],
    metadata: {
      category: "CUSTOM" as ProgramCategory,
      description: "",
      version: "1.0.0"
    }
  });
  
  const [selectedField, setSelectedField] = useState<MFactField | null>(null);
  const [activeTab, setActiveTab] = useState("design");

  // Load form data
  const { data: form, isLoading: formLoading } = useQuery({
    queryKey: ['/api/forms', formId],
    enabled: !!formId,
  });

  // Load form data into state
  useEffect(() => {
    if (form?.definition) {
      try {
        const parsed = typeof form.definition === 'string' 
          ? JSON.parse(form.definition) 
          : form.definition;
        
        setFormData({
          menuId: form.menuId || "",
          label: form.label || "",
          formWidth: parsed.formWidth || "700px",
          layout: parsed.layout || "PROCESS",
          fields: parsed.fields || [],
          actions: parsed.actions || [],
          validations: parsed.validations || [],
          metadata: {
            category: parsed.metadata?.category || "CUSTOM",
            description: parsed.metadata?.description || "",
            version: parsed.metadata?.version || "1.0.0"
          }
        });
      } catch (error) {
        console.error('Error parsing form definition:', error);
        toast({
          title: "Error",
          description: "Failed to load form definition",
          variant: "destructive"
        });
      }
    }
  }, [form, toast]);

  // Save form mutation
  const saveForm = useMutation({
    mutationFn: async () => {
      const payload = {
        menuId: formData.menuId,
        label: formData.label,
        formWidth: formData.formWidth,
        layout: formData.layout,
        formDefinition: JSON.stringify({
          fields: formData.fields,
          actions: formData.actions,
          validations: formData.validations,
          metadata: formData.metadata,
          formWidth: formData.formWidth,
          layout: formData.layout
        })
      };

      if (formId) {
        return apiRequest(`/api/forms/${formId}`, {
          method: 'PATCH',
          body: payload
        });
      } else {
        return apiRequest('/api/forms', {
          method: 'POST',
          body: payload
        });
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "MFact program saved successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
      
      // Navigate to the saved form if it's new
      if (!formId && data?.id) {
        setLocation(`/mfact-builder/${data.id}`);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save MFact program",
        variant: "destructive"
      });
    }
  });

  const handleFormUpdate = useCallback((updatedForm: MFactForm) => {
    setFormData(updatedForm);
  }, []);

  const handleFieldUpdate = useCallback((updatedField: MFactField) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.Id === updatedField.Id ? updatedField : field
      )
    }));
  }, []);

  const handleFieldRemove = useCallback(() => {
    if (selectedField) {
      setFormData(prev => ({
        ...prev,
        fields: prev.fields.filter(field => field.Id !== selectedField.Id)
      }));
      setSelectedField(null);
    }
  }, [selectedField]);

  const exportJSON = useCallback(() => {
    const jsonString = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.menuId || 'mfact-program'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "MFact program exported as JSON"
    });
  }, [formData, toast]);

  const generateCode = useCallback(() => {
    // This would generate code for different frameworks
    toast({
      title: "Code Generation",
      description: "Code generation feature coming soon!",
      variant: "default"
    });
  }, [toast]);

  if (formLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading MFact Form Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  MFact Form Builder
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formId ? `Editing: ${formData.label || 'Untitled Program'}` : 'Create New MFact Program'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportJSON}
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={generateCode}
            >
              <Code className="w-4 h-4 mr-2" />
              Generate Code
            </Button>
            
            <Button
              onClick={() => saveForm.mutate()}
              disabled={saveForm.isPending}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveForm.isPending ? 'Saving...' : 'Save Program'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Simplified Layout */}
      <div className="flex-1 flex overflow-hidden bg-gray-50">
        {/* Left Panel - Form Settings */}
        <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Form Settings</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <Label htmlFor="menu-id">Menu ID</Label>
              <Input
                id="menu-id"
                value={formData.menuId}
                onChange={(e) => setFormData(prev => ({ ...prev, menuId: e.target.value }))}
                placeholder="e.g., ACCADJ, BUYTYP"
                className="font-mono"
              />
            </div>

            <div>
              <Label htmlFor="form-label">Program Label</Label>
              <Input
                id="form-label"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Enter program label"
              />
            </div>

            <div>
              <Label htmlFor="form-width">Form Width</Label>
              <Select
                value={formData.formWidth}
                onValueChange={(value) => setFormData(prev => ({ ...prev, formWidth: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="600px">600px - Compact</SelectItem>
                  <SelectItem value="700px">700px - Standard</SelectItem>
                  <SelectItem value="800px">800px - Wide</SelectItem>
                  <SelectItem value="1000px">1000px - Extra Wide</SelectItem>
                  <SelectItem value="100%">100% - Full Width</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="form-layout">Layout Type</Label>
              <Select
                value={formData.layout}
                onValueChange={(value) => setFormData(prev => ({ ...prev, layout: value as FormLayout }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROCESS">Process Form</SelectItem>
                  <SelectItem value="MASTERMENU">Master Menu</SelectItem>
                  <SelectItem value="DIALOG">Dialog</SelectItem>
                  <SelectItem value="POPUP">Popup</SelectItem>
                  <SelectItem value="FULLSCREEN">Full Screen</SelectItem>
                  <SelectItem value="WIZARD">Wizard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="program-category">Category</Label>
              <Select
                value={formData.metadata?.category}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  metadata: { ...prev.metadata!, category: value as ProgramCategory }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FINANCIAL">Financial</SelectItem>
                  <SelectItem value="INVENTORY">Inventory</SelectItem>
                  <SelectItem value="PURCHASING">Purchasing</SelectItem>
                  <SelectItem value="REPORTING">Reporting</SelectItem>
                  <SelectItem value="ADMINISTRATION">Administration</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Center Panel - Construction Zone */}
        <div className="flex-1 bg-white overflow-hidden">
          <div className="h-full">
            <MFactConstructionZone
              form={formData}
              onFormUpdate={handleFormUpdate}
              selectedField={selectedField}
              onFieldSelect={setSelectedField}
            />
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Properties Panel</h3>
          </div>
          <div className="p-4">
            <MFactPropertiesPanel
              selectedField={selectedField}
              onFieldUpdate={handleFieldUpdate}
              onFieldRemove={handleFieldRemove}
            />
          </div>
        </div>
      </div>
    </div>
  );
}