import { FormField } from "@/lib/form-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface GridConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function GridConfigurator({ field, onUpdate }: GridConfiguratorProps) {
  const [newAction, setNewAction] = useState("");
  const [newColumn, setNewColumn] = useState({ DataField: "", Caption: "", DataType: "TEXT" });

  const addRecordAction = () => {
    if (!newAction.trim()) return;
    const currentActions = field.LoadDataInfo?.RecordActions || [];
    onUpdate({
      LoadDataInfo: {
        ...field.LoadDataInfo,
        RecordActions: [...currentActions, newAction.trim()]
      }
    });
    setNewAction("");
  };

  const removeRecordAction = (index: number) => {
    const currentActions = field.LoadDataInfo?.RecordActions || [];
    onUpdate({
      LoadDataInfo: {
        ...field.LoadDataInfo,
        RecordActions: currentActions.filter((_, i) => i !== index)
      }
    });
  };

  const addColumn = () => {
    if (!newColumn.DataField.trim() || !newColumn.Caption.trim()) return;
    const currentColumns = field.LoadDataInfo?.ColumnsDefinition || [];
    onUpdate({
      LoadDataInfo: {
        ...field.LoadDataInfo,
        ColumnsDefinition: [...currentColumns, { ...newColumn }]
      }
    });
    setNewColumn({ DataField: "", Caption: "", DataType: "TEXT" });
  };

  const removeColumn = (index: number) => {
    const currentColumns = field.LoadDataInfo?.ColumnsDefinition || [];
    onUpdate({
      LoadDataInfo: {
        ...field.LoadDataInfo,
        ColumnsDefinition: currentColumns.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            Configuration GRID
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Properties */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ID du composant</Label>
              <Input
                value={field.Id || ""}
                onChange={(e) => onUpdate({ Id: e.target.value })}
                placeholder="Ex: SourceGrid"
              />
            </div>
            <div>
              <Label>Label</Label>
              <Input
                value={field.label || ""}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Ex: Liste des sources"
              />
            </div>
          </div>

          <Separator />

          {/* Record Actions */}
          <div>
            <Label className="text-sm font-medium">Actions d'enregistrement</Label>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="Ex: Edit, Copy, Delete"
                  className="flex-1"
                />
                <Button onClick={addRecordAction} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(field.LoadDataInfo?.RecordActions || []).map((action, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {action}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeRecordAction(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Column Definitions */}
          <div>
            <Label className="text-sm font-medium">Définitions des colonnes</Label>
            <div className="mt-2 space-y-3">
              <div className="grid grid-cols-4 gap-2">
                <Input
                  value={newColumn.DataField}
                  onChange={(e) => setNewColumn({ ...newColumn, DataField: e.target.value })}
                  placeholder="DataField"
                />
                <Input
                  value={newColumn.Caption}
                  onChange={(e) => setNewColumn({ ...newColumn, Caption: e.target.value })}
                  placeholder="Caption"
                />
                <select
                  value={newColumn.DataType}
                  onChange={(e) => setNewColumn({ ...newColumn, DataType: e.target.value })}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="TEXT">TEXT</option>
                  <option value="NUMBER">NUMBER</option>
                  <option value="DATE">DATE</option>
                  <option value="BOOLEAN">BOOLEAN</option>
                </select>
                <Button onClick={addColumn} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {(field.LoadDataInfo?.ColumnsDefinition || []).map((column, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="font-mono text-sm">{column.DataField}</span>
                    <span className="text-sm text-gray-600">→</span>
                    <span className="text-sm">{column.Caption}</span>
                    <Badge variant="outline" className="text-xs">{column.DataType}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeColumn(index)}
                      className="ml-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Source Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Endpoint</Label>
              <Input
                value={field.LoadDataInfo?.DataSource || ""}
                onChange={(e) => onUpdate({
                  LoadDataInfo: {
                    ...field.LoadDataInfo,
                    DataSource: e.target.value
                  }
                })}
                placeholder="Ex: AllSources"
              />
            </div>
            <div>
              <Label>Entity</Label>
              <Input
                value={field.LoadDataInfo?.DataModel || ""}
                onChange={(e) => onUpdate({
                  LoadDataInfo: {
                    ...field.LoadDataInfo,
                    DataModel: e.target.value
                  }
                })}
                placeholder="Ex: Source"
              />
            </div>
          </div>

          <div>
            <Label>EntityKeyField</Label>
            <Input
              value={field.KeyColumn || ""}
              onChange={(e) => onUpdate({ KeyColumn: e.target.value })}
              placeholder="Ex: pSource"
            />
          </div>

          <Separator />

          {/* Events */}
          <div>
            <Label>Événements</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">onClickRow:</span>
                <Input
                  value={field.Events?.onClickRow || ""}
                  onChange={(e) => onUpdate({
                    Events: {
                      ...field.Events,
                      onClickRow: e.target.value
                    }
                  })}
                  placeholder="Fonction à exécuter"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}