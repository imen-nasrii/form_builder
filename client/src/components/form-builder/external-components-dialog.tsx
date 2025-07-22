import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  Search, 
  Download, 
  Upload, 
  Star, 
  Calendar, 
  Grid3X3, 
  Type, 
  CheckSquare,
  Settings,
  Plus,
  Trash2,
  Eye,
  Code,
  Palette,
  Zap,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExternalComponent {
  id: string;
  name: string;
  type: string;
  description: string;
  version: string;
  author: string;
  rating: number;
  downloads: number;
  category: string;
  icon: React.ComponentType<any>;
  template: any;
  tags: string[];
  premium: boolean;
}

// Predefined beautiful external components
const EXTERNAL_COMPONENTS: ExternalComponent[] = [
  {
    id: 'advanced-datepicker',
    name: 'Advanced Date Picker',
    type: 'DATEPICKER_ADV',
    description: 'Enhanced date picker with range selection, time zones, and custom formatting',
    version: '2.1.0',
    author: 'FormCraft Team',
    rating: 4.9,
    downloads: 12500,
    category: 'Input Controls',
    icon: Calendar,
    premium: false,
    tags: ['date', 'time', 'picker', 'advanced'],
    template: {
      Id: '',
      Type: 'DATEPICKER_ADV',
      Label: 'Advanced Date Picker',
      DataField: 'advanced_date',
      Entity: 'DateEntity',
      Width: '250px',
      Required: false,
      Inline: false,
      Outlined: true,
      Value: '',
      DateFormat: 'dd/MM/yyyy',
      ShowTime: true,
      TimeZone: 'UTC',
      MinDate: '',
      MaxDate: '',
      DisabledDates: [],
      RangeSelection: false,
      CustomValidation: '',
      Placeholder: 'Select date...',
      ReadOnly: false,
      AutoFocus: false
    }
  },
  {
    id: 'smart-grid',
    name: 'Smart Data Grid',
    type: 'SMART_GRID',
    description: 'Intelligent data grid with AI-powered sorting, filtering, and analytics',
    version: '3.0.1',
    author: 'DataViz Pro',
    rating: 4.8,
    downloads: 8900,
    category: 'Data Display',
    icon: Grid3X3,
    premium: true,
    tags: ['grid', 'data', 'smart', 'ai', 'analytics'],
    template: {
      Id: '',
      Type: 'SMART_GRID',
      Label: 'Smart Grid',
      DataField: 'smart_grid',
      Entity: 'GridEntity',
      Width: '100%',
      Required: false,
      Inline: false,
      Outlined: true,
      Columns: [],
      DataSource: '',
      SmartFiltering: true,
      AISort: true,
      Analytics: true,
      ExportFormats: ['CSV', 'Excel', 'PDF'],
      Pagination: true,
      PageSize: 25,
      VirtualScrolling: true,
      ColumnReordering: true,
      ColumnResizing: true,
      GroupBy: [],
      AggregateColumns: []
    }
  },
  {
    id: 'rich-text-editor',
    name: 'Rich Text Editor Pro',
    type: 'RICH_TEXT',
    description: 'Professional rich text editor with collaboration and media support',
    version: '1.8.2',
    author: 'EditorWorks',
    rating: 4.7,
    downloads: 15600,
    category: 'Input Controls',
    icon: Type,
    premium: true,
    tags: ['text', 'editor', 'rich', 'collaboration', 'media'],
    template: {
      Id: '',
      Type: 'RICH_TEXT',
      Label: 'Rich Text Editor',
      DataField: 'rich_text',
      Entity: 'TextEntity',
      Width: '100%',
      Required: false,
      Inline: false,
      Outlined: true,
      Value: '',
      Toolbar: ['bold', 'italic', 'underline', 'link', 'image', 'table'],
      MaxLength: 10000,
      EnableCollaboration: false,
      AutoSave: true,
      SpellCheck: true,
      Placeholder: 'Start writing...',
      Theme: 'modern',
      MediaUpload: true,
      CustomCSS: ''
    }
  },
  {
    id: 'signature-pad',
    name: 'Digital Signature Pad',
    type: 'SIGNATURE',
    description: 'Touch-friendly signature capture with verification and security features',
    version: '2.4.0',
    author: 'SecureSign',
    rating: 4.9,
    downloads: 9800,
    category: 'Specialized',
    icon: CheckSquare,
    premium: false,
    tags: ['signature', 'digital', 'security', 'verification'],
    template: {
      Id: '',
      Type: 'SIGNATURE',
      Label: 'Digital Signature',
      DataField: 'signature',
      Entity: 'SignatureEntity',
      Width: '400px',
      Required: false,
      Inline: false,
      Outlined: true,
      Value: '',
      CanvasWidth: 400,
      CanvasHeight: 200,
      PenColor: '#000000',
      BackgroundColor: '#ffffff',
      LineWidth: 2,
      EnableClear: true,
      EnableUndo: true,
      EnableRedo: true,
      SaveFormat: 'PNG',
      Timestamp: true,
      IPTracking: false,
      BiometricHash: false
    }
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    type: 'QR_CODE',
    description: 'Dynamic QR code generator with customizable styles and tracking',
    version: '1.5.1',
    author: 'QRMaster',
    rating: 4.6,
    downloads: 7200,
    category: 'Specialized',
    icon: Grid3X3,
    premium: false,
    tags: ['qr', 'code', 'generator', 'tracking', 'dynamic'],
    template: {
      Id: '',
      Type: 'QR_CODE',
      Label: 'QR Code',
      DataField: 'qr_code',
      Entity: 'QREntity',
      Width: '200px',
      Required: false,
      Inline: false,
      Outlined: true,
      Value: '',
      QRData: '',
      Size: 200,
      ErrorCorrection: 'M',
      ForegroundColor: '#000000',
      BackgroundColor: '#ffffff',
      Logo: '',
      LogoSize: 40,
      BorderSize: 4,
      Style: 'square',
      EnableTracking: false,
      ExpiryDate: ''
    }
  },
  {
    id: 'chart-widget',
    name: 'Interactive Charts',
    type: 'CHART_WIDGET',
    description: 'Beautiful interactive charts and graphs with real-time data binding',
    version: '2.9.0',
    author: 'ChartPro',
    rating: 4.8,
    downloads: 11400,
    category: 'Data Display',
    icon: Zap,
    premium: true,
    tags: ['chart', 'graph', 'interactive', 'data', 'visualization'],
    template: {
      Id: '',
      Type: 'CHART_WIDGET',
      Label: 'Interactive Chart',
      DataField: 'chart_data',
      Entity: 'ChartEntity',
      Width: '100%',
      Required: false,
      Inline: false,
      Outlined: true,
      ChartType: 'line',
      DataSource: '',
      XAxis: '',
      YAxis: '',
      Title: '',
      ShowLegend: true,
      ShowTooltips: true,
      Responsive: true,
      Animation: true,
      Theme: 'default',
      Colors: [],
      RealTimeUpdate: false,
      ExportOptions: ['PNG', 'SVG', 'PDF']
    }
  }
];

interface ExternalComponentsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddComponent: (component: any) => void;
  isDarkMode: boolean;
}

export default function ExternalComponentsDialog({
  isOpen,
  onOpenChange,
  onAddComponent,
  isDarkMode
}: ExternalComponentsDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredComponents, setFilteredComponents] = useState(EXTERNAL_COMPONENTS);
  const [activeTab, setActiveTab] = useState('browse');
  const [customComponent, setCustomComponent] = useState({
    name: '',
    type: '',
    description: '',
    template: ''
  });
  const { toast } = useToast();

  // Filter components based on search and category
  useEffect(() => {
    let filtered = EXTERNAL_COMPONENTS;

    if (searchTerm) {
      filtered = filtered.filter(comp =>
        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(comp => comp.category === selectedCategory);
    }

    setFilteredComponents(filtered);
  }, [searchTerm, selectedCategory]);

  const categories = ['All', ...Array.from(new Set(EXTERNAL_COMPONENTS.map(comp => comp.category)))];

  const handleAddComponent = (component: ExternalComponent) => {
    const newComponent = {
      ...component.template,
      Id: `${component.type}_${Date.now()}`,
      Label: component.name
    };

    onAddComponent(newComponent);
    
    toast({
      title: "Component Added!",
      description: `${component.name} has been added to your form`,
      variant: "default"
    });
  };

  const handleImportCustom = () => {
    try {
      const template = JSON.parse(customComponent.template);
      const newComponent = {
        ...template,
        Id: `CUSTOM_${Date.now()}`,
        Label: customComponent.name,
        Type: customComponent.type.toUpperCase()
      };

      onAddComponent(newComponent);
      
      toast({
        title: "Custom Component Imported!",
        description: `${customComponent.name} has been added to your form`,
        variant: "default"
      });

      setCustomComponent({ name: '', type: '', description: '', template: '' });
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Invalid JSON template format",
        variant: "destructive"
      });
    }
  };

  const ComponentCard = ({ component }: { component: ExternalComponent }) => (
    <Card className={`transition-all hover:shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              component.premium ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-blue-500'
            } text-white`}>
              <component.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {component.name}
                </CardTitle>
                {component.premium && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                v{component.version} by {component.author}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {component.rating}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {component.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {component.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4 text-gray-500" />
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {component.downloads.toLocaleString()}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {component.category}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Preview functionality
                toast({
                  title: "Preview",
                  description: `Previewing ${component.name}`,
                  variant: "default"
                });
              }}
            >
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={() => handleAddComponent(component)}
              className={component.premium 
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                : "bg-blue-500 hover:bg-blue-600"
              }
            >
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-6xl max-h-[90vh] overflow-hidden ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <DialogHeader>
          <DialogTitle className={`text-2xl flex items-center gap-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Package className="w-6 h-6" />
            </div>
            External Components Library
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className={`grid w-full grid-cols-3 ${isDarkMode ? 'bg-gray-700' : ''}`}>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Browse Components
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import Custom
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Create New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-4 h-[70vh] overflow-hidden">
            {/* Search and Filter Bar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search components, tags, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Category:</Label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-3 py-2 rounded-md border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Components Grid */}
            <div className="h-full overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
                {filteredComponents.map(component => (
                  <ComponentCard key={component.id} component={component} />
                ))}
              </div>
              
              {filteredComponents.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    No components found
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Try adjusting your search terms or category filter
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="import" className="mt-4">
            <div className="space-y-6">
              <div className="text-center">
                <Upload className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Import Custom Component
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Import your own component definitions from JSON templates
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : ''}>Component Name</Label>
                  <Input
                    value={customComponent.name}
                    onChange={(e) => setCustomComponent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter component name..."
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>

                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : ''}>Component Type</Label>
                  <Input
                    value={customComponent.type}
                    onChange={(e) => setCustomComponent(prev => ({ ...prev, type: e.target.value }))}
                    placeholder="e.g., CUSTOM_WIDGET"
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>

                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : ''}>Description</Label>
                  <Input
                    value={customComponent.description}
                    onChange={(e) => setCustomComponent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your component..."
                    className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>

                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : ''}>JSON Template</Label>
                  <Textarea
                    value={customComponent.template}
                    onChange={(e) => setCustomComponent(prev => ({ ...prev, template: e.target.value }))}
                    placeholder="Paste your JSON component template here..."
                    rows={10}
                    className={`font-mono text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                  />
                </div>

                <Button
                  onClick={handleImportCustom}
                  disabled={!customComponent.name || !customComponent.type || !customComponent.template}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Component
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-4">
            <div className="text-center py-12">
              <Code className="w-16 h-16 mx-auto text-blue-500 mb-4" />
              <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Component Creator
              </h3>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Visual component creator coming soon! Build custom components with our drag-and-drop interface.
              </p>
              <Button variant="outline">
                <Palette className="w-4 h-4 mr-2" />
                Request Early Access
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}