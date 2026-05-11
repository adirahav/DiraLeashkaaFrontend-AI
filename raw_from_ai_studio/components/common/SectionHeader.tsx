import React from 'react';

export type SectionHeaderVariant = 'blue' | 'emerald' | 'indigo' | 'orange' | 'purple' | 'slate' | 'amber' | 'rose' | 'teal';

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  variant?: SectionHeaderVariant;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, variant = 'blue', className = '' }) => {
  const variants = {
    blue: "bg-blue-600 shadow-blue-200",
    emerald: "bg-emerald-600 shadow-emerald-200",
    indigo: "bg-indigo-600 shadow-indigo-200",
    orange: "bg-orange-500 shadow-orange-200",
    purple: "bg-purple-600 shadow-purple-200",
    slate: "bg-slate-800 shadow-slate-200",
    amber: "bg-amber-500 shadow-amber-200",
    rose: "bg-rose-500 shadow-rose-200",
    teal: "bg-teal-600 shadow-teal-200"
  };

  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <div className={`w-10 h-10 ${variants[variant]} text-white rounded-xl flex items-center justify-center shadow-lg`}>
        {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      </div>
      <h2 className="text-2xl font-black text-slate-800">{title}</h2>
    </div>
  );
};
