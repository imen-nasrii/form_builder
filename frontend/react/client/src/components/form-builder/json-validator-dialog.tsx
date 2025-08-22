import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertTriangle, XCircle, FileCheck, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateJSONSchema, formatValidationErrors, type SchemaValidationResult } from "@/lib/json-schema-validator";

interface JSONValidatorDialogProps {
  onImportValidJSON?: (jsonData: any) => void;
}

export default function JSONValidatorDialog({ onImportValidJSON }: JSONValidatorDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<SchemaValidationResult | null>(null);
  const [activeTab, setActiveTab] = useState('input');

  const handleValidate = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "No JSON to validate",
        description: "Please enter JSON schema to validate",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = validateJSONSchema(jsonInput);
      setValidationResult(result);
      setActiveTab('results');
      
      if (result.isValid) {
        toast({
          title: "Validation Successful! ✅",
          description: "JSON schema is valid and ready to use",
        });
      } else {
        toast({
          title: "Validation Issues Found",
          description: `Found ${result.errors.length} errors and ${result.warnings.length} warnings`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Invalid JSON format",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    if (!validationResult?.isValid) {
      toast({
        title: "Cannot Import",
        description: "Please fix all validation errors before importing",
        variant: "destructive",
      });
      return;
    }

    try {
      const jsonData = JSON.parse(jsonInput);
      if (onImportValidJSON) {
        onImportValidJSON(jsonData);
        setIsOpen(false);
        toast({
          title: "JSON Imported Successfully! 🎉",
          description: "Form has been loaded from validated JSON",
        });
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to parse JSON",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
      setValidationResult(null);
      setActiveTab('input');
    };
    reader.readAsText(file);
  };

  const downloadValidationReport = () => {
    if (!validationResult) return;

    const report = formatValidationErrors(validationResult);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'validation-report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadSampleJSON = () => {
    const sampleJSON = `{
  "MenuID": "ACCADJ",
  "FormWidth": "700px",
  "Layout": "PROCESS",
  "Label": "Account Adjustment",
  "Fields": [
    {
      "Id": "FundID",
      "label": "FUND",
      "type": "GRIDLKP",
      "Inline": true,
      "Width": "32",
      "KeyColumn": "fund",
      "ItemInfo": {
        "MainProperty": "fund",
        "DescProperty": "acnam1",
        "ShowDescription": true
      },
      "LoadDataInfo": {
        "DataModel": "Fndmas",
        "ColumnsDefinition": [
          {
            "DataField": "fund",
            "Caption": "Fund ID",
            "DataType": "STRING",
            "Visible": true
          },
          {
            "DataField": "acnam1",
            "Caption": "Fund Name",
            "DataType": "STRING",
            "Visible": true
          }
        ]
      }
    }
  ],
  "Actions": [
    {
      "ID": "PROCESS",
      "Label": "PROCESS",
      "MethodToInvoke": "ExecuteProcess"
    }
  ],
  "Validations": []
}`;
    setJsonInput(sampleJSON);
    setValidationResult(null);
    setActiveTab('input');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileCheck className="w-4 h-4 mr-2" />
          JSON Validator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            JSON Schema Validator
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">JSON Input & Validation</TabsTrigger>
            <TabsTrigger value="results" disabled={!validationResult}>
              Validation Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">JSON Schema Input</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadSampleJSON}>
                  Load Sample
                </Button>
                <label>
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JSON schema here or upload a file..."
                className="min-h-96 font-mono text-sm"
              />

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Characters: {jsonInput.length}
                </div>
                <Button onClick={handleValidate} className="enterprise-gradient">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Validate JSON Schema
                </Button>
              </div>
            </div>

            {validationResult && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Quick Validation Summary</h4>
                  {validationResult.isValid ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Valid
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      Invalid
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>{validationResult.errors.length} Errors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span>{validationResult.warnings.length} Warnings</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4 max-h-[70vh] overflow-y-auto">
            {validationResult && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Validation Results</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={downloadValidationReport}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                    {validationResult.isValid && onImportValidJSON && (
                      <Button onClick={handleImport} className="enterprise-gradient">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Import to Form Builder
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {validationResult.isValid ? '✅' : '❌'}
                    </div>
                    <div className="text-sm font-medium">
                      {validationResult.isValid ? 'Valid' : 'Invalid'}
                    </div>
                  </div>
                  <div className="bg-white border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {validationResult.errors.length}
                    </div>
                    <div className="text-sm font-medium">Errors</div>
                  </div>
                  <div className="bg-white border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {validationResult.warnings.length}
                    </div>
                    <div className="text-sm font-medium">Warnings</div>
                  </div>
                </div>

                {validationResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-700 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Errors ({validationResult.errors.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {validationResult.errors.map((error, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 rounded p-3">
                          <div className="font-mono text-sm text-red-800">{error.path}</div>
                          <div className="text-sm text-red-700">{error.message}</div>
                          <div className="text-xs text-red-600 mt-1">Code: {error.code}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-yellow-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Warnings ({validationResult.warnings.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {validationResult.warnings.map((warning, index) => (
                        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          <div className="font-mono text-sm text-yellow-800">{warning.path}</div>
                          <div className="text-sm text-yellow-700">{warning.message}</div>
                          <div className="text-xs text-yellow-600 mt-1">Code: {warning.code}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validationResult.isValid && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Schema Validation Passed! 🎉</h4>
                    <p className="text-sm text-green-800">
                      Your JSON schema is valid and follows all the required patterns. 
                      You can now import this into the form builder or use it directly in your application.
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}