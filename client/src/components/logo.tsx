import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - FormCraft style with modern light colors */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background form container */}
          <rect
            x="10"
            y="15"
            width="60"
            height="70"
            rx="8"
            stroke="url(#gradient1)"
            strokeWidth="3"
            fill="white"
          />
          
          {/* Form lines */}
          <rect x="18" y="25" width="30" height="2.5" rx="1" fill="url(#gradient1)" />
          <rect x="18" y="32" width="25" height="2.5" rx="1" fill="url(#gradient2)" />
          <rect x="18" y="39" width="15" height="2.5" rx="1" fill="url(#gradient1)" />
          
          {/* Checkmark container */}
          <rect
            x="50"
            y="45"
            width="30"
            height="30"
            rx="6"
            stroke="url(#gradient2)"
            strokeWidth="2.5"
            fill="white"
          />
          
          {/* Checkmark */}
          <path
            d="M57 60 L62 65 L73 54"
            stroke="url(#gradient1)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* App Name */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
            FormCraft
          </span>
          <span className="text-xs text-gray-500 -mt-1">Pro</span>
        </div>
      )}
    </div>
  );
}

// Alternative minimal version for small spaces
export function LogoIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified icon version */}
        <rect
          x="15"
          y="20"
          width="50"
          height="60"
          rx="6"
          stroke="url(#simpleGradient)"
          strokeWidth="4"
          fill="white"
        />
        
        <rect x="22" y="30" width="25" height="3" rx="1" fill="url(#simpleGradient)" />
        <rect x="22" y="38" width="20" height="3" rx="1" fill="url(#simpleGradient)" />
        <rect x="22" y="46" width="12" height="3" rx="1" fill="url(#simpleGradient)" />
        
        <rect
          x="55"
          y="50"
          width="25"
          height="25"
          rx="4"
          stroke="url(#simpleGradient)"
          strokeWidth="3"
          fill="white"
        />
        
        <path
          d="M61 62 L66 67 L75 58"
          stroke="url(#simpleGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        <defs>
          <linearGradient id="simpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}