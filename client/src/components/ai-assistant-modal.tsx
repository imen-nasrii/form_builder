import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bot, ExternalLink, Upload, MessageCircle, FileText, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AIAssistantModalProps {
  children: React.ReactNode;
}

export function AIAssistantModal({ children }: AIAssistantModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openStreamlitApp = () => {
    window.open('http://localhost:8501', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  const openInFullscreen = () => {
    window.open('http://localhost:8501', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            AI Form Assistant
          </DialogTitle>
          <DialogDescription>
            Intelligent DFM to JSON converter with AI-powered form generation assistance
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Features Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Upload className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-sm">File Processing</h4>
                <p className="text-xs text-gray-600">Upload DFM & Info files</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-medium text-sm">JSON Generation</h4>
                <p className="text-xs text-gray-600">Automatic form configs</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              <div>
                <h4 className="font-medium text-sm">AI Chat</h4>
                <p className="text-xs text-gray-600">Interactive discussions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Zap className="w-5 h-5 text-orange-600" />
              <div>
                <h4 className="font-medium text-sm">Smart Mapping</h4>
                <p className="text-xs text-gray-600">Delphi to modern forms</p>
              </div>
            </div>
          </div>

          {/* Component Mapping Examples */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Supported Component Mappings</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono text-gray-600">TSSICheckBox</span>
                <Badge variant="secondary" className="text-xs">CHECKBOX</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono text-gray-600">TMFWFndAliasLookup</span>
                <Badge variant="secondary" className="text-xs">GRIDLKP</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono text-gray-600">TSsiRadioGroup</span>
                <Badge variant="secondary" className="text-xs">RADIOGRP</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono text-gray-600">TGisDateEdit</span>
                <Badge variant="secondary" className="text-xs">DATEPKR</Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={openStreamlitApp} className="flex-1">
              <Bot className="w-4 h-4 mr-2" />
              Open AI Assistant
            </Button>
            <Button variant="outline" onClick={openInFullscreen}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </Button>
          </div>

          {/* Usage Instructions */}
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>How to use:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Upload your DFM file (Delphi form definition)</li>
              <li>Upload your Info file (operators and types)</li>
              <li>AI automatically generates JSON configuration</li>
              <li>Chat with AI for questions and improvements</li>
              <li>Download the generated JSON for your forms</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}