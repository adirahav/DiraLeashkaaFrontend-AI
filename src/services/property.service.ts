import { httpService } from './http.service'
import { useStore } from '../store/store'
import { PropertyData } from '../types/property.types'

export const propertyService = {
  getById,
  create,
  save,
  archive,
}

// Maps frontend PropertyData field names → backend API field names
const FIELD_NAME_MAP: Record<string, string> = {
  calcEquity:                             'equity',
  defaultIncomes:                         'incomes',
  defaultCommitments:                     'commitments',
  calcMortgagePeriod:                     'mortgagePeriod',
  showMortgagePrepayment:                 'showInterestsContainer',
  calcBrokerMortgage:                     'brokerMortgage',
  calcRepairing:                          'repairing',
  calcLifeInsurance:                      'lifeInsurance',
  calcStructureInsurance:                 'structureInsurance',
  calcInterestPercent:                    'interestPercent',
  calcInterestIn5YearsPercent:            'interestIn5YearsPercent',
  calcInterestIn10YearsPercent:           'interestIn10YearsPercent',
  calcAverageInterestAtTakingPercent:     'averageInterestAtTakingPercent',
  calcAverageInterestAtMaturityPercent:   'averageInterestAtMaturityPercent',
  calcIndexPercent:                       'indexPercent',
  calcForecastAnnualPriceIncreasePercent: 'forecastAnnualPriceIncreasePercent',
  calcSalesCostsPercent:                  'salesCostsPercent',
  calcDepreciationForTaxPurposesPercent:  'depreciationForTaxPurposesPercent',
  selectedFundingSourceIds:               'additionalFundingSources',
}

const FLOAT_FIELD_NAMES = new Set([
  'possibleMonthlyRepaymentPercent',
  'lawyerPercent',
  'realEstateAgentPercent',
  'rentPercent',
  'indexPercent',
  'interestPercent',
  'interestIn5YearsPercent',
  'interestIn10YearsPercent',
  'averageInterestAtTakingPercent',
  'averageInterestAtMaturityPercent',
  'interestToCapitalizePercent',
  'forecastAnnualPriceIncreasePercent',
  'salesCostsPercent',
  'depreciationForTaxPurposesPercent',
])

function toBackendField(name: string): string {
  return FIELD_NAME_MAP[name] ?? name
}

// Server _isNullOrFloat rejects integer numbers (40 % 1 === 0), accepts strings with "." or non-integer numbers
function toServerValue(backendName: string, fieldValue: any): any {
  if (
    FLOAT_FIELD_NAMES.has(backendName) &&
    typeof fieldValue === 'number' &&
    Number.isFinite(fieldValue) &&
    Number.isInteger(fieldValue)
  ) {
    return fieldValue.toFixed(1)
  }
  return fieldValue
}

function token() {
  return useStore.getState().token?.replace(/^"|"$/g, '') ?? undefined
}

async function getById(uuid: string, options?: { calcYields?: boolean }): Promise<PropertyData> {
  console.log(`[PROPERTY] Call API GET '/property/${uuid}'`)
  const params = options?.calcYields ? { calcYields: true } : null
  const data = await httpService.get<PropertyData>(`/property/${uuid}`, params, token())
  console.log(`[PROPERTY] API GET '/property/${uuid}' response:`, data)
  return data
}

async function create(fieldName: string, fieldValue: any, defaults?: Record<string, any>): Promise<PropertyData> {
  const backendName = toBackendField(fieldName)
  console.log(`[PROPERTY] Call API POST '/property' — fieldName: ${backendName}`)
  const data = await httpService.post<PropertyData>('/property', { fieldName: backendName, fieldValue: toServerValue(backendName, fieldValue), ...defaults }, token())
  console.log(`[PROPERTY] API POST '/property' response: uuid=${data.uuid}`)
  return data
}

async function save(uuid: string, fieldName: string, fieldValue: any): Promise<PropertyData> {
  const backendName = toBackendField(fieldName)
  console.log(`[PROPERTY] Call API PUT '/property' — uuid: ${uuid}, fieldName: ${backendName}`)
  const data = await httpService.put<PropertyData>('/property', { propertyUUID: uuid, fieldName: backendName, fieldValue: toServerValue(backendName, fieldValue) }, token())
  console.log(`[PROPERTY] API PUT '/property' response:`, data)
  return data
}

async function archive(uuid: string): Promise<void> {
  console.log(`[PROPERTY] Call API PATCH '/property/${uuid}/archive'`)
  await httpService.patch(`/property/${uuid}/archive`, null, token())
  console.log(`[PROPERTY] API PATCH '/property/${uuid}/archive' response: archived`)
}
