import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Settings, X, Plus } from "lucide-react";
import type { RadioGroupProps } from "@/lib/form-types";

export default function RadioGroupField({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onRemove
}: RadioGroupProps) {
  const [selectedValue, setSelectedValue] = useState(field.value || "");

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
      ["option1", "Option 1"],
      ["option2", "Option 2"]
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
          <Badge className="field-type-RADIOGRP text-xs">
            RADIOGRP
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

      {/* Radio Group */}
      <div className="space-y-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <RadioGroup
            value={selectedValue}
            onValueChange={handleValueChange}
            className="space-y-2"
          >
            {optionEntries.map(([key, value]) => (
              <div key={key} className="flex items-center space-x-3">
                <RadioGroupItem 
                  value={key} 
                  id={`${field.Id}-${key}`}
                  disabled={!hasValidOptions}
                />
                <Label 
                  htmlFor={`${field.Id}-${key}`}
                  className={`text-sm cursor-pointer ${
                    !hasValidOptions ? 'text-slate-400' : 'text-slate-700'
                  }`}
                >
                  {value}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Configuration Status */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span>Options: {hasValidOptions ? Object.keys(field.OptionValues!).length : 2}</span>
            {field.Spacing && (
              <span>• Spacing: {field.Spacing}px</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasValidOptions ? (
              <span className="text-green-600">✓ Configured</span>
            ) : (
              <span className="text-blue-600">ℹ Default Options</span>
            )}
          </div>
        </div>

        {/* Option Values Configuration */}
        {hasValidOptions && (
          <div className="bg-white border border-slate-200 rounded-md">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
              <span className="text-xs font-medium text-slate-700">Option Configuration</span>
            </div>
            <div className="p-3">
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {optionEntries.map(([key, value], index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-600">{key}</span>
                    <span className="text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Configuration Helper */}
        {!hasValidOptions && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center space-x-2 text-xs text-blue-700">
              <Plus className="h-3 w-3" />
              <span>Using default options. Click settings to customize.</span>
            </div>
          </div>
        )}

        {/* Selected Value Display */}
        {selectedValue && (
          <div className="bg-green-50 border border-green-200 rounded-md p-2">
            <div className="text-xs text-green-700">
              <span className="font-medium">Selected: </span>
              <span>{
                hasValidOptions 
                  ? field.OptionValues![selectedValue] 
                  : optionEntries.find(([k]) => k === selectedValue)?.[1]
              }</span>
              <span className="text-green-600 ml-2">({selectedValue})</span>
            </div>
          </div>
        )}

        {/* Layout Information */}
        <div className="bg-slate-100 border border-slate-200 rounded-md p-2">
          <div className="text-xs text-slate-600">
            <span className="font-medium">Layout: </span>
            <span>Vertical radio buttons</span>
            {field.Width && (
              <span className="ml-2">• Width: {field.Width}</span>
            )}
          </div>
        </div>

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
                {validation.Type}: Radio selection validation rule applied
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
