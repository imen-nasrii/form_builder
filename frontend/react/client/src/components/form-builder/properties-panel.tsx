import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Plus, X, MousePointer, Code } from "lucide-react";
import ValidationEditor from "./validation-editor";
import UniversalConfigurator from "./component-configurators/universal-configurator";
import type { FormField } from "@/lib/form-types";

interface PropertiesPanelProps {
  selectedField: FormField | null;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  formData: {
    fields: FormField[];
    validations: any[];
  };
}

export default function PropertiesPanel({ 
  selectedField, 
  onUpdateField, 
  formData 
}: PropertiesPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    configurator: true,
    validation: false,
    conditional: false,
    json: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateField = (updates: Partial<FormField>) => {
    if (selectedField) {
      onUpdateField(selectedField.Id, updates);
    }
  };

  const addOptionValue = () => {
    if (selectedField && selectedField.OptionValues) {
      const newKey = `option_${Object.keys(selectedField.OptionValues).length + 1}`;
      updateField({
        OptionValues: {
          ...selectedField.OptionValues,
          [newKey]: "New Option"
        }
      });
    }
  };

  const updateOptionValue = (key: string, value: string) => {
    if (selectedField && selectedField.OptionValues) {
      updateField({
        OptionValues: {
          ...selectedField.OptionValues,
          [key]: value
        }
      });
    }
  };

  const removeOptionValue = (key: string) => {
    if (selectedField && selectedField.OptionValues) {
      const newOptions = { ...selectedField.OptionValues };
      delete newOptions[key];
      updateField({ OptionValues: newOptions });
    }
  };

  if (!selectedField) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 border-l">
        <div className="text-center text-gray-500 p-6">
          <MousePointer className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Aucun composant sélectionné</p>
          <p className="text-sm">Cliquez sur un composant dans le canvas pour voir ses propriétés</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900 border-l overflow-y-auto">
      <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {selectedField.type}
          </Badge>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {selectedField.label || selectedField.Id || 'Composant'}
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Component Configurator */}
        <Collapsible open={expandedSections.configurator} onOpenChange={() => toggleSection('configurator')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
            <span className="font-medium text-blue-900 dark:text-blue-100">Configuration {selectedField.type}</span>
            {expandedSections.configurator ? <ChevronDown className="w-4 h-4 text-blue-600" /> : <ChevronRight className="w-4 h-4 text-blue-600" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <UniversalConfigurator 
              field={selectedField} 
              onUpdate={updateField} 
            />
          </CollapsibleContent>
        </Collapsible>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center justify-between">
              Properties
              <Badge className={`field-type-${selectedField.type}`}>
                {selectedField.type}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Basic Properties */}
            <Collapsible open={expandedSections.basic} onOpenChange={() => toggleSection('basic')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-slate-700 hover:text-slate-900">
                <span>Basic Properties</span>
                {expandedSections.basic ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wider">Field ID</Label>
                  <Input
                    value={selectedField.Id}
                    onChange={(e) => updateField({ Id: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wider">Label</Label>
                  <Input
                    value={selectedField.label}
                    onChange={(e) => updateField({ label: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wider">Width</Label>
                  <Select 
                    value={selectedField.Width} 
                    onValueChange={(value) => updateField({ Width: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25%</SelectItem>
                      <SelectItem value="32">32%</SelectItem>
                      <SelectItem value="50">50%</SelectItem>
                      <SelectItem value="100">100%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedField.required || false}
                      onCheckedChange={(checked) => updateField({ required: !!checked })}
                    />
                    <Label className="text-sm">Required Field</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedField.Inline || false}
                      onCheckedChange={(checked) => updateField({ Inline: !!checked })}
                    />
                    <Label className="text-sm">Inline Layout</Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Type-Specific Properties */}
            {(selectedField.type === 'SELECT' || selectedField.type === 'RADIOGRP') && (
              <Collapsible open={expandedSections.advanced} onOpenChange={() => toggleSection('advanced')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-slate-700 hover:text-slate-900">
                  <span>Option Values</span>
                  {expandedSections.advanced ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-3">
                  <div className="space-y-2">
                    {selectedField.OptionValues && Object.entries(selectedField.OptionValues).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Input
                          value={key}
                          className="w-20 text-xs"
                          disabled
                        />
                        <Input
                          value={value}
                          onChange={(e) => updateOptionValue(key, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOptionValue(key)}
                          className="p-1 h-8 w-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addOptionValue}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Lookup Properties */}
            {(selectedField.type === 'GRIDLKP' || selectedField.type === 'LSTLKP') && (
              <Collapsible open={expandedSections.advanced} onOpenChange={() => toggleSection('advanced')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-slate-700 hover:text-slate-900">
                  <span>Lookup Configuration</span>
                  {expandedSections.advanced ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-3">
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wider">Key Column</Label>
                    <Input
                      value={selectedField.KeyColumn || ''}
                      onChange={(e) => updateField({ KeyColumn: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wider">Data Model</Label>
                    <Input
                      value={selectedField.LoadDataInfo?.DataModel || ''}
                      onChange={(e) => updateField({ 
                        LoadDataInfo: {
                          ...selectedField.LoadDataInfo,
                          DataModel: e.target.value
                        }
                      })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wider">Main Property</Label>
                    <Input
                      value={selectedField.ItemInfo?.MainProperty || ''}
                      onChange={(e) => updateField({ 
                        ItemInfo: {
                          ...selectedField.ItemInfo,
                          MainProperty: e.target.value
                        }
                      })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wider">Description Property</Label>
                    <Input
                      value={selectedField.ItemInfo?.DescProperty || ''}
                      onChange={(e) => updateField({ 
                        ItemInfo: {
                          ...selectedField.ItemInfo,
                          DescProperty: e.target.value
                        }
                      })}
                      className="mt-1"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Validation Rules */}
            <Collapsible open={expandedSections.validation} onOpenChange={() => toggleSection('validation')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-slate-700 hover:text-slate-900">
                <span>Validation Rules</span>
                {expandedSections.validation ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <ValidationEditor
                  field={selectedField}
                  onUpdateField={updateField}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* Conditional Logic */}
            <Collapsible open={expandedSections.conditional} onOpenChange={() => toggleSection('conditional')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-slate-700 hover:text-slate-900">
                <span>Conditional Logic</span>
                {expandedSections.conditional ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                <div>
                  <Label className="text-xs font-medium uppercase tracking-wider">Enabled When</Label>
                  <Textarea
                    placeholder="Add conditional logic here..."
                    className="mt-1 text-sm"
                    rows={3}
                  />
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Condition
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {/* JSON Preview */}
            <Collapsible open={expandedSections.json} onOpenChange={() => toggleSection('json')}>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-slate-700 hover:text-slate-900">
                <span>JSON Preview</span>
                {expandedSections.json ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono">
                  <pre className="text-green-400 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(selectedField, null, 2)}
                  </pre>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Code className="w-3 h-3 mr-1" />
                    Validate
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Copy JSON
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
