
import React from 'react';
import { MetricCard } from '../propertyFields';
import { formatPercent, formatCurrency, formatFractionsToPercent } from '../../services/utils';
import { useSplash } from '../../hooks/useSplash';

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
  isScrolled,
}) => {
  const { getPhrase } = useSplash();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 transition-all duration-300 ease-in-out flex-1 w-full">
      <MetricCard
        value={Math.round(totalYield10y * 100) / 100}
        label={getPhrase('property_yield_label', 'Yield (10yr)')}
        isScrolled={isScrolled}
        formatter={formatFractionsToPercent}
        variant="emerald"
      />
      <MetricCard
        value={mortgageAmount}
        label={getPhrase('property_mortgage_required_label', 'Required Mortgage')}
        isScrolled={isScrolled}
        formatter={formatCurrency}
        variant="indigo"
      />
      <MetricCard
        value={actualFinancingPercent}
        label={getPhrase('property_financing_percentage_label', 'Financing %')}
        isScrolled={isScrolled}
        formatter={formatPercent}
        variant={actualFinancingPercent > maxFinancingPercent ? 'rose' : 'slate'}
      />
      <MetricCard
        value={monthlyMortgageRepayment}
        label={getPhrase('property_monthly_repayment_label', 'Monthly Repayment')}
        isScrolled={isScrolled}
        formatter={formatCurrency}
        variant="amber"
      />
    </div>
  );
};
