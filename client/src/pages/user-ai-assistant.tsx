import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

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

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  validationResult?: ValidationResult;
}

export default function UserAIAssistant() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm Alex, your friendly AI assistant. I'm here to help you with form validation, JSON generation, and answer any technical questions you might have. What can I help you with today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, userId: user?.id }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response;
    },
    onSuccess: (response: AIResponse) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        text: response.message,
        sender: 'ai',
        timestamp: new Date(),
        validationResult: response.validationResult
      };
      setChatMessages(prev => [...prev, aiMessage]);
      
      if (response.generatedJSON) {
        toast({
          title: "JSON Generated!",
          description: "I've created a JSON structure for you.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Connection Error",
        description: "Couldn't reach Alex right now. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(message);
    setMessage("");
  };

  const quickQuestions = [
    "Help me create a contact form",
    "Validate my JSON code",
    "What are form best practices?",
    "Generate a simple form example"
  ];

  const ValidationDisplay = ({ validation }: { validation: ValidationResult }) => (
    <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {validation.isValid ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="font-medium text-sm">Validation Results</span>
        </div>
        <Badge variant={validation.score >= 80 ? "default" : validation.score >= 60 ? "secondary" : "destructive"}>
          {validation.score}/100
        </Badge>
      </div>
      
      {validation.errors.length > 0 && (
        <div className="mb-3">
          <h5 className="text-sm font-medium text-red-600 mb-1">Errors:</h5>
          <ul className="text-xs text-red-700 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {validation.warnings.length > 0 && (
        <div className="mb-3">
          <h5 className="text-sm font-medium text-yellow-600 mb-1">Warnings:</h5>
          <ul className="text-xs text-yellow-700 space-y-1">
            {validation.warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
      
      {validation.suggestions.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-blue-600 mb-1 flex items-center gap-1">
            <Lightbulb className="h-3 w-3" />
            Suggestions:
          </h5>
          <ul className="text-xs text-blue-700 space-y-1">
            {validation.suggestions.map((suggestion, index) => (
              <li key={index}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Simple Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Alex - Your AI Assistant
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Ask questions, get help with forms, or validate your JSON
          </p>
        </div>

        {/* Chat Container */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-blue-600" />
              Chat with Alex
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}>
                    {msg.sender === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  {/* Message */}
                  <div className={`flex-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border'
                    }`}>
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      {msg.validationResult && (
                        <ValidationDisplay validation={msg.validationResult} />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Questions */}
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Quick questions:</span>
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to Alex..."
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim() || chatMutation.isPending}
                size="lg"
                className="px-4"
              >
                {chatMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}