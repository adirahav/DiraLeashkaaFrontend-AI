import React from 'react'
import { Card } from '../components/common/Card'
import { ScreenHeader } from '../components/common/ScreenHeader'
import { useScrolled } from '../hooks/useScrolled'
import { useSplash } from '../hooks/useSplash'

const DEFAULT_ACCESSIBILITY_CONTENT = '<div class="space-y-6 text-slate-600 leading-relaxed"><section><h3 class="text-lg font-black text-slate-800 mb-3">Introduction</h3><p>We place utmost importance on providing equal, respectful, and accessible service to all our customers, including people with disabilities.</p></section><section><h3 class="text-lg font-black text-slate-800 mb-3">Accessibility adjustments on the site</h3><p>The site meets the requirements of the Equal Rights for Persons with Disabilities Regulations (Service Accessibility Adjustments), 5773-2013.</p><ul class="list-disc list-inside space-y-2 mt-4 pr-4"><li>A dedicated accessibility menu allowing changes to text size, contrast, grayscale, and more.</li><li>Full keyboard navigation.</li><li>Support for popular screen readers.</li><li>Adaptation for all browser types and devices (responsive).</li><li>Use of simple and clear language.</li></ul></section><section><h3 class="text-lg font-black text-slate-800 mb-3">Contact for accessibility requests and improvement suggestions</h3><p>If you encountered an accessibility issue, we would appreciate your update.</p><ul class="list-none space-y-1 mt-2"><li><strong>Email:</strong> accessibility@diraleashkaa.co.il</li></ul></section></div>'

export const AccessibilityPage: React.FC = () => {
  const isScrolled = useScrolled()
  const { getPhrase } = useSplash()

  return (
    <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <ScreenHeader
          title={getPhrase('accessibility_title', 'Accessibility Statement')}
          subtitle={getPhrase('accessibility_subtitle', 'Last updated: March 2024')}
          isScrolled={isScrolled}
          isAbsolute={false}
          className="mb-8"
        />
        <Card className="p-8 md:p-12 prose prose-slate max-w-none">
          <div dangerouslySetInnerHTML={{ __html: getPhrase('accessibility_content', DEFAULT_ACCESSIBILITY_CONTENT) }} />
        </Card>
      </main>
    </div>
  )
}
