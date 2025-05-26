import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Database } from "lucide-react";
import type { FormField } from "@/lib/form-types";

interface GRIDLKPConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function GRIDLKPConfigurator({ field, onUpdate }: GRIDLKPConfiguratorProps) {
  const [newColumn, setNewColumn] = useState({
    DataField: "",
    Caption: "",
    DataType: "STRING",
    Visible: true
  });

  const addColumn = () => {
    if (!newColumn.DataField || !newColumn.Caption) return;
    
    const currentColumns = field.LoadDataInfo?.ColumnsDefinition || [];
    const updatedColumns = [...currentColumns, { ...newColumn }];
    
    onUpdate({
      LoadDataInfo: {
        ...field.LoadDataInfo,
        ColumnsDefinition: updatedColumns
      }
    });
    
    setNewColumn({
      DataField: "",
      Caption: "",
      DataType: "STRING", 
      Visible: true
    });
  };

  const removeColumn = (index: number) => {
    const currentColumns = field.LoadDataInfo?.ColumnsDefinition || [];
    const updatedColumns = currentColumns.filter((_, i) => i !== index);
    
    onUpdate({
      LoadDataInfo: {
        ...field.LoadDataInfo,
        ColumnsDefinition: updatedColumns
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Properties */}
      <Card className="border-blue-200 dark:border-blue-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" />
            Propriétés GRIDLKP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ID</Label>
              <Input 
                value={field.Id || ""} 
                onChange={(e) => onUpdate({ Id: e.target.value })}
                placeholder="ex: FundID"
              />
            </div>
            <div>
              <Label>Label</Label>
              <Input 
                value={field.label || ""} 
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="ex: Fund Selection"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Width</Label>
              <Input 
                value={field.Width || ""} 
                onChange={(e) => onUpdate({ Width: e.target.value })}
                placeholder="ex: 300px"
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
            <div>
              <Label>Key Column</Label>
              <Input 
                value={field.KeyColumn || ""} 
                onChange={(e) => onUpdate({ KeyColumn: e.target.value })}
                placeholder="ex: ID"
              />
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

      {/* Item Display Configuration */}
      <Card className="border-green-200 dark:border-green-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-green-700 dark:text-green-300">
            Configuration d'affichage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Main Property</Label>
              <Input 
                value={field.ItemInfo?.MainProperty || ""} 
                onChange={(e) => onUpdate({ 
                  ItemInfo: { 
                    ...field.ItemInfo, 
                    MainProperty: e.target.value 
                  } 
                })}
                placeholder="ex: Name"
              />
            </div>
            <div>
              <Label>Desc Property</Label>
              <Input 
                value={field.ItemInfo?.DescProperty || ""} 
                onChange={(e) => onUpdate({ 
                  ItemInfo: { 
                    ...field.ItemInfo, 
                    DescProperty: e.target.value 
                  } 
                })}
                placeholder="ex: Description"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              checked={field.ItemInfo?.ShowDescription !== false}
              onCheckedChange={(checked) => onUpdate({ 
                ItemInfo: { 
                  ...field.ItemInfo, 
                  ShowDescription: checked 
                } 
              })}
            />
            <Label>Show Description</Label>
          </div>
        </CardContent>
      </Card>

      {/* Data Source Configuration */}
      <Card className="border-purple-200 dark:border-purple-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-purple-700 dark:text-purple-300">
            Source de données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data Model</Label>
              <Input 
                value={field.LoadDataInfo?.DataModel || ""} 
                onChange={(e) => onUpdate({ 
                  LoadDataInfo: { 
                    ...field.LoadDataInfo, 
                    DataModel: e.target.value 
                  } 
                })}
                placeholder="ex: EntityModel"
              />
            </div>
            <div>
              <Label>Data Source</Label>
              <Input 
                value={field.LoadDataInfo?.DataSource || ""} 
                onChange={(e) => onUpdate({ 
                  LoadDataInfo: { 
                    ...field.LoadDataInfo, 
                    DataSource: e.target.value 
                  } 
                })}
                placeholder="ex: API Endpoint"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              checked={field.LoadDataInfo?.RealTime || false}
              onCheckedChange={(checked) => onUpdate({ 
                LoadDataInfo: { 
                  ...field.LoadDataInfo, 
                  RealTime: checked 
                } 
              })}
            />
            <Label>Real Time</Label>
          </div>
        </CardContent>
      </Card>

      {/* Column Definitions */}
      <Card className="border-orange-200 dark:border-orange-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-orange-700 dark:text-orange-300">
            Définition des colonnes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Column */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
            <Label className="text-sm font-medium">Ajouter une colonne</Label>
            <div className="grid grid-cols-4 gap-2">
              <Input 
                placeholder="DataField"
                value={newColumn.DataField}
                onChange={(e) => setNewColumn(prev => ({ ...prev, DataField: e.target.value }))}
              />
              <Input 
                placeholder="Caption"
                value={newColumn.Caption}
                onChange={(e) => setNewColumn(prev => ({ ...prev, Caption: e.target.value }))}
              />
              <Select 
                value={newColumn.DataType} 
                onValueChange={(value) => setNewColumn(prev => ({ ...prev, DataType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STRING">STRING</SelectItem>
                  <SelectItem value="INTEGER">INTEGER</SelectItem>
                  <SelectItem value="DECIMAL">DECIMAL</SelectItem>
                  <SelectItem value="DATE">DATE</SelectItem>
                  <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addColumn} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Existing Columns */}
          <div className="space-y-2">
            {field.LoadDataInfo?.ColumnsDefinition?.map((column, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border rounded-lg">
                <Badge variant="secondary">{column.DataField}</Badge>
                <span className="text-sm">{column.Caption}</span>
                <Badge variant="outline">{column.DataType}</Badge>
                {column.Visible && <Badge className="bg-green-100 text-green-800">Visible</Badge>}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeColumn(index)}
                  className="ml-auto"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}