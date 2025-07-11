import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Send, Bot, User, Copy, RotateCcw, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface AIResponse {
  response: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: `Hello! I'm **Codex**, your magical AI assistant specialized in creating financial program JSON configurations.

I can help you with:
• ACCADJ - Account Adjustment Programs
• BUYTYP - Buy Type Management Programs  
• PRIMNT - Price Maintenance Programs
• SRCMNT - Source Maintenance Programs

Would you like to use one of our existing financial programs, or do you need to create a completely custom program?

You can also upload a DFM file for analysis.`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const response = await apiRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: messageText,
          context: messages.slice(-10),
        }),
      }) as AIResponse;

      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { ...msg, content: response.response, isLoading: false }
          : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text has been copied to clipboard.",
    });
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Conversation cleared",
      description: "The conversation has been reset.",
    });
  };

  const handleDfmUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      
      const analysisMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `Analyzing DFM file: ${file.name}`,
        timestamp: new Date(),
      };

      const loadingMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true,
      };

      setMessages(prev => [...prev, analysisMessage, loadingMessage]);
      setIsLoading(true);

      try {
        const analysis = await apiRequest('/api/ai/analyze-dfm', {
          method: 'POST',
          body: JSON.stringify({ dfmContent: content }),
        });

        let analysisResponse = `DFM Analysis Results\n\n`;
        
        if (analysis.programType) {
          analysisResponse += `Program Type: ${analysis.programType}\n`;
          if (analysis.confidence) {
            analysisResponse += `Confidence: ${analysis.confidence}\n`;
          }
          analysisResponse += `\n`;
        }
        
        if (analysis.detectedFields?.length) {
          analysisResponse += `Detected Fields:\n`;
          analysis.detectedFields.forEach((field: any, index: number) => {
            analysisResponse += `${index + 1}. ${field.name} (${field.type}) - ${field.purpose}\n`;
          });
          analysisResponse += `\n`;
        }
        
        if (analysis.businessContext) {
          analysisResponse += `Business Context:\n`;
          if (analysis.businessContext.primaryEntity) {
            analysisResponse += `• Primary Entity: ${analysis.businessContext.primaryEntity}\n`;
          }
          if (analysis.businessContext.relationships?.length) {
            analysisResponse += `• Relationships: ${analysis.businessContext.relationships.join(', ')}\n`;
          }
          if (analysis.businessContext.workflows?.length) {
            analysisResponse += `• Workflows: ${analysis.businessContext.workflows.join(', ')}\n`;
          }
          analysisResponse += `\n`;
        }
        
        if (analysis.intelligentQuestions?.length) {
          analysisResponse += `Key Questions:\n\n`;
          analysis.intelligentQuestions.forEach((question: string, index: number) => {
            analysisResponse += `${index + 1}. ${question}\n`;
          });
          analysisResponse += `\n`;
        }
        
        if (analysis.recommendedTemplate) {
          analysisResponse += `Recommended Template: ${analysis.recommendedTemplate}\n\n`;
        }
        
        if (analysis.implementationNotes) {
          analysisResponse += `Implementation Notes:\n${analysis.implementationNotes}\n\n`;
        }

        if (analysisResponse === `DFM Analysis Results\n\n`) {
          analysisResponse += `Analysis completed successfully! The DFM file has been processed. Please ask me specific questions about what program you'd like to generate based on this file.`;
        }

        setMessages(prev => prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, content: analysisResponse, isLoading: false }
            : msg
        ));
      } catch (error) {
        console.error('DFM analysis error:', error);
        setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
        toast({
          title: "Error",
          description: "Failed to analyze DFM file. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Enhanced Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Codex
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your Magical AI Assistant
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {messages.map((message) => (
              <div key={message.id} className="mb-6">
                <div className="flex gap-4">
                  {/* Enhanced Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-r from-purple-500 to-purple-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {message.type === 'user' ? 'You' : 'Codex'}
                      </span>
                    </div>
                    <div className={`text-gray-700 dark:text-gray-300 rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                        : 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500'
                    }`}>
                      {message.isLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-purple-600 dark:text-purple-400">Codex is thinking...</span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap break-words leading-relaxed">
                          {message.content}
                        </div>
                      )}
                    </div>
                    
                    {/* Message Actions */}
                    {!message.isLoading && message.type === 'assistant' && (
                      <div className="flex items-center gap-1 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.content)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Codex anything about program generation..."
                className="pr-12 border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-1 top-1 h-8 w-8 p-0 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              disabled={isLoading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload DFM
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".dfm,.txt"
              onChange={handleDfmUpload}
              style={{ display: 'none' }}
            />
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-2">
            <span>✨ Press Enter to send • Shift+Enter for new line • Let Codex work its magic!</span>
          </div>
        </div>
      </div>
    </div>
  );
}