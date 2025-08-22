import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Upload, 
  FileText, 
  Send, 
  MessageCircle, 
  CheckCircle, 
  Loader2, 
  TrendingUp 
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your AI assistant for generating program JSON configurations.

I can help you:
• Generate BUYTYP, ACCADJ, PRIMNT, SRCMNT programs
• Convert DFM files to JSON configurations
• Create any custom program type

Just say "hi" or ask me to generate any program type!`,
      timestamp: new Date()
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dfmFile, setDfmFile] = useState<File | null>(null);
  
  const dfmInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (type: 'dfm' | 'info', file: File) => {
    if (type === 'dfm') {
      setDfmFile(file);
      toast({
        title: "DFM File Uploaded",
        description: `${file.name} ready for processing`,
      });
    }
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsProcessing(true);
    
    setTimeout(() => {
      let responseContent = '';
      const lowerMessage = currentMessage.toLowerCase();
      
      if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
        responseContent = "Hi! How are you! I'm here to help you generate any program type. You can ask me to create BUYTYP, ACCADJ, PRIMNT, SRCMNT, or any other program configuration. What would you like to generate?";
      }
      else if (lowerMessage.includes('buytyp') || lowerMessage.includes('buy')) {
        generateSpecificProgram('BUYTYP');
        setIsProcessing(false);
        return;
      }
      else if (lowerMessage.includes('accadj') || lowerMessage.includes('account')) {
        generateSpecificProgram('ACCADJ');
        setIsProcessing(false);
        return;
      }
      else if (lowerMessage.includes('primnt') || lowerMessage.includes('primary')) {
        generateSpecificProgram('PRIMNT');
        setIsProcessing(false);
        return;
      }
      else if (lowerMessage.includes('srcmnt') || lowerMessage.includes('source')) {
        generateSpecificProgram('SRCMNT');
        setIsProcessing(false);
        return;
      }
      else if (lowerMessage.includes('generate') || lowerMessage.includes('create')) {
        responseContent = "I can generate any program type for you! Please specify which type you'd like:\n\n• BUYTYP - Purchase type programs\n• ACCADJ - Account adjustment programs\n• PRIMNT - Primary maintenance programs\n• SRCMNT - Source maintenance programs\n\nOr just tell me the specific program name you need!";
      }
      else {
        responseContent = "I understand you'd like help with program generation. I can create JSON configurations for BUYTYP, ACCADJ, PRIMNT, SRCMNT and other program types. What specific program would you like me to generate?";
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const generateProgramJSON = (programType: string) => {
    const fields = generateFieldsForProgram(programType);
    const validations = generateValidationsForProgram(programType);
    
    return {
      "MenuID": programType,
      "Label": `${programType} - ${getProgramLabel(programType)}`,
      "FormWidth": programType === "BUYTYP" ? "600px" : "700px",
      "Layout": "PROCESS",
      "Fields": fields,
      "Actions": [
        {
          "ID": "PROCESS",
          "Label": "PROCESS",
          "MethodToInvoke": `Execute${programType}`
        }
      ],
      "Validations": validations
    };
  };

  const getProgramLabel = (type: string) => {
    switch(type) {
      case "BUYTYP": return "Purchase Type";
      case "ACCADJ": return "Account Adjustment";
      case "PRIMNT": return "Primary Maintenance";
      case "SRCMNT": return "Source Maintenance";
      default: return "Custom Program";
    }
  };

  const generateValidationsForProgram = (programType: string) => {
    const baseValidations = [
      {
        "Id": "1",
        "Expression": "Fund ISN",
        "Message": "Fund is required",
        "Type": "Error"
      }
    ];

    switch(programType) {
      case "ACCADJ":
        return [
          ...baseValidations,
          {
            "Id": "2",
            "Expression": "Amount GT 0",
            "Message": "Amount must be greater than zero",
            "Type": "Error"
          }
        ];
      case "BUYTYP":
        return [
          ...baseValidations,
          {
            "Id": "2",
            "Expression": "TradeDate ISN",
            "Message": "Trade date is required",
            "Type": "Error"
          }
        ];
      default:
        return baseValidations;
    }
  };

  const generateFieldsForProgram = (programType: string) => {
    switch(programType) {
      case "BUYTYP":
        return [
          {
            "Id": "Fund",
            "Label": "Fund",
            "FieldType": "GRIDLKP",
            "Required": true,
            "Entity": "Fndmas"
          },
          {
            "Id": "Ticker",
            "Label": "Ticker",
            "FieldType": "GRIDLKP",
            "Required": true,
            "Entity": "Secrty"
          },
          {
            "Id": "TradeDate",
            "Label": "Trade Date",
            "FieldType": "DATEPKR",
            "Required": true
          },
          {
            "Id": "Broker",
            "Label": "Broker",
            "FieldType": "LSTLKP",
            "Required": true,
            "Entity": "Broker"
          },
          {
            "Id": "Quantity",
            "Label": "Quantity",
            "FieldType": "NUMERIC",
            "Required": true
          }
        ];
        
      case "ACCADJ":
        return [
          {
            "Id": "Fund",
            "Label": "Fund",
            "FieldType": "GRIDLKP",
            "Required": true,
            "Entity": "Fndmas"
          },
          {
            "Id": "Amount",
            "Label": "Amount",
            "FieldType": "NUMERIC",
            "Required": true
          },
          {
            "Id": "AdjustmentType",
            "Label": "Type",
            "FieldType": "SELECT",
            "Required": true,
            "Options": ["Debit", "Credit"]
          },
          {
            "Id": "AdjustmentDate",
            "Label": "Date",
            "FieldType": "DATEPKR",
            "Required": true
          },
          {
            "Id": "Reason",
            "Label": "Reason",
            "FieldType": "TEXT",
            "Required": true
          }
        ];

      case "PRIMNT":
        return [
          {
            "Id": "Entity",
            "Label": "Entity",
            "FieldType": "SELECT",
            "Required": true,
            "Options": ["Fund", "Security", "Broker"]
          },
          {
            "Id": "MaintenanceType",
            "Label": "Type",
            "FieldType": "SELECT",
            "Required": true,
            "Options": ["Create", "Update", "Delete"]
          },
          {
            "Id": "EffectiveDate",
            "Label": "Effective Date",
            "FieldType": "DATEPKR",
            "Required": true
          }
        ];

      case "SRCMNT":
        return [
          {
            "Id": "SourceName",
            "Label": "Source Name",
            "FieldType": "TEXT",
            "Required": true
          },
          {
            "Id": "ConnectionString",
            "Label": "Connection",
            "FieldType": "TEXT",
            "Required": true
          },
          {
            "Id": "SourceType",
            "Label": "Type",
            "FieldType": "SELECT",
            "Required": true,
            "Options": ["Database", "File", "API"]
          }
        ];
        
      default:
        return [
          {
            "Id": "DefaultField",
            "Label": "Field",
            "FieldType": "TEXT",
            "Required": true
          }
        ];
    }
  };

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
${JSON.stringify(jsonContent, null, 2)}
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
    let programType = "AUTODETECT";
    
    if (dfmFile) {
      const fileName = dfmFile.name.toLowerCase();
      if (fileName.includes('buytyp')) {
        programType = "BUYTYP";
      } else if (fileName.includes('accadj')) {
        programType = "ACCADJ";
      } else if (fileName.includes('primnt')) {
        programType = "PRIMNT";
      } else if (fileName.includes('srcmnt')) {
        programType = "SRCMNT";
      }
    }
    
    generateSpecificProgram(programType);
  };

  const getProgramDescription = (type: string) => {
    switch(type) {
      case "BUYTYP":
        return "✅ BUYTYP program generated successfully!\n\n**Purchase type form created with specialized trading fields and validations.**";
      case "ACCADJ":
        return "✅ ACCADJ program generated successfully!\n\n**Account adjustment form created with financial controls and audit trail.**";
      case "PRIMNT":
        return "✅ PRIMNT program generated successfully!\n\n**Primary maintenance form created with entity management capabilities.**";
      case "SRCMNT":
        return "✅ SRCMNT program generated successfully!\n\n**Source maintenance form created with connection management features.**";
      default:
        return "✅ Program generated successfully!\n\n**Custom form created with intelligent field detection.**";
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
                                {message.timestamp.toLocaleTimeString('en-US')}
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