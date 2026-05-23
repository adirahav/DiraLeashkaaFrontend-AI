export interface CloudinaryMediaNode {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  type: string;
}

export interface AmortizationRow {
  monthNo: number;
  fundBop: number;
  interest: number;
  monthlyRepayments: number;
  fundRefund: number;
  interestRepayment: number;
  fundEop: number;
}

export interface YieldForecastRow {
  monthNo: number;
  propertyPrice: number;
  rent: number;
  financingCosts: number;
  valuationInRealization: number;
  commendationTax: number;
  profit: number;
  totalReturn: number;
  returnOnEquity: number;
}

export interface PropertyFundingSource {
  id: string
  name: string
  amount: number
  monthlyRepayment: number
}

export interface PropertyData {
  // Identifiers & metadata
  uuid?: string
  updatedByField?: string
  media?: CloudinaryMediaNode[]

  // Server-computed financial results (null until backend responds)
  calcYieldForecast?: YieldForecastRow[] | null
  calcAmortizationSchedule?: AmortizationRow[] | null

  // Part 1 - Property Details & Equity
  city: string
  cityElse?: string
  address?: string
  apartmentType: string
  price: number | ''
  note?: string

  // Equity
  calcEquity: number
  defaultEquity: number
  calcAdditionalFunding: { totalAmount: number; totalMonthlyRepayment: number }
  calcEquityCleaningExpenses: number
  calcMortgageRequired: number

  // Visibility gate for Sections 3 & 6
  showMortgagePrepayment: boolean

  // Part 2 - Monthly Income & Repayment
  defaultIncomes: number
  calcIncomes: number
  defaultCommitments: number
  calcCommitments: number
  additionalFundingSources: PropertyFundingSource[]
  selectedFundingSourceIds: string[]
  calcDisposableIncome: number
  calcPossibleMonthlyRepayment: number
  possibleMonthlyRepaymentCustomValue: number | null
  defaultPossibleMonthlyRepayment: number
  possibleMonthlyRepaymentPercent: number

  // Part 3 - Financing Status
  calcMaxPercentOfFinancing: number
  calcActualPercentOfFinancing: number

  // Part 4 - Ancillary Expenses
  calcLawyer: number
  lawyerCustomValue: number | null
  defaultLawyer: number
  lawyerPercent: number
  calcRealEstateAgent: number
  realEstateAgentCustomValue: number | null
  defaultRealEstateAgent: number
  realEstateAgentPercent: number
  calcBrokerMortgage: number
  defaultBrokerMortgage?: number
  calcRepairing: number
  defaultRepairing?: number
  calcTransferTax: number
  calcIncidentalsTotal: number

  // Part 5 - Expected Rental Income
  calcRent: number
  rentCustomValue: number | null
  defaultRent: number
  rentPercent: number
  calcLifeInsurance: number
  calcStructureInsurance: number
  calcRentCleaningExpenses: number

  // Part 6 - Mortgage Payment (when showMortgagePrepayment)
  calcMortgagePeriod: string
  calcMortgageMonthlyRepayment: number
  calcMortgageMonthlyYield: number

  // Part 7 - Interests & Indexes (when showMortgagePrepayment)
  calcInterestPercent: number
  calcInterestIn5YearsPercent: number
  calcInterestIn10YearsPercent: number
  calcAverageInterestAtTakingPercent: number
  calcAverageInterestAtMaturityPercent: number
  calcIndexPercent: number
  calcForecastAnnualPriceIncreasePercent: number
  calcSalesCostsPercent: number
  calcDepreciationForTaxPurposesPercent: number
  defaultInterestPercent?: number
  defaultInterestIn5YearsPercent?: number
  defaultInterestIn10YearsPercent?: number
  defaultAverageInterestAtTakingPercent?: number
  defaultAverageInterestAtMaturityPercent?: number
  defaultIndexPercent?: number
  defaultForecastAnnualPriceIncreasePercent?: number
  defaultSalesCostsPercent?: number
  defaultDepreciationForTaxPurposesPercent?: number

  // User context for mortgage age warning
  loggedinUserCalcAge: number
}
