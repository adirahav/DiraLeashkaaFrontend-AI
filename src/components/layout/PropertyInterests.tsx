
import React, { useMemo } from 'react';
import { PieChart } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { InterestControl } from '../propertyFields';
import { useSplash } from '../../hooks/useSplash';
import { PropertyData } from '../../types/property.types';

// ---------------------------------------------------------------------------
// Config extractor — mirrors extractPropertyRangeParam but adds default/delta
// ---------------------------------------------------------------------------
interface InterestConfig {
  name: string;
  min: number;
  max: number;
  step: number;
  default: number;
  delta: string | null;
}

interface ResolvedInterestConfig {
  min: number;
  max: number;
  step: number;
  default: number;
  delta: number;
}

function extractInterestParam(
  params: Record<string, unknown>,
  paramName: string,
  fallback: ResolvedInterestConfig,
): ResolvedInterestConfig {
  try {
    const raw = params['indexesAndInterests'];
    if (!raw) return fallback;
    const arr: InterestConfig[] =
      typeof raw === 'string' ? JSON.parse(raw) : (raw as InterestConfig[]);
    const found = arr.find((p) => p.name === paramName);
    if (!found) return fallback;
    return {
      min: found.min,
      max: found.max,
      step: found.step,
      default: found.default,
      delta: found.delta ? parseFloat(found.delta) : 0,
    };
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface PropertyInterestsProps {
  property: PropertyData;
  isCalculating: boolean;
  onUpdate: (field: string, value: any) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const PropertyInterests: React.FC<PropertyInterestsProps> = ({
  property,
  isCalculating,
  onUpdate,
}) => {
  const { getPhrase, params } = useSplash();

  const cfg = useMemo(() => {
    const raw = params as Record<string, unknown>;
    return {
      interestPercent: extractInterestParam(raw, 'interestPercent', { min: 0, max: 10, step: 0.1, default: 4.69, delta: 0 }),
      interestIn5YearsPercent: extractInterestParam(raw, 'interestIn5YearsPercent', { min: 0, max: 10, step: 0.1, default: 4.82, delta: 0.13 }),
      interestIn10YearsPercent: extractInterestParam(raw, 'interestIn10YearsPercent', { min: 0, max: 10, step: 0.1, default: 5.6, delta: 0.91 }),
      averageInterestAtTakingPercent: extractInterestParam(raw, 'averageInterestAtTakingPercent', { min: 0, max: 10, step: 0.1, default: 4.66, delta: 0 }),
      averageInterestAtMaturityPercent: extractInterestParam(raw, 'averageInterestAtMaturityPercent', { min: 0, max: 10, step: 0.1, default: 5.2, delta: 0 }),
      indexPercent: extractInterestParam(raw, 'indexPercent', { min: 0, max: 5, step: 0.1, default: 2.5, delta: 0 }),
      forecastAnnualPriceIncreasePercent: extractInterestParam(raw, 'forecastAnnualPriceIncreasePercent', { min: 0, max: 15, step: 0.1, default: 5.0, delta: 0 }),
      salesCostsPercent: extractInterestParam(raw, 'salesCostsPercent', { min: 0, max: 10, step: 0.1, default: 3.0, delta: 0 }),
      depreciationForTaxPurposesPercent: extractInterestParam(raw, 'depreciationForTaxPurposesPercent', { min: 0, max: 5, step: 0.1, default: 2.4, delta: 0 }),
    };
  }, [params]);

  // Delta Engine: 5Y/10Y defaults are base interest + their configured delta
  const default5Y = property.defaultInterestIn5YearsPercent
    ?? (property.calcInterestPercent + cfg.interestIn5YearsPercent.delta);
  const default10Y = property.defaultInterestIn10YearsPercent
    ?? (property.calcInterestPercent + cfg.interestIn10YearsPercent.delta);

  return (
    <section>
      <SectionHeader
        icon={<PieChart />}
        title={getPhrase('property_interest_and_indexes_header', 'Interests & Indexes')}
        variant="slate"
      />

      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <InterestControl
            label={getPhrase('property_interest_label_without_value', 'Interest')}
            value={property.calcInterestPercent}
            defaultValue={property.defaultInterestPercent ?? cfg.interestPercent.default}
            min={cfg.interestPercent.min}
            max={cfg.interestPercent.max}
            step={cfg.interestPercent.step}
            onChange={(val) => onUpdate('calcInterestPercent', val)}
            onRollback={() => onUpdate('calcInterestPercent', property.defaultInterestPercent ?? cfg.interestPercent.default)}
            disabled={isCalculating}
          />

          <InterestControl
            label={getPhrase('property_interest_in_5_years_label_without_value', 'Interest in 5 Years')}
            value={property.calcInterestIn5YearsPercent}
            defaultValue={default5Y}
            min={cfg.interestIn5YearsPercent.min}
            max={cfg.interestIn5YearsPercent.max}
            step={cfg.interestIn5YearsPercent.step}
            onChange={(val) => onUpdate('calcInterestIn5YearsPercent', val)}
            onRollback={() => onUpdate('calcInterestIn5YearsPercent', default5Y)}
            disabled={isCalculating}
          />

          <InterestControl
            label={getPhrase('property_interest_in_10_years_label_without_value', 'Interest in 10 Years')}
            value={property.calcInterestIn10YearsPercent}
            defaultValue={default10Y}
            min={cfg.interestIn10YearsPercent.min}
            max={cfg.interestIn10YearsPercent.max}
            step={cfg.interestIn10YearsPercent.step}
            onChange={(val) => onUpdate('calcInterestIn10YearsPercent', val)}
            onRollback={() => onUpdate('calcInterestIn10YearsPercent', default10Y)}
            disabled={isCalculating}
          />

          <InterestControl
            label={getPhrase('property_average_interest_at_taking_label_without_value', 'Avg. Interest at Taking')}
            value={property.calcAverageInterestAtTakingPercent}
            defaultValue={property.defaultAverageInterestAtTakingPercent ?? cfg.averageInterestAtTakingPercent.default}
            min={cfg.averageInterestAtTakingPercent.min}
            max={cfg.averageInterestAtTakingPercent.max}
            step={cfg.averageInterestAtTakingPercent.step}
            onChange={(val) => onUpdate('calcAverageInterestAtTakingPercent', val)}
            onRollback={() => onUpdate('calcAverageInterestAtTakingPercent', property.defaultAverageInterestAtTakingPercent ?? cfg.averageInterestAtTakingPercent.default)}
            disabled={isCalculating}
          />

          <InterestControl
            label={getPhrase('property_average_interest_at_maturity_label_without_value', 'Avg. Interest at Maturity')}
            value={property.calcAverageInterestAtMaturityPercent}
            defaultValue={property.defaultAverageInterestAtMaturityPercent ?? cfg.averageInterestAtMaturityPercent.default}
            min={cfg.averageInterestAtMaturityPercent.min}
            max={cfg.averageInterestAtMaturityPercent.max}
            step={cfg.averageInterestAtMaturityPercent.step}
            onChange={(val) => onUpdate('calcAverageInterestAtMaturityPercent', val)}
            onRollback={() => onUpdate('calcAverageInterestAtMaturityPercent', property.defaultAverageInterestAtMaturityPercent ?? cfg.averageInterestAtMaturityPercent.default)}
            disabled={isCalculating}
          />

          <InterestControl
            label={getPhrase('property_index_label_without_value', 'Price Index')}
            value={property.calcIndexPercent}
            defaultValue={property.defaultIndexPercent ?? cfg.indexPercent.default}
            min={cfg.indexPercent.min}
            max={cfg.indexPercent.max}
            step={cfg.indexPercent.step}
            onChange={(val) => onUpdate('calcIndexPercent', val)}
            onRollback={() => onUpdate('calcIndexPercent', property.defaultIndexPercent ?? cfg.indexPercent.default)}
            disabled={isCalculating}
          />

          <InterestControl
            label={getPhrase('property_forecast_annual_price_increase_label_without_value', 'Annual Yield Forecast')}
            value={property.calcForecastAnnualPriceIncreasePercent}
            defaultValue={property.defaultForecastAnnualPriceIncreasePercent ?? cfg.forecastAnnualPriceIncreasePercent.default}
            min={cfg.forecastAnnualPriceIncreasePercent.min}
            max={cfg.forecastAnnualPriceIncreasePercent.max}
            step={cfg.forecastAnnualPriceIncreasePercent.step}
            onChange={(val) => onUpdate('calcForecastAnnualPriceIncreasePercent', val)}
            onRollback={() => onUpdate('calcForecastAnnualPriceIncreasePercent', property.defaultForecastAnnualPriceIncreasePercent ?? cfg.forecastAnnualPriceIncreasePercent.default)}
            disabled={isCalculating}
          />

          <InterestControl
            label={getPhrase('property_sales_costs_label_without_value', 'Selling Costs')}
            value={property.calcSalesCostsPercent}
            defaultValue={property.defaultSalesCostsPercent ?? cfg.salesCostsPercent.default}
            min={cfg.salesCostsPercent.min}
            max={cfg.salesCostsPercent.max}
            step={cfg.salesCostsPercent.step}
            onChange={(val) => onUpdate('calcSalesCostsPercent', val)}
            onRollback={() => onUpdate('calcSalesCostsPercent', property.defaultSalesCostsPercent ?? cfg.salesCostsPercent.default)}
            disabled={isCalculating}
          />

          <InterestControl
            label={getPhrase('property_depreciation_for_tax_purposes_label_without_value', 'Depreciation for Tax')}
            value={property.calcDepreciationForTaxPurposesPercent}
            defaultValue={property.defaultDepreciationForTaxPurposesPercent ?? cfg.depreciationForTaxPurposesPercent.default}
            min={cfg.depreciationForTaxPurposesPercent.min}
            max={cfg.depreciationForTaxPurposesPercent.max}
            step={cfg.depreciationForTaxPurposesPercent.step}
            onChange={(val) => onUpdate('calcDepreciationForTaxPurposesPercent', val)}
            onRollback={() => onUpdate('calcDepreciationForTaxPurposesPercent', property.defaultDepreciationForTaxPurposesPercent ?? cfg.depreciationForTaxPurposesPercent.default)}
            disabled={isCalculating}
          />
        </div>

        {isCalculating && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 cursor-not-allowed rounded-2xl" />
        )}
      </div>
    </section>
  );
};
