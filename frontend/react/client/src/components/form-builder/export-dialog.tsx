import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Code, FileText, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportFormToFramework, downloadFile, type ExportOptions } from "@/lib/export-engine";
import type { FormDefinition } from "@/lib/form-types";

interface ExportDialogProps {
  formData: {
    menuId: string;
    label: string;
    formWidth: string;
    layout: string;
    fields: any[];
  };
}

export default function ExportDialog({ formData }: ExportDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    framework: 'react',
    typescript: true,
    includeValidation: true,
    includeStyles: true,
  });
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState('options');

  const frameworks = [
    {
      id: 'react' as const,
      name: 'React',
      description: 'Modern React component with hooks',
      color: 'bg-blue-500',
      icon: '⚛️'
    },
    {
      id: 'blazor' as const,
      name: 'Blazor',
      description: 'C# Blazor component with data binding',
      color: 'bg-purple-500',
      icon: '🔷'
    },
    {
      id: 'vue' as const,
      name: 'Vue.js',
      description: 'Vue 3 component with Composition API',
      color: 'bg-green-500',
      icon: '🟢'
    }
  ];

  const handleFrameworkChange = (framework: 'react' | 'blazor' | 'vue') => {
    setExportOptions(prev => ({ ...prev, framework }));
  };

  const handleOptionChange = (option: keyof ExportOptions, value: boolean) => {
    setExportOptions(prev => ({ ...prev, [option]: value }));
  };

  const generateCode = () => {
    try {
      // Convert form data to FormDefinition format
      const formDefinition: FormDefinition = {
        MenuID: formData.menuId,
        FormWidth: formData.formWidth,
        Layout: formData.layout,
        Label: formData.label,
        Fields: formData.fields,
        Actions: [],
        Validations: []
      };

      const code = exportFormToFramework(formDefinition, exportOptions);
      setGeneratedCode(code);
      setActiveTab('preview');
      
      toast({
        title: "Code Generated Successfully!",
        description: `${exportOptions.framework.charAt(0).toUpperCase() + exportOptions.framework.slice(1)} component is ready for download.`,
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to generate code. Please check your form configuration.",
        variant: "destructive",
      });
    }
  };

  const downloadCode = () => {
    if (!generatedCode) return;

    const framework = exportOptions.framework;
    const filename = getFileName();
    const contentType = getContentType();

    downloadFile(generatedCode, filename, contentType);
    
    toast({
      title: "Download Started!",
      description: `${filename} has been downloaded successfully.`,
    });
  };

  const copyToClipboard = () => {
    if (!generatedCode) return;

    navigator.clipboard.writeText(generatedCode).then(() => {
      toast({
        title: "Copied to Clipboard!",
        description: "Code has been copied to your clipboard.",
      });
    });
  };

  const getFileName = (): string => {
    const baseName = formData.label.replace(/[^a-zA-Z0-9]/g, '') || 'GeneratedForm';
    
    switch (exportOptions.framework) {
      case 'react':
        return `${baseName}.${exportOptions.typescript ? 'tsx' : 'jsx'}`;
      case 'blazor':
        return `${baseName}.razor`;
      case 'vue':
        return `${baseName}.vue`;
      default:
        return `${baseName}.txt`;
    }
  };

  const getContentType = (): string => {
    switch (exportOptions.framework) {
      case 'react':
        return 'text/jsx';
      case 'blazor':
        return 'text/html';
      case 'vue':
        return 'text/html';
      default:
        return 'text/plain';
    }
  };

  const selectedFramework = frameworks.find(f => f.id === exportOptions.framework);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="enterprise-gradient">
          <Download className="w-4 h-4 mr-2" />
          Export Form
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Export to Multiple Frameworks
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="options">Export Options</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedCode}>
              Preview & Download
            </TabsTrigger>
          </TabsList>

          <TabsContent value="options" className="space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Framework Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Choose Framework</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {frameworks.map((framework) => (
                  <div
                    key={framework.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      exportOptions.framework === framework.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleFrameworkChange(framework.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${framework.color} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-lg">{framework.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{framework.name}</h4>
                        <p className="text-sm text-gray-500">{framework.description}</p>
                      </div>
                    </div>
                    {exportOptions.framework === framework.id && (
                      <Badge className="mt-2" variant="default">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Export Options</h3>
              <div className="space-y-4">
                {exportOptions.framework !== 'blazor' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="typescript"
                      checked={exportOptions.typescript}
                      onCheckedChange={(checked) => handleOptionChange('typescript', !!checked)}
                    />
                    <Label htmlFor="typescript">
                      Use TypeScript
                      <span className="text-sm text-gray-500 ml-2">
                        Generate TypeScript code with type definitions
                      </span>
                    </Label>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="validation"
                    checked={exportOptions.includeValidation}
                    onCheckedChange={(checked) => handleOptionChange('includeValidation', !!checked)}
                  />
                  <Label htmlFor="validation">
                    Include Validation
                    <span className="text-sm text-gray-500 ml-2">
                      Add form validation logic and error handling
                    </span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="styles"
                    checked={exportOptions.includeStyles}
                    onCheckedChange={(checked) => handleOptionChange('includeStyles', !!checked)}
                  />
                  <Label htmlFor="styles">
                    Include Styles
                    <span className="text-sm text-gray-500 ml-2">
                      Add basic CSS styling for the form
                    </span>
                  </Label>
                </div>
              </div>
            </div>

            {/* Form Preview */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Form Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Form Name:</span> {formData.label || 'Untitled Form'}
                  </div>
                  <div>
                    <span className="font-medium">Fields Count:</span> {formData.fields.length}
                  </div>
                  <div>
                    <span className="font-medium">Layout:</span> {formData.layout}
                  </div>
                  <div>
                    <span className="font-medium">Width:</span> {formData.formWidth}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="font-medium">Field Types:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Array.from(new Set(formData.fields.map(f => f.type))).map(type => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end">
              <Button onClick={generateCode} className="enterprise-gradient">
                <Code className="w-4 h-4 mr-2" />
                Generate {selectedFramework?.name} Code
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 max-h-[60vh] overflow-hidden">
            {generatedCode && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Generated Code</h3>
                    <Badge variant="outline">
                      {selectedFramework?.icon} {selectedFramework?.name}
                    </Badge>
                    {exportOptions.typescript && exportOptions.framework !== 'blazor' && (
                      <Badge variant="outline">TypeScript</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={downloadCode} className="enterprise-gradient">
                      <Download className="w-4 h-4 mr-2" />
                      Download {getFileName()}
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <pre className="bg-gray-50 p-4 text-sm overflow-auto max-h-96">
                    <code>{generatedCode}</code>
                  </pre>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Download the generated component file</li>
                    <li>• Add it to your {selectedFramework?.name} project</li>
                    <li>• Install any required dependencies</li>
                    <li>• Customize the styling and validation as needed</li>
                  </ul>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}