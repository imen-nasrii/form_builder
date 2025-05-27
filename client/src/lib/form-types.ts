import { ValidationOperators, FieldTypes, ComponentTypes } from "@shared/schema";

// Import the new comprehensive FormField structure
export * from "./form-types-new";

// Base field interface matching PDF documentation structure
export interface FormField {
  Id: string;
  Label?: string;
  label?: string; // Keep both for compatibility
  Type?: keyof typeof ComponentTypes;
  type?: keyof typeof ComponentTypes; // Keep both for compatibility
  
  // Core Properties from PDF
  Inline?: boolean;
  Width?: string;
  Spacing?: string;
  Required?: boolean;
  required?: boolean; // Keep both for compatibility
  Outlined?: boolean;
  UserIntKey?: boolean;
  CheckboxValue?: boolean;
  Value?: any;
  value?: any; // Keep both for compatibility
  IsGroup?: boolean;
  isGroup?: boolean; // Keep both for compatibility
  
  // GROUP Properties - for container components
  Children?: FormField[]; // Composants enfants dans le groupe
  children?: FormField[]; // Keep both for compatibility
  GroupLayout?: 'horizontal' | 'vertical' | 'grid';
  GroupStyle?: {
    border?: boolean;
    background?: string;
    padding?: string;
    borderRadius?: string;
  };
  
  // Data Binding Properties
  DataField?: string;
  EnabledWhen?: any;
  Validations?: any;
  
  // Entity & Key Properties (from PDF)
  Entity?: string;
  EntityKeyField?: string;
  KeyColumn?: string;
  
  // GRIDLKP & LSTLKP Properties (from PDF)
  ItemInfo?: {
    MainProperty: string;
    DescProperty?: string;
    ShowDescription?: boolean;
  };
  LoadDataInfo?: {
    DataModel?: string;
    ColumnsDefinition?: ColumnDefinition[];
    DataSource?: string;
    Endpoint?: string;
    Entity?: string;
    EntityKeyField?: string;
    RecordActions?: string[];
    DataField?: string;
    APIConnection?: {
      url: string;
      method: string;
      headers?: Record<string, string>;
      authentication?: {
        type: 'bearer' | 'basic' | 'apikey';
        token?: string;
        username?: string;
        password?: string;
        apiKey?: string;
      };
    };
    RealTime?: boolean;
  };
  
  // GRID Properties (from PDF)
  RecordActions?: string[]; // Edit, Copy, Delete
  ColumnDefinitions?: string[];
  Endpoint?: string;
  
  // Events (from PDF)
  Events?: {
    onClickRow?: string;
    onClose?: string;
    onSubmit?: string;
  };
  
  // TEXTAREA Properties (from PDF)
  Rows?: number;
  
  // SELECT & RADIOGRP Properties (from PDF)
  OptionValues?: Record<string, string>; // e.g., {Active: "Active", Inactive: "Inactive"}
  
  // ACTION Properties (from PDF)
  MethodToInvoke?: string;
  
  // FILEUPLOAD Properties (from PDF)
  AcceptedTypes?: string[];
  MaxSize?: number;
  
  // GROUP Properties (from PDF)
  ChildFields?: FormField[];
  
  // Validation Properties (from PDF)
  Validations?: ValidationRule[];
}

export interface ColumnDefinition {
  DataField: string;
  Caption: string;
  DataType: keyof typeof FieldTypes;
  Visible?: boolean;
}

export interface ValidationRule {
  Id: string;
  Type: "ERROR" | "WARNING";
  ConditionExpression?: ConditionExpression;
}

export interface ConditionExpression {
  LogicalOperator?: "AND" | "OR";
  Conditions: Condition[];
}

export interface Condition {
  RightField: string;
  Operator: keyof typeof ValidationOperators;
  Value?: any;
  ValueType?: keyof typeof FieldTypes;
}

export interface FormAction {
  ID: string;
  Label: string;
  MethodToInvoke: string;
}

export interface FormDefinition {
  MenuID: string;
  FormWidth: string;
  Layout: string;
  Label: string;
  Fields: FormField[];
  Actions: FormAction[];
  Validations: ValidationRule[];
}

// Component property interfaces for different field types
export interface GridLookupProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
}

export interface ListLookupProps extends GridLookupProps {}
export interface DatePickerProps extends GridLookupProps {}
export interface SelectFieldProps extends GridLookupProps {}
export interface CheckboxFieldProps extends GridLookupProps {}
export interface RadioGroupProps extends GridLookupProps {}
export interface GroupFieldProps extends GridLookupProps {}

// Drag and drop types
export interface DragItem {
  type: string;
  fieldType: keyof typeof ComponentTypes;
}

export interface DropResult {
  fieldType: keyof typeof ComponentTypes;
  position?: number;
}

// Form builder state
export interface FormBuilderState {
  formData: FormDefinition;
  selectedField: FormField | null;
  isDragging: boolean;
  draggedItem: DragItem | null;
}

// Validation engine types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface ValidationError {
  fieldId: string;
  message: string;
  type: "ERROR" | "WARNING";
  rule?: ValidationRule;
}

// Export utility type for field component props
export type FieldComponentProps = GridLookupProps;
