import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, ArrowLeft, Play, CheckCircle, Circle,
  MousePointer2, Hand, Eye, Settings2, Code2,
  Layers, Palette, Zap, Target, BookOpen
} from 'lucide-react';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  content: React.ReactNode;
  highlightElement?: string;
  action?: string;
}

interface InteractiveGuideProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  onHighlightElement?: (element: string) => void;
}

export default function InteractiveGuide({ 
  isOpen, 
  onClose, 
  isDarkMode = false,
  onHighlightElement 
}: InteractiveGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const guideSteps: GuideStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to FormBuilder',
      description: 'Learn how to create professional forms with drag & drop',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Welcome to FormBuilder Pro!</h3>
            <p className="text-gray-600 mb-4">
              This interactive guide will teach you how to create powerful forms using our visual builder.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <MousePointer2 className="w-6 h-6 text-blue-500 mb-2" />
              <h4 className="font-medium">Drag & Drop</h4>
              <p className="text-sm text-gray-600">Easy component placement</p>
            </div>
            <div className="p-3 border rounded-lg">
              <Settings2 className="w-6 h-6 text-green-500 mb-2" />
              <h4 className="font-medium">Configure</h4>
              <p className="text-sm text-gray-600">Customize every property</p>
            </div>
            <div className="p-3 border rounded-lg">
              <Code2 className="w-6 h-6 text-purple-500 mb-2" />
              <h4 className="font-medium">Export</h4>
              <p className="text-sm text-gray-600">Generate production code</p>
            </div>
            <div className="p-3 border rounded-lg">
              <Zap className="w-6 h-6 text-yellow-500 mb-2" />
              <h4 className="font-medium">Live Preview</h4>
              <p className="text-sm text-gray-600">See results instantly</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'palette',
      title: 'Component Palette',
      description: 'Discover available form components',
      icon: Palette,
      highlightElement: '.component-palette',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-8 h-8 text-purple-500" />
            <h3 className="text-lg font-semibold">Component Palette</h3>
          </div>
          <p className="text-gray-600 mb-4">
            The component palette on the left contains all available form elements. Each component serves a specific purpose:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 border rounded">
              <Badge className="bg-blue-100 text-blue-700 min-w-16">TEXT</Badge>
              <span className="text-sm">Single-line text input for names, emails, etc.</span>
            </div>
            <div className="flex items-center gap-3 p-2 border rounded">
              <Badge className="bg-green-100 text-green-700 min-w-16">SELECT</Badge>
              <span className="text-sm">Dropdown selection with multiple options</span>
            </div>
            <div className="flex items-center gap-3 p-2 border rounded">
              <Badge className="bg-purple-100 text-purple-700 min-w-16">GRIDLKP</Badge>
              <span className="text-sm">Data grid with lookup and filtering capabilities</span>
            </div>
            <div className="flex items-center gap-3 p-2 border rounded">
              <Badge className="bg-orange-100 text-orange-700 min-w-16">DATEPKR</Badge>
              <span className="text-sm">Date picker with calendar interface</span>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <Eye className="w-4 h-4 inline mr-1" />
              <strong>Tip:</strong> Use the search box to quickly find specific components!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'drag-drop',
      title: 'Drag & Drop',
      description: 'Learn how to add components to your form',
      icon: Hand,
      highlightElement: '.construction-zone',
      action: 'Try dragging a TEXT component to the construction zone',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Hand className="w-8 h-8 text-green-500" />
            <h3 className="text-lg font-semibold">Drag & Drop Components</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
              <h4 className="font-medium mb-2">How to Add Components:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Find the component you want in the palette</li>
                <li>Click and hold on the component</li>
                <li>Drag it to the construction zone (center area)</li>
                <li>Release to drop it in position</li>
              </ol>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 border rounded">
                <MousePointer2 className="w-6 h-6 mx-auto mb-1 text-gray-500" />
                <span className="text-xs">Click & Hold</span>
              </div>
              <div className="p-3 border rounded">
                <ArrowRight className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                <span className="text-xs">Drag</span>
              </div>
              <div className="p-3 border rounded">
                <Target className="w-6 h-6 mx-auto mb-1 text-green-500" />
                <span className="text-xs">Drop</span>
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-700">
                <Zap className="w-4 h-4 inline mr-1" />
                <strong>Try it now:</strong> Drag a TEXT component from the palette to the construction zone!
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'properties',
      title: 'Component Properties',
      description: 'Configure component settings and behavior',
      icon: Settings2,
      highlightElement: '.properties-panel',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Settings2 className="w-8 h-8 text-orange-500" />
            <h3 className="text-lg font-semibold">Properties Panel</h3>
          </div>
          <p className="text-gray-600 mb-4">
            After adding a component, click on it to see its properties in the right panel.
          </p>
          <div className="space-y-3">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-2 font-medium text-sm">Common Properties</div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">DataField</span>
                  <span className="text-xs text-gray-500">Database field name</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Label</span>
                  <span className="text-xs text-gray-500">Display label</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Width</span>
                  <span className="text-xs text-gray-500">Component width</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Required</span>
                  <span className="text-xs text-gray-500">Validation rule</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-700">
              <Target className="w-4 h-4 inline mr-1" />
              <strong>Next:</strong> Click on any component to see its specific properties!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'external-components',
      title: 'External Components',
      description: 'Create and manage custom components',
      icon: Layers,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-8 h-8 text-purple-500" />
            <h3 className="text-lg font-semibold">External Components</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Create your own custom components with the External Components feature.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Visual Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs space-y-1">
                  <li>• Choose component icon</li>
                  <li>• Set default properties</li>
                  <li>• Add custom properties</li>
                  <li>• Auto-generate JSON</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">JSON Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs space-y-1">
                  <li>• Import JSON definitions</li>
                  <li>• Export component library</li>
                  <li>• Validate configurations</li>
                  <li>• Share with team</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-700">
              <Layers className="w-4 h-4 inline mr-1" />
              <strong>Try it:</strong> Click "External Components" in the navbar to create your first custom component!
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentGuideStep = guideSteps[currentStep];
  const progress = ((currentStep + 1) / guideSteps.length) * 100;

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCompletedSteps(prev => [...prev, currentGuideStep.id]);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const jumpToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  useEffect(() => {
    if (currentGuideStep.highlightElement && onHighlightElement) {
      onHighlightElement(currentGuideStep.highlightElement);
    }
  }, [currentStep, currentGuideStep.highlightElement, onHighlightElement]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
            <BookOpen className="w-5 h-5" />
            Interactive FormBuilder Guide
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Step {currentStep + 1} of {guideSteps.length}
              </span>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Step Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {guideSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = index === currentStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => jumpToStep(index)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isCurrent 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : isCompleted
                        ? 'bg-green-100 text-green-700'
                        : isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : isCurrent ? (
                    <Play className="w-3 h-3" />
                  ) : (
                    <Circle className="w-3 h-3" />
                  )}
                  <Icon className="w-3 h-3" />
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Current Step Content */}
          <Card className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <currentGuideStep.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className={isDarkMode ? 'text-white' : ''}>{currentGuideStep.title}</CardTitle>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {currentGuideStep.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {currentGuideStep.content}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close Guide
              </Button>
              
              {currentStep < guideSteps.length - 1 ? (
                <Button
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setCompletedSteps(prev => [...prev, currentGuideStep.id]);
                    onClose();
                  }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Guide
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}