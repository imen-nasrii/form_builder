// Version propre sans react-dnd
// Cette version remplace complètement le système de drag & drop

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
  ChildFields?: FormField[];
}

export const createDefaultField = (componentType: string): FormField => {
  return {
    Id: `field_${Date.now()}`,
    Type: componentType,
    Label: `${componentType} Field`,
    DataField: "",
    Entity: "",
    Width: "",
    Spacing: "",
    Required: false,
    Inline: false,
    Outlined: false,
    Value: ""
  };
};

export const updateFieldInStructure = (
  fields: FormField[],
  fieldId: string,
  updates: Partial<FormField>
): FormField[] => {
  return fields.map(field =>
    field.Id === fieldId ? { ...field, ...updates } : field
  );
};

export const removeFieldFromStructure = (
  fields: FormField[],
  fieldId: string
): FormField[] => {
  return fields.filter(field => field.Id !== fieldId);
};