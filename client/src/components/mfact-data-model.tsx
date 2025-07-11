import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Table, 
  Key, 
  Link, 
  Shield, 
  AlertTriangle,
  Info,
  Calendar,
  User,
  Tag,
  BookOpen,
  Search,
  FileText
} from "lucide-react";
import { 
  MFACT_BUSINESS_MODELS, 
  getBusinessModelById,
  getBusinessModelsByCategory,
  type MFactBusinessModel,
  type BusinessTable,
  type BusinessField,
  type BusinessRelationship,
  type ModelValidation
} from "@shared/mfact-business-models";

interface MFactDataModelProps {
  selectedModel?: string;
  onModelSelect?: (modelId: string) => void;
  onTableSelect?: (tableName: string) => void;
  onFieldSelect?: (fieldName: string) => void;
}

export function MFactDataModel({ 
  selectedModel, 
  onModelSelect, 
  onTableSelect, 
  onFieldSelect 
}: MFactDataModelProps) {
  const [activeModel, setActiveModel] = useState<string>(selectedModel || '');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleModelSelect = (modelId: string) => {
    setActiveModel(modelId);
    setSelectedTable('');
    onModelSelect?.(modelId);
  };

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    onTableSelect?.(tableName);
  };

  const currentModel = activeModel ? getBusinessModelById(activeModel) : null;
  const currentTable = currentModel && selectedTable ? 
    currentModel.tables.find(t => t.name === selectedTable) : null;

  const filteredModels = MFACT_BUSINESS_MODELS.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFieldTypeColor = (type: string) => {
    switch (type) {
      case 'VARCHAR':
      case 'CHAR':
      case 'TEXT':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'INTEGER':
      case 'DECIMAL':
      case 'FLOAT':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'DATE':
      case 'DATETIME':
      case 'TIME':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'BOOLEAN':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'JSON':
      case 'BLOB':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ACCOUNTING':
        return 'bg-blue-500';
      case 'PURCHASING':
        return 'bg-green-500';
      case 'MASTER_DATA':
        return 'bg-purple-500';
      case 'CONFIGURATION':
        return 'bg-orange-500';
      case 'INVENTORY':
        return 'bg-red-500';
      case 'SALES':
        return 'bg-pink-500';
      case 'FINANCIAL':
        return 'bg-indigo-500';
      case 'REPORTING':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Model Selection Panel */}
      <div className="col-span-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              MFact Business Models
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {filteredModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      activeModel === model.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => handleModelSelect(model.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(model.category)}`} />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {model.name}
                        </h3>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {model.id}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {model.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Table className="w-3 h-3" />
                        {model.tables.length} tables
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {model.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Model Details Panel */}
      <div className="col-span-8">
        {currentModel ? (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${getCategoryColor(currentModel.category)}`} />
                  {currentModel.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{currentModel.metadata.version}</Badge>
                  <Badge variant="secondary">{currentModel.category}</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentModel.description}
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tables" className="h-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="tables">Tables</TabsTrigger>
                  <TabsTrigger value="relationships">Relationships</TabsTrigger>
                  <TabsTrigger value="validations">Validations</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>

                <TabsContent value="tables" className="mt-4">
                  <div className="grid grid-cols-5 gap-4">
                    {/* Tables List */}
                    <div className="col-span-2">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Table className="w-4 h-4" />
                        Tables ({currentModel.tables.length})
                      </h4>
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-2">
                          {currentModel.tables.map((table) => (
                            <div
                              key={table.name}
                              className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedTable === table.name
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                              }`}
                              onClick={() => handleTableSelect(table.name)}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Table className="w-4 h-4 text-blue-600" />
                                <h5 className="font-medium text-sm">{table.name}</h5>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                {table.label}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Key className="w-3 h-3" />
                                  {table.primaryKey}
                                </span>
                                <span>{table.fields.length} fields</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Table Details */}
                    <div className="col-span-3">
                      {currentTable ? (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              {currentTable.label}
                            </h4>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Key className="w-3 h-3" />
                              {currentTable.primaryKey}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {currentTable.description}
                          </p>
                          
                          <ScrollArea className="h-[350px]">
                            <div className="space-y-3">
                              {currentTable.fields.map((field) => (
                                <div
                                  key={field.name}
                                  className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                                  onClick={() => onFieldSelect?.(field.name)}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <h6 className="font-medium text-sm">{field.name}</h6>
                                      {field.required && (
                                        <Badge variant="destructive" className="text-xs">Required</Badge>
                                      )}
                                      {field.name === currentTable.primaryKey && (
                                        <Badge variant="default" className="text-xs flex items-center gap-1">
                                          <Key className="w-3 h-3" />
                                          PK
                                        </Badge>
                                      )}
                                    </div>
                                    <Badge className={`text-xs ${getFieldTypeColor(field.type)}`}>
                                      {field.type}
                                      {field.length && `(${field.length})`}
                                      {field.precision && field.scale && `(${field.precision},${field.scale})`}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    {field.label}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {field.description}
                                  </p>
                                  {field.defaultValue && (
                                    <div className="mt-2">
                                      <Badge variant="outline" className="text-xs">
                                        Default: {field.defaultValue}
                                      </Badge>
                                    </div>
                                  )}
                                  {field.lookupTable && (
                                    <div className="mt-2">
                                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                        <Link className="w-3 h-3" />
                                        Lookup: {field.lookupTable}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[400px] text-gray-500">
                          <div className="text-center">
                            <Table className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Select a table to view its details</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="relationships" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {currentModel.relationships.map((rel, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Link className="w-4 h-4 text-blue-600" />
                            <h5 className="font-medium">{rel.name}</h5>
                            <Badge variant="secondary" className="text-xs">{rel.type}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">From:</span>
                              <p className="font-medium">{rel.fromTable}.{rel.fromField}</p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">To:</span>
                              <p className="font-medium">{rel.toTable}.{rel.toField}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {rel.cardinality}
                          </Badge>
                        </div>
                      ))}
                      {currentModel.relationships.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          <Link className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No relationships defined for this model</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="validations" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {currentModel.validations.map((validation) => (
                        <div key={validation.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-orange-600" />
                              <h5 className="font-medium">{validation.name}</h5>
                            </div>
                            <Badge 
                              variant={validation.severity === 'ERROR' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {validation.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {validation.message}
                          </p>
                          <div className="text-xs space-y-1">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Type:</span>
                              <Badge variant="outline" className="ml-2 text-xs">{validation.type}</Badge>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Tables:</span>
                              <span className="ml-2 font-mono">{validation.tables.join(', ')}</span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Condition:</span>
                              <code className="ml-2 p-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                                {validation.condition}
                              </code>
                            </div>
                          </div>
                        </div>
                      ))}
                      {currentModel.validations.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No validations defined for this model</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="metadata" className="mt-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          General Information
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Version:</span>
                            <span className="font-medium">{currentModel.metadata.version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Author:</span>
                            <span className="font-medium">{currentModel.metadata.author}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Category:</span>
                            <Badge variant="secondary" className="text-xs">{currentModel.category}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Timestamps
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Created:</span>
                            <span className="font-medium">
                              {currentModel.metadata.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                            <span className="font-medium">
                              {currentModel.metadata.updatedAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Tags
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {currentModel.metadata.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {currentModel.metadata.documentation && (
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Documentation
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {currentModel.metadata.documentation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Select a Business Model</h3>
                <p className="text-sm">
                  Choose a model from the left panel to view its structure, tables, and relationships
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}