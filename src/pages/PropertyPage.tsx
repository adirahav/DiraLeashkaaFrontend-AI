import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScrolled } from '../hooks/useScrolled';
import { CloudinaryMediaNode, PropertyData, PropertyFundingSource } from '../types/property.types';
import { Card } from '../components/common/Card';
import { Button } from '../components/formFields';
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
import { useStore } from '../store/store';
import { propertyService } from '../services/property.service';
import { useSplash } from '../hooks/useSplash';
import { buildDefaultProperty } from '../store/slices/property.slice';
import { Info, PieChart, ChevronRight, List, LineChart as LineChartIcon } from 'lucide-react';
import { useNativeBackButton } from '../hooks/useNativeBackButton';


function parseIfString(val: any): any {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
}

// Backend field mapping:
//   incomes / commitments           → frontend editable value (defaultIncomes / defaultCommitments)
//   defaultIncomes / defaultCommitments → user profile default (rollback target in calcIncomes / calcCommitments)
//   additionalFundingSources        → must come from user profile, not server response
//   calcAdditionalFunding.sources   → IDs of sources selected for this property
function toFloat(val: any): number | undefined {
  if (val == null) return undefined;
  const n = parseFloat(val);
  return isNaN(n) ? undefined : n;
}

function normalizePropertyResponse(data: any, localSources: PropertyFundingSource[]): any {
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
    calcYieldForecast: parseIfString(data.calcYieldForecast),
    calcAmortizationSchedule: parseIfString(data.calcAmortizationSchedule),
  };
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const PropertyPage: React.FC = () => {
  // --- Splash ---
  const { params, isReady: splashReady, getPhrase } = useSplash();
  const defaultRepaymentPercent = useMemo(() => {
    try {
      const raw = (params as Record<string, unknown>)['propertyInputs'];
      if (!raw) return 33;
      const arr: { name: string; default?: number | null }[] = typeof raw === 'string' ? JSON.parse(raw) : (raw as any);
      return arr.find((p) => p.name === 'possibleMonthlyRepaymentPercent')?.default ?? 33;
    } catch {
      return 33;
    }
  }, [params]);

  const defaultApartmentType = useMemo(() => {
    try {
      const raw = (params as Record<string, unknown>)['apartmentTypes'];
      if (!raw) return 'single';
      const arr: { key: string; value: string }[] = typeof raw === 'string' ? JSON.parse(raw) : (raw as any);
      return arr.find((c) => c.key !== 'choose')?.key ?? 'single';
    } catch {
      return 'single';
    }
  }, [params]);

  // --- Store ---
  const showTour = useStore((state) => state.showTour);
  const setShowTour = useStore((state) => state.setShowTour);
  const setIsResultsMode = useStore((state) => state.setIsResultsMode);
  const loggedinUser = useStore((state) => state.loggedinUser);
  const logout = useStore((state) => state.logout);
  const currentProperty = useStore((state) => state.currentProperty);
  const isCalculating = useStore((state) => state.isCalculating);
  const setField = useStore((state) => state.setField);
  const setFields = useStore((state) => state.setFields);
  const setCurrentProperty = useStore((state) => state.setCurrentProperty);
  const initProperty = useStore((state) => state.initProperty);
  const setCalculating = useStore((state) => state.setCalculating);

  // --- Route ---
  const { id: propertyUUID } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- UI State ---
  const [isReady, setIsReady] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'results'>('form');

  useNativeBackButton(() => {
    if (viewMode === 'results') {
      setViewMode('form')
    } else {
      navigate('/home')
    }
  });
  const [activeResultTab, setActiveResultTab] = useState<'yield' | 'amortization' | 'graph'>('yield');
  const [isTourEnding, setIsTourEnding] = useState(false);
  const [tourStep, setTourStep] = useState<'CITY' | 'PRICE' | 'EQUITY' | 'TYPE' | 'INCOME' | 'COMMITMENTS'>('CITY');
  const [pendingTourStep, setPendingTourStep] = useState<'CITY' | 'PRICE' | 'EQUITY' | 'TYPE' | 'INCOME' | 'COMMITMENTS' | null>(null);

  const cityRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const equityRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const incomeRef = useRef<HTMLDivElement>(null);
  const commitmentsRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const lastFocusedId = useRef<string | null>(null);
  const isInitialLoad = useRef(true);
  const showTourRef = useRef(showTour);

  const isScrolled = useScrolled();

  const loggedinUserCalcAge = loggedinUser?.yearOfBirth
    ? new Date().getFullYear() - parseInt(loggedinUser.yearOfBirth)
    : 0;

  // --- Initialization ---
  // isReady gates all rendering so the previous session's currentProperty
  // is never painted before fresh data is in the store.
  useEffect(() => {
    let cancelled = false;

    setIsReady(false);
    isInitialLoad.current = true;

    if (!loggedinUser) {
      navigate('/login');
      return;
    }

    if (!splashReady) return;

    if (propertyUUID) {
      if (useStore.getState().currentProperty?.uuid === propertyUUID) {
        console.log(`[PROPERTY] Property ${propertyUUID} already in store, skipping fetch`)
        isInitialLoad.current = false;
        setIsReady(true);
        return;
      }

      console.log(`[PROPERTY] Fetching property: ${propertyUUID}`)
      setCalculating(true);
      propertyService
        .getById(propertyUUID)
        .then((data) => {
          if (cancelled) return;
          console.log(`[PROPERTY] Property loaded: ${propertyUUID}`)
          const local = useStore.getState().currentProperty;
          const userSources = local?.additionalFundingSources ?? buildDefaultProperty(loggedinUser, params as Record<string, unknown>).additionalFundingSources;
          setCurrentProperty({
            ...normalizePropertyResponse(data, userSources),
            apartmentType: data.apartmentType || local?.apartmentType || '',
            loggedinUserCalcAge,
            updatedByField: undefined,
          });
          setCalculating(false);
          isInitialLoad.current = false;
          setIsReady(true);
        })
        .catch((err) => {
          if (cancelled) return;
          setCalculating(false);
          if (err?.response?.status === 403) {
            console.log(`[PROPERTY] 403 on property fetch, logging out`)
            logout().then(() => navigate('/login'));
          } else {
            navigate('/home');
          }
        });
    } else {
      console.log(`[PROPERTY] Initializing new property for user: ${loggedinUser.email}`)
      initProperty(loggedinUser, params as Record<string, unknown>);
      isInitialLoad.current = false;
      setIsReady(true);
    }

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyUUID, splashReady]);

  // Keep showTourRef in sync so the auto-save can check tour state without
  // adding showTour to the effect's deps (which would cause spurious re-runs).
  useEffect(() => { showTourRef.current = showTour; }, [showTour]);

  // --- Auto-save (debounced) ---
  const debouncedProperty = useDebounce(currentProperty, 1000);

  useEffect(() => {
    if (isInitialLoad.current) return;
    if (!debouncedProperty?.updatedByField) return;
    if (useStore.getState().showTour) return; // during tour, saves are triggered by the Next Step button

    let cancelled = false;

    const { uuid, updatedByField } = debouncedProperty;
    const fieldValue = (debouncedProperty as Record<string, any>)[updatedByField];

    const activeEl = document.activeElement;
    if (activeEl?.id && activeEl !== document.body) {
      lastFocusedId.current = activeEl.id;
    }

    console.log(`[PROPERTY] Auto-save debounced: field=${updatedByField}, uuid=${uuid ?? 'new'}`)
    setCalculating(true);

    const doSave = uuid
      ? propertyService.save(uuid, updatedByField, fieldValue)
      : propertyService.create(updatedByField, fieldValue, {
          apartmentType: debouncedProperty?.apartmentType || defaultApartmentType,
        });

    doSave
      .then((updated) => {
        if (cancelled) return;
        const local = useStore.getState().currentProperty;
        const userSources = local?.additionalFundingSources ?? buildDefaultProperty(loggedinUser, params as Record<string, unknown>).additionalFundingSources;
        setCurrentProperty({
          ...normalizePropertyResponse(updated, userSources),
          apartmentType: updated.apartmentType || local?.apartmentType || '',
          loggedinUserCalcAge,
          updatedByField: undefined,
        });
        setCalculating(false);
        if (!uuid && updated.uuid) {
          console.log(`[PROPERTY] New property created with uuid: ${updated.uuid}`)
          navigate(`/property/${updated.uuid}`, { replace: true });
        }
        if (lastFocusedId.current) {
          const id = lastFocusedId.current;
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
              el.focus();
              const supportsSelection =
                el instanceof HTMLTextAreaElement ||
                (el instanceof HTMLInputElement && !['range', 'number', 'checkbox', 'radio', 'file', 'date'].includes(el.type));
              if (supportsSelection) {
                const len = el.value.length;
                el.setSelectionRange(len, len);
              }
            }
          }, 50);
        }
      })
      .catch(() => { if (!cancelled) setCalculating(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedProperty]);

  // --- UI side effects ---
  useEffect(() => {
    setIsResultsMode(viewMode === 'results');
  }, [viewMode, setIsResultsMode]);

  useEffect(() => {
    const shouldLock = showTour || (viewMode === 'results' && window.innerWidth < 1024);
    document.body.style.overflow = shouldLock ? 'hidden' : 'unset';
    document.documentElement.style.overflow = shouldLock ? 'hidden' : 'unset';
    document.body.style.touchAction = shouldLock ? 'none' : 'unset';
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

  useEffect(() => {
    const scrollToTop = () => {
      if (isTourEnding) return;
      window.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
    };
    scrollToTop();
    const timer = setTimeout(() => {
      scrollToTop();
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    }, 100);
    return () => clearTimeout(timer);
  }, [viewMode, activeResultTab, isTourEnding]);

  useEffect(() => {
    if (showTour && !isPart1Valid) {
      setCalculating(true);
      const timer = setTimeout(() => setCalculating(false), 800);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTour]);

  // --- Tour save: fires on Next Step button press instead of debounce ---
  // Does NOT call setCalculating — PropertyTour's handleNext manages that state.
  const handleTourSave = useCallback(() => {
    if (isInitialLoad.current) return;
    const prop = useStore.getState().currentProperty;
    if (!prop?.updatedByField) return;
    const { uuid, updatedByField } = prop;
    const fieldValue = (prop as Record<string, any>)[updatedByField];
    const doSave = uuid
      ? propertyService.save(uuid, updatedByField, fieldValue)
      : propertyService.create(updatedByField, fieldValue, {
          apartmentType: prop.apartmentType || defaultApartmentType,
        });
    doSave.then((updated) => {
      const local = useStore.getState().currentProperty;
      if (!local) return;
      const userSources = local.additionalFundingSources ?? buildDefaultProperty(loggedinUser, params as Record<string, unknown>).additionalFundingSources;
      // Merge server-computed values (calc* fields, forecasts, etc.) but re-apply all
      // user-entered fields from local state. Without this, e.g. the TYPE step response
      // returns price=0 and stomps the price the user already typed on the next step.
      setCurrentProperty({
        ...normalizePropertyResponse(updated, userSources),
        loggedinUserCalcAge,
        // Re-apply every user-editable field from local state
        city: local.city,
        cityElse: local.cityElse,
        address: local.address,
        apartmentType: local.apartmentType,
        price: local.price,
        note: local.note,
        calcEquity: local.calcEquity,
        defaultIncomes: local.defaultIncomes,
        defaultCommitments: local.defaultCommitments,
        calcMortgagePeriod: local.calcMortgagePeriod,
        possibleMonthlyRepaymentPercent: local.possibleMonthlyRepaymentPercent,
        possibleMonthlyRepaymentCustomValue: local.possibleMonthlyRepaymentCustomValue,
        lawyerPercent: local.lawyerPercent,
        lawyerCustomValue: local.lawyerCustomValue,
        realEstateAgentPercent: local.realEstateAgentPercent,
        realEstateAgentCustomValue: local.realEstateAgentCustomValue,
        rentPercent: local.rentPercent,
        rentCustomValue: local.rentCustomValue,
        calcBrokerMortgage: local.calcBrokerMortgage,
        calcRepairing: local.calcRepairing,
        calcLifeInsurance: local.calcLifeInsurance,
        calcStructureInsurance: local.calcStructureInsurance,
        selectedFundingSourceIds: local.selectedFundingSourceIds,
        additionalFundingSources: local.additionalFundingSources,
        media: local.media,
        uuid: updated.uuid ?? local.uuid,
        updatedByField: undefined,
      });
      if (!uuid && updated.uuid) {
        navigate(`/property/${updated.uuid}`, { replace: true });
      }
    }).catch(() => {});
  }, [defaultApartmentType, loggedinUser, loggedinUserCalcAge, params, navigate, setCurrentProperty]);

  // --- Field update handler (thin wrapper for multi-field rollback cases) ---
  const handleFieldUpdate = useCallback(
    (field: string, value: any) => {
      switch (field) {
        case 'possibleMonthlyRepaymentCustomValue':
          if (value === null) {
            setFields({ possibleMonthlyRepaymentCustomValue: null, possibleMonthlyRepaymentPercent: defaultRepaymentPercent }, field);
          } else {
            setField(field, value);
          }
          break;
        case 'lawyerCustomValue':
          if (value === null) {
            setFields({ lawyerCustomValue: null, lawyerPercent: 0.5 }, field);
          } else {
            setField(field, value);
          }
          break;
        case 'realEstateAgentCustomValue':
          if (value === null) {
            setFields({ realEstateAgentCustomValue: null, realEstateAgentPercent: 2 }, field);
          } else {
            setField(field, value);
          }
          break;
        case 'rentCustomValue':
          if (value === null) {
            setFields({ rentCustomValue: null, rentPercent: 3 }, field);
          } else {
            setField(field, value);
          }
          break;
        default:
          setField(field, value);
      }
    },
    [setField, setFields],
  );

  // --- Media handlers ---
  const handleMediaUpload = useCallback(
    (node: CloudinaryMediaNode) => {
      const updated = [...(currentProperty?.media || []), node];
      setField('media', updated);
    },
    [currentProperty?.media, setField],
  );

  const handleMediaRemove = useCallback(
    (publicId: string) => {
      const updated = (currentProperty?.media || []).filter((item) => item.publicId !== publicId);
      setField('media', updated);
    },
    [currentProperty?.media, setField],
  );

  const isPart1Valid = useMemo(
    () =>
      (currentProperty?.apartmentType ?? '') !== '' &&
      currentProperty?.price !== '' &&
      Number(currentProperty?.price) > 0 &&
      Number(currentProperty?.calcEquity) > 0 &&
      Number(currentProperty?.defaultIncomes) > 0 &&
      (currentProperty?.calcMortgagePeriod ?? '') !== '',
    [currentProperty],
  );

  const canAdvanceTour = useMemo(() => {
    if (!currentProperty) return false;
    switch (tourStep) {
      case 'CITY':   return !!currentProperty.city;
      case 'PRICE':  return !!currentProperty.price && Number(currentProperty.price) > 0;
      case 'EQUITY': return Number(currentProperty.calcEquity) > 0;
      case 'TYPE':   return !!currentProperty.apartmentType;
      case 'INCOME': return Number(currentProperty.defaultIncomes) > 0;
      case 'COMMITMENTS': return true; // commitments can legitimately be 0
      default: return true;
    }
  }, [tourStep, currentProperty]);

  // totalYield10y from server-computed forecast (index 119 = end of year 10)
  const totalYield10y = useMemo(() => {
    const forecast = currentProperty?.calcYieldForecast;
    if (!forecast || forecast.length < 120) return 0;
    return forecast[119].returnOnEquity;
  }, [currentProperty?.calcYieldForecast]);

  // Yearly-filtered graph data derived from server forecast
  const graphData = useMemo(() => {
    const forecast = currentProperty?.calcYieldForecast;
    if (!forecast) return [];
    return forecast.filter(
      (_, i) => i % 12 === 0 || i === 0 || i === forecast.length - 1,
    );
  }, [currentProperty?.calcYieldForecast]);

  // --- Property view-model for child components ---
  const property: PropertyData = useMemo(
    () => ({
      ...(currentProperty ?? buildDefaultProperty(loggedinUser, params as Record<string, unknown>)),
      loggedinUserCalcAge,
    }),
    [currentProperty, loggedinUser, loggedinUserCalcAge],
  );

  const mortgageAmount = property.calcMortgageRequired ?? 0;
  const actualFinancingPercent = property.calcActualPercentOfFinancing ?? 0;
  const maxFinancingPercent = property.calcMaxPercentOfFinancing ?? 75;
  const monthlyMortgageRepayment = property.calcMortgageMonthlyRepayment ?? 0;

  if (!isReady) return <div className="min-h-screen bg-slate-50" />;

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
        setIsCalculating={setCalculating}
        setIsTourEnding={setIsTourEnding}
        onStepSave={handleTourSave}
        canAdvance={canAdvanceTour}
        cityRef={cityRef}
        priceRef={priceRef}
        equityRef={equityRef}
        typeRef={typeRef}
        incomeRef={incomeRef}
        commitmentsRef={commitmentsRef}
        graphRef={graphRef}
      />

      <main className="w-full min-h-[600px]">
        {/* Sticky Dashboard Header */}
        <div
          className={`sticky ${viewMode === 'results' ? 'top-0' : 'top-16'} z-40 transition-all duration-300 ${
            isScrolled
              ? 'bg-white shadow-xl border-b border-slate-200'
              : 'bg-slate-50/80 backdrop-blur-sm border-b border-slate-100'
          } ${viewMode === 'results' ? 'hidden lg:block' : 'block'}`}
          style={{ transition: 'all 0.3s ease-in-out' }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className={`transition-all duration-300 ${isScrolled ? 'py-1' : 'py-4'}`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
                <div className="flex items-center justify-between w-full lg:w-auto gap-4 shrink-0">
                  <ScreenHeader
                    title={getPhrase('cost_and_return_assessment_title', 'Cost and Return Assessment')}
                    subtitle={getPhrase('cost_and_return_assessment_subtitle', 'In-depth financial analysis of the property')}
                    isScrolled={isScrolled}
                    isAbsolute={false}
                  />

                  {viewMode === 'form' && (
                    <Button
                      variant="primary"
                      className={`lg:hidden flex items-center gap-2 !px-3 !py-1.5 rounded-xl shadow-lg transition-all ${
                        isPart1Valid
                          ? 'bg-blue-600 shadow-blue-200'
                          : 'bg-slate-300 cursor-not-allowed shadow-none'
                      }`}
                      onClick={() => isPart1Valid && setViewMode('results')}
                      disabled={!isPart1Valid}
                    >
                      <span className="text-xs font-black">{getPhrase('analysis_of_results_title', 'Analysis of Results')}</span>
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
          <div className={`transition-all duration-300 ${isScrolled ? 'h-2' : 'h-0'}`} />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className={`transition-all duration-300 ${isScrolled ? 'h-0' : 'h-6'}`} />

          {/* Part 1: Form */}
          <div className={`space-y-8 ${viewMode === 'form' ? 'block' : 'hidden lg:block'}`}>
            <PropertyForm
              property={property}
              onUpdate={handleFieldUpdate}
              isCalculating={isCalculating}
              showTour={showTour}
              tourStep={tourStep}
              cityRef={cityRef}
              priceRef={priceRef}
              equityRef={equityRef}
              typeRef={typeRef}
              incomeRef={incomeRef}
              commitmentsRef={commitmentsRef}
            />

            {property.showMortgagePrepayment && property.uuid && (
              <PropertyInterests
                property={property}
                isCalculating={isCalculating}
                onUpdate={handleFieldUpdate}
              />
            )}
          </div>

          {/* Part 2: Financial Results */}
          <div
            className={`${isPart1Valid ? 'lg:min-h-screen' : ''} mt-0 ${
              viewMode === 'results' ? 'block simulated-landscape-mobile' : 'hidden lg:block'
            }`}
          >
            {!isPart1Valid ? (
              <Card className="p-12 text-center bg-slate-100 border-dashed border-2 border-slate-300">
                <Info size={48} className="mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-500">{getPhrase('analysis_of_results_unable_calculate', 'Cannot calculate financial forecast')}</h3>
                <p className="text-slate-400 mt-2">
                  {getPhrase('analysis_of_results_all_fields_required', 'Fill in all required fields in the first section to see the forecast')}
                </p>
              </Card>
            ) : (
              <div className="space-y-0 lg:space-y-4 px-0 lg:px-4">
                {/* Mobile Results Header */}
                <div className="lg:hidden sticky top-0 z-[10002] bg-slate-50/95 backdrop-blur-md flex items-center gap-3 py-0 px-0 border-b border-slate-200 transition-all duration-300">
                  <div className="flex-1 flex bg-slate-200/50 p-0.5 rounded-none">
                    <Button
                      variant="outline"
                      className="p-2 text-blue-600 hover:bg-blue-50 border-none shadow-none focus:ring-0 active:scale-90 shrink-0 min-w-0"
                      onClick={() => setViewMode('form')}
                      ariaLabel={getPhrase('analysis_of_results_back_to_edit', 'Back to edit')}
                      icon={ChevronRight}
                      iconSize={24}
                    />
                    <Tab
                      isActive={activeResultTab === 'yield'}
                      onClick={() => setActiveResultTab('yield')}
                      icon={<PieChart size={16} />}
                      label={getPhrase('analysis_of_results_yield_forecast_tab', 'Yield')}
                    />
                    <Tab
                      isActive={activeResultTab === 'amortization'}
                      onClick={() => setActiveResultTab('amortization')}
                      icon={<List size={16} />}
                      label={getPhrase('analysis_of_results_amortization_schedule_tab', 'Amortization')}
                    />
                    <Tab
                      isActive={activeResultTab === 'graph'}
                      onClick={() => setActiveResultTab('graph')}
                      icon={<LineChartIcon size={16} />}
                      label={getPhrase('analysis_of_results_graph_tab', 'Graph')}
                    />
                  </div>
                </div>

                <PropertyYieldForecast
                  yieldForecast={currentProperty?.calcYieldForecast || []}
                  isCalculating={isCalculating}
                  activeResultTab={activeResultTab}
                />

                {property.showMortgagePrepayment && (
                  <PropertyAmortizationSchedule
                    amortizationSchedule={currentProperty?.calcAmortizationSchedule || []}
                    isCalculating={isCalculating}
                    activeResultTab={activeResultTab}
                  />
                )}

                <PropertyChart
                  ref={graphRef}
                  yieldForecast={graphData}
                  activeResultTab={activeResultTab}
                  isCalculating={isCalculating}
                />
              </div>
            )}
          </div>

          {/* Part 3: Media */}
          <PropertyMedia
            viewMode={viewMode}
            isCalculating={isCalculating}
            list={currentProperty?.media || []}
            onUpload={handleMediaUpload}
            onRemove={handleMediaRemove}
          />
        </div>
      </main>
    </div>
  );
};
