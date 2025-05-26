import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { FormField } from "@/lib/form-types";

interface FileuploadConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function FileuploadConfigurator({ field, onUpdate }: FileuploadConfiguratorProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Configuration FILEUPLOAD</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Propriétés de base */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fileupload-id">ID</Label>
            <Input
              id="fileupload-id"
              value={field.Id || ""}
              onChange={(e) => onUpdate({ Id: e.target.value })}
              placeholder="Attachments"
            />
          </div>
          <div>
            <Label htmlFor="fileupload-label">Label</Label>
            <Input
              id="fileupload-label"
              value={field.label || ""}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Attachments"
            />
          </div>
        </div>

        {/* Inline */}
        <div className="flex items-center space-x-2">
          <Switch
            id="fileupload-inline"
            checked={field.Inline || false}
            onCheckedChange={(checked) => onUpdate({ Inline: checked })}
          />
          <Label htmlFor="fileupload-inline">Inline</Label>
        </div>

        {/* Width */}
        <div>
          <Label htmlFor="fileupload-width">Width</Label>
          <Input
            id="fileupload-width"
            value={field.Width || ""}
            onChange={(e) => onUpdate({ Width: e.target.value })}
            placeholder="32"
          />
        </div>

        {/* Required */}
        <div className="flex items-center space-x-2">
          <Switch
            id="fileupload-required"
            checked={field.required || false}
            onCheckedChange={(checked) => onUpdate({ required: checked })}
          />
          <Label htmlFor="fileupload-required">Required</Label>
        </div>

        {/* AcceptedTypes */}
        <div>
          <Label htmlFor="fileupload-acceptedtypes">Types de fichiers acceptés</Label>
          <Input
            id="fileupload-acceptedtypes"
            value={field.AcceptedTypes || ""}
            onChange={(e) => onUpdate({ AcceptedTypes: e.target.value })}
            placeholder=".pdf,.doc,.docx,.jpg,.png"
          />
        </div>

        {/* MaxSize */}
        <div>
          <Label htmlFor="fileupload-maxsize">Taille maximale</Label>
          <Input
            id="fileupload-maxsize"
            value={field.MaxSize || ""}
            onChange={(e) => onUpdate({ MaxSize: e.target.value })}
            placeholder="10MB"
          />
        </div>

        {/* Value */}
        <div>
          <Label htmlFor="fileupload-value">Value</Label>
          <Input
            id="fileupload-value"
            value={field.Value || ""}
            onChange={(e) => onUpdate({ Value: e.target.value })}
            placeholder="Valeur par défaut"
          />
        </div>
      </CardContent>
    </Card>
  );
}