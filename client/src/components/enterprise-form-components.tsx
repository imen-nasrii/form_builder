import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar, Grid3X3, Search, Type, CheckSquare, List, Database, Settings, Table, ArrowRight, Hash, BarChart3 } from 'lucide-react';

// Types extraits des fichiers JSON
export type ComponentType = 
  | 'TEXT'
  | 'GRIDLKP'
  | 'LSTLKP' 
  | 'DATEPKR'
  | 'DATEPICKER'
  | 'SELECT'
  | 'CHECKBOX'
  | 'RADIOGRP'
  | 'NUMERIC'
  | 'GRID'
  | 'DIALOG'
  | 'GROUP'
  | 'LABEL'
  | 'FILEUPLOAD';

export interface ComponentProperty {
  id: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'datamodel-columns';
  dataType?: 'String' | 'Boolean' | 'Number' | 'Object' | 'Array of Objects';
  options?: string[];
  defaultValue?: any;
  description?: string;
}

export interface FormComponent {
  Id: string;
  Type: ComponentType;
  Label: string;
  DataField?: string;
  Entity?: string;
  Width?: string;
  Spacing?: string;
  Required?: boolean;
  Inline?: boolean;
  Outlined?: boolean;
  Value?: any;
  // Propriétés spécifiques GRIDLKP/LSTLKP
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
  // Propriétés SELECT
  OptionValues?: Record<string, string>;
  UserIntKey?: boolean;
  // Propriétés conditionnelles
  EnabledWhen?: {
    LogicalOperator?: 'AND' | 'OR';
    Conditions: Array<{
      RightField?: string;
      VariableId?: string;
      Operator: string;
      Value?: any;
      ValueType?: string;
    }>;
  };
  VisibleWhen?: {
    LogicalOperator?: 'AND' | 'OR';
    Conditions: Array<{
      RightField?: string;
      VariableId?: string;
      Operator: string;
      Value?: any;
      ValueType?: string;
    }>;
  };
  // Validations
  Validations?: Array<{
    Id: string;
    Type: 'ERROR' | 'WARNING' | string;
    CondExpression?: {
      LogicalOperator?: 'AND' | 'OR';
      Conditions: Array<{
        RightField?: string;
        VariableId?: string;
        Operator: string;
        Value?: any;
        ValueType?: string;
      }>;
    };
  }>;
  // GROUP spécifique
  isGroup?: boolean;
  ChildFields?: FormComponent[];
  // GRID spécifique
  RecordActions?: Array<{
    id: string;
    Label: string;
    UpdateVarValues?: Array<{
      Name: string;
      Value?: any;
      linkTo?: string;
      linkToProperty?: string;
      linkFrom?: string;
      linkFromProperty?: string;
    }>;
  }>;
  ColumnDefinitions?: Array<{
    DataField: string;
    Caption: string;
    DataType: string;
  }>;
  Endpoint?: string;
  EntityKeyField?: string;
  Events?: Array<{
    id: string;
    UpdateVarValues?: Array<{
      Name: string;
      Value?: any;
      linkTo?: string;
      linkToProperty?: string;
      linkFrom?: string;
      linkFromProperty?: string;
    }>;
  }>;
  // NUMERIC spécifique
  EndpointOnchange?: boolean;
  EndpointDepend?: {
    Conditions: Array<{
      RightField: string;
      Operator: string;
    }>;
  };
  RequestedFields?: string[];
  FromDBWhen?: {
    LogicalOperator?: 'AND' | 'OR';
    Conditions: Array<{
      RightField: string;
      Operator: string;
    }>;
  };
  Enabled?: boolean;
  // CHECKBOX spécifique
  CheckboxValue?: boolean;
}

// Définition des catégories et composants selon les spécifications Excel
export const ComponentCategories = {
  'Lookup Components': [
    {
      type: 'GRIDLKP' as ComponentType,
      label: 'Grid Lookup',
      icon: Grid3X3,
      description: 'Grid-based data lookup with search functionality'
    },
    {
      type: 'LSTLKP' as ComponentType,
      label: 'List Lookup',
      icon: Search,
      description: 'List-based data lookup with filtering'
    }
  ],
  'Date & Time': [
    {
      type: 'DATEPICKER' as ComponentType,
      label: 'Date Picker',
      icon: Calendar,
      description: 'Date selection with validation rules'
    },
    {
      type: 'DATEPKR' as ComponentType,
      label: 'Date Picker Alt',
      icon: Calendar,
      description: 'Alternative date picker with conditional logic'
    }
  ],
  'Selection Controls': [
    {
      type: 'SELECT' as ComponentType,
      label: 'Select Dropdown',
      icon: List,
      description: 'Dropdown with option values and user int key support'
    },
    {
      type: 'CHECKBOX' as ComponentType,
      label: 'Checkbox',
      icon: CheckSquare,
      description: 'Boolean checkbox with conditional enabling'
    },
    {
      type: 'RADIOGRP' as ComponentType,
      label: 'Radio Group',
      icon: Settings,
      description: 'Radio button group with option values'
    }
  ],
  'Container & Layout': [
    {
      type: 'GROUP' as ComponentType,
      label: 'Group Container',
      icon: Database,
      description: 'Container with child fields and spacing control'
    }
  ]
};

// Propriétés communes à tous les composants
export const CommonProperties: ComponentProperty[] = [
  {
    id: 'Id',
    label: 'Id',
    type: 'text',
    dataType: 'String',
    defaultValue: '',
    description: 'Unique field identifier.'
  },
  {
    id: 'Label',
    label: 'Label',
    type: 'text',
    dataType: 'String',
    defaultValue: '',
    description: 'Field display label.'
  },
  {
    id: 'Inline',
    label: 'Inline',
    type: 'boolean',
    dataType: 'Boolean',
    defaultValue: false,
    description: 'Indicates if the field should be displayed inline.'
  },
  {
    id: 'Width',
    label: 'Width',
    type: 'text',
    dataType: 'String',
    defaultValue: '100%',
    description: 'Field width (e.g. "32")'
  },
  {
    id: 'Outlined',
    label: 'Outlined Style',
    type: 'boolean',
    defaultValue: false,
    description: 'Use outlined visual style'
  }
];

// Excel-based component properties matching exact specifications
export const ComponentSpecificProperties: Record<ComponentType, ComponentProperty[]> = {
  'TEXT': [
    {
      id: 'placeholder',
      label: 'Placeholder',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Placeholder text'
    },
    {
      id: 'maxLength',
      label: 'Max Length',
      type: 'number',
      dataType: 'Chaîne de caractères',
      defaultValue: 255,
      description: 'Maximum character length'
    },
    {
      id: 'minLength',
      label: 'Min Length',
      type: 'number',
      dataType: 'Booléen',
      defaultValue: 0,
      description: 'Minimum character length'
    }
  ],
  'NUMERIC': [
    {
      id: 'EndpointOnchange',
      label: 'Endpoint On Change',
      type: 'boolean',
      dataType: 'Chaîne de caractères',
      defaultValue: false,
      description: 'Call endpoint when value changes'
    },
    {
      id: 'Enabled',
      label: 'Enabled',
      type: 'boolean',
      dataType: 'Chaîne de caractères',
      defaultValue: true,
      description: 'Enable or disable the field'
    }
  ],
  'GRIDLKP': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Unique field identifier.'
    },
    {
      id: 'Label',
      label: 'Label',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Field display label.'
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: false,
      description: 'Indicates if the field should be displayed inline.'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'String',
      defaultValue: '100%',
      description: 'Field width (e.g. "32")'
    },
    {
      id: 'KeyColumn',
      label: 'Key Column',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Key column in the data model for search'
    },
    {
      id: 'ItemInfo_MainProperty',
      label: 'Main Property',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Main property to display for the element'
    },
    {
      id: 'ItemInfo_DescProperty',
      label: 'Description Property',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Property containing the element description'
    },
    {
      id: 'ItemInfo_ShowDescription',
      label: 'Show Description',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: true,
      description: 'Indicates if the description should be displayed'
    },
    {
      id: 'LoadDataInfo_DataModel',
      label: 'LoadDataInfo - DataModel',
      type: 'select',
      dataType: 'String',
      options: ['ACCADJ', 'BUYTYP', 'PRIMNT', 'SRCMNT', 'BUYLONG', 'Custom Model'],
      defaultValue: '',
      description: 'Select the MFact model to load for data'
    },
    {
      id: 'LoadDataInfo_ColumnsDefinition',
      label: 'LoadDataInfo - ColumnsDefinition',
      type: 'datamodel-columns',
      dataType: 'Array of Objects',
      defaultValue: '[]',
      description: 'Columns configuration: DataField, Caption, DataType, Visible'
    }
  ],
  'LSTLKP': [
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: false,
      description: 'Indicates if the field should be displayed inline'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'String',
      defaultValue: '100%',
      description: 'Field width (e.g. "32")'
    },
    {
      id: 'KeyColumn',
      label: 'Key Column',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Key column in the data model for the list'
    },
    {
      id: 'LoadDataInfo_DataModel',
      label: 'Data Model',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Data model name'
    },
    {
      id: 'LoadDataInfo_ColumnsDefinition',
      label: 'Columns Definition',
      type: 'textarea',
      dataType: 'Array of Objects',
      defaultValue: '',
      description: 'Defines the list columns (JSON)'
    },
    {
      id: 'ItemInfo_MainProperty',
      label: 'Main Property',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Main property to display for the element'
    },
    {
      id: 'ItemInfo_DescProperty',
      label: 'Description Property',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Property containing the element description'
    },
    {
      id: 'ItemInfo_ShowDescription',
      label: 'Show Description',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: true,
      description: 'Indicates if the description should be displayed'
    }
  ],
  'SELECT': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Unique field identifier.'
    },
    {
      id: 'Label',
      label: 'Label',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Field display label.'
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: false,
      description: 'Indicates if the field should be displayed inline.'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'String',
      defaultValue: '100%',
      description: 'Field width (e.g. "32").'
    },
    {
      id: 'Required',
      label: 'Required',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: false,
      description: 'Indicates if the field is required.'
    },
    {
      id: 'Outlined',
      label: 'Outlined',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: false,
      description: 'Indicates if the selection should have an "outlined" style.'
    },
    {
      id: 'UserIntKey',
      label: 'UserIntKey',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: false,
      description: 'Suggests if option values are user-defined integer keys.'
    },
    {
      id: 'OptionValues',
      label: 'OptionValues',
      type: 'textarea',
      dataType: 'Object',
      defaultValue: '{}',
      description: 'Key-value pairs for dropdown options.'
    }
  ],
  'DATEPICKER': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Unique field identifier.'
    },
    {
      id: 'Label',
      label: 'Label',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Field display label.'
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: false,
      description: 'Indicates if the field should be displayed inline.'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'String',
      defaultValue: '100%',
      description: 'Field width (e.g. "32").'
    },
    {
      id: 'Spacing',
      label: 'Spacing',
      type: 'text',
      dataType: 'String',
      defaultValue: '30',
      description: 'Spacing around the field (e.g. "30").'
    },
    {
      id: 'Required',
      label: 'Required',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: false,
      description: 'Indicates if the field is required.'
    },
    {
      id: 'Validations',
      label: 'Validations',
      type: 'textarea',
      dataType: 'Array of Objects',
      defaultValue: '[]',
      description: 'Defines validation rules.'
    }
  ],
  'DATEPKR': [
    {
      id: 'Spacing',
      label: 'Spacing',
      type: 'text',
      dataType: 'String',
      defaultValue: '0',
      description: 'Spacing around the field (e.g. "0")'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'String',
      defaultValue: '100%',
      description: 'Field width (e.g. "25")'
    },
    {
      id: 'EnabledWhen',
      label: 'Enabled When',
      type: 'textarea',
      dataType: 'Object',
      defaultValue: '{}',
      description: 'Defines field activation conditions (JSON)'
    },
    {
      id: 'Validations',
      label: 'Validations',
      type: 'textarea',
      dataType: 'Array of Objects',
      defaultValue: '[]',
      description: 'Defines validation rules (JSON)'
    }
  ],
  'CHECKBOX': [
    {
      id: 'CheckboxValue',
      label: 'Checkbox Value',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: true,
      description: 'Field value when checked'
    },
    {
      id: 'Spacing',
      label: 'Spacing',
      type: 'number',
      dataType: 'Number',
      defaultValue: 0,
      description: 'Spacing around the checkbox'
    },
    {
      id: 'Value',
      label: 'Default Value',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: false,
      description: 'Initial or default state of the checkbox'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'String',
      defaultValue: '100%',
      description: 'Checkbox component width'
    },
    {
      id: 'EnabledWhen',
      label: 'Enabled When',
      type: 'textarea',
      dataType: 'Object',
      defaultValue: '{}',
      description: 'Defines field activation conditions (JSON)'
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: false,
      description: 'Indicates if the checkbox should be displayed inline'
    },
    {
      id: 'Required',
      label: 'Required',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: false,
      description: 'Indicates if the checkbox is required'
    }
  ],
  'GROUP': [
    {
      id: 'isGroup',
      label: 'Is Group',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: true,
      description: 'Indicates that the field is a group'
    },
    {
      id: 'Spacing',
      label: 'Spacing',
      type: 'text',
      dataType: 'String',
      defaultValue: '0',
      description: 'Spacing around the group (e.g. "0")'
    },
    {
      id: 'ChildFields',
      label: 'Child Fields',
      type: 'textarea',
      dataType: 'Array of Objects',
      defaultValue: '[]',
      description: 'Definitions of child fields in the group (JSON)'
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: false,
      description: 'Indicates if the group should be displayed inline'
    },
    {
      id: 'Required',
      label: 'Required',
      type: 'boolean',
      dataType: 'Boolean',
      defaultValue: false,
      description: 'Indicates if fields inside the group are required'
    }
  ],
  'RADIOGRP': [
    {
      id: 'Value',
      label: 'Default Value',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Default selected value'
    },
    {
      id: 'Spacing',
      label: 'Spacing',
      type: 'text',
      dataType: 'String',
      defaultValue: '0',
      description: 'Spacing around the group (e.g. "0")'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'String',
      defaultValue: '100%',
      description: 'Radio button group width (e.g. "100", "600px")'
    },
    {
      id: 'OptionValues',
      label: 'Option Values',
      type: 'textarea',
      dataType: 'Object',
      defaultValue: '{}',
      description: 'Key-value pairs for radio button options (JSON)'
    }
  ],
  'GRID': [
    {
      id: 'EntitykeyField',
      label: 'Entity Key Field',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Key field in the entity'
    }
  ],
  'DIALOG': [
    {
      id: 'title',
      label: 'Dialog Title',
      type: 'text',
      dataType: 'String',
      defaultValue: '',
      description: 'Title of the dialog'
    }
  ],
  'LABEL': [
    {
      id: 'fontWeight',
      label: 'Font Weight',
      type: 'select',
      dataType: 'String',
      defaultValue: 'normal',
      options: ['normal', 'bold', 'lighter'],
      description: 'Font weight of the label'
    }
  ],
  'FILEUPLOAD': [
    {
      id: 'acceptedTypes',
      label: 'Accepted File Types',
      type: 'text',
      dataType: 'String',
      defaultValue: '*',
      description: 'Accepted file types (e.g., .pdf,.jpg,.png)'
    }
  ]
};

// Composant de rendu pour chaque type
export function renderFormComponent(component: FormComponent, isDarkMode: boolean = false) {
  const baseClasses = `w-full p-3 border rounded-lg transition-all duration-200 ${
    isDarkMode 
      ? 'bg-gray-800 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  switch (component.Type) {
    case 'TEXT':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input 
            className={baseClasses}
            placeholder={component.Label}
            defaultValue={component.Value || ''}
          />
        </div>
      );

    case 'NUMERIC':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input 
            type="number"
            className={baseClasses}
            placeholder={component.Label}
            defaultValue={component.Value || ''}
            disabled={component.Enabled === false}
          />
        </div>
      );

    case 'GRIDLKP':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className="relative">
            <Input 
              className={`${baseClasses} pr-10`}
              placeholder={`Select ${component.Label}...`}
              defaultValue={component.Value || ''}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {component.LoadDataInfo && (
            <div className="text-xs text-gray-500 mt-1">
              Source: {component.LoadDataInfo.DataModel}
            </div>
          )}
        </div>
      );

    case 'LSTLKP':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select defaultValue={component.Value || ''}>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder={`Select ${component.Label}...`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );

    case 'DATEPKR':
    case 'DATEPICKER':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input 
            type="date"
            className={baseClasses}
            defaultValue={component.Value || ''}
          />
        </div>
      );

    case 'SELECT':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select defaultValue={component.Value || ''}>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder={`Select ${component.Label}...`} />
            </SelectTrigger>
            <SelectContent>
              {component.OptionValues && Object.entries(component.OptionValues).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'CHECKBOX':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={component.Id}
            defaultChecked={component.CheckboxValue || component.Value || false}
          />
          <Label 
            htmlFor={component.Id}
            className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}
          >
            {component.Label}
          </Label>
        </div>
      );

    case 'RADIOGRP':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
          </Label>
          <div className="space-y-2">
            {component.OptionValues && Object.entries(component.OptionValues).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name={component.Id} 
                  value={key}
                  defaultChecked={component.Value === key}
                  className="text-blue-600"
                />
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {value}
                </Label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'GRID':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
          </Label>
          <div className={`${baseClasses} min-h-[200px] p-4`}>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">Data Grid</span>
                <div className="space-x-2">
                  {component.RecordActions?.map(action => (
                    <Button key={action.id} size="sm" variant="outline">
                      {action.Label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Entity: {component.Entity} | Endpoint: {component.Endpoint}
              </div>
            </div>
          </div>
        </div>
      );

    case 'LABEL':
      return (
        <div className="space-y-1">
          <Label className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {component.Label}
          </Label>
          <div className={`p-2 rounded ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
            {component.Value || 'Display Value'}
          </div>
        </div>
      );

    case 'GROUP':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
          </Label>
          <div className={`${baseClasses} space-y-4`}>
            {component.ChildFields?.map((child, index) => (
              <div key={child.Id || index}>
                {renderFormComponent(child, isDarkMode)}
              </div>
            ))}
          </div>
        </div>
      );

    case 'DIALOG':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label} (Dialog)
          </Label>
          <div className={`${baseClasses} border-dashed`}>
            <div className="text-center text-gray-500 py-4">
              Dialog Container
              {component.ChildFields && (
                <div className="mt-2 text-xs">
                  Contains {component.ChildFields.length} fields
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 'FILEUPLOAD':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className={`${baseClasses} border-dashed text-center py-8`}>
            <ArrowRight className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">Click to upload or drag and drop</p>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label} ({component.Type})
          </Label>
          <div className={`${baseClasses} text-center py-4 text-gray-500`}>
            Unsupported component type: {component.Type}
          </div>
        </div>
      );
  }
}

export default {
  ComponentCategories,
  CommonProperties,
  ComponentSpecificProperties,
  renderFormComponent
};