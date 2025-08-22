import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lightbulb, 
  Zap, 
  Target,
  Code2,
  Brain,
  Shield
} from "lucide-react";
import type { FormDefinition } from "@/lib/form-types";
import { ValidationEngine } from "@/lib/validation-engine";

interface AdvancedValidatorProps {
  formData: FormDefinition;
  onSuggestionApply?: (suggestion: ValidationSuggestion) => void;
}

interface ValidationSuggestion {
  id: string;
  type: "optimization" | "security" | "accessibility" | "performance";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  autoFixable: boolean;
  fieldId?: string;
}

interface ValidationStats {
  totalFields: number;
  validFields: number;
  errorCount: number;
  warningCount: number;
  completionPercentage: number;
}

export default function AdvancedValidator({ formData, onSuggestionApply }: AdvancedValidatorProps) {
  const [validationResult, setValidationResult] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<ValidationSuggestion[]>([]);
  const [stats, setStats] = useState<ValidationStats | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = async () => {
    setIsValidating(true);
    
    // Advanced validation engine
    const engine = new ValidationEngine(formData);
    const result = engine.validateForm();
    
    // Generate intelligent suggestions
    const smartSuggestions = generateSmartSuggestions(formData);
    
    // Calculate stats
    const formStats = calculateFormStats(formData, result);
    
    setValidationResult(result);
    setSuggestions(smartSuggestions);
    setStats(formStats);
    setIsValidating(false);
  };

  const generateSmartSuggestions = (form: FormDefinition): ValidationSuggestion[] => {
    const suggestions: ValidationSuggestion[] = [];

    // Required field suggestions
    form.Fields.forEach(field => {
      if (!field.required && ['GRIDLKP', 'LSTLKP', 'DATEPICKER'].includes(field.type)) {
        suggestions.push({
          id: `req_${field.Id}`,
          type: "optimization",
          title: `Make ${field.label} Required`,
          description: `${field.type} fields typically should be required for better data quality`,
          severity: "medium",
          autoFixable: true,
          fieldId: field.Id
        });
      }
    });

    // Validation rule suggestions
    if (form.Validations?.length === 0) {
      suggestions.push({
        id: "add_validations",
        type: "security",
        title: "Add Form Validation Rules",
        description: "Your form has no validation rules. Consider adding constraints for better data integrity",
        severity: "high",
        autoFixable: false
      });
    }

    // Accessibility suggestions
    form.Fields.forEach(field => {
      if (!field.label || field.label.trim() === "") {
        suggestions.push({
          id: `label_${field.Id}`,
          type: "accessibility",
          title: `Add Label to ${field.type}`,
          description: "All form fields should have descriptive labels for accessibility",
          severity: "high",
          autoFixable: false,
          fieldId: field.Id
        });
      }
    });

    // Performance suggestions
    const lookupFields = form.Fields.filter(f => ['GRIDLKP', 'LSTLKP'].includes(f.type));
    if (lookupFields.length > 5) {
      suggestions.push({
        id: "optimize_lookups",
        type: "performance",
        title: "Optimize Lookup Fields",
        description: `You have ${lookupFields.length} lookup fields. Consider pagination or lazy loading`,
        severity: "medium",
        autoFixable: false
      });
    }

    return suggestions;
  };

  const calculateFormStats = (form: FormDefinition, result: any): ValidationStats => {
    const totalFields = form.Fields.length;
    const errorCount = result.errors?.length || 0;
    const warningCount = result.warnings?.length || 0;
    const validFields = totalFields - errorCount;
    const completionPercentage = totalFields > 0 ? Math.round((validFields / totalFields) * 100) : 0;

    return {
      totalFields,
      validFields,
      errorCount,
      warningCount,
      completionPercentage
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "optimization": return <Target className="w-4 h-4" />;
      case "security": return <Shield className="w-4 h-4" />;
      case "accessibility": return <Brain className="w-4 h-4" />;
      case "performance": return <Zap className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border border-slate-200/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Advanced Validator
            </h3>
            <p className="text-sm text-slate-600 font-normal">Intelligent form analysis & optimization</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="errors">Issues</TabsTrigger>
            <TabsTrigger value="suggestions">Smart Tips</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            {stats && (
              <div className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Completion</p>
                        <p className="text-2xl font-bold text-blue-800">{stats.completionPercentage}%</p>
                      </div>
                      <CheckCircle2 className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Valid Fields</p>
                        <p className="text-2xl font-bold text-green-800">{stats.validFields}/{stats.totalFields}</p>
                      </div>
                      <Target className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Validation Status */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium">Errors: {stats.errorCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium">Warnings: {stats.warningCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">Suggestions: {suggestions.length}</span>
                  </div>
                </div>

                <Button 
                  onClick={validateForm} 
                  disabled={isValidating}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isValidating ? "Validating..." : "Re-validate Form"}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="errors" className="mt-4">
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {validationResult?.errors?.map((error: any, index: number) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">{error.message}</p>
                        {error.fieldId && (
                          <p className="text-xs text-red-600 mt-1">Field: {error.fieldId}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {validationResult?.warnings?.map((warning: any, index: number) => (
                  <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">{warning.message}</p>
                        {warning.fieldId && (
                          <p className="text-xs text-yellow-600 mt-1">Field: {warning.fieldId}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(!validationResult?.errors?.length && !validationResult?.warnings?.length) && (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-green-700 font-medium">No issues found!</p>
                    <p className="text-sm text-green-600">Your form structure looks great.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="suggestions" className="mt-4">
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getTypeIcon(suggestion.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-slate-900">{suggestion.title}</p>
                            <Badge className={`text-xs ${getSeverityColor(suggestion.severity)}`}>
                              {suggestion.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600">{suggestion.description}</p>
                          {suggestion.fieldId && (
                            <p className="text-xs text-blue-600 mt-1">→ {suggestion.fieldId}</p>
                          )}
                        </div>
                      </div>
                      {suggestion.autoFixable && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onSuggestionApply?.(suggestion)}
                          className="ml-2"
                        >
                          Fix
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {suggestions.length === 0 && (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <p className="text-blue-700 font-medium">All optimizations applied!</p>
                    <p className="text-sm text-blue-600">Your form follows best practices.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-slate-700 mb-2">Field Types</p>
                  <div className="space-y-1">
                    {Object.entries(
                      formData.Fields.reduce((acc, field) => {
                        acc[field.type] = (acc[field.type] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span className="text-slate-600">{type}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-medium text-slate-700 mb-2">Form Metrics</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Required Fields</span>
                      <span className="font-medium">{formData.Fields.filter(f => f.required).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Validation Rules</span>
                      <span className="font-medium">{formData.Validations?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Form Actions</span>
                      <span className="font-medium">{formData.Actions?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <p className="font-medium text-purple-800">Form Quality Score</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-purple-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats?.completionPercentage || 0}%` }}
                    />
                  </div>
                  <span className="font-bold text-purple-800">{stats?.completionPercentage || 0}%</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}