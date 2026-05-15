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
}

export interface Property {
  id: string
  city: string
  address: string
  info: string
  images: string[]
  calcYields?: {
    averageReturn: number
    averageReturnOnEquity: number
    profit: number
    profitNpv: number
  } | null
}
