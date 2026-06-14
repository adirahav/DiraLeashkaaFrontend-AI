
import React, { useRef } from 'react';
import { Table as TableIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { useSplash } from '../../hooks/useSplash';
import { formatCurrency, formatFractionsToPercent, formatPercent } from '../../services/utils';
import { YieldForecastRow } from '../../types/property.types';

interface PropertyYieldForecastProps {
  yieldForecast: YieldForecastRow[];
  isCalculating: boolean;
  activeResultTab: string;
}

export const PropertyYieldForecast: React.FC<PropertyYieldForecastProps> = ({
  yieldForecast,
  isCalculating,
  activeResultTab,
}) => {
  const { getPhrase } = useSplash();
  const scrollRef = useRef<HTMLDivElement>(null);

if (!Array.isArray(yieldForecast) || yieldForecast.length === 0) return null;

  return (
    <section className={cn('hidden lg:block', activeResultTab === 'yield' && 'block')}>
      <div className="hidden lg:block">
        <SectionHeader
          icon={<TableIcon />}
          title={getPhrase('property_financial_forecast_expected_return_header', 'Financial Forecast - Expected Return')}
          variant="blue"
        />
      </div>

      <Card className="relative !p-0 overflow-hidden rounded-none lg:rounded-[2rem] border-0 lg:border shadow-none lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div ref={scrollRef} className="overflow-x-auto h-[calc(100dvw-40px)] lg:h-auto lg:max-h-[600px] overflow-y-auto pb-4">
          <table className="w-full lg:min-w-[700px] text-right border-separate border-spacing-0 table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="lg:sticky lg:right-0 lg:bg-slate-50 lg:z-20 lg:border-r lg:border-slate-200 p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[8%] text-center">
                  {getPhrase('amortization_schedule_month_label', 'Month')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[13%]">
                  {getPhrase('yield_forecast_property_price_label', 'Property Value')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[12%]">
                  {getPhrase('yield_forecast_rent_label', 'Rent')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[11%]">
                  {getPhrase('yield_forecast_financing_costs_label', 'Financing')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[13%]">
                  {getPhrase('yield_forecast_valuation_in_realization_label', 'Exit Value')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[10%]">
                  {getPhrase('yield_forecast_commendation_tax_label', 'Tax')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[13%]">
                  {getPhrase('yield_forecast_profit_label', 'Profit')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[10%]">
                  {getPhrase('yield_forecast_total_return_label', 'Total Return')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[10%]">
                  {getPhrase('yield_forecast_return_on_equity_label', 'ROE')}
                </th>
              </tr>
            </thead>
            <tbody>
              {yieldForecast.map((row) => (
                <tr key={row.monthNo} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="lg:sticky lg:right-0 lg:bg-white lg:border-r lg:border-slate-100 p-2 lg:p-4 text-sm lg:text-base font-bold text-slate-600 text-center">
                    {row.monthNo}
                  </td>
                  <td className="p-2 lg:p-4 text-sm lg:text-base font-medium text-slate-700">
                    {formatCurrency(row.propertyPrice)}
                  </td>
                  <td className="p-2 lg:p-4 text-sm lg:text-base font-medium text-slate-700">
                    {formatCurrency(row.rent)}
                  </td>
                  <td className="p-2 lg:p-4 text-sm lg:text-base font-medium text-slate-700">
                    {formatCurrency(row.financingCosts)}
                  </td>
                  <td className="p-2 lg:p-4 text-sm lg:text-base font-medium text-slate-700">
                    {formatCurrency(row.valuationInRealization)}
                  </td>
                  <td className="p-2 lg:p-4 text-sm lg:text-base font-medium text-slate-700">
                    {formatCurrency(row.commendationTax)}
                  </td>
                  <td className={cn('p-2 lg:p-4 text-sm lg:text-base font-black', row.profit < 0 ? 'text-red-600' : 'text-emerald-700')}>
                    {formatCurrency(row.profit)}
                  </td>
                  <td className={cn('p-2 lg:p-4 text-sm lg:text-base font-black', row.totalReturn < 0 ? 'text-red-600' : 'text-slate-800')} dir="ltr">
                    {formatFractionsToPercent(row.totalReturn)}
                  </td>
                  <td className={cn('p-2 lg:p-4 text-sm lg:text-base font-black', row.returnOnEquity < 0 ? 'text-red-600' : 'text-slate-800')} dir="ltr">
                    {formatFractionsToPercent(row.returnOnEquity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isCalculating && (
          <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-[1px]" />
        )}
      </Card>
    </section>
  );
};
