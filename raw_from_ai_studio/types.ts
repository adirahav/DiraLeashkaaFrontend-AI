
export type Screen = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'HOME' | 'PROPERTY' | 'PROFILE' | 'TERMS' | 'ACCESSIBILITY_STATEMENT' | 'CONTACT_US' | 'PERSONAL_DETAILS' | 'FINANCIAL_DATA' | 'CALCULATORS' | 'MAX_PRICE' | 'COMPARE_PROPERTIES';

export interface UserData {
  fullname: string;
  email: string;
  yearOfBirth: string;
  equity: string;
  incomes: string;
  commitments: string;
  termsOfUseAccept: string;
}

export interface Property {
  id: string;
  city: string;
  address: string;
  info: string;
  images: string[];
  calcYields?: {
    averageReturn: number;
    averageReturnOnEquity: number;
    profit: number;
    profitNpv: number;
  } | null;
}
