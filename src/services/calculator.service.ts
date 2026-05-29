import { httpService } from './http.service'
import { useStore } from '../store/store'
import { PropertyData } from '../types/property.types'
import { CalculatorItem } from '../types/index'

export const calculatorService = {
  getAll,
  getMaxPrice,
  updateMaxPrice,
  getCompareList,
  updateCompareList,
}

async function getAll(): Promise<CalculatorItem[]> {
  return httpService.get<CalculatorItem[]>('/calculator', null, token())
}

function token() {
  return useStore.getState().token?.replace(/^"|"$/g, '') ?? undefined
}

async function getMaxPrice(): Promise<PropertyData> {
  return httpService.get<PropertyData>('/calculator/maxPrice', null, token())
}

const FIELD_NAME_MAP: Record<string, string> = {
  calcEquity:                 'equity',
  defaultIncomes:             'incomes',
  defaultCommitments:        'commitments',
  calcMortgagePeriod:        'mortgagePeriod',
  calcBrokerMortgage:        'brokerMortgage',
  calcRepairing:             'repairing',
  calcLifeInsurance:         'lifeInsurance',
  calcStructureInsurance:    'structureInsurance',
  selectedFundingSourceIds:  'additionalFundingSources',
}

const FLOAT_FIELDS = new Set([
  'possibleMonthlyRepaymentPercent',
  'lawyerPercent',
  'realEstateAgentPercent',
  'rentPercent',
])

function toBackendField(name: string): string {
  return FIELD_NAME_MAP[name] ?? name
}

function toServerValue(backendName: string, value: any): any {
  if (
    FLOAT_FIELDS.has(backendName) &&
    typeof value === 'number' &&
    Number.isFinite(value) &&
    Number.isInteger(value)
  ) {
    return value.toFixed(1)
  }
  return value
}

async function updateMaxPrice(fieldName: string, fieldValue: any): Promise<PropertyData> {
  const backendName = toBackendField(fieldName)
  return httpService.put<PropertyData>('/calculator/maxPrice', { fieldName: backendName, fieldValue: toServerValue(backendName, fieldValue) }, token())
}

export interface CompareListResponse {
  allProperties: PropertyData[];
  comparedPropertiesUUIDs?: string[];
}

async function getCompareList(): Promise<CompareListResponse> {
  return httpService.get<CompareListResponse>('/calculator/compare', null, token())
}

async function updateCompareList(propertiesExternalIds: string[]): Promise<void> {
  return httpService.put<void>('/calculator/compare', { propertiesExternalIds }, token())
}
