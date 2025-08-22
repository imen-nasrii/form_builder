import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, Settings, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComponentConfigManagerProps {
  onLoadComponents: (components: any[]) => void;
  customComponents: any[];
}

export default function ComponentConfigManager({ onLoadComponents, customComponents }: ComponentConfigManagerProps) {
  const [open, setOpen] = useState(false);
  const [jsonConfig, setJsonConfig] = useState("");
  const { toast } = useToast();

  const exampleConfig = `[
  {
    "type": "CUSTOMTEXT",
    "label": "Custom Text Field",
    "icon": "Type",
    "color": "text-green-500",
    "properties": {
      "DataField": "",
      "Placeholder": "Enter text...",
      "MaxLength": 100,
      "Required": false
    }
  },
  {
    "type": "RATING",
    "label": "Rating Component",
    "icon": "Star",
    "color": "text-yellow-500",
    "properties": {
      "MaxRating": 5,
      "AllowHalfRating": true,
      "Required": false
    }
  },
  {
    "type": "SIGNATURE",
    "label": "Digital Signature",
    "icon": "PenTool",
    "color": "text-purple-500",
    "properties": {
      "Width": "300px",
      "Height": "150px",
      "Required": true
    }
  }
]`;

  const handleLoadFromJson = () => {
    try {
      const components = JSON.parse(jsonConfig);
      if (Array.isArray(components)) {
        onLoadComponents(components);
        toast({
          title: "Composants chargés!",
          description: `${components.length} composants personnalisés ont été ajoutés.`,
        });
        setOpen(false);
        setJsonConfig("");
      } else {
        throw new Error("Le JSON doit être un tableau de composants");
      }
    } catch (error) {
      toast({
        title: "Erreur JSON",
        description: "Format JSON invalide. Vérifiez la syntaxe.",
        variant: "destructive",
      });
    }
  };

  const handleExportToJson = () => {
    const jsonData = JSON.stringify(customComponents, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-components.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi!",
      description: "Les composants ont été exportés en JSON.",
    });
  };

  const loadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const components = JSON.parse(content);
          if (Array.isArray(components)) {
            onLoadComponents(components);
            toast({
              title: "Fichier chargé!",
              description: `${components.length} composants ont été importés depuis le fichier.`,
            });
            setOpen(false);
          } else {
            throw new Error("Format de fichier invalide");
          }
        } catch (error) {
          toast({
            title: "Erreur de fichier",
            description: "Impossible de lire le fichier JSON.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Settings className="w-4 h-4 mr-2" />
          Manage Components (JSON)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Component Configuration Manager</DialogTitle>
          <DialogDescription>
            Import/Export custom components via JSON configuration
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="import">Import JSON</TabsTrigger>
            <TabsTrigger value="file">Import File</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="space-y-4">
            <div>
              <Label htmlFor="json-config">JSON Configuration</Label>
              <Textarea
                id="json-config"
                value={jsonConfig}
                onChange={(e) => setJsonConfig(e.target.value)}
                placeholder={exampleConfig}
                rows={12}
                className="mt-2 font-mono text-sm"
              />
            </div>
            <Button onClick={handleLoadFromJson} className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Load Components from JSON
            </Button>
          </TabsContent>
          
          <TabsContent value="file" className="space-y-4">
            <div>
              <Label htmlFor="file-input">Select JSON File</Label>
              <input
                id="file-input"
                type="file"
                accept=".json"
                onChange={loadFromFile}
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Example JSON Structure:</h4>
              <pre className="text-xs bg-white p-2 rounded border overflow-auto">
{`{
  "type": "CUSTOMFIELD",
  "label": "Custom Field",
  "icon": "Type",
  "color": "text-blue-500",
  "properties": { ... }
}`}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Current custom components: <strong>{customComponents.length}</strong>
              </p>
              {customComponents.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Components:</p>
                  <ul className="text-xs text-gray-600 mt-1">
                    {customComponents.map((comp, index) => (
                      <li key={index}>• {comp.label} ({comp.type})</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button 
              onClick={handleExportToJson} 
              className="w-full"
              disabled={customComponents.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export to JSON File
            </Button>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}