
import React from 'react';
import { AnimatedNumber } from './AnimatedNumber';

export type MetricVariant = 'emerald' | 'blue' | 'indigo' | 'slate' | 'amber' | 'rose' | 'orange' | 'purple';

export interface MetricCardProps {
  value: number;
  label: string;
  isScrolled: boolean;
  formatter: (val: number) => React.ReactNode;
  variant?: MetricVariant;
  compact?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  isScrolled,
  formatter,
  variant = 'emerald',
  compact = false
}) => {
  const roundedValue = Math.round(value);
  const variants = {
    emerald: {
      container: 'border-emerald-200 bg-emerald-50 shadow-emerald-100/50',
      value: 'text-emerald-700',
      label: 'text-emerald-500'
    },
    blue: {
      container: 'border-blue-200 bg-blue-50 shadow-blue-100/50',
      value: 'text-blue-700',
      label: 'text-blue-500'
    },
    indigo: {
      container: 'border-indigo-200 bg-indigo-50 shadow-indigo-100/50',
      value: 'text-indigo-700',
      label: 'text-indigo-500'
    },
    slate: {
      container: 'border-slate-200 bg-slate-50 shadow-slate-100/50',
      value: 'text-slate-700',
      label: 'text-slate-500'
    },
    amber: {
      container: 'border-amber-200 bg-amber-50 shadow-amber-100/50',
      value: 'text-amber-700',
      label: 'text-amber-500'
    },
    rose: {
      container: 'border-rose-200 bg-rose-50 shadow-rose-100/50',
      value: 'text-rose-700',
      label: 'text-rose-500'
    },
    orange: {
      container: 'border-orange-200 bg-orange-50 shadow-orange-100/50',
      value: 'text-orange-700',
      label: 'text-orange-500'
    },
    purple: {
      container: 'border-purple-200 bg-purple-50 shadow-purple-100/50',
      value: 'text-purple-700',
      label: 'text-purple-500'
    }
  };

  const currentVariant = variants[variant];

  if (compact) {
    return (
      <div className={`border-2 ${currentVariant.container} rounded-2xl shadow-lg flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out ${isScrolled ? 'p-1.5 lg:p-2' : 'p-4'}`}>
        <span className={`font-black uppercase tracking-wider block transition-all duration-300 ${currentVariant.label} ${isScrolled ? 'text-[10px] lg:text-xs' : 'text-sm'}`}>
          {label}
        </span>
        <span className={`font-black transition-all duration-300 ${currentVariant.value} ${isScrolled ? 'text-base lg:text-lg' : 'text-2xl lg:text-3xl'}`}>
          <AnimatedNumber value={roundedValue} formatter={formatter} />
        </span>
      </div>
    );
  }

  return (
    <div className={`border-2 ${currentVariant.container} rounded-[2rem] shadow-xl flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out min-w-[280px] lg:min-w-[450px] h-[120px] ${isScrolled ? 'scale-75 lg:scale-90' : ''}`}>
      <span className={`font-black uppercase tracking-wider block transition-all duration-300 mb-1 ${currentVariant.label} ${isScrolled ? 'text-[10px] lg:text-xs' : 'text-xs lg:text-sm'}`}>
        {label}
      </span>
      <span className={`font-normal transition-all duration-300 text-black ${isScrolled ? 'text-2xl lg:text-3xl' : 'text-4xl lg:text-5xl'}`}>
        <AnimatedNumber value={roundedValue} formatter={formatter} />
      </span>
    </div>
  );
};
