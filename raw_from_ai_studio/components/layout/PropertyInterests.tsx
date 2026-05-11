
import React from 'react';
import { PieChart } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { InterestControl } from '../propertyFields';

interface PropertyInterestsProps {
  isCalculating: boolean;
  interest: number;
  setInterest: (val: number) => void;
  interest5y: number;
  setInterest5y: (val: number) => void;
  interest10y: number;
  setInterest10y: (val: number) => void;
  avgInterestTaking: number;
  setAvgInterestTaking: (val: number) => void;
  avgInterestRepayment: number;
  setAvgInterestRepayment: (val: number) => void;
  index: number;
  setIndex: (val: number) => void;
  expectedYield: number;
  setExpectedYield: (val: number) => void;
  saleCosts: number;
  setSaleCosts: (val: number) => void;
  depreciation: number;
  setDepreciation: (val: number) => void;
}

export const PropertyInterests: React.FC<PropertyInterestsProps> = ({
  isCalculating,
  interest,
  setInterest,
  interest5y,
  setInterest5y,
  interest10y,
  setInterest10y,
  avgInterestTaking,
  setAvgInterestTaking,
  avgInterestRepayment,
  setAvgInterestRepayment,
  index,
  setIndex,
  expectedYield,
  setExpectedYield,
  saleCosts,
  setSaleCosts,
  depreciation,
  setDepreciation,
}) => {
  return (
    <section>
      <SectionHeader 
        icon={<PieChart />} 
        title="ריביות ומדדים" 
        variant="slate" 
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 relative">
        {isCalculating && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 cursor-not-allowed rounded-2xl" />}
        <InterestControl label="ריבית" value={interest} onChange={setInterest} onRollback={() => setInterest(4.69)} defaultValue={4.69} disabled={isCalculating} />
        <InterestControl label="ריבית בעוד 5 שנים" value={interest5y} onChange={setInterest5y} onRollback={() => setInterest5y(4.82)} defaultValue={4.82} disabled={isCalculating} />
        <InterestControl label="ריבית בעוד 10 שנים" value={interest10y} onChange={setInterest10y} onRollback={() => setInterest10y(5.6)} defaultValue={5.6} disabled={isCalculating} />
        <InterestControl label="ריבית ממוצעת בעת הלקיחה" value={avgInterestTaking} onChange={setAvgInterestTaking} onRollback={() => setAvgInterestTaking(4.66)} defaultValue={4.66} disabled={isCalculating} />
        <InterestControl label="ריבית ממוצעת בעת הפירעון" value={avgInterestRepayment} onChange={setAvgInterestRepayment} onRollback={() => setAvgInterestRepayment(5.2)} defaultValue={5.2} disabled={isCalculating} />
        <InterestControl label="מדד" value={index} onChange={setIndex} onRollback={() => setIndex(2.5)} defaultValue={2.5} min={0} max={5} disabled={isCalculating} />
        <InterestControl label="צפי תשואה שנתית" value={expectedYield} onChange={setExpectedYield} onRollback={() => setExpectedYield(5.0)} defaultValue={5.0} min={0} max={15} disabled={isCalculating} />
        <InterestControl label="עלויות מכירה" value={saleCosts} onChange={setSaleCosts} onRollback={() => setSaleCosts(3.0)} defaultValue={3.0} min={0} max={10} disabled={isCalculating} />
        <InterestControl label="פחת לצורך מס" value={depreciation} onChange={setDepreciation} onRollback={() => setDepreciation(2.4)} defaultValue={2.4} min={0} max={5} disabled={isCalculating} />
      </div>
    </section>
  );
};
