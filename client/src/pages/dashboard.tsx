import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import JSONValidatorDialog from "@/components/form-builder/json-validator-dialog";
import { Plus, Search, FileText, Calendar, User, FileCheck, Settings, Database, Menu, ArrowRightLeft, Upload, FileX, HelpCircle, Eye, Users, Edit3, Copy, Trash2, BarChart3, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { Form } from "@shared/schema";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedFormType, setSelectedFormType] = useState("PROCESS");
  const [showNewFormDialog, setShowNewFormDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importedFormData, setImportedFormData] = useState<any>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedFormForAssign, setSelectedFormForAssign] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("view");
  const [assignmentComment, setAssignmentComment] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Fetch forms
  const { data: forms = [], isLoading: formsLoading } = useQuery({
    queryKey: ["/api/forms"],
  });

  // Fetch all users for admin assignment
  const { data: allUsers = [] } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: isAdmin,
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Create new form mutation
  const createFormMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await fetch('/api/forms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to create form');
      return response.json();
    },
    onSuccess: (newForm) => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      setShowNewFormDialog(false);
      toast({
        title: "Success",
        description: "Form created successfully",
      });
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

  // Assignment mutation
  const assignFormMutation = useMutation({
    mutationFn: async ({ formId, userId, permission, comment }: any) => {
      const response = await apiRequest('/api/forms/assign', {
        method: 'POST',
        body: JSON.stringify({
          formId,
          userId,
          permission,
          comment
        })
      });
      if (!response.ok) throw new Error('Failed to assign form');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      setShowAssignDialog(false);
      setSelectedFormForAssign(null);
      setSelectedUser("");
      setSelectedPermission("view");
      setAssignmentComment("");
      toast({
        title: "Success",
        description: "Form assigned successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to assign form",
        variant: "destructive",
      });
    },
  });

  const deleteFormMutation = useMutation({
    mutationFn: async (formId: number) => {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete form');
      return response.json();
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
              description: "JSON file must contain a 'fields' array",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Invalid JSON file",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCreateForm = () => {
    const menuId = `FORM_${Date.now()}`;
    const formDefinition = {
      menuId,
      label: `New ${selectedFormType} Form`,
      formWidth: "700px",
      layout: selectedFormType,
      fields: []
    };
    
    const formData = {
      menuId,
      label: `New ${selectedFormType} Form`,
      formWidth: "700px",
      layout: selectedFormType,
      formDefinition: JSON.stringify(formDefinition),
    };
    
    createFormMutation.mutate(formData);
  };

  const handleImportForm = () => {
    if (importedFormData) {
      const menuId = `IMPORTED_${Date.now()}`;
      const formDefinition = {
        ...importedFormData,
        menuId,
        label: importedFormData.label || `Imported Form`,
      };
      
      const formData = {
        menuId,
        label: importedFormData.label || `Imported Form`,
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

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         form.menuId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === "all" || 
                         (filterType === "recent" && (() => {
                           const updated = new Date(form.updatedAt || "");
                           const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                           return updated > weekAgo;
                         })()) ||
                         (filterType === "process" && form.layout === "PROCESS") ||
                         (filterType === "form" && form.layout === "FORM") ||
                         (filterType === "assigned" && isAdmin && form.assignedTo);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-end mb-8">
          <div className="flex gap-3">
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
                    Import Program
                  </span>
                </Button>
              </label>
            )}
            {!isAdmin && <JSONValidatorDialog />}
          </div>
        </div>

        {/* Data Icons centered */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[120px]">
              <div className="flex flex-col items-center text-center">
                <FileText className="h-6 w-6 text-blue-600 mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Programs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{forms.length}</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[120px]">
              <div className="flex flex-col items-center text-center">
                <Users className="h-6 w-6 text-green-600 mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Array.isArray(allUsers) ? allUsers.length : 0}</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[120px]">
              <div className="flex flex-col items-center text-center">
                <Clock className="h-6 w-6 text-orange-600 mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {forms.filter(form => {
                    const updated = new Date(form.updatedAt || "");
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return updated > weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Magical 3D Search Bar */}
        <div className="relative mb-8">
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 p-6 transform hover:scale-[1.02] transition-all duration-300">
            {/* Floating particles effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-bounce"></div>
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full opacity-40 animate-ping"></div>
              <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-50 animate-pulse"></div>
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative flex-1">
                {/* Glowing search icon */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
                  <div className="relative">
                    <Search className="h-5 w-5 text-purple-500 drop-shadow-sm" />
                    <div className="absolute inset-0 h-5 w-5 bg-purple-400 rounded-full blur-sm opacity-30 animate-pulse"></div>
                  </div>
                </div>
                
                {/* 3D Search Input */}
                <input
                  type="text"
                  placeholder="✨ Search programs with magic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 text-lg font-medium bg-gradient-to-r from-white to-purple-50 border-2 border-transparent rounded-xl 
                           focus:border-gradient-to-r focus:from-purple-400 focus:to-pink-400 
                           focus:bg-white focus:shadow-xl focus:shadow-purple-200/50
                           outline-none transition-all duration-300 transform
                           hover:shadow-lg hover:shadow-purple-100/30
                           placeholder:text-purple-300 placeholder:font-normal
                           backdrop-blur-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(243,232,255,0.6) 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 8px 32px rgba(147,51,234,0.1)'
                  }}
                />
                
                {/* Magic sparkle trail */}
                {searchQuery && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
                      <div className="w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                )}
              </div>
            
              {/* 3D Filter Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Filter:
                </span>
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 outline-none 
                             bg-gradient-to-r from-white to-purple-50 text-sm min-w-[150px] font-medium
                             hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300
                             cursor-pointer transform hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(243,232,255,0.7) 100%)',
                      boxShadow: '0 4px 15px rgba(147,51,234,0.1)'
                    }}
                  >
                    <option value="all">✨ All Programs</option>
                    <option value="recent">🕒 Recent (7 days)</option>
                    <option value="process">⚙️ Process Type</option>
                    <option value="form">📋 Form Type</option>
                    {isAdmin && <option value="assigned">👥 Assigned</option>}
                  </select>
                  
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-sm -z-10"></div>
                </div>
              </div>
            
              {/* Magic Clear Button */}
              {(searchQuery || filterType !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterType("all");
                  }}
                  className="relative px-4 py-3 text-sm font-semibold text-white 
                           bg-gradient-to-r from-red-400 to-pink-500 rounded-xl
                           hover:from-red-500 hover:to-pink-600 
                           transform hover:scale-110 transition-all duration-300
                           shadow-lg hover:shadow-xl hover:shadow-pink-200/50
                           active:scale-95"
                >
                  <span className="relative z-10">🗑️ Clear</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-300 to-pink-300 opacity-30 blur-sm"></div>
                </button>
              )}
            </div>
          
            {/* Magic Results Counter */}
            {filteredForms.length !== forms.length && (
              <div className="mt-4 pt-4 border-t border-gradient-to-r from-purple-200 to-pink-200">
                <div className="text-center">
                  <p className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ✨ Showing {filteredForms.length} of {forms.length} magical programs
                    {searchQuery && <span className="block mt-1 text-xs">🔍 Matching "{searchQuery}"</span>}
                    {filterType !== "all" && <span className="block mt-1 text-xs">📂 Filter: {filterType}</span>}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create New Form Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isAdmin ? 'All Programs' : 'My Programs'}
              </h2>
              <p className="text-slate-600">
                {isAdmin ? 'View and assign programs' : 'Create and manage your custom programs'}
              </p>
            </div>
            <Dialog open={showNewFormDialog} onOpenChange={(open) => {
              setShowNewFormDialog(open);
              if (open) {
                setSelectedFormType("PROCESS");
              }
            }}>
              {isAdmin && (
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-100 text-red-700 px-3 py-1">
                    Admin Mode
                  </Badge>
                  <Button variant="outline" disabled>
                    <Eye className="w-4 h-4 mr-2" />
                    View Only
                  </Button>
                </div>
              )}
            </Dialog>
          </div>

          {/* Forms Grid */}
          {filteredForms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForms.map((form: any) => (
                <div key={form.id} className="flip-card">
                  <div className="flip-card-inner">
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
                              Created by: {(() => {
                                const creator = allUsers.find((user: any) => user.id === form.createdBy);
                                if (creator) {
                                  return creator.firstName && creator.lastName 
                                    ? `${creator.firstName} ${creator.lastName}` 
                                    : creator.email;
                                }
                                return form.createdBy;
                              })()}
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
                          {isAdmin ? 'View' : 'Edit'}
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
                No programs found
              </h3>
              <p className="text-slate-600 mb-6">
                {searchQuery || filterType !== "all" ? "No programs match your search criteria." : "No programs found."} <Link href="/form-builder" className="text-blue-600 hover:underline">Create your first program</Link>
              </p>
            </div>
          )}
        </div>

        {/* Import Dialog */}
        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent className="sm:max-w-[700px]">
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
                  <h4 className="font-medium mb-3">Program Preview</h4>
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

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowImportDialog(false)}>
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
                        Import & Edit Program
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Assignment Dialog */}
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Assign Form to User</DialogTitle>
              <DialogDescription>
                Select a user and permission level for this form assignment.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">User</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select a user...</option>
                  {allUsers.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Permission Level</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedPermission}
                  onChange={(e) => setSelectedPermission(e.target.value)}
                >
                  <option value="view">View Only</option>
                  <option value="edit">Edit Access</option>
                  <option value="admin">Full Admin</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Assignment Comment (Optional)</label>
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
                        description: "Please select a user",
                        variant: "destructive",
                      });
                      return;
                    }
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