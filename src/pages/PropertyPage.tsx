
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { formatCurrency, formatNumber, formatCompact, formatPercent } from '../services/utils';
import { RollbackButton } from '../components/propertyFields';
import { Card } from '../components/common/Card';
import { Button } from '../components/formFields';
import { SectionHeader } from '../components/common/SectionHeader';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { PropertyTour } from '../components/tour/PropertyTour';
import { PropertyYieldForecast } from '../components/layout/PropertyYieldForecast';
import { PropertyAmortizationSchedule } from '../components/layout/PropertyAmortizationSchedule';
import { PropertyChart } from '../components/layout/PropertyChart';
import { PropertyMedia } from '../components/layout/PropertyMedia';
import { PropertyInterests } from '../components/layout/PropertyInterests';
import { PropertyForm } from '../components/layout/PropertyForm';
import { PropertyMetrics } from '../components/layout/PropertyMetrics';
import { Tab } from '../components/common/Tab';
import { useStore } from '../store/store'
import { Info, TrendingUp, PieChart, Table as TableIcon, ChevronRight, MousePointer2, List, LineChart as LineChartIcon } from 'lucide-react';


// Mock Financial Defaults (In real app, these come from global state/API)
const FINANCIAL_DEFAULTS = {
  equity: 1410453,
  income: 40001,
  commitments: 3134,
  fundingSources: [
    { id: '1', name: 'הלוואה מההורים', amount: 100000, monthlyRepayment: 1000 },
    { id: '2', name: 'קרן השתלמות', amount: 50000, monthlyRepayment: 0 },
    { id: '3', name: 'הלוואה מהבנק', amount: 150000, monthlyRepayment: 1500 },
    { id: '4', name: 'קופת גמל', amount: 30000, monthlyRepayment: 0 },
    { id: '5', name: 'הלוואת מעסיק', amount: 20000, monthlyRepayment: 200 },
    { id: '6', name: 'חסכונות נוספים', amount: 40000, monthlyRepayment: 0 },
  ]
};

const CITY_OPTIONS = [
  { value: 'אשדוד', label: 'אשדוד' },
  { value: 'תל אביב', label: 'תל אביב' },
  { value: 'בת ים', label: 'בת ים' },
  { value: 'אחר', label: 'אחר' },
];

const APARTMENT_TYPES = [
  { value: 'יחידה', label: 'יחידה' },
  { value: 'חליפית', label: 'חליפית' },
  { value: 'השקעה', label: 'השקעה' },
];

const MORTGAGE_PERIODS = [
  { value: '10', label: '10 שנים' },
  { value: '15', label: '15 שנה' },
  { value: '20', label: '20 שנה' },
  { value: '25', label: '25 שנה' },
  { value: '30', label: '30 שנה' },
];

// --- Helper Components ---
const AnimatedNumber: React.FC<{
  value: number;
  formatter: (val: number) => React.ReactNode;
  duration?: number;
}> = ({ value, formatter, duration = 1500 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const valueRef = useRef(value);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const startValue = valueRef.current;
    const endValue = value;
    
    if (startValue === endValue) return;

    const animate = (time: number) => {
      if (startTimeRef.current === null) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out expo for a smooth finish
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentRaw = startValue + (endValue - startValue) * easedProgress;
      
      let displayVal;
      if (progress < 1) {
        // Keep the decimal part of the start value during animation
        const startDecimal = startValue % 1;
        displayVal = Math.floor(currentRaw) + startDecimal;
      } else {
        displayVal = endValue;
      }
      
      setDisplayValue(displayVal);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        valueRef.current = endValue;
        startTimeRef.current = null;
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [value, duration]);

  return <>{formatter(displayValue)}</>;
};

// --- Hooks ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const PropertyPage: React.FC = () => {
  const showTour = useStore((state) => state.showTour)
  const setShowTour = useStore((state) => state.setShowTour)
  const setIsResultsMode = useStore((state) => state.setIsResultsMode)
  const userEmail = useStore((state) => state.loggedinUser?.email)

  // --- State ---
  const [city, setCity] = useState('אשדוד');
  const [settlementName, setSettlementName] = useState('');
  const [address, setAddress] = useState('222');
  const [apartmentType, setApartmentType] = useState('יחידה');
  const [propertyPrice, setPropertyPrice] = useState<number | ''>(2375000);
  const [equity, setEquity] = useState<number>(1410453);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [isCalculating, setIsCalculating] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'results'>('form');

  useEffect(() => {
    setIsResultsMode(viewMode === 'results')
  }, [viewMode, setIsResultsMode]);

  const [activeResultTab, setActiveResultTab] = useState<'yield' | 'amortization' | 'graph'>('yield');
  const [isTourEnding, setIsTourEnding] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const [tourStep, setTourStep] = useState<'CITY' | 'PRICE' | 'EQUITY' | 'TYPE' | 'INCOME' | 'COMMITMENTS'>('CITY');
  const [pendingTourStep, setPendingTourStep] = useState<'CITY' | 'PRICE' | 'EQUITY' | 'TYPE' | 'INCOME' | 'COMMITMENTS' | null>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const equityRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const incomeRef = useRef<HTMLDivElement>(null);
  const commitmentsRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shouldLock = showTour || (viewMode === 'results' && window.innerWidth < 1024);
    
    if (shouldLock) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.style.touchAction = 'unset';
    }

    if (viewMode === 'results') {
      document.body.classList.add('is-results-mode');
    } else {
      document.body.classList.remove('is-results-mode');
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.style.touchAction = 'unset';
      document.body.classList.remove('is-results-mode');
    };
  }, [showTour, viewMode]);

  const [income, setIncome] = useState<number>(40001);
  const [commitments, setCommitments] = useState<number>(3134);
  const [selectedFundingSources, setSelectedFundingSources] = useState<string[]>([]);
  
  const [desiredRepayment, setDesiredRepayment] = useState<number>(0);
  const [desiredRepaymentPercent, setDesiredRepaymentPercent] = useState<number>(34);
  const [isRepaymentPercentModified, setIsRepaymentPercentModified] = useState(true);
  const [isRepaymentInputModified, setIsRepaymentInputModified] = useState(false);

  // Expenses
  const [lawyerPercent, setLawyerPercent] = useState<number>(0.5);
  const [lawyerValue, setLawyerValue] = useState<number>(0);
  const [isLawyerPercentModified, setIsLawyerPercentModified] = useState(false);
  const [isLawyerInputModified, setIsLawyerInputModified] = useState(false);

  const [realtorPercent, setRealtorPercent] = useState<number>(2.1);
  const [realtorValue, setRealtorValue] = useState<number>(0);
  const [isRealtorPercentModified, setIsRealtorPercentModified] = useState(true);
  const [isRealtorInputModified, setIsRealtorInputModified] = useState(false);

  const [mortgageConsultant, setMortgageConsultant] = useState<number>(12345);
  const [renovation, setRenovation] = useState<number>(123456);

  // Rent
  const [expectedRentPercent, setExpectedRentPercent] = useState<number>(3);
  const [expectedRentValue, setExpectedRentValue] = useState<number>(5938);
  const [isRentPercentModified, setIsRentPercentModified] = useState(false);
  const [isRentInputModified, setIsRentInputModified] = useState(true);

  const [lifeInsurance, setLifeInsurance] = useState<number>(123);
  const [buildingInsurance, setBuildingInsurance] = useState<number>(70);

  const [mortgagePeriod, setMortgagePeriod] = useState('30');

  // Part 1.2: Interests and Indices
  const [interest, setInterest] = useState(4.69);
  const [interest5y, setInterest5y] = useState(4.82);
  const [interest10y, setInterest10y] = useState(5.6);
  const [avgInterestTaking, setAvgInterestTaking] = useState(4.66);
  const [avgInterestRepayment, setAvgInterestRepayment] = useState(5.2);
  const [index, setIndex] = useState(2.5);
  const [expectedYield, setExpectedYield] = useState(5.0);
  const [saleCosts, setSaleCosts] = useState(3.0);
  const [depreciation, setDepreciation] = useState(2.4);

  // Images
  const [images, setImages] = useState<string[]>(['https://res.cloudinary.com/do5lkisxf/image/upload/v1740137110/ml_diraleashkaa/n69h59cgew5eyub1yren.jpg']);
  const lastFocusedId = useRef<string | null>(null);

  // --- Debounce Logic ---
  const calculationInputs = useMemo(() => ({
    city, settlementName, address, apartmentType, propertyPrice, equity, 
    additionalInfo, income, commitments, selectedFundingSources, desiredRepayment, 
    desiredRepaymentPercent, lawyerPercent, lawyerValue, realtorPercent, 
    realtorValue, mortgageConsultant, renovation, expectedRentPercent, 
    expectedRentValue, lifeInsurance, buildingInsurance, mortgagePeriod,
    interest, interest5y, interest10y, avgInterestTaking, avgInterestRepayment,
    index, expectedYield, saleCosts, depreciation
  }), [
    city, settlementName, address, apartmentType, propertyPrice, equity, 
    additionalInfo, income, commitments, selectedFundingSources, desiredRepayment, 
    desiredRepaymentPercent, lawyerPercent, lawyerValue, realtorPercent, 
    realtorValue, mortgageConsultant, renovation, expectedRentPercent, 
    expectedRentValue, lifeInsurance, buildingInsurance, mortgagePeriod,
    interest, interest5y, interest10y, avgInterestTaking, avgInterestRepayment,
    index, expectedYield, saleCosts, depreciation
  ]);

  const d = useDebounce(calculationInputs, 500);

  // Mobile View State
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Force scroll to top on view change
    const scrollToTop = () => {
      if (isTourEnding) return;
      window.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
    };
    
    scrollToTop();

    // Small delay to handle DOM updates and trigger graph resize
    const timer = setTimeout(() => {
      scrollToTop();
      window.dispatchEvent(new Event('resize'));
      // Trigger again after a bit more time to be sure
      setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, [viewMode, activeResultTab, isTourEnding]);

  // --- Calculations ---
  
  const disposableIncome = useMemo(() => {
    const additionalFundingRepayment = FINANCIAL_DEFAULTS.fundingSources
      .filter(s => d.selectedFundingSources.includes(s.id))
      .reduce((sum, s) => sum + s.monthlyRepayment, 0);
    return d.income - d.commitments - additionalFundingRepayment;
  }, [d]);

  // Initial desired repayment calculation
  useEffect(() => {
    if (!isRepaymentInputModified) {
      setDesiredRepayment(Math.round(disposableIncome * (d.desiredRepaymentPercent / 100)));
    }
  }, [disposableIncome, d.desiredRepaymentPercent, isRepaymentInputModified]);

  // Initial lawyer calculation
  useEffect(() => {
    if (!isLawyerInputModified) {
      setLawyerValue(Math.round(disposableIncome * (d.lawyerPercent / 100)));
    }
  }, [disposableIncome, d.lawyerPercent, isLawyerInputModified]);

  // Initial realtor calculation
  useEffect(() => {
    if (!isRealtorInputModified) {
      setRealtorValue(Math.round(disposableIncome * (d.realtorPercent / 100)));
    }
  }, [disposableIncome, d.realtorPercent, isRealtorInputModified]);

  // Initial rent calculation
  useEffect(() => {
    if (!isRentInputModified) {
      setExpectedRentValue(Math.round(disposableIncome * (d.expectedRentPercent / 100)));
    }
  }, [disposableIncome, d.expectedRentPercent, isRentInputModified]);

  const purchaseTax = useMemo(() => {
    // Simple mock calculation for purchase tax
    const price = d.propertyPrice || 0;
    if (d.apartmentType === 'השקעה') return price * 0.08;
    if (price > 1900000) return (price - 1900000) * 0.035;
    return 0;
  }, [d]);

  const totalAdditionalExpenses = useMemo(() => {
    return purchaseTax + d.lawyerValue + d.realtorValue + d.mortgageConsultant + d.renovation;
  }, [purchaseTax, d]);

  const equityMinusExpenses = useMemo(() => {
    const additionalFundingAmount = FINANCIAL_DEFAULTS.fundingSources
      .filter(s => d.selectedFundingSources.includes(s.id))
      .reduce((sum, s) => sum + s.amount, 0);
    return d.equity + additionalFundingAmount - totalAdditionalExpenses;
  }, [d, totalAdditionalExpenses]);

  const mortgageAmount = useMemo(() => {
    return Math.max(0, (d.propertyPrice || 0) - equityMinusExpenses);
  }, [d, equityMinusExpenses]);

  const maxFinancingPercent = useMemo(() => {
    if (d.apartmentType === 'יחידה') return 75;
    if (d.apartmentType === 'חליפית') return 70;
    if (d.apartmentType === 'השקעה') return 50;
    return 0;
  }, [d]);

  const actualFinancingPercent = useMemo(() => {
    if (!d.propertyPrice || d.propertyPrice === 0) return 0;
    return Number(((mortgageAmount / d.propertyPrice) * 100).toFixed(1));
  }, [mortgageAmount, d]);

  const calcPossibleMonthlyRepayment = useMemo(() => {
    return disposableIncome * 0.4;
  }, [disposableIncome]);

  const rentMinusExpenses = useMemo(() => {
    return d.expectedRentValue - d.lifeInsurance - d.buildingInsurance;
  }, [d]);

  const monthlyMortgageRepayment = useMemo(() => {
    if (!d.mortgagePeriod || mortgageAmount <= 0) return 0;
    const months = parseInt(d.mortgagePeriod) * 12;
    const monthlyRate = (d.interest / 100) / 12;
    if (monthlyRate === 0) return mortgageAmount / months;
    return (mortgageAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }, [mortgageAmount, d]);

  const propertyYield = useMemo(() => {
    if (!d.propertyPrice || d.propertyPrice === 0) return 0;
    return Number(((d.expectedRentValue * 12 / d.propertyPrice) * 100).toFixed(2));
  }, [d]);

  const monthlyCashFlow = useMemo(() => {
    return Math.round(rentMinusExpenses - monthlyMortgageRepayment);
  }, [rentMinusExpenses, monthlyMortgageRepayment]);

  const isPart1Valid = useMemo(() => {
    return (
      d.apartmentType !== '' && 
      d.propertyPrice !== '' && 
      Number(d.propertyPrice) > 0 && 
      Number(d.equity) > 0 && 
      Number(d.income) > 0 && 
      d.mortgagePeriod !== ''
    );
  }, [d]);

  // --- Financial Forecast Data ---
  const forecastData = useMemo(() => {
    if (!isPart1Valid) return [];
    const data = [];
    const price = d.propertyPrice || 0;
    let currentPropertyValue = price;
    const months = 360;
    const monthlyAppreciation = (d.expectedYield / 100) / 12;
    const monthlyIndex = (d.index / 100) / 12;
    
    for (let i = 1; i <= months; i++) {
      currentPropertyValue *= (1 + monthlyAppreciation);
      
      const rent = d.expectedRentValue * Math.pow(1 + monthlyIndex, i);
      const expenses = d.lifeInsurance + d.buildingInsurance;
      const financingCosts = monthlyMortgageRepayment;
      const valueAtRealization = currentPropertyValue * (1 - d.saleCosts / 100);
      const profit = valueAtRealization - price;
      const betterTax = profit > 0 ? profit * 0.25 : 0;
      
      data.push({
        month: i,
        year: Math.ceil(i / 12),
        propertyValue: Math.round(currentPropertyValue),
        rent: Math.round(rent),
        expenses: Math.round(expenses),
        financingCosts: Math.round(financingCosts),
        valueAtRealization: Math.round(valueAtRealization),
        bettermentTax: Math.round(betterTax),
        profit: Math.round(profit - betterTax),
        totalYield: price > 0 ? Number(((profit / price) * 100).toFixed(1)) : 0,
        yieldOnEquity: (d.equity && d.equity > 0) ? Number(((profit / d.equity) * 100).toFixed(1)) : 0
      });
    }
    return data;
  }, [isPart1Valid, d, monthlyMortgageRepayment]);

  const graphData = useMemo(() => {
    return forecastData.filter((_, i) => i % 12 === 0 || i === 0 || i === forecastData.length - 1);
  }, [forecastData]);

  const totalYield10y = useMemo(() => {
    if (!isPart1Valid || !forecastData || forecastData.length < 120) return 0;
    return forecastData[119].yieldOnEquity;
  }, [isPart1Valid, forecastData]);

  const amortizationSchedule = useMemo(() => {
    if (!isPart1Valid) return [];
    const schedule = [];
    let remainingPrincipal = mortgageAmount;
    const months = parseInt(d.mortgagePeriod) * 12;
    const monthlyRate = (d.interest / 100) / 12;
    
    for (let i = 1; i <= 360; i++) {
      if (i > months) {
        schedule.push({
          month: i,
          startPrincipal: 0,
          interest: 0,
          repayment: 0,
          principalRepayment: 0,
          interestRepayment: 0,
          endPrincipal: 0
        });
        continue;
      }
      
      const interestRepayment = remainingPrincipal * monthlyRate;
      const principalRepayment = monthlyMortgageRepayment - interestRepayment;
      const startPrincipal = remainingPrincipal;
      remainingPrincipal -= principalRepayment;
      
      schedule.push({
        month: i,
        startPrincipal: Math.round(startPrincipal),
        interest: Number((d.interest).toFixed(2)),
        repayment: Math.round(monthlyMortgageRepayment),
        principalRepayment: Math.round(principalRepayment),
        interestRepayment: Math.round(interestRepayment),
        endPrincipal: Math.round(Math.max(0, remainingPrincipal))
      });
    }
    return schedule;
  }, [isPart1Valid, mortgageAmount, d, monthlyMortgageRepayment]);

  useEffect(() => {
    if (showTour && !isPart1Valid) {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        setIsCalculating(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showTour, isPart1Valid]);

  // Simulation of server calculation on change
  useEffect(() => {
    if (isPart1Valid || showTour) {
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
    }
  }, [d, isPart1Valid]);

  // --- Handlers ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file as File));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
      <PropertyTour 
        showTour={showTour}
        setShowTour={setShowTour}
        tourStep={tourStep}
        setTourStep={setTourStep}
        pendingTourStep={pendingTourStep}
        setPendingTourStep={setPendingTourStep}
        isCalculating={isCalculating}
        setIsCalculating={setIsCalculating}
        setIsTourEnding={setIsTourEnding}
        setViewMode={setViewMode}
        setActiveResultTab={setActiveResultTab}
        cityRef={cityRef}
        priceRef={priceRef}
        equityRef={equityRef}
        typeRef={typeRef}
        incomeRef={incomeRef}
        commitmentsRef={commitmentsRef}
        graphRef={graphRef}
      />
      <main className="w-full min-h-[600px]">
        {/* Sticky Dashboard Header - Smoother Transition */}
        <div 
          className={`sticky ${viewMode === 'results' ? 'top-0' : 'top-16'} z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-xl border-b border-slate-200' : 'bg-slate-50/80 backdrop-blur-sm border-b border-slate-100'} ${viewMode === 'results' ? 'hidden lg:block' : 'block'}`}
          style={{ 
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className={`transition-all duration-300 ${isScrolled ? 'py-1' : 'py-4'}`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
                <div className="flex items-center justify-between w-full lg:w-auto gap-4 shrink-0">
                  <ScreenHeader 
                    title="הערכת עלויות ותשואה" 
                    subtitle="ניתוח פיננסי מעמיק של הנכס"
                    isScrolled={isScrolled}
                    className="flex flex-col transition-all duration-300 ease-in-out"
                  />
                  
                  {viewMode === 'form' && (
                    <Button 
                      variant="primary" 
                      className={`lg:hidden flex items-center gap-2 !px-3 !py-1.5 rounded-xl shadow-lg transition-all ${isPart1Valid ? 'bg-blue-600 shadow-blue-200' : 'bg-slate-300 cursor-not-allowed shadow-none'}`}
                      onClick={() => isPart1Valid && setViewMode('results')}
                      disabled={!isPart1Valid}
                    >
                      <span className="text-xs font-black">ניתוח תוצאות</span>
                      <PieChart size={22} />
                    </Button>
                  )}
                </div>

                  {isPart1Valid && (
                    <PropertyMetrics 
                      totalYield10y={totalYield10y}
                      mortgageAmount={mortgageAmount}
                      actualFinancingPercent={actualFinancingPercent}
                      maxFinancingPercent={maxFinancingPercent}
                      monthlyMortgageRepayment={monthlyMortgageRepayment}
                      isScrolled={isScrolled}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Subtle spacer to prevent content overlap during transition */}
          <div className={`transition-all duration-300 ${isScrolled ? 'h-2' : 'h-0'}`} />

        <div className="max-w-7xl mx-auto px-4">
          <div className={`transition-all duration-300 ${isScrolled ? 'h-0' : 'h-6'}`} />

          {/* Part 1: Evaluation */}
          <div 
            className={`space-y-8 ${viewMode === 'form' ? 'block' : 'hidden lg:block'}`}
          >
            <PropertyForm 
              isCalculating={isCalculating}
              setIsCalculating={setIsCalculating}
              showTour={showTour}
              setShowTour={setShowTour}
              tourStep={tourStep}
              setPendingTourStep={setPendingTourStep}
              city={city}
              setCity={setCity}
              settlementName={settlementName}
              setSettlementName={setSettlementName}
              address={address}
              setAddress={setAddress}
              apartmentType={apartmentType}
              setApartmentType={setApartmentType}
              propertyPrice={propertyPrice}
              setPropertyPrice={setPropertyPrice}
              equity={equity}
              setEquity={setEquity}
              equityMinusExpenses={equityMinusExpenses}
              mortgageAmount={mortgageAmount}
              additionalInfo={additionalInfo}
              setAdditionalInfo={setAdditionalInfo}
              income={income}
              setIncome={setIncome}
              commitments={commitments}
              setCommitments={setCommitments}
              selectedFundingSources={selectedFundingSources}
              setSelectedFundingSources={setSelectedFundingSources}
              disposableIncome={disposableIncome}
              desiredRepayment={desiredRepayment}
              setDesiredRepayment={setDesiredRepayment}
              desiredRepaymentPercent={desiredRepaymentPercent}
              setDesiredRepaymentPercent={setDesiredRepaymentPercent}
              isRepaymentPercentModified={isRepaymentPercentModified}
              setIsRepaymentPercentModified={setIsRepaymentPercentModified}
              isRepaymentInputModified={isRepaymentInputModified}
              setIsRepaymentInputModified={setIsRepaymentInputModified}
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
              mortgageConsultant={mortgageConsultant}
              setMortgageConsultant={setMortgageConsultant}
              renovation={renovation}
              setRenovation={setRenovation}
              purchaseTax={purchaseTax}
              totalAdditionalExpenses={totalAdditionalExpenses}
              expectedRentPercent={expectedRentPercent}
              setExpectedRentPercent={setExpectedRentPercent}
              expectedRentValue={expectedRentValue}
              setExpectedRentValue={setExpectedRentValue}
              isRentPercentModified={isRentPercentModified}
              setIsRentPercentModified={setIsRentPercentModified}
              isRentInputModified={isRentInputModified}
              setIsRentInputModified={setIsRentInputModified}
              lifeInsurance={lifeInsurance}
              setLifeInsurance={setLifeInsurance}
              buildingInsurance={buildingInsurance}
              setBuildingInsurance={setBuildingInsurance}
              rentMinusExpenses={rentMinusExpenses}
              mortgagePeriod={mortgagePeriod}
              setMortgagePeriod={setMortgagePeriod}
              userEmail={userEmail}
              monthlyMortgageRepayment={monthlyMortgageRepayment}
              calcPossibleMonthlyRepayment={calcPossibleMonthlyRepayment}
              monthlyCashFlow={monthlyCashFlow}
              fundingSources={FINANCIAL_DEFAULTS.fundingSources}
              cityRef={cityRef}
              priceRef={priceRef}
              equityRef={equityRef}
              typeRef={typeRef}
              incomeRef={incomeRef}
              commitmentsRef={commitmentsRef}
              graphRef={graphRef}
              setIsTourEnding={setIsTourEnding}
              setViewMode={setViewMode}
              setActiveResultTab={setActiveResultTab}
              CITY_OPTIONS={CITY_OPTIONS}
              APARTMENT_TYPES={APARTMENT_TYPES}
              FINANCIAL_DEFAULTS={FINANCIAL_DEFAULTS}
              MORTGAGE_PERIODS={MORTGAGE_PERIODS}
            />

          {/* Part 1.2: Interests and Indices */}
          <PropertyInterests 
            isCalculating={isCalculating}
            interest={interest}
            setInterest={setInterest}
            interest5y={interest5y}
            setInterest5y={setInterest5y}
            interest10y={interest10y}
            setInterest10y={setInterest10y}
            avgInterestTaking={avgInterestTaking}
            setAvgInterestTaking={setAvgInterestTaking}
            avgInterestRepayment={avgInterestRepayment}
            setAvgInterestRepayment={setAvgInterestRepayment}
            index={index}
            setIndex={setIndex}
            expectedYield={expectedYield}
            setExpectedYield={setExpectedYield}
            saleCosts={saleCosts}
            setSaleCosts={setSaleCosts}
            depreciation={depreciation}
            setDepreciation={setDepreciation}
          />
        </div>

          {/* Part 2: Financial Forecast */}
          <div 
            className={`min-h-screen ${viewMode === 'results' ? 'block simulated-landscape-mobile' : 'hidden lg:block'}`}
          >
            {/* Remove rotate hint to save space and avoid confusion */}
            {!isPart1Valid ? (
              <Card className="p-12 text-center bg-slate-100 border-dashed border-2 border-slate-300">
                <Info size={48} className="mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-500">לא ניתן לחשב תחזית פיננסית</h3>
                <p className="text-slate-400 mt-2">יש למלא את כל שדות החובה בחלק הראשון כדי לראות את התחזית</p>
              </Card>
            ) : (
              <div className="space-y-0 lg:space-y-4 px-0 lg:px-4">
                {/* Mobile Results Header - Simple Back Button */}
                <div className={`lg:hidden sticky top-0 z-[10002] bg-slate-50/95 backdrop-blur-md flex items-center gap-3 py-0 px-0 border-b border-slate-200 transition-all duration-300`}>
                  <div className="flex-1 flex bg-slate-200/50 p-0.5 rounded-none">
                    <Button 
                      variant="outline"
                      className="p-2 text-blue-600 hover:bg-blue-50 border-none shadow-none focus:ring-0 active:scale-90 shrink-0 min-w-0"
                      onClick={() => setViewMode('form')}
                      ariaLabel="חזרה לעריכה"
                      icon={ChevronRight}
                      iconSize={24}
                    />
                  
                  
                    <Tab 
                      isActive={activeResultTab === 'yield'} 
                      onClick={() => setActiveResultTab('yield')}
                      icon={<PieChart size={16} />}
                      label="תשואה"
                    />
                    <Tab 
                      isActive={activeResultTab === 'amortization'} 
                      onClick={() => setActiveResultTab('amortization')}
                      icon={<List size={16} />}
                      label="סילוקין"
                    />
                    <Tab 
                      isActive={activeResultTab === 'graph'} 
                      onClick={() => setActiveResultTab('graph')}
                      icon={<LineChartIcon size={16} />}
                      label="גרף"
                    />
                  </div>
                </div>

                {/* 2.1: Expected Yield Table */}
                <PropertyYieldForecast 
                  activeResultTab={activeResultTab}
                  forecastData={forecastData}
                />

                {/* 2.2: Amortization Schedule */}
                <PropertyAmortizationSchedule 
                  activeResultTab={activeResultTab}
                  amortizationSchedule={amortizationSchedule}
                />

                {/* 2.3: Graph */}
                <PropertyChart 
                  ref={graphRef}
                  activeResultTab={activeResultTab}
                  viewMode={viewMode}
                  graphData={graphData}
                  forecastData={forecastData}
                />
              </div>
            )}
          </div>

          {/* Part 3: Images */}
          <PropertyMedia 
            viewMode={viewMode}
            isCalculating={isCalculating}
            images={images}
            removeImage={removeImage}
            handleImageUpload={handleImageUpload}
          />

          {/* Mobile Navigation Button - Bottom of Form - REMOVED per user request */}
        </div>
      </main>

    </div>
  );
};
