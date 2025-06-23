import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Upload, 
  Download, 
  Zap,
  FileCheck,
  Settings,
  Code,
  RefreshCw,
  Eye,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ValidationError {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  suggestion?: string;
  autoFix?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  suggestions: ValidationError[];
  score: number;
  fixedJson?: any;
}

export default function JSONValidator() {
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateJSON = async () => {
    if (!jsonInput.trim()) {
      toast({
        title: "JSON requis",
        description: "Veuillez saisir ou importer un JSON à valider",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Parse JSON
      const parsed = JSON.parse(jsonInput);
      
      // Perform comprehensive validation
      const result = await performIntelligentValidation(parsed);
      setValidationResult(result);
      
      toast({
        title: result.isValid ? "Validation réussie" : "Problèmes détectés",
        description: result.isValid 
          ? `JSON valide avec un score de ${result.score}/100`
          : `${result.errors.length} erreurs et ${result.warnings.length} avertissements trouvés`,
        variant: result.isValid ? "default" : "destructive",
      });
      
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: [{
          type: 'error',
          field: 'JSON',
          message: 'JSON invalide: ' + error.message,
          autoFix: false
        }],
        warnings: [],
        suggestions: [],
        score: 0
      });
    }
    
    setIsValidating(false);
  };

  const performIntelligentValidation = async (json: any): Promise<ValidationResult> => {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const suggestions: ValidationError[] = [];
    let score = 100;
    let fixedJson = { ...json };

    // Validate required top-level fields
    const requiredFields = ['MenuID', 'Label', 'Fields'];
    requiredFields.forEach(field => {
      if (!json[field]) {
        errors.push({
          type: 'error',
          field: field,
          message: `Champ obligatoire manquant: ${field}`,
          suggestion: `Ajouter le champ ${field}`,
          autoFix: true
        });
        score -= 20;
        
        if (autoFixEnabled) {
          if (field === 'MenuID') fixedJson[field] = `FORM_${Date.now()}`;
          if (field === 'Label') fixedJson[field] = 'Nouveau Formulaire';
          if (field === 'Fields') fixedJson[field] = [];
        }
      }
    });

    // Validate MenuID format
    if (json.MenuID && typeof json.MenuID !== 'string') {
      errors.push({
        type: 'error',
        field: 'MenuID',
        message: 'MenuID doit être une chaîne de caractères',
        autoFix: true
      });
      if (autoFixEnabled) fixedJson.MenuID = String(json.MenuID);
    }

    // Validate Fields array
    if (json.Fields) {
      if (!Array.isArray(json.Fields)) {
        errors.push({
          type: 'error',
          field: 'Fields',
          message: 'Fields doit être un tableau',
          autoFix: true
        });
        score -= 15;
        if (autoFixEnabled) fixedJson.Fields = [];
      } else {
        // Validate each field
        json.Fields.forEach((field: any, index: number) => {
          const fieldErrors = validateField(field, index);
          errors.push(...fieldErrors.errors);
          warnings.push(...fieldErrors.warnings);
          suggestions.push(...fieldErrors.suggestions);
          score -= fieldErrors.scoreDeduction;
          
          if (autoFixEnabled && fieldErrors.fixedField) {
            fixedJson.Fields[index] = fieldErrors.fixedField;
          }
        });
      }
    }

    // Validate Validations array
    if (json.Validations && !Array.isArray(json.Validations)) {
      warnings.push({
        type: 'warning',
        field: 'Validations',
        message: 'Validations doit être un tableau',
        autoFix: true
      });
      score -= 5;
      if (autoFixEnabled) fixedJson.Validations = [];
    }

    // Check for duplicate field IDs
    if (json.Fields && Array.isArray(json.Fields)) {
      const fieldIds = json.Fields.map((f: any) => f.Id).filter(Boolean);
      const duplicates = fieldIds.filter((id: string, index: number) => fieldIds.indexOf(id) !== index);
      if (duplicates.length > 0) {
        errors.push({
          type: 'error',
          field: 'Fields',
          message: `IDs de champs dupliqués: ${duplicates.join(', ')}`,
          suggestion: 'Utiliser des IDs uniques pour chaque champ',
          autoFix: true
        });
        score -= 10;
        
        if (autoFixEnabled) {
          fixedJson.Fields.forEach((field: any, index: number) => {
            if (!field.Id || duplicates.includes(field.Id)) {
              field.Id = `Field_${index + 1}_${Date.now()}`;
            }
          });
        }
      }
    }

    // Performance suggestions
    if (json.Fields && json.Fields.length > 50) {
      suggestions.push({
        type: 'info',
        field: 'Performance',
        message: 'Formulaire avec plus de 50 champs - considérer la pagination',
        suggestion: 'Diviser en plusieurs étapes ou sections'
      });
    }

    // Accessibility suggestions
    if (json.Fields && Array.isArray(json.Fields)) {
      const fieldsWithoutLabels = json.Fields.filter((f: any) => !f.Label);
      if (fieldsWithoutLabels.length > 0) {
        suggestions.push({
          type: 'info',
          field: 'Accessibilité',
          message: `${fieldsWithoutLabels.length} champs sans label`,
          suggestion: 'Ajouter des labels pour améliorer l\'accessibilité'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score: Math.max(0, score),
      fixedJson: autoFixEnabled ? fixedJson : undefined
    };
  };

  const validateField = (field: any, index: number) => {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const suggestions: ValidationError[] = [];
    let scoreDeduction = 0;
    let fixedField = { ...field };

    // Required field properties
    if (!field.Id) {
      errors.push({
        type: 'error',
        field: `Fields[${index}].Id`,
        message: 'ID du champ manquant',
        autoFix: true
      });
      scoreDeduction += 5;
      fixedField.Id = `Field_${index + 1}_${Date.now()}`;
    }

    if (!field.Type) {
      errors.push({
        type: 'error',
        field: `Fields[${index}].Type`,
        message: 'Type du champ manquant',
        autoFix: true
      });
      scoreDeduction += 5;
      fixedField.Type = 'TEXT';
    }

    // Validate field types
    const validTypes = [
      'TEXT', 'TEXTAREA', 'NUMBER', 'EMAIL', 'PASSWORD', 'DATE', 'DATEPICKER',
      'SELECT', 'MULTISELECT', 'RADIO', 'RADIOGRP', 'CHECKBOX', 'SWITCH',
      'FILE', 'IMAGE', 'GRID', 'GRIDLKP', 'LSTLKP', 'GROUP', 'LABEL', 'BUTTON'
    ];
    
    if (field.Type && !validTypes.includes(field.Type)) {
      warnings.push({
        type: 'warning',
        field: `Fields[${index}].Type`,
        message: `Type de champ non standard: ${field.Type}`,
        suggestion: `Types recommandés: ${validTypes.slice(0, 5).join(', ')}...`
      });
      scoreDeduction += 2;
    }

    // Validate required properties based on type
    if (field.Type === 'SELECT' || field.Type === 'RADIO') {
      if (!field.OptionValues && !field.options) {
        warnings.push({
          type: 'warning',
          field: `Fields[${index}].OptionValues`,
          message: 'Options manquantes pour le champ de sélection',
          suggestion: 'Ajouter OptionValues ou options',
          autoFix: true
        });
        scoreDeduction += 3;
        fixedField.OptionValues = { "option1": "Option 1", "option2": "Option 2" };
      }
    }

    // Validate lookup fields
    if (field.Type === 'GRIDLKP' || field.Type === 'LSTLKP') {
      if (!field.LoadDataInfo) {
        warnings.push({
          type: 'warning',
          field: `Fields[${index}].LoadDataInfo`,
          message: 'Configuration de données manquante pour le lookup',
          suggestion: 'Ajouter LoadDataInfo avec DataModel et ColumnsDefinition'
        });
        scoreDeduction += 3;
      }
    }

    return { errors, warnings, suggestions, scoreDeduction, fixedField };
  };

  const applyAutoFix = () => {
    if (validationResult?.fixedJson) {
      setJsonInput(JSON.stringify(validationResult.fixedJson, null, 2));
      toast({
        title: "Corrections appliquées",
        description: "Le JSON a été automatiquement corrigé",
      });
      // Re-validate after fixing
      setTimeout(() => validateJSON(), 500);
    }
  };

  const loadSampleJSON = () => {
    const sampleJSON = {
      "MenuID": "SAMPLE_FORM",
      "FormWidth": "700px",
      "Layout": "PROCESS",
      "Label": "Formulaire d'exemple",
      "Fields": [
        {
          "Id": "Name",
          "Label": "Nom complet",
          "Type": "TEXT",
          "Required": true,
          "Width": "100%"
        },
        {
          "Id": "Email",
          "Label": "Email",
          "Type": "EMAIL",
          "Required": true,
          "Width": "50%"
        },
        {
          "Id": "Category",
          "Label": "Catégorie",
          "Type": "SELECT",
          "Width": "50%",
          "OptionValues": {
            "cat1": "Catégorie 1",
            "cat2": "Catégorie 2",
            "cat3": "Catégorie 3"
          }
        }
      ],
      "Validations": [
        {
          "Id": "email_validation",
          "Type": "ERROR",
          "CondExpression": {
            "Conditions": [
              {
                "RightField": "Email",
                "Operator": "ISN",
                "ValueType": "STRING"
              }
            ]
          }
        }
      ]
    };
    
    setJsonInput(JSON.stringify(sampleJSON, null, 2));
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonInput(content);
        toast({
          title: "Fichier importé",
          description: `${file.name} chargé avec succès`,
        });
      };
      reader.readAsText(file);
    }
  };

  const downloadValidatedJSON = () => {
    const jsonToDownload = validationResult?.fixedJson || JSON.parse(jsonInput);
    const blob = new Blob([JSON.stringify(jsonToDownload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validated-form-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FileCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Validateur Intelligent JSON</h1>
              <p className="text-gray-600 dark:text-gray-400">Validation, correction automatique et optimisation des programmes JSON</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    JSON à valider
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Importer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={loadSampleJSON}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Exemple
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Collez votre JSON ici ou importez un fichier..."
                  rows={20}
                  className="font-mono text-sm"
                />
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
                
                <div className="mt-4 flex gap-3">
                  <Button 
                    onClick={validateJSON} 
                    disabled={isValidating || !jsonInput.trim()}
                    className="flex-1"
                  >
                    {isValidating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Validation...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Valider JSON
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autofix"
                      checked={autoFixEnabled}
                      onChange={(e) => setAutoFixEnabled(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="autofix" className="text-sm">Auto-correction</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {validationResult && (
              <>
                {/* Score Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Score de qualité</span>
                      <span className={`text-2xl font-bold ${getScoreColor(validationResult.score)}`}>
                        {validationResult.score}/100
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          validationResult.score >= 90 ? 'bg-green-500' :
                          validationResult.score >= 70 ? 'bg-yellow-500' :
                          validationResult.score >= 50 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${validationResult.score}%` }}
                      ></div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-red-600">{validationResult.errors.length}</div>
                        <div className="text-sm text-gray-500">Erreurs</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">{validationResult.warnings.length}</div>
                        <div className="text-sm text-gray-500">Avertissements</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{validationResult.suggestions.length}</div>
                        <div className="text-sm text-gray-500">Suggestions</div>
                      </div>
                    </div>
                    
                    {validationResult.fixedJson && (
                      <div className="mt-4 flex gap-2">
                        <Button onClick={applyAutoFix} className="flex-1">
                          <Zap className="w-4 h-4 mr-2" />
                          Appliquer les corrections
                        </Button>
                        <Button variant="outline" onClick={downloadValidatedJSON}>
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Issues */}
                <Card>
                  <CardHeader>
                    <CardTitle>Détails de validation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="errors">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="errors" className="flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Erreurs ({validationResult.errors.length})
                        </TabsTrigger>
                        <TabsTrigger value="warnings" className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Avertissements ({validationResult.warnings.length})
                        </TabsTrigger>
                        <TabsTrigger value="suggestions" className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Suggestions ({validationResult.suggestions.length})
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="errors" className="space-y-3">
                        {validationResult.errors.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                            Aucune erreur détectée
                          </div>
                        ) : (
                          validationResult.errors.map((error, index) => (
                            <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-red-900">{error.field}</div>
                                  <div className="text-sm text-red-700">{error.message}</div>
                                  {error.suggestion && (
                                    <div className="text-xs text-red-600 mt-1">💡 {error.suggestion}</div>
                                  )}
                                </div>
                                {error.autoFix && (
                                  <Badge variant="secondary" className="text-xs">
                                    Auto-corrigeable
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>
                      
                      <TabsContent value="warnings" className="space-y-3">
                        {validationResult.warnings.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                            Aucun avertissement
                          </div>
                        ) : (
                          validationResult.warnings.map((warning, index) => (
                            <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-yellow-900">{warning.field}</div>
                                  <div className="text-sm text-yellow-700">{warning.message}</div>
                                  {warning.suggestion && (
                                    <div className="text-xs text-yellow-600 mt-1">💡 {warning.suggestion}</div>
                                  )}
                                </div>
                                {warning.autoFix && (
                                  <Badge variant="secondary" className="text-xs">
                                    Auto-corrigeable
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>
                      
                      <TabsContent value="suggestions" className="space-y-3">
                        {validationResult.suggestions.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                            Aucune suggestion d'amélioration
                          </div>
                        ) : (
                          validationResult.suggestions.map((suggestion, index) => (
                            <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium text-blue-900">{suggestion.field}</div>
                                <div className="text-sm text-blue-700">{suggestion.message}</div>
                                {suggestion.suggestion && (
                                  <div className="text-xs text-blue-600 mt-1">💡 {suggestion.suggestion}</div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            )}

            {!validationResult && (
              <Card>
                <CardContent className="text-center py-12">
                  <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Prêt pour la validation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Importez ou saisissez votre JSON pour commencer la validation intelligente
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}