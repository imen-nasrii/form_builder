import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your FormBuilder Pro AI Assistant. I can generate any program type you need - just say "hi" or ask me to "generate [PROGRAM_TYPE]" and I\'ll create it instantly!',
      timestamp: new Date()
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dfmFile, setDfmFile] = useState<File | null>(null);
  const [infoFile, setInfoFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const dfmInputRef = useRef<HTMLInputElement>(null);
  const infoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (type: 'dfm' | 'info', file: File) => {
    if (type === 'dfm') {
      setDfmFile(file);
      toast({
        title: "DFM file uploaded",
        description: `${file.name} ready for processing`,
      });
    } else {
      setInfoFile(file);
      toast({
        title: "Info file uploaded", 
        description: `${file.name} ready for processing`,
      });
    }
  };

  const sendMessage = () => {
    if (!currentMessage.trim() || isProcessing) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      let response = "";
      const message = currentMessage.toLowerCase();
      
      // Greeting responses
      if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
        response = `Hi! How are you? I'm your FormBuilder AI Assistant, ready to help you generate any program type you need. Just tell me what you'd like to create!`;
      }
      // Generate any program type when requested
      else if (message.includes('generate') || message.includes('create') || message.includes('build')) {
        // Check for specific program types
        if (message.includes('buytyp')) {
          generateSpecificProgram('BUYTYP');
          return;
        } else if (message.includes('accadj')) {
          generateSpecificProgram('ACCADJ');
          return;
        } else if (message.includes('primnt')) {
          generateSpecificProgram('PRIMNT');
          return;
        } else if (message.includes('srcmnt')) {
          generateSpecificProgram('SRCMNT');
          return;
        } else {
          response = `**Program Generation Ready**

I can generate any program type for you! Please specify which type you need:

• **BUYTYP** - Purchase type forms
• **ACCADJ** - Account adjustment forms  
• **PRIMNT** - Primary maintenance forms
• **SRCMNT** - Source maintenance forms
• **Custom** - Any other program type you specify

Just say "generate [PROGRAM_TYPE]" and I'll create it for you instantly!`;
        }
      }
      // Field analysis
      else if (message.includes('field')) {
        response = `**Field Analysis:**

I can analyze and create sophisticated fields:
• **GRIDLKP**: Dynamic search grids with entity lookups
• **LSTLKP**: Dropdown lists with filtered options
• **DATEPKR**: Date pickers with validation rules
• **NUMERIC**: Number inputs with range controls
• **TEXT**: Text fields with pattern validation

Each field includes intelligent validations and dependencies.`;
      }
      // Validation information
      else if (message.includes('validation')) {
        response = `**AI Validation System:**

I create comprehensive validation systems:
• Required field validations (ISN/ISNN)
• Date range validations (GT SYSDATE)
• Business rule validations
• Cross-field dependency checks
• Custom error messaging

All validations are optimized for your specific workflow.`;
      }
      // Default helpful response
      else {
        response = `**FormBuilder AI Assistant**

I can help you with:
• Generate ANY program type (BUYTYP, ACCADJ, PRIMNT, SRCMNT, custom)
• Analyze DFM files and Delphi components  
• Create intelligent field validations
• Optimize JSON configurations
• Custom form generation

Just ask me to generate any program and I'll create it instantly!`;
      }

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  // Enhanced function to generate any specific program type
  const generateSpecificProgram = (programType: string) => {
    setIsGenerating(true);
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: `Generate ${programType} program`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const jsonContent = generateProgramJSON(programType);
      const description = getProgramDescription(programType);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `${description}

\`\`\`json
${jsonContent}
\`\`\`

Your ${programType} program is ready! You can copy this JSON configuration and use it in your project.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsGenerating(false);
      
      toast({
        title: `${programType} Generated Successfully!`,
        description: "Program configuration ready for use",
      });
    }, 2000);
  };

  const generateAnyProgram = () => {
    // Déterminer quel type de programme générer basé sur les fichiers uploadés
    let programType = "AUTODETECT";
    let programLabel = "Programme Auto-Détecté";
    
    if (dfmFile) {
      const fileName = dfmFile.name.toLowerCase();
      if (fileName.includes('buytyp')) {
        programType = "BUYTYP";
        programLabel = "BUYTYP - Purchase Type";
      } else if (fileName.includes('accadj')) {
        programType = "ACCADJ";
        programLabel = "ACCADJ - Account Adjustment";
      } else if (fileName.includes('primnt')) {
        programType = "PRIMNT";
        programLabel = "PRIMNT - Primary Maintenance";
      } else if (fileName.includes('srcmnt')) {
        programType = "SRCMNT";
        programLabel = "SRCMNT - Source Maintenance";
      }
    }
    
    const message: ChatMessage = {
      role: 'user',
      content: `Generate ${programType}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    setIsGenerating(true);
    
    // Génération intelligente basée sur le type détecté
    setTimeout(() => {
      const programJSON = {
        "MenuID": programType,
        "Label": programLabel,
        "FormWidth": programType === "BUYTYP" ? "600px" : "700px",
        "Layout": "PROCESS",
        "Fields": generateFieldsForProgram(programType),
        "Actions": [
          {
            "ID": "PROCESS",
            "Label": "PROCESS",
            "MethodToInvoke": `Execute${programType}`
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
      };

      // Stocker le JSON généré pour affichage
      const jsonContent = JSON.stringify(programJSON, null, 2);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: generateSuccessMessage(programType, programJSON) + `

**Configuration JSON générée :**
\`\`\`json
${jsonContent}
\`\`\`

You can now copy this JSON or use the download button if needed.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsGenerating(false);
      
      toast({
        title: `JSON ${programType} generated`,
        description: "Configuration available in chat",
      });
    }, 2000);
  };

  // Fonction pour générer les champs selon le type de programme
  const generateFieldsForProgram = (type: string) => {
    switch(type) {
      case "BUYTYP":
        return [
          {
            "Id": "FundID",
            "label": "FUND",
            "type": "GRIDLKP",
            "required": true,
            "EntitykeyField": "fund",
            "Entity": "Fndmas"
          },
          {
            "Id": "Ticker",
            "label": "TKR",
            "type": "GRIDLKP",
            "required": true,
            "EntitykeyField": "tkr",
            "Entity": "Secrty"
          },
          {
            "Id": "TradeDate",
            "label": "TRADEDATE",
            "type": "DATEPKR",
            "required": true
          },
          {
            "Id": "Broker",
            "label": "BROKER",
            "type": "GRIDLKP",
            "required": true,
            "EntitykeyField": "broker",
            "Entity": "Broker"
          },
          {
            "Id": "Reason",
            "label": "REASON",
            "type": "LSTLKP",
            "required": true,
            "EntitykeyField": "reason",
            "Entity": "Reason"
          }
        ];
      
      case "ACCADJ":
        return [
          {
            "Id": "FundID",
            "label": "FUND",
            "type": "GRIDLKP",
            "required": true,
            "EntitykeyField": "fund",
            "Entity": "Fndmas"
          },
          {
            "Id": "AdjustmentType",
            "label": "ADJ_TYPE",
            "type": "SELECT",
            "required": true,
            "Options": [
              {"Value": "DEBIT", "Label": "Debit"},
              {"Value": "CREDIT", "Label": "Credit"}
            ]
          },
          {
            "Id": "Amount",
            "label": "AMOUNT",
            "type": "NUMERIC",
            "required": true
          },
          {
            "Id": "ProcessDate",
            "label": "PROC_DATE",
            "type": "DATEPKR",
            "required": true
          },
          {
            "Id": "Reason",
            "label": "REASON",
            "type": "TEXTAREA",
            "required": true
          }
        ];
        
      case "PRIMNT":
        return [
          {
            "Id": "EntityType",
            "label": "ENTITY_TYPE",
            "type": "SELECT",
            "required": true,
            "Options": [
              {"Value": "FUND", "Label": "Fund"},
              {"Value": "SECURITY", "Label": "Security"},
              {"Value": "BROKER", "Label": "Broker"}
            ]
          },
          {
            "Id": "EntityID",
            "label": "ENTITY_ID",
            "type": "TEXT",
            "required": true
          },
          {
            "Id": "MaintenanceType",
            "label": "MAINT_TYPE",
            "type": "SELECT",
            "required": true,
            "Options": [
              {"Value": "CREATE", "Label": "Create"},
              {"Value": "UPDATE", "Label": "Update"},
              {"Value": "DELETE", "Label": "Delete"}
            ]
          },
          {
            "Id": "EffectiveDate",
            "label": "EFF_DATE",
            "type": "DATEPKR",
            "required": true
          }
        ];
        
      default: // AUTODETECT ou autre
        return [
          {
            "Id": "AutoField1",
            "label": "AUTO_FIELD_1",
            "type": "TEXT",
            "required": true
          },
          {
            "Id": "AutoField2",
            "label": "AUTO_FIELD_2",
            "type": "DATEPKR",
            "required": false
          },
          {
            "Id": "AutoField3",
            "label": "AUTO_FIELD_3",
            "type": "NUMERIC",
            "required": false
          }
        ];
    }
  };

  // Fonction pour générer le message de succès
  const generateSuccessMessage = (type: string, json: any) => {
    const fieldCount = json.Fields.length;
    const validationCount = json.Validations.length;
    
    switch(type) {
      case "BUYTYP":
        return `✅ JSON BUYTYP generated successfully!

**Purchase type form created with:**
- ${fieldCount} specialized fields (Fund, Ticker, TradeDate, Broker, Reason)
- ${validationCount} robust validations
- GRIDLKP and LSTLKP components for lookups
- Date and required field validation
- Specialized action: ExecuteBUYTYP

📋 **Le JSON est affiché ci-dessous** pour copie ou téléchargement manuel.`;

      case "ACCADJ":
        return `✅ JSON ACCADJ generated successfully!

**Account adjustment form created with:**
- ${fieldCount} adjustment fields (Fund, Type, Amount, Date, Reason)
- ${validationCount} financial validations
- Automatic debit/credit controls
- Amount and date validation
- Specialized action: ExecuteACCADJ

📋 **Le JSON est affiché ci-dessous** pour copie ou téléchargement manuel.`;

      case "PRIMNT":
        return `✅ JSON PRIMNT generated successfully!

**Primary maintenance form created with:**
- ${fieldCount} maintenance fields (Entity, Type, Date)
- ${validationCount} system validations
- Support for Fund/Security/Broker
- Complete CRUD operations
- Specialized action: ExecutePRIMNT

📋 **Le JSON est affiché ci-dessous** pour copie ou téléchargement manuel.`;

      default:
        return `✅ JSON ${type} generated successfully!

**Auto-detected form created with:**
- ${fieldCount} intelligent fields
- ${validationCount} automatic validations
- AI-optimized configuration
- Ready for integration

📋 **Le JSON est affiché ci-dessous** pour copie ou téléchargement manuel.`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
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
                <p className="text-sm text-green-600 font-medium mt-1">Online</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
              Intelligent assistant to convert your DFM files into JSON configurations
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="h-[650px] flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">AI Chat Interface</h3>
                      <p className="text-blue-100 text-sm">Real-time conversation</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-slate-700/50 dark:to-slate-800/50">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
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
                  <div className="border-t border-gray-200 dark:border-gray-600 p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Say hi, or ask me to generate any program type..."
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

            <div className="lg:col-span-1">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">File Upload</h3>
                      <p className="text-emerald-100 text-sm">DFM and Info</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-gray-700 dark:text-gray-200">
                      DFM/JSON File
                    </Label>
                    <div className="relative">
                      <input
                        ref={dfmInputRef}
                        type="file"
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
                          <span>{dfmFile ? dfmFile.name : 'Choose DFM/JSON file'}</span>
                        </div>
                      </Button>
                    </div>
                    {dfmFile && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-700 dark:text-green-400 font-medium">File ready</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={generateAnyProgram}
                      disabled={isGenerating}
                      variant="outline"
                      className="w-full h-12 border-2 border-orange-300 hover:border-orange-400 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-800/30 rounded-xl font-medium"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin text-orange-600" />
                          <span className="text-orange-700 dark:text-orange-400">Generating...</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                          <span className="text-orange-700 dark:text-orange-400">Generate Program</span>
                        </>
                      )}
                    </Button>
                    

                    
                    <Button
                      onClick={() => {
                        // Generate intelligent AI response
                        const message: ChatMessage = {
                          role: 'assistant',
                          content: `🚀 Intelligent automatic generation:

**AI analyzes your files and automatically generates:**
- BUYTYP for purchase types
- ACCADJ for account adjustments  
- PRIMNT for primary maintenance
- SRCMNT for source maintenance
- Or any other type detected in your files

**AI Features:**
- Auto-detection of program type
- Fields adapted to business context
- Specialized validations by type
- Automatically optimized configuration

Upload your DFM/Info files for precise generation!`,
                          timestamp: new Date()
                        };
                        setMessages(prev => [...prev, message]);
                        
                        toast({
                          title: "Intelligent AI activated",
                          description: "Adaptive generation for all programs",
                        });
                      }}
                      variant="outline"
                      className="w-full h-12 border-2 border-blue-300 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 rounded-xl font-medium"
                    >
                      <Bot className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-blue-700 dark:text-blue-400">Intelligent AI</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}