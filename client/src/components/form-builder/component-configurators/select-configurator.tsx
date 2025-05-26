import { FormField } from "@/lib/form-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, X, List } from "lucide-react";
import { useState } from "react";

interface SelectConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function SelectConfigurator({ field, onUpdate }: SelectConfiguratorProps) {
  const [newOptionKey, setNewOptionKey] = useState("");
  const [newOptionValue, setNewOptionValue] = useState("");

  const addOption = () => {
    if (!newOptionKey.trim() || !newOptionValue.trim()) return;
    const currentOptions = field.OptionValues || {};
    onUpdate({
      OptionValues: {
        ...currentOptions,
        [newOptionKey.trim()]: newOptionValue.trim()
      }
    });
    setNewOptionKey("");
    setNewOptionValue("");
  };

  const removeOption = (key: string) => {
    const currentOptions = field.OptionValues || {};
    const { [key]: removed, ...rest } = currentOptions;
    onUpdate({ OptionValues: rest });
  };

  return (
    <div className="space-y-4">
      <Card className="border-orange-200 dark:border-orange-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <List className="w-3 h-3 text-orange-500" />
            SELECT Properties
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
                placeholder="Status, Priority"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Label</Label>
              <Input
                value={field.Label || field.label || ""}
                onChange={(e) => onUpdate({ Label: e.target.value, label: e.target.value })}
                placeholder="Field Label"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* SELECT Specific Properties */}
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

            <div className="grid grid-cols-3 gap-2">
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="outlined"
                  checked={field.Outlined || false}
                  onCheckedChange={(checked) => onUpdate({ Outlined: !!checked })}
                />
                <Label htmlFor="outlined" className="text-xs">Outlined</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* OptionValues */}
          <div className="space-y-3">
            <Label className="text-xs text-gray-600">OptionValues</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={newOptionKey}
                onChange={(e) => setNewOptionKey(e.target.value)}
                placeholder="Key (Active)"
                className="h-8 text-sm"
              />
              <div className="flex gap-1">
                <Input
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  placeholder="Value (Active)"
                  className="h-8 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addOption()}
                />
                <Button onClick={addOption} size="sm" className="h-8 w-8 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {Object.entries(field.OptionValues || {}).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs flex items-center gap-1">
                  {key}: {value}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(key)}
                    className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-2 h-2" />
                  </Button>
                </Badge>
              ))}
            </div>
            
            <div className="text-xs text-gray-500">
              <p>Status: Active, Inactive, Pending</p>
              <p>Priority: High, Medium, Low</p>
            </div>
          </div>

          <Separator />

          {/* Additional Properties */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="userIntKey"
              checked={field.UserIntKey || false}
              onCheckedChange={(checked) => onUpdate({ UserIntKey: !!checked })}
            />
            <Label htmlFor="userIntKey" className="text-xs">UserIntKey</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}