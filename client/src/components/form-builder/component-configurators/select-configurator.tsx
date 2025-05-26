import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import type { FormField } from "@/lib/form-types";

interface SelectConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function SelectConfigurator({ field, onUpdate }: SelectConfiguratorProps) {
  const [optionValues, setOptionValues] = useState<Record<string, string>>(field.OptionValues || {});

  const addOption = () => {
    const newKey = `option_${Object.keys(optionValues).length + 1}`;
    const newOptions = { ...optionValues, [newKey]: "" };
    setOptionValues(newOptions);
    onUpdate({ OptionValues: newOptions });
  };

  const updateOptionKey = (oldKey: string, newKey: string) => {
    const newOptions = { ...optionValues };
    const value = newOptions[oldKey];
    delete newOptions[oldKey];
    newOptions[newKey] = value;
    setOptionValues(newOptions);
    onUpdate({ OptionValues: newOptions });
  };

  const updateOptionValue = (key: string, value: string) => {
    const newOptions = { ...optionValues, [key]: value };
    setOptionValues(newOptions);
    onUpdate({ OptionValues: newOptions });
  };

  const removeOption = (key: string) => {
    const newOptions = { ...optionValues };
    delete newOptions[key];
    setOptionValues(newOptions);
    onUpdate({ OptionValues: newOptions });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Configuration SELECT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Propriétés de base */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="select-id">ID</Label>
            <Input
              id="select-id"
              value={field.Id || ""}
              onChange={(e) => onUpdate({ Id: e.target.value })}
              placeholder="MSBTypeInput"
            />
          </div>
          <div>
            <Label htmlFor="select-label">Label</Label>
            <Input
              id="select-label"
              value={field.label || ""}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Type de MSB"
            />
          </div>
        </div>

        {/* Inline */}
        <div className="flex items-center space-x-2">
          <Switch
            id="select-inline"
            checked={field.Inline || false}
            onCheckedChange={(checked) => onUpdate({ Inline: checked })}
          />
          <Label htmlFor="select-inline">Inline</Label>
        </div>

        {/* Width */}
        <div>
          <Label htmlFor="select-width">Width</Label>
          <Input
            id="select-width"
            value={field.Width || ""}
            onChange={(e) => onUpdate({ Width: e.target.value })}
            placeholder="32"
          />
        </div>

        {/* Required */}
        <div className="flex items-center space-x-2">
          <Switch
            id="select-required"
            checked={field.required || false}
            onCheckedChange={(checked) => onUpdate({ required: checked })}
          />
          <Label htmlFor="select-required">Required</Label>
        </div>

        {/* Outlined */}
        <div className="flex items-center space-x-2">
          <Switch
            id="select-outlined"
            checked={field.Outlined || false}
            onCheckedChange={(checked) => onUpdate({ Outlined: checked })}
          />
          <Label htmlFor="select-outlined">Outlined</Label>
        </div>

        {/* UserIntKey */}
        <div>
          <Label htmlFor="select-userintkey">UserIntKey</Label>
          <Input
            id="select-userintkey"
            value={field.UserIntKey || ""}
            onChange={(e) => onUpdate({ UserIntKey: e.target.value })}
            placeholder="User integration key"
          />
        </div>

        {/* OptionValues */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>OptionValues</Label>
            <Button size="sm" onClick={addOption} className="h-8">
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>
          <div className="space-y-2">
            {Object.entries(optionValues).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Input
                  value={key}
                  onChange={(e) => updateOptionKey(key, e.target.value)}
                  placeholder="Clé"
                  className="w-1/3"
                />
                <Input
                  value={value}
                  onChange={(e) => updateOptionValue(key, e.target.value)}
                  placeholder="Valeur"
                  className="w-2/3"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeOption(key)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Spacing */}
        <div>
          <Label htmlFor="select-spacing">Spacing</Label>
          <Input
            id="select-spacing"
            value={field.Spacing || ""}
            onChange={(e) => onUpdate({ Spacing: e.target.value })}
            placeholder="Espacement"
          />
        </div>
      </CardContent>
    </Card>
  );
}