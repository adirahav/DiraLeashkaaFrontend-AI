import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrolled } from '../hooks/useScrolled';
import { PropertyData, PropertyFundingSource } from '../types/property.types';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { MetricCard } from '../components/propertyFields';
import { PropertyForm } from '../components/layout/PropertyForm';
import { useStore } from '../store/store';
import { calculatorService } from '../services/calculator.service';
import { useSplash } from '../hooks/useSplash';
import { formatCurrency } from '../services/utils';
import { cn } from '../lib/utils';
import { buildDefaultProperty } from '../store/slices/property.slice';

function toFloat(val: any): number | undefined {
  if (val == null) return undefined;
  const n = parseFloat(val);
  return isNaN(n) ? undefined : n;
}

function normalizeResponse(data: any, localSources: PropertyFundingSource[]): PropertyData {
  const selectedIds: string[] = (data.calcAdditionalFunding?.sources ?? [])
    .map((s: any) => s.id ?? s.uuid)
    .filter(Boolean);

  return {
    ...data,
    defaultIncomes: data.calcIncomes ?? data.incomes ?? data.defaultIncomes,
    calcIncomes: data.defaultIncomes ?? data.calcIncomes,
    defaultCommitments: data.calcCommitments ?? data.commitments ?? data.defaultCommitments,
    calcCommitments: data.defaultCommitments ?? data.calcCommitments,
    possibleMonthlyRepaymentPercent: toFloat(data.calcPossibleMonthlyRepaymentPercent ?? data.possibleMonthlyRepaymentPercent),
    possibleMonthlyRepaymentCustomValue: data.possibleMonthlyRepaymentCustomValue ?? null,
    lawyerPercent: toFloat(data.calcLawyerPercent ?? data.lawyerPercent),
    lawyerCustomValue: data.lawyerCustomValue ?? null,
    realEstateAgentPercent: toFloat(data.calcRealEstateAgentPercent ?? data.realEstateAgentPercent),
    realEstateAgentCustomValue: data.realEstateAgentCustomValue ?? null,
    rentPercent: toFloat(data.calcRentPercent ?? data.rentPercent),
    rentCustomValue: data.rentCustomValue ?? null,
    calcMortgagePeriod: data.calcMortgagePeriod != null ? String(data.calcMortgagePeriod) : '',
    additionalFundingSources: localSources,
    selectedFundingSourceIds: selectedIds,
  };
}

export const MaxPriceCalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const isScrolled = useScrolled();
  const { getPhrase, params } = useSplash();

  const loggedinUser = useStore((state) => state.loggedinUser);

  const userFundingSources: PropertyFundingSource[] = (loggedinUser?.additionalFundingSources ?? []).map((s) => ({
    id: s.uuid,
    name: s.source,
    amount: s.amount,
    monthlyRepayment: s.repayment,
  }));

  const [property, setProperty] = useState<PropertyData>(() =>
    buildDefaultProperty(loggedinUser, params as Record<string, unknown>),
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const lastFocusedId = useRef<string | null>(null);

  const cityRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const equityRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const incomeRef = useRef<HTMLDivElement>(null);
  const commitmentsRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loggedinUser) {
      navigate('/');
      return;
    }

    let cancelled = false;
    setIsCalculating(true);

    calculatorService
      .getMaxPrice()
      .then((data) => {
        if (cancelled) return;
        setProperty(normalizeResponse(data, userFundingSources));
      })
      .catch(() => {
        if (cancelled) return;
        navigate('/home');
      })
      .finally(() => {
        if (!cancelled) setIsCalculating(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = useCallback(
    async (fieldName: string, fieldValue: any) => {
      const activeEl = document.activeElement;
      if (activeEl?.id && activeEl !== document.body) {
        lastFocusedId.current = activeEl.id;
      }

      setIsCalculating(true);
      try {
        const updated = await calculatorService.updateMaxPrice(fieldName, fieldValue);
        setProperty(normalizeResponse(updated, userFundingSources));
      } finally {
        setIsCalculating(false);
        if (lastFocusedId.current) {
          const id = lastFocusedId.current;
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
              el.focus();
              const supportsSelection =
                el instanceof HTMLTextAreaElement ||
                (el instanceof HTMLInputElement &&
                  !['range', 'number', 'checkbox', 'radio', 'file', 'date'].includes(el.type));
              if (supportsSelection) {
                const len = el.value.length;
                el.setSelectionRange(len, len);
              }
            }
          }, 50);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
      <main className="w-full">
        <div
          className={cn(
            'sticky top-16 z-40 transition-all duration-300',
            isScrolled
              ? 'bg-white shadow-xl border-b border-slate-200'
              : 'bg-slate-50/80 backdrop-blur-sm border-b border-slate-100',
          )}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className={cn('transition-all duration-300', isScrolled ? 'py-1' : 'py-4')}>
              <div className="relative flex items-center justify-center min-h-[120px]">
                <ScreenHeader
                  title={getPhrase('calculator_title_max_price', 'Maximum price calculator')}
                  subtitle={getPhrase('calculator_title_max_price_subtitle', 'Economic feasibility check and purchase budget')}
                  isScrolled={isScrolled}
                />
                <MetricCard
                  value={typeof property.price === 'number' ? property.price : 0}
                  label={getPhrase('calculator_maxprice_price_label', 'The most expensive apartment I can buy (approximately)')}
                  isScrolled={isScrolled}
                  formatter={formatCurrency}
                  variant="emerald"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pb-20 animate-in fade-in slide-in-from-bottom-4">
          <PropertyForm
            property={property}
            onUpdate={handleUpdate}
            isCalculating={isCalculating}
            setIsCalculating={setIsCalculating}
            hideLocationFields={true}
            hidePropertyPrice={true}
            hideAdditionalInfo={true}
            hideFirstSectionHeader={true}
            section1GridClassName="lg:grid-cols-4"
            showTour={false}
            setShowTour={() => {}}
            tourStep=""
            setPendingTourStep={() => {}}
            setIsTourEnding={() => {}}
            setViewMode={() => {}}
            setActiveResultTab={() => {}}
            cityRef={cityRef}
            priceRef={priceRef}
            equityRef={equityRef}
            typeRef={typeRef}
            incomeRef={incomeRef}
            commitmentsRef={commitmentsRef}
            graphRef={graphRef}
          />
        </div>
      </main>
    </div>
  );
};
