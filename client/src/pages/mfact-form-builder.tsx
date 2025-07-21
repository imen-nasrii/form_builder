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
  const [showHelloAnimation, setShowHelloAnimation] = useState(true);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  // Load form data
  const { data: form, isLoading: formLoading } = useQuery({
    queryKey: ['/api/forms', formId],
    enabled: !!formId,
  });

  // Hello animation timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelloAnimation(false);
    }, 3000); // Show for 3 seconds
    
    return () => clearTimeout(timer);
  }, []);

  // Load form data into state
  useEffect(() => {
    if (form && typeof form === 'object' && 'definition' in form && form.definition) {
      try {
        const parsed = typeof form.definition === 'string' 
          ? JSON.parse(form.definition) 
          : form.definition;
        
        setFormData({
          menuId: (form as any).menuId || "",
          label: (form as any).label || "",
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
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 relative">
      {/* Cute Hello Animation */}
      {showHelloAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none">
          <div className="relative">
            {/* Cute character */}
            <div className="animate-bounce">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-4xl animate-pulse">👋</div>
              </div>
            </div>
            
            {/* Speech bubble */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-4 py-2 shadow-lg animate-fade-in">
              <div className="text-lg font-bold text-gray-800 animate-pulse">Hello!</div>
              <div className="text-sm text-gray-600">Welcome to MFact Builder ✨</div>
              {/* Speech bubble arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
            
            {/* Sparkles animation */}
            <div className="absolute -top-8 -left-8 animate-ping">
              <div className="text-2xl">✨</div>
            </div>
            <div className="absolute -top-4 -right-8 animate-pulse">
              <div className="text-xl">⭐</div>
            </div>
            <div className="absolute -bottom-4 -left-6 animate-bounce" style={{ animationDelay: '0.5s' }}>
              <div className="text-lg">💫</div>
            </div>
            <div className="absolute -bottom-6 -right-4 animate-ping" style={{ animationDelay: '1s' }}>
              <div className="text-lg">🌟</div>
            </div>
          </div>
        </div>
      )}
      {/* Enhanced Header with Secondary Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {/* Main Header */}
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/dashboard')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
              {/* Status Indicator */}
              {formData.fields.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm mr-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  {formData.fields.length} Components
                </div>
              )}
              
              <Button
                onClick={() => saveForm.mutate()}
                disabled={saveForm.isPending}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveForm.isPending ? 'Saving...' : 'Save Program'}
              </Button>
            </div>
          </div>
        </div>

        {/* Modern Dropdown Toolbar */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="relative">
              {/* Modern Menu Button */}
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-6 bg-white/80 border-slate-300 hover:bg-white hover:border-indigo-400 transition-all duration-200 flex items-center gap-2 shadow-sm"
                onClick={() => setShowMenuDropdown(!showMenuDropdown)}
              >
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Actions
                <div className={`transition-transform duration-200 ${showMenuDropdown ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </Button>

              {/* Enhanced Dropdown */}
              {showMenuDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-2 space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-11 px-4 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 rounded-lg"
                      onClick={() => {
                        setLocation('/');
                        setShowMenuDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          🏠
                        </div>
                        <span className="font-medium">Home</span>
                      </div>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-11 px-4 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 rounded-lg"
                      onClick={() => {
                        alert('Guide feature coming soon!');
                        setShowMenuDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          📖
                        </div>
                        <span className="font-medium">Guide</span>
                      </div>
                    </Button>
                    
                    <div className="h-px bg-slate-200 my-2"></div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-11 px-4 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 rounded-lg"
                      onClick={() => {
                        alert('Import feature coming soon!');
                        setShowMenuDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          📥
                        </div>
                        <span className="font-medium">Import</span>
                      </div>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-11 px-4 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 rounded-lg"
                      onClick={() => {
                        exportJSON();
                        setShowMenuDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          📤
                        </div>
                        <span className="font-medium">Export</span>
                      </div>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-11 px-4 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 rounded-lg"
                      onClick={() => {
                        alert('External Components feature coming soon!');
                        setShowMenuDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                          🧩
                        </div>
                        <span className="font-medium">External Components</span>
                      </div>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-11 px-4 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 rounded-lg"
                      onClick={() => {
                        alert('Collaborate feature coming soon!');
                        setShowMenuDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                          👥
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Collaborate</span>
                          <span className="text-xs text-slate-500">0 active</span>
                        </div>
                      </div>
                    </Button>
                    
                    <div className="h-px bg-slate-200 my-2"></div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-11 px-4 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 rounded-lg"
                      onClick={() => {
                        if (confirm('Clear all components?')) {
                          setFormData(prev => ({ ...prev, fields: [] }));
                          setSelectedField(null);
                        }
                        setShowMenuDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          🗑️
                        </div>
                        <span className="font-medium">Clear All</span>
                      </div>
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                size="sm"
                className="h-10 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => {
                  saveForm.mutate();
                }}
                disabled={saveForm.isPending}
              >
                💾 {saveForm.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>

        {/* Click outside to close */}
        {showMenuDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenuDropdown(false)}
          />
        )}
      </div>

      {/* Main Content - Modern Layout */}
      <div className="flex-1 flex overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        {/* Left Panel - Modern Components Palette */}
        <div className="w-80 bg-white/95 backdrop-blur-sm border-r border-slate-200/60 overflow-y-auto shadow-xl">
          <div className="p-5 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white/80">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              Components
            </h3>
            <p className="text-sm text-slate-600 mt-1.5">Drag and drop to build your form</p>
          </div>
          <div className="p-5 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="menu-id" className="text-sm font-medium text-gray-700">
                Menu ID
                <span className="text-xs text-gray-500 ml-2">(System identifier)</span>
              </Label>
              <Input
                id="menu-id"
                value={formData.menuId}
                onChange={(e) => setFormData(prev => ({ ...prev, menuId: e.target.value }))}
                placeholder="e.g., ACCADJ, BUYTYP"
                className="font-mono bg-gray-50 border-gray-300 focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="form-label" className="text-sm font-medium text-gray-700">
                Program Label
                <span className="text-xs text-gray-500 ml-2">(Display name)</span>
              </Label>
              <Input
                id="form-label"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Enter program label"
                className="bg-gray-50 border-gray-300 focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="form-width" className="text-sm font-medium text-gray-700">
                Form Width
                <span className="text-xs text-gray-500 ml-2">(Layout size)</span>
              </Label>
              <Select
                value={formData.formWidth}
                onValueChange={(value) => setFormData(prev => ({ ...prev, formWidth: value }))}
              >
                <SelectTrigger className="bg-gray-50 border-gray-300 focus:bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="600px">📱 600px - Compact</SelectItem>
                  <SelectItem value="700px">💻 700px - Standard</SelectItem>
                  <SelectItem value="800px">🖥️ 800px - Wide</SelectItem>
                  <SelectItem value="1000px">📺 1000px - Extra Wide</SelectItem>
                  <SelectItem value="100%">🔄 100% - Full Width</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="form-layout" className="text-sm font-medium text-gray-700">
                Layout Type
                <span className="text-xs text-gray-500 ml-2">(UI behavior)</span>
              </Label>
              <Select
                value={formData.layout}
                onValueChange={(value) => setFormData(prev => ({ ...prev, layout: value as FormLayout }))}
              >
                <SelectTrigger className="bg-gray-50 border-gray-300 focus:bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROCESS">⚙️ Process Form</SelectItem>
                  <SelectItem value="MASTERMENU">📋 Master Menu</SelectItem>
                  <SelectItem value="DIALOG">💬 Dialog</SelectItem>
                  <SelectItem value="POPUP">🔲 Popup</SelectItem>
                  <SelectItem value="FULLSCREEN">🖥️ Full Screen</SelectItem>
                  <SelectItem value="WIZARD">🪄 Wizard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="program-category" className="text-sm font-medium text-gray-700">
                Category
                <span className="text-xs text-gray-500 ml-2">(Business type)</span>
              </Label>
              <Select
                value={formData.metadata?.category}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  metadata: { ...prev.metadata!, category: value as ProgramCategory }
                }))}
              >
                <SelectTrigger className="bg-gray-50 border-gray-300 focus:bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FINANCIAL">💰 Financial</SelectItem>
                  <SelectItem value="INVENTORY">📦 Inventory</SelectItem>
                  <SelectItem value="PURCHASING">🛒 Purchasing</SelectItem>
                  <SelectItem value="REPORTING">📊 Reporting</SelectItem>
                  <SelectItem value="ADMINISTRATION">⚙️ Administration</SelectItem>
                  <SelectItem value="CUSTOM">✨ Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Center Panel - Enhanced Construction Zone */}
        <div className="flex-1 bg-white overflow-hidden shadow-lg border border-gray-200 rounded-lg m-2">
          <div className="h-full">
            <MFactConstructionZone
              formData={formData}
              onFormUpdate={handleFormUpdate}
              selectedField={selectedField}
              onFieldSelect={setSelectedField}
            />
          </div>
        </div>

        {/* Right Panel - Modern Properties */}
        <div className="w-96 bg-white/95 backdrop-blur-sm border-l border-slate-200/60 overflow-y-auto shadow-xl">
          <div className="p-5 border-b border-slate-200/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Properties</h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  {selectedField 
                    ? `Configure ${selectedField.Label || selectedField.Type}` 
                    : 'Select a component to configure'
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="p-5">
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