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
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea';
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

// Définition des catégories et composants
export const ComponentCategories = {
  'Input Fields': [
    {
      type: 'TEXT' as ComponentType,
      label: 'Text Input',
      icon: Type,
      description: 'Basic text input field'
    },
    {
      type: 'NUMERIC' as ComponentType,
      label: 'Numeric Input',
      icon: Hash,
      description: 'Numeric input with validation'
    },
    {
      type: 'DATEPKR' as ComponentType,
      label: 'Date Picker',
      icon: Calendar,
      description: 'Date selection component'
    },
    {
      type: 'DATEPICKER' as ComponentType,
      label: 'Date Picker Alt',
      icon: Calendar,
      description: 'Alternative date picker'
    }
  ],
  'Selection Controls': [
    {
      type: 'SELECT' as ComponentType,
      label: 'Select Dropdown',
      icon: List,
      description: 'Dropdown selection with predefined options'
    },
    {
      type: 'CHECKBOX' as ComponentType,
      label: 'Checkbox',
      icon: CheckSquare,
      description: 'Boolean checkbox input'
    },
    {
      type: 'RADIOGRP' as ComponentType,
      label: 'Radio Group',
      icon: Settings,
      description: 'Radio button group selection'
    }
  ],
  'Lookup Components': [
    {
      type: 'GRIDLKP' as ComponentType,
      label: 'Grid Lookup',
      icon: Grid3X3,
      description: 'Grid-based lookup with search'
    },
    {
      type: 'LSTLKP' as ComponentType,
      label: 'List Lookup',
      icon: Search,
      description: 'List-based lookup component'
    }
  ],
  'Data & Display': [
    {
      type: 'GRID' as ComponentType,
      label: 'Data Grid',
      icon: Table,
      description: 'Editable data grid with actions'
    },
    {
      type: 'LABEL' as ComponentType,
      label: 'Label',
      icon: Type,
      description: 'Read-only display label'
    }
  ],
  'Container & Layout': [
    {
      type: 'GROUP' as ComponentType,
      label: 'Group Container',
      icon: Database,
      description: 'Container for grouping fields'
    },
    {
      type: 'DIALOG' as ComponentType,
      label: 'Dialog Container',
      icon: Settings,
      description: 'Modal dialog container'
    }
  ],
  'File & Upload': [
    {
      type: 'FILEUPLOAD' as ComponentType,
      label: 'File Upload',
      icon: ArrowRight,
      description: 'File upload component'
    }
  ]
};

// Propriétés communes à tous les composants
export const CommonProperties: ComponentProperty[] = [
  {
    id: 'Id',
    label: 'Component ID',
    type: 'text',
    defaultValue: '',
    description: 'Unique identifier for the component'
  },
  {
    id: 'Label',
    label: 'Label Text',
    type: 'text',
    defaultValue: '',
    description: 'Display label for the component'
  },
  {
    id: 'DataField',
    label: 'Data Field',
    type: 'text',
    defaultValue: '',
    description: 'Database field name'
  },
  {
    id: 'Entity',
    label: 'Entity/Table',
    type: 'text',
    defaultValue: '',
    description: 'Database table or entity name'
  },
  {
    id: 'Width',
    label: 'Width',
    type: 'text',
    defaultValue: '100%',
    description: 'Component width (px, %, etc.)'
  },
  {
    id: 'Spacing',
    label: 'Spacing',
    type: 'text',
    defaultValue: '4',
    description: 'Spacing around component'
  },
  {
    id: 'Required',
    label: 'Required',
    type: 'boolean',
    defaultValue: false,
    description: 'Mark field as required'
  },
  {
    id: 'Inline',
    label: 'Inline Layout',
    type: 'boolean',
    defaultValue: false,
    description: 'Display inline with other components'
  },
  {
    id: 'Outlined',
    label: 'Outlined Style',
    type: 'boolean',
    defaultValue: false,
    description: 'Use outlined visual style'
  }
];

// Propriétés spécifiques par type de composant
export const ComponentSpecificProperties: Record<ComponentType, ComponentProperty[]> = {
  'TEXT': [
    {
      id: 'placeholder',
      label: 'Placeholder',
      type: 'text',
      defaultValue: '',
      description: 'Placeholder text'
    }
  ],
  'NUMERIC': [
    {
      id: 'EndpointOnchange',
      label: 'Endpoint On Change',
      type: 'boolean',
      defaultValue: false,
      description: 'Call endpoint when value changes'
    },
    {
      id: 'Enabled',
      label: 'Enabled',
      type: 'boolean',
      defaultValue: true,
      description: 'Enable or disable the field'
    }
  ],
  'GRIDLKP': [
    {
      id: 'KeyColumn',
      label: 'Key Column',
      type: 'text',
      defaultValue: '',
      description: 'Primary key column for lookup'
    },
    {
      id: 'showAliasBox',
      label: 'Show Alias Box',
      type: 'boolean',
      defaultValue: false,
      description: 'Show alias input box'
    },
    {
      id: 'EntitykeyField',
      label: 'Entity Key Field',
      type: 'text',
      defaultValue: '',
      description: 'Key field in the entity'
    },
    {
      id: 'filter',
      label: 'Filter',
      type: 'text',
      defaultValue: '',
      description: 'Filter criteria for lookup'
    }
  ],
  'LSTLKP': [
    {
      id: 'KeyColumn',
      label: 'Key Column',
      type: 'text',
      defaultValue: '',
      description: 'Primary key column for lookup'
    },
    {
      id: 'EntitykeyField',
      label: 'Entity Key Field',
      type: 'text',
      defaultValue: '',
      description: 'Key field in the entity'
    },
    {
      id: 'endpoint',
      label: 'Endpoint',
      type: 'text',
      defaultValue: '',
      description: 'API endpoint for data'
    },
    {
      id: 'MainPropItemList',
      label: 'Main Property',
      type: 'text',
      defaultValue: '',
      description: 'Main property to display'
    },
    {
      id: 'SecondPropItemList',
      label: 'Secondary Property',
      type: 'text',
      defaultValue: '',
      description: 'Secondary property to display'
    },
    {
      id: 'ShowSecndPropItemList',
      label: 'Show Secondary Property',
      type: 'boolean',
      defaultValue: false,
      description: 'Show secondary property'
    }
  ],
  'DATEPKR': [],
  'DATEPICKER': [],
  'SELECT': [
    {
      id: 'UserIntKey',
      label: 'User Integer Key',
      type: 'boolean',
      defaultValue: false,
      description: 'Use integer keys for options'
    }
  ],
  'CHECKBOX': [
    {
      id: 'CheckboxValue',
      label: 'Checkbox Value',
      type: 'boolean',
      defaultValue: false,
      description: 'Default checkbox state'
    }
  ],
  'RADIOGRP': [],
  'GRID': [
    {
      id: 'Endpoint',
      label: 'Data Endpoint',
      type: 'text',
      defaultValue: '',
      description: 'API endpoint for grid data'
    },
    {
      id: 'EntityKeyField',
      label: 'Entity Key Field',
      type: 'text',
      defaultValue: '',
      description: 'Primary key field for records'
    }
  ],
  'DIALOG': [
    {
      id: 'isGroup',
      label: 'Is Group Container',
      type: 'boolean',
      defaultValue: true,
      description: 'Container for child fields'
    }
  ],
  'GROUP': [
    {
      id: 'isGroup',
      label: 'Is Group Container',
      type: 'boolean',
      defaultValue: true,
      description: 'Container for child fields'
    }
  ],
  'LABEL': [],
  'FILEUPLOAD': []
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