import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDrop } from "react-dnd";
import { Settings, X, Plus, FolderOpen } from "lucide-react";
import { createDefaultField } from "@/lib/drag-drop";
import type { GroupFieldProps, FormField } from "@/lib/form-types";

export default function GroupField({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onRemove
}: GroupFieldProps) {
  const [isExpanded, setIsExpanded] = useState(true);

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

  const handleToggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleAddChildField = (componentType: string) => {
    const newField = createDefaultField(componentType as any);
    const updatedChildFields = [...(field.ChildFields || []), newField];
    onUpdate({ ChildFields: updatedChildFields });
  };

  const handleUpdateChildField = (childFieldId: string, updates: Partial<FormField>) => {
    const updatedChildFields = (field.ChildFields || []).map(childField =>
      childField.Id === childFieldId ? { ...childField, ...updates } : childField
    );
    onUpdate({ ChildFields: updatedChildFields });
  };

  const handleRemoveChildField = (childFieldId: string) => {
    const updatedChildFields = (field.ChildFields || []).filter(
      childField => childField.Id !== childFieldId
    );
    onUpdate({ ChildFields: updatedChildFields });
  };

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: { type: string }) => {
      // Prevent dropping groups inside groups for simplicity
      if (item.type !== 'GROUP') {
        handleAddChildField(item.type);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop() && monitor.getItem()?.type !== 'GROUP',
    }),
  }));

  const childFieldCount = field.ChildFields?.length || 0;

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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleExpanded}
            className="h-6 w-6 p-0 text-slate-600 hover:text-slate-900"
          >
            {isExpanded ? (
              <FolderOpen className="h-4 w-4" />
            ) : (
              <FolderOpen className="h-4 w-4" />
            )}
          </Button>
          <label className="text-sm font-medium text-slate-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <span className="text-xs text-slate-500">
            ({childFieldCount} field{childFieldCount !== 1 ? 's' : ''})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="field-type-GROUP text-xs">
            GROUP
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

      {/* Group Content */}
      {isExpanded && (
        <div className="space-y-3">
          {/* Group Container */}
          <div 
            ref={drop}
            className={`bg-white border-2 border-dashed rounded-lg p-4 min-h-32 transition-colors ${
              isOver && canDrop 
                ? 'border-primary-400 bg-primary-50' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Child Fields */}
            {field.ChildFields && field.ChildFields.length > 0 ? (
              <div className="space-y-3">
                {field.ChildFields.map((childField) => (
                  <div key={childField.Id} className="bg-slate-50 border border-slate-200 rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-700">
                          {childField.label}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {childField.type}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle child field settings
                          }}
                          className="h-5 w-5 p-0 text-slate-400 hover:text-slate-600"
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveChildField(childField.Id);
                          }}
                          className="h-5 w-5 p-0 text-slate-400 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Simplified child field preview */}
                    <div className="text-xs text-slate-500">
                      {childField.type} field - Configure in properties panel
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 mb-2">No fields in this group</p>
                <p className="text-xs text-slate-400">
                  Drop components here or use the add button
                </p>
              </div>
            )}
          </div>

          {/* Group Configuration Status */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <span>Spacing: {field.Spacing || '0'}px</span>
              {field.Width && (
                <span>• Width: {field.Width}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {childFieldCount > 0 ? (
                <span className="text-green-600">✓ {childFieldCount} field{childFieldCount !== 1 ? 's' : ''}</span>
              ) : (
                <span className="text-amber-600">⚠ Empty group</span>
              )}
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleAddChildField('CHECKBOX');
              }}
              className="text-xs h-7"
            >
              <Plus className="w-3 h-3 mr-1" />
              Checkbox
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleAddChildField('RADIOGRP');
              }}
              className="text-xs h-7"
            >
              <Plus className="w-3 h-3 mr-1" />
              Radio Group
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleAddChildField('DATEPICKER');
              }}
              className="text-xs h-7"
            >
              <Plus className="w-3 h-3 mr-1" />
              Date
            </Button>
          </div>

          {/* Group Properties Preview */}
          {field.isGroup && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
              <div className="text-xs text-blue-700">
                <span className="font-medium">Group Properties: </span>
                <span>Container for related fields</span>
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
                  {validation.Type}: Group validation rule applied
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Collapsed State */}
      {!isExpanded && (
        <div className="text-center py-2">
          <span className="text-sm text-slate-500">
            Group collapsed - {childFieldCount} field{childFieldCount !== 1 ? 's' : ''} inside
          </span>
        </div>
      )}
    </div>
  );
}
