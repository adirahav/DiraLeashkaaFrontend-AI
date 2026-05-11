import React, { useState, useEffect } from 'react'
import { Card } from '../components/common/Card'
import { SectionHeader } from '../components/common/SectionHeader'
import { User, Wallet, Save } from 'lucide-react'
import { UserFinancialDetails } from '../components/layout/UserFinancialDetails'
import { UserPersonalInfo } from '../components/layout/UserPersonalInfo'
import { Notification } from '../components/common/Notification'

interface ProfilePageProps {
  mode?: 'PERSONAL' | 'FINANCIAL'
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ mode = 'PERSONAL' }) => {
  const currentYear = new Date().getFullYear()

  const initialData = {
    fullname: 'ישראל ישראלי',
    email: 'israel@example.com',
    password: '••••••••',
    yearOfBirth: '1990',
    equity: '500,000',
    incomes: '15,000',
    commitments: '2,000',
    additionalFundingSources: [] as string[],
    lastUpdated: '03.04.2026',
  }

  const [formData, setFormData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const getBirthYearError = () => {
    if (!formData.yearOfBirth) return ''
    if (formData.yearOfBirth.length < 4) return 'נא להזין שנה בת 4 ספרות'
    const age = currentYear - parseInt(formData.yearOfBirth)
    if (age < 18) return `השירות מיועד למשתמשים מעל גיל 18 (שנת ${currentYear - 18} ומטה)`
    if (age > 120) return 'נא להזין שנת לידה הגיונית (עד גיל 120)'
    return ''
  }

  const validate = () => {
    const birthError = getBirthYearError()
    const emailError = formData.email && !/\S+@\S+\.\S+/.test(formData.email) ? 'אימייל לא תקין' : ''
    return !birthError && !emailError
  }

  const onSave = () => {
    if (!validate()) return
    setIsSaving(true)
    setNotification(null)

    setTimeout(() => {
      const equityValue = formData.equity.toString().replace(/,/g, '')
      if (equityValue === '999') {
        setNotification({ type: 'error', message: 'אירעה שגיאה בעת שמירת הנתונים. נא לנסות שוב מאוחר יותר.' })
        setIsSaving(false)
        return
      }
      const now = new Date()
      const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`
      setFormData((prev) => ({ ...prev, lastUpdated: formattedDate }))
      setIsSaving(false)
      setNotification({ type: 'success', message: 'השינויים נשמרו בהצלחה במערכת!' })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-right relative" dir="rtl">
      <Notification isVisible={!!notification} type={notification?.type || 'success'} message={notification?.message || ''} onClose={() => setNotification(null)} />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <SectionHeader icon={mode === 'PERSONAL' ? <User /> : <Wallet />} title={mode === 'PERSONAL' ? 'פרטים אישיים' : 'נתונים כלכליים'} variant={mode === 'PERSONAL' ? 'blue' : 'teal'} />
        <div className="space-y-6">
          {mode === 'PERSONAL' && (
            <UserPersonalInfo formData={formData} initialData={initialData} setFormData={setFormData} isEmailReadOnly={true} isPasswordReadOnly={true} onClick={onSave} buttonText={isSaving ? 'שומר...' : 'שמור שינויים'} buttonIcon={Save} variant="profile" />
          )}
          {mode === 'FINANCIAL' && (
            <UserFinancialDetails formData={formData} initialData={initialData} setFormData={setFormData} showAdditionalFunding={true} onNext={onSave} nextButtonText={isSaving ? 'שומר...' : 'שמור שינויים'} buttonIcon={Save} variant="profile" />
          )}
        </div>
      </main>
    </div>
  )
}
