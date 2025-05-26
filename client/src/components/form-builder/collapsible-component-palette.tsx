import { useState } from "react";
import { useDrag } from "react-dnd";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  List, 
  Calendar, 
  ChevronDown, 
  ChevronRight,
  CheckSquare, 
  Radio, 
  FolderOpen,
  Play,
  AlertTriangle,
  Grid3X3,
  MessageSquare,
  Type,
  FileText,
  Upload
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
    input: true,
    selection: true,
    data: true,
    special: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const inputComponents = [
    {
      type: "TEXT",
      icon: <Type className="w-5 h-5 text-white" />,
      label: "Champ texte",
      description: "TEXT",
      color: "bg-green-500"
    },
    {
      type: "TEXTAREA",
      icon: <FileText className="w-5 h-5 text-white" />,
      label: "Zone de texte",
      description: "TEXTAREA", 
      color: "bg-green-600"
    },
    {
      type: "DATEPICKER",
      icon: <Calendar className="w-5 h-5 text-white" />,
      label: "Sélecteur de date",
      description: "DATEPICKER",
      color: "bg-purple-500"
    },
    {
      type: "FILEUPLOAD",
      icon: <Upload className="w-5 h-5 text-white" />,
      label: "Téléchargement de fichier",
      description: "FILEUPLOAD",
      color: "bg-indigo-500"
    }
  ];

  const selectionComponents = [
    {
      type: "SELECT",
      icon: <ChevronDown className="w-5 h-5 text-white" />,
      label: "Sélectionnez la liste déroulante",
      description: "SELECT",
      color: "bg-orange-500"
    },
    {
      type: "CHECKBOX",
      icon: <CheckSquare className="w-5 h-5 text-white" />,
      label: "Case à cocher",
      description: "CHECKBOX",
      color: "bg-cyan-500"
    },
    {
      type: "RADIOGRP",
      icon: <Radio className="w-5 h-5 text-white" />,
      label: "Groupe de radio",
      description: "RADIOGRP",
      color: "bg-pink-500"
    }
  ];

  const dataComponents = [
    {
      type: "GRID",
      icon: <Grid3X3 className="w-5 h-5 text-white" />,
      label: "Grille de données",
      description: "GRID",
      color: "bg-blue-600"
    },
    {
      type: "GRIDLKP",
      icon: <Table className="w-5 h-5 text-white" />,
      label: "Recherche de grille",
      description: "GRIDLKP",
      color: "bg-blue-500"
    },
    {
      type: "LSTLKP",
      icon: <List className="w-5 h-5 text-white" />,
      label: "Recherche de liste",
      description: "LSTLKP",
      color: "bg-teal-500"
    }
  ];

  const specialComponents = [
    {
      type: "DIALOG",
      icon: <MessageSquare className="w-5 h-5 text-white" />,
      label: "Boîte de dialogue",
      description: "DIALOG",
      color: "bg-purple-600"
    },
    {
      type: "GROUP",
      icon: <FolderOpen className="w-5 h-5 text-white" />,
      label: "Groupe de champs",
      description: "GROUP",
      color: "bg-gray-500"
    },
    {
      type: "ACTION",
      icon: <Play className="w-5 h-5 text-white" />,
      label: "Bouton d'action",
      description: "ACTION",
      color: "bg-red-500"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Titre principal */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-black dark:text-white">COMPOSANTS</h2>
      </div>

      {/* Input Controls Section */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
          onClick={() => toggleSection('input')}
        >
          <h3 className="text-sm font-semibold text-black dark:text-white">
            CONTRÔLES D'ENTRÉE
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
            CONTRÔLES DE SÉLECTION
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

      {/* Data Controls Section */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
          onClick={() => toggleSection('data')}
        >
          <h3 className="text-sm font-semibold text-black dark:text-white">
            CONTRÔLES DE DONNÉES
          </h3>
          {expandedSections.data ? 
            <ChevronDown className="w-5 h-5 text-blue-500" /> : 
            <ChevronRight className="w-5 h-5 text-blue-500" />
          }
        </div>
        {expandedSections.data && (
          <div className="space-y-3 mt-3">
            {dataComponents.map((component, index) => (
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

      {/* Special Controls Section */}
      <div>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
          onClick={() => toggleSection('special')}
        >
          <h3 className="text-sm font-semibold text-black dark:text-white">
            CONTRÔLES SPÉCIAUX
          </h3>
          {expandedSections.special ? 
            <ChevronDown className="w-5 h-5 text-purple-500" /> : 
            <ChevronRight className="w-5 h-5 text-purple-500" />
          }
        </div>
        {expandedSections.special && (
          <div className="space-y-3 mt-3">
            {specialComponents.map((component, index) => (
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