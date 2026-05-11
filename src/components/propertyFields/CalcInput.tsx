
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export const CalcInput: React.FC<{
  label?: React.ReactNode;
  value: React.ReactNode;
  errorAsTooltip?: string;
  id?: string;
  className?: string;
  variant?: 'default' | 'danger';
}> = ({ label, value, errorAsTooltip, id, className = '', variant = 'default' }) => {
  const variantClasses = variant === 'danger' 
    ? 'border-red-300 bg-red-50 text-red-600' 
    : 'border-[oklch(0.929_0.013_255.50)] bg-slate-50 text-black';

  return (
    <div className={`flex flex-col gap-1.5 w-full text-right ${className}`}>
      {label && (
        <div className="flex items-center gap-1.5 mr-1 h-5">
          <div className="text-base font-bold text-slate-700">
            {label}
          </div>
          {errorAsTooltip && (
            <Tooltip text={errorAsTooltip}>
              <HelpCircle 
                size={14} 
                className={variant === 'danger' ? "text-red-500 animate-pulse" : "text-slate-400 hover:text-blue-500 transition-colors"} 
              />
            </Tooltip>
          )}
        </div>
      )}
      <div className="relative">
        <div
          id={id}
          className={`w-full h-[54px] px-4 border rounded-xl font-normal flex items-center shadow-none transition-colors ${variantClasses}`}
        >
          <span className="w-full text-right font-medium">{value}</span>
        </div>
      </div>
    </div>
  );
};
