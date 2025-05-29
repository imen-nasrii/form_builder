import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { FormField } from '@/lib/form-types';
import { Plus } from 'lucide-react';

interface MainDropZoneProps {
  onDrop: (type: string) => void;
  children?: React.ReactNode;
  hasFields: boolean;
}

export const MainDropZone: React.FC<MainDropZoneProps> = ({
  onDrop,
  children,
  hasFields
}) => {
  const handleDrop = useCallback((item: { type: string }) => {
    onDrop(item.type);
  }, [onDrop]);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'component',
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [handleDrop]);

  if (hasFields) {
    return (
      <div ref={drop} className="space-y-4 min-h-[200px] relative">
        {children}
        {isOver && canDrop && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-50 border-2 border-blue-400 border-dashed rounded-lg flex items-center justify-center pointer-events-none z-10">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
              Relâchez pour ajouter le composant
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={drop}
      className={`
        flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg transition-all
        ${isOver && canDrop ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
        hover:border-gray-400
      `}
    >
      <Plus className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-600 mb-2">Zone de création</h3>
      <p className="text-sm text-gray-500 text-center max-w-md">
        Glissez des composants depuis le panneau de gauche pour commencer à créer votre formulaire
      </p>
      {isOver && canDrop && (
        <div className="mt-4 text-blue-600 text-base font-medium animate-pulse">
          Relâchez pour ajouter le composant
        </div>
      )}
    </div>
  );
};