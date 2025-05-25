import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, X, Plus } from "lucide-react";
import type { SelectFieldProps } from "@/lib/form-types";

export default function SelectField({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onRemove
}: SelectFieldProps) {
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

  const getOptionEntries = () => {
    if (field.OptionValues) {
      return Object.entries(field.OptionValues);
    }
    return [
      ["", "No options configured"]
    ];
  };

  const optionEntries = getOptionEntries();
  const hasValidOptions = field.OptionValues && Object.keys(field.OptionValues).length > 0;

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
          <Badge className="field-type-SELECT text-xs">
            SELECT
          </Badge>
          {field.required && (
            <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200">
              REQUIRED
            </Badge>
          )}
          {field.Outlined && (
            <Badge variant="outline" className="text-xs">
              OUTLINED
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

      {/* Select Dropdown */}
      <div className="space-y-3">
        <Select 
          value={selectedValue} 
          onValueChange={handleValueChange}
          disabled={!hasValidOptions}
        >
          <SelectTrigger className={`w-full ${field.Outlined ? 'border-2' : ''}`}>
            <SelectValue placeholder={
              hasValidOptions 
                ? `Select ${field.label}...` 
                : "Add options in properties panel"
            } />
          </SelectTrigger>
          <SelectContent>
            {optionEntries.map(([key, value]) => (
              <SelectItem key={key} value={key} disabled={!hasValidOptions}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Configuration Status */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span>Options: {hasValidOptions ? Object.keys(field.OptionValues!).length : 0}</span>
            {field.UserIntKey && (
              <span>• Integer Keys</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasValidOptions ? (
              <span className="text-green-600">✓ Configured</span>
            ) : (
              <span className="text-amber-600">⚠ Needs Options</span>
            )}
          </div>
        </div>

        {/* Option Values Preview */}
        {hasValidOptions && (
          <div className="bg-white border border-slate-200 rounded-md">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
              <span className="text-xs font-medium text-slate-700">Option Values</span>
            </div>
            <div className="p-3 max-h-32 overflow-y-auto">
              <div className="space-y-1">
                {optionEntries.slice(0, 5).map(([key, value], index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-600">{key}</span>
                    <span className="text-slate-700">{value}</span>
                  </div>
                ))}
                {optionEntries.length > 5 && (
                  <div className="text-xs text-slate-400 text-center pt-1">
                    ... and {optionEntries.length - 5} more
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Configuration Helper */}
        {!hasValidOptions && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <div className="flex items-center space-x-2 text-xs text-amber-700">
              <Plus className="h-3 w-3" />
              <span>Click the settings button to add option values</span>
            </div>
          </div>
        )}

        {/* Selected Value Display */}
        {selectedValue && hasValidOptions && (
          <div className="bg-green-50 border border-green-200 rounded-md p-2">
            <div className="text-xs text-green-700">
              <span className="font-medium">Selected: </span>
              <span>{field.OptionValues![selectedValue]}</span>
              <span className="text-green-600 ml-2">({selectedValue})</span>
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
                {validation.Type}: Selection validation rule applied
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
