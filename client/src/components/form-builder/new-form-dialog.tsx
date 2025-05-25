import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Settings } from "lucide-react";

interface NewFormDialogProps {
  onCreateForm: (formConfig: {
    menuId: string;
    label: string;
    formWidth: string;
    layout: string;
  }) => void;
}

export default function NewFormDialog({ onCreateForm }: NewFormDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formConfig, setFormConfig] = useState({
    menuId: "",
    label: "",
    formWidth: "700px",
    layout: "PROCESS"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formConfig.menuId.trim()) {
      toast({
        title: "Validation Error",
        description: "MenuID is required",
        variant: "destructive",
      });
      return;
    }

    if (!formConfig.label.trim()) {
      toast({
        title: "Validation Error", 
        description: "Label is required",
        variant: "destructive",
      });
      return;
    }

    onCreateForm(formConfig);
    setIsOpen(false);
    
    // Reset form
    setFormConfig({
      menuId: "",
      label: "",
      formWidth: "700px",
      layout: "PROCESS"
    });

    toast({
      title: "Form Created!",
      description: `New form "${formConfig.label}" is ready for design`,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const widthOptions = [
    { value: "500px", label: "Small (500px)" },
    { value: "700px", label: "Medium (700px)" },
    { value: "900px", label: "Large (900px)" },
    { value: "1200px", label: "Extra Large (1200px)" },
    { value: "100%", label: "Full Width (100%)" }
  ];

  const layoutOptions = [
    { value: "PROCESS", label: "Process Form" },
    { value: "INQUIRY", label: "Inquiry Form" },
    { value: "MAINTENANCE", label: "Maintenance Form" },
    { value: "REPORT", label: "Report Form" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="enterprise-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Create New Form
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="menuId" className="text-sm font-medium">
                Menu ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="menuId"
                value={formConfig.menuId}
                onChange={(e) => handleInputChange('menuId', e.target.value.toUpperCase())}
                placeholder="ACCADJ"
                className="uppercase"
                maxLength={10}
                required
              />
              <p className="text-xs text-gray-500">
                Unique identifier for the form (e.g., ACCADJ, FUNDMNT)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label" className="text-sm font-medium">
                Form Label <span className="text-red-500">*</span>
              </Label>
              <Input
                id="label"
                value={formConfig.label}
                onChange={(e) => handleInputChange('label', e.target.value)}
                placeholder="Account Adjustment"
                required
              />
              <p className="text-xs text-gray-500">
                Display name for the form
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="formWidth" className="text-sm font-medium">
                Form Width
              </Label>
              <Select 
                value={formConfig.formWidth} 
                onValueChange={(value) => handleInputChange('formWidth', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select width" />
                </SelectTrigger>
                <SelectContent>
                  {widthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout" className="text-sm font-medium">
                Layout Type
              </Label>
              <Select 
                value={formConfig.layout} 
                onValueChange={(value) => handleInputChange('layout', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  {layoutOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Form Preview</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>MenuID:</strong> {formConfig.menuId || "Not set"}</div>
              <div><strong>Label:</strong> {formConfig.label || "Not set"}</div>
              <div><strong>Width:</strong> {formConfig.formWidth}</div>
              <div><strong>Layout:</strong> {formConfig.layout}</div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="enterprise-gradient">
              Create Form
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}