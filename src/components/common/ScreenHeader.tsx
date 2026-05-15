import React from 'react';
import { cn } from '../../lib/utils';

interface ScreenHeaderProps {
  title: string;
  subtitle: string;
  isScrolled?: boolean;
  isAbsolute?: boolean;
  className?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  isScrolled = false,
  isAbsolute = true,
  className,
}) => {
  const layoutClasses = isAbsolute
    ? 'absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex'
    : 'relative';

  return (
    <div
      className={cn(
        'flex flex-col transition-all duration-300 ease-in-out',
        layoutClasses,
        className
      )}
    >
      <h1
        className={cn(
          'font-black text-slate-800 transition-all duration-300',
          isScrolled ? 'text-lg lg:text-xl' : 'text-3xl lg:text-4xl'
        )}
      >
        {title}
      </h1>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out max-h-10 opacity-100 mt-1',
          isScrolled && isAbsolute && 'max-h-0 opacity-0 mt-0',
          isScrolled && !isAbsolute && 'max-h-6 opacity-80 mt-0'
        )}
      >
        <p className="text-slate-500 font-medium text-sm lg:text-base whitespace-nowrap">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
