import { ValidationOperators, FieldTypes, ComponentTypes } from "@shared/schema";

// FormField interface exactly matching your PDF documentation
export interface FormField {
  // Core Identifier (required)
  Id: string;
  Label?: string;
  Type?: keyof typeof ComponentTypes;
  
  // Basic Layout Properties (from PDF examples)
  Inline?: boolean;
  Width?: string;
  Spacing?: string;
  Required?: boolean;
  Outlined?: boolean;
  UserIntKey?: boolean;
  CheckboxValue?: boolean;
  Value?: any;
  IsGroup?: boolean;
  
  // Data Binding Properties (from PDF examples: psource, descr)
  DataField?: string;
  
  // Entity & Key Properties (from PDF: SourceGrid, SourceDetails)
  Entity?: string;
  EntityKeyField?: string;
  KeyColumn?: string;
  
  // GRID Properties (from PDF: SourceGrid example)
  RecordActions?: string[]; // Edit, Copy, Delete
  ColumnDefinitions?: string[]; // pSource, descr
  Endpoint?: string; // AllSources
  
  // GRIDLKP & LSTLKP Properties (from PDF: FundID, Ticker, SecCat, SecGrp examples)
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
  
  // Events (from PDF examples)
  Events?: {
    onClickRow?: string;
    onClose?: string;
    onSubmit?: string;
  };
  
  // TEXTAREA Properties (from PDF: Comments example)
  Rows?: number;
  
  // SELECT & RADIOGRP Properties (from PDF: Status, Priority, ApprovalStatus examples)
  OptionValues?: Record<string, string>; // {Active: "Active", Inactive: "Inactive", Pending: "Pending"}
  
  // ACTION Properties (from PDF: Actions example)
  MethodToInvoke?: string;
  
  // FILEUPLOAD Properties (from PDF: Attachments example)
  AcceptedTypes?: string[];
  MaxSize?: number;
  
  // GROUP Properties (from PDF: PROCAGAINST, AccrueTypeGroup, RPTOPTS examples)
  ChildFields?: FormField[];
  
  // Conditional Logic (from PDF examples)
  EnabledWhen?: ConditionExpression;
  VisibleWhen?: ConditionExpression;
  
  // Validations (from PDF: ERROR/WARNING examples)
  Validations?: ValidationRule[];
  
  // Compatibility properties
  label?: string;
  type?: keyof typeof ComponentTypes;
  required?: boolean;
  value?: any;
  isGroup?: boolean;
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

// Component props interfaces
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

export interface DragItem {
  type: string;
  fieldType: keyof typeof ComponentTypes;
}

export interface DropResult {
  fieldType: keyof typeof ComponentTypes;
  position?: number;
}

export interface FormBuilderState {
  formData: FormDefinition;
  selectedField: FormField | null;
  isDragging: boolean;
  draggedItem: DragItem | null;
}

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

export type FieldComponentProps = GridLookupProps;