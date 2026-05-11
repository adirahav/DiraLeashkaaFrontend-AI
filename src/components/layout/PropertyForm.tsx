
import React from 'react';
import { Building2, DollarSign, Check, Plus, TrendingUp, Calendar } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { Dropdown, StringInput, Textarea } from '../formFields';
import { 
  SegmentedControl, 
  SuggestedNumberInput, 
  AutoFIllInput, 
  CalcInput, 
  SummaryField, 
  AdditionalFundingSources, 
  EditableInput, 
  FinancingStatus 
} from '../propertyFields';
import { formatCurrency, formatNumber } from '../../services/utils';

interface PropertyFormProps {
  isCalculating: boolean;
  setIsCalculating: (val: boolean) => void;
  showTour: boolean;
  setShowTour: (val: boolean) => void;
  tourStep: string;
  setPendingTourStep: (step: any) => void;
  city: string;
  setCity: (val: string) => void;
  settlementName: string;
  setSettlementName: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  apartmentType: string;
  setApartmentType: (val: string) => void;
  propertyPrice: number | '';
  setPropertyPrice: (val: number | '') => void;
  equity: number;
  setEquity: (val: number) => void;
  equityMinusExpenses: number;
  mortgageAmount: number;
  additionalInfo: string;
  setAdditionalInfo: (val: string) => void;
  income: number;
  setIncome: (val: number) => void;
  commitments: number;
  setCommitments: (val: number) => void;
  selectedFundingSources: string[];
  setSelectedFundingSources: (val: string[]) => void;
  disposableIncome: number;
  desiredRepayment: number;
  setDesiredRepayment: (val: number) => void;
  desiredRepaymentPercent: number;
  setDesiredRepaymentPercent: (val: number) => void;
  isRepaymentPercentModified: boolean;
  setIsRepaymentPercentModified: (val: boolean) => void;
  isRepaymentInputModified: boolean;
  setIsRepaymentInputModified: (val: boolean) => void;
  actualFinancingPercent: number;
  maxFinancingPercent: number;
  lawyerPercent: number;
  setLawyerPercent: (val: number) => void;
  lawyerValue: number;
  setLawyerValue: (val: number) => void;
  isLawyerPercentModified: boolean;
  setIsLawyerPercentModified: (val: boolean) => void;
  isLawyerInputModified: boolean;
  setIsLawyerInputModified: (val: boolean) => void;
  realtorPercent: number;
  setRealtorPercent: (val: number) => void;
  realtorValue: number;
  setRealtorValue: (val: number) => void;
  isRealtorPercentModified: boolean;
  setIsRealtorPercentModified: (val: boolean) => void;
  isRealtorInputModified: boolean;
  setIsRealtorInputModified: (val: boolean) => void;
  mortgageConsultant: number;
  setMortgageConsultant: (val: number) => void;
  renovation: number;
  setRenovation: (val: number) => void;
  purchaseTax: number;
  totalAdditionalExpenses: number;
  expectedRentPercent: number;
  setExpectedRentPercent: (val: number) => void;
  expectedRentValue: number;
  setExpectedRentValue: (val: number) => void;
  isRentPercentModified: boolean;
  setIsRentPercentModified: (val: boolean) => void;
  isRentInputModified: boolean;
  setIsRentInputModified: (val: boolean) => void;
  lifeInsurance: number;
  setLifeInsurance: (val: number) => void;
  buildingInsurance: number;
  setBuildingInsurance: (val: number) => void;
  rentMinusExpenses: number;
  mortgagePeriod: string;
  setMortgagePeriod: (val: string) => void;
  userEmail?: string;
  monthlyMortgageRepayment: number;
  calcPossibleMonthlyRepayment: number;
  monthlyCashFlow: number;
  fundingSources: any[];
  
  // Visibility and Layout Controls
  hideLocationFields?: boolean;
  hidePropertyPrice?: boolean;
  hideAdditionalInfo?: boolean;
  hideMortgageRepayment?: boolean;
  section1GridClassName?: string;
  showSuccessStatus?: boolean;
  forceColumnLayout?: boolean;
  isCompact?: boolean;
  hideFirstHeader?: boolean;
  
  // Refs
  cityRef: React.RefObject<HTMLDivElement | null>;
  priceRef: React.RefObject<HTMLDivElement | null>;
  equityRef: React.RefObject<HTMLDivElement | null>;
  typeRef: React.RefObject<HTMLDivElement | null>;
  incomeRef: React.RefObject<HTMLDivElement | null>;
  commitmentsRef: React.RefObject<HTMLDivElement | null>;
  graphRef: React.RefObject<HTMLDivElement | null>;
  
  // Tour specific
  setIsTourEnding: (val: boolean) => void;
  setViewMode: (val: 'form' | 'results') => void;
  setActiveResultTab: (val: 'yield' | 'amortization' | 'graph') => void;
  
  // Constants
  CITY_OPTIONS: any[];
  APARTMENT_TYPES: any[];
  FINANCIAL_DEFAULTS: any;
  MORTGAGE_PERIODS: any[];
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  isCalculating,
  setIsCalculating,
  showTour,
  setShowTour,
  tourStep,
  setPendingTourStep,
  city,
  setCity,
  settlementName,
  setSettlementName,
  address,
  setAddress,
  apartmentType,
  setApartmentType,
  propertyPrice,
  setPropertyPrice,
  equity,
  setEquity,
  equityMinusExpenses,
  mortgageAmount,
  additionalInfo,
  setAdditionalInfo,
  income,
  setIncome,
  commitments,
  setCommitments,
  selectedFundingSources,
  setSelectedFundingSources,
  disposableIncome,
  desiredRepayment,
  setDesiredRepayment,
  desiredRepaymentPercent,
  setDesiredRepaymentPercent,
  isRepaymentPercentModified,
  setIsRepaymentPercentModified,
  isRepaymentInputModified,
  setIsRepaymentInputModified,
  actualFinancingPercent,
  maxFinancingPercent,
  lawyerPercent,
  setLawyerPercent,
  lawyerValue,
  setLawyerValue,
  isLawyerPercentModified,
  setIsLawyerPercentModified,
  isLawyerInputModified,
  setIsLawyerInputModified,
  realtorPercent,
  setRealtorPercent,
  realtorValue,
  setRealtorValue,
  isRealtorPercentModified,
  setIsRealtorPercentModified,
  isRealtorInputModified,
  setIsRealtorInputModified,
  mortgageConsultant,
  setMortgageConsultant,
  renovation,
  setRenovation,
  purchaseTax,
  totalAdditionalExpenses,
  expectedRentPercent,
  setExpectedRentPercent,
  expectedRentValue,
  setExpectedRentValue,
  isRentPercentModified,
  setIsRentPercentModified,
  isRentInputModified,
  setIsRentInputModified,
  lifeInsurance,
  setLifeInsurance,
  buildingInsurance,
  setBuildingInsurance,
  rentMinusExpenses,
  mortgagePeriod,
  setMortgagePeriod,
  userEmail,
  monthlyMortgageRepayment,
  calcPossibleMonthlyRepayment,
  monthlyCashFlow,
  fundingSources,
  hideLocationFields = false,
  hidePropertyPrice = false,
  hideAdditionalInfo = false,
  hideMortgageRepayment = false,
  section1GridClassName = "lg:grid-cols-3",
  showSuccessStatus = true,
  forceColumnLayout = false,
  isCompact = false,
  hideFirstHeader = false,
  cityRef,
  priceRef,
  equityRef,
  typeRef,
  incomeRef,
  commitmentsRef,
  graphRef,
  setIsTourEnding,
  setViewMode,
  setActiveResultTab,
  CITY_OPTIONS,
  APARTMENT_TYPES,
  FINANCIAL_DEFAULTS,
  MORTGAGE_PERIODS,
}) => {
  return (
    <>
      {/* Part 1.1.1: Property Details */}
      <section>
        {!hideFirstHeader && !isCompact && (
          <SectionHeader 
            icon={<Building2 />} 
            title="פרטי הנכס והון עצמי" 
            variant="blue" 
          />
        )}

        <Card className={`${isCompact ? 'bg-transparent shadow-none border-none !p-0 !md:p-0' : ''} grid grid-cols-1 md:grid-cols-2 ${forceColumnLayout ? 'lg:grid-cols-1' : section1GridClassName} gap-6 relative`}>
          {isCalculating && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 rounded-[2rem] cursor-not-allowed" />}
          
          {/* Column 1: Location & Type */}
          {!hideLocationFields ? (
            <div className="space-y-6">
              <div 
                ref={cityRef} 
                className={showTour && tourStep === 'CITY' ? 'relative z-[110] pointer-events-auto' : ''}
              >
                <Dropdown 
                  label="עיר" 
                  value={city} 
                  onChange={(val) => {
                    setCity(val);
                    if (showTour && tourStep === 'CITY') {
                      setIsCalculating(true);
                      setTimeout(() => {
                        setIsCalculating(false);
                        setPendingTourStep('PRICE');
                      }, 1200);
                    }
                  }}
                  options={CITY_OPTIONS}
                  disabled={isCalculating}
                />
              </div>
              {city === 'אחר' && (
                <StringInput label="שם הישוב" value={settlementName} onChange={(e) => setSettlementName(e.target.value)} disabled={isCalculating} />
              )}
              <StringInput label="כתובת" value={address} onChange={(e) => setAddress(e.target.value)} disabled={isCalculating} />
              <div 
                ref={typeRef} 
                className={showTour && tourStep === 'TYPE' ? 'relative z-[110] pointer-events-auto' : ''}
              >
                <SegmentedControl 
                  id="type-input"
                  label="סוג דירה" 
                  value={apartmentType} 
                  onChange={(val) => {
                    setApartmentType(val);
                    if (showTour && tourStep === 'TYPE') {
                      setIsCalculating(true);
                      setTimeout(() => {
                        setIsCalculating(false);
                        setPendingTourStep('INCOME');
                      }, 1200);
                    }
                  }}
                  options={APARTMENT_TYPES}
                  error={apartmentType === '' ? 'שדה חובה' : undefined}
                  disabled={isCalculating}
                />
              </div>
            </div>
          ) : (
            <SegmentedControl 
              label="סוג דירה"
              value={apartmentType}
              onChange={(val) => setApartmentType(val as any)}
              options={APARTMENT_TYPES}
              disabled={isCalculating}
            />
          )}

          {/* Column 2: Price & Equity */}
          {!hidePropertyPrice ? (
            <div className="space-y-6">
              <div 
                ref={priceRef} 
                className={showTour && tourStep === 'PRICE' ? 'relative z-[110] pointer-events-auto' : ''}
              >
                <SuggestedNumberInput 
                  id="price-input"
                  label="מחיר הנכס (₪)" 
                  value={propertyPrice as number} 
                  onChange={(val) => {
                    setPropertyPrice(val);
                    if (showTour && tourStep === 'PRICE') {
                      setIsCalculating(true);
                      setTimeout(() => {
                        setIsCalculating(false);
                        setPendingTourStep('EQUITY');
                      }, 1200);
                    }
                  }} 
                  required 
                  error={propertyPrice === '' || propertyPrice === 0 ? 'שדה חובה' : undefined}
                  disabled={isCalculating}
                />
              </div>
              <div 
                ref={equityRef}
                className={showTour && tourStep === 'EQUITY' ? 'relative z-[110] pointer-events-auto' : ''}
              >
                <AutoFIllInput 
                  id="equity-input"
                  label="הון עצמי (₪)" 
                  value={equity} 
                  defaultValue={FINANCIAL_DEFAULTS.equity}
                  onChange={(val) => {
                    setEquity(val);
                    if (showTour && tourStep === 'EQUITY') {
                      setIsCalculating(true);
                      setTimeout(() => {
                        setIsCalculating(false);
                        setPendingTourStep('TYPE');
                      }, 1200);
                    }
                  }} 
                  required 
                  error={equity === 0 ? 'שדה חובה' : undefined}
                  disabled={isCalculating}
                />
              </div>
              <CalcInput
                label="הון עצמי בניכוי הוצאות נלוות"
                value={formatCurrency(equityMinusExpenses)}
                errorAsTooltip="ההון העצמי שנותר נטו לרכישת הנכס לאחר תשלום מיסים והוצאות נלוות"
              />
            </div>
          ) : (
            <>
              <AutoFIllInput
                label="הון עצמי"
                value={equity}
                defaultValue={FINANCIAL_DEFAULTS.equity}
                onChange={setEquity}
                disabled={isCalculating}
              />
              <CalcInput
                label="הון עצמי לאחר הוצאות"
                value={formatCurrency(equityMinusExpenses)}
                errorAsTooltip="ההון העצמי שנותר נטו לרכישת הנכס"
              />
            </>
          )}

          {/* Column 3: Mortgage & Additional Info */}
          {!hideAdditionalInfo ? (
            <div className="lg:h-full space-y-6">
              <SummaryField 
                label="משכנתא נדרשת"
                value={formatCurrency(mortgageAmount)}
                variant="blue"
                align="right"
              />
              <Textarea 
                label="מידע נוסף"
                value={additionalInfo}
                onChange={setAdditionalInfo}
                disabled={isCalculating}
                placeholder="הערות נוספות על הנכס..."
                className="h-full"
                minHeight="158px"
              />
            </div>
          ) : (
            <SummaryField 
              label="משכנתא נדרשת" 
              value={formatCurrency(mortgageAmount)}
              variant="blue"
              labelClassName="text-blue-500"
            />
          )}
        </Card>
      </section>

      {/* Part 1.1.2: Income and Repayment */}
      <section>
        <SectionHeader 
          icon={<DollarSign />} 
          title="הכנסות והחזר חודשי" 
          variant="teal" 
        />

        <Card className={`${isCompact ? 'bg-transparent shadow-none border-none !p-0' : 'p-6'} md:p-10 grid grid-cols-1 md:grid-cols-2 ${forceColumnLayout ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8 relative`}>
          {isCalculating && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 rounded-[2rem] cursor-not-allowed" />}
          <div className="space-y-6">
            <div 
              ref={incomeRef}
              className={showTour && tourStep === 'INCOME' ? 'relative z-[110] pointer-events-auto' : ''}
            >
              <AutoFIllInput 
                id="income-input"
                label="הכנסות (₪)" 
                value={income} 
                defaultValue={FINANCIAL_DEFAULTS.income}
                onChange={(val) => {
                  setIncome(val);
                  if (showTour && tourStep === 'INCOME') {
                    setIsCalculating(true);
                    setTimeout(() => {
                      setIsCalculating(false);
                      setPendingTourStep('COMMITMENTS');
                    }, 1200);
                  }
                }} 
                required 
                error={income === 0 ? 'שדה חובה' : undefined}
                disabled={isCalculating}
              />
            </div>
            <div 
              ref={commitmentsRef}
              className={showTour && tourStep === 'COMMITMENTS' ? 'relative z-[110] pointer-events-auto' : ''}
            >
              <AutoFIllInput 
                id="commitments-input"
                label="הלוואות והתחייבויות (₪)" 
                value={commitments} 
                defaultValue={FINANCIAL_DEFAULTS.commitments}
                onChange={(val) => {
                  setCommitments(val);
                  if (showTour && tourStep === 'COMMITMENTS') {
                    setIsCalculating(true);
                    setTimeout(() => {
                      setIsCalculating(false);
                      // End of tour logic
                      setIsTourEnding(true);
                      setShowTour(false);
                      setViewMode('results');
                      setActiveResultTab('graph');
                      setTimeout(() => {
                        graphRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setTimeout(() => setIsTourEnding(false), 2000);
                      }, 800);
                    }, 1200);
                  }
                }} 
                required 
                disabled={isCalculating}
              />
            </div>
          </div>

          <div className="space-y-6">
            <AdditionalFundingSources 
              sources={fundingSources}
              selectedIds={selectedFundingSources}
              onChange={setSelectedFundingSources}
              disabled={isCalculating}
            />
          </div>

          <div className="space-y-6">
            <CalcInput
              label="הכנסה פנויה"
              value={formatCurrency(disposableIncome)}
              errorAsTooltip="ההכנסה החודשית הנותרת לאחר ניכוי התחייבויות"
            />
            
            <EditableInput 
              label="החזר חודשי רצוי"
              interactiveProps={{
                percent: desiredRepaymentPercent,
                min: 0,
                max: 40,
                step: 1,
                onPercentChange: (val) => {
                  setDesiredRepaymentPercent(val);
                  setIsRepaymentPercentModified(val !== 33);
                  setIsRepaymentInputModified(false);
                },
                showPercent: !isRepaymentInputModified
              }}
              type="text" 
              value={formatNumber(desiredRepayment)} 
              onChange={(e) => {
                const val = e.target.value.replace(/,/g, '');
                if (val === '' || !isNaN(Number(val))) {
                  setDesiredRepayment(val === '' ? 0 : Number(val));
                  setIsRepaymentInputModified(true);
                }
              }}
              dir="ltr"
              disabled={isCalculating}
              isEditable={false}
              isModified={isRepaymentPercentModified || isRepaymentInputModified}
              onRollback={() => {
                setDesiredRepaymentPercent(33);
                setIsRepaymentPercentModified(false);
                setIsRepaymentInputModified(false);
              }}
            />
          </div>
        </Card>
      </section>

      {/* Part 1.1.3: Financing Percentages - Redesigned to be compact */}
      <SectionHeader 
        icon={<Check />} 
        title="סטטוס מימון" 
        variant="indigo"
      />
      <Card className={`${isCompact ? 'bg-transparent shadow-none border-none !p-0' : 'p-6'} md:p-10 relative rounded-[2rem]`}>
        <FinancingStatus 
          isCalculating={isCalculating}
          actualFinancingPercent={actualFinancingPercent}
          maxFinancingPercent={maxFinancingPercent}
          showSuccessStatus={showSuccessStatus}
        />
      </Card>

      {/* Part 1.1.4: Additional Expenses */}
      <section>
        <SectionHeader 
          icon={<Plus />} 
          title="הוצאות נלוות" 
          variant="amber" 
        />

        <Card className={`${isCompact ? 'bg-transparent shadow-none border-none !p-0' : 'p-6'} md:p-10 grid grid-cols-1 md:grid-cols-2 ${forceColumnLayout ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8 relative`}>
          {isCalculating && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 rounded-[2rem] cursor-not-allowed" />}
          <div className="space-y-6">
            <EditableInput 
              label="עורך דין"
              interactiveProps={{
                percent: lawyerPercent,
                min: 0,
                max: 2,
                step: 0.1,
                onPercentChange: (val) => {
                  setLawyerPercent(val);
                  setIsLawyerPercentModified(val !== 0.5);
                  setIsLawyerInputModified(false);
                },
                showPercent: !isLawyerInputModified
              }}
              type="text" 
              value={formatNumber(lawyerValue)} 
              onChange={(e) => {
                const val = e.target.value.replace(/,/g, '');
                if (val === '' || !isNaN(Number(val))) {
                  setLawyerValue(val === '' ? 0 : Number(val));
                  setIsLawyerInputModified(true);
                }
              }}
              dir="ltr"
              disabled={isCalculating}
              isModified={isLawyerPercentModified || isLawyerInputModified}
              onRollback={() => {
                setLawyerPercent(0.5);
                setIsLawyerPercentModified(false);
                setIsLawyerInputModified(false);
              }}
            />

            <EditableInput 
              label="מתווך"
              interactiveProps={{
                percent: realtorPercent,
                min: 0,
                max: 4,
                step: 0.1,
                onPercentChange: (val) => {
                  setRealtorPercent(val);
                  setIsRealtorPercentModified(val !== 2);
                  setIsRealtorInputModified(false);
                },
                showPercent: !isRealtorInputModified
              }}
              type="text" 
              value={formatNumber(realtorValue)} 
              onChange={(e) => {
                const val = e.target.value.replace(/,/g, '');
                if (val === '' || !isNaN(Number(val))) {
                  setRealtorValue(val === '' ? 0 : Number(val));
                  setIsRealtorInputModified(true);
                }
              }}
              dir="ltr"
              disabled={isCalculating}
              isModified={isRealtorPercentModified || isRealtorInputModified}
              onRollback={() => {
                setRealtorPercent(2);
                setIsRealtorPercentModified(false);
                setIsRealtorInputModified(false);
              }}
            />
          </div>

          <div className="space-y-6">
            <SuggestedNumberInput 
              label="יועץ משכנתה (₪)" 
              value={mortgageConsultant} 
              onChange={setMortgageConsultant} 
              required 
              error={mortgageConsultant === 0 ? 'שדה חובה' : undefined}
              disabled={isCalculating}
              defaultValue={12345}
            />
            <SuggestedNumberInput 
              label="שיפוץ (₪)" 
              value={renovation} 
              onChange={setRenovation} 
              required 
              error={renovation === 0 ? 'שדה חובה' : undefined}
              disabled={isCalculating}
              defaultValue={123456}
            />
          </div>

          <div className="space-y-6">
            <CalcInput 
              label="מס רכישה"
              value={formatCurrency(purchaseTax)}
            />
            <SummaryField 
              label='סה"כ הוצאות נלוות'
              value={formatCurrency(totalAdditionalExpenses)}
              variant="amber"
            />
          </div>
        </Card>
      </section>

      {/* Part 1.1.5: Expected Rent */}
      <section>
        <SectionHeader 
          icon={<TrendingUp />} 
          title="צפי הכנסות מהנכס" 
          variant="emerald" 
        />

        <Card className={`${isCompact ? 'bg-transparent shadow-none border-none !p-0' : 'p-6'} md:p-10 grid grid-cols-1 md:grid-cols-2 ${forceColumnLayout ? 'lg:grid-cols-1' : 'lg:grid-cols-4'} gap-6 relative`}>
          {isCalculating && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 rounded-[2rem] cursor-not-allowed" />}
          <div className="space-y-6">
            <EditableInput 
              label="צפי לשכר דירה"
              interactiveProps={{
                percent: expectedRentPercent,
                min: 0,
                max: 10,
                step: 0.1,
                onPercentChange: (val) => {
                  setExpectedRentPercent(val);
                  setIsRentPercentModified(val !== 3);
                  setIsRentInputModified(false);
                },
                showPercent: !isRentInputModified
              }}
              type="text" 
              value={formatNumber(expectedRentValue)} 
              onChange={(e) => {
                const val = e.target.value.replace(/,/g, '');
                if (val === '' || !isNaN(Number(val))) {
                  setExpectedRentValue(val === '' ? 0 : Number(val));
                  setIsRentInputModified(true);
                }
              }}
              dir="ltr"
              disabled={isCalculating}
              isEditable={false}
              isModified={isRentPercentModified || isRentInputModified}
              onRollback={() => {
                setExpectedRentPercent(3);
                setIsRentPercentModified(false);
                setIsRentInputModified(false);
              }}
            />
          </div>

          <div className="space-y-6">
            <SuggestedNumberInput 
              label="ביטוח חיים (₪ לחודש)" 
              value={lifeInsurance} 
              onChange={setLifeInsurance} 
              required 
              error={lifeInsurance === 0 ? 'שדה חובה' : undefined}
              disabled={isCalculating}
              defaultValue={123}
            />
          </div>

          <div className="space-y-6">
            <SuggestedNumberInput 
              label="ביטוח מבנה (₪ לחודש)" 
              value={buildingInsurance} 
              onChange={setBuildingInsurance} 
              required 
              error={buildingInsurance === 0 ? 'שדה חובה' : undefined}
              disabled={isCalculating}
              defaultValue={70}
            />
          </div>

          <div className="space-y-6">
            <SummaryField 
              label="שכר דירה בניכוי הוצאות (חודשי)"
              value={formatCurrency(Math.round(rentMinusExpenses))}
              variant="emerald"
            />
          </div>
        </Card>
      </section>

      {/* Part 1.1.6: Mortgage Repayment */}
      {!hideMortgageRepayment && (
        <section>
          <SectionHeader 
            icon={<Calendar />} 
            title="החזר משכנתה" 
            variant="indigo" 
          />

          <Card className={`${isCompact ? 'bg-transparent shadow-none border-none !p-0' : 'p-6'} md:p-10 grid grid-cols-1 md:grid-cols-2 ${forceColumnLayout ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8 relative`}>
            {isCalculating && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 rounded-[2rem] cursor-not-allowed" />}
            <SegmentedControl 
              label="תקופה" 
              value={mortgagePeriod} 
              onChange={setMortgagePeriod}
              options={MORTGAGE_PERIODS}
              disabled={isCalculating}
              error={mortgagePeriod === '' ? 'שדה חובה' : (userEmail === 'old@gmail.com' && Number(mortgagePeriod) > 20) ? 'משכנתא אפשר לקחת רק עד גיל 80' : undefined}
              errorAsTooltip={true}
            />
            <CalcInput 
              label="החזר חודשי משוער"
              value={formatCurrency(Math.round(monthlyMortgageRepayment))}
              variant={monthlyMortgageRepayment > calcPossibleMonthlyRepayment ? 'danger' : 'default'}
              errorAsTooltip={monthlyMortgageRepayment > calcPossibleMonthlyRepayment 
                ? `ההחזר החודשי (${formatCurrency(Math.round(monthlyMortgageRepayment))}) גבוה מההחזר האפשרי המקסימלי (${formatCurrency(Math.round(calcPossibleMonthlyRepayment))}) המהווה 40% מההכנסה הפנויה` 
                : "החזר חודשי משוער של המשכנתא"}
            />
            <CalcInput 
              label="תשואה חודשית"
              value={formatCurrency(monthlyCashFlow)}
              variant={monthlyCashFlow < 0 ? 'danger' : 'default'}
              errorAsTooltip={monthlyCashFlow < 0 ? "התשואה החודשית שלילית - ההוצאות עולות על ההכנסות" : undefined}
            />
          </Card>
        </section>
      )}
    </>
  );
};
