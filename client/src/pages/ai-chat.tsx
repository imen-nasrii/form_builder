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
        content: `Hello! I'm your AI Assistant specialized in creating financial program JSON configurations.

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
      {/* Simple Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            AI Assistant
          </h1>
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="flex items-center gap-2"
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
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-green-500'
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
                        {message.type === 'user' ? 'You' : 'Assistant'}
                      </span>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {message.isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap break-words">
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

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message AI Assistant..."
                className="pr-12 border-gray-300 dark:border-gray-600 rounded-lg"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0"
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
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}