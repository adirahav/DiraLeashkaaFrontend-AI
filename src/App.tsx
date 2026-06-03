import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { AppLayout } from './layouts/AppLayout'
import { ProtectedRoute } from './router/ProtectedRoute'
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
import { getStoreVersion, getStoreUrl } from './utils/platform.utils'
import { isMajorMinorUpgrade, isPatchOnlyUpgrade } from './utils/version.utils'

const SESSION_DISMISSED_KEY = 'upgrade_recommended_dismissed'

type VersionStatus = 'pending' | 'ok' | 'required' | 'recommended'

const isNative = Capacitor.isNativePlatform()

const App = () => {
  const { params, isReady } = useSplash()
  const [versionStatus, setVersionStatus] = useState<VersionStatus>(isNative ? 'pending' : 'ok')
  const [updateUrl, setUpdateUrl] = useState('')
  const versionChecked = useRef(false)

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
        if (!storeVersion) {
          setVersionStatus('ok')
          return
        }
        const info = await CapacitorApp.getInfo()
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

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
