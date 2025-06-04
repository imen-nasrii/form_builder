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
import { Plus, Search, FileText, Calendar, User, FileCheck, Settings, Database, Menu, ArrowRightLeft } from "lucide-react";
import type { Form, FormTemplate } from "@shared/schema";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormType, setSelectedFormType] = useState("PROCESS");
  const [showNewFormDialog, setShowNewFormDialog] = useState(false);
  const [formConfig, setFormConfig] = useState({
    menuId: `ACCADJ`,
    label: "Étiquette du formulaire",
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
            <Dialog open={showNewFormDialog} onOpenChange={setShowNewFormDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un formulaire
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau formulaire</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  {/* Form Configuration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ID du menu <span className="text-red-500">*</span></label>
                      <Input
                        value={formConfig.menuId}
                        onChange={(e) => setFormConfig(prev => ({ ...prev, menuId: e.target.value }))}
                        placeholder="ACCADJ"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Étiquette <span className="text-red-500">*</span></label>
                      <Input
                        value={formConfig.label}
                        onChange={(e) => setFormConfig(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Étiquette du formulaire"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Largeur</label>
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
                      <label className="text-sm font-medium">Mise en page</label>
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
                      Annuler
                    </Button>
                    <Button
                      onClick={() => createFormMutation.mutate()}
                      disabled={createFormMutation.isPending || !formConfig.menuId || !formConfig.label}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createFormMutation.isPending ? 'Création...' : 'Créer le formulaire'}
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


      </div>
    </div>
  );
}
