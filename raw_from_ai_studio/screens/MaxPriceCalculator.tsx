
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { formatCurrency, formatNumber } from '../services/utils';
import { AnimatedNumber, CalcInput, EditableInput, SuggestedNumberInput, MetricCard, SummaryField, AutoFIllInput, AdditionalFundingSources, FinancingStatus, SegmentedControl } from '../components/propertyFields';
import { Card } from '../components/common/Card';
import { Button } from '../components/formFields';
import { SectionHeader } from '../components/common/SectionHeader';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { PropertyForm } from '../components/layout/PropertyForm';
import { Screen } from '../types';
import { 
  Building2, 
  TrendingUp, 
  DollarSign,
  Wallet,
  ArrowRight,
  Check,
  Calculator,
} from 'lucide-react';

interface MaxPriceCalculatorProps {
  onNavigate: (screen: Screen) => void;
}

const ADDITIONAL_SOURCES = [
  { id: 'parents', name: 'הלוואה מההורים', amount: 100000, monthlyRepayment: 1000 },
  { id: 'study_fund', name: 'קרן השתלמות', amount: 50000, monthlyRepayment: 0 },
  { id: 'bank_loan', name: 'הלוואה מהבנק', amount: 150000, monthlyRepayment: 1500 },
];

const CITY_OPTIONS = [
  { value: 'אשדוד', label: 'אשדוד' },
  { value: 'תל אביב', label: 'תל אביב' },
  { value: 'בת ים', label: 'בת ים' },
  { value: 'אחר', label: 'אחר' },
];

const APARTMENT_TYPES = [
  { value: 'single', label: 'יחידה' },
  { value: 'investment', label: 'להשקעה' },
  { value: 'alternate', label: 'חליפית' }
];

const MORTGAGE_PERIODS = [
  { value: '10', label: '10 שנים' },
  { value: '15', label: '15 שנים' },
  { value: '20', label: '20 שנים' },
  { value: '25', label: '25 שנים' },
  { value: '30', label: '30 שנים' }
];

const FINANCIAL_DEFAULTS = {
  equity: 300000,
  income: 15000,
  commitments: 0,
  fundingSources: ADDITIONAL_SOURCES
};

// --- Helper Components ---

export const MaxPriceCalculator: React.FC<MaxPriceCalculatorProps> = ({ onNavigate }) => {
  const [apartmentType, setApartmentType] = useState<'single' | 'investment' | 'alternate'>('single');
  const [equity, setEquity] = useState<number>(300000);
  const [incomes, setIncomes] = useState<number>(15000);
  const [commitments, setCommitments] = useState<number>(0);
  const [desiredRepayment, setDesiredRepayment] = useState<number>(4000);
  const [repaymentPercent, setRepaymentPercent] = useState<number>(30);
  const [mortgageBroker, setMortgageBroker] = useState<number>(8000);
  const [repairing, setRepairing] = useState<number>(0);
  const [expectedRentValue, setExpectedRentValue] = useState<number>(0);
  const [lifeInsurance, setLifeInsurance] = useState<number>(100);
  const [structureInsurance, setStructureInsurance] = useState<number>(100);

  const [isCalculating, setIsCalculating] = useState(false);
  const lastFocusedId = useRef<string | null>(null);

  // Refs for PropertyForm
  const cityRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const equityRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const incomeRef = useRef<HTMLDivElement>(null);
  const commitmentsRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  // Mobile View State
  const [isScrolled, setIsScrolled] = useState(false);

  // Percentages and modifiers
  const [interestPercent, setInterestPercent] = useState<number>(5);
  const [mortgagePeriod, setMortgagePeriod] = useState<number>(30);
  const [lawyerPercent, setLawyerPercent] = useState<number>(0.5);
  const [lawyerValue, setLawyerValue] = useState<number>(0);
  const [isLawyerInputModified, setIsLawyerInputModified] = useState(false);
  const [realtorPercent, setRealtorPercent] = useState<number>(2);
  const [realtorValue, setRealtorValue] = useState<number>(0);
  const [isRealtorInputModified, setIsRealtorInputModified] = useState(false);
  const [rentPercent, setRentPercent] = useState<number>(3.5);
  const [isRentInputModified, setIsRentInputModified] = useState(false);
  const [isLawyerPercentModified, setIsLawyerPercentModified] = useState(false);
  const [isRealtorPercentModified, setIsRealtorPercentModified] = useState(false);
  const [isRentPercentModified, setIsRentPercentModified] = useState(false);
  const [activeSources, setActiveSources] = useState<string[]>([]);

  const extraEquity = useMemo(() => 
    ADDITIONAL_SOURCES.filter(s => activeSources.includes(s.id)).reduce((sum, s) => sum + s.amount, 0)
  , [activeSources]);

  const extraCommitments = useMemo(() => 
    ADDITIONAL_SOURCES.filter(s => activeSources.includes(s.id)).reduce((sum, s) => sum + s.monthlyRepayment, 0)
  , [activeSources]);

  const totalEquity = equity + extraEquity;
  const totalCommitments = commitments + extraCommitments;

  const disposable = incomes - totalCommitments;
  const defaultRepayment = disposable > 0 ? Math.round(disposable * 0.3) : 0;
  const isRepaymentModified = repaymentPercent !== 30 || desiredRepayment !== defaultRepayment;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulation of server calculation on change
  useEffect(() => {
    // Capture the ID of the currently focused element before it gets disabled
    const activeEl = document.activeElement;
    if (activeEl && activeEl.id && activeEl !== document.body) {
      lastFocusedId.current = activeEl.id;
    }

    setIsCalculating(true);
    const timer = setTimeout(() => {
      setIsCalculating(false);
      
      // Restore focus in the next tick after the elements are re-enabled
      if (lastFocusedId.current) {
        const idToFocus = lastFocusedId.current;
        setTimeout(() => {
          const el = document.getElementById(idToFocus);
          if (el) {
            el.focus();
            // If it's an input, move cursor to end to allow continuous typing
            if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
              const len = el.value.length;
              el.setSelectionRange(len, len);
            }
          }
        }, 50);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [
    apartmentType, equity, incomes, commitments, desiredRepayment,
    mortgageBroker, repairing, expectedRentValue, lifeInsurance,
    structureInsurance, interestPercent, mortgagePeriod, lawyerPercent,
    realtorPercent, rentPercent, activeSources
  ]);
  
  // Sync repayment value and percent
  useEffect(() => {
    const disposable = incomes - totalCommitments;
    if (disposable > 0) {
      setRepaymentPercent(Math.round((desiredRepayment / disposable) * 100));
    }
  }, [desiredRepayment, incomes, totalCommitments]);

  const handlePercentChange = (p: number) => {
    setRepaymentPercent(p);
    const disposable = incomes - totalCommitments;
    if (disposable > 0) {
      setDesiredRepayment(Math.round(disposable * (p / 100)));
    }
  };
  
  const calculateMaxPrice = () => {
    const ltvLimit = apartmentType === 'single' ? 0.75 : (apartmentType === 'alternate' ? 0.70 : 0.50);
    const monthlyRate = (interestPercent / 100) / 12;
    const numPayments = mortgagePeriod * 12;
    
    const maxMortgageFromRepayment = monthlyRate > 0 
      ? desiredRepayment * (1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate
      : desiredRepayment * numPayments;

    let low = 0;
    let high = 10000000;
    let bestPrice = 0;

    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2;
      const tax = apartmentType === 'investment' 
        ? mid * 0.08 
        : (mid > 1900000 ? (mid - 1900000) * 0.035 : 0);
      
      const lawyer = isLawyerInputModified ? lawyerValue : mid * (lawyerPercent / 100);
      const realtor = isRealtorInputModified ? realtorValue : mid * (realtorPercent / 100);
      const totalExpenses = tax + lawyer + realtor + mortgageBroker + repairing;
      
      const availableEquity = totalEquity - totalExpenses;
      const mortgageNeeded = mid - availableEquity;
      
      const isLtvOk = mortgageNeeded <= mid * ltvLimit;
      const isMortgageOk = mortgageNeeded <= maxMortgageFromRepayment;
      const isEquityOk = availableEquity >= 0;

      if (isLtvOk && isMortgageOk && isEquityOk) {
        bestPrice = mid;
        low = mid;
      } else {
        high = mid;
      }
    }
    return Math.round(bestPrice);
  };

  const maxPrice = useMemo(() => calculateMaxPrice(), [
    apartmentType, totalEquity, desiredRepayment, interestPercent, mortgagePeriod,
    lawyerPercent, lawyerValue, isLawyerInputModified,
    realtorPercent, realtorValue, isRealtorInputModified,
    mortgageBroker, repairing
  ]);

  const mortgageAmount = useMemo(() => {
    const tax = apartmentType === 'investment' ? maxPrice * 0.08 : (maxPrice > 1900000 ? (maxPrice - 1900000) * 0.035 : 0);
    const lawyer = isLawyerInputModified ? lawyerValue : maxPrice * (lawyerPercent / 100);
    const realtor = isRealtorInputModified ? realtorValue : maxPrice * (realtorPercent / 100);
    const totalExpenses = tax + lawyer + realtor + mortgageBroker + repairing;
    return Math.max(0, maxPrice - (totalEquity - totalExpenses));
  }, [maxPrice, totalEquity, apartmentType, lawyerPercent, lawyerValue, isLawyerInputModified, realtorPercent, realtorValue, isRealtorInputModified, mortgageBroker, repairing]);

  const equityCleaningExpenses = useMemo(() => {
    const tax = apartmentType === 'investment' ? maxPrice * 0.08 : (maxPrice > 1900000 ? (maxPrice - 1900000) * 0.035 : 0);
    const lawyer = isLawyerInputModified ? lawyerValue : maxPrice * (lawyerPercent / 100);
    const realtor = isRealtorInputModified ? realtorValue : maxPrice * (realtorPercent / 100);
    const totalExpenses = tax + lawyer + realtor + mortgageBroker + repairing;
    return totalEquity - totalExpenses;
  }, [maxPrice, totalEquity, apartmentType, lawyerPercent, lawyerValue, isLawyerInputModified, realtorPercent, realtorValue, isRealtorInputModified, mortgageBroker, repairing]);

  useEffect(() => {
    if (!isLawyerInputModified) {
      setLawyerValue(Math.round(maxPrice * (lawyerPercent / 100)));
    }
  }, [maxPrice, lawyerPercent, isLawyerInputModified]);

  useEffect(() => {
    if (!isRealtorInputModified) {
      setRealtorValue(Math.round(maxPrice * (realtorPercent / 100)));
    }
  }, [maxPrice, realtorPercent, isRealtorInputModified]);

  useEffect(() => {
    if (!isRentInputModified) {
      setExpectedRentValue(Math.round(maxPrice * (rentPercent / 100) / 12));
    }
  }, [maxPrice, rentPercent, isRentInputModified]);

  const transferTax = apartmentType === 'investment' ? maxPrice * 0.08 : (maxPrice > 1900000 ? (maxPrice - 1900000) * 0.035 : 0);
  const incidentalsTotal = Math.round(transferTax + lawyerValue + realtorValue + mortgageBroker + repairing);
  const actualFinancingPercent = maxPrice > 0 ? Number(((mortgageAmount / maxPrice) * 100).toFixed(1)) : 0;
  const maxFinancingPercent = apartmentType === 'single' ? 75 : (apartmentType === 'alternate' ? 70 : 50);
  
  const rentCleaningExpenses = expectedRentValue - lifeInsurance - structureInsurance;

  const handleNumericChange = (setter: (val: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/,/g, '');
    if (val === '') {
      setter(0);
      return;
    }
    const num = parseInt(val);
    if (!isNaN(num)) {
      setter(num);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
      <main className="w-full">
        {/* Sticky Dashboard Header */}
        <div 
          className={`sticky top-16 z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-xl border-b border-slate-200' : 'bg-slate-50/80 backdrop-blur-sm border-b border-slate-100'}`}
          style={{ transition: 'all 0.3s ease-in-out' }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className={`transition-all duration-300 ${isScrolled ? 'py-1' : 'py-4'}`}>
              <div className="relative flex items-center justify-center min-h-[120px]">
                <ScreenHeader 
                  title="מחשבון מחיר מקסימלי" 
                  subtitle="בדיקת היתכנות כלכלית ותקציב רכישה"
                  isScrolled={isScrolled}
                />

                <MetricCard 
                  value={maxPrice} 
                  label="הדירה היקרה ביותר שאוכל לרכוש (בקירוב)"
                  isScrolled={isScrolled} 
                  formatter={formatCurrency} 
                  variant="emerald"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 space-y-12 pb-20">
          <PropertyForm 
            isCalculating={isCalculating}
            setIsCalculating={setIsCalculating}
            showTour={false}
            setShowTour={() => {}}
            tourStep=""
            setPendingTourStep={() => {}}
            city=""
            setCity={() => {}}
            settlementName=""
            setSettlementName={() => {}}
            address=""
            setAddress={() => {}}
            apartmentType={apartmentType}
            setApartmentType={setApartmentType}
            propertyPrice={maxPrice}
            setPropertyPrice={() => {}}
            equity={equity}
            setEquity={setEquity}
            equityMinusExpenses={equityCleaningExpenses}
            mortgageAmount={mortgageAmount}
            additionalInfo=""
            setAdditionalInfo={() => {}}
            income={incomes}
            setIncome={setIncomes}
            commitments={commitments}
            setCommitments={setCommitments}
            selectedFundingSources={activeSources}
            setSelectedFundingSources={setActiveSources}
            disposableIncome={disposable}
            desiredRepayment={desiredRepayment}
            setDesiredRepayment={setDesiredRepayment}
            desiredRepaymentPercent={repaymentPercent}
            setDesiredRepaymentPercent={handlePercentChange}
            isRepaymentPercentModified={isRepaymentModified}
            setIsRepaymentPercentModified={() => {}}
            isRepaymentInputModified={false}
            setIsRepaymentInputModified={() => {}}
            actualFinancingPercent={actualFinancingPercent}
            maxFinancingPercent={maxFinancingPercent}
            lawyerPercent={lawyerPercent}
            setLawyerPercent={setLawyerPercent}
            lawyerValue={lawyerValue}
            setLawyerValue={setLawyerValue}
            isLawyerPercentModified={isLawyerPercentModified}
            setIsLawyerPercentModified={setIsLawyerPercentModified}
            isLawyerInputModified={isLawyerInputModified}
            setIsLawyerInputModified={setIsLawyerInputModified}
            realtorPercent={realtorPercent}
            setRealtorPercent={setRealtorPercent}
            realtorValue={realtorValue}
            setRealtorValue={setRealtorValue}
            isRealtorPercentModified={isRealtorPercentModified}
            setIsRealtorPercentModified={setIsRealtorPercentModified}
            isRealtorInputModified={isRealtorInputModified}
            setIsRealtorInputModified={setIsRealtorInputModified}
            mortgageConsultant={mortgageBroker}
            setMortgageConsultant={setMortgageBroker}
            renovation={repairing}
            setRenovation={setRepairing}
            purchaseTax={transferTax}
            totalAdditionalExpenses={incidentalsTotal}
            expectedRentPercent={rentPercent}
            setExpectedRentPercent={setRentPercent}
            expectedRentValue={expectedRentValue}
            setExpectedRentValue={setExpectedRentValue}
            isRentPercentModified={isRentPercentModified}
            setIsRentPercentModified={() => {}}
            isRentInputModified={isRentInputModified}
            setIsRentInputModified={() => {}}
            lifeInsurance={lifeInsurance}
            setLifeInsurance={setLifeInsurance}
            buildingInsurance={structureInsurance}
            setBuildingInsurance={setStructureInsurance}
            rentMinusExpenses={rentCleaningExpenses}
            mortgagePeriod={String(mortgagePeriod)}
            setMortgagePeriod={(val) => setMortgagePeriod(Number(val))}
            monthlyMortgageRepayment={0}
            calcPossibleMonthlyRepayment={0}
            monthlyCashFlow={0}
            fundingSources={ADDITIONAL_SOURCES}
            hideLocationFields={true}
            hidePropertyPrice={true}
            hideAdditionalInfo={true}
            hideMortgageRepayment={true}
            hideFirstHeader={true}
            section1GridClassName="lg:grid-cols-4"
            cityRef={cityRef}
            priceRef={priceRef}
            equityRef={equityRef}
            typeRef={typeRef}
            incomeRef={incomeRef}
            commitmentsRef={commitmentsRef}
            graphRef={graphRef}
            setIsTourEnding={() => {}}
            setViewMode={() => {}}
            setActiveResultTab={() => {}}
            CITY_OPTIONS={CITY_OPTIONS}
            APARTMENT_TYPES={APARTMENT_TYPES}
            FINANCIAL_DEFAULTS={FINANCIAL_DEFAULTS}
            MORTGAGE_PERIODS={MORTGAGE_PERIODS}
          />
        </div>

      </main>
    </div>
  );
};
