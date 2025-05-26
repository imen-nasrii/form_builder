import { FormField } from "@/lib/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Folder } from "lucide-react";

interface GroupConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function GroupConfigurator({ field, onUpdate }: GroupConfiguratorProps) {
  return (
    <div className="space-y-4">
      <Card className="border-blue-200 dark:border-blue-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Folder className="w-3 h-3 text-blue-500" />
            GROUP Properties
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
                placeholder="TPROCAGAINST, AccrueTypeGroup, RPTOPTS"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Label</Label>
              <Input
                value={field.Label || ""}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Group Label"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* GROUP Specific Properties */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isGroup"
                checked={field.IsGroup || field.isGroup || false}
                onCheckedChange={(checked) => onUpdate({ IsGroup: !!checked, isGroup: !!checked })}
              />
              <Label htmlFor="isGroup" className="text-xs">IsGroup</Label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-600">Spacing</Label>
                <Input
                  value={field.Spacing || ""}
                  onChange={(e) => onUpdate({ Spacing: e.target.value })}
                  placeholder="10px"
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
              <Label className="text-xs text-gray-600">ChildFields</Label>
              <Input
                value={field.ChildFields || ""}
                onChange={(e) => onUpdate({ ChildFields: e.target.value })}
                placeholder="AccrueType, Spool, Report"
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Child components in group (comma-separated)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}