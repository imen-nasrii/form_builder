import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, X, Search } from "lucide-react";
import type { GridLookupProps } from "@/lib/form-types";

export default function GridLookupField({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onRemove
}: GridLookupProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

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

  const getDisplayValue = () => {
    if (searchValue) return searchValue;
    return field.ItemInfo?.MainProperty ? `${field.ItemInfo.MainProperty} Value` : "";
  };

  const getDescriptionValue = () => {
    if (field.ItemInfo?.ShowDescription && field.ItemInfo?.DescProperty) {
      return `${field.ItemInfo.DescProperty} Description`;
    }
    return "";
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
          <Badge className="field-type-GRIDLKP text-xs">
            GRIDLKP
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

      {/* Grid Lookup Input Fields */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {/* Key Column Input */}
          <div className="col-span-1">
            <div className="relative">
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={field.KeyColumn || "Key Value"}
                className="text-sm pr-8"
                disabled={!field.KeyColumn}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                <Search className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Description Column Input */}
          <div className="col-span-2">
            <Input
              type="text"
              value={getDescriptionValue()}
              placeholder={
                field.ItemInfo?.ShowDescription 
                  ? "Description (Auto-populated)" 
                  : "No description"
              }
              className="text-sm bg-slate-50"
              readOnly
            />
          </div>
        </div>

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
          </div>
        </div>

        {/* Expanded Grid View (Mock) */}
        {isExpanded && field.LoadDataInfo?.ColumnsDefinition && (
          <div className="mt-3 border border-slate-200 rounded-md">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Lookup Results</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="h-5 w-5 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="p-3">
              {/* Column Headers */}
              <div className="grid grid-cols-2 gap-2 mb-2 pb-1 border-b border-slate-200">
                {field.LoadDataInfo.ColumnsDefinition
                  .filter(col => col.Visible !== false)
                  .slice(0, 2)
                  .map((column, index) => (
                    <div key={index} className="text-xs font-medium text-slate-600">
                      {column.Caption}
                    </div>
                  ))
                }
              </div>
              {/* Sample Data Row */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div>Sample data...</div>
                <div>Configure data source</div>
              </div>
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
