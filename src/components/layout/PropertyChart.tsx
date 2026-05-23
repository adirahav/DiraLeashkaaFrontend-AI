
import React, { forwardRef } from 'react';
import { TrendingUp } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { YieldChart } from '../common/YieldChart';
import { useSplash } from '../../hooks/useSplash';
import { cn } from '../../lib/utils';

interface PropertyChartProps {
  yieldForecast: any[];
  activeResultTab: string;
  isCalculating: boolean;
}

export const PropertyChart = forwardRef<HTMLDivElement, PropertyChartProps>(
  ({ yieldForecast, activeResultTab, isCalculating }, ref) => {
    const { getPhrase } = useSplash();

    if (!Array.isArray(yieldForecast) || yieldForecast.length === 0) return null;

    return (
      <section
        ref={ref}
        className={cn(
          'pt-0 lg:pt-4 hidden lg:block',
          activeResultTab === 'graph' && 'block'
        )}
      >
        <div className="hidden lg:block">
          <SectionHeader
            icon={<TrendingUp />}
            title={getPhrase('property_yield_forecast_graph_view_header', 'Graph View - Yield Forecast')}
            variant="blue"
          />
        </div>

        <Card className={cn(
          'relative overflow-hidden !p-0',
          'h-[calc(100dvw-40px)] lg:h-[500px]',
          'rounded-none border-0 shadow-none lg:rounded-[2rem] lg:border lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
        )}>
          <div className="w-full h-full min-h-[300px]">
            <YieldChart data={yieldForecast} activeResultTab={activeResultTab} />
          </div>

          {isCalculating && (
            <div className={cn(
              'absolute inset-0 z-50 bg-white/30 backdrop-blur-[1px] cursor-wait transition-all duration-200',
              'rounded-none lg:rounded-[2rem]'
            )} />
          )}
        </Card>
      </section>
    );
  }
);

PropertyChart.displayName = 'PropertyChart';
