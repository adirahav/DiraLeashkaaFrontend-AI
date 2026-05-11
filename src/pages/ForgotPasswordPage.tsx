import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/common/Card'
import { Button, PasswordInput, EmailInput } from '../components/formFields'
import { Logo } from '../components/animations/Logo'
import { ScreenHeader } from '../components/common/ScreenHeader'
import { Notification } from '../components/common/Notification'

type ForgotStep = 'EMAIL' | 'VERIFY' | 'RESET'

const StepIcon: React.FC<{ icon: React.ReactNode; bgColor: string; textColor: string }> = ({ icon, bgColor, textColor }) => (
  <div className={`w-16 h-16 ${bgColor} ${textColor} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm`}>{icon}</div>
)

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()

  const [forgotStep, setForgotStep] = useState<ForgotStep>('EMAIL')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const codeInputs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const onSendCode = () => {
    if (!email.includes('@')) { setForgotError('נא להזין כתובת אימייל תקינה'); return }
    setForgotError('')
    setCode(['', '', '', ''])
    setForgotStep('VERIFY')
  }

  const onVerifyCode = () => {
    if (code.join('') === '1234') { setForgotError(''); setForgotStep('RESET') }
    else setForgotError('הקוד שגוי. נסה שוב (הקוד להדגמה הוא 1234)')
  }

  const onResetPassword = () => {
    if (newPassword.length < 8) { setForgotError('הסיסמה חייבת להכיל לפחות 8 תווים'); return }
    if (newPassword !== confirmPassword) { setForgotError('הסיסמאות אינן תואמות'); return }
    if (newPassword === '88888888') {
      setNotification({ type: 'error', message: 'אירעה שגיאת מערכת בעת עדכון הסיסמה. נא לנסות שוב מאוחר יותר.' })
      return
    }
    alert('הסיסמה שונתה בהצלחה!')
    navigate('/login')
  }

  const onCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    if (value && index < 3) codeInputs[index + 1].current?.focus()
  }

  const onKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) codeInputs[index - 1].current?.focus()
  }

  const renderStep = () => {
    switch (forgotStep) {
      case 'EMAIL':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StepIcon bgColor="bg-blue-100" textColor="text-blue-600" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
            <ScreenHeader title="איפוס סיסמה" subtitle="הזן את המייל שלך ונשלח לך קוד אימות בן 4 ספרות" className="text-center mb-8" />
            <EmailInput label="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" error={forgotError} />
            <Button onClick={onSendCode} className="w-full mt-6 py-4" disabled={!email}>שלח קוד אימות</Button>
          </div>
        )
      case 'VERIFY':
        return (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <StepIcon bgColor="bg-amber-100" textColor="text-amber-600" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />
            <ScreenHeader title="אימות חשבון" subtitle={`הזן את הקוד ששלחנו לכתובת: ${email}`} className="text-center mb-8" />
            <div className="flex justify-center gap-3 mb-6" dir="ltr" role="group" aria-label="קוד אימות בן 4 ספרות">
              {code.map((digit, idx) => (
                <input key={idx} ref={codeInputs[idx]} type="text" inputMode="numeric" value={digit} onChange={(e) => onCodeChange(idx, e.target.value)} onKeyDown={(e) => onKeyDown(idx, e)} aria-label={`ספרה ${idx + 1}`} className="w-14 h-16 text-center text-2xl font-black border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" />
              ))}
            </div>
            {forgotError && <p className="text-red-500 text-sm font-bold mb-6">{forgotError}</p>}
            <Button onClick={onVerifyCode} className="w-full py-4" disabled={code.some((d) => !d)}>אמת קוד</Button>
            <button onClick={() => { setForgotStep('EMAIL'); setForgotError(''); setCode(['', '', '', '']) }} className="mt-6 text-slate-400 font-bold text-sm hover:text-blue-600 transition-colors">שלח קוד מחדש</button>
          </div>
        )
      case 'RESET':
        return (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <StepIcon bgColor="bg-emerald-100" textColor="text-emerald-600" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
            <ScreenHeader title="סיסמה חדשה" subtitle="החשבון אומת בהצלחה. כעת ניתן לבחור סיסמה חדשה." className="text-center mb-8" />
            <div className="flex flex-col gap-4 text-right">
              <PasswordInput label="סיסמה חדשה" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="מינימום 8 תווים" />
              <PasswordInput label="אימות סיסמה" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="הזן את הסיסמה שנית" error={forgotError} />
              <Button onClick={onResetPassword} className="w-full mt-4 py-4" disabled={!newPassword || !confirmPassword}>עדכן סיסמה והתחבר</Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 text-center relative">
      <Notification isVisible={!!notification} type={notification?.type || 'success'} message={notification?.message || ''} onClose={() => setNotification(null)} />
      <Card className="max-w-md w-full">
        <div className="flex flex-col items-center mb-6" aria-live="polite">
          <Logo size={64} className="mb-4" showText={true} />
        </div>
        {renderStep()}
      </Card>
    </div>
  )
}
