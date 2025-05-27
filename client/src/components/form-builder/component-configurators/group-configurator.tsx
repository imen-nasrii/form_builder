import React from 'react';
import { FormField } from '@/lib/form-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GroupConfiguratorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export const GroupConfigurator: React.FC<GroupConfiguratorProps> = ({ field, onUpdate }) => {
  const groupStyle = field.GroupStyle || {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Configuration Groupe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="group-label">Titre du Groupe</Label>
            <Input
              id="group-label"
              value={field.Label || field.label || ''}
              onChange={(e) => onUpdate({ Label: e.target.value, label: e.target.value })}
              placeholder="Nom du groupe"
            />
          </div>

          <div>
            <Label htmlFor="group-layout">Disposition</Label>
            <Select
              value={field.GroupLayout || 'vertical'}
              onValueChange={(value) => onUpdate({ GroupLayout: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical (un par ligne)</SelectItem>
                <SelectItem value="horizontal">Horizontal (côte à côte)</SelectItem>
                <SelectItem value="grid">Grille (2 colonnes)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="group-required"
              checked={field.Required || field.required || false}
              onCheckedChange={(checked) => onUpdate({ Required: checked, required: checked })}
            />
            <Label htmlFor="group-required">Groupe requis</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Style du Groupe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="group-border"
              checked={groupStyle.border || false}
              onCheckedChange={(checked) => onUpdate({ 
                GroupStyle: { ...groupStyle, border: checked }
              })}
            />
            <Label htmlFor="group-border">Afficher bordure</Label>
          </div>

          <div>
            <Label htmlFor="group-background">Couleur de fond</Label>
            <Select
              value={groupStyle.background || 'transparent'}
              onValueChange={(value) => onUpdate({ 
                GroupStyle: { ...groupStyle, background: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transparent">Transparent</SelectItem>
                <SelectItem value="#f8f9fa">Gris clair</SelectItem>
                <SelectItem value="#e3f2fd">Bleu clair</SelectItem>
                <SelectItem value="#f3e5f5">Violet clair</SelectItem>
                <SelectItem value="#e8f5e8">Vert clair</SelectItem>
                <SelectItem value="#fff3e0">Orange clair</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="group-padding">Espacement interne</Label>
            <Select
              value={groupStyle.padding || '16px'}
              onValueChange={(value) => onUpdate({ 
                GroupStyle: { ...groupStyle, padding: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8px">Petit (8px)</SelectItem>
                <SelectItem value="16px">Moyen (16px)</SelectItem>
                <SelectItem value="24px">Grand (24px)</SelectItem>
                <SelectItem value="32px">Très grand (32px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="group-radius">Arrondi des coins</Label>
            <Select
              value={groupStyle.borderRadius || '8px'}
              onValueChange={(value) => onUpdate({ 
                GroupStyle: { ...groupStyle, borderRadius: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0px">Aucun</SelectItem>
                <SelectItem value="4px">Petit</SelectItem>
                <SelectItem value="8px">Moyen</SelectItem>
                <SelectItem value="12px">Grand</SelectItem>
                <SelectItem value="16px">Très grand</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              <strong>Composants dans le groupe:</strong> {(field.Children || field.children || []).length}
            </p>
            <p className="text-xs">
              Glissez des composants depuis la palette vers ce groupe pour les organiser ensemble.
            </p>
            <p className="text-xs">
              Les composants dans un groupe seront traités comme une unité lors de la validation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};