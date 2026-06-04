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
  console.log(`[API] Call API GET '/calculator'`)
  const data = await httpService.get<CalculatorItem[]>('/calculator', null, token())
  console.log(`[API] API GET '/calculator' response: ${data.length} calculators`)
  return data
}

function token() {
  return useStore.getState().token?.replace(/^"|"$/g, '') ?? undefined
}

async function getMaxPrice(): Promise<PropertyData> {
  console.log(`[API] Call API GET '/calculator/maxPrice'`)
  const data = await httpService.get<PropertyData>('/calculator/maxPrice', null, token())
  console.log(`[API] API GET '/calculator/maxPrice' response:`, data)
  return data
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
  console.log(`[API] Call API PUT '/calculator/maxPrice' — fieldName: ${backendName}`)
  const data = await httpService.put<PropertyData>('/calculator/maxPrice', { fieldName: backendName, fieldValue: toServerValue(backendName, fieldValue) }, token())
  console.log(`[API] API PUT '/calculator/maxPrice' response:`, data)
  return data
}

export interface CompareListResponse {
  allProperties: PropertyData[];
  comparedPropertiesUUIDs?: string[];
}

async function getCompareList(): Promise<CompareListResponse> {
  console.log(`[API] Call API GET '/calculator/compare'`)
  const data = await httpService.get<CompareListResponse>('/calculator/compare', null, token())
  console.log(`[API] API GET '/calculator/compare' response: ${data.allProperties.length} properties, ${data.comparedPropertiesUUIDs?.length ?? 0} compared`)
  return data
}

async function updateCompareList(propertiesExternalIds: string[]): Promise<void> {
  console.log(`[API] Call API PUT '/calculator/compare' — ${propertiesExternalIds.length} properties`)
  await httpService.put<void>('/calculator/compare', { propertiesExternalIds }, token())
  console.log(`[API] API PUT '/calculator/compare' response: list updated`)
}
