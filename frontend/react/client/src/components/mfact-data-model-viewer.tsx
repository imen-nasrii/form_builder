import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Database, 
  Table, 
  Link, 
  Eye, 
  AlertCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Key,
  Globe
} from 'lucide-react';
import { MFACT_BUSINESS_MODELS } from '@shared/mfact-business-models';
import type { MFactField } from '@shared/mfact-models';

interface MFactDataModelViewerProps {
  field: MFactField;
  isSelected: boolean;
  onClick: () => void;
}

export default function MFactDataModelViewer({ 
  field, 
  isSelected, 
  onClick 
}: MFactDataModelViewerProps) {
  const [selectedModel, setSelectedModel] = useState(field.Properties?.selectedModel || '');
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'tables' | 'relationships' | 'validations'>('tables');

  const currentModel = MFACT_BUSINESS_MODELS.find(m => m.id === selectedModel);
  const showTables = field.Properties?.showTables ?? true;
  const showRelationships = field.Properties?.showRelationships ?? true;
  const showValidations = field.Properties?.showValidations ?? true;
  const allowModelSelection = field.Properties?.allowModelSelection ?? true;

  const toggleTableExpansion = (tableId: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableId)) {
      newExpanded.delete(tableId);
    } else {
      newExpanded.add(tableId);
    }
    setExpandedTables(newExpanded);
  };

  return (
    <Card 
      className={`w-full min-h-[300px] cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50 dark:bg-blue-900/20' 
          : 'hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <span>{field.Label}</span>
            <Badge variant="outline" className="text-xs">DATAMODEL</Badge>
          </div>
          {isSelected && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-blue-600" />
              <span className="text-xs text-blue-600">Selected</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Model Selection */}
        {allowModelSelection && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Business Model
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MFACT_BUSINESS_MODELS.map((model) => (
                <Button
                  key={model.id}
                  variant={selectedModel === model.id ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs justify-start"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModel(model.id);
                  }}
                >
                  <div className="flex items-center gap-1 w-full">
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] px-1 py-0"
                    >
                      {model.category}
                    </Badge>
                    <span className="truncate">{model.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Model Information */}
        {currentModel && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <Globe className="w-4 h-4 text-blue-600" />
              <div>
                <div className="font-medium text-sm">{currentModel.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {currentModel.description}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              {showTables && (
                <button
                  className={`px-3 py-1 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === 'tables'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('tables');
                  }}
                >
                  <Table className="w-3 h-3 inline mr-1" />
                  Tables ({currentModel.tables.length})
                </button>
              )}
              {showRelationships && (
                <button
                  className={`px-3 py-1 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === 'relationships'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('relationships');
                  }}
                >
                  <Link className="w-3 h-3 inline mr-1" />
                  Relations ({currentModel.relationships.length})
                </button>
              )}
              {showValidations && (
                <button
                  className={`px-3 py-1 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === 'validations'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('validations');
                  }}
                >
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  Validations ({currentModel.validations.length})
                </button>
              )}
            </div>

            {/* Tab Content */}
            <ScrollArea className="h-48">
              {activeTab === 'tables' && showTables && (
                <div className="space-y-2">
                  {currentModel.tables.map((table) => (
                    <div key={table.name} className="border rounded p-2">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTableExpansion(table.name);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {expandedTables.has(table.name) ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                          <Table className="w-3 h-3 text-blue-600" />
                          <span className="text-xs font-medium">{table.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {table.fields.length} fields
                        </Badge>
                      </div>
                      
                      {expandedTables.has(table.name) && (
                        <div className="mt-2 pl-4 space-y-1">
                          {table.fields.map((tableField) => (
                            <div 
                              key={tableField.name} 
                              className="flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                {tableField.isPrimaryKey && (
                                  <Key className="w-2 h-2 text-yellow-600" />
                                )}
                                <span className={tableField.isPrimaryKey ? 'font-medium' : ''}>
                                  {tableField.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Badge variant="secondary" className="text-[9px] px-1">
                                  {tableField.type}
                                </Badge>
                                {tableField.isRequired && (
                                  <span className="text-red-500 text-[9px]">*</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'relationships' && showRelationships && (
                <div className="space-y-2">
                  {currentModel.relationships.map((rel, index) => (
                    <div key={index} className="border rounded p-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Link className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-medium">{rel.name}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {rel.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 pl-4">
                        {rel.fromTable}.{rel.fromField} → {rel.toTable}.{rel.toField}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'validations' && showValidations && (
                <div className="space-y-2">
                  {currentModel.validations.map((validation, index) => (
                    <div key={index} className="border rounded p-2">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-3 h-3 text-orange-600" />
                        <span className="text-xs font-medium">{validation.field}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {validation.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 pl-4">
                        {validation.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}

        {/* No Model Selected */}
        {!currentModel && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select a business model to view its structure
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}