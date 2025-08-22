import React, { useState, useRef, useCallback } from 'react';
import { FormField } from '@/lib/form-types';
import { Move, Plus } from 'lucide-react';

interface DragDropContextProps {
  children: React.ReactNode;
  onDropComponent: (componentType: string, targetIndex?: number, targetGroupId?: string) => void;
  onReorderFields: (dragIndex: number, hoverIndex: number) => void;
  isDarkMode?: boolean;
}

interface DropZoneProps {
  onDrop: (componentType: string) => void;
  isActive: boolean;
  isDarkMode?: boolean;
  children: React.ReactNode;
  className?: string;
}

interface DraggableFieldProps {
  field: FormField;
  index: number;
  onSelect: (field: FormField) => void;
  onRemove: (fieldId: string) => void;
  isSelected: boolean;
  isDarkMode?: boolean;
  children: React.ReactNode;
}

interface InsertionIndicatorProps {
  isVisible: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  isDarkMode?: boolean;
}

// Enhanced insertion indicator component
export const InsertionIndicator: React.FC<InsertionIndicatorProps> = ({ 
  isVisible, 
  position, 
  isDarkMode = false 
}) => {
  if (!isVisible) return null;

  const getIndicatorClasses = () => {
    const baseClasses = `absolute transition-all duration-200 ${
      isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
    } shadow-lg`;
    
    switch (position) {
      case 'top':
        return `${baseClasses} top-0 left-0 right-0 h-0.5 animate-pulse`;
      case 'bottom':
        return `${baseClasses} bottom-0 left-0 right-0 h-0.5 animate-pulse`;
      case 'left':
        return `${baseClasses} left-0 top-0 bottom-0 w-0.5 animate-pulse`;
      case 'right':
        return `${baseClasses} right-0 top-0 bottom-0 w-0.5 animate-pulse`;
      default:
        return baseClasses;
    }
  };

  return <div className={getIndicatorClasses()} />;
};

// Enhanced drop zone with visual feedback
export const DropZone: React.FC<DropZoneProps> = ({ 
  onDrop, 
  isActive, 
  isDarkMode = false, 
  children, 
  className = "" 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    try {
      const componentType = e.dataTransfer.getData('application/component-type');
      if (componentType) {
        onDrop(componentType);
      }
    } catch (error) {
      console.error('Drop error:', error);
    }
  }, [onDrop]);

  const dropZoneClasses = `
    relative transition-all duration-200 ease-in-out
    ${className}
    ${isDragOver ? (isDarkMode ? 'bg-blue-900/20 border-blue-400' : 'bg-blue-50 border-blue-400') : ''}
    ${isDragOver ? 'border-2 border-dashed' : ''}
    ${isDragOver ? 'scale-[1.02]' : ''}
  `;

  return (
    <div
      className={dropZoneClasses}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10 ${
          isDarkMode ? 'bg-blue-900/10' : 'bg-blue-100/50'
        } rounded-lg`}>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            isDarkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-500 text-white'
          } shadow-lg`}>
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Drop component here</span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

// Enhanced draggable field component
export const DraggableField: React.FC<DraggableFieldProps> = ({
  field,
  index,
  onSelect,
  onRemove,
  isSelected,
  isDarkMode = false,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverPosition, setDragOverPosition] = useState<'top' | 'bottom' | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('application/field-index', index.toString());
    e.dataTransfer.setData('application/field-id', field.Id);
    e.dataTransfer.effectAllowed = 'move';
  }, [index, field.Id]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragOverPosition(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = dragRef.current?.getBoundingClientRect();
    if (rect) {
      const midY = rect.top + rect.height / 2;
      setDragOverPosition(e.clientY < midY ? 'top' : 'bottom');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverPosition(null);
    }
  }, []);

  const fieldClasses = `
    relative group transition-all duration-200 ease-in-out
    ${isDragging ? 'opacity-50 scale-95' : ''}
    ${isSelected ? (isDarkMode ? 'ring-2 ring-blue-400' : 'ring-2 ring-blue-500') : ''}
    ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}
    cursor-pointer rounded-lg
  `;

  return (
    <div
      ref={dragRef}
      className={fieldClasses}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => onSelect(field)}
    >
      <InsertionIndicator 
        isVisible={dragOverPosition === 'top'} 
        position="top" 
        isDarkMode={isDarkMode} 
      />
      
      {/* Drag handle */}
      <div className={`absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <Move className="w-4 h-4" />
      </div>
      
      {children}
      
      <InsertionIndicator 
        isVisible={dragOverPosition === 'bottom'} 
        position="bottom" 
        isDarkMode={isDarkMode} 
      />
    </div>
  );
};

// Enhanced drag and drop context
export const EnhancedDragDropContext: React.FC<DragDropContextProps> = ({
  children,
  onDropComponent,
  onReorderFields,
  isDarkMode = false
}) => {
  const [globalDragState, setGlobalDragState] = useState<{
    isDragging: boolean;
    dragType: 'component' | 'field' | null;
  }>({
    isDragging: false,
    dragType: null
  });

  const handleDragStart = useCallback((e: React.DragEvent) => {
    const componentType = e.dataTransfer.getData('application/component-type');
    const fieldIndex = e.dataTransfer.getData('application/field-index');
    
    setGlobalDragState({
      isDragging: true,
      dragType: componentType ? 'component' : fieldIndex ? 'field' : null
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setGlobalDragState({
      isDragging: false,
      dragType: null
    });
  }, []);

  return (
    <div
      className={`
        ${globalDragState.isDragging ? 'drag-active' : ''}
        ${globalDragState.dragType === 'component' ? 'dragging-component' : ''}
        ${globalDragState.dragType === 'field' ? 'dragging-field' : ''}
      `}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      

    </div>
  );
};

// Flexible positioning utilities
export const getDropPosition = (e: React.DragEvent, element: HTMLElement): {
  position: 'before' | 'after' | 'inside';
  index?: number;
} => {
  const rect = element.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  const quarterY = rect.height / 4;
  
  if (e.clientY < rect.top + quarterY) {
    return { position: 'before' };
  } else if (e.clientY > rect.bottom - quarterY) {
    return { position: 'after' };
  } else {
    return { position: 'inside' };
  }
};

export const createDropHandler = (
  onDrop: (componentType: string, position: 'before' | 'after' | 'inside', index?: number) => void
) => {
  return (e: React.DragEvent, targetElement: HTMLElement, targetIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const componentType = e.dataTransfer.getData('application/component-type');
    if (componentType) {
      const { position } = getDropPosition(e, targetElement);
      onDrop(componentType, position, targetIndex);
    }
  };
};