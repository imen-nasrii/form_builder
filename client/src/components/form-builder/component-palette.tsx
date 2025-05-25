import { useDrag } from "react-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  List, 
  Calendar, 
  ChevronDown, 
  CheckSquare, 
  Radio, 
  FolderOpen,
  Play,
  AlertTriangle
} from "lucide-react";
import type { FormField } from "@/lib/form-types";

interface ComponentPaletteProps {
  onAddField: (field: FormField) => void;
}

interface DraggableComponentProps {
  type: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  onAddField: (field: FormField) => void;
}

function DraggableComponent({ type, icon, label, description, color, onAddField }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type, label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    const newField: FormField = {
      Id: `field_${Date.now()}`,
      label: label,
      type: type as keyof typeof import("@shared/schema").ComponentTypes,
      required: false,
      Width: "100%",
      Spacing: "normal",
    };
    onAddField(newField);
  };

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={`p-2 rounded border cursor-move hover:bg-gray-100 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}

export default function ComponentPalette({ onAddField }: ComponentPaletteProps) {
  const inputComponents = [
    {
      type: "GRIDLKP",
      icon: <Table className="w-5 h-5 text-blue-600" />,
      label: "Grid Lookup",
      description: "GRIDLKP",
      color: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300"
    },
    {
      type: "LSTLKP",
      icon: <List className="w-4 h-4 text-green-600" />,
      label: "List Lookup",
      description: "LSTLKP",
      color: "bg-green-100"
    },
    {
      type: "DATEPICKER",
      icon: <Calendar className="w-4 h-4 text-purple-600" />,
      label: "Date Picker",
      description: "DATEPICKER",
      color: "bg-purple-100"
    },
    {
      type: "SELECT",
      icon: <ChevronDown className="w-4 h-4 text-indigo-600" />,
      label: "Select Dropdown",
      description: "SELECT",
      color: "bg-indigo-100"
    },
    {
      type: "CHECKBOX",
      icon: <CheckSquare className="w-4 h-4 text-emerald-600" />,
      label: "Checkbox",
      description: "CHECKBOX",
      color: "bg-emerald-100"
    },
    {
      type: "RADIOGRP",
      icon: <Radio className="w-4 h-4 text-orange-600" />,
      label: "Radio Group",
      description: "RADIOGRP",
      color: "bg-orange-100"
    }
  ];

  const layoutComponents = [
    {
      type: "GROUP",
      icon: <FolderOpen className="w-4 h-4 text-slate-600" />,
      label: "Field Group",
      description: "GROUP",
      color: "bg-slate-100"
    }
  ];

  const actionComponents = [
    {
      type: "ACTION",
      icon: <Play className="w-4 h-4 text-red-600" />,
      label: "Action Button",
      description: "ACTION",
      color: "bg-red-100"
    },
    {
      type: "VALIDATION",
      icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
      label: "Validation Rule",
      description: "VALIDATION",
      color: "bg-yellow-100"
    }
  ];

  return (
    <div className="w-80 bg-white border-r border-slate-200 h-screen overflow-y-auto">
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">
              Components
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Controls Section */}
            <div>
              <h4 className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-3">
                Input Controls
              </h4>
              <div className="space-y-2">
                {inputComponents.map((component) => (
                  <DraggableComponent key={component.type} {...component} onAddField={onAddField} />
                ))}
              </div>
            </div>

            {/* Layout Components Section */}
            <div>
              <h4 className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-3">
                Layout
              </h4>
              <div className="space-y-2">
                {layoutComponents.map((component) => (
                  <DraggableComponent key={component.type} {...component} onAddField={onAddField} />
                ))}
              </div>
            </div>

            {/* Action & Validation Components */}
            <div>
              <h4 className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-3">
                Actions & Validation
              </h4>
              <div className="space-y-2">
                {actionComponents.map((component) => (
                  <DraggableComponent key={component.type} {...component} onAddField={onAddField} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <h4 className="text-sm font-medium text-slate-900 mb-2">How to Use</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Drag & drop OR click to add components</li>
            <li>• Click on fields to edit properties</li>
            <li>• Use the properties panel to configure</li>
            <li>• Export JSON when ready</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
