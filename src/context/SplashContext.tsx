import React, { createContext, useEffect, useRef, useState } from 'react'
import { SplashApiResponse, SplashData } from '../types/splash'
import { userService } from '../services/user.service'
import { saveWithExpiry, getWithExpiry } from '../services/util.service'
import { useStore } from '../store/store'

const PHRASES_KEY = 'app_splash_phrases'
const PARAMS_KEY = 'app_splash_params'
const TTL = 24 * 60 * 60 * 1000
const STALE_THRESHOLD = 12 * 60 * 60 * 1000

type CachedPhrases = { phrases: Record<string, string>; timestamp: number }

const activeFetches = new Set<string>()

function normalize(response: SplashApiResponse): SplashData {
  return {
    phrases: Object.fromEntries((response.phrases ?? []).map((p) => [p.key, p.value])),
    fixedParameters: response.fixedParameters ?? {},
    timestamp: Date.now(),
  }
}

export interface SplashContextValue {
  phrases: Record<string, string>
  fixedParameters: Record<string, number>
  isReady: boolean
  isLoading: boolean
}

export const SplashContext = createContext<SplashContextValue | null>(null)

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const lang = useStore((s) => s.lang) ?? 'he'
  const [splash, setSplash] = useState<SplashData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const backgroundRunning = useRef(false)

  useEffect(() => {
    let cancelled = false
    const phrasesKey = `${PHRASES_KEY}_${lang}`

    async function backgroundRefresh() {
      if (backgroundRunning.current) return
      backgroundRunning.current = true
      try {
        const response = await userService.fetchSplash(lang)
        const normalized = normalize(response)
        await Promise.all([
          saveWithExpiry<CachedPhrases>(phrasesKey, { phrases: normalized.phrases, timestamp: normalized.timestamp }, TTL),
          saveWithExpiry(PARAMS_KEY, normalized.fixedParameters, TTL),
        ])
      } catch {
        // silent — cache stays unchanged
      } finally {
        backgroundRunning.current = false
      }
    }

    async function hydrate() {
      const cachedPhrases = await getWithExpiry<CachedPhrases>(phrasesKey)
      const cachedParams = await getWithExpiry<Record<string, number>>(PARAMS_KEY)

      const hasFreshCache =
        cachedPhrases && !cachedPhrases.isExpired &&
        cachedParams && !cachedParams.isExpired

      if (hasFreshCache) {
        if (!cancelled) setSplash({
          phrases: cachedPhrases.data.phrases,
          fixedParameters: cachedParams.data,
          timestamp: cachedPhrases.data.timestamp,
        })
        const isStale = Date.now() - cachedPhrases.data.timestamp > STALE_THRESHOLD
        if (isStale) backgroundRefresh()
        return
      }

      // Foreground fetch — missing or either expired
      if (activeFetches.has(phrasesKey)) return
      activeFetches.add(phrasesKey)
      if (!cancelled) setIsLoading(true)
      try {
        const response = await userService.fetchSplash(lang)
        const normalized = normalize(response)
        await Promise.all([
          saveWithExpiry<CachedPhrases>(phrasesKey, { phrases: normalized.phrases, timestamp: normalized.timestamp }, TTL),
          saveWithExpiry(PARAMS_KEY, normalized.fixedParameters, TTL),
        ])
        if (!cancelled) setSplash(normalized)
      } catch {
        // Fallback to stale data to keep app functional
        if (!cancelled && cachedPhrases?.data && cachedParams?.data) {
          setSplash({
            phrases: cachedPhrases.data.phrases,
            fixedParameters: cachedParams.data,
            timestamp: cachedPhrases.data.timestamp,
          })
        }
      } finally {
        activeFetches.delete(phrasesKey)
        if (!cancelled) setIsLoading(false)
      }
    }

    hydrate()

    return () => {
      cancelled = true
    }
  }, [lang])

  return (
    <SplashContext.Provider
      value={{
        phrases: splash?.phrases ?? {},
        fixedParameters: splash?.fixedParameters ?? {},
        isReady: splash !== null,
        isLoading,
      }}
    >
      {children}
    </SplashContext.Provider>
  )
}
