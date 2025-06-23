import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Upload, 
  FileText, 
  Package,
  CheckCircle,
  AlertCircle,
  Archive,
  FolderOpen,
  ArrowUpFromLine,
  ArrowDownToLine,
  Database,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ExportOptions {
  includeValidations: boolean;
  includeTemplates: boolean;
  includeUserData: boolean;
  format: 'json' | 'csv' | 'xml';
  compression: boolean;
}

interface ImportSummary {
  totalPrograms: number;
  importedPrograms: number;
  skippedPrograms: number;
  errors: string[];
}

export default function ImportExport() {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeValidations: true,
    includeTemplates: true,
    includeUserData: false,
    format: 'json',
    compression: false
  });
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for programs/forms
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['/api/forms'],
  });

  // Export programs mutation
  const exportMutation = useMutation({
    mutationFn: async (options: { programIds: string[], exportOptions: ExportOptions }) => {
      return await apiRequest('/api/export/programs', {
        method: 'POST',
        body: JSON.stringify(options),
      });
    },
    onSuccess: (data) => {
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `programs-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: `${selectedPrograms.length} programmes exportés`,
      });
      setIsExporting(false);
    },
    onError: () => {
      toast({
        title: "Erreur d'export",
        description: "Échec de l'exportation des programmes",
        variant: "destructive",
      });
      setIsExporting(false);
    },
  });

  // Import programs mutation
  const importMutation = useMutation({
    mutationFn: async (importData: any) => {
      return await apiRequest('/api/import/programs', {
        method: 'POST',
        body: JSON.stringify(importData),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
      setImportSummary(data);
      setIsImporting(false);
      toast({
        title: "Import réussi",
        description: `${data.importedPrograms} programmes importés`,
      });
    },
    onError: () => {
      toast({
        title: "Erreur d'import",
        description: "Échec de l'importation des programmes",
        variant: "destructive",
      });
      setIsImporting(false);
    },
  });

  const handleExport = () => {
    if (selectedPrograms.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Sélectionnez au moins un programme à exporter",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    exportMutation.mutate({
      programIds: selectedPrograms,
      exportOptions
    });
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);
        importMutation.mutate(importData);
      } catch (error) {
        toast({
          title: "Fichier invalide",
          description: "Le fichier n'est pas un JSON valide",
          variant: "destructive",
        });
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  const handleSelectAll = () => {
    if (selectedPrograms.length === programs.length) {
      setSelectedPrograms([]);
    } else {
      setSelectedPrograms(programs.map((p: any) => p.id.toString()));
    }
  };

  const handleProgramToggle = (programId: string) => {
    setSelectedPrograms(prev => 
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const exportAllPrograms = () => {
    setSelectedPrograms(programs.map((p: any) => p.id.toString()));
    setTimeout(() => handleExport(), 100);
  };

  const exportTemplates = async () => {
    try {
      const response = await apiRequest('/api/export/templates', {
        method: 'GET',
      });
      
      const blob = new Blob([JSON.stringify(response, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `templates-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Templates exportés",
        description: "Tous les templates ont été exportés",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'export des templates",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Import/Export de Programmes</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez l'import et l'export de vos programmes et templates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Export Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Export className="w-5 h-5" />
                Exporter des Programmes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Export Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={exportAllPrograms} className="w-full">
                  <Archive className="w-4 h-4 mr-2" />
                  Tout Exporter
                </Button>
                <Button onClick={exportTemplates} variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Templates
                </Button>
              </div>

              {/* Export Options */}
              <div className="space-y-4">
                <h3 className="font-medium">Options d'export</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Inclure les validations</Label>
                    <input
                      type="checkbox"
                      checked={exportOptions.includeValidations}
                      onChange={(e) => setExportOptions({
                        ...exportOptions,
                        includeValidations: e.target.checked
                      })}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Inclure les templates</Label>
                    <input
                      type="checkbox"
                      checked={exportOptions.includeTemplates}
                      onChange={(e) => setExportOptions({
                        ...exportOptions,
                        includeTemplates: e.target.checked
                      })}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Inclure données utilisateur</Label>
                    <input
                      type="checkbox"
                      checked={exportOptions.includeUserData}
                      onChange={(e) => setExportOptions({
                        ...exportOptions,
                        includeUserData: e.target.checked
                      })}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Format</Label>
                    <Select 
                      value={exportOptions.format} 
                      onValueChange={(v) => setExportOptions({
                        ...exportOptions,
                        format: v as 'json' | 'csv' | 'xml'
                      })}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Program Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Sélection des programmes</h3>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedPrograms.length === programs.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                  </Button>
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3">
                  {programs.map((program: any) => (
                    <div key={program.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                      <input
                        type="checkbox"
                        checked={selectedPrograms.includes(program.id.toString())}
                        onChange={() => handleProgramToggle(program.id.toString())}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{program.label}</div>
                        <div className="text-sm text-gray-500">{program.menuId}</div>
                      </div>
                      <Badge variant="secondary">{program.fields?.length || 0} champs</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleExport} 
                disabled={selectedPrograms.length === 0 || isExporting}
                className="w-full"
              >
                {isExporting ? 'Export en cours...' : `Exporter (${selectedPrograms.length})`}
              </Button>
            </CardContent>
          </Card>

          {/* Import Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Import className="w-5 h-5" />
                Importer des Programmes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Import Methods */}
              <div className="space-y-4">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="w-full"
                >
                  <ArrowUpFromLine className="w-4 h-4 mr-2" />
                  {isImporting ? 'Import en cours...' : 'Sélectionner un fichier'}
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </div>

              {/* Import Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Instructions d'import
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Fichiers JSON uniquement</li>
                  <li>• Format d'export FormBuilder requis</li>
                  <li>• Les programmes existants seront mis à jour</li>
                  <li>• Les nouveaux programmes seront créés</li>
                </ul>
              </div>

              {/* Import Summary */}
              {importSummary && (
                <div className="space-y-4">
                  <h4 className="font-medium">Résumé de l'import</h4>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total programmes:</span>
                        <span className="font-medium">{importSummary.totalPrograms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Importés avec succès:</span>
                        <span className="font-medium text-green-600">{importSummary.importedPrograms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ignorés:</span>
                        <span className="font-medium text-yellow-600">{importSummary.skippedPrograms}</span>
                      </div>
                    </div>
                    
                    {importSummary.errors.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium text-red-600 mb-2">Erreurs:</h5>
                        <ul className="text-sm text-red-600 space-y-1">
                          {importSummary.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Supported Formats */}
              <div className="space-y-3">
                <h4 className="font-medium">Formats supportés</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">JSON</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <Package className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Templates</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <Download className="w-4 h-4 text-green-500" />
                <div className="flex-1">
                  <div className="font-medium">Export de 5 programmes</div>
                  <div className="text-sm text-gray-500">Il y a 2 heures</div>
                </div>
                <Badge variant="secondary">Succès</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <Upload className="w-4 h-4 text-blue-500" />
                <div className="flex-1">
                  <div className="font-medium">Import de templates</div>
                  <div className="text-sm text-gray-500">Hier</div>
                </div>
                <Badge variant="secondary">Succès</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}