
import React from 'react';
import { cn } from '../../lib/utils';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatPercent } from '../../services/formatUtils.service';
import { useSplash } from '../../hooks/useSplash';

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
  const { getPhrase } = useSplash();
  const actualFundingLabel = getPhrase('actual_funding', 'Actual Funding');
  const maxFundingLabel = getPhrase('max_funding', 'Maximum Limit');

  const isExceeded = actualFinancingPercent > maxFinancingPercent;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isCalculating && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 cursor-not-allowed rounded-2xl" />
      )}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 w-full">
          <div className="flex justify-end items-end mb-2">
            <div className="text-right">
              <span className={cn("text-2xl font-black", isExceeded ? "text-red-600" : "text-emerald-600")}>
                {formatPercent(actualFinancingPercent)}
              </span>
              <span className="text-slate-400 font-bold mx-2">/</span>
              <span className="text-slate-500 font-bold">{formatPercent(maxFinancingPercent)}</span>
            </div>
          </div>

          <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className={cn(
                "h-full transition-all duration-1000 ease-out rounded-full",
                isExceeded ? "bg-red-500" : "bg-emerald-500"
              )}
              style={{ width: `${Math.min(100, (actualFinancingPercent / maxFinancingPercent) * 100)}%` }}
            />
            <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" style={{ left: '100%' }} />
          </div>

          <div className="flex justify-between mt-2">
            <span className="text-sm font-bold text-slate-400 uppercase">{actualFundingLabel}</span>
            <span className="text-sm font-bold text-slate-400 uppercase">{maxFundingLabel}</span>
          </div>
        </div>

        {actualFinancingPercent > 0 && isExceeded ? (
          <div className={cn(
            "flex items-center gap-3 bg-red-50 px-4 py-3 rounded-xl border border-red-100 shrink-0",
            "animate-pulse"
          )}>
            <AlertTriangle className="text-red-500" size={20} />
            <div className="text-right">
              <p className="text-xs font-black text-red-600 leading-tight">{getPhrase('financing_status_exceeding_the_limit', 'Exceeding the limit')}</p>
              <p className="text-sm font-bold text-red-500 opacity-80">{getPhrase('financing_status_equity_must_be_increased', 'Equity must be increased')}</p>
            </div>
          </div>
        ) : actualFinancingPercent > 0 && showSuccessStatus ? (
          <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 shrink-0">
            <CheckCircle2 className="text-emerald-500" size={20} />
            <div className="text-right">
              <p className="text-xs font-black text-emerald-600 leading-tight">{getPhrase('financing_status_proper_financing', 'Proper financing')}</p>
              <p className="text-sm font-bold text-emerald-500 opacity-80">{getPhrase('financing_status_meets_banks_limits', 'Meets bank limits')}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
