import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import type { FormField } from "@/lib/form-types";

interface DialogConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function DialogConfigurator({ field, onUpdate }: DialogConfiguratorProps) {
  const [childFields, setChildFields] = useState<string[]>(field.ChildFields || []);

  const addChildField = () => {
    const newFields = [...childFields, ""];
    setChildFields(newFields);
    onUpdate({ ChildFields: newFields });
  };

  const updateChildField = (index: number, value: string) => {
    const newFields = [...childFields];
    newFields[index] = value;
    setChildFields(newFields);
    onUpdate({ ChildFields: newFields });
  };

  const removeChildField = (index: number) => {
    const newFields = childFields.filter((_, i) => i !== index);
    setChildFields(newFields);
    onUpdate({ ChildFields: newFields });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Configuration DIALOG</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Propriétés de base */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dialog-id">ID</Label>
            <Input
              id="dialog-id"
              value={field.Id || ""}
              onChange={(e) => onUpdate({ Id: e.target.value })}
              placeholder="SourceDetails"
            />
          </div>
          <div>
            <Label htmlFor="dialog-label">Label</Label>
            <Input
              id="dialog-label"
              value={field.label || ""}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="REC DETAILS"
            />
          </div>
        </div>

        {/* isGroup */}
        <div className="flex items-center space-x-2">
          <Switch
            id="dialog-isgroup"
            checked={field.isGroup || false}
            onCheckedChange={(checked) => onUpdate({ isGroup: checked })}
          />
          <Label htmlFor="dialog-isgroup">Is Group</Label>
        </div>

        {/* Entity */}
        <div>
          <Label htmlFor="dialog-entity">Entity</Label>
          <Input
            id="dialog-entity"
            value={field.Entity || ""}
            onChange={(e) => onUpdate({ Entity: e.target.value })}
            placeholder="Source"
          />
        </div>

        {/* VisibleWhen */}
        <div>
          <Label htmlFor="dialog-visiblewhen">VisibleWhen</Label>
          <Textarea
            id="dialog-visiblewhen"
            value={field.VisibleWhen || ""}
            onChange={(e) => onUpdate({ VisibleWhen: e.target.value })}
            placeholder="Conditions basées sur ShowDialog"
            rows={3}
          />
        </div>

        {/* ChildFields */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>ChildFields</Label>
            <Button size="sm" onClick={addChildField} className="h-8">
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>
          <div className="space-y-2">
            {childFields.map((field, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={field}
                  onChange={(e) => updateChildField(index, e.target.value)}
                  placeholder="Nom du champ enfant"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeChildField(index)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div>
          <Label htmlFor="dialog-events">Events</Label>
          <Textarea
            id="dialog-events"
            value={field.Events || ""}
            onChange={(e) => onUpdate({ Events: e.target.value })}
            placeholder="onClose, onSubmit"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}