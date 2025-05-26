import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { FormField } from "@/lib/form-types";

interface CheckboxConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function CheckboxConfigurator({ field, onUpdate }: CheckboxConfiguratorProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Configuration CHECKBOX</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Propriétés de base */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkbox-id">ID</Label>
            <Input
              id="checkbox-id"
              value={field.Id || ""}
              onChange={(e) => onUpdate({ Id: e.target.value })}
              placeholder="UpdateRates"
            />
          </div>
          <div>
            <Label htmlFor="checkbox-label">Label</Label>
            <Input
              id="checkbox-label"
              value={field.label || ""}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Mettre à jour les taux"
            />
          </div>
        </div>

        {/* Inline */}
        <div className="flex items-center space-x-2">
          <Switch
            id="checkbox-inline"
            checked={field.Inline || false}
            onCheckedChange={(checked) => onUpdate({ Inline: checked })}
          />
          <Label htmlFor="checkbox-inline">Inline</Label>
        </div>

        {/* Width */}
        <div>
          <Label htmlFor="checkbox-width">Width</Label>
          <Input
            id="checkbox-width"
            value={field.Width || ""}
            onChange={(e) => onUpdate({ Width: e.target.value })}
            placeholder="32"
          />
        </div>

        {/* CheckboxValue */}
        <div className="flex items-center space-x-2">
          <Switch
            id="checkbox-value"
            checked={field.CheckboxValue || false}
            onCheckedChange={(checked) => onUpdate({ CheckboxValue: checked })}
          />
          <Label htmlFor="checkbox-value">CheckboxValue (Valeur par défaut)</Label>
        </div>

        {/* Spacing */}
        <div>
          <Label htmlFor="checkbox-spacing">Spacing</Label>
          <Input
            id="checkbox-spacing"
            value={field.Spacing || ""}
            onChange={(e) => onUpdate({ Spacing: e.target.value })}
            placeholder="Espacement"
          />
        </div>

        {/* Value */}
        <div>
          <Label htmlFor="checkbox-val">Value</Label>
          <Input
            id="checkbox-val"
            value={field.Value || ""}
            onChange={(e) => onUpdate({ Value: e.target.value })}
            placeholder="Valeur du composant"
          />
        </div>

        {/* EnabledWhen */}
        <div>
          <Label htmlFor="checkbox-enabledwhen">EnabledWhen</Label>
          <Input
            id="checkbox-enabledwhen"
            value={field.EnabledWhen || ""}
            onChange={(e) => onUpdate({ EnabledWhen: e.target.value })}
            placeholder="Conditions d'activation"
          />
        </div>
      </CardContent>
    </Card>
  );
}