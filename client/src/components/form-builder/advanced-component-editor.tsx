import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AdvancedComponentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  editingComponent: any;
  setEditingComponent: (component: any) => void;
  onSave: (component: any) => void;
  isDarkMode: boolean;
}

export default function AdvancedComponentEditor({
  isOpen,
  onClose,
  editingComponent,
  setEditingComponent,
  onSave,
  isDarkMode
}: AdvancedComponentEditorProps) {
  if (!editingComponent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-6xl max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? 'text-white' : ''}>
            Edit Component - Advanced Properties
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Properties */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : ''}`}>Basic Properties</h3>
            
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Component Type</Label>
              <Input
                value={editingComponent.type}
                disabled
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : ''}
              />
            </div>

            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Component ID</Label>
              <Input
                value={editingComponent.id || ''}
                onChange={(e) => setEditingComponent({...editingComponent, id: e.target.value})}
                placeholder="uniqueComponentId"
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
              />
            </div>
            
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Label</Label>
              <Input
                value={editingComponent.label}
                onChange={(e) => setEditingComponent({...editingComponent, label: e.target.value})}
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
              />
            </div>

            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Placeholder Text</Label>
              <Input
                value={editingComponent.placeholder || ''}
                onChange={(e) => setEditingComponent({...editingComponent, placeholder: e.target.value})}
                placeholder="Enter placeholder text..."
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
              />
            </div>

            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Default Value</Label>
              <Input
                value={editingComponent.defaultValue || ''}
                onChange={(e) => setEditingComponent({...editingComponent, defaultValue: e.target.value})}
                placeholder="Default value..."
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
              />
            </div>

            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Help Text</Label>
              <textarea
                value={editingComponent.helpText || ''}
                onChange={(e) => setEditingComponent({...editingComponent, helpText: e.target.value})}
                placeholder="Help text for users..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Appearance & Layout */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : ''}`}>Appearance & Layout</h3>
            
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Color</Label>
              <select
                value={editingComponent.color}
                onChange={(e) => setEditingComponent({...editingComponent, color: e.target.value})}
                className={`w-full px-3 py-2 border rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="orange">Orange</option>
                <option value="purple">Purple</option>
                <option value="cyan">Cyan</option>
                <option value="pink">Pink</option>
                <option value="indigo">Indigo</option>
                <option value="teal">Teal</option>
                <option value="violet">Violet</option>
                <option value="red">Red</option>
                <option value="yellow">Yellow</option>
                <option value="gray">Gray</option>
              </select>
            </div>

            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Width</Label>
              <select
                value={editingComponent.width || 'auto'}
                onChange={(e) => setEditingComponent({...editingComponent, width: e.target.value})}
                className={`w-full px-3 py-2 border rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="auto">Auto</option>
                <option value="full">Full Width</option>
                <option value="1/2">Half Width</option>
                <option value="1/3">One Third</option>
                <option value="2/3">Two Thirds</option>
                <option value="1/4">Quarter Width</option>
                <option value="3/4">Three Quarters</option>
              </select>
            </div>

            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Size</Label>
              <select
                value={editingComponent.size || 'medium'}
                onChange={(e) => setEditingComponent({...editingComponent, size: e.target.value})}
                className={`w-full px-3 py-2 border rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={editingComponent.required || false}
                  onChange={(e) => setEditingComponent({...editingComponent, required: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="required" className={isDarkMode ? 'text-gray-300' : ''}>Required</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="disabled"
                  checked={editingComponent.disabled || false}
                  onChange={(e) => setEditingComponent({...editingComponent, disabled: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="disabled" className={isDarkMode ? 'text-gray-300' : ''}>Disabled</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="readonly"
                  checked={editingComponent.readonly || false}
                  onChange={(e) => setEditingComponent({...editingComponent, readonly: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="readonly" className={isDarkMode ? 'text-gray-300' : ''}>Read Only</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hidden"
                  checked={editingComponent.hidden || false}
                  onChange={(e) => setEditingComponent({...editingComponent, hidden: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="hidden" className={isDarkMode ? 'text-gray-300' : ''}>Hidden</Label>
              </div>
            </div>
          </div>

          {/* Validation & Advanced */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : ''}`}>Validation & Advanced</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Min Length</Label>
                <Input
                  type="number"
                  value={editingComponent.minLength || ''}
                  onChange={(e) => setEditingComponent({...editingComponent, minLength: parseInt(e.target.value) || null})}
                  placeholder="0"
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>

              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Max Length</Label>
                <Input
                  type="number"
                  value={editingComponent.maxLength || ''}
                  onChange={(e) => setEditingComponent({...editingComponent, maxLength: parseInt(e.target.value) || null})}
                  placeholder="255"
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>

              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Pattern (Regex)</Label>
                <Input
                  value={editingComponent.pattern || ''}
                  onChange={(e) => setEditingComponent({...editingComponent, pattern: e.target.value})}
                  placeholder="^[a-zA-Z0-9]+$"
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>

              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Error Message</Label>
                <Input
                  value={editingComponent.errorMessage || ''}
                  onChange={(e) => setEditingComponent({...editingComponent, errorMessage: e.target.value})}
                  placeholder="This field is invalid"
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>

              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>CSS Classes</Label>
                <Input
                  value={editingComponent.cssClasses || ''}
                  onChange={(e) => setEditingComponent({...editingComponent, cssClasses: e.target.value})}
                  placeholder="custom-class another-class"
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>

              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Data Attributes</Label>
                <Input
                  value={editingComponent.dataAttributes || ''}
                  onChange={(e) => setEditingComponent({...editingComponent, dataAttributes: e.target.value})}
                  placeholder="data-test=component data-id=123"
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
              </div>
            </div>
          </div>

          {/* Options for Select/Radio/Checkbox */}
          {(editingComponent.type === 'RADIOGRP' || editingComponent.type === 'LSTLKP' || editingComponent.type === 'CHECKBOX') && (
            <div className="space-y-4 lg:col-span-3">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : ''}`}>Options Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : ''}>Option Values (one per line)</Label>
                  <textarea
                    value={editingComponent.options?.join('\n') || ''}
                    onChange={(e) => setEditingComponent({...editingComponent, options: e.target.value.split('\n').filter(o => o.trim())})}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    rows={8}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Enter each option on a new line. For value:label pairs, use "value|label" format.
                  </p>
                </div>

                <div>
                  <Label className={isDarkMode ? 'text-gray-300' : ''}>Custom CSS</Label>
                  <textarea
                    value={editingComponent.customCss || ''}
                    onChange={(e) => setEditingComponent({...editingComponent, customCss: e.target.value})}
                    placeholder="border: 2px solid #blue;&#10;padding: 10px;&#10;margin: 5px;"
                    rows={8}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Add custom CSS styles for this component.
                  </p>
                </div>
              </div>

              {editingComponent.type === 'RADIOGRP' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inline-options"
                    checked={editingComponent.inline || false}
                    onChange={(e) => setEditingComponent({...editingComponent, inline: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="inline-options" className={isDarkMode ? 'text-gray-300' : ''}>Display options inline</Label>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-6 lg:col-span-3 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              Cancel
            </Button>
            <Button
              onClick={() => onSave(editingComponent)}
              className={isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}