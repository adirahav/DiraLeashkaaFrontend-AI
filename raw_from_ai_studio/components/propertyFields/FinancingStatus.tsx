
import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatPercent } from '../../services/utils';

export interface FinancingStatusProps {
  isCalculating: boolean;
  actualFinancingPercent: number;
  maxFinancingPercent: number;
  showSuccessStatus?: boolean;
  className?: string;
}

export const FinancingStatus: React.FC<FinancingStatusProps> = ({
  isCalculating,
  actualFinancingPercent,
  maxFinancingPercent,
  showSuccessStatus = true,
  className = "",
}) => {
  const isExceeded = actualFinancingPercent > maxFinancingPercent;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isCalculating && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 cursor-not-allowed rounded-2xl" />
      )}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 w-full">
          <div className="flex justify-end items-end mb-2">
            <div className="text-right">
              <span className={`text-2xl font-black ${isExceeded ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatPercent(actualFinancingPercent)}
              </span>
              <span className="text-slate-400 font-bold mx-2">/</span>
              <span className="text-slate-500 font-bold">{formatPercent(maxFinancingPercent)}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${isExceeded ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, (actualFinancingPercent / maxFinancingPercent) * 100)}%` }}
            />
            {/* Max Marker */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" style={{ left: '100%' }} />
          </div>
          
          <div className="flex justify-between mt-2">
            <span className="text-sm font-bold text-slate-400 uppercase">מימון בפועל</span>
            <span className="text-sm font-bold text-slate-400 uppercase">תקרה מקסימלית</span>
          </div>
        </div>

        {isExceeded ? (
          <div className="flex items-center gap-3 bg-red-50 px-4 py-3 rounded-xl border border-red-100 shrink-0 animate-pulse">
            <AlertTriangle className="text-red-500" size={20} />
            <div className="text-right">
              <p className="text-xs font-black text-red-600 leading-tight">חריגה מהמגבלה</p>
              <p className="text-sm font-bold text-red-500 opacity-80">יש להגדיל הון עצמי</p>
            </div>
          </div>
        ) : showSuccessStatus ? (
          <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 shrink-0">
            <CheckCircle2 className="text-emerald-500" size={20} />
            <div className="text-right">
              <p className="text-xs font-black text-emerald-600 leading-tight">מימון תקין</p>
              <p className="text-sm font-bold text-emerald-500 opacity-80">עומד במגבלות הבנק</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
