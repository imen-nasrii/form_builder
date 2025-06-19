import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, Search, Sparkles } from 'lucide-react';

interface FieldSuggestion {
  id: string;
  label: string;
  type: string;
  description: string;
  commonUseCase: string;
  example: any;
  category: string;
}

interface IntelligentFieldSuggestionsProps {
  onAddField: (fieldConfig: any) => void;
  existingFields: any[];
}

const SMART_FIELD_SUGGESTIONS: FieldSuggestion[] = [
  {
    id: 'fund-lookup',
    label: 'Fund Lookup',
    type: 'GRIDLKP',
    description: 'Fund ID selector with description lookup',
    commonUseCase: 'Financial applications requiring fund selection',
    category: 'Financial',
    example: {
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
    id: 'ticker-lookup',
    label: 'Ticker Lookup',
    type: 'GRIDLKP',
    description: 'Security ticker selector with details',
    commonUseCase: 'Trading and portfolio management',
    category: 'Financial',
    example: {
      Id: 'Ticker',
      Label: 'Ticker',
      Type: 'GRIDLKP',
      required: true,
      Inline: true,
      Width: '32',
      KeyColumn: 'tkr',
      ItemInfo: {
        MainProperty: 'tkr',
        DescProperty: 'tkr_DESC',
        ShowDescription: true
      },
      LoadDataInfo: {
        DataModel: 'Secrty',
        ColumnsDefinition: [
          {
            DataField: 'tkr',
            Caption: 'Ticker',
            DataType: 'STRING',
            Visible: true
          },
          {
            DataField: 'tkr_DESC',
            Caption: 'Description',
            DataType: 'STRING',
            Visible: true
          }
        ]
      }
    }
  },
  {
    id: 'date-picker',
    label: 'Process Date',
    type: 'DATEPKR',
    description: 'Date selection with validation',
    commonUseCase: 'Transaction and processing dates',
    category: 'Date & Time',
    example: {
      Id: 'ProcessDate',
      label: 'PROCDATE',
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
                RightField: 'ProcessDate',
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
    id: 'list-lookup',
    label: 'Category Lookup',
    type: 'LSTLKP',
    description: 'List-based selection with descriptions',
    commonUseCase: 'Category and classification selection',
    category: 'Selection',
    example: {
      Id: 'Category',
      label: 'CATEGORY',
      type: 'LSTLKP',
      Inline: true,
      Width: '32',
      KeyColumn: 'category',
      LoadDataInfo: {
        DataModel: 'Categories',
        ColumnsDefinition: [
          {
            DataField: 'category',
            DataType: 'STRING'
          },
          {
            DataField: 'description',
            DataType: 'STRING'
          }
        ]
      },
      ItemInfo: {
        MainProperty: 'category',
        DescProperty: 'description',
        ShowDescription: true
      }
    }
  },
  {
    id: 'radio-group',
    label: 'Option Group',
    type: 'RADIOGRP',
    description: 'Single selection from predefined options',
    commonUseCase: 'Configuration and mode selection',
    category: 'Selection',
    example: {
      Id: 'ProcessMode',
      type: 'RADIOGRP',
      value: 'dfCurrent',
      Width: '100',
      OptionValues: {
        'dfCurrent': 'Current',
        'dfPosting': 'Posting',
        'dfReval': 'Revaluation',
        'dfTrade': 'Trade'
      }
    }
  },
  {
    id: 'select-dropdown',
    label: 'Dropdown Selection',
    type: 'SELECT',
    description: 'Dropdown with predefined options',
    commonUseCase: 'Type and status selection',
    category: 'Selection',
    example: {
      Id: 'Type',
      label: 'TYPE',
      type: 'SELECT',
      Inline: true,
      Width: '32',
      required: false,
      Outlined: true,
      UserIntKey: true,
      OptionValues: {
        '0': '',
        '1': 'Type A',
        '2': 'Type B',
        '3': 'Type C'
      }
    }
  },
  {
    id: 'checkbox',
    label: 'Checkbox Option',
    type: 'CHECKBOX',
    description: 'Boolean selection with validation',
    commonUseCase: 'Feature toggles and confirmations',
    category: 'Selection',
    example: {
      Id: 'Option',
      label: 'OPTION',
      type: 'CHECKBOX',
      CheckboxValue: true,
      Value: false,
      Width: '200px'
    }
  },
  {
    id: 'numeric-input',
    label: 'Numeric Input',
    type: 'NUMERIC',
    description: 'Number input with validation',
    commonUseCase: 'Quantities, amounts, and calculations',
    category: 'Input',
    example: {
      Id: 'Amount',
      label: 'AMOUNT',
      type: 'NUMERIC',
      required: true,
      Width: '150px'
    }
  },
  {
    id: 'text-input',
    label: 'Text Input',
    type: 'TEXT',
    description: 'Single line text input',
    commonUseCase: 'Names, descriptions, and identifiers',
    category: 'Input',
    example: {
      Id: 'Description',
      label: 'DESCRIPTION',
      type: 'TEXT',
      DataField: 'description',
      Width: '300px'
    }
  },
  {
    id: 'data-grid',
    label: 'Data Grid',
    type: 'GRID',
    description: 'Editable data grid with actions',
    commonUseCase: 'Record management and bulk data entry',
    category: 'Layout',
    example: {
      Id: 'DataGrid',
      type: 'GRID',
      RecordActions: [
        {
          id: 'Edit',
          Label: 'Edit'
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
      ]
    }
  }
];

export function IntelligentFieldSuggestions({ onAddField, existingFields }: IntelligentFieldSuggestionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [suggestions, setSuggestions] = useState<FieldSuggestion[]>([]);

  const categories = ['all', ...Array.from(new Set(SMART_FIELD_SUGGESTIONS.map(s => s.category)))];

  useEffect(() => {
    // Intelligent suggestions based on existing fields
    const contextualSuggestions = getContextualSuggestions();
    setSuggestions(contextualSuggestions);
  }, [existingFields]);

  const getContextualSuggestions = (): FieldSuggestion[] => {
    const existingTypes = existingFields.map(f => f.type);
    const existingLabels = existingFields.map(f => f.label?.toLowerCase() || '');

    let scored = SMART_FIELD_SUGGESTIONS.map(suggestion => {
      let score = 0;

      // Boost score if complementary fields exist
      if (suggestion.type === 'GRIDLKP' && existingLabels.some(label => 
        label.includes('fund') || label.includes('ticker'))) {
        score += 10;
      }

      if (suggestion.type === 'DATEPKR' && existingTypes.includes('GRIDLKP')) {
        score += 8;
      }

      if (suggestion.type === 'CHECKBOX' && existingTypes.length > 2) {
        score += 5;
      }

      // Reduce score for duplicate types
      if (existingTypes.includes(suggestion.type)) {
        score -= 3;
      }

      return { ...suggestion, score };
    });

    return scored.sort((a, b) => b.score - a.score);
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesSearch = suggestion.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.commonUseCase.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || suggestion.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddField = (suggestion: FieldSuggestion) => {
    const fieldConfig = {
      ...suggestion.example,
      Id: `${suggestion.example.Id}_${Date.now()}`,
      id: `${suggestion.example.Id}_${Date.now()}`
    };
    
    onAddField(fieldConfig);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Intelligent Field Suggestions
        </CardTitle>
        
        <div className="flex gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search field suggestions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuggestions.slice(0, 9).map((suggestion, index) => (
            <div
              key={suggestion.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{suggestion.label}</h3>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {suggestion.type}
                  </Badge>
                </div>
                {index < 3 && (
                  <div className="flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-yellow-600">Smart</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
              <p className="text-xs text-gray-500 mb-3">{suggestion.commonUseCase}</p>
              
              <Button
                size="sm"
                onClick={() => handleAddField(suggestion)}
                className="w-full"
                variant="outline"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Field
              </Button>
            </div>
          ))}
        </div>
        
        {filteredSuggestions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No suggestions found for "{searchTerm}"</p>
            <p className="text-sm">Try a different search term or category</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default IntelligentFieldSuggestions;