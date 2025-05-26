import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MousePointer } from "lucide-react";
import UniversalConfigurator from "./component-configurators/universal-configurator";
import ValidationEditor from "./validation-editor";
import type { FormField } from "@/lib/form-types";

interface PropertiesPanelProps {
  selectedField: FormField | null;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  formData: {
    fields: FormField[];
    validations: any[];
  };
}

export default function PropertiesPanel({ 
  selectedField, 
  onUpdateField, 
  formData 
}: PropertiesPanelProps) {

  const updateField = (updates: Partial<FormField>) => {
    if (selectedField) {
      onUpdateField(selectedField.Id, updates);
    }
  };

  if (!selectedField) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 border-l">
        <div className="text-center text-gray-500 p-6">
          <MousePointer className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Aucun composant sélectionné</p>
          <p className="text-sm">Cliquez sur un composant dans le canvas pour voir ses propriétés</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900 border-l overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {selectedField.type}
          </Badge>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {selectedField.label || selectedField.Id || 'Composant'}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Component Specific Configuration */}
        <UniversalConfigurator 
          field={selectedField} 
          onUpdate={updateField} 
        />

        {/* Validation Section */}
        <Card className="border-red-200 dark:border-red-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-red-700 dark:text-red-300">
              Règles de validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ValidationEditor
              field={selectedField}
              onUpdateField={updateField}
              allFields={formData.fields}
            />
          </CardContent>
        </Card>

        {/* JSON Preview */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
              Aperçu JSON
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-x-auto">
              {JSON.stringify(selectedField, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}