
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Screen } from '../types';
import { Card } from '../components/common/Card';
import { Button, Checkbox } from '../components/formFields';
import { SectionHeader } from '../components/common/SectionHeader';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { PropertyForm } from '../components/layout/PropertyForm';
import { formatCurrency, formatPercent } from '../services/utils';
import { Building2, Trash2, Filter, TrendingUp, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';

interface CompareCalculatorProps {
  onNavigate: (screen: Screen) => void;
}

interface PropertyData {
  uuid: string;
  city: string;
  settlementName: string;
  address: string;
  apartmentType: string;
  price: number;
  equity: number;
  incomes: number;
  commitments: number;
  additionalFundingSources: string[];
  note: string;
  brokerMortgage: number;
  repairing: number;
  lifeInsurance: number;
  structureInsurance: number;
  mortgagePeriod: string;
  lawyerPercent: number;
  lawyerCustomValue: number | null;
  realEstateAgentPercent: number;
  realEstateAgentCustomValue: number | null;
  rentPercent: number;
  rentCustomValue: number | null;
  desiredRepaymentPercent: number;
  desiredRepaymentValue: number | null;
}

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
  { value: 'ashdod', label: 'אשדוד' },
  { value: 'tel_aviv_yafo', label: 'תל אביב' },
  { value: 'bat_yam', label: 'בת ים' },
  { value: 'rishon_leziyyon', label: 'ראשון לציון' },
  { value: 'or_yehuda', label: 'אור יהודה' },
  { value: 'else', label: 'אחר' },
];

const APARTMENT_TYPES = [
  { value: 'single', label: 'יחידה' },
  { value: 'alternate', label: 'חליפית' },
  { value: 'investment', label: 'השקעה' },
];

const MORTGAGE_PERIODS = [
  { value: '10', label: '10 שנים' },
  { value: '15', label: '15 שנה' },
  { value: '20', label: '20 שנה' },
  { value: '25', label: '25 שנה' },
  { value: '30', label: '30 שנה' },
];

// Mock data from user request
const MOCK_PROPERTIES = [
  {
    "updateTime": "2026-03-20T10:13:13.215Z",
    "archive": false,
    "showInterestsContainer": false,
    "type": "property",
    "city": "ashdod",
    "address": "222",
    "showMortgagePrepayment": true,
    "apartmentType": "alternate",
    "lawyerCustomValue": null,
    "lawyerPercent": 0.5,
    "price": 2375000,
    "realEstateAgentCustomValue": null,
    "realEstateAgentPercent": 2.1,
    "rentCustomValue": null,
    "rentPercent": 3,
    "mortgagePeriod": 30,
    "incomes": 40001,
    "equity": 1410453,
    "commitments": 3134,
    "additionalFundingSources": ["6", "1"],
    "note": "1,187,500",
    "uuid": "40b269ba-f330-4cbd-8345-b9bbb04270d0",
    "brokerMortgage": 12345,
    "repairing": 123456,
    "lifeInsurance": 123
  },
  {
    "updateTime": "2025-08-11T16:17:50.996Z",
    "archive": false,
    "showInterestsContainer": true,
    "type": "property",
    "commitments": 5000,
    "city": "tel_aviv_yafo",
    "showMortgagePrepayment": true,
    "address": "יפו ד",
    "apartmentType": "investment",
    "lawyerCustomValue": 0,
    "lawyerPercent": 0.5,
    "price": 2150000,
    "realEstateAgentCustomValue": null,
    "realEstateAgentPercent": 3.5,
    "rentCustomValue": null,
    "rentPercent": 3,
    "equity": 1413555,
    "note": "2 חדרים ",
    "incomes": 21000,
    "brokerMortgage": 0,
    "repairing": 30000,
    "uuid": "715afc22-31d6-48ac-8552-7de0e96c7ff5"
  },
  {
    "updateTime": "2025-11-24T18:39:50.095Z",
    "archive": false,
    "showInterestsContainer": false,
    "type": "property",
    "city": "bat_yam",
    "apartmentType": "investment",
    "showMortgagePrepayment": true,
    "lawyerCustomValue": 0,
    "lawyerPercent": 0.5,
    "price": 2375000,
    "realEstateAgentCustomValue": null,
    "realEstateAgentPercent": 2,
    "rentCustomValue": null,
    "rentPercent": 3,
    "mortgagePeriod": 30,
    "note": "אופציה 1",
    "address": "מבצע סיני 4",
    "repairing": 30000,
    "brokerMortgage": 8000,
    "commitments": 3134,
    "equity": 1094000,
    "incomes": 24000,
    "additionalFundingSources": [],
    "uuid": "22c0c0c1-b1d0-4e55-b878-c060810abfb4"
  },
  {
    "updateTime": "2026-01-15T09:20:00.000Z",
    "archive": false,
    "showInterestsContainer": false,
    "type": "property",
    "city": "ashdod",
    "address": "העצמאות 10",
    "apartmentType": "investment",
    "price": 1850000,
    "equity": 600000,
    "incomes": 18000,
    "commitments": 2000,
    "uuid": "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5"
  },
  {
    "updateTime": "2026-02-10T14:45:00.000Z",
    "archive": false,
    "showInterestsContainer": false,
    "type": "property",
    "city": "rishon_leziyyon",
    "address": "הרצל 50",
    "apartmentType": "single",
    "price": 2950000,
    "equity": 1200000,
    "incomes": 35000,
    "commitments": 4500,
    "uuid": "z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4"
  }
];

interface PropertyCardProps {
  p: PropertyData;
  idx: number;
  calc: any;
  updateProperty: (uuid: string, updates: Partial<PropertyData>) => void;
  toggleProperty: (uuid: string) => void;
}

// Property Card Component for Reordering
const PropertyCard: React.FC<PropertyCardProps> = ({ 
  p, 
  idx, 
  calc, 
  updateProperty, 
  toggleProperty 
}: PropertyCardProps) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item 
      value={p.uuid}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-shrink-0 w-[85vw] sm:w-[400px] lg:w-[calc(33.333%-1rem)] lg:min-w-[400px] space-y-6 cursor-default"
    >
      <Card className="relative overflow-hidden border-t-4 border-t-blue-500">
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div 
            onPointerDown={(e) => dragControls.start(e)}
            className="cursor-grab active:cursor-grabbing p-2 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <GripVertical size={18} />
          </div>
          <button 
            onClick={() => toggleProperty(p.uuid)}
            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black">
              {idx + 1}
            </div>
            <h2 className="text-xl font-black text-slate-800 truncate">{p.address || 'נכס חדש'}</h2>
          </div>

          <PropertyForm 
            isCalculating={false}
            setIsCalculating={() => {}}
            showTour={false}
            setShowTour={() => {}}
            tourStep=""
            setPendingTourStep={() => {}}
            city={p.city}
            setCity={(val) => updateProperty(p.uuid, { city: val })}
            settlementName={p.settlementName}
            setSettlementName={(val) => updateProperty(p.uuid, { settlementName: val })}
            address={p.address}
            setAddress={(val) => updateProperty(p.uuid, { address: val })}
            apartmentType={p.apartmentType}
            setApartmentType={(val) => updateProperty(p.uuid, { apartmentType: val })}
            propertyPrice={p.price}
            setPropertyPrice={(val) => updateProperty(p.uuid, { price: val === '' ? 0 : val })}
            equity={p.equity}
            setEquity={(val) => updateProperty(p.uuid, { equity: val })}
            equityMinusExpenses={calc.equityMinusExpenses}
            mortgageAmount={calc.mortgageRequired}
            additionalInfo={p.note}
            setAdditionalInfo={(val) => updateProperty(p.uuid, { note: val })}
            income={p.incomes}
            setIncome={(val) => updateProperty(p.uuid, { incomes: val })}
            commitments={p.commitments}
            setCommitments={(val) => updateProperty(p.uuid, { commitments: val })}
            selectedFundingSources={p.additionalFundingSources}
            setSelectedFundingSources={(val) => updateProperty(p.uuid, { additionalFundingSources: val })}
            disposableIncome={calc.disposableIncome}
            desiredRepayment={p.desiredRepaymentValue || Math.round(calc.disposableIncome * 0.33)}
            setDesiredRepayment={(val) => updateProperty(p.uuid, { desiredRepaymentValue: val })}
            desiredRepaymentPercent={p.desiredRepaymentPercent}
            setDesiredRepaymentPercent={(val) => updateProperty(p.uuid, { desiredRepaymentPercent: val })}
            isRepaymentPercentModified={p.desiredRepaymentPercent !== 33}
            setIsRepaymentPercentModified={() => {}}
            isRepaymentInputModified={p.desiredRepaymentValue !== null}
            setIsRepaymentInputModified={() => {}}
            actualFinancingPercent={calc.actualFinancingPercent}
            maxFinancingPercent={calc.maxFinancingPercent}
            lawyerPercent={p.lawyerPercent}
            setLawyerPercent={(val) => updateProperty(p.uuid, { lawyerPercent: val })}
            lawyerValue={p.lawyerCustomValue !== null ? p.lawyerCustomValue : Math.round(p.price * (p.lawyerPercent / 100))}
            setLawyerValue={(val) => updateProperty(p.uuid, { lawyerCustomValue: val })}
            isLawyerPercentModified={p.lawyerPercent !== 0.5}
            setIsLawyerPercentModified={() => {}}
            isLawyerInputModified={p.lawyerCustomValue !== null}
            setIsLawyerInputModified={() => {}}
            realtorPercent={p.realEstateAgentPercent}
            setRealtorPercent={(val) => updateProperty(p.uuid, { realEstateAgentPercent: val })}
            realtorValue={p.realEstateAgentCustomValue !== null ? p.realEstateAgentCustomValue : Math.round(p.price * (p.realEstateAgentPercent / 100))}
            setRealtorValue={(val) => updateProperty(p.uuid, { realEstateAgentCustomValue: val })}
            isRealtorPercentModified={p.realEstateAgentPercent !== 2}
            setIsRealtorPercentModified={() => {}}
            isRealtorInputModified={p.realEstateAgentCustomValue !== null}
            setIsRealtorInputModified={() => {}}
            mortgageConsultant={p.brokerMortgage}
            setMortgageConsultant={(val) => updateProperty(p.uuid, { brokerMortgage: val })}
            renovation={p.repairing}
            setRenovation={(val) => updateProperty(p.uuid, { repairing: val })}
            purchaseTax={calc.purchaseTax}
            totalAdditionalExpenses={calc.totalExpenses}
            expectedRentPercent={p.rentPercent}
            setExpectedRentPercent={(val) => updateProperty(p.uuid, { rentPercent: val })}
            expectedRentValue={p.rentCustomValue !== null ? p.rentCustomValue : Math.round(p.price * (p.rentPercent / 100) / 12)}
            setExpectedRentValue={(val) => updateProperty(p.uuid, { rentCustomValue: val })}
            isRentPercentModified={p.rentPercent !== 3}
            setIsRentPercentModified={() => {}}
            isRentInputModified={p.rentCustomValue !== null}
            setIsRentInputModified={() => {}}
            lifeInsurance={p.lifeInsurance}
            setLifeInsurance={(val) => updateProperty(p.uuid, { lifeInsurance: val })}
            buildingInsurance={p.structureInsurance}
            setBuildingInsurance={(val) => updateProperty(p.uuid, { structureInsurance: val })}
            rentMinusExpenses={calc.rentMinusExpenses}
            mortgagePeriod={p.mortgagePeriod}
            setMortgagePeriod={(val) => updateProperty(p.uuid, { mortgagePeriod: val })}
            monthlyMortgageRepayment={calc.monthlyRepayment}
            calcPossibleMonthlyRepayment={calc.disposableIncome * 0.4}
            monthlyCashFlow={calc.monthlyCashFlow}
            fundingSources={FINANCIAL_DEFAULTS.fundingSources}
            forceColumnLayout={true}
            isCompact={true}
            cityRef={{ current: null }}
            priceRef={{ current: null }}
            equityRef={{ current: null }}
            typeRef={{ current: null }}
            incomeRef={{ current: null }}
            commitmentsRef={{ current: null }}
            graphRef={{ current: null }}
            setIsTourEnding={() => {}}
            setViewMode={() => {}}
            setActiveResultTab={() => {}}
            CITY_OPTIONS={CITY_OPTIONS}
            APARTMENT_TYPES={APARTMENT_TYPES}
            FINANCIAL_DEFAULTS={FINANCIAL_DEFAULTS}
            MORTGAGE_PERIODS={MORTGAGE_PERIODS}
          />

          <div className="pt-6 border-t border-slate-100 space-y-4 bg-slate-50 -mx-6 -mb-6 p-6">
            <SectionHeader title="תשואה מוערכת לאחר 10 שנים" icon={<TrendingUp size={16}/>} variant="emerald" />
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">תשואה שנתית כוללת</span>
                <span className="font-black text-blue-600">{formatPercent(calc.annualYieldTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">תשואה שנתית להון</span>
                <span className="font-black text-indigo-600">{formatPercent(calc.annualYieldEquity)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">רווח כולל</span>
                <span className="font-black text-slate-800">{formatCurrency(calc.totalProfit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">רווח כולל מהוון</span>
                <span className="font-black text-slate-800">{formatCurrency(calc.discountedProfit)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Reorder.Item>
  );
};

export const CompareCalculator: React.FC<CompareCalculatorProps> = ({ onNavigate }) => {
  const [selectedUUIDs, setSelectedUUIDs] = useState<string[]>(MOCK_PROPERTIES.slice(0, 3).map(p => p.uuid));
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const chipRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});
  const filterRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  useEffect(() => {
    if (isFilterOpen) {
      const activeKey = cityFilter || 'all';
      const activeChip = chipRefs.current[activeKey];
      if (activeChip) {
        activeChip.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [cityFilter, isFilterOpen]);

  // Initialize properties from mock data
  useEffect(() => {
    const initialProperties = MOCK_PROPERTIES.map(p => ({
      uuid: p.uuid,
      city: p.city || 'ashdod',
      settlementName: '',
      address: p.address || '',
      apartmentType: p.apartmentType || 'investment',
      price: p.price || 0,
      equity: p.equity || FINANCIAL_DEFAULTS.equity,
      incomes: p.incomes || FINANCIAL_DEFAULTS.income,
      commitments: p.commitments || FINANCIAL_DEFAULTS.commitments,
      additionalFundingSources: p.additionalFundingSources || [],
      note: p.note || '',
      brokerMortgage: p.brokerMortgage || 0,
      repairing: p.repairing || 0,
      lifeInsurance: p.lifeInsurance || 0,
      structureInsurance: 70,
      mortgagePeriod: (p.mortgagePeriod || 30).toString(),
      lawyerPercent: p.lawyerPercent || 0.5,
      lawyerCustomValue: p.lawyerCustomValue || null,
      realEstateAgentPercent: p.realEstateAgentPercent || 2,
      realEstateAgentCustomValue: p.realEstateAgentCustomValue || null,
      rentPercent: p.rentPercent || 3,
      rentCustomValue: p.rentCustomValue || null,
      desiredRepaymentPercent: 33,
      desiredRepaymentValue: null,
    }));
    setProperties(initialProperties);
  }, []);

  const selectedProperties = useMemo(() => {
    return selectedUUIDs
      .map(uuid => properties.find(p => p.uuid === uuid))
      .filter((p): p is PropertyData => !!p);
  }, [properties, selectedUUIDs]);

  const availableCities = useMemo(() => {
    const citiesInList = new Set(properties.map(p => p.city));
    return CITY_OPTIONS.filter(opt => citiesInList.has(opt.value));
  }, [properties]);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      // In RTL, scrollLeft is 0 at the right edge and becomes negative as you scroll left
      setShowRightArrow(scrollLeft < 0);
      setShowLeftArrow(Math.abs(scrollLeft) < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [selectedProperties.length]);

  useEffect(() => {
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredPropertiesForSelection = useMemo(() => {
    if (!cityFilter) return properties;
    return properties.filter(p => p.city === cityFilter);
  }, [properties, cityFilter]);

  const updateProperty = (uuid: string, updates: Partial<PropertyData>) => {
    setProperties(prev => prev.map(p => p.uuid === uuid ? { ...p, ...updates } : p));
  };

  const toggleProperty = (uuid: string) => {
    setSelectedUUIDs(prev => {
      if (prev.includes(uuid)) {
        return prev.filter(id => id !== uuid);
      }
      if (prev.length >= 3) return prev;
      return [...prev, uuid];
    });
  };

  // Calculation Logic for a single property
  const calculateProperty = (p: PropertyData) => {
    const additionalFundingAmount = FINANCIAL_DEFAULTS.fundingSources
      .filter(s => p.additionalFundingSources.includes(s.id))
      .reduce((sum, s) => sum + s.amount, 0);
    
    const additionalFundingRepayment = FINANCIAL_DEFAULTS.fundingSources
      .filter(s => p.additionalFundingSources.includes(s.id))
      .reduce((sum, s) => sum + s.monthlyRepayment, 0);

    const disposableIncome = p.incomes - p.commitments - additionalFundingRepayment;
    
    const lawyerValue = p.lawyerCustomValue !== null ? p.lawyerCustomValue : Math.round(p.price * (p.lawyerPercent / 100));
    const realtorValue = p.realEstateAgentCustomValue !== null ? p.realEstateAgentCustomValue : Math.round(p.price * (p.realEstateAgentPercent / 100));
    
    // Purchase Tax Mock
    let purchaseTax = 0;
    if (p.apartmentType === 'investment') purchaseTax = p.price * 0.08;
    else if (p.price > 1900000) purchaseTax = (p.price - 1900000) * 0.035;

    const totalExpenses = purchaseTax + lawyerValue + realtorValue + p.brokerMortgage + p.repairing;
    const equityMinusExpenses = p.equity + additionalFundingAmount - totalExpenses;
    const mortgageRequired = Math.max(0, p.price - equityMinusExpenses);

    const maxFinancingPercent = p.apartmentType === 'single' ? 75 : p.apartmentType === 'alternate' ? 70 : 50;
    const actualFinancingPercent = p.price > 0 ? (mortgageRequired / p.price) * 100 : 0;

    const rentValue = p.rentCustomValue !== null ? p.rentCustomValue : Math.round(p.price * (p.rentPercent / 100) / 12);
    const rentMinusExpenses = rentValue - p.lifeInsurance - p.structureInsurance;

    // Monthly Repayment Mock (using 4.5% interest)
    const months = parseInt(p.mortgagePeriod) * 12;
    const monthlyRate = 0.045 / 12;
    const monthlyRepayment = months > 0 ? (mortgageRequired * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1) : 0;

    const monthlyCashFlow = rentMinusExpenses - monthlyRepayment;
    const monthlyYield = p.equity > 0 ? (monthlyCashFlow * 12 / p.equity) * 100 : 0;

    // Advanced Yields (Mocked for now as requested)
    const yield10y = 45.5; // Example
    const annualYieldTotal = 5.2;
    const annualYieldEquity = 8.4;
    const totalProfit = 850000;
    const discountedProfit = 620000;

    return {
      disposableIncome,
      mortgageRequired,
      equityMinusExpenses,
      maxFinancingPercent,
      actualFinancingPercent,
      purchaseTax,
      totalExpenses,
      rentValue,
      rentMinusExpenses,
      monthlyRepayment,
      monthlyYield,
      monthlyCashFlow,
      yield10y,
      annualYieldTotal,
      annualYieldEquity,
      totalProfit,
      discountedProfit
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right pb-20" dir="rtl">
      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="flex flex-row items-center justify-between gap-2 mb-8">
          <ScreenHeader 
            title="השוואת נכסים" 
            subtitle="השוואה חכמה בין נכסים נבחרים"
            className="shrink-0 scale-90 origin-right sm:scale-100 translate-y-[6px]"
          />

          <div className="relative" ref={filterRef}>
            <Button 
              variant="outline" 
              className="bg-white border-slate-200 shadow-sm px-2 mb-0 mt-4 sm:px-4 py-2 text-sm sm:text-base whitespace-nowrap"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              icon={Filter}
            >
              נכסים ({selectedUUIDs.length}/3)
            </Button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-[60]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-black text-slate-800">בחר נכסים</span>
                    <span className="text-xs text-slate-400">{selectedUUIDs.length}/3 נבחרו</span>
                  </div>

                  {/* City Filter Chips */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar no-scrollbar scroll-smooth px-4 -mx-4">
                    <button
                      ref={el => chipRefs.current['all'] = el}
                      onClick={() => setCityFilter(null)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${!cityFilter ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      הכל
                    </button>
                    {availableCities.map(city => (
                      <button
                        key={city.value}
                        ref={el => chipRefs.current[city.value] = el}
                        onClick={() => setCityFilter(city.value)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${cityFilter === city.value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {city.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar px-2 pl-4 py-2">
                    {filteredPropertiesForSelection.map(p => (
                      <div 
                        key={p.uuid}
                        className={`flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer ${selectedUUIDs.includes(p.uuid) ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                        onClick={() => toggleProperty(p.uuid)}
                      >
                        <Checkbox 
                          checked={selectedUUIDs.includes(p.uuid)} 
                          onChange={() => toggleProperty(p.uuid)}
                          disabled={!selectedUUIDs.includes(p.uuid) && selectedUUIDs.length >= 3}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-700 truncate">{p.address || 'ללא כתובת'}</div>
                          <div className="text-xs text-slate-400 truncate">{CITY_OPTIONS.find(c => c.value === p.city)?.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    סגור
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {selectedProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Building2 size={40} className="text-slate-300" />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">לא נבחרו נכסים להשוואה</h2>
            <p className="text-slate-500 mb-8">בחרו עד 3 נכסים מהרשימה כדי להתחיל בהשוואה</p>
            <Button onClick={() => setIsFilterOpen(true)}>בחר נכסים עכשיו</Button>
          </div>
        ) : (
        <div className="relative group">
          {/* Navigation Arrows (Sticky to Viewport Center) */}
          <div className="sticky top-1/2 -translate-y-1/2 h-0 z-50 pointer-events-none">
            <div className="absolute left-2 top-0 -translate-y-1/2 pointer-events-auto">
              <AnimatePresence>
                {showLeftArrow && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => scroll('left')}
                    className="w-12 h-12 bg-white/95 backdrop-blur shadow-2xl rounded-2xl flex items-center justify-center text-blue-600 border-2 border-blue-50/50 hover:bg-blue-50/10 transition-all transform active:scale-95"
                    aria-label="גלול שמאלה"
                  >
                    <ChevronLeft size={28} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute right-2 top-0 -translate-y-1/2 pointer-events-auto">
              <AnimatePresence>
                {showRightArrow && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => scroll('right')}
                    className="w-12 h-12 bg-white/95 backdrop-blur shadow-2xl rounded-2xl flex items-center justify-center text-blue-600 border-2 border-blue-50/50 hover:bg-blue-50/10 transition-all transform active:scale-95"
                    aria-label="גלול ימינה"
                  >
                    <ChevronRight size={28} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Edge overlays for better scroll feedback */}
          <div className={`absolute top-0 right-0 bottom-8 w-20 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-30 transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute top-0 left-0 bottom-8 w-20 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-30 transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`} />

          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto pb-8 -mx-4 px-4 custom-scrollbar scroll-smooth"
          >
            <Reorder.Group 
              axis="x" 
              values={selectedUUIDs} 
              onReorder={setSelectedUUIDs}
              className="flex flex-row flex-nowrap gap-6 items-start min-w-full"
            >
              {selectedProperties.map((p, idx) => (
                <PropertyCard 
                  key={p.uuid}
                  p={p}
                  idx={idx}
                  calc={calculateProperty(p)}
                  updateProperty={updateProperty}
                  toggleProperty={toggleProperty}
                />
              ))}
            </Reorder.Group>
          </div>
        </div>
        )}
      </main>
    </div>
  );
};
