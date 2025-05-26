import { FormField } from "@/lib/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Radio } from "lucide-react";

interface RadiogrpConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function RadiogrpConfigurator({ field, onUpdate }: RadiogrpConfiguratorProps) {
  return (
    <div className="space-y-4">
      <Card className="border-orange-200 dark:border-orange-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Radio className="w-3 h-3 text-orange-500" />
            RADIOGRP Properties
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
                placeholder="ApprovalStatus"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Label</Label>
              <Input
                value={field.Label || ""}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Approval Status"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* RADIOGRP Specific Properties */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inline"
                checked={field.Inline || false}
                onCheckedChange={(checked) => onUpdate({ Inline: !!checked })}
              />
              <Label htmlFor="inline" className="text-xs">Inline</Label>
            </div>

            <div>
              <Label className="text-xs text-gray-600">OptionValues</Label>
              <Textarea
                value={field.OptionValues?.join('\n') || ""}
                onChange={(e) => onUpdate({ 
                  OptionValues: e.target.value.split('\n').filter(v => v.trim())
                })}
                placeholder="Approved&#10;Pending&#10;Rejected"
                rows={4}
                className="text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">One option per line (e.g., Approved, Pending, Rejected)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}