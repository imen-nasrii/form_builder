import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Upload, 
  Download, 
  Zap,
  FileCheck,
  Settings,
  Code,
  RefreshCw,
  Eye,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ValidationError {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  suggestion?: string;
  autoFix?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  suggestions: ValidationError[];
  score: number;
  fixedJson?: any;
  complexity: 'simple' | 'moderate' | 'complex' | 'very-complex';
  performance: {
    validationTime: number;
    fileSize: number;
    fieldCount: number;
  };
}

export default function JSONValidator() {
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isAutoCorrecting, setIsAutoCorrecting] = useState(false);
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const [validationMode, setValidationMode] = useState<'strict' | 'standard' | 'permissive'>('standard');
  const [realTimeValidation, setRealTimeValidation] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<{validationTime: number, fileSize: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Real-time validation with debouncing
  const handleInputChange = (value: string) => {
    setJsonInput(value);
    
    if (realTimeValidation && value && value.trim()) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      
      debounceTimeout.current = setTimeout(() => {
        validateJSON(value);
      }, 1000);
    }
  };

  const validateJSON = async (inputValue?: string) => {
    const valueToValidate = inputValue || jsonInput;
    
    if (!valueToValidate || typeof valueToValidate !== 'string' || !valueToValidate.trim()) {
      toast({
        title: "No JSON Input",
        description: "Please enter JSON to validate",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    const startTime = performance.now();
    
    try {
      // Parse JSON
      const parsed = JSON.parse(valueToValidate);
      const fileSize = new Blob([valueToValidate]).size;
      
      // Perform comprehensive validation with enhanced features
      const result = await performIntelligentValidation(parsed, fileSize, startTime);
      setValidationResult(result);
      
      setPerformanceMetrics({
        validationTime: result.performance.validationTime,
        fileSize: result.performance.fileSize
      });
      
      toast({
        title: result.isValid ? "Validation Successful" : "Issues Detected",
        description: result.isValid 
          ? `Valid JSON with score ${result.score}/100 (${result.performance.validationTime}ms, ${result.complexity})`
          : `${result.errors.length} errors and ${result.warnings.length} warnings found`,
        variant: result.isValid ? "default" : "destructive",
      });
      
    } catch (error) {
      const endTime = performance.now();
      setValidationResult({
        isValid: false,
        errors: [{
          type: 'error',
          field: 'JSON',
          message: 'Invalid JSON: ' + (error as Error).message,
          autoFix: false
        }],
        warnings: [],
        suggestions: [],
        score: 0,
        complexity: 'simple',
        performance: {
          validationTime: Math.round(endTime - startTime),
          fileSize: new Blob([valueToValidate]).size,
          fieldCount: 0
        }
      });
    }
    
    setIsValidating(false);
  };

  const calculateComplexity = (json: any): 'simple' | 'moderate' | 'complex' | 'very-complex' => {
    const fieldCount = json.Fields ? json.Fields.length : 0;
    const hasChildFields = json.Fields?.some((f: any) => f.ChildFields?.length > 0);
    const hasValidations = json.Validations?.length > 0;
    const hasLoadData = json.Fields?.some((f: any) => f.LoadDataInfo);
    
    if (fieldCount > 100 || (hasChildFields && fieldCount > 50)) return 'very-complex';
    if (fieldCount > 50 || (hasValidations && hasLoadData && fieldCount > 20)) return 'complex';
    if (fieldCount > 20 || hasValidations || hasLoadData) return 'moderate';
    return 'simple';
  };

  const performIntelligentValidation = async (json: any, fileSize: number, startTime: number): Promise<ValidationResult> => {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const suggestions: ValidationError[] = [];
    let score = 100;
    let fixedJson = { ...json };
    
    console.log('🔍 VALIDATION DEBUG - Initial score:', score);
    console.log('🔍 VALIDATION DEBUG - JSON to analyze:', json);
    console.log('🔍 VALIDATION DEBUG - Validation mode:', validationMode);

    // Apply validation mode strictness
    const isStrict = validationMode === 'strict';
    const isPermissive = validationMode === 'permissive';
    
    // Validate required top-level fields (adjusted by mode)
    const requiredFields = isPermissive ? ['MenuID', 'Fields'] : ['MenuID', 'Label', 'Fields'];
    requiredFields.forEach(field => {
      if (!json[field]) {
        const severity = isStrict ? 'error' : (field === 'Fields' ? 'error' : 'warning');
        const target = severity === 'error' ? errors : warnings;
        
        target.push({
          type: severity as 'error' | 'warning',
          field: field,
          message: `Required field missing: ${field}`,
          suggestion: `Add the ${field} field`,
          autoFix: true
        });
        score -= severity === 'error' ? 20 : 10;
        
        if (autoFixEnabled) {
          if (field === 'MenuID') fixedJson[field] = `FORM_${Date.now()}`;
          if (field === 'Label') fixedJson[field] = 'New Form';
          if (field === 'Fields') fixedJson[field] = [];
        }
      }
    });
    
    // Additional strict mode validations
    if (isStrict) {
      // Require FormWidth in strict mode
      if (!json.FormWidth) {
        warnings.push({
          type: 'warning',
          field: 'FormWidth',
          message: 'FormWidth recommended in strict mode',
          suggestion: 'Add FormWidth property for better form control'
        });
        score -= 3;
      }
      
      // Require Layout in strict mode
      if (!json.Layout) {
        warnings.push({
          type: 'warning',
          field: 'Layout',
          message: 'Layout recommended in strict mode',
          suggestion: 'Add Layout property to define form structure'
        });
        score -= 3;
      }
    }

    // Validate MenuID format
    if (json.MenuID && typeof json.MenuID !== 'string') {
      errors.push({
        type: 'error',
        field: 'MenuID',
        message: 'MenuID doit être une chaîne de caractères',
        autoFix: true
      });
      if (autoFixEnabled) fixedJson.MenuID = String(json.MenuID);
    }

    // Validate Fields array
    if (json.Fields) {
      if (!Array.isArray(json.Fields)) {
        errors.push({
          type: 'error',
          field: 'Fields',
          message: 'Fields must be an array',
          autoFix: true
        });
        score -= 15;
        if (autoFixEnabled) fixedJson.Fields = [];
      } else {
        // Validate each field
        json.Fields.forEach((field: any, index: number) => {
          console.log(`🔍 VALIDATION DEBUG - Analyzing field [${index}]:`, field.Id, field);
          
          const fieldErrors = validateField(field, index);
          console.log(`🔍 VALIDATION DEBUG - Field [${index}] results:`, {
            errors: fieldErrors.errors.length,
            warnings: fieldErrors.warnings.length,
            suggestions: fieldErrors.suggestions.length,
            deduction: fieldErrors.scoreDeduction
          });
          
          errors.push(...fieldErrors.errors);
          warnings.push(...fieldErrors.warnings);
          suggestions.push(...fieldErrors.suggestions);
          score -= fieldErrors.scoreDeduction;
          console.log(`🔍 VALIDATION DEBUG - Score after field [${index}]:`, score);
          
          if (autoFixEnabled && fieldErrors.fixedField) {
            fixedJson.Fields[index] = fieldErrors.fixedField;
          }
          
          // Validate nested ChildFields for GROUP type
          if (field.ChildFields && Array.isArray(field.ChildFields)) {
            console.log(`🔍 VALIDATION DEBUG - Analyzing ChildFields for [${index}]:`, field.ChildFields.length, 'children');
            field.ChildFields.forEach((childField: any, childIndex: number) => {
              console.log(`🔍 VALIDATION DEBUG - Analyzing child [${index}.${childIndex}]:`, childField.Id, childField);
              
              const childErrors = validateField(childField, `${index}.${childIndex}`);
              console.log(`🔍 VALIDATION DEBUG - Child [${index}.${childIndex}] results:`, {
                errors: childErrors.errors.length,
                warnings: childErrors.warnings.length,
                suggestions: childErrors.suggestions.length,
                deduction: childErrors.scoreDeduction
              });
              
              errors.push(...childErrors.errors);
              warnings.push(...childErrors.warnings);
              suggestions.push(...childErrors.suggestions);
              score -= childErrors.scoreDeduction;
              console.log(`🔍 VALIDATION DEBUG - Score after child [${index}.${childIndex}]:`, score);
              
              if (autoFixEnabled && childErrors.fixedField) {
                if (!fixedJson.Fields[index].ChildFields) {
                  fixedJson.Fields[index].ChildFields = [];
                }
                fixedJson.Fields[index].ChildFields[childIndex] = childErrors.fixedField;
              }
            });
          }
        });
      }
    }

    // Validate Validations array
    if (json.Validations && !Array.isArray(json.Validations)) {
      warnings.push({
        type: 'warning',
        field: 'Validations',
        message: 'Validations must be an array',
        autoFix: true
      });
      score -= 5;
      if (autoFixEnabled) fixedJson.Validations = [];
    } else if (json.Validations && Array.isArray(json.Validations)) {
      // Validate each validation rule
      json.Validations.forEach((validation: any, vIndex: number) => {
        if (!validation.Id) {
          warnings.push({
            type: 'warning',
            field: `Validations[${vIndex}].Id`,
            message: 'Validation ID missing',
            suggestion: 'Add a unique ID for each validation rule'
          });
          score -= 2;
        }
        
        if (!validation.Type || !['ERROR', 'WARNING', 'INFO'].includes(validation.Type)) {
          errors.push({
            type: 'error',
            field: `Validations[${vIndex}].Type`,
            message: 'Invalid validation type (must be ERROR, WARNING or INFO)',
            autoFix: true
          });
          score -= 3;
          if (autoFixEnabled && !validation.Type) {
            fixedJson.Validations[vIndex].Type = 'ERROR';
          }
        }
        
        // Check for CondExpression vs ConditionExpression inconsistency
        if (validation.CondExpression && !validation.ConditionExpression) {
          warnings.push({
            type: 'warning',
            field: `Validations[${vIndex}].CondExpression`,
            message: '"CondExpression" property detected, "ConditionExpression" recommended',
            suggestion: 'Use "ConditionExpression" for consistency',
            autoFix: true
          });
          score -= 1;
          if (autoFixEnabled) {
            fixedJson.Validations[vIndex].ConditionExpression = validation.CondExpression;
            delete fixedJson.Validations[vIndex].CondExpression;
          }
        }
        
        if (!validation.ConditionExpression && !validation.CondExpression) {
          errors.push({
            type: 'error',
            field: `Validations[${vIndex}].ConditionExpression`,
            message: 'Missing condition expression',
            suggestion: 'Add ConditionExpression with Conditions array'
          });
          score -= 5;
        }
      });
    }

    // Check for duplicate field IDs
    if (json.Fields && Array.isArray(json.Fields)) {
      const fieldIds = json.Fields.map((f: any) => f.Id).filter(Boolean);
      const duplicates = fieldIds.filter((id: string, index: number) => fieldIds.indexOf(id) !== index);
      if (duplicates.length > 0) {
        errors.push({
          type: 'error',
          field: 'Fields',
          message: `Duplicate field IDs: ${duplicates.join(', ')}`,
          suggestion: 'Use unique IDs for each field',
          autoFix: true
        });
        score -= 10;
        
        if (autoFixEnabled) {
          fixedJson.Fields.forEach((field: any, index: number) => {
            if (!field.Id || duplicates.includes(field.Id)) {
              field.Id = `Field_${index + 1}_${Date.now()}`;
            }
          });
        }
      }
    }

    // Performance suggestions
    if (json.Fields && json.Fields.length > 50) {
      suggestions.push({
        type: 'info',
        field: 'Performance',
        message: 'Form with more than 50 fields - consider pagination',
        suggestion: 'Divide into multiple steps or sections'
      });
    }

    // Accessibility suggestions
    if (json.Fields && Array.isArray(json.Fields)) {
      const fieldsWithoutLabels = json.Fields.filter((f: any) => !f.Label);
      if (fieldsWithoutLabels.length > 0) {
        suggestions.push({
          type: 'info',
          field: 'Accessibility',
          message: `${fieldsWithoutLabels.length} fields without labels`,
          suggestion: 'Add labels to improve accessibility'
        });
      }
    }

    console.log('🔍 VALIDATION DEBUG - Final summary:', {
      errors: errors.length,
      warnings: warnings.length,
      suggestions: suggestions.length,
      finalScore: Math.max(0, score),
      errorDetails: errors,
      warningDetails: warnings
    });

    const endTime = performance.now();
    const fieldCount = json.Fields ? json.Fields.length : 0;
    const complexity = calculateComplexity(json);
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score: Math.max(0, score),
      fixedJson: autoFixEnabled ? fixedJson : undefined,
      complexity,
      performance: {
        validationTime: Math.round(endTime - startTime),
        fileSize,
        fieldCount
      }
    };
  };

  const validateField = (field: any, index: number) => {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const suggestions: ValidationError[] = [];
    let scoreDeduction = 0;
    let fixedField = { ...field };

    // Required field properties
    if (!field.Id) {
      errors.push({
        type: 'error',
        field: `Fields[${index}].Id`,
        message: 'Field ID missing',
        autoFix: true
      });
      scoreDeduction += 5;
      fixedField.Id = `Field_${index + 1}_${Date.now()}`;
    }

    // Check for Type vs type inconsistency
    if (!field.Type && !field.type) {
      errors.push({
        type: 'error',
        field: `Fields[${index}].Type`,
        message: 'Field type missing',
        autoFix: true
      });
      scoreDeduction += 5;
      fixedField.Type = 'TEXT';
    } else if (field.type && !field.Type) {
      warnings.push({
        type: 'warning',
        field: `Fields[${index}].type`,
        message: 'Lowercase "type" property detected, "Type" recommended',
        suggestion: 'Use "Type" instead of "type" for consistency',
        autoFix: true
      });
      scoreDeduction += 2;
      if (autoFixEnabled) {
        fixedField.Type = field.type;
        delete fixedField.type;
      }
    }

    // Check for Label vs label inconsistency
    if (field.label && !field.Label) {
      warnings.push({
        type: 'warning',
        field: `Fields[${index}].label`,
        message: 'Lowercase "label" property detected, "Label" recommended',
        suggestion: 'Use "Label" instead of "label" for consistency',
        autoFix: true
      });
      scoreDeduction += 1;
      if (autoFixEnabled) {
        fixedField.Label = field.label;
        delete fixedField.label;
      }
    }

    // Validate field types
    const validTypes = [
      'TEXT', 'TEXTAREA', 'NUMBER', 'EMAIL', 'PASSWORD', 'DATE', 'DATEPICKER', 'DATEPKR',
      'SELECT', 'MULTISELECT', 'RADIO', 'RADIOGRP', 'CHECKBOX', 'SWITCH',
      'FILE', 'IMAGE', 'GRID', 'GRIDLKP', 'LSTLKP', 'GROUP', 'LABEL', 'BUTTON'
    ];
    
    const fieldType = field.Type || field.type;
    if (fieldType && !validTypes.includes(fieldType)) {
      warnings.push({
        type: 'warning',
        field: `Fields[${index}].Type`,
        message: `Non-standard field type: ${fieldType}`,
        suggestion: `Recommended types: ${validTypes.slice(0, 8).join(', ')}...`
      });
      scoreDeduction += 2;
    }

    // Validate required properties based on type
    if (fieldType === 'SELECT' || fieldType === 'RADIOGRP') {
      if (!field.OptionValues && !field.options) {
        warnings.push({
          type: 'warning',
          field: `Fields[${index}].OptionValues`,
          message: 'Missing options for selection field',
          suggestion: 'Add OptionValues or options',
          autoFix: true
        });
        scoreDeduction += 3;
        if (autoFixEnabled) fixedField.OptionValues = { "option1": "Option 1", "option2": "Option 2" };
      }
    }

    // Validate lookup fields
    if (fieldType === 'GRIDLKP' || fieldType === 'LSTLKP') {
      if (!field.LoadDataInfo) {
        errors.push({
          type: 'error',
          field: `Fields[${index}].LoadDataInfo`,
          message: 'LoadDataInfo configuration required for lookup fields',
          suggestion: 'Add LoadDataInfo with DataModel and ColumnsDefinition'
        });
        scoreDeduction += 5;
      } else {
        // Validate LoadDataInfo structure
        if (!field.LoadDataInfo.DataModel) {
          errors.push({
            type: 'error',
            field: `Fields[${index}].LoadDataInfo.DataModel`,
            message: 'DataModel missing in LoadDataInfo',
            autoFix: true
          });
          scoreDeduction += 3;
          if (autoFixEnabled) fixedField.LoadDataInfo.DataModel = 'DefaultModel';
        }
        
        if (!field.LoadDataInfo.ColumnsDefinition || !Array.isArray(field.LoadDataInfo.ColumnsDefinition)) {
          errors.push({
            type: 'error',
            field: `Fields[${index}].LoadDataInfo.ColumnsDefinition`,
            message: 'ColumnsDefinition manquant ou invalide',
            autoFix: true
          });
          scoreDeduction += 3;
          if (autoFixEnabled) fixedField.LoadDataInfo.ColumnsDefinition = [];
        }
      }

      // Validate KeyColumn for lookup fields
      if (!field.KeyColumn) {
        warnings.push({
          type: 'warning',
          field: `Fields[${index}].KeyColumn`,
          message: 'KeyColumn recommandé pour les champs lookup',
          suggestion: 'Spécifier la colonne clé pour la liaison des données'
        });
        scoreDeduction += 2;
      }
    }

    // Validate GROUP fields
    if (fieldType === 'GROUP') {
      if (!field.ChildFields || !Array.isArray(field.ChildFields)) {
        errors.push({
          type: 'error',
          field: `Fields[${index}].ChildFields`,
          message: 'ChildFields obligatoire pour les champs GROUP',
          suggestion: 'Ajouter un tableau ChildFields avec les champs enfants',
          autoFix: true
        });
        scoreDeduction += 5;
        if (autoFixEnabled) fixedField.ChildFields = [];
      }
    }

    // Validate DATEPICKER/DATEPKR consistency
    if (fieldType === 'DATEPKR') {
      suggestions.push({
        type: 'info',
        field: `Fields[${index}].Type`,
        message: 'Type DATEPKR détecté, DATEPICKER est plus standard',
        suggestion: 'Considérer utiliser DATEPICKER pour la cohérence'
      });
    }

    // Validate boolean properties
    const booleanProps = ['Inline', 'Required', 'required', 'Outlined', 'isGroup', 'ShowDescription', 'Visible'];
    booleanProps.forEach(prop => {
      if (field[prop] !== undefined) {
        const value = field[prop];
        console.log(`🔍 DEBUG BOOLEAN - Champ [${index}].${prop}:`, typeof value, value);
        if (typeof value !== 'boolean') {
          console.log(`🔍 DEBUG BOOLEAN - ERREUR DÉTECTÉE - ${prop} n'est pas boolean:`, value);
          errors.push({
            type: 'error',
            field: `Fields[${index}].${prop}`,
            message: `ERREUR TYPE: ${prop} doit être boolean, reçu ${typeof value} (${value})`,
            suggestion: `Remplacer ${value} par true ou false`,
            autoFix: true
          });
          scoreDeduction += 5;
          console.log(`🔍 DEBUG BOOLEAN - Déduction de score: +5, total déduction:`, scoreDeduction);
          if (autoFixEnabled) {
            // Convert to boolean based on common patterns
            if (value === 1 || value === '1' || value === 'true' || value === 'yes' || value > 0) {
              fixedField[prop] = true;
            } else if (value === 0 || value === '0' || value === 'false' || value === 'no') {
              fixedField[prop] = false;
            } else {
              fixedField[prop] = Boolean(value);
            }
            console.log(`🔍 DEBUG BOOLEAN - Correction appliquée: ${prop} =`, fixedField[prop]);
          }
        }
      }
    });

    // Validate numeric properties that should be strings
    const stringProps = ['Width', 'Spacing'];
    stringProps.forEach(prop => {
      if (field[prop] !== undefined && typeof field[prop] === 'number') {
        warnings.push({
          type: 'warning',
          field: `Fields[${index}].${prop}`,
          message: `AVERTISSEMENT TYPE: ${prop} devrait être string, reçu number (${field[prop]})`,
          suggestion: `Convertir ${field[prop]} en "${field[prop]}"`,
          autoFix: true
        });
        scoreDeduction += 2;
        if (autoFixEnabled) {
          fixedField[prop] = String(field[prop]);
        }
      }
    });

    // Validate case sensitivity for common properties
    const caseSensitiveProps = [
      { correct: 'Type', incorrect: 'type' },
      { correct: 'Label', incorrect: 'label' },
      { correct: 'Value', incorrect: 'value' },
      { correct: 'Spacing', incorrect: 'spacing' }
    ];
    
    caseSensitiveProps.forEach(({ correct, incorrect }) => {
      if (field[incorrect] !== undefined && field[correct] === undefined) {
        warnings.push({
          type: 'warning',
          field: `Fields[${index}].${incorrect}`,
          message: `CASSE INCORRECTE: "${incorrect}" détecté, "${correct}" recommandé`,
          suggestion: `Utiliser "${correct}" au lieu de "${incorrect}"`,
          autoFix: true
        });
        scoreDeduction += 1;
        if (autoFixEnabled) {
          fixedField[correct] = field[incorrect];
          delete fixedField[incorrect];
        }
      }
    });

    // Check for required field validation
    if (field.required === true || field.Required === true) {
      const hasValidation = field.Validations && field.Validations.some((v: any) => 
        v.Type === 'ERROR' && v.ConditionExpression?.Conditions?.some((c: any) => 
          c.RightField === field.Id && (c.Operator === 'ISN' || c.Operator === 'ISEMPTY')
        )
      );
      
      if (!hasValidation) {
        suggestions.push({
          type: 'info',
          field: `Fields[${index}].Validations`,
          message: 'Field marked as required but without corresponding validation',
          suggestion: 'Add ERROR validation with ISN operator to check required field'
        });
      }
    }

    return { errors, warnings, suggestions, scoreDeduction, fixedField };
  };

  const applyAutoFix = () => {
    if (validationResult?.fixedJson) {
      setJsonInput(JSON.stringify(validationResult.fixedJson, null, 2));
      toast({
        title: "Corrections Applied",
        description: `${validationResult.errors.filter(e => e.autoFix).length} errors and ${validationResult.warnings.filter(w => w.autoFix).length} warnings corrected`,
      });
      // Clear previous validation result and re-validate
      setValidationResult(null);
      setTimeout(() => validateJSON(), 1000);
    }
  };

  const loadSampleJSON = () => {
    const accadjJSON = {
      "MenuID": "ACCADJ",
      "FormWidth": "700px",
      "Layout": "PROCESS",
      "Label": "ACCADJ",
      "Fields": [
        {
          "Id": "FundID",
          "label": "FUND",
          "type": "GRIDLKP",
          "Inline": true,
          "Width": "32",
          "KeyColumn": "fund",
          "ItemInfo": {
            "MainProperty": "fund",
            "DescProperty": "acnam1",
            "ShowDescription": true
          },
          "LoadDataInfo": {
            "DataModel": "Fndmas",
            "ColumnsDefinition": [
              {
                "DataField": "fund",
                "Caption": "Fund ID",
                "DataType": "STRING",
                "Visible": true
              },
              {
                "DataField": "acnam1",
                "Caption": "Fund Name",
                "DataType": "STRING",
                "Visible": true
              }
            ]
          }
        },
        {
          "Id": "Ticker",
          "Label": "Ticker",
          "Type": "GRIDLKP",
          "Inline": true,
          "Width": "32",
          "KeyColumn": "tkr",
          "ItemInfo": {
            "MainProperty": "tkr",
            "DescProperty": "tkr_DESC",
            "ShowDescription": true
          },
          "LoadDataInfo": {
            "DataModel": "Secrty",
            "ColumnsDefinition": [
              {
                "DataField": "tkr",
                "Caption": "Ticker",
                "DataType": "STRING",
                "Visible": true
              },
              {
                "DataField": "tkr_DESC",
                "Caption": "Description",
                "DataType": "STRING",
                "Visible": true
              }
            ]
          }
        },
        {
          "Id": "AccrualDate",
          "label": "PROCDATE",
          "type": "DATEPICKER",
          "Inline": true,
          "Width": "32",
          "Spacing": "30",
          "required": true,
          "Validations": [
            {
              "Id": "6",
              "Type": "ERROR",
              "ConditionExpression": {
                "Conditions": [
                  {
                    "RightField": "AccrualDate",
                    "Operator": "ISN",
                    "ValueType": "DATE"
                  }
                ]
              }
            }
          ]
        }
      ],
      "Actions": [
        {
          "ID": "PROCESS",
          "Label": "PROCESS",
          "MethodToInvoke": "ExecuteProcess"
        }
      ],
      "Validations": [
        {
          "Id": "2",
          "Type": "ERROR",
          "CondExpression": {
            "LogicalOperator": "AND",
            "Conditions": [
              {
                "RightField": "ReportOnly",
                "Operator": "IST",
                "ValueType": "BOOL"
              },
              {
                "RightField": "UpdateRates",
                "Operator": "IST",
                "ValueType": "BOOL"
              }
            ]
          }
        }
      ]
    };
    
    setJsonInput(JSON.stringify(accadjJSON, null, 2));
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonInput(content);
        toast({
          title: "File imported",
          description: `${file.name} loaded successfully`,
        });
      };
      reader.readAsText(file);
    }
  };

  const downloadValidatedJSON = () => {
    let jsonToDownload = null;
    
    try {
      jsonToDownload = validationResult?.fixedJson || (jsonInput ? JSON.parse(jsonInput) : null);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Cannot download invalid JSON. Please validate first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!jsonToDownload) {
      toast({
        title: "No JSON to Download",
        description: "Please validate JSON first",
        variant: "destructive",
      });
      return;
    }
    
    const dataStr = JSON.stringify(jsonToDownload, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `validated-form-${timestamp}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
    
    toast({
      title: "Download Successful",
      description: `Downloaded: ${filename}`,
    });
  };

  const exportValidationReport = () => {
    if (!validationResult) {
      toast({
        title: "No Validation Report",
        description: "Please validate JSON first",
        variant: "destructive",
      });
      return;
    }
    
    const report = {
      timestamp: new Date().toISOString(),
      validationMode,
      performance: validationResult.performance,
      complexity: validationResult.complexity,
      score: validationResult.score,
      summary: {
        isValid: validationResult.isValid,
        errorsCount: validationResult.errors.length,
        warningsCount: validationResult.warnings.length,
        suggestionsCount: validationResult.suggestions.length
      },
      details: {
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        suggestions: validationResult.suggestions
      }
    };
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `validation-report-${timestamp}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
    
    toast({
      title: "Report Exported", 
      description: `Validation report saved: ${filename}`,
    });
  };



  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FileCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Intelligent JSON Validator</h1>
              <p className="text-gray-600 dark:text-gray-400">JSON validation, automatic correction and program optimization</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    JSON to Validate
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={loadSampleJSON}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Load ACCADJ
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Paste your JSON here or import a file..."
                  rows={20}
                  className="font-mono text-sm"
                />
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
                
                <div className="mt-4 flex gap-3">
                  <Button 
                    onClick={() => validateJSON()} 
                    disabled={isValidating || !jsonInput || !jsonInput.trim()}
                    className="flex-1"
                  >
                    {isValidating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Validate JSON
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autofix"
                      checked={autoFixEnabled}
                      onChange={(e) => setAutoFixEnabled(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="autofix" className="text-sm">Auto-correction</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="realtime"
                      checked={realTimeValidation}
                      onChange={(e) => setRealTimeValidation(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="realtime" className="text-sm">Real-time Validation</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Mode:</Label>
                    <select 
                      value={validationMode} 
                      onChange={(e) => setValidationMode(e.target.value as 'strict' | 'standard' | 'permissive')}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="permissive">Permissive</option>
                      <option value="standard">Standard</option>
                      <option value="strict">Strict</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {validationResult && (
              <>
                {/* Enhanced Score Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Quality Score</span>
                      <span className={`text-2xl font-bold ${getScoreColor(validationResult.score)}`}>
                        {validationResult.score}/100
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Complexity:</span>
                        <span className={`ml-2 font-medium ${
                          validationResult.complexity === 'simple' ? 'text-green-600' :
                          validationResult.complexity === 'moderate' ? 'text-yellow-600' :
                          validationResult.complexity === 'complex' ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {validationResult.complexity.charAt(0).toUpperCase() + validationResult.complexity.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Fields:</span>
                        <span className="ml-2 font-medium">{validationResult.performance.fieldCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Validation Time:</span>
                        <span className="ml-2 font-medium">{validationResult.performance.validationTime}ms</span>
                      </div>
                      <div>
                        <span className="text-gray-600">File Size:</span>
                        <span className="ml-2 font-medium">{(validationResult.performance.fileSize / 1024).toFixed(1)}KB</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          validationResult.score >= 90 ? 'bg-green-500' :
                          validationResult.score >= 70 ? 'bg-yellow-500' :
                          validationResult.score >= 50 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${validationResult.score}%` }}
                      ></div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{validationResult.errors.length}</div>
                        <div className="text-sm text-gray-700 font-medium">Critical errors</div>
                        <div className="text-xs text-red-500">Block execution</div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{validationResult.warnings.length}</div>
                        <div className="text-sm text-gray-700 font-medium">Warnings</div>
                        <div className="text-xs text-yellow-600">To be fixed</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{validationResult.suggestions.length}</div>
                        <div className="text-sm text-gray-700 font-medium">Suggestions</div>
                        <div className="text-xs text-blue-600">Optimizations</div>
                      </div>
                    </div>
                    
                    {validationResult.fixedJson && (
                      <div className="mt-4 flex gap-2">
                        <Button onClick={applyAutoFix} className="flex-1">
                          <Zap className="w-4 h-4 mr-2" />
                          Apply corrections
                        </Button>
                        <Button variant="outline" onClick={downloadValidatedJSON}>
                          <Download className="w-4 h-4 mr-2" />
                          Download JSON
                        </Button>
                        <Button variant="outline" onClick={exportValidationReport}>
                          <Save className="w-4 h-4 mr-2" />
                          Export Report
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Issues */}
                <Card>
                  <CardHeader>
                    <CardTitle>Validation Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="errors">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="errors" className="flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Errors ({validationResult.errors.length})
                        </TabsTrigger>
                        <TabsTrigger value="warnings" className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Warnings ({validationResult.warnings.length})
                        </TabsTrigger>
                        <TabsTrigger value="suggestions" className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Suggestions ({validationResult.suggestions.length})
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="errors" className="space-y-3">
                        {validationResult.errors.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                            <div className="font-medium text-green-600">No critical errors detected</div>
                            <div className="text-sm text-gray-500 mt-1">JSON syntactically valid</div>
                          </div>
                        ) : (
                          validationResult.errors.map((error, index) => (
                            <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-red-900">{error.field}</div>
                                  <div className="text-sm text-red-700">{error.message}</div>
                                  {error.suggestion && (
                                    <div className="text-xs text-red-600 mt-1">💡 {error.suggestion}</div>
                                  )}
                                </div>
                                {error.autoFix && (
                                  <Badge variant="secondary" className="text-xs">
                                    Auto-fixable
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>
                      
                      <TabsContent value="warnings" className="space-y-3">
                        {validationResult.warnings.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                            No warnings
                          </div>
                        ) : (
                          validationResult.warnings.map((warning, index) => (
                            <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-yellow-900">{warning.field}</div>
                                  <div className="text-sm text-yellow-700">{warning.message}</div>
                                  {warning.suggestion && (
                                    <div className="text-xs text-yellow-600 mt-1">💡 {warning.suggestion}</div>
                                  )}
                                </div>
                                {warning.autoFix && (
                                  <Badge variant="secondary" className="text-xs">
                                    Auto-fixable
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>
                      
                      <TabsContent value="suggestions" className="space-y-3">
                        {validationResult.suggestions.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                            No improvement suggestions
                          </div>
                        ) : (
                          validationResult.suggestions.map((suggestion, index) => (
                            <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium text-blue-900">{suggestion.field}</div>
                                <div className="text-sm text-blue-700">{suggestion.message}</div>
                                {suggestion.suggestion && (
                                  <div className="text-xs text-blue-600 mt-1">💡 {suggestion.suggestion}</div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            )}

            {!validationResult && (
              <Card>
                <CardContent className="text-center py-12">
                  <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Ready for Validation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Import or enter your JSON to start intelligent validation
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}