import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { trackerService } from '../services/tracker.service'

export const useActivityTracker = ({ trackerUUID }: { trackerUUID: string | null }) => {
  const { pathname } = useLocation()
  const scrollThresholdsRef = useRef<Set<number>>(new Set())

  // Navigation event — fires on every pathname change
  useEffect(() => {
    if (!trackerUUID) return
    scrollThresholdsRef.current = new Set()
    console.log(`[NAV] Navigated to ${pathname}`)
    trackerService.insertTrackerEvent(trackerUUID, {
      type: 'navigation',
      tag: 'NAV',
      action: `Navigated to ${pathname}`,
      page: pathname,
      timestamp: new Date().toISOString(),
    })
  }, [pathname, trackerUUID])

  // Click, focus, blur, scroll, idle listeners
  useEffect(() => {
    if (!trackerUUID) return

    const getPage = () => window.location.pathname

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const el = (target.closest('[data-track], button, a, [role="button"]') as HTMLElement) ?? target
      const label =
        el.dataset?.track ||
        el.getAttribute('aria-label') ||
        el.textContent?.trim().slice(0, 40) ||
        ''
      if (!label) return
      const tagName = el.tagName.toLowerCase()
      console.log(`[UI] Click — ${tagName} '${label}' @ ${getPage()}`)
      trackerService.insertTrackerEvent(trackerUUID, {
        type: 'click',
        tag: 'UI',
        action: `Click — ${tagName} '${label}' @ ${getPage()}`,
        page: getPage(),
        timestamp: new Date().toISOString(),
      })
    }

    const resolveInputLabel = (input: HTMLInputElement): string =>
      input.dataset.track ||
      input.getAttribute('aria-label') ||
      (input.id ? document.querySelector(`label[for="${input.id}"]`)?.textContent?.trim() ?? '' : '') ||
      input.placeholder ||
      input.name ||
      'unknown'

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      const input = target as HTMLInputElement
      if (input.type === 'password') return
      const label = resolveInputLabel(input)
      console.log(`[UI] Focus — input '${label}' @ ${getPage()}`)
      trackerService.insertTrackerEvent(trackerUUID, {
        type: 'focus',
        tag: 'UI',
        action: `Focus — input '${label}' @ ${getPage()}`,
        page: getPage(),
        timestamp: new Date().toISOString(),
      })
    }

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      const input = target as HTMLInputElement
      if (input.type === 'password') return
      const label = resolveInputLabel(input)
      const filled = input.value.trim().length > 0
      console.log(`[UI] Blur — input '${label}'${filled ? ' — filled' : ''} @ ${getPage()}`)
      trackerService.insertTrackerEvent(trackerUUID, {
        type: 'blur',
        tag: 'UI',
        action: `Blur — input '${label}'${filled ? ' — filled' : ''} @ ${getPage()}`,
        page: getPage(),
        timestamp: new Date().toISOString(),
        meta: { field: label, filled },
      })
    }

    let scrollTimer: ReturnType<typeof setTimeout> | null = null
    const handleScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        const pct = Math.round(
          ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
        )
        for (const threshold of [25, 50, 75, 100]) {
          if (pct >= threshold && !scrollThresholdsRef.current.has(threshold)) {
            scrollThresholdsRef.current.add(threshold)
            console.log(`[UI] Scroll — ${threshold}% @ ${getPage()}`)
            trackerService.insertTrackerEvent(trackerUUID, {
              type: 'scroll',
              tag: 'UI',
              action: `Scroll — ${threshold}% @ ${getPage()}`,
              page: getPage(),
              timestamp: new Date().toISOString(),
              meta: { percent: threshold },
            })
          }
        }
      }, 300)
    }

    const IDLE_MS = 30_000
    let idleTimer: ReturnType<typeof setTimeout> | null = null

    const fireIdle = () => {
      console.log(`[UI] Idle — 30s @ ${getPage()}`)
      trackerService.insertTrackerEvent(trackerUUID, {
        type: 'idle',
        tag: 'UI',
        action: `Idle — 30s @ ${getPage()}`,
        page: getPage(),
        timestamp: new Date().toISOString(),
      })
    }

    const resetIdle = () => {
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(fireIdle, IDLE_MS)
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', resetIdle, { passive: true })
    window.addEventListener('keydown', resetIdle, { passive: true })
    window.addEventListener('touchstart', resetIdle, { passive: true })

    resetIdle()

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', resetIdle)
      window.removeEventListener('keydown', resetIdle)
      window.removeEventListener('touchstart', resetIdle)
      if (scrollTimer) clearTimeout(scrollTimer)
      if (idleTimer) clearTimeout(idleTimer)
    }
  }, [trackerUUID])
}
