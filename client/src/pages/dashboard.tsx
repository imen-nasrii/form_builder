import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import JSONValidatorDialog from "@/components/form-builder/json-validator-dialog";
import { Plus, Search, FileText, Calendar, User, FileCheck, Settings, Database, Menu, ArrowRightLeft, Upload, FileX, HelpCircle, Eye, Users, Edit3, Copy, Trash2, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { Form } from "@shared/schema";

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
  const [showStats, setShowStats] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedFormForAssign, setSelectedFormForAssign] = useState<Form | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedPermission, setSelectedPermission] = useState<string>("read-write");
  const [assignmentComment, setAssignmentComment] = useState<string>("");
  const [formConfig, setFormConfig] = useState({
    menuId: `FORM_${Date.now()}`,
    label: `Form ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '')}`,
    formWidth: "Medium (700px)",
    layout: "PROCESS"
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = Boolean(user && (user as any).role === 'admin');

  // Helper function to format date
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const { data: forms = [] } = useQuery<Form[]>({
    queryKey: ["/api/forms"],
  });

  // Fetch users for assignment (admin only)
  const { data: allUsers = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAdmin,
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

  const assignFormMutation = useMutation({
    mutationFn: async (assignmentData: any) => {
      try {
        return await apiRequest('/api/forms/assign', {
          method: 'POST',
          body: JSON.stringify(assignmentData),
        });
      } catch (error) {
        console.error('Assignment error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      toast({
        title: "Form assigned",
        description: `Form "${selectedFormForAssign?.label}" has been successfully assigned.`,
      });
      setShowAssignDialog(false);
      setSelectedUser("");
      setSelectedPermission("read-write");
      setAssignmentComment("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Unable to assign form.",
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
            {!isAdmin && (
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Importer un Formulaire
                  </span>
                </Button>
              </label>
            )}
            {!isAdmin && <JSONValidatorDialog />}
          </div>
        </div>



        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search programs..."
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
              <h2 className="text-2xl font-bold text-slate-900">
                {isAdmin ? 'Tous les Formulaires' : 'Mes Formulaires'}
              </h2>
              <p className="text-slate-600">
                {isAdmin ? 'Consulter et affecter les formulaires' : 'Créer et gérer vos formulaires personnalisés'}
              </p>
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
              {!isAdmin && (
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Program
                  </Button>
                </DialogTrigger>
              )}
              {isAdmin ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    Mode Administrateur
                  </Badge>
                  <Button variant="outline" disabled>
                    <Eye className="w-4 h-4 mr-2" />
                    Consultation uniquement
                  </Button>
                </div>
              ) : null}
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Create New Program</DialogTitle>
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
                        placeholder="Program label"
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

          {/* Forms List - 3D Flip Cards */}
          {forms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms
                .sort((a, b) => (a.label || 'Untitled Form').localeCompare(b.label || 'Untitled Form')) // Sort by name
                .map((form) => (
                <div key={form.id} className="flip-card group perspective-1000 h-64">
                  <div className="flip-card-inner relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                    
                    {/* Front of the card */}
                    <div className={`flip-card-front absolute w-full h-full backface-hidden rounded-lg shadow-lg ${
                      isAdmin ? 'bg-white border-gray-200' : 'bg-white border-gray-200'
                    } border-2`}>
                      <div className="p-6 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-bold ${isAdmin ? 'text-gray-800' : 'text-gray-800'}`}>
                              {form.label || 'Untitled Form'}
                            </h3>
                            <Badge variant="secondary" className={`${
                              isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {form.layout}
                            </Badge>
                          </div>
                          <p className={`text-sm ${isAdmin ? 'text-gray-600' : 'text-gray-600'} mb-2`}>
                            Menu ID: {form.menuId}
                          </p>
                          {isAdmin && form.createdBy && (
                            <p className="text-blue-600 text-sm mb-2">
                              Created by: {form.createdBy}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className={`${isAdmin ? 'text-gray-500' : 'text-gray-500'}`}>Updated:</span>
                          <span className={`font-medium ${isAdmin ? 'text-gray-700' : 'text-gray-700'}`}>
                            {formatDate(form.updatedAt)}
                          </span>
                        </div>
                        
                        <div className="text-center text-xs text-gray-500 mt-2">
                          Hover for more options
                        </div>
                      </div>
                    </div>

                    {/* Back of the card */}
                    <div className={`flip-card-back absolute w-full h-full backface-hidden rounded-lg shadow-lg rotate-y-180 ${
                      isAdmin ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-200'
                    } border-2`}>
                      <div className="p-6 h-full flex flex-col justify-center space-y-3">
                        <Button
                          variant="outline"
                          className={`w-full ${
                            isAdmin 
                              ? 'border-blue-300 text-blue-700 hover:bg-blue-50 bg-white' 
                              : 'border-purple-300 text-purple-700 hover:bg-purple-50 bg-white'
                          }`}
                          onClick={() => {
                            window.location.href = `/form-builder/${form.id}`;
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {isAdmin ? 'Consulter' : 'Éditer'}
                        </Button>
                        
                        {!isAdmin && (
                          <>
                            <Button
                              variant="outline"
                              className="w-full border-green-300 text-green-700 hover:bg-green-50 bg-white"
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(form, null, 2));
                                toast({
                                  title: "Form copied",
                                  description: "Form JSON has been copied to clipboard",
                                });
                              }}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy JSON
                            </Button>
                            
                            <Button
                              variant="outline"
                              className="w-full border-red-300 text-red-700 hover:bg-red-50 bg-white"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this form?')) {
                                  deleteFormMutation.mutate(form.id);
                                }
                              }}
                              disabled={deleteFormMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </>
                        )}
                        
                        {isAdmin && (
                          <Button
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                            onClick={() => {
                              setSelectedFormForAssign(form);
                              setShowAssignDialog(true);
                            }}
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Assign
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {isAdmin ? 'Aucun formulaire disponible' : 'Aucun formulaire encore'}
              </h3>
              <p className="text-slate-600 mb-6">
                {isAdmin ? 'Aucun formulaire créé par les utilisateurs' : 'Créez votre premier formulaire pour commencer'}
              </p>
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

      {/* Floating Stats Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <Button
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setShowStats(!showStats)}
          >
            <BarChart3 className="w-6 h-6 text-white" />
          </Button>
          
          {showStats && (
            <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Statistiques</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStats(false)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 col-span-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Forms</p>
                      <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{forms.length}</p>
                    </div>
                    <FileText className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                

                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 col-span-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Ce Mois</p>
                      <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                        {forms.filter(form => {
                          const created = new Date(form.createdAt || "");
                          const now = new Date();
                          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                        }).length}
                      </p>
                    </div>
                    <Calendar className="h-4 w-4 text-purple-500" />
                  </div>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 col-span-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Recent</p>
                      <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                        {forms.filter(form => {
                          const updated = new Date(form.updatedAt || "");
                          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                          return updated > dayAgo;
                        }).length}
                      </p>
                    </div>
                    <User className="h-4 w-4 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Assign Form Dialog */}
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Assign Program
              </DialogTitle>
              <DialogDescription>
                Assign "{selectedFormForAssign?.label}" to a user
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">User</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {allUsers.filter((u: any) => u.role === 'user').map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName} (${user.email})`
                          : user.email
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Permissions</label>
                <Select value={selectedPermission} onValueChange={setSelectedPermission}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read-only">Read only</SelectItem>
                    <SelectItem value="read-write">Read and edit</SelectItem>
                    <SelectItem value="admin">Full administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Comment (optional)</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Add a comment about this assignment..."
                  rows={3}
                  value={assignmentComment}
                  onChange={(e) => setAssignmentComment(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAssignDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!selectedUser) {
                      toast({
                        title: "Error",
                        description: "Please select a user.",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    console.log('Assigning form:', {
                      formId: selectedFormForAssign?.id,
                      userId: selectedUser,
                      permission: selectedPermission,
                      comment: assignmentComment,
                    });
                    
                    assignFormMutation.mutate({
                      formId: selectedFormForAssign?.id,
                      userId: selectedUser,
                      permission: selectedPermission,
                      comment: assignmentComment,
                    });
                  }}
                  disabled={assignFormMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {assignFormMutation.isPending ? 'Assigning...' : 'Assign'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
