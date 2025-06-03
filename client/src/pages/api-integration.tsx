import Navigation from "@/components/navigation";
import DataSourceManager from "@/components/data-source-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Zap, Shield, Globe } from "lucide-react";

export default function ApiIntegration() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">API Integration</h1>
          </div>
          <p className="text-slate-600">
            Connect external APIs to provide dynamic data sources for your forms
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                External APIs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">REST</div>
              <div className="text-sm text-blue-700">GET & POST support</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-800 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">4 Types</div>
              <div className="text-sm text-green-700">Bearer, API Key, Basic, None</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-purple-800 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Dynamic Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">Real-time</div>
              <div className="text-sm text-purple-700">Live data binding</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-orange-800 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Field Mapping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">Flexible</div>
              <div className="text-sm text-orange-700">Custom response mapping</div>
            </CardContent>
          </Card>
        </div>

        {/* Data Source Manager */}
        <DataSourceManager />

        {/* How It Works */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How External API Integration Works</CardTitle>
            <CardDescription>
              Configure external data sources to populate dropdowns, lookup tables, and validation lists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Configure API</h3>
                <p className="text-sm text-gray-600">
                  Set up your external API endpoint with authentication and response mapping
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Test Connection</h3>
                <p className="text-sm text-gray-600">
                  Validate your configuration and preview the data structure
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Use in Forms</h3>
                <p className="text-sm text-gray-600">
                  Bind data sources to dropdown fields and lookup components in your forms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predefined Data Sources */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Available Demo Data Sources</CardTitle>
            <CardDescription>
              Try these pre-configured data sources to get started quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">JSONPlaceholder Users</h4>
                <p className="text-sm text-gray-600 mb-2">Demo user data for testing</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">jsonplaceholder-users</code>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">World Countries</h4>
                <p className="text-sm text-gray-600 mb-2">List of all countries worldwide</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">rest-countries</code>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Sample Posts</h4>
                <p className="text-sm text-gray-600 mb-2">Demo blog posts for testing</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">jsonplaceholder-posts</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}