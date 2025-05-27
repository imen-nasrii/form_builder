import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Grid3X3, Type, Square, Calendar, List, Upload, Radio, MessageSquare, Folder, Play, FileText } from "lucide-react";

interface AddComponentDialogProps {
  onAddComponent: (componentType: string, icon: string, label: string) => void;
}

const availableIcons = [
  { name: "Grid3X3", icon: Grid3X3, label: "Grid" },
  { name: "Type", icon: Type, label: "Text" },
  { name: "Square", icon: Square, label: "Checkbox" },
  { name: "Calendar", icon: Calendar, label: "Date" },
  { name: "List", icon: List, label: "List" },
  { name: "Upload", icon: Upload, label: "Upload" },
  { name: "Radio", icon: Radio, label: "Radio" },
  { name: "MessageSquare", icon: MessageSquare, label: "Dialog" },
  { name: "Folder", icon: Folder, label: "Group" },
  { name: "Play", icon: Play, label: "Action" },
  { name: "FileText", icon: FileText, label: "Document" },
];

export default function AddComponentDialog({ onAddComponent }: AddComponentDialogProps) {
  const [open, setOpen] = useState(false);
  const [componentName, setComponentName] = useState("");
  const [componentLabel, setComponentLabel] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");

  const handleSubmit = () => {
    if (componentName && componentLabel && selectedIcon) {
      onAddComponent(componentName.toUpperCase(), selectedIcon, componentLabel);
      setComponentName("");
      setComponentLabel("");
      setSelectedIcon("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mb-4">
          <Plus className="w-4 h-4 mr-2" />
          Add New Component Type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Component Type</DialogTitle>
          <DialogDescription>
            Create a new draggable component type for your form builder.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="CUSTOMFIELD"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              id="label"
              value={componentLabel}
              onChange={(e) => setComponentLabel(e.target.value)}
              placeholder="Custom Field"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon
            </Label>
            <Select value={selectedIcon} onValueChange={setSelectedIcon}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Choose an icon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Grid3X3">📊 Grille</SelectItem>
                <SelectItem value="Type">📝 Texte</SelectItem>
                <SelectItem value="Square">☑️ Case à cocher</SelectItem>
                <SelectItem value="Calendar">📅 Date</SelectItem>
                <SelectItem value="List">📋 Liste</SelectItem>
                <SelectItem value="Upload">📤 Télécharger</SelectItem>
                <SelectItem value="Radio">🔘 Radio</SelectItem>
                <SelectItem value="MessageSquare">💬 Dialogue</SelectItem>
                <SelectItem value="Folder">📁 Groupe</SelectItem>
                <SelectItem value="Play">▶️ Action</SelectItem>
                <SelectItem value="FileText">📄 Document</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Add Component
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}