import { useCallback, useContext } from 'react'
import { SplashContext } from '../context/SplashContext'

export function useSplash() {
  const context = useContext(SplashContext)

  const getPhrase = useCallback(
    (key: string, fallback?: string): string => {
      const phrases = context?.phrases ?? {}
      if (key in phrases) return phrases[key]
      console.log(`[SPLASH] Missing phrase key: "${key}"`)

      return fallback ?? `[${key}]`
    },
    [context?.phrases]
  )

  const getParam = useCallback(
    (key: string, defaultValue: number): number => {
      const params = context?.fixedParameters ?? {}
      const value = params[key]
      return typeof value === 'number' && !isNaN(value) ? value : defaultValue
    },
    [context?.fixedParameters]
  )

  return {
    phrases: context?.phrases ?? {},
    params: (context?.fixedParameters ?? {}) as Record<string, unknown>,
    isReady: context?.isReady ?? false,
    isLoading: context?.isLoading ?? false,
    forceFetchSplash: context?.forceFetchSplash ?? (() => {}),
    getPhrase,
    getParam,
  }
}
