import { FormField } from "@/lib/form-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActionConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function ActionConfigurator({ field, onUpdate }: ActionConfiguratorProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            Configuration ACTION
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ID</Label>
              <Input
                value={field.Id || ""}
                onChange={(e) => onUpdate({ Id: e.target.value })}
                placeholder="Ex: Actions"
              />
            </div>
            <div>
              <Label>Label</Label>
              <Input
                value={field.label || ""}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Ex: Valider"
              />
            </div>
          </div>

          <div>
            <Label>MethodToInvoke</Label>
            <Input
              value={field.MethodToInvoke || ""}
              onChange={(e) => onUpdate({ MethodToInvoke: e.target.value })}
              placeholder="Ex: SubmitForm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}