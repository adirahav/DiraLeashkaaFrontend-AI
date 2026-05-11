
import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/formFields';
import { Screen } from '../types';
import { Accessibility, ArrowRight } from 'lucide-react';
import { ScreenHeader } from '../components/common/ScreenHeader';

interface AccessibilityStatementPageProps {
  onNavigate: (screen: Screen) => void;
}

export const AccessibilityStatementPage: React.FC<AccessibilityStatementPageProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-right" dir="rtl">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <ScreenHeader 
          title="הצהרת נגישות" 
          subtitle="עודכן לאחרונה: מרץ 2024" 
          isScrolled={isScrolled} 
          className="mb-8 flex flex-col transition-all duration-300 ease-in-out"
        />

        <Card className="p-8 md:p-12 prose prose-slate max-w-none">
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <section>
              <h3 className="text-lg font-black text-slate-800 mb-3">מבוא</h3>
              <p>
                אנו רואים חשיבות עליונה במתן שירות שוויוני, מכובד ונגיש לכלל לקוחותינו, לרבות אנשים עם מוגבלות. 
                השקענו משאבים רבים בהנגשת האתר על מנת לאפשר חווית גלישה נוחה ויעילה לכלל האוכלוסייה.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-black text-slate-800 mb-3">התאמות הנגישות באתר</h3>
              <p>האתר עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013. התאמות הנגישות בוצעו עפ"י המלצות התקן הישראלי (ת"י 5568) לנגישות תכנים באינטרנט ברמת AA.</p>
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
              <p>
                אם נתקלתם בבעיה או בתקלה כלשהי בנושא הנגישות, נשמח אם תעדכנו אותנו ואנו נעשה כל מאמץ למצוא פתרון מתאים 
                ולטפל בתקלה בהקדם האפשרי.
              </p>
              <p className="mt-4">ניתן ליצור קשר עם רכז הנגישות שלנו:</p>
              <ul className="list-none space-y-1 mt-2">
                <li><strong>אימייל:</strong> accessibility@example.com</li>
                <li><strong>טלפון:</strong> 050-0000000</li>
              </ul>
            </section>
          </div>

        </Card>
      </main>
    </div>
  );
};
