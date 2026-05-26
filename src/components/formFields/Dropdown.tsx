import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSplash } from '../../hooks/useSplash';

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
  searchable?: boolean;
  pinnedOptions?: Option[];
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  error,
  buttonRef,
  buttonClassName = '',
  searchable = false,
  pinnedOptions = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value) ?? pinnedOptions.find(opt => opt.value === value);
  const { getPhrase } = useSplash();
  const placeholder = getPhrase('dropdown_choose', 'Choose...');

  const filteredOptions = searchable && searchQuery.trim()
    ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  const highlightMatch = (label: string) => {
    const query = searchQuery.trim();
    if (!query) return <>{label}</>;
    const idx = label.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{label}</>;
    return (
      <>
        {label.slice(0, idx)}
        <strong>{label.slice(idx, idx + query.length)}</strong>
        {label.slice(idx + query.length)}
      </>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      if (searchable) {
        setTimeout(() => searchRef.current?.focus(), 50);
      }
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, searchable]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div
      ref={containerRef}
      className={cn('flex flex-col gap-1.5 w-full text-right relative', disabled && 'opacity-60 grayscale-[0.2]')}
    >
      {label && (
        <div className="flex items-center gap-1.5 mr-1 h-5">
          <div className="text-base font-bold text-slate-700">{label}</div>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full h-[54px] px-4 border-2 rounded-xl flex items-center justify-between transition-all duration-200 font-medium',
          isOpen
            ? 'border-blue-500 ring-4 ring-blue-50 bg-white'
            : error
              ? 'border-red-400 bg-red-50'
              : 'border-border-subtle bg-white hover:border-slate-300',
          disabled ? 'cursor-not-allowed bg-slate-50' : 'cursor-pointer',
          buttonClassName,
        )}
      >
        <span className={cn(selectedOption ? 'text-slate-800' : 'text-slate-400')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={20}
          className={cn('text-slate-400 transition-transform duration-300', isOpen && 'rotate-180 text-blue-500')}
        />
      </button>

      {error?.trim() && (
        <span className="text-xs font-bold text-red-500 mr-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </span>
      )}

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-0.5 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {searchable && (
            <div className="p-2 border-b border-slate-100">
              <div className="relative flex items-center">
                <Search size={15} className="absolute right-3 text-slate-400 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="חיפוש..."
                  dir="rtl"
                  className="w-full h-9 pr-9 pl-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-right placeholder:text-slate-400"
                />
              </div>
            </div>
          )}
          <div className="p-1.5 flex flex-col gap-1 max-h-[260px] overflow-y-auto custom-scrollbar">
            {filteredOptions.length === 0 && pinnedOptions.length === 0 ? (
              <div className="p-3 text-sm text-slate-400 text-center">לא נמצאו תוצאות</div>
            ) : (
              <>
                {filteredOptions.map((option) => {
                  const isActive = value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        'flex items-center justify-between w-full p-3 rounded-xl text-right transition-all duration-200',
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-black'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                      )}
                    >
                      <span className="text-sm">{highlightMatch(option.label)}</span>
                      {isActive ? <Check size={18} className="text-blue-600" /> : <div className="w-[18px]" />}
                    </button>
                  );
                })}
                {pinnedOptions.length > 0 && (
                  <>
                    {filteredOptions.length > 0 && <div className="mx-2 border-t border-slate-100" />}
                    {pinnedOptions.map((option) => {
                      const isActive = value === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleSelect(option.value)}
                          className={cn(
                            'flex items-center justify-between w-full p-3 rounded-xl text-right transition-all duration-200',
                            isActive
                              ? 'bg-blue-50 text-blue-600 font-black'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                          )}
                        >
                          <span className="text-sm">{option.label}</span>
                          {isActive ? <Check size={18} className="text-blue-600" /> : <div className="w-[18px]" />}
                        </button>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
