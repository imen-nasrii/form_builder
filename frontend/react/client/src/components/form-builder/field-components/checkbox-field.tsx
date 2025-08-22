import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Settings, X } from "lucide-react";
import type { CheckboxFieldProps } from "@/lib/form-types";

export default function CheckboxField({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onRemove
}: CheckboxFieldProps) {
  const [isChecked, setIsChecked] = useState(field.Value || field.CheckboxValue || false);

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

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    onUpdate({ Value: checked, CheckboxValue: checked });
  };

  const isFieldEnabled = () => {
    // Check if field should be enabled based on conditional logic
    if (field.EnabledWhen) {
      // This would be evaluated by the validation engine
      // For now, just return true
      return true;
    }
    return true;
  };

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
          <Badge className="field-type-CHECKBOX text-xs">
            CHECKBOX
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

      {/* Checkbox Input */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Checkbox
            id={`checkbox-${field.Id}`}
            checked={isChecked}
            onCheckedChange={handleCheckboxChange}
            disabled={!isFieldEnabled()}
            className={`${!isFieldEnabled() ? 'opacity-50' : ''}`}
          />
          <Label 
            htmlFor={`checkbox-${field.Id}`}
            className={`text-sm cursor-pointer ${
              !isFieldEnabled() ? 'text-slate-400' : 'text-slate-700'
            }`}
          >
            {field.label}
          </Label>
        </div>

        {/* Field Status Information */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span>Value: {isChecked ? 'true' : 'false'}</span>
            {field.CheckboxValue !== undefined && (
              <span>• Default: {field.CheckboxValue ? 'true' : 'false'}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isFieldEnabled() ? (
              <span className="text-green-600">✓ Enabled</span>
            ) : (
              <span className="text-amber-600">⚠ Conditional</span>
            )}
          </div>
        </div>

        {/* Conditional Logic Display */}
        {field.EnabledWhen && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
            <div className="text-xs text-blue-700">
              <span className="font-medium">Enabled when: </span>
              <span>Conditional logic applied</span>
            </div>
          </div>
        )}

        {/* Current State Display */}
        <div className={`border rounded-md p-2 ${
          isChecked 
            ? 'bg-green-50 border-green-200' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`text-xs ${
            isChecked ? 'text-green-700' : 'text-slate-600'
          }`}>
            <span className="font-medium">Current state: </span>
            <span>{isChecked ? 'Checked' : 'Unchecked'}</span>
            {isChecked && (
              <span className="ml-2">✓</span>
            )}
          </div>
        </div>

        {/* Spacing Configuration */}
        {field.Spacing && (
          <div className="bg-slate-100 border border-slate-200 rounded-md p-2">
            <div className="text-xs text-slate-600">
              <span className="font-medium">Spacing: </span>
              <span>{field.Spacing}px</span>
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
                {validation.Type}: Checkbox validation rule applied
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
