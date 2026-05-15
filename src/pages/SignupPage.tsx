import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { jwtDecode } from 'jwt-decode'
import { Card } from '../components/common/Card'
import { Logo } from '../components/common/Logo'
import { UserPersonalInfo } from '../components/layout/UserPersonalInfo'
import { UserFinancialDetails } from '../components/layout/UserFinancialDetails'
import { UserConsent } from '../components/layout/UserConsent'
import { ScreenHeader } from '../components/common/ScreenHeader'
import { useStore } from '../store/store'
import { useSplash } from '../hooks/useSplash'
import { authService } from '../services/auth.service'
import { userService } from '../services/user.service'
import { parseNumber } from '../services/formatUtils.service'
import { getNextOnboardingStep } from '../utils/user.utils'
import { User } from '../types'

const STEP_ROUTE_MAP: Record<string, number> = {
  '/personal-info': 1,
  '/financial-details': 2,
  '/consent': 3,
}

const TOTAL_STEPS = 3

export const SignupPage: React.FC = () => {
  const navigate = useNavigate()
  const { getPhrase, forceFetchSplash } = useSplash()

  const loggedinUser = useStore((state) => state.loggedinUser)
  const token = useStore((state) => state.token)
  const setLoggedinUser = useStore((state) => state.setLoggedinUser)
  const setToken = useStore((state) => state.setToken)
  const isLoading = useStore((state) => state.isLoading)
  const setIsLoading = useStore((state) => state.setIsLoading)

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [serverError, setServerError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullname: loggedinUser?.fullname ?? '',
    email: loggedinUser?.email ?? '',
    password: '',
    yearOfBirth: loggedinUser?.yearOfBirth ?? '',
    equity: loggedinUser?.equity ?? '',
    incomes: loggedinUser?.incomes ?? '',
    commitments: loggedinUser?.commitments ?? '',
    additionalFundingSources: [] as any[],
    termsOfUseAccept: '',
  })

  // Auth guard on mount — resume at the correct wizard step
  useEffect(() => {
    if (loggedinUser && !token) {
      navigate('/login', { replace: true })
      return
    }
    if (!loggedinUser) return
    const nextPath = getNextOnboardingStep(loggedinUser)
    if (nextPath === '/home' || nextPath === '/login') {
      navigate(nextPath, { replace: true })
    } else {
      const mappedStep = STEP_ROUTE_MAP[nextPath]
      if (mappedStep) setStep(mappedStep)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const saveUser = async () => {
    setIsLoading(true)
    setServerError(null)
    try {
      let updatedUser: User

      if (!loggedinUser) {
        // Step 1 — new user: POST /auth/signup
        const { user, token } = await authService.signup({
          fullname: formData.fullname.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          yearOfBirth: formData.yearOfBirth,
        })
        setToken(token)
        setLoggedinUser(user)
        updatedUser = user
      } else {
        // Existing user: PUT /user with step-specific payload
        let newToken: string
        if (step === 1) {
          newToken = await userService.updateUser({
            fullname: formData.fullname.trim(),
            yearOfBirth: parseInt(formData.yearOfBirth),
          })
        } else if (step === 2) {
          newToken = await userService.updateUser({
            equity: parseNumber(formData.equity),
            incomes: parseNumber(formData.incomes),
            commitments: parseNumber(formData.commitments),
            additionalFundingSources: (formData.additionalFundingSources ?? []).map((s: any) => ({
              uuid: s.id,
              source: s.source,
              amount: parseNumber(s.amount),
              repayment: parseNumber(s.repayment),
            })),
          })
        } else {
          newToken = await userService.updateUser({ termsOfUseAccept: true })
        }
        updatedUser = jwtDecode<User>(newToken)
        setToken(newToken)
        setLoggedinUser(updatedUser)
      }

      if (step >= TOTAL_STEPS) {
        forceFetchSplash()
        navigate('/home', { replace: true })
      } else {
        setDirection(1)
        setStep(step + 1)
      }
    } catch (err: any) {
      const isEmailTaken = step === 1 && err?.response?.status === 400
      setServerError(
        isEmailTaken
          ? getPhrase('signup_email_taken_error', 'Email address already exists. Try logging in.')
          : getPhrase('signup_server_error', 'An error occurred. Please try again.')
      )
    } finally {
      setIsLoading(false)
    }
  }

  const onPrev = () => {
    setServerError(null)
    setDirection(-1)
    setStep((prev) => Math.max(1, prev - 1))
  }

  const stepVariants = {
    initial: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
    exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' as const } }),
  }

  const stepIndicator = getPhrase('registration_steps_indicator', 'Step %1$d of %2$d')
    .replace('%1$d', String(step))
    .replace('%2$d', String(TOTAL_STEPS))

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
            <div className="w-full text-right">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
                <ScreenHeader
                  title={getPhrase('registration_title', 'Create Investment Account')}
                  subtitle={getPhrase('registration_subtitle', 'Help us get to know you so we can match you with the right properties')}
                  className="text-center md:text-right"
                />
                <motion.div
                  key={step}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="self-center md:self-auto px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm whitespace-nowrap bg-blue-100 text-blue-700"
                  aria-live="polite"
                >
                  {stepIndicator}
                </motion.div>
              </div>
              <div
                className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner p-0.5"
                role="progressbar"
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={TOTAL_STEPS}
                aria-label={stepIndicator}
              >
                <motion.div
                  className="h-full rounded-full shadow-sm bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden min-h-[400px]">
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium text-center shadow-sm"
              >
                {serverError}
              </motion.div>
            )}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                {step === 1 && (
                  <UserPersonalInfo
                    formData={formData}
                    setFormData={setFormData}
                    onClick={saveUser}
                    buttonText={getPhrase('wizard_next_button', 'Continue to Next Step')}
                    variant="wizard"
                    isEmailReadOnly={!!loggedinUser}
                    isPasswordReadOnly={!!loggedinUser}
                  />
                )}
                {step === 2 && (
                  <UserFinancialDetails
                    formData={formData}
                    setFormData={setFormData}
                    onNext={saveUser}
                    onPrev={onPrev}
                    nextButtonText={getPhrase('wizard_next_button', 'Continue to Next Step')}
                    prevButtonText={getPhrase('wizard_prev_button', 'Back to Previous Step')}
                    variant="wizard"
                  />
                )}
                {step === 3 && (
                  <UserConsent
                    content={getPhrase('signup_terms_of_use_text', '')}
                    checkboxLabel={getPhrase('signup_terms_of_use_agree', 'I have read, understood and agree to the Terms of Use and Privacy Policy *')}
                    checked={!!formData.termsOfUseAccept}
                    onChange={(checked) => setFormData({ ...formData, termsOfUseAccept: checked ? new Date().toISOString() : '' })}
                    onNext={saveUser}
                    onPrev={onPrev}
                    isNextDisabled={!formData.termsOfUseAccept}
                    isLoading={isLoading}
                    prevButtonText={getPhrase('wizard_prev_button', 'Back')}
                    nextButtonText={getPhrase('wizard_terms_next_button', 'Finish and Open Account')}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-slate-50">
            <span className="text-slate-400 font-medium">
              {getPhrase('signup_already_has_account', 'Already have an active profile? ')}
            </span>
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 font-black hover:text-blue-700 transition-colors border-b-2 border-blue-100 hover:border-blue-600 pb-0.5"
            >
              {getPhrase('signup_login_here', 'Log in here')}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
