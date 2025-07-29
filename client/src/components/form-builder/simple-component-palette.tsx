import { useState } from "react";
import { useDrag } from "react-dnd";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Database,
  List, 
  Calendar, 
  ChevronDown, 
  ChevronRight,
  CheckSquare, 
  RadioIcon, 
  Grid3X3,
  FolderOpen
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
    type: "component",
    item: { fieldType: type },
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
    };
    onAddField(newField);
  };

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={`group p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 cursor-move hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 ${
        isDragging ? 'opacity-60 scale-95' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <span className="text-sm font-medium text-gray-900 dark:text-white block">{label}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>
        </div>
      </div>
    </div>
  );
}

export default function SimpleComponentPalette({ onAddField }: ComponentPaletteProps) {
  const [expandedSections, setExpandedSections] = useState({
    lookup: true,
    selection: true,
    dateTime: true,
    layout: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Composants organisés par catégorie
  const lookupComponents = [
    {
      type: "GRIDLKP",
      icon: <Grid3X3 className="w-5 h-5 text-white" />,
      label: "Grid Lookup",
      description: "GRIDLKP",
      color: "bg-blue-600"
    },
    {
      type: "LSTLKP", 
      icon: <List className="w-5 h-5 text-white" />,
      label: "List Lookup",
      description: "LSTLKP",
      color: "bg-green-600"
    }
  ];

  const selectionComponents = [
    {
      type: "SELECT",
      icon: <ChevronDown className="w-5 h-5 text-white" />,
      label: "Select Dropdown",
      description: "SELECT",
      color: "bg-orange-600"
    },
    {
      type: "CHECKBOX",
      icon: <CheckSquare className="w-5 h-5 text-white" />,
      label: "Checkbox",
      description: "CHECKBOX",
      color: "bg-purple-600"
    },
    {
      type: "RADIOGRP",
      icon: <RadioIcon className="w-5 h-5 text-white" />,
      label: "Radio Group",
      description: "RADIOGRP",
      color: "bg-pink-600"
    }
  ];

  const dateTimeComponents = [
    {
      type: "DATEPICKER",
      icon: <Calendar className="w-5 h-5 text-white" />,
      label: "Date Picker",
      description: "DATEPICKER",
      color: "bg-indigo-600"
    },
    {
      type: "DATEPKR",
      icon: <Calendar className="w-5 h-5 text-white" />,
      label: "Date Picker Alt",
      description: "DATEPKR",
      color: "bg-teal-600"
    }
  ];

  const layoutComponents = [
    {
      type: "GROUP",
      icon: <FolderOpen className="w-5 h-5 text-white" />,
      label: "Group",
      description: "GROUP",
      color: "bg-slate-600"
    }
  ];

  return (
    <div className="space-y-3 p-4">
      {/* Lookup Components Section */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
          onClick={() => toggleSection('lookup')}
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Lookup Components
          </h3>
          {expandedSections.lookup ? 
            <ChevronDown className="w-4 h-4 text-blue-600" /> : 
            <ChevronRight className="w-4 h-4 text-blue-600" />
          }
        </div>
        {expandedSections.lookup && (
          <div className="space-y-2 mt-2">
            {lookupComponents.map((component) => (
              <DraggableComponent key={component.type} {...component} onAddField={onAddField} />
            ))}
          </div>
        )}
      </div>

      {/* Selection Controls Section */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
          onClick={() => toggleSection('selection')}
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Selection Controls
          </h3>
          {expandedSections.selection ? 
            <ChevronDown className="w-4 h-4 text-green-600" /> : 
            <ChevronRight className="w-4 h-4 text-green-600" />
          }
        </div>
        {expandedSections.selection && (
          <div className="space-y-2 mt-2">
            {selectionComponents.map((component) => (
              <DraggableComponent key={component.type} {...component} onAddField={onAddField} />
            ))}
          </div>
        )}
      </div>

      {/* Date & Time Section */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
          onClick={() => toggleSection('dateTime')}
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Date & Time
          </h3>
          {expandedSections.dateTime ? 
            <ChevronDown className="w-4 h-4 text-indigo-600" /> : 
            <ChevronRight className="w-4 h-4 text-indigo-600" />
          }
        </div>
        {expandedSections.dateTime && (
          <div className="space-y-2 mt-2">
            {dateTimeComponents.map((component) => (
              <DraggableComponent key={component.type} {...component} onAddField={onAddField} />
            ))}
          </div>
        )}
      </div>

      {/* Container & Layout Section */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
          onClick={() => toggleSection('layout')}
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Container & Layout
          </h3>
          {expandedSections.layout ? 
            <ChevronDown className="w-4 h-4 text-slate-600" /> : 
            <ChevronRight className="w-4 h-4 text-slate-600" />
          }
        </div>
        {expandedSections.layout && (
          <div className="space-y-2 mt-2">
            {layoutComponents.map((component) => (
              <DraggableComponent key={component.type} {...component} onAddField={onAddField} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}