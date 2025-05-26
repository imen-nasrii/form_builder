import { FormField } from "@/lib/form-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface TextConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function TextConfigurator({ field, onUpdate }: TextConfiguratorProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            Configuration TEXT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Properties */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ID du composant</Label>
              <Input
                value={field.Id || ""}
                onChange={(e) => onUpdate({ Id: e.target.value })}
                placeholder="Ex: psource"
              />
            </div>
            <div>
              <Label>Label</Label>
              <Input
                value={field.label || ""}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Ex: Source"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>DataField</Label>
              <Input
                value={field.LoadDataInfo?.DataField || ""}
                onChange={(e) => onUpdate({
                  LoadDataInfo: {
                    ...field.LoadDataInfo,
                    DataField: e.target.value
                  }
                })}
                placeholder="Ex: pSource"
              />
            </div>
            <div>
              <Label>Width</Label>
              <Input
                value={field.Width || ""}
                onChange={(e) => onUpdate({ Width: e.target.value })}
                placeholder="Ex: 200px"
              />
            </div>
          </div>

          <Separator />

          {/* Layout Properties */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inline"
                checked={field.Inline || false}
                onCheckedChange={(checked) => onUpdate({ Inline: !!checked })}
              />
              <Label htmlFor="inline">Inline</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={field.required || false}
                onCheckedChange={(checked) => onUpdate({ required: !!checked })}
              />
              <Label htmlFor="required">Requis</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="outlined"
                checked={field.Outlined || false}
                onCheckedChange={(checked) => onUpdate({ Outlined: !!checked })}
              />
              <Label htmlFor="outlined">Outlined</Label>
            </div>
          </div>

          <Separator />

          {/* Conditional Logic */}
          <div>
            <Label>EnabledWhen (Condition)</Label>
            <Input
              value={field.EnabledWhen?.Conditions?.[0]?.RightField || ""}
              onChange={(e) => onUpdate({
                EnabledWhen: {
                  Conditions: [{
                    RightField: e.target.value,
                    Operator: "EQUALS",
                    Value: "Mode"
                  }]
                }
              })}
              placeholder="Ex: Mode"
            />
            <p className="text-xs text-gray-500 mt-1">
              Conditions basées sur le mode ou autres champs
            </p>
          </div>

          <Separator />

          {/* Validations */}
          <div>
            <Label>Validations</Label>
            <div className="mt-2 space-y-2">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm font-medium mb-2">Validation de non-vide</div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={field.Validations?.[0]?.Type || "ERROR"}
                    onChange={(e) => onUpdate({
                      Validations: [{
                        Id: "required-validation",
                        Type: e.target.value as "ERROR" | "WARNING",
                        ConditionExpression: {
                          Conditions: [{
                            RightField: field.Id || "",
                            Operator: "IS_NOT_EMPTY",
                            Value: ""
                          }]
                        }
                      }]
                    })}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="ERROR">ERROR</option>
                    <option value="WARNING">WARNING</option>
                  </select>
                  <Input
                    placeholder="Message d'erreur"
                    value={field.Validations?.[0]?.Message || ""}
                    onChange={(e) => onUpdate({
                      Validations: [{
                        ...field.Validations?.[0],
                        Message: e.target.value
                      }]
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}