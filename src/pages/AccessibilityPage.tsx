import React from 'react'
import { Card } from '../components/common/Card'
import { ScreenHeader } from '../components/common/ScreenHeader'
import { useScrolled } from '../hooks/useScrolled'

export const AccessibilityPage: React.FC = () => {
  const isScrolled = useScrolled()

  return (
    <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <ScreenHeader
          title="הצהרת נגישות"
          subtitle="עודכן לאחרונה: מרץ 2024"
          isScrolled={isScrolled}
          isAbsolute={false}
          className="mb-8"
        />
        <Card className="p-8 md:p-12 prose prose-slate max-w-none">
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <section>
              <h3 className="text-lg font-black text-slate-800 mb-3">מבוא</h3>
              <p>אנו רואים חשיבות עליונה במתן שירות שוויוני, מכובד ונגיש לכלל לקוחותינו, לרבות אנשים עם מוגבלות.</p>
            </section>
            <section>
              <h3 className="text-lg font-black text-slate-800 mb-3">התאמות הנגישות באתר</h3>
              <p>האתר עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013.</p>
              <ul className="list-disc list-inside space-y-2 mt-4 pr-4">
                <li>תפריט נגישות ייעודי המאפשר שינוי גודל טקסט, ניגודיות, גווני אפור ועוד.</li>
                <li>ניווט מלא באמצעות המקלדת.</li>
                <li>תמיכה בקוראי מסך נפוצים.</li>
                <li>התאמה לכל סוגי הדפדפנים והמכשירים (רספונסיביות).</li>
                <li>שימוש בשפה פשוטה וברורה.</li>
              </ul>
            </section>
            <section>
              <h3 className="text-lg font-black text-slate-800 mb-3">דרכי פנייה לבקשות והצעות לשיפור בנושא נגישות</h3>
              <p>אם נתקלתם בבעיה בנושא הנגישות, נשמח אם תעדכנו אותנו.</p>
              <ul className="list-none space-y-1 mt-2">
                <li><strong>אימייל:</strong> accessibility@diraleashkaa.co.il</li>
              </ul>
            </section>
          </div>
        </Card>
      </main>
    </div>
  )
}
