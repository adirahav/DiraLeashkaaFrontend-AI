import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { User, Wallet, Save } from 'lucide-react'
import { useStore } from '../store/store'
import { useSplash } from '../hooks/useSplash'
import { userService } from '../services/user.service'
import { parseNumber } from '../services/formatUtils.service'
import { getNextOnboardingStep } from '../utils/user.utils'
import { SectionHeader } from '../components/common/SectionHeader'
import { UserPersonalInfo } from '../components/layout/UserPersonalInfo'
import { UserFinancialDetails } from '../components/layout/UserFinancialDetails'
import { User as UserType } from '../types'

interface ProfilePageProps {
  mode?: 'PERSONAL' | 'FINANCIAL'
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ mode = 'PERSONAL' }) => {
  const navigate = useNavigate()
  const { getPhrase } = useSplash()

  const loggedinUser = useStore((state) => state.loggedinUser)
  const isLoading = useStore((state) => state.isLoading)
  const setIsLoading = useStore((state) => state.setIsLoading)
  const setNotification = useStore((state) => state.setNotification)
  const setLoggedinUser = useStore((state) => state.setLoggedinUser)
  const setToken = useStore((state) => state.setToken)

  const buildFormSnapshot = () => ({
    fullname: loggedinUser?.fullname ?? '',
    email: loggedinUser?.email ?? '',
    yearOfBirth: loggedinUser?.yearOfBirth ?? '',
    equity: loggedinUser?.equity ?? '',
    incomes: loggedinUser?.incomes ?? '',
    commitments: loggedinUser?.commitments ?? '',
    additionalFundingSources: (loggedinUser?.additionalFundingSources ?? []).map((s) => ({
      id: s.uuid,
      source: s.source,
      amount: s.amount.toString(),
      repayment: s.repayment.toString(),
    })),
  })

  const [initialData, setInitialData] = useState(buildFormSnapshot)
  const [formData, setFormData] = useState(initialData)

  useEffect(() => {
    if (!loggedinUser) {
      navigate('/login', { replace: true })
    }
  }, [loggedinUser, navigate])

  if (!loggedinUser) return null

  const handleSave = async () => {
    const wasIncomplete = getNextOnboardingStep(loggedinUser) !== '/home'

    setIsLoading(true)
    try {
      let payload: Parameters<typeof userService.updateUser>[0]

      if (mode === 'PERSONAL') {
        payload = {
          fullname: formData.fullname.trim(),
          yearOfBirth: parseInt(formData.yearOfBirth),
        }
      } else {
        payload = {
          equity: parseNumber(formData.equity),
          incomes: parseNumber(formData.incomes),
          commitments: parseNumber(formData.commitments),
          additionalFundingSources: formData.additionalFundingSources
            .filter((s) => s.source.trim() !== '')
            .map((s) => ({
              uuid: s.id,
              source: s.source,
              amount: parseNumber(s.amount),
              repayment: parseNumber(s.repayment),
            })),
        }
      }

      const newToken = await userService.updateUser(payload)
      const updatedUser = jwtDecode<UserType>(newToken)
      setToken(newToken)
      setLoggedinUser(updatedUser)

      if (wasIncomplete) {
        const nextStep = getNextOnboardingStep(updatedUser)
        navigate(nextStep, { replace: true })
      } else {
        setInitialData({ ...formData })
        setNotification({
          type: 'success',
          message: getPhrase('user_save_success', 'Changes saved successfully'),
        })
      }
    } catch {
      setNotification({
        type: 'error',
        message: getPhrase('dialog_data_error_title', 'An error occurred while saving your data'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const headerConfig = mode === 'PERSONAL'
    ? { icon: <User />, title: getPhrase('user_personal_details', 'Personal Details'), variant: 'blue' as const }
    : { icon: <Wallet />, title: getPhrase('user_financial_details', 'Financial Details'), variant: 'teal' as const }

  return (
    <div className="min-h-screen bg-slate-50 text-start" dir="rtl">
      <main className="max-w-3xl mx-auto px-4 py-12">
        <SectionHeader
          icon={headerConfig.icon}
          title={headerConfig.title}
          variant={headerConfig.variant}
        />
        <div className="animate-in fade-in duration-500">
          {mode === 'PERSONAL' && (
            <UserPersonalInfo
              formData={formData}
              initialData={initialData}
              setFormData={setFormData}
              isEmailReadOnly={true}
              isPasswordReadOnly={true}
              onClick={handleSave}
              buttonText={isLoading ? getPhrase('button_saving', 'Saving...') : getPhrase('button_save', 'Save Changes')}
              buttonIcon={Save}
              variant="profile"
            />
          )}
          {mode === 'FINANCIAL' && (
            <UserFinancialDetails
              formData={formData}
              initialData={initialData}
              setFormData={setFormData}
              showAdditionalFunding={true}
              onNext={handleSave}
              nextButtonText={isLoading ? getPhrase('button_saving', 'Saving...') : getPhrase('button_save', 'Save Changes')}
              buttonIcon={Save}
              variant="profile"
            />
          )}
        </div>
      </main>
    </div>
  )
}
