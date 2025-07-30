// Real MFact Models Parser - Generates column configurations from actual C# model classes
// This file contains the parsed structure from the MfactModels folder

export interface MFactColumn {
  DataField: string;
  Caption: string;
  DataType: 'String' | 'Number' | 'Date' | 'Boolean';
  Visible: boolean;
  Required?: boolean;
  Description?: string;
}

export interface MFactModel {
  name: string;
  displayName: string;
  description: string;
  category: 'Accounting' | 'Purchasing' | 'Finance' | 'Security' | 'General';
  columns: MFactColumn[];
}

// Real model definitions parsed from MfactModels folder
export const REAL_MFACT_MODELS: MFactModel[] = [
  {
    name: 'AATRR',
    displayName: 'Asset Attributes',
    description: 'Asset attribute and distribution management system',
    category: 'Finance',
    columns: [
      { DataField: 'Fund', Caption: 'Fund', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Dist_Date', Caption: 'Distribution Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'Eff_Date', Caption: 'Effective Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'Per_Shar', Caption: 'Per Share', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'Dist_Type', Caption: 'Distribution Type', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Status', Caption: 'Status', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'Entry_Date', Caption: 'Entry Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'User_Id', Caption: 'User ID', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Entry_Time', Caption: 'Entry Time', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Class', Caption: 'Class', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Rec_Date', Caption: 'Record Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'Pay_Date', Caption: 'Payment Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'Ae_Final', Caption: 'AE Final', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Date_Delet', Caption: 'Date Deleted', DataType: 'Date', Visible: false, Required: false },
      { DataField: 'User_Delet', Caption: 'User Deleted', DataType: 'String', Visible: false, Required: false },
      { DataField: 'Time_Delet', Caption: 'Time Deleted', DataType: 'String', Visible: false, Required: false },
      { DataField: 'Hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'AE',
    displayName: 'Account Executives (Brokers)',
    description: 'Broker and account executive information management',
    category: 'General',
    columns: [
      { DataField: 'Broker', Caption: 'Broker', DataType: 'String', Visible: true, Required: true },
      { DataField: 'Name', Caption: 'Name', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Trader', Caption: 'Trader', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Firm', Caption: 'Firm', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Add1', Caption: 'Address 1', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Add2', Caption: 'Address 2', DataType: 'String', Visible: true, Required: false },
      { DataField: 'City', Caption: 'City', DataType: 'String', Visible: true, Required: false },
      { DataField: 'State', Caption: 'State', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Zip', Caption: 'ZIP Code', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Phone', Caption: 'Phone', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Trphon', Caption: 'Trade Phone', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Bkrcom', Caption: 'Broker Commission', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'Owncom', Caption: 'Own Commission', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'Lei', Caption: 'LEI', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'CODES',
    displayName: 'Code Tables',
    description: 'System code table management and reference data',
    category: 'General',
    columns: [
      { DataField: 'code', Caption: 'Code', DataType: 'String', Visible: true, Required: true },
      { DataField: 'id', Caption: 'ID', DataType: 'String', Visible: true, Required: true },
      { DataField: 'desc1', Caption: 'Description', DataType: 'String', Visible: true, Required: false },
      { DataField: 'id2', Caption: 'ID 2', DataType: 'String', Visible: true, Required: false },
      { DataField: 'hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'CURNCY',
    displayName: 'Currencies',
    description: 'Currency master data and exchange rate management',
    category: 'Finance',
    columns: [
      { DataField: 'Currency', Caption: 'Currency', DataType: 'String', Visible: true, Required: true },
      { DataField: 'Name', Caption: 'Name', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Tkr', Caption: 'Ticker', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Symbol', Caption: 'Symbol', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Lcl_M_Decs', Caption: 'Local Money Decimals', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Qty_Decs', Caption: 'Quantity Decimals', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Price_Decs', Caption: 'Price Decimals', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Reciprical', Caption: 'Reciprocal', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Euro_Code', Caption: 'Euro Code', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Euro_Rate', Caption: 'Euro Rate', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'Hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'USERS',
    displayName: 'System Users',
    description: 'User management and permissions system',
    category: 'General',
    columns: [
      { DataField: 'user_id', Caption: 'User ID', DataType: 'String', Visible: true, Required: true },
      { DataField: 'name', Caption: 'Name', DataType: 'String', Visible: true, Required: false },
      { DataField: 'email', Caption: 'Email', DataType: 'String', Visible: true, Required: false },
      { DataField: 'role', Caption: 'Role', DataType: 'String', Visible: true, Required: false },
      { DataField: 'allmenus', Caption: 'All Menus', DataType: 'String', Visible: true, Required: false },
      { DataField: 'glprm', Caption: 'GL Permission', DataType: 'String', Visible: true, Required: false },
      { DataField: 'edittkr', Caption: 'Edit Ticker', DataType: 'String', Visible: true, Required: false },
      { DataField: 'webportal', Caption: 'Web Portal', DataType: 'String', Visible: true, Required: false },
      { DataField: 'checker', Caption: 'Checker', DataType: 'String', Visible: true, Required: false },
      { DataField: 'fails', Caption: 'Failed Attempts', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'ACTDATA',
    displayName: 'Account Data',
    description: 'Account activity data management system',
    category: 'Accounting',
    columns: [
      { DataField: 'Id', Caption: 'ID', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'Source', Caption: 'Source', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Data', Caption: 'Data', DataType: 'String', Visible: true, Required: false, Description: 'CLOB data field' },
      { DataField: 'Entry_Time', Caption: 'Entry Time', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'Hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'ACTYPE',
    displayName: 'Account Type',
    description: 'Account type classification system',
    category: 'Accounting',
    columns: [
      { DataField: 'Actype', Caption: 'Account Type', DataType: 'String', Visible: true, Required: true },
      { DataField: 'Name', Caption: 'Name', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'ADJUST',
    displayName: 'Adjustments',
    description: 'Financial adjustment management and tracking',
    category: 'Accounting',
    columns: [
      { DataField: 'Fund', Caption: 'Fund', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Rule_Id', Caption: 'Rule ID', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Adj_Date', Caption: 'Adjustment Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'Class', Caption: 'Class', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Glxcat', Caption: 'GL Category', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Type', Caption: 'Type', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Value', Caption: 'Value', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'Entry_Time', Caption: 'Entry Time', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'Tkr', Caption: 'Ticker', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Recdate', Caption: 'Record Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'End_Date', Caption: 'End Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'Comments', Caption: 'Comments', DataType: 'String', Visible: true, Required: false },
      { DataField: 'AddedBy', Caption: 'Added By', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Taxlot_Id', Caption: 'Tax Lot ID', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'TRX',
    displayName: 'Transactions',
    description: 'Financial transaction management system',
    category: 'Finance',
    columns: [
      { DataField: 'fund', Caption: 'Fund', DataType: 'String', Visible: true, Required: true },
      { DataField: 'trx_no', Caption: 'Transaction No', DataType: 'String', Visible: true, Required: true },
      { DataField: 'trxdate', Caption: 'Transaction Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'acct_cr', Caption: 'Credit Account', DataType: 'String', Visible: true, Required: false },
      { DataField: 'acct_dr', Caption: 'Debit Account', DataType: 'String', Visible: true, Required: false },
      { DataField: 'datent', Caption: 'Date Entered', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'amount', Caption: 'Amount', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'trx_type', Caption: 'Transaction Type', DataType: 'String', Visible: true, Required: false },
      { DataField: 'revflg', Caption: 'Reversal Flag', DataType: 'String', Visible: true, Required: false },
      { DataField: 'check_num', Caption: 'Check Number', DataType: 'String', Visible: true, Required: false },
      { DataField: 'trxcur_no', Caption: 'Transaction Currency No', DataType: 'String', Visible: true, Required: false },
      { DataField: 'user_id', Caption: 'User ID', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Class', Caption: 'Class', DataType: 'String', Visible: true, Required: false },
      { DataField: 'postdate', Caption: 'Post Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'glxcat', Caption: 'GL Category', DataType: 'String', Visible: true, Required: false },
      { DataField: 'long_short', Caption: 'Long/Short', DataType: 'String', Visible: true, Required: false },
      { DataField: 'hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'SECRTY',
    displayName: 'Securities',
    description: 'Security master data management',
    category: 'Security',
    columns: [
      { DataField: 'tkr', Caption: 'Ticker', DataType: 'String', Visible: true, Required: true },
      { DataField: 'cusip', Caption: 'CUSIP', DataType: 'String', Visible: true, Required: false },
      { DataField: 'sedol', Caption: 'SEDOL', DataType: 'String', Visible: true, Required: false },
      { DataField: 'isin', Caption: 'ISIN', DataType: 'String', Visible: true, Required: false },
      { DataField: 'ric', Caption: 'RIC', DataType: 'String', Visible: true, Required: false },
      { DataField: 'tkr_type', Caption: 'Ticker Type', DataType: 'String', Visible: true, Required: false },
      { DataField: 'seccat', Caption: 'Security Category', DataType: 'String', Visible: true, Required: false },
      { DataField: 'tkr_desc', Caption: 'Description', DataType: 'String', Visible: true, Required: false },
      { DataField: 'exch', Caption: 'Exchange', DataType: 'String', Visible: true, Required: false },
      { DataField: 'lsttrx', Caption: 'Last Transaction', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'lstdiv', Caption: 'Last Dividend', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'secgrp', Caption: 'Security Group', DataType: 'String', Visible: true, Required: false },
      { DataField: 'factor', Caption: 'Factor', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'issuer', Caption: 'Issuer', DataType: 'String', Visible: true, Required: false },
      { DataField: 'country', Caption: 'Country', DataType: 'String', Visible: true, Required: false },
      { DataField: 'currency', Caption: 'Currency', DataType: 'String', Visible: true, Required: false },
      { DataField: 'matdat', Caption: 'Maturity Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'Hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'FNDMAS',
    displayName: 'Fund Master',
    description: 'Fund master data and configuration',
    category: 'Finance',
    columns: [
      { DataField: 'Fund', Caption: 'Fund', DataType: 'String', Visible: true, Required: true },
      { DataField: 'Acnam1', Caption: 'Account Name 1', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Acnam2', Caption: 'Account Name 2', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Officer1', Caption: 'Officer 1', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Officer2', Caption: 'Officer 2', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Add1', Caption: 'Address 1', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Add2', Caption: 'Address 2', DataType: 'String', Visible: true, Required: false },
      { DataField: 'City', Caption: 'City', DataType: 'String', Visible: true, Required: false },
      { DataField: 'State', Caption: 'State', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Zip', Caption: 'ZIP Code', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Country', Caption: 'Country', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Phone', Caption: 'Phone', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Start_Date', Caption: 'Start Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'AcType', Caption: 'Account Type', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Domicile', Caption: 'Domicile', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Entity', Caption: 'Entity', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Base_Curr', Caption: 'Base Currency', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Inactive', Caption: 'Inactive', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Family', Caption: 'Family', DataType: 'String', Visible: true, Required: false }
    ]
  },
  {
    name: 'GL',
    displayName: 'General Ledger',
    description: 'General ledger account management',
    category: 'Accounting',
    columns: [
      { DataField: 'fund', Caption: 'Fund', DataType: 'String', Visible: true, Required: true },
      { DataField: 'acno', Caption: 'Account Number', DataType: 'String', Visible: true, Required: true },
      { DataField: 'actype', Caption: 'Account Type', DataType: 'String', Visible: true, Required: false },
      { DataField: 'ytdbal_ty', Caption: 'YTD Balance This Year', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'ytdbal_ly', Caption: 'YTD Balance Last Year', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'opnbal_ty', Caption: 'Opening Balance This Year', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'opnbal_ly', Caption: 'Opening Balance Last Year', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'desc1', Caption: 'Description 1', DataType: 'String', Visible: true, Required: false },
      { DataField: 'desc2', Caption: 'Description 2', DataType: 'String', Visible: true, Required: false },
      { DataField: 'ytd_dr_ty', Caption: 'YTD Debit This Year', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'ytd_dr_ly', Caption: 'YTD Debit Last Year', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'ytd_cr_ty', Caption: 'YTD Credit This Year', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'ytd_cr_ly', Caption: 'YTD Credit Last Year', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'Class', Caption: 'Class', DataType: 'String', Visible: true, Required: false },
      { DataField: 'inactive', Caption: 'Inactive', DataType: 'String', Visible: true, Required: false },
      { DataField: 'tkr', Caption: 'Ticker', DataType: 'String', Visible: true, Required: false },
      { DataField: 'hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  }
];

// Legacy model mappings for backward compatibility
export const LEGACY_MODEL_MAPPING = {
  'ACCADJ': 'ADJUST',
  'BUYTYP': 'ACTYPE', 
  'PRIMNT': 'TRX',
  'SRCMNT': 'SECRTY',
  'BUYLONG': 'FNDMAS',
  'AATTRR': 'AATRR'
};

// Get model by name (supports both legacy and new names)
export function getMFactModel(modelName: string): MFactModel | undefined {
  // Check if it's a legacy name
  const actualName = LEGACY_MODEL_MAPPING[modelName as keyof typeof LEGACY_MODEL_MAPPING] || modelName;
  return REAL_MFACT_MODELS.find(model => model.name === actualName);
}

// Get all models by category
export function getModelsByCategory(category: string): MFactModel[] {
  if (category === 'all') return REAL_MFACT_MODELS;
  return REAL_MFACT_MODELS.filter(model => model.category === category);
}

// Get all categories
export function getCategories(): string[] {
  return Array.from(new Set(REAL_MFACT_MODELS.map(model => model.category)));
}