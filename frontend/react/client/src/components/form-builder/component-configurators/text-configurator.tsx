import { FormField } from "@/lib/form-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface TextConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function TextConfigurator({ field, onUpdate }: TextConfiguratorProps) {
  return (
    <div className="space-y-4">
      <Card className="border-green-200 dark:border-green-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            TEXT Properties
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
                placeholder="psource, descr"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Label</Label>
              <Input
                value={field.Label || field.label || ""}
                onChange={(e) => onUpdate({ Label: e.target.value, label: e.target.value })}
                placeholder="Field Label"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* TEXT Specific Properties from PDF */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600">DataField</Label>
              <Input
                value={field.DataField || ""}
                onChange={(e) => onUpdate({ DataField: e.target.value })}
                placeholder="pSource, descr"
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Database field binding</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-600">Width</Label>
                <Input
                  value={field.Width || ""}
                  onChange={(e) => onUpdate({ Width: e.target.value })}
                  placeholder="200px"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Spacing</Label>
                <Input
                  value={field.Spacing || ""}
                  onChange={(e) => onUpdate({ Spacing: e.target.value })}
                  placeholder="10px"
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inline"
                  checked={field.Inline || false}
                  onCheckedChange={(checked) => onUpdate({ Inline: !!checked })}
                />
                <Label htmlFor="inline" className="text-xs">Inline</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="required"
                  checked={field.Required || false}
                  onCheckedChange={(checked) => onUpdate({ Required: !!checked })}
                />
                <Label htmlFor="required" className="text-xs">Required</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* EnabledWhen Conditions */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">EnabledWhen</Label>
            <Input
              value={field.EnabledWhen || ""}
              onChange={(e) => onUpdate({ EnabledWhen: e.target.value })}
              placeholder="Mode == 'Edit'"
              className="h-8 text-sm"
            />
            <p className="text-xs text-gray-500">Conditions based on Mode</p>
          </div>

          <Separator />

          {/* Validations */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">Validations</Label>
            <Input
              value={field.Validations || ""}
              onChange={(e) => onUpdate({ Validations: e.target.value })}
              placeholder="Required validation"
              className="h-8 text-sm"
            />
            <p className="text-xs text-gray-500">Non-empty validation based on Mode</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}