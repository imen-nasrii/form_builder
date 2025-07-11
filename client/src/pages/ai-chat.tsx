import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles, Upload, FileText, MessageCircle, Zap } from 'lucide-react';
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
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Intelligent suggestion buttons for quick interaction
  const suggestions = [
    { 
      text: "Do you like ACCADJ program?", 
      description: "Ask about existing Account Adjustment program",
      icon: "📊"
    },
    { 
      text: "Do you like BUYTYP program?", 
      description: "Ask about existing Buy Type Management program",
      icon: "💼" 
    },
    { 
      text: "I need a custom program", 
      description: "Create a completely new program",
      icon: "🚀"
    },
    { 
      text: "Analyze my DFM file", 
      description: "Upload and analyze Delphi DFM file",
      icon: "📁"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add initial welcome message when chat loads
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: `Hello! I'm your **Next-Generation AI Assistant** specialized in creating financial program JSON configurations! 🚀

I can help you with:
• **ACCADJ** - Account Adjustment Programs
• **BUYTYP** - Buy Type Management Programs  
• **PRIMNT** - Price Maintenance Programs
• **SRCMNT** - Source Maintenance Programs

**Let me ask you step by step:**
1️⃣ Would you like to use one of our existing financial programs like ACCADJ, BUYTYP, PRIMNT, or SRCMNT?
2️⃣ Or do you need to create a completely custom program?

You can also upload a DFM file for intelligent analysis! 📁✨`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSuggestionClick = (suggestionText: string) => {
    setInputMessage(suggestionText);
    setShowSuggestions(false);
    
    // Automatically send the suggestion
    setTimeout(() => {
      sendMessage(suggestionText);
    }, 100);
  };

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
    setShowSuggestions(true);
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
        content: `📁 Analyzing DFM file: ${file.name}`,
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

        let analysisResponse = `**🎯 Comprehensive DFM Analysis Results**\n\n`;
        
        if (analysis.programType) {
          analysisResponse += `**📋 Program Type:** ${analysis.programType}\n`;
          if (analysis.confidence) {
            analysisResponse += `**🎯 Confidence:** ${analysis.confidence}\n`;
          }
          analysisResponse += `\n`;
        }
        
        if (analysis.detectedFields?.length) {
          analysisResponse += `**🔍 Detected Fields:**\n`;
          analysis.detectedFields.forEach((field: any, index: number) => {
            analysisResponse += `${index + 1}. **${field.name}** (${field.type}) - ${field.purpose}\n`;
          });
          analysisResponse += `\n`;
        }
        
        if (analysis.businessContext) {
          analysisResponse += `**💼 Business Context:**\n`;
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
          analysisResponse += `**❓ Key Questions to Refine Your Program:**\n\n`;
          analysis.intelligentQuestions.forEach((question: string, index: number) => {
            analysisResponse += `${index + 1}. ${question}\n`;
          });
          analysisResponse += `\n`;
        }
        
        if (analysis.recommendedTemplate) {
          analysisResponse += `**📖 Recommended Template:** ${analysis.recommendedTemplate}\n\n`;
        }
        
        if (analysis.implementationNotes) {
          analysisResponse += `**💡 Implementation Notes:**\n${analysis.implementationNotes}\n\n`;
        }

        // Ensure we have some content
        if (analysisResponse === `**🎯 Comprehensive DFM Analysis Results**\n\n`) {
          analysisResponse += `**Analysis completed successfully!** The DFM file has been processed. Please ask me specific questions about what program you'd like to generate based on this file.`;
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-violet-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/2 w-60 h-60 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '6s' }}></div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 rounded-3xl shadow-2xl">
                <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '8s' }} />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
                AI Assistant
              </h1>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Advanced Training & Generation
              </div>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              🚀 <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Next-Generation AI</span> for creating sophisticated financial program configurations
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                ACCADJ
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                BUYTYP
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
                PRIMNT
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                SRCMNT
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Chat Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
            {/* Chat Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-cyan-500/10 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-violet-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">AI Training Session</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Advanced Program Generation</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">Online</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Messages Area */}
            <ScrollArea className="h-[650px] p-6">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Enhanced Avatar */}
                    <div className="flex-shrink-0 relative">
                      <div className={`absolute inset-0 ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-400 to-cyan-500' 
                          : 'bg-gradient-to-r from-pink-400 to-violet-500'
                      } rounded-full blur-md opacity-75 animate-pulse`}></div>
                      <div className={`relative ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600' 
                          : 'bg-gradient-to-r from-pink-500 to-violet-600'
                      } rounded-full p-3 shadow-lg`}>
                        {message.type === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Enhanced Message Bubble */}
                    <div className={`flex-1 max-w-[85%] ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      <div className="relative">
                        {message.type === 'user' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-3xl blur-sm opacity-50"></div>
                        )}
                        {message.type === 'assistant' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl blur-sm"></div>
                        )}
                        <div
                          className={`relative inline-block p-5 rounded-3xl shadow-lg backdrop-blur-sm ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-blue-500/25'
                              : 'bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 shadow-purple-500/10 border border-purple-100 dark:border-purple-900/30'
                          }`}
                        >
                          {message.isLoading ? (
                            <div className="flex items-center gap-3">
                              <div className="flex gap-1">
                                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-3 h-3 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">AI is thinking...</span>
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                              {message.content}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Message Actions */}
                      {!message.isLoading && message.type === 'assistant' && (
                        <div className="flex items-center gap-1 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.content)}
                            className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-100"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Enhanced Input Area */}
            <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-6 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about program generation..."
                    className="pr-14 h-12 bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 rounded-2xl text-base shadow-lg backdrop-blur-sm focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="absolute right-2 top-2 h-8 w-8 p-0 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 px-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:from-blue-100 hover:to-cyan-100 rounded-2xl shadow-lg"
                  disabled={isLoading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  DFM File
                </Button>
                {messages.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearChat}
                    className="h-12 px-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 hover:from-red-100 hover:to-pink-100 rounded-2xl shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".dfm,.txt"
                  onChange={handleDfmUpload}
                  style={{ display: 'none' }}
                />
              </div>
              
              {/* Intelligent Suggestion Buttons */}
              {showSuggestions && messages.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="text-xs px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:from-purple-100 hover:to-pink-100 rounded-xl shadow-md transition-all duration-200 hover:scale-105"
                      title={suggestion.description}
                    >
                      <span className="mr-2">{suggestion.icon}</span>
                      {suggestion.text}
                    </Button>
                  ))}
                </div>
              )}
              
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                Press Enter to send • Shift+Enter for new line • Upload DFM files for intelligent analysis
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}