export interface FormField {
  Id: string;
  Type: string;
  Label: string;
  DataField: string;
  Entity: string;
  Width: string;
  Spacing: string;
  Required: boolean;
  Inline: boolean;
  Outlined: boolean;
  Value: any;
  ChildFields?: FormField[];
  // Additional properties for specific component types
  LookupTable?: string;
  DisplayField?: string;
  ValueField?: string;
  Columns?: any[];
  MultiSelect?: boolean;
  Searchable?: boolean;
  PageSize?: number;
  LookupList?: string;
  DisplayMember?: string;
  ValueMember?: string;
  Sorted?: boolean;
  AutoComplete?: boolean;
  ValueFormat?: string;
  DefaultToToday?: boolean;
  Readonly?: boolean;
  VisibleWhen?: string;
  EnabledWhen?: string;
  DateValidation?: string;
  MaxLength?: number;
  Placeholder?: string;
  Validation?: string;
  Options?: Array<{ label: string; value: string }>;
  SelectedValue?: string;
  CheckedValue?: boolean;
  UncheckedValue?: boolean;
  MinValue?: number;
  MaxValue?: number;
  DecimalPlaces?: number;
  Format?: string;
}

export interface FormData {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo: string;
  status: string;
  priority: string;
}

export const ComponentTypes = {
  'GRIDLKP': { label: 'Grid Lookup', icon: 'Grid' },
  'LSTLKP': { label: 'List Lookup', icon: 'List' },
  'DATEPKR': { label: 'Date Picker', icon: 'Calendar' },
  'TEXT': { label: 'Text Input', icon: 'Type' },
  'SELECT': { label: 'Select List', icon: 'ChevronDown' },
  'RADIOGRP': { label: 'Radio Group', icon: 'RadioIcon' },
  'CHECKBOX': { label: 'Checkbox', icon: 'CheckSquare' },
  'GROUP': { label: 'Field Group', icon: 'Layout' },
  'NUMERIC': { label: 'Numeric Input', icon: 'Hash' },
  'TEXTAREA': { label: 'Text Area', icon: 'AlignLeft' },
  'BUTTON': { label: 'Button', icon: 'Square' },
  'HIDDEN': { label: 'Hidden Field', icon: 'EyeOff' },
  'LABEL': { label: 'Label', icon: 'Tag' },
  'SEPARATOR': { label: 'Separator', icon: 'Minus' },
  'IMAGE': { label: 'Image', icon: 'Image' },
  'PASSWORD': { label: 'Password', icon: 'Lock' },
  'EMAIL': { label: 'Email', icon: 'Mail' },
  'PHONE': { label: 'Phone', icon: 'Phone' },
  'URL': { label: 'URL', icon: 'Link' },
  'TIME': { label: 'Time', icon: 'Clock' },
  'COLOR': { label: 'Color', icon: 'Palette' },
  'RANGE': { label: 'Range', icon: 'Slider' },
  'FILE': { label: 'File Upload', icon: 'Upload' },
  'RATING': { label: 'Rating', icon: 'Star' },
  'TOGGLE': { label: 'Toggle', icon: 'ToggleLeft' },
  'PROGRESS': { label: 'Progress', icon: 'TrendingUp' },
  'GRID': { label: 'Data Grid', icon: 'Grid' },
  'DIALOG': { label: 'Dialog', icon: 'MessageSquare' },
  'FILEUPLOAD': { label: 'File Upload', icon: 'Upload' }
};