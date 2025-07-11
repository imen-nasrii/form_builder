import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Bot, CheckCircle, AlertCircle, Zap, FileText, MessageSquare, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ValidationResult {
  isValid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

interface AIResponse {
  message: string;
  validationResult?: ValidationResult;
  generatedJSON?: any;
}

export default function UserAIAssistant() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    validationResult?: ValidationResult;
    generatedJSON?: any;
  }>>([
    {
      role: 'assistant',
      content: "Hello! I'm Alex, your AI assistant. I can help you with:\n\n• Form validation and error checking\n• JSON format validation\n• Code suggestions and improvements\n• Program structure analysis\n• Best practices recommendations\n\nWhat would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, userId: user?.id }),
      });
      return response;
    },
    onSuccess: (response: AIResponse) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        validationResult: response.validationResult,
        generatedJSON: response.generatedJSON
      }]);
      setCurrentMessage('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response",
        variant: "destructive"
      });
    }
  });

  // JSON validation mutation
  const validateMutation = useMutation({
    mutationFn: async (json: string) => {
      const response = await apiRequest('/api/ai/validate', {
        method: 'POST',
        body: JSON.stringify({ json, userId: user?.id }),
      });
      return response;
    },
    onSuccess: (response: ValidationResult) => {
      setMessages(prev => [...prev, 
        {
          role: 'user',
          content: `Please validate this JSON:\n\`\`\`json\n${jsonInput}\n\`\`\``,
          timestamp: new Date()
        },
        {
          role: 'assistant',
          content: `JSON Validation Complete! Score: ${response.score}/100`,
          timestamp: new Date(),
          validationResult: response
        }
      ]);
      setJsonInput('');
    },
    onError: (error: any) => {
      toast({
        title: "Validation Error",
        description: error.message || "Failed to validate JSON",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    setMessages(prev => [...prev, {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    }]);
    
    chatMutation.mutate(currentMessage);
  };

  const handleValidateJSON = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter JSON to validate",
        variant: "destructive"
      });
      return;
    }
    
    validateMutation.mutate(jsonInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "Help me create a form with validation",
    "Review my JSON structure", 
    "Suggest improvements for my program",
    "Explain form field types",
    "Check for common errors"
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Assistant & Validator
            </h1>
            <p className="text-muted-foreground">
              Get intelligent help with form building and validation
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="validator" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            JSON Validator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Chat with Alex
              </CardTitle>
              <CardDescription>
                Ask questions about form building, get suggestions, or request help with your programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4 bg-gray-50">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white border shadow-sm'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                        
                        {/* Validation Results */}
                        {msg.validationResult && (
                          <div className="mt-3 p-3 bg-gray-50 rounded border">
                            <div className="flex items-center gap-2 mb-2">
                              {msg.validationResult.isValid ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="font-medium">
                                Validation Score: {msg.validationResult.score}/100
                              </span>
                            </div>
                            
                            {msg.validationResult.errors.length > 0 && (
                              <div className="mb-2">
                                <h4 className="font-medium text-red-600 mb-1">Errors:</h4>
                                <ul className="text-sm space-y-1">
                                  {msg.validationResult.errors.map((error, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-red-500">•</span>
                                      <span>{error}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {msg.validationResult.warnings.length > 0 && (
                              <div className="mb-2">
                                <h4 className="font-medium text-yellow-600 mb-1">Warnings:</h4>
                                <ul className="text-sm space-y-1">
                                  {msg.validationResult.warnings.map((warning, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-yellow-500">•</span>
                                      <span>{warning}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {msg.validationResult.suggestions.length > 0 && (
                              <div>
                                <h4 className="font-medium text-blue-600 mb-1">Suggestions:</h4>
                                <ul className="text-sm space-y-1">
                                  {msg.validationResult.suggestions.map((suggestion, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-blue-500">•</span>
                                      <span>{suggestion}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Generated JSON */}
                        {msg.generatedJSON && (
                          <div className="mt-3 p-3 bg-gray-900 rounded text-white">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4" />
                              <span className="font-medium">Generated JSON:</span>
                            </div>
                            <pre className="text-xs overflow-x-auto">
                              {JSON.stringify(msg.generatedJSON, null, 2)}
                            </pre>
                          </div>
                        )}
                        
                        <div className="text-xs opacity-70 mt-2">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {chatMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-white border shadow-sm rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          Alex is thinking...
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Quick Prompts */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentMessage(prompt);
                        setMessages(prev => [...prev, {
                          role: 'user',
                          content: prompt,
                          timestamp: new Date()
                        }]);
                        chatMutation.mutate(prompt);
                      }}
                      className="text-xs"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
                
                {/* Message Input */}
                <div className="flex gap-2">
                  <Textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Alex anything about form building..."
                    className="flex-1"
                    rows={3}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || chatMutation.isPending}
                    className="px-6"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                JSON Validator
              </CardTitle>
              <CardDescription>
                Validate your JSON structure and get intelligent suggestions for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Paste your JSON here:
                  </label>
                  <Textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Paste your JSON form definition here..."
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleValidateJSON}
                    disabled={!jsonInput.trim() || validateMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {validateMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Validate JSON
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setJsonInput('')}
                    disabled={!jsonInput.trim()}
                  >
                    Clear
                  </Button>
                </div>
                
                {/* Validation Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 border rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-medium">Structure Validation</h3>
                    <p className="text-sm text-muted-foreground">
                      Checks JSON syntax and structure
                    </p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-medium">Smart Suggestions</h3>
                    <p className="text-sm text-muted-foreground">
                      AI-powered improvement recommendations
                    </p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <h3 className="font-medium">Error Detection</h3>
                    <p className="text-sm text-muted-foreground">
                      Identifies common issues and fixes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}