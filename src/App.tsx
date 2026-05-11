import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { ProtectedRoute } from './router/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { PropertyPage } from './pages/PropertyPage'
import { ProfilePage } from './pages/ProfilePage'
import { TermsPage } from './pages/TermsPage'
import { AccessibilityPage } from './pages/AccessibilityPage'
import { ContactPage } from './pages/ContactPage'
import { CalculatorsPage } from './pages/CalculatorsPage'
import { MaxPriceCalculatorPage } from './pages/MaxPriceCalculatorPage'
import { CompareCalculatorPage } from './pages/CompareCalculatorPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes — no header/footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* App routes — with header/footer layout */}
        <Route element={<AppLayout />}>
          {/* Public */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/property/new" element={<PropertyPage />} />
            <Route path="/property/:id" element={<PropertyPage />} />
            <Route path="/profile/personal" element={<ProfilePage mode="PERSONAL" />} />
            <Route path="/profile/financial" element={<ProfilePage mode="FINANCIAL" />} />
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
