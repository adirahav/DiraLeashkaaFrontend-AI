import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { motion } from 'motion/react'
import { Card } from '../components/common/Card'
import { Logo } from '../components/common/Logo'
import { ScreenHeader } from '../components/common/ScreenHeader'
import { UserConsent } from '../components/layout/UserConsent'
import { useStore } from '../store/store'
import { useSplash } from '../hooks/useSplash'
import { useScrolled } from '../hooks/useScrolled'
import { useNativeBackButton } from '../hooks/useNativeBackButton'
import { userService } from '../services/user.service'
import { getNextOnboardingStep } from '../utils/user.utils'
import { User } from '../types'

export const ConsentPage: React.FC = () => {
  const navigate = useNavigate()
  const { getPhrase, params, forceFetchSplash } = useSplash()

  const loggedinUser = useStore((state) => state.loggedinUser)
  const setLoggedinUser = useStore((state) => state.setLoggedinUser)
  const setToken = useStore((state) => state.setToken)
  const isLoading = useStore((state) => state.isLoading)
  const setIsLoading = useStore((state) => state.setIsLoading)

  const isScrolled = useScrolled()
  const handleBack = useNativeBackButton()

  const isActionMode = loggedinUser ? !loggedinUser.termsOfUseAccept : false

  const [checked, setChecked] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const subtitle = (() => {
    try {
      const raw = (params as Record<string, any>)?.termsOfUse
      const entries: { key: string; value: string }[] = raw ? JSON.parse(raw) : []
      const entry = entries.find((e) => e.key === 'lastUpdateTime')
      const dateStr = entry?.value ? new Date(entry.value).toLocaleDateString('he-IL') : ''
      return getPhrase('user_terms_of_use_last_update', 'Last updated: %1$s').replace('%1$s', dateStr)
    } catch {
      return getPhrase('user_terms_of_use_last_update', 'Last updated: %1$s').replace('%1$s', '')
    }
  })()

  const handleAccept = async () => {
    setIsLoading(true)
    setServerError(null)
    try {
      const newToken = await userService.updateUser({ termsOfUseAccept: true })
      const updatedUser = jwtDecode<User>(newToken)
      setToken(newToken)
      setLoggedinUser(updatedUser)
      forceFetchSplash()
      navigate(getNextOnboardingStep(updatedUser), { replace: true })
    } catch {
      setServerError(getPhrase('signup_server_error', 'An error occurred. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  // ── Info Mode: full-page document layout ──────────────────────────────────
  if (!isActionMode) {
    return (
      <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
        <main className="max-w-4xl mx-auto px-4 py-12">
          <ScreenHeader
            title={getPhrase('user_terms_of_use_title', 'Terms of Use')}
            subtitle={subtitle}
            isScrolled={isScrolled}
            isAbsolute={false}
            className="mb-8 flex flex-col transition-all duration-300 ease-in-out"
          />
          <Card className="p-8 md:p-12">
            <UserConsent
              content={getPhrase('signup_terms_of_use_text', '')}
              showCheckbox={false}
              showButtons={false}
              contentClassName="bg-white border-0 shadow-none rounded-none max-h-[none] overflow-visible p-0 text-slate-700 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-3 [&_p]:mb-4 [&_section]:mb-6 [&>hr:last-of-type]:hidden [&>p:last-of-type]:hidden"
            />
          </Card>
        </main>
      </div>
    )
  }

  // ── Action Mode: centered wizard card layout ──────────────────────────────
  return (
    <div dir="rtl" className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl z-10"
      >
        <Card className="w-full">
          <div className="flex flex-col items-center mb-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Logo size={64} className="mb-4" showText={true} />
            </motion.div>
            <ScreenHeader
              title={getPhrase('user_terms_of_use_title', 'Terms of Use')}
              subtitle={subtitle}
              isAbsolute={false}
              isScrolled={isScrolled}
              className="text-center md:text-right w-full"
            />
          </div>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium text-center shadow-sm"
            >
              {serverError}
            </motion.div>
          )}

          <UserConsent
            content={getPhrase('signup_terms_of_use_text', '')}
            showCheckbox={true}
            showButtons={true}
            checkboxLabel={getPhrase('signup_terms_of_use_agree', 'I have read, understood and agree to the Terms of Use and Privacy Policy *')}
            checked={checked}
            onChange={setChecked}
            onNext={handleAccept}
            isNextDisabled={!checked}
            isLoading={isLoading}
            nextButtonText={getPhrase('wizard_terms_next_button', 'Finish and Open Account')}
          />
        </Card>
      </motion.div>
    </div>
  )
}
