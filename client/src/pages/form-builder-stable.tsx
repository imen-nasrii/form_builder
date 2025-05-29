import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { 
  ChevronDown,
  ChevronRight,
  Trash2,
  User,
  Home,
  Plus,
  Square,
  AlertTriangle,
  Grid3x3,
  List,
  Type,
  Menu,
  CheckSquare,
  Circle,
  Calendar,
  Upload,
  MousePointer,
  X,
  Copy
} from "lucide-react";

import type { Form } from "@shared/schema";
import { FormField } from "@/lib/drag-drop-clean";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

// Composant draggable pour la palette
function DraggableComponent({ componentType, label, icon: Icon, color }: {
  componentType: string;
  label: string;
  icon: any;
  color: string;
}) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.setData('componentType', componentType);
      }}
      onDragEnd={() => setIsDragging(false)}
      className={`p-3 border rounded-lg cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${
        color === 'blue' ? 'border-blue-200 hover:border-blue-300 bg-blue-50' :
        color === 'purple' ? 'border-purple-200 hover:border-purple-300 bg-purple-50' :
        color === 'orange' ? 'border-orange-200 hover:border-orange-300 bg-orange-50' :
        color === 'green' ? 'border-green-200 hover:border-green-300 bg-green-50' :
        color === 'red' ? 'border-red-200 hover:border-red-300 bg-red-50' :
        color === 'yellow' ? 'border-yellow-200 hover:border-yellow-300 bg-yellow-50' :
        'border-gray-200 hover:border-gray-300 bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-2">
        <Icon className={`w-4 h-4 ${
          color === 'blue' ? 'text-blue-600' :
          color === 'purple' ? 'text-purple-600' :
          color === 'orange' ? 'text-orange-600' :
          color === 'green' ? 'text-green-600' :
          color === 'red' ? 'text-red-600' :
          color === 'yellow' ? 'text-yellow-600' :
          'text-gray-600'
        }`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}

// Composant pour afficher un champ
function FieldComponent({ 
  field, 
  isSelected, 
  onSelect, 
  onRemove 
}: {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const getFieldIcon = () => {
    switch (field.Type) {
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'ACTION': return <MousePointer className="w-4 h-4 text-red-600" />;
      case 'GRIDLKP': return <Grid3x3 className="w-4 h-4 text-blue-600" />;
      case 'LSTLKP': return <List className="w-4 h-4 text-green-600" />;
      case 'GROUP': return <Square className="w-4 h-4 text-purple-600" />;
      case 'TEXT': return <Type className="w-4 h-4 text-blue-600" />;
      case 'TEXTAREA': return <Menu className="w-4 h-4 text-blue-600" />;
      case 'SELECT': return <ChevronDown className="w-4 h-4 text-blue-600" />;
      case 'CHECKBOX': return <CheckSquare className="w-4 h-4 text-blue-600" />;
      case 'DATEPICKER': return <Calendar className="w-4 h-4 text-blue-600" />;
      default: return <Square className="w-4 h-4 text-gray-600" />;
    }
  };

  const getFieldColor = () => {
    switch (field.Type) {
      case 'WARNING': return 'bg-yellow-50 border-yellow-200';
      case 'ACTION': return 'bg-red-50 border-red-200';
      case 'GRIDLKP': return 'bg-blue-50 border-blue-200';
      case 'LSTLKP': return 'bg-green-50 border-green-200';
      case 'GROUP': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // Si c'est un GROUP, afficher avec zone de dépôt
  if (field.Type === 'GROUP') {
    return (
      <GroupField
        field={field}
        isSelected={isSelected}
        onSelect={onSelect}
        onRemove={onRemove}
      />
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : getFieldColor() + ' hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getFieldIcon()}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{field.Type}</span>
            </div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded mt-1">
              {field.Label || `${field.Type} Field`}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 h-6 w-6 text-gray-400 hover:text-red-500"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// Composant GROUP avec drag & drop interne
function GroupField({
  field,
  isSelected,
  onSelect,
  onRemove
}: {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      onClick={onSelect}
      className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'bg-purple-50 border-purple-200 hover:border-purple-300'
      }`}
    >
      {/* Header du groupe */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Square className="w-4 h-4 text-purple-600" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center space-x-2"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span className="font-medium text-sm">GROUP</span>
          </button>
          <div className="text-xs bg-purple-100 px-2 py-1 rounded">
            {(field.ChildFields || []).length} items
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 h-6 w-6 text-gray-400 hover:text-red-500"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Contenu du groupe */}
      {isExpanded && (
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const componentType = e.dataTransfer.getData('componentType');
            if (componentType) {
              // Ajouter l'élément au groupe
              console.log(`Ajout de ${componentType} au groupe ${field.Id}`);
            }
          }}
          className="min-h-24 p-4 border-2 border-dashed rounded transition-colors border-gray-200 bg-gray-50 hover:border-blue-500 hover:bg-blue-50"
        >
          {(field.ChildFields || []).length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Square className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Glissez des composants ici</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(field.ChildFields || []).map((childField) => (
                <div
                  key={childField.Id}
                  className="p-3 bg-white border border-gray-200 rounded shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        childField.Type === 'TEXT' ? 'bg-blue-500' :
                        childField.Type === 'SELECT' ? 'bg-orange-500' :
                        childField.Type === 'CHECKBOX' ? 'bg-cyan-500' :
                        childField.Type === 'WARNING' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                      <span className="text-sm font-medium">
                        {childField.Label || childField.Id}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {childField.Type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Composant PropertiesPanel pour toutes les propriétés
function PropertiesPanel({ field, onUpdate }: { 
  field: FormField; 
  onUpdate: (updates: Partial<FormField>) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Propriétés communes */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">General Properties</h4>
        
        <div>
          <Label htmlFor="field-id">ID</Label>
          <Input
            id="field-id"
            value={field.Id}
            onChange={(e) => onUpdate({ Id: e.target.value })}
            className="text-sm"
          />
        </div>

        <div>
          <Label htmlFor="field-type">Type</Label>
          <Input 
            id="field-type" 
            value={field.Type} 
            disabled 
            className="text-sm bg-gray-50"
          />
        </div>

        <div>
          <Label htmlFor="field-label">Label</Label>
          <Input
            id="field-label"
            value={field.Label}
            onChange={(e) => onUpdate({ Label: e.target.value })}
            className="text-sm"
          />
        </div>

        <div>
          <Label htmlFor="field-datafield">Data Field</Label>
          <Input
            id="field-datafield"
            value={field.DataField}
            onChange={(e) => onUpdate({ DataField: e.target.value })}
            placeholder="Nom du champ de données"
            className="text-sm"
          />
        </div>

        <div>
          <Label htmlFor="field-entity">Entity</Label>
          <Input
            id="field-entity"
            value={field.Entity}
            onChange={(e) => onUpdate({ Entity: e.target.value })}
            placeholder="Entité liée"
            className="text-sm"
          />
        </div>
      </div>

      {/* Propriétés de mise en page */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Layout Properties</h4>
        
        <div>
          <Label htmlFor="field-width">Width</Label>
          <Select 
            value={field.Width} 
            onValueChange={(value) => onUpdate({ Width: value })}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Auto</SelectItem>
              <SelectItem value="25%">25%</SelectItem>
              <SelectItem value="33%">33%</SelectItem>
              <SelectItem value="50%">50%</SelectItem>
              <SelectItem value="66%">66%</SelectItem>
              <SelectItem value="75%">75%</SelectItem>
              <SelectItem value="100%">100%</SelectItem>
              <SelectItem value="200px">200px</SelectItem>
              <SelectItem value="300px">300px</SelectItem>
              <SelectItem value="400px">400px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="field-spacing">Spacing</Label>
          <Select 
            value={field.Spacing} 
            onValueChange={(value) => onUpdate({ Spacing: value })}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select spacing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="field-inline"
            checked={field.Inline}
            onCheckedChange={(checked) => onUpdate({ Inline: checked })}
          />
          <Label htmlFor="field-inline" className="text-sm">Inline</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="field-outlined"
            checked={field.Outlined}
            onCheckedChange={(checked) => onUpdate({ Outlined: checked })}
          />
          <Label htmlFor="field-outlined" className="text-sm">Outlined</Label>
        </div>
      </div>

      {/* Propriétés de validation */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Validation Properties</h4>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="field-required"
            checked={field.Required}
            onCheckedChange={(checked) => onUpdate({ Required: checked })}
          />
          <Label htmlFor="field-required" className="text-sm">Required</Label>
        </div>
      </div>

      {/* Propriétés spécifiques par type */}
      {renderTypeSpecificProperties(field, onUpdate)}
    </div>
  );
}

// Propriétés spécifiques selon le type de champ
function renderTypeSpecificProperties(field: FormField, onUpdate: (updates: Partial<FormField>) => void) {
  switch (field.Type) {
    case 'TEXT':
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Text Properties</h4>
          
          <div>
            <Label htmlFor="field-value">Default Value</Label>
            <Input
              id="field-value"
              value={field.Value}
              onChange={(e) => onUpdate({ Value: e.target.value })}
              placeholder="Valeur par défaut"
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="field-placeholder">Placeholder</Label>
            <Input
              id="field-placeholder"
              value={field.Value}
              onChange={(e) => onUpdate({ Value: e.target.value })}
              placeholder="Texte d'aide"
              className="text-sm"
            />
          </div>
        </div>
      );

    case 'TEXTAREA':
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Textarea Properties</h4>
          
          <div>
            <Label htmlFor="field-value">Default Value</Label>
            <Textarea
              id="field-value"
              value={field.Value}
              onChange={(e) => onUpdate({ Value: e.target.value })}
              placeholder="Valeur par défaut"
              className="text-sm"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="field-rows">Rows</Label>
            <Select 
              value={field.Value} 
              onValueChange={(value) => onUpdate({ Value: value })}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Number of rows" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'SELECT':
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Select Properties</h4>
          
          <div>
            <Label htmlFor="field-options">Options (une par ligne)</Label>
            <Textarea
              id="field-options"
              value={field.Value}
              onChange={(e) => onUpdate({ Value: e.target.value })}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              className="text-sm"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="field-multiple">Type</Label>
            <Select 
              value={field.Value} 
              onValueChange={(value) => onUpdate({ Value: value })}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Selection</SelectItem>
                <SelectItem value="multiple">Multiple Selection</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'GRIDLKP':
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Grid Lookup Properties</h4>
          
          <div>
            <Label htmlFor="field-source">Data Source</Label>
            <Input
              id="field-source"
              value={field.Entity}
              onChange={(e) => onUpdate({ Entity: e.target.value })}
              placeholder="Table ou vue source"
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="field-columns">Display Columns</Label>
            <Textarea
              id="field-columns"
              value={field.Value}
              onChange={(e) => onUpdate({ Value: e.target.value })}
              placeholder="Col1,Col2,Col3"
              className="text-sm"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="field-filter">Filter Expression</Label>
            <Input
              id="field-filter"
              value={field.Value}
              onChange={(e) => onUpdate({ Value: e.target.value })}
              placeholder="WHERE condition"
              className="text-sm"
            />
          </div>
        </div>
      );

    case 'LSTLKP':
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">List Lookup Properties</h4>
          
          <div>
            <Label htmlFor="field-source">Data Source</Label>
            <Input
              id="field-source"
              value={field.Entity}
              onChange={(e) => onUpdate({ Entity: e.target.value })}
              placeholder="Table ou vue source"
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="field-display">Display Field</Label>
            <Input
              id="field-display"
              value={field.Value}
              onChange={(e) => onUpdate({ Value: e.target.value })}
              placeholder="Champ à afficher"
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="field-valueField">Value Field</Label>
            <Input
              id="field-valueField"
              value={field.DataField}
              onChange={(e) => onUpdate({ DataField: e.target.value })}
              placeholder="Champ de valeur"
              className="text-sm"
            />
          </div>
        </div>
      );

    case 'DATEPICKER':
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Date Picker Properties</h4>
          
          <div>
            <Label htmlFor="field-format">Date Format</Label>
            <Select 
              value={field.Value} 
              onValueChange={(value) => onUpdate({ Value: value })}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                <SelectItem value="dd-MM-yyyy">DD-MM-YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="field-minDate">Min Date</Label>
            <Input
              id="field-minDate"
              type="date"
              value={field.Value}
              onChange={(e) => onUpdate({ Value: e.target.value })}
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="field-maxDate">Max Date</Label>
            <Input
              id="field-maxDate"
              type="date"
              value={field.Value}
              onChange={(e) => onUpdate({ Value: e.target.value })}
              className="text-sm"
            />
          </div>
        </div>
      );

    case 'ACTION':
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Action Properties</h4>
          
          <div>
            <Label htmlFor="field-actionType">Action Type</Label>
            <Select 
              value={field.Value} 
              onValueChange={(value) => onUpdate({ Value: value })}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="submit">Submit</SelectItem>
                <SelectItem value="reset">Reset</SelectItem>
                <SelectItem value="cancel">Cancel</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="field-url">URL/Endpoint</Label>
            <Input
              id="field-url"
              value={field.Value}
              onChange={(e) => onUpdate({ Value: e.target.value })}
              placeholder="URL de destination"
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="field-method">HTTP Method</Label>
            <Select 
              value={field.Value} 
              onValueChange={(value) => onUpdate({ Value: value })}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'WARNING':
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Warning Properties</h4>
          
          <div>
            <Label htmlFor="field-message">Warning Message</Label>
            <Textarea
              id="field-message"
              value={field.Value}
              onChange={(e) => onUpdate({ Value: e.target.value })}
              placeholder="Message d'avertissement"
              className="text-sm"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="field-severity">Severity</Label>
            <Select 
              value={field.Value} 
              onValueChange={(value) => onUpdate({ Value: value })}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'GROUP':
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Group Properties</h4>
          
          <div>
            <Label htmlFor="field-title">Group Title</Label>
            <Input
              id="field-title"
              value={field.Label}
              onChange={(e) => onUpdate({ Label: e.target.value })}
              placeholder="Titre du groupe"
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="field-collapsible">Behavior</Label>
            <Select 
              value={field.Value} 
              onValueChange={(value) => onUpdate({ Value: value })}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select behavior" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static</SelectItem>
                <SelectItem value="collapsible">Collapsible</SelectItem>
                <SelectItem value="accordion">Accordion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="field-childCount">Child Fields Count</Label>
            <Input
              id="field-childCount"
              value={(field.ChildFields || []).length.toString()}
              disabled
              className="text-sm bg-gray-50"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function FormBuilderStable() {
  const params = useParams();
  const formId = params.formId ? parseInt(params.formId) : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    menuId: "",
    label: "",
    formWidth: "700px",
    layout: "PROCESS",
    fields: [] as FormField[]
  });

  const [selectedField, setSelectedField] = useState<FormField | null>(null);

  // Composants organisés par catégories
  const componentCategories = {
    "Input Controls": [
      { type: 'TEXT', label: 'Text', icon: Type, color: 'blue' },
      { type: 'TEXTAREA', label: 'Textarea', icon: Menu, color: 'blue' },
      { type: 'SELECT', label: 'Select', icon: ChevronDown, color: 'blue' },
      { type: 'CHECKBOX', label: 'Checkbox', icon: CheckSquare, color: 'blue' },
      { type: 'RADIOGRP', label: 'Radio', icon: Circle, color: 'blue' },
      { type: 'DATEPICKER', label: 'Date', icon: Calendar, color: 'blue' },
      { type: 'FILEUPLOAD', label: 'File', icon: Upload, color: 'blue' }
    ],
    "Layout Components": [
      { type: 'GROUP', label: 'Group', icon: Square, color: 'purple' },
      { type: 'PANEL', label: 'Panel', icon: Square, color: 'purple' }
    ],
    "Lookup Components": [
      { type: 'GRIDLKP', label: 'Grid Lookup', icon: Grid3x3, color: 'orange' },
      { type: 'LSTLKP', label: 'List Lookup', icon: List, color: 'green' }
    ],
    "Action & Validation": [
      { type: 'ACTION', label: 'Action', icon: MousePointer, color: 'red' },
      { type: 'ERROR', label: 'Error', icon: X, color: 'red' },
      { type: 'WARNING', label: 'Warning', icon: AlertTriangle, color: 'yellow' }
    ]
  };

  // Charger les données du formulaire
  const { data: form, isLoading: formLoading } = useQuery({
    queryKey: ['/api/forms', formId],
    enabled: !!formId,
  });

  // Synchroniser les données du formulaire
  useEffect(() => {
    if (form && typeof form === 'object' && form !== null && 'definition' in form) {
      const definition = typeof form.definition === 'string' 
        ? JSON.parse(form.definition) 
        : form.definition;
      
      setFormData({
        menuId: definition?.menuId || "",
        label: definition?.label || "",
        formWidth: definition?.formWidth || "700px",
        layout: definition?.layout || "PROCESS",
        fields: definition?.fields || []
      });
    }
  }, [form]);

  // Fonction pour ajouter un champ depuis le drag & drop
  const addField = (componentType: string, targetGroupId?: string) => {
    const newField: FormField = {
      Id: `${componentType.toLowerCase()}-${Date.now()}`,
      Type: componentType,
      Label: componentType === 'WARNING' ? 'Warning Message' : `${componentType} Field`,
      DataField: "",
      Entity: "",
      Width: "",
      Spacing: "",
      Required: false,
      Inline: false,
      Outlined: false,
      Value: "",
      ChildFields: []
    };

    if (targetGroupId) {
      // Ajouter au groupe spécifique
      setFormData(prev => ({
        ...prev,
        fields: prev.fields.map(field => {
          if (field.Id === targetGroupId) {
            return {
              ...field,
              ChildFields: [...(field.ChildFields || []), newField]
            };
          }
          return field;
        })
      }));
    } else {
      // Ajouter à la zone principale
      setFormData(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));
    }
    
    setSelectedField(newField);
  };

  // Fonction pour supprimer un champ
  const removeField = (fieldId: string) => {
    const removeFieldRecursive = (fields: FormField[]): FormField[] => {
      return fields.filter(field => field.Id !== fieldId).map(field => {
        if (field.ChildFields && field.ChildFields.length > 0) {
          return {
            ...field,
            ChildFields: removeFieldRecursive(field.ChildFields)
          };
        }
        return field;
      });
    };

    setFormData(prev => ({
      ...prev,
      fields: removeFieldRecursive(prev.fields)
    }));
    
    if (selectedField?.Id === fieldId) {
      setSelectedField(null);
    }
  };

  // Fonction pour mettre à jour un champ dans formData
  const updateFieldInFormData = (fieldId: string, updates: Partial<FormField>) => {
    const updateFieldRecursive = (fields: FormField[]): FormField[] => {
      return fields.map(field => {
        if (field.Id === fieldId) {
          return { ...field, ...updates };
        }
        if (field.ChildFields && field.ChildFields.length > 0) {
          return {
            ...field,
            ChildFields: updateFieldRecursive(field.ChildFields)
          };
        }
        return field;
      });
    };

    setFormData(prev => ({
      ...prev,
      fields: updateFieldRecursive(prev.fields)
    }));
  };

  // Mutation pour sauvegarder
  const saveFormMutation = useMutation({
    mutationFn: async () => {
      const definition = {
        menuId: formData.menuId,
        label: formData.label,
        formWidth: formData.formWidth,
        layout: formData.layout,
        fields: formData.fields,
        actions: [],
        validations: []
      };

      const data = {
        menuId: formData.menuId,
        label: formData.label,
        formWidth: formData.formWidth,
        layout: formData.layout,
        definition: definition
      };

      if (formId) {
        return await apiRequest("PUT", `/api/forms/${formId}`, data);
      } else {
        return await apiRequest("POST", "/api/forms", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      toast({
        title: "Succès",
        description: "Formulaire sauvegardé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    },
  });

  if (formLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Form Builder</h1>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Menu ID"
                value={formData.menuId}
                onChange={(e) => setFormData(prev => ({ ...prev, menuId: e.target.value }))}
                className="w-32"
              />
              <Input
                placeholder="Label"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                className="w-40"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => saveFormMutation.mutate()}
              disabled={saveFormMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saveFormMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Palette de composants */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto pt-20">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Components</h2>
          {Object.entries(componentCategories).map(([category, components]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">{category}</h3>
              <div className="space-y-2">
                {components.map((component) => (
                  <DraggableComponent
                    key={component.type}
                    componentType={component.type}
                    label={component.label}
                    icon={component.icon}
                    color={component.color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone principale de construction */}
      <div className="flex-1 flex pt-20">
        {/* Canvas */}
        <div className="flex-1 p-6">
          <div 
            className="min-h-96 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const componentType = e.dataTransfer.getData('componentType');
              if (componentType) {
                addField(componentType);
              }
            }}
          >
            {formData.fields.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start Building Your Form</h3>
                <p>Drag components from the sidebar to begin</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.fields.map((field) => (
                  <FieldComponent
                    key={field.Id}
                    field={field}
                    isSelected={selectedField?.Id === field.Id}
                    onSelect={() => setSelectedField(field)}
                    onRemove={() => removeField(field.Id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panneau des propriétés */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Properties</h3>
          {selectedField ? (
            <PropertiesPanel 
              field={selectedField} 
              onUpdate={(updates) => {
                const updatedField = { ...selectedField, ...updates };
                setSelectedField(updatedField);
                updateFieldInFormData(selectedField.Id, updates);
              }}
            />
          ) : (
            <p className="text-gray-500">Select a field to edit its properties</p>
          )}

          {/* JSON Preview */}
          <div className="mt-8">
            <h4 className="text-sm font-semibold mb-2">JSON Preview</h4>
            <div className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-96">
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}