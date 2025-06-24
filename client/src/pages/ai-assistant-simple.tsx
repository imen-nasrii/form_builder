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
      content: 'Bonjour ! Je suis votre assistant IA FormBuilder. Uploadez vos fichiers DFM et Info pour générer des configurations JSON.',
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
        title: "Fichier DFM uploadé",
        description: `${file.name} prêt pour traitement`,
      });
    } else {
      setInfoFile(file);
      toast({
        title: "Fichier Info uploadé", 
        description: `${file.name} prêt pour traitement`,
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
      const response = "Je comprends votre question. Pour des résultats précis, uploadez vos fichiers DFM et Info.";

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  const generateBuyLong = () => {
    const message: ChatMessage = {
      role: 'user',
      content: 'Générer BUYLONG',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: `JSON BUYLONG généré avec succès !

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
      "required": true
    },
    {
      "Id": "Ticker",
      "label": "TICKER", 
      "type": "GRIDLKP",
      "required": true
    },
    {
      "Id": "TradeDate",
      "label": "TRADE_DATE",
      "type": "DATEPICKER",
      "required": true
    },
    {
      "Id": "Strategy",
      "label": "STRATEGY",
      "type": "SELECT",
      "Options": ["Growth", "Value", "Income", "Balanced"]
    }
  ]
}`,
      timestamp: new Date()
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
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
                <p className="text-sm text-green-600 font-medium mt-1">En ligne</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
              Assistant intelligent pour convertir vos fichiers DFM en configurations JSON
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
                      <h3 className="text-xl font-semibold">Interface de Chat IA</h3>
                      <p className="text-blue-100 text-sm">Conversation en temps réel</p>
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
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-gray-700 dark:text-gray-200">
                      Fichier DFM/JSON
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

                  <div className="space-y-3">
                    <Button
                      onClick={generateBuyLong}
                      disabled={isGenerating}
                      variant="outline"
                      className="w-full h-12 border-2 border-orange-300 hover:border-orange-400 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-800/30 rounded-xl font-medium"
                    >
                      <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                      <span className="text-orange-700 dark:text-orange-400">Générer BUYLONG</span>
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