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
  Package, 
  Plus, 
  Upload, 
  Download, 
  FileText, 
  Code,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Save,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import PropertyManager, { ComponentProperty } from '@/components/property-manager';

interface ExternalComponent {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  icon: string;
  properties: any;
  config: any;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

interface ComponentFormData {
  name: string;
  type: string;
  category: string;
  description: string;
  icon: string;
  properties: string;
  config: string;
}

export default function ComponentLibrary() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importMethod, setImportMethod] = useState<'json' | 'form'>('json');
  const [selectedComponent, setSelectedComponent] = useState<ExternalComponent | null>(null);
  const [formData, setFormData] = useState<ComponentFormData>({
    name: '',
    type: '',
    category: 'Custom',
    description: '',
    icon: 'Package',
    properties: '{}',
    config: '{}'
  });
  const [jsonInput, setJsonInput] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [parsedProperties, setParsedProperties] = useState<ComponentProperty[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for external components
  const { data: components = [], isLoading } = useQuery<ExternalComponent[]>({
    queryKey: ['/api/external-components'],
  });

  // Create component mutation
  const createComponentMutation = useMutation({
    mutationFn: async (componentData: any) => {
      return await apiRequest('/api/external-components', {
        method: 'POST',
        body: JSON.stringify(componentData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/external-components'] });
      setIsCreateDialogOpen(false);
      setIsImportDialogOpen(false);
      resetForm();
      toast({
        title: "Composant créé",
        description: "Le composant externe a été ajouté à la palette",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Échec de la création du composant",
        variant: "destructive",
      });
    },
  });

  // Delete component mutation
  const deleteComponentMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/external-components/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/external-components'] });
      toast({
        title: "Composant supprimé",
        description: "Le composant a été retiré de la palette",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      category: 'Custom',
      description: '',
      icon: 'Package',
      properties: '{}',
      config: '{}'
    });
    setJsonInput('');
    setCurrentStep(1);
  };

  const handleFormSubmit = () => {
    try {
      const properties = JSON.parse(formData.properties);
      const config = JSON.parse(formData.config);
      
      createComponentMutation.mutate({
        ...formData,
        properties,
        config,
      });
    } catch (e) {
      toast({
        title: "Erreur JSON",
        description: "Vérifiez la syntaxe des propriétés et configuration",
        variant: "destructive",
      });
    }
  };

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.name || !parsed.type) {
        throw new Error('Format invalide');
      }
      createComponentMutation.mutate(parsed);
    } catch (e) {
      toast({
        title: "JSON invalide",
        description: "Vérifiez le format du JSON",
        variant: "destructive",
      });
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            // Import multiple components
            parsed.forEach(comp => createComponentMutation.mutate(comp));
          } else {
            // Single component
            createComponentMutation.mutate(parsed);
          }
        } catch (error) {
          toast({
            title: "Erreur d'import",
            description: "Format de fichier invalide",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const exportComponent = (component: ExternalComponent) => {
    const blob = new Blob([JSON.stringify(component, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${component.name.toLowerCase().replace(/\s+/g, '-')}-component.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAllComponents = () => {
    const blob = new Blob([JSON.stringify(components, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'external-components-library.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const categories = ['Custom', 'Layout', 'Input', 'Display', 'Navigation', 'Data', 'Media'];
  const iconOptions = ['Package', 'Code', 'FileText', 'Plus', 'Edit', 'Save'];

  const StepIndicator = ({ step, currentStep }: { step: number; currentStep: number }) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
      step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
    }`}>
      {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bibliothèque de Composants</h1>
            <p className="text-gray-600 dark:text-gray-400">Gérez vos composants externes personnalisés</p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={() => fileInputRef.current?.click()}>
              <ArrowUp className="w-4 h-4 mr-2" />
              Importer Fichier
            </Button>
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Importer JSON
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Importer un Composant</DialogTitle>
                </DialogHeader>
                <Tabs value={importMethod} onValueChange={(v) => setImportMethod(v as 'json' | 'form')}>
                  <TabsList>
                    <TabsTrigger value="json">JSON Direct</TabsTrigger>
                    <TabsTrigger value="form">Formulaire Guidé</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="json" className="space-y-4">
                    <Label>Coller le JSON du composant</Label>
                    <Textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      rows={10}
                      placeholder='{"name": "MonComposant", "type": "CUSTOM", ...}'
                      className="font-mono"
                    />
                    <Button onClick={handleJsonImport} disabled={!jsonInput.trim()}>
                      Valider et Importer
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="form" className="space-y-6">
                    {/* Step Indicator */}
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <StepIndicator step={1} currentStep={currentStep} />
                      <div className="w-8 h-1 bg-gray-200"></div>
                      <StepIndicator step={2} currentStep={currentStep} />
                      <div className="w-8 h-1 bg-gray-200"></div>
                      <StepIndicator step={3} currentStep={currentStep} />
                    </div>
                    
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Informations de base</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Nom du composant</Label>
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              placeholder="Mon Composant Personnalisé"
                            />
                          </div>
                          <div>
                            <Label>Type</Label>
                            <Input
                              value={formData.type}
                              onChange={(e) => setFormData({...formData, type: e.target.value})}
                              placeholder="CUSTOM_INPUT"
                            />
                          </div>
                          <div>
                            <Label>Catégorie</Label>
                            <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Icône</Label>
                            <Select value={formData.icon} onValueChange={(v) => setFormData({...formData, icon: v})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {iconOptions.map(icon => (
                                  <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Description du composant..."
                          />
                        </div>
                        <Button onClick={() => setCurrentStep(2)} disabled={!formData.name || !formData.type}>
                          Suivant
                        </Button>
                      </div>
                    )}
                    
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Propriétés du composant</h3>
                        <PropertyManager
                          properties={parsedProperties}
                          onChange={(props) => {
                            setParsedProperties(props);
                            const propertiesObject = props.reduce((acc, prop) => {
                              acc[prop.name] = prop.defaultValue;
                              return acc;
                            }, {} as Record<string, any>);
                            setFormData({...formData, properties: JSON.stringify(propertiesObject, null, 2)});
                          }}
                        />
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setCurrentStep(1)}>
                            Précédent
                          </Button>
                          <Button onClick={() => setCurrentStep(3)}>
                            Suivant
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Configuration avancée</h3>
                        <div>
                          <Label>Configuration (JSON)</Label>
                          <Textarea
                            value={formData.config}
                            onChange={(e) => setFormData({...formData, config: e.target.value})}
                            rows={6}
                            placeholder='{"validation": {"type": "string", "minLength": 1}, "events": ["onChange", "onBlur"]}'
                            className="font-mono"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setCurrentStep(2)}>
                            Précédent
                          </Button>
                          <Button onClick={handleFormSubmit} disabled={createComponentMutation.isPending}>
                            Créer le Composant
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            
            <Button onClick={exportAllComponents} disabled={components.length === 0}>
              <ArrowDown className="w-4 h-4 mr-2" />
              Exporter Tout
            </Button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileImport}
          className="hidden"
        />

        {/* Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((component: ExternalComponent) => (
            <Card key={component.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{component.name}</CardTitle>
                      <Badge variant="secondary">{component.category}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => exportComponent(component)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteComponentMutation.mutate(component.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {component.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Type:</span>
                    <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{component.type}</code>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Créé par:</span>
                    <span>{component.createdBy}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Date:</span>
                    <span>{new Date(component.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {components.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun composant externe
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Commencez par importer ou créer votre premier composant personnalisé
            </p>
            <Button onClick={() => setIsImportDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un Composant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}