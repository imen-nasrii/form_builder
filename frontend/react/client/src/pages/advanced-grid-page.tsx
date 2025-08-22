import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/navigation';
import AdvancedGridBuilder from '@/components/advanced-grid-builder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { ArrowLeft, Grid3X3, Zap } from 'lucide-react';

export default function AdvancedGridPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Grid3X3 className="w-8 h-8 text-primary" />
          </div>
          <p className="text-slate-600">Loading Advanced Grid Builder...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    setLocation('/signin');
    return null;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <div className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation('/dashboard')}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                  </Button>
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Grid3X3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Advanced Grid Builder
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400">
                        Professional construction zone with dynamic grid system
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <Grid3X3 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">Dynamic Grid</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Add/remove rows & columns like Excel</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">Drag & Drop</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Precise component placement anywhere</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <Grid3X3 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">Professional</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Advanced layout capabilities</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? '☀️' : '🌙'} {isDarkMode ? 'Light' : 'Dark'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Builder */}
        <AdvancedGridBuilder isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}