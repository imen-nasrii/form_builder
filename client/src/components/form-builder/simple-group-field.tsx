import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, X, Plus, FolderOpen } from "lucide-react";
import type { FormField } from "@/lib/form-types";

interface SimpleGroupFieldProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
}

export default function SimpleGroupField({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onRemove
}: SimpleGroupFieldProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFieldClick = (e: React.MouseEvent) => {
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
    const newField: FormField = {
      Id: `group_field_${Date.now()}`,
      Type: componentType as any,
      Label: `${componentType} in Group`,
      DataField: "",
      Entity: "",
      Width: "",
      Spacing: "",
      Required: false,
      Inline: false,
      Outlined: false,
      Value: ""
    };
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

  return (
    <div
      className={`
        relative group p-4 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer
        ${isSelected ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}
        hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20
      `}
      onClick={handleFieldClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleExpanded}
            className="p-1 h-6 w-6"
          >
            <FolderOpen className={`w-4 h-4 text-emerald-600 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
          </Button>
          
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-sm">
              {field.Label || "Group Container"}
            </span>
            <Badge variant="secondary" className="text-xs">
              {(field.ChildFields || []).length} items
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveClick}
            className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="space-y-3">
          {/* Child Fields */}
          {(field.ChildFields || []).length > 0 && (
            <div className="space-y-2">
              {(field.ChildFields || []).map((childField) => (
                <div
                  key={childField.Id}
                  className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        childField.Type === 'TEXT' ? 'bg-green-500' :
                        childField.Type === 'SELECT' ? 'bg-orange-500' :
                        childField.Type === 'CHECKBOX' ? 'bg-cyan-500' :
                        'bg-blue-500'
                      }`} />
                      <span className="text-sm font-medium">
                        {childField.Label || childField.Id}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {childField.Type}
                      </Badge>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveChildField(childField.Id);
                      }}
                      className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Component Buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="text-xs text-gray-500 mb-2">Ajouter un composant:</div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddChildField('TEXT');
                }}
                className="text-xs h-7"
              >
                <Plus className="w-3 h-3 mr-1" />
                TEXT
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddChildField('SELECT');
                }}
                className="text-xs h-7"
              >
                <Plus className="w-3 h-3 mr-1" />
                SELECT
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddChildField('CHECKBOX');
                }}
                className="text-xs h-7"
              >
                <Plus className="w-3 h-3 mr-1" />
                CHECKBOX
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddChildField('DATEPICKER');
                }}
                className="text-xs h-7"
              >
                <Plus className="w-3 h-3 mr-1" />
                DATE
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddChildField('TEXTAREA');
                }}
                className="text-xs h-7"
              >
                <Plus className="w-3 h-3 mr-1" />
                TEXTAREA
              </Button>
            </div>
          </div>

          {/* Empty State */}
          {(field.ChildFields || []).length === 0 && (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Ce groupe est vide</p>
              <p className="text-xs">Utilisez les boutons ci-dessous pour ajouter des composants</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}