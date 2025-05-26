import { FormField } from "@/lib/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";

interface DatePickerConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function DatePickerConfigurator({ field, onUpdate }: DatePickerConfiguratorProps) {
  return (
    <div className="space-y-4">
      <Card className="border-indigo-200 dark:border-indigo-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="w-3 h-3 text-indigo-500" />
            DATEPICKER Properties
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
                placeholder="AccrualDate, StartDate, EndDate"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Label</Label>
              <Input
                value={field.Label || ""}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Accrual Date, Start Date"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* DATEPICKER Specific Properties */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-600">Width</Label>
                <Input
                  value={field.Width || ""}
                  onChange={(e) => onUpdate({ Width: e.target.value })}
                  placeholder="150px"
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

          {/* Date-specific Validations */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">Validations</Label>
            <Input
              value={field.Validations || ""}
              onChange={(e) => onUpdate({ Validations: e.target.value })}
              placeholder="Date range validation"
              className="h-8 text-sm"
            />
            <p className="text-xs text-gray-500">Date format and range validations</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}