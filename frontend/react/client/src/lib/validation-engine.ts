import { ValidationOperators, FieldTypes } from "@shared/schema";
import type { 
  FormField, 
  ValidationRule, 
  ConditionExpression, 
  Condition, 
  ValidationResult, 
  ValidationError,
  FormDefinition 
} from "./form-types";

export class ValidationEngine {
  private formData: FormDefinition;
  private fieldValues: Record<string, any>;

  constructor(formData: FormDefinition, fieldValues: Record<string, any> = {}) {
    this.formData = formData;
    this.fieldValues = fieldValues;
  }

  // Validate entire form
  validateForm(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate individual fields
    this.formData.Fields.forEach(field => {
      const fieldResult = this.validateField(field);
      errors.push(...fieldResult.errors);
      warnings.push(...fieldResult.warnings);
    });

    // Validate form-level validations
    this.formData.Validations?.forEach(validation => {
      const result = this.evaluateValidationRule(validation);
      if (!result.isValid) {
        const error: ValidationError = {
          fieldId: 'form',
          message: this.getValidationMessage(validation),
          type: validation.Type,
          rule: validation
        };
        
        if (validation.Type === 'ERROR') {
          errors.push(error);
        } else {
          warnings.push(error);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Validate individual field
  validateField(field: FormField): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const fieldValue = this.fieldValues[field.Id];

    // Check required validation
    if (field.required && this.isEmpty(fieldValue)) {
      errors.push({
        fieldId: field.Id,
        message: `${field.label} is required`,
        type: 'ERROR'
      });
    }

    // Check field-specific validations
    field.Validations?.forEach(validation => {
      const result = this.evaluateValidationRule(validation, field);
      if (!result.isValid) {
        const error: ValidationError = {
          fieldId: field.Id,
          message: this.getValidationMessage(validation, field),
          type: validation.Type,
          rule: validation
        };
        
        if (validation.Type === 'ERROR') {
          errors.push(error);
        } else {
          warnings.push(error);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Evaluate validation rule
  evaluateValidationRule(rule: ValidationRule, field?: FormField): { isValid: boolean } {
    if (!rule.ConditionExpression) {
      return { isValid: true };
    }

    return {
      isValid: this.evaluateConditionExpression(rule.ConditionExpression)
    };
  }

  // Evaluate condition expression
  evaluateConditionExpression(expression: ConditionExpression): boolean {
    if (!expression.Conditions || expression.Conditions.length === 0) {
      return true;
    }

    const results = expression.Conditions.map(condition => 
      this.evaluateCondition(condition)
    );

    if (expression.LogicalOperator === 'OR') {
      return results.some(result => result);
    } else {
      // Default to AND
      return results.every(result => result);
    }
  }

  // Evaluate individual condition
  evaluateCondition(condition: Condition): boolean {
    const fieldValue = this.fieldValues[condition.RightField];
    const targetValue = condition.Value;
    const operator = condition.Operator;

    switch (operator) {
      case 'EQ': // EQUAL
        return fieldValue === targetValue;
      
      case 'NEQ': // NOT EQUAL
        return fieldValue !== targetValue;
      
      case 'CT': // CONTAINS
        return this.stringContains(fieldValue, targetValue);
      
      case 'NCT': // NOT CONTAINS
        return !this.stringContains(fieldValue, targetValue);
      
      case 'SW': // STARTS WITH
        return this.stringStartsWith(fieldValue, targetValue);
      
      case 'EW': // ENDS WITH
        return this.stringEndsWith(fieldValue, targetValue);
      
      case 'IN': // IN
        return this.valueIn(fieldValue, targetValue);
      
      case 'NIN': // NOT IN
        return !this.valueIn(fieldValue, targetValue);
      
      case 'GT': // GREATER THAN
        return this.numericCompare(fieldValue, targetValue) > 0;
      
      case 'GTE': // GREATER THAN OR EQUAL
        return this.numericCompare(fieldValue, targetValue) >= 0;
      
      case 'LT': // LESS THAN
        return this.numericCompare(fieldValue, targetValue) < 0;
      
      case 'LTE': // LESS THAN OR EQUAL
        return this.numericCompare(fieldValue, targetValue) <= 0;
      
      case 'ISN': // IS NULL
        return this.isEmpty(fieldValue);
      
      case 'ISNN': // IS NOT NULL
        return !this.isEmpty(fieldValue);
      
      case 'IST': // IS TRUE
        return fieldValue === true || fieldValue === 'true' || fieldValue === 1;
      
      case 'ISF': // IS FALSE
        return fieldValue === false || fieldValue === 'false' || fieldValue === 0;
      
      case 'BETWEEN': // BETWEEN
        return this.valueBetween(fieldValue, targetValue);
      
      case 'CHANGED': // HAS CHANGED
        // This would require tracking previous values
        return false;
      
      default:
        console.warn(`Unknown operator: ${operator}`);
        return true;
    }
  }

  // Helper methods for condition evaluation
  private isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }

  private stringContains(value: any, target: any): boolean {
    if (typeof value !== 'string' || typeof target !== 'string') {
      return false;
    }
    return value.toLowerCase().includes(target.toLowerCase());
  }

  private stringStartsWith(value: any, target: any): boolean {
    if (typeof value !== 'string' || typeof target !== 'string') {
      return false;
    }
    return value.toLowerCase().startsWith(target.toLowerCase());
  }

  private stringEndsWith(value: any, target: any): boolean {
    if (typeof value !== 'string' || typeof target !== 'string') {
      return false;
    }
    return value.toLowerCase().endsWith(target.toLowerCase());
  }

  private valueIn(value: any, target: any): boolean {
    if (Array.isArray(target)) {
      return target.includes(value);
    }
    if (typeof target === 'string') {
      return target.split(',').map(v => v.trim()).includes(String(value));
    }
    return false;
  }

  private numericCompare(value: any, target: any): number {
    const numValue = Number(value);
    const numTarget = Number(target);
    
    if (isNaN(numValue) || isNaN(numTarget)) {
      return 0;
    }
    
    return numValue - numTarget;
  }

  private valueBetween(value: any, target: any): boolean {
    if (!Array.isArray(target) || target.length !== 2) {
      return false;
    }
    
    const numValue = Number(value);
    const minValue = Number(target[0]);
    const maxValue = Number(target[1]);
    
    if (isNaN(numValue) || isNaN(minValue) || isNaN(maxValue)) {
      return false;
    }
    
    return numValue >= minValue && numValue <= maxValue;
  }

  private getValidationMessage(rule: ValidationRule, field?: FormField): string {
    // Generate human-readable validation messages
    if (field) {
      return `Validation failed for ${field.label}`;
    }
    return `Form validation failed for rule ${rule.Id}`;
  }

  // Check if field should be enabled based on conditional logic
  isFieldEnabled(field: FormField): boolean {
    if (!field.EnabledWhen) {
      return true;
    }
    
    return this.evaluateConditionExpression(field.EnabledWhen);
  }

  // Update field values for validation
  updateFieldValue(fieldId: string, value: any): void {
    this.fieldValues[fieldId] = value;
  }

  // Get field value
  getFieldValue(fieldId: string): any {
    return this.fieldValues[fieldId];
  }

  // Validate JSON schema structure
  static validateJsonSchema(formData: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Check required top-level properties
    const requiredProps = ['MenuID', 'FormWidth', 'Layout', 'Label', 'Fields'];
    requiredProps.forEach(prop => {
      if (!formData.hasOwnProperty(prop)) {
        errors.push({
          fieldId: 'schema',
          message: `Missing required property: ${prop}`,
          type: 'ERROR'
        });
      }
    });

    // Validate Fields array
    if (formData.Fields && Array.isArray(formData.Fields)) {
      formData.Fields.forEach((field: any, index: number) => {
        if (!field.Id) {
          errors.push({
            fieldId: `field_${index}`,
            message: `Field ${index + 1}: Missing Id property`,
            type: 'ERROR'
          });
        }
        if (!field.type) {
          errors.push({
            fieldId: `field_${index}`,
            message: `Field ${index + 1}: Missing type property`,
            type: 'ERROR'
          });
        }
        if (!field.label) {
          errors.push({
            fieldId: `field_${index}`,
            message: `Field ${index + 1}: Missing label property`,
            type: 'ERROR'
          });
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Export validation utilities
export const createValidationEngine = (formData: FormDefinition, fieldValues?: Record<string, any>) => {
  return new ValidationEngine(formData, fieldValues);
};

export const validateOperators = ValidationOperators;
export const fieldTypes = FieldTypes;
