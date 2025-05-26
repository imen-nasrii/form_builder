import { FormField } from "@/lib/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface TextAreaConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function TextAreaConfigurator({ field, onUpdate }: TextAreaConfiguratorProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            Configuration TEXTAREA
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
                placeholder="Ex: Comments"
              />
            </div>
            <div>
              <Label>Label</Label>
              <Input
                value={field.label || ""}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Ex: Commentaires"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Width</Label>
              <Input
                value={field.Width || ""}
                onChange={(e) => onUpdate({ Width: e.target.value })}
                placeholder="Ex: 100%"
              />
            </div>
            <div>
              <Label>Rows</Label>
              <Input
                type="number"
                value={field.Rows || "3"}
                onChange={(e) => onUpdate({ Rows: parseInt(e.target.value) || 3 })}
                placeholder="3"
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

          {/* Default Value */}
          <div>
            <Label>Valeur par défaut</Label>
            <textarea
              rows={3}
              value={field.Value || ""}
              onChange={(e) => onUpdate({ Value: e.target.value })}
              placeholder="Texte par défaut..."
              className="w-full px-3 py-2 border rounded-md resize-vertical"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}