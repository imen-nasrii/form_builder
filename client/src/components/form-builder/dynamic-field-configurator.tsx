import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  Link, 
  MapPin, 
  Zap,
  Eye,
  Refresh
} from "lucide-react";
import type { FormField } from "@/lib/form-types";

interface APIConnection {
  id: string;
  name: string;
  type: string;
  url: string;
  testResult?: {
    success: boolean;
    data?: any;
  };
}

interface DynamicFieldConfiguratorProps {
  field: FormField;
  apiConnections: APIConnection[];
  onUpdateField: (updates: Partial<FormField>) => void;
  onTestDataLoad: (fieldId: string) => void;
}

export default function DynamicFieldConfigurrator({ field, apiConnections, onUpdateField, onTestDataLoad }: DynamicFieldConfiguratorProps) {
  const { toast } = useToast();
  const [isTestingData, setIsTestingData] = useState(false);
  const [dataPreview, setDataPreview] = useState<any[]>([]);

  const handleAPIConnectionChange = (connectionId: string) => {
    const selectedConnection = apiConnections.find(conn => conn.id === connectionId);
    if (selectedConnection) {
      onUpdateField({
        LoadDataInfo: {
          ...field.LoadDataInfo,
          DataSource: 'API',
          APIConnection: selectedConnection,
          DataModel: selectedConnection.name
        }
      });
    }
  };

  const testDataLoad = async () => {
    if (!field.LoadDataInfo?.APIConnection) {
      toast({
        title: "No API Connection",
        description: "Please select an API connection first",
        variant: "destructive"
      });
      return;
    }

    setIsTestingData(true);
    
    try {
      const response = await fetch('/api/test-external-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: field.LoadDataInfo.APIConnection.url,
          method: 'GET',
          headers: field.LoadDataInfo.APIConnection.headers || {}
        })
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        const data = Array.isArray(result.data) ? result.data : [result.data];
        setDataPreview(data.slice(0, 5)); // Show first 5 items
        
        toast({
          title: "Data Loaded Successfully! 🎉",
          description: `Loaded ${data.length} items from API`
        });
        
        onTestDataLoad(field.Id);
      } else {
        toast({
          title: "Failed to Load Data",
          description: result.error || "Unknown error",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Could not connect to API",
        variant: "destructive"
      });
    } finally {
      setIsTestingData(false);
    }
  };

  const suggestColumnMappings = (sampleData: any) => {
    if (!sampleData || typeof sampleData !== 'object') return;

    const keys = Object.keys(sampleData);
    const suggestions = {
      id: keys.find(k => k.toLowerCase().includes('id')) || keys[0],
      name: keys.find(k => k.toLowerCase().includes('name') || k.toLowerCase().includes('title')) || keys[1],
      description: keys.find(k => k.toLowerCase().includes('desc') || k.toLowerCase().includes('detail')) || keys[2]
    };

    onUpdateField({
      LoadDataInfo: {
        ...field.LoadDataInfo,
        ColumnsDefinition: [
          {
            DataField: suggestions.id,
            Caption: 'ID',
            DataType: 'STRING',
            Visible: false
          },
          {
            DataField: suggestions.name,
            Caption: 'Name',
            DataType: 'STRING',
            Visible: true
          },
          {
            DataField: suggestions.description || suggestions.name,
            Caption: 'Description',
            DataType: 'STRING',
            Visible: true
          }
        ]
      },
      KeyColumn: suggestions.id,
      ItemInfo: {
        MainProperty: suggestions.name,
        DescProperty: suggestions.description || suggestions.name,
        ShowDescription: !!suggestions.description
      }
    });
  };

  const availableConnections = apiConnections.filter(conn => conn.testResult?.success);

  return (
    <div className="space-y-4">
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" />
            Dynamic Data Source
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enable Dynamic Data */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-black dark:text-white">Enable Dynamic Data</Label>
            <Switch
              checked={!!field.LoadDataInfo}
              onCheckedChange={(checked) => {
                if (checked) {
                  onUpdateField({
                    LoadDataInfo: {
                      DataModel: '',
                      DataSource: 'API',
                      ColumnsDefinition: []
                    }
                  });
                } else {
                  onUpdateField({
                    LoadDataInfo: undefined,
                    KeyColumn: undefined,
                    ItemInfo: undefined
                  });
                }
              }}
            />
          </div>

          {field.LoadDataInfo && (
            <>
              {/* API Connection Selection */}
              <div>
                <Label className="text-sm text-black dark:text-white">API Connection</Label>
                <Select
                  value={field.LoadDataInfo.APIConnection?.id || ''}
                  onValueChange={handleAPIConnectionChange}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select API connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableConnections.length > 0 ? (
                      availableConnections.map((conn) => (
                        <SelectItem key={conn.id} value={conn.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {conn.name}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No tested API connections available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {availableConnections.length === 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Configure and test API connections in the API tab first
                  </p>
                )}
              </div>

              {/* Test Data Load */}
              {field.LoadDataInfo.APIConnection && (
                <div className="space-y-3">
                  <Button
                    onClick={testDataLoad}
                    disabled={isTestingData}
                    size="sm"
                    className="w-full"
                  >
                    {isTestingData ? (
                      <Refresh className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4 mr-2" />
                    )}
                    Test Data Load
                  </Button>

                  {/* Data Preview */}
                  {dataPreview.length > 0 && (
                    <div>
                      <Label className="text-sm text-black dark:text-white mb-2 block">Data Preview</Label>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-32 overflow-auto">
                        <pre className="text-xs text-gray-700 dark:text-gray-300">
                          {JSON.stringify(dataPreview[0], null, 2)}
                        </pre>
                      </div>
                      <Button
                        onClick={() => suggestColumnMappings(dataPreview[0])}
                        size="sm"
                        variant="outline"
                        className="w-full mt-2"
                      >
                        <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                        Auto-Configure Columns
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Column Mappings */}
              {field.LoadDataInfo.ColumnsDefinition && field.LoadDataInfo.ColumnsDefinition.length > 0 && (
                <div>
                  <Label className="text-sm text-black dark:text-white mb-2 block">Column Mappings</Label>
                  <div className="space-y-2">
                    {field.LoadDataInfo.ColumnsDefinition.map((col, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <div className="flex-1">
                          <div className="text-xs font-medium text-black dark:text-white">{col.Caption}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{col.DataField}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          col.Visible ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {col.Visible ? 'Visible' : 'Hidden'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Field Configuration */}
              {field.KeyColumn && (
                <div>
                  <Label className="text-sm text-black dark:text-white">Key Field</Label>
                  <Input
                    value={field.KeyColumn}
                    onChange={(e) => onUpdateField({ KeyColumn: e.target.value })}
                    placeholder="id"
                    className="mt-1"
                  />
                </div>
              )}

              {/* Display Configuration */}
              {field.ItemInfo && (
                <div className="space-y-2">
                  <Label className="text-sm text-black dark:text-white">Display Configuration</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        value={field.ItemInfo.MainProperty}
                        onChange={(e) => onUpdateField({
                          ItemInfo: {
                            ...field.ItemInfo!,
                            MainProperty: e.target.value
                          }
                        })}
                        placeholder="Main field"
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Input
                        value={field.ItemInfo.DescProperty}
                        onChange={(e) => onUpdateField({
                          ItemInfo: {
                            ...field.ItemInfo!,
                            DescProperty: e.target.value
                          }
                        })}
                        placeholder="Description field"
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Real-time Updates */}
              <div className="flex items-center justify-between">
                <Label className="text-sm text-black dark:text-white">Real-time Updates</Label>
                <Switch
                  checked={field.LoadDataInfo.RealTime || false}
                  onCheckedChange={(checked) => onUpdateField({
                    LoadDataInfo: {
                      ...field.LoadDataInfo!,
                      RealTime: checked
                    }
                  })}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}