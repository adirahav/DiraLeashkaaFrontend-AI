import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { AppLayout } from './layouts/AppLayout'
import { ProtectedRoute } from './router/ProtectedRoute'
import { PermissionRoute } from './router/PermissionRoute'
import { TrackerDashboard } from './pages/admin/TrackerDashboard'
import { UpgradeRequired } from './components/versioning/UpgradeRequired'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ConsentPage } from './pages/ConsentPage'
import { HomePage } from './pages/HomePage'
import { PropertyPage } from './pages/PropertyPage'
import { ProfilePage } from './pages/ProfilePage'
import { TermsPage } from './pages/TermsPage'
import { AccessibilityPage } from './pages/AccessibilityPage'
import { ContactUsPage } from './pages/ContactUsPage'
import { CalculatorsPage } from './pages/CalculatorsPage'
import { MaxPriceCalculatorPage } from './pages/MaxPriceCalculatorPage'
import { CompareCalculatorPage } from './pages/CompareCalculatorPage'
import { useSplash } from './hooks/useSplash'
import { useStore } from './store/store'
import { getStoreVersion, getStoreUrl } from './utils/platform.utils'
import { isMajorMinorUpgrade, isPatchOnlyUpgrade } from './utils/version.utils'
import { getNextOnboardingStep } from './utils/user.utils'
import { COLORS } from './constants/colors'

const InitialRedirect = () => {
  const loggedinUser = useStore((s) => s.loggedinUser)
  const token = useStore((s) => s.token)
  if (loggedinUser && token) {
    return <Navigate to={getNextOnboardingStep(loggedinUser)} replace />
  }
  return <Navigate to="/login" replace />
}

const SESSION_DISMISSED_KEY = 'upgrade_recommended_dismissed'

type VersionStatus = 'pending' | 'ok' | 'required' | 'recommended'

const isNative = Capacitor.isNativePlatform()

const App = () => {
  const { params, isReady } = useSplash()
  const [versionStatus, setVersionStatus] = useState<VersionStatus>(isNative ? 'pending' : 'ok')
  const [updateUrl, setUpdateUrl] = useState('')
  const versionChecked = useRef(false)

  useEffect(() => {
    if (!isNative) return
    StatusBar.setOverlaysWebView({ overlay: false })
    StatusBar.show()
    StatusBar.setStyle({ style: Style.Dark })
    StatusBar.setBackgroundColor({ color: COLORS.secondary })
  }, [])

  // Expose viewport dimensions as CSS vars so .simulated-landscape-mobile can
  // size itself from real innerWidth/innerHeight pixels instead of vh/dvh,
  // which on some Android WebViews resolve to unexpected values.
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      document.documentElement.style.setProperty('--landscape-w', `${h}px`)
      document.documentElement.style.setProperty('--landscape-h', `${w}px`)
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  useEffect(() => {
    if (!isNative) return
    if (versionStatus === 'recommended') {
      StatusBar.setStyle({ style: Style.Dark })
      StatusBar.setBackgroundColor({ color: COLORS.secondary })
    } else {
      StatusBar.setStyle({ style: Style.Light })
      StatusBar.setBackgroundColor({ color: COLORS.white })
    }
  }, [versionStatus])

  // Safety timeout: unblock after 5 s if splash never resolves on native
  useEffect(() => {
    if (!isNative) return
    const timer = window.setTimeout(() => {
      setVersionStatus((prev) => (prev === 'pending' ? 'ok' : prev))
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isNative || !isReady || versionChecked.current) return

    if (sessionStorage.getItem(SESSION_DISMISSED_KEY)) {
      setVersionStatus('ok')
      return
    }

    versionChecked.current = true

    const checkVersion = async () => {
      try {
        const storeVersion = getStoreVersion(params as Record<string, unknown>)
        const info = await CapacitorApp.getInfo()
        console.log('[VERSION] device:', info.version, '| store (Google Play):', storeVersion || '(not set)')
        if (!storeVersion) {
          setVersionStatus('ok')
          return
        }
        if (isMajorMinorUpgrade(info.version, storeVersion)) {
          setVersionStatus('required')
        } else if (isPatchOnlyUpgrade(info.version, storeVersion)) {
          setUpdateUrl(getStoreUrl(params as Record<string, unknown>))
          setVersionStatus('recommended')
        } else {
          setVersionStatus('ok')
        }
      } catch {
        setVersionStatus('ok')
      }
    }

    checkVersion()
  }, [isReady, params])

  const handleDismissBanner = () => {
    sessionStorage.setItem(SESSION_DISMISSED_KEY, '1')
    setVersionStatus('ok')
  }

  if (versionStatus === 'pending') return null
  if (versionStatus === 'required') return <UpgradeRequired />

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes — no header/footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* App routes — with header/footer layout */}
        <Route element={
          <AppLayout
            showRecommendedBanner={versionStatus === 'recommended'}
            updateUrl={updateUrl}
            onDismissBanner={handleDismissBanner}
          />
        }>
          {/* Public */}
          <Route path="/consent" element={<ConsentPage />} />
          <Route path="/accessibility-statement" element={<AccessibilityPage />} />

          {/* Admin — permission-gated, bypasses onboarding redirect */}
          <Route element={<PermissionRoute permissions={['tracker:view']} />}>
            <Route path="/admin/tracker" element={<TrackerDashboard />} />
          </Route>

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/property/new" element={<PropertyPage />} />
            <Route path="/property/:id" element={<PropertyPage />} />
            <Route path="/personal-info" element={<ProfilePage mode="PERSONAL" />} />
            <Route path="/financial-details" element={<ProfilePage mode="FINANCIAL" />} />
            <Route path="/calculators" element={<CalculatorsPage />} />
            <Route path="/calculators/max-price" element={<MaxPriceCalculatorPage />} />
            <Route path="/calculators/compare" element={<CompareCalculatorPage />} />
          </Route>
        </Route>

        {/* Default redirect — auth-aware so logged-in users never see the login flicker */}
        <Route path="/" element={<InitialRedirect />} />
        <Route path="*" element={<InitialRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
