import React from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tooltip } from '../common/Tooltip';
import { formatInputNumber } from '../../services/formatUtils.service';

export interface NumericInputProps {
  label?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  id: string;
  maxLength?: number;
  formatWithCommas?: boolean;
  error?: string;
  labelClassName?: string;
  tooltip?: string;
  disabled?: boolean;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  id,
  maxLength,
  formatWithCommas = true,
  error,
  labelClassName = '',
  tooltip,
  disabled = false,
}) => {
  const errorId = React.useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (maxLength && rawValue.length > maxLength) return;
    onChange(formatInputNumber(rawValue, formatWithCommas));
  };

  return (
    <div className={cn('flex flex-col gap-1.5 w-full text-right', disabled && 'opacity-60 grayscale-[0.2]')}>
      {label && (
        <div className={cn('flex items-center gap-1.5 mr-1 h-5 w-full', labelClassName)}>
          <label htmlFor={id} className="text-base font-bold text-slate-700">
            {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
          </label>
          {tooltip && (
            <Tooltip text={tooltip}>
              <HelpCircle size={14} className="text-slate-400 hover:text-blue-500 transition-colors" />
            </Tooltip>
          )}
        </div>
      )}
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full h-[54px] px-4 border rounded-xl focus:outline-none transition-all text-right placeholder:text-right font-normal text-black shadow-none',
            disabled && 'bg-slate-50 cursor-not-allowed',
            error
              ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100'
              : 'border-border-subtle focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
          )}
        />
      </div>
      {error && (
        <span
          id={errorId}
          className="text-xs font-bold text-red-500 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200 mr-1"
        >
          {error}
        </span>
      )}
    </div>
  );
};
