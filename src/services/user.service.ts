import { httpService } from './http.service'
import { useStore } from '../store/store'
import { SplashApiResponse } from '../types/splash'
import { AdditionalFundingSource } from '../types'

export interface UserUpdateData {
  fullname?: string
  yearOfBirth?: number
  termsOfUseAccept?: boolean
  equity?: number
  incomes?: number
  commitments?: number
  additionalFundingSources?: AdditionalFundingSource[]
  appDeviceType?: string
  appVersion?: string
  registrationStartTime?: string
  registrationExpiredTime?: string
}

export const userService = {
  fetchSplash,
  updateUser,
}

async function fetchSplash(lang: string): Promise<SplashApiResponse> {
  return httpService.get<SplashApiResponse>('/user/splash', { lang })
}

async function updateUser(data: UserUpdateData): Promise<string> {
  const currentToken = useStore.getState().token?.replace(/^"|"$/g, '') ?? undefined
  const raw = await httpService.put<string>('/user/', data, currentToken, { responseType: 'text' })
  return raw.replace(/^"|"$/g, '')
}
