import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Card } from '../components/common/Card'
import { Button, EmailInput, PasswordInput } from '../components/formFields'
import { Logo } from '../components/common/Logo'
import { Notification } from '../components/common/Notification'
import { ScreenHeader } from '../components/common/ScreenHeader'
import { useStore } from '../store/store'
import { useSplash } from '../hooks/useSplash'
import { forgotPasswordService } from '../services/forgotPassword.service'

type ForgotStep = 'EMAIL' | 'VERIFY' | 'RESET'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const stepVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
}

const StepIcon: React.FC<{ step: ForgotStep }> = ({ step }) => {
  const configs = {
    EMAIL: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    VERIFY: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    RESET: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  }
  const { bg, text, icon } = configs[step]
  return (
    <div className={`w-16 h-16 ${bg} ${text} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm`}>
      {icon}
    </div>
  )
}

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { getPhrase } = useSplash()
  const isLoading = useStore((state) => state.isLoading)
  const setIsLoading = useStore((state) => state.setIsLoading)
  const setNotification = useStore((state) => state.setNotification)
  const globalNotification = useStore((state) => state.notification)
  const clearNotification = useStore((state) => state.clearNotification)

  const [forgotStep, setForgotStep] = useState<ForgotStep>('EMAIL')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', ''])
  const [forgotPasswordToken, setForgotPasswordToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const codeInputs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  useEffect(() => { setIsLoading(false) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenerateCode = async () => {
    if (!EMAIL_REGEX.test(email)) {
      setError(getPhrase('forgot_password_email_invalid_error', 'Please enter a valid email address'))
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await forgotPasswordService.generateCode(email)
      setCode(['', '', '', ''])
      setForgotStep('VERIFY')
    } catch (err: any) {
      const isUserNotFound = err?.response?.status === 404 || err?.response?.status === 400
      if (isUserNotFound) {
        setCode(['', '', '', ''])
        setForgotStep('VERIFY')
      } else {
        setError(getPhrase('forgot_password_generate_error', 'Failed to send code. Please try again.'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (currentCode: string[]) => {
    const joined = currentCode.join('')
    if (joined.length < 4) return
    setError('')
    setIsLoading(true)
    try {
      const token = await forgotPasswordService.validateCode(email, joined)
      setForgotPasswordToken(token)
      setForgotStep('RESET')
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError(getPhrase('forgot_password_expired_error', 'Code expired. Please request a new one.'))
        setCode(['', '', '', ''])
        setForgotStep('EMAIL')
      } else {
        setError(getPhrase('forgot_password_code_error', 'Incorrect code. Please try again.'))
        setCode(['', '', '', ''])
        setTimeout(() => codeInputs[0].current?.focus(), 50)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      setError(getPhrase('forgot_password_min_length_error', 'Password must be at least 8 characters'))
      return
    }
    if (newPassword !== confirmPassword) {
      setError(getPhrase('forgot_password_mismatch_error', 'Passwords do not match'))
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await forgotPasswordService.changePassword(newPassword, forgotPasswordToken)
      setIsSubmitted(true)
      setNotification({
        type: 'success',
        message: getPhrase('forgot_password_success', 'Password updated successfully! You can now log in.'),
      })
      setTimeout(() => { clearNotification(); navigate('/login') }, 3000)
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError(getPhrase('forgot_password_expired_error', 'Session expired. Please start over.'))
        setForgotPasswordToken('')
        setCode(['', '', '', ''])
        setForgotStep('EMAIL')
      } else {
        setError(getPhrase('forgot_password_server_error', 'An error occurred. Please try again later.'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    if (value && index < 3) codeInputs[index + 1].current?.focus()
    if (value && index === 3) handleVerifyCode(newCode)
  }

  const onCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputs[index - 1].current?.focus()
    }
  }

  const onSendAgain = () => {
    setForgotStep('EMAIL')
    setError('')
    setCode(['', '', '', ''])
  }

  const loadingSpinner = (
    <div className="flex items-center justify-center gap-2">
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <span>{getPhrase('common_loading', 'Loading...')}</span>
    </div>
  )

  return (
    <div dir="rtl" className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
      <Notification
        isVisible={!!globalNotification}
        type={globalNotification?.type === 'info' ? 'success' : (globalNotification?.type ?? 'success')}
        message={globalNotification?.message ?? ''}
        onClose={clearNotification}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="w-full">
          <div className="flex flex-col items-center mb-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Logo size={64} className="mb-4" showText={true} />
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={forgotStep}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {forgotStep === 'EMAIL' && (
                <div className="flex flex-col gap-4">
                  <StepIcon step="EMAIL" />
                  <ScreenHeader
                    title={getPhrase('forgot_password_email_label', 'Reset Password')}
                    subtitle={getPhrase('forgot_password_email_subtitle', 'Enter your email and we will send you a verification code')}
                    isAbsolute={false}
                    className="text-center mb-2"
                  />
                  <EmailInput
                    label={getPhrase('login_email_label', 'Email')}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleGenerateCode() }}
                    placeholder="example@mail.com"
                    error={error}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleGenerateCode}
                    className="w-full py-4 mt-2"
                    disabled={!email || isLoading}
                  >
                    {isLoading ? loadingSpinner : getPhrase('forgot_password_send_code', 'Send Verification Code')}
                  </Button>
                </div>
              )}

              {forgotStep === 'VERIFY' && (
                <div className="flex flex-col gap-4">
                  <StepIcon step="VERIFY" />
                  <ScreenHeader
                    title={getPhrase('forgot_password_verify_label', 'Account Verification')}
                    subtitle={getPhrase('forgot_password_verify_subtitle', 'Enter the code we sent to: %1$').replace('%1$', email)}
                    isAbsolute={false}
                    className="text-center mb-2"
                  />
                  <div
                    className="flex justify-center gap-3"
                    dir="ltr"
                    role="group"
                    aria-label={getPhrase('forgot_password_code_aria', '4-digit verification code')}
                  >
                    {code.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={codeInputs[idx]}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => onCodeChange(idx, e.target.value)}
                        onKeyDown={(e) => onCodeKeyDown(idx, e)}
                        aria-label={`ספרה ${idx + 1}`}
                        disabled={isLoading}
                        className="w-14 h-16 text-center text-2xl font-black border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all disabled:opacity-50"
                      />
                    ))}
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm font-bold text-center">{error}</p>
                  )}
                  <Button
                    onClick={() => handleVerifyCode(code)}
                    className="w-full py-4"
                    disabled={code.some((d) => !d) || isLoading}
                  >
                    {isLoading ? loadingSpinner : getPhrase('forgot_password_verify_code', 'Verify Code')}
                  </Button>
                  <button
                    onClick={onSendAgain}
                    disabled={isLoading}
                    className="text-slate-400 font-bold text-sm hover:text-blue-600 transition-colors text-center disabled:opacity-50"
                  >
                    {getPhrase('forgot_password_send_code_again', 'Resend Code')}
                  </button>
                </div>
              )}

              {forgotStep === 'RESET' && (
                <div className="flex flex-col gap-4">
                  <StepIcon step="RESET" />
                  <ScreenHeader
                    title={getPhrase('forgot_password_newpassword_label', 'New Password')}
                    subtitle={getPhrase('forgot_password_newpassword_subtitle', 'Account verified. You can now choose a new password.')}
                    isAbsolute={false}
                    className="text-center mb-2"
                  />
                  <PasswordInput
                    label={getPhrase('forgot_password_new_password_label', 'New Password')}
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError('') }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && newPassword && confirmPassword && !isLoading) handleResetPassword() }}
                    placeholder={getPhrase('forgot_password_new_password_placeholder', 'Minimum 8 characters')}
                    disabled={isLoading}
                  />
                  <PasswordInput
                    label={getPhrase('forgot_password_verify_new_password_label', 'Confirm Password')}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && newPassword && confirmPassword && !isLoading) handleResetPassword() }}
                    placeholder={getPhrase('forgot_password_verify_new_password_placeholder', 'Re-enter your password')}
                    error={error}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleResetPassword}
                    className="w-full py-4 mt-2"
                    disabled={!newPassword || !confirmPassword || isLoading || isSubmitted}
                  >
                    {isLoading ? loadingSpinner : getPhrase('forgot_password_submit', 'Update Password & Sign In')}
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-slate-400 text-sm font-medium hover:text-blue-500 hover:underline transition-colors"
            >
              {getPhrase('forgot_password_back_to_login', 'Back to Login')}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
