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

  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Main Content - JSON Tool to Line Data */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">JSON Tool to Line Data</h1>
          <p className="text-slate-600 text-lg mb-8">
            Convertissez facilement vos données JSON en format de ligne
          </p>
          
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Outil de Conversion JSON</CardTitle>
                <CardDescription className="text-center">
                  Transformez vos structures JSON complexes en données linéaires
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <JSONValidatorDialog />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
