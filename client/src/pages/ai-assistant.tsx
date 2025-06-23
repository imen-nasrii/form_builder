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
  Zap
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
      content: 'Hello! I\'m your AI Form Assistant. Upload your DFM and Info files to generate JSON configurations, or ask me anything about form generation.',
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

      // Parse DFM content
      const components = parseDFMContent(dfmContent);
      const operators = parseInfoContent(infoContent);

      // Generate JSON
      const json = generateFormJSON(components, operators, dfmFile.name);
      setGeneratedJSON(json);

      // Add success message
      const successMessage: ChatMessage = {
        role: 'assistant',
        content: `Successfully processed ${dfmFile.name}! Generated form configuration with ${json.fields.length} fields and ${json.validations.length} validation rules. You can now download the JSON or ask me questions about the generated form.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);

      toast({
        title: "Files Processed Successfully",
        description: `Generated ${json.fields.length} fields and ${json.validations.length} validations`,
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
    const formName = fileName.replace('.dfm', '');
    
    const fields = components.map((comp, index) => {
      const mappedType = (componentMapping as any)[comp.type] || 'TEXT';
      
      return {
        Id: `${mappedType}_${Date.now()}_${index}`,
        Type: mappedType,
        Label: comp.name.replace(/([A-Z])/g, ' $1').trim() || `Field ${index + 1}`,
        DataField: `field_${comp.name.toLowerCase()}`,
        Entity: "TableName",
        Width: "100%",
        Spacing: "md",
        Required: false,
        Inline: false,
        Outlined: false,
        Value: ""
      };
    });

    const validations = operators.operators.slice(0, 3).map((op: any, index: number) => ({
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
    }));

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

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you understand the generated JSON structure. Each field has properties like Type, Label, DataField, and validation rules.",
        "The component mapping converts Delphi controls to modern form fields. For example, TSSICheckBox becomes CHECKBOX type.",
        "Validation rules are generated based on the operators in your Info file. They include conditions and logical operators.",
        "You can modify the generated JSON by adjusting field properties, adding custom validations, or changing the layout.",
        "The generated form follows the standard FormBuilder schema with fields, validations, and metadata."
      ];

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Form Assistant</h1>
              <p className="text-gray-600 dark:text-gray-400">Intelligent DFM to JSON converter with AI-powered assistance</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Upload Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  File Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* DFM File Upload */}
                <div>
                  <Label htmlFor="dfm-upload">DFM File</Label>
                  <div className="mt-2">
                    <input
                      ref={dfmInputRef}
                      type="file"
                      id="dfm-upload"
                      accept=".dfm,.txt"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('dfm', e.target.files[0])}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => dfmInputRef.current?.click()}
                      className="w-full"
                    >
                      {dfmFile ? dfmFile.name : 'Choose DFM File'}
                    </Button>
                  </div>
                  {dfmFile && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      File ready
                    </div>
                  )}
                </div>

                {/* Info File Upload */}
                <div>
                  <Label htmlFor="info-upload">Info File</Label>
                  <div className="mt-2">
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
                      className="w-full"
                    >
                      {infoFile ? infoFile.name : 'Choose Info File'}
                    </Button>
                  </div>
                  {infoFile && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      File ready
                    </div>
                  )}
                </div>

                {/* Process Button */}
                <Button
                  onClick={processFiles}
                  disabled={!dfmFile || !infoFile || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate JSON
                    </>
                  )}
                </Button>

                {/* Component Mapping Reference */}
                <div className="mt-6">
                  <h3 className="font-medium text-sm mb-2">Component Mapping</h3>
                  <div className="space-y-1 text-xs">
                    {Object.entries(componentMapping).slice(0, 4).map(([delphi, modern]) => (
                      <div key={delphi} className="flex justify-between">
                        <span className="text-gray-600">{delphi}</span>
                        <Badge variant="secondary" className="text-xs">{modern}</Badge>
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={handleSendMessage}
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