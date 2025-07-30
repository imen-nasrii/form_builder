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
    <div className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {property.label}
            {property.required && <span className="text-red-500 text-xs">*</span>}
          </Label>
          {property.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {property.description}
            </p>
          )}
        </div>
        {property.dataType && (
          <Badge 
            variant="outline" 
            className={`text-xs px-3 py-1 font-medium ${getDataTypeBadgeColor(property.dataType)}`}
          >
            {property.dataType}
          </Badge>
        )}
      </div>
      


      {property.type === 'boolean' ? (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Boolean(value) ? 'Activé' : 'Désactivé'}
          </span>
          <Switch
            checked={Boolean(value)}
            onCheckedChange={handleChange}
            className="data-[state=checked]:bg-blue-600"
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
          className="min-h-[100px] font-mono text-sm bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
        />
      ) : property.type === 'number' ? (
        <Input
          type="number"
          value={value !== undefined ? value : property.defaultValue}
          onChange={(e) => handleChange(Number(e.target.value))}
          placeholder={`Ex: ${property.defaultValue}`}
          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
        />
      ) : (
        <Input
          type="text"
          value={value !== undefined ? value : property.defaultValue || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Ex: ${property.defaultValue}`}
          className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
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
        <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <CardTitle className="text-lg font-semibold flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-gray-900 dark:text-white">Propriétés Excel</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                Aucun composant sélectionné
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
              Sélectionnez un composant
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              Cliquez sur un composant dans la Zone de Construction pour voir ses propriétés Excel et les modifier en temps réel.
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
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-gray-900 dark:text-white">Propriétés Excel</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                {selectedField.Type} - {selectedField.Label}
              </div>
            </div>
          </span>
          {onRemoveField && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRemoveField(selectedField.Id)}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Supprimer
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="p-4 space-y-4">
            {componentProperties.length > 0 ? (
              componentProperties.map((property) => 
                property.id === 'LoadDataInfo_DataModel' ? (
                  <div key={property.id} className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                        {property.label}
                      </Label>
                      <Badge variant="outline" className="text-xs px-3 py-1">
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
                        <Button variant="outline" className="w-full justify-start bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                          <Database className="w-4 h-4 mr-2" />
                          {(selectedField as any)[property.id] ? `Modèle: ${(selectedField as any)[property.id]}` : 'Sélectionner un modèle MFact'}
                        </Button>
                      }
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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
                  Aucune propriété Excel définie
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Le composant {selectedField.Type} n'a pas encore de spécifications Excel configurées.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Les spécifications doivent être ajoutées dans ComponentProperties
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}