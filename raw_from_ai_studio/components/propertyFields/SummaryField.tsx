
import React from 'react';

export type SummaryFieldVariant = 'slate' | 'amber' | 'emerald' | 'blue' | 'indigo' | 'rose' | 'orange' | 'purple';

export interface SummaryFieldProps {
  label: React.ReactNode;
  value: React.ReactNode;
  variant?: SummaryFieldVariant;
  className?: string;
  labelClassName?: string;
  align?: 'center' | 'right' | 'left';
}

export const SummaryField: React.FC<SummaryFieldProps> = ({
  label,
  value,
  variant = 'slate',
  className = '',
  labelClassName = '',
  align = 'right'
}) => {
  const variants = {
    slate: {
      bg: 'bg-slate-50',
      border: 'border-slate-100',
      text: 'text-slate-700',
      label: 'text-slate-500'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-600',
      label: 'text-amber-600'
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
      label: 'text-emerald-600'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-700',
      label: 'text-blue-600'
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      text: 'text-indigo-700',
      label: 'text-indigo-600'
    },
    rose: {
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      text: 'text-rose-700',
      label: 'text-rose-600'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      text: 'text-orange-700',
      label: 'text-orange-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-700',
      label: 'text-purple-600'
    }
  };

  const v = variants[variant] || variants.slate;
  const alignmentClass = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-start' : 'justify-end';
  const labelAlignmentClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'mr-1' : 'ml-1';

  return (
    <div className={`flex flex-col gap-1.5 w-full text-right ${className}`}>
      <span className={`text-base font-bold h-5 flex items-center ${labelAlignmentClass} ${labelClassName || v.label}`}>
        {label}
      </span>
      <div className={`${v.bg} border ${v.border} rounded-xl flex items-center ${alignmentClass} h-[54px] px-4 transition-all duration-300 hover:shadow-md shadow-none relative`}>
        <span className={`text-lg font-black ${align === 'center' ? v.text : 'text-black'} ${align === 'center' ? '' : 'w-full text-right'}`}>
          {value}
        </span>
      </div>
    </div>
  );
};
