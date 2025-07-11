import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles, Upload, FileText } from 'lucide-react';
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
  const [showDfmUpload, setShowDfmUpload] = useState(false);
  const [dfmContent, setDfmContent] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Intelligent suggestion buttons for quick interaction
  const suggestions = [
    { 
      text: "Do you like ACCADJ program?", 
      description: "Ask about existing Account Adjustment program" 
    },
    { 
      text: "Do you like BUYTYP program?", 
      description: "Ask about existing Buy Type Management program" 
    },
    { 
      text: "I need a custom program", 
      description: "Create a completely new program" 
    },
    { 
      text: "Analyze my DFM file", 
      description: "Upload and analyze Delphi DFM file" 
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
        content: `Hello! I'm your AI assistant specialized in creating financial program JSON configurations. 

I can help you with:
• **ACCADJ** - Account Adjustment Programs
• **BUYTYP** - Buy Type Management Programs  
• **PRIMNT** - Price Maintenance Programs
• **SRCMNT** - Source Maintenance Programs

Would you like to use one of our existing financial programs like ACCADJ, BUYTYP, PRIMNT, or SRCMNT? Or do you need to create a completely custom program?

You can also upload a DFM file for analysis if you have one!`,
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
      setDfmContent(content);
      setShowDfmUpload(false);
      
      // Analyser automatiquement le fichier DFM
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

        let analysisResponse = `**🎯 Comprehensive DFM Analysis Results**\n\n`;
        
        // Enhanced program type with confidence
        if (analysis.programType) {
          analysisResponse += `**📋 Program Type:** ${analysis.programType}\n`;
          if (analysis.confidence) {
            analysisResponse += `**🎯 Confidence:** ${analysis.confidence}\n\n`;
          }
        }
        
        // Detailed field analysis
        if (analysis.detectedFields?.length) {
          analysisResponse += `**🔍 Detected Fields:**\n`;
          analysis.detectedFields.forEach((field: any) => {
            analysisResponse += `• **${field.name}** (${field.type}): ${field.purpose}${field.required ? ' *Required*' : ''}\n`;
          });
          analysisResponse += `\n`;
        }
        
        // Business context
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
        
        // Structural analysis
        if (analysis.structuralAnalysis) {
          analysisResponse += `**🏗️ Structure Analysis:**\n`;
          const struct = analysis.structuralAnalysis;
          if (struct.layoutType) analysisResponse += `• Layout: ${struct.layoutType}\n`;
          if (struct.hasGrids !== undefined) analysisResponse += `• Has Grids: ${struct.hasGrids ? 'Yes' : 'No'}\n`;
          if (struct.hasLookups !== undefined) analysisResponse += `• Has Lookups: ${struct.hasLookups ? 'Yes' : 'No'}\n`;
          if (struct.hasValidations !== undefined) analysisResponse += `• Has Validations: ${struct.hasValidations ? 'Yes' : 'No'}\n`;
          analysisResponse += `\n`;
        }
        
        // Intelligent questions
        if (analysis.intelligentQuestions?.length) {
          analysisResponse += `**❓ Key Questions to Refine Your Program:**\n\n`;
          analysis.intelligentQuestions.forEach((question: string, index: number) => {
            analysisResponse += `${index + 1}. ${question}\n`;
          });
          analysisResponse += `\n`;
        }
        
        // Implementation guidance
        if (analysis.recommendedTemplate) {
          analysisResponse += `**📖 Recommended Template:** ${analysis.recommendedTemplate}\n\n`;
        }
        
        if (analysis.implementationNotes) {
          analysisResponse += `**💡 Implementation Notes:**\n${analysis.implementationNotes}\n\n`;
        }
        
        // Fallback for old format or errors
        if (!analysis.programType && analysis.formType) {
          analysisResponse += `**Legacy Format - Suggested Program Type:** ${analysis.formType}\n\n`;
        }
        
        if (!analysis.detectedFields && analysis.fields?.length) {
          analysisResponse += `**Legacy Format - Identified Fields:** ${analysis.fields.join(', ')}\n\n`;
        }
        
        // Handle parsing errors
        if (analysis.error) {
          analysisResponse += `**⚠️ Analysis Error:** ${analysis.error}\n\n`;
          if (analysis.rawContent) {
            analysisResponse += `**Raw Analysis:**\n${analysis.rawContent}\n`;
          }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Assistant
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Specialized assistant for generating financial JSON programs (ACCADJ, BUYTYP, PRIMNT, SRCMNT)
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Messages Area */}
          <ScrollArea className="h-[600px] p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Bot className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Ask me to generate any JSON program (ACCADJ, BUYTYP, PRIMNT, SRCMNT) with all necessary fields, validations and actions.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage("Generate a complete ACCADJ program with all fields and validations")}
                    className="text-sm"
                  >
                    Generate ACCADJ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage("Generate a BUYTYP program for buy type management")}
                    className="text-sm"
                  >
                    Generate BUYTYP
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage("Generate a PRIMNT program for primary maintenance")}
                    className="text-sm"
                  >
                    Generate PRIMNT
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage("Generate a SRCMNT program for source maintenance")}
                    className="text-sm"
                  >
                    Generate SRCMNT
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage("Explain the structure of a financial JSON program")}
                    className="text-sm"
                  >
                    JSON Structure
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage("Help me create a new custom program type")}
                    className="text-sm"
                  >
                    Custom Program
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-r from-purple-500 to-purple-600'
                    } rounded-full p-2`}>
                      {message.type === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`flex-1 max-w-[80%] ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      <div
                        className={`inline-block p-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {message.isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-gray-500">Assistant is thinking...</span>
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
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
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
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-750">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="pr-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-xl"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-1 top-1 h-8 w-8 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600"
                disabled={isLoading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload DFM
              </Button>
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearChat}
                  className="flex-shrink-0"
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
            {showSuggestions && messages.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="text-xs px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800 dark:hover:to-purple-800"
                    title={suggestion.description}
                  >
                    {suggestion.text}
                  </Button>
                ))}
              </div>
            )}
            
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}