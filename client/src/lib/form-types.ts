import { ValidationOperators, FieldTypes, ComponentTypes } from "@shared/schema";

// Base field interface matching the JSON structure from the provided data
export interface FormField {
  Id: string;
  label: string;
  type: keyof typeof ComponentTypes;
  Inline?: boolean;
  Width?: string;
  Spacing?: string;
  required?: boolean;
  Outlined?: boolean;
  UserIntKey?: boolean;
  CheckboxValue?: boolean;
  Value?: any;
  value?: any;
  isGroup?: boolean;
  
  // Lookup specific properties
  KeyColumn?: string;
  ItemInfo?: {
    MainProperty: string;
    DescProperty: string;
    ShowDescription: boolean;
  };
  LoadDataInfo?: {
    DataModel: string;
    ColumnsDefinition: ColumnDefinition[];
  };
  
  // Select/Radio specific properties
  OptionValues?: Record<string, string>;
  
  // Group specific properties
  ChildFields?: FormField[];
  
  // Validation properties
  Validations?: ValidationRule[];
  
  // Conditional logic properties
  EnabledWhen?: ConditionExpression;
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
