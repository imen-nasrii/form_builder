import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  List, 
  Calendar, 
  CheckSquare, 
  Hash, 
  Type, 
  Grid3X3,
  RadioIcon,
  ChevronDown,
  Search
} from 'lucide-react';

interface ComponentPaletteProps {
  onDragStart: (component: any) => void;
}

const PROFESSIONAL_COMPONENTS = [
  {
    id: 'gridlkp',
    label: 'Grid Lookup',
    type: 'GRIDLKP',
    icon: Database,
    color: 'bg-blue-500',
    description: 'Data grid lookup with search',
    category: 'Lookup',
    template: {
      Id: 'FundID',
      label: 'FUND',
      type: 'GRIDLKP',
      required: true,
      Inline: true,
      Width: '32',
      KeyColumn: 'fund',
      ItemInfo: {
        MainProperty: 'fund',
        DescProperty: 'acnam1',
        ShowDescription: true
      },
      LoadDataInfo: {
        DataModel: 'Fndmas',
        ColumnsDefinition: [
          {
            DataField: 'fund',
            Caption: 'Fund ID',
            DataType: 'STRING',
            Visible: true
          },
          {
            DataField: 'acnam1',
            Caption: 'Fund Name',
            DataType: 'STRING',
            Visible: true
          }
        ]
      }
    }
  },
  {
    id: 'lstlkp',
    label: 'List Lookup',
    type: 'LSTLKP',
    icon: List,
    color: 'bg-green-500',
    description: 'Dropdown list lookup',
    category: 'Lookup',
    template: {
      Id: 'SecCat',
      label: 'SECCAT',
      type: 'LSTLKP',
      Inline: true,
      Width: '32',
      KeyColumn: 'seccat',
      LoadDataInfo: {
        DataModel: 'Seccat',
        ColumnsDefinition: [
          {
            DataField: 'seccat',
            DataType: 'STRING'
          },
          {
            DataField: 'descr',
            DataType: 'STRING'
          }
        ]
      },
      ItemInfo: {
        MainProperty: 'seccat',
        DescProperty: 'descr',
        ShowDescription: true
      }
    }
  },
  {
    id: 'datepkr',
    label: 'Date Picker',
    type: 'DATEPKR',
    icon: Calendar,
    color: 'bg-purple-500',
    description: 'Date selection with validation',
    category: 'Date & Time',
    template: {
      Id: 'TradeDate',
      label: 'TRADEDATE',
      type: 'DATEPKR',
      Inline: true,
      Width: '32',
      required: true,
      Validations: [
        {
          Id: '1',
          Type: 'ERROR',
          ConditionExpression: {
            Conditions: [
              {
                RightField: 'TradeDate',
                Operator: 'ISN',
                ValueType: 'DATE'
              }
            ]
          }
        }
      ]
    }
  },
  {
    id: 'select',
    label: 'Select Dropdown',
    type: 'SELECT',
    icon: ChevronDown,
    color: 'bg-orange-500',
    description: 'Dropdown with predefined options',
    category: 'Selection',
    template: {
      Id: 'SelectDropdown',
      label: 'SELECT',
      type: 'SELECT',
      Inline: true,
      Width: '32',
      required: false,
      Outlined: true,
      UserIntKey: true,
      OptionValues: {
        '0': '',
        '1': 'Option 1',
        '2': 'Option 2',
        '3': 'Option 3'
      }
    }
  },
  {
    id: 'radiogrp',
    label: 'Radio Group',
    type: 'RADIOGRP',
    icon: RadioIcon,
    color: 'bg-pink-500',
    description: 'Single selection radio buttons',
    category: 'Selection',
    template: {
      Id: 'RadioGroup',
      type: 'RADIOGRP',
      value: 'option1',
      Width: '100',
      OptionValues: {
        'option1': 'Option 1',
        'option2': 'Option 2',
        'option3': 'Option 3'
      }
    }
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    type: 'CHECKBOX',
    icon: CheckSquare,
    color: 'bg-indigo-500',
    description: 'Boolean checkbox input',
    category: 'Selection',
    template: {
      Id: 'Checkbox',
      label: 'CHECKBOX',
      type: 'CHECKBOX',
      CheckboxValue: true,
      Value: false,
      Width: '200px'
    }
  },
  {
    id: 'numeric',
    label: 'Numeric Input',
    type: 'NUMERIC',
    icon: Hash,
    color: 'bg-red-500',
    description: 'Number input with validation',
    category: 'Input',
    template: {
      Id: 'NumericInput',
      label: 'NUMBER',
      type: 'NUMERIC',
      required: true,
      Width: '150px'
    }
  },
  {
    id: 'text',
    label: 'Text Input',
    type: 'TEXT',
    icon: Type,
    color: 'bg-teal-500',
    description: 'Single line text input',
    category: 'Input',
    template: {
      Id: 'TextInput',
      label: 'TEXT',
      type: 'TEXT',
      DataField: 'text_field',
      Width: '300px'
    }
  },
  {
    id: 'grid',
    label: 'Data Grid',
    type: 'GRID',
    icon: Grid3X3,
    color: 'bg-cyan-500',
    description: 'Editable data grid',
    category: 'Layout',
    template: {
      Id: 'DataGrid',
      type: 'GRID',
      RecordActions: [
        {
          id: 'Edit',
          Label: 'Edit'
        },
        {
          id: 'Copy',
          Label: 'Copy'
        },
        {
          id: 'Delete',
          Label: 'Delete'
        }
      ],
      ColumnDefinitions: [
        {
          DataField: 'id',
          Caption: 'ID',
          DataType: 'STRING'
        },
        {
          DataField: 'name',
          Caption: 'Name',
          DataType: 'STRING'
        }
      ],
      Endpoint: 'DataEndpoint',
      Entity: 'DataEntity',
      EntityKeyField: 'id'
    }
  },
  {
    id: 'group',
    label: 'Field Group',
    type: 'GROUP',
    icon: Grid3X3,
    color: 'bg-gray-500',
    description: 'Container for grouping fields',
    category: 'Layout',
    template: {
      Id: 'FieldGroup',
      label: 'GROUP',
      type: 'GROUP',
      isGroup: true,
      Spacing: '0',
      ChildFields: []
    }
  }
];

const categories = Array.from(new Set(PROFESSIONAL_COMPONENTS.map(c => c.category)));

export function ProfessionalFormComponents({ onDragStart }: ComponentPaletteProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const filteredComponents = selectedCategory === 'all' 
    ? PROFESSIONAL_COMPONENTS 
    : PROFESSIONAL_COMPONENTS.filter(c => c.category === selectedCategory);

  const handleDragStart = (e: React.DragEvent, component: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component.template));
    onDragStart(component.template);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Professional Components</h2>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="p-4 space-y-3">
        {filteredComponents.map((component) => {
          const IconComponent = component.icon;
          return (
            <Card
              key={component.id}
              className="p-3 cursor-move hover:shadow-md transition-shadow border-l-4"
              style={{ borderLeftColor: component.color.replace('bg-', '#') }}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
            >
              <div className="flex items-start gap-3">
                <div className={`${component.color} p-2 rounded-lg`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 text-sm">{component.label}</h3>
                    <Badge variant="outline" className="text-xs">
                      {component.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{component.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default ProfessionalFormComponents;