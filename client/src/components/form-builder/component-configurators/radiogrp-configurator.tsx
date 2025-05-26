import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import type { FormField } from "@/lib/form-types";

interface RadiogrpConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function RadiogrpConfigurator({ field, onUpdate }: RadiogrpConfiguratorProps) {
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
        <CardTitle className="text-lg">Configuration RADIOGRP</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Propriétés de base */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="radiogrp-id">ID</Label>
            <Input
              id="radiogrp-id"
              value={field.Id || ""}
              onChange={(e) => onUpdate({ Id: e.target.value })}
              placeholder="ApprovalStatus"
            />
          </div>
          <div>
            <Label htmlFor="radiogrp-label">Label</Label>
            <Input
              id="radiogrp-label"
              value={field.label || ""}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Statut d'approbation"
            />
          </div>
        </div>

        {/* Inline */}
        <div className="flex items-center space-x-2">
          <Switch
            id="radiogrp-inline"
            checked={field.Inline || false}
            onCheckedChange={(checked) => onUpdate({ Inline: checked })}
          />
          <Label htmlFor="radiogrp-inline">Inline</Label>
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
                  placeholder="Clé (ex: Approved)"
                  className="w-1/3"
                />
                <Input
                  value={value}
                  onChange={(e) => updateOptionValue(key, e.target.value)}
                  placeholder="Valeur affichée"
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
          {Object.keys(optionValues).length === 0 && (
            <div className="text-sm text-gray-500 italic">
              Exemples: Approved, Pending, Rejected
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}