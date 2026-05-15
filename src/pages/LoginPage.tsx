import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Card } from '../components/common/Card'
import { Button, EmailInput, PasswordInput } from '../components/formFields'
import { Logo } from '../components/common/Logo'
import { useStore } from '../store/store'
import { useSplash } from '../hooks/useSplash'
import { getNextOnboardingStep } from '../utils/user.utils'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN_LENGTH = 6

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { getPhrase, forceFetchSplash } = useSplash()

  const loggedinUser = useStore((state) => state.loggedinUser)
  const isLoading = useStore((state) => state.isLoading)
  const setIsLoading = useStore((state) => state.setIsLoading)
  const login = useStore((state) => state.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [serverError, setServerError] = useState('')
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  // Reset any stale loading state left by a previous page
  useEffect(() => { setIsLoading(false) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auth guard — already logged in
  useEffect(() => {
    if (!loggedinUser) return
    navigate(getNextOnboardingStep(loggedinUser), { replace: true })
  }, [loggedinUser, navigate])

  // Pre-fill last logged-in email
  useEffect(() => {
    async function prefill() {
      const { authService } = await import('../services/auth.service')
      const lastEmail = await authService.getLastLoggedinEmail()
      if (lastEmail) setEmail(lastEmail)
    }
    prefill()
  }, [])

  // Real-time field validation
  useEffect(() => {
    const emailValid = EMAIL_REGEX.test(email)
    const passwordValid = password.length >= PASSWORD_MIN_LENGTH
    setIsSubmitDisabled(!emailValid || !passwordValid)
  }, [email, password])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError || serverError) {
      setEmailError('')
      setServerError('')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (passwordError || serverError) {
      setPasswordError('')
      setServerError('')
    }
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    let hasError = false
    if (!email) {
      setEmailError(getPhrase('login_email_empty_error', 'Please enter your email'))
      hasError = true
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError(getPhrase('login_email_invalid_error', 'Please enter a valid email address'))
      hasError = true
    }
    if (!password) {
      setPasswordError(getPhrase('login_password_empty_error', 'Please enter your password'))
      hasError = true
    }
    if (hasError) return

    setIsLoading(true)
    setServerError('')

    try {
      const user = await login(email, password)
      forceFetchSplash()
      navigate(getNextOnboardingStep(user), { replace: true })
    } catch {
      setServerError(getPhrase('login_credentials_error', 'Invalid credentials, please try again'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md z-10"
      >
        <Card className="w-full">
          <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Logo size={64} className="mb-4" showText={true} />
            </motion.div>
            <div className="text-center">
              <motion.h1
                variants={itemVariants}
                className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2 tracking-tight"
              >
                {getPhrase('login_header', 'Welcome Back')}
              </motion.h1>
              <motion.p variants={itemVariants} className="text-slate-500 font-medium">
                {getPhrase('login_subheader', 'Log in to manage your real estate investments')}
              </motion.p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 text-right" dir="rtl">

            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm font-bold text-center"
              >
                {serverError}
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <EmailInput
                label={getPhrase('login_email_label', 'Email')}
                value={email}
                onChange={handleEmailChange}
                placeholder={getPhrase('login_email_placeholder', 'Enter your email address')}
                error={emailError}
                required
                disabled={isLoading}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <PasswordInput
                label={getPhrase('login_password_label', 'Password')}
                value={password}
                onChange={handlePasswordChange}
                placeholder={getPhrase('login_password_placeholder', 'Enter your password')}
                error={passwordError}
                required
                disabled={isLoading}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="self-start">
              <NavLink
                to="/forgot-password"
                className="text-blue-600 text-sm font-bold hover:underline"
              >
                {getPhrase('login_forgot_password', 'Forgot Password?')}
              </NavLink>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="mt-4 py-4 w-full"
                disabled={isLoading || isSubmitDisabled}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{getPhrase('login_loading', 'Signing in...')}</span>
                  </div>
                ) : getPhrase('login_submit', 'Sign In')}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mt-6 text-slate-500 font-medium">
              {getPhrase('login_dont_have_account_yet', "Don't have an account yet? ")}
              <NavLink
                to="/signup"
                className="text-blue-600 font-black hover:underline"
              >
                {getPhrase('login_signup_now', "Sign up now")}
              </NavLink>
            </motion.div>

          </form>
        </Card>
      </motion.div>
    </div>
  )
}
