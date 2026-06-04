import { StateCreator } from 'zustand'
import { RootState } from '../store'
import { PropertyData, PropertyFundingSource } from '../../types/property.types'
import { User } from '../../types'

export interface PropertySlice {
  currentProperty: PropertyData | null
  isCalculating: boolean
  setField: (name: string, value: any) => void
  setFields: (updates: Record<string, any>, triggerField?: string) => void
  setCurrentProperty: (property: PropertyData) => void
  initProperty: (user: User | null, params?: Record<string, unknown>) => void
  setCalculating: (val: boolean) => void
}

type P = Record<string, unknown> | undefined

function propertyInputDefault(params: P, name: string, fallback: number): number {
  try {
    const raw = params?.['propertyInputs']
    if (!raw) return fallback
    const arr: { name: string; default?: number | null }[] = typeof raw === 'string' ? JSON.parse(raw) : (raw as any[])
    const found = arr.find((p) => p.name === name)
    return (found && found.default != null) ? found.default : fallback
  } catch { return fallback }
}

function interestDefault(params: P, name: string, fallback: number): number {
  try {
    const raw = params?.['indexesAndInterests']
    if (!raw) return fallback
    const arr: { name: string; default?: number | null }[] = typeof raw === 'string' ? JSON.parse(raw) : (raw as any[])
    const found = arr.find((p) => p.name === name)
    return (found && found.default != null) ? found.default : fallback
  } catch { return fallback }
}

function defaultMortgagePeriod(params: P, fallback: string): string {
  try {
    const raw = params?.['mortgagePeriods']
    if (!raw) return fallback
    const arr: { key: string; default?: boolean }[] = typeof raw === 'string' ? JSON.parse(raw) : (raw as any[])
    return arr.find((p) => p.default === true)?.key ?? fallback
  } catch { return fallback }
}

function buildDefaultProperty(user: User | null, params?: Record<string, unknown>): PropertyData {
  const equity = user ? parseInt(user.equity) || 0 : 0
  const incomes = user ? parseInt(user.incomes) || 0 : 0
  const commitments = user ? parseInt(user.commitments) || 0 : 0
  const fundingSources: PropertyFundingSource[] = (user?.additionalFundingSources || []).map((s) => ({
    id: s.uuid,
    name: s.source,
    amount: s.amount,
    monthlyRepayment: s.repayment,
  }))

  return {
    city: '',
    cityElse: '',
    address: '',
    apartmentType: '',
    price: '',
    note: '',
    calcEquity: equity,
    defaultEquity: equity,
    calcAdditionalFunding: { totalAmount: 0, totalMonthlyRepayment: 0 },
    calcEquityCleaningExpenses: 0,
    calcMortgageRequired: 0,
    showMortgagePrepayment: true,
    defaultIncomes: incomes,
    calcIncomes: incomes,
    defaultCommitments: commitments,
    calcCommitments: commitments,
    additionalFundingSources: fundingSources,
    selectedFundingSourceIds: [],
    calcDisposableIncome: 0,
    calcPossibleMonthlyRepayment: 0,
    possibleMonthlyRepaymentCustomValue: null,
    defaultPossibleMonthlyRepayment: 0,
    possibleMonthlyRepaymentPercent: propertyInputDefault(params, 'possibleMonthlyRepaymentPercent', -1),
    calcMaxPercentOfFinancing: 75,
    calcActualPercentOfFinancing: 0,
    calcLawyer: 0,
    lawyerCustomValue: null,
    defaultLawyer: 0,
    lawyerPercent: propertyInputDefault(params, 'lawyerPercent', -1),
    calcRealEstateAgent: 0,
    realEstateAgentCustomValue: null,
    defaultRealEstateAgent: 0,
    realEstateAgentPercent: propertyInputDefault(params, 'realEstateAgentPercent', -1),
    calcBrokerMortgage: 0,
    calcRepairing: 0,
    calcTransferTax: 0,
    calcIncidentalsTotal: 0,
    calcRent: 0,
    rentCustomValue: null,
    defaultRent: 0,
    rentPercent: propertyInputDefault(params, 'rentPercent', -1),
    calcLifeInsurance: 0,
    calcStructureInsurance: 0,
    calcRentCleaningExpenses: 0,
    calcMortgagePeriod: defaultMortgagePeriod(params, ''),
    calcMortgageMonthlyRepayment: 0,
    calcMortgageMonthlyYield: 0,
    calcInterestPercent: interestDefault(params, 'interestPercent', -1),
    calcInterestIn5YearsPercent: interestDefault(params, 'interestIn5YearsPercent', -1),
    calcInterestIn10YearsPercent: interestDefault(params, 'interestIn10YearsPercent', -1),
    calcAverageInterestAtTakingPercent: interestDefault(params, 'averageInterestAtTakingPercent', -1),
    calcAverageInterestAtMaturityPercent: interestDefault(params, 'averageInterestAtMaturityPercent', -1),
    calcIndexPercent: interestDefault(params, 'indexPercent', -1),
    calcForecastAnnualPriceIncreasePercent: interestDefault(params, 'forecastAnnualPriceIncreasePercent', -1),
    calcSalesCostsPercent: interestDefault(params, 'salesCostsPercent', -1),
    calcDepreciationForTaxPurposesPercent: interestDefault(params, 'depreciationForTaxPurposesPercent', -1),
    loggedinUserCalcAge: 0,
    calcYieldForecast: null,
    calcAmortizationSchedule: null,
    media: [],
  }
}

export { buildDefaultProperty }

export const createPropertySlice: StateCreator<RootState, [], [], PropertySlice> = (set) => ({
  currentProperty: null,
  isCalculating: false,

  setField: (name, value) =>
    set((state) => ({
      currentProperty: state.currentProperty
        ? { ...state.currentProperty, [name]: value, updatedByField: name }
        : state.currentProperty,
    })),

  setFields: (updates, triggerField) =>
    set((state) => ({
      currentProperty: state.currentProperty
        ? {
            ...state.currentProperty,
            ...updates,
            updatedByField: triggerField ?? Object.keys(updates)[0],
          }
        : state.currentProperty,
    })),

  setCurrentProperty: (property) => {
    console.log(`[STORE] Current property set: uuid=${property.uuid ?? 'new'}`)
    set({ currentProperty: property })
  },

  initProperty: (user, params) => {
    console.log(`[STORE] Property initialized for user: ${user?.email ?? 'guest'}`)
    set({ currentProperty: buildDefaultProperty(user, params) })
  },

  setCalculating: (val) => {
    console.log(`[STORE] Calculating state: ${val}`)
    set({ isCalculating: val })
  },
})
