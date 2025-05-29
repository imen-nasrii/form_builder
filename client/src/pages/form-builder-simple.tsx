import { useState } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Type, 
  FileText, 
  List, 
  Square, 
  Calendar, 
  Upload,
  Grid3X3,
  Settings,
  Zap,
  Save,
  Download,
  Eye
} from 'lucide-react';

interface FormField {
  Id: string;
  Label: string;
  Type: string;
  Required: boolean;
  Properties?: any;
}

interface DragItem {
  type: string;
  componentType: string;
}

// Composant draggable
const DraggableItem = ({ componentType, label, icon: Icon, color }: any) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { componentType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 border rounded-lg cursor-move hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};

// Zone de drop
const DropZone = ({ onDrop, children }: any) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: DragItem) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-h-96 p-4 border-2 border-dashed rounded-lg transition-colors ${
        isOver && canDrop
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600'
      }`}
    >
      {children}
    </div>
  );
};

// Rendu d'un champ
const FieldRenderer = ({ field, onRemove }: any) => {
  const renderField = () => {
    switch (field.Type) {
      case 'TEXT':
        return <Input placeholder={field.Label} />;
      case 'TEXTAREA':
        return <Textarea placeholder={field.Label} />;
      case 'SELECT':
        return (
          <select className="w-full p-2 border rounded">
            <option>{field.Label}</option>
          </select>
        );
      case 'CHECKBOX':
        return (
          <label className="flex items-center space-x-2">
            <input type="checkbox" />
            <span>{field.Label}</span>
          </label>
        );
      case 'RADIOGRP':
        return (
          <div>
            <label className="flex items-center space-x-2">
              <input type="radio" name={field.Id} />
              <span>{field.Label} - Option 1</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name={field.Id} />
              <span>{field.Label} - Option 2</span>
            </label>
          </div>
        );
      case 'DATEPICKER':
        return <Input type="date" />;
      case 'FILEUPLOAD':
        return <Input type="file" />;
      case 'GRIDLKP':
        return (
          <div className="border rounded p-2">
            <div className="text-sm text-gray-500">Grid Lookup: {field.Label}</div>
            <table className="w-full mt-2 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-1">Col 1</th>
                  <th className="p-1">Col 2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1">Data 1</td>
                  <td className="p-1">Data 2</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 'LSTLKP':
        return (
          <div className="border rounded p-2">
            <div className="text-sm text-gray-500">List Lookup: {field.Label}</div>
            <ul className="mt-2 text-sm">
              <li>• Item 1</li>
              <li>• Item 2</li>
            </ul>
          </div>
        );
      case 'ACTION':
        return <Button variant="outline">{field.Label}</Button>;
      default:
        return <div className="p-2 bg-gray-100 rounded">Composant: {field.Type}</div>;
    }
  };

  return (
    <div className="mb-4 p-3 border rounded-lg bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.Label} ({field.Type})
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(field.Id)}
          className="text-red-500 hover:text-red-700"
        >
          ×
        </Button>
      </div>
      {renderField()}
    </div>
  );
};

export default function SimpleFormBuilder() {
  const [formData, setFormData] = useState({
    label: "Nouveau formulaire",
    fields: [] as FormField[]
  });
  
  const [showJson, setShowJson] = useState(false);

  const components = [
    { type: 'TEXT', label: '📝 Text Input', icon: Type, color: 'text-blue-500' },
    { type: 'TEXTAREA', label: '📄 Text Area', icon: FileText, color: 'text-green-500' },
    { type: 'SELECT', label: '📋 Select', icon: List, color: 'text-purple-500' },
    { type: 'CHECKBOX', label: '☑️ Checkbox', icon: Square, color: 'text-orange-500' },
    { type: 'RADIOGRP', label: '🔘 Radio Group', icon: Square, color: 'text-pink-500' },
    { type: 'DATEPICKER', label: '📅 Date Picker', icon: Calendar, color: 'text-indigo-500' },
    { type: 'FILEUPLOAD', label: '📤 File Upload', icon: Upload, color: 'text-red-500' },
    { type: 'GRIDLKP', label: '🔍 Grid Lookup', icon: Grid3X3, color: 'text-cyan-500' },
    { type: 'LSTLKP', label: '📜 List Lookup', icon: List, color: 'text-teal-500' },
    { type: 'ACTION', label: '⚡ Action Button', icon: Zap, color: 'text-yellow-600' },
  ];

  const handleDrop = (item: DragItem) => {
    const newField: FormField = {
      Id: `field_${Date.now()}`,
      Label: `${item.componentType} Field`,
      Type: item.componentType,
      Required: false,
      Properties: {}
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.Id !== fieldId)
    }));
  };

  const exportJson = () => {
    const json = JSON.stringify(formData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Form Builder - Drag & Drop
              </h1>
              <Input
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                className="w-64"
                placeholder="Nom du formulaire"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowJson(!showJson)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showJson ? 'Masquer JSON' : 'Voir JSON'}
              </Button>
              <Button onClick={exportJson}>
                <Download className="w-4 h-4 mr-2" />
                Exporter JSON
              </Button>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-screen">
          {/* Sidebar - Components */}
          <div className="w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Composants
            </h2>
            <div className="space-y-2">
              {components.map(component => (
                <DraggableItem
                  key={component.type}
                  componentType={component.type}
                  label={component.label}
                  icon={component.icon}
                  color={component.color}
                />
              ))}
            </div>
            
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Instructions
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Glissez les composants vers la zone centrale pour construire votre formulaire.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Form Builder */}
            <div className="flex-1 p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formData.label}
                </h2>
                <p className="text-sm text-gray-500">
                  {formData.fields.length} composant(s)
                </p>
              </div>

              <DropZone onDrop={handleDrop}>
                {formData.fields.length === 0 ? (
                  <div className="text-center py-12">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Zone de création
                    </h3>
                    <p className="text-gray-500">
                      Glissez des composants depuis le panneau de gauche pour commencer
                      à créer votre formulaire
                    </p>
                  </div>
                ) : (
                  <div>
                    {formData.fields.map(field => (
                      <FieldRenderer
                        key={field.Id}
                        field={field}
                        onRemove={removeField}
                      />
                    ))}
                  </div>
                )}
              </DropZone>
            </div>

            {/* JSON Panel */}
            {showJson && (
              <div className="w-1/3 bg-gray-900 text-green-400 p-4 overflow-auto">
                <h3 className="text-lg font-semibold mb-4">JSON Output</h3>
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}