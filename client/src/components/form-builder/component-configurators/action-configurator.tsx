import { FormField } from "@/lib/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Play } from "lucide-react";

interface ActionConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function ActionConfigurator({ field, onUpdate }: ActionConfiguratorProps) {
  return (
    <div className="space-y-4">
      <Card className="border-red-200 dark:border-red-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Play className="w-3 h-3 text-red-500" />
            ACTION Properties
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
                placeholder="Actions"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Label</Label>
              <Input
                value={field.Label || ""}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Action Button"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* ACTION Specific Properties */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600">MethodToInvoke</Label>
              <Input
                value={field.MethodToInvoke || ""}
                onChange={(e) => onUpdate({ MethodToInvoke: e.target.value })}
                placeholder="ExecuteAction, SaveForm, ValidateData"
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Method or function to call when action is triggered</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}