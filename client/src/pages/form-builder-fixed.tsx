import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Type, 
  AlignLeft, 
  CheckSquare, 
  List, 
  Calendar, 
  Upload, 
  Table, 
  Search, 
  Square, 
  Play, 
  RotateCcw, 
  X, 
  AlertTriangle,
  Trash2,
  Settings,
  ChevronDown,
  ChevronRight,
  Moon,
  Sun,
  Users,
  Maximize,
  Minimize,
  HelpCircle,
  ArrowRight,
  ArrowDown,
  Mail,
  Share,
  Plus,
  Code,
  Package,
  Save
} from 'lucide-react';

interface FormField {
  Id: string;
  Type: string;
  Label: string;
  DataField: string;
  Entity: string;
  Width: string;
  Spacing: string;
  Required: boolean;
  Inline: boolean;
  Outlined: boolean;
  Value: string;
  ChildFields?: FormField[];
}

const ComponentCategories = {
  text: {
    name: 'Saisie et texte',
    icon: Type,
    color: 'blue',
    components: {
      TEXT: { icon: Type, label: 'Saisie de texte', color: 'blue' },
      TEXTAREA: { icon: AlignLeft, label: 'Zone de texte', color: 'green' }
    }
  },
  selection: {
    name: 'Sélection',
    icon: List,
    color: 'orange',
    components: {
      SELECT: { icon: List, label: 'Sélectionner', color: 'orange' },
      CHECKBOX: { icon: CheckSquare, label: 'Case à cocher', color: 'cyan' },
      RADIOGRP: { icon: CheckSquare, label: 'Groupe radio', color: 'purple' }
    }
  },
  datetime: {
    name: 'Date et temps',
    icon: Calendar,
    color: 'purple',
    components: {
      DATEPICKER: { icon: Calendar, label: 'Sélecteur de date', color: 'purple' }
    }
  },
  file: {
    name: 'Fichiers',
    icon: Upload,
    color: 'red',
    components: {
      FILEUPLOAD: { icon: Upload, label: 'Téléchargement de fichiers', color: 'pink' }
    }
  },
  lookup: {
    name: 'Recherche',
    icon: Search,
    color: 'indigo',
    components: {
      GRIDLKP: { icon: Table, label: 'Recherche de grille', color: 'indigo' },
      LSTLKP: { icon: Search, label: 'Recherche de liste', color: 'teal' }
    }
  },
  layout: {
    name: 'Mise en page',
    icon: Square,
    color: 'gray',
    components: {
      GROUP: { icon: Square, label: 'Groupe', color: 'violet' }
    }
  },
  actions: {
    name: 'Actions',
    icon: Play,
    color: 'red',
    components: {
      ACTION: { icon: Play, label: "Bouton d'action", color: 'red' },
      WARNING: { icon: AlertTriangle, label: 'Avertissement', color: 'yellow' }
    }
  }
};

// Flatten for compatibility
const ComponentTypes = Object.values(ComponentCategories).reduce((acc, category) => {
  return { ...acc, ...category.components };
}, {} as Record<string, { icon: any; label: string; color: string }>);

function DraggableComponent({ componentType, label, icon: Icon, color }: {
  componentType: string;
  label: string;
  icon: any;
  color: string;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('componentType', componentType);
      }}
      className={`p-3 border-2 border-dashed rounded-lg cursor-move transition-all hover:shadow-md bg-${color}-50 border-${color}-200 hover:border-${color}-400`}
    >
      <div className="flex items-center space-x-2">
        <Icon className={`w-4 h-4 text-${color}-600`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}

function FieldComponent({ 
  field, 
  onSelect, 
  onRemove, 
  isSelected,
  addField,
  isDarkMode 
}: { 
  field: FormField; 
  onSelect: () => void;
  onRemove: () => void;
  isSelected: boolean;
  addField: (type: string, groupId?: string) => void;
  isDarkMode: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  if (field.Type === 'GROUP') {
    return (
      <GroupField 
        field={field} 
        onSelect={onSelect} 
        onRemove={onRemove} 
        isSelected={isSelected}
        addField={addField}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isDarkMode={isDarkMode}
      />
    );
  }

  const componentType = ComponentTypes[field.Type as keyof typeof ComponentTypes];
  const Icon = componentType?.icon || Type;
  const color = componentType?.color || 'gray';

  return (
    <div
      onClick={onSelect}
      className={`p-3 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? `border-blue-500 ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-50'}`
          : `${isDarkMode ? 'border-gray-600 hover:border-gray-500 bg-gray-700' : 'border-gray-200 hover:border-gray-300 bg-white'}`
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`w-4 h-4 text-${color}-600`} />
          <div>
            <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{field.Label || field.Id}</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{field.Type}</div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

function GroupField({
  field,
  onSelect,
  onRemove,
  isSelected,
  addField,
  isExpanded,
  setIsExpanded,
  isDarkMode
}: {
  field: FormField;
  onSelect: () => void;
  onRemove: () => void;
  isSelected: boolean;
  addField: (type: string, groupId?: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isDarkMode: boolean;
}) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
        isSelected
          ? `border-blue-500 ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-50'}`
          : `${isDarkMode ? 'bg-purple-900/20 border-purple-600 hover:border-purple-500' : 'bg-purple-50 border-purple-200 hover:border-purple-300'}`
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Square className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center space-x-2"
          >
            {isExpanded ? <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`} /> : <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`} />}
            <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>GROUP</span>
          </button>
          <div className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
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
          className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {isExpanded && (
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const componentType = e.dataTransfer.getData('componentType');
            if (componentType) {
              addField(componentType, field.Id);
            }
          }}
          className={`min-h-24 p-4 border-2 border-dashed rounded transition-colors ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-700 hover:border-blue-500 hover:bg-blue-900/20' 
              : 'border-gray-200 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          {(field.ChildFields || []).length === 0 ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              <Square className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Glissez des composants ici</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(field.ChildFields || []).map((childField) => (
                <div
                  key={childField.Id}
                  className={`p-3 border rounded shadow-sm ${
                    isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-200'
                  }`}
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
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {childField.Label || childField.Id}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-100'
                      }`}>
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

function PropertiesPanel({ field, onUpdate }: { 
  field: FormField; 
  onUpdate: (updates: Partial<FormField>) => void;
}) {
  const renderTypeSpecificProperties = () => {
    switch (field.Type) {
      case 'TEXTAREA':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Textarea Properties</h4>
            
            <div>
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="Tapez votre texte ici..."
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-rows">Rows</Label>
              <Input
                id="field-rows"
                value={field.Value || "3"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="3"
                className="text-sm"
                type="number"
                min="2"
                max="10"
              />
            </div>
          </div>
        );

      case 'SELECT':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Select Properties</h4>
            
            <div>
              <Label htmlFor="field-options">Options</Label>
              <Textarea
                id="field-options"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="Option1,Option2,Option3"
                className="text-sm"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="field-multiple">Type</Label>
              <Input
                id="field-multiple"
                value={field.Value || "single"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="single ou multiple"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'GRIDLKP':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Grid Lookup Properties</h4>
            
            <div>
              <Label htmlFor="field-source">Source Table</Label>
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
              <Label htmlFor="field-lookup-table">Lookup Table</Label>
              <Input
                id="field-lookup-table"
                value={field.Entity}
                onChange={(e) => onUpdate({ Entity: e.target.value })}
                placeholder="LookupTable"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-display-field">Display Field</Label>
              <Input
                id="field-display-field"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="DisplayColumn"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-value-field">Value Field</Label>
              <Input
                id="field-value-field"
                value={field.DataField}
                onChange={(e) => onUpdate({ DataField: e.target.value })}
                placeholder="ValueColumn"
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
              <Input
                id="field-format"
                value={field.Value || "dd/MM/yyyy"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="dd/MM/yyyy"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-minDate">Min Date</Label>
              <Input
                id="field-minDate"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="01/01/2020"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-maxDate">Max Date</Label>
              <Input
                id="field-maxDate"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="31/12/2030"
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
              <Input
                id="field-actionType"
                value={field.Value || "submit"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="submit, reset, cancel, custom"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-url">URL/Endpoint</Label>
              <Input
                id="field-url"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="/api/submit"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-method">HTTP Method</Label>
              <Input
                id="field-method"
                value={field.Value || "POST"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="GET, POST, PUT, DELETE"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'WARNING':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Warning Properties</h4>
            
            <div>
              <Label htmlFor="field-message">Message</Label>
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
              <Input
                id="field-severity"
                value={field.Value || "warning"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="info, warning, error, success"
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'GROUP':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Group Properties</h4>
            
            <div>
              <Label htmlFor="field-groupTitle">Group Title</Label>
              <Input
                id="field-groupTitle"
                value={field.Label}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Titre du groupe"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-collapsible">Behavior</Label>
              <Input
                id="field-collapsible"
                value={field.Value || "static"}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="static, collapsible, accordion"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-childCount">Child Fields Count</Label>
              <Input
                id="field-childCount"
                value={(field.ChildFields || []).length.toString()}
                readOnly
                className="text-sm bg-gray-100"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Propriétés</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="layout">Mise en page</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div>
              <Label htmlFor="field-label">Label</Label>
              <Input
                id="field-label"
                value={field.Label}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Nom du champ"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-datafield">Data Field</Label>
              <Input
                id="field-datafield"
                value={field.DataField}
                onChange={(e) => onUpdate({ DataField: e.target.value })}
                placeholder="nom_colonne"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-entity">Entity</Label>
              <Input
                id="field-entity"
                value={field.Entity}
                onChange={(e) => onUpdate({ Entity: e.target.value })}
                placeholder="TableName"
                className="text-sm"
              />
            </div>

            <Separator className="my-4" />
            
            {renderTypeSpecificProperties()}
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div>
              <Label>Width</Label>
              <Input
                value={field.Width}
                onChange={(e) => onUpdate({ Width: e.target.value })}
                placeholder="100%"
                className="text-sm"
              />
            </div>

            <div>
              <Label>Spacing</Label>
              <Input
                value={field.Spacing}
                onChange={(e) => onUpdate({ Spacing: e.target.value })}
                placeholder="md"
                className="text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="field-inline"
                checked={field.Inline}
                onChange={(e) => onUpdate({ Inline: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="field-inline">Inline</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="field-outlined"
                checked={field.Outlined}
                onChange={(e) => onUpdate({ Outlined: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="field-outlined">Outlined</Label>
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="field-required"
                checked={field.Required}
                onChange={(e) => onUpdate({ Required: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="field-required">Required</Label>
            </div>

            <div>
              <Label htmlFor="field-minLength">Min Length</Label>
              <Input
                id="field-minLength"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="0"
                className="text-sm"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="field-maxLength">Max Length</Label>
              <Input
                id="field-maxLength"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="255"
                className="text-sm"
                type="number"
              />
            </div>

            <div>
              <Label htmlFor="field-pattern">Pattern (Regex)</Label>
              <Input
                id="field-pattern"
                value={field.Value}
                onChange={(e) => onUpdate({ Value: e.target.value })}
                placeholder="^[a-zA-Z0-9]+$"
                className="text-sm"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// JSON Validator Component
function JsonValidator({ formData, customComponents, isDarkMode }: {
  formData: any;
  customComponents: any[];
  isDarkMode: boolean;
}) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const validateForm = (data: any) => {
    const errors: string[] = [];
    const warns: string[] = [];

    // Validation du MenuID
    if (!data.menuId || data.menuId.trim() === '') {
      errors.push('MenuID est requis');
    } else if (!/^[A-Z0-9_]+$/.test(data.menuId)) {
      errors.push('MenuID doit contenir uniquement des lettres majuscules, chiffres et underscores');
    }

    // Validation du Label
    if (!data.label || data.label.trim() === '') {
      errors.push('Label du formulaire est requis');
    }

    // Validation de la largeur
    if (!data.formWidth || !data.formWidth.match(/^\d+(px|%|em|rem)$/)) {
      errors.push('FormWidth doit être une valeur CSS valide (ex: 700px, 100%)');
    }

    // Validation des champs
    if (!data.fields || !Array.isArray(data.fields)) {
      errors.push('Le formulaire doit contenir un tableau de champs');
    } else {
      data.fields.forEach((field: any, index: number) => {
        const fieldPrefix = `Champ ${index + 1}`;

        // Validation des propriétés obligatoires
        if (!field.Id) errors.push(`${fieldPrefix}: ID est requis`);
        if (!field.Type) errors.push(`${fieldPrefix}: Type est requis`);
        if (!field.Label) errors.push(`${fieldPrefix}: Label est requis`);
        if (!field.DataField) errors.push(`${fieldPrefix}: DataField est requis`);

        // Validation des types de composants
        const validTypes = [...Object.keys(ComponentTypes), ...customComponents.map(c => c.id)];
        if (field.Type && !validTypes.includes(field.Type)) {
          errors.push(`${fieldPrefix}: Type "${field.Type}" n'est pas valide`);
        }

        // Validation des IDs uniques
        const duplicateIds = data.fields.filter((f: any) => f.Id === field.Id);
        if (duplicateIds.length > 1) {
          errors.push(`${fieldPrefix}: ID "${field.Id}" est dupliqué`);
        }

        // Validation des DataFields uniques
        const duplicateDataFields = data.fields.filter((f: any) => f.DataField === field.DataField);
        if (duplicateDataFields.length > 1) {
          warns.push(`${fieldPrefix}: DataField "${field.DataField}" est dupliqué`);
        }

        // Validation spécifique par type
        if (field.Type === 'GROUP' && field.ChildFields && field.ChildFields.length === 0) {
          warns.push(`${fieldPrefix}: Groupe vide (aucun champ enfant)`);
        }

        if (field.Type === 'SELECT' && !field.Value) {
          warns.push(`${fieldPrefix}: SELECT sans options définies`);
        }

        // Validation des propriétés requises
        if (field.Required && typeof field.Required !== 'boolean') {
          errors.push(`${fieldPrefix}: Required doit être true ou false`);
        }

        if (field.Width && !field.Width.match(/^\d+(px|%|em|rem)$/)) {
          errors.push(`${fieldPrefix}: Width doit être une valeur CSS valide`);
        }
      });
    }

    return { errors, warns };
  };

  useEffect(() => {
    const { errors, warns } = validateForm(formData);
    setValidationErrors(errors);
    setWarnings(warns);
  }, [formData, customComponents]);

  const jsonString = JSON.stringify(formData, null, 2);
  const isValid = validationErrors.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Schema JSON avec Validation
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {isValid ? 'Valide' : `${validationErrors.length} erreur(s)`}
          </span>
        </div>
      </div>

      {/* Erreurs de validation */}
      {validationErrors.length > 0 && (
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-600' : 'bg-red-50 border-red-200'}`}>
          <h4 className={`font-medium mb-2 flex items-center ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Erreurs de validation
          </h4>
          <ul className="space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Avertissements */}
      {warnings.length > 0 && (
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-yellow-900/20 border-yellow-600' : 'bg-yellow-50 border-yellow-200'}`}>
          <h4 className={`font-medium mb-2 flex items-center ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Avertissements
          </h4>
          <ul className="space-y-1">
            {warnings.map((warning, index) => (
              <li key={index} className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                • {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* JSON Display */}
      <div className="relative">
        <Textarea
          value={jsonString}
          readOnly
          className={`h-96 text-xs font-mono ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : ''}`}
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${
          isValid 
            ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
            : (isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')
        }`}>
          {jsonString.split('\n').length} lignes
        </div>
      </div>

      {/* Statistiques */}
      <div className={`grid grid-cols-3 gap-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formData.fields?.length || 0}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Champs
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {customComponents.length}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Composants personnalisés
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {Math.round(jsonString.length / 1024 * 100) / 100}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            KB
          </div>
        </div>
      </div>
    </div>
  );
}

// Tutorial System Component
function TutorialDialog({ isOpen, onClose, step, onNextStep, onPrevStep, totalSteps, isDarkMode }: {
  isOpen: boolean;
  onClose: () => void;
  step: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  totalSteps: number;
  isDarkMode: boolean;
}) {
  const tutorialSteps = [
    {
      title: "Bienvenue dans le Form Builder",
      content: "Ce tutoriel vous guidera à travers toutes les fonctionnalités du générateur de formulaires. Vous apprendrez à créer des formulaires complexes avec validation en temps réel.",
      highlight: null,
      action: "Commençons!"
    },
    {
      title: "Palette de composants",
      content: "À gauche, vous trouvez la palette de composants organisée par catégories : Saisie, Sélection, Date, Fichiers, etc. Glissez-déposez les composants dans la zone de construction.",
      highlight: "palette",
      action: "Glissez un composant TEXT"
    },
    {
      title: "Zone de construction",
      content: "Au centre se trouve la zone de construction où vous assemblez votre formulaire. Les composants peuvent être réorganisés par glisser-déposer.",
      highlight: "builder",
      action: "Déposez votre composant ici"
    },
    {
      title: "Panneau de propriétés",
      content: "À droite, le panneau de propriétés vous permet de configurer chaque composant sélectionné : label, validation, style, etc.",
      highlight: "properties",
      action: "Cliquez sur un composant"
    },
    {
      title: "Validateur JSON",
      content: "L'onglet JSON affiche le schéma généré en temps réel avec validation automatique. Les erreurs et avertissements sont mis en évidence.",
      highlight: "json",
      action: "Consultez la validation"
    },
    {
      title: "Composants personnalisés",
      content: "Vous pouvez créer vos propres composants via l'icône '+'. Utilisez JSON ou le créateur visuel pour définir des composants réutilisables.",
      highlight: "custom",
      action: "Créez un composant"
    },
    {
      title: "Sauvegarde et collaboration",
      content: "Utilisez les boutons Nouveau/Vider/Sauvegarder pour gérer vos formulaires. Invitez des collaborateurs pour travailler ensemble en temps réel.",
      highlight: "actions",
      action: "Sauvegardez votre travail"
    }
  ];

  const currentStep = tutorialSteps[step];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className={`text-xl ${isDarkMode ? 'text-white' : ''}`}>
              {currentStep.title}
            </DialogTitle>
            <div className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
              {step + 1} / {totalSteps}
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {currentStep.content}
          </div>

          {currentStep.highlight && (
            <div className={`p-4 rounded-lg border-l-4 ${isDarkMode ? 'bg-blue-900/20 border-blue-600' : 'bg-blue-50 border-blue-400'}`}>
              <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                <ArrowRight className="w-4 h-4" />
                <span className="font-medium">{currentStep.action}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={onPrevStep}
              disabled={step === 0}
              className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
            >
              Précédent
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === step 
                      ? (isDarkMode ? 'bg-blue-400' : 'bg-blue-600')
                      : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
                  }`}
                />
              ))}
            </div>

            {step === totalSteps - 1 ? (
              <Button onClick={onClose}>
                Terminer
              </Button>
            ) : (
              <Button onClick={onNextStep}>
                Suivant
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick Tips Component
function QuickTips({ isDarkMode }: { isDarkMode: boolean }) {
  const [showTips, setShowTips] = useState(false);

  const tips = [
    {
      title: "Raccourcis clavier",
      content: "Ctrl+S pour sauvegarder, Ctrl+Z pour annuler, Ctrl+D pour dupliquer un composant"
    },
    {
      title: "Groupes de composants", 
      content: "Glissez des composants dans un GROUP pour les organiser visuellement"
    },
    {
      title: "Validation avancée",
      content: "Utilisez l'onglet JSON pour voir les erreurs de validation en temps réel"
    },
    {
      title: "Composants personnalisés",
      content: "Créez vos propres composants réutilisables avec des propriétés spécifiques"
    },
    {
      title: "Mode sombre",
      content: "Basculez entre mode clair et sombre pour votre confort visuel"
    }
  ];

  return (
    <Dialog open={showTips} onOpenChange={setShowTips}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={isDarkMode ? 'text-gray-300' : ''}>
          <HelpCircle className="w-4 h-4 mr-2" />
          Astuces
        </Button>
      </DialogTrigger>
      <DialogContent className={`max-w-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? 'text-white' : ''}>
            Astuces rapides
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {tip.title}
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {tip.content}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function FormBuilderFixed() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    id: null as number | null,
    menuId: `FORM_${Date.now()}`,
    label: 'Mon Formulaire',
    formWidth: '700px',
    layout: 'PROCESS',
    fields: [] as FormField[]
  });

  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [customComponents, setCustomComponents] = useState<any[]>([]);
  const [newComponentConfig, setNewComponentConfig] = useState({
    name: '',
    label: '',
    icon: 'Square',
    color: 'gray',
    properties: ''
  });
  const [showAddComponent, setShowAddComponent] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const formBuilderRef = useRef<HTMLDivElement>(null);

  // Load saved form data and custom components from localStorage on startup
  useEffect(() => {
    try {
      const savedBackup = localStorage.getItem('formBuilder_backup');
      if (savedBackup) {
        const backup = JSON.parse(savedBackup);
        if (backup.id) {
          setFormData(prev => ({ ...prev, id: backup.id }));
        }
        if (backup.fields && backup.fields.length > 0) {
          setFormData(prev => ({ ...prev, fields: backup.fields }));
        }
        if (backup.customComponents && backup.customComponents.length > 0) {
          setCustomComponents(backup.customComponents);
        }
      }
    } catch (error) {
      console.log('No valid backup found');
    }
  }, []);

  const createDefaultField = (componentType: string): FormField => {
    const timestamp = Date.now();
    
    // Check if it's a custom component
    const customComponent = customComponents.find(comp => comp.id === componentType);
    
    return {
      Id: `${componentType}_${timestamp}`,
      Type: componentType,
      Label: customComponent ? customComponent.label : (ComponentTypes[componentType as keyof typeof ComponentTypes]?.label || componentType),
      DataField: `field_${timestamp}`,
      Entity: 'TableName',
      Width: '100%',
      Spacing: 'md',
      Required: false,
      Inline: false,
      Outlined: false,
      Value: customComponent ? JSON.stringify(customComponent.properties) : '',
      ChildFields: componentType === 'GROUP' ? [] : undefined
    };
  };

  const addField = (componentType: string, targetGroupId?: string) => {
    const newField = createDefaultField(componentType);
    
    if (targetGroupId) {
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
      setFormData(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));
    }
    
    setSelectedField(newField);
  };

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

    if (selectedField?.Id === fieldId) {
      setSelectedField(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addCollaborator = () => {
    if (collaboratorEmail && !collaborators.includes(collaboratorEmail)) {
      setCollaborators([...collaborators, collaboratorEmail]);
      setCollaboratorEmail('');
    }
  };

  const removeCollaborator = (email: string) => {
    setCollaborators(collaborators.filter(c => c !== email));
  };

  // Method 1: JSON Configuration for External Components
  const addComponentFromJSON = (jsonConfig: string) => {
    try {
      const config = JSON.parse(jsonConfig);
      if (!config.name || !config.label) {
        alert('Le nom et le label sont requis dans la configuration JSON');
        return;
      }
      
      const newComponent = {
        id: config.name.toUpperCase(),
        name: config.name,
        label: config.label,
        icon: config.icon || 'Square',
        color: config.color || 'gray',
        properties: config.properties || {},
        isCustom: true
      };
      
      // Check if component already exists
      if (customComponents.some(comp => comp.id === newComponent.id)) {
        alert('Un composant avec ce nom existe déjà');
        return;
      }
      
      setCustomComponents(prev => [...prev, newComponent]);
      alert('Composant ajouté avec succès !');
    } catch (error) {
      console.error('Invalid JSON configuration:', error);
      alert('Configuration JSON invalide. Vérifiez la syntaxe.');
    }
  };

  // Method 2: Form-based Component Creator
  const addComponentFromForm = () => {
    if (!newComponentConfig.name || !newComponentConfig.label) return;
    
    try {
      const newComponent = {
        id: newComponentConfig.name.toUpperCase(),
        name: newComponentConfig.name,
        label: newComponentConfig.label,
        icon: newComponentConfig.icon,
        color: newComponentConfig.color,
        properties: newComponentConfig.properties ? JSON.parse(newComponentConfig.properties) : {},
        isCustom: true
      };
      
      setCustomComponents(prev => [...prev, newComponent]);
      setNewComponentConfig({ name: '', label: '', icon: 'Square', color: 'gray', properties: '' });
      setShowAddComponent(false);
    } catch (error) {
      console.error('Invalid JSON in properties:', error);
      alert('Format JSON invalide dans les propriétés');
    }
  };

  const removeCustomComponent = (componentId: string) => {
    setCustomComponents(prev => prev.filter(comp => comp.id !== componentId));
  };

  // Create new form function
  const createNewForm = () => {
    if (confirm('Êtes-vous sûr de vouloir créer un nouveau formulaire ? Les modifications non sauvegardées seront perdues.')) {
      setFormData({
        id: null,
        menuId: `FORM_${Date.now()}`,
        label: 'Mon Formulaire',
        formWidth: '700px',
        layout: 'PROCESS',
        fields: []
      });
      setSelectedField(null);
      setCustomComponents([]);
      localStorage.removeItem('formBuilder_backup');
    }
  };

  // Reset form function (clear fields only)
  const resetForm = () => {
    if (confirm('Êtes-vous sûr de vouloir vider le formulaire ? Tous les champs seront supprimés.')) {
      setFormData(prev => ({
        ...prev,
        fields: []
      }));
      setSelectedField(null);
    }
  };

  // Save form mutation
  const saveFormMutation = useMutation({
    mutationFn: async () => {
      const formToSave = {
        menuId: formData.menuId,
        label: formData.label,
        formWidth: formData.formWidth,
        layout: formData.layout,
        formDefinition: JSON.stringify({
          fields: formData.fields,
          customComponents: customComponents
        })
      };

      const url = formData.id ? `/api/forms/${formData.id}` : '/api/forms';
      const method = formData.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formToSave),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      return response.json();
    },
    onSuccess: (savedForm) => {
      // Update the form ID if it was a new form
      if (!formData.id && savedForm.id) {
        setFormData(prev => ({ ...prev, id: savedForm.id }));
      }
      
      alert('Formulaire sauvegardé avec succès !');
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
      
      // Also save to localStorage as backup
      localStorage.setItem('formBuilder_backup', JSON.stringify({
        id: savedForm.id,
        fields: formData.fields,
        customComponents: customComponents
      }));
    },
    onError: (error) => {
      console.error('Error saving form:', error);
      alert('Erreur lors de la sauvegarde du formulaire');
    }
  });

  // Save form function
  const saveForm = () => {
    saveFormMutation.mutate();
  };

  // Tutorial functions
  const startTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
  };

  const nextTutorialStep = () => {
    if (tutorialStep < 6) {
      setTutorialStep(tutorialStep + 1);
    }
  };

  const prevTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1);
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(0);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`border-b px-6 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Form Builder</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Créez et configurez vos formulaires</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Fullscreen Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullScreen}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>

            {/* Help */}
            <Button
              variant="outline"
              size="sm"
              onClick={startTutorial}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Tutoriel
            </Button>

            <QuickTips isDarkMode={isDarkMode} />

            {/* Add External Components */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Composants Externes
                </Button>
              </DialogTrigger>
              <DialogContent className={`max-w-2xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <DialogHeader>
                  <DialogTitle className={isDarkMode ? 'text-white' : ''}>Ajouter des Composants Externes</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="json" className="w-full">
                  <TabsList className={`grid w-full grid-cols-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                    <TabsTrigger value="json" className={isDarkMode ? 'data-[state=active]:bg-gray-600 text-gray-300' : ''}>
                      <Code className="w-4 h-4 mr-2" />
                      Configuration JSON
                    </TabsTrigger>
                    <TabsTrigger value="form" className={isDarkMode ? 'data-[state=active]:bg-gray-600 text-gray-300' : ''}>
                      <Package className="w-4 h-4 mr-2" />
                      Créateur Visuel
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="json" className="space-y-4">
                    <div>
                      <Label className={isDarkMode ? 'text-gray-300' : ''}>Configuration JSON du composant:</Label>
                      <Textarea
                        data-json-input
                        placeholder={`{
  "name": "customInput",
  "label": "Input Personnalisé",
  "icon": "Type",
  "color": "blue",
  "properties": {
    "placeholder": "Texte par défaut",
    "validation": "required",
    "maxLength": 255
  }
}`}
                        className={`h-48 text-xs font-mono ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      />
                    </div>
                    <Button onClick={() => {
                      const textarea = document.querySelector('[data-json-input]') as HTMLTextAreaElement;
                      if (textarea?.value) {
                        addComponentFromJSON(textarea.value);
                        textarea.value = '';
                      }
                    }}>
                      <Code className="w-4 h-4 mr-2" />
                      Ajouter depuis JSON
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="form" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className={isDarkMode ? 'text-gray-300' : ''}>Nom du composant</Label>
                        <Input
                          placeholder="customButton"
                          value={newComponentConfig.name}
                          onChange={(e) => setNewComponentConfig(prev => ({ ...prev, name: e.target.value }))}
                          className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                        />
                      </div>
                      <div>
                        <Label className={isDarkMode ? 'text-gray-300' : ''}>Label d'affichage</Label>
                        <Input
                          placeholder="Bouton Personnalisé"
                          value={newComponentConfig.label}
                          onChange={(e) => setNewComponentConfig(prev => ({ ...prev, label: e.target.value }))}
                          className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                        />
                      </div>
                      <div>
                        <Label className={isDarkMode ? 'text-gray-300' : ''}>Icône</Label>
                        <Input
                          placeholder="Square"
                          value={newComponentConfig.icon}
                          onChange={(e) => setNewComponentConfig(prev => ({ ...prev, icon: e.target.value }))}
                          className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                        />
                      </div>
                      <div>
                        <Label className={isDarkMode ? 'text-gray-300' : ''}>Couleur</Label>
                        <Input
                          placeholder="blue"
                          value={newComponentConfig.color}
                          onChange={(e) => setNewComponentConfig(prev => ({ ...prev, color: e.target.value }))}
                          className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className={isDarkMode ? 'text-gray-300' : ''}>Propriétés (JSON)</Label>
                      <Textarea
                        placeholder='{"placeholder": "Valeur par défaut", "required": true}'
                        value={newComponentConfig.properties}
                        onChange={(e) => setNewComponentConfig(prev => ({ ...prev, properties: e.target.value }))}
                        className={`h-24 text-xs font-mono ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      />
                    </div>
                    <Button onClick={addComponentFromForm}>
                      <Package className="w-4 h-4 mr-2" />
                      Créer le Composant
                    </Button>
                  </TabsContent>
                </Tabs>
                
                {customComponents.length > 0 && (
                  <div className="mt-6">
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Composants Personnalisés:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {customComponents.map((component, index) => (
                        <div key={index} className={`flex items-center justify-between p-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full bg-${component.color}-500`} />
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{component.label}</span>
                            <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-500 bg-gray-200'}`}>{component.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomComponent(component.id)}
                            className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Collaboration */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Collaborer ({collaborators.length})
                </Button>
              </DialogTrigger>
              <DialogContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <DialogHeader>
                  <DialogTitle className={isDarkMode ? 'text-white' : ''}>Gestion des Collaborateurs</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Email du collaborateur"
                      value={collaboratorEmail}
                      onChange={(e) => setCollaboratorEmail(e.target.value)}
                      className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                    <Button onClick={addCollaborator} size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Inviter
                    </Button>
                  </div>
                  
                  {collaborators.length > 0 && (
                    <div className="space-y-2">
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Collaborateurs actifs:</h4>
                      {collaborators.map((email, index) => (
                        <div key={index} className={`flex items-center justify-between p-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{email}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCollaborator(email)}
                            className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={createNewForm}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetForm}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Vider
            </Button>
            <Button 
              size="sm" 
              onClick={saveForm}
              disabled={saveFormMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {saveFormMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>

        {/* Tutorial Dialog */}
        <TutorialDialog
          isOpen={showTutorial}
          onClose={closeTutorial}
          step={tutorialStep}
          onNextStep={nextTutorialStep}
          onPrevStep={prevTutorialStep}
          totalSteps={7}
          isDarkMode={isDarkMode}
        />
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div className={`w-80 border-r overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="p-4">
            <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Composants Standards</h3>
            <div className="space-y-4">
              {Object.entries(ComponentCategories).map(([categoryKey, category]) => (
                <div key={categoryKey} className="space-y-2">
                  <div className={`flex items-center space-x-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    {Object.entries(category.components).map(([type, config]) => (
                      <DraggableComponent
                        key={type}
                        componentType={type}
                        label={(config as any).label}
                        icon={(config as any).icon}
                        color={(config as any).color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {customComponents.length > 0 && (
              <>
                <Separator className="my-4" />
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Composants Personnalisés</h3>
                <div className="grid grid-cols-1 gap-2">
                  {customComponents.map((component) => (
                    <div
                      key={component.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('componentType', component.id);
                      }}
                      className={`p-3 border-2 border-dashed rounded-lg cursor-move transition-all hover:shadow-md ${
                        isDarkMode 
                          ? `bg-${component.color}-900/20 border-${component.color}-600 hover:border-${component.color}-500`
                          : `bg-${component.color}-50 border-${component.color}-200 hover:border-${component.color}-400`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded bg-${component.color}-600 flex items-center justify-center`}>
                            <Package className="w-3 h-3 text-white" />
                          </div>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {component.label}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          CUSTOM
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className={`rounded-lg border h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : ''}`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Zone de construction</h3>
            </div>
            <div 
              ref={formBuilderRef}
              className="p-6"
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
                <div className={`text-center py-16 border-2 border-dashed rounded-lg ${isDarkMode ? 'text-gray-400 border-gray-600' : 'text-gray-400 border-gray-300'}`}>
                  <Type className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Commencez à construire</p>
                  <p className="text-sm">Glissez des composants ici pour créer votre formulaire</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.fields.map((field) => (
                    <FieldComponent
                      key={field.Id}
                      field={field}
                      onSelect={() => setSelectedField(field)}
                      onRemove={() => removeField(field.Id)}
                      isSelected={selectedField?.Id === field.Id}
                      addField={addField}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`w-80 border-l overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <Tabs defaultValue="properties" className="h-full">
            <TabsList className={`grid w-full grid-cols-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
              <TabsTrigger value="properties" className={isDarkMode ? 'data-[state=active]:bg-gray-600 text-gray-300' : ''}>Propriétés</TabsTrigger>
              <TabsTrigger value="json" className={isDarkMode ? 'data-[state=active]:bg-gray-600 text-gray-300' : ''}>JSON</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="h-full">
              {selectedField ? (
                <PropertiesPanel
                  field={selectedField}
                  onUpdate={(updates) => updateFieldInFormData(selectedField.Id, updates)}
                />
              ) : (
                <div className={`p-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez un composant pour voir ses propriétés</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="json" className="h-full p-4">
              <JsonValidator formData={formData} customComponents={customComponents} isDarkMode={isDarkMode} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}