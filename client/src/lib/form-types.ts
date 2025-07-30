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

  // GRIDLKP specific properties
  KeyColumn?: string;
  ItemInfo?: {
    MainProperty: string;
    DescProperty: string;
    ShowDescription: boolean;
  };
  LoadDataInfo?: {
    DataModel: string;
    ColumnsDefinition: Array<{
      DataField: string;
      Caption: string;
      DataType: string;
      Visible: boolean;
    }>;
  };
  
  // Other component specific properties
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