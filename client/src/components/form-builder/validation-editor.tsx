import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, AlertTriangle, AlertCircle, Code } from "lucide-react";
import { ValidationOperators, FieldTypes } from "@shared/schema";
import type { FormField, ValidationRule, Condition, ConditionExpression } from "@/lib/form-types";

interface ValidationEditorProps {
  field: FormField;
  onUpdateField: (updates: Partial<FormField>) => void;
}

export default function ValidationEditor({ field, onUpdateField }: ValidationEditorProps) {
  const [newValidation, setNewValidation] = useState<Partial<ValidationRule>>({
    Type: "ERROR",
    ConditionExpression: {
      LogicalOperator: "AND",
      Conditions: []
    }
  });

  const [isAddingValidation, setIsAddingValidation] = useState(false);

  const addValidationRule = () => {
    const validationRule: ValidationRule = {
      Id: `validation_${Date.now()}`,
      Type: newValidation.Type as "ERROR" | "WARNING",
      ConditionExpression: newValidation.ConditionExpression
    };

    const updatedValidations = [...(field.Validations || []), validationRule];
    onUpdateField({ Validations: updatedValidations });
    
    setNewValidation({
      Type: "ERROR",
      ConditionExpression: {
        LogicalOperator: "AND",
        Conditions: []
      }
    });
    setIsAddingValidation(false);
  };

  const removeValidationRule = (validationId: string) => {
    const updatedValidations = (field.Validations || []).filter(
      validation => validation.Id !== validationId
    );
    onUpdateField({ Validations: updatedValidations });
  };

  const updateValidationRule = (validationId: string, updates: Partial<ValidationRule>) => {
    const updatedValidations = (field.Validations || []).map(validation =>
      validation.Id === validationId ? { ...validation, ...updates } : validation
    );
    onUpdateField({ Validations: updatedValidations });
  };

  const addConditionToNewValidation = () => {
    const newCondition: Condition = {
      RightField: "",
      Operator: "EQ",
      Value: "",
      ValueType: "STRING"
    };

    setNewValidation(prev => ({
      ...prev,
      ConditionExpression: {
        ...prev.ConditionExpression!,
        Conditions: [...(prev.ConditionExpression?.Conditions || []), newCondition]
      }
    }));
  };

  const updateConditionInNewValidation = (index: number, updates: Partial<Condition>) => {
    setNewValidation(prev => {
      const conditions = [...(prev.ConditionExpression?.Conditions || [])];
      conditions[index] = { ...conditions[index], ...updates };
      return {
        ...prev,
        ConditionExpression: {
          ...prev.ConditionExpression!,
          Conditions: conditions
        }
      };
    });
  };

  const removeConditionFromNewValidation = (index: number) => {
    setNewValidation(prev => ({
      ...prev,
      ConditionExpression: {
        ...prev.ConditionExpression!,
        Conditions: prev.ConditionExpression?.Conditions?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const getOperatorOptions = () => {
    return Object.entries(ValidationOperators).filter(([key]) => key !== "").map(([key, value]) => ({
      value: key || "EQ",
      label: `${key} (${value})`
    }));
  };

  const getFieldTypeOptions = () => {
    return Object.entries(FieldTypes).filter(([key]) => key !== "").map(([key, value]) => ({
      value: key || "STRING",
      label: value
    }));
  };

  const renderConditionEditor = (
    condition: Condition, 
    index: number, 
    onUpdate: (index: number, updates: Partial<Condition>) => void,
    onRemove: (index: number) => void
  ) => (
    <div key={index} className="space-y-2 p-3 border border-slate-200 rounded-md bg-slate-50">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-700">Condition {index + 1}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Field</Label>
          <Input
            value={condition.RightField}
            onChange={(e) => onUpdate(index, { RightField: e.target.value })}
            placeholder="Field ID"
            className="text-xs"
          />
        </div>
        
        <div>
          <Label className="text-xs">Operator</Label>
          <Select 
            value={condition.Operator} 
            onValueChange={(value) => onUpdate(index, { Operator: value as keyof typeof ValidationOperators })}
          >
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getOperatorOptions().map(option => (
                <SelectItem key={option.value} value={option.value} className="text-xs">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Value</Label>
          <Input
            value={condition.Value || ""}
            onChange={(e) => onUpdate(index, { Value: e.target.value })}
            placeholder="Comparison value"
            className="text-xs"
          />
        </div>
        
        <div>
          <Label className="text-xs">Value Type</Label>
          <Select 
            value={condition.ValueType || "STRING"} 
            onValueChange={(value) => onUpdate(index, { ValueType: value as keyof typeof FieldTypes })}
          >
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getFieldTypeOptions().map(option => (
                <SelectItem key={option.value} value={option.value} className="text-xs">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Existing Validation Rules */}
      {field.Validations && field.Validations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Current Validation Rules</h4>
          {field.Validations.map((validation) => (
            <Card key={validation.Id} className="border-l-4 border-l-red-400">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={validation.Type === 'ERROR' ? 'destructive' : 'secondary'} className="text-xs">
                      {validation.Type}
                    </Badge>
                    <span className="text-xs text-slate-600">ID: {validation.Id}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeValidationRule(validation.Id)}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-slate-600">
                  {validation.ConditionExpression?.Conditions?.length || 0} condition(s)
                  {validation.ConditionExpression?.LogicalOperator && (
                    <span className="ml-2">({validation.ConditionExpression.LogicalOperator})</span>
                  )}
                </div>
                
                {/* JSON Preview */}
                <div className="mt-2 bg-slate-900 rounded p-2 max-h-20 overflow-y-auto">
                  <pre className="text-xs text-green-400">
                    {JSON.stringify(validation, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Validation Rule */}
      {!isAddingValidation ? (
        <Button
          variant="outline"
          onClick={() => setIsAddingValidation(true)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Validation Rule
        </Button>
      ) : (
        <Card className="border-2 border-dashed border-primary-300">
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <span>New Validation Rule</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingValidation(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Validation Type */}
            <div>
              <Label className="text-xs font-medium">Validation Type</Label>
              <Select 
                value={newValidation.Type} 
                onValueChange={(value) => setNewValidation(prev => ({ ...prev, Type: value as "ERROR" | "WARNING" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ERROR">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-3 h-3 text-red-600" />
                      <span>ERROR</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="WARNING">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-600" />
                      <span>WARNING</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Logical Operator */}
            <div>
              <Label className="text-xs font-medium">Logical Operator</Label>
              <Select 
                value={newValidation.ConditionExpression?.LogicalOperator} 
                onValueChange={(value) => setNewValidation(prev => ({
                  ...prev,
                  ConditionExpression: {
                    ...prev.ConditionExpression!,
                    LogicalOperator: value as "AND" | "OR"
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND (All conditions must be true)</SelectItem>
                  <SelectItem value="OR">OR (Any condition can be true)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-medium">Conditions</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addConditionToNewValidation}
                  className="text-xs h-7"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Condition
                </Button>
              </div>
              
              <div className="space-y-2">
                {newValidation.ConditionExpression?.Conditions?.map((condition, index) =>
                  renderConditionEditor(
                    condition, 
                    index, 
                    updateConditionInNewValidation, 
                    removeConditionFromNewValidation
                  )
                )}
                
                {(!newValidation.ConditionExpression?.Conditions || newValidation.ConditionExpression.Conditions.length === 0) && (
                  <div className="text-center py-4 text-xs text-slate-500 border border-dashed border-slate-300 rounded">
                    No conditions added. Click "Add Condition" to start.
                  </div>
                )}
              </div>
            </div>

            {/* JSON Preview */}
            <div>
              <Label className="text-xs font-medium">JSON Preview</Label>
              <div className="bg-slate-900 rounded p-2 max-h-32 overflow-y-auto">
                <pre className="text-xs text-green-400">
                  {JSON.stringify(newValidation, null, 2)}
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                onClick={addValidationRule}
                disabled={!newValidation.ConditionExpression?.Conditions?.length}
                className="flex-1"
              >
                <Code className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddingValidation(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Templates */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-700">Quick Templates</h4>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const requiredValidation: ValidationRule = {
                Id: `required_${Date.now()}`,
                Type: "ERROR",
                ConditionExpression: {
                  Conditions: [{
                    RightField: field.Id,
                    Operator: "ISN",
                    ValueType: "STRING"
                  }]
                }
              };
              const updatedValidations = [...(field.Validations || []), requiredValidation];
              onUpdateField({ Validations: updatedValidations });
            }}
            className="text-xs justify-start"
          >
            <AlertCircle className="w-3 h-3 mr-2" />
            Required Field Validation
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const notEmptyValidation: ValidationRule = {
                Id: `not_empty_${Date.now()}`,
                Type: "WARNING",
                ConditionExpression: {
                  Conditions: [{
                    RightField: field.Id,
                    Operator: "ISNN",
                    ValueType: "STRING"
                  }]
                }
              };
              const updatedValidations = [...(field.Validations || []), notEmptyValidation];
              onUpdateField({ Validations: updatedValidations });
            }}
            className="text-xs justify-start"
          >
            <AlertTriangle className="w-3 h-3 mr-2" />
            Non-Empty Warning
          </Button>
        </div>
      </div>
    </div>
  );
}
