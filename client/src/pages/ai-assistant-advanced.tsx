import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Upload, FileCode, Bot, Zap, Brain, HelpCircle, Settings, Send, Code, FileText, Lightbulb, Cpu, Sparkles, Users, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    usage?: {
      input_tokens: number;
      output_tokens: number;
    };
    type?: string;
  };
}

interface AIResponse {
  response: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export default function AdvancedAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('chat');
  const [dfmContent, setDfmContent] = useState('');
  const [infoContent, setInfoContent] = useState('');
  const [codeToAnalyze, setCodeToAnalyze] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [conceptToExplain, setConceptToExplain] = useState('');
  const [explanationLevel, setExplanationLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [problemToSolve, setProblemToSolve] = useState('');
  const [problemContext, setProblemContext] = useState('');
  const [formType, setFormType] = useState('');
  const [formSpecs, setFormSpecs] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Interface propre au démarrage - pas de message automatique
    setMessages([]);
  }, []);

  const addMessage = (type: 'user' | 'assistant', content: string, metadata?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      metadata
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendChatMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    addMessage('user', userMessage);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiRequest<AIResponse>('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage,
          context: messages.length > 1 ? messages.slice(-5).map(m => `${m.type}: ${m.content}`).join('\n') : undefined
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      addMessage('assistant', response.response, { usage: response.usage, type: 'chat' });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('assistant', 'I apologize, but I encountered an error processing your request. Please try again or check if the ANTHROPIC_API_KEY is properly configured.');
    } finally {
      setIsLoading(false);
    }
  };

  const convertDFMToJSON = async () => {
    if (!dfmContent.trim()) {
      toast({
        title: "DFM Content Required",
        description: "Please provide DFM content to convert",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    addMessage('user', `Convert DFM to JSON:\n\`\`\`\n${dfmContent.substring(0, 200)}${dfmContent.length > 200 ? '...' : ''}\n\`\`\``);

    try {
      const response = await apiRequest<AIResponse>('/api/ai/convert-dfm', {
        method: 'POST',
        body: JSON.stringify({ dfmContent, infoContent }),
        headers: { 'Content-Type': 'application/json' }
      });

      addMessage('assistant', response.response, { usage: response.usage, type: 'dfm-conversion' });
    } catch (error) {
      console.error('DFM conversion error:', error);
      addMessage('assistant', 'Error converting DFM to JSON. Please check your input and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCode = async () => {
    if (!codeToAnalyze.trim()) {
      toast({
        title: "Code Required",
        description: "Please provide code to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    addMessage('user', `Analyze ${codeLanguage} code:\n\`\`\`${codeLanguage}\n${codeToAnalyze.substring(0, 200)}${codeToAnalyze.length > 200 ? '...' : ''}\n\`\`\``);

    try {
      const response = await apiRequest<AIResponse>('/api/ai/analyze-code', {
        method: 'POST',
        body: JSON.stringify({ code: codeToAnalyze, language: codeLanguage }),
        headers: { 'Content-Type': 'application/json' }
      });

      addMessage('assistant', response.response, { usage: response.usage, type: 'code-analysis' });
    } catch (error) {
      console.error('Code analysis error:', error);
      addMessage('assistant', 'Error analyzing code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const explainConcept = async () => {
    if (!conceptToExplain.trim()) {
      toast({
        title: "Concept Required",
        description: "Please provide a concept to explain",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    addMessage('user', `Explain "${conceptToExplain}" at ${explanationLevel} level`);

    try {
      const response = await apiRequest<AIResponse>('/api/ai/explain', {
        method: 'POST',
        body: JSON.stringify({ concept: conceptToExplain, level: explanationLevel }),
        headers: { 'Content-Type': 'application/json' }
      });

      addMessage('assistant', response.response, { usage: response.usage, type: 'explanation' });
    } catch (error) {
      console.error('Explanation error:', error);
      addMessage('assistant', 'Error explaining concept. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const solveProblem = async () => {
    if (!problemToSolve.trim()) {
      toast({
        title: "Problem Required",
        description: "Please describe the problem to solve",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    addMessage('user', `Solve problem: ${problemToSolve}${problemContext ? `\nContext: ${problemContext}` : ''}`);

    try {
      const response = await apiRequest<AIResponse>('/api/ai/solve-problem', {
        method: 'POST',
        body: JSON.stringify({ problem: problemToSolve, context: problemContext }),
        headers: { 'Content-Type': 'application/json' }
      });

      addMessage('assistant', response.response, { usage: response.usage, type: 'problem-solving' });
    } catch (error) {
      console.error('Problem solving error:', error);
      addMessage('assistant', 'Error solving problem. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateForm = async () => {
    if (!formType.trim()) {
      toast({
        title: "Form Type Required",
        description: "Please specify the form type to generate",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    addMessage('user', `Generate ${formType} form${formSpecs ? ` with specifications: ${formSpecs}` : ''}`);

    try {
      const response = await apiRequest<AIResponse>('/api/ai/generate-form', {
        method: 'POST',
        body: JSON.stringify({ formType, specifications: formSpecs }),
        headers: { 'Content-Type': 'application/json' }
      });

      addMessage('assistant', response.response, { usage: response.usage, type: 'form-generation' });
    } catch (error) {
      console.error('Form generation error:', error);
      addMessage('assistant', 'Error generating form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (file.name.toLowerCase().endsWith('.dfm')) {
        setDfmContent(content);
        setCurrentTab('dfm-converter');
        toast({
          title: "Fichier DFM Chargé",
          description: `${file.name} chargé avec succès`
        });
      } else if (file.name.toLowerCase().includes('info')) {
        setInfoContent(content);
        toast({
          title: "Fichier Info Chargé",
          description: `${file.name} chargé avec succès`
        });
      } else {
        setCodeToAnalyze(content);
        setCurrentTab('code-analyzer');
        toast({
          title: "Fichier Chargé",
          description: `${file.name} chargé pour analyse`
        });
      }
    };
    reader.readAsText(file);
  };

  const exportChat = () => {
    const chatExport = {
      timestamp: new Date().toISOString(),
      messages: messages.map(m => ({
        type: m.type,
        content: m.content,
        timestamp: m.timestamp,
        usage: m.metadata?.usage
      }))
    };

    const dataStr = JSON.stringify(chatExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `ai-chat-export-${timestamp}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
    
    toast({
      title: "Chat Exporté",
      description: `Historique du chat sauvegardé : ${filename}`,
    });
  };

  const formatMessage = (content: string) => {
    // Basic markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75"></div>
              <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white shadow-lg">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Assistant IA Avancé
              </h1>
              <p className="text-gray-600 text-lg">Propulsé par Claude 4.0 Sonnet - Votre compagnon intelligent de développement</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept=".dfm,.txt,.js,.ts,.json,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs"
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50 shadow-lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importer Fichier
            </Button>
            <Button
              variant="outline"
              onClick={exportChat}
              disabled={messages.length <= 1}
              className="bg-white/80 backdrop-blur-sm border-purple-200 hover:bg-purple-50 shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter Chat
            </Button>
          </div>
        </div>
      </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-white/60 backdrop-blur-sm p-1 shadow-lg border-0">
            <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <MessageCircle className="w-4 h-4" />
              Chat Général
            </TabsTrigger>
            <TabsTrigger value="dfm-converter" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
              <FileCode className="w-4 h-4" />
              Convertisseur DFM
            </TabsTrigger>
            <TabsTrigger value="code-analyzer" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <Code className="w-4 h-4" />
              Analyseur Code
            </TabsTrigger>
            <TabsTrigger value="form-generator" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Zap className="w-4 h-4" />
              Générateur Formulaires
            </TabsTrigger>
            <TabsTrigger value="explainer" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              <Lightbulb className="w-4 h-4" />
              Explicateur
            </TabsTrigger>
            <TabsTrigger value="problem-solver" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
              <Cpu className="w-4 h-4" />
              Résolveur Problèmes
            </TabsTrigger>
          </TabsList>

          {/* Chat Interface */}
          <TabsContent value="chat" className="space-y-4">
            <Card className="h-[600px] flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-600" />
                  Interface Chat IA
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">Claude 4.0 Sonnet</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 mb-4 border-0 rounded-xl p-4 bg-gradient-to-b from-white/50 to-gray-50/50">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                              : 'bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-200'
                          }`}
                        >
                        <div 
                          className="whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                        />
                        {message.metadata?.usage && (
                          <div className="mt-2 pt-2 border-t border-gray-300 text-xs opacity-70">
                            Tokens: {message.metadata.usage.input_tokens} in, {message.metadata.usage.output_tokens} out
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                            <span className="text-gray-700">L'IA réfléchit...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
                
                <div className="flex gap-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Posez-moi des questions sur la programmation, les formulaires, ou tout autre sujet technique..."
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
                    className="flex-1 border-0 bg-white/80 backdrop-blur-sm shadow-sm"
                  />
                  <Button 
                    onClick={sendChatMessage} 
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

          {/* DFM Converter */}
          <TabsContent value="dfm-converter" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-green-600" />
                  Convertisseur DFM vers JSON
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <Label htmlFor="dfm-content" className="text-sm font-medium text-gray-700">Contenu DFM</Label>
                  <Textarea
                    id="dfm-content"
                    value={dfmContent}
                    onChange={(e) => setDfmContent(e.target.value)}
                    placeholder="Collez votre contenu DFM (Delphi Form) ici..."
                    className="min-h-[200px] font-mono bg-white/80 backdrop-blur-sm border-green-200 focus:border-green-400 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="info-content" className="text-sm font-medium text-gray-700">Contenu Info (Optionnel)</Label>
                  <Textarea
                    id="info-content"
                    value={infoContent}
                    onChange={(e) => setInfoContent(e.target.value)}
                    placeholder="Collez votre contenu de fichier Info ici pour des métadonnées supplémentaires..."
                    className="min-h-[100px] font-mono bg-white/80 backdrop-blur-sm border-green-200 focus:border-green-400 shadow-sm"
                  />
                </div>
                <Button 
                  onClick={convertDFMToJSON} 
                  disabled={isLoading || !dfmContent.trim()}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Convertir en JSON
                </Button>
              </CardContent>
          </Card>
        </TabsContent>

          {/* Code Analyzer */}
          <TabsContent value="code-analyzer" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-orange-600" />
                  Analyseur de Code Avancé
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language-select">Programming Language</Label>
                <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="code-content">Code to Analyze</Label>
                <Textarea
                  id="code-content"
                  value={codeToAnalyze}
                  onChange={(e) => setCodeToAnalyze(e.target.value)}
                  placeholder="Paste your code here for comprehensive analysis..."
                  className="min-h-[300px] font-mono"
                />
              </div>
                <Button 
                  onClick={analyzeCode} 
                  disabled={isLoading || !codeToAnalyze.trim()}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Analyser le Code
                </Button>
            </CardContent>
          </Card>
        </TabsContent>

          {/* Form Generator */}
          <TabsContent value="form-generator" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Générateur de Formulaires Intelligent
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="form-type">Form Type</Label>
                <Input
                  id="form-type"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  placeholder="e.g., BUYTYP, ACCADJ, PRIMNT, SRCMNT, or any custom form type"
                />
              </div>
              <div>
                <Label htmlFor="form-specs">Specifications (Optional)</Label>
                <Textarea
                  id="form-specs"
                  value={formSpecs}
                  onChange={(e) => setFormSpecs(e.target.value)}
                  placeholder="Describe specific requirements, fields, validations, or business rules..."
                  className="min-h-[150px]"
                />
              </div>
                <Button 
                  onClick={generateForm} 
                  disabled={isLoading || !formType.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer le Formulaire
                </Button>
            </CardContent>
          </Card>
        </TabsContent>

          {/* Concept Explainer */}
          <TabsContent value="explainer" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Explicateur de Concepts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <Label htmlFor="concept" className="text-sm font-medium text-gray-700">Concept à Expliquer</Label>
                  <Input
                    id="concept"
                    value={conceptToExplain}
                    onChange={(e) => setConceptToExplain(e.target.value)}
                    placeholder="ex: APIs REST, Normalisation BDD, React Hooks, Design Patterns..."
                    className="bg-white/80 backdrop-blur-sm border-yellow-200 focus:border-yellow-400 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level-select" className="text-sm font-medium text-gray-700">Niveau d'Explication</Label>
                  <Select value={explanationLevel} onValueChange={(value: any) => setExplanationLevel(value)}>
                    <SelectTrigger className="bg-white/80 backdrop-blur-sm border-yellow-200 focus:border-yellow-400 shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Débutant - Concepts de base et terminologie</SelectItem>
                      <SelectItem value="intermediate">Intermédiaire - Exemples pratiques et cas d'usage</SelectItem>
                      <SelectItem value="advanced">Avancé - Détails techniques et meilleures pratiques</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={explainConcept} 
                  disabled={isLoading || !conceptToExplain.trim()}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Expliquer le Concept
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Problem Solver */}
          <TabsContent value="problem-solver" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-600" />
                  Résolveur de Problèmes Avancé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <Label htmlFor="problem" className="text-sm font-medium text-gray-700">Description du Problème</Label>
                  <Textarea
                    id="problem"
                    value={problemToSolve}
                    onChange={(e) => setProblemToSolve(e.target.value)}
                    placeholder="Décrivez le problème que vous devez résoudre..."
                    className="min-h-[150px] bg-white/80 backdrop-blur-sm border-indigo-200 focus:border-indigo-400 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="context" className="text-sm font-medium text-gray-700">Contexte Additionnel (Optionnel)</Label>
                  <Textarea
                    id="context"
                    value={problemContext}
                    onChange={(e) => setProblemContext(e.target.value)}
                    placeholder="Fournissez tout contexte pertinent, contraintes ou informations de fond..."
                    className="min-h-[100px] bg-white/80 backdrop-blur-sm border-indigo-200 focus:border-indigo-400 shadow-sm"
                  />
                </div>
                <Button 
                  onClick={solveProblem} 
                  disabled={isLoading || !problemToSolve.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Résoudre le Problème
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
      </Tabs>
    </div>
  );
}