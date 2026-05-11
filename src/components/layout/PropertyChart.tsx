
import React, { forwardRef } from 'react';
import { TrendingUp } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { ResponsiveContainer } from 'recharts';
import { YieldChart } from '../common/YieldChart';

interface PropertyChartProps {
  activeResultTab: string;
  viewMode: string;
  graphData: any[];
  forecastData: any[];
}

export const PropertyChart = forwardRef<HTMLDivElement, PropertyChartProps>(({ 
  activeResultTab, 
  viewMode, 
  graphData, 
  forecastData 
}, ref) => {
  return (
    <section ref={ref} className={`pt-0 lg:pt-4 ${activeResultTab === 'graph' ? 'block' : 'hidden lg:block'}`}>
      <div className="hidden lg:block">
        <SectionHeader 
          icon={<TrendingUp />} 
          title="תצוגת גרף - תחזית תשואה" 
          variant="blue" 
        />
      </div>
      
      <Card className="!p-0 lg:p-8 h-[calc(100dvw-40px)] lg:h-[500px] overflow-visible rounded-none lg:rounded-[2rem] border-0 lg:border shadow-none lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="w-full h-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={300} key={`graph-${activeResultTab}-${viewMode}-${graphData.length}-${forecastData.length}`}>
            <YieldChart data={graphData} />
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  );
});

PropertyChart.displayName = 'PropertyChart';
