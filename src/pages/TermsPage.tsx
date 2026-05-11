import React from 'react'
import { Card } from '../components/common/Card'
import { ScreenHeader } from '../components/common/ScreenHeader'
import { UserConsent } from '../components/layout/UserConsent'
import { TERMS_CONTENT } from '../constants/termsContent'

export const TermsPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <ScreenHeader
          title="תנאי שימוש"
          subtitle="עודכן לאחרונה: מרץ 2024"
          isScrolled={isScrolled}
          className="mb-8 flex flex-col transition-all duration-300 ease-in-out"
        />
        <Card className="p-8 md:p-12 prose prose-slate max-w-none">
          <UserConsent content={TERMS_CONTENT} showCheckbox={false} showButtons={false} />
        </Card>
      </main>
    </div>
  )
}
