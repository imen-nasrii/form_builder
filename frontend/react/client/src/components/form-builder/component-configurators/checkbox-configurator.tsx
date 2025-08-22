import { FormField } from "@/lib/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CheckSquare } from "lucide-react";

interface CheckboxConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function CheckboxConfigurator({ field, onUpdate }: CheckboxConfiguratorProps) {
  return (
    <div className="space-y-4">
      <Card className="border-teal-200 dark:border-teal-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckSquare className="w-3 h-3 text-teal-500" />
            CHECKBOX Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Component ID & Label */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600">Component ID</Label>
              <Input
                value={field.Id || ""}
                onChange={(e) => onUpdate({ Id: e.target.value })}
                placeholder="UpdateRates"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Label</Label>
              <Input
                value={field.Label || ""}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Update Rates"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* CHECKBOX Specific Properties */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-600">Width</Label>
                <Input
                  value={field.Width || ""}
                  onChange={(e) => onUpdate({ Width: e.target.value })}
                  placeholder="auto"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Spacing</Label>
                <Input
                  value={field.Spacing || ""}
                  onChange={(e) => onUpdate({ Spacing: e.target.value })}
                  placeholder="5px"
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-600">CheckboxValue</Label>
              <Input
                value={field.CheckboxValue ? "true" : "false"}
                onChange={(e) => onUpdate({ CheckboxValue: e.target.value === "true" })}
                placeholder="true/false"
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Default checked state</p>
            </div>

            <div>
              <Label className="text-xs text-gray-600">Value</Label>
              <Input
                value={field.Value || ""}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="checked value"
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Value when checked</p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="inline"
                checked={field.Inline || false}
                onCheckedChange={(checked) => onUpdate({ Inline: !!checked })}
              />
              <Label htmlFor="inline" className="text-xs">Inline</Label>
            </div>
          </div>

          <Separator />

          {/* EnabledWhen specific to CHECKBOX */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">EnabledWhen</Label>
            <Input
              value={field.EnabledWhen || ""}
              onChange={(e) => onUpdate({ EnabledWhen: e.target.value })}
              placeholder="Form.isEditMode"
              className="h-8 text-sm"
            />
            <p className="text-xs text-gray-500">When checkbox should be enabled</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}