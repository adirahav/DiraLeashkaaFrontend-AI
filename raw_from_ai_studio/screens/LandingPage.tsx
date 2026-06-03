import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Calculator, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Shield, 
  MessageSquare,
  Sparkles,
  ChevronLeft,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { Screen } from '../types';
import { Logo } from '../components/animations/Logo';

interface LandingPageProps {
  onNavigate: (screen: Screen) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: <Calculator className="w-6 h-6 text-blue-600" />,
      title: 'מחשבון תשואות חכם',
      description: 'חישוב מדויק של תשואה שנתית, תשואה על ההון (ROE), יחס כיסוי חוב (DSCR) ותזרים מזומנים חודשי נטו.',
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      icon: <Building2 className="w-6 h-6 text-emerald-600" />,
      title: 'השוואת נכסים מתקדמת',
      description: 'השוואה בין מספר עסקאות נדל״ן במקביל בממשק נוח ואינטואיטיבי המציג יתרונות וחסרונות של כל נכס.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      title: 'חיזוי וניתוח 10 שנים קדימה',
      description: 'מנוע חיזוי דינמי הלוקח בחשבון עליית ערך הנכס, עליית מחירי השכירות והפחתת יתרת הלוואת המשכנתא.',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      icon: <DollarSign className="w-6 h-6 text-amber-600" />,
      title: 'תכנון מימון ומשכנתא',
      description: 'מציאת הגובה המקסימלי של הנכס שבאפשרותך לרכוש בהתבסס על ההון העצמי וההכנסה השוטפת שלך.',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'הזן את פרטי העסקה והמימון',
      description: 'פרמטרים פשוטים כגון מחיר רכישה, מחיר שכירות חודשי מתוכנן, והון עצמי זמין להשקעה.',
    },
    {
      num: '02',
      title: 'השוואה וניתוח מקיף',
      description: 'צפייה בדוח כדאיות מיידי עם מדדים ברורים: תשואה על ההשקעה, רווח הון צפוי וגרף אמוניזציה.',
    },
    {
      num: '03',
      title: 'קבלת החלטה מושכלת',
      description: 'שמירת הנכס למעקב, הדפסת דוח מפורט וקבלת החלטת רכישה המבוססת על מספרים ולא על תחושות בטן.',
    },
  ];

  const testimonials = [
    {
      quote: "״כמשקיע נדל״ן ותיק, המחשבון הזה חסך לי עשרות שעות של חישובי אקסל מסובכים. הכל ברור, מהיר ומדויק ביותר. מומלץ בחום!״",
      name: "דניאל קדוש",
      role: "משקיע נדל״ן ויזם מוביל"
    },
    {
      quote: "״הכלי עזר לי להבין בדיוק איזה נכס כדאי לי לקנות ואיך לתכנן נכון את המשכנתא. בזכות המערכת גיליתי טעויות קריטיות בחישובים המקוריים שלי.״",
      name: "מיכל סולומון",
      role: "רכשה דירת השקעה ראשונה בחיפה"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-right selection:bg-indigo-100 selection:text-indigo-900 pb-16" dir="rtl">
      {/* Landing Navigation Header */}
      <nav id="landing-nav" className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('REGISTER')}>
            <Logo size={44} showText={true} />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors">יתרונות מרכזיים</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors">איך זה עובד?</a>
            <a href="#testimonials" className="text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors">מה אומרים עלינו</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('LOGIN')}
              className="px-4 py-2 text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors cursor-pointer"
            >
              התחברות
            </button>
            <button 
              onClick={() => onNavigate('REGISTER')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4.5 py-2 rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              הרשמה חינם
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110%] max-w-[1280px] h-full pointer-events-none opacity-40">
          <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-blue-300 blur-[80px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-indigo-300 blur-[100px]" />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero text contents */}
            <div className="lg:col-span-7 flex flex-col items-start text-right">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-6 select-none"
              >
                <Sparkles size={12} className="fill-indigo-300 text-indigo-600 animate-pulse" />
                <span>פותח בשילוב בינה מלאכותית (AI)</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 leading-tight sm:leading-tight lg:leading-none tracking-tight mb-6"
              >
                הדרך החכמה שלך <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">לחופש כלכלי</span> באמצעות נדל״ן
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed max-w-[620px] mb-8"
              >
                המחשבון המתקדם והידידותי ביותר בישראל לניתוח והשוואת דירות להשקעה. חשב תשואות, הערך סיכונים ותכנן את עסקת חייך בראש שקט.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <button 
                  onClick={() => onNavigate('REGISTER')}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                >
                  <span>הרשמה חינם והתחלת תכנון</span>
                  <ChevronLeft size={18} className="rotate-0 shrink-0" />
                </button>
                <a 
                  href="#features"
                  className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-4 px-8 rounded-2xl cursor-pointer transition-all w-full sm:w-auto"
                >
                  <span>איך זה עובד?</span>
                </a>
              </motion.div>

              {/* Minimal social proof */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex items-center gap-4 mt-10 border-t border-slate-200/60 pt-6 w-full"
              >
                <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">דק</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">מש</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">רז</div>
                </div>
                <p className="text-xs text-slate-500 font-medium font-sans">
                  הצטרף למאות משתמשים שכבר מנתחים את עסקאות הנדל״ן שלהם בעידן החדש.
                </p>
              </motion.div>
            </div>

            {/* Hero graphic mockup */}
            <div className="lg:col-span-5 relative flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: 'spring', delay: 0.1 }}
                className="relative bg-white border border-slate-200/80 rounded-2xl shadow-2xl p-6 w-full max-w-[420px] overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">ממשק דירוג נכס</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-100/50 p-3.5 rounded-xl">
                    <Building2 className="w-8 h-8 text-blue-600 shrink-0" />
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-semibold">דירת השקעה נבחרת</div>
                      <div className="text-sm font-black text-slate-700">דירת 3 חדרים, ירושלים או חיפה</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="bg-slate-50 p-3 rounded-xl text-right">
                      <span className="text-[11px] text-slate-400 block font-semibold">מחיר העסקה</span>
                      <span className="text-sm font-black text-slate-700">₪1,350,000</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl text-right">
                      <span className="text-[11px] text-slate-400 block font-semibold">הון עצמי נדרש</span>
                      <span className="text-sm font-black text-slate-700">₪350,000</span>
                    </div>
                  </div>

                  {/* Profit indicator visually appealing */}
                  <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-4 text-center relative overflow-hidden mt-2">
                    <div className="text-xs text-emerald-600 font-bold mb-1">מדד התשואה הצפוי שלך</div>
                    <div className="text-2xl font-black text-emerald-600">6.23% בשנה</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-1">גבוה ב-1.4% מממוצע האזור</div>
                    <TrendingUp className="absolute right-3 bottom-2 w-12 h-12 text-emerald-600/10" />
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl text-center text-xs font-bold leading-normal">
                    המערכת תשקלל הוצאות נלוות, תיווך, עורכי דין ומיסים באופן אוטומטי!
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Key Benefits Grid Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mb-4">
              כל מה שאתה צריך כדי לעשות עסקאות נדל״ן חכמות
            </h2>
            <p className="text-slate-500 font-medium sm:text-lg">
              המערכת מספקת לך ארגז כלים פיננסי מלא המתוכנן במיוחד למשקיעי נדל״ן בישראל, ללא צורך בידע מקדים או קובצי אקסל מסובכים.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {features.map((feat, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50/60 hover:bg-white border border-slate-100 hover:border-slate-200/80 rounded-2xl p-6.5 transition-all duration-300 hover:shadow-xl group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${feat.color}`}>
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action / How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4">
              איך המערכת עובדת?
            </h2>
            <p className="text-slate-500 font-medium">
              3 שלבים פשוטים בין הדירה שהצעת לבדיקת הכדאיות המעמיקה ביותר בעולם הנדל״ן.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-8 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
                <span className="absolute -top-4 -right-2 text-7xl font-sans font-black text-slate-100/60 select-none">
                  {step.num}
                </span>
                <div className="relative z-10 pt-4">
                  <h3 className="text-base font-bold text-slate-800 mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-normal">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4">
              מה משקיעים מספרים עלינו?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 relative">
                <MessageSquare className="absolute left-6 top-6 text-indigo-100 w-10 h-10 transform scale-x-[-1]" />
                <p className="text-slate-600 font-medium leading-relaxed italic mb-6 text-sm relative z-10">
                  {test.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    {test.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{test.name}</h4>
                    <span className="text-[11px] text-slate-400 font-semibold">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4">
              שאלות נפוצות
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">מיהו קהל היעד של המערכת?</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                המערכת מתאימה למשקיעי נדל״ן מתחילים העושים את צעדיהם הראשונים בשוק, וכן למשקיעים מנוסים ויזמים המחפשים דרך מהירה, מקצועית ומבוססת נתונים כדי להשוות בין נכסים מתחרים מול הלקוחות או עבור עצמם.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">האם השימוש במערכת כרוך בתשלום?</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                לא, הכלים הבסיסיים לניתוח וחישוב דירות להשקעה פתוחים לשימוש חינמי לחלוטין לאחר השלמת הרשמה קצרה ומיידית.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">האם נדרש ניסיון פיננסי קודם?</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                ממש לא! פיתחנו את המערכת בצורה פשוטה, אינטראקטיבית וכוללת הסברים ברורים (בליווי סיור מודרך מותאם) לאורך כל שלבי הזנת הנתונים, כדי שתוכלו לקבל תובנות בלי שום צורך בתואר במימון.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Banner Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 left-0 w-44 h-44 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <Sparkles size={28} className="text-amber-300 fill-amber-300/40 animate-bounce mb-4" />
              <h2 className="text-2xl sm:text-4xl font-black mb-4">
                הצטרף עכשיו ותתחיל להשקיע כמו מקצוען!
              </h2>
              <p className="text-indigo-100 font-medium text-sm sm:text-base leading-relaxed mb-8">
                ללא צורך בכרטיס אשראי. רישום פשוט של דקה אחת, והמערכת זמינה עבורך באופן מלא לשימוש ללא הגבלה.
              </p>
              <button 
                onClick={() => onNavigate('REGISTER')}
                className="bg-white hover:bg-slate-50 text-blue-600 font-extrabold px-10 py-4.5 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all transform hover:scale-[1.03] active:scale-[0.97]"
              >
                הרשמה חינם ב-60 שניות
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
