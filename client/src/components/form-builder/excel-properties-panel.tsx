import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Trash2, Plus, Database, Grid3X3, Eye, EyeOff } from "lucide-react";
import { ComponentSpecificProperties } from "@/components/enterprise-form-components";
import MFactModelSelector from "@/components/mfact-model-selector";
import type { FormField } from "@/lib/form-types";

interface ExcelPropertiesPanelProps {
  selectedField: FormField | null;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onRemoveField?: (fieldId: string) => void;
}

function getDataTypeBadgeColor(dataType: string): string {
  switch (dataType) {
    case 'Chaîne de caractères':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Booléen':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Nombre':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Objet':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Tableau d\'Objets':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function PropertyField({ 
  property, 
  value, 
  onChange 
}: { 
  property: any; 
  value: any; 
  onChange: (newValue: any) => void;
}) {
  const handleChange = (newValue: any) => {
    onChange(newValue);
  };

  return (
    <div className="space-y-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
            {property.label}
            {property.required && <span className="text-red-500 text-xs">*</span>}
          </Label>
          {property.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              {property.description}
            </p>
          )}
        </div>
        {property.dataType && (
          <Badge 
            variant="outline" 
            className={`text-xs px-2 py-0.5 font-medium ${getDataTypeBadgeColor(property.dataType)}`}
          >
            {property.dataType}
          </Badge>
        )}
      </div>
      


      {property.type === 'boolean' ? (
        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {Boolean(value) ? 'Activé' : 'Désactivé'}
          </span>
          <Switch
            checked={Boolean(value)}
            onCheckedChange={handleChange}
            className="data-[state=checked]:bg-blue-600 scale-75"
          />
        </div>
      ) : property.type === 'textarea' ? (
        <Textarea
          value={typeof value === 'object' ? JSON.stringify(value, null, 2) : (value || property.defaultValue || '')}
          onChange={(e) => {
            try {
              // Try to parse as JSON if it looks like JSON
              const val = e.target.value;
              if (val.trim().startsWith('{') || val.trim().startsWith('[')) {
                handleChange(JSON.parse(val));
              } else {
                handleChange(val);
              }
            } catch {
              handleChange(e.target.value);
            }
          }}
          placeholder={`Ex: ${property.defaultValue}`}
          className="min-h-[80px] font-mono text-xs bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
        />
      ) : property.type === 'number' ? (
        <Input
          type="number"
          value={value !== undefined ? value : property.defaultValue}
          onChange={(e) => handleChange(Number(e.target.value))}
          placeholder={`Ex: ${property.defaultValue}`}
          className="h-8 text-xs bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
        />
      ) : (
        <Input
          type="text"
          value={value !== undefined ? value : property.defaultValue || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Ex: ${property.defaultValue}`}
          className="h-8 text-xs bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
        />
      )}
    </div>
  );
}

export default function ExcelPropertiesPanel({ 
  selectedField, 
  onUpdateField, 
  onRemoveField 
}: ExcelPropertiesPanelProps) {
  if (!selectedField) {
    return (
      <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-md">
              <Settings className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-gray-900 dark:text-white text-sm">Excel Properties</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                No component selected
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[400px] text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Select a component
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              Click on a component in the Construction Zone to view and modify its Excel properties in real-time.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get the component properties from our Excel specifications
  const componentProperties = ComponentSpecificProperties[selectedField.Type as keyof typeof ComponentSpecificProperties] || [];
  
  const updateField = (updates: Partial<FormField>) => {
    onUpdateField(selectedField.Id, updates);
  };

  return (
    <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-md">
              <Settings className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-gray-900 dark:text-white text-sm">Excel Properties</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                {selectedField.Type} - {selectedField.Label}
              </div>
            </div>
          </span>
          {onRemoveField && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRemoveField(selectedField.Id)}
              className="h-7 px-2 text-xs shadow-sm hover:shadow-md transition-shadow"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-3 space-y-3">
            {componentProperties.length > 0 ? (
              componentProperties.map((property) => 
                property.id === 'LoadDataInfo_DataModel' ? (
                  <div key={property.id} className="space-y-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-semibold text-gray-900 dark:text-white">
                        {property.label}
                      </Label>
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        {property.dataType}
                      </Badge>
                    </div>
                    <MFactModelSelector
                      value={(selectedField as any)[property.id]}
                      selectedColumns={(selectedField as any)['LoadDataInfo_ColumnsDefinition'] || []}
                      onModelSelect={(model) => {
                        updateField({ [property.id]: model });
                      }}
                      onColumnsSelect={(columns) => {
                        updateField({ 'LoadDataInfo_ColumnsDefinition': columns });
                      }}
                      trigger={
                        <Button variant="outline" className="w-full justify-start h-8 text-xs bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                          <Database className="w-3 h-3 mr-1.5" />
                          {(selectedField as any)[property.id] ? `Model: ${(selectedField as any)[property.id]}` : 'Select MFact Model'}
                        </Button>
                      }
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                      {property.description}
                    </p>
                  </div>
                ) : (
                  <PropertyField
                    key={property.id}
                    property={property}
                    value={(selectedField as any)[property.id]}
                    onChange={(newValue) => {
                      updateField({ [property.id]: newValue });
                    }}
                  />
                )
              )
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Excel properties defined
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  The {selectedField.Type} component doesn't have Excel specifications configured yet.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Specifications must be added in ComponentProperties
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}