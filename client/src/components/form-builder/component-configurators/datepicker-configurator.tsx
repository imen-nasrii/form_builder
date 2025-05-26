import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import type { FormField } from "@/lib/form-types";

interface DatePickerConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function DatePickerConfigurator({ field, onUpdate }: DatePickerConfiguratorProps) {
  return (
    <div className="space-y-6">
      {/* Basic Properties */}
      <Card className="border-purple-200 dark:border-purple-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            Propriétés DATEPICKER
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ID</Label>
              <Input 
                value={field.Id || ""} 
                onChange={(e) => onUpdate({ Id: e.target.value })}
                placeholder="ex: AccrualDate"
              />
            </div>
            <div>
              <Label>Label</Label>
              <Input 
                value={field.label || ""} 
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="ex: Date d'accumulation"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Width</Label>
              <Input 
                value={field.Width || ""} 
                onChange={(e) => onUpdate({ Width: e.target.value })}
                placeholder="ex: 200px"
              />
            </div>
            <div>
              <Label>Spacing</Label>
              <Select 
                value={field.Spacing || "md"} 
                onValueChange={(value) => onUpdate({ Spacing: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={field.Inline || false}
                onCheckedChange={(checked) => onUpdate({ Inline: checked })}
              />
              <Label>Inline</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={field.required || false}
                onCheckedChange={(checked) => onUpdate({ required: checked })}
              />
              <Label>Required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={field.Outlined !== false}
                onCheckedChange={(checked) => onUpdate({ Outlined: checked })}
              />
              <Label>Outlined</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Configuration */}
      <Card className="border-blue-200 dark:border-blue-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-blue-700 dark:text-blue-300">
            Configuration de date
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date minimum</Label>
              <Input 
                type="date"
                value={field.Value?.minDate || ""} 
                onChange={(e) => onUpdate({ 
                  Value: { 
                    ...field.Value, 
                    minDate: e.target.value 
                  } 
                })}
              />
            </div>
            <div>
              <Label>Date maximum</Label>
              <Input 
                type="date"
                value={field.Value?.maxDate || ""} 
                onChange={(e) => onUpdate({ 
                  Value: { 
                    ...field.Value, 
                    maxDate: e.target.value 
                  } 
                })}
              />
            </div>
          </div>

          <div>
            <Label>Format d'affichage</Label>
            <Select 
              value={field.Value?.format || "dd/MM/yyyy"} 
              onValueChange={(value) => onUpdate({ 
                Value: { 
                  ...field.Value, 
                  format: value 
                } 
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                <SelectItem value="dd-MM-yyyy">DD-MM-YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              checked={field.Value?.showTime || false}
              onCheckedChange={(checked) => onUpdate({ 
                Value: { 
                  ...field.Value, 
                  showTime: checked 
                } 
              })}
            />
            <Label>Inclure l'heure</Label>
          </div>
        </CardContent>
      </Card>

      {/* Validation Rules */}
      <Card className="border-red-200 dark:border-red-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-red-700 dark:text-red-300">
            Règles de validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={field.Value?.validateBusinessDay || false}
              onCheckedChange={(checked) => onUpdate({ 
                Value: { 
                  ...field.Value, 
                  validateBusinessDay: checked 
                } 
              })}
            />
            <Label>Jour ouvrable uniquement</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              checked={field.Value?.validateFutureDate || false}
              onCheckedChange={(checked) => onUpdate({ 
                Value: { 
                  ...field.Value, 
                  validateFutureDate: checked 
                } 
              })}
            />
            <Label>Date future uniquement</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              checked={field.Value?.validatePastDate || false}
              onCheckedChange={(checked) => onUpdate({ 
                Value: { 
                  ...field.Value, 
                  validatePastDate: checked 
                } 
              })}
            />
            <Label>Date passée uniquement</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}