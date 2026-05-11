
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
}

export interface DropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  error?: string;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  buttonClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  error,
  buttonRef,
  buttonClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full text-right relative ${disabled ? 'opacity-60 grayscale-[0.2]' : ''}`} ref={containerRef}>
      {label && (
        <div className="flex items-center gap-1.5 mr-1 h-5">
          <div className="text-base font-bold text-slate-700">
            {label}
          </div>
        </div>
      )}
      
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-[54px] px-4 border-2 rounded-xl flex items-center justify-between transition-all duration-200 font-medium ${
          isOpen 
            ? 'border-blue-500 ring-4 ring-blue-50 bg-white' 
            : error 
              ? 'border-red-400 bg-red-50' 
              : 'border-[oklch(0.929_0.013_255.50)] bg-white hover:border-slate-300'
        } ${disabled ? 'cursor-not-allowed bg-slate-50' : 'cursor-pointer'} ${buttonClassName}`}
      >
        <span className={selectedOption ? 'text-slate-800' : 'text-slate-400'}>
          {selectedOption ? selectedOption.label : 'בחר...'}
        </span>
        <ChevronDown 
          size={20} 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} 
        />
      </button>

      {error && (
        <span className="text-xs font-bold text-red-500 mr-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </span>
      )}

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-0.5 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1.5 flex flex-col gap-1 max-h-[300px] overflow-y-auto custom-scrollbar">
            {options.map((option) => {
              const isActive = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`flex items-center justify-between w-full p-3 rounded-xl text-right transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-black' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="text-sm">{option.label}</span>
                  {isActive ? <Check size={18} className="text-blue-600" /> : <div className="w-[18px]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
