import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  Globe, 
  Key, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Plus,
  Trash2,
  RefreshCw,
  Settings
} from "lucide-react";

interface APIConnection {
  id: string;
  name: string;
  type: 'REST' | 'GraphQL' | 'Database';
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  authentication: {
    type: 'none' | 'bearer' | 'basic' | 'apikey';
    token?: string;
    username?: string;
    password?: string;
    keyName?: string;
    keyValue?: string;
  };
  testResult?: {
    success: boolean;
    data?: any;
    error?: string;
  };
}

interface APIIntegrationPanelProps {
  onConnectionSave: (connection: APIConnection) => void;
  connections: APIConnection[];
}

export default function APIIntegrationPanel({ onConnectionSave, connections }: APIIntegrationPanelProps) {
  const { toast } = useToast();
  const [activeConnection, setActiveConnection] = useState<APIConnection>({
    id: '',
    name: '',
    type: 'REST',
    url: '',
    method: 'GET',
    headers: {},
    authentication: { type: 'none' }
  });
  
  const [newHeader, setNewHeader] = useState({ key: '', value: '' });
  const [isTesting, setIsTesting] = useState(false);

  const testConnection = async () => {
    if (!activeConnection.url) {
      toast({
        title: "URL Required",
        description: "Please enter an API URL to test",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    
    try {
      // Build request headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...activeConnection.headers
      };

      // Add authentication
      if (activeConnection.authentication.type === 'bearer' && activeConnection.authentication.token) {
        headers['Authorization'] = `Bearer ${activeConnection.authentication.token}`;
      } else if (activeConnection.authentication.type === 'apikey' && activeConnection.authentication.keyName && activeConnection.authentication.keyValue) {
        headers[activeConnection.authentication.keyName] = activeConnection.authentication.keyValue;
      }

      const response = await fetch('/api/test-external-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: activeConnection.url,
          method: activeConnection.method || 'GET',
          headers
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setActiveConnection(prev => ({
          ...prev,
          testResult: {
            success: true,
            data: result.data
          }
        }));
        
        toast({
          title: "Connection Successful! 🎉",
          description: "API responded successfully"
        });
      } else {
        setActiveConnection(prev => ({
          ...prev,
          testResult: {
            success: false,
            error: result.error
          }
        }));
        
        toast({
          title: "Connection Failed",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      setActiveConnection(prev => ({
        ...prev,
        testResult: {
          success: false,
          error: 'Network error or CORS issue'
        }
      }));
      
      toast({
        title: "Test Failed",
        description: "Could not connect to API",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const addHeader = () => {
    if (newHeader.key && newHeader.value) {
      setActiveConnection(prev => ({
        ...prev,
        headers: {
          ...prev.headers,
          [newHeader.key]: newHeader.value
        }
      }));
      setNewHeader({ key: '', value: '' });
    }
  };

  const removeHeader = (key: string) => {
    setActiveConnection(prev => {
      const { [key]: removed, ...rest } = prev.headers;
      return { ...prev, headers: rest };
    });
  };

  const saveConnection = () => {
    if (!activeConnection.name || !activeConnection.url) {
      toast({
        title: "Missing Information",
        description: "Please provide connection name and URL",
        variant: "destructive"
      });
      return;
    }

    const connectionToSave = {
      ...activeConnection,
      id: activeConnection.id || Date.now().toString()
    };

    onConnectionSave(connectionToSave);
    
    toast({
      title: "Connection Saved! ✅",
      description: `API connection "${connectionToSave.name}" has been saved`
    });
  };

  const commonAPIs = [
    {
      name: "JSONPlaceholder (Demo)",
      url: "https://jsonplaceholder.typicode.com/users",
      type: "REST" as const,
      method: "GET" as const
    },
    {
      name: "REST Countries",
      url: "https://restcountries.com/v3.1/all",
      type: "REST" as const,
      method: "GET" as const
    },
    {
      name: "OpenWeatherMap",
      url: "https://api.openweathermap.org/data/2.5/weather",
      type: "REST" as const,
      method: "GET" as const,
      requiresAuth: true
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center">
            <Database className="w-3 h-3 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-white">API Integration</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Connect to external data sources</p>
      </div>

      <Tabs defaultValue="configure" className="flex-1">
        <TabsList className="w-full bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-1 rounded-none">
          <TabsTrigger value="configure" className="flex-1">
            <Settings className="w-4 h-4 mr-2 text-blue-500" />
            Configure
          </TabsTrigger>
          <TabsTrigger value="test" className="flex-1">
            <TestTube className="w-4 h-4 mr-2 text-green-500" />
            Test
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">
            <Database className="w-4 h-4 mr-2 text-purple-500" />
            Saved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="flex-1 p-4 m-0">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {/* Quick Start */}
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-900 dark:text-white">Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {commonAPIs.map((api, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setActiveConnection(prev => ({
                          ...prev,
                          name: api.name,
                          url: api.url,
                          type: api.type,
                          method: api.method
                        }));
                      }}
                    >
                      <Globe className="w-4 h-4 mr-2 text-blue-500" />
                      {api.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Connection Details */}
              <div className="space-y-4">
                <div>
                  <Label className="text-black dark:text-white">Connection Name</Label>
                  <Input
                    value={activeConnection.name}
                    onChange={(e) => setActiveConnection(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My API Connection"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-black dark:text-white">API Type</Label>
                  <Select
                    value={activeConnection.type}
                    onValueChange={(value: 'REST' | 'GraphQL' | 'Database') => 
                      setActiveConnection(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REST">REST API</SelectItem>
                      <SelectItem value="GraphQL">GraphQL</SelectItem>
                      <SelectItem value="Database">Database</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-black dark:text-white">URL</Label>
                  <Input
                    value={activeConnection.url}
                    onChange={(e) => setActiveConnection(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://api.example.com/data"
                    className="mt-1"
                  />
                </div>

                {activeConnection.type === 'REST' && (
                  <div>
                    <Label className="text-black dark:text-white">Method</Label>
                    <Select
                      value={activeConnection.method || 'GET'}
                      onValueChange={(value: 'GET' | 'POST' | 'PUT' | 'DELETE') => 
                        setActiveConnection(prev => ({ ...prev, method: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Authentication */}
                <div>
                  <Label className="text-black dark:text-white">Authentication</Label>
                  <Select
                    value={activeConnection.authentication.type}
                    onValueChange={(value: 'none' | 'bearer' | 'basic' | 'apikey') => 
                      setActiveConnection(prev => ({ 
                        ...prev, 
                        authentication: { ...prev.authentication, type: value } 
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="apikey">API Key</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {activeConnection.authentication.type === 'bearer' && (
                  <div>
                    <Label className="text-black dark:text-white">Bearer Token</Label>
                    <Input
                      type="password"
                      value={activeConnection.authentication.token || ''}
                      onChange={(e) => setActiveConnection(prev => ({ 
                        ...prev, 
                        authentication: { ...prev.authentication, token: e.target.value } 
                      }))}
                      placeholder="your-bearer-token"
                      className="mt-1"
                    />
                  </div>
                )}

                {activeConnection.authentication.type === 'apikey' && (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-black dark:text-white">Key Name</Label>
                      <Input
                        value={activeConnection.authentication.keyName || ''}
                        onChange={(e) => setActiveConnection(prev => ({ 
                          ...prev, 
                          authentication: { ...prev.authentication, keyName: e.target.value } 
                        }))}
                        placeholder="X-API-Key"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-black dark:text-white">Key Value</Label>
                      <Input
                        type="password"
                        value={activeConnection.authentication.keyValue || ''}
                        onChange={(e) => setActiveConnection(prev => ({ 
                          ...prev, 
                          authentication: { ...prev.authentication, keyValue: e.target.value } 
                        }))}
                        placeholder="your-api-key"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Headers */}
                <div>
                  <Label className="text-black dark:text-white mb-2 block">Custom Headers</Label>
                  <div className="space-y-2">
                    {Object.entries(activeConnection.headers).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <Input value={key} disabled className="flex-1 text-sm" />
                        <Input value={value} disabled className="flex-1 text-sm" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHeader(key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Header name"
                        value={newHeader.key}
                        onChange={(e) => setNewHeader(prev => ({ ...prev, key: e.target.value }))}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Header value"
                        value={newHeader.value}
                        onChange={(e) => setNewHeader(prev => ({ ...prev, value: e.target.value }))}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={addHeader}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={testConnection} disabled={isTesting} className="flex-1">
                    {isTesting ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <TestTube className="w-4 h-4 mr-2 text-green-500" />
                    )}
                    Test Connection
                  </Button>
                  <Button onClick={saveConnection} variant="outline" className="flex-1">
                    <Database className="w-4 h-4 mr-2 text-blue-500" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="test" className="flex-1 p-4 m-0">
          <ScrollArea className="h-full">
            {activeConnection.testResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {activeConnection.testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`font-medium ${
                    activeConnection.testResult.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {activeConnection.testResult.success ? 'Connection Successful' : 'Connection Failed'}
                  </span>
                </div>

                {activeConnection.testResult.success && activeConnection.testResult.data && (
                  <div>
                    <Label className="text-black dark:text-white mb-2 block">API Response</Label>
                    <div className="bg-black rounded-lg p-4">
                      <pre className="text-green-300 text-xs overflow-auto">
                        {JSON.stringify(activeConnection.testResult.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {!activeConnection.testResult.success && activeConnection.testResult.error && (
                  <div>
                    <Label className="text-red-600 dark:text-red-400 mb-2 block">Error Details</Label>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-800 dark:text-red-200 text-sm">
                        {activeConnection.testResult.error}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No test results yet. Configure and test your API connection.</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="saved" className="flex-1 p-4 m-0">
          <ScrollArea className="h-full">
            {connections.length > 0 ? (
              <div className="space-y-3">
                {connections.map((connection) => (
                  <Card key={connection.id} className="border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-black dark:text-white">{connection.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{connection.url}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            connection.type === 'REST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                            connection.type === 'GraphQL' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          }`}>
                            {connection.type}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveConnection(connection)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No saved connections yet. Create your first API connection.</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}