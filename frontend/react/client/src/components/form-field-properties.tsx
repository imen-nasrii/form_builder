import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export interface FormField {
  Id: string;
  Type: string;
  Label: string;
  DataField: string;
  Entity?: string;
  Width?: string;
  Spacing?: string;
  Required?: boolean;
  Inline?: boolean;
  Outlined?: boolean;
  Value?: any;
  // Propriétés spécifiques
  KeyColumn?: string;
  LoadDataInfo?: {
    DataModel: string;
    ColumnsDefinition: Array<{
      DataField: string;
      Caption?: string;
      DataType: string;
      Visible?: boolean;
      ExcludeFromGrid?: boolean;
    }>;
  };
  ItemInfo?: {
    MainProperty: string;
    DescProperty: string;
    ShowDescription: boolean;
  };
  OptionValues?: Record<string, string>;
  UserIntKey?: boolean;
  EnabledWhen?: any;
  VisibleWhen?: any;
  Validations?: any[];
  isGroup?: boolean;
  ChildFields?: FormField[];
  RecordActions?: any[];
  ColumnDefinitions?: any[];
  Endpoint?: string;
  EntityKeyField?: string;
  Events?: any[];
  EndpointOnchange?: boolean;
  EndpointDepend?: any;
  RequestedFields?: string[];
  FromDBWhen?: any;
  Enabled?: boolean;
  CheckboxValue?: boolean;
}

interface FormFieldPropertiesProps {
  field: FormField | null;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  isDarkMode: boolean;
}

export function FormFieldProperties({ field, updateField, isDarkMode }: FormFieldPropertiesProps) {
  if (!field) {
    return (
      <div className={`p-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>Select a component to edit its properties</p>
      </div>
    );
  }

  const handleUpdateField = (key: string, value: any) => {
    updateField(field.Id, { [key]: value });
  };

  const handleAddOption = () => {
    const currentOptions = field.OptionValues || {};
    const newKey = `option_${Object.keys(currentOptions).length + 1}`;
    handleUpdateField('OptionValues', {
      ...currentOptions,
      [newKey]: 'New Option'
    });
  };

  const handleRemoveOption = (optionKey: string) => {
    const currentOptions = field.OptionValues || {};
    const { [optionKey]: removed, ...remaining } = currentOptions;
    handleUpdateField('OptionValues', remaining);
  };

  const handleUpdateOption = (optionKey: string, newValue: string) => {
    const currentOptions = field.OptionValues || {};
    handleUpdateField('OptionValues', {
      ...currentOptions,
      [optionKey]: newValue
    });
  };

  const handleAddColumn = () => {
    const currentColumns = field.LoadDataInfo?.ColumnsDefinition || [];
    const newColumn = {
      DataField: 'new_field',
      Caption: 'New Field',
      DataType: 'STRING',
      Visible: true
    };
    handleUpdateField('LoadDataInfo', {
      ...field.LoadDataInfo,
      DataModel: field.LoadDataInfo?.DataModel || '',
      ColumnsDefinition: [...currentColumns, newColumn]
    });
  };

  const handleRemoveColumn = (index: number) => {
    const currentColumns = field.LoadDataInfo?.ColumnsDefinition || [];
    const updatedColumns = currentColumns.filter((_, i) => i !== index);
    handleUpdateField('LoadDataInfo', {
      ...field.LoadDataInfo,
      DataModel: field.LoadDataInfo?.DataModel || '',
      ColumnsDefinition: updatedColumns
    });
  };

  const handleUpdateColumn = (index: number, key: string, value: any) => {
    const currentColumns = field.LoadDataInfo?.ColumnsDefinition || [];
    const updatedColumns = currentColumns.map((col, i) => 
      i === index ? { ...col, [key]: value } : col
    );
    handleUpdateField('LoadDataInfo', {
      ...field.LoadDataInfo,
      DataModel: field.LoadDataInfo?.DataModel || '',
      ColumnsDefinition: updatedColumns
    });
  };

  return (
    <div className="space-y-6">
      {/* Propriétés communes */}
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Basic Properties
        </h3>
        
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Component ID</Label>
          <Input
            value={field.Id || ''}
            onChange={(e) => handleUpdateField('Id', e.target.value)}
            className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
          />
        </div>

        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Label</Label>
          <Input
            value={field.Label || ''}
            onChange={(e) => handleUpdateField('Label', e.target.value)}
            className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
          />
        </div>

        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Data Field</Label>
          <Input
            value={field.DataField || ''}
            onChange={(e) => handleUpdateField('DataField', e.target.value)}
            placeholder="Database field name"
            className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
          />
        </div>

        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Entity/Table</Label>
          <Input
            value={field.Entity || ''}
            onChange={(e) => handleUpdateField('Entity', e.target.value)}
            placeholder="Database table name"
            className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Width</Label>
            <Input
              value={field.Width || '100%'}
              onChange={(e) => handleUpdateField('Width', e.target.value)}
              placeholder="100%, 300px, etc."
              className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Spacing</Label>
            <Input
              value={field.Spacing || '4'}
              onChange={(e) => handleUpdateField('Spacing', e.target.value)}
              className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={field.Required || false}
              onCheckedChange={(checked) => handleUpdateField('Required', checked)}
            />
            <Label htmlFor="required" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Required
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inline"
              checked={field.Inline || false}
              onCheckedChange={(checked) => handleUpdateField('Inline', checked)}
            />
            <Label htmlFor="inline" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Inline Layout
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="outlined"
              checked={field.Outlined || false}
              onCheckedChange={(checked) => handleUpdateField('Outlined', checked)}
            />
            <Label htmlFor="outlined" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Outlined Style
            </Label>
          </div>
        </div>
      </div>

      {/* Propriétés spécifiques par type */}
      {(field.Type === 'GRIDLKP' || field.Type === 'LSTLKP') && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Lookup Properties
          </h3>
          
          <div className="space-y-2">
            <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Key Column</Label>
            <Input
              value={field.KeyColumn || ''}
              onChange={(e) => handleUpdateField('KeyColumn', e.target.value)}
              placeholder="Primary key column"
              className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Data Model</Label>
            <Input
              value={field.LoadDataInfo?.DataModel || ''}
              onChange={(e) => handleUpdateField('LoadDataInfo', {
                ...field.LoadDataInfo,
                DataModel: e.target.value,
                ColumnsDefinition: field.LoadDataInfo?.ColumnsDefinition || []
              })}
              placeholder="Source data model"
              className={isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Column Definitions</Label>
              <Button size="sm" onClick={handleAddColumn} variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Column
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {field.LoadDataInfo?.ColumnsDefinition?.map((column, index) => (
                <div key={index} className={`p-3 border rounded ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <Input
                      value={column.DataField}
                      onChange={(e) => handleUpdateColumn(index, 'DataField', e.target.value)}
                      placeholder="Field name"
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                    <Input
                      value={column.Caption || ''}
                      onChange={(e) => handleUpdateColumn(index, 'Caption', e.target.value)}
                      placeholder="Caption"
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                    <Select value={column.DataType} onValueChange={(value) => handleUpdateColumn(index, 'DataType', value)}>
                      <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STRING">Chaîne de caractères</SelectItem>
                        <SelectItem value="NUMERIC">Nombre</SelectItem>
                        <SelectItem value="DATE">Chaîne de caractères</SelectItem>
                        <SelectItem value="BOOLEAN">Booléen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={column.Visible !== false}
                        onCheckedChange={(checked) => handleUpdateColumn(index, 'Visible', checked)}
                      />
                      <Label className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Visible
                      </Label>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveColumn(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {field.Type === 'SELECT' && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Select Options
          </h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="userIntKey"
              checked={field.UserIntKey || false}
              onCheckedChange={(checked) => handleUpdateField('UserIntKey', checked)}
            />
            <Label htmlFor="userIntKey" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Use Integer Keys
            </Label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Options</Label>
              <Button size="sm" onClick={handleAddOption} variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {field.OptionValues && Object.entries(field.OptionValues).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Input
                    value={key}
                    onChange={(e) => {
                      const newOptions = { ...field.OptionValues };
                      delete newOptions[key];
                      newOptions[e.target.value] = value;
                      handleUpdateField('OptionValues', newOptions);
                    }}
                    placeholder="Key"
                    className={`flex-1 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
                  />
                  <Input
                    value={value}
                    onChange={(e) => handleUpdateOption(key, e.target.value)}
                    placeholder="Value"
                    className={`flex-1 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveOption(key)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {field.Type === 'CHECKBOX' && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Checkbox Properties
          </h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="checkboxValue"
              checked={field.CheckboxValue || false}
              onCheckedChange={(checked) => handleUpdateField('CheckboxValue', checked)}
            />
            <Label htmlFor="checkboxValue" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Default Checked State
            </Label>
          </div>
        </div>
      )}

      {field.Type === 'NUMERIC' && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Numeric Properties
          </h3>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="endpointOnchange"
              checked={field.EndpointOnchange || false}
              onCheckedChange={(checked) => handleUpdateField('EndpointOnchange', checked)}
            />
            <Label htmlFor="endpointOnchange" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Call Endpoint on Change
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="enabled"
              checked={field.Enabled !== false}
              onCheckedChange={(checked) => handleUpdateField('Enabled', checked)}
            />
            <Label htmlFor="enabled" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Enabled
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormFieldProperties;