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
      {/* Logo Icon - FormBuilder style with blue and orange */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main blue rounded square background */}
          <rect
            x="15"
            y="15"
            width="70"
            height="70"
            rx="16"
            fill="url(#blueGradient)"
          />
          
          {/* White "D" shape in the center */}
          <path
            d="M35 35 L35 65 L55 65 C62 65 67 60 67 52.5 L67 47.5 C67 40 62 35 55 35 L35 35 Z M42 42 L55 42 C58 42 60 44 60 47.5 L60 52.5 C60 56 58 58 55 58 L42 58 L42 42 Z"
            fill="white"
          />
          
          {/* Orange circle accent */}
          <circle
            cx="75"
            cy="25"
            r="8"
            fill="#FF6B35"
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="100%" stopColor="#1976D2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* App Name */}
      {showText && (
        <span className={`font-semibold text-blue-600 ${textSizeClasses[size]}`}>
          FormBuilder
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
        {/* Simplified FormBuilder icon */}
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          rx="12"
          fill="url(#iconGradient)"
        />
        
        {/* White "D" shape */}
        <path
          d="M35 35 L35 65 L50 65 C57 65 62 60 62 52.5 L62 47.5 C62 40 57 35 50 35 L35 35 Z M40 40 L50 40 C53 40 55 42 55 47.5 L55 52.5 C55 58 53 60 50 60 L40 60 L40 40 Z"
          fill="white"
        />
        
        {/* Orange accent */}
        <circle
          cx="70"
          cy="30"
          r="6"
          fill="#FF6B35"
        />
        
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="100%" stopColor="#1976D2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}