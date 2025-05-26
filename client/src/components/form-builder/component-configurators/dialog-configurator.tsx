import { FormField } from "@/lib/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface DialogConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function DialogConfigurator({ field, onUpdate }: DialogConfiguratorProps) {
  return (
    <div className="space-y-4">
      <Card className="border-purple-200 dark:border-purple-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Dialog className="w-3 h-3 text-purple-500" />
            DIALOG Properties
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
                placeholder="SourceDetails"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Label</Label>
              <Input
                value={field.Label || ""}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="REC DETAILS"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* DIALOG Specific Properties */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isGroup"
                checked={field.IsGroup || field.isGroup || false}
                onCheckedChange={(checked) => onUpdate({ IsGroup: !!checked, isGroup: !!checked })}
              />
              <Label htmlFor="isGroup" className="text-xs">isGroup</Label>
            </div>

            <div>
              <Label className="text-xs text-gray-600">Entity</Label>
              <Input
                value={field.Entity || ""}
                onChange={(e) => onUpdate({ Entity: e.target.value })}
                placeholder="Source"
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Entity for dialog data</p>
            </div>

            <div>
              <Label className="text-xs text-gray-600">VisibleWhen</Label>
              <Input
                value={field.VisibleWhen || ""}
                onChange={(e) => onUpdate({ VisibleWhen: e.target.value })}
                placeholder="ShowDialog == true"
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Conditions based on ShowDialog</p>
            </div>

            <div>
              <Label className="text-xs text-gray-600">ChildFields</Label>
              <Input
                value={field.ChildFields || ""}
                onChange={(e) => onUpdate({ ChildFields: e.target.value })}
                placeholder="field1, field2"
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Child components in dialog</p>
            </div>
          </div>

          <Separator />

          {/* Events specific to DIALOG */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">Events</Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-gray-500">onClose</Label>
                <Textarea
                  value={field.Events?.onClose || ""}
                  onChange={(e) => onUpdate({
                    Events: {
                      ...field.Events,
                      onClose: e.target.value
                    }
                  })}
                  placeholder="JavaScript code for dialog close"
                  rows={2}
                  className="text-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">onSubmit</Label>
                <Textarea
                  value={field.Events?.onSubmit || ""}
                  onChange={(e) => onUpdate({
                    Events: {
                      ...field.Events,
                      onSubmit: e.target.value
                    }
                  })}
                  placeholder="JavaScript code for dialog submit"
                  rows={2}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}