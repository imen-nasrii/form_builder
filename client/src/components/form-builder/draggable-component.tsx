import React from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '@/components/ui/button';

interface DraggableComponentProps {
  type: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  type,
  label,
  icon,
  onClick
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [type]);

  return (
    <div ref={drag}>
      <Button
        variant="outline"
        size="sm"
        className={`
          w-full justify-start gap-2 h-10 cursor-move transition-all
          ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
          hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700
        `}
        onClick={onClick}
      >
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </Button>
    </div>
  );
};