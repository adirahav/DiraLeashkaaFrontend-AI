
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';
import { RollbackButton } from './RollbackButton';
import { InteractiveLabel, InteractiveLabelProps } from './InteractiveLabel';

export const EditableInput: React.FC<{
  label?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tooltip?: string;
  id?: string;
  placeholder?: string;
  className?: string;
  type?: string;
  disabled?: boolean;
  dir?: 'ltr' | 'rtl';
  isModified?: boolean;
  onRollback?: () => void;
  interactiveProps?: Omit<InteractiveLabelProps, 'label' | 'disabled'>;
  isEditable?: boolean;
  children?: React.ReactNode;
}> = ({ 
  label, value, onChange, tooltip, id, placeholder, className = '', 
  type = 'text', disabled = false, dir = 'rtl', isModified = false, 
  onRollback, interactiveProps, isEditable = true, children 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full text-right ${className} ${disabled ? 'opacity-60 grayscale-[0.2]' : ''}`}>
      {label && (
        <div className="flex items-center gap-1.5 mr-1 h-5 w-full">
          {interactiveProps && typeof label === 'string' ? (
            <InteractiveLabel 
              label={label}
              disabled={disabled}
              {...interactiveProps}
            />
          ) : (
            <div className="text-base font-bold text-slate-700">
              {label}
            </div>
          )}
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
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={!isEditable}
          dir={dir}
          className={`w-full h-[54px] px-4 border-2 border-[oklch(0.929_0.013_255.50)] rounded-xl bg-white text-black font-normal text-right focus:outline-none focus:border-blue-400 transition-all placeholder:text-blue-200 shadow-none ${disabled ? 'cursor-not-allowed' : ''} ${!isEditable ? 'bg-slate-50/50 cursor-default' : ''}`}
        />
        {isModified && onRollback && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <RollbackButton onClick={onRollback} disabled={disabled} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
