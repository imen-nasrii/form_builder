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
    name: 'TAXLOT',
    displayName: 'Tax Lots',
    description: 'Tax lot tracking and cost basis management',
    category: 'Accounting',
    columns: [
      { DataField: 'fund', Caption: 'Fund', DataType: 'String', Visible: true, Required: false },
      { DataField: 'tkr', Caption: 'Ticker', DataType: 'String', Visible: true, Required: false },
      { DataField: 'trade_date', Caption: 'Trade Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'settl_date', Caption: 'Settlement Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'qty', Caption: 'Quantity', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'lcltaxbook', Caption: 'Local Tax Book', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'opnord', Caption: 'Open Order', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'price', Caption: 'Price', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'trxcur_no', Caption: 'Transaction Currency', DataType: 'String', Visible: true, Required: false },
      { DataField: 'lclorgbook', Caption: 'Local Original Book', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'bastaxbook', Caption: 'Base Tax Book', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'basorgbook', Caption: 'Base Original Book', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'subunit', Caption: 'Sub Unit', DataType: 'String', Visible: true, Required: false },
      { DataField: 'lcl_accinc', Caption: 'Local Accrued Income', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'bas_accinc', Caption: 'Base Accrued Income', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'Class', Caption: 'Class', DataType: 'String', Visible: true, Required: false },
      { DataField: 'ytm', Caption: 'Yield to Maturity', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'accfixdate', Caption: 'Accrual Fix Date', DataType: 'Date', Visible: false, Required: false },
      { DataField: 'amtfixdate', Caption: 'Amount Fix Date', DataType: 'Date', Visible: false, Required: false },
      { DataField: 'hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'OPNPOS',
    displayName: 'Open Positions',
    description: 'Current open position and holdings management',
    category: 'Finance',
    columns: [
      { DataField: 'fund', Caption: 'Fund', DataType: 'String', Visible: true, Required: true },
      { DataField: 'tkr', Caption: 'Ticker', DataType: 'String', Visible: true, Required: true },
      { DataField: 'qty', Caption: 'Quantity', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'lclavgbook', Caption: 'Local Average Book', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'numstp', Caption: 'Number Steps', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'stplos', Caption: 'Stop Loss', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'mental', Caption: 'Mental', DataType: 'String', Visible: true, Required: false },
      { DataField: 'multi', Caption: 'Multi', DataType: 'String', Visible: true, Required: false },
      { DataField: 'shtopt', Caption: 'Short Option', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'expdat', Caption: 'Expiration Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'matdat', Caption: 'Maturity Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'tkr_type', Caption: 'Ticker Type', DataType: 'String', Visible: true, Required: false },
      { DataField: 'seccat', Caption: 'Security Category', DataType: 'String', Visible: true, Required: false },
      { DataField: 'secgrp', Caption: 'Security Group', DataType: 'String', Visible: true, Required: false },
      { DataField: 'long_short', Caption: 'Long/Short', DataType: 'String', Visible: true, Required: true },
      { DataField: 'lcltaxbook', Caption: 'Local Tax Book', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'buyord', Caption: 'Buy Order', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'selord', Caption: 'Sell Order', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'basavgbook', Caption: 'Base Average Book', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'INCOME',
    displayName: 'Income Records',
    description: 'Dividend and income transaction management',
    category: 'Finance',
    columns: [
      { DataField: 'fund', Caption: 'Fund', DataType: 'String', Visible: true, Required: false },
      { DataField: 'tkr', Caption: 'Ticker', DataType: 'String', Visible: true, Required: false },
      { DataField: 'effecdate', Caption: 'Effective Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'lstdiv', Caption: 'Last Dividend', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'lcl_accinc', Caption: 'Local Accrued Income', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'bas_accinc', Caption: 'Base Accrued Income', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'nxtpay', Caption: 'Next Payment', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'long_short', Caption: 'Long/Short', DataType: 'String', Visible: true, Required: false },
      { DataField: 'source', Caption: 'Source', DataType: 'String', Visible: true, Required: false },
      { DataField: 'div_type', Caption: 'Dividend Type', DataType: 'String', Visible: true, Required: false },
      { DataField: 'qty', Caption: 'Quantity', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'user_ref', Caption: 'User Reference', DataType: 'String', Visible: true, Required: false },
      { DataField: 'reinvest', Caption: 'Reinvest', DataType: 'String', Visible: true, Required: false },
      { DataField: 're_date', Caption: 'Reinvest Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 're_brkr', Caption: 'Reinvest Broker', DataType: 'String', Visible: true, Required: false },
      { DataField: 'lcl_gross', Caption: 'Local Gross', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'tax', Caption: 'Tax', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'with_rate', Caption: 'Withholding Rate', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'reclaim', Caption: 'Reclaim', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'NAVHST',
    displayName: 'NAV History',
    description: 'Net Asset Value historical tracking and calculations',
    category: 'Finance',
    columns: [
      { DataField: 'fund', Caption: 'Fund', DataType: 'String', Visible: true, Required: false },
      { DataField: 'dated', Caption: 'Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'assets', Caption: 'Assets', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'liability', Caption: 'Liability', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'capital', Caption: 'Capital', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'revenues', Caption: 'Revenues', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'expenses', Caption: 'Expenses', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'shares', Caption: 'Shares', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'setldshare', Caption: 'Settled Shares', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'net_value', Caption: 'Net Value', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'class', Caption: 'Class', DataType: 'String', Visible: true, Required: false },
      { DataField: 'income', Caption: 'Income', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'user_id', Caption: 'User ID', DataType: 'String', Visible: true, Required: false },
      { DataField: 'entry_date', Caption: 'Entry Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'entry_time', Caption: 'Entry Time', DataType: 'String', Visible: true, Required: false },
      { DataField: 'status', Caption: 'Status', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'longmktval', Caption: 'Long Market Value', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'sht_mktval', Caption: 'Short Market Value', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'curncy', Caption: 'Currency', DataType: 'String', Visible: true, Required: false },
      { DataField: 'fxrate', Caption: 'FX Rate', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'mktval', Caption: 'Market Value', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'cstval', Caption: 'Cost Value', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'basnav', Caption: 'Base NAV', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'lclnav', Caption: 'Local NAV', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'AUTTRX',
    displayName: 'Automatic Transactions',
    description: 'Automated recurring transaction and NAV-based fee management',
    category: 'Finance',
    columns: [
      { DataField: 'Fund', Caption: 'Fund', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Auttrx_No', Caption: 'Auto Transaction Number', DataType: 'String', Visible: true, Required: true },
      { DataField: 'Start_Date', Caption: 'Start Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'End_Date', Caption: 'End Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'Last_Date', Caption: 'Last Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'Next_Date', Caption: 'Next Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'TrxType', Caption: 'Transaction Type', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Acct_Cr', Caption: 'Credit Account', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Acct_Dr', Caption: 'Debit Account', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Amount', Caption: 'Amount', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'Freq', Caption: 'Frequency', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Trail1', Caption: 'Trail 1', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Trail2', Caption: 'Trail 2', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Trail3', Caption: 'Trail 3', DataType: 'String', Visible: true, Required: false },
      { DataField: 'NavT_ype', Caption: 'NAV Type', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Nav_Period', Caption: 'NAV Period', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Nav_Level1', Caption: 'NAV Level 1', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'Nav_Pcnt1', Caption: 'NAV Percentage 1', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'Curncy', Caption: 'Currency', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Portfolio', Caption: 'Portfolio', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'EXCHNG',
    displayName: 'Exchanges',
    description: 'Stock exchange and trading venue master data',
    category: 'General',
    columns: [
      { DataField: 'Exch', Caption: 'Exchange Code', DataType: 'String', Visible: true, Required: true },
      { DataField: 'Exchange', Caption: 'Exchange Name', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Country', Caption: 'Country', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Tplus', Caption: 'T+Settlement', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'DIVTYP',
    displayName: 'Dividend Types',
    description: 'Dividend type classification and tax treatment definitions',
    category: 'Finance',
    columns: [
      { DataField: 'Source', Caption: 'Source', DataType: 'String', Visible: true, Required: true },
      { DataField: 'Div_Type', Caption: 'Dividend Type', DataType: 'String', Visible: true, Required: true },
      { DataField: 'Descr', Caption: 'Description', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Taxrat', Caption: 'Tax Rate', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Taxcod', Caption: 'Tax Code', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
    ]
  },
  {
    name: 'ASOFUNSETL',
    displayName: 'As-Of Unsettled Transactions',
    description: 'Historical unsettled transaction tracking for as-of date reporting',
    category: 'Accounting',
    columns: [
      { DataField: 'Fund', Caption: 'Fund', DataType: 'String', Visible: true, Required: true },
      { DataField: 'Setdat', Caption: 'Settlement Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'Actual', Caption: 'Actual Date', DataType: 'Date', Visible: true, Required: false },
      { DataField: 'Trxtyp', Caption: 'Transaction Type', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Trxcur_No', Caption: 'Transaction Number', DataType: 'String', Visible: true, Required: true },
      { DataField: 'Class', Caption: 'Class', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Asofdate', Caption: 'As-Of Date', DataType: 'String', Visible: true, Required: true },
      { DataField: 'Asoftype', Caption: 'As-Of Type', DataType: 'String', Visible: true, Required: true },
      { DataField: 'Amount', Caption: 'Amount', DataType: 'Number', Visible: true, Required: false },
      { DataField: 'No_Cash', Caption: 'No Cash', DataType: 'String', Visible: true, Required: false },
      { DataField: 'Hash', Caption: 'Hash', DataType: 'Number', Visible: false, Required: false }
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
  'AATTRR': 'AATRR',
  'EXCHANGE': 'EXCHNG',
  'DIVIDEND': 'DIVTYP',
  'AUTOMATIC': 'AUTTRX'
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