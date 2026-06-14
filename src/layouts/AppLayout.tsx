import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { useStore } from '../store/store'
import { Header } from '../components/common/Header'
import { Footer } from '../components/common/Footer'
import { AccessibilityMenu } from '../components/common/AccessibilityMenu'
import { Notification } from '../components/common/Notification'
import { UpgradeRecommended } from '../components/versioning/UpgradeRecommended'
import { useSplash } from '../hooks/useSplash'
import { useActivityTracker } from '../hooks/useActivityTracker'
import { trackerService } from '../services/tracker.service'

interface AppLayoutProps {
  showRecommendedBanner: boolean
  updateUrl: string
  onDismissBanner: () => void
  onForeground?: () => void
}

export const AppLayout = ({ showRecommendedBanner, updateUrl, onDismissBanner, onForeground }: AppLayoutProps) => {
  const isResultsMode = useStore((state) => state.isResultsMode)
  const notification = useStore((state) => state.notification)
  const clearNotification = useStore((state) => state.clearNotification)
  const trackerUUID = useStore((state) => state.trackerUUID)
  const isTracking = useStore((state) => state.isTracking)
  const { getPhrase } = useSplash()

  useActivityTracker({ trackerUUID: isTracking ? trackerUUID : null })

  // Patch tracker as 'drop' on browser tab/window close (web only)
  useEffect(() => {
    if (Capacitor.isNativePlatform()) return

    const handleVisibilityChange = () => {
      if (!document.hidden) return
      const uuid = useStore.getState().trackerUUID
      const token = useStore.getState().token
      if (!uuid || !token) return

      const BASE_URL = import.meta.env.VITE_API_URL as string
      fetch(`${BASE_URL}/tracker/${uuid}`, {
        method: 'PATCH',
        keepalive: true, // survives page unload
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'drop', endedAt: new Date().toISOString() }),
      }).catch(() => {/* silent — page is closing */})
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, []) // empty deps — reads live values from store at event time

  // Patch tracker as 'drop' when app goes to background on native
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    let handle: Awaited<ReturnType<typeof CapacitorApp.addListener>> | null = null

    CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        onForeground?.()
      } else if (trackerUUID) {
        trackerService.patchTracker(trackerUUID, {
          status: 'drop',
          endedAt: new Date().toISOString(),
        })
      }
    }).then((h) => { handle = h })

    return () => { handle?.remove() }
  }, [trackerUUID, onForeground])

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 max-w-full">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[200] bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
      >
        {getPhrase('app_skip_to_main_content', 'Skip to main content')}
      </a>

      {showRecommendedBanner && (
        <UpgradeRecommended updateUrl={updateUrl} onClose={onDismissBanner} />
      )}

      {!isResultsMode && <Header />}

      <Notification
        isVisible={!!notification && notification.type !== 'info'}
        type={(notification?.type as 'success' | 'error') ?? 'success'}
        message={notification?.message ?? ''}
        onClose={clearNotification}
      />

      <div id="app-content" className="flex-1 flex flex-col">
        <main id="main-content" className="flex-1" tabIndex={-1}>
          <Outlet />
        </main>

        {!isResultsMode && <Footer />}
      </div>

      <AccessibilityMenu />
    </div>
  )
}
