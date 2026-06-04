import { httpService } from './http.service'
import { useStore } from '../store/store'
import { SplashApiResponse } from '../types/splash'
import { AdditionalFundingSource, HomeResponse } from '../types'

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
  getHome,
  completeTour,
}

async function fetchSplash(lang: string): Promise<SplashApiResponse> {
  console.log(`[SPLASH] Call API GET '/user/splash' — lang: ${lang}`)
  const data = await httpService.get<SplashApiResponse>('/user/splash', { lang })
  console.log(`[SPLASH] API GET '/user/splash' response: splash data loaded`)
  return data
}

async function updateUser(data: UserUpdateData): Promise<string> {
  console.log(`[API] Call API PUT '/user/' — fields: ${Object.keys(data).join(', ')}`)
  const currentToken = useStore.getState().token?.replace(/^"|"$/g, '') ?? undefined
  const raw = await httpService.put<string>('/user/', data, currentToken, { responseType: 'text' })
  const token = raw.replace(/^"|"$/g, '')
  console.log(`[API] API PUT '/user/' response: new token received`)
  return token
}

async function getHome(fullData: boolean): Promise<HomeResponse> {
  console.log(`[API] Call API GET '/user/home' — fullData: ${fullData}`)
  const currentToken = useStore.getState().token?.replace(/^"|"$/g, '') ?? undefined
  const data = await httpService.get<HomeResponse>('/user/home', { fullData }, currentToken)
  useStore.getState().setHome(data)
  console.log(`[API] API GET '/user/home' response:`, data)
  return data
}

async function completeTour(): Promise<void> {
  console.log(`[API] Call API PATCH '/user/tourCompleted'`)
  const currentToken = useStore.getState().token?.replace(/^"|"$/g, '') ?? undefined
  await httpService.patch<void>('/user/tourCompleted', {}, currentToken)
  console.log(`[API] API PATCH '/user/tourCompleted' response: tour marked complete`)
}
