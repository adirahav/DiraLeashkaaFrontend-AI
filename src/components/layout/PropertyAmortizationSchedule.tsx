
import React, { useRef, useEffect } from 'react';
import { List } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { useSplash } from '../../hooks/useSplash';
import { formatCompact, formatPercent } from '../../services/utils';
import { AmortizationRow } from '../../types/property.types';

interface PropertyAmortizationScheduleProps {
  amortizationSchedule: AmortizationRow[];
  isCalculating: boolean;
  activeResultTab: string;
}

export const PropertyAmortizationSchedule: React.FC<PropertyAmortizationScheduleProps> = ({
  amortizationSchedule,
  isCalculating,
  activeResultTab,
}) => {
  const { getPhrase } = useSplash();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth >= 1024) return;
    if (activeResultTab !== 'amortization') return;
    const el = scrollRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(raf);
  }, [activeResultTab, amortizationSchedule]);

  if (!Array.isArray(amortizationSchedule) || amortizationSchedule.length === 0) return null;

  return (
    <section className={cn('hidden lg:block', activeResultTab === 'amortization' && 'block')}>
      <div className="hidden lg:block">
        <SectionHeader
          icon={<List />}
          title={getPhrase('property_disposal_schedule_header', 'Amortization Schedule')}
          variant="indigo"
        />
      </div>

      <Card className="relative !p-0 overflow-hidden rounded-none lg:rounded-[2rem] border-0 lg:border shadow-none lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div ref={scrollRef} className="overflow-x-auto max-h-[600px] overflow-y-auto pr-0 lg:pr-0">
          <table className="w-full lg:min-w-[600px] text-right border-separate border-spacing-0 table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="lg:sticky lg:right-0 lg:bg-slate-50 lg:z-20 lg:border-r lg:border-slate-200 p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[8%] text-center">
                  {getPhrase('amortization_schedule_month_label', 'Mo.')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[18%]">
                  {getPhrase('amortization_schedule_bop_fund_label', 'Opening Balance')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[10%]">
                  {getPhrase('amortization_schedule_interest_label', 'Interest')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[14%]">
                  {getPhrase('amortization_schedule_monthly_repayments_label', 'Payment')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[14%]">
                  {getPhrase('amortization_schedule_fund_refund_label', 'Principal')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[14%]">
                  {getPhrase('amortization_schedule_interest_repayment_label', 'Interest Paid')}
                </th>
                <th className="p-2 lg:p-4 text-xs lg:text-sm font-black text-slate-500 uppercase w-[22%]">
                  {getPhrase('amortization_schedule_eop_fund_label', 'Closing Balance')}
                </th>
              </tr>
            </thead>
            <tbody>
              {amortizationSchedule.map((row) => (
                <tr key={row.monthNo} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="lg:sticky lg:right-0 lg:bg-white lg:border-r lg:border-slate-100 p-2 lg:p-4 text-sm lg:text-base font-bold text-slate-600 text-center">
                    {row.monthNo}
                  </td>
                  <td className={cn('p-2 lg:p-4 text-sm lg:text-base font-medium', row.fundBop < 0 ? 'text-red-600' : 'text-slate-700')} dir="ltr">
                    {formatCompact(row.fundBop)}
                  </td>
                  <td className={cn('p-2 lg:p-4 text-sm lg:text-base font-medium', row.interest < 0 ? 'text-red-600' : 'text-slate-700')} dir="ltr">
                    {formatPercent(row.interest)}
                  </td>
                  <td className={cn('p-2 lg:p-4 text-sm lg:text-base font-black', row.monthlyRepayments < 0 ? 'text-red-600' : 'text-slate-800')} dir="ltr">
                    {formatCompact(row.monthlyRepayments)}
                  </td>
                  <td className={cn('p-2 lg:p-4 text-sm lg:text-base font-medium', row.fundRefund < 0 ? 'text-red-600' : 'text-slate-700')} dir="ltr">
                    {formatCompact(row.fundRefund)}
                  </td>
                  <td className={cn('p-2 lg:p-4 text-sm lg:text-base font-medium', row.interestRepayment < 0 ? 'text-red-600' : 'text-slate-700')} dir="ltr">
                    {formatCompact(row.interestRepayment)}
                  </td>
                  <td className={cn('p-2 lg:p-4 text-sm lg:text-base font-black', row.fundEop < 0 ? 'text-red-600' : 'text-slate-800')} dir="ltr">
                    {formatCompact(row.fundEop)}
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
