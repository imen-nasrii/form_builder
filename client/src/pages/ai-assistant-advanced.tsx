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
    // Welcome message
    setMessages([{
      id: '1',
      type: 'assistant',
      content: `🚀 **Welcome to the Advanced AI Assistant!**

I'm your intelligent programming companion powered by Claude 4.0 Sonnet. I can help you with:

**🔧 Form Generation & Development:**
• Convert DFM (Delphi) files to modern JSON configurations
• Generate any program type (BUYTYP, ACCADJ, PRIMNT, SRCMNT, etc.)
• Create sophisticated validation rules and business logic

**💻 Programming & Technical Support:**
• Write, analyze, and debug code in any language
• Provide architectural guidance and best practices
• Solve complex technical problems step-by-step

**📚 Learning & Explanation:**
• Explain programming concepts at any level
• Provide detailed tutorials and examples
• Answer technical questions comprehensively

**🔍 Analysis & Optimization:**
• Review code quality and performance
• Suggest improvements and optimizations
• Identify security vulnerabilities

Just ask me anything! I'm here to provide advanced, comprehensive assistance for all your development needs.`,
      timestamp: new Date()
    }]);
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
          title: "DFM File Loaded",
          description: `Loaded ${file.name} successfully`
        });
      } else if (file.name.toLowerCase().includes('info')) {
        setInfoContent(content);
        toast({
          title: "Info File Loaded",
          description: `Loaded ${file.name} successfully`
        });
      } else {
        setCodeToAnalyze(content);
        setCurrentTab('code-analyzer');
        toast({
          title: "File Loaded",
          description: `Loaded ${file.name} for analysis`
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
      title: "Chat Exported",
      description: `Chat history saved: ${filename}`,
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
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced AI Assistant</h1>
            <p className="text-gray-600">Powered by Claude 4.0 Sonnet - Your intelligent development companion</p>
          </div>
        </div>
        <div className="flex gap-2">
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
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
          <Button
            variant="outline"
            onClick={exportChat}
            disabled={messages.length <= 1}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Chat
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            General Chat
          </TabsTrigger>
          <TabsTrigger value="dfm-converter" className="flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            DFM Converter
          </TabsTrigger>
          <TabsTrigger value="code-analyzer" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Code Analyzer
          </TabsTrigger>
          <TabsTrigger value="form-generator" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Form Generator
          </TabsTrigger>
          <TabsTrigger value="explainer" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Concept Explainer
          </TabsTrigger>
          <TabsTrigger value="problem-solver" className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Problem Solver
          </TabsTrigger>
        </TabsList>

        {/* Chat Interface */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Chat Interface
                <Badge variant="secondary">Claude 4.0 Sonnet</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 mb-4 border rounded-lg p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
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
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                          <span>AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about programming, forms, or technical questions..."
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
                />
                <Button onClick={sendChatMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DFM Converter */}
        <TabsContent value="dfm-converter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="w-5 h-5" />
                DFM to JSON Converter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dfm-content">DFM Content</Label>
                <Textarea
                  id="dfm-content"
                  value={dfmContent}
                  onChange={(e) => setDfmContent(e.target.value)}
                  placeholder="Paste your DFM (Delphi Form) content here..."
                  className="min-h-[200px] font-mono"
                />
              </div>
              <div>
                <Label htmlFor="info-content">Info Content (Optional)</Label>
                <Textarea
                  id="info-content"
                  value={infoContent}
                  onChange={(e) => setInfoContent(e.target.value)}
                  placeholder="Paste your Info file content here for additional metadata..."
                  className="min-h-[100px] font-mono"
                />
              </div>
              <Button onClick={convertDFMToJSON} disabled={isLoading || !dfmContent.trim()}>
                <Zap className="w-4 h-4 mr-2" />
                Convert to JSON
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Analyzer */}
        <TabsContent value="code-analyzer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Advanced Code Analyzer
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
              <Button onClick={analyzeCode} disabled={isLoading || !codeToAnalyze.trim()}>
                <Brain className="w-4 h-4 mr-2" />
                Analyze Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Form Generator */}
        <TabsContent value="form-generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Intelligent Form Generator
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
              <Button onClick={generateForm} disabled={isLoading || !formType.trim()}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Form
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Concept Explainer */}
        <TabsContent value="explainer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Concept Explainer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="concept">Concept to Explain</Label>
                <Input
                  id="concept"
                  value={conceptToExplain}
                  onChange={(e) => setConceptToExplain(e.target.value)}
                  placeholder="e.g., REST APIs, Database Normalization, React Hooks, Design Patterns..."
                />
              </div>
              <div>
                <Label htmlFor="level-select">Explanation Level</Label>
                <Select value={explanationLevel} onValueChange={(value: any) => setExplanationLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner - Basic concepts and terminology</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Practical examples and use cases</SelectItem>
                    <SelectItem value="advanced">Advanced - Deep technical details and best practices</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={explainConcept} disabled={isLoading || !conceptToExplain.trim()}>
                <HelpCircle className="w-4 h-4 mr-2" />
                Explain Concept
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Problem Solver */}
        <TabsContent value="problem-solver" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Advanced Problem Solver
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="problem">Problem Description</Label>
                <Textarea
                  id="problem"
                  value={problemToSolve}
                  onChange={(e) => setProblemToSolve(e.target.value)}
                  placeholder="Describe the problem you need help solving..."
                  className="min-h-[150px]"
                />
              </div>
              <div>
                <Label htmlFor="context">Additional Context (Optional)</Label>
                <Textarea
                  id="context"
                  value={problemContext}
                  onChange={(e) => setProblemContext(e.target.value)}
                  placeholder="Provide any relevant context, constraints, or background information..."
                  className="min-h-[100px]"
                />
              </div>
              <Button onClick={solveProblem} disabled={isLoading || !problemToSolve.trim()}>
                <Settings className="w-4 h-4 mr-2" />
                Solve Problem
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}