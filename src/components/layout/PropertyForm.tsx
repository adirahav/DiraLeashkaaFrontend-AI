
import React, { useMemo } from 'react';
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
  FinancingStatus,
} from '../propertyFields';
import { formatCurrency, formatNumber } from '../../services/utils';
import { useSplash } from '../../hooks/useSplash';
import { PropertyData } from '../../types/property.types';

// ---------------------------------------------------------------------------
// Parameter extractor — parses JSON arrays stored in fixedParameters
// ---------------------------------------------------------------------------
interface ParamRange {
  name: string;
  min: number;
  max: number;
  step: number;
  default?: number | null;
}

function extractPropertyRangeParam(
  params: Record<string, unknown>,
  arrayKey: string,
  paramName: string,
  fallback: { min: number; max: number; step: number; default?: number },
): { min: number; max: number; step: number; default: number } {
  const fallbackDefault = fallback.default ?? -1;
  try {
    const raw = params[arrayKey];
    if (!raw) return { ...fallback, default: fallbackDefault };
    const arr: ParamRange[] =
      typeof raw === 'string' ? JSON.parse(raw) : (raw as ParamRange[]);
    const found = arr.find((p) => p.name === paramName);
    return found
      ? { min: found.min, max: found.max, step: found.step, default: found.default ?? fallbackDefault }
      : { ...fallback, default: fallbackDefault };
  } catch {
    return { ...fallback, default: fallbackDefault };
  }
}

function extractPropertyValueParam(
  params: Record<string, unknown>,
  key: string,
  fallback: number,
): number {
  try {
    const raw = params['propertyValues'];
    if (!raw) return fallback;
    const arr: { key: string; value: number }[] =
      typeof raw === 'string' ? JSON.parse(raw) : (raw as { key: string; value: number }[]);
    const found = arr.find((p) => p.key === key);
    return found ? found.value : fallback;
  } catch {
    return fallback;
  }
}

function extractCityOptions(
  params: Record<string, unknown>,
  fallback: { value: string; label: string }[],
): { value: string; label: string }[] {
  try {
    const raw = params['cities'];
    if (!raw) return fallback;
    const arr: { key: string; value: string }[] =
      typeof raw === 'string' ? JSON.parse(raw) : (raw as { key: string; value: string }[]);
    const options = arr
      .filter((c) => c.key !== 'choose')
      .map((c) => ({ value: c.value, label: c.value }));
    return options.length > 0 ? options : fallback;
  } catch {
    return fallback;
  }
}

const DEFAULT_APARTMENT_TYPES = [
  { value: 'single', label: 'יחידה' },
  { value: 'alternate', label: 'חליפית' },
  { value: 'investment', label: 'השקעה' },
];

const DEFAULT_MORTGAGE_PERIODS = [
  { value: '10', label: '10 שנים' },
  { value: '15', label: '15 שנה' },
  { value: '20', label: '20 שנה' },
  { value: '25', label: '25 שנה' },
  { value: '30', label: '30 שנה' },
];

function extractApartmentTypeOptions(
  params: Record<string, unknown>,
  fallback: { value: string; label: string }[],
): { value: string; label: string }[] {
  try {
    const raw = params['apartmentTypes'];
    if (!raw) return fallback;
    const arr: { key: string; value: string }[] =
      typeof raw === 'string' ? JSON.parse(raw) : (raw as { key: string; value: string }[]);
    const options = arr
      .filter((c) => c.key !== 'choose')
      .map((c) => ({ value: c.key, label: c.value }));
    return options.length > 0 ? options : fallback;
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface PropertyFormProps {
  // Data
  property: PropertyData;
  onUpdate: (field: string, value: any) => void;
  isCalculating: boolean;
  setIsCalculating: (val: boolean) => void;

  // Layout controls
  isCompact?: boolean;
  hideLocationFields?: boolean;
  hidePropertyPrice?: boolean;
  hideAdditionalInfo?: boolean;
  forceColumnLayout?: boolean;
  section1GridClassName?: string;

  // Tour
  showTour: boolean;
  setShowTour: (val: boolean) => void;
  tourStep: string;
  setPendingTourStep: (step: any) => void;
  setIsTourEnding: (val: boolean) => void;

  // Refs
  cityRef: React.RefObject<HTMLDivElement | null>;
  priceRef: React.RefObject<HTMLDivElement | null>;
  equityRef: React.RefObject<HTMLDivElement | null>;
  typeRef: React.RefObject<HTMLDivElement | null>;
  incomeRef: React.RefObject<HTMLDivElement | null>;
  commitmentsRef: React.RefObject<HTMLDivElement | null>;
  graphRef: React.RefObject<HTMLDivElement | null>;

  // Actions
  setViewMode: (mode: 'form' | 'results') => void;
  setActiveResultTab: (tab: 'yield' | 'amortization' | 'graph') => void;

  // Constants — all optional, fall back to fixedParameters or static defaults
  CITY_OPTIONS?: { value: string; label: string }[];
  APARTMENT_TYPES?: { value: string; label: string }[];
  MORTGAGE_PERIODS?: { value: string; label: string }[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const PropertyForm: React.FC<PropertyFormProps> = ({
  property,
  onUpdate,
  isCalculating,
  setIsCalculating,
  isCompact = false,
  hideLocationFields = false,
  hidePropertyPrice = false,
  hideAdditionalInfo = false,
  forceColumnLayout = false,
  section1GridClassName = 'lg:grid-cols-3',
  showTour,
  setShowTour,
  tourStep,
  setPendingTourStep,
  setIsTourEnding,
  cityRef,
  priceRef,
  equityRef,
  typeRef,
  incomeRef,
  commitmentsRef,
  graphRef,
  setViewMode,
  setActiveResultTab,
  CITY_OPTIONS,
  APARTMENT_TYPES = DEFAULT_APARTMENT_TYPES,
  MORTGAGE_PERIODS = DEFAULT_MORTGAGE_PERIODS,
}) => {
  const { getPhrase, params, getParam } = useSplash();

  // Build typed range params from splash fixedParameters once per params change
  const rangeParams = useMemo(() => {
    const raw = params as Record<string, unknown>;
    return {
      lawyerPercent: extractPropertyRangeParam(raw, 'propertyInputs', 'lawyerPercent', { min: 0, max: 2, step: 0.1 }),
      realEstateAgentPercent: extractPropertyRangeParam(raw, 'propertyInputs', 'realEstateAgentPercent', { min: 0, max: 4, step: 0.1 }),
      possibleMonthlyRepaymentPercent: extractPropertyRangeParam(raw, 'propertyInputs', 'possibleMonthlyRepaymentPercent', { min: 0, max: 40, step: 1, default: 33 }),
      rentPercent: extractPropertyRangeParam(raw, 'propertyInputs', 'rentPercent', { min: 0, max: 10, step: 0.1 }),
    };
  }, [params]);

  const valueParams = useMemo(() => {
    const raw = params as Record<string, unknown>;
    return {
      brokerMortgage: extractPropertyValueParam(raw, 'brokerMortgage', 8000),
      repairing: extractPropertyValueParam(raw, 'repairing', 20000),
      lifeInsurance: extractPropertyValueParam(raw, 'lifeInsurance', 60),
      structureInsurance: extractPropertyValueParam(raw, 'structureInsurance', 70),
    };
  }, [params]);

  const cityOptions = useMemo(
    () => extractCityOptions(params as Record<string, unknown>, CITY_OPTIONS ?? []),
    [params, CITY_OPTIONS],
  );

  const apartmentTypeOptions = useMemo(
    () => extractApartmentTypeOptions(params as Record<string, unknown>, APARTMENT_TYPES),
    [params, APARTMENT_TYPES],
  );

  // Derived display helpers
  const mortgageMaxAge = getParam('mortgageMaxAge', 80);
  const isMortgagePeriodTooLong =
    property.loggedinUserCalcAge + Number(property.calcMortgagePeriod) > mortgageMaxAge;
  const hasFundingSourcesSelected = (property.calcAdditionalFunding?.totalAmount ?? 0) > 0;
  const isEquityReadOnly = hasFundingSourcesSelected;
  const isCommitmentsReadOnly = hasFundingSourcesSelected;
  const isAdditionalFundingReadOnly =
    !hasFundingSourcesSelected &&
    (property.calcEquity !== property.defaultEquity ||
     property.defaultCommitments !== property.calcCommitments);

  const equityReadOnlyTooltip = getPhrase('equity_readonly_tooltip', 'Cannot change equity / commitments and loans when additional funding sources are in use.');
  const commitmentsReadOnlyTooltip = getPhrase('commitments_readonly_tooltip', 'Cannot change equity / commitments and loans when additional funding sources are in use.');
  const additionalFundingReadOnlyTooltip = getPhrase('additional_funding_readonly_tooltip', 'Cannot change or select additional funding sources when the default values of equity or commitments have been changed.');

  // Shared card class for compact mode
  const compactCard = isCompact
    ? 'bg-transparent shadow-none border-none !p-0 !md:p-0'
    : '';

  // Tour interception helper — fires after the field's onUpdate call
  const handleTourStep = (
    step: string,
    nextStep: string | null,
    isLastStep = false,
  ) => {
    if (!showTour || tourStep !== step) return;
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      if (isLastStep) {
        setIsTourEnding(true);
        setShowTour(false);
        setViewMode('results');
        setActiveResultTab('graph');
        setTimeout(() => {
          graphRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => setIsTourEnding(false), 2000);
        }, 800);
      } else if (nextStep) {
        setPendingTourStep(nextStep);
      }
    }, 1200);
  };

  const colOverride = forceColumnLayout ? 'lg:grid-cols-1' : '';

  // Calculation overlay shared between sections
  const calcOverlay = isCalculating ? (
    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 rounded-[2rem] cursor-not-allowed" />
  ) : null;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* ── Section 1: Property Details & Equity ─────────────────────────── */}
      <section>
        {!isCompact && (
          <SectionHeader
            icon={<Building2 />}
            title={getPhrase('property_details_and_equity_header', 'Property Details and Equity')}
            variant="blue"
          />
        )}

        <Card
          className={`${compactCard} grid grid-cols-1 md:grid-cols-2 ${colOverride || section1GridClassName} gap-6 relative`}
        >
          {calcOverlay}

          {/* Column 1: Location & Type */}
          {!hideLocationFields ? (
            <div className="space-y-6">
              <div
                ref={cityRef}
                className={showTour && tourStep === 'CITY' ? 'relative z-[110] pointer-events-auto' : ''}
              >
                <Dropdown
                  label={getPhrase('property_city_label', 'City')}
                  value={property.city}
                  onChange={(val) => {
                    onUpdate('city', val);
                    handleTourStep('CITY', 'PRICE');
                  }}
                  options={cityOptions}
                  searchable
                  disabled={isCalculating}
                />
              </div>

              {property.city === 'אחר' && (
                <StringInput
                  label={getPhrase('property_city_else_label', 'Settlement Name')}
                  value={property.cityElse ?? ''}
                  onChange={(e) => onUpdate('cityElse', e.target.value)}
                  disabled={isCalculating}
                  required
                />
              )}

              <StringInput
                label={getPhrase('property_address_label', 'Address')}
                value={property.address ?? ''}
                onChange={(e) => onUpdate('address', e.target.value)}
                disabled={isCalculating}
              />

              <div
                ref={typeRef}
                className={showTour && tourStep === 'TYPE' ? 'relative z-[110] pointer-events-auto' : ''}
              >
                <SegmentedControl
                  id="type-input"
                  label={getPhrase('property_apartment_type_label', 'Apartment Type')}
                  value={property.apartmentType}
                  onChange={(val) => {
                    onUpdate('apartmentType', val);
                    handleTourStep('TYPE', 'INCOME');
                  }}
                  options={apartmentTypeOptions}
                  required
                  error={!property.apartmentType ? ' ' : undefined}
                  disabled={isCalculating}
                />
              </div>
            </div>
          ) : (
            <SegmentedControl
              label={getPhrase('property_apartment_type_label', 'Apartment Type')}
              value={property.apartmentType}
              onChange={(val) => onUpdate('apartmentType', val)}
              options={apartmentTypeOptions}
              required
              error={!property.apartmentType ? ' ' : undefined}
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
                  label={getPhrase('property_price_label', 'Property Price (₪)')}
                  value={property.price as number}
                  onChange={(val) => {
                    onUpdate('price', val);
                    handleTourStep('PRICE', 'EQUITY');
                  }}
                  required
                  error={!property.price ? ' ' : undefined}
                  disabled={isCalculating}
                />
              </div>

              <div
                ref={equityRef}
                className={showTour && tourStep === 'EQUITY' ? 'relative z-[110] pointer-events-auto' : ''}
              >
                <AutoFIllInput
                  id="equity-input"
                  label={getPhrase('property_equity_label', 'Equity (₪)')}
                  value={property.calcEquity}
                  defaultValue={property.defaultEquity}
                  onChange={(val) => {
                    onUpdate('calcEquity', val);
                    handleTourStep('EQUITY', 'TYPE');
                  }}
                  required
                  error={
                    property.calcEquity === 0
                      ? ' '
                      : undefined
                  }
                  disabled={isCalculating || isEquityReadOnly}
                  tooltip={isEquityReadOnly ? equityReadOnlyTooltip : undefined}
                />
              </div>

              <CalcInput
                label={getPhrase('property_equity_cleaning_expenses_label', 'Net Equity After Ancillary Expenses')}
                value={property.calcIncidentalsTotal ? formatCurrency(property.calcEquityCleaningExpenses) : ''}
                errorAsTooltip={getPhrase(
                  'property_equity_cleaning_expenses_tooltip',
                  'Net equity remaining for purchase after taxes and ancillary expenses',
                )}
              />
            </div>
          ) : (
            <>
              <AutoFIllInput
                label={getPhrase('property_equity_label', 'Equity')}
                value={property.calcEquity}
                defaultValue={property.defaultEquity}
                onChange={(val) => onUpdate('calcEquity', val)}
                disabled={isCalculating || isEquityReadOnly}
                tooltip={isEquityReadOnly ? equityReadOnlyTooltip : undefined}
              />
              <CalcInput
                label={getPhrase('property_equity_cleaning_expenses_label', 'Equity After Expenses')}
                value={property.calcIncidentalsTotal ? formatCurrency(property.calcEquityCleaningExpenses) : ''}
                errorAsTooltip={getPhrase(
                  'property_equity_cleaning_expenses_tooltip',
                  'Net equity remaining for purchase',
                )}
              />
            </>
          )}

          {/* Column 3: Mortgage Required & Note */}
          {!hideAdditionalInfo ? (
            <div className="lg:h-full space-y-6">
              <SummaryField
                label={getPhrase('property_mortgage_required_label', 'Mortgage Required')}
                value={property.calcMortgageRequired ? formatCurrency(property.calcMortgageRequired) : ''}
                variant="blue"
                align="right"
              />
              <Textarea
                label={getPhrase('property_note_label', 'Additional Info')}
                value={property.note ?? ''}
                onChange={(val) => onUpdate('note', val)}
                disabled={isCalculating}
                placeholder={getPhrase('property_note_placeholder', 'Additional notes about the property...')}
                className="h-full"
                minHeight="158px"
              />
            </div>
          ) : (
            <SummaryField
              label={getPhrase('property_mortgage_required_label', 'Mortgage Required')}
              value={property.calcMortgageRequired ? formatCurrency(property.calcMortgageRequired) : ''}
              variant="blue"
              labelClassName="text-blue-500"
            />
          )}
        </Card>
      </section>

      {/* ── Section 2: Monthly Income & Repayment ────────────────────────── */}
      <section>
        {!isCompact && (
          <SectionHeader
            icon={<DollarSign />}
            title={getPhrase('property_income_and_monthly_return_header', 'Income and Monthly Repayment')}
            variant="teal"
          />
        )}

        <Card
          className={`${isCompact ? 'bg-transparent shadow-none border-none !p-0' : 'p-6'} md:p-10 grid grid-cols-1 md:grid-cols-2 ${colOverride || 'lg:grid-cols-3'} gap-8 relative`}
        >
          {calcOverlay}

          {/* Col 1: Incomes & Commitments */}
          <div className="space-y-6">
            <div
              ref={incomeRef}
              className={showTour && tourStep === 'INCOME' ? 'relative z-[110] pointer-events-auto' : ''}
            >
              <AutoFIllInput
                id="income-input"
                label={getPhrase('property_incomes_label', 'Income (₪)')}
                value={property.defaultIncomes}
                defaultValue={property.calcIncomes}
                onChange={(val) => {
                  onUpdate('defaultIncomes', val);
                  handleTourStep('INCOME', 'COMMITMENTS');
                }}
                required
                error={
                  property.defaultIncomes === 0
                    ? ' '
                    : undefined
                }
                disabled={isCalculating}
              />
            </div>

            <div
              ref={commitmentsRef}
              className={showTour && tourStep === 'COMMITMENTS' ? 'relative z-[110] pointer-events-auto' : ''}
            >
              <AutoFIllInput
                id="commitments-input"
                label={getPhrase('property_commitments_label', 'Loans and Commitments (₪)')}
                value={property.defaultCommitments}
                defaultValue={property.calcCommitments}
                onChange={(val) => {
                  onUpdate('defaultCommitments', val);
                  handleTourStep('COMMITMENTS', null, true);
                }}
                required
                disabled={isCalculating || isCommitmentsReadOnly}
                tooltip={isCommitmentsReadOnly ? commitmentsReadOnlyTooltip : undefined}
              />
            </div>
          </div>

          {/* Col 2: Additional Funding Sources */}
          <div className="space-y-6">
            <AdditionalFundingSources
              label={getPhrase('property_additional_funding_sources_label', 'Additional Funding Sources')}
              tooltip={isAdditionalFundingReadOnly ? additionalFundingReadOnlyTooltip : getPhrase('property_additional_funding_sources_subtitle', '')}
              sources={property.additionalFundingSources}
              selectedIds={property.selectedFundingSourceIds}
              onChange={(ids) => onUpdate('selectedFundingSourceIds', ids)}
              disabled={isCalculating || isAdditionalFundingReadOnly}
            />
          </div>

          {/* Col 3: Disposable Income & Desired Repayment */}
          <div className="space-y-6">
            <CalcInput
              label={getPhrase('property_disposable_income_label', 'Disposable Income')}
              value={formatCurrency(property.calcDisposableIncome)}
              errorAsTooltip={getPhrase(
                'property_disposable_income_tooltip',
                'Monthly income remaining after deducting commitments',
              )}
            />

            <EditableInput
              label={getPhrase('property_possible_monthly_payment_label_without_value', 'Desired Monthly Repayment')}
              interactiveProps={{
                percent: property.possibleMonthlyRepaymentPercent,
                min: rangeParams.possibleMonthlyRepaymentPercent.min,
                max: rangeParams.possibleMonthlyRepaymentPercent.max,
                step: rangeParams.possibleMonthlyRepaymentPercent.step,
                onPercentChange: (val) => onUpdate('possibleMonthlyRepaymentPercent', val),
                showPercent: property.possibleMonthlyRepaymentCustomValue === null,
              }}
              type="text"
              value={formatNumber(
                property.possibleMonthlyRepaymentCustomValue ?? property.calcPossibleMonthlyRepayment,
                true,
              )}
              error={!property.possibleMonthlyRepaymentCustomValue && !property.calcPossibleMonthlyRepayment ? ' ' : undefined}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, '');
                if (raw === '' || !isNaN(Number(raw))) {
                  onUpdate('possibleMonthlyRepaymentCustomValue', raw === '' ? 0 : Number(raw));
                }
              }}
              dir="ltr"
              disabled={isCalculating}
              isEditable={false}
              isModified={
                property.possibleMonthlyRepaymentCustomValue !== null ||
                property.possibleMonthlyRepaymentPercent !== rangeParams.possibleMonthlyRepaymentPercent.default
              }
              onRollback={() => {
                if (property.possibleMonthlyRepaymentCustomValue !== null) {
                  onUpdate('possibleMonthlyRepaymentCustomValue', null);
                } else {
                  onUpdate('possibleMonthlyRepaymentPercent', rangeParams.possibleMonthlyRepaymentPercent.default);
                }
              }}
            />
          </div>
        </Card>
      </section>

      {/* ── Section 3: Funding Status (conditional) ──────────────────────── */}
      {property.showMortgagePrepayment && (
        <section>
          {!isCompact && (
            <SectionHeader
              icon={<Check />}
              title={getPhrase('property_financing_status_header', 'Financing Status')}
              variant="indigo"
            />
          )}
          <Card className={`${isCompact ? 'bg-transparent shadow-none border-none !p-0' : 'p-6'} md:p-10 relative rounded-[2rem]`}>
            <FinancingStatus
              isCalculating={isCalculating}
              actualFinancingPercent={property.calcActualPercentOfFinancing}
              maxFinancingPercent={property.calcMaxPercentOfFinancing}
            />
          </Card>
        </section>
      )}

      {/* ── Section 4: Ancillary Expenses ────────────────────────────────── */}
      <section>
        {!isCompact && (
          <SectionHeader
            icon={<Plus />}
            title={getPhrase('property_ancillary_expenses_header', 'Ancillary Expenses')}
            variant="amber"
          />
        )}

        <Card
          className={`${isCompact ? 'bg-transparent shadow-none border-none !p-0' : 'p-6'} md:p-10 grid grid-cols-1 md:grid-cols-2 ${colOverride || 'lg:grid-cols-3'} gap-8 relative`}
        >
          {calcOverlay}

          {/* Col 1: Lawyer & Real Estate Agent */}
          <div className="space-y-6">
            <EditableInput
              label={getPhrase(
                'property_lawyer_label_without_value',
                'Lawyer',
              )}
              interactiveProps={{
                percent: property.lawyerPercent,
                min: rangeParams.lawyerPercent.min,
                max: rangeParams.lawyerPercent.max,
                step: rangeParams.lawyerPercent.step,
                onPercentChange: (val) => onUpdate('lawyerPercent', val),
                showPercent: property.lawyerCustomValue === null,
              }}
              type="text"
              value={formatNumber(property.lawyerCustomValue ?? property.calcLawyer, true)}
              error={!property.lawyerCustomValue && !property.calcLawyer ? ' ' : undefined}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, '');
                if (raw === '' || !isNaN(Number(raw))) {
                  onUpdate('lawyerCustomValue', raw === '' ? 0 : Number(raw));
                }
              }}
              dir="ltr"
              disabled={isCalculating}
              isModified={property.lawyerCustomValue !== null || property.lawyerPercent !== rangeParams.lawyerPercent.default}
              onRollback={() => {
                if (property.lawyerCustomValue !== null) {
                  onUpdate('lawyerCustomValue', null);
                } else {
                  onUpdate('lawyerPercent', rangeParams.lawyerPercent.default);
                }
              }}
            />

            <EditableInput
              label={getPhrase(
                'property_real_estate_agent_label_without_value',
                'Real Estate Agent',
              )}
              interactiveProps={{
                percent: property.realEstateAgentPercent,
                min: rangeParams.realEstateAgentPercent.min,
                max: rangeParams.realEstateAgentPercent.max,
                step: rangeParams.realEstateAgentPercent.step,
                onPercentChange: (val) => onUpdate('realEstateAgentPercent', val),
                showPercent: property.realEstateAgentCustomValue === null,
              }}
              type="text"
              value={formatNumber(property.realEstateAgentCustomValue ?? property.calcRealEstateAgent, true)}
              error={!property.realEstateAgentCustomValue && !property.calcRealEstateAgent ? ' ' : undefined}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, '');
                if (raw === '' || !isNaN(Number(raw))) {
                  onUpdate('realEstateAgentCustomValue', raw === '' ? 0 : Number(raw));
                }
              }}
              dir="ltr"
              disabled={isCalculating}
              isModified={property.realEstateAgentCustomValue !== null || property.realEstateAgentPercent !== rangeParams.realEstateAgentPercent.default}
              onRollback={() => {
                if (property.realEstateAgentCustomValue !== null) {
                  onUpdate('realEstateAgentCustomValue', null);
                } else {
                  onUpdate('realEstateAgentPercent', rangeParams.realEstateAgentPercent.default);
                }
              }}
            />
          </div>

          {/* Col 2: Broker Mortgage & Repairing */}
          <div className="space-y-6">
            <SuggestedNumberInput
              label={getPhrase('property_broker_mortgage_label', 'Mortgage Broker (₪)')}
              value={property.calcBrokerMortgage || valueParams.brokerMortgage}
              onChange={(val) => onUpdate('calcBrokerMortgage', val)}
              disabled={isCalculating}
              defaultValue={property.defaultBrokerMortgage ?? valueParams.brokerMortgage}
            />
            <SuggestedNumberInput
              label={getPhrase('property_repairing_label', 'Renovation (₪)')}
              value={property.calcRepairing || valueParams.repairing}
              onChange={(val) => onUpdate('calcRepairing', val)}
              disabled={isCalculating}
              defaultValue={property.defaultRepairing ?? valueParams.repairing}
            />
          </div>

          {/* Col 3: Transfer Tax & Total */}
          <div className="space-y-6">
            <CalcInput
              label={getPhrase('property_transfer_tax_label', 'Transfer Tax')}
              value={formatCurrency(property.calcTransferTax)}
            />
            <SummaryField
              label={getPhrase('property_incidentals_total_label', 'Total Ancillary Expenses')}
              value={property.calcIncidentalsTotal ? formatCurrency(property.calcIncidentalsTotal) : ''}
              variant="amber"
            />
          </div>
        </Card>
      </section>

      {/* ── Section 5: Expected Rental Income ───────────────────────────── */}
      <section>
        {!isCompact && (
          <SectionHeader
            icon={<TrendingUp />}
            title={getPhrase('property_expected_income_header', 'Expected Rental Income')}
            variant="emerald"
          />
        )}

        <Card
          className={`${isCompact ? 'bg-transparent shadow-none border-none !p-0' : 'p-6'} md:p-10 grid grid-cols-1 md:grid-cols-2 ${colOverride || 'lg:grid-cols-4'} gap-6 relative`}
        >
          {calcOverlay}

          {/* Col 1: Projected Rent */}
          <div className="space-y-6">
            <EditableInput
              label={getPhrase(
                'property_rent_label_without_value',
                'Projected Rent',
              )}
              interactiveProps={{
                percent: property.rentPercent,
                min: rangeParams.rentPercent.min,
                max: rangeParams.rentPercent.max,
                step: rangeParams.rentPercent.step,
                onPercentChange: (val) => onUpdate('rentPercent', val),
                showPercent: property.rentCustomValue === null,
              }}
              type="text"
              value={formatNumber(property.rentCustomValue ?? property.calcRent, true)}
              error={!property.rentCustomValue && !property.calcRent ? ' ' : undefined}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, '');
                if (raw === '' || !isNaN(Number(raw))) {
                  onUpdate('rentCustomValue', raw === '' ? 0 : Number(raw));
                }
              }}
              dir="ltr"
              disabled={isCalculating}
              isEditable={false}
              isModified={property.rentCustomValue !== null || property.rentPercent !== rangeParams.rentPercent.default}
              onRollback={() => {
                if (property.rentCustomValue !== null) {
                  onUpdate('rentCustomValue', null);
                } else {
                  onUpdate('rentPercent', rangeParams.rentPercent.default);
                }
              }}
            />
          </div>

          {/* Col 2: Life Insurance */}
          <div className="space-y-6">
            <SuggestedNumberInput
              label={getPhrase('property_life_insurance_label', 'Life Insurance (₪/month)')}
              value={property.calcLifeInsurance || valueParams.lifeInsurance}
              onChange={(val) => onUpdate('calcLifeInsurance', val)}
              disabled={isCalculating}
              defaultValue={valueParams.lifeInsurance}
            />
          </div>

          {/* Col 3: Structure Insurance */}
          <div className="space-y-6">
            <SuggestedNumberInput
              label={getPhrase('property_structure_insurance_label', 'Structure Insurance (₪/month)')}
              value={property.calcStructureInsurance || valueParams.structureInsurance}
              onChange={(val) => onUpdate('calcStructureInsurance', val)}
              disabled={isCalculating}
              defaultValue={valueParams.structureInsurance}
            />
          </div>

          {/* Col 4: Rent Net */}
          <div className="space-y-6">
            <SummaryField
              label={getPhrase('property_rent_cleaning_expenses_label', 'Rent Net of Expenses (monthly)')}
              value={property.calcRentCleaningExpenses ? formatCurrency(Math.round(property.calcRentCleaningExpenses)) : ''}
              variant="emerald"
            />
          </div>
        </Card>
      </section>

      {/* ── Section 6: Mortgage Payment (conditional) ────────────────────── */}
      {property.showMortgagePrepayment && (
        <section>
          {!isCompact && (
            <SectionHeader
              icon={<Calendar />}
              title={getPhrase('property_mortgage_repaying_header', 'Mortgage Repayment')}
              variant="indigo"
            />
          )}

          <Card
            className={`${isCompact ? 'bg-transparent shadow-none border-none !p-0' : 'p-6'} md:p-10 grid grid-cols-1 md:grid-cols-2 ${colOverride || 'lg:grid-cols-3'} gap-8 relative`}
          >
            {calcOverlay}

            <SegmentedControl
              label={getPhrase('property_mortgage_period_label', 'Period')}
              value={property.calcMortgagePeriod}
              onChange={(val) => onUpdate('calcMortgagePeriod', val)}
              options={MORTGAGE_PERIODS}
              disabled={isCalculating}
              error={
                property.calcMortgagePeriod === ''
                  ? ' '
                  : isMortgagePeriodTooLong
                    ? getPhrase('property_mortgage_period_warning', 'Mortgage can only be taken until age 80')
                    : undefined
              }
              errorAsTooltip={true}
            />

            <CalcInput
              label={getPhrase('property_mortgage_monthly_repayment_label', 'Estimated Monthly Payment')}
              value={property.calcMortgageMonthlyRepayment ? formatCurrency(Math.round(property.calcMortgageMonthlyRepayment)) : ''}
              variant={
                property.calcMortgageMonthlyRepayment > property.calcPossibleMonthlyRepayment
                  ? 'danger'
                  : 'default'
              }
              errorAsTooltip={
                property.calcMortgageMonthlyRepayment > property.calcPossibleMonthlyRepayment
                  ? getPhrase(
                      'property_mortgage_monthly_repayment_warning',
                      `Monthly repayment (${formatCurrency(Math.round(property.calcMortgageMonthlyRepayment))}) exceeds the maximum possible repayment (${formatCurrency(Math.round(property.calcPossibleMonthlyRepayment))})`,
                    )
                  : getPhrase('property_mortgage_monthly_repayment_tooltip', 'Estimated monthly mortgage repayment')
              }
            />

            <CalcInput
              label={getPhrase('property_mortgage_monthly_yield_label', 'Monthly Return')}
              value={property.calcMortgageMonthlyYield ? formatCurrency(property.calcMortgageMonthlyYield) : ''}
              variant={property.calcMortgageMonthlyYield < 0 ? 'danger' : 'default'}
              errorAsTooltip={
                property.calcMortgageMonthlyYield < 0
                  ? getPhrase(
                      'property_mortgage_monthly_yield_warning',
                      'Monthly return is negative - expenses exceed income',
                    )
                  : undefined
              }
            />
          </Card>
        </section>
      )}
    </>
  );
};
