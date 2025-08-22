import type { FormDefinition, FormField, ValidationRule, ConditionExpression, Condition } from './form-types';

export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
  code: string;
}

export interface SchemaValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class JSONSchemaValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationError[] = [];

  validate(jsonData: any): SchemaValidationResult {
    this.errors = [];
    this.warnings = [];

    try {
      // Parse JSON if it's a string
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      // Validate root structure
      this.validateRootStructure(data);
      
      // Validate fields array
      if (data.Fields && Array.isArray(data.Fields)) {
        this.validateFields(data.Fields);
      }
      
      // Validate actions array
      if (data.Actions && Array.isArray(data.Actions)) {
        this.validateActions(data.Actions);
      }
      
      // Validate global validations
      if (data.Validations && Array.isArray(data.Validations)) {
        this.validateValidations(data.Validations, 'root');
      }

    } catch (error) {
      this.addError('root', 'Invalid JSON format', 'INVALID_JSON');
    }

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  private validateRootStructure(data: any): void {
    const requiredFields = ['MenuID', 'FormWidth', 'Layout', 'Label'];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        this.addError(`root.${field}`, `Required field '${field}' is missing`, 'MISSING_REQUIRED_FIELD');
      }
    }

    // Validate MenuID format
    if (data.MenuID && typeof data.MenuID === 'string') {
      if (!/^[A-Z0-9]{1,10}$/.test(data.MenuID)) {
        this.addError('root.MenuID', 'MenuID should be uppercase alphanumeric, max 10 characters', 'INVALID_MENU_ID');
      }
    }

    // Validate FormWidth
    if (data.FormWidth && typeof data.FormWidth === 'string') {
      if (!/^(100%|\d+px)$/.test(data.FormWidth)) {
        this.addError('root.FormWidth', 'FormWidth should be in format "XXXpx" or "100%"', 'INVALID_FORM_WIDTH');
      }
    }

    // Validate Layout
    if (data.Layout && typeof data.Layout === 'string') {
      const validLayouts = ['PROCESS', 'INQUIRY', 'MAINTENANCE', 'REPORT'];
      if (!validLayouts.includes(data.Layout)) {
        this.addWarning('root.Layout', `Layout "${data.Layout}" is not a standard layout type`, 'NON_STANDARD_LAYOUT');
      }
    }

    // Validate Fields array exists
    if (!data.Fields || !Array.isArray(data.Fields)) {
      this.addError('root.Fields', 'Fields array is required', 'MISSING_FIELDS_ARRAY');
    }
  }

  private validateFields(fields: any[], parentPath: string = 'Fields'): void {
    fields.forEach((field, index) => {
      const fieldPath = `${parentPath}[${index}]`;
      this.validateField(field, fieldPath);
    });
  }

  private validateField(field: any, fieldPath: string): void {
    // Required field properties
    const requiredProps = ['Id', 'type'];
    
    for (const prop of requiredProps) {
      if (!field[prop]) {
        this.addError(`${fieldPath}.${prop}`, `Required property '${prop}' is missing`, 'MISSING_REQUIRED_PROPERTY');
      }
    }

    // Validate field ID
    if (field.Id && typeof field.Id === 'string') {
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(field.Id)) {
        this.addError(`${fieldPath}.Id`, 'Field Id should start with letter and contain only alphanumeric characters and underscores', 'INVALID_FIELD_ID');
      }
    }

    // Validate field type
    if (field.type) {
      const validTypes = ['GRIDLKP', 'LSTLKP', 'DATEPICKER', 'SELECT', 'CHECKBOX', 'RADIOGRP', 'GROUP', 'TEXT'];
      if (!validTypes.includes(field.type)) {
        this.addWarning(`${fieldPath}.type`, `Field type "${field.type}" is not a standard type`, 'NON_STANDARD_FIELD_TYPE');
      }

      // Type-specific validation
      this.validateFieldByType(field, fieldPath);
    }

    // Validate Width property
    if (field.Width && typeof field.Width === 'string') {
      if (!/^(\d+(%|px)?|\d+)$/.test(field.Width)) {
        this.addError(`${fieldPath}.Width`, 'Width should be numeric or with px/% suffix', 'INVALID_WIDTH_FORMAT');
      }
    }

    // Validate EnabledWhen conditions
    if (field.EnabledWhen) {
      this.validateConditionExpression(field.EnabledWhen, `${fieldPath}.EnabledWhen`);
    }

    // Validate field-specific validations
    if (field.Validations && Array.isArray(field.Validations)) {
      this.validateValidations(field.Validations, fieldPath);
    }

    // Validate child fields for GROUP type
    if (field.type === 'GROUP' && field.ChildFields) {
      if (Array.isArray(field.ChildFields)) {
        this.validateFields(field.ChildFields, `${fieldPath}.ChildFields`);
      } else {
        this.addError(`${fieldPath}.ChildFields`, 'ChildFields should be an array for GROUP type', 'INVALID_CHILD_FIELDS');
      }
    }
  }

  private validateFieldByType(field: any, fieldPath: string): void {
    switch (field.type) {
      case 'GRIDLKP':
      case 'LSTLKP':
        this.validateLookupField(field, fieldPath);
        break;
      case 'SELECT':
      case 'RADIOGRP':
        this.validateSelectField(field, fieldPath);
        break;
      case 'DATEPICKER':
        this.validateDateField(field, fieldPath);
        break;
      case 'CHECKBOX':
        this.validateCheckboxField(field, fieldPath);
        break;
      case 'GROUP':
        this.validateGroupField(field, fieldPath);
        break;
    }
  }

  private validateLookupField(field: any, fieldPath: string): void {
    // Required for lookup fields
    if (!field.KeyColumn) {
      this.addError(`${fieldPath}.KeyColumn`, 'KeyColumn is required for lookup fields', 'MISSING_KEY_COLUMN');
    }

    if (!field.LoadDataInfo) {
      this.addError(`${fieldPath}.LoadDataInfo`, 'LoadDataInfo is required for lookup fields', 'MISSING_LOAD_DATA_INFO');
    } else {
      if (!field.LoadDataInfo.DataModel) {
        this.addError(`${fieldPath}.LoadDataInfo.DataModel`, 'DataModel is required in LoadDataInfo', 'MISSING_DATA_MODEL');
      }

      if (!field.LoadDataInfo.ColumnsDefinition || !Array.isArray(field.LoadDataInfo.ColumnsDefinition)) {
        this.addError(`${fieldPath}.LoadDataInfo.ColumnsDefinition`, 'ColumnsDefinition array is required', 'MISSING_COLUMNS_DEFINITION');
      } else {
        field.LoadDataInfo.ColumnsDefinition.forEach((col: any, index: number) => {
          if (!col.DataField) {
            this.addError(`${fieldPath}.LoadDataInfo.ColumnsDefinition[${index}].DataField`, 'DataField is required for each column', 'MISSING_DATA_FIELD');
          }
          if (!col.DataType) {
            this.addError(`${fieldPath}.LoadDataInfo.ColumnsDefinition[${index}].DataType`, 'DataType is required for each column', 'MISSING_DATA_TYPE');
          }
        });
      }
    }

    if (field.ItemInfo) {
      if (!field.ItemInfo.MainProperty) {
        this.addError(`${fieldPath}.ItemInfo.MainProperty`, 'MainProperty is required in ItemInfo', 'MISSING_MAIN_PROPERTY');
      }
    }
  }

  private validateSelectField(field: any, fieldPath: string): void {
    if (!field.OptionValues || typeof field.OptionValues !== 'object') {
      this.addError(`${fieldPath}.OptionValues`, 'OptionValues object is required for SELECT/RADIOGRP fields', 'MISSING_OPTION_VALUES');
    } else {
      const optionCount = Object.keys(field.OptionValues).length;
      if (optionCount === 0) {
        this.addWarning(`${fieldPath}.OptionValues`, 'OptionValues is empty', 'EMPTY_OPTION_VALUES');
      }
    }
  }

  private validateDateField(field: any, fieldPath: string): void {
    // Specific validations for date fields
    if (field.Value && typeof field.Value === 'string') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(field.Value) && field.Value !== '') {
        this.addWarning(`${fieldPath}.Value`, 'Date value should be in YYYY-MM-DD format', 'INVALID_DATE_FORMAT');
      }
    }
  }

  private validateCheckboxField(field: any, fieldPath: string): void {
    if (field.Value !== undefined && typeof field.Value !== 'boolean') {
      this.addWarning(`${fieldPath}.Value`, 'Checkbox value should be boolean', 'INVALID_CHECKBOX_VALUE');
    }
  }

  private validateGroupField(field: any, fieldPath: string): void {
    if (!field.ChildFields) {
      this.addError(`${fieldPath}.ChildFields`, 'ChildFields is required for GROUP type', 'MISSING_CHILD_FIELDS');
    }
    
    if (field.ChildFields && !Array.isArray(field.ChildFields)) {
      this.addError(`${fieldPath}.ChildFields`, 'ChildFields must be an array', 'INVALID_CHILD_FIELDS_TYPE');
    }
  }

  private validateActions(actions: any[]): void {
    actions.forEach((action, index) => {
      const actionPath = `Actions[${index}]`;
      
      if (!action.ID) {
        this.addError(`${actionPath}.ID`, 'Action ID is required', 'MISSING_ACTION_ID');
      }
      
      if (!action.Label) {
        this.addError(`${actionPath}.Label`, 'Action Label is required', 'MISSING_ACTION_LABEL');
      }
      
      if (!action.MethodToInvoke) {
        this.addError(`${actionPath}.MethodToInvoke`, 'MethodToInvoke is required', 'MISSING_METHOD_TO_INVOKE');
      }
    });
  }

  private validateValidations(validations: any[], parentPath: string): void {
    validations.forEach((validation, index) => {
      const validationPath = `${parentPath}.Validations[${index}]`;
      
      if (!validation.Id) {
        this.addError(`${validationPath}.Id`, 'Validation Id is required', 'MISSING_VALIDATION_ID');
      }
      
      if (!validation.Type || !['ERROR', 'WARNING'].includes(validation.Type)) {
        this.addError(`${validationPath}.Type`, 'Validation Type must be "ERROR" or "WARNING"', 'INVALID_VALIDATION_TYPE');
      }
      
      // Validate condition expression (check both CondExpression and ConditionExpression)
      const condExpr = validation.CondExpression || validation.ConditionExpression;
      if (condExpr) {
        this.validateConditionExpression(condExpr, `${validationPath}.ConditionExpression`);
      }
    });
  }

  private validateConditionExpression(expr: any, path: string): void {
    if (!expr.Conditions || !Array.isArray(expr.Conditions)) {
      this.addError(`${path}.Conditions`, 'Conditions array is required', 'MISSING_CONDITIONS');
      return;
    }

    if (expr.LogicalOperator && !['AND', 'OR'].includes(expr.LogicalOperator)) {
      this.addError(`${path}.LogicalOperator`, 'LogicalOperator must be "AND" or "OR"', 'INVALID_LOGICAL_OPERATOR');
    }

    expr.Conditions.forEach((condition: any, index: number) => {
      this.validateCondition(condition, `${path}.Conditions[${index}]`);
    });
  }

  private validateCondition(condition: any, path: string): void {
    if (!condition.RightField) {
      this.addError(`${path}.RightField`, 'RightField is required', 'MISSING_RIGHT_FIELD');
    }

    if (!condition.Operator) {
      this.addError(`${path}.Operator`, 'Operator is required', 'MISSING_OPERATOR');
    } else {
      const validOperators = ['EQ', 'NEQ', 'GT', 'LT', 'GTE', 'LTE', 'ISN', 'ISNN', 'IST', 'ISF', 'CONTAINS', 'STARTSWITH', 'ENDSWITH', 'IN', 'BETWEEN'];
      if (!validOperators.includes(condition.Operator)) {
        this.addWarning(`${path}.Operator`, `Operator "${condition.Operator}" is not a standard operator`, 'NON_STANDARD_OPERATOR');
      }
    }

    if (condition.ValueType) {
      const validValueTypes = ['STRING', 'NUMBER', 'DATE', 'BOOL'];
      if (!validValueTypes.includes(condition.ValueType)) {
        this.addWarning(`${path}.ValueType`, `ValueType "${condition.ValueType}" is not a standard type`, 'NON_STANDARD_VALUE_TYPE');
      }
    }
  }

  private addError(path: string, message: string, code: string): void {
    this.errors.push({
      path,
      message,
      severity: 'error',
      code
    });
  }

  private addWarning(path: string, message: string, code: string): void {
    this.warnings.push({
      path,
      message,
      severity: 'warning',
      code
    });
  }
}

export const validateJSONSchema = (jsonData: any): SchemaValidationResult => {
  const validator = new JSONSchemaValidator();
  return validator.validate(jsonData);
};

export const formatValidationErrors = (result: SchemaValidationResult): string => {
  let output = '';
  
  if (result.errors.length > 0) {
    output += '🔴 ERRORS:\n';
    result.errors.forEach(error => {
      output += `  • ${error.path}: ${error.message} (${error.code})\n`;
    });
    output += '\n';
  }
  
  if (result.warnings.length > 0) {
    output += '🟡 WARNINGS:\n';
    result.warnings.forEach(warning => {
      output += `  • ${warning.path}: ${warning.message} (${warning.code})\n`;
    });
  }
  
  if (result.isValid) {
    output = '✅ JSON Schema is valid!\n';
  }
  
  return output;
};