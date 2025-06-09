import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Type, 
  AlignLeft, 
  CheckSquare, 
  List, 
  Calendar, 
  Upload, 
  Table, 
  Square, 
  Play, 
  RotateCcw, 
  X, 
  AlertTriangle,
  Trash2,
  Settings,
  ChevronRight,
  Moon,
  Sun,
  Users,
  Maximize,
  Minimize,
  HelpCircle,
  ArrowRight,
  ArrowDown,
  Mail,
  Share,
  Plus,
  Code,
  Package,
  Save,
  FileUp,
  Download,
  Database,
  Eye,
  ChevronDown,
  ChevronUp,
  Search,
  Home
} from 'lucide-react';

// Model Dropdown Selector Component
function ModelDropdownSelector({ 
  models, 
  selectedModel, 
  onSelectModel, 
  isLoading, 
  isDarkMode 
}: {
  models: any[];
  selectedModel: string;
  onSelectModel: (model: string) => void;
  isLoading: boolean;
  isDarkMode: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (modelName: string) => {
    onSelectModel(modelName);
    setIsOpen(false);
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading models...</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Select Model/Table
      </Label>
      
      <div className="relative mt-2">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full justify-between ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : ''}`}
        >
          <span>{selectedModel || 'Choose a model...'}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        {isOpen && (
          <div className={`absolute z-50 w-full mt-1 border rounded-md shadow-lg ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}>
            {/* Search Input */}
            <div className="p-3 border-b">
              <div className="relative">
                <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>🔍</div>
                <Input
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : ''}`}
                />
              </div>
            </div>

            {/* Models List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredModels.length === 0 ? (
                <div className={`p-4 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No models found
                </div>
              ) : (
                filteredModels.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => handleSelect(model.name)}
                    className={`w-full text-left p-3 hover:bg-opacity-75 transition-colors border-b last:border-b-0 ${
                      selectedModel === model.name
                        ? (isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900')
                        : (isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-50')
                    }`}
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className={`text-xs mt-1 ${
                      selectedModel === model.name
                        ? (isDarkMode ? 'text-blue-200' : 'text-blue-700')
                        : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                    }`}>
                      {model.displayName}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {selectedModel && (
        <div className={`mt-3 p-2 rounded ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-800'}`}>
          <div className="flex items-center text-sm">
            <Database className="w-4 h-4 mr-2" />
            Selected: {selectedModel}
          </div>
        </div>
      )}
    </div>
  );
}

interface FormField {
  Id: string;
  Type: string;
  Label: string;
  DataField: string;
  Entity: string;
  Width: string;
  Spacing: string;
  Required: boolean;
  Inline: boolean;
  Outlined: boolean;
  Value: string;
  ChildFields?: FormField[];
}

const ComponentCategories = {
  text: {
    name: 'Text Input',
    icon: Type,
    color: 'blue',
    components: {
      TEXT: { icon: Type, label: 'Text Input', color: 'blue' },
      TEXTAREA: { icon: AlignLeft, label: 'Text Area', color: 'green' }
    }
  },
  selection: {
    name: 'Selection',
    icon: List,
    color: 'orange',
    components: {
      SELECT: { icon: List, label: 'Select', color: 'orange' },
      CHECKBOX: { icon: CheckSquare, label: 'Checkbox', color: 'cyan' },
      RADIOGRP: { icon: CheckSquare, label: 'Radio Group', color: 'purple' }
    }
  },
  datetime: {
    name: 'Date & Time',
    icon: Calendar,
    color: 'purple',
    components: {
      DATEPICKER: { icon: Calendar, label: 'Date Picker', color: 'purple' }
    }
  },
  file: {
    name: 'Files',
    icon: Upload,
    color: 'red',
    components: {
      FILEUPLOAD: { icon: Upload, label: 'File Upload', color: 'pink' }
    }
  },
  lookup: {
    name: 'Lookup',
    icon: Search,
    color: 'indigo',
    components: {
      GRIDLKP: { icon: Table, label: 'Grid Lookup', color: 'indigo' },
      LSTLKP: { icon: Search, label: 'List Lookup', color: 'teal' }
    }
  },
  layout: {
    name: 'Layout',
    icon: Square,
    color: 'gray',
    components: {
      GROUP: { icon: Square, label: 'Group', color: 'violet' }
    }
  },
  actions: {
    name: 'Actions',
    icon: Play,
    color: 'red',
    components: {
      ACTION: { icon: Play, label: "Action Button", color: 'red' },
      WARNING: { icon: AlertTriangle, label: 'Warning', color: 'yellow' }
    }
  },
  models: {
    name: 'Models',
    icon: Database,
    color: 'emerald',
    components: {
      MODELVIEWER: { icon: Database, label: 'Model Viewer', color: 'emerald' }
    }
  }
};

// Flatten for compatibility
const ComponentTypes = Object.values(ComponentCategories).reduce((acc, category) => {
  return { ...acc, ...category.components };
}, {} as Record<string, { icon: any; label: string; color: string }>);

function DraggableComponent({ componentType, label, icon: Icon, color, isDarkMode = false }: {
  componentType: string;
  label: string;
  icon: any;
  color: string;
  isDarkMode?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const getColorClasses = () => {
    if (isDarkMode) {
      return {
        bg: 'bg-gray-700 hover:bg-gray-600',
        border: 'border-gray-500 hover:border-gray-400',
        text: 'text-gray-200',
        icon: 'text-gray-300'
      };
    }
    return {
      bg: `bg-${color}-50 hover:bg-${color}-100`,
      border: `border-${color}-200 hover:border-${color}-400`,
      text: 'text-gray-900',
      icon: `text-${color}-600`
    };
  };

  const getIconBackgroundClass = (color: string, isDarkMode: boolean) => {
    if (isDarkMode) {
      return 'bg-gray-600';
    }
    
    const colorMap = {
      'blue': 'bg-blue-600',
      'green': 'bg-green-600',
      'orange': 'bg-orange-600',
      'cyan': 'bg-cyan-600',
      'purple': 'bg-purple-600',
      'pink': 'bg-pink-600',
      'indigo': 'bg-indigo-600',
      'teal': 'bg-teal-600',
      'violet': 'bg-violet-600',
      'red': 'bg-red-600',
      'yellow': 'bg-yellow-600',
      'gray': 'bg-gray-600'
    };
    
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-600';
  };

  const classes = getColorClasses();
  
  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('componentType', componentType);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Calculate offset for better drag feedback
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // Create custom drag image for better visual feedback
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(2deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, dragOffset.x, dragOffset.y);
    
    // Remove the temporary drag image after a short delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);
  }, [componentType, dragOffset.x, dragOffset.y]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        relative p-1 border border-solid rounded cursor-move transition-all duration-200
        hover:shadow-lg hover:scale-105 active:scale-95
        ${isDragging ? 'opacity-60 rotate-1 scale-95' : ''}
        ${classes.bg} ${classes.border}
        group
      `}
    >
      <div className="flex items-center space-x-1.5">
        <div className={`
          relative w-5 h-5 rounded-sm flex items-center justify-center transition-all duration-200
          ${getIconBackgroundClass(color, isDarkMode)}
          ${isDragging ? 'animate-pulse' : ''}
        `}>
          <Icon className="w-2.5 h-2.5 text-white" />
        </div>
        <span className={`text-xs font-medium truncate ${classes.text}`}>{label}</span>
      </div>
      
      {/* Hover overlay with grab cursor indicator */}
      <div className={`
        absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200
        ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}
        pointer-events-none
      `}>
        <div className="absolute top-1 right-1">
          <div className={`
            w-4 h-4 rounded-full flex items-center justify-center
            ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}
          `}>
            <div className="w-2 h-2 grid grid-cols-2 gap-0.5">
              <div className={`w-0.5 h-0.5 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} />
              <div className={`w-0.5 h-0.5 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} />
              <div className={`w-0.5 h-0.5 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} />
              <div className={`w-0.5 h-0.5 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelViewerComponent({ 
  field, 
  isSelected, 
  onSelect, 
  onRemove, 
  isDarkMode 
}: {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  isDarkMode: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(field.Entity || '');
  const [isDataViewOpen, setIsDataViewOpen] = useState(false);

  const { data: modelsData, isLoading: isModelsLoading } = useQuery({
    queryKey: ['/api/models'],
    enabled: isDialogOpen
  });

  const { data: tableData, isLoading: isTableLoading } = useQuery({
    queryKey: ['/api/table-data', field.Entity],
    enabled: isDataViewOpen && !!field.Entity
  });

  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName);
  };



  return (
    <>
      <div
        onClick={onSelect}
        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
          isSelected
            ? isDarkMode ? 'border-blue-400 bg-blue-900/20' : 'border-blue-500 bg-blue-50'
            : isDarkMode ? 'border-gray-600 hover:border-gray-500 bg-gray-800' : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : ''}`}>Model Viewer</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 h-6 w-6 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
        
        <div className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {field.Entity ? `Selected Model: ${field.Entity}` : 'No model selected'}
        </div>
        
        <div className="space-y-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsDialogOpen(true);
            }}
            size="sm"
            variant="outline"
            className={`w-full ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
          >
            <Database className="w-4 h-4 mr-2" />
            {field.Entity ? 'Change Model' : 'Select Model'}
          </Button>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsDataViewOpen(true);
            }}
            size="sm"
            variant="outline"
            className={`w-full ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
            disabled={!field.Entity}
          >
            <Table className="w-4 h-4 mr-2" />
            View Database Table
          </Button>
        </div>
      </div>

      {/* Model Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`max-w-md ${isDarkMode ? 'bg-gray-800 border-gray-600' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : ''}>Select Database Model</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : ''}`}>Select Model/Table</Label>
            
            {isModelsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm mt-2">Loading models...</p>
              </div>
            ) : (
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {((modelsData as any)?.models || []).map((model: any) => (
                  <button
                    key={model.name}
                    onClick={() => handleModelSelect(model.name)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selectedModel === model.name
                        ? isDarkMode ? 'bg-blue-900/30 border-blue-400 text-blue-300' : 'bg-blue-100 border-blue-300 text-blue-900'
                        : isDarkMode ? 'hover:bg-gray-700 border-gray-600 text-gray-300' : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {model.displayName}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedModel && (
              <div className={`mt-3 p-2 rounded ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-800'}`}>
                <div className="flex items-center text-sm">
                  <Database className="w-4 h-4 mr-2" />
                  Selected: {selectedModel}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedModel) {
                  field.Entity = selectedModel;
                  setIsDialogOpen(false);
                }
              }}
              disabled={!selectedModel}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Select Model
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Data View Dialog */}
      <Dialog open={isDataViewOpen} onOpenChange={setIsDataViewOpen}>
        <DialogContent className={`max-w-6xl max-h-[80vh] ${isDarkMode ? 'bg-gray-800 border-gray-600' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : ''}>
              Database Table: {field.Entity}
            </DialogTitle>
          </DialogHeader>
          
          <div className="overflow-auto max-h-96">
            {field.Entity && (
              <div className={`border rounded-lg ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                {isTableLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading table data...</p>
                  </div>
                ) : tableData ? (
                  <div>
                    <div className={`p-3 border-b ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {(tableData as any).queryName || field.Entity} Data
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                          {(tableData as any).data?.length || 0} records
                        </span>
                      </div>
                      {(tableData as any).message && (
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {(tableData as any).message}
                        </p>
                      )}
                    </div>
                    
                    <table className="w-full text-sm">
                      <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <tr>
                          {((tableData as any).columns || []).map((column: string) => (
                            <th key={column} className={`px-3 py-2 text-left font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className={isDarkMode ? 'text-gray-300' : ''}>
                        {((tableData as any).data || []).length > 0 ? (
                          ((tableData as any).data || []).map((row: any, index: number) => (
                            <tr key={index} className={`border-t ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                              {((tableData as any).columns || []).map((column: string) => (
                                <td key={column} className="px-3 py-2">
                                  {String(row[column] || '-')}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={((tableData as any).columns || []).length} className={`px-3 py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Ready to fetch data from GraphQL endpoint
                              <br />
                              <span className="text-xs">Query: {(tableData as any).graphqlQuery}</span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className={`p-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p>No data available for {field.Entity}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDataViewOpen(false)}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FieldComponent({ 
  field, 
  onSelect, 
  onRemove, 
  onMoveUp,
  onMoveDown,
  isSelected,
  addField,
  isDarkMode,
  selectedField,
  setSelectedField,
  removeChildField
}: { 
  field: FormField; 
  onSelect: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isSelected: boolean;
  addField: (type: string, groupId?: string) => void;
  isDarkMode: boolean;
  selectedField: FormField | null;
  setSelectedField: (field: FormField | null) => void;
  removeChildField: (groupId: string, childFieldId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  if (field.Type === 'GROUP') {
    return (
      <GroupField 
        field={field} 
        onSelect={onSelect} 
        onRemove={onRemove} 
        isSelected={isSelected}
        addField={addField}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isDarkMode={isDarkMode}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        removeChildField={removeChildField}
      />
    );
  }

  const componentType = ComponentTypes[field.Type as keyof typeof ComponentTypes];
  const Icon = componentType?.icon || Type;
  const color = componentType?.color || 'gray';

  // Special rendering for MODELVIEWER
  if (field.Type === 'MODELVIEWER') {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState<string>(field.Entity || '');
    const [displayModel, setDisplayModel] = useState<string>(field.Entity || '');

    const { data: modelsData, isLoading: isModelsLoading } = useQuery({
      queryKey: ['/api/models'],
      enabled: isDialogOpen
    });

    return (
      <>
        <div
          onClick={onSelect}
          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
            isSelected
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-sm">Model Viewer</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp();
                }}
                className="p-1 h-6 w-6 text-gray-400 hover:text-blue-500"
                title="Move up"
              >
                <ChevronUp className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown();
                }}
                className="p-1 h-6 w-6 text-gray-400 hover:text-blue-500"
                title="Move down"
              >
                <ChevronDown className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-1 h-6 w-6 text-gray-400 hover:text-red-500"
                title="Remove"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="mb-3">
            {displayModel ? (
              <div className="p-2 bg-green-50 border border-green-200 rounded">
                <div className="flex items-center text-sm text-green-800">
                  <Database className="w-4 h-4 mr-2" />
                  <span className="font-medium">Selected Model:</span>
                  <span className="ml-1 font-semibold">{displayModel}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                No model selected
              </div>
            )}
          </div>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsDialogOpen(true);
            }}
            size="sm"
            variant="outline"
            className="w-full"
          >
            <Database className="w-4 h-4 mr-2" />
            {field.Entity ? 'Change Model' : 'Select Model'}
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Model</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <Label className="text-sm font-medium">Select Model/Table</Label>
              
              {isModelsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm mt-2">Loading models...</p>
                </div>
              ) : (
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  {((modelsData as any)?.models || []).map((model: any) => (
                    <button
                      key={model.name}
                      onClick={() => setSelectedModel(model.name)}
                      className={`w-full text-left p-3 rounded border transition-colors ${
                        selectedModel === model.name
                          ? 'bg-blue-100 border-blue-300 text-blue-900'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-gray-500">
                        {model.displayName}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedModel && (
                <div className="mt-3 p-2 rounded bg-green-50 text-green-800">
                  <div className="flex items-center text-sm">
                    <Database className="w-4 h-4 mr-2" />
                    Selected: {selectedModel}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedModel) {
                    field.Entity = selectedModel;
                    setDisplayModel(selectedModel);
                    setIsDialogOpen(false);
                  }
                }}
                disabled={!selectedModel}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Select Model
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`p-3 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? `border-blue-500 ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-50'}`
          : `${isDarkMode ? 'border-gray-600 hover:border-gray-500 bg-gray-700' : 'border-gray-200 hover:border-gray-300 bg-white'}`
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`w-4 h-4 text-${color}-600`} />
          <div>
            <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{field.Label || field.Id}</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{field.Type}</div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
          >
            <ChevronUp className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
          >
            <ChevronDown className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function GroupField({
  field,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  isSelected,
  addField,
  isExpanded,
  setIsExpanded,
  isDarkMode,
  selectedField,
  setSelectedField,
  removeChildField,
  updateFieldInFormData
}: {
  field: FormField;
  onSelect: () => void;
  onRemove: () => void;
  isSelected: boolean;
  addField: (type: string, groupId?: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isDarkMode: boolean;
  selectedField: FormField | null;
  setSelectedField: (field: FormField | null) => void;
  removeChildField: (groupId: string, childFieldId: string) => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
        isSelected
          ? `border-blue-500 ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-50'}`
          : `${isDarkMode ? 'bg-purple-900/20 border-purple-600 hover:border-purple-500' : 'bg-purple-50 border-purple-200 hover:border-purple-300'}`
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Square className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center space-x-2"
          >
            {isExpanded ? <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`} /> : <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`} />}
            <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>GROUP</span>
          </button>
          <div className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
            {(field.ChildFields || []).length} items
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {isExpanded && (
        <div 
          data-group-drop="true"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event from bubbling to main form
            const componentType = e.dataTransfer.getData('componentType');
            if (componentType) {
              console.log('Adding component to group:', componentType, 'Group ID:', field.Id);
              addField(componentType, field.Id);
            }
          }}
          className={`group-drop-zone min-h-24 p-4 border-2 border-dashed rounded transition-colors ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-700 hover:border-blue-500 hover:bg-blue-900/20' 
              : 'border-gray-200 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          {(field.ChildFields || []).length === 0 ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              <Square className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Glissez des composants ici</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(field.ChildFields || []).map((childField) => (
                <div
                  key={childField.Id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedField(childField);
                  }}
                  className={`p-3 border rounded shadow-sm cursor-pointer transition-all hover:shadow-md ${
                    selectedField?.Id === childField.Id
                      ? isDarkMode 
                        ? 'bg-blue-600 border-blue-500' 
                        : 'bg-blue-50 border-blue-300'
                      : isDarkMode 
                        ? 'bg-gray-600 border-gray-500 hover:bg-gray-550' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        childField.Type === 'TEXT' ? 'bg-blue-500' :
                        childField.Type === 'SELECT' ? 'bg-orange-500' :
                        childField.Type === 'CHECKBOX' ? 'bg-cyan-500' :
                        childField.Type === 'GRIDLKP' ? 'bg-green-500' :
                        childField.Type === 'LSTLKP' ? 'bg-purple-500' :
                        childField.Type === 'ACTION' ? 'bg-red-500' :
                        childField.Type === 'WARNING' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        selectedField?.Id === childField.Id
                          ? isDarkMode ? 'text-white' : 'text-blue-700'
                          : isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {childField.Label || 'Unnamed Component'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        selectedField?.Id === childField.Id
                          ? isDarkMode ? 'text-blue-200 bg-blue-700' : 'text-blue-600 bg-blue-200'
                          : isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-100'
                      }`}>
                        {childField.Type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const childIndex = (field.ChildFields || []).findIndex(f => f.Id === childField.Id);
                          if (childIndex > 0) {
                            const updatedChildren = [...(field.ChildFields || [])];
                            [updatedChildren[childIndex], updatedChildren[childIndex - 1]] = 
                            [updatedChildren[childIndex - 1], updatedChildren[childIndex]];
                            updateFieldInFormData(field.Id, { ChildFields: updatedChildren });
                          }
                        }}
                        disabled={(field.ChildFields || []).findIndex(f => f.Id === childField.Id) === 0}
                        className={`h-6 w-6 p-0 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const childIndex = (field.ChildFields || []).findIndex(f => f.Id === childField.Id);
                          if (childIndex < (field.ChildFields || []).length - 1) {
                            const updatedChildren = [...(field.ChildFields || [])];
                            [updatedChildren[childIndex], updatedChildren[childIndex + 1]] = 
                            [updatedChildren[childIndex + 1], updatedChildren[childIndex]];
                            updateFieldInFormData(field.Id, { ChildFields: updatedChildren });
                          }
                        }}
                        disabled={(field.ChildFields || []).findIndex(f => f.Id === childField.Id) === (field.ChildFields || []).length - 1}
                        className={`h-6 w-6 p-0 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedField(childField);
                        }}
                        className={`h-6 w-6 p-0 ${
                          isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'
                        }`}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeChildField(field.Id, childField.Id);
                        }}
                        className={`h-6 w-6 p-0 ${
                          isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-600'
                        }`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Component preview/summary */}
                  <div className={`mt-2 text-xs ${
                    selectedField?.Id === childField.Id
                      ? isDarkMode ? 'text-blue-200' : 'text-blue-600'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {childField.DataField && `Field: ${childField.DataField}`}
                    {childField.Required && ' • Required'}
                    {childField.Width && ` • Width: ${childField.Width}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PropertiesPanel({ field, onUpdate }: { 
  field: FormField; 
  onUpdate: (updates: Partial<FormField>) => void;
}) {
  const renderTypeSpecificProperties = () => {
    switch (field.Type) {
      case 'TEXTAREA':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Textarea Properties</h4>
            
            <div>
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="Tapez votre texte ici..."
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-rows">Rows</Label>
              <Input
                id="field-rows"
                value={field.Value || "3"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="3"
                className="text-sm"
                type="number"
                min="2"
                max="10"
              />
            </div>
          </div>
        );

      case 'SELECT':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Select Properties</h4>
            
            <div>
              <Label htmlFor="field-options">Options</Label>
              <Textarea
                id="field-options"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="Option1,Option2,Option3"
                className="text-sm"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="field-multiple">Type</Label>
              <Input
                id="field-multiple"
                value={field.Value || "single"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="single ou multiple"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'GRIDLKP':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Grid Lookup Properties</h4>
            
            <div>
              <Label htmlFor="field-source">Source Table</Label>
              <Input
                id="field-source"
                value={field.Entity}
                onChange={(e) => onUpdate({ Entity: e.target.value })}
                placeholder="Table ou vue source"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-columns">Display Columns</Label>
              <Textarea
                id="field-columns"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="Col1,Col2,Col3"
                className="text-sm"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="field-filter">Filter Expression</Label>
              <Input
                id="field-filter"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="WHERE condition"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'LSTLKP':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">List Lookup Properties</h4>
            
            <div>
              <Label htmlFor="field-lookup-table">Lookup Table</Label>
              <Input
                id="field-lookup-table"
                value={field.Entity}
                onChange={(e) => onUpdate({ Entity: e.target.value })}
                placeholder="LookupTable"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-display-field">Display Field</Label>
              <Input
                id="field-display-field"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="DisplayColumn"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-value-field">Value Field</Label>
              <Input
                id="field-value-field"
                value={field.DataField}
                onChange={(e) => onUpdate({ DataField: e.target.value })}
                placeholder="ValueColumn"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'DATEPICKER':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Date Picker Properties</h4>
            
            <div>
              <Label htmlFor="field-format">Date Format</Label>
              <Input
                id="field-format"
                value={field.Value || "dd/MM/yyyy"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="dd/MM/yyyy"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-minDate">Min Date</Label>
              <Input
                id="field-minDate"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="01/01/2020"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-maxDate">Max Date</Label>
              <Input
                id="field-maxDate"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="31/12/2030"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'ACTION':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Action Properties</h4>
            
            <div>
              <Label htmlFor="field-actionType">Action Type</Label>
              <Input
                id="field-actionType"
                value={field.Value || "submit"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="submit, reset, cancel, custom"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-url">URL/Endpoint</Label>
              <Input
                id="field-url"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="/api/submit"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-method">HTTP Method</Label>
              <Input
                id="field-method"
                value={field.Value || "POST"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="GET, POST, PUT, DELETE"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'WARNING':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Warning Properties</h4>
            
            <div>
              <Label htmlFor="field-message">Message</Label>
              <Textarea
                id="field-message"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="Message d'avertissement"
                className="text-sm"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="field-severity">Severity</Label>
              <Input
                id="field-severity"
                value={field.Value || "warning"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="info, warning, error, success"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'MODELVIEWER':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Model Viewer Properties</h4>
            
            <div>
              <Label htmlFor="field-model">Model Name</Label>
              <Input
                id="field-model"
                value={field.Entity || ""}
                onChange={(e) => onUpdate({ Entity: e.target.value })}
                placeholder="Select model (e.g., Users, Secrty)"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-display-mode">Display Mode</Label>
              <Input
                id="field-display-mode"
                value={field.Value || "popup"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="popup, inline, modal"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-button-text">Button Text</Label>
              <Input
                id="field-button-text"
                value={field.Label}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="View Model Properties"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'GROUP':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Group Properties</h4>
            
            <div>
              <Label htmlFor="field-groupTitle">Group Title</Label>
              <Input
                id="field-groupTitle"
                value={field.Label}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Titre du groupe"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-collapsible">Behavior</Label>
              <Input
                id="field-collapsible"
                value={field.Value || "static"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="static, collapsible, accordion"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-childCount">Child Fields Count</Label>
              <Input
                id="field-childCount"
                value={(field.ChildFields || []).length.toString()}
                readOnly
                className="text-sm bg-gray-100"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Properties</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="layout">Mise en page</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div>
              <Label htmlFor="field-label">Label</Label>
              <Input
                id="field-label"
                value={field.Label}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Nom du champ"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-datafield">Data Field</Label>
              <Input
                id="field-datafield"
                value={field.DataField}
                onChange={(e) => onUpdate({ DataField: e.target.value })}
                placeholder="nom_colonne"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-entity">Entity</Label>
              <Input
                id="field-entity"
                value={field.Entity}
                onChange={(e) => onUpdate({ Entity: e.target.value })}
                placeholder="TableName"
                className="text-sm"
              />
            </div>

            <Separator className="my-4" />
            
            {renderTypeSpecificProperties()}
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div>
              <Label>Width</Label>
              <Input
                value={field.Width}
                onChange={(e) => onUpdate({ Width: e.target.value })}
                placeholder="100%"
                className="text-sm"
              />
            </div>

            <div>
              <Label>Spacing</Label>
              <Input
                value={field.Spacing}
                onChange={(e) => onUpdate({ Spacing: e.target.value })}
                placeholder="md"
                className="text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="field-inline"
                checked={field.Inline}
                onChange={(e) => onUpdate({ Inline: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="field-inline">Inline</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="field-outlined"
                checked={field.Outlined}
                onChange={(e) => onUpdate({ Outlined: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="field-outlined">Outlined</Label>
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="field-required"
                checked={field.Required}
                onChange={(e) => onUpdate({ Required: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="field-required">Required</Label>
            </div>

            <div>
              <Label htmlFor="field-minLength">Min Length</Label>
              <Input
                id="field-minLength"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="0"
                className="text-sm"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="field-maxLength">Max Length</Label>
              <Input
                id="field-maxLength"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="255"
                className="text-sm"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="field-pattern">Pattern (Regex)</Label>
              <Input
                id="field-pattern"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="^[a-zA-Z0-9]+$"
                className="text-sm"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// JSON Validator Component
function JsonValidator({ formData, customComponents, isDarkMode }: {
  formData: any;
  customComponents: any[];
  isDarkMode: boolean;
}) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const validateForm = (data: any) => {
    const errors: string[] = [];
    const warns: string[] = [];

    // MenuID validation
    if (!data.menuId || data.menuId.trim() === '') {
      errors.push('MenuID is required');
    } else if (!/^[A-Z0-9_]+$/.test(data.menuId)) {
      errors.push('MenuID must contain only uppercase letters, numbers and underscores');
    }

    // Label validation
    if (!data.label || data.label.trim() === '') {
      errors.push('Form label is required');
    }

    // Width validation
    if (!data.formWidth || !data.formWidth.match(/^\d+(px|%|em|rem)$/)) {
      errors.push('FormWidth must be a valid CSS value (e.g. 700px, 100%)');
    }

    // Fields validation
    if (!data.fields || !Array.isArray(data.fields)) {
      errors.push('Form must contain an array of fields');
    } else {
      data.fields.forEach((field: any, index: number) => {
        const fieldPrefix = `Field ${index + 1}`;

        // Required properties validation
        if (!field.Id) errors.push(`${fieldPrefix}: ID is required`);
        if (!field.Type) errors.push(`${fieldPrefix}: Type is required`);
        if (!field.Label) errors.push(`${fieldPrefix}: Label is required`);
        if (!field.DataField) errors.push(`${fieldPrefix}: DataField is required`);

        // Component types validation
        const validTypes = [...Object.keys(ComponentTypes), ...customComponents.map(c => c.id)];
        if (field.Type && !validTypes.includes(field.Type)) {
          errors.push(`${fieldPrefix}: Type "${field.Type}" is not valid`);
        }

        // Unique IDs validation
        const duplicateIds = data.fields.filter((f: any) => f.Id === field.Id);
        if (duplicateIds.length > 1) {
          errors.push(`${fieldPrefix}: ID "${field.Id}" is duplicated`);
        }

        // Unique DataFields validation
        const duplicateDataFields = data.fields.filter((f: any) => f.DataField === field.DataField);
        if (duplicateDataFields.length > 1) {
          warns.push(`${fieldPrefix}: DataField "${field.DataField}" is duplicated`);
        }

        // Type-specific validation
        if (field.Type === 'GROUP' && field.ChildFields && field.ChildFields.length === 0) {
          warns.push(`${fieldPrefix}: Empty group (no child fields)`);
        }

        if (field.Type === 'SELECT' && !field.Value) {
          warns.push(`${fieldPrefix}: SELECT without defined options`);
        }

        // Required properties validation
        if (field.Required && typeof field.Required !== 'boolean') {
          errors.push(`${fieldPrefix}: Required must be true or false`);
        }

        if (field.Width && !field.Width.match(/^\d+(px|%|em|rem)$/)) {
          errors.push(`${fieldPrefix}: Width must be a valid CSS value`);
        }
      });
    }

    return { errors, warns };
  };

  useEffect(() => {
    const { errors, warns } = validateForm(formData);
    setValidationErrors(errors);
    setWarnings(warns);
  }, [formData, customComponents]);

  const jsonString = JSON.stringify(formData, null, 2);
  const isValid = validationErrors.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          JSON Schema with Validation
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {isValid ? 'Valid' : `${validationErrors.length} error(s)`}
          </span>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-600' : 'bg-red-50 border-red-200'}`}>
          <h4 className={`font-medium mb-2 flex items-center ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Validation Errors
          </h4>
          <ul className="space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-yellow-900/20 border-yellow-600' : 'bg-yellow-50 border-yellow-200'}`}>
          <h4 className={`font-medium mb-2 flex items-center ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Warnings
          </h4>
          <ul className="space-y-1">
            {warnings.map((warning, index) => (
              <li key={index} className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                • {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* JSON Display */}
      <div className="relative">
        <Textarea
          value={jsonString}
          readOnly
          className={`h-96 text-xs font-mono ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : ''}`}
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${
          isValid 
            ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
            : (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')
        }`}>
          {jsonString.split('\n').length} lignes
        </div>
      </div>

      {/* Statistiques */}
      <div className={`grid grid-cols-3 gap-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formData.fields?.length || 0}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Fields
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {customComponents.length}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Custom Components
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {Math.round(jsonString.length / 1024 * 100) / 100}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            KB
          </div>
        </div>
      </div>
    </div>
  );
}

// Tutorial System Component
function TutorialDialog({ isOpen, onClose, step, onNextStep, onPrevStep, totalSteps, isDarkMode }: {
  isOpen: boolean;
  onClose: () => void;
  step: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  totalSteps: number;
  isDarkMode: boolean;
}) {
  const tutorialSteps = [
    {
      title: "Welcome to Form Builder",
      content: "This tutorial will guide you through all the features of the form generator. You'll learn to create complex forms with real-time validation.",
      highlight: null,
      action: "Let's start!"
    },
    {
      title: "Component Palette",
      content: "On the left, you'll find the component palette organized by categories: Input, Selection, Date, Files, etc. Drag and drop components into the construction area.",
      highlight: "palette",
      action: "Drag a TEXT component"
    },
    {
      title: "Construction Area",
      content: "In the center is the construction area where you assemble your form. Components can be reorganized by drag and drop.",
      highlight: "builder",
      action: "Drop your component here"
    },
    {
      title: "Properties Panel",
      content: "On the right, the properties panel allows you to configure each selected component: label, validation, style, etc.",
      highlight: "properties",
      action: "Click on a component"
    },
    {
      title: "JSON Validator",
      content: "The JSON tab displays the generated schema in real-time with automatic validation. Errors and warnings are highlighted.",
      highlight: "json",
      action: "Check the validation"
    },
    {
      title: "Custom Components",
      content: "You can create your own components via the '+' icon. Use JSON or the visual creator to define reusable components.",
      highlight: "custom",
      action: "Create a component"
    },
    {
      title: "Save and Collaboration",
      content: "Use the New/Clear/Save buttons to manage your forms. Invite collaborators to work together in real-time.",
      highlight: "actions",
      action: "Save your work"
    }
  ];

  const currentStep = tutorialSteps[step];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className={`text-xl ${isDarkMode ? 'text-white' : ''}`}>
              {currentStep.title}
            </DialogTitle>
            <div className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
              {step + 1} / {totalSteps}
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {currentStep.content}
          </div>

          {currentStep.highlight && (
            <div className={`p-4 rounded-lg border-l-4 ${isDarkMode ? 'bg-blue-900/20 border-blue-600' : 'bg-blue-50 border-blue-400'}`}>
              <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                <ArrowRight className="w-4 h-4" />
                <span className="font-medium">{currentStep.action}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={onPrevStep}
              disabled={step === 0}
              className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
            >
              Précédent
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === step 
                      ? (isDarkMode ? 'bg-blue-400' : 'bg-blue-600')
                      : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
                  }`}
                />
              ))}
            </div>

            {step === totalSteps - 1 ? (
              <Button onClick={onClose}>
                Terminer
              </Button>
            ) : (
              <Button onClick={onNextStep}>
                Suivant
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Step-by-Step Guidance System
function StepByStepGuide({ isDarkMode }: { isDarkMode: boolean }) {
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const steps = {
    welcome: {
      title: "Welcome to FormBuilder Enterprise",
      content: "Let's get you started with creating professional forms. This guide will walk you through each step.",
      nextStep: "create-form",
      actions: [
        { label: "Start Building", action: () => setCurrentStep("create-form") },
        { label: "Skip Guide", action: () => setIsOpen(false) }
      ]
    },
    "create-form": {
      title: "Step 1: Create Your Form",
      content: "Begin by setting up your form's basic information. Give it a meaningful name and configure the layout.",
      nextStep: "add-components",
      actions: [
        { label: "Next: Add Components", action: () => setCurrentStep("add-components") },
        { label: "Previous", action: () => setCurrentStep("welcome") }
      ]
    },
    "add-components": {
      title: "Step 2: Add Form Components",
      content: "Drag components from the left panel into your form. Start with basic inputs like text fields and selections.",
      nextStep: "configure-properties",
      actions: [
        { label: "Next: Configure Properties", action: () => setCurrentStep("configure-properties") },
        { label: "Previous", action: () => setCurrentStep("create-form") }
      ]
    },
    "configure-properties": {
      title: "Step 3: Configure Component Properties",
      content: "Select any component to configure its properties on the right panel. Set labels, validation rules, and styling.",
      nextStep: "save-form",
      actions: [
        { label: "Next: Save Your Work", action: () => setCurrentStep("save-form") },
        { label: "Previous", action: () => setCurrentStep("add-components") }
      ]
    },
    "save-form": {
      title: "Step 4: Save Your Form",
      content: "Click the Save button to store your form. You can always come back to edit it later from the dashboard.",
      nextStep: null,
      actions: [
        { label: "Finish Guide", action: () => setIsOpen(false) },
        { label: "Previous", action: () => setCurrentStep("configure-properties") }
      ]
    }
  };

  const currentStepData = currentStep ? steps[currentStep as keyof typeof steps] : null;

  const startGuide = () => {
    setCurrentStep("welcome");
    setIsOpen(true);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={startGuide}
        className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        Guide
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`max-w-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          {currentStepData && (
            <>
              <DialogHeader>
                <DialogTitle className={isDarkMode ? 'text-white' : ''}>
                  {currentStepData.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {currentStepData.content}
                </p>
                
                <div className="flex justify-between items-center pt-4">
                  {currentStepData.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={index === 0 ? "default" : "outline"}
                      onClick={action.action}
                      className={index === 1 && isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function FormBuilderFixed() {
  const { formId } = useParams<{ formId?: string }>();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    id: null as number | null,
    menuId: `FORM_${Date.now()}`,
    label: 'Mon Formulaire',
    formWidth: '700px',
    layout: 'PROCESS',
    fields: [] as FormField[]
  });

  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [customComponents, setCustomComponents] = useState<any[]>([]);
  const [newComponentConfig, setNewComponentConfig] = useState<{
    name: string;
    label: string;
    icon: string;
    color: string;
    properties: string;
    dataField: string;
    entity: string;
    width: string;
    spacing: string;
    value: string;
    required: boolean;
    inline: boolean;
    outlined: boolean;
    placeholder: string;
    minLength: string;
    maxLength: string;
    options: string;
  }>({
    name: '',
    label: '',
    icon: 'Square',
    color: 'gray',
    properties: '',
    dataField: '',
    entity: '',
    width: '',
    spacing: '',
    value: '',
    required: false,
    inline: false,
    outlined: false,
    placeholder: '',
    minLength: '',
    maxLength: '',
    options: ''
  });
  const [componentCreationStep, setComponentCreationStep] = useState(1);
  const [showAddComponent, setShowAddComponent] = useState(false);

  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);
  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState(false);
  const [isDragZoneCollapsed, setIsDragZoneCollapsed] = useState(false);
  const formBuilderRef = useRef<HTMLDivElement>(null);

  // Load form data from API if formId is provided
  const { data: existingForm, isLoading: formLoading } = useQuery({
    queryKey: [`/api/forms/${formId}`],
    enabled: !!formId,
  });

  // Type for existing form data
  interface ExistingFormData {
    id: number;
    menuId: string;
    label: string;
    formWidth: string;
    layout: string;
    fields?: FormField[];
    formDefinition?: string;
  }

  // Clear form state when changing forms and load existing form data
  useEffect(() => {
    console.log('Form loading effect triggered:', { formId, existingForm, formLoading });
    
    if (formId && existingForm) {
      console.log('Loading existing form data:', existingForm);
      
      // Loading existing form - clear state and load form data
      let parsedFields: FormField[] = [];
      let parsedCustomComponents: any[] = [];
      
      try {
        if ((existingForm as any).formDefinition) {
          console.log('Found formDefinition:', (existingForm as any).formDefinition);
          const definition = JSON.parse((existingForm as any).formDefinition);
          parsedFields = Array.isArray(definition.fields) ? definition.fields : [];
          parsedCustomComponents = Array.isArray(definition.customComponents) ? definition.customComponents : [];
          console.log('Parsed fields and components:', { parsedFields, parsedCustomComponents });
        } else if (Array.isArray((existingForm as any).fields)) {
          console.log('Using legacy fields format:', (existingForm as any).fields);
          parsedFields = (existingForm as any).fields;
        }
      } catch (error) {
        console.error('Error parsing form definition:', error);
        parsedFields = [];
        parsedCustomComponents = [];
      }
      
      const formDataToSet = {
        id: (existingForm as any).id,
        menuId: (existingForm as any).menuId || `FORM_${Date.now()}`,
        label: (existingForm as any).label || 'Mon Formulaire',
        formWidth: (existingForm as any).formWidth || '700px',
        layout: (existingForm as any).layout || 'PROCESS',
        fields: parsedFields
      };
      
      console.log('Setting form data:', formDataToSet);
      console.log('Setting custom components:', parsedCustomComponents);
      setFormData(formDataToSet);
      setSelectedField(null);
      setCustomComponents(parsedCustomComponents);
      
      // Force a re-render after a short delay to ensure state has updated
      setTimeout(() => {
        console.log('Current formData after setting:', formData);
        console.log('Current fields after setting:', formData.fields);
      }, 100);
    } else if (!formId) {
      console.log('Creating new form - resetting to default state');
      // Creating new form - reset to default state
      setFormData({
        id: null,
        menuId: `FORM_${Date.now()}`,
        label: 'Mon Formulaire',
        formWidth: '700px',
        layout: 'PROCESS',
        fields: []
      });
      setSelectedField(null);
      setCustomComponents([]);
    }
  }, [formId, existingForm]);

  const createDefaultField = (componentType: string): FormField => {
    const timestamp = Date.now();
    
    // Check if it's a custom component
    const customComponent = customComponents.find(comp => comp.id === componentType);
    
    return {
      Id: `${componentType}_${timestamp}`,
      Type: componentType,
      Label: customComponent ? customComponent.label : (ComponentTypes[componentType as keyof typeof ComponentTypes]?.label || componentType),
      DataField: `field_${timestamp}`,
      Entity: 'TableName',
      Width: '100%',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: false,
      Value: customComponent ? JSON.stringify(customComponent.properties) : '',
      ChildFields: componentType === 'GROUP' ? [] : undefined
    };
  };

  // Clean up duplicate components that appear both in groups and root level
  const cleanupDuplicateComponents = (fields: FormField[]): FormField[] => {
    const componentIdsInGroups = new Set<string>();
    
    // First pass: collect all component IDs that are inside groups
    fields.forEach(field => {
      if (field.Type === 'GROUP' && field.ChildFields) {
        field.ChildFields.forEach(child => {
          componentIdsInGroups.add(child.Id);
        });
      }
    });
    
    // Second pass: remove root-level components that also exist in groups
    return fields.filter(field => {
      if (field.Type === 'GROUP') {
        return true; // Keep all groups
      }
      return !componentIdsInGroups.has(field.Id); // Remove if exists in a group
    });
  };

  const addField = (componentType: string, targetGroupId?: string) => {
    const newField = createDefaultField(componentType);
    
    if (targetGroupId) {
      // Adding to a specific group
      setFormData(prev => {
        const updatedFields = prev.fields.map(field => {
          if (field.Id === targetGroupId) {
            return {
              ...field,
              ChildFields: [...(field.ChildFields || []), newField]
            };
          }
          return field;
        });
        
        // Clean up any duplicates after adding to group
        return {
          ...prev,
          fields: cleanupDuplicateComponents(updatedFields)
        };
      });
    } else {
      // Adding to main form
      setFormData(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));
    }
    
    setSelectedField(newField);
    
    // Auto-save after adding a component
    if (formData.id) {
      setTimeout(() => {
        saveFormMutation.mutate();
      }, 500);
    }
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= formData.fields.length) return;
    
    setFormData(prev => {
      const newFields = [...prev.fields];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);
      
      return {
        ...prev,
        fields: newFields
      };
    });
    
    // Auto-save after moving
    if (formData.id) {
      setTimeout(() => {
        saveFormMutation.mutate();
      }, 500);
    }
  };

  const removeField = (fieldId: string) => {
    const removeFieldRecursive = (fields: FormField[]): FormField[] => {
      return fields.filter(field => field.Id !== fieldId).map(field => {
        if (field.ChildFields && field.ChildFields.length > 0) {
          return {
            ...field,
            ChildFields: removeFieldRecursive(field.ChildFields)
          };
        }
        return field;
      });
    };

    setFormData(prev => ({
      ...prev,
      fields: removeFieldRecursive(prev.fields)
    }));
    
    if (selectedField?.Id === fieldId) {
      setSelectedField(null);
    }
    
    // Auto-save after removing a component
    if (formData.id) {
      setTimeout(() => {
        saveFormMutation.mutate();
      }, 500);
    }
  };

  const removeChildField = (groupId: string, childFieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => {
        if (field.Id === groupId && field.ChildFields) {
          return {
            ...field,
            ChildFields: field.ChildFields.filter(child => child.Id !== childFieldId)
          };
        }
        return field;
      })
    }));

    if (selectedField?.Id === childFieldId) {
      setSelectedField(null);
    }
    
    // Auto-save after removing a child component
    if (formData.id) {
      setTimeout(() => {
        saveFormMutation.mutate();
      }, 500);
    }
  };

  const updateFieldInFormData = (fieldId: string, updates: Partial<FormField>) => {
    const updateFieldRecursive = (fields: FormField[]): FormField[] => {
      return fields.map(field => {
        if (field.Id === fieldId) {
          return { ...field, ...updates };
        }
        if (field.ChildFields && field.ChildFields.length > 0) {
          return {
            ...field,
            ChildFields: updateFieldRecursive(field.ChildFields)
          };
        }
        return field;
      });
    };

    setFormData(prev => ({
      ...prev,
      fields: updateFieldRecursive(prev.fields)
    }));

    if (selectedField?.Id === fieldId) {
      setSelectedField(prev => prev ? { ...prev, ...updates } : null);
    }
    
    // Auto-save after updating field properties
    if (formData.id) {
      setTimeout(() => {
        saveFormMutation.mutate();
      }, 1000);
    }
  };

  const addCollaborator = () => {
    if (collaboratorEmail && !collaborators.includes(collaboratorEmail)) {
      setCollaborators([...collaborators, collaboratorEmail]);
      setCollaboratorEmail('');
    }
  };

  const removeCollaborator = (email: string) => {
    setCollaborators(collaborators.filter(c => c !== email));
  };

  // Method 1: JSON Configuration for External Components
  const addComponentFromJSON = (jsonConfig: string) => {
    try {
      const config = JSON.parse(jsonConfig);
      if (!config.name || !config.label) {
        alert('Le nom et le label sont requis dans la configuration JSON');
        return;
      }
      
      const newComponent = {
        id: config.name.toUpperCase(),
        name: config.name,
        label: config.label,
        icon: config.icon || 'Square',
        color: config.color || 'gray',
        properties: config.properties || {},
        isCustom: true
      };
      
      // Check if component already exists
      if (customComponents.some(comp => comp.id === newComponent.id)) {
        alert('Un composant avec ce nom existe déjà');
        return;
      }
      
      setCustomComponents(prev => [...prev, newComponent]);
      alert('Composant ajouté avec succès !');
    } catch (error) {
      console.error('Invalid JSON configuration:', error);
      alert('Configuration JSON invalide. Vérifiez la syntaxe.');
    }
  };

  // Reset component creation form
  const resetComponentCreation = () => {
    setNewComponentConfig({ 
      name: '', 
      label: '', 
      icon: 'Square', 
      color: 'gray',
      properties: '',
      dataField: '',
      entity: '',
      width: '',
      spacing: '',
      value: '',
      required: false,
      inline: false,
      outlined: false,
      placeholder: '',
      minLength: '',
      maxLength: '',
      options: ''
    } as typeof newComponentConfig);
    setComponentCreationStep(1);
  };

  // Method 2: Form-based Component Creator
  const addComponentFromForm = () => {
    if (!newComponentConfig.name || !newComponentConfig.label) return;
    
    const properties = {
      // Propriétés de base
      dataField: newComponentConfig.dataField || '',
      entity: newComponentConfig.entity || 'TableName',
      width: newComponentConfig.width || '100%',
      spacing: newComponentConfig.spacing || 'md',
      value: newComponentConfig.value || '',
      
      // Options booléennes
      required: newComponentConfig.required || false,
      inline: newComponentConfig.inline || false,
      outlined: newComponentConfig.outlined || false,
      
      // Propriétés spécifiques
      placeholder: newComponentConfig.placeholder || '',
      minLength: newComponentConfig.minLength ? parseInt(newComponentConfig.minLength) : undefined,
      maxLength: newComponentConfig.maxLength ? parseInt(newComponentConfig.maxLength) : undefined,
      options: newComponentConfig.options ? newComponentConfig.options.split('\n').filter(opt => opt.trim()) : []
    };

    const newComponent = {
      id: newComponentConfig.name.toUpperCase(),
      name: newComponentConfig.name,
      label: newComponentConfig.label,
      icon: newComponentConfig.icon,
      color: newComponentConfig.color,
      properties: properties,
      isCustom: true
    };
    
    setCustomComponents(prev => [...prev, newComponent]);
    resetComponentCreation();
    setShowAddComponent(false);
  };

  const removeCustomComponent = (componentId: string) => {
    setCustomComponents(prev => prev.filter(comp => comp.id !== componentId));
  };

  // Create new form function
  const createNewForm = () => {
    if (confirm('Êtes-vous sûr de vouloir créer un nouveau formulaire ? Les modifications non sauvegardées seront perdues.')) {
      setFormData({
        id: null,
        menuId: `FORM_${Date.now()}`,
        label: 'Mon Formulaire',
        formWidth: '700px',
        layout: 'PROCESS',
        fields: []
      });
      setSelectedField(null);
      setCustomComponents([]);
      localStorage.removeItem('formBuilder_backup');
    }
  };

  // Reset form function (clear fields only)
  const resetForm = () => {
    if (confirm('Êtes-vous sûr de vouloir vider le formulaire ? Tous les champs seront supprimés.')) {
      setFormData(prev => ({
        ...prev,
        fields: []
      }));
      setSelectedField(null);
      
      // Auto-save after clearing
      if (formData.id) {
        setTimeout(() => {
          saveFormMutation.mutate();
        }, 500);
      }
    }
  };

  // Save form mutation
  const saveFormMutation = useMutation({
    mutationFn: async () => {
      const formToSave = {
        menuId: formData.menuId,
        label: formData.label,
        formWidth: formData.formWidth,
        layout: formData.layout,
        formDefinition: JSON.stringify({
          fields: formData.fields,
          customComponents: customComponents
        })
      };

      const url = formData.id ? `/api/forms/${formData.id}` : '/api/forms';
      const method = formData.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formToSave),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      return response.json();
    },
    onSuccess: (savedForm) => {
      // Update the form ID if it was a new form
      if (!formData.id && savedForm.id) {
        setFormData(prev => ({ ...prev, id: savedForm.id }));
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
    },
    onError: (error) => {
      console.error('Error saving form:', error);
      alert('Erreur lors de la sauvegarde du formulaire');
    }
  });

  // Manual save form function with confirmation
  const saveFormManually = () => {
    saveFormMutation.mutate(undefined, {
      onSuccess: () => {
        alert('Formulaire sauvegardé avec succès !');
      }
    });
  };



  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // JSON Import functionality
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content);
          
          // Validate JSON structure
          if (parsedData.fields && Array.isArray(parsedData.fields)) {
            setImportedData(parsedData);
            setShowImportDialog(true);
          } else {
            alert('Invalid format: The file must contain a valid form definition with "fields" array');
          }
        } catch (error) {
          alert('Parse error: Invalid JSON file format');
        }
      };
      reader.readAsText(file);
    }
    // Reset input value to allow same file selection
    event.target.value = '';
  };

  const handleImportJSON = () => {
    if (importedData) {
      // Process and normalize imported fields
      const processedFields = (importedData.fields || []).map((field: any) => {
        // Ensure each field has a unique ID and proper structure
        return {
          Id: field.Id || field.id || `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          Type: field.Type || field.type || 'TEXT',
          Label: field.Label || field.label || 'Imported Field',
          DataField: field.DataField || field.dataField || field.Label || field.label || 'field',
          Entity: field.Entity || field.entity || '',
          Width: field.Width || field.width || '100%',
          Spacing: field.Spacing || field.spacing || '4',
          Required: Boolean(field.Required || field.required),
          Inline: Boolean(field.Inline || field.inline),
          Outlined: Boolean(field.Outlined || field.outlined),
          Value: field.Value || field.value || '',
          ChildFields: field.ChildFields || field.childFields || []
        };
      });

      console.log('Importing fields:', processedFields);
      console.log('Current formData before import:', formData);
      
      setFormData(prev => {
        const newFormData = {
          ...prev,
          fields: processedFields
        };
        console.log('New formData after import:', newFormData);
        return newFormData;
      });
      
      if (importedData.customComponents) {
        setCustomComponents(importedData.customComponents);
      }
      
      setShowImportDialog(false);
      setImportedData(null);
      setSelectedField(null);
      
      // Auto-save if form exists
      if (formData.id) {
        setTimeout(() => {
          saveFormMutation.mutate();
        }, 500);
      }
    }
  };

  // JSON Export functionality
  const handleExportJSON = () => {
    const exportData = {
      formMetadata: {
        menuId: formData.menuId,
        label: formData.label,
        formWidth: formData.formWidth,
        layout: formData.layout,
        exportedAt: new Date().toISOString()
      },
      fields: formData.fields,
      customComponents: customComponents
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.label.replace(/[^a-zA-Z0-9]/g, '_')}_form_definition.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`border-b px-6 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">F</span>
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>FormBuilder</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Enterprise</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Home Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/'}
              className={`flex items-center space-x-2 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Button>
            
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Fullscreen Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullScreen}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>

            <StepByStepGuide isDarkMode={isDarkMode} />

            {/* Import/Export JSON */}
            <div className="flex space-x-2">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="json-file-input"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('json-file-input')?.click()}
                className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJSON}
                className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Add External Components */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  External Components
                </Button>
              </DialogTrigger>
              <DialogContent className={`max-w-3xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <DialogHeader>
                  <DialogTitle className={isDarkMode ? 'text-white' : ''}>Assistant de création de composant</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="json" className="w-full">
                  <TabsList className={`grid w-full grid-cols-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                    <TabsTrigger value="json" className={isDarkMode ? 'data-[state=active]:bg-gray-600 text-gray-300' : ''}>
                      <Code className="w-4 h-4 mr-2" />
                      JSON Configuration
                    </TabsTrigger>
                    <TabsTrigger value="form" className={isDarkMode ? 'data-[state=active]:bg-gray-600 text-gray-300' : ''}>
                      <Package className="w-4 h-4 mr-2" />
                      Visual Creator
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="json" className="space-y-4">
                    <div>
                      <Label className={isDarkMode ? 'text-gray-300' : ''}>Configuration JSON du composant:</Label>
                      <Textarea
                        data-json-input
                        placeholder={`{
  "name": "customInput",
  "label": "Input Personnalisé",
  "icon": "Type",
  "color": "blue",
  "properties": {
    "placeholder": "Texte par défaut",
    "validation": "required",
    "maxLength": 255
  }
}`}
                        className={`h-48 text-xs font-mono ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      />
                    </div>
                    <Button onClick={() => {
                      const textarea = document.querySelector('[data-json-input]') as HTMLTextAreaElement;
                      if (textarea?.value) {
                        addComponentFromJSON(textarea.value);
                        textarea.value = '';
                      }
                    }}>
                      <Code className="w-4 h-4 mr-2" />
                      Ajouter depuis JSON
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="form" className="space-y-4">
                    <div className="space-y-6">
                      {/* Progress indicator */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                step <= componentCreationStep 
                                  ? 'bg-blue-600 text-white' 
                                  : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                              }`}>
                                {step}
                              </div>
                              {step < 4 && (
                                <div className={`w-8 h-0.5 mx-2 ${
                                  step < componentCreationStep 
                                    ? 'bg-blue-600' 
                                    : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                                }`} />
                              )}
                            </div>
                          ))}
                        </div>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Étape {componentCreationStep} sur 4
                        </span>
                      </div>

                      {/* Step 1: Basic Information */}
                      {componentCreationStep === 1 && (
                        <div className="space-y-4">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Informations de base
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Nom du composant</Label>
                              <Input
                                placeholder="customButton"
                                value={newComponentConfig.name}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, name: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Label d'affichage</Label>
                              <Input
                                placeholder="Bouton Personnalisé"
                                value={newComponentConfig.label}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, label: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Icône</Label>
                              <Input
                                placeholder="Square"
                                value={newComponentConfig.icon}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, icon: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Couleur</Label>
                              <Input
                                placeholder="gray"
                                value={newComponentConfig.color}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, color: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Database Configuration */}
                      {componentCreationStep === 2 && (
                        <div className="space-y-4">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Configuration Base de données
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Data Field</Label>
                              <Input
                                placeholder="field_name"
                                value={newComponentConfig.dataField}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, dataField: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Entity</Label>
                              <Input
                                placeholder="TableName"
                                value={newComponentConfig.entity}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, entity: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                          </div>
                          <div>
                            <Label className={isDarkMode ? 'text-gray-300' : ''}>Valeur par défaut</Label>
                            <Input
                              placeholder="Default value"
                              value={newComponentConfig.value}
                              onChange={(e) => setNewComponentConfig(prev => ({ ...prev, value: e.target.value }))}
                              className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 3: Layout & Style */}
                      {componentCreationStep === 3 && (
                        <div className="space-y-4">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Mise en page et Style
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Width</Label>
                              <Input
                                placeholder="100%"
                                value={newComponentConfig.width}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, width: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Spacing</Label>
                              <Input
                                placeholder="md"
                                value={newComponentConfig.spacing}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, spacing: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="required"
                                checked={newComponentConfig.required}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, required: e.target.checked }))}
                                className="rounded"
                              />
                              <Label htmlFor="required" className={isDarkMode ? 'text-gray-300' : ''}>Required</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="inline"
                                checked={newComponentConfig.inline}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, inline: e.target.checked }))}
                                className="rounded"
                              />
                              <Label htmlFor="inline" className={isDarkMode ? 'text-gray-300' : ''}>Inline</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="outlined"
                                checked={newComponentConfig.outlined}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, outlined: e.target.checked }))}
                                className="rounded"
                              />
                              <Label htmlFor="outlined" className={isDarkMode ? 'text-gray-300' : ''}>Outlined</Label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 4: Advanced Properties */}
                      {componentCreationStep === 4 && (
                        <div className="space-y-4">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Propriétés avancées
                          </h4>
                          <div>
                            <Label className={isDarkMode ? 'text-gray-300' : ''}>Placeholder</Label>
                            <Input
                              placeholder="Texte d'aide"
                              value={newComponentConfig.placeholder}
                              onChange={(e) => setNewComponentConfig(prev => ({ ...prev, placeholder: e.target.value }))}
                              className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Min Length</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={newComponentConfig.minLength}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, minLength: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Max Length</Label>
                              <Input
                                type="number"
                                placeholder="255"
                                value={newComponentConfig.maxLength}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, maxLength: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                          </div>
                          <div>
                            <Label className={isDarkMode ? 'text-gray-300' : ''}>Options (pour select/radio)</Label>
                            <Textarea
                              placeholder="Option 1&#10;Option 2&#10;Option 3"
                              value={newComponentConfig.options}
                              onChange={(e) => setNewComponentConfig(prev => ({ ...prev, options: e.target.value }))}
                              className={`h-20 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                            />
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Une option par ligne
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Navigation buttons */}
                      <div className="flex justify-between pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (componentCreationStep > 1) {
                              setComponentCreationStep(componentCreationStep - 1);
                            }
                          }}
                          disabled={componentCreationStep === 1}
                          className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                        >
                          Précédent
                        </Button>
                        
                        {componentCreationStep < 4 ? (
                          <Button
                            onClick={() => setComponentCreationStep(componentCreationStep + 1)}
                            disabled={componentCreationStep === 1 && (!newComponentConfig.name || !newComponentConfig.label)}
                          >
                            Suivant
                          </Button>
                        ) : (
                          <Button
                            onClick={addComponentFromForm}
                            disabled={!newComponentConfig.name || !newComponentConfig.label}
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Créer le Composant
                          </Button>
                        )}
                      </div>
                    </div>

                  </TabsContent>
                </Tabs>
                
                {customComponents.length > 0 && (
                  <div className="mt-6">
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Composants Personnalisés:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {customComponents.map((component, index) => (
                        <div key={index} className={`flex items-center justify-between p-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full bg-${component.color}-500`} />
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{component.label}</span>
                            <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-500 bg-gray-200'}`}>{component.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomComponent(component.id)}
                            className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Collaboration */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Collaborer ({collaborators.length})
                </Button>
              </DialogTrigger>
              <DialogContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <DialogHeader>
                  <DialogTitle className={isDarkMode ? 'text-white' : ''}>Gestion des Collaborateurs</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Email du collaborateur"
                      value={collaboratorEmail}
                      onChange={(e) => setCollaboratorEmail(e.target.value)}
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                    <Button onClick={addCollaborator} size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Inviter
                    </Button>
                  </div>
                  
                  {collaborators.length > 0 && (
                    <div className="space-y-2">
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Collaborateurs actifs:</h4>
                      {collaborators.map((email, index) => (
                        <div key={index} className={`flex items-center justify-between p-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{email}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCollaborator(email)}
                            className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={createNewForm}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetForm}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button 
              size="sm" 
              onClick={saveFormManually}
              disabled={saveFormMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {saveFormMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>


      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div className={`${isPaletteCollapsed ? 'w-12' : 'w-72'} border-r overflow-y-auto transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} ${isPaletteCollapsed ? 'hidden' : 'block'}`}>Components</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaletteCollapsed(!isPaletteCollapsed)}
                className={`h-6 w-6 p-0 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {isPaletteCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
            </div>
            {!isPaletteCollapsed && (
              <div className="space-y-2">
                {Object.entries(ComponentCategories).map(([categoryKey, category]) => (
                  <div key={categoryKey} className="space-y-1">
                    <div className={`flex items-center space-x-2 text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <category.icon className="w-3 h-3" />
                      <span>{category.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 pl-2">
                      {Object.entries(category.components).map(([type, config]) => (
                        <DraggableComponent
                          key={type}
                          componentType={type}
                          label={(config as any).label}
                          icon={(config as any).icon}
                          color={(config as any).color}
                          isDarkMode={isDarkMode}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {customComponents.length > 0 && (
              <>
                <Separator className="my-4" />
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Custom Components</h3>
                <div className="grid grid-cols-1 gap-2">
                  {customComponents.map((component) => (
                    <div
                      key={component.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('componentType', component.id);
                      }}
                      className={`p-3 border-2 border-dashed rounded-lg cursor-move transition-all hover:shadow-md ${
                        isDarkMode 
                          ? `bg-${component.color}-900/20 border-${component.color}-600 hover:border-${component.color}-500`
                          : `bg-${component.color}-50 border-${component.color}-200 hover:border-${component.color}-400`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded bg-${component.color}-600 flex items-center justify-center`}>
                            <Package className="w-3 h-3 text-white" />
                          </div>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {component.label}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          CUSTOM
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className={`rounded-lg border h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : ''}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Construction Zone</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDragZoneCollapsed(!isDragZoneCollapsed)}
                  className={`h-6 w-6 p-0 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  {isDragZoneCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                </Button>
              </div>
            </div>
            {!isDragZoneCollapsed && (
              <div 
                ref={formBuilderRef}
                className="p-6"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  
                  // Check if the drop event originated from a group drop zone
                  const target = e.target as HTMLElement;
                  const isDroppedOnGroup = target.closest('[data-group-drop]') || 
                                          target.hasAttribute('data-group-drop') ||
                                          target.closest('.group-drop-zone');
                  
                  console.log('Construction zone drop - target:', target, 'isDroppedOnGroup:', isDroppedOnGroup);
                  
                  // Only add to main form if NOT dropped on a group
                  if (!isDroppedOnGroup) {
                    const componentType = e.dataTransfer.getData('componentType');
                    if (componentType) {
                      console.log('Adding component to main form:', componentType);
                      addField(componentType);
                    }
                  }
                }}
              >
              {formData.fields.length === 0 ? (
                <div className={`text-center py-16 border-2 border-dashed rounded-lg ${isDarkMode ? 'text-gray-400 border-gray-600' : 'text-gray-400 border-gray-300'}`}>
                  <Type className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Start Building</p>
                  <p className="text-sm">Drag components here to create your form</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.fields.map((field, index) => (
                    <FieldComponent
                      key={field.Id}
                      field={field}
                      onSelect={() => setSelectedField(field)}
                      onRemove={() => removeField(field.Id)}
                      onMoveUp={() => moveField(index, index - 1)}
                      onMoveDown={() => moveField(index, index + 1)}
                      isSelected={selectedField?.Id === field.Id}
                      addField={addField}
                      isDarkMode={isDarkMode}
                      selectedField={selectedField}
                      setSelectedField={setSelectedField}
                      removeChildField={removeChildField}
                    />
                  ))}
                </div>
              )}
              </div>
            )}
          </div>
        </div>

        <div className={`w-80 border-l overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <Tabs defaultValue="properties" className="h-full">
            <TabsList className={`grid w-full grid-cols-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
              <TabsTrigger value="properties" className={isDarkMode ? 'data-[state=active]:bg-gray-600 text-gray-300' : ''}>Properties</TabsTrigger>
              <TabsTrigger value="json" className={isDarkMode ? 'data-[state=active]:bg-gray-600 text-gray-300' : ''}>JSON</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="h-full">
              {selectedField ? (
                <PropertiesPanel
                  field={selectedField}
                  onUpdate={(updates) => updateFieldInFormData(selectedField.Id, updates)}
                />
              ) : (
                <div className={`p-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a component to view its properties</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="json" className="h-full p-4">
              <JsonValidator formData={formData} customComponents={customComponents} isDarkMode={isDarkMode} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Import JSON Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className={`max-w-2xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : ''}>Import JSON Form Definition</DialogTitle>
          </DialogHeader>
          
          {importedData && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Form Preview
                </h4>
                <div className="space-y-2 text-sm">
                  <div className={`flex justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span>Fields:</span>
                    <span>{importedData.fields?.length || 0}</span>
                  </div>
                  <div className={`flex justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span>Custom Components:</span>
                    <span>{importedData.customComponents?.length || 0}</span>
                  </div>
                </div>
              </div>

              {importedData.fields && importedData.fields.length > 0 && (
                <div className={`max-h-64 overflow-y-auto border rounded-lg ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className={`p-3 border-b ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                    <h5 className="font-medium">Field List</h5>
                  </div>
                  <div className="p-3 space-y-2">
                    {importedData.fields.map((field: any, index: number) => (
                      <div key={index} className={`flex items-center justify-between p-2 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {field.Label || field.label || 'Unnamed Field'}
                          </span>
                          <span className={`ml-2 text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-500 text-gray-200' : 'bg-gray-200 text-gray-600'}`}>
                            {field.Type || field.type || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowImportDialog(false)}
                  className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                >
                  Cancel
                </Button>
                <Button onClick={handleImportJSON}>
                  Import Form
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}