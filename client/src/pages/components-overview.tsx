import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  Clock, 
  Activity, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import Navigation from "@/components/navigation";

interface ComponentProgress {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'completed' | 'draft';
  creator: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  lastModified: string;
  progress: number;
  collaborators: string[];
}

export default function ComponentsOverview() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch real forms data
  const { data: forms = [], isLoading: formsLoading } = useQuery<any[]>({
    queryKey: ['/api/forms'],
  });

  // Fetch real templates data
  const { data: templates = [], isLoading: templatesLoading } = useQuery<any[]>({
    queryKey: ['/api/templates'],
  });

  // Get user profile safely
  const currentUser = user as any;

  // Convert forms and templates to component format
  const realComponents: ComponentProgress[] = [
    ...forms.map((form: any) => ({
      id: form.id,
      name: form.label || form.menuId,
      type: form.layout || "FORM",
      status: (form.fields?.length > 0 ? 'completed' : 'draft') as 'active' | 'completed' | 'draft',
      creator: {
        id: form.createdBy || currentUser?.id || '',
        name: currentUser?.firstName && currentUser?.lastName 
          ? `${currentUser.firstName} ${currentUser.lastName}` 
          : currentUser?.email?.split('@')[0] || 'Unknown User',
        avatar: currentUser?.profileImageUrl || '',
        role: currentUser?.role || 'Creator'
      },
      lastModified: form.updatedAt ? new Date(form.updatedAt).toLocaleDateString() : 'Recently',
      progress: form.fields?.length > 0 ? Math.min(100, form.fields.length * 20) : 10,
      collaborators: []
    })),
    ...templates.map((template: any) => ({
      id: template.id,
      name: template.name,
      type: "TEMPLATE",
      status: (template.config ? 'completed' : 'draft') as 'active' | 'completed' | 'draft',
      creator: {
        id: template.createdBy || currentUser?.id || '',
        name: currentUser?.firstName && currentUser?.lastName 
          ? `${currentUser.firstName} ${currentUser.lastName}` 
          : currentUser?.email?.split('@')[0] || 'Unknown User',
        avatar: currentUser?.profileImageUrl || '',
        role: currentUser?.role || 'Creator'
      },
      lastModified: template.updatedAt ? new Date(template.updatedAt).toLocaleDateString() : 'Recently',
      progress: template.config ? 100 : 50,
      collaborators: []
    }))
  ];

  const filteredComponents = realComponents.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.creator.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || comp.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Delete mutations
  const deleteFormMutation = useMutation({
    mutationFn: async (formId: string) => {
      return apiRequest(`/api/forms/${formId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
      toast({
        title: "Form Deleted",
        description: "The form has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      return apiRequest(`/api/templates/${templateId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({
        title: "Template Deleted",
        description: "The template has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (component: ComponentProgress) => {
    if (component.type === "TEMPLATE") {
      deleteTemplateMutation.mutate(component.id);
    } else {
      deleteFormMutation.mutate(component.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GRIDLKP': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'LSTLKP': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'DATEPICKER': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'SELECT': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            Components Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track the progress of all components created by your team
          </p>
        </div>



        {/* Filters */}
        <Card className="border-gray-200 dark:border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou créateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <Button 
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  Tous
                </Button>
                <Button 
                  variant={filterStatus === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("active")}
                >
                  Actifs
                </Button>
                <Button 
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("completed")}
                >
                  Terminés
                </Button>
                <Button 
                  variant={filterStatus === "draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("draft")}
                >
                  Brouillons
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components List */}
        <div className="grid gap-4">
          {filteredComponents.map((component) => (
            <Card key={component.id} className="border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Component Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-black dark:text-white">
                          {component.name}
                        </h3>
                        <Badge className={getTypeColor(component.type)}>
                          {component.type}
                        </Badge>
                        <Badge className={getStatusColor(component.status)}>
                          {component.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {component.creator.name[0]}
                          </div>
                          <span>{component.creator.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {component.creator.role}
                          </Badge>
                        </div>
                        
                        <span>•</span>
                        <span>{component.lastModified}</span>
                        
                        {component.collaborators.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{component.collaborators.length} collaborateur(s)</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Progrès</span>
                          <span className="font-medium text-black dark:text-white">{component.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${component.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (component.type === "TEMPLATE") {
                            window.open(`/templates/${component.id}`, '_blank');
                          } else {
                            window.open(`/form-builder/${component.id}`, '_blank');
                          }
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (component.type === "TEMPLATE") {
                            window.location.href = `/templates/${component.id}/edit`;
                          } else {
                            window.location.href = `/form-builder/${component.id}`;
                          }
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(component)}
                        disabled={deleteFormMutation.isPending || deleteTemplateMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                No components found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try modifying your search criteria or create a new component.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}