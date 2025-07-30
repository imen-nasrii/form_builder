import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar, Grid3X3, Search, Type, CheckSquare, List, Database, Settings, Table, ArrowRight, Hash, BarChart3 } from 'lucide-react';

// Types extraits des fichiers JSON
export type ComponentType = 
  | 'TEXT'
  | 'GRIDLKP'
  | 'LSTLKP' 
  | 'DATEPKR'
  | 'DATEPICKER'
  | 'SELECT'
  | 'CHECKBOX'
  | 'RADIOGRP'
  | 'NUMERIC'
  | 'GRID'
  | 'DIALOG'
  | 'GROUP'
  | 'LABEL'
  | 'FILEUPLOAD';

export interface ComponentProperty {
  id: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'datamodel-columns';
  dataType?: 'Chaîne de caractères' | 'Booléen' | 'Nombre' | 'Objet' | 'Tableau d\'Objets';
  options?: string[];
  defaultValue?: any;
  description?: string;
}

export interface FormComponent {
  Id: string;
  Type: ComponentType;
  Label: string;
  DataField?: string;
  Entity?: string;
  Width?: string;
  Spacing?: string;
  Required?: boolean;
  Inline?: boolean;
  Outlined?: boolean;
  Value?: any;
  // Propriétés spécifiques GRIDLKP/LSTLKP
  KeyColumn?: string;
  LoadDataInfo?: {
    DataModel: string;
    ColumnsDefinition: Array<{
      DataField: string;
      Caption?: string;
      DataType: string;
      Visible?: boolean;
      ExcludeFromGrid?: boolean;
    }>;
  };
  ItemInfo?: {
    MainProperty: string;
    DescProperty: string;
    ShowDescription: boolean;
  };
  // Propriétés SELECT
  OptionValues?: Record<string, string>;
  UserIntKey?: boolean;
  // Propriétés conditionnelles
  EnabledWhen?: {
    LogicalOperator?: 'AND' | 'OR';
    Conditions: Array<{
      RightField?: string;
      VariableId?: string;
      Operator: string;
      Value?: any;
      ValueType?: string;
    }>;
  };
  VisibleWhen?: {
    LogicalOperator?: 'AND' | 'OR';
    Conditions: Array<{
      RightField?: string;
      VariableId?: string;
      Operator: string;
      Value?: any;
      ValueType?: string;
    }>;
  };
  // Validations
  Validations?: Array<{
    Id: string;
    Type: 'ERROR' | 'WARNING' | string;
    CondExpression?: {
      LogicalOperator?: 'AND' | 'OR';
      Conditions: Array<{
        RightField?: string;
        VariableId?: string;
        Operator: string;
        Value?: any;
        ValueType?: string;
      }>;
    };
  }>;
  // GROUP spécifique
  isGroup?: boolean;
  ChildFields?: FormComponent[];
  // GRID spécifique
  RecordActions?: Array<{
    id: string;
    Label: string;
    UpdateVarValues?: Array<{
      Name: string;
      Value?: any;
      linkTo?: string;
      linkToProperty?: string;
      linkFrom?: string;
      linkFromProperty?: string;
    }>;
  }>;
  ColumnDefinitions?: Array<{
    DataField: string;
    Caption: string;
    DataType: string;
  }>;
  Endpoint?: string;
  EntityKeyField?: string;
  Events?: Array<{
    id: string;
    UpdateVarValues?: Array<{
      Name: string;
      Value?: any;
      linkTo?: string;
      linkToProperty?: string;
      linkFrom?: string;
      linkFromProperty?: string;
    }>;
  }>;
  // NUMERIC spécifique
  EndpointOnchange?: boolean;
  EndpointDepend?: {
    Conditions: Array<{
      RightField: string;
      Operator: string;
    }>;
  };
  RequestedFields?: string[];
  FromDBWhen?: {
    LogicalOperator?: 'AND' | 'OR';
    Conditions: Array<{
      RightField: string;
      Operator: string;
    }>;
  };
  Enabled?: boolean;
  // CHECKBOX spécifique
  CheckboxValue?: boolean;
}

// Définition des catégories et composants selon les spécifications Excel
export const ComponentCategories = {
  'Lookup Components': [
    {
      type: 'GRIDLKP' as ComponentType,
      label: 'Grid Lookup',
      icon: Grid3X3,
      description: 'Grid-based data lookup with search functionality'
    },
    {
      type: 'LSTLKP' as ComponentType,
      label: 'List Lookup',
      icon: Search,
      description: 'List-based data lookup with filtering'
    }
  ],
  'Date & Time': [
    {
      type: 'DATEPICKER' as ComponentType,
      label: 'Date Picker',
      icon: Calendar,
      description: 'Date selection with validation rules'
    },
    {
      type: 'DATEPKR' as ComponentType,
      label: 'Date Picker Alt',
      icon: Calendar,
      description: 'Alternative date picker with conditional logic'
    }
  ],
  'Selection Controls': [
    {
      type: 'SELECT' as ComponentType,
      label: 'Select Dropdown',
      icon: List,
      description: 'Dropdown with option values and user int key support'
    },
    {
      type: 'CHECKBOX' as ComponentType,
      label: 'Checkbox',
      icon: CheckSquare,
      description: 'Boolean checkbox with conditional enabling'
    },
    {
      type: 'RADIOGRP' as ComponentType,
      label: 'Radio Group',
      icon: Settings,
      description: 'Radio button group with option values'
    }
  ],
  'Container & Layout': [
    {
      type: 'GROUP' as ComponentType,
      label: 'Group Container',
      icon: Database,
      description: 'Container with child fields and spacing control'
    }
  ]
};

// Propriétés communes à tous les composants
export const CommonProperties: ComponentProperty[] = [
  {
    id: 'Id',
    label: 'Component ID',
    type: 'text',
    defaultValue: '',
    description: 'Unique identifier for the component'
  },
  {
    id: 'Label',
    label: 'Label Text',
    type: 'text',
    defaultValue: '',
    description: 'Display label for the component'
  },
  {
    id: 'DataField',
    label: 'Data Field',
    type: 'text',
    defaultValue: '',
    description: 'Database field name'
  },
  {
    id: 'Entity',
    label: 'Entity/Table',
    type: 'text',
    defaultValue: '',
    description: 'Database table or entity name'
  },
  {
    id: 'Width',
    label: 'Width',
    type: 'text',
    defaultValue: '100%',
    description: 'Component width (px, %, etc.)'
  },
  {
    id: 'Spacing',
    label: 'Spacing',
    type: 'text',
    defaultValue: '4',
    description: 'Spacing around component'
  },
  {
    id: 'Required',
    label: 'Required',
    type: 'boolean',
    defaultValue: false,
    description: 'Mark field as required'
  },
  {
    id: 'Inline',
    label: 'Inline Layout',
    type: 'boolean',
    defaultValue: false,
    description: 'Display inline with other components'
  },
  {
    id: 'Outlined',
    label: 'Outlined Style',
    type: 'boolean',
    defaultValue: false,
    description: 'Use outlined visual style'
  }
];

// Excel-based component properties matching exact specifications
export const ComponentSpecificProperties: Record<ComponentType, ComponentProperty[]> = {
  'TEXT': [
    {
      id: 'placeholder',
      label: 'Placeholder',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Placeholder text'
    },
    {
      id: 'maxLength',
      label: 'Max Length',
      type: 'number',
      dataType: 'Chaîne de caractères',
      defaultValue: 255,
      description: 'Maximum character length'
    },
    {
      id: 'minLength',
      label: 'Min Length',
      type: 'number',
      dataType: 'Booléen',
      defaultValue: 0,
      description: 'Minimum character length'
    }
  ],
  'NUMERIC': [
    {
      id: 'EndpointOnchange',
      label: 'Endpoint On Change',
      type: 'boolean',
      dataType: 'Chaîne de caractères',
      defaultValue: false,
      description: 'Call endpoint when value changes'
    },
    {
      id: 'Enabled',
      label: 'Enabled',
      type: 'boolean',
      dataType: 'Chaîne de caractères',
      defaultValue: true,
      description: 'Enable or disable the field'
    }
  ],
  'GRIDLKP': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Identifiant unique du champ.'
    },
    {
      id: 'label',
      label: 'Label',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Libellé affiché du champ.'
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si le champ doit être affiché en ligne.'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '32',
      description: 'Largeur du champ (ex: "32")'
    },
    {
      id: 'KeyColumn',
      label: 'Key Column',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Colonne clé dans le modèle de données pour la recherche'
    },
    {
      id: 'ItemInfo_MainProperty',
      label: 'Main Property',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Propriété principale à afficher pour l\'élément'
    },
    {
      id: 'ItemInfo_DescProperty',
      label: 'Description Property',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Propriété contenant la description de l\'élément'
    },
    {
      id: 'ItemInfo_ShowDescription',
      label: 'Show Description',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: true,
      description: 'Indique si la description doit être affichée'
    },
    {
      id: 'LoadDataInfo_DataModel',
      label: 'LoadDataInfo - DataModel',
      type: 'select',
      dataType: 'Chaîne de caractères',
      options: ['ACCADJ', 'BUYTYP', 'PRIMNT', 'SRCMNT', 'BUYLONG', 'Custom Model'],
      defaultValue: '',
      description: 'Sélectionner le modèle MFact à charger pour les données'
    },
    {
      id: 'LoadDataInfo_ColumnsDefinition',
      label: 'LoadDataInfo - ColumnsDefinition',
      type: 'datamodel-columns',
      dataType: 'Tableau d\'Objets',
      defaultValue: '[]',
      description: 'Configuration des colonnes: DataField, Caption, DataType, Visible'
    }
  ],
  'LSTLKP': [
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Chaîne de caractères',
      defaultValue: false,
      description: 'Indique si le champ doit être affiché en ligne'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '32',
      description: 'Largeur du champ (ex: "32")'
    },
    {
      id: 'KeyColumn',
      label: 'Key Column',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Colonne clé dans le modèle de données pour la liste'
    },
    {
      id: 'LoadDataInfo_DataModel',
      label: 'Data Model',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Nom du modèle de données'
    },
    {
      id: 'LoadDataInfo_ColumnsDefinition',
      label: 'Columns Definition',
      type: 'textarea',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Définit les colonnes de la liste (JSON)'
    },
    {
      id: 'ItemInfo_MainProperty',
      label: 'Main Property',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Propriété principale à afficher pour l\'élément'
    },
    {
      id: 'ItemInfo_DescProperty',
      label: 'Description Property',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Propriété contenant la description de l\'élément'
    },
    {
      id: 'ItemInfo_ShowDescription',
      label: 'Show Description',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: true,
      description: 'Indique si la description doit être affichée'
    }
  ],
  'SELECT': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Identifiant unique du champ.'
    },
    {
      id: 'label',
      label: 'Label',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Libellé affiché du champ.'
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si le champ doit être affiché en ligne.'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '32',
      description: 'Largeur du champ (ex: "32").'
    },
    {
      id: 'required',
      label: 'Required',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si le champ est obligatoire.'
    },
    {
      id: 'Outlined',
      label: 'Outlined',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si la sélection doit avoir un style "outlined".'
    },
    {
      id: 'UserIntKey',
      label: 'UserIntKey',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Suggère si les valeurs d\'options sont des clés entières définies par l\'utilisateur.'
    },
    {
      id: 'OptionValues',
      label: 'OptionValues',
      type: 'textarea',
      dataType: 'Objet',
      defaultValue: '{}',
      description: 'Paires clé-valeur pour les options de la liste déroulante.'
    }
  ],
  'DATEPICKER': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Identifiant unique du champ.'
    },
    {
      id: 'label',
      label: 'Label',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Libellé affiché du champ.'
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si le champ doit être affiché en ligne.'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '32',
      description: 'Largeur du champ (ex: "32").'
    },
    {
      id: 'Spacing',
      label: 'Spacing',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '30',
      description: 'Espacement autour du champ (ex: "30").'
    },
    {
      id: 'required',
      label: 'Required',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si le champ est obligatoire.'
    },
    {
      id: 'Validations',
      label: 'Validations',
      type: 'textarea',
      dataType: 'Tableau d\'Objets',
      defaultValue: '[]',
      description: 'Définit les règles de validation.'
    }
  ],
  'DATEPKR': [
    {
      id: 'Spacing',
      label: 'Spacing',
      type: 'text',
      dataType: 'Booléen',
      defaultValue: '0',
      description: 'Espacement autour du champ (ex: "0")'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '25',
      description: 'Largeur du champ (ex: "25")'
    },
    {
      id: 'EnabledWhen',
      label: 'Enabled When',
      type: 'textarea',
      dataType: 'Chaîne de caractères',
      defaultValue: '{}',
      description: 'Définit les conditions d\'activation du champ (JSON)'
    },
    {
      id: 'Validations',
      label: 'Validations',
      type: 'textarea',
      dataType: 'Chaîne de caractères',
      defaultValue: '[]',
      description: 'Définit les règles de validation (JSON)'
    }
  ],
  'CHECKBOX': [
    {
      id: 'CheckboxValue',
      label: 'Checkbox Value',
      type: 'boolean',
      dataType: 'Chaîne de caractères',
      defaultValue: true,
      description: 'Valeur du champ lorsqu\'il est coché'
    },
    {
      id: 'spacing',
      label: 'Spacing',
      type: 'number',
      dataType: 'Chaîne de caractères',
      defaultValue: 0,
      description: 'Espacement autour de la case à cocher'
    },
    {
      id: 'Value',
      label: 'Default Value',
      type: 'boolean',
      dataType: 'Chaîne de caractères',
      defaultValue: false,
      description: 'État initial ou par défaut de la case à cocher'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '600px',
      description: 'Largeur du composant case à cocher'
    },
    {
      id: 'EnabledWhen',
      label: 'Enabled When',
      type: 'textarea',
      dataType: 'Chaîne de caractères',
      defaultValue: '{}',
      description: 'Définit les conditions d\'activation du champ (JSON)'
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si la case à cocher doit être affichée en ligne'
    },
    {
      id: 'required',
      label: 'Required',
      type: 'boolean',
      dataType: 'Nombre',
      defaultValue: false,
      description: 'Indique si la case à cocher est obligatoire'
    }
  ],
  'GROUP': [
    {
      id: 'isGroup',
      label: 'Is Group',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: true,
      description: 'Indique que le champ est un groupe'
    },
    {
      id: 'Spacing',
      label: 'Spacing',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '0',
      description: 'Espacement autour du groupe (ex: "0")'
    },
    {
      id: 'ChildFields',
      label: 'Child Fields',
      type: 'textarea',
      dataType: 'Tableau d\'Objets',
      defaultValue: '[]',
      description: 'Définitions des champs enfants du groupe (JSON)'
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si le groupe doit être affiché en ligne'
    },
    {
      id: 'required',
      label: 'Required',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si des champs à l\'intérieur du groupe sont obligatoires'
    }
  ],
  'RADIOGRP': [
    {
      id: 'value',
      label: 'Default Value',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Valeur sélectionnée par défaut'
    },
    {
      id: 'Spacing',
      label: 'Spacing',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '0',
      description: 'Espacement autour du groupe (ex: "0")'
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '100',
      description: 'Largeur du groupe de boutons radio (ex: "100", "600px")'
    },
    {
      id: 'OptionValues',
      label: 'Option Values',
      type: 'textarea',
      dataType: 'Objet',
      defaultValue: '{}',
      description: 'Paires clé-valeur pour les options des boutons radio (JSON)'
    }
  ],
  'GRID': [
    {
      id: 'EntitykeyField',
      label: 'Entity Key Field',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Key field in the entity'
    }
  ],
  'DIALOG': [
    {
      id: 'title',
      label: 'Dialog Title',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Title of the dialog'
    }
  ],
  'LABEL': [
    {
      id: 'fontWeight',
      label: 'Font Weight',
      type: 'select',
      dataType: 'Chaîne de caractères',
      defaultValue: 'normal',
      options: ['normal', 'bold', 'lighter'],
      description: 'Font weight of the label'
    }
  ],
  'FILEUPLOAD': [
    {
      id: 'acceptedTypes',
      label: 'Accepted File Types',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '*',
      description: 'Accepted file types (e.g., .pdf,.jpg,.png)'
    }
  ]
};

// Composant de rendu pour chaque type
export function renderFormComponent(component: FormComponent, isDarkMode: boolean = false) {
  const baseClasses = `w-full p-3 border rounded-lg transition-all duration-200 ${
    isDarkMode 
      ? 'bg-gray-800 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  switch (component.Type) {
    case 'TEXT':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input 
            className={baseClasses}
            placeholder={component.Label}
            defaultValue={component.Value || ''}
          />
        </div>
      );

    case 'NUMERIC':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input 
            type="number"
            className={baseClasses}
            placeholder={component.Label}
            defaultValue={component.Value || ''}
            disabled={component.Enabled === false}
          />
        </div>
      );

    case 'GRIDLKP':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className="relative">
            <Input 
              className={`${baseClasses} pr-10`}
              placeholder={`Select ${component.Label}...`}
              defaultValue={component.Value || ''}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {component.LoadDataInfo && (
            <div className="text-xs text-gray-500 mt-1">
              Source: {component.LoadDataInfo.DataModel}
            </div>
          )}
        </div>
      );

    case 'LSTLKP':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select defaultValue={component.Value || ''}>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder={`Select ${component.Label}...`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );

    case 'DATEPKR':
    case 'DATEPICKER':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input 
            type="date"
            className={baseClasses}
            defaultValue={component.Value || ''}
          />
        </div>
      );

    case 'SELECT':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select defaultValue={component.Value || ''}>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder={`Select ${component.Label}...`} />
            </SelectTrigger>
            <SelectContent>
              {component.OptionValues && Object.entries(component.OptionValues).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'CHECKBOX':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={component.Id}
            defaultChecked={component.CheckboxValue || component.Value || false}
          />
          <Label 
            htmlFor={component.Id}
            className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}
          >
            {component.Label}
          </Label>
        </div>
      );

    case 'RADIOGRP':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
          </Label>
          <div className="space-y-2">
            {component.OptionValues && Object.entries(component.OptionValues).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name={component.Id} 
                  value={key}
                  defaultChecked={component.Value === key}
                  className="text-blue-600"
                />
                <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {value}
                </Label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'GRID':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
          </Label>
          <div className={`${baseClasses} min-h-[200px] p-4`}>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">Data Grid</span>
                <div className="space-x-2">
                  {component.RecordActions?.map(action => (
                    <Button key={action.id} size="sm" variant="outline">
                      {action.Label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Entity: {component.Entity} | Endpoint: {component.Endpoint}
              </div>
            </div>
          </div>
        </div>
      );

    case 'LABEL':
      return (
        <div className="space-y-1">
          <Label className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {component.Label}
          </Label>
          <div className={`p-2 rounded ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
            {component.Value || 'Display Value'}
          </div>
        </div>
      );

    case 'GROUP':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
          </Label>
          <div className={`${baseClasses} space-y-4`}>
            {component.ChildFields?.map((child, index) => (
              <div key={child.Id || index}>
                {renderFormComponent(child, isDarkMode)}
              </div>
            ))}
          </div>
        </div>
      );

    case 'DIALOG':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label} (Dialog)
          </Label>
          <div className={`${baseClasses} border-dashed`}>
            <div className="text-center text-gray-500 py-4">
              Dialog Container
              {component.ChildFields && (
                <div className="mt-2 text-xs">
                  Contains {component.ChildFields.length} fields
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 'FILEUPLOAD':
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label}
            {component.Required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className={`${baseClasses} border-dashed text-center py-8`}>
            <ArrowRight className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">Click to upload or drag and drop</p>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {component.Label} ({component.Type})
          </Label>
          <div className={`${baseClasses} text-center py-4 text-gray-500`}>
            Unsupported component type: {component.Type}
          </div>
        </div>
      );
  }
}

export default {
  ComponentCategories,
  CommonProperties,
  ComponentSpecificProperties,
  renderFormComponent
};