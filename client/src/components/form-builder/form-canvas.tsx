import { useDrop } from "react-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, X, Play } from "lucide-react";
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
        case 'GRID':
          newField.RecordActions = ["Edit", "Copy", "Delete"];
          newField.ColumnDefinitions = [];
          newField.Endpoint = "";
          newField.Entity = "";
          newField.EntityKeyField = "";
          break;
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
        case 'TEXT':
          newField.DataField = "";
          newField.Value = "";
          newField.Outlined = true;
          break;
        case 'TEXTAREA':
          newField.DataField = "";
          newField.Value = "";
          newField.Rows = 3;
          newField.Outlined = true;
          break;
        case 'DIALOG':
          newField.isGroup = true;
          newField.Entity = "";
          newField.VisibleWhen = "";
          newField.ChildFields = [];
          break;
        case 'FILEUPLOAD':
          newField.Value = "";
          newField.AcceptedTypes = "";
          newField.MaxSize = "";
          break;
        case 'SELECT':
          newField.OptionValues = {};
          newField.Outlined = true;
          break;
        case 'RADIOGRP':
          newField.OptionValues = {};
          break;
        case 'CHECKBOX':
          newField.CheckboxValue = false;
          newField.Outlined = true;
          break;
        case 'DATEPICKER':
        case 'DATEPKR':
          newField.Value = "";
          newField.Outlined = true;
          break;
        case 'GROUP':
          newField.isGroup = true;
          newField.ChildFields = [];
          break;
        case 'ACTION':
          newField.Value = "Action";
          newField.MethodToInvoke = "";
          break;
        case 'VALIDATION':
          newField.Validations = [];
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
      case 'GRID':
        return (
          <div key={field.Id} className={`p-4 border rounded-lg ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'} dark:bg-gray-800 dark:border-gray-600`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Grille de données: {field.label}</span>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => onSelectField(field)}>
                  <Settings className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onRemoveField(field.Id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs">
              Table avec colonnes et actions
            </div>
          </div>
        );
      case 'GRIDLKP':
        return <GridLookupField key={field.Id} {...commonProps} />;
      case 'LSTLKP':
        return <ListLookupField key={field.Id} {...commonProps} />;
      case 'TEXT':
        return (
          <div key={field.Id} className={`p-4 border rounded-lg ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'} dark:bg-gray-800 dark:border-gray-600`}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">{field.label}</label>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => onSelectField(field)}>
                  <Settings className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onRemoveField(field.Id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <input 
              type="text" 
              placeholder="Saisir du texte..."
              className="w-full p-2 border border-gray-300 rounded text-sm"
              disabled
            />
          </div>
        );
      case 'TEXTAREA':
        return (
          <div key={field.Id} className={`p-4 border rounded-lg ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'} dark:bg-gray-800 dark:border-gray-600`}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">{field.label}</label>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => onSelectField(field)}>
                  <Settings className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onRemoveField(field.Id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <textarea 
              placeholder="Saisir du texte multiligne..."
              className="w-full p-2 border border-gray-300 rounded text-sm"
              rows={3}
              disabled
            />
          </div>
        );
      case 'DIALOG':
        return (
          <div key={field.Id} className={`p-4 border rounded-lg ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-purple-200 bg-purple-50'} dark:bg-purple-900/20 dark:border-purple-700`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-700">Boîte de dialogue: {field.label}</span>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => onSelectField(field)}>
                  <Settings className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onRemoveField(field.Id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded text-xs">
              Fenêtre modale avec contenu
            </div>
          </div>
        );
      case 'FILEUPLOAD':
        return (
          <div key={field.Id} className={`p-4 border rounded-lg ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'} dark:bg-gray-800 dark:border-gray-600`}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">{field.label}</label>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => onSelectField(field)}>
                  <Settings className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onRemoveField(field.Id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded p-3 text-center text-sm text-gray-500">
              📁 Cliquer pour télécharger un fichier
            </div>
          </div>
        );
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
      case 'ACTION':
        return (
          <div key={field.Id} className={`p-4 border rounded-lg ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-blue-200 bg-blue-50'} dark:bg-blue-900/20 dark:border-blue-700`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Action: {field.label}</span>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => onSelectField(field)}>
                  <Settings className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onRemoveField(field.Id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button size="sm" className="w-full">
              {field.Value || field.label}
            </Button>
          </div>
        );
      default:
        return (
          <div key={field.Id} className="p-4 border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Type non supporté: {field.type}
            </p>
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
