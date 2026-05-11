
import React from 'react';
import { RotateCcw } from 'lucide-react';
import { StringInput } from '../formFields';
import { formatNumber } from '../../services/utils';

export interface AutoFIllInputProps {
  label: string;
  value: number;
  defaultValue: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  tooltip?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export const AutoFIllInput: React.FC<AutoFIllInputProps> = ({
  label,
  value,
  defaultValue,
  onChange,
  disabled = false,
  tooltip,
  id,
  placeholder,
  required,
  error
}) => {
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/,/g, '');
    if (val === '') {
      onChange(0);
      return;
    }
    const num = parseInt(val);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const isModified = value !== defaultValue;

  return (
    <StringInput
      label={label}
      type="text"
      value={formatNumber(value, true)}
      onChange={handleNumericChange}
      dir="ltr"
      disabled={disabled}
      tooltip={tooltip}
      id={id}
      placeholder={placeholder}
      required={required}
      error={error}
    >
      {isModified && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <button 
            type="button"
            onClick={() => onChange(defaultValue)}
            disabled={disabled}
            className={`p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            title="חזור לערך המקורי"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      )}
    </StringInput>
  );
};
