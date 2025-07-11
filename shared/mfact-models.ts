/**
 * MFact Model System - Comprehensive Data Models for Financial Programs
 * Supports ACCADJ, BUYTYP, PRIMNT, SRCMNT and all standard components
 */

export interface MFactField {
  Id: string;
  Type: ComponentType;
  Label: string;
  DataField: string;
  Entity?: string;
  Width?: string;
  Spacing?: string;
  Required?: boolean;
  Inline?: boolean;
  OutlinedStyle?: boolean;
  Position?: {
    row: number;
    col: number;
    rowSpan?: number;
    colSpan?: number;
  };
  Properties?: Record<string, any>;
  Validation?: ValidationRule[];
  Options?: SelectOption[];
  Children?: MFactField[]; // For GROUP containers
}

export interface MFactForm {
  menuId: string;
  label: string;
  formWidth: string;
  layout: FormLayout;
  fields: MFactField[];
  actions: ActionButton[];
  validations: ValidationRule[];
  metadata?: FormMetadata;
}

export interface FormMetadata {
  description?: string;
  category: ProgramCategory;
  version?: string;
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ComponentType = 
  // Input Controls
  | 'TEXT' | 'TEXTAREA' | 'NUMERIC' | 'DECIMAL' | 'PASSWORD'
  // Selection Controls  
  | 'SELECT' | 'CHECKBOX' | 'RADIOGRP' | 'TOGGLE'
  // Date & Time
  | 'DATEPICKER' | 'TIMEPICKER' | 'DATETIME'
  // Lookup Components
  | 'GRIDLKP' | 'LSTLKP' | 'TREELKP' | 'TABLELKP'
  // Data Display
  | 'LABEL' | 'DIVIDER' | 'SPACER' | 'IMAGE'
  // Container & Layout
  | 'GROUP' | 'PANEL' | 'TAB' | 'ACCORDION' | 'CARD'
  // File & Upload
  | 'FILEUPLOAD' | 'IMAGEUPLOAD' | 'DROPZONE'
  // Advanced Controls
  | 'SLIDER' | 'RATING' | 'COLOR' | 'RANGE'
  // Action Controls
  | 'BUTTON' | 'SUBMIT' | 'RESET' | 'CANCEL' | 'ACTION';

export type FormLayout = 'PROCESS' | 'MASTERMENU' | 'DIALOG' | 'POPUP' | 'FULLSCREEN' | 'WIZARD';

export type ProgramCategory = 'FINANCIAL' | 'INVENTORY' | 'ACCOUNTING' | 'REPORTING' | 'ADMINISTRATION' | 'CUSTOM';

export interface ComponentDefinition {
  type: ComponentType;
  label: string;
  icon: string;
  category: ComponentCategory;
  color: string;
  description: string;
  defaultProperties: Partial<MFactField>;
  allowedParents?: ComponentType[];
  allowsChildren?: boolean;
  isContainer?: boolean;
}

export type ComponentCategory = 
  | 'INPUT_CONTROLS' 
  | 'SELECTION_CONTROLS'
  | 'LOOKUP_COMPONENTS' 
  | 'CONTAINER_LAYOUT'
  | 'DATA_DISPLAY'
  | 'FILE_UPLOAD'
  | 'ACTION_VALIDATION';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface ValidationRule {
  type: ValidationType;
  message: string;
  value?: any;
  field?: string;
}

export type ValidationType = 
  | 'REQUIRED' | 'MINLENGTH' | 'MAXLENGTH' | 'PATTERN' | 'EMAIL' 
  | 'URL' | 'NUMBER' | 'POSITIVE' | 'NEGATIVE' | 'RANGE' 
  | 'DATE' | 'CUSTOM';

export interface ActionButton {
  id: string;
  type: 'SUBMIT' | 'RESET' | 'CANCEL' | 'CUSTOM';
  label: string;
  action: string;
  enabled?: boolean;
  visible?: boolean;
  style?: ActionStyle;
}

export type ActionStyle = 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'WARNING' | 'DANGER' | 'LINK';

// Pre-defined MFact Program Templates
export const MFACT_TEMPLATES: Record<string, Partial<MFactForm>> = {
  ACCADJ: {
    menuId: 'ACCADJ',
    label: 'Account Adjustment',
    formWidth: '700px',
    layout: 'PROCESS',
    metadata: {
      description: 'Account adjustment and reconciliation program',
      category: 'ACCOUNTING'
    }
  },
  BUYTYP: {
    menuId: 'BUYTYP',
    label: 'Buy Type Management',
    formWidth: '600px',
    layout: 'MASTERMENU',
    metadata: {
      description: 'Purchase type configuration and management',
      category: 'INVENTORY'
    }
  },
  PRIMNT: {
    menuId: 'PRIMNT',
    label: 'Primary Maintenance',
    formWidth: '800px',
    layout: 'PROCESS',
    metadata: {
      description: 'Primary data maintenance and updates',
      category: 'ADMINISTRATION'
    }
  },
  SRCMNT: {
    menuId: 'SRCMNT',
    label: 'Source Maintenance',
    formWidth: '750px',
    layout: 'MASTERMENU',
    metadata: {
      description: 'Source data configuration and maintenance',
      category: 'ADMINISTRATION'
    }
  }
};

// Component Registry with full definitions
export const COMPONENT_REGISTRY: ComponentDefinition[] = [
  // Input Controls
  {
    type: 'TEXT',
    label: 'Text Input',
    icon: 'Type',
    category: 'INPUT_CONTROLS',
    color: 'text-blue-600',
    description: 'Single line text input field',
    defaultProperties: {
      Type: 'TEXT',
      Label: 'Text Field',
      DataField: '',
      Width: '200px',
      Required: false
    }
  },
  {
    type: 'TEXTAREA',
    label: 'Text Area',
    icon: 'FileText',
    category: 'INPUT_CONTROLS',
    color: 'text-green-600',
    description: 'Multi-line text input area',
    defaultProperties: {
      Type: 'TEXTAREA',
      Label: 'Text Area',
      DataField: '',
      Width: '300px',
      Required: false
    }
  },
  {
    type: 'NUMERIC',
    label: 'Numeric Input',
    icon: 'Hash',
    category: 'INPUT_CONTROLS',
    color: 'text-purple-600',
    description: 'Numeric input with validation',
    defaultProperties: {
      Type: 'NUMERIC',
      Label: 'Number',
      DataField: '',
      Width: '150px',
      Required: false
    }
  },
  
  // Selection Controls
  {
    type: 'SELECT',
    label: 'Select Dropdown',
    icon: 'ChevronDown',
    category: 'SELECTION_CONTROLS',
    color: 'text-orange-600',
    description: 'Dropdown selection list',
    defaultProperties: {
      Type: 'SELECT',
      Label: 'Select Option',
      DataField: 'select_field',
      Width: '250px',
      Required: false,
      Options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],
      Properties: {
        placeholder: 'Choose an option...',
        multiple: false,
        searchable: false
      }
    }
  },
  {
    type: 'CHECKBOX',
    label: 'Checkbox',
    icon: 'CheckSquare',
    category: 'SELECTION_CONTROLS',
    color: 'text-cyan-600',
    description: 'Boolean checkbox control',
    defaultProperties: {
      Type: 'CHECKBOX',
      Label: 'Checkbox Option',
      DataField: 'checkbox_field',
      Width: 'auto',
      Required: false,
      Inline: true,
      Properties: {
        checkedValue: 'true',
        uncheckedValue: 'false',
        defaultChecked: false
      }
    }
  },
  {
    type: 'RADIOGRP',
    label: 'Radio Group',
    icon: 'Circle',
    category: 'SELECTION_CONTROLS',
    color: 'text-pink-600',
    description: 'Radio button group for single selection',
    defaultProperties: {
      Type: 'RADIOGRP',
      Label: 'Radio Group',
      DataField: '',
      Required: false,
      Options: []
    }
  },
  
  // Date & Time
  {
    type: 'DATEPICKER',
    label: 'Date Picker',
    icon: 'Calendar',
    category: 'INPUT_CONTROLS',
    color: 'text-red-600',
    description: 'Date selection control',
    defaultProperties: {
      Type: 'DATEPICKER',
      Label: 'Date',
      DataField: '',
      Width: '180px',
      Required: false
    }
  },
  
  // Lookup Components
  {
    type: 'GRIDLKP',
    label: 'Grid Lookup',
    icon: 'Grid3X3',
    category: 'LOOKUP_COMPONENTS',
    color: 'text-blue-700',
    description: 'Grid-based data lookup',
    defaultProperties: {
      Type: 'GRIDLKP',
      Label: 'Grid Lookup',
      DataField: 'grid_lookup_field',
      Entity: 'LookupTable',
      Width: '500px',
      Required: false,
      Properties: {
        displayColumns: ['id', 'name', 'description'],
        valueColumn: 'id',
        labelColumn: 'name',
        searchable: true,
        multiSelect: false,
        pageSize: 10
      }
    }
  },
  {
    type: 'LSTLKP',
    label: 'List Lookup',
    icon: 'List',
    category: 'LOOKUP_COMPONENTS',
    color: 'text-green-700',
    description: 'List-based data lookup',
    defaultProperties: {
      Type: 'LSTLKP',
      Label: 'List Lookup',
      DataField: '',
      Entity: '',
      Width: '300px',
      Required: false
    }
  },
  
  // Container & Layout
  {
    type: 'GROUP',
    label: 'Group Container',
    icon: 'Users',
    category: 'CONTAINER_LAYOUT',
    color: 'text-emerald-600',
    description: 'Container for grouping components',
    defaultProperties: {
      Type: 'GROUP',
      Label: 'Group Container',
      Width: '100%',
      Children: []
    },
    isContainer: true,
    allowsChildren: true
  },
  
  // File Upload
  {
    type: 'FILEUPLOAD',
    label: 'File Upload',
    icon: 'Upload',
    category: 'FILE_UPLOAD',
    color: 'text-indigo-600',
    description: 'File upload control',
    defaultProperties: {
      Type: 'FILEUPLOAD',
      Label: 'Upload File',
      DataField: '',
      Required: false
    }
  },
  
  // Actions
  {
    type: 'ACTION',
    label: 'Action Button',
    icon: 'Zap',
    category: 'ACTION_VALIDATION',
    color: 'text-red-500',
    description: 'Custom action button',
    defaultProperties: {
      Type: 'ACTION',
      Label: 'Action',
      Width: '120px'
    }
  }
];