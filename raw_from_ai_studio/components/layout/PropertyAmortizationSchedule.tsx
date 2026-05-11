
import React from 'react';
import { List } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { formatCompact, formatPercent } from '../../services/utils';

interface AmortizationRow {
  month: number;
  startPrincipal: number;
  interest: number;
  repayment: number;
  principalRepayment: number;
  interestRepayment: number;
  endPrincipal: number;
}

interface PropertyAmortizationScheduleProps {
  activeResultTab: string;
  amortizationSchedule: AmortizationRow[];
}

export const PropertyAmortizationSchedule: React.FC<PropertyAmortizationScheduleProps> = ({
  activeResultTab,
  amortizationSchedule
}) => {
  return (
    <section className={`pt-0 lg:pt-4 ${activeResultTab === 'amortization' ? 'block' : 'hidden lg:block'}`}>
      <div className="hidden lg:block">
        <SectionHeader 
          icon={<List />} 
          title="לוח סילוקין" 
          variant="indigo" 
        />
      </div>
      
      <Card className="!p-0 overflow-hidden rounded-none lg:rounded-[2rem] border-0 lg:border shadow-none lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="overflow-x-hidden max-h-[calc(100dvw-40px)] lg:max-h-[600px] overflow-y-auto">
          <table className="w-full text-right border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[8%]">ח'</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[18%]">קרן התחלה</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[10%]">ריבית</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[14%]">החזר</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[14%]">קרן</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[14%]">ריבית</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[22%]">קרן סוף</th>
              </tr>
            </thead>
            <tbody>
              {amortizationSchedule.map((row) => (
                <tr key={row.month} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-2 lg:p-4 text-sm lg:text-lg font-bold text-slate-600">{row.month}</td>
                  <td className={`p-2 lg:p-4 text-sm lg:text-lg font-medium ${row.startPrincipal < 0 ? 'text-red-600' : 'text-slate-700'}`} dir="ltr">{formatCompact(row.startPrincipal)}</td>
                  <td className={`p-2 lg:p-4 text-sm lg:text-lg font-medium ${row.interest < 0 ? 'text-red-600' : 'text-slate-700'}`} dir="ltr">{formatPercent(row.interest)}</td>
                  <td className={`p-2 lg:p-4 text-sm lg:text-lg font-black ${row.repayment < 0 ? 'text-red-600' : 'text-slate-800'}`} dir="ltr">{formatCompact(row.repayment)}</td>
                  <td className={`p-2 lg:p-4 text-sm lg:text-lg font-medium ${row.principalRepayment < 0 ? 'text-red-600' : 'text-slate-700'}`} dir="ltr">{formatCompact(row.principalRepayment)}</td>
                  <td className={`p-2 lg:p-4 text-sm lg:text-lg font-medium ${row.interestRepayment < 0 ? 'text-red-600' : 'text-slate-700'}`} dir="ltr">{formatCompact(row.interestRepayment)}</td>
                  <td className={`p-2 lg:p-4 text-sm lg:text-lg font-black ${row.endPrincipal < 0 ? 'text-red-600' : 'text-slate-800'}`} dir="ltr">{formatCompact(row.endPrincipal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};
