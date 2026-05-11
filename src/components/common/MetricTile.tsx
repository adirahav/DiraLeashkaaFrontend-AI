import React from 'react';

export type MetricTileVariant = 'blue' | 'teal' | 'slate';

interface MetricTileProps {
  label: string;
  value: string | number;
  variant?: MetricTileVariant;
}

export const MetricTile: React.FC<MetricTileProps> = ({ label, value, variant = 'slate' }) => {
  const variantClasses = {
    blue: {
      container: "bg-blue-50 border-blue-100",
      text: "text-2xl text-blue-600"
    },
    teal: {
      container: "bg-teal-50 border-teal-100",
      text: "text-2xl text-teal-600"
    },
    slate: {
      container: "bg-slate-50 border-slate-100",
      text: "text-xl text-slate-800"
    }
  };

  const { container, text } = variantClasses[variant];

  return (
    <div className={`${container} p-4 rounded-xl border`}>
      <div className="text-slate-500 text-xs font-bold mb-1">{label}</div>
      <div className={`${text} font-black`}>{value}</div>
    </div>
  );
};
