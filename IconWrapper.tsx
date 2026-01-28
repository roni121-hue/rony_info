
import React from 'react';

interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${className}`}
  >
    {children}
  </div>
);
