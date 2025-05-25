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
}

function DraggableComponent({ type, icon, label, description, color }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`component-item bg-slate-50 hover:bg-slate-100 p-3 rounded-lg cursor-move transition-all duration-200 border border-transparent hover:border-slate-200 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900">{label}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ComponentPalette({ onAddField }: ComponentPaletteProps) {
  const inputComponents = [
    {
      type: "GRIDLKP",
      icon: <Table className="w-4 h-4 text-blue-600" />,
      label: "Grid Lookup",
      description: "GRIDLKP",
      color: "bg-blue-100"
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
                  <DraggableComponent key={component.type} {...component} />
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
                  <DraggableComponent key={component.type} {...component} />
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
                  <DraggableComponent key={component.type} {...component} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <h4 className="text-sm font-medium text-slate-900 mb-2">How to Use</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Drag components to the form canvas</li>
            <li>• Click on fields to edit properties</li>
            <li>• Use the properties panel to configure</li>
            <li>• Export JSON when ready</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
