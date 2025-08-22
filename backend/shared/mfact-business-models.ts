/**
 * MFact Business Models - Comprehensive data models for financial system entities
 * These models represent actual business data structures used in MFact systems
 */

export interface MFactBusinessModel {
  id: string;
  name: string;
  description: string;
  category: BusinessModelCategory;
  tables: BusinessTable[];
  relationships: BusinessRelationship[];
  validations: ModelValidation[];
  metadata: BusinessModelMetadata;
}

export interface BusinessTable {
  name: string;
  label: string;
  description: string;
  fields: BusinessField[];
  primaryKey: string;
  indexes: TableIndex[];
  permissions: TablePermissions;
}

export interface BusinessField {
  name: string;
  label: string;
  type: FieldDataType;
  length?: number;
  precision?: number;
  scale?: number;
  required: boolean;
  defaultValue?: any;
  validation?: FieldValidation;
  lookupTable?: string;
  description: string;
}

export interface BusinessRelationship {
  name: string;
  fromTable: string;
  toTable: string;
  fromField: string;
  toField: string;
  type: RelationshipType;
  cardinality: Cardinality;
}

export interface ModelValidation {
  id: string;
  name: string;
  type: ValidationType;
  tables: string[];
  condition: string;
  message: string;
  severity: ValidationSeverity;
}

export interface BusinessModelMetadata {
  version: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  documentation?: string;
}

export interface TableIndex {
  name: string;
  fields: string[];
  unique: boolean;
  clustered: boolean;
}

export interface TablePermissions {
  read: string[];
  write: string[];
  delete: string[];
  admin: string[];
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minValue?: number;
  maxValue?: number;
  customRules?: string[];
}

export type BusinessModelCategory = 
  | 'ACCOUNTING' 
  | 'INVENTORY' 
  | 'PURCHASING' 
  | 'SALES' 
  | 'FINANCIAL' 
  | 'REPORTING' 
  | 'MASTER_DATA'
  | 'CONFIGURATION';

export type FieldDataType = 
  | 'VARCHAR' 
  | 'CHAR' 
  | 'TEXT' 
  | 'INTEGER' 
  | 'DECIMAL' 
  | 'FLOAT' 
  | 'DATE' 
  | 'DATETIME' 
  | 'TIME' 
  | 'BOOLEAN' 
  | 'BLOB' 
  | 'JSON';

export type RelationshipType = 'FOREIGN_KEY' | 'LOOKUP' | 'ASSOCIATION';
export type Cardinality = 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY';
export type ValidationType = 'BUSINESS_RULE' | 'DATA_INTEGRITY' | 'SECURITY' | 'AUDIT';
export type ValidationSeverity = 'ERROR' | 'WARNING' | 'INFO';

// Predefined MFact Business Models
export const MFACT_BUSINESS_MODELS: MFactBusinessModel[] = [
  {
    id: 'ACCADJ',
    name: 'Account Adjustment',
    description: 'Accounting adjustment and correction management system',
    category: 'ACCOUNTING',
    tables: [
      {
        name: 'ACCADJ_HEADER',
        label: 'Adjustment Header',
        description: 'Main adjustment document header',
        primaryKey: 'ADJ_ID',
        indexes: [
          { name: 'IDX_ACCADJ_DATE', fields: ['ADJ_DATE'], unique: false, clustered: false },
          { name: 'IDX_ACCADJ_STATUS', fields: ['STATUS'], unique: false, clustered: false }
        ],
        permissions: {
          read: ['ACCOUNTANT', 'AUDITOR', 'MANAGER'],
          write: ['ACCOUNTANT', 'MANAGER'],
          delete: ['MANAGER'],
          admin: ['SYSTEM_ADMIN']
        },
        fields: [
          {
            name: 'ADJ_ID',
            label: 'Adjustment ID',
            type: 'VARCHAR',
            length: 20,
            required: true,
            description: 'Unique adjustment identifier'
          },
          {
            name: 'ADJ_DATE',
            label: 'Adjustment Date',
            type: 'DATE',
            required: true,
            description: 'Date of the adjustment'
          },
          {
            name: 'DESCRIPTION',
            label: 'Description',
            type: 'VARCHAR',
            length: 255,
            required: true,
            description: 'Adjustment description'
          },
          {
            name: 'TOTAL_AMOUNT',
            label: 'Total Amount',
            type: 'DECIMAL',
            precision: 15,
            scale: 2,
            required: true,
            description: 'Total adjustment amount'
          },
          {
            name: 'STATUS',
            label: 'Status',
            type: 'VARCHAR',
            length: 20,
            required: true,
            defaultValue: 'DRAFT',
            description: 'Adjustment status (DRAFT, APPROVED, POSTED)'
          },
          {
            name: 'CREATED_BY',
            label: 'Created By',
            type: 'VARCHAR',
            length: 50,
            required: true,
            description: 'User who created the adjustment'
          }
        ]
      },
      {
        name: 'ACCADJ_LINES',
        label: 'Adjustment Lines',
        description: 'Detailed adjustment line items',
        primaryKey: 'LINE_ID',
        indexes: [
          { name: 'IDX_ACCADJ_LINES_HEADER', fields: ['ADJ_ID'], unique: false, clustered: false }
        ],
        permissions: {
          read: ['ACCOUNTANT', 'AUDITOR', 'MANAGER'],
          write: ['ACCOUNTANT', 'MANAGER'],
          delete: ['MANAGER'],
          admin: ['SYSTEM_ADMIN']
        },
        fields: [
          {
            name: 'LINE_ID',
            label: 'Line ID',
            type: 'INTEGER',
            required: true,
            description: 'Unique line identifier'
          },
          {
            name: 'ADJ_ID',
            label: 'Adjustment ID',
            type: 'VARCHAR',
            length: 20,
            required: true,
            description: 'Reference to adjustment header'
          },
          {
            name: 'ACCOUNT_CODE',
            label: 'Account Code',
            type: 'VARCHAR',
            length: 20,
            required: true,
            lookupTable: 'CHART_OF_ACCOUNTS',
            description: 'General ledger account code'
          },
          {
            name: 'DEBIT_AMOUNT',
            label: 'Debit Amount',
            type: 'DECIMAL',
            precision: 15,
            scale: 2,
            required: false,
            description: 'Debit amount for this line'
          },
          {
            name: 'CREDIT_AMOUNT',
            label: 'Credit Amount',
            type: 'DECIMAL',
            precision: 15,
            scale: 2,
            required: false,
            description: 'Credit amount for this line'
          }
        ]
      }
    ],
    relationships: [
      {
        name: 'ACCADJ_HEADER_LINES',
        fromTable: 'ACCADJ_LINES',
        toTable: 'ACCADJ_HEADER',
        fromField: 'ADJ_ID',
        toField: 'ADJ_ID',
        type: 'FOREIGN_KEY',
        cardinality: 'MANY_TO_ONE'
      }
    ],
    validations: [
      {
        id: 'ACCADJ_BALANCED',
        name: 'Adjustment Must Be Balanced',
        type: 'BUSINESS_RULE',
        tables: ['ACCADJ_LINES'],
        condition: 'SUM(DEBIT_AMOUNT) = SUM(CREDIT_AMOUNT)',
        message: 'Total debits must equal total credits',
        severity: 'ERROR'
      }
    ],
    metadata: {
      version: '1.0.0',
      author: 'MFact System',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-07-11'),
      tags: ['accounting', 'adjustments', 'financial'],
      documentation: 'Complete accounting adjustment management system'
    }
  },
  
  {
    id: 'BUYTYP',
    name: 'Purchase Type Management',
    description: 'Purchase type classification and management system',
    category: 'PURCHASING',
    tables: [
      {
        name: 'BUYTYP_MASTER',
        label: 'Purchase Types',
        description: 'Master table for purchase type definitions',
        primaryKey: 'BUY_TYPE_ID',
        indexes: [
          { name: 'IDX_BUYTYP_CODE', fields: ['BUY_TYPE_CODE'], unique: true, clustered: false }
        ],
        permissions: {
          read: ['PURCHASER', 'MANAGER', 'AUDITOR'],
          write: ['MANAGER'],
          delete: ['SYSTEM_ADMIN'],
          admin: ['SYSTEM_ADMIN']
        },
        fields: [
          {
            name: 'BUY_TYPE_ID',
            label: 'Purchase Type ID',
            type: 'INTEGER',
            required: true,
            description: 'Unique purchase type identifier'
          },
          {
            name: 'BUY_TYPE_CODE',
            label: 'Type Code',
            type: 'VARCHAR',
            length: 10,
            required: true,
            description: 'Short code for purchase type'
          },
          {
            name: 'BUY_TYPE_NAME',
            label: 'Type Name',
            type: 'VARCHAR',
            length: 100,
            required: true,
            description: 'Full name of purchase type'
          },
          {
            name: 'DESCRIPTION',
            label: 'Description',
            type: 'TEXT',
            required: false,
            description: 'Detailed description of purchase type'
          },
          {
            name: 'APPROVAL_REQUIRED',
            label: 'Approval Required',
            type: 'BOOLEAN',
            required: true,
            defaultValue: false,
            description: 'Whether this purchase type requires approval'
          },
          {
            name: 'MAX_AMOUNT',
            label: 'Maximum Amount',
            type: 'DECIMAL',
            precision: 15,
            scale: 2,
            required: false,
            description: 'Maximum amount for this purchase type'
          },
          {
            name: 'ACTIVE',
            label: 'Active',
            type: 'BOOLEAN',
            required: true,
            defaultValue: true,
            description: 'Whether this purchase type is active'
          }
        ]
      }
    ],
    relationships: [],
    validations: [
      {
        id: 'BUYTYP_UNIQUE_CODE',
        name: 'Purchase Type Code Must Be Unique',
        type: 'DATA_INTEGRITY',
        tables: ['BUYTYP_MASTER'],
        condition: 'UNIQUE(BUY_TYPE_CODE)',
        message: 'Purchase type code must be unique',
        severity: 'ERROR'
      }
    ],
    metadata: {
      version: '1.0.0',
      author: 'MFact System',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-07-11'),
      tags: ['purchasing', 'types', 'classification'],
      documentation: 'Purchase type classification system'
    }
  },

  {
    id: 'PRIMNT',
    name: 'Primary Maintenance',
    description: 'Primary entity maintenance and master data management',
    category: 'MASTER_DATA',
    tables: [
      {
        name: 'PRIMNT_ENTITIES',
        label: 'Primary Entities',
        description: 'Master table for primary business entities',
        primaryKey: 'ENTITY_ID',
        indexes: [
          { name: 'IDX_PRIMNT_CODE', fields: ['ENTITY_CODE'], unique: true, clustered: false },
          { name: 'IDX_PRIMNT_TYPE', fields: ['ENTITY_TYPE'], unique: false, clustered: false }
        ],
        permissions: {
          read: ['USER', 'MANAGER', 'ADMIN'],
          write: ['MANAGER', 'ADMIN'],
          delete: ['ADMIN'],
          admin: ['SYSTEM_ADMIN']
        },
        fields: [
          {
            name: 'ENTITY_ID',
            label: 'Entity ID',
            type: 'INTEGER',
            required: true,
            description: 'Unique entity identifier'
          },
          {
            name: 'ENTITY_CODE',
            label: 'Entity Code',
            type: 'VARCHAR',
            length: 20,
            required: true,
            description: 'Unique entity code'
          },
          {
            name: 'ENTITY_NAME',
            label: 'Entity Name',
            type: 'VARCHAR',
            length: 255,
            required: true,
            description: 'Full entity name'
          },
          {
            name: 'ENTITY_TYPE',
            label: 'Entity Type',
            type: 'VARCHAR',
            length: 50,
            required: true,
            description: 'Type classification of entity'
          },
          {
            name: 'STATUS',
            label: 'Status',
            type: 'VARCHAR',
            length: 20,
            required: true,
            defaultValue: 'ACTIVE',
            description: 'Entity status (ACTIVE, INACTIVE, PENDING)'
          },
          {
            name: 'CREATED_DATE',
            label: 'Created Date',
            type: 'DATETIME',
            required: true,
            description: 'Date and time entity was created'
          },
          {
            name: 'MODIFIED_DATE',
            label: 'Modified Date',
            type: 'DATETIME',
            required: false,
            description: 'Date and time entity was last modified'
          }
        ]
      }
    ],
    relationships: [],
    validations: [
      {
        id: 'PRIMNT_VALID_STATUS',
        name: 'Valid Entity Status',
        type: 'DATA_INTEGRITY',
        tables: ['PRIMNT_ENTITIES'],
        condition: 'STATUS IN (\'ACTIVE\', \'INACTIVE\', \'PENDING\')',
        message: 'Entity status must be ACTIVE, INACTIVE, or PENDING',
        severity: 'ERROR'
      }
    ],
    metadata: {
      version: '1.0.0',
      author: 'MFact System',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-07-11'),
      tags: ['master-data', 'entities', 'maintenance'],
      documentation: 'Primary entity maintenance system'
    }
  },

  {
    id: 'SRCMNT',
    name: 'Source Maintenance',
    description: 'Data source configuration and maintenance system',
    category: 'CONFIGURATION',
    tables: [
      {
        name: 'SRCMNT_SOURCES',
        label: 'Data Sources',
        description: 'Configuration table for data sources',
        primaryKey: 'SOURCE_ID',
        indexes: [
          { name: 'IDX_SRCMNT_NAME', fields: ['SOURCE_NAME'], unique: true, clustered: false }
        ],
        permissions: {
          read: ['DEVELOPER', 'ADMIN'],
          write: ['ADMIN'],
          delete: ['SYSTEM_ADMIN'],
          admin: ['SYSTEM_ADMIN']
        },
        fields: [
          {
            name: 'SOURCE_ID',
            label: 'Source ID',
            type: 'INTEGER',
            required: true,
            description: 'Unique source identifier'
          },
          {
            name: 'SOURCE_NAME',
            label: 'Source Name',
            type: 'VARCHAR',
            length: 100,
            required: true,
            description: 'Unique source name'
          },
          {
            name: 'SOURCE_TYPE',
            label: 'Source Type',
            type: 'VARCHAR',
            length: 50,
            required: true,
            description: 'Type of data source (DATABASE, API, FILE, etc.)'
          },
          {
            name: 'CONNECTION_STRING',
            label: 'Connection String',
            type: 'VARCHAR',
            length: 500,
            required: false,
            description: 'Connection string for the data source'
          },
          {
            name: 'CONFIGURATION',
            label: 'Configuration',
            type: 'JSON',
            required: false,
            description: 'JSON configuration for the data source'
          },
          {
            name: 'ACTIVE',
            label: 'Active',
            type: 'BOOLEAN',
            required: true,
            defaultValue: true,
            description: 'Whether this data source is active'
          }
        ]
      }
    ],
    relationships: [],
    validations: [
      {
        id: 'SRCMNT_VALID_TYPE',
        name: 'Valid Source Type',
        type: 'DATA_INTEGRITY',
        tables: ['SRCMNT_SOURCES'],
        condition: 'SOURCE_TYPE IN (\'DATABASE\', \'API\', \'FILE\', \'WEBSERVICE\')',
        message: 'Source type must be DATABASE, API, FILE, or WEBSERVICE',
        severity: 'ERROR'
      }
    ],
    metadata: {
      version: '1.0.0',
      author: 'MFact System',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-07-11'),
      tags: ['configuration', 'data-sources', 'maintenance'],
      documentation: 'Data source configuration system'
    }
  }
];

// Helper functions
export function getBusinessModelById(id: string): MFactBusinessModel | undefined {
  return MFACT_BUSINESS_MODELS.find(model => model.id === id);
}

export function getBusinessModelsByCategory(category: BusinessModelCategory): MFactBusinessModel[] {
  return MFACT_BUSINESS_MODELS.filter(model => model.category === category);
}

export function getTableByName(modelId: string, tableName: string): BusinessTable | undefined {
  const model = getBusinessModelById(modelId);
  return model?.tables.find(table => table.name === tableName);
}

export function getFieldsByTable(modelId: string, tableName: string): BusinessField[] {
  const table = getTableByName(modelId, tableName);
  return table?.fields || [];
}