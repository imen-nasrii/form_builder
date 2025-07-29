// Excel-based component properties matching exact specifications
export const EXCEL_COMPONENT_PROPERTIES = {
  'GRIDLKP': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Identifiant unique du champ.',
      required: true
    },
    {
      id: 'label',
      label: 'Label',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Libellé affiché du champ.',
      required: true
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si le champ doit être affiché en ligne.',
      required: true
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '32',
      description: 'Largeur du champ (ex: "32").',
      required: true
    },
    {
      id: 'KeyColumn',
      label: 'KeyColumn',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Colonne clé dans le modèle de données pour la recherche.',
      required: true
    },
    {
      id: 'ItemInfo_MainProperty',
      label: 'Main Property',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Propriété principale à afficher pour l\'élément.',
      required: true
    },
    {
      id: 'ItemInfo_DescProperty',
      label: 'Desc Property',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Propriété contenant la description de l\'élément.',
      required: true
    },
    {
      id: 'ItemInfo_ShowDescription',
      label: 'Show Description',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: true,
      description: 'Indique si la description doit être affichée.',
      required: true
    },
    {
      id: 'LoadDataInfo_DataModel',
      label: 'Data Model',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Nom du modèle de données.',
      required: true
    },
    {
      id: 'LoadDataInfo_ColumnsDefinition',
      label: 'Columns Definition',
      type: 'textarea',
      dataType: 'Tableau d\'Objets',
      defaultValue: '[{"DataField":"","Caption":"","DataType":"STRING","Visible":true}]',
      description: 'Définit les colonnes de la grille de recherche.',
      required: true
    }
  ],
  'LSTLKP': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Identifiant unique du champ.',
      required: true
    },
    {
      id: 'label',
      label: 'Label',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Libellé affiché du champ.',
      required: true
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si le champ doit être affiché en ligne.',
      required: true
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '32',
      description: 'Largeur du champ (ex: "32").',
      required: true
    },
    {
      id: 'KeyColumn',
      label: 'KeyColumn',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Colonne clé dans le modèle de données pour la liste.',
      required: true
    },
    {
      id: 'LoadDataInfo_DataModel',
      label: 'Data Model',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Nom du modèle de données.',
      required: true
    },
    {
      id: 'LoadDataInfo_ColumnsDefinition',
      label: 'Columns Definition',
      type: 'textarea',
      dataType: 'Tableau d\'Objets',
      defaultValue: '[{"DataField":"","DataType":"STRING"}]',
      description: 'Définit les colonnes de la liste.',
      required: true
    },
    {
      id: 'ItemInfo_MainProperty',
      label: 'Main Property',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Propriété principale à afficher pour l\'élément.',
      required: true
    },
    {
      id: 'ItemInfo_DescProperty',
      label: 'Desc Property',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Propriété contenant la description de l\'élément.',
      required: true
    },
    {
      id: 'ItemInfo_ShowDescription',
      label: 'Show Description',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: true,
      description: 'Indique si la description doit être affichée.',
      required: true
    }
  ],
  'SELECT': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Identifiant unique du champ.',
      required: true
    },
    {
      id: 'label',
      label: 'Label',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Libellé affiché du champ.',
      required: true
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si le champ doit être affiché en ligne.',
      required: true
    },
    {
      id: 'Width',  
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '32',
      description: 'Largeur du champ (ex: "32").',
      required: true
    },
    {
      id: 'required',
      label: 'Required',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si le champ est obligatoire.',
      required: true
    },
    {
      id: 'Outlined',
      label: 'Outlined',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si la sélection doit avoir un style "outlined".',
      required: true
    },
    {
      id: 'UserIntKey',
      label: 'UserIntKey',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Suggère si les valeurs d\'options sont des clés entières définies par l\'utilisateur.',
      required: true
    },
    {
      id: 'OptionValues',
      label: 'OptionValues',
      type: 'textarea',
      dataType: 'Objet',
      defaultValue: '{}',
      description: 'Paires clé-valeur pour les options de la liste déroulante.',
      required: true
    }
  ],
  'DATEPICKER': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Identifiant unique du champ.',
      required: true
    },
    {
      id: 'label',
      label: 'Label',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Libellé affiché du champ.',
      required: true
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si le champ doit être affiché en ligne.',
      required: true
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '32',
      description: 'Largeur du champ (ex: "32").',
      required: true
    },
    {
      id: 'Spacing',
      label: 'Spacing',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '30',
      description: 'Espacement autour du champ (ex: "30").',
      required: true
    },
    {
      id: 'required',
      label: 'Required',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si le champ est obligatoire.',
      required: true
    },
    {
      id: 'Validations',
      label: 'Validations',
      type: 'textarea',
      dataType: 'Tableau d\'Objets',
      defaultValue: '[]',
      description: 'Définit les règles de validation.',
      required: true
    }
  ],
  'GROUP': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Identifiant unique du groupe.',
      required: true
    },
    {
      id: 'label',
      label: 'Label',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Libellé affiché du groupe.',
      required: true
    },
    {
      id: 'isGroup',
      label: 'Is Group',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: true,
      description: 'Indique que le champ est un groupe.',
      required: true
    },
    {
      id: 'Spacing',
      label: 'Spacing',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '0',
      description: 'Espacement autour du groupe (ex: "0").',
      required: true
    },
    {
      id: 'ChildFields',
      label: 'Child Fields',
      type: 'textarea',
      dataType: 'Tableau d\'Objets',
      defaultValue: '[]',
      description: 'Définitions des champs enfants du groupe.',
      required: true
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si le groupe doit être affiché en ligne.',
      required: false
    },
    {
      id: 'required',
      label: 'Required',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si des champs à l\'intérieur du groupe sont obligatoires.',
      required: false
    }
  ],
  'RADIOGRP': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Identifiant unique du groupe de boutons radio.',
      required: true
    },
    {
      id: 'value',
      label: 'Value',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Valeur sélectionnée par défaut.',
      required: true
    },
    {
      id: 'Spacing',
      label: 'Spacing',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '0',
      description: 'Espacement autour du groupe (ex: "0").',
      required: true
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '100',
      description: 'Largeur du groupe de boutons radio (ex: "100", "600px").',
      required: true
    },
    {
      id: 'OptionValues',
      label: 'OptionValues',
      type: 'textarea',
      dataType: 'Objet',
      defaultValue: '{}',
      description: 'Paires clé-valeur pour les options des boutons radio.',
      required: true
    },
    {
      id: 'label',
      label: 'Label',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Libellé affiché du groupe de boutons radio.',
      required: false
    }
  ],
  'DATEPKR': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Identifiant unique du champ.',
      required: true
    },
    {
      id: 'label',
      label: 'Label',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Libellé affiché du champ.',
      required: true
    },
    {
      id: 'Spacing',
      label: 'Spacing',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '0',
      description: 'Espacement autour du champ (ex: "0").',
      required: true
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '25',
      description: 'Largeur du champ (ex: "25").',
      required: true
    },
    {
      id: 'EnabledWhen',
      label: 'Enabled When',
      type: 'textarea',
      dataType: 'Objet',
      defaultValue: '{"Conditions":[{"RightField":"","Operator":"NEQ","Value":"","ValueType":"STRING"}]}',
      description: 'Définit les conditions d\'activation du champ.',
      required: true
    },
    {
      id: 'Validations',
      label: 'Validations',
      type: 'textarea',
      dataType: 'Tableau d\'Objets',
      defaultValue: '[]',
      description: 'Définit les règles de validation.',
      required: true
    }
  ],
  'CHECKBOX': [
    {
      id: 'Id',
      label: 'Id',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Identifiant unique de la case à cocher.',
      required: true
    },
    {
      id: 'label',
      label: 'Label',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '',
      description: 'Libellé affiché à côté de la case à cocher.',
      required: true
    },
    {
      id: 'CheckboxValue',
      label: 'Checkbox Value',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: true,
      description: 'Valeur du champ lorsqu\'il est coché (ex: true).',
      required: true
    },
    {
      id: 'spacing',
      label: 'Spacing',
      type: 'number',
      dataType: 'Nombre',
      defaultValue: 0,
      description: 'Espacement autour de la case à cocher (ex: 0).',
      required: true
    },
    {
      id: 'Value',
      label: 'Value',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'État initial ou par défaut de la case à cocher (ex: false).',
      required: true
    },
    {
      id: 'Width',
      label: 'Width',
      type: 'text',
      dataType: 'Chaîne de caractères',
      defaultValue: '600px',
      description: 'Largeur du composant case à cocher (ex: "600px").',
      required: true
    },
    {
      id: 'EnabledWhen',
      label: 'Enabled When',
      type: 'textarea',
      dataType: 'Objet',
      defaultValue: '{"Conditions":[{"RightField":"","Operator":"ISF"}]}',
      description: 'Définit les conditions d\'activation du champ.',
      required: true
    },
    {
      id: 'Inline',
      label: 'Inline',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si la case à cocher doit être affichée en ligne.',
      required: false
    },
    {
      id: 'required',
      label: 'Required',
      type: 'boolean',
      dataType: 'Booléen',
      defaultValue: false,
      description: 'Indique si la case à cocher est obligatoire.',
      required: false
    }
  ]
};