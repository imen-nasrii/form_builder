import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Info, Lightbulb, Code2, Settings2 } from 'lucide-react';

interface ComponentHelpData {
  [key: string]: {
    title: string;
    description: string;
    useCase: string;
    properties: Array<{
      name: string;
      description: string;
      type: string;
      example?: string;
    }>;
    tips: string[];
    category: string;
  };
}

const componentHelpData: ComponentHelpData = {
  TEXT: {
    title: 'Text Input',
    description: 'Single-line text input field for capturing user text data',
    useCase: 'Perfect for names, emails, phone numbers, and short text entries',
    category: 'Input Controls',
    properties: [
      { name: 'DataField', description: 'Database field to store the value', type: 'string', example: 'customer_name' },
      { name: 'Label', description: 'Display label shown to users', type: 'string', example: 'Full Name' },
      { name: 'Placeholder', description: 'Hint text shown when empty', type: 'string', example: 'Enter your name' },
      { name: 'Required', description: 'Makes field mandatory', type: 'boolean', example: 'true' },
      { name: 'MaxLength', description: 'Maximum character limit', type: 'number', example: '100' }
    ],
    tips: [
      'Use meaningful labels that clearly describe what data is expected',
      'Add placeholder text to provide examples or hints',
      'Set appropriate MaxLength to prevent overly long entries',
      'Use Required=true for essential fields only'
    ]
  },
  SELECT: {
    title: 'Dropdown Selection',
    description: 'Dropdown menu allowing users to choose from predefined options',
    useCase: 'Ideal for categories, statuses, countries, or any fixed set of choices',
    category: 'Selection Controls',
    properties: [
      { name: 'DataField', description: 'Database field to store selected value', type: 'string', example: 'status' },
      { name: 'Label', description: 'Display label for the dropdown', type: 'string', example: 'Status' },
      { name: 'Options', description: 'List of available choices', type: 'array', example: 'Active,Inactive,Pending' },
      { name: 'DefaultValue', description: 'Pre-selected option', type: 'string', example: 'Active' },
      { name: 'Required', description: 'Makes selection mandatory', type: 'boolean', example: 'true' }
    ],
    tips: [
      'Keep option lists concise - too many choices overwhelm users',
      'Order options logically (alphabetically or by frequency of use)',
      'Consider using LSTLKP for dynamic data from databases',
      'Set sensible default values to speed up data entry'
    ]
  },
  GRIDLKP: {
    title: 'Data Grid Lookup',
    description: 'Advanced grid component with search, filter, and selection capabilities',
    useCase: 'Best for complex data selection from large datasets with multiple columns',
    category: 'Lookup Components',
    properties: [
      { name: 'DataField', description: 'Field to store selected record ID', type: 'string', example: 'selected_customer_id' },
      { name: 'Label', description: 'Grid title or description', type: 'string', example: 'Customer Lookup' },
      { name: 'Entity', description: 'Database table or view name', type: 'string', example: 'customers' },
      { name: 'DisplayColumns', description: 'Columns to show in grid', type: 'array', example: 'name,email,phone' },
      { name: 'SearchColumn', description: 'Primary search field', type: 'string', example: 'name' }
    ],
    tips: [
      'Configure only essential columns to avoid clutter',
      'Set up proper search columns for fast data location',
      'Use filters to help users narrow down large datasets',
      'Consider performance with very large data tables'
    ]
  },
  DATEPKR: {
    title: 'Date Picker',
    description: 'Calendar interface for selecting dates with validation',
    useCase: 'Essential for birthdays, deadlines, appointments, and any date-related data',
    category: 'Input Controls',
    properties: [
      { name: 'DataField', description: 'Database field for date storage', type: 'string', example: 'birth_date' },
      { name: 'Label', description: 'Field label displayed to users', type: 'string', example: 'Birth Date' },
      { name: 'Format', description: 'Date display format', type: 'string', example: 'DD/MM/YYYY' },
      { name: 'MinDate', description: 'Earliest selectable date', type: 'date', example: '01/01/1950' },
      { name: 'MaxDate', description: 'Latest selectable date', type: 'date', example: '31/12/2030' }
    ],
    tips: [
      'Set appropriate min/max dates to prevent invalid selections',
      'Use consistent date formats throughout your application',
      'Consider timezone implications for international applications',
      'Provide clear format examples in labels or placeholders'
    ]
  },
  CHECKBOX: {
    title: 'Checkbox',
    description: 'Boolean input for true/false or yes/no selections',
    useCase: 'Perfect for agreements, preferences, feature toggles, and binary choices',
    category: 'Selection Controls',
    properties: [
      { name: 'DataField', description: 'Database field for boolean value', type: 'string', example: 'newsletter_subscribed' },
      { name: 'Label', description: 'Checkbox label text', type: 'string', example: 'Subscribe to newsletter' },
      { name: 'DefaultValue', description: 'Initial checked state', type: 'boolean', example: 'false' },
      { name: 'Required', description: 'Must be checked to proceed', type: 'boolean', example: 'true' }
    ],
    tips: [
      'Use clear, positive language in checkbox labels',
      'Avoid double negatives that confuse users',
      'Group related checkboxes visually',
      'Consider default states carefully - pre-checked vs unchecked'
    ]
  },
  TEXTAREA: {
    title: 'Multi-line Text Area',
    description: 'Large text input field for longer content and descriptions',
    useCase: 'Ideal for comments, descriptions, notes, and any multi-line text content',
    category: 'Input Controls',
    properties: [
      { name: 'DataField', description: 'Database field for text storage', type: 'string', example: 'description' },
      { name: 'Label', description: 'Field label for the text area', type: 'string', example: 'Description' },
      { name: 'Rows', description: 'Number of visible text rows', type: 'number', example: '4' },
      { name: 'MaxLength', description: 'Character limit', type: 'number', example: '1000' },
      { name: 'Placeholder', description: 'Helper text shown when empty', type: 'string', example: 'Enter detailed description...' }
    ],
    tips: [
      'Set appropriate row height based on expected content length',
      'Show character counts for limited-length fields',
      'Provide clear guidance on what content is expected',
      'Consider auto-resizing for better user experience'
    ]
  }
};

interface ComponentHelpPopupProps {
  componentType: string;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  isDarkMode?: boolean;
}

export default function ComponentHelpPopup({
  componentType,
  isVisible,
  position,
  onClose,
  isDarkMode = false
}: ComponentHelpPopupProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  const helpData = componentHelpData[componentType];
  
  if (!isVisible || !helpData) return null;

  return (
    <div 
      className="fixed z-50 pointer-events-none"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translate(-50%, -100%)',
        marginTop: '-10px'
      }}
    >
      <div className={`pointer-events-auto transition-all duration-300 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <Card className={`w-80 shadow-lg border-2 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700">{componentType}</Badge>
                <CardTitle className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {helpData.title}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <Badge variant="outline" className="text-xs w-fit">
              {helpData.category}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs max-h-64 overflow-y-auto">
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {helpData.description}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <Lightbulb className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Use Case</span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-300">{helpData.useCase}</p>
            </div>

            <div>
              <div className="flex items-center gap-1 mb-2">
                <Settings2 className="w-3 h-3 text-gray-600" />
                <span className="text-xs font-medium">Key Properties</span>
              </div>
              <div className="space-y-1">
                {helpData.properties.slice(0, 3).map((prop) => (
                  <div key={prop.name} className="flex justify-between">
                    <span className="text-xs font-mono text-purple-600">{prop.name}</span>
                    <span className="text-xs text-gray-500 ml-2 flex-1 text-right">{prop.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <Info className="w-3 h-3 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Quick Tips</span>
              </div>
              <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-0.5">
                {helpData.tips.slice(0, 2).map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Arrow pointer */}
        <div 
          className={`w-3 h-3 transform rotate-45 mx-auto -mt-1.5 ${
            isDarkMode ? 'bg-gray-800 border-r border-b border-gray-600' : 'bg-white border-r border-b border-gray-300'
          }`}
        />
      </div>
    </div>
  );
}