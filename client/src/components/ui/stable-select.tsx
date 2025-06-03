import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { ChevronDown } from 'lucide-react';

interface StableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface StableSelectItemProps {
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function StableSelect({ value, onValueChange, children, className }: StableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find the selected item's label
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props.value === value) {
        setSelectedLabel(child.props.children as string);
      }
    });
  }, [value, children]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (itemValue: string) => {
    onValueChange(itemValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className || 'w-32'}`} ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
        type="button"
      >
        {selectedLabel || value}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement<StableSelectItemProps>(child)) {
              return (
                <div
                  key={index}
                  onClick={() => handleSelect(child.props.value)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                    child.props.value === value ? 'bg-gray-50 dark:bg-gray-600' : ''
                  }`}
                >
                  {child.props.children}
                </div>
              );
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
}

export function StableSelectItem({ value, children }: StableSelectItemProps) {
  return <>{children}</>;
}