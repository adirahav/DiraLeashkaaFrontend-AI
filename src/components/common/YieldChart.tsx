
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface YieldChartProps {
  data: any[];
}

export const YieldChart: React.FC<YieldChartProps> = ({ data }) => {
  return (
    <LineChart 
      data={data} 
      margin={{ top: 40, right: 30, left: 10, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
      <XAxis 
        dataKey="month" 
        axisLine={{ stroke: '#e2e8f0' }}
        tickLine={false} 
        tick={{fontSize: 10, fill: '#64748b'}}
        interval="preserveStartEnd"
      />
      <YAxis 
        axisLine={{ stroke: '#e2e8f0' }}
        tickLine={false} 
        width={45}
        tick={{fontSize: 10, fill: '#64748b', dx: -20}}
        domain={['auto', 'auto']}
        tickFormatter={(val) => `${val}%`}
      />
      <RechartsTooltip 
        contentStyle={{
          borderRadius: '12px', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          direction: 'rtl',
          textAlign: 'right'
        }}
      />
      <Legend 
        verticalAlign="top" 
        align="center"
        height={40}
        iconType="circle"
      />
      <Line 
        type="monotone" 
        dataKey="totalYield" 
        name="תשואה כוללת" 
        stroke="#2563eb" 
        strokeWidth={4}
        dot={false}
        activeDot={{ r: 6, strokeWidth: 0 }}
        isAnimationActive={false}
        connectNulls
      />
      <Line 
        type="monotone" 
        dataKey="yieldOnEquity" 
        name="תשואה על ההון" 
        stroke="#0d9488" 
        strokeWidth={4}
        dot={false}
        activeDot={{ r: 6, strokeWidth: 0 }}
        isAnimationActive={false}
        connectNulls
      />
    </LineChart>
  );
};
