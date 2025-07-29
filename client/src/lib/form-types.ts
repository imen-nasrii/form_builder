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
  Value: string;

  // Optional properties for specific component types
  KeyColumn?: string;
  LoadDataInfo?: string;
  ItemInfo?: string;
  UserIntKey?: boolean;
  OptionValues?: any;
  EnabledWhen?: string;
  ChildFields?: FormField[];
  
  // Other properties that might be needed
  [key: string]: any;
}

export interface FormData {
  id: number | null;
  menuId: string;
  label: string;
  formWidth: string;
  layout: string;
  fields: FormField[];
}