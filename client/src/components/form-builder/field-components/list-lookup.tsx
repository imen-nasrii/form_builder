import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, X, ChevronDown } from "lucide-react";
import type { ListLookupProps } from "@/lib/form-types";

export default function ListLookupField({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onRemove
}: ListLookupProps) {
  const [selectedValue, setSelectedValue] = useState("");

  const handleFieldClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    onUpdate({ value });
  };

  // Generate sample options based on data model configuration
  const getSampleOptions = () => {
    if (field.LoadDataInfo?.DataModel) {
      return [
        { value: "option1", label: "Sample Option 1" },
        { value: "option2", label: "Sample Option 2" },
        { value: "option3", label: "Sample Option 3" }
      ];
    }
    return [
      { value: "", label: "Configure data source..." }
    ];
  };

  const sampleOptions = getSampleOptions();

  return (
    <div
      className={`form-field-container p-4 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' 
          : 'border-slate-200 bg-slate-50 hover:border-primary-300'
      } ${field.required ? 'border-red-200 bg-red-50' : ''}`}
      onClick={handleFieldClick}
    >
      {/* Field Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="field-type-LSTLKP text-xs">
            LSTLKP
          </Badge>
          {field.required && (
            <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200">
              REQUIRED
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSettingsClick}
            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveClick}
            className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* List Lookup Select */}
      <div className="space-y-3">
        <Select 
          value={selectedValue} 
          onValueChange={handleValueChange}
          disabled={!field.LoadDataInfo?.DataModel}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={
              field.LoadDataInfo?.DataModel 
                ? `Select ${field.label}...` 
                : "Configure data source first"
            } />
          </SelectTrigger>
          <SelectContent>
            {sampleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Configuration Status */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span>Model: {field.LoadDataInfo?.DataModel || "Not configured"}</span>
          </div>
          <div className="flex items-center space-x-2">
            {field.KeyColumn && (
              <span className="text-green-600">✓ Key Column</span>
            )}
            {field.ItemInfo?.MainProperty && (
              <span className="text-green-600">✓ Main Property</span>
            )}
            {field.ItemInfo?.DescProperty && (
              <span className="text-green-600">✓ Description</span>
            )}
          </div>
        </div>

        {/* Column Configuration Preview */}
        {field.LoadDataInfo?.ColumnsDefinition && field.LoadDataInfo.ColumnsDefinition.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-md p-2">
            <div className="text-xs font-medium text-slate-700 mb-1">Column Configuration:</div>
            <div className="space-y-1">
              {field.LoadDataInfo.ColumnsDefinition.map((column, index) => (
                <div key={index} className="flex items-center justify-between text-xs text-slate-600">
                  <span>{column.Caption}</span>
                  <span className="text-slate-400">({column.DataType})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description Display */}
        {field.ItemInfo?.ShowDescription && selectedValue && (
          <div className="bg-slate-100 border border-slate-200 rounded-md p-2">
            <div className="text-xs text-slate-600">
              <span className="font-medium">Description: </span>
              <span>Auto-populated from {field.ItemInfo.DescProperty || 'description field'}</span>
            </div>
          </div>
        )}

        {/* Validation Messages */}
        {field.Validations && field.Validations.length > 0 && (
          <div className="space-y-1">
            {field.Validations.map((validation, index) => (
              <div
                key={index}
                className={`text-xs px-2 py-1 rounded ${
                  validation.Type === 'ERROR' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {validation.Type}: Validation rule applied
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
