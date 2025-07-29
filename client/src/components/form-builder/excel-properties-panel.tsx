import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Trash2 } from "lucide-react";
import { ComponentSpecificProperties } from "@/components/enterprise-form-components";
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-900 dark:text-white">
          {property.label}
        </Label>
        <Badge 
          variant="outline" 
          className={`text-xs px-2 py-1 ${getDataTypeBadgeColor(property.dataType)}`}
        >
          {property.dataType}
        </Badge>
      </div>
      
      {property.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {property.description}
        </p>
      )}

      {property.type === 'boolean' ? (
        <div className="flex items-center space-x-2">
          <Switch
            checked={Boolean(value)}
            onCheckedChange={handleChange}
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {Boolean(value) ? 'Activé' : 'Désactivé'}
          </span>
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
          className="min-h-[80px] font-mono text-xs"
        />
      ) : property.type === 'number' ? (
        <Input
          type="number"
          value={value !== undefined ? value : property.defaultValue}
          onChange={(e) => handleChange(Number(e.target.value))}
          placeholder={`Ex: ${property.defaultValue}`}
        />
      ) : (
        <Input
          type="text"
          value={value !== undefined ? value : property.defaultValue || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Ex: ${property.defaultValue}`}
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
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select a component to view its properties
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Click on a component in the Construction Zone to see its Excel specifications.
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
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Properties
          </span>
          {onRemoveField && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRemoveField(selectedField.Id)}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Remove
            </Button>
          )}
        </CardTitle>
        
        <div className="flex items-center gap-2 pt-2">
          <Badge variant="secondary" className="font-mono">
            {selectedField.type}
          </Badge>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {selectedField.label || selectedField.Id}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4 space-y-6">
            {componentProperties.length > 0 ? (
              componentProperties.map((property) => (
                <PropertyField
                  key={property.id}
                  property={property}
                  value={(selectedField as any)[property.id]}
                  onChange={(newValue) => {
                    updateField({ [property.id]: newValue });
                  }}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No Excel properties defined for {selectedField.type}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Component specifications need to be added to ComponentProperties
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}