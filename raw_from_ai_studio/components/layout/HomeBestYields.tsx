import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { Trophy } from 'lucide-react';
import { Card } from '../common/Card';
import { Property } from '../../types';
import { YieldChart } from '../common/YieldChart';
import { SectionHeader } from '../common/SectionHeader';
import { MetricTile } from '../common/MetricTile';

interface HomeBestYieldsProps {
  bestProperty: Property | null;
}

export const HomeBestYields: React.FC<HomeBestYieldsProps> = ({ bestProperty }) => {
  if (!bestProperty || !bestProperty.calcYields) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const chartData = Array.from({ length: 10 }, (_, i) => {
    const year = i + 1;
    const totalReturn = Math.pow(1 + (bestProperty.calcYields?.averageReturn || 0) / 100, year) - 1;
    const equityReturn = Math.pow(1 + (bestProperty.calcYields?.averageReturnOnEquity || 0) / 100, year) - 1;
    
    return {
      month: `שנה ${year}`,
      totalYield: Number((totalReturn * 100).toFixed(1)),
      yieldOnEquity: Number((equityReturn * 100).toFixed(1)),
    };
  });

  return (
    <div className="mt-12" dir="rtl">
      <SectionHeader 
        icon={<Trophy />} 
        title="הנכס המשתלם ביותר" 
        variant="amber" 
      />
      
      <Card className="overflow-hidden border-2 border-amber-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-3xl font-black text-slate-800 mb-2">{bestProperty.address}, {bestProperty.city}</h3>
            <p className="text-slate-500 mb-8">{bestProperty.info}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <MetricTile 
                label="תשואה ממוצעת" 
                value={formatPercent(bestProperty.calcYields.averageReturn)} 
                variant="blue"
              />
              <MetricTile 
                label="תשואה ממוצעת על ההון" 
                value={formatPercent(bestProperty.calcYields.averageReturnOnEquity)} 
                variant="teal"
              />
              <MetricTile 
                label="רווח כולל" 
                value={formatCurrency(bestProperty.calcYields.profit)} 
                variant="slate"
              />
              <MetricTile 
                label="רווח מהוון (NPV)" 
                value={formatCurrency(bestProperty.calcYields.profitNpv)} 
                variant="slate"
              />
            </div>
          </div>
          
          <div className="h-full bg-white rounded-xl border border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <YieldChart data={chartData} />
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
};
