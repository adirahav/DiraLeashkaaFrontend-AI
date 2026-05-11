import React from 'react';

interface ScreenHeaderProps {
  title: string;
  subtitle: string;
  isScrolled?: boolean;
  className?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ 
  title, 
  subtitle, 
  isScrolled=false,
  className = "absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col transition-all duration-300 ease-in-out"
}) => {
  const isAbsolute = className.includes('absolute');

  return (
    <div className={className}>
      <h1 className={`font-black text-slate-800 transition-all duration-300 ${isAbsolute ? (isScrolled ? 'text-xl' : 'text-3xl lg:text-4xl') : (isScrolled ? 'text-lg lg:text-xl' : 'text-3xl lg:text-4xl')}`}>
        {title}
      </h1>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAbsolute ? (isScrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100 mt-1') : (isScrolled ? 'max-h-6 opacity-80' : 'max-h-10 opacity-100 mt-1')}`}>
        <p className="text-slate-500 font-medium text-sm lg:text-base whitespace-nowrap">{subtitle}</p>
      </div>
    </div>
  );
};
