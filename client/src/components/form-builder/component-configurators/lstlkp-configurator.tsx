import { FormField } from "@/lib/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { List } from "lucide-react";

interface LstLkpConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function LstLkpConfigurator({ field, onUpdate }: LstLkpConfiguratorProps) {
  return (
    <div className="space-y-4">
      <Card className="border-green-200 dark:border-green-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <List className="w-3 h-3 text-green-500" />
            LSTLKP Properties
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
                placeholder="SecCat, SecGrp, Department"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Label</Label>
              <Input
                value={field.Label || ""}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Security Category, Department"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* LSTLKP Specific Properties */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-600">Width</Label>
                <Input
                  value={field.Width || ""}
                  onChange={(e) => onUpdate({ Width: e.target.value })}
                  placeholder="180px"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">KeyColumn</Label>
                <Input
                  value={field.KeyColumn || ""}
                  onChange={(e) => onUpdate({ KeyColumn: e.target.value })}
                  placeholder="Id, Code"
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-600">MainProperty</Label>
              <Input
                value={field.ItemInfo?.MainProperty || ""}
                onChange={(e) => onUpdate({ 
                  ItemInfo: {
                    ...field.ItemInfo,
                    MainProperty: e.target.value
                  }
                })}
                placeholder="Name, Description"
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Primary display property</p>
            </div>

            <div>
              <Label className="text-xs text-gray-600">LoadDataInfo</Label>
              <Input
                value={field.LoadDataInfo?.DataModel || ""}
                onChange={(e) => onUpdate({ 
                  LoadDataInfo: {
                    ...field.LoadDataInfo,
                    DataModel: e.target.value
                  }
                })}
                placeholder="DataModel, Service"
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Data source configuration</p>
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
        </CardContent>
      </Card>
    </div>
  );
}