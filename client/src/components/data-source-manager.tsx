import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { StableSelect, StableSelectItem } from '@/components/ui/stable-select';
import { Database, Plus, TestTube, ExternalLink, Settings } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST';
}

interface ApiDataSource {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  requestBody?: any;
  responseMapping: {
    valueField: string;
    labelField: string;
    dataPath?: string;
  };
  authType?: 'none' | 'bearer' | 'apikey' | 'basic';
  authConfig?: {
    token?: string;
    apiKey?: string;
    username?: string;
    password?: string;
    headerName?: string;
  };
}

export default function DataSourceManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showNewDataSource, setShowNewDataSource] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const [newDataSource, setNewDataSource] = useState<Partial<ApiDataSource>>({
    method: 'GET',
    authType: 'none',
    responseMapping: {
      valueField: '',
      labelField: '',
    },
  });

  const { data: dataSources = [], isLoading } = useQuery<DataSource[]>({
    queryKey: ['/api/data-sources'],
  });

  const createDataSourceMutation = useMutation({
    mutationFn: async (dataSource: ApiDataSource) => {
      return apiRequest('/api/data-sources', {
        method: 'POST',
        body: JSON.stringify(dataSource),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/data-sources'] });
      setShowNewDataSource(false);
      setNewDataSource({
        method: 'GET',
        authType: 'none',
        responseMapping: { valueField: '', labelField: '' },
      });
      toast({
        title: "Data Source Created",
        description: "External data source has been configured successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const testDataSourceMutation = useMutation({
    mutationFn: async (dataSource: ApiDataSource) => {
      return apiRequest('/api/data-sources/test', {
        method: 'POST',
        body: JSON.stringify(dataSource),
      });
    },
    onSuccess: (result) => {
      setTestResults(result);
      if (result.success) {
        toast({
          title: "Test Successful",
          description: `Retrieved ${result.data?.length || 0} items`,
        });
      } else {
        toast({
          title: "Test Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Test Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateDataSource = () => {
    if (!newDataSource.id || !newDataSource.name || !newDataSource.url) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!newDataSource.responseMapping?.valueField || !newDataSource.responseMapping?.labelField) {
      toast({
        title: "Validation Error",
        description: "Please configure response mapping fields",
        variant: "destructive",
      });
      return;
    }

    createDataSourceMutation.mutate(newDataSource as ApiDataSource);
  };

  const handleTestDataSource = () => {
    if (!newDataSource.url) {
      toast({
        title: "Validation Error",
        description: "Please enter a URL to test",
        variant: "destructive",
      });
      return;
    }

    testDataSourceMutation.mutate(newDataSource as ApiDataSource);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="w-6 h-6" />
            External Data Sources
          </h2>
          <p className="text-gray-600">Configure external APIs for dynamic form data</p>
        </div>
        <Button onClick={() => setShowNewDataSource(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Data Source
        </Button>
      </div>

      {/* Existing Data Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSources.map((source) => (
          <Card key={source.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{source.name}</span>
                <Badge variant="outline">{source.method}</Badge>
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                <span className="truncate">{source.url}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Data Source Form */}
      {showNewDataSource && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Data Source</CardTitle>
            <CardDescription>
              Configure an external API to provide dynamic data for your forms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id">ID</Label>
                <Input
                  id="id"
                  value={newDataSource.id || ''}
                  onChange={(e) => setNewDataSource(prev => ({ ...prev, id: e.target.value }))}
                  placeholder="unique-data-source-id"
                />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newDataSource.name || ''}
                  onChange={(e) => setNewDataSource(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="User-friendly name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="url">API URL</Label>
              <Input
                id="url"
                value={newDataSource.url || ''}
                onChange={(e) => setNewDataSource(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://api.example.com/data"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="method">HTTP Method</Label>
                <StableSelect
                  value={newDataSource.method || 'GET'}
                  onValueChange={(value: string) => setNewDataSource(prev => ({ ...prev, method: value as 'GET' | 'POST' }))}
                >
                  <StableSelectItem value="GET">GET</StableSelectItem>
                  <StableSelectItem value="POST">POST</StableSelectItem>
                </StableSelect>
              </div>
              <div>
                <Label htmlFor="authType">Authentication</Label>
                <StableSelect
                  value={newDataSource.authType || 'none'}
                  onValueChange={(value: string) => setNewDataSource(prev => ({ 
                    ...prev, 
                    authType: value as 'none' | 'bearer' | 'apikey' | 'basic' 
                  }))}
                >
                  <StableSelectItem value="none">None</StableSelectItem>
                  <StableSelectItem value="bearer">Bearer Token</StableSelectItem>
                  <StableSelectItem value="apikey">API Key</StableSelectItem>
                  <StableSelectItem value="basic">Basic Auth</StableSelectItem>
                </StableSelect>
              </div>
            </div>

            {/* Authentication Configuration */}
            {newDataSource.authType === 'bearer' && (
              <div>
                <Label htmlFor="token">Bearer Token</Label>
                <Input
                  id="token"
                  type="password"
                  value={newDataSource.authConfig?.token || ''}
                  onChange={(e) => setNewDataSource(prev => ({ 
                    ...prev, 
                    authConfig: { ...prev.authConfig, token: e.target.value }
                  }))}
                  placeholder="Your bearer token"
                />
              </div>
            )}

            {newDataSource.authType === 'apikey' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="headerName">Header Name</Label>
                  <Input
                    id="headerName"
                    value={newDataSource.authConfig?.headerName || ''}
                    onChange={(e) => setNewDataSource(prev => ({ 
                      ...prev, 
                      authConfig: { ...prev.authConfig, headerName: e.target.value }
                    }))}
                    placeholder="X-API-Key"
                  />
                </div>
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={newDataSource.authConfig?.apiKey || ''}
                    onChange={(e) => setNewDataSource(prev => ({ 
                      ...prev, 
                      authConfig: { ...prev.authConfig, apiKey: e.target.value }
                    }))}
                    placeholder="Your API key"
                  />
                </div>
              </div>
            )}

            {newDataSource.authType === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={newDataSource.authConfig?.username || ''}
                    onChange={(e) => setNewDataSource(prev => ({ 
                      ...prev, 
                      authConfig: { ...prev.authConfig, username: e.target.value }
                    }))}
                    placeholder="Username"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newDataSource.authConfig?.password || ''}
                    onChange={(e) => setNewDataSource(prev => ({ 
                      ...prev, 
                      authConfig: { ...prev.authConfig, password: e.target.value }
                    }))}
                    placeholder="Password"
                  />
                </div>
              </div>
            )}

            {/* Response Mapping */}
            <div>
              <Label className="text-sm font-medium">Response Mapping</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="valueField">Value Field</Label>
                  <Input
                    id="valueField"
                    value={newDataSource.responseMapping?.valueField || ''}
                    onChange={(e) => setNewDataSource(prev => ({ 
                      ...prev, 
                      responseMapping: { ...prev.responseMapping!, valueField: e.target.value }
                    }))}
                    placeholder="id"
                  />
                </div>
                <div>
                  <Label htmlFor="labelField">Label Field</Label>
                  <Input
                    id="labelField"
                    value={newDataSource.responseMapping?.labelField || ''}
                    onChange={(e) => setNewDataSource(prev => ({ 
                      ...prev, 
                      responseMapping: { ...prev.responseMapping!, labelField: e.target.value }
                    }))}
                    placeholder="name"
                  />
                </div>
                <div>
                  <Label htmlFor="dataPath">Data Path (optional)</Label>
                  <Input
                    id="dataPath"
                    value={newDataSource.responseMapping?.dataPath || ''}
                    onChange={(e) => setNewDataSource(prev => ({ 
                      ...prev, 
                      responseMapping: { ...prev.responseMapping!, dataPath: e.target.value }
                    }))}
                    placeholder="data.items"
                  />
                </div>
              </div>
            </div>

            {/* Test Results */}
            {testResults && (
              <Alert className={testResults.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <TestTube className="h-4 w-4" />
                <AlertDescription>
                  {testResults.success ? (
                    <div>
                      <p className="font-medium text-green-800">Test successful!</p>
                      <p className="text-green-700">Retrieved {testResults.data?.length || 0} items</p>
                      {testResults.data && testResults.data.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-green-600">Sample data:</p>
                          <pre className="text-xs bg-green-100 p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(testResults.data[0], null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-red-800">Test failed</p>
                      <p className="text-red-700">{testResults.error}</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowNewDataSource(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={handleTestDataSource}
                disabled={testDataSourceMutation.isPending}
              >
                <TestTube className="w-4 h-4 mr-2" />
                {testDataSourceMutation.isPending ? 'Testing...' : 'Test'}
              </Button>
              <Button
                onClick={handleCreateDataSource}
                disabled={createDataSourceMutation.isPending}
              >
                {createDataSourceMutation.isPending ? 'Creating...' : 'Create Data Source'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}