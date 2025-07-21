import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
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
  Square,
  Search, 
  Play, 
  RotateCcw, 
  X, 
  AlertTriangle,
  Trash2,
  Settings,
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
  Save,
  FileUp,
  Download,
  Database,
  Eye,
  ChevronDown,
  ChevronUp,
  Home,
  Grid3X3,
  Minus,
  Maximize2,
  Minimize2,
  Hash
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ComponentCategories as EnterpriseComponentCategories, ComponentSpecificProperties, CommonProperties, renderFormComponent } from '@/components/enterprise-form-components';
import { FormFieldProperties } from '@/components/form-field-properties';

// Model Dropdown Selector Component
function ModelDropdownSelector({ 
  models, 
  selectedModel, 
  onSelectModel, 
  isLoading, 
  isDarkMode 
}: {
  models: any[];
  selectedModel: string;
  onSelectModel: (model: string) => void;
  isLoading: boolean;
  isDarkMode: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (modelName: string) => {
    onSelectModel(modelName);
    setIsOpen(false);
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading models...</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Select Model/Table
      </Label>
      
      <div className="relative mt-2">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full justify-between ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : ''}`}
        >
          <span>{selectedModel || 'Choose a model...'}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        {isOpen && (
          <div className={`absolute z-50 w-full mt-1 border rounded-md shadow-lg ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}>
            {/* Search Input */}
            <div className="p-3 border-b">
              <div className="relative">
                <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>🔍</div>
                <Input
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : ''}`}
                />
              </div>
            </div>

            {/* Models List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredModels.length === 0 ? (
                <div className={`p-4 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No models found
                </div>
              ) : (
                filteredModels.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => handleSelect(model.name)}
                    className={`w-full text-left p-3 hover:bg-opacity-75 transition-colors border-b last:border-b-0 ${
                      selectedModel === model.name
                        ? (isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900')
                        : (isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-50')
                    }`}
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className={`text-xs mt-1 ${
                      selectedModel === model.name
                        ? (isDarkMode ? 'text-blue-200' : 'text-blue-700')
                        : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                    }`}>
                      {model.displayName}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {selectedModel && (
        <div className={`mt-3 p-2 rounded ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-800'}`}>
          <div className="flex items-center text-sm">
            <Database className="w-4 h-4 mr-2" />
            Selected: {selectedModel}
          </div>
        </div>
      )}
    </div>
  );
}

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

// Comprehensive ComponentCategories based on JSON analysis
const ComponentCategories = {
  inputFields: {
    name: 'Input Fields',
    icon: Type,
    color: 'blue',
    components: {
      TEXT: { icon: Type, label: 'Text Input', color: 'blue' },
      NUMERIC: { icon: Hash, label: 'Numeric Input', color: 'green' },
      DATEPKR: { icon: Calendar, label: 'Date Picker', color: 'purple' },
      DATEPICKER: { icon: Calendar, label: 'Date Picker Alt', color: 'purple' }
    }
  },
  selection: {
    name: 'Selection Controls',
    icon: List,
    color: 'orange',
    components: {
      SELECT: { icon: List, label: 'Select Dropdown', color: 'orange' },
      CHECKBOX: { icon: CheckSquare, label: 'Checkbox', color: 'cyan' },
      RADIOGRP: { icon: CheckSquare, label: 'Radio Group', color: 'purple' }
    }
  },
  lookup: {
    name: 'Lookup Components',
    icon: Search,
    color: 'indigo',
    components: {
      GRIDLKP: { icon: Grid3X3, label: 'Grid Lookup', color: 'indigo' },
      LSTLKP: { icon: Search, label: 'List Lookup', color: 'teal' }
    }
  },
  dataDisplay: {
    name: 'Data & Display',
    icon: Table,
    color: 'emerald',
    components: {
      GRID: { icon: Table, label: 'Data Grid', color: 'emerald' },
      LABEL: { icon: Type, label: 'Label', color: 'gray' }
    }
  },
  containerLayout: {
    name: 'Container & Layout',
    icon: Square,
    color: 'violet',
    components: {
      GROUP: { icon: Square, label: 'Group Container', color: 'violet' },
      DIALOG: { icon: Settings, label: 'Dialog Container', color: 'pink' }
    }
  },
  fileUpload: {
    name: 'File & Upload',
    icon: Upload,
    color: 'red',
    components: {
      FILEUPLOAD: { icon: Upload, label: 'File Upload', color: 'red' }
    }
  }
};

// Flatten for compatibility
const ComponentTypes = Object.values(ComponentCategories).reduce((acc, category) => {
  return { ...acc, ...category.components };
}, {} as Record<string, { icon: any; label: string; color: string }>);

function DraggableComponent({ componentType, label, icon: Icon, color, isDarkMode = false }: {
  componentType: string;
  label: string;
  icon: any;
  color: string;
  isDarkMode?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const getColorClasses = () => {
    if (isDarkMode) {
      return {
        bg: 'bg-gray-700 hover:bg-gray-600',
        border: 'border-gray-500 hover:border-gray-400',
        text: 'text-gray-200',
        icon: 'text-gray-300'
      };
    }
    return {
      bg: `bg-${color}-50 hover:bg-${color}-100`,
      border: `border-${color}-200 hover:border-${color}-400`,
      text: 'text-gray-900',
      icon: `text-${color}-600`
    };
  };

  const getIconBackgroundClass = (color: string, isDarkMode: boolean) => {
    if (isDarkMode) {
      return 'bg-gray-600';
    }
    
    const colorMap = {
      'blue': 'bg-blue-600',
      'green': 'bg-green-600',
      'orange': 'bg-orange-600',
      'cyan': 'bg-cyan-600',
      'purple': 'bg-purple-600',
      'pink': 'bg-pink-600',
      'indigo': 'bg-indigo-600',
      'teal': 'bg-teal-600',
      'violet': 'bg-violet-600',
      'red': 'bg-red-600',
      'yellow': 'bg-yellow-600',
      'gray': 'bg-gray-600'
    };
    
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-600';
  };

  const classes = getColorClasses();
  
  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('componentType', componentType);
    e.dataTransfer.effectAllowed = 'copy';
    
    // Calculate offset for better drag feedback
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // Create custom drag image for better visual feedback
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(2deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, dragOffset.x, dragOffset.y);
    
    // Remove the temporary drag image after a short delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);
  }, [componentType, dragOffset.x, dragOffset.y]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        relative w-16 h-16 border border-solid rounded cursor-move transition-all duration-200
        hover:shadow-lg hover:scale-105 active:scale-95 flex flex-col items-center justify-center p-1
        ${isDragging ? 'opacity-60 rotate-1 scale-95' : ''}
        ${classes.bg} ${classes.border}
        group
      `}
    >
      <div className={`
        w-6 h-6 rounded-sm flex items-center justify-center transition-all duration-200 mb-1
        ${getIconBackgroundClass(color, isDarkMode)}
        ${isDragging ? 'animate-pulse' : ''}
      `}>
        <Icon className="w-3 h-3 text-white" />
      </div>
      <span className={`text-xs font-medium text-center leading-tight ${classes.text}`} style={{ fontSize: '10px' }}>
        {label}
      </span>
      
      {/* Hover overlay with grab cursor indicator */}
      <div className={`
        absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200
        ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}
        pointer-events-none
      `}>
        <div className="absolute top-1 right-1">
          <div className={`
            w-3 h-3 rounded-full flex items-center justify-center
            ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}
          `}>
            <div className="w-1.5 h-1.5 grid grid-cols-2 gap-0.5">
              <div className={`w-0.5 h-0.5 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} />
              <div className={`w-0.5 h-0.5 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} />
              <div className={`w-0.5 h-0.5 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} />
              <div className={`w-0.5 h-0.5 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Data Model Component
function DataModelComponent({ 
  field, 
  isSelected, 
  onSelect, 
  onRemove, 
  isDarkMode,
  updateField
}: {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  isDarkMode: boolean;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(field.Entity || '');
  const [modelAttributes, setModelAttributes] = useState<any[]>([]);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Complete list of ALL MfactModels alphabetically organized like .cs files
  const availableModels = [
    { name: 'Aatrr', description: 'Asset allocation and attribution reporting', category: 'Advanced Analytics' },
    { name: 'Actdata', description: 'Activity data and transaction processing', category: 'Data Processing' },
    { name: 'Actype', description: 'Account type definitions and classifications', category: 'Accounting & GL' },
    { name: 'Adjust', description: 'Adjustment entries and corrections', category: 'Data Processing' },
    { name: 'Ae', description: 'Accounting entries and journal postings', category: 'Accounting & GL' },
    { name: 'AsOfExpend', description: 'As-of expense data', category: 'Expense Management' },
    { name: 'AsOfIncome', description: 'As-of income data', category: 'Income & Distributions' },
    { name: 'AsOfOidlot', description: 'As-of OID lot data', category: 'OID & Amortization' },
    { name: 'AsOfOpnexp', description: 'As-of open expense data', category: 'Trading & Settlements' },
    { name: 'AsOfOpnpos', description: 'As-of open position data', category: 'Trading & Settlements' },
    { name: 'AsOfTExpend', description: 'As-of total expense data', category: 'Expense Management' },
    { name: 'AsOfTIncome', description: 'As-of total income data', category: 'Income & Distributions' },
    { name: 'AsOfTOidlot', description: 'As-of total OID lot data', category: 'OID & Amortization' },
    { name: 'AsOfTOpnexp', description: 'As-of total open expense data', category: 'Trading & Settlements' },
    { name: 'AsOfTOpnpos', description: 'As-of total open position data', category: 'Trading & Settlements' },
    { name: 'AsOfTTaxlot', description: 'As-of total tax lot data', category: 'Tax Processing' },
    { name: 'AsOfTUnsetl', description: 'As-of total unsettled data', category: 'Trading & Settlements' },
    { name: 'AsOfTaxlot', description: 'As-of tax lot data', category: 'Tax Processing' },
    { name: 'AsOfUnsetl', description: 'As-of unsettled transaction data', category: 'Trading & Settlements' },
    { name: 'Auttrx', description: 'Automatic transaction processing', category: 'Trading & Settlements' },
    { name: 'Auxid', description: 'Auxiliary identifiers and cross-references', category: 'Security Classifications' },
    { name: 'BigBro', description: 'Big brother surveillance and monitoring', category: 'Advanced Analytics' },
    { name: 'Brkcom', description: 'Broker commission rates and fee structures', category: 'Trading & Brokers' },
    { name: 'Brx', description: 'Broker transaction records', category: 'Trading & Brokers' },
    { name: 'CRsult', description: 'Compliance rule results and violations', category: 'Compliance & Risk' },
    { name: 'CRule', description: 'Compliance rules and investment restrictions', category: 'Compliance & Risk' },
    { name: 'CallPrg', description: 'Callable program definitions and parameters', category: 'Job Management' },
    { name: 'Codes', description: 'System codes and lookup values', category: 'Reference Data' },
    { name: 'Contry', description: 'Country codes and geographic data', category: 'Reference Data' },
    { name: 'Curncy', description: 'Currency definitions and exchange rates', category: 'Reference Data' },
    { name: 'Custod', description: 'Custodian and counterparty information', category: 'Reference Data' },
    { name: 'DailyP', description: 'Daily pricing and valuation data', category: 'Market Data' },
    { name: 'Dasha', description: 'Dashboard configuration A', category: 'User Interface' },
    { name: 'Dashb', description: 'Dashboard configuration B', category: 'User Interface' },
    { name: 'Dashc', description: 'Dashboard configuration C', category: 'User Interface' },
    { name: 'Datact', description: 'Data activity logs and audit trails', category: 'Data Management' },
    { name: 'Datcon', description: 'Data connection and source configurations', category: 'Data Management' },
    { name: 'Dbloc', description: 'Database location and partition information', category: 'Data Management' },
    { name: 'Defitm', description: 'Default item definitions and templates', category: 'System Administration' },
    { name: 'Defset', description: 'Default settings and system preferences', category: 'System Administration' },
    { name: 'Divtyp', description: 'Dividend types and distribution classifications', category: 'Income & Distributions' },
    { name: 'Doasof', description: 'As-of date processing and historical snapshots', category: 'Data Management' },
    { name: 'Dtpmat', description: 'Date pattern matching and validation rules', category: 'Advanced Processing' },
    { name: 'Exchng', description: 'Exchange definitions and trading venues', category: 'Reference Data' },
    { name: 'Exhfee', description: 'Exchange fees and transaction costs', category: 'Trading & Brokers' },
    { name: 'Expfnd', description: 'Expense fund allocations and distributions', category: 'Expense Management' },
    { name: 'Extract', description: 'Data extraction jobs and export processes', category: 'Reporting & Analytics' },
    { name: 'Fairv', description: 'Fair value pricing and adjustments', category: 'Market Data' },
    { name: 'Falias', description: 'Fund aliases and alternative identifiers', category: 'Fund Organization' },
    { name: 'Family', description: 'Fund family groupings and hierarchies', category: 'Fund Organization' },
    { name: 'Fas157', description: 'FAS 157 fair value hierarchy classifications', category: 'Legal & Regulatory' },
    { name: 'Fndmas', description: 'Fund master data and configuration', category: 'Financial Core' },
    { name: 'FundCg', description: 'Fund capital gains and loss tracking', category: 'Fund Organization' },
    { name: 'Gandl', description: 'Gains and losses reporting and analysis', category: 'Reporting & Analytics' },
    { name: 'GkCode', description: 'Gatekeeper codes and validation rules', category: 'Advanced Analytics' },
    { name: 'GkDet', description: 'Gatekeeper detail records', category: 'Advanced Analytics' },
    { name: 'GkMst', description: 'Gatekeeper master configuration', category: 'Advanced Analytics' },
    { name: 'GkTrx', description: 'Gatekeeper transaction monitoring', category: 'Advanced Analytics' },
    { name: 'Gl', description: 'General ledger accounts and balances', category: 'Financial Core' },
    { name: 'Gl988', description: 'GL 988 specific entries', category: 'Accounting & GL' },
    { name: 'Glcat', description: 'General ledger categories', category: 'Accounting & GL' },
    { name: 'Glgrp', description: 'General ledger groupings', category: 'Accounting & GL' },
    { name: 'Glprm', description: 'General ledger parameters', category: 'Accounting & GL' },
    { name: 'Glxcat', description: 'Extended GL categories', category: 'Accounting & GL' },
    { name: 'Gnskpr', description: 'Gatekeeper compliance monitoring', category: 'Advanced Analytics' },
    { name: 'Holiday', description: 'Holiday calendar and business day rules', category: 'Reference Data' },
    { name: 'IdxHis', description: 'Index history and benchmark data', category: 'Market Data' },
    { name: 'IdxMas', description: 'Index master data and definitions', category: 'Market Data' },
    { name: 'Images', description: 'System images and graphics', category: 'User Interface' },
    { name: 'Income', description: 'Income tracking and dividend processing', category: 'Financial Core' },
    { name: 'JobMsg', description: 'Job processing messages', category: 'Messaging' },
    { name: 'JobScd', description: 'Job scheduling and automation', category: 'Job Management' },
    { name: 'Layout', description: 'Screen layout and form definitions', category: 'System Administration' },
    { name: 'Legald', description: 'Legal entity data and compliance', category: 'Legal & Regulatory' },
    { name: 'LegaldMkr', description: 'Legal entity market maker information', category: 'Legal & Regulatory' },
    { name: 'Legent', description: 'Legal entity management', category: 'Legal & Regulatory' },
    { name: 'LockInfo', description: 'Record locking and concurrency control', category: 'Advanced Analytics' },
    { name: 'LotExp', description: 'Lot expiration and maturity tracking', category: 'Data Processing' },
    { name: 'LvcNfm', description: 'LVC NFM processing rules', category: 'Advanced Processing' },
    { name: 'MastMenu', description: 'Master menu definitions', category: 'User Interface' },
    { name: 'MastRpt', description: 'Master report templates', category: 'Reporting & Analytics' },
    { name: 'MemRpt', description: 'Memory-based reporting', category: 'Reporting & Analytics' },
    { name: 'Messages', description: 'System messages and notifications', category: 'Messaging' },
    { name: 'Mkrchr', description: 'Market maker characteristics', category: 'Market Making & Pricing' },
    { name: 'Mktval', description: 'Market valuation and pricing data', category: 'Market Data' },
    { name: 'Mnuimg', description: 'Menu images and icons', category: 'User Interface' },
    { name: 'Msfeed', description: 'Market data feed processing', category: 'Advanced Processing' },
    { name: 'Msg', description: 'Message processing and routing', category: 'Messaging' },
    { name: 'MsgDefs', description: 'Message definitions and templates', category: 'Messaging' },
    { name: 'MsgErr', description: 'Message error handling', category: 'Messaging' },
    { name: 'MsgLog', description: 'Message logging and audit', category: 'Messaging' },
    { name: 'MsgRcp', description: 'Message recipients and distribution', category: 'Messaging' },
    { name: 'MsgUsr', description: 'User-specific messaging', category: 'Messaging' },
    { name: 'NavHst', description: 'Net Asset Value history and tracking', category: 'Market Data' },
    { name: 'NavPer', description: 'NAV performance tracking', category: 'Position & Performance' },
    { name: 'NdCode', description: 'Node classification codes', category: 'Compliance & Risk' },
    { name: 'NdRule', description: 'Node-based compliance rules', category: 'Compliance & Risk' },
    { name: 'Nrsro', description: 'NRSRO rating agency data', category: 'Legal & Regulatory' },
    { name: 'Ntrwzd', description: 'Net trading wizard calculations', category: 'Advanced Processing' },
    { name: 'Oidlot', description: 'Original Issue Discount lot tracking', category: 'OID & Amortization' },
    { name: 'Opnexp', description: 'Open expense positions and accruals', category: 'Expense Management' },
    { name: 'Opnord', description: 'Open orders and pending transactions', category: 'Options & Derivatives' },
    { name: 'Opnpos', description: 'Open positions and portfolio holdings', category: 'Financial Core' },
    { name: 'Opt104', description: 'Options contract specifications', category: 'Options & Derivatives' },
    { name: 'Optevt', description: 'Options corporate events', category: 'Options & Derivatives' },
    { name: 'OptevtAud', description: 'Options event audit trail', category: 'Options & Derivatives' },
    { name: 'Optflt', description: 'Options filter and screening', category: 'Options & Derivatives' },
    { name: 'Optpro', description: 'Options processing parameters', category: 'Options & Derivatives' },
    { name: 'Pcrf', description: 'Price cross-reference and mapping', category: 'Market Data' },
    { name: 'PosExp', description: 'Position-based expense calculations', category: 'Expense Management' },
    { name: 'PrChld', description: 'Price child relationships', category: 'Position & Performance' },
    { name: 'PrCrnk', description: 'Price cross-rank analysis', category: 'Position & Performance' },
    { name: 'PreCond', description: 'Pre-condition validations', category: 'Compliance & Risk' },
    { name: 'PrgNam', description: 'Program name registry', category: 'Job Management' },
    { name: 'PrihistMkr', description: 'Price history market maker data', category: 'Market Making & Pricing' },
    { name: 'Prihst', description: 'Price history and historical pricing data', category: 'Market Data' },
    { name: 'Psrc', description: 'Price source management', category: 'Advanced Processing' },
    { name: 'Pswrd', description: 'Password management and security', category: 'Core System' },
    { name: 'Ptype', description: 'Portfolio types and investment styles', category: 'Security Classifications' },
    { name: 'Range', description: 'Range definitions and validation parameters', category: 'Compliance & Risk' },
    { name: 'Range2', description: 'Extended range validations', category: 'Compliance & Risk' },
    { name: 'Rathst', description: 'Rating history and credit analysis', category: 'Swaps & Fixed Income' },
    { name: 'RealGlRul', description: 'Real-time GL processing rules', category: 'Position & Performance' },
    { name: 'Reason', description: 'Reason codes and transaction justifications', category: 'Reference Data' },
    { name: 'ReglSx', description: 'Regulatory SX reporting', category: 'Legal & Regulatory' },
    { name: 'Remind', description: 'Reminder and notification system', category: 'Messaging' },
    { name: 'Report', description: 'Report definitions and configurations', category: 'Reporting & Analytics' },
    { name: 'RptBat', description: 'Report batch processing', category: 'Reporting & Analytics' },
    { name: 'RptGrp', description: 'Report groupings and categories', category: 'Reporting & Analytics' },
    { name: 'RptHdr', description: 'Report headers and metadata', category: 'Reporting & Analytics' },
    { name: 'Rtdhst', description: 'Real-time data history', category: 'Position & Performance' },
    { name: 'RuleStatus', description: 'Rule status tracking and monitoring', category: 'Compliance & Risk' },
    { name: 'SecCat', description: 'Security categories and classifications', category: 'Security Classifications' },
    { name: 'SecGrp', description: 'Security groups and sector classifications', category: 'Security Classifications' },
    { name: 'Seclyd', description: 'Security layout and display configurations', category: 'Security Classifications' },
    { name: 'SeclydAg', description: 'Security layout aggregations', category: 'Security Classifications' },
    { name: 'Secrty', description: 'Securities and financial instruments master data', category: 'Financial Core' },
    { name: 'SecrtyMkr', description: 'Security market maker relationships', category: 'Market Making & Pricing' },
    { name: 'Series', description: 'Fund series and share class definitions', category: 'Fund Organization' },
    { name: 'Sessions', description: 'User session management', category: 'Core System' },
    { name: 'Setexc', description: 'Settlement exception handling', category: 'Trading & Brokers' },
    { name: 'Shrgrp', description: 'Share group classifications', category: 'Fund Organization' },
    { name: 'Shrmas', description: 'Share master data and share class information', category: 'Fund Organization' },
    { name: 'Sig', description: 'Signature and authorization tracking', category: 'Advanced Processing' },
    { name: 'SigTkr', description: 'Signature ticker management', category: 'Advanced Processing' },
    { name: 'Sponsr', description: 'Sponsor and manager information', category: 'Advanced Processing' },
    { name: 'States', description: 'State and province reference data', category: 'Reference Data' },
    { name: 'Supdate', description: 'System update tracking', category: 'Data Management' },
    { name: 'Swap', description: 'Swap contract management', category: 'Swaps & Fixed Income' },
    { name: 'SwapMkr', description: 'Swap market maker data', category: 'Swaps & Fixed Income' },
    { name: 'Sysfil', description: 'System file management', category: 'System Administration' },
    { name: 'Sysparam', description: 'System parameters and configuration settings', category: 'System Administration' },
    { name: 'Sysprm', description: 'System parameter management', category: 'System Administration' },
    { name: 'Tarec', description: 'Transaction reconciliation records', category: 'Data Processing' },
    { name: 'Taxcod', description: 'Tax codes and classifications', category: 'Tax Processing' },
    { name: 'Taxlot', description: 'Tax lot positions and cost basis tracking', category: 'Financial Core' },
    { name: 'Taxrat', description: 'Tax rates and withholding calculations', category: 'Tax Processing' },
    { name: 'Taxtbl', description: 'Tax tables and lookup data', category: 'Tax Processing' },
    { name: 'Tbhist', description: 'Treasury bill history', category: 'Swaps & Fixed Income' },
    { name: 'Tbnames', description: 'Treasury bill naming conventions', category: 'Swaps & Fixed Income' },
    { name: 'Trail', description: 'Audit trail and change tracking', category: 'Data Processing' },
    { name: 'Trx', description: 'Transaction records and trade data', category: 'Financial Core' },
    { name: 'Trxcur', description: 'Transaction currency handling', category: 'Trading & Settlements' },
    { name: 'Trxtyp', description: 'Transaction types and processing rules', category: 'Trading & Settlements' },
    { name: 'UdfData', description: 'User-defined field data storage', category: 'User-Defined Extensions' },
    { name: 'UdfDataMkr', description: 'User-defined field market maker data', category: 'Market Making & Pricing' },
    { name: 'UdfFields', description: 'User-defined field definitions', category: 'User-Defined Extensions' },
    { name: 'UdfGroups', description: 'User-defined field groupings', category: 'User-Defined Extensions' },
    { name: 'Unreal', description: 'Unrealized gain/loss calculations', category: 'Data Processing' },
    { name: 'Unsetl', description: 'Unsettled transactions and pending trades', category: 'Financial Core' },
    { name: 'Ursfnd', description: 'URS fund data processing', category: 'Advanced Processing' },
    { name: 'Users', description: 'User management and authentication', category: 'Core System' },
    { name: 'Usrdef', description: 'User-defined fields and preferences', category: 'Core System' },
    { name: 'Usrico', description: 'User interface customization', category: 'Core System' },
    { name: 'Usrlog', description: 'User activity logging', category: 'Core System' },
    { name: 'Usrprg', description: 'User program access permissions', category: 'Core System' },
    { name: 'Vrsn', description: 'Version control and tracking', category: 'Data Management' },
    { name: 'Yields', description: 'Yield calculations and return analysis', category: 'Market Data' }
  ];

  // Filter models based on search term only
  const filteredModels = availableModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Comprehensive model attribute definitions based on actual C# models from MfactModels
  const modelAttributeMap: Record<string, any[]> = {
    // Core System Models
    'Users': [
      { name: 'Id', type: 'string', required: true, description: 'Unique user identifier' },
      { name: 'Email', type: 'string', required: true, description: 'User email address' },
      { name: 'FirstName', type: 'string', required: false, description: 'User first name' },
      { name: 'LastName', type: 'string', required: false, description: 'User last name' },
      { name: 'ProfileImageUrl', type: 'string', required: false, description: 'Profile image URL' },
      { name: 'CreatedAt', type: 'DateTime', required: false, description: 'Account creation date' },
      { name: 'UpdatedAt', type: 'DateTime', required: false, description: 'Last update timestamp' }
    ],
    
    'Sessions': [
      { name: 'sid', type: 'string', required: true, description: 'Session identifier' },
      { name: 'sess', type: 'jsonb', required: true, description: 'Session data' },
      { name: 'expire', type: 'DateTime', required: true, description: 'Session expiration' }
    ],
    
    // Financial Core Models
    'Secrty': [
      { name: 'tkr', type: 'string', required: true, description: 'Security ticker symbol' },
      { name: 'cusip', type: 'string', required: false, description: 'CUSIP identifier' },
      { name: 'sedol', type: 'string', required: false, description: 'SEDOL identifier' },
      { name: 'isin', type: 'string', required: false, description: 'ISIN identifier' },
      { name: 'ric', type: 'string', required: false, description: 'Reuters RIC code' },
      { name: 'custom_id1', type: 'string', required: false, description: 'Custom identifier 1' },
      { name: 'custom_id2', type: 'string', required: false, description: 'Custom identifier 2' },
      { name: 'tkr_type', type: 'string', required: false, description: 'Ticker type' },
      { name: 'seccat', type: 'string', required: false, description: 'Security category' },
      { name: 'tkr_desc', type: 'string', required: false, description: 'Security description' },
      { name: 'desc2', type: 'string', required: false, description: 'Secondary description' },
      { name: 'exch', type: 'string', required: false, description: 'Exchange code' },
      { name: 'lsttrx', type: 'DateTime', required: false, description: 'Last transaction date' },
      { name: 'lstdiv', type: 'decimal', required: false, description: 'Last dividend amount' },
      { name: 'secgrp', type: 'string', required: false, description: 'Security group' },
      { name: 'factor', type: 'decimal', required: false, description: 'Multiplication factor' },
      { name: 'issuer', type: 'string', required: false, description: 'Issuer name' },
      { name: 'guarantor', type: 'string', required: false, description: 'Guarantor entity' },
      { name: 'country', type: 'string', required: false, description: 'Country of issue' },
      { name: 'currency', type: 'string', required: false, description: 'Base currency' },
      { name: 'beta', type: 'decimal', required: false, description: 'Beta coefficient' },
      { name: 'outshs', type: 'decimal', required: false, description: 'Outstanding shares' },
      { name: 'matdat', type: 'DateTime', required: false, description: 'Maturity date' },
      { name: 'strike', type: 'decimal', required: false, description: 'Strike price for options' },
      { name: 'conv_ratio', type: 'decimal', required: false, description: 'Conversion ratio' }
    ],
    
    'Trx': [
      { name: 'fund', type: 'string', required: true, description: 'Fund identifier' },
      { name: 'trx_no', type: 'string', required: true, description: 'Transaction number' },
      { name: 'trxdate', type: 'DateTime', required: false, description: 'Transaction date' },
      { name: 'acct_cr', type: 'string', required: false, description: 'Credit account' },
      { name: 'acct_dr', type: 'string', required: false, description: 'Debit account' },
      { name: 'datent', type: 'DateTime', required: false, description: 'Entry date' },
      { name: 'amount', type: 'decimal', required: false, description: 'Transaction amount' },
      { name: 'trx_type', type: 'string', required: false, description: 'Transaction type' },
      { name: 'revflg', type: 'string', required: false, description: 'Reversal flag' },
      { name: 'check_num', type: 'string', required: false, description: 'Check number' },
      { name: 'trxcur_no', type: 'string', required: false, description: 'Transaction currency number' },
      { name: 'user_id', type: 'string', required: false, description: 'User who entered transaction' },
      { name: 'postdate', type: 'DateTime', required: false, description: 'Post date' },
      { name: 'long_short', type: 'string', required: false, description: 'Long/short indicator' },
      { name: 'Class', type: 'string', required: false, description: 'Transaction class' }
    ],
    
    'Fndmas': [
      { name: 'Fund', type: 'string', required: true, description: 'Fund identifier' },
      { name: 'Acnam1', type: 'string', required: false, description: 'Account name 1' },
      { name: 'Acnam2', type: 'string', required: false, description: 'Account name 2' },
      { name: 'Officer1', type: 'string', required: false, description: 'Primary officer' },
      { name: 'Officer2', type: 'string', required: false, description: 'Secondary officer' },
      { name: 'Officer3', type: 'string', required: false, description: 'Tertiary officer' },
      { name: 'Add1', type: 'string', required: false, description: 'Address line 1' },
      { name: 'Add2', type: 'string', required: false, description: 'Address line 2' },
      { name: 'City', type: 'string', required: false, description: 'City' },
      { name: 'State', type: 'string', required: false, description: 'State' },
      { name: 'Zip', type: 'string', required: false, description: 'ZIP code' },
      { name: 'Country', type: 'string', required: false, description: 'Country' },
      { name: 'Phone', type: 'string', required: false, description: 'Phone number' },
      { name: 'Start_Date', type: 'DateTime', required: false, description: 'Fund start date' },
      { name: 'AcType', type: 'string', required: false, description: 'Account type' },
      { name: 'Base_Curr', type: 'string', required: false, description: 'Base currency' },
      { name: 'Multi_Curr', type: 'string', required: false, description: 'Multi-currency flag' },
      { name: 'Par_Value', type: 'decimal', required: false, description: 'Par value' },
      { name: 'Comments', type: 'string', required: false, description: 'Fund comments' },
      { name: 'Family', type: 'string', required: false, description: 'Fund family' },
      { name: 'Domicile', type: 'string', required: false, description: 'Fund domicile' }
    ],
    
    'Taxlot': [
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'tkr', type: 'string', required: false, description: 'Security ticker' },
      { name: 'trade_date', type: 'DateTime', required: false, description: 'Trade date' },
      { name: 'settl_date', type: 'DateTime', required: false, description: 'Settlement date' },
      { name: 'qty', type: 'decimal', required: false, description: 'Quantity' },
      { name: 'lcltaxbook', type: 'decimal', required: false, description: 'Local tax book value' },
      { name: 'opnord', type: 'decimal', required: false, description: 'Open order quantity' },
      { name: 'price', type: 'decimal', required: false, description: 'Price per share' },
      { name: 'trxcur_no', type: 'string', required: false, description: 'Transaction currency number' },
      { name: 'bastaxbook', type: 'decimal', required: false, description: 'Base tax book value' },
      { name: 'lcl_accinc', type: 'decimal', required: false, description: 'Local accrued income' },
      { name: 'bas_accinc', type: 'decimal', required: false, description: 'Base accrued income' },
      { name: 'lunreal', type: 'decimal', required: false, description: 'Local unrealized P&L' },
      { name: 'bunreal', type: 'decimal', required: false, description: 'Base unrealized P&L' }
    ],
    
    'Gl': [
      { name: 'fund', type: 'string', required: true, description: 'Fund identifier' },
      { name: 'acno', type: 'string', required: true, description: 'Account number' },
      { name: 'actype', type: 'string', required: false, description: 'Account type' },
      { name: 'ytdbal_ty', type: 'decimal', required: false, description: 'YTD balance this year' },
      { name: 'ytdbal_ly', type: 'decimal', required: false, description: 'YTD balance last year' },
      { name: 'opnbal_ty', type: 'decimal', required: false, description: 'Opening balance this year' },
      { name: 'opnbal_ly', type: 'decimal', required: false, description: 'Opening balance last year' },
      { name: 'desc1', type: 'string', required: false, description: 'Primary description' },
      { name: 'desc2', type: 'string', required: false, description: 'Secondary description' },
      { name: 'ytd_dr_ty', type: 'decimal', required: false, description: 'YTD debits this year' },
      { name: 'ytd_dr_ly', type: 'decimal', required: false, description: 'YTD debits last year' },
      { name: 'ytd_cr_ty', type: 'decimal', required: false, description: 'YTD credits this year' },
      { name: 'ytd_cr_ly', type: 'decimal', required: false, description: 'YTD credits last year' }
    ],
    
    'Custod': [
      { name: 'Entity', type: 'string', required: true, description: 'Entity identifier' },
      { name: 'Name', type: 'string', required: false, description: 'Custodian name' },
      { name: 'Dept', type: 'string', required: false, description: 'Department' },
      { name: 'Attn', type: 'string', required: false, description: 'Attention line' },
      { name: 'Addr1', type: 'string', required: false, description: 'Address line 1' },
      { name: 'Addr2', type: 'string', required: false, description: 'Address line 2' },
      { name: 'City', type: 'string', required: false, description: 'City' },
      { name: 'State', type: 'string', required: false, description: 'State/Province' },
      { name: 'Zip', type: 'string', required: false, description: 'ZIP/Postal code' },
      { name: 'DtcAgent', type: 'string', required: false, description: 'DTC agent number' },
      { name: 'EntityType', type: 'string', required: false, description: 'Entity type classification' },
      { name: 'Hash', type: 'decimal', required: false, description: 'Hash value for validation' }
    ],
    
    'Actype': [
      { name: 'Actype', type: 'string', required: true, description: 'Account type code' },
      { name: 'Name', type: 'string', required: false, description: 'Account type name' },
      { name: 'Hash', type: 'decimal', required: false, description: 'Hash value for validation' }
    ],
    
    // Additional comprehensive model definitions for other major models
    'Opnpos': [
      { name: 'fund', type: 'string', required: true, description: 'Fund identifier' },
      { name: 'tkr', type: 'string', required: true, description: 'Security ticker' },
      { name: 'qty', type: 'decimal', required: false, description: 'Position quantity' },
      { name: 'cost_basis', type: 'decimal', required: false, description: 'Cost basis' },
      { name: 'market_value', type: 'decimal', required: false, description: 'Current market value' },
      { name: 'unrealized_gl', type: 'decimal', required: false, description: 'Unrealized gain/loss' }
    ],
    
    'Income': [
      { name: 'fund', type: 'string', required: true, description: 'Fund identifier' },
      { name: 'tkr', type: 'string', required: false, description: 'Security ticker' },
      { name: 'income_type', type: 'string', required: false, description: 'Type of income' },
      { name: 'amount', type: 'decimal', required: false, description: 'Income amount' },
      { name: 'pay_date', type: 'DateTime', required: false, description: 'Payment date' },
      { name: 'record_date', type: 'DateTime', required: false, description: 'Record date' }
    ],
    
    'Unsetl': [
      { name: 'fund', type: 'string', required: true, description: 'Fund identifier' },
      { name: 'tkr', type: 'string', required: false, description: 'Security ticker' },
      { name: 'trade_date', type: 'DateTime', required: false, description: 'Trade date' },
      { name: 'settlement_date', type: 'DateTime', required: false, description: 'Expected settlement date' },
      { name: 'amount', type: 'decimal', required: false, description: 'Transaction amount' },
      { name: 'status', type: 'string', required: false, description: 'Settlement status' }
    ],

    // Reference Data Models
    'Curncy': [
      { name: 'Currency', type: 'string', required: true, description: 'Currency code' },
      { name: 'Name', type: 'string', required: false, description: 'Currency name' },
      { name: 'Tkr', type: 'string', required: false, description: 'Currency ticker' },
      { name: 'Symbol', type: 'string', required: false, description: 'Currency symbol' },
      { name: 'Lcl_M_Decs', type: 'string', required: false, description: 'Local money decimals' },
      { name: 'Qty_Decs', type: 'string', required: false, description: 'Quantity decimals' },
      { name: 'Price_Decs', type: 'string', required: false, description: 'Price decimals' },
      { name: 'Bas_M_Decs', type: 'string', required: false, description: 'Base money decimals' },
      { name: 'Reciprical', type: 'string', required: false, description: 'Reciprocal flag' },
      { name: 'Fwd_Tkr_7', type: 'string', required: false, description: '7-day forward ticker' },
      { name: 'Fwd_Tkr_30', type: 'string', required: false, description: '30-day forward ticker' },
      { name: 'Fwd_Tkr_60', type: 'string', required: false, description: '60-day forward ticker' },
      { name: 'Fwd_Tkr_90', type: 'string', required: false, description: '90-day forward ticker' },
      { name: 'Fwd_Tkr180', type: 'string', required: false, description: '180-day forward ticker' },
      { name: 'Euro_Code', type: 'string', required: false, description: 'Euro conversion code' },
      { name: 'Euro_Rate', type: 'decimal', required: false, description: 'Euro conversion rate' },
      { name: 'Euro_Round', type: 'string', required: false, description: 'Euro rounding rule' },
      { name: 'Hash', type: 'decimal', required: false, description: 'Hash value for validation' }
    ],

    'Exchng': [
      { name: 'Exch', type: 'string', required: true, description: 'Exchange code' },
      { name: 'Exchange', type: 'string', required: false, description: 'Exchange name' },
      { name: 'Country', type: 'string', required: false, description: 'Exchange country' },
      { name: 'Tplus', type: 'string', required: false, description: 'Settlement days (T+n)' },
      { name: 'Hash', type: 'decimal', required: false, description: 'Hash value for validation' }
    ],

    'Holiday': [
      { name: 'Country', type: 'string', required: true, description: 'Country code' },
      { name: 'DateOfHoliday', type: 'DateTime', required: true, description: 'Holiday date' },
      { name: 'Descr', type: 'string', required: false, description: 'Holiday description' },
      { name: 'Hash', type: 'decimal', required: false, description: 'Hash value for validation' }
    ],

    'Codes': [
      { name: 'code', type: 'string', required: true, description: 'Code type' },
      { name: 'id', type: 'string', required: true, description: 'Code identifier' },
      { name: 'desc1', type: 'string', required: false, description: 'Code description' },
      { name: 'id2', type: 'string', required: false, description: 'Secondary identifier' },
      { name: 'hash', type: 'decimal', required: false, description: 'Hash value for validation' }
    ],

    // Market Data and Pricing Models
    'NavHst': [
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'dated', type: 'DateTime', required: false, description: 'NAV date' },
      { name: 'assets', type: 'decimal', required: false, description: 'Total assets' },
      { name: 'liability', type: 'decimal', required: false, description: 'Total liabilities' },
      { name: 'capital', type: 'decimal', required: false, description: 'Total capital' },
      { name: 'revenues', type: 'decimal', required: false, description: 'Total revenues' },
      { name: 'expenses', type: 'decimal', required: false, description: 'Total expenses' },
      { name: 'shares', type: 'decimal', required: false, description: 'Shares outstanding' },
      { name: 'setldshare', type: 'decimal', required: false, description: 'Settled shares' },
      { name: 'net_value', type: 'decimal', required: false, description: 'Net asset value' },
      { name: 'class', type: 'string', required: false, description: 'Share class' },
      { name: 'income', type: 'decimal', required: false, description: 'Income amount' },
      { name: 'user_id', type: 'string', required: false, description: 'User who entered record' },
      { name: 'entry_date', type: 'DateTime', required: false, description: 'Entry date' },
      { name: 'entry_time', type: 'string', required: false, description: 'Entry time' },
      { name: 'status', type: 'int', required: false, description: 'Record status' },
      { name: 'longmktval', type: 'decimal', required: false, description: 'Long position market value' },
      { name: 'sht_mktval', type: 'decimal', required: false, description: 'Short position market value' },
      { name: 'curncy', type: 'string', required: false, description: 'Currency code' },
      { name: 'fxrate', type: 'decimal', required: false, description: 'FX conversion rate' }
    ],

    'Prihst': [
      { name: 'tkr', type: 'string', required: false, description: 'Security ticker' },
      { name: 'cusip', type: 'string', required: false, description: 'CUSIP identifier' },
      { name: 'prcdate', type: 'DateTime', required: false, description: 'Price date' },
      { name: 'date_chng', type: 'DateTime', required: false, description: 'Date changed' },
      { name: 'price', type: 'decimal', required: false, description: 'Security price' },
      { name: 'source', type: 'string', required: false, description: 'Price source' },
      { name: 'price_type', type: 'string', required: false, description: 'Price type' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'tkr_type', type: 'string', required: false, description: 'Ticker type' },
      { name: 'factor', type: 'decimal', required: false, description: 'Price factor' },
      { name: 'user_id', type: 'string', required: false, description: 'User who entered price' },
      { name: 'prcmemo', type: 'string', required: false, description: 'Price memo' },
      { name: 'long_short', type: 'string', required: false, description: 'Long/short indicator' },
      { name: 'pricetime', type: 'string', required: false, description: 'Price time' },
      { name: 'yield_code', type: 'string', required: false, description: 'Yield calculation code' },
      { name: 'fas_code', type: 'string', required: false, description: 'FAS classification code' },
      { name: 'con_lvl', type: 'decimal', required: false, description: 'Confidence level' },
      { name: 'prc_by_yld', type: 'string', required: false, description: 'Price by yield flag' },
      { name: 'yield', type: 'decimal', required: false, description: 'Yield percentage' },
      { name: 'hash', type: 'decimal', required: false, description: 'Hash value for validation' }
    ],

    'Mktval': [
      { name: 'fund', type: 'string', required: true, description: 'Fund identifier' },
      { name: 'tkr', type: 'string', required: true, description: 'Security ticker' },
      { name: 'valuation_date', type: 'DateTime', required: false, description: 'Valuation date' },
      { name: 'market_value', type: 'decimal', required: false, description: 'Market value' },
      { name: 'price', type: 'decimal', required: false, description: 'Market price' },
      { name: 'quantity', type: 'decimal', required: false, description: 'Position quantity' },
      { name: 'unrealized_gl', type: 'decimal', required: false, description: 'Unrealized gain/loss' }
    ],

    'DailyP': [
      { name: 'tkr', type: 'string', required: true, description: 'Security ticker' },
      { name: 'price_date', type: 'DateTime', required: true, description: 'Price date' },
      { name: 'open_price', type: 'decimal', required: false, description: 'Opening price' },
      { name: 'high_price', type: 'decimal', required: false, description: 'High price' },
      { name: 'low_price', type: 'decimal', required: false, description: 'Low price' },
      { name: 'close_price', type: 'decimal', required: false, description: 'Closing price' },
      { name: 'volume', type: 'decimal', required: false, description: 'Trading volume' },
      { name: 'source', type: 'string', required: false, description: 'Price source' }
    ],

    'Fairv': [
      { name: 'tkr', type: 'string', required: true, description: 'Security ticker' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'valuation_date', type: 'DateTime', required: false, description: 'Valuation date' },
      { name: 'fair_value', type: 'decimal', required: false, description: 'Fair value amount' },
      { name: 'method', type: 'string', required: false, description: 'Valuation method' },
      { name: 'level', type: 'int', required: false, description: 'Fair value hierarchy level' }
    ],

    'Pcrf': [
      { name: 'tkr', type: 'string', required: true, description: 'Security ticker' },
      { name: 'price_source', type: 'string', required: true, description: 'Price source' },
      { name: 'external_id', type: 'string', required: false, description: 'External identifier' },
      { name: 'mapping_rule', type: 'string', required: false, description: 'Price mapping rule' },
      { name: 'is_active', type: 'bool', required: false, description: 'Active status' }
    ],

    'IdxHis': [
      { name: 'index_id', type: 'string', required: true, description: 'Index identifier' },
      { name: 'index_date', type: 'DateTime', required: true, description: 'Index date' },
      { name: 'index_value', type: 'decimal', required: false, description: 'Index value' },
      { name: 'change_value', type: 'decimal', required: false, description: 'Change from previous' },
      { name: 'change_percent', type: 'decimal', required: false, description: 'Percentage change' }
    ],

    'IdxMas': [
      { name: 'index_id', type: 'string', required: true, description: 'Index identifier' },
      { name: 'index_name', type: 'string', required: false, description: 'Index name' },
      { name: 'index_type', type: 'string', required: false, description: 'Index type' },
      { name: 'base_value', type: 'decimal', required: false, description: 'Base index value' },
      { name: 'base_date', type: 'DateTime', required: false, description: 'Base date' }
    ],

    'Yields': [
      { name: 'tkr', type: 'string', required: true, description: 'Security ticker' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'yield_date', type: 'DateTime', required: false, description: 'Yield calculation date' },
      { name: 'yield_type', type: 'string', required: false, description: 'Type of yield' },
      { name: 'yield_value', type: 'decimal', required: false, description: 'Yield percentage' },
      { name: 'duration', type: 'decimal', required: false, description: 'Duration in years' }
    ],

    // Security Classification Models
    'SecCat': [
      { name: 'category_code', type: 'string', required: true, description: 'Security category code' },
      { name: 'category_name', type: 'string', required: false, description: 'Category name' },
      { name: 'parent_category', type: 'string', required: false, description: 'Parent category' },
      { name: 'sort_order', type: 'int', required: false, description: 'Display sort order' }
    ],

    'SecGrp': [
      { name: 'group_code', type: 'string', required: true, description: 'Security group code' },
      { name: 'group_name', type: 'string', required: false, description: 'Group name' },
      { name: 'sector', type: 'string', required: false, description: 'Sector classification' },
      { name: 'industry', type: 'string', required: false, description: 'Industry classification' }
    ],

    'Ptype': [
      { name: 'portfolio_type', type: 'string', required: true, description: 'Portfolio type code' },
      { name: 'type_name', type: 'string', required: false, description: 'Portfolio type name' },
      { name: 'investment_style', type: 'string', required: false, description: 'Investment style' },
      { name: 'risk_level', type: 'string', required: false, description: 'Risk level classification' }
    ],

    'Seclyd': [
      { name: 'layout_id', type: 'string', required: true, description: 'Security layout identifier' },
      { name: 'layout_name', type: 'string', required: false, description: 'Layout name' },
      { name: 'display_config', type: 'string', required: false, description: 'Display configuration' },
      { name: 'is_default', type: 'bool', required: false, description: 'Default layout flag' }
    ],

    'SeclydAg': [
      { name: 'aggregation_id', type: 'string', required: true, description: 'Aggregation identifier' },
      { name: 'layout_id', type: 'string', required: false, description: 'Associated layout ID' },
      { name: 'aggregation_rule', type: 'string', required: false, description: 'Aggregation rule' },
      { name: 'group_by', type: 'string', required: false, description: 'Grouping criteria' }
    ],

    'Auxid': [
      { name: 'primary_id', type: 'string', required: true, description: 'Primary identifier' },
      { name: 'auxiliary_id', type: 'string', required: true, description: 'Auxiliary identifier' },
      { name: 'id_type', type: 'string', required: false, description: 'Identifier type' },
      { name: 'is_active', type: 'bool', required: false, description: 'Active status' }
    ],

    // Fund Organization Models
    'Family': [
      { name: 'family_code', type: 'string', required: true, description: 'Fund family code' },
      { name: 'family_name', type: 'string', required: false, description: 'Family name' },
      { name: 'parent_family', type: 'string', required: false, description: 'Parent family code' },
      { name: 'manager', type: 'string', required: false, description: 'Family manager' },
      { name: 'is_active', type: 'bool', required: false, description: 'Active status' }
    ],

    'Series': [
      { name: 'series_code', type: 'string', required: true, description: 'Series code' },
      { name: 'series_name', type: 'string', required: false, description: 'Series name' },
      { name: 'fund', type: 'string', required: false, description: 'Parent fund' },
      { name: 'expense_ratio', type: 'decimal', required: false, description: 'Expense ratio' },
      { name: 'min_investment', type: 'decimal', required: false, description: 'Minimum investment' }
    ],

    'Shrmas': [
      { name: 'share_id', type: 'string', required: true, description: 'Share identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'share_class', type: 'string', required: false, description: 'Share class' },
      { name: 'shares_outstanding', type: 'decimal', required: false, description: 'Shares outstanding' },
      { name: 'nav_per_share', type: 'decimal', required: false, description: 'NAV per share' }
    ],

    'Shrgrp': [
      { name: 'group_id', type: 'string', required: true, description: 'Share group identifier' },
      { name: 'group_name', type: 'string', required: false, description: 'Group name' },
      { name: 'classification', type: 'string', required: false, description: 'Group classification' },
      { name: 'sort_order', type: 'int', required: false, description: 'Display sort order' }
    ],

    'FundCg': [
      { name: 'capital_gain_id', type: 'string', required: true, description: 'Capital gain identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'tkr', type: 'string', required: false, description: 'Security ticker' },
      { name: 'realized_gain', type: 'decimal', required: false, description: 'Realized gain/loss' },
      { name: 'unrealized_gain', type: 'decimal', required: false, description: 'Unrealized gain/loss' }
    ],

    'Falias': [
      { name: 'alias_id', type: 'string', required: true, description: 'Alias identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'alias_type', type: 'string', required: false, description: 'Alias type' },
      { name: 'alias_value', type: 'string', required: false, description: 'Alias value' },
      { name: 'is_active', type: 'bool', required: false, description: 'Active status' }
    ],

    // Additional Reference Data Models
    'Contry': [
      { name: 'Country', type: 'string', required: true, description: 'Country code' },
      { name: 'ContryName', type: 'string', required: false, description: 'Country name' },
      { name: 'AccInc_Net', type: 'string', required: false, description: 'Accrued income netting' },
      { name: 'TaxTreaty', type: 'string', required: false, description: 'Tax treaty flag' },
      { name: 'Cfd', type: 'string', required: false, description: 'CFD classification' },
      { name: 'Suffix', type: 'string', required: false, description: 'Country suffix' },
      { name: 'CfdDesc', type: 'string', required: false, description: 'CFD description' },
      { name: 'IsoCode', type: 'string', required: false, description: 'ISO country code' },
      { name: 'BpCode', type: 'string', required: false, description: 'BP code' },
      { name: 'Mon', type: 'string', required: false, description: 'Monday trading flag' },
      { name: 'Tue', type: 'string', required: false, description: 'Tuesday trading flag' },
      { name: 'Wed', type: 'string', required: false, description: 'Wednesday trading flag' },
      { name: 'Thu', type: 'string', required: false, description: 'Thursday trading flag' },
      { name: 'Fri', type: 'string', required: false, description: 'Friday trading flag' },
      { name: 'Sat', type: 'string', required: false, description: 'Saturday trading flag' },
      { name: 'Sun', type: 'string', required: false, description: 'Sunday trading flag' },
      { name: 'TPlus', type: 'string', required: false, description: 'Settlement period' },
      { name: 'TaxLot_Liq', type: 'string', required: false, description: 'Tax lot liquidation' },
      { name: 'Hash', type: 'decimal', required: false, description: 'Hash value for validation' }
    ],

    'States': [
      { name: 'state', type: 'string', required: true, description: 'State code' },
      { name: 'name', type: 'string', required: false, description: 'State name' },
      { name: 'hash', type: 'decimal', required: false, description: 'Hash value for validation' }
    ],

    'Reason': [
      { name: 'reason', type: 'string', required: true, description: 'Reason code' },
      { name: 'descr', type: 'string', required: false, description: 'Reason description' },
      { name: 'unused', type: 'string', required: false, description: 'Unused field' },
      { name: 'hash', type: 'decimal', required: false, description: 'Hash value for validation' }
    ],

    // Accounting and GL Models
    'Glcat': [
      { name: 'category_id', type: 'string', required: true, description: 'GL category identifier' },
      { name: 'category_name', type: 'string', required: false, description: 'Category name' },
      { name: 'account_type', type: 'string', required: false, description: 'Account type' },
      { name: 'is_active', type: 'bool', required: false, description: 'Active status' }
    ],

    'Glgrp': [
      { name: 'group_id', type: 'string', required: true, description: 'GL group identifier' },
      { name: 'group_name', type: 'string', required: false, description: 'Group name' },
      { name: 'parent_group', type: 'string', required: false, description: 'Parent group' },
      { name: 'sort_order', type: 'int', required: false, description: 'Display sort order' }
    ],

    'Glprm': [
      { name: 'parameter_id', type: 'string', required: true, description: 'GL parameter identifier' },
      { name: 'parameter_name', type: 'string', required: false, description: 'Parameter name' },
      { name: 'parameter_value', type: 'string', required: false, description: 'Parameter value' },
      { name: 'data_type', type: 'string', required: false, description: 'Data type' }
    ],

    'Glxcat': [
      { name: 'extended_category_id', type: 'string', required: true, description: 'Extended GL category ID' },
      { name: 'category_name', type: 'string', required: false, description: 'Category name' },
      { name: 'mapping_rule', type: 'string', required: false, description: 'Mapping rule' },
      { name: 'is_active', type: 'bool', required: false, description: 'Active status' }
    ],

    'Gl988': [
      { name: 'gl988_id', type: 'string', required: true, description: 'GL 988 identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'account_number', type: 'string', required: false, description: 'GL account number' },
      { name: 'amount', type: 'decimal', required: false, description: 'Transaction amount' },
      { name: 'transaction_date', type: 'DateTime', required: false, description: 'Transaction date' }
    ],

    'Ae': [
      { name: 'entry_id', type: 'string', required: true, description: 'Accounting entry identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'post_date', type: 'DateTime', required: false, description: 'Posting date' },
      { name: 'debit_account', type: 'string', required: false, description: 'Debit account number' },
      { name: 'credit_account', type: 'string', required: false, description: 'Credit account number' },
      { name: 'amount', type: 'decimal', required: false, description: 'Entry amount' },
      { name: 'description', type: 'string', required: false, description: 'Entry description' }
    ],

    // Expense Management Models
    'Opnexp': [
      { name: 'expense_id', type: 'string', required: true, description: 'Open expense identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'expense_type', type: 'string', required: false, description: 'Expense type' },
      { name: 'accrued_amount', type: 'decimal', required: false, description: 'Accrued amount' },
      { name: 'last_accrual_date', type: 'DateTime', required: false, description: 'Last accrual date' },
      { name: 'vendor', type: 'string', required: false, description: 'Vendor name' }
    ],

    'Expfnd': [
      { name: 'expense_fund_id', type: 'string', required: true, description: 'Expense fund identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'expense_type', type: 'string', required: false, description: 'Expense type' },
      { name: 'amount', type: 'decimal', required: false, description: 'Expense amount' },
      { name: 'allocation_method', type: 'string', required: false, description: 'Allocation method' },
      { name: 'effective_date', type: 'DateTime', required: false, description: 'Effective date' }
    ],

    'PosExp': [
      { name: 'position_expense_id', type: 'string', required: true, description: 'Position expense identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'tkr', type: 'string', required: false, description: 'Security ticker' },
      { name: 'expense_amount', type: 'decimal', required: false, description: 'Expense amount' },
      { name: 'calculation_method', type: 'string', required: false, description: 'Calculation method' }
    ],

    // As-Of Data Models
    'AsOfExpend': [
      { name: 'asof_expend_id', type: 'string', required: true, description: 'As-of expense identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'asof_date', type: 'DateTime', required: false, description: 'As-of date' },
      { name: 'expense_amount', type: 'decimal', required: false, description: 'Expense amount' },
      { name: 'expense_type', type: 'string', required: false, description: 'Expense type' }
    ],

    'AsOfTExpend': [
      { name: 'asof_total_expend_id', type: 'string', required: true, description: 'As-of total expense identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'asof_date', type: 'DateTime', required: false, description: 'As-of date' },
      { name: 'total_expenses', type: 'decimal', required: false, description: 'Total expenses' },
      { name: 'calculation_date', type: 'DateTime', required: false, description: 'Calculation date' }
    ],

    'AsOfIncome': [
      { name: 'asof_income_id', type: 'string', required: true, description: 'As-of income identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'asof_date', type: 'DateTime', required: false, description: 'As-of date' },
      { name: 'income_amount', type: 'decimal', required: false, description: 'Income amount' },
      { name: 'income_type', type: 'string', required: false, description: 'Income type' }
    ],

    'AsOfTIncome': [
      { name: 'asof_total_income_id', type: 'string', required: true, description: 'As-of total income identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'asof_date', type: 'DateTime', required: false, description: 'As-of date' },
      { name: 'total_income', type: 'decimal', required: false, description: 'Total income' },
      { name: 'calculation_date', type: 'DateTime', required: false, description: 'Calculation date' }
    ],

    'Divtyp': [
      { name: 'dividend_type', type: 'string', required: true, description: 'Dividend type code' },
      { name: 'description', type: 'string', required: false, description: 'Dividend type description' },
      { name: 'tax_treatment', type: 'string', required: false, description: 'Tax treatment code' },
      { name: 'is_active', type: 'bool', required: false, description: 'Active status' }
    ],

    // OID and Amortization Models
    'Oidlot': [
      { name: 'oid_lot_id', type: 'string', required: true, description: 'OID lot identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'tkr', type: 'string', required: false, description: 'Security ticker' },
      { name: 'purchase_date', type: 'DateTime', required: false, description: 'Purchase date' },
      { name: 'original_discount', type: 'decimal', required: false, description: 'Original discount amount' },
      { name: 'accrued_discount', type: 'decimal', required: false, description: 'Accrued discount to date' },
      { name: 'maturity_date', type: 'DateTime', required: false, description: 'Maturity date' }
    ],

    'AsOfOidlot': [
      { name: 'asof_oid_lot_id', type: 'string', required: true, description: 'As-of OID lot identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'asof_date', type: 'DateTime', required: false, description: 'As-of date' },
      { name: 'oid_amount', type: 'decimal', required: false, description: 'OID amount' },
      { name: 'accrual_method', type: 'string', required: false, description: 'Accrual method' }
    ],

    'AsOfTOidlot': [
      { name: 'asof_total_oid_lot_id', type: 'string', required: true, description: 'As-of total OID lot identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'asof_date', type: 'DateTime', required: false, description: 'As-of date' },
      { name: 'total_oid', type: 'decimal', required: false, description: 'Total OID amount' },
      { name: 'calculation_date', type: 'DateTime', required: false, description: 'Calculation date' }
    ],

    // Tax Processing Models
    'Taxrat': [
      { name: 'tax_rate_id', type: 'string', required: true, description: 'Tax rate identifier' },
      { name: 'tax_type', type: 'string', required: false, description: 'Tax type' },
      { name: 'country', type: 'string', required: false, description: 'Country code' },
      { name: 'rate', type: 'decimal', required: false, description: 'Tax rate percentage' },
      { name: 'effective_date', type: 'DateTime', required: false, description: 'Effective date' },
      { name: 'expiration_date', type: 'DateTime', required: false, description: 'Expiration date' }
    ],

    'Taxcod': [
      { name: 'tax_code', type: 'string', required: true, description: 'Tax code' },
      { name: 'description', type: 'string', required: false, description: 'Tax code description' },
      { name: 'tax_category', type: 'string', required: false, description: 'Tax category' },
      { name: 'withholding_rate', type: 'decimal', required: false, description: 'Withholding rate' }
    ],

    'Taxtbl': [
      { name: 'tax_table_id', type: 'string', required: true, description: 'Tax table identifier' },
      { name: 'country', type: 'string', required: false, description: 'Country code' },
      { name: 'income_type', type: 'string', required: false, description: 'Income type' },
      { name: 'tax_rate', type: 'decimal', required: false, description: 'Tax rate' },
      { name: 'threshold_amount', type: 'decimal', required: false, description: 'Threshold amount' }
    ],

    'AsOfTaxlot': [
      { name: 'asof_taxlot_id', type: 'string', required: true, description: 'As-of tax lot identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'asof_date', type: 'DateTime', required: false, description: 'As-of date' },
      { name: 'tax_basis', type: 'decimal', required: false, description: 'Tax basis' },
      { name: 'unrealized_gl', type: 'decimal', required: false, description: 'Unrealized gain/loss' }
    ],

    'AsOfTTaxlot': [
      { name: 'asof_total_taxlot_id', type: 'string', required: true, description: 'As-of total tax lot identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'asof_date', type: 'DateTime', required: false, description: 'As-of date' },
      { name: 'total_tax_basis', type: 'decimal', required: false, description: 'Total tax basis' },
      { name: 'total_unrealized_gl', type: 'decimal', required: false, description: 'Total unrealized gain/loss' }
    ],

    // Trading and Settlement Models
    'Trxtyp': [
      { name: 'transaction_type', type: 'string', required: true, description: 'Transaction type code' },
      { name: 'description', type: 'string', required: false, description: 'Transaction description' },
      { name: 'category', type: 'string', required: false, description: 'Transaction category' },
      { name: 'requires_approval', type: 'bool', required: false, description: 'Approval required flag' },
      { name: 'is_reversible', type: 'bool', required: false, description: 'Reversible transaction flag' },
      { name: 'gl_impact', type: 'string', required: false, description: 'GL impact type' }
    ],

    'Trxcur': [
      { name: 'transaction_currency_id', type: 'string', required: true, description: 'Transaction currency identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'transaction_id', type: 'string', required: false, description: 'Transaction identifier' },
      { name: 'currency_code', type: 'string', required: false, description: 'Currency code' },
      { name: 'exchange_rate', type: 'decimal', required: false, description: 'Exchange rate' },
      { name: 'local_amount', type: 'decimal', required: false, description: 'Local currency amount' },
      { name: 'base_amount', type: 'decimal', required: false, description: 'Base currency amount' }
    ],

    'Auttrx': [
      { name: 'auto_transaction_id', type: 'string', required: true, description: 'Auto transaction identifier' },
      { name: 'fund', type: 'string', required: false, description: 'Fund identifier' },
      { name: 'transaction_type', type: 'string', required: false, description: 'Transaction type' },
      { name: 'frequency', type: 'string', required: false, description: 'Processing frequency' },
      { name: 'next_run_date', type: 'DateTime', required: false, description: 'Next execution date' },
      { name: 'is_active', type: 'bool', required: false, description: 'Active status' }
    ],

    // Default fallback for models without specific definitions
    'default': [
      { name: 'id', type: 'string', required: true, description: 'Primary identifier' },
      { name: 'name', type: 'string', required: false, description: 'Display name' },
      { name: 'description', type: 'string', required: false, description: 'Description' },
      { name: 'created_date', type: 'DateTime', required: false, description: 'Creation date' },
      { name: 'modified_date', type: 'DateTime', required: false, description: 'Last modification date' },
      { name: 'status', type: 'string', required: false, description: 'Record status' }
    ]
  };

  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName);
    setIsLoadingAttributes(true);
    
    // Load attributes for the selected model
    const attributes = modelAttributeMap[modelName] || [];
    setTimeout(() => {
      setModelAttributes(attributes);
      setIsLoadingAttributes(false);
    }, 500); // Simulate loading time
  };

  const applyModelSelection = () => {
    if (selectedModel) {
      updateField(field.Id, { 
        Entity: selectedModel,
        Label: `${selectedModel} Data Model`
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <div
        onClick={onSelect}
        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
          isSelected
            ? isDarkMode ? 'border-blue-400 bg-blue-900/20' : 'border-blue-500 bg-blue-50'
            : isDarkMode ? 'border-gray-600 hover:border-gray-500 bg-gray-800' : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : ''}`}>Data Model</span>
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
        
        <div className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {field.Entity ? `Model: ${field.Entity}` : 'No model selected'}
        </div>
        
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setIsDialogOpen(true);
          }}
          size="sm"
          variant="outline"
          className={`w-full ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
        >
          <Database className="w-4 h-4 mr-2" />
          {field.Entity ? 'Change Model' : 'Select Model'}
        </Button>
      </div>

      {/* Model Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`max-w-4xl max-h-[80vh] ${isDarkMode ? 'bg-gray-800 border-gray-600' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : ''}>Select Data Model</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
            {/* Model Selection */}
            <div>
              <Label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : ''}`}>Available Models</Label>
              
              {/* Search and Filter Controls */}
              <div className="mt-2 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search models..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                  />
                </div>
                
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {filteredModels.length} of {availableModels.length} models
                </div>
              </div>
              
              <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
                {filteredModels.map((model) => (
                  <button
                    key={model.name}
                    onClick={() => handleModelSelect(model.name)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selectedModel === model.name
                        ? isDarkMode ? 'bg-emerald-900/30 border-emerald-400 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                        : isDarkMode ? 'hover:bg-gray-700 border-gray-600 text-gray-300' : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {model.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Attributes */}
            <div>
              <Label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : ''}`}>
                Model Attributes {selectedModel && `(${selectedModel})`}
              </Label>
              
              <div className={`mt-2 border rounded-lg ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} h-96 overflow-y-auto`}>
                {isLoadingAttributes ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : modelAttributes.length > 0 ? (
                  <div className="p-3 space-y-2">
                    {modelAttributes.map((attr, index) => (
                      <div 
                        key={index} 
                        className={`p-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {attr.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {attr.type}
                            </span>
                            {attr.required && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
                              }`}>
                                Required
                              </span>
                            )}
                          </div>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {attr.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : selectedModel ? (
                  <div className={`flex items-center justify-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="text-center">
                      <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No attributes defined for {selectedModel}</p>
                    </div>
                  </div>
                ) : (
                  <div className={`flex items-center justify-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="text-center">
                      <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Select a model to view attributes</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              Cancel
            </Button>
            <Button
              onClick={applyModelSelection}
              disabled={!selectedModel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Select Model
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FieldComponent({ 
  field, 
  onSelect, 
  onRemove, 
  onMoveUp,
  onMoveDown,
  isSelected,
  addField,
  isDarkMode,
  selectedField,
  setSelectedField,
  removeChildField,
  updateFieldInFormData
}: { 
  field: FormField; 
  onSelect: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isSelected: boolean;
  addField: (type: string, groupId?: string) => void;
  isDarkMode: boolean;
  selectedField: FormField | null;
  setSelectedField: (field: FormField | null) => void;
  removeChildField: (groupId: string, childFieldId: string) => void;
  updateFieldInFormData: (fieldId: string, updates: Partial<FormField>) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  if (field.Type === 'GROUP') {
    return (
      <GroupField 
        field={field} 
        onSelect={onSelect} 
        onRemove={onRemove} 
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        isSelected={isSelected}
        addField={addField}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isDarkMode={isDarkMode}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        removeChildField={removeChildField}
        updateFieldInFormData={updateFieldInFormData}
      />
    );
  }

  // Special rendering for DATAMODEL
  if (field.Type === 'DATAMODEL') {
    return (
      <DataModelComponent
        field={field}
        isSelected={isSelected}
        onSelect={onSelect}
        onRemove={onRemove}
        isDarkMode={isDarkMode}
        updateField={updateFieldInFormData}
      />
    );
  }

  const componentType = ComponentTypes[field.Type as keyof typeof ComponentTypes];
  const Icon = componentType?.icon || Type;
  const color = componentType?.color || 'gray';



  return (
    <div
      onClick={onSelect}
      className={`p-2 border rounded cursor-pointer transition-all ${
        isSelected
          ? `border-blue-500 ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-50'}`
          : `${isDarkMode ? 'border-gray-600 hover:border-gray-500 bg-gray-700' : 'border-gray-200 hover:border-gray-300 bg-white'}`
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className={`w-3 h-3 text-${color}-600`} />
          <div>
            <div className={`font-medium text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{field.Label || field.Id}</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{field.Type}</div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
          >
            <ChevronUp className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
          >
            <ChevronDown className="w-3 h-3" />
          </Button>
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
    </div>
  );
}

function GroupField({
  field,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  isSelected,
  addField,
  isExpanded,
  setIsExpanded,
  isDarkMode,
  selectedField,
  setSelectedField,
  removeChildField,
  updateFieldInFormData
}: {
  field: FormField;
  onSelect: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isSelected: boolean;
  addField: (type: string, groupId?: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isDarkMode: boolean;
  selectedField: FormField | null;
  setSelectedField: (field: FormField | null) => void;
  removeChildField: (groupId: string, childFieldId: string) => void;
  updateFieldInFormData: (fieldId: string, updates: Partial<FormField>) => void;
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
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
          >
            <ChevronUp className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className={`p-1 h-6 w-6 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
          >
            <ChevronDown className="w-3 h-3" />
          </Button>
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

      {isExpanded && (
        <div 
          data-group-drop="true"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event from bubbling to main form
            const componentType = e.dataTransfer.getData('componentType');
            if (componentType) {
              console.log('Adding component to group:', componentType, 'Group ID:', field.Id);
              addField(componentType, field.Id);
            }
          }}
          className={`group-drop-zone min-h-24 p-4 border-2 border-dashed rounded transition-colors ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-700 hover:border-blue-500 hover:bg-blue-900/20' 
              : 'border-gray-200 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          {(field.ChildFields || []).length === 0 ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              <Square className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Drag components here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(field.ChildFields || []).map((childField) => (
                <div
                  key={childField.Id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedField(childField);
                  }}
                  className={`p-3 border rounded shadow-sm cursor-pointer transition-all hover:shadow-md ${
                    selectedField?.Id === childField.Id
                      ? isDarkMode 
                        ? 'bg-blue-600 border-blue-500' 
                        : 'bg-blue-50 border-blue-300'
                      : isDarkMode 
                        ? 'bg-gray-600 border-gray-500 hover:bg-gray-550' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        childField.Type === 'TEXT' ? 'bg-blue-500' :
                        childField.Type === 'SELECT' ? 'bg-orange-500' :
                        childField.Type === 'CHECKBOX' ? 'bg-cyan-500' :
                        childField.Type === 'GRIDLKP' ? 'bg-green-500' :
                        childField.Type === 'LSTLKP' ? 'bg-purple-500' :
                        childField.Type === 'ACTION' ? 'bg-red-500' :
                        childField.Type === 'WARNING' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        selectedField?.Id === childField.Id
                          ? isDarkMode ? 'text-white' : 'text-blue-700'
                          : isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {childField.Label || 'Unnamed Component'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        selectedField?.Id === childField.Id
                          ? isDarkMode ? 'text-blue-200 bg-blue-700' : 'text-blue-600 bg-blue-200'
                          : isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-100'
                      }`}>
                        {childField.Type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const childIndex = (field.ChildFields || []).findIndex(f => f.Id === childField.Id);
                          if (childIndex > 0) {
                            const updatedChildren = [...(field.ChildFields || [])];
                            [updatedChildren[childIndex], updatedChildren[childIndex - 1]] = 
                            [updatedChildren[childIndex - 1], updatedChildren[childIndex]];
                            updateFieldInFormData(field.Id, { ChildFields: updatedChildren });
                          }
                        }}
                        disabled={(field.ChildFields || []).findIndex(f => f.Id === childField.Id) === 0}
                        className={`h-6 w-6 p-0 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const childIndex = (field.ChildFields || []).findIndex(f => f.Id === childField.Id);
                          if (childIndex < (field.ChildFields || []).length - 1) {
                            const updatedChildren = [...(field.ChildFields || [])];
                            [updatedChildren[childIndex], updatedChildren[childIndex + 1]] = 
                            [updatedChildren[childIndex + 1], updatedChildren[childIndex]];
                            updateFieldInFormData(field.Id, { ChildFields: updatedChildren });
                          }
                        }}
                        disabled={(field.ChildFields || []).findIndex(f => f.Id === childField.Id) === (field.ChildFields || []).length - 1}
                        className={`h-6 w-6 p-0 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedField(childField);
                        }}
                        className={`h-6 w-6 p-0 ${
                          isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'
                        }`}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeChildField(field.Id, childField.Id);
                        }}
                        className={`h-6 w-6 p-0 ${
                          isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-600'
                        }`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Component preview/summary */}
                  <div className={`mt-2 text-xs ${
                    selectedField?.Id === childField.Id
                      ? isDarkMode ? 'text-blue-200' : 'text-blue-600'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {childField.DataField && `Field: ${childField.DataField}`}
                    {childField.Required && ' • Required'}
                    {childField.Width && ` • Width: ${childField.Width}`}
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

      case 'DATEPKR':
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

      case 'DATAMODEL':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Data Model Properties</h4>
            
            <div>
              <Label htmlFor="field-model">Selected Model</Label>
              <Input
                id="field-model"
                value={field.Entity || ""}
                onChange={(e) => onUpdate({ Entity: e.target.value })}
                placeholder="Select a model from MfactModels"
                className="text-sm"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Use the "Select Model" button in the component to choose a model</p>
            </div>

            <div>
              <Label htmlFor="field-display-label">Display Label</Label>
              <Input
                id="field-display-label"
                value={field.Label}
                onChange={(e) => onUpdate({ Label: e.target.value })}
                placeholder="Data Model Display Name"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="field-data-field">Data Field</Label>
              <Input
                id="field-data-field"
                value={field.DataField}
                onChange={(e) => onUpdate({ DataField: e.target.value })}
                placeholder="model_data_field"
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
                placeholder="Group title"
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
          <span>Properties</span>
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
                placeholder="Field name"
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

    // MenuID validation
    if (!data.menuId || data.menuId.trim() === '') {
      errors.push('MenuID is required');
    } else if (!/^[A-Z0-9_]+$/.test(data.menuId)) {
      errors.push('MenuID must contain only uppercase letters, numbers and underscores');
    }

    // Label validation
    if (!data.label || data.label.trim() === '') {
      errors.push('Form label is required');
    }

    // Width validation
    if (!data.formWidth || !data.formWidth.match(/^\d+(px|%|em|rem)$/)) {
      errors.push('FormWidth must be a valid CSS value (e.g. 700px, 100%)');
    }

    // Fields validation
    if (!data.fields || !Array.isArray(data.fields)) {
      errors.push('Form must contain an array of fields');
    } else {
      data.fields.forEach((field: any, index: number) => {
        const fieldPrefix = `Field ${index + 1}`;

        // Required properties validation
        if (!field.Id) errors.push(`${fieldPrefix}: ID is required`);
        if (!field.Type) errors.push(`${fieldPrefix}: Type is required`);
        if (!field.Label) errors.push(`${fieldPrefix}: Label is required`);
        if (!field.DataField) errors.push(`${fieldPrefix}: DataField is required`);

        // Component types validation
        const validTypes = [...Object.keys(ComponentTypes), ...customComponents.map(c => c.id)];
        if (field.Type && !validTypes.includes(field.Type)) {
          errors.push(`${fieldPrefix}: Type "${field.Type}" is not valid`);
        }

        // Unique IDs validation
        const duplicateIds = data.fields.filter((f: any) => f.Id === field.Id);
        if (duplicateIds.length > 1) {
          errors.push(`${fieldPrefix}: ID "${field.Id}" is duplicated`);
        }

        // Unique DataFields validation
        const duplicateDataFields = data.fields.filter((f: any) => f.DataField === field.DataField);
        if (duplicateDataFields.length > 1) {
          warns.push(`${fieldPrefix}: DataField "${field.DataField}" is duplicated`);
        }

        // Type-specific validation
        if (field.Type === 'GROUP' && field.ChildFields && field.ChildFields.length === 0) {
          warns.push(`${fieldPrefix}: Empty group (no child fields)`);
        }

        if (field.Type === 'SELECT' && !field.Value) {
          warns.push(`${fieldPrefix}: SELECT without defined options`);
        }

        // Required properties validation
        if (field.Required && typeof field.Required !== 'boolean') {
          errors.push(`${fieldPrefix}: Required must be true or false`);
        }

        if (field.Width && !field.Width.match(/^\d+(px|%|em|rem)$/)) {
          errors.push(`${fieldPrefix}: Width must be a valid CSS value`);
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
          JSON Schema with Validation
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {isValid ? 'Valid' : `${validationErrors.length} error(s)`}
          </span>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-600' : 'bg-red-50 border-red-200'}`}>
          <h4 className={`font-medium mb-2 flex items-center ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Validation Errors
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

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-yellow-900/20 border-yellow-600' : 'bg-yellow-50 border-yellow-200'}`}>
          <h4 className={`font-medium mb-2 flex items-center ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Warnings
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
            Fields
          </div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {customComponents.length}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Custom Components
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
      title: "Welcome to Form Builder",
      content: "This tutorial will guide you through all the features of the form generator. You'll learn to create complex forms with real-time validation.",
      highlight: null,
      action: "Let's start!"
    },
    {
      title: "Component Palette",
      content: "On the left, you'll find the component palette organized by categories: Input, Selection, Date, Files, etc. Drag and drop components into the construction area.",
      highlight: "palette",
      action: "Drag a TEXT component"
    },
    {
      title: "Construction Area",
      content: "In the center is the construction area where you assemble your form. Components can be reorganized by drag and drop.",
      highlight: "builder",
      action: "Drop your component here"
    },
    {
      title: "Properties Panel",
      content: "On the right, the properties panel allows you to configure each selected component: label, validation, style, etc.",
      highlight: "properties",
      action: "Click on a component"
    },
    {
      title: "JSON Validator",
      content: "The JSON tab displays the generated schema in real-time with automatic validation. Errors and warnings are highlighted.",
      highlight: "json",
      action: "Check the validation"
    },
    {
      title: "Custom Components",
      content: "You can create your own components via the '+' icon. Use JSON or the visual creator to define reusable components.",
      highlight: "custom",
      action: "Create a component"
    },
    {
      title: "Save and Collaboration",
      content: "Use the New/Clear/Save buttons to manage your forms. Invite collaborators to work together in real-time.",
      highlight: "actions",
      action: "Save your work"
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

// Step-by-Step Guidance System
function StepByStepGuide({ isDarkMode }: { isDarkMode: boolean }) {
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const steps = {
    welcome: {
      title: "Welcome to FormBuilder Enterprise",
      content: "Let's get you started with creating professional forms. This guide will walk you through each step.",
      nextStep: "create-form",
      actions: [
        { label: "Start Building", action: () => setCurrentStep("create-form") },
        { label: "Skip Guide", action: () => setIsOpen(false) }
      ]
    },
    "create-form": {
      title: "Step 1: Create Your Form",
      content: "Begin by setting up your form's basic information. Give it a meaningful name and configure the layout.",
      nextStep: "add-components",
      actions: [
        { label: "Next: Add Components", action: () => setCurrentStep("add-components") },
        { label: "Previous", action: () => setCurrentStep("welcome") }
      ]
    },
    "add-components": {
      title: "Step 2: Add Form Components",
      content: "Drag components from the left panel into your form. Start with basic inputs like text fields and selections.",
      nextStep: "configure-properties",
      actions: [
        { label: "Next: Configure Properties", action: () => setCurrentStep("configure-properties") },
        { label: "Previous", action: () => setCurrentStep("create-form") }
      ]
    },
    "configure-properties": {
      title: "Step 3: Configure Component Properties",
      content: "Select any component to configure its properties on the right panel. Set labels, validation rules, and styling.",
      nextStep: "save-form",
      actions: [
        { label: "Next: Save Your Work", action: () => setCurrentStep("save-form") },
        { label: "Previous", action: () => setCurrentStep("add-components") }
      ]
    },
    "save-form": {
      title: "Step 4: Save Your Form",
      content: "Click the Save button to store your form. You can always come back to edit it later from the dashboard.",
      nextStep: null,
      actions: [
        { label: "Finish Guide", action: () => setIsOpen(false) },
        { label: "Previous", action: () => setCurrentStep("configure-properties") }
      ]
    }
  };

  const currentStepData = currentStep ? steps[currentStep as keyof typeof steps] : null;

  const startGuide = () => {
    setCurrentStep("welcome");
    setIsOpen(true);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={startGuide}
        className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        Guide
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`max-w-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          {currentStepData && (
            <>
              <DialogHeader>
                <DialogTitle className={isDarkMode ? 'text-white' : ''}>
                  {currentStepData.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {currentStepData.content}
                </p>
                
                <div className="flex justify-between items-center pt-4">
                  {currentStepData.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={index === 0 ? "default" : "outline"}
                      onClick={action.action}
                      className={index === 1 && isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function FormBuilderFixed() {
  const { formId } = useParams<{ formId?: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user && (user as any).role === 'admin';
  
  const [formData, setFormData] = useState({
    id: null as number | null,
    menuId: `FORM_${Date.now()}`,
    label: 'My Form',
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
  const [newComponentConfig, setNewComponentConfig] = useState<{
    name: string;
    label: string;
    icon: string;
    color: string;
    properties: string;
    dataField: string;
    entity: string;
    width: string;
    spacing: string;
    value: string;
    required: boolean;
    inline: boolean;
    outlined: boolean;
    placeholder: string;
    minLength: string;
    maxLength: string;
    options: string;
  }>({
    name: '',
    label: '',
    icon: 'Square',
    color: 'gray',
    properties: '',
    dataField: '',
    entity: '',
    width: '',
    spacing: '',
    value: '',
    required: false,
    inline: false,
    outlined: false,
    placeholder: '',
    minLength: '',
    maxLength: '',
    options: ''
  });
  const [componentCreationStep, setComponentCreationStep] = useState(1);
  const [showAddComponent, setShowAddComponent] = useState(false);

  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);
  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState(false);
  const [isDragZoneCollapsed, setIsDragZoneCollapsed] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const formBuilderRef = useRef<HTMLDivElement>(null);

  // Grid configuration state for ultra-advanced grid system
  interface GridCell {
    id: string;
    row: number;
    col: number;
    width: number;
    height: number;
    colspan: number;
    rowspan: number;
    merged: boolean;
    isEmpty: boolean;
    component: { Type: string; Label: string } | null;
  }

  const [gridConfig, setGridConfig] = useState(() => {
    const initialCells: GridCell[] = [];
    const rows = 4;
    const cols = 6;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        initialCells.push({
          id: `cell-${row}-${col}`,
          row,
          col,
          width: 1,
          height: 1,
          colspan: 1,
          rowspan: 1,
          merged: false,
          isEmpty: true,
          component: null
        });
      }
    }
    
    return {
      rows,
      cols,
      cells: initialCells
    };
  });

  const [selectedGridCell, setSelectedGridCell] = useState<string | null>(null);

  // Load form data from API if formId is provided
  const { data: existingForm, isLoading: formLoading } = useQuery({
    queryKey: [`/api/forms/${formId}`],
    enabled: !!formId,
  });

  // Update grid with form components when form data loads
  useEffect(() => {
    if (existingForm && formData.fields.length > 0) {
      setGridConfig(prev => {
        const updatedCells = [...prev.cells];
        
        // Reset all cells first
        updatedCells.forEach(cell => {
          cell.isEmpty = true;
          cell.component = null;
        });
        
        // Place components in grid cells
        formData.fields.forEach((field, index) => {
          if (index < updatedCells.length) {
            updatedCells[index].isEmpty = false;
            updatedCells[index].component = {
              Type: field.Type,
              Label: field.Label
            };
          }
        });
        
        return {
          ...prev,
          cells: updatedCells
        };
      });
    }
  }, [existingForm, formData.fields]);

  // Type for existing form data
  interface ExistingFormData {
    id: number;
    menuId: string;
    label: string;
    formWidth: string;
    layout: string;
    fields?: FormField[];
    formDefinition?: string;
  }

  // Clear form state when changing forms and load existing form data
  useEffect(() => {
    console.log('Form loading effect triggered:', { formId, existingForm, formLoading });
    
    if (formId && existingForm) {
      console.log('Loading existing form data:', existingForm);
      
      // Loading existing form - clear state and load form data
      let parsedFields: FormField[] = [];
      let parsedCustomComponents: any[] = [];
      
      try {
        if ((existingForm as any).formDefinition) {
          console.log('Found formDefinition:', (existingForm as any).formDefinition);
          const definition = JSON.parse((existingForm as any).formDefinition);
          parsedFields = Array.isArray(definition.fields) ? definition.fields : [];
          parsedCustomComponents = Array.isArray(definition.customComponents) ? definition.customComponents : [];
          console.log('Parsed fields and components:', { parsedFields, parsedCustomComponents });
        } else if (Array.isArray((existingForm as any).fields)) {
          console.log('Using legacy fields format:', (existingForm as any).fields);
          parsedFields = (existingForm as any).fields;
        }
      } catch (error) {
        console.error('Error parsing form definition:', error);
        parsedFields = [];
        parsedCustomComponents = [];
      }
      
      const formDataToSet = {
        id: (existingForm as any).id,
        menuId: (existingForm as any).menuId || `FORM_${Date.now()}`,
        label: (existingForm as any).label || 'My Form',
        formWidth: (existingForm as any).formWidth || '700px',
        layout: (existingForm as any).layout || 'PROCESS',
        fields: parsedFields
      };
      
      console.log('Setting form data:', formDataToSet);
      console.log('Setting custom components:', parsedCustomComponents);
      setFormData(formDataToSet);
      setSelectedField(null);
      setCustomComponents(parsedCustomComponents);
      
      // Force a re-render after a short delay to ensure state has updated
      setTimeout(() => {
        console.log('Current formData after setting:', formData);
        console.log('Current fields after setting:', formData.fields);
      }, 100);
    } else if (!formId) {
      console.log('Creating new form - resetting to default state');
      // Creating new form - reset to default state
      setFormData({
        id: null,
        menuId: `FORM_${Date.now()}`,
        label: 'My Form',
        formWidth: '700px',
        layout: 'PROCESS',
        fields: []
      });
      setSelectedField(null);
      setCustomComponents([]);
    }
  }, [formId, existingForm]);

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

  // Clean up duplicate components that appear both in groups and root level
  const cleanupDuplicateComponents = (fields: FormField[]): FormField[] => {
    const componentIdsInGroups = new Set<string>();
    
    // First pass: collect all component IDs that are inside groups
    fields.forEach(field => {
      if (field.Type === 'GROUP' && field.ChildFields) {
        field.ChildFields.forEach(child => {
          componentIdsInGroups.add(child.Id);
        });
      }
    });
    
    // Second pass: remove root-level components that also exist in groups
    return fields.filter(field => {
      if (field.Type === 'GROUP') {
        return true; // Keep all groups
      }
      return !componentIdsInGroups.has(field.Id); // Remove if exists in a group
    });
  };

  const addField = (componentType: string, targetGroupId?: string) => {
    const newField = createDefaultField(componentType);
    
    if (targetGroupId) {
      // Adding to a specific group
      setFormData(prev => {
        const updatedFields = prev.fields.map(field => {
          if (field.Id === targetGroupId) {
            return {
              ...field,
              ChildFields: [...(field.ChildFields || []), newField]
            };
          }
          return field;
        });
        
        // Clean up any duplicates after adding to group
        return {
          ...prev,
          fields: cleanupDuplicateComponents(updatedFields)
        };
      });
    } else {
      // Adding to main form
      setFormData(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));
    }
    
    setSelectedField(newField);
    
    // Auto-save after adding a component
    if (formData.id) {
      setTimeout(() => {
        saveFormMutation.mutate();
      }, 500);
    }
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= formData.fields.length) return;
    
    setFormData(prev => {
      const newFields = [...prev.fields];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);
      
      return {
        ...prev,
        fields: newFields
      };
    });
    
    // Auto-save after moving
    if (formData.id) {
      setTimeout(() => {
        saveFormMutation.mutate();
      }, 500);
    }
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
    
    // Auto-save after removing a component
    if (formData.id) {
      setTimeout(() => {
        saveFormMutation.mutate();
      }, 500);
    }
  };

  const removeChildField = (groupId: string, childFieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => {
        if (field.Id === groupId && field.ChildFields) {
          return {
            ...field,
            ChildFields: field.ChildFields.filter(child => child.Id !== childFieldId)
          };
        }
        return field;
      })
    }));

    if (selectedField?.Id === childFieldId) {
      setSelectedField(null);
    }
    
    // Auto-save after removing a child component
    if (formData.id) {
      setTimeout(() => {
        saveFormMutation.mutate();
      }, 500);
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
    
    // Auto-save after updating field properties
    if (formData.id) {
      setTimeout(() => {
        saveFormMutation.mutate();
      }, 1000);
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
        alert('Name and label are required in JSON configuration');
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
        alert('A component with this name already exists');
        return;
      }
      
      setCustomComponents(prev => [...prev, newComponent]);
      alert('Component added successfully!');
    } catch (error) {
      console.error('Invalid JSON configuration:', error);
      alert('Invalid JSON configuration. Please check the syntax.');
    }
  };

  // Reset component creation form
  const resetComponentCreation = () => {
    setNewComponentConfig({ 
      name: '', 
      label: '', 
      icon: 'Square', 
      color: 'gray',
      properties: '',
      dataField: '',
      entity: '',
      width: '',
      spacing: '',
      value: '',
      required: false,
      inline: false,
      outlined: false,
      placeholder: '',
      minLength: '',
      maxLength: '',
      options: ''
    } as typeof newComponentConfig);
    setComponentCreationStep(1);
  };

  // Grid management functions
  const addGridRow = () => {
    setGridConfig(prev => {
      const newRows = prev.rows + 1;
      const newCells: GridCell[] = [...prev.cells];
      
      for (let col = 0; col < prev.cols; col++) {
        newCells.push({
          id: `cell-${prev.rows}-${col}`,
          row: prev.rows,
          col,
          width: 1,
          height: 1,
          colspan: 1,
          rowspan: 1,
          merged: false,
          isEmpty: true,
          component: null
        });
      }
      
      return {
        ...prev,
        rows: newRows,
        cells: newCells
      };
    });
  };

  const removeGridRow = () => {
    if (gridConfig.rows <= 1) return;
    
    setGridConfig(prev => ({
      ...prev,
      rows: prev.rows - 1,
      cells: prev.cells.filter(cell => cell.row < prev.rows - 1)
    }));
  };

  const addGridColumn = () => {
    setGridConfig(prev => {
      const newCols = prev.cols + 1;
      const newCells: GridCell[] = [...prev.cells];
      
      for (let row = 0; row < prev.rows; row++) {
        newCells.push({
          id: `cell-${row}-${prev.cols}`,
          row,
          col: prev.cols,
          width: 1,
          height: 1,
          colspan: 1,
          rowspan: 1,
          merged: false,
          isEmpty: true,
          component: null
        });
      }
      
      return {
        ...prev,
        cols: newCols,
        cells: newCells
      };
    });
  };

  const removeGridColumn = () => {
    if (gridConfig.cols <= 1) return;
    
    setGridConfig(prev => ({
      ...prev,
      cols: prev.cols - 1,
      cells: prev.cells.filter(cell => cell.col < prev.cols - 1)
    }));
  };

  const mergeGridCells = () => {
    if (!selectedGridCell) return;
    
    setGridConfig(prev => {
      const cellIndex = prev.cells.findIndex(c => c.id === selectedGridCell);
      if (cellIndex === -1) return prev;
      
      const cell = prev.cells[cellIndex];
      const updatedCells = [...prev.cells];
      
      updatedCells[cellIndex] = {
        ...cell,
        colspan: Math.min(cell.colspan + 1, prev.cols - cell.col),
        rowspan: Math.min(cell.rowspan + 1, prev.rows - cell.row)
      };
      
      return {
        ...prev,
        cells: updatedCells
      };
    });
  };

  const splitGridCell = () => {
    if (!selectedGridCell) return;
    
    setGridConfig(prev => {
      const cellIndex = prev.cells.findIndex(c => c.id === selectedGridCell);
      if (cellIndex === -1) return prev;
      
      const cell = prev.cells[cellIndex];
      const updatedCells = [...prev.cells];
      
      updatedCells[cellIndex] = {
        ...cell,
        colspan: Math.max(cell.colspan - 1, 1),
        rowspan: Math.max(cell.rowspan - 1, 1)
      };
      
      return {
        ...prev,
        cells: updatedCells
      };
    });
  };

  const clearGridCell = (cellId: string) => {
    setGridConfig(prev => {
      const cellIndex = prev.cells.findIndex(c => c.id === cellId);
      if (cellIndex === -1) return prev;
      
      const updatedCells: GridCell[] = [...prev.cells];
      updatedCells[cellIndex] = {
        ...updatedCells[cellIndex],
        component: null,
        isEmpty: true
      };
      
      return {
        ...prev,
        cells: updatedCells
      };
    });
  };

  const handleGridCellDrop = (e: React.DragEvent, cellId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const componentType = e.dataTransfer.getData('componentType');
    if (componentType) {
      // Use the existing addField function to create the component
      addField(componentType);
      
      // Get the newly created field (it will be the last one)
      const newFieldId = `${componentType}_${Date.now()}`;
      
      // Add reference to grid cell
      setGridConfig(prev => {
        const cellIndex = prev.cells.findIndex(c => c.id === cellId);
        if (cellIndex === -1) return prev;
        
        const updatedCells: GridCell[] = [...prev.cells];
        updatedCells[cellIndex] = {
          ...updatedCells[cellIndex],
          component: { 
            Type: componentType, 
            Label: ComponentTypes[componentType as keyof typeof ComponentTypes]?.label || componentType 
          },
          isEmpty: false
        };
        
        return {
          ...prev,
          cells: updatedCells
        };
      });
    }
  };

  const getComponentIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      'TEXT': '📝',
      'TEXTAREA': '📄',
      'SELECT': '🔽',
      'CHECKBOX': '☑️',
      'RADIOGRP': '🔘',
      'DATEPKR': '📅',
      'FILEUPLOAD': '📁',
      'GRIDLKP': '🗂️',
      'LSTLKP': '📋',
      'GROUP': '📦',
      'ACTION': '⚡',
      'DATAMODEL': '🏗️'
    };
    return iconMap[type] || '🔲';
  };

  // Method 2: Form-based Component Creator
  const addComponentFromForm = () => {
    if (!newComponentConfig.name || !newComponentConfig.label) return;
    
    const properties = {
      // Basic properties
      dataField: newComponentConfig.dataField || '',
      entity: newComponentConfig.entity || 'TableName',
      width: newComponentConfig.width || '100%',
      spacing: newComponentConfig.spacing || 'md',
      value: newComponentConfig.value || '',
      
      // Options booléennes
      required: newComponentConfig.required || false,
      inline: newComponentConfig.inline || false,
      outlined: newComponentConfig.outlined || false,
      
      // Specific properties
      placeholder: newComponentConfig.placeholder || '',
      minLength: newComponentConfig.minLength ? parseInt(newComponentConfig.minLength) : undefined,
      maxLength: newComponentConfig.maxLength ? parseInt(newComponentConfig.maxLength) : undefined,
      options: newComponentConfig.options ? newComponentConfig.options.split('\n').filter(opt => opt.trim()) : []
    };

    const newComponent = {
      id: newComponentConfig.name.toUpperCase(),
      name: newComponentConfig.name,
      label: newComponentConfig.label,
      icon: newComponentConfig.icon,
      color: newComponentConfig.color,
      properties: properties,
      isCustom: true
    };
    
    setCustomComponents(prev => [...prev, newComponent]);
    resetComponentCreation();
    setShowAddComponent(false);
  };

  const removeCustomComponent = (componentId: string) => {
    setCustomComponents(prev => prev.filter(comp => comp.id !== componentId));
  };

  // Create new form function
  const createNewForm = () => {
    if (confirm('Are you sure you want to create a new form? Unsaved changes will be lost.')) {
      setFormData({
        id: null,
        menuId: `FORM_${Date.now()}`,
        label: 'My Form',
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
    if (confirm('Are you sure you want to clear the form? All fields will be removed.')) {
      setFormData(prev => ({
        ...prev,
        fields: []
      }));
      setSelectedField(null);
      
      // Auto-save after clearing
      if (formData.id) {
        setTimeout(() => {
          saveFormMutation.mutate();
        }, 500);
      }
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
      
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
    },
    onError: (error) => {
      console.error('Error saving form:', error);
      alert('Error saving form');
    }
  });

  // Manual save form function with confirmation
  const saveFormManually = () => {
    saveFormMutation.mutate(undefined, {
      onSuccess: () => {
        alert('Form saved successfully!');
      }
    });
  };



  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // JSON Import functionality
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content);
          
          // Validate JSON structure
          if (parsedData.fields && Array.isArray(parsedData.fields)) {
            setImportedData(parsedData);
            setShowImportDialog(true);
          } else {
            alert('Invalid format: The file must contain a valid form definition with "fields" array');
          }
        } catch (error) {
          alert('Parse error: Invalid JSON file format');
        }
      };
      reader.readAsText(file);
    }
    // Reset input value to allow same file selection
    event.target.value = '';
  };

  const handleImportJSON = () => {
    if (importedData) {
      // Process and normalize imported fields
      const processedFields = (importedData.fields || []).map((field: any) => {
        // Ensure each field has a unique ID and proper structure
        return {
          Id: field.Id || field.id || `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          Type: field.Type || field.type || 'TEXT',
          Label: field.Label || field.label || 'Imported Field',
          DataField: field.DataField || field.dataField || field.Label || field.label || 'field',
          Entity: field.Entity || field.entity || '',
          Width: field.Width || field.width || '100%',
          Spacing: field.Spacing || field.spacing || '4',
          Required: Boolean(field.Required || field.required),
          Inline: Boolean(field.Inline || field.inline),
          Outlined: Boolean(field.Outlined || field.outlined),
          Value: field.Value || field.value || '',
          ChildFields: field.ChildFields || field.childFields || []
        };
      });

      console.log('Importing fields:', processedFields);
      console.log('Current formData before import:', formData);
      
      setFormData(prev => {
        const newFormData = {
          ...prev,
          fields: processedFields
        };
        console.log('New formData after import:', newFormData);
        return newFormData;
      });
      
      if (importedData.customComponents) {
        setCustomComponents(importedData.customComponents);
      }
      
      setShowImportDialog(false);
      setImportedData(null);
      setSelectedField(null);
      
      // Auto-save if form exists
      if (formData.id) {
        setTimeout(() => {
          saveFormMutation.mutate();
        }, 500);
      }
    }
  };

  // JSON Export functionality
  const handleExportJSON = () => {
    const exportData = {
      formMetadata: {
        menuId: formData.menuId,
        label: formData.label,
        formWidth: formData.formWidth,
        layout: formData.layout,
        exportedAt: new Date().toISOString()
      },
      fields: formData.fields,
      customComponents: customComponents
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.label.replace(/[^a-zA-Z0-9]/g, '_')}_form_definition.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`border-b px-6 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Modern Dropdown Actions Menu */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                className={`h-10 px-6 ${isDarkMode ? 'bg-gray-800/80 border-gray-600 hover:bg-gray-700 hover:border-indigo-400' : 'bg-white/80 border-slate-300 hover:bg-white hover:border-indigo-400'} transition-all duration-200 flex items-center gap-2 shadow-sm`}
              >
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Actions
                <div className={`transition-transform duration-200 ${showMenuDropdown ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </Button>

              {/* Enhanced Dropdown */}
              {showMenuDropdown && (
                <div className={`absolute top-full left-0 mt-2 w-64 ${isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-md border ${isDarkMode ? 'border-gray-600/60' : 'border-slate-200/60'} rounded-xl shadow-2xl z-50 overflow-hidden`}>
                  <div className="p-2 space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start h-11 px-4 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'} transition-all duration-200 rounded-lg`}
                      onClick={() => {
                        window.location.href = '/';
                        setShowMenuDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                          <Home className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Home</span>
                      </div>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start h-11 px-4 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'} transition-all duration-200 rounded-lg`}
                      onClick={() => {
                        // Open guide modal or navigate to guide
                        setShowMenuDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${isDarkMode ? 'bg-emerald-800' : 'bg-emerald-100'} rounded-lg flex items-center justify-center`}>
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Guide</span>
                      </div>
                    </Button>
                    
                    <div className={`h-px ${isDarkMode ? 'bg-gray-600' : 'bg-slate-200'} my-2`}></div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start h-11 px-4 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'} transition-all duration-200 rounded-lg`}
                      onClick={() => {
                        document.getElementById('json-file-input')?.click();
                        setShowMenuDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${isDarkMode ? 'bg-purple-800' : 'bg-purple-100'} rounded-lg flex items-center justify-center`}>
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Import</span>
                      </div>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start h-11 px-4 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'} transition-all duration-200 rounded-lg`}
                      onClick={() => {
                        handleExportJSON();
                        setShowMenuDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${isDarkMode ? 'bg-orange-800' : 'bg-orange-100'} rounded-lg flex items-center justify-center`}>
                          <Download className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Export</span>
                      </div>
                    </Button>
                    
                    <div className={`h-px ${isDarkMode ? 'bg-gray-600' : 'bg-slate-200'} my-2`}></div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start h-11 px-4 ${isDarkMode ? 'text-red-400 hover:bg-red-900/50 hover:text-red-300' : 'text-red-600 hover:bg-red-50 hover:text-red-700'} transition-all duration-200 rounded-lg`}
                      onClick={() => {
                        resetForm();
                        setShowMenuDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${isDarkMode ? 'bg-red-900/50' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                          <Trash2 className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Clear All</span>
                      </div>
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Click outside to close */}
              {showMenuDropdown && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMenuDropdown(false)}
                />
              )}
            </div>
            
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
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Save Button */}
            <Button
              variant="default"
              size="sm"
              onClick={saveFormManually}
              disabled={saveFormMutation.isPending}
              className={`h-10 px-6 ${isDarkMode ? 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'} text-white shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              <Save className="w-4 h-4 mr-2" />
              {saveFormMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>

        {/* Hidden file input for import */}
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="json-file-input"
        />
      </div>

      {/* External Components Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <div style={{ display: 'none' }}>
            <Button>Hidden Trigger</Button>
          </div>
        </DialogTrigger>
        <DialogContent className={`max-w-3xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : ''}>Component Creation Assistant</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="json" className="w-full">
            <TabsList className={`grid w-full grid-cols-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
              <TabsTrigger value="json" className={isDarkMode ? 'data-[state=active]:bg-gray-600 text-gray-300' : ''}>
                <Code className="w-4 h-4 mr-2" />
                JSON Configuration
              </TabsTrigger>
              <TabsTrigger value="form" className={isDarkMode ? 'data-[state=active]:bg-gray-600 text-gray-300' : ''}>
                <Package className="w-4 h-4 mr-2" />
                Visual Creator
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="json" className="space-y-4">
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Component JSON Configuration:</Label>
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
                Add from JSON
              </Button>
            </TabsContent>
                  
                  <TabsContent value="form" className="space-y-4">
                    <div className="space-y-6">
                      {/* Progress indicator */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                step <= componentCreationStep 
                                  ? 'bg-blue-600 text-white' 
                                  : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                              }`}>
                                {step}
                              </div>
                              {step < 4 && (
                                <div className={`w-8 h-0.5 mx-2 ${
                                  step < componentCreationStep 
                                    ? 'bg-blue-600' 
                                    : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                                }`} />
                              )}
                            </div>
                          ))}
                        </div>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Step {componentCreationStep} of 4
                        </span>
                      </div>

                      {/* Step 1: Basic Information */}
                      {componentCreationStep === 1 && (
                        <div className="space-y-4">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Basic Information
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Component Name</Label>
                              <Input
                                placeholder="customButton"
                                value={newComponentConfig.name}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, name: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Display Label</Label>
                              <Input
                                placeholder="Custom Button"
                                value={newComponentConfig.label}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, label: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Icon</Label>
                              <Input
                                placeholder="Square"
                                value={newComponentConfig.icon}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, icon: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Color</Label>
                              <Input
                                placeholder="gray"
                                value={newComponentConfig.color}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, color: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Database Configuration */}
                      {componentCreationStep === 2 && (
                        <div className="space-y-4">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Database Configuration
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Data Field</Label>
                              <Input
                                placeholder="field_name"
                                value={newComponentConfig.dataField}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, dataField: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Entity</Label>
                              <Input
                                placeholder="TableName"
                                value={newComponentConfig.entity}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, entity: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                          </div>
                          <div>
                            <Label className={isDarkMode ? 'text-gray-300' : ''}>Default Value</Label>
                            <Input
                              placeholder="Default value"
                              value={newComponentConfig.value}
                              onChange={(e) => setNewComponentConfig(prev => ({ ...prev, value: e.target.value }))}
                              className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 3: Layout & Style */}
                      {componentCreationStep === 3 && (
                        <div className="space-y-4">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Layout & Style
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Width</Label>
                              <Input
                                placeholder="100%"
                                value={newComponentConfig.width}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, width: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Spacing</Label>
                              <Input
                                placeholder="md"
                                value={newComponentConfig.spacing}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, spacing: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="required"
                                checked={newComponentConfig.required}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, required: e.target.checked }))}
                                className="rounded"
                              />
                              <Label htmlFor="required" className={isDarkMode ? 'text-gray-300' : ''}>Required</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="inline"
                                checked={newComponentConfig.inline}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, inline: e.target.checked }))}
                                className="rounded"
                              />
                              <Label htmlFor="inline" className={isDarkMode ? 'text-gray-300' : ''}>Inline</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="outlined"
                                checked={newComponentConfig.outlined}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, outlined: e.target.checked }))}
                                className="rounded"
                              />
                              <Label htmlFor="outlined" className={isDarkMode ? 'text-gray-300' : ''}>Outlined</Label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 4: Advanced Properties */}
                      {componentCreationStep === 4 && (
                        <div className="space-y-4">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Advanced Properties
                          </h4>
                          <div>
                            <Label className={isDarkMode ? 'text-gray-300' : ''}>Placeholder</Label>
                            <Input
                              placeholder="Help text"
                              value={newComponentConfig.placeholder}
                              onChange={(e) => setNewComponentConfig(prev => ({ ...prev, placeholder: e.target.value }))}
                              className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Min Length</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={newComponentConfig.minLength}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, minLength: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                            <div>
                              <Label className={isDarkMode ? 'text-gray-300' : ''}>Max Length</Label>
                              <Input
                                type="number"
                                placeholder="255"
                                value={newComponentConfig.maxLength}
                                onChange={(e) => setNewComponentConfig(prev => ({ ...prev, maxLength: e.target.value }))}
                                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                              />
                            </div>
                          </div>
                          <div>
                            <Label className={isDarkMode ? 'text-gray-300' : ''}>Options (for select/radio)</Label>
                            <Textarea
                              placeholder="Option 1&#10;Option 2&#10;Option 3"
                              value={newComponentConfig.options}
                              onChange={(e) => setNewComponentConfig(prev => ({ ...prev, options: e.target.value }))}
                              className={`h-20 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                            />
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              One option per line
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Navigation buttons */}
                      <div className="flex justify-between pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (componentCreationStep > 1) {
                              setComponentCreationStep(componentCreationStep - 1);
                            }
                          }}
                          disabled={componentCreationStep === 1}
                          className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                        >
                          Previous
                        </Button>
                        
                        {componentCreationStep < 4 ? (
                          <Button
                            onClick={() => setComponentCreationStep(componentCreationStep + 1)}
                            disabled={componentCreationStep === 1 && (!newComponentConfig.name || !newComponentConfig.label)}
                          >
                            Next
                          </Button>
                        ) : (
                          <Button
                            onClick={addComponentFromForm}
                            disabled={!newComponentConfig.name || !newComponentConfig.label}
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Create Component
                          </Button>
                        )}
                      </div>
                    </div>

                  </TabsContent>
                </Tabs>
                
                {customComponents.length > 0 && (
                  <div className="mt-6">
                    <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Custom Components:</h4>
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

      <div className="flex h-[calc(100vh-80px)]">
        <div className={`${isPaletteCollapsed ? 'w-12' : 'w-72'} border-r overflow-y-auto transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} ${isPaletteCollapsed ? 'hidden' : 'block'}`}>Components</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaletteCollapsed(!isPaletteCollapsed)}
                className={`h-6 w-6 p-0 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {isPaletteCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
            </div>
            {!isPaletteCollapsed && (
              <div className="space-y-2">
                {Object.entries(ComponentCategories).map(([categoryKey, category]) => (
                  <div key={categoryKey} className="space-y-1">
                    <div className={`flex items-center space-x-2 text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <category.icon className="w-3 h-3" />
                      <span>{category.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pl-2">
                      {Object.entries(category.components).map(([type, config]) => (
                        <DraggableComponent
                          key={type}
                          componentType={type}
                          label={(config as any).label}
                          icon={(config as any).icon}
                          color={(config as any).color}
                          isDarkMode={isDarkMode}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {customComponents.length > 0 && (
              <>
                <Separator className="my-4" />
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Custom Components</h3>
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

        {!isAdmin && (
          <div className="flex-1 p-6">
            <div className={`rounded-lg border h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Grid3X3 className="w-4 h-4 text-white" />
                    </div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Construction Zone
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {gridConfig.rows}×{gridConfig.cols}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsDragZoneCollapsed(!isDragZoneCollapsed)}
                      className={`h-6 w-6 p-0 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      {isDragZoneCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </div>
              {!isDragZoneCollapsed && (
                <div className="p-6">
                    {/* Contrôles rapides de grille */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm font-medium">Rangées:</Label>
                          <Button size="sm" variant="outline" onClick={removeGridRow} disabled={gridConfig.rows <= 1}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-mono">{gridConfig.rows}</span>
                          <Button size="sm" variant="outline" onClick={addGridRow}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm font-medium">Colonnes:</Label>
                          <Button size="sm" variant="outline" onClick={removeGridColumn} disabled={gridConfig.cols <= 1}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-mono">{gridConfig.cols}</span>
                          <Button size="sm" variant="outline" onClick={addGridColumn}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {formData.fields.length} Éléments
                        </Badge>
                        {selectedGridCell && (
                          <Badge variant="outline" className="text-xs">
                            Sélectionnée: {selectedGridCell}
                          </Badge>
                        )}
                      </div>
                    </div>

                {/* Grille principale */}
                <div 
                  className="grid gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
                  style={{
                    gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
                    gridTemplateRows: `repeat(${gridConfig.rows}, minmax(80px, auto))`,
                    minHeight: '400px'
                  }}
                >
                  {gridConfig.cells.map(cell => (
                    <div
                      key={cell.id}
                      onClick={() => setSelectedGridCell(cell.id)}
                      className={`
                        min-h-[80px] border-2 rounded-lg p-2 cursor-pointer transition-all duration-200
                        ${selectedGridCell === cell.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-200' : 'border-gray-200 dark:border-gray-700'}
                        ${cell.component ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/50'}
                        hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm
                      `}
                      style={{
                        gridColumn: `span ${cell.colspan}`,
                        gridRow: `span ${cell.rowspan}`
                      }}
                      onDrop={(e) => handleGridCellDrop(e, cell.id)}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {/* Indicateur de position */}
                      <div className="text-xs text-gray-400 mb-1">
                        {cell.row},{cell.col}
                        {(cell.colspan > 1 || cell.rowspan > 1) && (
                          <span className="ml-1 text-blue-500">({cell.colspan}×{cell.rowspan})</span>
                        )}
                      </div>

                      {/* Contenu de la cellule */}
                      {cell.component ? (
                        <div className="w-full h-full flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">
                              {getComponentIcon(cell.component.Type || 'UNKNOWN')}
                            </span>
                            <div>
                              <div className="font-medium text-sm">{cell.component.Label || 'Component'}</div>
                              <div className="text-xs text-gray-500">{cell.component.Type || 'UNKNOWN'}</div>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-1 h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Find the field in formData.fields and select it
                                const matchingField = formData.fields.find(f => f.Type === cell.component?.Type);
                                if (matchingField) {
                                  setSelectedField(matchingField);
                                }
                              }}
                            >
                              <Settings className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-1 h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Find and remove the corresponding field
                                const fieldToRemove = formData.fields.find(f => f.Type === cell.component?.Type);
                                if (fieldToRemove) {
                                  removeField(fieldToRemove.Id);
                                }
                                clearGridCell(cell.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <Grid3X3 className="w-6 h-6 mx-auto mb-1 opacity-50" />
                            <div className="text-xs">Déposer ici</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                    {/* Contrôles de cellule sélectionnée */}
                    {selectedGridCell && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm font-medium">Cellule sélectionnée:</Label>
                            <Badge variant="outline" className="text-xs">{selectedGridCell}</Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="text-xs" onClick={mergeGridCells}>
                              <Maximize2 className="w-3 h-3 mr-1" />
                              Étendre
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs" onClick={splitGridCell}>
                              <Minimize2 className="w-3 h-3 mr-1" />
                              Réduire
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => clearGridCell(selectedGridCell)}>
                              <Trash2 className="w-3 h-3 mr-1" />
                              Vider
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`w-80 border-l overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <Tabs defaultValue="properties" className="h-full">
            <TabsList className={`grid w-full grid-cols-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
              <TabsTrigger value="properties" className={isDarkMode ? 'data-[state=active]:bg-gray-600 text-gray-300' : ''}>Properties</TabsTrigger>
              <TabsTrigger value="json" className={isDarkMode ? 'data-[state=active]:bg-gray-600 text-gray-300' : ''}>JSON</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="h-full">
              {isAdmin ? (
                // Panneau admin pour affecter le formulaire
                <div className="p-6 space-y-6">
                  <div className="text-center mb-6">
                    <Users className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                    <h3 className="font-semibold text-gray-900">Gestion Administrative</h3>
                    <p className="text-sm text-gray-600">Affecter ce formulaire à un utilisateur</p>
                  </div>
                  
                  {/* Informations du formulaire */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-gray-900">Informations du formulaire</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>ID:</strong> {formData.menuId}</div>
                      <div><strong>Label:</strong> {formData.label}</div>
                      <div><strong>Largeur:</strong> {formData.formWidth}</div>
                      <div><strong>Layout:</strong> {formData.layout}</div>
                      <div><strong>Composants:</strong> {formData.fields.length}</div>
                    </div>
                  </div>

                  {/* Section d'affectation */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Affecter à un utilisateur</h4>
                    
                    {/* Liste des utilisateurs disponibles - à implémenter */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700">
                        <Users className="w-4 h-4 inline mr-1" />
                        Fonctionnalité d'affectation en cours de développement
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Bientôt disponible: sélection d'utilisateur et affectation de formulaire
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Panneau propriétés normal pour les utilisateurs
                selectedField ? (
                  <FormFieldProperties 
                    field={selectedField}
                    updateField={updateFieldInFormData}
                    isDarkMode={isDarkMode}
                  />
                ) : (
                  <div className={`p-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a component to view its properties</p>
                  </div>
                )
              )}
            </TabsContent>
            
            <TabsContent value="json" className="h-full p-4">
              <JsonValidator formData={formData} customComponents={customComponents} isDarkMode={isDarkMode} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Import JSON Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className={`max-w-2xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : ''}>Import JSON Form Definition</DialogTitle>
          </DialogHeader>
          
          {importedData && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Form Preview
                </h4>
                <div className="space-y-2 text-sm">
                  <div className={`flex justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span>Fields:</span>
                    <span>{importedData.fields?.length || 0}</span>
                  </div>
                  <div className={`flex justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span>Custom Components:</span>
                    <span>{importedData.customComponents?.length || 0}</span>
                  </div>
                </div>
              </div>

              {importedData.fields && importedData.fields.length > 0 && (
                <div className={`max-h-64 overflow-y-auto border rounded-lg ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className={`p-3 border-b ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                    <h5 className="font-medium">Field List</h5>
                  </div>
                  <div className="p-3 space-y-2">
                    {importedData.fields.map((field: any, index: number) => (
                      <div key={index} className={`flex items-center justify-between p-2 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {field.Label || field.label || 'Unnamed Field'}
                          </span>
                          <span className={`ml-2 text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-500 text-gray-200' : 'bg-gray-200 text-gray-600'}`}>
                            {field.Type || field.type || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowImportDialog(false)}
                  className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                >
                  Cancel
                </Button>
                <Button onClick={handleImportJSON}>
                  Import Form
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}