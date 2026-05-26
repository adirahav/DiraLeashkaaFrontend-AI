export interface AdditionalFundingSource {
  uuid: string
  source: string
  amount: number
  repayment: number
}

export interface User {
  fullname: string
  email: string
  yearOfBirth: string
  equity: string
  incomes: string
  commitments: string
  termsOfUseAccept: string
  additionalFundingSources?: AdditionalFundingSource[]
  tourCompletedTime: string | null
}

export interface PendingApiCall {
  method: string
  endpoint: string
  data?: Record<string, any> | null
}

export interface PendingAction {
  returnPath: string
  apiCall?: PendingApiCall
}

export interface Property {
  uuid: string
  city?: string
  cityElse?: string
  address?: string
  info?: string
  images?: string[]
  calcYields?: {
    averageReturn: number
    averageReturnOnEquity: number
    profit: number
    profitNpv: number
    yieldForecast?: string
  } | null
}

export interface HomeResponse {
  properties: Property[]
  bestYields?: Property[]
  fullData: boolean
}
