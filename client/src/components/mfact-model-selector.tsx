import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Database, Table, Search, Check, X, Grid3X3 } from "lucide-react";

interface MFactColumn {
  DataField: string;
  Caption: string;
  DataType: string;
  Visible: boolean;
  Description?: string;
}

interface MFactModel {
  name: string;
  displayName: string;
  description: string;
  category: string;
  columns: MFactColumn[];
}

interface MFactModelSelectorProps {
  value?: string;
  selectedColumns?: MFactColumn[];
  onModelSelect: (model: string) => void;
  onColumnsSelect: (columns: MFactColumn[]) => void;
  trigger?: React.ReactNode;
}

// Données des modèles MFact avec toutes leurs colonnes
const MFACT_MODELS: MFactModel[] = [
  {
    name: 'ACCADJ',
    displayName: 'Ajustement Comptable',
    description: 'Gestion des ajustements et écritures comptables',
    category: 'Comptabilité',
    columns: [
      { DataField: 'Id', Caption: 'ID', DataType: 'Number', Visible: true, Description: 'Identifiant unique' },
      { DataField: 'AccountCode', Caption: 'Code Compte', DataType: 'String', Visible: true, Description: 'Code du compte comptable' },
      { DataField: 'AccountName', Caption: 'Nom Compte', DataType: 'String', Visible: true, Description: 'Libellé du compte' },
      { DataField: 'DebitAmount', Caption: 'Montant Débit', DataType: 'Decimal', Visible: true, Description: 'Montant au débit' },
      { DataField: 'CreditAmount', Caption: 'Montant Crédit', DataType: 'Decimal', Visible: true, Description: 'Montant au crédit' },
      { DataField: 'AdjustmentDate', Caption: 'Date Ajustement', DataType: 'Date', Visible: true, Description: 'Date de l\'ajustement' },
      { DataField: 'Reference', Caption: 'Référence', DataType: 'String', Visible: false, Description: 'Référence de l\'écriture' },
      { DataField: 'Description', Caption: 'Description', DataType: 'String', Visible: false, Description: 'Description de l\'ajustement' }
    ]
  },
  {
    name: 'BUYTYP',
    displayName: 'Type d\'Achat',
    description: 'Classification des types d\'achats et catégories',
    category: 'Achats',
    columns: [
      { DataField: 'Id', Caption: 'ID', DataType: 'Number', Visible: true, Description: 'Identifiant unique' },
      { DataField: 'TypeCode', Caption: 'Code Type', DataType: 'String', Visible: true, Description: 'Code du type d\'achat' },
      { DataField: 'TypeName', Caption: 'Nom Type', DataType: 'String', Visible: true, Description: 'Libellé du type' },
      { DataField: 'Category', Caption: 'Catégorie', DataType: 'String', Visible: true, Description: 'Catégorie d\'achat' },
      { DataField: 'Priority', Caption: 'Priorité', DataType: 'Number', Visible: false, Description: 'Niveau de priorité' },
      { DataField: 'IsActive', Caption: 'Actif', DataType: 'Boolean', Visible: false, Description: 'Type actif ou inactif' },
      { DataField: 'CreatedDate', Caption: 'Date Création', DataType: 'Date', Visible: false, Description: 'Date de création' },
      { DataField: 'Description', Caption: 'Description', DataType: 'String', Visible: false, Description: 'Description détaillée' }
    ]
  },
  {
    name: 'PRIMNT',
    displayName: 'Prime Montant',
    description: 'Calcul et gestion des primes et montants variables',
    category: 'Finance',
    columns: [
      { DataField: 'Id', Caption: 'ID', DataType: 'Number', Visible: true, Description: 'Identifiant unique' },
      { DataField: 'PrimCode', Caption: 'Code Prime', DataType: 'String', Visible: true, Description: 'Code de la prime' },
      { DataField: 'PrimName', Caption: 'Nom Prime', DataType: 'String', Visible: true, Description: 'Libellé de la prime' },
      { DataField: 'BaseAmount', Caption: 'Montant Base', DataType: 'Decimal', Visible: true, Description: 'Montant de base' },
      { DataField: 'Rate', Caption: 'Taux', DataType: 'Decimal', Visible: true, Description: 'Taux de calcul' },
      { DataField: 'CalculatedAmount', Caption: 'Montant Calculé', DataType: 'Decimal', Visible: true, Description: 'Montant final calculé' },
      { DataField: 'EffectiveDate', Caption: 'Date Effet', DataType: 'Date', Visible: false, Description: 'Date d\'entrée en vigueur' },
      { DataField: 'ExpiryDate', Caption: 'Date Expiration', DataType: 'Date', Visible: false, Description: 'Date de fin de validité' }
    ]
  },
  {
    name: 'SRCMNT',
    displayName: 'Source Montant',
    description: 'Traçabilité des sources de montants et revenus',
    category: 'Finance',
    columns: [
      { DataField: 'Id', Caption: 'ID', DataType: 'Number', Visible: true, Description: 'Identifiant unique' },
      { DataField: 'SourceCode', Caption: 'Code Source', DataType: 'String', Visible: true, Description: 'Code de la source' },
      { DataField: 'SourceName', Caption: 'Nom Source', DataType: 'String', Visible: true, Description: 'Libellé de la source' },
      { DataField: 'SourceType', Caption: 'Type Source', DataType: 'String', Visible: true, Description: 'Type de source' },
      { DataField: 'Amount', Caption: 'Montant', DataType: 'Decimal', Visible: true, Description: 'Montant de la source' },
      { DataField: 'Currency', Caption: 'Devise', DataType: 'String', Visible: false, Description: 'Code devise' },
      { DataField: 'LastUpdated', Caption: 'Dernière MAJ', DataType: 'Date', Visible: false, Description: 'Date de dernière mise à jour' },
      { DataField: 'Status', Caption: 'Statut', DataType: 'String', Visible: false, Description: 'Statut de la source' }
    ]
  },
  {
    name: 'BUYLONG',
    displayName: 'Achat Long Terme',
    description: 'Gestion des achats et investissements à long terme',
    category: 'Achats',
    columns: [
      { DataField: 'Id', Caption: 'ID', DataType: 'Number', Visible: true, Description: 'Identifiant unique' },
      { DataField: 'ContractCode', Caption: 'Code Contrat', DataType: 'String', Visible: true, Description: 'Code du contrat' },
      { DataField: 'ContractName', Caption: 'Nom Contrat', DataType: 'String', Visible: true, Description: 'Libellé du contrat' },
      { DataField: 'Vendor', Caption: 'Fournisseur', DataType: 'String', Visible: true, Description: 'Nom du fournisseur' },
      { DataField: 'TotalAmount', Caption: 'Montant Total', DataType: 'Decimal', Visible: true, Description: 'Montant total du contrat' },
      { DataField: 'StartDate', Caption: 'Date Début', DataType: 'Date', Visible: true, Description: 'Date de début' },
      { DataField: 'EndDate', Caption: 'Date Fin', DataType: 'Date', Visible: true, Description: 'Date de fin' },
      { DataField: 'PaymentTerms', Caption: 'Conditions Paiement', DataType: 'String', Visible: false, Description: 'Conditions de paiement' }
    ]
  }
];

export default function MFactModelSelector({
  value,
  selectedColumns = [],
  onModelSelect,
  onColumnsSelect,
  trigger
}: MFactModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState<MFactModel | null>(
    value ? MFACT_MODELS.find(m => m.name === value) || null : null
  );
  const [tempColumns, setTempColumns] = useState<MFactColumn[]>(selectedColumns);

  const filteredModels = MFACT_MODELS.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(MFACT_MODELS.map(m => m.category)));

  const handleModelSelect = (model: MFactModel) => {
    setSelectedModel(model);
    setTempColumns(model.columns.map(col => ({ ...col })));
  };

  const handleColumnToggle = (index: number, field: keyof MFactColumn, value: any) => {
    const newColumns = [...tempColumns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setTempColumns(newColumns);
  };

  const handleConfirm = () => {
    if (selectedModel) {
      onModelSelect(selectedModel.name);
      onColumnsSelect(tempColumns);
      setOpen(false);
    }
  };

  const getDataTypeColor = (dataType: string) => {
    switch (dataType) {
      case 'String': return 'bg-blue-100 text-blue-800';
      case 'Number': return 'bg-purple-100 text-purple-800';
      case 'Decimal': return 'bg-green-100 text-green-800';
      case 'Boolean': return 'bg-orange-100 text-orange-800';
      case 'Date': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start">
            <Database className="w-4 h-4 mr-2" />
            {value ? `Modèle: ${value}` : 'Sélectionner un modèle MFact'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            MFact Model and Columns Selection
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 h-full">
          {/* Panneau gauche - Sélection du modèle */}
          <div className="w-1/2 space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search for a model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category === 'Comptabilité' ? 'Accounting' : 
                     category === 'Achats' ? 'Purchasing' : 
                     category === 'Finance' ? 'Finance' : category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {filteredModels.map((model) => (
                      <div
                        key={model.name}
                        onClick={() => handleModelSelect(model)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedModel?.name === model.name
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm">{model.name}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {model.category}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {model.displayName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {model.description}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <Table className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {model.columns.length} columns
                              </span>
                            </div>
                          </div>
                          {selectedModel?.name === model.name && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {categories.map(category => (
                <TabsContent key={category} value={category} className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {filteredModels.filter(m => m.category === category).map((model) => (
                        <div
                          key={model.name}
                          onClick={() => handleModelSelect(model)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedModel?.name === model.name
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-sm">{model.name}</h3>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {model.displayName}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {model.description}
                              </p>
                            </div>
                            {selectedModel?.name === model.name && (
                              <Check className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Panneau droit - Configuration des colonnes */}
          <div className="w-1/2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Column Configuration</h3>
              {selectedModel && (
                <Badge variant="outline" className="text-sm">
                  {selectedModel.displayName}
                </Badge>
              )}
            </div>

            {selectedModel ? (
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {tempColumns.map((column, index) => (
                    <div
                      key={column.DataField}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={column.Visible}
                              onCheckedChange={(checked) =>
                                handleColumnToggle(index, 'Visible', checked)
                              }
                            />
                            <div>
                              <p className="font-medium text-sm">{column.DataField}</p>
                              <p className="text-xs text-gray-500">{column.Caption}</p>
                            </div>
                          </div>
                          <Badge className={`text-xs ${getDataTypeColor(column.DataType)}`}>
                            {column.DataType}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500">Caption</label>
                            <Input
                              value={column.Caption}
                              onChange={(e) =>
                                handleColumnToggle(index, 'Caption', e.target.value)
                              }
                              className="text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">DataField</label>
                            <Input
                              value={column.DataField}
                              onChange={(e) =>
                                handleColumnToggle(index, 'DataField', e.target.value)
                              }
                              className="text-xs"
                            />
                          </div>
                        </div>

                        {column.Description && (
                          <p className="text-xs text-gray-400 mt-1">
                            {column.Description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <Grid3X3 className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  Sélectionnez un modèle
                </h3>
                <p className="text-sm text-gray-400">
                  Choisissez un modèle MFact à gauche pour configurer ses colonnes
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedModel}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Confirmer la Sélection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}