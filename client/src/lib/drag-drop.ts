import { useDrag, useDrop, DragSourceMonitor, DropTargetMonitor } from 'react-dnd';
import type { FormField, DragItem, DropResult } from './form-types';
import { ComponentTypes } from '@shared/schema';

// Constants for drag and drop types
export const DND_TYPES = {
  COMPONENT: 'component',
  FIELD: 'field'
} as const;

// Hook for draggable components from palette
export const useDraggableComponent = (componentType: keyof typeof ComponentTypes) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DND_TYPES.COMPONENT,
    item: { type: componentType },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return { isDragging, drag };
};

// Hook for draggable form fields (for reordering)
export const useDraggableField = (field: FormField, index: number) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DND_TYPES.FIELD,
    item: { field, index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return { isDragging, drag };
};

// Hook for drop zones that accept components
export const useDropZone = (onDrop: (item: DragItem) => void) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [DND_TYPES.COMPONENT],
    drop: (item: DragItem) => {
      onDrop(item);
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return { isOver, canDrop, drop };
};

// Hook for drop zones that accept field reordering
export const useFieldDropZone = (
  onMoveField: (dragIndex: number, hoverIndex: number) => void,
  index: number
) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: DND_TYPES.FIELD,
    hover: (item: { field: FormField; index: number }) => {
      if (item.index !== index) {
        onMoveField(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return { isOver, drop };
};

// Utility function to create default field based on component type
export const createDefaultField = (componentType: keyof typeof ComponentTypes): FormField => {
  const baseField: FormField = {
    Id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    label: `New ${componentType}`,
    type: componentType,
    Inline: true,
    Width: "32",
    required: false
  };

  // Add component-specific default properties
  switch (componentType) {
    case 'GRIDLKP':
      return {
        ...baseField,
        KeyColumn: "",
        ItemInfo: {
          MainProperty: "",
          DescProperty: "",
          ShowDescription: true
        },
        LoadDataInfo: {
          DataModel: "",
          ColumnsDefinition: []
        }
      };

    case 'LSTLKP':
      return {
        ...baseField,
        KeyColumn: "",
        ItemInfo: {
          MainProperty: "",
          DescProperty: "",
          ShowDescription: true
        },
        LoadDataInfo: {
          DataModel: "",
          ColumnsDefinition: []
        }
      };

    case 'SELECT':
      return {
        ...baseField,
        OptionValues: {
          "option1": "Option 1",
          "option2": "Option 2"
        },
        Outlined: true
      };

    case 'RADIOGRP':
      return {
        ...baseField,
        OptionValues: {
          "option1": "Option 1",
          "option2": "Option 2"
        }
      };

    case 'CHECKBOX':
      return {
        ...baseField,
        CheckboxValue: true,
        Value: false
      };

    case 'DATEPICKER':
    case 'DATEPKR':
      return {
        ...baseField,
        Spacing: "30"
      };

    case 'GROUP':
      return {
        ...baseField,
        isGroup: true,
        ChildFields: [],
        Spacing: "0"
      };

    case 'ACTION':
      return {
        ...baseField,
        type: 'ACTION'
      };

    case 'VALIDATION':
      return {
        ...baseField,
        type: 'VALIDATION'
      };

    default:
      return baseField;
  }
};

// Utility function to validate drop operation
export const canDropComponent = (
  componentType: keyof typeof ComponentTypes,
  targetContainer?: 'form' | 'group'
): boolean => {
  // Basic validation - can be extended with more complex rules
  if (targetContainer === 'group') {
    // Groups can contain most field types but not other groups
    return componentType !== 'GROUP';
  }
  
  // Form can contain any component type
  return true;
};

// Utility function to get drop feedback styling
export const getDropFeedbackClass = (isOver: boolean, canDrop: boolean): string => {
  if (isOver && canDrop) {
    return 'drop-zone-active border-primary-400 bg-primary-50';
  }
  if (isOver && !canDrop) {
    return 'border-red-400 bg-red-50';
  }
  if (canDrop) {
    return 'border-slate-300 hover:border-primary-300';
  }
  return 'border-slate-300';
};

// Utility function to handle field reordering
export const reorderFields = (
  fields: FormField[],
  fromIndex: number,
  toIndex: number
): FormField[] => {
  const result = Array.from(fields);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
};

// Utility function to find field by ID
export const findFieldById = (fields: FormField[], fieldId: string): FormField | null => {
  for (const field of fields) {
    if (field.Id === fieldId) {
      return field;
    }
    // Recursively search in child fields for groups
    if (field.ChildFields) {
      const childField = findFieldById(field.ChildFields, fieldId);
      if (childField) {
        return childField;
      }
    }
  }
  return null;
};

// Utility function to update field in nested structure
export const updateFieldInStructure = (
  fields: FormField[],
  fieldId: string,
  updates: Partial<FormField>
): FormField[] => {
  return fields.map(field => {
    if (field.Id === fieldId) {
      return { ...field, ...updates };
    }
    
    if (field.ChildFields) {
      return {
        ...field,
        ChildFields: updateFieldInStructure(field.ChildFields, fieldId, updates)
      };
    }
    
    return field;
  });
};

// Utility function to remove field from nested structure
export const removeFieldFromStructure = (
  fields: FormField[],
  fieldId: string
): FormField[] => {
  return fields.filter(field => {
    if (field.Id === fieldId) {
      return false;
    }
    
    if (field.ChildFields) {
      field.ChildFields = removeFieldFromStructure(field.ChildFields, fieldId);
    }
    
    return true;
  });
};

// Export drag and drop context
export interface DragDropContextType {
  isDragging: boolean;
  draggedItem: DragItem | null;
  setDraggedItem: (item: DragItem | null) => void;
}

// Custom hook for drag and drop context
export const useDragDropContext = () => {
  // This could be implemented with React Context if needed
  // For now, returning empty implementation
  return {
    isDragging: false,
    draggedItem: null,
    setDraggedItem: () => {}
  };
};
