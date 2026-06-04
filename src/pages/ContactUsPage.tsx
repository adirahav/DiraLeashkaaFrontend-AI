import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send } from 'lucide-react'
import { SectionHeader } from '../components/common/SectionHeader'
import { Notification } from '../components/common/Notification'
import { Dropdown } from '../components/formFields/Dropdown'
import { Textarea } from '../components/formFields/Textarea'
import { Button } from '../components/formFields/Button'
import { useStore } from '../store/store'
import { useSplash } from '../hooks/useSplash'
import { contactUsService } from '../services/contactUs.service'
import { utilService } from '../services/util.service'
import { Mail } from 'lucide-react';
import { useNativeBackButton } from '../hooks/useNativeBackButton'

const MIN_MESSAGE_LENGTH = 10

export const ContactUsPage: React.FC = () => {
  const navigate = useNavigate()
  const { getPhrase, params } = useSplash()

  const isLoading = useStore((s) => s.isLoading)
  const setIsLoading = useStore((s) => s.setIsLoading)
  const globalNotification = useStore((s) => s.notification)
  const setNotification = useStore((s) => s.setNotification)
  const clearNotification = useStore((s) => s.clearNotification)

  useNativeBackButton(() => navigate('/home'))

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [subjectTouched, setSubjectTouched] = useState(false)
  const [messageTouched, setMessageTouched] = useState(false)

  const dropdownOptions = useMemo(() => {
    const raw = params['contactus']

    let data: Record<string, unknown> | null = null
    if (typeof raw === 'string') {
      try { data = JSON.parse(raw) } catch { /* ignore */ }
    } else if (raw && typeof raw === 'object') {
      data = raw as Record<string, unknown>
    }

    if (!data) return []

    const messageTypes = (data.message_types ?? []) as Array<Record<string, string>>
    return messageTypes.map((item) => ({
      value: item.value ?? item.key ?? item.id ?? '',
      label: item.label ?? item.name ?? item.title ?? item.value ?? '',
    }))
  }, [params])

  const subjectError =
    subjectTouched && !subject
      ? getPhrase('contactus_type_error', 'Please select a subject')
      : undefined

  const messageError =
    messageTouched && message.trim().length < MIN_MESSAGE_LENGTH
      ? getPhrase('contactus_message_error', `Please enter a message (at least ${MIN_MESSAGE_LENGTH} characters)`)
      : undefined

  const isFormValid = !!subject && message.trim().length >= MIN_MESSAGE_LENGTH

  const handleSubmit = async () => {
    setSubjectTouched(true)
    setMessageTouched(true)
    if (!isFormValid) return

    setIsLoading(true)
    console.log(`[API] Contact form submitted — subject: ${subject}`)
    try {
      const appEnv = utilService.getAppEnv()
      await contactUsService.sendMessage(subject, message, appEnv)
      console.log(`[API] Contact message sent successfully`)
      setSubject('')
      setMessage('')
      setSubjectTouched(false)
      setMessageTouched(false)
      setNotification({
        type: 'success',
        message: getPhrase('contactus_message_send_success', 'Message sent successfully! We will get back to you soon.'),
      })
    } catch {
      setNotification({
        type: 'error',
        message: getPhrase('contactus_message_send_fail', 'Failed to send message. Please try again later.'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-right relative" dir="rtl">
      <Notification
        isVisible={!!globalNotification}
        type={globalNotification?.type === 'info' ? 'success' : (globalNotification?.type ?? 'success')}
        message={globalNotification?.message ?? ''}
        onClose={clearNotification}
      />

      <main className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <SectionHeader
          title={getPhrase('contactus_title', 'Contact Us')}
          icon={<Mail />} 
          variant='indigo'
        />

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
            <Dropdown
              label={getPhrase('contactus_type_label', 'Subject')}
              value={subject}
              options={dropdownOptions}
              onChange={(val) => { setSubject(val); setSubjectTouched(true) }}
              error={subjectError}
              disabled={isLoading}
            />
            <Textarea
              label={getPhrase('contactus_message_label', 'Message')}
              value={message}
              onChange={(val) => { setMessage(val); setMessageTouched(true) }}
              placeholder={getPhrase('contactus_message_placeholder', 'Write your message here...')}
              minHeight="150px"
              error={messageError}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid}
            icon={Send}
            iconSize={20}
            className="px-12 py-4 text-lg shadow-xl shadow-blue-200 hover:translate-y-[-2px]"
          >
            {getPhrase('button_send', 'Send')}
          </Button>
        </div>
      </main>
    </div>
  )
}
