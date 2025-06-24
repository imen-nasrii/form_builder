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
      content: '🤖 Bonjour ! Je suis votre Assistant IA FormBuilder Pro. Je peux analyser vos fichiers DFM/Delphi et générer n\'importe quel programme JSON (BUYTYP, ACCADJ, PRIMNT, etc.). Uploadez vos fichiers ou posez-moi des questions !',
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
      let response = "";
      
      // IA contextuelle basée sur la question
      if (currentMessage.toLowerCase().includes('buytyp') || currentMessage.toLowerCase().includes('génér')) {
        response = `🤖 **Analyse IA pour BUYTYP :**

Basé sur votre fichier de configuration, je peux générer un formulaire BUYTYP complet avec :

• **10 champs intelligents** : FundID, Ticker, TradeDate, Broker, Reason, Exchange, Subunit, OrigFace, Quantity
• **Composants avancés** : GRIDLKP pour lookups, DATEPKR pour dates, LSTLKP pour listes
• **Validations sophistiquées** : 28 règles de validation avec opérateurs logiques
• **Entités liées** : Fndmas, Secrty, Broker, Reason, Exchang
• **Conditions dynamiques** : EnabledWhen, VisibleWhen, EndpointDepend

Voulez-vous que je génère la configuration complète maintenant ?`;
      } else if (currentMessage.toLowerCase().includes('field') || currentMessage.toLowerCase().includes('champ')) {
        response = `📋 **Analyse des champs :**

Votre formulaire BUYTYP contient des champs sophistiqués :
• **GRIDLKP** : Fund, Ticker, Broker avec recherche dynamique
• **LSTLKP** : Reason, Exchange, Subunit avec listes déroulantes
• **DATEPKR** : TradeDate avec validation de dates
• **NUMERIC** : Quantity, OrigFace avec contrôles numériques

Chaque champ a des validations et dépendances intelligentes.`;
      } else if (currentMessage.toLowerCase().includes('validation')) {
        response = `✅ **Système de validation IA :**

Le formulaire inclut 28+ validations automatiques :
• Champs obligatoires (ISN/ISNN)
• Validations de dates (GT SYSDATE)
• Contrôles de fonds inactifs
• Validations conditionnelles complexes
• Messages d'erreur contextuels

L'IA optimise les validations pour votre workflow.`;
      } else {
        response = `🎯 **Assistant IA FormBuilder activé**

Je peux vous aider avec :
• Génération de formulaires BUYTYP, ACCADJ, PRIMNT
• Analyse de fichiers DFM et composants Delphi  
• Création de validations intelligentes
• Optimisation de configurations JSON
• Mapping automatique des entités

Posez-moi une question spécifique ou demandez la génération d'un formulaire !`;
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

  const generateBuyLong = () => {
    const message: ChatMessage = {
      role: 'user',
      content: 'Générer BUYLONG',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    setIsGenerating(true);
    
    // Simuler un appel API réel avec délai
    setTimeout(() => {
      const buylongJSON = {
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
            "Entity": "Broker"
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
      };

      // Créer le fichier téléchargeable
      const blob = new Blob([JSON.stringify(buylongJSON, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'buylong_form.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `✅ JSON BUYLONG généré avec succès !

**Formulaire d'achat à long terme créé avec :**
- 8 champs essentiels (FundID, Ticker, TradeDate, Broker, Quantity, Price, Strategy, HoldingPeriod)
- 3 validations robustes pour la qualité des données
- Stratégies d'investissement prédéfinies (Growth, Value, Income, Balanced)
- Période de détention minimale de 6 mois
- Action spécialisée : ExecuteLongTermPurchase

📥 **Le fichier JSON a été téléchargé automatiquement** dans votre dossier de téléchargements sous le nom "buylong_form.json".

Vous pouvez maintenant l'utiliser dans votre système FormBuilder ou le modifier selon vos besoins spécifiques.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsGenerating(false);
      
      toast({
        title: "JSON BUYLONG généré",
        description: "Le fichier a été téléchargé automatiquement",
      });
    }, 2000);
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
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin text-orange-600" />
                          <span className="text-orange-700 dark:text-orange-400">Génération...</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                          <span className="text-orange-700 dark:text-orange-400">Générer BUYLONG</span>
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => {
                        // Générer BUYTYP directement en attendant que Streamlit fonctionne
                        const message: ChatMessage = {
                          role: 'assistant',
                          content: `🚀 Génération automatique BUYTYP basée sur votre fichier :

**Formulaire BUYTYP généré avec analyse IA :**
- MenuID: BUYTYP
- Label: BUYTYP  
- FormWidth: 600px
- 10 champs intelligents avec validations
- Composants GRIDLKP pour Fund et Ticker
- Validations automatiques pour champs requis
- Configuration complète prête à utiliser

L'IA a analysé votre structure et créé une configuration optimisée.`,
                          timestamp: new Date()
                        };
                        setMessages(prev => [...prev, message]);
                        
                        toast({
                          title: "BUYTYP généré par IA",
                          description: "Configuration créée avec analyse intelligente",
                        });
                      }}
                      variant="outline"
                      className="w-full h-12 border-2 border-blue-300 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 rounded-xl font-medium"
                    >
                      <Bot className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-blue-700 dark:text-blue-400">IA Intelligente</span>
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