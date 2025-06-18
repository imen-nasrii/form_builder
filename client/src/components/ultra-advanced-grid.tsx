import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  DndContext, 
  DragOverlay, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { 
  Plus, 
  Minus, 
  Grid3X3, 
  Layers,
  Move,
  RotateCcw,
  Settings,
  Trash2,
  Copy,
  Maximize2,
  Split,
  Merge
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
  subGrid?: SubGrid;
  isEmpty: boolean;
}

interface SubGrid {
  id: string;
  rows: number;
  cols: number;
  cells: GridCell[];
  parentCellId: string;
}

interface FormComponent {
  id: string;
  type: string;
  label: string;
  icon: string;
  color: string;
  properties: Record<string, any>;
}

interface GridConfiguration {
  rows: number;
  cols: number;
  cells: GridCell[];
  subGrids: SubGrid[];
}

// Component types disponibles
const COMPONENT_TYPES: FormComponent[] = [
  { id: 'input', type: 'INPUT', label: 'Text Input', icon: '📝', color: 'bg-blue-100 text-blue-800', properties: {} },
  { id: 'textarea', type: 'TEXTAREA', label: 'Text Area', icon: '📄', color: 'bg-green-100 text-green-800', properties: {} },
  { id: 'select', type: 'SELECT', label: 'Dropdown', icon: '🔽', color: 'bg-purple-100 text-purple-800', properties: {} },
  { id: 'checkbox', type: 'CHECKBOX', label: 'Checkbox', icon: '☑️', color: 'bg-orange-100 text-orange-800', properties: {} },
  { id: 'radio', type: 'RADIO', label: 'Radio Group', icon: '🔘', color: 'bg-pink-100 text-pink-800', properties: {} },
  { id: 'button', type: 'BUTTON', label: 'Button', icon: '🔲', color: 'bg-cyan-100 text-cyan-800', properties: {} },
  { id: 'grid', type: 'SUBGRID', label: 'Sub Grid', icon: '🗂️', color: 'bg-yellow-100 text-yellow-800', properties: {} }
];

// Composant draggable pour les éléments de la palette
function DraggableComponent({ component }: { component: FormComponent }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: component.id,
    data: { type: 'component', component }
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
      className={`
        p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600
        cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:shadow-md hover:scale-105
        ${component.color} dark:bg-opacity-20
      `}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">{component.icon}</span>
        <div>
          <div className="font-medium text-sm">{component.label}</div>
          <div className="text-xs opacity-70">{component.type}</div>
        </div>
      </div>
    </div>
  );
}

// Composant droppable pour les cellules de grille
function DroppableCell({ 
  cell, 
  isSelected, 
  onSelect, 
  onCreateSubGrid, 
  isDarkMode,
  gridLevel = 0 
}: { 
  cell: GridCell;
  isSelected: boolean;
  onSelect: (cellId: string) => void;
  onCreateSubGrid: (cellId: string) => void;
  isDarkMode: boolean;
  gridLevel?: number;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: cell.id,
    data: { type: 'cell', cell }
  });

  const hasComponent = !!cell.component;
  const hasSubGrid = !!cell.subGrid;
  const componentType = COMPONENT_TYPES.find(t => t.type === cell.component?.type);

  return (
    <div
      ref={setNodeRef}
      onClick={() => onSelect(cell.id)}
      className={`
        min-h-[80px] border-2 rounded-lg p-2 cursor-pointer transition-all duration-200
        ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-200' : 'border-gray-200 dark:border-gray-700'}
        ${isOver ? 'border-green-400 bg-green-50 dark:bg-green-900/30' : ''}
        ${hasComponent || hasSubGrid ? 'bg-white dark:bg-gray-800' : isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}
        ${gridLevel > 0 ? 'border-dashed' : ''}
        hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm
      `}
      style={{
        gridColumn: `span ${cell.colspan}`,
        gridRow: `span ${cell.rowspan}`
      }}
    >
      {/* Indicateur de position */}
      <div className="text-xs text-gray-400 mb-1">
        {cell.row},{cell.col} {gridLevel > 0 && `(L${gridLevel})`}
      </div>

      {/* Contenu de la cellule */}
      {hasComponent && cell.component && componentType ? (
        <div className="w-full h-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{componentType.icon}</span>
            <div>
              <div className="font-medium text-sm">{cell.component.label}</div>
              <div className="text-xs text-gray-500">{cell.component.type}</div>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
              <Settings className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ) : hasSubGrid && cell.subGrid ? (
        <div className="w-full h-full">
          <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2">
            Sub Grid {cell.subGrid.rows}×{cell.subGrid.cols}
          </div>
          <div 
            className="grid gap-1 h-full"
            style={{
              gridTemplateColumns: `repeat(${cell.subGrid.cols}, 1fr)`,
              gridTemplateRows: `repeat(${cell.subGrid.rows}, 1fr)`
            }}
          >
            {cell.subGrid.cells.map(subCell => (
              <DroppableCell
                key={subCell.id}
                cell={subCell}
                isSelected={false}
                onSelect={onSelect}
                onCreateSubGrid={onCreateSubGrid}
                isDarkMode={isDarkMode}
                gridLevel={gridLevel + 1}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Grid3X3 className="w-6 h-6 mx-auto mb-1 opacity-50" />
            <div className="text-xs">Déposer ici</div>
            {!hasSubGrid && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateSubGrid(cell.id);
                }}
                className="text-xs mt-1 p-1 h-5"
              >
                + Sous-grille
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Indicateurs de merge */}
      {(cell.colspan > 1 || cell.rowspan > 1) && (
        <div className="absolute top-1 right-1">
          <Badge variant="secondary" className="text-xs">
            {cell.colspan}×{cell.rowspan}
          </Badge>
        </div>
      )}
    </div>
  );
}

export default function UltraAdvancedGrid() {
  const [isDarkMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  
  // Configuration de grille principale
  const [gridConfig, setGridConfig] = useState<GridConfiguration>(() => {
    const initialCells: GridCell[] = [];
    const rows = 4;
    const cols = 6;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        initialCells.push({
          id: `cell-${row}-${col}`,
          row,
          col,
          width: 1,
          height: 1,
          colspan: 1,
          rowspan: 1,
          merged: false,
          isEmpty: true
        });
      }
    }
    
    return {
      rows,
      cols,
      cells: initialCells,
      subGrids: []
    };
  });

  // Capteurs pour le drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Créer une sous-grille dans une cellule
  const createSubGrid = useCallback((cellId: string) => {
    setGridConfig(prev => {
      const cellIndex = prev.cells.findIndex(c => c.id === cellId);
      if (cellIndex === -1) return prev;

      const cell = prev.cells[cellIndex];
      const subGridId = `subgrid-${Date.now()}`;
      
      // Créer les cellules de la sous-grille
      const subGridCells: GridCell[] = [];
      const subRows = 2;
      const subCols = 3;
      
      for (let row = 0; row < subRows; row++) {
        for (let col = 0; col < subCols; col++) {
          subGridCells.push({
            id: `${subGridId}-cell-${row}-${col}`,
            row,
            col,
            width: 1,
            height: 1,
            colspan: 1,
            rowspan: 1,
            merged: false,
            isEmpty: true
          });
        }
      }

      const newSubGrid: SubGrid = {
        id: subGridId,
        rows: subRows,
        cols: subCols,
        cells: subGridCells,
        parentCellId: cellId
      };

      const updatedCells = [...prev.cells];
      updatedCells[cellIndex] = {
        ...cell,
        subGrid: newSubGrid,
        isEmpty: false
      };

      return {
        ...prev,
        cells: updatedCells,
        subGrids: [...prev.subGrids, newSubGrid]
      };
    });
  }, []);

  // Ajouter une rangée
  const addRow = useCallback(() => {
    setGridConfig(prev => {
      const newRows = prev.rows + 1;
      const newCells = [...prev.cells];
      
      for (let col = 0; col < prev.cols; col++) {
        newCells.push({
          id: `cell-${prev.rows}-${col}`,
          row: prev.rows,
          col,
          width: 1,
          height: 1,
          colspan: 1,
          rowspan: 1,
          merged: false,
          isEmpty: true
        });
      }
      
      return {
        ...prev,
        rows: newRows,
        cells: newCells
      };
    });
  }, []);

  // Supprimer une rangée
  const removeRow = useCallback(() => {
    if (gridConfig.rows <= 1) return;
    
    setGridConfig(prev => ({
      ...prev,
      rows: prev.rows - 1,
      cells: prev.cells.filter(cell => cell.row < prev.rows - 1)
    }));
  }, [gridConfig.rows]);

  // Ajouter une colonne
  const addColumn = useCallback(() => {
    setGridConfig(prev => {
      const newCols = prev.cols + 1;
      const newCells = [...prev.cells];
      
      for (let row = 0; row < prev.rows; row++) {
        newCells.push({
          id: `cell-${row}-${prev.cols}`,
          row,
          col: prev.cols,
          width: 1,
          height: 1,
          colspan: 1,
          rowspan: 1,
          merged: false,
          isEmpty: true
        });
      }
      
      return {
        ...prev,
        cols: newCols,
        cells: newCells
      };
    });
  }, []);

  // Supprimer une colonne
  const removeColumn = useCallback(() => {
    if (gridConfig.cols <= 1) return;
    
    setGridConfig(prev => ({
      ...prev,
      cols: prev.cols - 1,
      cells: prev.cells.filter(cell => cell.col < prev.cols - 1)
    }));
  }, [gridConfig.cols]);

  // Merger des cellules
  const mergeCells = useCallback(() => {
    if (!selectedCell) return;
    
    setGridConfig(prev => {
      const cellIndex = prev.cells.findIndex(c => c.id === selectedCell);
      if (cellIndex === -1) return prev;
      
      const cell = prev.cells[cellIndex];
      const updatedCells = [...prev.cells];
      
      // Augmenter colspan et rowspan
      updatedCells[cellIndex] = {
        ...cell,
        colspan: Math.min(cell.colspan + 1, prev.cols - cell.col),
        rowspan: Math.min(cell.rowspan + 1, prev.rows - cell.row)
      };
      
      return {
        ...prev,
        cells: updatedCells
      };
    });
  }, [selectedCell]);

  // Diviser une cellule
  const splitCell = useCallback(() => {
    if (!selectedCell) return;
    
    setGridConfig(prev => {
      const cellIndex = prev.cells.findIndex(c => c.id === selectedCell);
      if (cellIndex === -1) return prev;
      
      const cell = prev.cells[cellIndex];
      const updatedCells = [...prev.cells];
      
      // Réduire colspan et rowspan
      updatedCells[cellIndex] = {
        ...cell,
        colspan: Math.max(cell.colspan - 1, 1),
        rowspan: Math.max(cell.rowspan - 1, 1)
      };
      
      return {
        ...prev,
        cells: updatedCells
      };
    });
  }, [selectedCell]);

  // Vider une cellule
  const clearCell = useCallback(() => {
    if (!selectedCell) return;
    
    setGridConfig(prev => {
      const cellIndex = prev.cells.findIndex(c => c.id === selectedCell);
      if (cellIndex === -1) return prev;
      
      const updatedCells = [...prev.cells];
      updatedCells[cellIndex] = {
        ...updatedCells[cellIndex],
        component: undefined,
        subGrid: undefined,
        isEmpty: true
      };
      
      return {
        ...prev,
        cells: updatedCells
      };
    });
  }, [selectedCell]);

  // Gestion du début de drag
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDraggedComponent(active.data.current);
  };

  // Gestion de la fin de drag
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !active.data.current) {
      setDraggedComponent(null);
      return;
    }

    const draggedData = active.data.current;
    const dropTargetData = over.data.current;

    if (draggedData.type === 'component' && dropTargetData?.type === 'cell') {
      const component = draggedData.component;
      const targetCell = dropTargetData.cell;

      setGridConfig(prev => {
        const cellIndex = prev.cells.findIndex(c => c.id === targetCell.id);
        if (cellIndex === -1) return prev;

        const updatedCells = [...prev.cells];
        updatedCells[cellIndex] = {
          ...targetCell,
          component: {
            ...component,
            id: `${component.type}_${Date.now()}`
          },
          isEmpty: false
        };

        return {
          ...prev,
          cells: updatedCells
        };
      });
    }

    setDraggedComponent(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Header professionnel */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Construction Zone Ultra-Avancée
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Système de grilles professionnelles avec drag & drop et sous-grilles
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Grille {gridConfig.rows}×{gridConfig.cols}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {gridConfig.cells.filter(c => !c.isEmpty).length} Éléments
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {gridConfig.subGrids.length} Sous-grilles
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-12 gap-6">
            
            {/* Zone principale de grille - 9 colonnes */}
            <div className="col-span-9">
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Grid3X3 className="w-5 h-5" />
                      <span>Grille Principale</span>
                    </CardTitle>
                    
                    {/* Contrôles rapides de grille */}
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={removeRow} disabled={gridConfig.rows <= 1}>
                        <Minus className="w-3 h-3 mr-1" />
                        Rangée
                      </Button>
                      <Button size="sm" variant="outline" onClick={addRow}>
                        <Plus className="w-3 h-3 mr-1" />
                        Rangée
                      </Button>
                      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
                      <Button size="sm" variant="outline" onClick={removeColumn} disabled={gridConfig.cols <= 1}>
                        <Minus className="w-3 h-3 mr-1" />
                        Colonne
                      </Button>
                      <Button size="sm" variant="outline" onClick={addColumn}>
                        <Plus className="w-3 h-3 mr-1" />
                        Colonne
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div 
                    className="grid gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
                    style={{
                      gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
                      gridTemplateRows: `repeat(${gridConfig.rows}, minmax(80px, auto))`,
                      minHeight: '600px'
                    }}
                  >
                    {gridConfig.cells.map(cell => (
                      <DroppableCell
                        key={cell.id}
                        cell={cell}
                        isSelected={selectedCell === cell.id}
                        onSelect={setSelectedCell}
                        onCreateSubGrid={createSubGrid}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panneau latéral - 3 colonnes */}
            <div className="col-span-3 space-y-6">
              
              {/* Palette de composants */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Move className="w-4 h-4" />
                    <span>Palette de Composants</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {COMPONENT_TYPES.map(component => (
                    <DraggableComponent key={component.id} component={component} />
                  ))}
                </CardContent>
              </Card>

              {/* Contrôles de grille */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Settings className="w-4 h-4" />
                    <span>Contrôles Avancés</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Dimensions de grille */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Rangées: {gridConfig.rows}</Label>
                      <div className="flex space-x-2 mt-1">
                        <Button size="sm" variant="outline" onClick={removeRow} disabled={gridConfig.rows <= 1}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={addRow}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Colonnes: {gridConfig.cols}</Label>
                      <div className="flex space-x-2 mt-1">
                        <Button size="sm" variant="outline" onClick={removeColumn} disabled={gridConfig.cols <= 1}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={addColumn}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Contrôles de cellule sélectionnée */}
                  {selectedCell && (
                    <div className="pt-3 border-t dark:border-gray-700">
                      <Label className="text-sm font-medium mb-3 block">Cellule Sélectionnée</Label>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline" className="text-xs" onClick={mergeCells}>
                            <Merge className="w-3 h-3 mr-1" />
                            Fusionner
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs" onClick={splitCell}>
                            <Split className="w-3 h-3 mr-1" />
                            Diviser
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Copy className="w-3 h-3 mr-1" />
                            Copier
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs" onClick={clearCell}>
                            <Trash2 className="w-3 h-3 mr-1" />
                            Vider
                          </Button>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                          ID: {selectedCell}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Statistiques */}
                  <div className="pt-3 border-t dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <div>Grille: {gridConfig.rows} × {gridConfig.cols}</div>
                      <div>Cellules totales: {gridConfig.cells.length}</div>
                      <div>Composants: {gridConfig.cells.filter(c => c.component).length}</div>
                      <div>Sous-grilles: {gridConfig.subGrids.length}</div>
                      <div>Cellules vides: {gridConfig.cells.filter(c => c.isEmpty).length}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t dark:border-gray-700">
                    <div className="grid grid-cols-1 gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Réinitialiser
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Maximize2 className="w-3 h-3 mr-1" />
                        Exporter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Overlay de drag */}
        <DragOverlay>
          {draggedComponent?.type === 'component' && (
            <div className={`
              p-3 rounded-lg border-2 border-blue-400 shadow-lg
              ${draggedComponent.component.color} opacity-90
            `}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{draggedComponent.component.icon}</span>
                <div>
                  <div className="font-medium text-sm">{draggedComponent.component.label}</div>
                  <div className="text-xs opacity-70">{draggedComponent.component.type}</div>
                </div>
              </div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}