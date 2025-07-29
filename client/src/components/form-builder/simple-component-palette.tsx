import { useDrag } from "react-dnd";
import {
  Grid3X3,
  List,
  ChevronDown,
  Calendar,
  FolderOpen,
  RadioIcon,
  CheckSquare,
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

function DraggableComponent({
  type,
  icon,
  label,
  description,
  color,
  onAddField,
}: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { fieldType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    const newField: FormField = {
      Id: `field_${Date.now()}`,
      label,
      type: type as keyof typeof import("@shared/schema").ComponentTypes,
      required: false,
    };
    onAddField(newField);
  };

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={`group p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 cursor-move hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 ${
        isDragging ? "opacity-60 scale-95" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <span className="text-sm font-medium text-gray-900 dark:text-white block">
            {label}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </span>
        </div>
      </div>
    </div>
  );
}

// Ici, on retire 'onAddField' du type car on le passe dans le composant directement
const orderedComponents: Omit<DraggableComponentProps, "onAddField">[] = [
  {
    type: "GRIDLKP",
    icon: <Grid3X3 className="w-5 h-5 text-white" />,
    label: "Grid Lookup",
    description: "GRIDLKP",
    color: "bg-blue-600",
  },
  {
    type: "LSTLKP",
    icon: <List className="w-5 h-5 text-white" />,
    label: "List Lookup",
    description: "LSTLKP",
    color: "bg-green-600",
  },
  {
    type: "SELECT",
    icon: <ChevronDown className="w-5 h-5 text-white" />,
    label: "Select Dropdown",
    description: "SELECT",
    color: "bg-orange-600",
  },
  {
    type: "DATEPICKER",
    icon: <Calendar className="w-5 h-5 text-white" />,
    label: "Date Picker",
    description: "DATEPICKER",
    color: "bg-indigo-600",
  },
  {
    type: "GROUP",
    icon: <FolderOpen className="w-5 h-5 text-white" />,
    label: "Group",
    description: "GROUP",
    color: "bg-slate-600",
  },
  {
    type: "RADIOGRP",
    icon: <RadioIcon className="w-5 h-5 text-white" />,
    label: "Radio Group",
    description: "RADIOGRP",
    color: "bg-pink-600",
  },
  {
    type: "DATEPKR",
    icon: <Calendar className="w-5 h-5 text-white" />,
    label: "Date Picker Alt",
    description: "DATEPKR",
    color: "bg-teal-600",
  },
  {
    type: "CHECKBOX",
    icon: <CheckSquare className="w-5 h-5 text-white" />,
    label: "Checkbox",
    description: "CHECKBOX",
    color: "bg-purple-600",
  },
];

export default function SimpleComponentPalette({ onAddField }: ComponentPaletteProps) {
  return (
    <div className="space-y-2 p-4">
      {orderedComponents.map((component) => (
        <DraggableComponent
          key={component.type}
          {...component}
          onAddField={onAddField} // onAddField passé ici, pas dans orderedComponents
        />
      ))}
    </div>
  );
}
