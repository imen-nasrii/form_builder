import { FormField } from "@/lib/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Database } from "lucide-react";

interface GridLkpConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function GridLkpConfigurator({ field, onUpdate }: GridLkpConfiguratorProps) {
  return (
    <div className="space-y-4">
      <Card className="border-purple-200 dark:border-purple-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-3 h-3 text-purple-500" />
            GRIDLKP Properties
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
                placeholder="FundID, Ticker"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Label</Label>
              <Input
                value={field.Label || ""}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Fund ID, Ticker"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* GRIDLKP Specific Properties */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-600">Width</Label>
                <Input
                  value={field.Width || ""}
                  onChange={(e) => onUpdate({ Width: e.target.value })}
                  placeholder="200px"
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
                placeholder="Name, Ticker"
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Primary display property</p>
            </div>

            <div>
              <Label className="text-xs text-gray-600">LoadDataInfo</Label>
              <Input
                value={field.LoadDataInfo?.DataSource || ""}
                onChange={(e) => onUpdate({ 
                  LoadDataInfo: {
                    ...field.LoadDataInfo,
                    DataSource: e.target.value
                  }
                })}
                placeholder="FundService, TickerService"
                className="h-8 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Data source endpoint</p>
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

          <Separator />

          {/* Validations specific to GRIDLKP */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">Validations</Label>
            <Input
              value={field.Validations || ""}
              onChange={(e) => onUpdate({ Validations: e.target.value })}
              placeholder="Selection required"
              className="h-8 text-sm"
            />
            <p className="text-xs text-gray-500">GRIDLKP validation rules</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}