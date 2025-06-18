import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import JSONValidatorDialog from "@/components/form-builder/json-validator-dialog";
import { Plus, Search, FileText, Calendar, User, FileCheck, Settings, Database, Menu, ArrowRightLeft, Upload, FileX, HelpCircle, Eye, Users, Edit3, Copy, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { Form, FormTemplate } from "@shared/schema";

// Dashboard Step-by-Step Guide Component
function DashboardGuide() {
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const steps = {
    welcome: {
      title: "Welcome to FormBuilder Enterprise Dashboard",
      content: "Your central hub for managing all forms. Let's walk through the key features.",
      actions: [
        { label: "Start Tour", action: () => setCurrentStep("forms-overview") },
        { label: "Skip Tour", action: () => setIsOpen(false) }
      ]
    },
    "forms-overview": {
      title: "Step 1: Your Forms Overview",
      content: "View all your forms here. Use the search bar to find specific forms quickly, or filter by type.",
      actions: [
        { label: "Next: Create New Form", action: () => setCurrentStep("create-form") },
        { label: "Previous", action: () => setCurrentStep("welcome") }
      ]
    },
    "create-form": {
      title: "Step 2: Creating New Forms",
      content: "Click 'Create New Form' to start building. You can also import existing forms from JSON files.",
      actions: [
        { label: "Next: Templates", action: () => setCurrentStep("templates") },
        { label: "Previous", action: () => setCurrentStep("forms-overview") }
      ]
    },
    "templates": {
      title: "Step 3: Form Templates",
      content: "Save time by using pre-built templates. Create your own templates from successful forms.",
      actions: [
        { label: "Finish Tour", action: () => setIsOpen(false) },
        { label: "Previous", action: () => setCurrentStep("create-form") }
      ]
    }
  };

  const currentStepData = currentStep ? steps[currentStep as keyof typeof steps] : null;

  const startGuide = () => {
    setCurrentStep("welcome");
    setIsOpen(true);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={startGuide}
        className="flex items-center space-x-2"
      >
        <HelpCircle className="w-4 h-4" />
        <span>Guide</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          {currentStepData && (
            <>
              <DialogHeader>
                <DialogTitle>{currentStepData.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-700">
                  {currentStepData.content}
                </p>
                
                <div className="flex justify-between items-center pt-4">
                  {currentStepData.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={index === 0 ? "default" : "outline"}
                      onClick={action.action}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormType, setSelectedFormType] = useState("PROCESS");
  const [showNewFormDialog, setShowNewFormDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importedFormData, setImportedFormData] = useState<any>(null);
  const [formConfig, setFormConfig] = useState({
    menuId: `FORM_${Date.now()}`,
    label: `Form ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '')}`,
    formWidth: "Medium (700px)",
    layout: "PROCESS"
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: forms = [] } = useQuery<Form[]>({
    queryKey: ["/api/forms"],
  });

  const { data: templates = [] } = useQuery<FormTemplate[]>({
    queryKey: ["/api/templates"],
  });

  const deleteFormMutation = useMutation({
    mutationFn: async (formId: number) => {
      await apiRequest(`/api/forms/${formId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      toast({
        title: "Success",
        description: "Form deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete form",
        variant: "destructive",
      });
    },
  });

  const createFormMutation = useMutation({
    mutationFn: async () => {
      const widthMap: { [key: string]: string } = {
        "Small (500px)": "500px",
        "Medium (700px)": "700px", 
        "Large (900px)": "900px",
        "Full Width": "100%"
      };
      
      const response = await fetch('/api/forms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          menuId: formConfig.menuId,
          label: formConfig.label,
          formWidth: widthMap[formConfig.formWidth] || "700px",
          layout: formConfig.layout
        })
      });
      if (!response.ok) throw new Error('Failed to create form');
      return response.json();
    },
    onSuccess: (newForm) => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      setShowNewFormDialog(false);
      window.location.href = `/form-builder/${newForm.id}`;
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create form",
        variant: "destructive",
      });
    },
  });

  const importFormMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await fetch('/api/forms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to import form');
      return response.json();
    },
    onSuccess: (newForm) => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      setShowImportDialog(false);
      setImportedFormData(null);
      toast({
        title: "Success",
        description: "Form imported and validated successfully",
      });
      window.location.href = `/form-builder/${newForm.id}`;
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to import form",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content);
          
          // Validate JSON structure
          if (parsedData.fields && Array.isArray(parsedData.fields)) {
            setImportedFormData(parsedData);
            setShowImportDialog(true);
          } else {
            toast({
              title: "Invalid Format",
              description: "The file must contain a valid form definition with 'fields' array",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Parse Error",
            description: "Invalid JSON file format",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportForm = () => {
    if (importedFormData) {
      // Process and normalize imported fields
      const processedFields = (importedFormData.fields || []).map((field: any) => {
        return {
          Id: field.Id || field.id || `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          Type: field.Type || field.type || 'TEXT',
          Label: field.Label || field.label || 'Imported Field',
          DataField: field.DataField || field.dataField || field.Label || field.label || 'field',
          Entity: field.Entity || field.entity || '',
          Width: field.Width || field.width || '100%',
          Spacing: field.Spacing || field.spacing || '4',
          Required: Boolean(field.Required || field.required),
          Inline: Boolean(field.Inline || field.inline),
          Outlined: Boolean(field.Outlined || field.outlined),
          Value: field.Value || field.value || '',
          ChildFields: field.ChildFields || field.childFields || []
        };
      });

      const formDefinition = {
        fields: processedFields,
        customComponents: importedFormData.customComponents || []
      };

      const formData = {
        menuId: `IMPORTED_${Date.now()}`,
        label: `Imported Form ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '')}`,
        formWidth: "700px",
        layout: "PROCESS",
        formDefinition: JSON.stringify(formDefinition),
      };
      
      console.log('Importing form with data:', formDefinition);
      importFormMutation.mutate(formData);
    }
  };

  const formTypeOptions = [
    {
      value: "PROCESS",
      label: "Process Form",
      icon: Settings,
      description: "Workflow and business process forms"
    },
    {
      value: "MASTER_MENU",
      label: "Master Menu",
      icon: Database,
      description: "Master data and menu interface forms"
    },
    {
      value: "TRANSACTIONS",
      label: "Transaction Form",
      icon: ArrowRightLeft,
      description: "Transaction and data entry forms"
    }
  ];

  const filteredForms = forms.filter(form =>
    form.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.menuId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage your forms and templates</p>
          </div>
          <div className="flex gap-3">
            <DashboardGuide />
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Form
                </span>
              </Button>
            </label>
            <JSONValidatorDialog />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forms.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {forms.filter(form => {
                  const created = new Date(form.createdAt || "");
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {forms.filter(form => {
                  const updated = new Date(form.updatedAt || "");
                  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                  return updated > dayAgo;
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Create New Form Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">My Forms</h2>
              <p className="text-slate-600">Create and manage your custom forms</p>
            </div>
            <Dialog open={showNewFormDialog} onOpenChange={(open) => {
              setShowNewFormDialog(open);
              if (open) {
                // Generate fresh default values when dialog opens
                setFormConfig({
                  menuId: `FORM_${Date.now()}`,
                  label: `Form ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '')}`,
                  formWidth: "Medium (700px)",
                  layout: "PROCESS"
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Form
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Create New Form</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  {/* Form Configuration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Menu ID <span className="text-red-500">*</span></label>
                      <Input
                        value={formConfig.menuId}
                        onChange={(e) => setFormConfig(prev => ({ ...prev, menuId: e.target.value }))}
                        placeholder="ACCADJ"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Label <span className="text-red-500">*</span></label>
                      <Input
                        value={formConfig.label}
                        onChange={(e) => setFormConfig(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Form label"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Width</label>
                      <Select 
                        value={formConfig.formWidth} 
                        onValueChange={(value) => setFormConfig(prev => ({ ...prev, formWidth: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Small (500px)">Small (500px)</SelectItem>
                          <SelectItem value="Medium (700px)">Medium (700px)</SelectItem>
                          <SelectItem value="Large (900px)">Large (900px)</SelectItem>
                          <SelectItem value="Full Width">Full Width</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Layout</label>
                      <Select 
                        value={formConfig.layout} 
                        onValueChange={(value) => setFormConfig(prev => ({ ...prev, layout: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PROCESS">Process Form</SelectItem>
                          <SelectItem value="MASTER_MENU">Master Menu</SelectItem>
                          <SelectItem value="TRANSACTIONS">Transaction Form</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowNewFormDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => createFormMutation.mutate()}
                      disabled={createFormMutation.isPending || !formConfig.menuId || !formConfig.label}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createFormMutation.isPending ? 'Creating...' : 'Create Form'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Forms List */}
          {forms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <Card key={form.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{form.label || 'Untitled Form'}</CardTitle>
                      <Badge variant="outline">{form.layout}</Badge>
                    </div>
                    <CardDescription>Menu ID: {form.menuId}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Updated:</span>
                        <span className="font-medium">{formatDate(form.updatedAt)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => window.location.href = `/form-builder/${form.id}`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => deleteFormMutation.mutate(form.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={deleteFormMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No forms yet</h3>
              <p className="text-slate-600 mb-6">Create your first form to get started</p>
            </div>
          )}
        </div>

        {/* Templates Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Form Templates</h2>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {templates.length} templates
            </Badge>
          </div>
          
          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow duration-300 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-blue-900">{template.name}</CardTitle>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">Template</Badge>
                    </div>
                    <CardDescription className="text-blue-700">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600">Catégorie:</span>
                        <span className="font-medium text-blue-800">{template.category}</span>
                      </div>
                      <div className="flex items-center space-x-2 pt-4">
                        <Button variant="outline" className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100" onClick={() => {
                          window.location.href = `/form-builder?template=${template.id}`;
                        }}>
                          Use this template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-blue-50 rounded-lg border border-blue-200">
              <FileCheck className="h-12 w-12 text-blue-400 mx-auto mb-3" />
              <p className="text-blue-600 font-medium">No templates available</p>
              <p className="text-blue-500 text-sm">Templates help you get started quickly with pre-configured forms</p>
            </div>
          )}
        </div>

        {/* Import Form Dialog */}
        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-green-600" />
                Import Form Validation
              </DialogTitle>
            </DialogHeader>
            
            {importedFormData && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileCheck className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Valid Form Structure</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Form contains {importedFormData.fields?.length || 0} components and has been validated successfully.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Form Preview</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {importedFormData.fields?.map((field: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            field.Type === 'TEXT' ? 'bg-blue-500' :
                            field.Type === 'SELECT' ? 'bg-orange-500' :
                            field.Type === 'CHECKBOX' ? 'bg-green-500' :
                            field.Type === 'GROUP' ? 'bg-purple-500' :
                            'bg-gray-500'
                          }`} />
                          <span className="font-medium">{field.Label || field.Id}</span>
                        </div>
                        <Badge variant="outline">{field.Type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Raw JSON Data</h4>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto max-h-40">
                    {JSON.stringify(importedFormData, null, 2)}
                  </pre>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowImportDialog(false);
                      setImportedFormData(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleImportForm}
                    disabled={importFormMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {importFormMutation.isPending ? (
                      <>Loading...</>
                    ) : (
                      <>
                        <FileCheck className="w-4 h-4 mr-2" />
                        Import & Edit Form
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
