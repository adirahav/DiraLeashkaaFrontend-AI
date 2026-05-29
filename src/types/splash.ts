export interface Phrase {
  key: string
  value: string
}

export interface FixedParameter {
  key: string
  value: number
  description?: string
}

export interface SplashApiResponse {
  phrases: Phrase[]
  fixedParameters: Record<string, unknown>
  user: unknown
  announcements: unknown
  newVersionAvailable: boolean
}

export interface SplashData {
  phrases: Record<string, string>
  fixedParameters: Record<string, unknown>
  timestamp: number
}
