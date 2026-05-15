import React from 'react'
import { Card } from '../components/common/Card'
import { ScreenHeader } from '../components/common/ScreenHeader'
import { UserConsent } from '../components/layout/UserConsent'
import { TERMS_CONTENT } from '../constants/termsContent'
import { useScrolled } from '../hooks/useScrolled'

export const TermsPage: React.FC = () => {
  const isScrolled = useScrolled()

  return (
    <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <ScreenHeader
          title="תנאי שימוש"
          subtitle="עודכן לאחרונה: מרץ 2024"
          isScrolled={isScrolled}
          isAbsolute={false}
          className="mb-8"
        />
        <Card className="p-8 md:p-12 prose prose-slate max-w-none">
          <UserConsent content={TERMS_CONTENT} showCheckbox={false} showButtons={false} />
        </Card>
      </main>
    </div>
  )
}
