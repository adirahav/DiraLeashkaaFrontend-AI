import React from 'react';
import { cn } from '../../lib/utils';

export type MetricTileVariant = 'amber' | 'blue' | 'teal' | 'slate';

interface MetricTileProps {
  label: string;
  value: string | number;
  variant?: MetricTileVariant;
}

const VARIANT_MAP: Record<MetricTileVariant, { container: string; text: string }> = {
  amber: { container: 'bg-amber-50 border-amber-100', text: 'text-2xl text-amber-600' },
  blue:  { container: 'bg-blue-50 border-blue-100',   text: 'text-2xl text-blue-600'  },
  teal:  { container: 'bg-teal-50 border-teal-100',   text: 'text-2xl text-teal-600'  },
  slate: { container: 'bg-slate-50 border-slate-100', text: 'text-xl text-slate-800'  },
};

export const MetricTile: React.FC<MetricTileProps> = ({ label, value, variant = 'slate' }) => {
  const v = VARIANT_MAP[variant];
  return (
    <div className={cn("p-4 rounded-xl border", v.container)}>
      <div className="text-slate-500 text-xs font-bold mb-1">{label}</div>
      <div className={cn("font-black", v.text)}>{value}</div>
    </div>
  );
};
