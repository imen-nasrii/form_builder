import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import NewFormDialog from "@/components/form-builder/new-form-dialog";
import JSONValidatorDialog from "@/components/form-builder/json-validator-dialog";
import { Plus, Search, FileText, Calendar, User, FileCheck } from "lucide-react";
import type { Form, FormTemplate } from "@shared/schema";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
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
      await apiRequest("DELETE", `/api/forms/${formId}`);
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

  const filteredForms = forms.filter(form =>
    form.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.menuId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string | null) => {
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
            <NewFormDialog 
              onCreateForm={(config) => {
                // Navigate to form builder with the new form config
                window.location.href = `/form-builder?menuId=${config.menuId}&label=${config.label}&width=${config.formWidth}&layout=${config.layout}`;
              }}
            />
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

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{form.label}</CardTitle>
                  <Badge variant="outline">{form.layout}</Badge>
                </div>
                <CardDescription>Menu ID: {form.menuId}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Fields:</span>
                    <span className="font-medium">
                      {Array.isArray(form.fields) ? form.fields.length : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Width:</span>
                    <span className="font-medium">{form.formWidth}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Updated:</span>
                    <span className="font-medium">{formatDate(form.updatedAt)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-4">
                    <Link href={`/form-builder/${form.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Edit
                      </Button>
                    </Link>
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

        {filteredForms.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No forms found</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first form"}
            </p>
            <Link href="/form-builder">
              <Button className="enterprise-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Form
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
