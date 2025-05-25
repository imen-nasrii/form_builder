import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Copy, 
  Code2, 
  FileText, 
  Settings,
  CheckCircle2,
  Zap
} from "lucide-react";
import type { FormDefinition } from "@/lib/form-types";

interface MultiFrameworkExportProps {
  formData: FormDefinition;
  trigger?: React.ReactNode;
}

interface ExportOptions {
  typescript: boolean;
  includeValidation: boolean;
  includeStyles: boolean;
  includeTailwind: boolean;
  includeComments: boolean;
}

export default function MultiFrameworkExport({ formData, trigger }: MultiFrameworkExportProps) {
  const { toast } = useToast();
  const [activeFramework, setActiveFramework] = useState<'react' | 'blazor' | 'vue'>('react');
  const [options, setOptions] = useState<ExportOptions>({
    typescript: true,
    includeValidation: true,
    includeStyles: true,
    includeTailwind: true,
    includeComments: true
  });

  const generateReactCode = (): string => {
    const extension = options.typescript ? 'tsx' : 'jsx';
    const componentName = formData.Label ? formData.Label.replace(/[^a-zA-Z0-9]/g, '') : 'GeneratedForm';
    
    const imports = [
      "import React, { useState } from 'react';",
      options.includeValidation ? "import { useForm } from 'react-hook-form';" : "",
      options.includeTailwind ? "" : "import './FormComponent.css';"
    ].filter(Boolean).join('\n');

    const stateDeclarations = formData.Fields.map(field => 
      `  const [${field.Id}, set${field.Id}] = useState(${getDefaultValue(field)});`
    ).join('\n');

    const validationRules = options.includeValidation ? `
  // Validation rules based on your form definition
  const validationRules = {
${formData.Fields.filter(f => f.required).map(field => 
    `    ${field.Id}: { required: "${field.label} is required" }`
).join(',\n')}
  };` : '';

    const fieldComponents = formData.Fields.map(field => generateReactField(field)).join('\n\n');

    const submitHandler = `
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
${formData.Fields.map(field => `      ${field.Id}`).join(',\n')}
    };
    
    // Process form data
    console.log('Form submitted:', formData);
    
    // Add your submission logic here
    // Example: await submitForm(formData);
  };`;

    return `${imports}

${options.includeComments ? '// Generated form component from Form Builder Pro' : ''}
${options.includeComments ? `// Form: ${formData.Label || 'Untitled'}` : ''}
${options.includeComments ? `// Generated on: ${new Date().toISOString()}` : ''}

export default function ${componentName}() {
${stateDeclarations}
${validationRules}
${submitHandler}

  return (
    <div className="${options.includeTailwind ? 'max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg' : 'form-container'}">
      <h1 className="${options.includeTailwind ? 'text-2xl font-bold mb-6 text-gray-900' : 'form-title'}">${formData.Label || 'Form'}</h1>
      
      <form onSubmit={handleSubmit} className="${options.includeTailwind ? 'space-y-6' : 'form'}">
        ${fieldComponents}
        
        <div className="${options.includeTailwind ? 'flex gap-4 pt-6' : 'form-actions'}">
          ${formData.Actions?.map(action => `
          <button 
            type="submit" 
            className="${options.includeTailwind ? 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors' : 'btn-primary'}"
          >
            ${action.Label}
          </button>`).join('') || `
          <button 
            type="submit" 
            className="${options.includeTailwind ? 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors' : 'btn-primary'}"
          >
            Submit
          </button>`}
        </div>
      </form>
    </div>
  );
}`;
  };

  const generateBlazorCode = (): string => {
    const componentName = formData.Label ? formData.Label.replace(/[^a-zA-Z0-9]/g, '') : 'GeneratedForm';
    
    const modelClass = `
// ${componentName}Model.cs
using System.ComponentModel.DataAnnotations;

public class ${componentName}Model
{
${formData.Fields.map(field => `
    ${field.required ? '[Required(ErrorMessage = "' + field.label + ' is required")]' : ''}
    public ${getBlazorType(field)} ${field.Id} { get; set; }${getBlazorDefaultValue(field)}`).join('')}
}`;

    const razorComponent = `
@* ${componentName}.razor *@
@page "/${componentName.toLowerCase()}"
@using System.ComponentModel.DataAnnotations

<PageTitle>${formData.Label || 'Form'}</PageTitle>

<div class="container-fluid">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">${formData.Label || 'Form'}</h3>
                </div>
                <div class="card-body">
                    <EditForm Model="@model" OnValidSubmit="@HandleSubmit">
                        <DataAnnotationsValidator />
                        <ValidationSummary />

${formData.Fields.map(field => generateBlazorField(field)).join('\n\n')}

                        <div class="form-group mt-4">
                            ${formData.Actions?.map(action => `
                            <button type="submit" class="btn btn-primary me-2">
                                ${action.Label}
                            </button>`).join('') || `
                            <button type="submit" class="btn btn-primary">
                                Submit
                            </button>`}
                        </div>
                    </EditForm>
                </div>
            </div>
        </div>
    </div>
</div>

@code {
    private ${componentName}Model model = new();

    private async Task HandleSubmit()
    {
        // Process form submission
        Console.WriteLine($"Form submitted: {System.Text.Json.JsonSerializer.Serialize(model)}");
        
        // Add your submission logic here
        // Example: await FormService.SubmitAsync(model);
    }
}`;

    return modelClass + '\n\n' + razorComponent;
  };

  const generateVueCode = (): string => {
    const componentName = formData.Label ? formData.Label.replace(/[^a-zA-Z0-9]/g, '') : 'GeneratedForm';
    
    const dataProperties = formData.Fields.map(field => 
      `      ${field.Id}: ${getDefaultValue(field)}`
    ).join(',\n');

    const validationRules = options.includeValidation ? `
    validationRules: {
${formData.Fields.filter(f => f.required).map(field => 
      `      ${field.Id}: { required: true, message: '${field.label} is required' }`
).join(',\n')}
    },` : '';

    return `<template>
  <div class="${options.includeTailwind ? 'max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg' : 'form-container'}">
    <h1 class="${options.includeTailwind ? 'text-2xl font-bold mb-6 text-gray-900' : 'form-title'}">${formData.Label || 'Form'}</h1>
    
    <form @submit.prevent="handleSubmit" class="${options.includeTailwind ? 'space-y-6' : 'form'}">
${formData.Fields.map(field => generateVueField(field)).join('\n\n')}
      
      <div class="${options.includeTailwind ? 'flex gap-4 pt-6' : 'form-actions'}">
        ${formData.Actions?.map(action => `
        <button 
          type="submit" 
          class="${options.includeTailwind ? 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors' : 'btn-primary'}"
        >
          ${action.Label}
        </button>`).join('') || `
        <button 
          type="submit" 
          class="${options.includeTailwind ? 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors' : 'btn-primary'}"
        >
          Submit
        </button>`}
      </div>
    </form>
  </div>
</template>

<script${options.typescript ? ' lang="ts"' : ''}>
import { reactive } from 'vue';

export default {
  name: '${componentName}',
  setup() {
    const formData = reactive({
${dataProperties}
    });
${validationRules}

    const handleSubmit = () => {
      // Process form submission
      console.log('Form submitted:', formData);
      
      // Add your submission logic here
      // Example: await submitForm(formData);
    };

    return {
      formData,
      handleSubmit
    };
  }
};
</script>

${options.includeStyles ? `
<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.form-field {
  margin-bottom: 1.5rem;
}

.field-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2563eb;
}
</style>` : ''}`;
  };

  const generateReactField = (field: any): string => {
    const className = options.includeTailwind ? 'block text-sm font-medium text-gray-700 mb-2' : 'field-label';
    const inputClass = options.includeTailwind ? 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'form-input';

    switch (field.type) {
      case 'GRIDLKP':
      case 'LSTLKP':
        return `        <div className="${options.includeTailwind ? 'form-field' : 'field'}">
          <label htmlFor="${field.Id}" className="${className}">
            ${field.label}${field.required ? ' *' : ''}
          </label>
          <select
            id="${field.Id}"
            value={${field.Id}}
            onChange={(e) => set${field.Id}(e.target.value)}
            className="${inputClass}"
            ${field.required ? 'required' : ''}
          >
            <option value="">Select ${field.label}...</option>
            {/* Add options based on ${field.LoadDataInfo?.DataModel || 'data source'} */}
          </select>
        </div>`;

      case 'DATEPICKER':
        return `        <div className="${options.includeTailwind ? 'form-field' : 'field'}">
          <label htmlFor="${field.Id}" className="${className}">
            ${field.label}${field.required ? ' *' : ''}
          </label>
          <input
            type="date"
            id="${field.Id}"
            value={${field.Id}}
            onChange={(e) => set${field.Id}(e.target.value)}
            className="${inputClass}"
            ${field.required ? 'required' : ''}
          />
        </div>`;

      case 'SELECT':
        return `        <div className="${options.includeTailwind ? 'form-field' : 'field'}">
          <label htmlFor="${field.Id}" className="${className}">
            ${field.label}${field.required ? ' *' : ''}
          </label>
          <select
            id="${field.Id}"
            value={${field.Id}}
            onChange={(e) => set${field.Id}(e.target.value)}
            className="${inputClass}"
            ${field.required ? 'required' : ''}
          >
            ${Object.entries(field.OptionValues || {}).map(([key, value]) => 
              `<option value="${key}">${value}</option>`
            ).join('\n            ')}
          </select>
        </div>`;

      case 'CHECKBOX':
        return `        <div className="${options.includeTailwind ? 'flex items-center' : 'checkbox-field'}">
          <input
            type="checkbox"
            id="${field.Id}"
            checked={${field.Id}}
            onChange={(e) => set${field.Id}(e.target.checked)}
            className="${options.includeTailwind ? 'mr-2' : 'checkbox'}"
          />
          <label htmlFor="${field.Id}" className="${options.includeTailwind ? 'text-sm text-gray-700' : 'checkbox-label'}">
            ${field.label}
          </label>
        </div>`;

      case 'RADIOGRP':
        return `        <fieldset className="${options.includeTailwind ? 'space-y-2' : 'radio-group'}">
          <legend className="${className}">${field.label}${field.required ? ' *' : ''}</legend>
          ${Object.entries(field.OptionValues || {}).map(([key, value]) => `
          <div className="${options.includeTailwind ? 'flex items-center' : 'radio-option'}">
            <input
              type="radio"
              name="${field.Id}"
              value="${key}"
              checked={${field.Id} === '${key}'}
              onChange={(e) => set${field.Id}(e.target.value)}
              className="${options.includeTailwind ? 'mr-2' : 'radio'}"
            />
            <label className="${options.includeTailwind ? 'text-sm text-gray-700' : 'radio-label'}">${value}</label>
          </div>`).join('')}
        </fieldset>`;

      default:
        return `        <div className="${options.includeTailwind ? 'form-field' : 'field'}">
          <label htmlFor="${field.Id}" className="${className}">
            ${field.label}${field.required ? ' *' : ''}
          </label>
          <input
            type="text"
            id="${field.Id}"
            value={${field.Id}}
            onChange={(e) => set${field.Id}(e.target.value)}
            className="${inputClass}"
            ${field.required ? 'required' : ''}
            placeholder="Enter ${field.label}..."
          />
        </div>`;
    }
  };

  const generateBlazorField = (field: any): string => {
    switch (field.type) {
      case 'GRIDLKP':
      case 'LSTLKP':
        return `                        <div class="form-group">
                            <label for="${field.Id}" class="form-label">${field.label}${field.required ? ' *' : ''}</label>
                            <InputSelect @bind-Value="model.${field.Id}" class="form-select" id="${field.Id}">
                                <option value="">Select ${field.label}...</option>
                                @* Add options from ${field.LoadDataInfo?.DataModel || 'data source'} *@
                            </InputSelect>
                            <ValidationMessage For="@(() => model.${field.Id})" />
                        </div>`;

      case 'DATEPICKER':
        return `                        <div class="form-group">
                            <label for="${field.Id}" class="form-label">${field.label}${field.required ? ' *' : ''}</label>
                            <InputDate @bind-Value="model.${field.Id}" class="form-control" id="${field.Id}" />
                            <ValidationMessage For="@(() => model.${field.Id})" />
                        </div>`;

      case 'SELECT':
        return `                        <div class="form-group">
                            <label for="${field.Id}" class="form-label">${field.label}${field.required ? ' *' : ''}</label>
                            <InputSelect @bind-Value="model.${field.Id}" class="form-select" id="${field.Id}">
                                ${Object.entries(field.OptionValues || {}).map(([key, value]) => 
                                  `<option value="${key}">${value}</option>`
                                ).join('\n                                ')}
                            </InputSelect>
                            <ValidationMessage For="@(() => model.${field.Id})" />
                        </div>`;

      case 'CHECKBOX':
        return `                        <div class="form-check">
                            <InputCheckbox @bind-Value="model.${field.Id}" class="form-check-input" id="${field.Id}" />
                            <label class="form-check-label" for="${field.Id}">
                                ${field.label}
                            </label>
                            <ValidationMessage For="@(() => model.${field.Id})" />
                        </div>`;

      default:
        return `                        <div class="form-group">
                            <label for="${field.Id}" class="form-label">${field.label}${field.required ? ' *' : ''}</label>
                            <InputText @bind-Value="model.${field.Id}" class="form-control" id="${field.Id}" placeholder="Enter ${field.label}..." />
                            <ValidationMessage For="@(() => model.${field.Id})" />
                        </div>`;
    }
  };

  const generateVueField = (field: any): string => {
    const labelClass = options.includeTailwind ? 'block text-sm font-medium text-gray-700 mb-2' : 'field-label';
    const inputClass = options.includeTailwind ? 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'form-input';

    switch (field.type) {
      case 'GRIDLKP':
      case 'LSTLKP':
        return `      <div class="${options.includeTailwind ? 'form-field' : 'field'}">
        <label for="${field.Id}" class="${labelClass}">
          ${field.label}${field.required ? ' *' : ''}
        </label>
        <select
          id="${field.Id}"
          v-model="formData.${field.Id}"
          class="${inputClass}"
          ${field.required ? 'required' : ''}
        >
          <option value="">Select ${field.label}...</option>
          <!-- Add options from ${field.LoadDataInfo?.DataModel || 'data source'} -->
        </select>
      </div>`;

      case 'DATEPICKER':
        return `      <div class="${options.includeTailwind ? 'form-field' : 'field'}">
        <label for="${field.Id}" class="${labelClass}">
          ${field.label}${field.required ? ' *' : ''}
        </label>
        <input
          type="date"
          id="${field.Id}"
          v-model="formData.${field.Id}"
          class="${inputClass}"
          ${field.required ? 'required' : ''}
        />
      </div>`;

      case 'SELECT':
        return `      <div class="${options.includeTailwind ? 'form-field' : 'field'}">
        <label for="${field.Id}" class="${labelClass}">
          ${field.label}${field.required ? ' *' : ''}
        </label>
        <select
          id="${field.Id}"
          v-model="formData.${field.Id}"
          class="${inputClass}"
          ${field.required ? 'required' : ''}
        >
          ${Object.entries(field.OptionValues || {}).map(([key, value]) => 
            `<option value="${key}">${value}</option>`
          ).join('\n          ')}
        </select>
      </div>`;

      case 'CHECKBOX':
        return `      <div class="${options.includeTailwind ? 'flex items-center' : 'checkbox-field'}">
        <input
          type="checkbox"
          id="${field.Id}"
          v-model="formData.${field.Id}"
          class="${options.includeTailwind ? 'mr-2' : 'checkbox'}"
        />
        <label for="${field.Id}" class="${options.includeTailwind ? 'text-sm text-gray-700' : 'checkbox-label'}">
          ${field.label}
        </label>
      </div>`;

      default:
        return `      <div class="${options.includeTailwind ? 'form-field' : 'field'}">
        <label for="${field.Id}" class="${labelClass}">
          ${field.label}${field.required ? ' *' : ''}
        </label>
        <input
          type="text"
          id="${field.Id}"
          v-model="formData.${field.Id}"
          class="${inputClass}"
          ${field.required ? 'required' : ''}
          placeholder="Enter ${field.label}..."
        />
      </div>`;
    }
  };

  const getDefaultValue = (field: any): string => {
    switch (field.type) {
      case 'CHECKBOX':
        return field.CheckboxValue ? 'true' : 'false';
      case 'RADIOGRP':
        return `"${field.value || ''}"`;
      case 'DATEPICKER':
        return '""';
      default:
        return '""';
    }
  };

  const getBlazorType = (field: any): string => {
    switch (field.type) {
      case 'CHECKBOX':
        return 'bool';
      case 'DATEPICKER':
        return 'DateTime?';
      case 'SELECT':
      case 'GRIDLKP':
      case 'LSTLKP':
        return field.UserIntKey ? 'int?' : 'string?';
      default:
        return 'string?';
    }
  };

  const getBlazorDefaultValue = (field: any): string => {
    if (field.type === 'CHECKBOX' && field.CheckboxValue) {
      return ' = true;';
    }
    return '';
  };

  const getCurrentCode = (): string => {
    switch (activeFramework) {
      case 'react':
        return generateReactCode();
      case 'blazor':
        return generateBlazorCode();
      case 'vue':
        return generateVueCode();
      default:
        return '';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentCode());
      toast({
        title: "Code Copied! 📋",
        description: `${activeFramework.charAt(0).toUpperCase() + activeFramework.slice(1)} code copied to clipboard`
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadCode = () => {
    const code = getCurrentCode();
    const extensions = {
      react: options.typescript ? 'tsx' : 'jsx',
      blazor: 'razor',
      vue: 'vue'
    };
    
    const filename = `${formData.Label?.replace(/[^a-zA-Z0-9]/g, '') || 'GeneratedForm'}.${extensions[activeFramework]}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Complete! 🚀",
      description: `${activeFramework.charAt(0).toUpperCase() + activeFramework.slice(1)} component downloaded as ${filename}`
    });
  };

  const frameworkInfo = {
    react: {
      name: "React",
      description: "Modern React component with hooks",
      icon: "⚛️",
      color: "bg-blue-100 text-blue-800"
    },
    blazor: {
      name: "Blazor",
      description: "Server-side Blazor component",
      icon: "🔷",
      color: "bg-purple-100 text-purple-800"
    },
    vue: {
      name: "Vue 3",
      description: "Vue 3 Composition API component",
      icon: "💚",
      color: "bg-green-100 text-green-800"
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Code2 className="w-4 h-4" />
            Export Code
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Multi-Framework Export
              </span>
              <p className="text-sm text-slate-600 font-normal mt-1">
                Generate production-ready code for React, Blazor, and Vue
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-6 h-[70vh]">
          {/* Framework Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Frameworks</h3>
            <div className="space-y-2">
              {Object.entries(frameworkInfo).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setActiveFramework(key as any)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    activeFramework === key
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{info.icon}</span>
                    <span className="font-medium">{info.name}</span>
                  </div>
                  <p className="text-xs text-slate-600">{info.description}</p>
                </button>
              ))}
            </div>

            {/* Export Options */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-slate-900">Options</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="typescript" className="text-sm">TypeScript</Label>
                  <Switch
                    id="typescript"
                    checked={options.typescript}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, typescript: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="validation" className="text-sm">Validation</Label>
                  <Switch
                    id="validation"
                    checked={options.includeValidation}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeValidation: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="styles" className="text-sm">Styles</Label>
                  <Switch
                    id="styles"
                    checked={options.includeStyles}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeStyles: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="tailwind" className="text-sm">Tailwind CSS</Label>
                  <Switch
                    id="tailwind"
                    checked={options.includeTailwind}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeTailwind: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="comments" className="text-sm">Comments</Label>
                  <Switch
                    id="comments"
                    checked={options.includeComments}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeComments: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Code Preview */}
          <div className="col-span-3 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge className={frameworkInfo[activeFramework].color}>
                  {frameworkInfo[activeFramework].icon} {frameworkInfo[activeFramework].name}
                </Badge>
                <span className="text-sm text-slate-600">
                  Production-ready component
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button size="sm" onClick={downloadCode}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 border rounded-lg bg-slate-900 text-green-300">
              <pre className="p-4 text-sm leading-relaxed">
                <code>{getCurrentCode()}</code>
              </pre>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}