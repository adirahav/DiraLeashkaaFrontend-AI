import { httpService } from './http.service'
import { SplashApiResponse } from '../types/splash'

export const userService = {
  fetchSplash,
}

async function fetchSplash(lang: string): Promise<SplashApiResponse> {
  return httpService.get<SplashApiResponse>('/user/splash', { lang })
}
