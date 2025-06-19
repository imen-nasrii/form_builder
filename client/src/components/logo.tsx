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
      {/* Logo Icon - FormCraft style with purple colors */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main purple rounded container */}
          <rect
            x="10"
            y="15"
            width="60"
            height="70"
            rx="12"
            fill="#8B5CF6"
            stroke="#8B5CF6"
            strokeWidth="3"
          />
          
          {/* Form lines inside */}
          <rect x="18" y="28" width="30" height="3" rx="1.5" fill="white" />
          <rect x="18" y="36" width="25" height="3" rx="1.5" fill="white" />
          <rect x="18" y="44" width="15" height="3" rx="1.5" fill="white" />
          
          {/* Checkmark container - smaller square with rounded corners */}
          <rect
            x="50"
            y="50"
            width="30"
            height="30"
            rx="6"
            fill="white"
            stroke="#8B5CF6"
            strokeWidth="2.5"
          />
          
          {/* Checkmark symbol */}
          <path
            d="M57 63 L62 68 L73 57"
            stroke="#8B5CF6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      
      {/* App Name - FormCraft */}
      {showText && (
        <span className={`font-bold text-purple-600 ${textSizeClasses[size]}`}>
          FormCraft
        </span>
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
        {/* Simplified FormCraft icon */}
        <rect
          x="15"
          y="20"
          width="50"
          height="60"
          rx="8"
          fill="#8B5CF6"
        />
        
        {/* Form lines */}
        <rect x="22" y="30" width="25" height="2" rx="1" fill="white" />
        <rect x="22" y="36" width="20" height="2" rx="1" fill="white" />
        <rect x="22" y="42" width="12" height="2" rx="1" fill="white" />
        
        {/* Checkmark container */}
        <rect
          x="55"
          y="55"
          width="25"
          height="25"
          rx="4"
          fill="white"
          stroke="#8B5CF6"
          strokeWidth="2"
        />
        
        {/* Checkmark */}
        <path
          d="M61 67 L65 71 L74 62"
          stroke="#8B5CF6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}