import { FormField } from "@/lib/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

interface TextareaConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function TextareaConfigurator({ field, onUpdate }: TextareaConfiguratorProps) {
  return (
    <div className="space-y-4">
      <Card className="border-amber-200 dark:border-amber-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="w-3 h-3 text-amber-500" />
            TEXTAREA Properties
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
                placeholder="Comments"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Label</Label>
              <Input
                value={field.Label || ""}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Comments"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* TEXTAREA Specific Properties */}
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
              <div>
                <Label className="text-xs text-gray-600">Rows</Label>
                <Input
                  value={field.Rows || ""}
                  onChange={(e) => onUpdate({ Rows: parseInt(e.target.value) || 3 })}
                  placeholder="3"
                  type="number"
                  className="h-8 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Number of visible rows</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
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

            <div>
              <Label className="text-xs text-gray-600">Placeholder</Label>
              <Input
                value={field.placeholder || ""}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Enter comments..."
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Placeholder text for empty textarea</p>
            </div>
          </div>

          <Separator />

          {/* Character limits for TEXTAREA */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-600">Min Length</Label>
                <Input
                  value={field.minLength || ""}
                  onChange={(e) => onUpdate({ minLength: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  type="number"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Max Length</Label>
                <Input
                  value={field.maxLength || ""}
                  onChange={(e) => onUpdate({ maxLength: parseInt(e.target.value) || 1000 })}
                  placeholder="1000"
                  type="number"
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">Character limits for validation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}