import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Database, Table, Search, Check, X, Grid3X3 } from "lucide-react";
import { REAL_MFACT_MODELS, getMFactModel, getModelsByCategory, getCategories, type MFactColumn, type MFactModel } from '@/lib/mfact-models-parser';

interface MFactModelSelectorProps {
  value?: string;
  selectedColumns?: MFactColumn[];
  onModelSelect: (model: string) => void;
  onColumnsSelect: (columns: MFactColumn[]) => void;
  trigger?: React.ReactNode;
}

export default function MFactModelSelector({
  value,
  selectedColumns = [],
  onModelSelect,
  onColumnsSelect,
  trigger
}: MFactModelSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState<MFactModel | null>(null);
  const [columns, setColumns] = useState<MFactColumn[]>(selectedColumns);

  // Initialize with selected model if value is provided
  React.useEffect(() => {
    if (value) {
      const model = getMFactModel(value);
      if (model) {
        setSelectedModel(model);
        setColumns(selectedColumns.length > 0 ? selectedColumns : model.columns);
      }
    }
  }, [value, selectedColumns]);

  const categories = getCategories();

  const filteredModels = (categoryFilter: string) => {
    let models = categoryFilter === 'all' ? REAL_MFACT_MODELS : getModelsByCategory(categoryFilter);
    
    if (searchTerm) {
      models = models.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return models;
  };

  const handleModelSelect = (model: MFactModel) => {
    setSelectedModel(model);
    const modelColumns = model.columns.map(col => ({ ...col }));
    setColumns(modelColumns);
    onModelSelect(model.name);
  };

  const handleColumnToggle = (index: number, field: keyof MFactColumn, value: any) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = { ...updatedColumns[index], [field]: value };
    setColumns(updatedColumns);
    onColumnsSelect(updatedColumns);
  };

  const addColumn = () => {
    const newColumn: MFactColumn = {
      DataField: 'NewField',
      Caption: 'New Field',
      DataType: 'String',
      Visible: true
    };
    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    onColumnsSelect(updatedColumns);
  };

  const removeColumn = (index: number) => {
    const updatedColumns = columns.filter((_, i) => i !== index);
    setColumns(updatedColumns);
    onColumnsSelect(updatedColumns);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            MFact Model and Columns Selection
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 h-full">
          {/* Left Panel - Model Selection */}
          <div className="w-1/2 space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search for a model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category === 'Accounting' ? 'Accounting' : 
                     category === 'Purchasing' ? 'Purchasing' : 
                     category === 'Finance' ? 'Finance' : 
                     category === 'Security' ? 'Security' :
                     category === 'General' ? 'General' : category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {filteredModels('all').map((model) => (
                      <div
                        key={model.name}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedModel?.name === model.name 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleModelSelect(model)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{model.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {model.category}
                              </Badge>
                            </div>
                            <h4 className="font-medium text-blue-600 mb-1">
                              {model.displayName}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {model.description}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <Table className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {model.columns.length} columns
                              </span>
                            </div>
                          </div>
                          {selectedModel?.name === model.name && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {categories.map(category => (
                <TabsContent key={category} value={category} className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {filteredModels(category).map((model) => (
                        <div
                          key={model.name}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedModel?.name === model.name 
                              ? 'border-blue-500 bg-blue-50 shadow-md' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => handleModelSelect(model)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">{model.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {model.category}
                                </Badge>
                              </div>
                              <h4 className="font-medium text-blue-600 mb-1">
                                {model.displayName}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {model.description}
                              </p>
                              <div className="flex items-center gap-1 mt-2">
                                <Table className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {model.columns.length} columns
                                </span>
                              </div>
                            </div>
                            {selectedModel?.name === model.name && (
                              <Check className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Right Panel - Column Configuration */}
          <div className="w-1/2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Column Configuration</h3>
              {selectedModel && (
                <Badge variant="outline" className="text-sm">
                  {selectedModel.displayName}
                </Badge>
              )}
            </div>

            {selectedModel ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Configure columns for the {selectedModel.name} model
                  </span>
                  <Button 
                    size="sm" 
                    onClick={addColumn}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Grid3X3 className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>

                <ScrollArea className="h-[450px]">
                  <div className="space-y-3">
                    {columns.map((column, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={column.Visible}
                              onCheckedChange={(checked) => 
                                handleColumnToggle(index, 'Visible', checked)
                              }
                            />
                            <span className="font-medium text-sm">
                              {column.Visible ? (
                                <div className="flex items-center gap-1">
                                  <Check className="w-3 h-3 text-green-600" />
                                  <span className="text-green-700">Visible</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <X className="w-3 h-3 text-gray-400" />
                                  <span className="text-gray-500">Hidden</span>
                                </div>
                              )}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeColumn(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Caption</label>
                            <Input
                              value={column.Caption}
                              onChange={(e) => handleColumnToggle(index, 'Caption', e.target.value)}
                              className="text-sm h-8"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">DataField</label>
                            <Input
                              value={column.DataField}
                              onChange={(e) => handleColumnToggle(index, 'DataField', e.target.value)}
                              className="text-sm h-8"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {column.DataType}
                          </Badge>
                          {column.Description && (
                            <span className="text-xs text-gray-500 truncate max-w-32">
                              {column.Description}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <Database className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  Select a Model
                </h3>
                <p className="text-sm text-gray-400">
                  Choose a MFact model from the left panel to configure its columns
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}