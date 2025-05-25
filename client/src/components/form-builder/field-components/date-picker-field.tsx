import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DatePickerProps } from "@/lib/form-types";

export default function DatePickerField({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onRemove
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
    onUpdate({ value: date });
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      onUpdate({ value: date });
    } else {
      setSelectedDate(undefined);
      onUpdate({ value: null });
    }
  };

  const formatDateValue = () => {
    if (selectedDate) {
      return format(selectedDate, "yyyy-MM-dd");
    }
    return "";
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
          <Badge className="field-type-DATEPICKER text-xs">
            DATEPICKER
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

      {/* Date Picker Input */}
      <div className="space-y-3">
        <div className="relative">
          <Input
            type="date"
            value={formatDateValue()}
            onChange={handleDateInputChange}
            disabled={!isFieldEnabled()}
            className={`text-sm pr-10 ${
              !isFieldEnabled() ? 'bg-slate-100 cursor-not-allowed' : ''
            }`}
            placeholder="Select date..."
          />
          
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                disabled={!isFieldEnabled()}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCalendarOpen(!isCalendarOpen);
                }}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Field Status Information */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span>Format: YYYY-MM-DD</span>
            {field.Spacing && (
              <span>• Spacing: {field.Spacing}px</span>
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

        {/* Selected Date Display */}
        {selectedDate && (
          <div className="bg-green-50 border border-green-200 rounded-md p-2">
            <div className="text-xs text-green-700">
              <span className="font-medium">Selected: </span>
              <span>{format(selectedDate, "PPP")}</span>
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
                {validation.Type}: Date validation rule applied
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
