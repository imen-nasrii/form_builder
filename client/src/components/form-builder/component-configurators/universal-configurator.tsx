import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Settings, CheckSquare, List, Calendar, Type, Upload, Radio } from "lucide-react";
import GridConfigurator from "./grid-configurator";
import GRIDLKPConfigurator from "./gridlkp-configurator";
import LSTLKPConfigurator from "./lstlkp-configurator";
import DatePickerConfigurator from "./datepicker-configurator";
import TextConfigurator from "./text-configurator";
import TextAreaConfigurator from "./textarea-configurator";
import ActionConfigurator from "./action-configurator";
import type { FormField } from "@/lib/form-types";

interface UniversalConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function UniversalConfigurator({ field, onUpdate }: UniversalConfiguratorProps) {
  const getIcon = () => {
    switch (field.type) {
      case 'GRID': return <Settings className="w-4 h-4 text-blue-600" />;
      case 'DIALOG': return <Settings className="w-4 h-4 text-purple-600" />;
      case 'TEXT': return <Type className="w-4 h-4 text-green-600" />;
      case 'GRIDLKP': return <Settings className="w-4 h-4 text-blue-500" />;
      case 'LSTLKP': return <List className="w-4 h-4 text-green-500" />;
      case 'DATEPICKER': return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'SELECT': return <List className="w-4 h-4 text-orange-500" />;
      case 'CHECKBOX': return <CheckSquare className="w-4 h-4 text-cyan-500" />;
      case 'RADIOGRP': return <Radio className="w-4 h-4 text-pink-500" />;
      case 'TEXTAREA': return <Type className="w-4 h-4 text-gray-600" />;
      case 'FILEUPLOAD': return <Upload className="w-4 h-4 text-indigo-500" />;
      case 'ACTION': return <Settings className="w-4 h-4 text-orange-600" />;
      default: return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  // Configurateurs spécialisés
  if (field.type === 'GRID') {
    return <GridConfigurator field={field} onUpdate={onUpdate} />;
  }
  
  if (field.type === 'TEXT') {
    return <TextConfigurator field={field} onUpdate={onUpdate} />;
  }
  
  if (field.type === 'TEXTAREA') {
    return <TextAreaConfigurator field={field} onUpdate={onUpdate} />;
  }
  
  if (field.type === 'ACTION') {
    return <ActionConfigurator field={field} onUpdate={onUpdate} />;
  }
  
  if (field.type === 'GRIDLKP') {
    return <GRIDLKPConfigurator field={field} onUpdate={onUpdate} />;
  }
  
  if (field.type === 'LSTLKP') {
    return <LSTLKPConfigurator field={field} onUpdate={onUpdate} />;
  }
  
  if (field.type === 'DATEPICKER') {
    return <DatePickerConfigurator field={field} onUpdate={onUpdate} />;
  }

  // Configurateur SELECT
  if (field.type === 'SELECT') {
    return (
      <div className="space-y-6">
        <Card className="border-orange-200 dark:border-orange-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {getIcon()}
              Propriétés SELECT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ID</Label>
                <Input 
                  value={field.Id || ""} 
                  onChange={(e) => onUpdate({ Id: e.target.value })}
                  placeholder="ex: Status"
                />
              </div>
              <div>
                <Label>Label</Label>
                <Input 
                  value={field.label || ""} 
                  onChange={(e) => onUpdate({ label: e.target.value })}
                  placeholder="ex: Statut"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width</Label>
                <Input 
                  value={field.Width || ""} 
                  onChange={(e) => onUpdate({ Width: e.target.value })}
                  placeholder="ex: 200px"
                />
              </div>
              <div>
                <Label>Spacing</Label>
                <Select 
                  value={field.Spacing || "md"} 
                  onValueChange={(value) => onUpdate({ Spacing: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={field.Inline || false}
                  onCheckedChange={(checked) => onUpdate({ Inline: checked })}
                />
                <Label>Inline</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={field.required || false}
                  onCheckedChange={(checked) => onUpdate({ required: checked })}
                />
                <Label>Required</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={field.UserIntKey || false}
                  onCheckedChange={(checked) => onUpdate({ UserIntKey: checked })}
                />
                <Label>User Int Key</Label>
              </div>
            </div>

            {/* Options Values */}
            <div className="space-y-3">
              <Label>Options disponibles</Label>
              {Object.entries(field.OptionValues || {}).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                  <Badge variant="secondary">{key}</Badge>
                  <span className="text-sm flex-1">{value}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const newOptions = { ...field.OptionValues };
                      delete newOptions[key];
                      onUpdate({ OptionValues: newOptions });
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const newKey = `option${Object.keys(field.OptionValues || {}).length + 1}`;
                  const newOptions = { ...field.OptionValues, [newKey]: `Option ${Object.keys(field.OptionValues || {}).length + 1}` };
                  onUpdate({ OptionValues: newOptions });
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter option
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Configurateur CHECKBOX
  if (field.type === 'CHECKBOX') {
    return (
      <div className="space-y-6">
        <Card className="border-cyan-200 dark:border-cyan-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {getIcon()}
              Propriétés CHECKBOX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ID</Label>
                <Input 
                  value={field.Id || ""} 
                  onChange={(e) => onUpdate({ Id: e.target.value })}
                  placeholder="ex: UpdateRates"
                />
              </div>
              <div>
                <Label>Label</Label>
                <Input 
                  value={field.label || ""} 
                  onChange={(e) => onUpdate({ label: e.target.value })}
                  placeholder="ex: Mettre à jour les taux"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width</Label>
                <Input 
                  value={field.Width || ""} 
                  onChange={(e) => onUpdate({ Width: e.target.value })}
                  placeholder="ex: auto"
                />
              </div>
              <div>
                <Label>Spacing</Label>
                <Select 
                  value={field.Spacing || "md"} 
                  onValueChange={(value) => onUpdate({ Spacing: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={field.Inline || false}
                  onCheckedChange={(checked) => onUpdate({ Inline: checked })}
                />
                <Label>Inline</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={field.CheckboxValue || false}
                  onCheckedChange={(checked) => onUpdate({ CheckboxValue: checked })}
                />
                <Label>Valeur par défaut</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Configurateur générique pour INPUT, TEXTAREA, etc.
  return (
    <div className="space-y-6">
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            {getIcon()}
            Propriétés {field.type}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ID</Label>
              <Input 
                value={field.Id || ""} 
                onChange={(e) => onUpdate({ Id: e.target.value })}
                placeholder="ex: ProgramID"
              />
            </div>
            <div>
              <Label>Label</Label>
              <Input 
                value={field.label || ""} 
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="ex: Program ID"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Width</Label>
              <Input 
                value={field.Width || ""} 
                onChange={(e) => onUpdate({ Width: e.target.value })}
                placeholder="ex: 300px"
              />
            </div>
            <div>
              <Label>Spacing</Label>
              <Select 
                value={field.Spacing || "md"} 
                onValueChange={(value) => onUpdate({ Spacing: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={field.Inline || false}
                onCheckedChange={(checked) => onUpdate({ Inline: checked })}
              />
              <Label>Inline</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={field.required || false}
                onCheckedChange={(checked) => onUpdate({ required: checked })}
              />
              <Label>Required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={field.Outlined !== false}
                onCheckedChange={(checked) => onUpdate({ Outlined: checked })}
              />
              <Label>Outlined</Label>
            </div>
          </div>

          {field.type === 'TEXTAREA' && (
            <div>
              <Label>Nombre de lignes</Label>
              <Input 
                type="number"
                value={field.Value?.rows || "3"} 
                onChange={(e) => onUpdate({ 
                  Value: { 
                    ...field.Value, 
                    rows: parseInt(e.target.value) 
                  } 
                })}
                placeholder="3"
              />
            </div>
          )}

          {field.type === 'TEXT' && (
            <div>
              <Label>Placeholder</Label>
              <Input 
                value={field.Value?.placeholder || ""} 
                onChange={(e) => onUpdate({ 
                  Value: { 
                    ...field.Value, 
                    placeholder: e.target.value 
                  } 
                })}
                placeholder="Texte d'aide..."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}