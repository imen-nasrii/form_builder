import { useState, useRef, useCallback } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Minus, 
  Grid3X3, 
  Move, 
  Type, 
  CheckSquare, 
  Calendar,
  Upload,
  List,
  Database,
  Square,
  Settings,
  Trash2,
  Copy
} from 'lucide-react';

interface GridCell {
  id: string;
  row: number;
  col: number;
  component?: FormComponent;
  width: number;
  height: number;
  colspan: number;
  rowspan: number;
  merged: boolean;
  mergedWith?: string[];
}

interface FormComponent {
  id: string;
  type: string;
  label: string;
  properties: Record<string, any>;
}

interface GridConfig {
  rows: number;
  cols: number;
  cells: GridCell[];
}

const COMPONENT_TYPES = [
  { type: 'TEXT', label: 'Text Input', icon: Type, color: 'bg-blue-500' },
  { type: 'CHECKBOX', label: 'Checkbox', icon: CheckSquare, color: 'bg-green-500' },
  { type: 'DATEPICKER', label: 'Date Picker', icon: Calendar, color: 'bg-purple-500' },
  { type: 'UPLOAD', label: 'File Upload', icon: Upload, color: 'bg-orange-500' },
  { type: 'SELECT', label: 'Select', icon: List, color: 'bg-indigo-500' },
  { type: 'DATAMODEL', label: 'Data Model', icon: Database, color: 'bg-red-500' },
  { type: 'CONTAINER', label: 'Container', icon: Square, color: 'bg-gray-500' }
];

function DraggableComponent({ component }: { component: typeof COMPONENT_TYPES[0] }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `component-${component.type}`,
    data: { type: 'component', componentType: component.type }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${component.color} text-white p-3 rounded-lg cursor-grab active:cursor-grabbing flex items-center space-x-2 transition-all hover:scale-105`}
    >
      <component.icon className="w-4 h-4" />
      <span className="text-sm font-medium">{component.label}</span>
    </div>
  );
}

function DroppableCell({ 
  cell, 
  onCellUpdate, 
  onCellClear, 
  isSelected,
  onCellSelect,
  isDarkMode 
}: { 
  cell: GridCell;
  onCellUpdate: (cellId: string, component: FormComponent) => void;
  onCellClear: (cellId: string) => void;
  isSelected: boolean;
  onCellSelect: (cellId: string) => void;
  isDarkMode: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: cell.id,
    data: { type: 'cell', cellId: cell.id }
  });

  const hasComponent = !!cell.component;
  const componentType = COMPONENT_TYPES.find(type => type.type === cell.component?.type);

  return (
    <div
      ref={setNodeRef}
      onClick={() => onCellSelect(cell.id)}
      className={`
        relative border-2 transition-all cursor-pointer min-h-[80px] flex items-center justify-center
        ${isOver ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''}
        ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'}
        ${hasComponent ? 'bg-white dark:bg-gray-800' : isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}
        hover:border-blue-300 dark:hover:border-blue-600
      `}
      style={{
        gridColumn: `span ${cell.colspan}`,
        gridRow: `span ${cell.rowspan}`
      }}
    >
      {hasComponent && cell.component && componentType ? (
        <div className="w-full h-full p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded ${componentType.color} text-white`}>
              <componentType.icon className="w-3 h-3" />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-900 dark:text-white">
                {cell.component.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {componentType.label}
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Open component properties dialog
              }}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Settings className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCellClear(cell.id);
              }}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-400 dark:text-gray-600 text-xs flex flex-col items-center space-y-1">
          <Grid3X3 className="w-4 h-4" />
          <span>Drop Here</span>
          <span className="text-xs">{cell.row + 1},{cell.col + 1}</span>
        </div>
      )}
      
      {/* Cell position indicator */}
      <div className="absolute top-1 left-1 text-xs text-gray-400 font-mono">
        {cell.row + 1},{cell.col + 1}
      </div>
    </div>
  );
}

export default function AdvancedGridBuilder({ 
  isDarkMode = false 
}: { 
  isDarkMode?: boolean 
}) {
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    rows: 4,
    cols: 6,
    cells: []
  });
  
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<any>(null);

  // Initialize grid cells
  const initializeCells = useCallback(() => {
    const cells: GridCell[] = [];
    for (let row = 0; row < gridConfig.rows; row++) {
      for (let col = 0; col < gridConfig.cols; col++) {
        cells.push({
          id: `cell-${row}-${col}`,
          row,
          col,
          width: 1,
          height: 1,
          colspan: 1,
          rowspan: 1,
          merged: false
        });
      }
    }
    return cells;
  }, [gridConfig.rows, gridConfig.cols]);

  // Update cells when grid dimensions change
  useState(() => {
    setGridConfig(prev => ({
      ...prev,
      cells: initializeCells()
    }));
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'component') {
      setDraggedComponent(active.data.current);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.data.current?.type === 'component' && over.data.current?.type === 'cell') {
      const componentType = active.data.current.componentType;
      const cellId = over.data.current.cellId;
      
      const newComponent: FormComponent = {
        id: `component-${Date.now()}`,
        type: componentType,
        label: COMPONENT_TYPES.find(t => t.type === componentType)?.label || 'Component',
        properties: {}
      };

      handleCellUpdate(cellId, newComponent);
    }

    setDraggedComponent(null);
  };

  const handleCellUpdate = (cellId: string, component: FormComponent) => {
    setGridConfig(prev => ({
      ...prev,
      cells: prev.cells.map(cell => 
        cell.id === cellId ? { ...cell, component } : cell
      )
    }));
  };

  const handleCellClear = (cellId: string) => {
    setGridConfig(prev => ({
      ...prev,
      cells: prev.cells.map(cell => 
        cell.id === cellId ? { ...cell, component: undefined } : cell
      )
    }));
  };

  const addRow = () => {
    setGridConfig(prev => {
      const newRows = prev.rows + 1;
      const newCells = [...prev.cells];
      
      // Add new cells for the new row
      for (let col = 0; col < prev.cols; col++) {
        newCells.push({
          id: `cell-${prev.rows}-${col}`,
          row: prev.rows,
          col,
          width: 1,
          height: 1,
          colspan: 1,
          rowspan: 1,
          merged: false
        });
      }
      
      return {
        ...prev,
        rows: newRows,
        cells: newCells
      };
    });
  };

  const addColumn = () => {
    setGridConfig(prev => {
      const newCols = prev.cols + 1;
      const newCells = [...prev.cells];
      
      // Add new cells for the new column
      for (let row = 0; row < prev.rows; row++) {
        newCells.push({
          id: `cell-${row}-${prev.cols}`,
          row,
          col: prev.cols,
          width: 1,
          height: 1,
          colspan: 1,
          rowspan: 1,
          merged: false
        });
      }
      
      return {
        ...prev,
        cols: newCols,
        cells: newCells
      };
    });
  };

  const removeRow = () => {
    if (gridConfig.rows <= 1) return;
    
    setGridConfig(prev => ({
      ...prev,
      rows: prev.rows - 1,
      cells: prev.cells.filter(cell => cell.row < prev.rows - 1)
    }));
  };

  const removeColumn = () => {
    if (gridConfig.cols <= 1) return;
    
    setGridConfig(prev => ({
      ...prev,
      cols: prev.cols - 1,
      cells: prev.cells.filter(cell => cell.col < prev.cols - 1)
    }));
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Advanced Grid Builder</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Professional drag & drop grid system with dynamic rows and columns
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Component Palette */}
            <div className="col-span-3">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Components
                  </h3>
                  <div className="space-y-2">
                    {COMPONENT_TYPES.map((component) => (
                      <DraggableComponent key={component.type} component={component} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Grid Controls */}
              <Card className={`mt-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Grid Controls
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Rows: {gridConfig.rows}</Label>
                      <div className="flex space-x-2 mt-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={removeRow}
                          disabled={gridConfig.rows <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={addRow}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Columns: {gridConfig.cols}</Label>
                      <div className="flex space-x-2 mt-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={removeColumn}
                          disabled={gridConfig.cols <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={addColumn}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {selectedCell && (
                      <div className="pt-2 border-t dark:border-gray-700">
                        <Label className="text-sm font-medium mb-2 block">Cell Controls</Label>
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              Merge →
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              Split
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Selected: {selectedCell}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Grid: {gridConfig.rows} × {gridConfig.cols}<br/>
                        Cells: {gridConfig.cells.length}<br/>
                        Components: {gridConfig.cells.filter(c => c.component).length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Grid Area */}
            <div className="col-span-9">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center">
                      <Move className="w-4 h-4 mr-2" />
                      Construction Zone
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {gridConfig.rows} rows × {gridConfig.cols} columns
                    </div>
                  </div>

                  {/* Grid Container */}
                  <div 
                    className="grid gap-1 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg min-h-[500px]"
                    style={{
                      gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
                      gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`
                    }}
                  >
                    {gridConfig.cells.map((cell) => (
                      <DroppableCell
                        key={cell.id}
                        cell={cell}
                        onCellUpdate={handleCellUpdate}
                        onCellClear={handleCellClear}
                        isSelected={selectedCell === cell.id}
                        onCellSelect={setSelectedCell}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>

                  {/* Grid Actions */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-gray-700">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Copy className="w-3 h-3 mr-1" />
                        Export Grid
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="w-3 h-3 mr-1" />
                        Import Grid
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setGridConfig(prev => ({ ...prev, cells: initializeCells() }))}>
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {draggedComponent ? (
          <div className={`${COMPONENT_TYPES.find(t => t.type === draggedComponent.componentType)?.color} text-white p-3 rounded-lg flex items-center space-x-2 opacity-80`}>
            {(() => {
              const ComponentIcon = COMPONENT_TYPES.find(t => t.type === draggedComponent.componentType)?.icon || Square;
              return <ComponentIcon className="w-4 h-4" />;
            })()}
            <span className="text-sm font-medium">
              {COMPONENT_TYPES.find(t => t.type === draggedComponent.componentType)?.label}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}