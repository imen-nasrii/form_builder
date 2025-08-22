import { FormField } from "@/lib/form-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Grid3X3 } from "lucide-react";
import { useState } from "react";

interface GridConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function GridConfigurator({ field, onUpdate }: GridConfiguratorProps) {
  const [newAction, setNewAction] = useState("");
  const [newColumn, setNewColumn] = useState("");

  const addRecordAction = () => {
    if (!newAction.trim()) return;
    const currentActions = field.RecordActions || [];
    onUpdate({
      RecordActions: [...currentActions, newAction.trim()]
    });
    setNewAction("");
  };

  const removeRecordAction = (index: number) => {
    const currentActions = field.RecordActions || [];
    onUpdate({
      RecordActions: currentActions.filter((_, i) => i !== index)
    });
  };

  const addColumn = () => {
    if (!newColumn.trim()) return;
    const currentColumns = field.ColumnDefinitions || [];
    onUpdate({
      ColumnDefinitions: [...currentColumns, newColumn.trim()]
    });
    setNewColumn("");
  };

  const removeColumn = (index: number) => {
    const currentColumns = field.ColumnDefinitions || [];
    onUpdate({
      ColumnDefinitions: currentColumns.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 dark:border-blue-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-blue-600" />
            GRID Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Properties */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Component ID</Label>
              <Input
                value={field.Id || ""}
                onChange={(e) => onUpdate({ Id: e.target.value })}
                placeholder="Ex: SourceGrid"
              />
            </div>
            <div>
              <Label>Label</Label>
              <Input
                value={field.Label || ""}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Ex: Grid Label"
              />
            </div>
          </div>

          <Separator />

          {/* Entity & Endpoint Properties */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Entity & Data Source</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Entity</Label>
                <Input
                  value={field.Entity || ""}
                  onChange={(e) => onUpdate({ Entity: e.target.value })}
                  placeholder="Ex: Source"
                />
              </div>
              <div>
                <Label>EntityKeyField</Label>
                <Input
                  value={field.EntityKeyField || ""}
                  onChange={(e) => onUpdate({ EntityKeyField: e.target.value })}
                  placeholder="Ex: pSource"
                />
              </div>
            </div>
            <div>
              <Label>Endpoint</Label>
              <Input
                value={field.Endpoint || ""}
                onChange={(e) => onUpdate({ Endpoint: e.target.value })}
                placeholder="Ex: AllSources"
              />
            </div>
          </div>

          <Separator />

          {/* RecordActions */}
          <div className="space-y-3">
            <Label>RecordActions</Label>
            <div className="flex gap-2">
              <Input
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Add action (Edit, Copy, Delete)"
                onKeyPress={(e) => e.key === 'Enter' && addRecordAction()}
              />
              <Button onClick={addRecordAction} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(field.RecordActions || []).map((action, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {action}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRecordAction(index)}
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500">Default actions: Edit, Copy, Delete</p>
          </div>

          <Separator />

          {/* ColumnDefinitions */}
          <div className="space-y-3">
            <Label>ColumnDefinitions</Label>
            <div className="flex gap-2">
              <Input
                value={newColumn}
                onChange={(e) => setNewColumn(e.target.value)}
                placeholder="Add column (pSource, descr)"
                onKeyPress={(e) => e.key === 'Enter' && addColumn()}
              />
              <Button onClick={addColumn} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(field.ColumnDefinitions || []).map((column, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {column}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColumn(index)}
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500">Example: pSource, descr</p>
          </div>

          <Separator />

          {/* Events */}
          <div className="space-y-3">
            <Label>Events</Label>
            <div>
              <Label className="text-sm">onClickRow Event</Label>
              <Textarea
                value={field.Events?.onClickRow || ""}
                onChange={(e) => onUpdate({
                  Events: {
                    ...field.Events,
                    onClickRow: e.target.value
                  }
                })}
                placeholder="JavaScript code for row click event"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Layout Properties */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Layout Properties</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width</Label>
                <Input
                  value={field.Width || ""}
                  onChange={(e) => onUpdate({ Width: e.target.value })}
                  placeholder="Ex: 600px"
                />
              </div>
              <div>
                <Label>Spacing</Label>
                <Input
                  value={field.Spacing || ""}
                  onChange={(e) => onUpdate({ Spacing: e.target.value })}
                  placeholder="Ex: 10px"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}