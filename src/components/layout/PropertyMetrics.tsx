
import React from 'react';
import { MetricCard } from '../propertyFields';
import { formatPercent, formatCurrency } from '../../services/utils';

interface PropertyMetricsProps {
  totalYield10y: number;
  mortgageAmount: number;
  actualFinancingPercent: number;
  maxFinancingPercent: number;
  monthlyMortgageRepayment: number;
  isScrolled: boolean;
}

export const PropertyMetrics: React.FC<PropertyMetricsProps> = ({
  totalYield10y,
  mortgageAmount,
  actualFinancingPercent,
  maxFinancingPercent,
  monthlyMortgageRepayment,
  isScrolled
}) => {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 transition-all duration-300 ease-in-out flex-1 w-full`}>
      <MetricCard 
        value={totalYield10y}
        label="תשואה (10 שנים)"
        isScrolled={isScrolled}
        formatter={formatPercent}
        variant="emerald"
        compact
      />
      <MetricCard 
        value={mortgageAmount}
        label="משכנתא נדרשת"
        isScrolled={isScrolled}
        formatter={formatCurrency}
        variant="indigo"
        compact
      />
      <MetricCard 
        value={actualFinancingPercent}
        label="אחוז מימון"
        isScrolled={isScrolled}
        formatter={formatPercent}
        variant={actualFinancingPercent > maxFinancingPercent ? 'rose' : 'slate'}
        compact
      />
      <MetricCard 
        value={monthlyMortgageRepayment}
        label="החזר חודשי"
        isScrolled={isScrolled}
        formatter={formatCurrency}
        variant="amber"
        compact
      />
    </div>
  );
};
