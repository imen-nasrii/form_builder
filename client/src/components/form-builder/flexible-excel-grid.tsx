import React, { useState, useCallback, useRef } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import {
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Trash2, 
  Move, 
  RotateCcw,
  Maximize2,
  Square,
  Grid3X3,
  Plus,
  Minus
} from 'lucide-react';
import { FormField } from '@/lib/form-builder-types';

interface GridPosition {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

interface PlacedComponent {
  id: string;
  field: FormField;
  position: GridPosition;
}

interface FlexibleExcelGridProps {
  formData: any;
  setFormData: (data: any) => void;
  selectedField: FormField | null;
  setSelectedField: (field: FormField | null) => void;
  isDarkMode: boolean;
}

// Enhanced Draggable Component with resize handles
function DraggableGridComponent({ 
  component, 
  isSelected, 
  onSelect, 
  onRemove, 
  onResize,
  isDarkMode 
}: { 
  component: PlacedComponent;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onResize: (newSpan: { rowSpan: number; colSpan: number }) => void;
  isDarkMode: boolean;
}) {
  const [isResizing, setIsResizing] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: component.id,
    data: {
      type: 'placed-component',
      component: component
    }
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  const getComponentIcon = (type: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'TEXT': Square,
      'TEXTAREA': Square,
      'GRIDLKP': Grid3X3,
      'BUTTON': Square,
      'DATEPKR': Square,
      'SELECT': Square,
      'RADIO': Square,
      'CHECKBOX': Square,
      'GROUP': Square,
      'HIDDEN': Square,
      'LABEL': Square,
      'GRID': Grid3X3,
      'DIALOG': Square,
      'FILEUPLOAD': Square,
    };
    return iconMap[type] || Square;
  };

  const Icon = getComponentIcon(component.field.Type);

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        gridColumn: `${component.position.col + 1} / span ${component.position.colSpan}`,
        gridRow: `${component.position.row + 1} / span ${component.position.rowSpan}`,
        zIndex: isDragging ? 1000 : isSelected ? 100 : 1,
      }}
      className={`
        relative group border-2 rounded-lg p-2 transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
        }
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        hover:border-blue-400 hover:shadow-md cursor-pointer
      `}
      onClick={onSelect}
      {...listeners}
      {...attributes}
    >
      {/* Component Content */}
      <div className="flex items-center justify-between h-full min-h-[60px]">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-md ${
            isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
          } text-white`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {component.field.Label}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {component.field.Type}
            </div>
          </div>
        </div>

        {/* Controls (visible on hover/select) */}
        <div className={`flex items-center gap-1 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } transition-opacity`}>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              // Open properties panel
            }}
            className="h-6 w-6 p-0"
          >
            <Settings className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Resize handles (visible when selected) */}
      {isSelected && (
        <>
          {/* Corner resize handle */}
          <div 
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-se-resize z-10"
            onMouseDown={handleResizeStart}
          />
          
          {/* Row span controls */}
          <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onResize({ 
                  rowSpan: Math.max(1, component.position.rowSpan - 1), 
                  colSpan: component.position.colSpan 
                });
              }}
              className="h-5 w-5 p-0"
              disabled={component.position.rowSpan <= 1}
            >
              <Minus className="w-2 h-2" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onResize({ 
                  rowSpan: component.position.rowSpan + 1, 
                  colSpan: component.position.colSpan 
                });
              }}
              className="h-5 w-5 p-0"
            >
              <Plus className="w-2 h-2" />
            </Button>
          </div>

          {/* Column span controls */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onResize({ 
                  rowSpan: component.position.rowSpan, 
                  colSpan: Math.max(1, component.position.colSpan - 1) 
                });
              }}
              className="h-5 w-5 p-0"
              disabled={component.position.colSpan <= 1}
            >
              <Minus className="w-2 h-2" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onResize({ 
                  rowSpan: component.position.rowSpan, 
                  colSpan: component.position.colSpan + 1 
                });
              }}
              className="h-5 w-5 p-0"
            >
              <Plus className="w-2 h-2" />
            </Button>
          </div>
        </>
      )}

      {/* Position indicator */}
      <div className="absolute top-1 left-1 text-xs font-mono text-gray-400 bg-white dark:bg-gray-800 px-1 rounded">
        {component.position.row + 1},{component.position.col + 1}
        {(component.position.rowSpan > 1 || component.position.colSpan > 1) && 
          ` (${component.position.rowSpan}×${component.position.colSpan})`
        }
      </div>
    </div>
  );
}

// Enhanced Drop Zone Cell
function DropZoneCell({ 
  row, 
  col, 
  isOver, 
  isDarkMode,
  isOccupied = false 
}: { 
  row: number; 
  col: number; 
  isOver: boolean; 
  isDarkMode: boolean;
  isOccupied?: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id: `cell-${row}-${col}`,
    data: {
      type: 'cell',
      row,
      col
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        relative min-h-[80px] border transition-all duration-200
        ${isOver 
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 border-2' 
          : isOccupied 
            ? 'border-transparent' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
        }
        ${!isOccupied && !isOver ? 'bg-gray-50/50 dark:bg-gray-900/50' : ''}
        ${!isOccupied ? 'cursor-crosshair' : ''}
      `}
      style={{
        gridColumn: col + 1,
        gridRow: row + 1
      }}
    >
      {!isOccupied && (
        <div className={`
          absolute inset-0 flex items-center justify-center text-xs font-mono
          ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}
          ${isOver ? 'text-blue-600 dark:text-blue-400' : ''}
        `}>
          {isOver ? 'Drop Here' : `${row + 1},${col + 1}`}
        </div>
      )}
    </div>
  );
}

export default function FlexibleExcelGrid({
  formData,
  setFormData,
  selectedField,
  setSelectedField,
  isDarkMode
}: FlexibleExcelGridProps) {
  const [gridSize, setGridSize] = useState({ rows: 20, cols: 12 });
  const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>([]);
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Check if a cell is occupied by any component
  const isCellOccupied = useCallback((row: number, col: number) => {
    return placedComponents.some(comp => 
      row >= comp.position.row && 
      row < comp.position.row + comp.position.rowSpan &&
      col >= comp.position.col && 
      col < comp.position.col + comp.position.colSpan
    );
  }, [placedComponents]);

  // Find available position for a component
  const findAvailablePosition = useCallback((rowSpan: number = 1, colSpan: number = 1): GridPosition | null => {
    for (let row = 0; row <= gridSize.rows - rowSpan; row++) {
      for (let col = 0; col <= gridSize.cols - colSpan; col++) {
        let canPlace = true;
        
        // Check if all required cells are free
        for (let r = row; r < row + rowSpan && canPlace; r++) {
          for (let c = col; c < col + colSpan && canPlace; c++) {
            if (isCellOccupied(r, c)) {
              canPlace = false;
            }
          }
        }
        
        if (canPlace) {
          return { row, col, rowSpan, colSpan };
        }
      }
    }
    return null;
  }, [gridSize, isCellOccupied]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    
    if (event.active.data.current?.type === 'placed-component') {
      setDraggedComponent(event.active.data.current.component);
    } else {
      setDraggedComponent(event.active.data.current);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setDraggedComponent(null);
      return;
    }

    // Handle dropping palette component onto cell
    if (active.data.current?.type === 'component' && over.data.current?.type === 'cell') {
      const componentType = active.data.current.componentType;
      const targetRow = over.data.current.row;
      const targetCol = over.data.current.col;

      // Check if target position is available
      if (!isCellOccupied(targetRow, targetCol)) {
        const newComponent: PlacedComponent = {
          id: `component-${Date.now()}`,
          field: {
            Id: `field-${Date.now()}`,
            Type: componentType,
            Label: `${componentType} Field`,
            DataField: `${componentType.toLowerCase()}_${Date.now()}`,
            Entity: 'DefaultEntity',
            Width: '200px',
            Spacing: 'md',
            Required: false,
            Inline: false,
            Outlined: true,
            Value: ''
          },
          position: {
            row: targetRow,
            col: targetCol,
            rowSpan: 1,
            colSpan: 1
          }
        };

        setPlacedComponents(prev => [...prev, newComponent]);
        setSelectedField(newComponent.field);

        // Add to form data
        setFormData((prev: any) => ({
          ...prev,
          fields: [...prev.fields, newComponent.field]
        }));
      }
    }

    // Handle moving existing component
    if (active.data.current?.type === 'placed-component' && over.data.current?.type === 'cell') {
      const component = active.data.current.component;
      const targetRow = over.data.current.row;
      const targetCol = over.data.current.col;

      // Check if new position is valid (considering component span)
      const canMove = () => {
        if (targetRow + component.position.rowSpan > gridSize.rows ||
            targetCol + component.position.colSpan > gridSize.cols) {
          return false;
        }

        // Check for collisions with other components
        for (let r = targetRow; r < targetRow + component.position.rowSpan; r++) {
          for (let c = targetCol; c < targetCol + component.position.colSpan; c++) {
            const occupyingComponent = placedComponents.find(comp => 
              comp.id !== component.id &&
              r >= comp.position.row && 
              r < comp.position.row + comp.position.rowSpan &&
              c >= comp.position.col && 
              c < comp.position.col + comp.position.colSpan
            );
            if (occupyingComponent) {
              return false;
            }
          }
        }
        return true;
      };

      if (canMove()) {
        setPlacedComponents(prev => 
          prev.map(comp => 
            comp.id === component.id 
              ? { ...comp, position: { ...comp.position, row: targetRow, col: targetCol } }
              : comp
          )
        );
      }
    }

    setActiveId(null);
    setDraggedComponent(null);
  };

  const handleComponentSelect = (component: PlacedComponent) => {
    setSelectedField(component.field);
  };

  const handleComponentRemove = (componentId: string) => {
    setPlacedComponents(prev => prev.filter(comp => comp.id !== componentId));
    
    // Remove from form data
    const component = placedComponents.find(comp => comp.id === componentId);
    if (component) {
      setFormData((prev: any) => ({
        ...prev,
        fields: prev.fields.filter((field: FormField) => field.Id !== component.field.Id)
      }));
      
      if (selectedField?.Id === component.field.Id) {
        setSelectedField(null);
      }
    }
  };

  const handleComponentResize = (componentId: string, newSpan: { rowSpan: number; colSpan: number }) => {
    setPlacedComponents(prev => 
      prev.map(comp => {
        if (comp.id === componentId) {
          // Check if resize is valid
          const newRowSpan = Math.min(newSpan.rowSpan, gridSize.rows - comp.position.row);
          const newColSpan = Math.min(newSpan.colSpan, gridSize.cols - comp.position.col);
          
          return {
            ...comp,
            position: {
              ...comp.position,
              rowSpan: newRowSpan,
              colSpan: newColSpan
            }
          };
        }
        return comp;
      })
    );
  };

  // Generate grid cells
  const gridCells = [];
  for (let row = 0; row < gridSize.rows; row++) {
    for (let col = 0; col < gridSize.cols; col++) {
      const isOccupied = isCellOccupied(row, col);
      gridCells.push(
        <DropZoneCell
          key={`${row}-${col}`}
          row={row}
          col={col}
          isOver={false}
          isDarkMode={isDarkMode}
          isOccupied={isOccupied}
        />
      );
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Grid Controls */}
        <div className={`sticky top-0 z-50 p-3 border-b ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
                Grid: {gridSize.rows} × {gridSize.cols}
              </Badge>
              <Badge variant="outline" className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}>
                Components: {placedComponents.length}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setGridSize(prev => ({ ...prev, rows: Math.max(10, prev.rows - 5) }))}
                disabled={gridSize.rows <= 10}
              >
                <Minus className="w-3 h-3 mr-1" />
                Rows
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setGridSize(prev => ({ ...prev, rows: prev.rows + 5 }))}
              >
                <Plus className="w-3 h-3 mr-1" />
                Rows
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setGridSize(prev => ({ ...prev, cols: Math.max(6, prev.cols - 2) }))}
                disabled={gridSize.cols <= 6}
              >
                <Minus className="w-3 h-3 mr-1" />
                Cols
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setGridSize(prev => ({ ...prev, cols: prev.cols + 2 }))}
              >
                <Plus className="w-3 h-3 mr-1" />
                Cols
              </Button>
            </div>
          </div>
        </div>

        {/* Excel-like Grid */}
        <div className="p-4">
          <div 
            className="relative grid gap-1 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${gridSize.cols}, minmax(100px, 1fr))`,
              gridTemplateRows: `repeat(${gridSize.rows}, minmax(80px, auto))`,
              maxWidth: `${gridSize.cols * 150}px`
            }}
          >
            {/* Background grid cells */}
            {gridCells}
            
            {/* Placed components */}
            {placedComponents.map((component) => (
              <DraggableGridComponent
                key={component.id}
                component={component}
                isSelected={selectedField?.Id === component.field.Id}
                onSelect={() => handleComponentSelect(component)}
                onRemove={() => handleComponentRemove(component.id)}
                onResize={(newSpan) => handleComponentResize(component.id, newSpan)}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {draggedComponent && (
          <div className={`
            p-3 rounded-lg shadow-lg border-2 border-blue-400
            ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
          `}>
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">
                {draggedComponent.field?.Label || `${draggedComponent.componentType} Component`}
              </span>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}