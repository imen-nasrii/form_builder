import { useDrop } from "react-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, X } from "lucide-react";
import type { FormField } from "@/lib/form-types";
import { 
  GridLookupField,
  ListLookupField,
  DatePickerField,
  SelectField,
  CheckboxField,
  RadioGroupField,
  GroupField
} from "./field-components";

interface FormCanvasProps {
  formData: {
    menuId: string;
    label: string;
    formWidth: string;
    layout: string;
    fields: FormField[];
  };
  selectedField: FormField | null;
  onSelectField: (field: FormField | null) => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onRemoveField: (fieldId: string) => void;
  onAddField: (field: FormField) => void;
}

export default function FormCanvas({
  formData,
  selectedField,
  onSelectField,
  onUpdateField,
  onRemoveField,
  onAddField
}: FormCanvasProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: { type: string }) => {
      const newField: FormField = {
        Id: `field_${Date.now()}`,
        label: `New ${item.type}`,
        type: item.type as any,
        Inline: true,
        Width: "32",
        required: false
      };

      // Add component-specific default properties
      switch (item.type) {
        case 'GRIDLKP':
          newField.KeyColumn = "";
          newField.ItemInfo = {
            MainProperty: "",
            DescProperty: "",
            ShowDescription: true
          };
          newField.LoadDataInfo = {
            DataModel: "",
            ColumnsDefinition: []
          };
          break;
        case 'LSTLKP':
          newField.KeyColumn = "";
          newField.ItemInfo = {
            MainProperty: "",
            DescProperty: "",
            ShowDescription: true
          };
          newField.LoadDataInfo = {
            DataModel: "",
            ColumnsDefinition: []
          };
          break;
        case 'SELECT':
          newField.OptionValues = {};
          newField.Outlined = true;
          break;
        case 'RADIOGRP':
          newField.OptionValues = {};
          break;
        case 'GROUP':
          newField.isGroup = true;
          newField.ChildFields = [];
          break;
      }

      onAddField(newField);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const renderField = (field: FormField) => {
    const isSelected = selectedField?.Id === field.Id;
    
    const commonProps = {
      field,
      isSelected,
      onSelect: () => onSelectField(field),
      onUpdate: (updates: Partial<FormField>) => onUpdateField(field.Id, updates),
      onRemove: () => onRemoveField(field.Id)
    };

    switch (field.type) {
      case 'GRIDLKP':
        return <GridLookupField key={field.Id} {...commonProps} />;
      case 'LSTLKP':
        return <ListLookupField key={field.Id} {...commonProps} />;
      case 'DATEPICKER':
      case 'DATEPKR':
        return <DatePickerField key={field.Id} {...commonProps} />;
      case 'SELECT':
        return <SelectField key={field.Id} {...commonProps} />;
      case 'CHECKBOX':
        return <CheckboxField key={field.Id} {...commonProps} />;
      case 'RADIOGRP':
        return <RadioGroupField key={field.Id} {...commonProps} />;
      case 'GROUP':
        return <GroupField key={field.Id} {...commonProps} />;
      default:
        return (
          <div key={field.Id} className="p-4 border border-red-200 rounded-lg bg-red-50">
            <p className="text-sm text-red-600">Unknown field type: {field.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Form Canvas */}
      <div className="flex-1 p-6 overflow-auto form-canvas">
        <div className="max-w-4xl mx-auto">
          {/* Form Container */}
          <Card className="min-h-96 shadow-sm">
            {/* Form Header */}
            <CardHeader className="border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {formData.label || "Untitled Form"}
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    {formData.layout} Form
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span>FormID: {formData.menuId || "N/A"}</span>
                  <Badge variant="outline">{formData.formWidth}</Badge>
                </div>
              </div>
            </CardHeader>

            {/* Drop Zone */}
            <CardContent 
              ref={drop}
              className={`p-6 min-h-96 transition-colors ${
                isOver ? 'drop-zone-active' : ''
              }`}
            >
              <div className="space-y-6">
                {formData.fields.map(renderField)}

                {/* Empty Drop Zone */}
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isOver 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-slate-300 hover:border-primary-400'
                }`}>
                  <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 mb-2">
                    Drop components here to add to form
                  </p>
                  <p className="text-xs text-slate-400">
                    Drag from the component palette on the left
                  </p>
                </div>
              </div>
            </CardContent>

            {/* Form Actions Footer */}
            <div className="border-t border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Actions & Validations
                </div>
                <Button className="enterprise-gradient">
                  <Play className="w-4 h-4 mr-2" />
                  PROCESS
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
