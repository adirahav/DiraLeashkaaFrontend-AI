
import React from 'react';
import { Table as TableIcon } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { formatCompact, formatPercent } from '../../services/utils';

interface ForecastRow {
  month: number;
  propertyValue: number;
  rent: number;
  expenses: number;
  financingCosts: number;
  valueAtRealization: number;
  bettermentTax: number;
  profit: number;
  yieldOnEquity: number;
}

interface PropertyYieldForecastProps {
  activeResultTab: string;
  forecastData: ForecastRow[];
}

export const PropertyYieldForecast: React.FC<PropertyYieldForecastProps> = ({ 
  activeResultTab, 
  forecastData
}) => {
  return (
    <section className={`pt-0 lg:pt-6 ${activeResultTab === 'yield' ? 'block' : 'hidden lg:block'}`}>
      <div className="hidden lg:block">
        <SectionHeader 
          icon={<TableIcon />} 
          title="תחזית פיננסית - תשואה צפויה" 
          variant="blue" 
        />
      </div>
      
      <Card className="!p-0 overflow-hidden rounded-none lg:rounded-[2rem] border-0 lg:border shadow-none lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="overflow-x-hidden max-h-[calc(100dvw-40px)] lg:max-h-[600px] overflow-y-auto">
          <table className="w-full text-right border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[5%]">ח'</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[12%]">שווי</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[10%]">שכירות</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[10%]">הוצ'</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[10%]">החזר</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[12%]">מימוש</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[10%]">מס</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[15%]">רווח</th>
                <th className="p-2 lg:p-4 text-xs lg:text-base font-black text-slate-500 uppercase w-[16%]">תשואה</th>
              </tr>
            </thead>
            <tbody>
              {forecastData.map((row) => (
                <tr key={row.month} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-2 lg:p-4 text-sm lg:text-lg font-bold text-slate-600">{row.month}</td>
                  <td className={`p-2 lg:p-4 text-sm lg:text-lg font-medium ${row.propertyValue < 0 ? 'text-red-600' : 'text-slate-700'}`} dir="ltr">{formatCompact(row.propertyValue)}</td>
                  <td className={`p-2 lg:p-4 text-sm lg:text-lg font-medium ${row.rent < 0 ? 'text-red-600' : 'text-slate-700'}`} dir="ltr">{formatCompact(row.rent)}</td>
                  <td className="p-2 lg:p-4 text-sm lg:text-lg font-medium text-slate-700" dir="ltr">{formatCompact(row.expenses)}</td>
                  <td className={`p-2 lg:p-4 text-sm lg:text-lg font-medium ${row.financingCosts < 0 ? 'text-red-600' : 'text-slate-700'}`} dir="ltr">{formatCompact(row.financingCosts)}</td>
                  <td className={`p-2 lg:p-4 text-sm lg:text-lg font-medium ${row.valueAtRealization < 0 ? 'text-red-600' : 'text-slate-700'}`} dir="ltr">{formatCompact(row.valueAtRealization)}</td>
                  <td className={`p-2 lg:p-4 text-sm lg:text-lg font-medium ${row.bettermentTax < 0 ? 'text-red-600' : 'text-slate-700'}`} dir="ltr">{formatCompact(row.bettermentTax)}</td>
                  <td className={`p-2 lg:p-4 text-sm lg:text-lg font-black ${row.profit < 0 ? 'text-red-600' : 'text-slate-800'}`} dir="ltr">
                    {formatCompact(row.profit)}
                  </td>
                  <td className={`p-2 lg:p-4 text-sm lg:text-lg font-black ${row.yieldOnEquity < 0 ? 'text-red-600' : 'text-slate-800'}`} dir="ltr">
                    {formatPercent(row.yieldOnEquity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};
