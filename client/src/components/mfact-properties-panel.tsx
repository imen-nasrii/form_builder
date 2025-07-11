import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  CheckCircle,
  Info,
  Palette,
  Layout,
  Database,
  Code
} from 'lucide-react';
import type { MFactField, SelectOption, ValidationRule } from '@shared/mfact-models';
import { COMPONENT_REGISTRY } from '@shared/mfact-models';

interface MFactPropertiesPanelProps {
  selectedField: MFactField | null;
  onFieldUpdate: (field: MFactField) => void;
  onFieldRemove: () => void;
}

interface PropertySectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function PropertySection({ title, icon, children, defaultExpanded = true }: PropertySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className="mb-4">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            {icon}
            {title}
          </span>
          {isExpanded ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          {children}
        </CardContent>
      )}
    </Card>
  );
}

interface OptionEditorProps {
  options: SelectOption[];
  onChange: (options: SelectOption[]) => void;
}

function OptionEditor({ options, onChange }: OptionEditorProps) {
  const addOption = useCallback(() => {
    const newOption: SelectOption = {
      value: `option_${Date.now()}`,
      label: 'New Option'
    };
    onChange([...options, newOption]);
  }, [options, onChange]);

  const updateOption = useCallback((index: number, updates: Partial<SelectOption>) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], ...updates };
    onChange(newOptions);
  }, [options, onChange]);

  const removeOption = useCallback((index: number) => {
    onChange(options.filter((_, i) => i !== index));
  }, [options, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Options</Label>
        <Button size="sm" variant="outline" onClick={addOption}>
          <Plus className="w-3 h-3 mr-1" />
          Add Option
        </Button>
      </div>
      
      {options.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          No options defined. Click "Add Option" to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  placeholder="Value"
                  value={option.value}
                  onChange={(e) => updateOption(index, { value: e.target.value })}
                  className="text-xs"
                />
                <Input
                  placeholder="Label"
                  value={option.label}
                  onChange={(e) => updateOption(index, { label: e.target.value })}
                  className="text-xs"
                />
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeOption(index)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ValidationEditorProps {
  validations: ValidationRule[];
  onChange: (validations: ValidationRule[]) => void;
}

function ValidationEditor({ validations, onChange }: ValidationEditorProps) {
  const addValidation = useCallback(() => {
    const newValidation: ValidationRule = {
      type: 'REQUIRED',
      message: 'This field is required'
    };
    onChange([...validations, newValidation]);
  }, [validations, onChange]);

  const updateValidation = useCallback((index: number, updates: Partial<ValidationRule>) => {
    const newValidations = [...validations];
    newValidations[index] = { ...newValidations[index], ...updates };
    onChange(newValidations);
  }, [validations, onChange]);

  const removeValidation = useCallback((index: number) => {
    onChange(validations.filter((_, i) => i !== index));
  }, [validations, onChange]);

  const validationTypes = [
    'REQUIRED', 'MINLENGTH', 'MAXLENGTH', 'PATTERN', 'EMAIL', 
    'URL', 'NUMBER', 'POSITIVE', 'NEGATIVE', 'RANGE', 'DATE', 'CUSTOM'
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Validation Rules</Label>
        <Button size="sm" variant="outline" onClick={addValidation}>
          <Plus className="w-3 h-3 mr-1" />
          Add Rule
        </Button>
      </div>
      
      {validations.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          No validation rules defined.
        </div>
      ) : (
        <div className="space-y-3">
          {validations.map((validation, index) => (
            <div key={index} className="p-3 border rounded space-y-2">
              <div className="flex items-center justify-between">
                <Select
                  value={validation.type}
                  onValueChange={(value) => updateValidation(index, { type: value as any })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {validationTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeValidation(index)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              
              <Input
                placeholder="Error message"
                value={validation.message}
                onChange={(e) => updateValidation(index, { message: e.target.value })}
                className="text-xs"
              />
              
              {['MINLENGTH', 'MAXLENGTH', 'RANGE'].includes(validation.type) && (
                <Input
                  placeholder="Value"
                  value={validation.value || ''}
                  onChange={(e) => updateValidation(index, { value: e.target.value })}
                  className="text-xs"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MFactPropertiesPanel({ 
  selectedField, 
  onFieldUpdate, 
  onFieldRemove 
}: MFactPropertiesPanelProps) {
  if (!selectedField) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Properties Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Component Selected
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Select a component from the Construction Zone to view and edit its properties.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const component = COMPONENT_REGISTRY.find(c => c.type === selectedField.Type);
  const hasOptions = ['SELECT', 'RADIOGRP', 'CHECKBOX'].includes(selectedField.Type);
  const hasValidation = true;
  const isContainer = selectedField.Type === 'GROUP';

  const updateField = useCallback((updates: Partial<MFactField>) => {
    onFieldUpdate({ ...selectedField, ...updates });
  }, [selectedField, onFieldUpdate]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Properties Panel
          </span>
          <Button
            size="sm"
            variant="destructive"
            onClick={onFieldRemove}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Remove
          </Button>
        </CardTitle>
        
        {component && (
          <div className="flex items-center gap-2 pt-2">
            <Badge variant="secondary">{selectedField.Type}</Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {component.description}
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4 space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              {/* Basic Properties */}
              <TabsContent value="basic" className="space-y-4">
                <PropertySection 
                  title="Basic Properties" 
                  icon={<Info className="w-4 h-4" />}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="field-id">Component ID</Label>
                      <Input
                        id="field-id"
                        value={selectedField.Id}
                        onChange={(e) => updateField({ Id: e.target.value })}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="field-label">Label</Label>
                      <Input
                        id="field-label"
                        value={selectedField.Label || ''}
                        onChange={(e) => updateField({ Label: e.target.value })}
                        placeholder="Enter field label"
                      />
                    </div>

                    <div>
                      <Label htmlFor="field-datafield">Data Field</Label>
                      <Input
                        id="field-datafield"
                        value={selectedField.DataField || ''}
                        onChange={(e) => updateField({ DataField: e.target.value })}
                        placeholder="Enter data field name"
                        className="font-mono text-sm"
                      />
                    </div>

                    {selectedField.Type !== 'GROUP' && (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="field-required"
                          checked={selectedField.Required || false}
                          onCheckedChange={(checked) => updateField({ Required: checked })}
                        />
                        <Label htmlFor="field-required">Required Field</Label>
                      </div>
                    )}
                  </div>
                </PropertySection>

                {hasOptions && (
                  <PropertySection 
                    title="Options Configuration" 
                    icon={<CheckCircle className="w-4 h-4" />}
                  >
                    <OptionEditor
                      options={selectedField.Options || []}
                      onChange={(options) => updateField({ Options: options })}
                    />
                  </PropertySection>
                )}
              </TabsContent>

              {/* Layout Properties */}
              <TabsContent value="layout" className="space-y-4">
                <PropertySection 
                  title="Layout & Sizing" 
                  icon={<Layout className="w-4 h-4" />}
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="field-width">Width</Label>
                      <Input
                        id="field-width"
                        value={selectedField.Width || ''}
                        onChange={(e) => updateField({ Width: e.target.value })}
                        placeholder="e.g., 200px, 100%, auto"
                      />
                    </div>

                    <div>
                      <Label htmlFor="field-spacing">Spacing</Label>
                      <Input
                        id="field-spacing"
                        value={selectedField.Spacing || ''}
                        onChange={(e) => updateField({ Spacing: e.target.value })}
                        placeholder="e.g., 10px, medium, large"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="field-inline"
                        checked={selectedField.Inline || false}
                        onCheckedChange={(checked) => updateField({ Inline: checked })}
                      />
                      <Label htmlFor="field-inline">Inline Layout</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="field-outlined"
                        checked={selectedField.OutlinedStyle || false}
                        onCheckedChange={(checked) => updateField({ OutlinedStyle: checked })}
                      />
                      <Label htmlFor="field-outlined">Outlined Style</Label>
                    </div>
                  </div>
                </PropertySection>

                {selectedField.Position && (
                  <PropertySection 
                    title="Grid Position" 
                    icon={<Palette className="w-4 h-4" />}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Row</Label>
                        <Input
                          type="number"
                          value={selectedField.Position.row}
                          onChange={(e) => updateField({ 
                            Position: { 
                              ...selectedField.Position!, 
                              row: parseInt(e.target.value) 
                            } 
                          })}
                        />
                      </div>
                      <div>
                        <Label>Column</Label>
                        <Input
                          type="number"
                          value={selectedField.Position.col}
                          onChange={(e) => updateField({ 
                            Position: { 
                              ...selectedField.Position!, 
                              col: parseInt(e.target.value) 
                            } 
                          })}
                        />
                      </div>
                      <div>
                        <Label>Row Span</Label>
                        <Input
                          type="number"
                          value={selectedField.Position.rowSpan || 1}
                          onChange={(e) => updateField({ 
                            Position: { 
                              ...selectedField.Position!, 
                              rowSpan: parseInt(e.target.value) 
                            } 
                          })}
                        />
                      </div>
                      <div>
                        <Label>Col Span</Label>
                        <Input
                          type="number"
                          value={selectedField.Position.colSpan || 1}
                          onChange={(e) => updateField({ 
                            Position: { 
                              ...selectedField.Position!, 
                              colSpan: parseInt(e.target.value) 
                            } 
                          })}
                        />
                      </div>
                    </div>
                  </PropertySection>
                )}
              </TabsContent>

              {/* Data Properties */}
              <TabsContent value="data" className="space-y-4">
                <PropertySection 
                  title="Data Binding" 
                  icon={<Database className="w-4 h-4" />}
                >
                  <div className="space-y-4">
                    {['GRIDLKP', 'LSTLKP', 'TREELKP', 'TABLELKP'].includes(selectedField.Type) && (
                      <div>
                        <Label htmlFor="field-entity">Entity/Table</Label>
                        <Input
                          id="field-entity"
                          value={selectedField.Entity || ''}
                          onChange={(e) => updateField({ Entity: e.target.value })}
                          placeholder="Enter entity or table name"
                          className="font-mono text-sm"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="field-properties">Custom Properties (JSON)</Label>
                      <Textarea
                        id="field-properties"
                        value={JSON.stringify(selectedField.Properties || {}, null, 2)}
                        onChange={(e) => {
                          try {
                            const properties = JSON.parse(e.target.value);
                            updateField({ Properties: properties });
                          } catch {
                            // Invalid JSON, ignore
                          }
                        }}
                        rows={6}
                        className="font-mono text-xs"
                        placeholder='{"placeholder": "Enter text", "maxLength": 100}'
                      />
                    </div>
                  </div>
                </PropertySection>

                {hasValidation && (
                  <PropertySection 
                    title="Validation Rules" 
                    icon={<AlertTriangle className="w-4 h-4" />}
                  >
                    <ValidationEditor
                      validations={selectedField.Validation || []}
                      onChange={(validations) => updateField({ Validation: validations })}
                    />
                  </PropertySection>
                )}
              </TabsContent>

              {/* Advanced Properties */}
              <TabsContent value="advanced" className="space-y-4">
                <PropertySection 
                  title="Advanced Configuration" 
                  icon={<Code className="w-4 h-4" />}
                >
                  {isContainer && (
                    <div>
                      <Label>Container Content</Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          This container has {selectedField.Children?.length || 0} child component(s).
                          Use the Construction Zone to add or remove child components.
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Component Type</Label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                      <div className="text-sm font-mono text-gray-900 dark:text-white">
                        {selectedField.Type}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {component?.description}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Raw JSON Configuration</Label>
                    <Textarea
                      value={JSON.stringify(selectedField, null, 2)}
                      readOnly
                      rows={12}
                      className="font-mono text-xs bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                </PropertySection>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}