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
              <Label>Component ID</Label>
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

          {/* PDF Documentation Properties */}
          <Separator />
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">PDF Properties</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>DataField</Label>
                <Input
                  value={field.DataField || ""}
                  onChange={(e) => onUpdate({ DataField: e.target.value })}
                  placeholder="Ex: pSource"
                />
              </div>
              <div>
                <Label>Entity</Label>
                <Input
                  value={field.Entity || ""}
                  onChange={(e) => onUpdate({ Entity: e.target.value })}
                  placeholder="Ex: Source"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width</Label>
                <Input
                  value={field.Width || ""}
                  onChange={(e) => onUpdate({ Width: e.target.value })}
                  placeholder="Ex: 200px"
                />
              </div>
              <div>
                <Label>Spacing</Label>
                <Input
                  value={field.Spacing || ""}
                  onChange={(e) => onUpdate({ Spacing: e.target.value })}
                  placeholder="Ex: 10px"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
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
                  checked={field.Required || false}
                  onCheckedChange={(checked) => onUpdate({ Required: !!checked })}
                />
                <Label htmlFor="required">Required</Label>
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

            <div>
              <Label>Default Value</Label>
              <Input
                value={field.Value || ""}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="Default text value"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}