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
        description: "Menu ID is required",
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
      title: "Form created successfully!",
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
        <Button className="enterprise-gradient text-lg px-6 py-3">
          <Plus className="w-5 h-5 mr-2" />
          Form Designer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Settings className="w-7 h-7 text-blue-600" />
            Form Designer
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="menuId" className="text-base font-semibold text-gray-900">
                Menu ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="menuId"
                value={formConfig.menuId}
                onChange={(e) => handleInputChange('menuId', e.target.value.toUpperCase())}
                placeholder="ACCADJ"
                className="uppercase text-lg font-mono h-12"
                maxLength={10}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="label" className="text-base font-semibold text-gray-900">
                Label <span className="text-red-500">*</span>
              </Label>
              <Input
                id="label"
                value={formConfig.label}
                onChange={(e) => handleInputChange('label', e.target.value)}
                placeholder="Form label"
                className="text-lg h-12"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="formWidth" className="text-base font-semibold text-gray-900">
                Width
              </Label>
              <Select 
                value={formConfig.formWidth} 
                onValueChange={(value) => handleInputChange('formWidth', value)}
              >
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Select width" />
                </SelectTrigger>
                <SelectContent>
                  {widthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-lg">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="layout" className="text-base font-semibold text-gray-900">
                Mise en page
              </Label>
              <Select 
                value={formConfig.layout} 
                onValueChange={(value) => handleInputChange('layout', value)}
              >
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue placeholder="Type de mise en page" />
                </SelectTrigger>
                <SelectContent>
                  {layoutOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-lg">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-4 text-lg">Form Preview</h4>
            <div className="grid grid-cols-2 gap-4 text-base">
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-600">Menu ID:</span>
                <div className="font-bold text-blue-800">{formConfig.menuId || "Not defined"}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-600">Label:</span>
                <div className="font-bold text-blue-800">{formConfig.label || "Not defined"}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-600">Width:</span>
                <div className="font-bold text-blue-800">{formConfig.formWidth}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-600">Layout:</span>
                <div className="font-bold text-blue-800">{formConfig.layout}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="px-8 py-3">
              Annuler
            </Button>
            <Button type="submit" className="enterprise-gradient px-8 py-3">
              Créer le formulaire
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}