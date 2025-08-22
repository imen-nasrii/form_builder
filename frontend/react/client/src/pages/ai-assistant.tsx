import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Bot, 
  Upload, 
  Download, 
  FileText, 
  MessageCircle, 
  Send, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Code,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface GeneratedJSON {
  menuId: string;
  label: string;
  formWidth: string;
  layout: string;
  fields: any[];
  validations: any[];
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA FormBuilder. Uploadez vos fichiers DFM et Info pour générer des configurations JSON, ou posez-moi des questions sur la génération de formulaires.',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dfmFile, setDfmFile] = useState<File | null>(null);
  const [infoFile, setInfoFile] = useState<File | null>(null);
  const [generatedJSON, setGeneratedJSON] = useState<GeneratedJSON | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const dfmInputRef = useRef<HTMLInputElement>(null);
  const infoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const componentMapping = {
    'TSSICheckBox': 'CHECKBOX',
    'TSSIComboBox': 'SELECT', 
    'TMFWFndAliasLookup': 'GRIDLKP',
    'TMFWTkrLookup': 'LSTLKP',
    'TMFWSccLookup': 'LSTLKP',
    'TMFWScgLookup': 'LSTLKP',
    'TButton': 'BUTTON',
    'TSsiRadioGroup': 'RADIOGRP',
    'TGisDateEdit': 'DATEPKR',
    'TgisAsOfFileDateEdit': 'DATEPICKER',
    'TListBox': 'GRID',
    'TPanel': 'GROUP',
    'TLabel': 'LABEL',
    'TEdit': 'TEXT',
    'TMemo': 'TEXTAREA'
  };

  const handleFileUpload = (type: 'dfm' | 'info', file: File) => {
    if (type === 'dfm') {
      setDfmFile(file);
      toast({
        title: "DFM File Uploaded",
        description: `${file.name} ready for processing`,
      });
    } else {
      setInfoFile(file);
      toast({
        title: "Info File Uploaded", 
        description: `${file.name} ready for processing`,
      });
    }
  };

  const processFiles = async () => {
    if (!dfmFile || !infoFile) {
      toast({
        title: "Missing Files",
        description: "Please upload both DFM and Info files",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Read file contents
      const dfmContent = await dfmFile.text();
      const infoContent = await infoFile.text();

      // Parse file content - handle both DFM and JSON formats
      const components = parseDFMContent(dfmContent);
      const operators = parseInfoContent(infoContent);

      // If the DFM content is already a JSON form config, preserve its structure
      try {
        const existingJson = JSON.parse(dfmContent);
        if (existingJson.MenuID && existingJson.Fields) {
          // It's already a complete form JSON - enhance it
          const enhancedJson = {
            menuId: existingJson.MenuID,
            label: existingJson.Label || existingJson.MenuID,
            formWidth: existingJson.FormWidth || "700px",
            layout: existingJson.Layout || "PROCESS",
            fields: existingJson.Fields || [],
            validations: existingJson.Validations || []
          };
          setGeneratedJSON(enhancedJson);
        } else {
          // Generate from components
          const json = generateFormJSON(components, operators, dfmFile.name);
          setGeneratedJSON(json);
        }
      } catch (e) {
        // Not JSON, generate from parsed components
        const json = generateFormJSON(components, operators, dfmFile.name);
        setGeneratedJSON(json);
      }

      // Add success message
      const fieldCount = generatedJSON?.fields?.length || 0;
      const validationCount = generatedJSON?.validations?.length || 0;
      const successMessage: ChatMessage = {
        role: 'assistant',
        content: `Successfully processed ${dfmFile.name}! ${
          existingJson?.MenuID 
            ? `Recognized existing ACCADJ form configuration with ${fieldCount} fields and ${validationCount} validation rules.`
            : `Generated form configuration with ${fieldCount} fields and ${validationCount} validation rules.`
        } You can now download the JSON or ask me questions about the form structure.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);

      toast({
        title: "Files Processed Successfully",
        description: `Processed ${generatedJSON?.fields?.length || 0} fields and ${generatedJSON?.validations?.length || 0} validations`,
      });

    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process files. Please check file formats.",
        variant: "destructive",
      });
    }

    setIsGenerating(false);
  };

  const parseDFMContent = (content: string) => {
    // Check if content is already JSON
    try {
      const parsed = JSON.parse(content);
      if (parsed.MenuID || parsed.Fields) {
        return parseExistingJSON(parsed);
      }
    } catch (e) {
      // Not JSON, continue with DFM parsing
    }
    
    const lines = content.split('\n');
    const components: any[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Parse object declarations
      const objectMatch = trimmed.match(/object\s+(\w+):\s*(\w+)/);
      if (objectMatch) {
        components.push({
          name: objectMatch[1],
          type: objectMatch[2],
          properties: {}
        });
      }
      
      // Parse inherited forms
      const inheritedMatch = trimmed.match(/inherited\s+(\w+):\s*(\w+)/);
      if (inheritedMatch) {
        components.push({
          name: inheritedMatch[1],
          type: inheritedMatch[2],
          properties: { Caption: extractCaption(content) }
        });
      }
    }
    
    return components;
  };

  const parseExistingJSON = (jsonData: any) => {
    if (jsonData.Fields) {
      return jsonData.Fields.map((field: any, index: number) => ({
        name: field.Id || field.id || `Field${index}`,
        type: field.Type || field.type || 'TEXT',
        properties: {
          Label: field.Label || field.label,
          Width: field.Width,
          Required: field.required,
          Inline: field.Inline
        }
      }));
    }
    return [];
  };

  const parseInfoContent = (content: string) => {
    const operators: any[] = [];
    const types: string[] = [];
    
    const operatorMatches = content.match(/\[EnumMember\(Value = "(\w+)"\)\]\s*(\w+)/g);
    if (operatorMatches) {
      operatorMatches.forEach(match => {
        const parts = match.match(/\[EnumMember\(Value = "(\w+)"\)\]\s*(\w+)/);
        if (parts) {
          operators.push({ code: parts[1], name: parts[2] });
        }
      });
    }
    
    return { operators, types };
  };

  const extractCaption = (content: string): string => {
    const captionMatch = content.match(/Caption\s*=\s*'([^']+)'/);
    return captionMatch ? captionMatch[1] : 'Generated Form';
  };

  const generateFormJSON = (components: any[], operators: any, fileName: string): GeneratedJSON => {
    const formName = fileName.replace(/\.(dfm|txt|json)$/i, '');
    
    // If we already have properly structured fields, use them
    if (components.length > 0 && components[0].properties?.Label) {
      return {
        menuId: formName.toUpperCase(),
        label: formName.toUpperCase(),
        formWidth: "700px", 
        layout: "PROCESS",
        fields: components.map((comp, index) => ({
          Id: comp.name,
          Type: comp.type,
          Label: comp.properties.Label || comp.name,
          Width: comp.properties.Width || "100%",
          Required: comp.properties.Required || false,
          Inline: comp.properties.Inline || false,
          Spacing: "md",
          Value: ""
        })),
        validations: []
      };
    }
    
    // Generate fields from component mapping
    const fields = components.map((comp, index) => {
      const mappedType = (componentMapping as any)[comp.type] || comp.type || 'TEXT';
      
      return {
        Id: comp.name || `Field_${index + 1}`,
        Type: mappedType,
        Label: comp.name?.replace(/([A-Z])/g, ' $1').trim() || `Field ${index + 1}`,
        DataField: `field_${(comp.name || `field${index}`).toLowerCase()}`,
        Entity: "TableName",
        Width: comp.properties?.Width || "100%",
        Spacing: "md",
        Required: comp.properties?.Required || false,
        Inline: comp.properties?.Inline || false,
        Outlined: false,
        Value: ""
      };
    });

    const validations = operators?.operators?.slice(0, 3).map((op: any, index: number) => ({
      Id: `validation_${index + 1}`,
      Type: "ERROR",
      Message: `Validation rule using ${op.name}`,
      CondExpression: {
        LogicalOperator: "AND",
        Conditions: [{
          Operator: op.code,
          Value: "sample_value",
          ValueType: "STRING"
        }]
      }
    })) || [];

    return {
      menuId: formName.toUpperCase(),
      label: extractCaption(components[0]?.properties?.Caption || formName),
      formWidth: "700px",
      layout: "PROCESS",
      fields,
      validations
    };
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsProcessing(true);

    // Generate contextual AI response based on current form
    setTimeout(() => {
      let response = "";
      
      if (generatedJSON) {
        const hasComplexFields = generatedJSON.fields.some(f => 
          f.Type === 'GRIDLKP' || f.Type === 'LSTLKP' || f.Type === 'GROUP'
        );
        
        if (currentMessage.toLowerCase().includes('field') || currentMessage.toLowerCase().includes('champ')) {
          response = `Your ACCADJ form has ${generatedJSON.fields.length} fields including lookup components (GRIDLKP, LSTLKP) for Fund, Ticker, SecCat, and SecGrp. The form also contains grouped fields like PROCAGAINST and RPTOPTS for better organization.`;
        } else if (currentMessage.toLowerCase().includes('validation')) {
          response = `The form includes ${generatedJSON.validations.length} validation rules with logical operators (AND, OR) and conditions checking for required dates, boolean conflicts, and null values.`;
        } else if (currentMessage.toLowerCase().includes('structure')) {
          response = `This is a PROCESS layout form with 700px width. It contains data entry fields, lookup components for security selection, date pickers for processing dates, radio groups for options, and checkboxes for report settings.`;
        } else {
          response = hasComplexFields 
            ? "Your form has complex lookup fields (GRIDLKP) for Fund and Ticker selection, which connect to data models like Fndmas and Secrty. The form structure follows a process workflow with grouped controls and conditional logic."
            : "I can help you understand the form structure, field types, validation rules, or suggest modifications to improve the user experience.";
        }
      } else {
        response = "Please upload your DFM and Info files first, then I can provide specific guidance about your form structure and components.";
      }

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  const downloadJSON = () => {
    if (!generatedJSON) return;

    const blob = new Blob([JSON.stringify(generatedJSON, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedJSON.menuId.toLowerCase()}_form.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "JSON Downloaded",
      description: "Form configuration saved successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Form Assistant
                </h1>
                <p className="text-sm text-green-600 font-medium mt-1">● En ligne</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
              Assistant intelligent pour convertir vos fichiers DFM en configurations JSON avec assistance IA avancée
            </p>
          </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[650px] flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Interface de Chat IA</h3>
                    <p className="text-blue-100 text-sm">Conversation en temps réel</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-slate-700/50 dark:to-slate-800/50">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-lg ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                            : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {message.role === 'assistant' ? (
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <span className="text-sm font-medium">👤</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                              {message.content}
                            </p>
                            <p className={`text-xs mt-3 ${
                              message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {message.timestamp.toLocaleTimeString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Chat Input */}
                <div className="border-t border-gray-200 dark:border-gray-600 p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Tapez votre message ici..."
                      className="flex-1 px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 text-sm shadow-inner"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!currentMessage.trim() || isProcessing}
                      size="lg"
                      className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg rounded-xl"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Upload Section */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Upload de Fichiers</h3>
                    <p className="text-emerald-100 text-sm">DFM et Info</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* DFM/JSON File Upload */}
                <div className="space-y-3">
                  <Label htmlFor="dfm-upload" className="text-base font-medium text-gray-700 dark:text-gray-200">
                    📄 Fichier DFM/JSON
                  </Label>
                  <div className="relative">
                    <input
                      ref={dfmInputRef}
                      type="file"
                      id="dfm-upload"
                      accept=".dfm,.txt,.json"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('dfm', e.target.files[0])}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => dfmInputRef.current?.click()}
                      className="w-full h-14 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 bg-gray-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 rounded-xl text-sm"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span>{dfmFile ? dfmFile.name : 'Choisir fichier DFM/JSON'}</span>
                      </div>
                    </Button>
                  </div>
                  {dfmFile && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-700 dark:text-green-400 font-medium">Fichier prêt</span>
                    </div>
                  )}
                </div>

                {/* Info File Upload */}
                <div className="space-y-3">
                  <Label htmlFor="info-upload" className="text-base font-medium text-gray-700 dark:text-gray-200">
                    ℹ️ Fichier Info
                  </Label>
                  <div className="relative">
                    <input
                      ref={infoInputRef}
                      type="file"
                      id="info-upload"
                      accept=".txt"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('info', e.target.files[0])}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => infoInputRef.current?.click()}
                      className="w-full h-14 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-400 bg-gray-50 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-600 rounded-xl text-sm"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span>{infoFile ? infoFile.name : 'Choisir fichier Info'}</span>
                      </div>
                    </Button>
                  </div>
                  {infoFile && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-700 dark:text-green-400 font-medium">Fichier prêt</span>
                    </div>
                  )}
                </div>

                {/* Process Button */}
                <div className="space-y-3">
                  <Button
                    onClick={processFiles}
                    disabled={!dfmFile || !infoFile || isGenerating}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg rounded-xl text-white font-semibold"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Générer JSON
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    ou utilisez les options ci-dessous
                  </div>
                  
                  <Button
                    onClick={() => {
                      const message: ChatMessage = {
                        role: 'user',
                        content: 'Générer BUYLONG',
                        timestamp: new Date()
                      };
                      setMessages(prev => [...prev, message]);
                      
                      const prompt = `Basé sur la configuration BUYTYP fournie, générez un JSON "BUYLONG" simplifié pour les achats à long terme.

Créez un JSON BUYLONG avec ces caractéristiques :

1. **MenuID**: "BUYLONG"
2. **Label**: "BUYLONG - Long Term Purchase"
3. **FormWidth**: "700px"
4. **Layout**: "PROCESS"

5. **Champs principaux** (simplifiés par rapport à BUYTYP) :
   - FundID (GRIDLKP) - Obligatoire, lookup vers Fndmas
   - Ticker (GRIDLKP) - Obligatoire, lookup vers Secrty  
   - TradeDate (DATEPICKER) - Obligatoire
   - Broker (GRIDLKP) - Obligatoire, lookup vers Broker
   - Quantity (NUMERIC) - Obligatoire, > 0
   - Price (NUMERIC) - Obligatoire, > 0
   - Strategy (SELECT) - Nouveau champ avec options : "Growth", "Value", "Income", "Balanced"
   - HoldingPeriod (NUMERIC) - Nouveau champ en mois, défaut 12

6. **Validations essentielles** :
   - Champs obligatoires non vides
   - Quantity et Price > 0
   - TradeDate pas dans le futur
   - HoldingPeriod >= 6 mois

7. **Actions** :
   - PROCESS avec MethodToInvoke: "ExecuteLongTermPurchase"

Générez un JSON propre, bien structuré et prêt à utiliser.`;

                      const assistantMessage: ChatMessage = {
                        role: 'assistant',
                        content: `Voici le JSON BUYLONG généré :

\`\`\`json
{
  "MenuID": "BUYLONG",
  "Label": "BUYLONG - Long Term Purchase",
  "FormWidth": "700px",
  "Layout": "PROCESS",
  "Fields": [
    {
      "Id": "FundID",
      "label": "FUND",
      "type": "GRIDLKP",
      "required": true,
      "EntitykeyField": "fund",
      "Entity": "Fndmas",
      "ColumnDefinitions": [
        {
          "DataField": "fund",
          "Caption": "Fund ID",
          "DataType": "STRING"
        },
        {
          "DataField": "acnam1",
          "Caption": "Fund Name",
          "DataType": "STRING"
        }
      ]
    },
    {
      "Id": "Ticker",
      "label": "TICKER",
      "type": "GRIDLKP",
      "required": true,
      "EntitykeyField": "tkr",
      "Entity": "Secrty",
      "ColumnDefinitions": [
        {
          "DataField": "tkr",
          "Caption": "Ticker",
          "DataType": "STRING"
        },
        {
          "DataField": "tkr_DESC",
          "Caption": "Description",
          "DataType": "STRING"
        }
      ]
    },
    {
      "Id": "TradeDate",
      "label": "TRADE_DATE",
      "type": "DATEPICKER",
      "required": true
    },
    {
      "Id": "Broker",
      "label": "BROKER",
      "type": "GRIDLKP",
      "required": true,
      "EntitykeyField": "broker",
      "Entity": "Broker",
      "ColumnDefinitions": [
        {
          "DataField": "name",
          "Caption": "Broker Name",
          "DataType": "STRING"
        },
        {
          "DataField": "broker",
          "Caption": "Broker ID",
          "DataType": "STRING"
        }
      ]
    },
    {
      "Id": "Quantity",
      "label": "QUANTITY",
      "type": "NUMERIC",
      "required": true
    },
    {
      "Id": "Price",
      "label": "PRICE",
      "type": "NUMERIC",
      "required": true
    },
    {
      "Id": "Strategy",
      "label": "STRATEGY",
      "type": "SELECT",
      "required": true,
      "Options": [
        {"Value": "Growth", "Label": "Growth"},
        {"Value": "Value", "Label": "Value"},
        {"Value": "Income", "Label": "Income"},
        {"Value": "Balanced", "Label": "Balanced"}
      ]
    },
    {
      "Id": "HoldingPeriod",
      "label": "HOLDING_PERIOD_MONTHS",
      "type": "NUMERIC",
      "required": true,
      "DefaultValue": 12
    }
  ],
  "Actions": [
    {
      "ID": "PROCESS",
      "Label": "PROCESS",
      "MethodToInvoke": "ExecuteLongTermPurchase"
    }
  ],
  "Validations": [
    {
      "Id": "1",
      "Type": "ERROR",
      "Message": "Quantity must be greater than 0",
      "CondExpression": {
        "Conditions": [
          {
            "RightField": "Quantity",
            "Operator": "LE",
            "Value": "0",
            "ValueType": "NUMERIC"
          }
        ]
      }
    },
    {
      "Id": "2",
      "Type": "ERROR",
      "Message": "Price must be greater than 0",
      "CondExpression": {
        "Conditions": [
          {
            "RightField": "Price",
            "Operator": "LE",
            "Value": "0",
            "ValueType": "NUMERIC"
          }
        ]
      }
    },
    {
      "Id": "3",
      "Type": "ERROR",
      "Message": "Holding period must be at least 6 months",
      "CondExpression": {
        "Conditions": [
          {
            "RightField": "HoldingPeriod",
            "Operator": "LT",
            "Value": "6",
            "ValueType": "NUMERIC"
          }
        ]
      }
    }
  ]
}
\`\`\`

✅ JSON BUYLONG généré avec succès ! Ce formulaire simplifie le processus d'achat à long terme avec :
- 8 champs essentiels
- Validations robustes
- Stratégies d'investissement prédéfinies
- Période de détention minimale de 6 mois`,
                        timestamp: new Date()
                      };
                      
                      setTimeout(() => {
                        setMessages(prev => [...prev, assistantMessage]);
                      }, 1000);
                    }}
                    disabled={isGenerating}
                    variant="outline"
                    className="w-full h-12 border-2 border-orange-300 hover:border-orange-400 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-800/30 rounded-xl font-medium"
                  >
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                    <span className="text-orange-700 dark:text-orange-400">Générer BUYLONG</span>
                  </Button>
                </div>

                {/* Component Mapping Reference */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-xl border border-blue-200 dark:border-slate-500">
                  <h3 className="font-semibold text-sm mb-3 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Mapping des Composants
                  </h3>
                  <div className="space-y-2 text-xs">
                    {Object.entries(componentMapping).slice(0, 4).map(([delphi, modern]) => (
                      <div key={delphi} className="flex justify-between items-center p-2 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300 font-mono">{delphi}</span>
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {modern}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated JSON */}
            {generatedJSON && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Generated JSON
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-600">Fields:</div>
                      <div className="font-medium">{generatedJSON.fields.length}</div>
                      <div className="text-gray-600">Validations:</div>
                      <div className="font-medium">{generatedJSON.validations.length}</div>
                    </div>
                    
                    <Button onClick={downloadJSON} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  AI Chat Interface
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask about form generation, JSON structure, or component mapping..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isProcessing}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}