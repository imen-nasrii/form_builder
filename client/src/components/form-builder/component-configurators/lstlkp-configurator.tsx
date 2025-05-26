import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, List } from "lucide-react";
import type { FormField } from "@/lib/form-types";

interface LSTLKPConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function LSTLKPConfigurator({ field, onUpdate }: LSTLKPConfiguratorProps) {
  const [newOption, setNewOption] = useState({ key: "", value: "" });

  const addOption = () => {
    if (!newOption.key || !newOption.value) return;
    
    const currentOptions = field.OptionValues || {};
    const updatedOptions = { ...currentOptions, [newOption.key]: newOption.value };
    
    onUpdate({ OptionValues: updatedOptions });
    setNewOption({ key: "", value: "" });
  };

  const removeOption = (key: string) => {
    const currentOptions = field.OptionValues || {};
    const { [key]: removed, ...updatedOptions } = currentOptions;
    onUpdate({ OptionValues: updatedOptions });
  };

  return (
    <div className="space-y-6">
      {/* Basic Properties */}
      <Card className="border-green-200 dark:border-green-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <List className="w-4 h-4 text-green-500" />
            Propriétés LSTLKP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ID</Label>
              <Input 
                value={field.Id || ""} 
                onChange={(e) => onUpdate({ Id: e.target.value })}
                placeholder="ex: SecCat"
              />
            </div>
            <div>
              <Label>Label</Label>
              <Input 
                value={field.label || ""} 
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="ex: Security Category"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <Label>Key Column</Label>
              <Input 
                value={field.KeyColumn || ""} 
                onChange={(e) => onUpdate({ KeyColumn: e.target.value })}
                placeholder="ex: CategoryID"
              />
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
        </CardContent>
      </Card>

      {/* Item Display Configuration */}
      <Card className="border-blue-200 dark:border-blue-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-blue-700 dark:text-blue-300">
            Configuration d'affichage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Main Property</Label>
              <Input 
                value={field.ItemInfo?.MainProperty || ""} 
                onChange={(e) => onUpdate({ 
                  ItemInfo: { 
                    ...field.ItemInfo, 
                    MainProperty: e.target.value 
                  } 
                })}
                placeholder="ex: Name"
              />
            </div>
            <div>
              <Label>Desc Property</Label>
              <Input 
                value={field.ItemInfo?.DescProperty || ""} 
                onChange={(e) => onUpdate({ 
                  ItemInfo: { 
                    ...field.ItemInfo, 
                    DescProperty: e.target.value 
                  } 
                })}
                placeholder="ex: Description"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              checked={field.ItemInfo?.ShowDescription !== false}
              onCheckedChange={(checked) => onUpdate({ 
                ItemInfo: { 
                  ...field.ItemInfo, 
                  ShowDescription: checked 
                } 
              })}
            />
            <Label>Show Description</Label>
          </div>
        </CardContent>
      </Card>

      {/* Data Source Configuration */}
      <Card className="border-purple-200 dark:border-purple-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-purple-700 dark:text-purple-300">
            Source de données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data Model</Label>
              <Input 
                value={field.LoadDataInfo?.DataModel || ""} 
                onChange={(e) => onUpdate({ 
                  LoadDataInfo: { 
                    ...field.LoadDataInfo, 
                    DataModel: e.target.value 
                  } 
                })}
                placeholder="ex: CategoryModel"
              />
            </div>
            <div>
              <Label>Data Source</Label>
              <Input 
                value={field.LoadDataInfo?.DataSource || ""} 
                onChange={(e) => onUpdate({ 
                  LoadDataInfo: { 
                    ...field.LoadDataInfo, 
                    DataSource: e.target.value 
                  } 
                })}
                placeholder="ex: /api/categories"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              checked={field.LoadDataInfo?.RealTime || false}
              onCheckedChange={(checked) => onUpdate({ 
                LoadDataInfo: { 
                  ...field.LoadDataInfo, 
                  RealTime: checked 
                } 
              })}
            />
            <Label>Real Time</Label>
          </div>
        </CardContent>
      </Card>

      {/* Option Values */}
      <Card className="border-orange-200 dark:border-orange-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-orange-700 dark:text-orange-300">
            Valeurs d'options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Option */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
            <Label className="text-sm font-medium">Ajouter une option</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input 
                placeholder="Clé"
                value={newOption.key}
                onChange={(e) => setNewOption(prev => ({ ...prev, key: e.target.value }))}
              />
              <Input 
                placeholder="Valeur"
                value={newOption.value}
                onChange={(e) => setNewOption(prev => ({ ...prev, value: e.target.value }))}
              />
              <Button onClick={addOption} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Existing Options */}
          <div className="space-y-2">
            {Object.entries(field.OptionValues || {}).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border rounded-lg">
                <Badge variant="secondary">{key}</Badge>
                <span className="text-sm flex-1">{value}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeOption(key)}
                  className="ml-auto"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}