import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, Copy, FileText, Database, Grid3X3, 
  List, CheckSquare, Calendar, Hash, Type, Settings 
} from 'lucide-react';

interface TemplateGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onImportGenerated: (jsonData: any) => void;
  isDarkMode?: boolean;
}

// Templates basés sur ACCADJ et BUYTYP
const ACCADJ_TEMPLATE = {
  "MenuID": "ACCADJ_GENERATED",
  "FormWidth": "700px",
  "Layout": "PROCESS",
  "Label": "ACCADJ Generated Form",
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
    },
    {
      "Id": "AccrualDate",
      "label": "PROCDATE",
      "type": "DATEPICKER",
      "Inline": true,
      "Width": "32",
      "Spacing": "30",
      "required": true,
      "Validations": [
        {
          "Id": "6",
          "Type": "ERROR",
          "ConditionExpression": {
            "Conditions": [
              {
                "RightField": "AccrualDate",
                "Operator": "ISN",
                "ValueType": "DATE"
              }
            ]
          }
        }
      ]
    },
    {
      "Id": "AccrueType",
      "label": "ACCTYPE",
      "type": "RADIOGRP",
      "Width": "600px",
      "Spacing": "0",
      "OptionValues": {
        "atAll": "ATALL",
        "atFixed": "ATFIXED",
        "atVar": "ATVAR"
      }
    },
    {
      "Id": "UpdateRates",
      "label": "UPDATERATE",
      "type": "CHECKBOX",
      "CheckboxValue": true,
      "spacing": 0,
      "Value": false,
      "Width": "600px"
    }
  ],
  "Actions": [
    {
      "ID": "PROCESS",
      "Label": "PROCESS",
      "MethodToInvoke": "ExecuteProcess"
    }
  ]
};

const BUYTYP_TEMPLATE = {
  "MenuID": "BUYTYP_GENERATED",
  "Label": "BUYTYP Generated Form",
  "FormWidth": "600px",
  "Fields": [
    {
      "Id": "FundID",
      "label": "FUND",
      "type": "GRIDLKP",
      "required": true,
      "showAliasBox": true,
      "EntitykeyField": "fund",
      "Entity": "Fndmas",
      "Required": true,
      "ColumnDefinitions": [
        {
          "DataField": "fund",
          "Caption": "Fund ID",
          "DataType": "STRING"
        },
        {
          "DataField": "acnam1",
          "Caption": "Fund Name",
          "DataType": "STRING"
        }
      ]
    },
    {
      "Id": "Ticker",
      "label": "TKR",
      "type": "GRIDLKP",
      "required": true,
      "filter": "1",
      "EntitykeyField": "tkr",
      "Entity": "Secrty",
      "ColumnDefinitions": [
        {
          "DataField": "tkr",
          "Caption": "Ticker",
          "DataType": "STRING"
        },
        {
          "DataField": "tkr_DESC",
          "Caption": "Ticker Desc",
          "DataType": "STRING"
        }
      ]
    },
    {
      "Id": "TradeDate",
      "label": "TRADEDATE",
      "type": "DATEPKR",
      "required": true
    },
    {
      "Id": "Broker",
      "label": "BROKER",
      "type": "GRIDLKP",
      "required": true,
      "EntitykeyField": "broker",
      "Entity": "Broker",
      "ColumnDefinitions": [
        {
          "DataField": "name",
          "Caption": "Broker Name",
          "DataType": "STRING"
        },
        {
          "DataField": "broker",
          "Caption": "Broker ID",
          "DataType": "STRING"
        }
      ]
    },
    {
      "Id": "Quantity",
      "label": "QUANTITY",
      "type": "NUMERIC",
      "required": true
    }
  ]
};

const COMPONENT_VARIATIONS = [
  {
    name: "Financial Grid Lookup",
    type: "GRIDLKP",
    icon: Grid3X3,
    color: "blue",
    description: "Complex data grid with lookup capabilities"
  },
  {
    name: "List Lookup",
    type: "LSTLKP", 
    icon: List,
    color: "green",
    description: "Simple list selection with search"
  },
  {
    name: "Date Picker",
    type: "DATEPICKER",
    icon: Calendar,
    color: "purple",
    description: "Date selection component"
  },
  {
    name: "Checkbox Group",
    type: "CHECKBOX",
    icon: CheckSquare,
    color: "orange",
    description: "Multiple selection checkboxes"
  },
  {
    name: "Numeric Input",
    type: "NUMERIC",
    icon: Hash,
    color: "red",
    description: "Number input with validation"
  },
  {
    name: "Text Field",
    type: "TEXT",
    icon: Type,
    color: "gray",
    description: "Standard text input field"
  }
];

export default function TemplateJsonGenerator({ isOpen, onClose, onImportGenerated, isDarkMode }: TemplateGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<'ACCADJ' | 'BUYTYP' | null>(null);
  const [generatedJson, setGeneratedJson] = useState<string>('');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const { toast } = useToast();

  const generateCustomJson = (templateType: 'ACCADJ' | 'BUYTYP', components: string[]) => {
    const baseTemplate = templateType === 'ACCADJ' ? { ...ACCADJ_TEMPLATE } : { ...BUYTYP_TEMPLATE };
    
    // Personnaliser selon les composants sélectionnés
    const customFields = components.map((compType, index) => {
      const variation = COMPONENT_VARIATIONS.find(v => v.type === compType);
      if (!variation) return undefined;
      
      const baseField = baseTemplate.Fields.find(f => f.type === compType) || baseTemplate.Fields[0];
      
      return {
        ...baseField,
        Id: `${compType}_${Date.now()}_${index}`,
        label: `${variation.name.toUpperCase().replace(/\s/g, '')}`,
        type: compType,
        required: Math.random() > 0.5,
        Width: compType === 'GRIDLKP' ? "32" : "100%",
        Inline: baseField.Inline || true,
        Spacing: baseField.Spacing || "30",
        Validations: baseField.Validations || []
      };
    }).filter((field): field is NonNullable<typeof field> => field !== undefined);

    if (customFields.length > 0) {
      baseTemplate.Fields = [...baseTemplate.Fields.slice(0, 2), ...customFields];
    }

    baseTemplate.MenuID = `${templateType}_CUSTOM_${Date.now()}`;
    baseTemplate.Label = `${templateType} Custom Generated Form`;
    
    return baseTemplate;
  };

  const handleGenerateJson = () => {
    if (!selectedTemplate) {
      toast({
        title: "Template Required",
        description: "Please select a template first",
        variant: "destructive"
      });
      return;
    }

    const componentsToUse = selectedComponents.length > 0 ? selectedComponents : ['GRIDLKP', 'DATEPICKER', 'CHECKBOX'];
    const generated = generateCustomJson(selectedTemplate, componentsToUse);
    const jsonString = JSON.stringify(generated, null, 2);
    setGeneratedJson(jsonString);

    toast({
      title: "JSON Generated",
      description: `Generated ${selectedTemplate} template with ${componentsToUse.length} components`,
      variant: "default"
    });
  };

  const handleImportGenerated = () => {
    if (!generatedJson) return;
    
    try {
      const parsed = JSON.parse(generatedJson);
      onImportGenerated(parsed);
      onClose();
      toast({
        title: "Template Imported",
        description: "Generated template imported successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to parse generated JSON",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedJson);
    toast({
      title: "Copied",
      description: "JSON copied to clipboard",
      variant: "default"
    });
  };

  const downloadJson = () => {
    const blob = new Blob([generatedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate}_generated_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleComponent = (compType: string) => {
    setSelectedComponents(prev => 
      prev.includes(compType) 
        ? prev.filter(c => c !== compType)
        : [...prev, compType]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-6xl max-h-[90vh] overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
            <Database className="w-5 h-5" />
            Template JSON Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70vh]">
          {/* Panneau de configuration */}
          <div className="space-y-6">
            {/* Sélection du template */}
            <Card className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
              <CardHeader>
                <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : ''}`}>
                  Select Base Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === 'ACCADJ' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  } ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedTemplate('ACCADJ')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>ACCADJ Template</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Accrual adjustment form with financial controls
                      </p>
                    </div>
                    <Badge variant={selectedTemplate === 'ACCADJ' ? 'default' : 'secondary'}>
                      Process
                    </Badge>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === 'BUYTYP' 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                  } ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedTemplate('BUYTYP')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>BUYTYP Template</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Buy transaction form with trading fields
                      </p>
                    </div>
                    <Badge variant={selectedTemplate === 'BUYTYP' ? 'default' : 'secondary'}>
                      Trading
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sélection des composants */}
            <Card className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
              <CardHeader>
                <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : ''}`}>
                  Additional Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {COMPONENT_VARIATIONS.map((comp) => {
                    const IconComponent = comp.icon;
                    const isSelected = selectedComponents.includes(comp.type);
                    
                    return (
                      <div
                        key={comp.type}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        } ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}
                        onClick={() => toggleComponent(comp.type)}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-4 h-4 text-${comp.color}-600`} />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : ''}`}>
                            {comp.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Boutons d'action */}
            <div className="flex gap-3">
              <Button 
                onClick={handleGenerateJson}
                disabled={!selectedTemplate}
                className="flex-1"
              >
                <Settings className="w-4 h-4 mr-2" />
                Generate JSON
              </Button>
            </div>
          </div>

          {/* Panneau de prévisualisation */}
          <div className="space-y-4">
            <Card className={`h-full ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : ''}`}>
                    Generated JSON Preview
                  </CardTitle>
                  {generatedJson && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={downloadJson}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={handleImportGenerated}>
                        Import
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {generatedJson ? (
                  <Textarea
                    value={generatedJson}
                    onChange={(e) => setGeneratedJson(e.target.value)}
                    className={`w-full h-[400px] font-mono text-sm resize-none border-0 ${
                      isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-50'
                    }`}
                    placeholder="Generated JSON will appear here..."
                  />
                ) : (
                  <div className={`h-[400px] flex items-center justify-center ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a template and click Generate to see the JSON</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}