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
  Hash,
  Type,
  Grid3X3,
  FileText,
  FolderOpen,
  Play
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
      className={`group p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black cursor-move hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 ${
        isDragging ? 'opacity-60 scale-95' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <span className="text-sm font-medium text-black dark:text-white block">{label}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>
        </div>
      </div>
    </div>
  );
}

export default function CollapsibleComponentPalette({ onAddField }: ComponentPaletteProps) {
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
    <div className="space-y-4">
      {/* Main Title */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-black dark:text-white">Components</h2>
      </div>

      {/* Input Controls Section */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
          onClick={() => toggleSection('input')}
        >
          <h3 className="text-sm font-semibold text-black dark:text-white">
            Text Input
          </h3>
          {expandedSections.input ? 
            <ChevronDown className="w-5 h-5 text-blue-500" /> : 
            <ChevronRight className="w-5 h-5 text-blue-500" />
          }
        </div>
        {expandedSections.input && (
          <div className="space-y-3 mt-3">
            {inputComponents.map((component, index) => (
              <DraggableComponent
                key={index}
                type={component.type}
                icon={component.icon}
                label={component.label}
                description={component.description}
                color={component.color}
                onAddField={onAddField}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selection Controls Section */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
          onClick={() => toggleSection('selection')}
        >
          <h3 className="text-sm font-semibold text-black dark:text-white">
            Selection
          </h3>
          {expandedSections.selection ? 
            <ChevronDown className="w-5 h-5 text-green-500" /> : 
            <ChevronRight className="w-5 h-5 text-green-500" />
          }
        </div>
        {expandedSections.selection && (
          <div className="space-y-3 mt-3">
            {selectionComponents.map((component, index) => (
              <DraggableComponent
                key={index}
                type={component.type}
                icon={component.icon}
                label={component.label}
                description={component.description}
                color={component.color}
                onAddField={onAddField}
              />
            ))}
          </div>
        )}
      </div>

      {/* Date & Time Section */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
          onClick={() => toggleSection('dateTime')}
        >
          <h3 className="text-sm font-semibold text-black dark:text-white">
            Date & Time
          </h3>
          {expandedSections.dateTime ? 
            <ChevronDown className="w-5 h-5 text-purple-500" /> : 
            <ChevronRight className="w-5 h-5 text-purple-500" />
          }
        </div>
        {expandedSections.dateTime && (
          <div className="space-y-3 mt-3">
            {dateTimeComponents.map((component, index) => (
              <DraggableComponent
                key={index}
                type={component.type}
                icon={component.icon}
                label={component.label}
                description={component.description}
                color={component.color}
                onAddField={onAddField}
              />
            ))}
          </div>
        )}
      </div>

      {/* Files Section */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
          onClick={() => toggleSection('files')}
        >
          <h3 className="text-sm font-semibold text-black dark:text-white">
            Files
          </h3>
          {expandedSections.files ? 
            <ChevronDown className="w-5 h-5 text-pink-500" /> : 
            <ChevronRight className="w-5 h-5 text-pink-500" />
          }
        </div>
        {expandedSections.files && (
          <div className="space-y-3 mt-3">
            {filesComponents.map((component, index) => (
              <DraggableComponent
                key={index}
                type={component.type}
                icon={component.icon}
                label={component.label}
                description={component.description}
                color={component.color}
                onAddField={onAddField}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lookup Section */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
          onClick={() => toggleSection('lookup')}
        >
          <h3 className="text-sm font-semibold text-black dark:text-white">
            Lookup
          </h3>
          {expandedSections.lookup ? 
            <ChevronDown className="w-5 h-5 text-blue-500" /> : 
            <ChevronRight className="w-5 h-5 text-blue-500" />
          }
        </div>
        {expandedSections.lookup && (
          <div className="space-y-3 mt-3">
            {lookupComponents.map((component, index) => (
              <DraggableComponent
                key={index}
                type={component.type}
                icon={component.icon}
                label={component.label}
                description={component.description}
                color={component.color}
                onAddField={onAddField}
              />
            ))}
          </div>
        )}
      </div>

      {/* Layout Section */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
          onClick={() => toggleSection('layout')}
        >
          <h3 className="text-sm font-semibold text-black dark:text-white">
            Layout
          </h3>
          {expandedSections.layout ? 
            <ChevronDown className="w-5 h-5 text-purple-500" /> : 
            <ChevronRight className="w-5 h-5 text-purple-500" />
          }
        </div>
        {expandedSections.layout && (
          <div className="space-y-3 mt-3">
            {layoutComponents.map((component, index) => (
              <DraggableComponent
                key={index}
                type={component.type}
                icon={component.icon}
                label={component.label}
                description={component.description}
                color={component.color}
                onAddField={onAddField}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}