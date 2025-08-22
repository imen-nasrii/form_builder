import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Package, 
  Code, 
  Globe,
  FileUp,
  Link2,
  Zap,
  CheckCircle
} from "lucide-react";
import type { FormField } from "@/lib/form-types";

interface ComponentImportPanelProps {
  onImportComponent: (component: FormField) => void;
}

export default function ComponentImportPanel({ onImportComponent }: ComponentImportPanelProps) {
  const { toast } = useToast();
  const [jsonInput, setJsonInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [importedComponents, setImportedComponents] = useState<FormField[]>([]);

  // Method 1: JSON Import
  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      
      if (Array.isArray(parsed)) {
        // Multiple components
        parsed.forEach((comp, index) => {
          const component: FormField = {
            Id: `imported_${Date.now()}_${index}`,
            label: comp.label || `Imported Component ${index + 1}`,
            type: comp.type || 'SELECT',
            ...comp
          };
          onImportComponent(component);
          setImportedComponents(prev => [...prev, component]);
        });
        
        toast({
          title: `${parsed.length} Components Imported! ✅`,
          description: "All components are now available in your palette"
        });
      } else {
        // Single component
        const component: FormField = {
          Id: `imported_${Date.now()}`,
          label: parsed.label || 'Imported Component',
          type: parsed.type || 'SELECT',
          ...parsed
        };
        onImportComponent(component);
        setImportedComponents(prev => [...prev, component]);
        
        toast({
          title: "Component Imported! ✅",
          description: "Component is now available in your palette"
        });
      }
      
      setJsonInput('');
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON format",
        variant: "destructive"
      });
    }
  };

  // Method 2: URL Import
  const handleUrlImport = async () => {
    if (!urlInput) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/import-component-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: urlInput })
      });

      const result = await response.json();
      
      if (result.success && result.components) {
        result.components.forEach((comp: any, index: number) => {
          const component: FormField = {
            Id: `url_imported_${Date.now()}_${index}`,
            label: comp.label || `URL Component ${index + 1}`,
            type: comp.type || 'SELECT',
            ...comp
          };
          onImportComponent(component);
          setImportedComponents(prev => [...prev, component]);
        });
        
        toast({
          title: `${result.components.length} Components Imported from URL! 🌐`,
          description: "Components are now available in your palette"
        });
        
        setUrlInput('');
      } else {
        toast({
          title: "Import Failed",
          description: result.error || "Could not import from URL",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Could not fetch from URL",
        variant: "destructive"
      });
    }
  };

  // Method 3: File Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
        
        try {
          const parsed = JSON.parse(content);
          const components = Array.isArray(parsed) ? parsed : [parsed];
          
          components.forEach((comp: any, index: number) => {
            const component: FormField = {
              Id: `file_imported_${Date.now()}_${index}`,
              label: comp.label || `File Component ${index + 1}`,
              type: comp.type || 'SELECT',
              ...comp
            };
            onImportComponent(component);
            setImportedComponents(prev => [...prev, component]);
          });
          
          toast({
            title: `${components.length} Components Imported from File! 📁`,
            description: "Components are now available in your palette"
          });
          
        } catch (error) {
          toast({
            title: "Invalid File Format",
            description: "Please upload a valid JSON file",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  // Pre-made component templates
  const componentTemplates = [
    {
      name: "User Selector",
      description: "Select user from API",
      json: {
        type: "LSTLKP",
        label: "Select User",
        required: true,
        LoadDataInfo: {
          DataModel: "Users",
          APIEndpoint: "https://jsonplaceholder.typicode.com/users"
        },
        KeyColumn: "id",
        ItemInfo: {
          MainProperty: "name",
          DescProperty: "email",
          ShowDescription: true
        }
      }
    },
    {
      name: "Country Picker",
      description: "Select country with flag",
      json: {
        type: "SELECT",
        label: "Country",
        required: false,
        LoadDataInfo: {
          DataModel: "Countries",
          APIEndpoint: "https://restcountries.com/v3.1/all"
        },
        KeyColumn: "cca2",
        ItemInfo: {
          MainProperty: "name.common",
          DescProperty: "region",
          ShowDescription: true
        }
      }
    },
    {
      name: "Dynamic Grid",
      description: "Data table with API source",
      json: {
        type: "GRIDLKP",
        label: "Data Grid",
        required: false,
        LoadDataInfo: {
          DataModel: "Posts",
          APIEndpoint: "https://jsonplaceholder.typicode.com/posts",
          ColumnsDefinition: [
            { DataField: "id", Caption: "ID", DataType: "INTEGER", Visible: false },
            { DataField: "title", Caption: "Title", DataType: "STRING", Visible: true },
            { DataField: "body", Caption: "Content", DataType: "STRING", Visible: true }
          ]
        }
      }
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
            <Package className="w-3 h-3 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-white">Import Components</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">3 ways to add external components</p>
      </div>

      <Tabs defaultValue="json" className="flex-1">
        <TabsList className="w-full bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-1 rounded-none">
          <TabsTrigger value="json" className="flex-1">
            <Code className="w-3 h-3 mr-1 text-green-500" />
            JSON
          </TabsTrigger>
          <TabsTrigger value="url" className="flex-1">
            <Globe className="w-3 h-3 mr-1 text-blue-500" />
            URL
          </TabsTrigger>
          <TabsTrigger value="file" className="flex-1">
            <FileUp className="w-3 h-3 mr-1 text-orange-500" />
            File
          </TabsTrigger>
        </TabsList>

        {/* Method 1: JSON Import */}
        <TabsContent value="json" className="flex-1 p-4 m-0">
          <div className="space-y-4">
            <div>
              <Label className="text-black dark:text-white">Paste JSON Component Definition</Label>
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={`{
  "type": "SELECT",
  "label": "My Component",
  "required": true,
  "OptionValues": {
    "option1": "Option 1",
    "option2": "Option 2"
  }
}`}
                className="mt-1 h-32 font-mono text-sm"
              />
            </div>
            
            <Button onClick={handleJsonImport} className="w-full">
              <Code className="w-4 h-4 mr-2 text-green-500" />
              Import from JSON
            </Button>

            {/* Quick Templates */}
            <div>
              <Label className="text-black dark:text-white mb-2 block">Quick Templates</Label>
              <div className="space-y-2">
                {componentTemplates.map((template, index) => (
                  <Card key={index} className="border-gray-200 dark:border-gray-700">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-black dark:text-white">{template.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{template.description}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setJsonInput(JSON.stringify(template.json, null, 2));
                          }}
                        >
                          <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Method 2: URL Import */}
        <TabsContent value="url" className="flex-1 p-4 m-0">
          <div className="space-y-4">
            <div>
              <Label className="text-black dark:text-white">Component Library URL</Label>
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://api.example.com/components.json"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                URL should return JSON array of component definitions
              </p>
            </div>
            
            <Button onClick={handleUrlImport} className="w-full">
              <Globe className="w-4 h-4 mr-2 text-blue-500" />
              Import from URL
            </Button>

            {/* Popular Component Libraries */}
            <div>
              <Label className="text-black dark:text-white mb-2 block">Popular Libraries</Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setUrlInput('https://raw.githubusercontent.com/formbuilder/components/main/basic.json')}
                >
                  <Package className="w-4 h-4 mr-2 text-purple-500" />
                  FormBuilder Basic Components
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setUrlInput('https://api.formio.com/components/advanced')}
                >
                  <Package className="w-4 h-4 mr-2 text-blue-500" />
                  Form.io Advanced Components
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Method 3: File Upload */}
        <TabsContent value="file" className="flex-1 p-4 m-0">
          <div className="space-y-4">
            <div>
              <Label className="text-black dark:text-white">Upload Component File</Label>
              <div className="mt-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <FileUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Drop JSON file here or click to browse
                </p>
                <input
                  type="file"
                  accept=".json,.txt"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {fileContent && (
              <div>
                <Label className="text-black dark:text-white mb-2 block">File Preview</Label>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-32 overflow-auto">
                  <pre className="text-xs text-gray-700 dark:text-gray-300">
                    {fileContent.slice(0, 500)}...
                  </pre>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Imported Components Summary */}
      {importedComponents.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-black dark:text-white">
              {importedComponents.length} Components Imported
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {importedComponents.slice(-5).map((comp, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded text-xs"
              >
                {comp.label}
              </span>
            ))}
            {importedComponents.length > 5 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                +{importedComponents.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}