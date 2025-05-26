import { ValidationOperators, FieldTypes, ComponentTypes } from "@shared/schema";

// Base field interface with comprehensive form properties
export interface FormField {
  Id: string;
  label: string;
  type: keyof typeof ComponentTypes;
  
  // Layout & Appearance Properties
  Inline?: boolean;
  Width?: string;
  Height?: string;
  Spacing?: string;
  Margin?: string;
  Padding?: string;
  BorderRadius?: string;
  BackgroundColor?: string;
  TextColor?: string;
  BorderColor?: string;
  BorderWidth?: string;
  FontSize?: string;
  FontWeight?: string;
  TextAlign?: 'left' | 'center' | 'right';
  
  // Form Behavior Properties
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  placeholder?: string;
  tooltip?: string;
  helpText?: string;
  
  // Styling & Visual Properties
  Outlined?: boolean;
  filled?: boolean;
  variant?: 'default' | 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  elevation?: number;
  shadow?: boolean;
  
  // Value Properties
  Value?: any;
  value?: any;
  defaultValue?: any;
  minValue?: number;
  maxValue?: number;
  UserIntKey?: boolean;
  CheckboxValue?: boolean;
  
  // Group Properties
  isGroup?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  groupStyle?: 'card' | 'fieldset' | 'section';
  
  // Animation Properties
  animation?: {
    type?: 'fade' | 'slide' | 'bounce' | 'none';
    duration?: number;
    delay?: number;
  };
  
  // Lookup specific properties
  KeyColumn?: string;
  ItemInfo?: {
    MainProperty: string;
    DescProperty: string;
    ShowDescription: boolean;
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
  
  // Events
  Events?: {
    onClickRow?: string;
    onClose?: string;
    onSubmit?: string;
  };
  
  // TEXT & TEXTAREA specific properties
  Rows?: number;
  Columns?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  multiline?: boolean;
  autoResize?: boolean;
  clearable?: boolean;
  
  // DATE & DATEPICKER specific properties
  dateFormat?: string;
  minDate?: string;
  maxDate?: string;
  disabledDates?: string[];
  showTime?: boolean;
  timeFormat?: string;
  locale?: string;
  
  // NUMBER & NUMERIC specific properties
  step?: number;
  precision?: number;
  showSpinButtons?: boolean;
  currency?: string;
  currencyDisplay?: 'symbol' | 'code' | 'name';
  
  // SELECT & DROPDOWN specific properties
  OptionValues?: Record<string, string>;
  multiple?: boolean;
  searchable?: boolean;
  clearable_select?: boolean;
  loading?: boolean;
  noOptionsText?: string;
  
  // CHECKBOX & RADIO specific properties
  checkboxGroup?: boolean;
  radioDirection?: 'horizontal' | 'vertical';
  checkboxStyle?: 'default' | 'switch' | 'button';
  
  // BUTTON & ACTION specific properties
  MethodToInvoke?: string;
  buttonType?: 'button' | 'submit' | 'reset';
  buttonVariant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading_button?: boolean;
  
  // FILE UPLOAD specific properties
  AcceptedTypes?: string[];
  MaxSize?: number;
  multiple_files?: boolean;
  dragDrop?: boolean;
  showPreview?: boolean;
  maxFiles?: number;
  
  // GRID & TABLE specific properties
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  selectable?: boolean;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  
  // GROUP & CONTAINER specific properties
  ChildFields?: FormField[];
  groupLayout?: 'vertical' | 'horizontal' | 'grid';
  columnsCount?: number;
  
  // TABS specific properties
  tabPosition?: 'top' | 'bottom' | 'left' | 'right';
  tabVariant?: 'default' | 'pills' | 'underline';
  
  // DIALOG & MODAL specific properties
  modalSize?: 'small' | 'medium' | 'large' | 'fullscreen';
  backdrop?: boolean;
  closable?: boolean;
  
  // PROGRESS & LOADING specific properties
  progressType?: 'linear' | 'circular';
  progressValue?: number;
  indeterminate?: boolean;
  
  // Responsive properties
  responsive?: {
    xs?: Partial<FormField>;
    sm?: Partial<FormField>;
    md?: Partial<FormField>;
    lg?: Partial<FormField>;
    xl?: Partial<FormField>;
  };
  
  // Accessibility properties
  accessibility?: {
    ariaLabel?: string;
    ariaDescribedBy?: string;
    tabIndex?: number;
    role?: string;
  };
  
  // Validation properties
  Validations?: ValidationRule[];
  
  // Conditional logic properties
  EnabledWhen?: ConditionExpression;
  VisibleWhen?: ConditionExpression;
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
