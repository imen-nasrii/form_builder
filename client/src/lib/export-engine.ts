import type { FormField, FormDefinition } from './form-types';

export interface ExportOptions {
  framework: 'react' | 'blazor' | 'vue';
  typescript?: boolean;
  includeValidation?: boolean;
  includeStyles?: boolean;
}

export class ExportEngine {
  private formData: FormDefinition;

  constructor(formData: FormDefinition) {
    this.formData = formData;
  }

  exportForm(options: ExportOptions): string {
    switch (options.framework) {
      case 'react':
        return this.generateReactComponent(options);
      case 'blazor':
        return this.generateBlazorComponent(options);
      case 'vue':
        return this.generateVueComponent(options);
      default:
        throw new Error('Unsupported framework');
    }
  }

  private generateReactComponent(options: ExportOptions): string {
    const isTS = options.typescript || false;
    const extension = isTS ? 'tsx' : 'jsx';
    
    const imports = [
      "import React, { useState } from 'react';",
      options.includeValidation ? "import { useForm } from 'react-hook-form';" : "",
      options.includeStyles ? "import './FormComponent.css';" : ""
    ].filter(Boolean).join('\n');

    const interfaceDefinition = isTS ? this.generateTypeScriptInterface() : '';
    
    const componentName = this.toPascalCase(this.formData.Label || 'GeneratedForm');
    
    const fieldComponents = this.formData.Fields.map(field => 
      this.generateReactField(field, options)
    ).join('\n\n');

    const validationLogic = options.includeValidation ? this.generateReactValidation() : '';

    return `${imports}

${interfaceDefinition}

export default function ${componentName}() {
  ${validationLogic}
  
  const [formData, setFormData] = useState({
${this.formData.Fields.map(field => `    ${field.Id}: ${this.getDefaultValue(field)}`).join(',\n')}
  });

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your submission logic here
  };

  return (
    <div className="form-container" style={{ width: '${this.formData.FormWidth}' }}>
      <form onSubmit={handleSubmit}>
        <h2>${this.formData.Label}</h2>
        
        ${fieldComponents}
        
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Submit
          </button>
          <button type="reset" className="btn-secondary">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}`;
  }

  private generateBlazorComponent(options: ExportOptions): string {
    const componentName = this.toPascalCase(this.formData.Label || 'GeneratedForm');
    
    const modelClass = this.generateBlazorModel();
    const fieldComponents = this.formData.Fields.map(field => 
      this.generateBlazorField(field, options)
    ).join('\n\n');

    const validationLogic = options.includeValidation ? this.generateBlazorValidation() : '';

    return `@page "/${componentName.toLowerCase()}"
@using System.ComponentModel.DataAnnotations

<PageTitle>${this.formData.Label}</PageTitle>

<div class="form-container" style="width: ${this.formData.FormWidth}">
    <EditForm Model="@formModel" OnValidSubmit="@HandleSubmit">
        ${validationLogic}
        
        <h2>${this.formData.Label}</h2>
        
        ${fieldComponents}
        
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Submit</button>
            <button type="reset" class="btn btn-secondary" @onclick="ResetForm">Reset</button>
        </div>
    </EditForm>
</div>

@code {
    private ${componentName}Model formModel = new();

    ${modelClass}

    private async Task HandleSubmit()
    {
        // Add your submission logic here
        Console.WriteLine("Form submitted");
    }

    private void ResetForm()
    {
        formModel = new ${componentName}Model();
    }
}`;
  }

  private generateVueComponent(options: ExportOptions): string {
    const componentName = this.toPascalCase(this.formData.Label || 'GeneratedForm');
    
    const fieldComponents = this.formData.Fields.map(field => 
      this.generateVueField(field, options)
    ).join('\n\n');

    const validationLogic = options.includeValidation ? this.generateVueValidation() : '';

    const isTS = options.typescript || false;
    const scriptLang = isTS ? ' lang="ts"' : '';

    return `<template>
  <div class="form-container" :style="{ width: '${this.formData.FormWidth}' }">
    <form @submit.prevent="handleSubmit">
      <h2>${this.formData.Label}</h2>
      
      ${fieldComponents}
      
      <div class="form-actions">
        <button type="submit" class="btn-primary">Submit</button>
        <button type="reset" class="btn-secondary" @click="resetForm">Reset</button>
      </div>
    </form>
  </div>
</template>

<script${scriptLang}>
${isTS ? 'import { ref, reactive } from \'vue\';' : ''}

export default {
  name: '${componentName}',
  ${isTS ? 'setup() {' : 'data() {'}
    ${isTS ? 'const' : 'return {'} formData = ${isTS ? 'reactive(' : ''}{
${this.formData.Fields.map(field => `      ${field.Id}: ${this.getDefaultValue(field)}`).join(',\n')}
    }${isTS ? ')' : ''};

    ${validationLogic}

    const handleSubmit = () => {
      console.log('Form submitted:', formData);
      // Add your submission logic here
    };

    const resetForm = () => {
      ${this.formData.Fields.map(field => `formData.${field.Id} = ${this.getDefaultValue(field)};`).join('\n      ')}
    };

    ${isTS ? 'return { formData, handleSubmit, resetForm };' : ''}
  ${isTS ? '}' : '},'}
  ${!isTS ? `methods: {
    handleSubmit() {
      console.log('Form submitted:', this.formData);
    },
    resetForm() {
      ${this.formData.Fields.map(field => `this.formData.${field.Id} = ${this.getDefaultValue(field)};`).join('\n      ')}
    }
  }` : ''}
};
</script>

${options.includeStyles ? `<style scoped>
.form-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.btn-primary, .btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
</style>` : ''}`;
  }

  private generateReactField(field: FormField, options: ExportOptions): string {
    const fieldId = field.Id;
    const label = field.label;
    const required = field.required ? 'required' : '';

    switch (field.type) {
      case 'GRIDLKP':
        return `        <div className="field-group">
          <label htmlFor="${fieldId}">${label}${field.required ? ' *' : ''}</label>
          <select
            id="${fieldId}"
            value={formData.${fieldId}}
            onChange={(e) => handleInputChange('${fieldId}', e.target.value)}
            ${required}
          >
            <option value="">Select ${label}</option>
            {/* Add your grid lookup options here */}
          </select>
        </div>`;

      case 'LSTLKP':
        return `        <div className="field-group">
          <label htmlFor="${fieldId}">${label}${field.required ? ' *' : ''}</label>
          <select
            id="${fieldId}"
            value={formData.${fieldId}}
            onChange={(e) => handleInputChange('${fieldId}', e.target.value)}
            ${required}
          >
            <option value="">Select ${label}</option>
            {/* Add your list lookup options here */}
          </select>
        </div>`;

      case 'DATEPICKER':
        return `        <div className="field-group">
          <label htmlFor="${fieldId}">${label}${field.required ? ' *' : ''}</label>
          <input
            type="date"
            id="${fieldId}"
            value={formData.${fieldId}}
            onChange={(e) => handleInputChange('${fieldId}', e.target.value)}
            ${required}
          />
        </div>`;

      case 'SELECT':
        const options = field.OptionValues || {};
        return `        <div className="field-group">
          <label htmlFor="${fieldId}">${label}${field.required ? ' *' : ''}</label>
          <select
            id="${fieldId}"
            value={formData.${fieldId}}
            onChange={(e) => handleInputChange('${fieldId}', e.target.value)}
            ${required}
          >
            <option value="">Select ${label}</option>
            ${Object.entries(options).map(([key, value]) => 
              `<option value="${key}">${value}</option>`
            ).join('\n            ')}
          </select>
        </div>`;

      case 'CHECKBOX':
        return `        <div className="field-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              id="${fieldId}"
              checked={formData.${fieldId}}
              onChange={(e) => handleInputChange('${fieldId}', e.target.checked)}
            />
            ${label}${field.required ? ' *' : ''}
          </label>
        </div>`;

      case 'RADIOGRP':
        const radioOptions = field.OptionValues || {};
        return `        <div className="field-group">
          <fieldset>
            <legend>${label}${field.required ? ' *' : ''}</legend>
            ${Object.entries(radioOptions).map(([key, value]) => 
              `<label className="radio-label">
              <input
                type="radio"
                name="${fieldId}"
                value="${key}"
                checked={formData.${fieldId} === "${key}"}
                onChange={(e) => handleInputChange('${fieldId}', e.target.value)}
                ${required}
              />
              ${value}
            </label>`
            ).join('\n            ')}
          </fieldset>
        </div>`;

      default:
        return `        <div className="field-group">
          <label htmlFor="${fieldId}">${label}${field.required ? ' *' : ''}</label>
          <input
            type="text"
            id="${fieldId}"
            value={formData.${fieldId}}
            onChange={(e) => handleInputChange('${fieldId}', e.target.value)}
            ${required}
          />
        </div>`;
    }
  }

  private generateBlazorField(field: FormField, options: ExportOptions): string {
    const fieldId = field.Id;
    const label = field.label;
    const propertyName = this.toPascalCase(fieldId);

    switch (field.type) {
      case 'GRIDLKP':
      case 'LSTLKP':
        return `        <div class="field-group">
            <label for="${fieldId}">${label}${field.required ? ' *' : ''}</label>
            <InputSelect id="${fieldId}" @bind-Value="formModel.${propertyName}" class="form-control">
                <option value="">Select ${label}</option>
                @* Add your lookup options here *@
            </InputSelect>
        </div>`;

      case 'DATEPICKER':
        return `        <div class="field-group">
            <label for="${fieldId}">${label}${field.required ? ' *' : ''}</label>
            <InputDate id="${fieldId}" @bind-Value="formModel.${propertyName}" class="form-control" />
        </div>`;

      case 'SELECT':
        const options = field.OptionValues || {};
        return `        <div class="field-group">
            <label for="${fieldId}">${label}${field.required ? ' *' : ''}</label>
            <InputSelect id="${fieldId}" @bind-Value="formModel.${propertyName}" class="form-control">
                <option value="">Select ${label}</option>
                ${Object.entries(options).map(([key, value]) => 
                  `<option value="${key}">${value}</option>`
                ).join('\n                ')}
            </InputSelect>
        </div>`;

      case 'CHECKBOX':
        return `        <div class="field-group">
            <label class="checkbox-label">
                <InputCheckbox id="${fieldId}" @bind-Value="formModel.${propertyName}" />
                ${label}${field.required ? ' *' : ''}
            </label>
        </div>`;

      case 'RADIOGRP':
        const radioOptions = field.OptionValues || {};
        return `        <div class="field-group">
            <fieldset>
                <legend>${label}${field.required ? ' *' : ''}</legend>
                ${Object.entries(radioOptions).map(([key, value]) => 
                  `<label class="radio-label">
                    <InputRadio name="${fieldId}" Value="${key}" @bind-Value="formModel.${propertyName}" />
                    ${value}
                </label>`
                ).join('\n                ')}
            </fieldset>
        </div>`;

      default:
        return `        <div class="field-group">
            <label for="${fieldId}">${label}${field.required ? ' *' : ''}</label>
            <InputText id="${fieldId}" @bind-Value="formModel.${propertyName}" class="form-control" />
        </div>`;
    }
  }

  private generateVueField(field: FormField, options: ExportOptions): string {
    const fieldId = field.Id;
    const label = field.label;

    switch (field.type) {
      case 'GRIDLKP':
      case 'LSTLKP':
        return `      <div class="field-group">
        <label for="${fieldId}">${label}${field.required ? ' *' : ''}</label>
        <select
          id="${fieldId}"
          v-model="formData.${fieldId}"
          ${field.required ? 'required' : ''}
        >
          <option value="">Select ${label}</option>
          <!-- Add your lookup options here -->
        </select>
      </div>`;

      case 'DATEPICKER':
        return `      <div class="field-group">
        <label for="${fieldId}">${label}${field.required ? ' *' : ''}</label>
        <input
          type="date"
          id="${fieldId}"
          v-model="formData.${fieldId}"
          ${field.required ? 'required' : ''}
        />
      </div>`;

      case 'SELECT':
        const options = field.OptionValues || {};
        return `      <div class="field-group">
        <label for="${fieldId}">${label}${field.required ? ' *' : ''}</label>
        <select
          id="${fieldId}"
          v-model="formData.${fieldId}"
          ${field.required ? 'required' : ''}
        >
          <option value="">Select ${label}</option>
          ${Object.entries(options).map(([key, value]) => 
            `<option value="${key}">${value}</option>`
          ).join('\n          ')}
        </select>
      </div>`;

      case 'CHECKBOX':
        return `      <div class="field-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            id="${fieldId}"
            v-model="formData.${fieldId}"
          />
          ${label}${field.required ? ' *' : ''}
        </label>
      </div>`;

      case 'RADIOGRP':
        const radioOptions = field.OptionValues || {};
        return `      <div class="field-group">
        <fieldset>
          <legend>${label}${field.required ? ' *' : ''}</legend>
          ${Object.entries(radioOptions).map(([key, value]) => 
            `<label class="radio-label">
            <input
              type="radio"
              name="${fieldId}"
              value="${key}"
              v-model="formData.${fieldId}"
              ${field.required ? 'required' : ''}
            />
            ${value}
          </label>`
          ).join('\n          ')}
        </fieldset>
      </div>`;

      default:
        return `      <div class="field-group">
        <label for="${fieldId}">${label}${field.required ? ' *' : ''}</label>
        <input
          type="text"
          id="${fieldId}"
          v-model="formData.${fieldId}"
          ${field.required ? 'required' : ''}
        />
      </div>`;
    }
  }

  private generateTypeScriptInterface(): string {
    const interfaceName = `${this.toPascalCase(this.formData.Label || 'Form')}Data`;
    
    return `interface ${interfaceName} {
${this.formData.Fields.map(field => {
  const fieldType = this.getTypeScriptType(field);
  return `  ${field.Id}: ${fieldType};`;
}).join('\n')}
}`;
  }

  private generateBlazorModel(): string {
    const className = `${this.toPascalCase(this.formData.Label || 'Form')}Model`;
    
    return `public class ${className}
    {
${this.formData.Fields.map(field => {
  const propertyName = this.toPascalCase(field.Id);
  const propertyType = this.getBlazorType(field);
  const validation = field.required ? '\n        [Required]' : '';
  
  return `${validation}
        public ${propertyType} ${propertyName} { get; set; }${this.getBlazorDefaultValue(field)}`;
}).join('\n\n')}
    }`;
  }

  private generateReactValidation(): string {
    return `const { register, handleSubmit, formState: { errors } } = useForm();`;
  }

  private generateBlazorValidation(): string {
    return `<DataAnnotationsValidator />
        <ValidationSummary />`;
  }

  private generateVueValidation(): string {
    return `const errors = ref({});

    const validateForm = () => {
      errors.value = {};
      // Add your validation logic here
      return Object.keys(errors.value).length === 0;
    };`;
  }

  private getDefaultValue(field: FormField): string {
    switch (field.type) {
      case 'CHECKBOX':
        return 'false';
      case 'DATEPICKER':
        return "''";
      default:
        return "''";
    }
  }

  private getTypeScriptType(field: FormField): string {
    switch (field.type) {
      case 'CHECKBOX':
        return 'boolean';
      case 'DATEPICKER':
        return 'string';
      default:
        return 'string';
    }
  }

  private getBlazorType(field: FormField): string {
    switch (field.type) {
      case 'CHECKBOX':
        return 'bool';
      case 'DATEPICKER':
        return 'DateTime?';
      default:
        return 'string';
    }
  }

  private getBlazorDefaultValue(field: FormField): string {
    switch (field.type) {
      case 'CHECKBOX':
        return ' = false;';
      case 'DATEPICKER':
        return '';
      default:
        return ' = string.Empty;';
    }
  }

  private toPascalCase(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
      .replace(/^\d/, 'N$&'); // Prefix with 'N' if starts with number
  }
}

export const exportFormToFramework = (formData: FormDefinition, options: ExportOptions): string => {
  const engine = new ExportEngine(formData);
  return engine.exportForm(options);
};

export const downloadFile = (content: string, filename: string, contentType: string = 'text/plain') => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};