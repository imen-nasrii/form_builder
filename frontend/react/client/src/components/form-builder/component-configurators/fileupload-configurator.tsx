import { FormField } from "@/lib/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Upload } from "lucide-react";

interface FileuploadConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function FileuploadConfigurator({ field, onUpdate }: FileuploadConfiguratorProps) {
  return (
    <div className="space-y-4">
      <Card className="border-pink-200 dark:border-pink-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Upload className="w-3 h-3 text-pink-500" />
            FILEUPLOAD Properties
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
                placeholder="Attachments"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Label</Label>
              <Input
                value={field.Label || ""}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Attachments"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* FILEUPLOAD Specific Properties */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-600">Width</Label>
                <Input
                  value={field.Width || ""}
                  onChange={(e) => onUpdate({ Width: e.target.value })}
                  placeholder="300px"
                  className="h-8 text-sm"
                />
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={field.Required || false}
                onCheckedChange={(checked) => onUpdate({ Required: !!checked })}
              />
              <Label htmlFor="required" className="text-xs">Required</Label>
            </div>

            <div>
              <Label className="text-xs text-gray-600">Accepted File Types</Label>
              <Input
                value={field.AcceptedTypes || ""}
                onChange={(e) => onUpdate({ AcceptedTypes: e.target.value })}
                placeholder="pdf,doc,docx,jpg,png"
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated file extensions</p>
            </div>

            <div>
              <Label className="text-xs text-gray-600">Max File Size (MB)</Label>
              <Input
                value={field.MaxFileSize || ""}
                onChange={(e) => onUpdate({ MaxFileSize: e.target.value })}
                placeholder="10"
                type="number"
                className="h-8 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}