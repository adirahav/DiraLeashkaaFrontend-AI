import React, { useState, useEffect, useRef } from 'react';
import { Screen } from '../types';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { 
  Users, 
  Clock, 
  Layers, 
  TrendingDown, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  AlertCircle,
  Smartphone,
  Eye,
  Calendar,
  MousePointerClick
} from 'lucide-react';
import { motion } from 'framer-motion';

// Defined tag colors following the screenshot's design
const tagStyles: { [key: string]: { bg: string; text: string } } = {
  SPLASH: { bg: 'bg-blue-50 text-blue-700 border-blue-100', text: 'text-blue-700' },
  SIGNUP: { bg: 'bg-amber-50 text-amber-700 border-amber-100', text: 'text-amber-700' },
  LOGIN: { bg: 'bg-purple-50 text-purple-700 border-purple-100', text: 'text-purple-700' },
  NAV: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', text: 'text-emerald-700' },
  PROPERTY: { bg: 'bg-rose-50 text-rose-700 border-rose-100', text: 'text-rose-700' },
  UI: { bg: 'bg-slate-100 text-slate-700 border-slate-200', text: 'text-slate-700' },
  SYSTEM: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-100', text: 'text-indigo-700' },
};

interface TimelineEvent {
  tag: string;
  time: string;
  route: string;
  description: string;
}

interface UserTracker {
  id: string; // e.g. '#4821'
  email: string;
  tags: string[];
  eventsCount: number;
  stoppedAt: string;
  status: 'נשר' | 'השלים' | 'נשרה';
  duration: string;
  pageCount: number;
  timeline: TimelineEvent[];
}

const generateMockTrackers = (): UserTracker[] => {
  const initial: UserTracker[] = [
    {
      id: '#4821',
      email: 'tal.cohen@gmail.com',
      tags: ['SPLASH', 'SIGNUP', 'NAV', 'PROPERTY'],
      eventsCount: 14,
      stoppedAt: '/calculator',
      status: 'נשר',
      duration: '1:24',
      pageCount: 3,
      timeline: [
        { tag: 'SPLASH', time: '10:41:00', route: '/', description: 'App boot started' },
        { tag: 'SPLASH', time: '10:41:01', route: '/', description: 'Splash API response received' },
        { tag: 'NAV', time: '10:41:04', route: '/signup', description: 'Navigated to /signup' },
        { tag: 'UI', time: '10:41:08', route: '/signup', description: "Focus — input 'כתובת מייל'" },
        { tag: 'UI', time: '10:41:12', route: '/signup', description: "Blur — input 'כתובת מייל' — filled" },
        { tag: 'UI', time: '10:41:14', route: '/signup', description: "Focus — input 'סיסמה'" },
        { tag: 'UI', time: '10:41:17', route: '/signup', description: "Blur — input 'סיסמה' — filled" },
        { tag: 'SIGNUP', time: '10:41:18', route: '/signup', description: "Call API POST '/auth/register'" },
        { tag: 'SIGNUP', time: '10:41:19', route: '/signup', description: 'Registration success, token stored' },
        { tag: 'NAV', time: '10:41:20', route: '/calculator', description: 'Navigated to /calculator' },
        { tag: 'UI', time: '10:41:22', route: '/calculator', description: "Click — button 'הוסף נכס'" },
        { tag: 'PROPERTY', time: '10:41:23', route: '/calculator', description: 'Form opened' },
        { tag: 'UI', time: '10:41:28', route: '/calculator', description: "Focus — input 'מחיר הדירה'" },
        { tag: 'UI', time: '10:42:00', route: '/calculator', description: 'Idle — 30s, no interaction' },
      ]
    },
    {
      id: '#4820',
      email: 'ron.levi@walla.com',
      tags: ['SPLASH', 'LOGIN', 'NAV', 'PROPERTY'],
      eventsCount: 22,
      stoppedAt: '/results',
      status: 'השלים',
      duration: '4:12',
      pageCount: 5,
      timeline: [
        { tag: 'SPLASH', time: '11:15:10', route: '/', description: 'App boot started' },
        { tag: 'SPLASH', time: '11:15:11', route: '/', description: 'Splash API response received' },
        { tag: 'NAV', time: '11:15:14', route: '/login', description: 'Navigated to /login' },
        { tag: 'UI', time: '11:15:20', route: '/login', description: "Focus — input 'אימייל'" },
        { tag: 'UI', time: '11:15:25', route: '/login', description: "Blur — input 'אימייל' - filled" },
        { tag: 'UI', time: '11:15:28', route: '/login', description: "Focus — input 'סיסמה'" },
        { tag: 'LOGIN', time: '11:15:35', route: '/login', description: "Call API POST '/auth/login'" },
        { tag: 'LOGIN', time: '11:15:36', route: '/login', description: 'Login success, session established' },
        { tag: 'NAV', time: '11:15:38', route: '/home', description: 'Navigated to /home' },
        { tag: 'UI', time: '11:15:45', route: '/home', description: "Click — button 'מחשבוני השקעה'" },
        { tag: 'NAV', time: '11:15:47', route: '/calculators', description: 'Navigated to /calculators' },
        { tag: 'UI', time: '11:15:52', route: '/calculators', description: "Click - button 'חישוב חלקי של נכס חדש'" },
        { tag: 'NAV', time: '11:15:55', route: '/property-calculator', description: 'Navigated to /property-calculator' },
        { tag: 'PROPERTY', time: '11:16:02', route: '/property-calculator', description: 'Form opened' },
        { tag: 'PROPERTY', time: '11:16:15', route: '/property-calculator', description: "Input 'מחיר הנכס' - שונה ל- 1,800,000 ₪" },
        { tag: 'PROPERTY', time: '11:16:30', route: '/property-calculator', description: "Input 'הון עצמי' - שונה ל- 600,000 ₪" },
        { tag: 'PROPERTY', time: '11:17:05', route: '/property-calculator', description: "Input 'הכנסות נטו' - שונה ל- 15,000 ₪" },
        { tag: 'PROPERTY', time: '11:18:10', route: '/property-calculator', description: "Click - button 'חשב רווחיות ותשואה'" },
        { tag: 'NAV', time: '11:18:12', route: '/results', description: 'Navigated to /results with calculated payloads' },
        { tag: 'UI', time: '11:18:22', route: '/results', description: 'Scroll — viewed Amortization Table' },
        { tag: 'UI', time: '11:19:15', route: '/results', description: "Click — Print Report button" },
        { tag: 'SYSTEM', time: '11:19:22', route: '/results', description: 'Report PDF generated successfully' }
      ]
    },
    {
      id: '#4819',
      email: 'maya.bar@hotmail.com',
      tags: ['SPLASH', 'SIGNUP'],
      eventsCount: 6,
      stoppedAt: '/signup',
      status: 'נשרה',
      duration: '0:45',
      pageCount: 1,
      timeline: [
        { tag: 'SPLASH', time: '12:02:00', route: '/', description: 'App boot started' },
        { tag: 'SPLASH', time: '12:02:01', route: '/', description: 'Splash API response received' },
        { tag: 'NAV', time: '12:02:05', route: '/signup', description: 'Navigated to /signup' },
        { tag: 'UI', time: '12:02:15', route: '/signup', description: "Focus — input 'שם מלא'" },
        { tag: 'UI', time: '12:02:28', route: '/signup', description: "Blur — input 'שם מלא' - filled" },
        { tag: 'UI', time: '12:02:45', route: '/signup', description: 'Idle - 15s, no interaction' }
      ]
    },
    {
      id: '#4822',
      email: 'adirahav76@gmail.com',
      tags: ['SPLASH', 'LOGIN', 'NAV', 'PROPERTY'],
      eventsCount: 34,
      stoppedAt: '/results',
      status: 'השלים',
      duration: '6:15',
      pageCount: 6,
      timeline: [
        { tag: 'SPLASH', time: '14:20:00', route: '/', description: 'App boot started' },
        { tag: 'SPLASH', time: '14:20:02', route: '/', description: 'Splash API response received' },
        { tag: 'NAV', time: '14:20:05', route: '/login', description: 'Navigated to /login' },
        { tag: 'LOGIN', time: '14:20:10', route: '/login', description: 'Login success, adirahav76@gmail.com authenticated' },
        { tag: 'NAV', time: '14:20:12', route: '/home', description: 'Navigated to /home page' },
        { tag: 'NAV', time: '14:20:30', route: '/property', description: 'Opened add property portal' },
        { tag: 'PROPERTY', time: '14:20:45', route: '/property', description: 'Form data inputted successfully' },
        { tag: 'SYSTEM', time: '14:21:02', route: '/property/calculate', description: 'Yield simulation matrices computed' },
        { tag: 'NAV', time: '14:21:12', route: '/results', description: 'Navigated to results analysis cockpit' },
        { tag: 'UI', time: '14:22:15', route: '/results', description: 'Comparing yields side by side' },
        { tag: 'NAV', time: '14:23:45', route: '/calculators', description: 'Navigated to additional calculators index' },
        { tag: 'NAV', time: '14:24:10', route: '/max-price-calculator', description: 'Opened max price affordability calculator' },
        { tag: 'SYSTEM', time: '14:26:15', route: '/max-price-calculator', description: 'Saved budget scenario in local browser cache' }
      ]
    }
  ];

  // Additional 40 realistic users to total 44 users
  const firstNames = ['אלון', 'ליאור', 'עומרי', 'גיא', 'תמר', 'יעל', 'דניאל', 'נועה', 'אורי', 'איתי', 'רון', 'מיכל', 'שירה', 'דוד', 'שרה', 'אבי', 'יוסי', 'גלית', 'קרן', 'עמית', 'גל', 'רעות', 'שגיא', 'נרקיס', 'זוהר', 'נדב', 'יותם', 'אורן', 'עדי', 'הילה', 'רון', 'שיר', 'אוהד', 'נועם', 'לירון', 'עידן'];
  const lastNames = ['כהן', 'לוי', 'מזרחי', 'פרץ', 'ביטון', 'דאהן', 'שלום', 'חזן', 'אזולאי', 'גבאי', 'חדד', 'שגיא', 'רוט', 'רומנו', 'טל', 'אשכנזי', 'פרידמן', 'סגל', 'הררי', 'אטיאס', 'שדה', 'ירושלמי', 'לב', 'מלכה', 'ברק', 'ברנר'];
  const domains = ['gmail.com', 'walla.co.il', 'outlook.co', 'hotmail.com', 'yahoo.com', 'muni.il'];
  const routes = ['/calculator', '/max-price-calculator', '/property', '/results', '/profile', '/compare-properties'];
  
  for (let i = 0; i < 40; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const domain = domains[(i * 7) % domains.length];
    const fnEng = ['alon', 'lior', 'omri', 'guy', 'tamar', 'yael', 'daniel', 'noa', 'uri', 'itay', 'ron', 'michal', 'shira', 'david', 'sarah', 'avi', 'yossi', 'galit', 'keren', 'amit', 'gal', 'reut', 'sagi', 'narkis', 'zohar', 'nadav', 'yotam', 'oren', 'adi', 'hila', 'ron', 'shir', 'ohad', 'noam', 'liron', 'idan'][i % 36];
    const lnEng = ['cohen', 'levi', 'mizrahi', 'peretz', 'biton', 'dahan', 'shalom', 'hazan', 'azoulay', 'gabay', 'hadad', 'sagi', 'roth', 'romano', 'tal', 'ashkenazi', 'friedman', 'segal', 'harari', 'atias'][i % 20];
    const email = `${fnEng}.${lnEng}${i + 13}@${domain}`;
    const idNum = 4818 - i;
    const id = `#${idNum}`;
    const isCompleted = i % 2 === 0;
    const status = isCompleted ? 'השלים' : (i % 3 === 0 ? 'נשרה' : 'נשר');
    const stoppedAt = routes[i % routes.length];
    const pageCount = 1 + (i % 5);
    const durationMin = 1 + (i % 12);
    const durationSec = 10 + (i * 13) % 50;
    
    initial.push({
      id,
      email,
      tags: isCompleted ? ['SPLASH', 'LOGIN', 'NAV', 'PROPERTY'] : ['SPLASH', 'SIGNUP'],
      eventsCount: 4 + (i * 3) % 20,
      stoppedAt,
      status,
      duration: `${durationMin}:${durationSec}`,
      pageCount,
      timeline: [
        { tag: 'SPLASH', time: `16:${10 + i}:00`, route: '/', description: 'App boot started' },
        { tag: 'SPLASH', time: `16:${10 + i}:02`, route: '/', description: 'Splash screen rendered' },
        { tag: 'NAV', time: `16:${10 + i}:05`, route: stoppedAt, description: `Navigated to page ${stoppedAt}` },
        ...(isCompleted ? [
          { tag: 'PROPERTY', time: `16:${10 + i}:25`, route: stoppedAt, description: 'Calculation parameters validated' },
          { tag: 'SYSTEM', time: `16:${10 + i}:28`, route: '/results', description: 'Generated loan amortization model successfully' }
        ] : [
          { tag: 'UI', time: `16:${10 + i}:55`, route: stoppedAt, description: 'User lost connection or inactive' }
        ])
      ]
    });
  }

  return initial;
};

interface AdminDashboardProps {
  onNavigate: (screen: Screen) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DROPPED'>('ALL');
  const [expandedUser, setExpandedUser] = useState<string | null>('tal.cohen@gmail.com'); // expanded tal by default as in screenshot
  
  // High quality realistic database of trackers generated on the fly
  const [trackers, setTrackers] = useState<UserTracker[]>(generateMockTrackers);

  // Pagination / Load More / Scroll states
  const [visibleCount, setVisibleCount] = useState(10);
  const observerRef = useRef<HTMLTableRowElement>(null);

  // Whenever filters or search term change, reset the pagination back to 10
  useEffect(() => {
    setVisibleCount(10);
  }, [searchTerm, statusFilter]);

  // Filter & Search computation (needs to be calculated before the infinite scroll observer binds)
  const filteredTrackers = trackers.filter(tracker => {
    const matchesSearch = tracker.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tracker.stoppedAt.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ACTIVE') {
      return matchesSearch && tracker.status === 'השלים';
    }
    if (statusFilter === 'DROPPED') {
      return matchesSearch && (tracker.status === 'נשר' || tracker.status === 'נשרה');
    }
    return matchesSearch;
  });

  // Dynamic Scroll Loader using IntersectionObserver
  useEffect(() => {
    const currentTrigger = observerRef.current;
    if (!currentTrigger) return;

    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry && firstEntry.isIntersecting) {
        setVisibleCount(prev => Math.min(prev + 10, filteredTrackers.length));
      }
    }, {
      rootMargin: '120px', // start loading before it fully hits screen
      threshold: 0.1
    });

    observer.observe(currentTrigger);
    return () => {
      observer.disconnect();
    };
  }, [filteredTrackers.length]);

  // Helper metric calculations
  const totalEvents = trackers.reduce((acc, curr) => acc + curr.eventsCount, 0);
  const abandonmentCount = trackers.filter(s => s.status === 'נשר' || s.status === 'נשרה').length;
  const abandonmentRate = ((abandonmentCount / trackers.length) * 100).toFixed(1);

  const toggleRow = (email: string) => {
    if (expandedUser === email) {
      setExpandedUser(null);
    } else {
      setExpandedUser(email);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-right" dir="rtl" id="admin_dashboard">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Superior Header in the spirit of the app */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold bg-indigo-50 border border-indigo-100/50 rounded-full px-3 py-1 w-max mb-2">
              <Sparkles size={12} className="animate-pulse" />
              <span>פאנל פיקוח ובקרת איכות מנהל</span>
            </div>
            <h1 className="font-black text-3xl text-slate-800 tracking-tight">כלי מעקב משתמשים</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              ניתוח משפך השמישות של משתמשי האתר בזמן אמת וזיהוי נקודות נשירה
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('HOME')}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs hover:bg-slate-50 focus:outline-none transition-colors cursor-pointer"
            >
              חזרה ללוח בקרה
            </button>
          </div>
        </div>

        {/* Grid statistics summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-blue-50 text-blue-600">
              <Users size={22} />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">סה״כ טרקרים (Trackers)</span>
              <strong className="text-2xl font-black text-slate-800">{trackers.length}</strong>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">בזמן אמת</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Layers size={22} />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">אירועים שנמדדו</span>
              <strong className="text-2xl font-black text-slate-800">{totalEvents}</strong>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">ממוצע - {(totalEvents / trackers.length).toFixed(0)} לכל טרקר</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown size={22} />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">אחוז נשירה</span>
              <strong className="text-2xl font-black text-slate-800">{abandonmentRate}%</strong>
              <span className="text-[10px] text-rose-600 font-bold block mt-0.5">{abandonmentCount} נטשו באמצע</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Clock size={22} />
            </div>
            <div>
              <span className="text-slate-400 text-xs font-semibold block">נשארו במערכת</span>
              <strong className="text-2xl font-black text-slate-800">100%</strong>
              <span className="text-[10px] text-blue-600 font-bold block mt-0.5">שרת ניטור תקין</span>
            </div>
          </div>

        </div>

        {/* Outer Section Frame */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          
          {/* List Toolbar Search & Filter */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 w-full sm:w-80 shadow-2xs">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="חיפוש לפי אימייל, מסך או מזהה..."
                className="bg-transparent border-none text-xs text-slate-700 w-full focus:outline-none text-right font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">סנן לפי:</span>
              <div className="flex bg-white border border-slate-200 p-0.5 rounded-xl shadow-2xs">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${statusFilter === 'ALL' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  הכל ({trackers.length})
                </button>
                <button
                  onClick={() => setStatusFilter('ACTIVE')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${statusFilter === 'ACTIVE' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  השלימו
                </button>
                <button
                  onClick={() => setStatusFilter('DROPPED')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${statusFilter === 'DROPPED' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  נשרו
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-bold hidden lg:block">
              * לחצו על כל שורה לראות תצוגת ציר זמן מלאה בסגנון אקורדיון
            </p>

          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 select-none">
                  <th className="py-4 px-6 text-xs text-slate-400 font-black uppercase">משתמש ומזהה</th>
                  <th className="py-4 px-4 text-xs text-slate-400 font-black uppercase">תגיות פעילות</th>
                  <th className="py-4 px-4 text-xs text-slate-400 text-center font-black uppercase">מספר אירועים</th>
                  <th className="py-4 px-4 text-xs text-slate-400 font-black uppercase">נקודת עצירה</th>
                  <th className="py-4 px-4 text-xs text-slate-400 font-black uppercase">סטטוס מעקב</th>
                  <th className="py-4 px-6 text-xs text-slate-400 text-left font-black uppercase">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrackers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 font-medium text-xs">
                      לא נמצאו משתמשים התואמים את תנאי החיפוש.
                    </td>
                  </tr>
                ) : (
                  filteredTrackers.slice(0, visibleCount).map((tracker) => {
                    const isExpanded = expandedUser === tracker.email;
                    const isCompleted = tracker.status === 'השלים';
                    
                    return (
                      <React.Fragment key={tracker.email}>
                        
                        {/* Parent Row clickable to trigger Accordion */}
                        <tr 
                          onClick={() => toggleRow(tracker.email)}
                          className={`border-b border-slate-100 hover:bg-slate-50/60 transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50/30 font-semibold' : ''}`}
                        >
                          {/* User Email & ID */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-3xs uppercase">
                                {tracker.email[0]}
                              </div>
                              <div>
                                <span className="block text-xs font-black text-slate-700">{tracker.email}</span>
                                <span className="block text-[10px] text-slate-400 mt-0.5 tracking-wider">{tracker.id}</span>
                              </div>
                            </div>
                          </td>
 
                          {/* Activity Tags */}
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1">
                              {tracker.tags.map((tag) => {
                                const style = tagStyles[tag] || { bg: 'bg-slate-100 text-slate-700 border-slate-200', text: 'text-slate-700' };
                                return (
                                  <span 
                                    key={tag} 
                                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold tracking-tight border uppercase shrink-0 ${style.bg}`}
                                  >
                                    {tag}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
 
                          {/* Count Events */}
                          <td className="py-4 px-4 text-center">
                            <span className="inline-block bg-slate-100 text-slate-700 font-bold text-xs px-2 py-0.5 rounded-full">
                              {tracker.eventsCount}
                            </span>
                          </td>
 
                          {/* Stopped At */}
                          <td className="py-4 px-4">
                            <code className="text-[10px] bg-slate-100/80 border border-slate-200 text-slate-600 font-semibold rounded px-2 py-0.5 tracking-tight inline-block dir-ltr text-left">
                              {tracker.stoppedAt}
                            </code>
                          </td>
 
                          {/* Status and point color dot */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isCompleted ? 'bg-blue-500 animate-pulse' : 'bg-rose-500'}`} />
                              <span className={`text-xs font-bold ${isCompleted ? 'text-blue-600' : 'text-rose-600'}`}>
                                {tracker.status}
                              </span>
                            </div>
                          </td>

                          {/* Collapsible Trigger action */}
                          <td className="py-4 px-6 text-left">
                            <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </td>

                        </tr>

                        {/* Accordion Collapsible Visual Timeline details block */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="bg-slate-50/40 p-0 border-b border-slate-200">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-6 sm:p-8">
                                  
                                  {/* Stats Sub bar widgets */}
                                  <div className="flex flex-wrap gap-4 items-center justify-start mb-6">
                                    
                                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-3xs">
                                      <MousePointerClick size={14} className="text-indigo-500" />
                                      <span className="text-[11px] font-bold text-slate-500">אירועים:</span>
                                      <strong className="text-xs font-black text-slate-700">{tracker.eventsCount}</strong>
                                    </div>
 
                                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-3xs">
                                      <Smartphone size={14} className="text-blue-500" />
                                      <span className="text-[11px] font-bold text-slate-500">דפים:</span>
                                      <strong className="text-xs font-black text-slate-700">{tracker.pageCount}</strong>
                                    </div>
 
                                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-3xs">
                                      <Clock size={14} className="text-emerald-500" />
                                      <span className="text-[11px] font-bold text-slate-500">זמן:</span>
                                      <strong className="text-xs font-black text-slate-700">{tracker.duration} דקות</strong>
                                    </div>
 
                                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-3xs">
                                      <Calendar size={14} className="text-amber-500" />
                                      <span className="text-[11px] font-bold text-slate-500">תאריך מעקב:</span>
                                      <strong className="text-xs font-black text-slate-700">היום, 2026</strong>
                                    </div>
                                    
                                  </div>
 
                                  {/* Section divider label */}
                                  <div className="flex items-center gap-1.5 mb-6">
                                    <div className="h-[1px] bg-slate-200 flex-1" />
                                    <span className="text-[11px] font-black tracking-tight text-slate-400 px-2 uppercase bg-slate-50/50">
                                      ציר זמן — {tracker.email}
                                    </span>
                                    <div className="h-[1px] bg-slate-200 flex-1" />
                                  </div>
 
                                  {/* Vertical Line Timeline Tree Structure */}
                                  <div className="relative border-r border-slate-200 mr-2 md:mr-4 pr-4 md:pr-6 space-y-6">
                                    
                                    {tracker.timeline.map((event, eventIdx) => {
                                      const style = tagStyles[event.tag] || { bg: 'bg-slate-100 text-slate-700 border-slate-200', text: 'text-slate-700' };
                                      return (
                                        <div key={eventIdx} className="relative flex flex-col md:flex-row md:items-center justify-between text-right gap-2">
                                          
                                          {/* Timeline Circular Connector Dot */}
                                          <div className={`absolute -right-[23px] md:-right-[31px] w-4 h-4 rounded-full border-4 border-slate-50 flex items-center justify-center shrink-0 ${
                                            event.tag === 'SPLASH' ? 'bg-blue-500' :
                                            event.tag === 'NAV' ? 'bg-emerald-500' :
                                            event.tag === 'SIGNUP' || event.tag === 'LOGIN' ? 'bg-amber-500' :
                                            event.tag === 'PROPERTY' ? 'bg-rose-500' :
                                            'bg-slate-400'
                                          }`} />

                                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            
                                            {/* Event Type Tag label */}
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border tracking-tight shrink-0 text-center uppercase inline-block ${style.bg}`}>
                                              {event.tag}
                                            </span>

                                            {/* Event textual explanation */}
                                            <span className="text-xs font-semibold text-slate-700">
                                              {event.description}
                                            </span>

                                          </div>

                                          <div className="flex items-center gap-1.5 shrink-0 select-none font-mono text-[10px] text-slate-400 pr-5 md:pr-0">
                                            <span>{event.time}</span>
                                            <span>•</span>
                                            <code className="bg-slate-100 border border-slate-200/60 rounded px-1 text-[9px] font-semibold tracking-tight uppercase select-text">
                                              {event.route}
                                            </code>
                                          </div>

                                        </div>
                                      );
                                    })}

                                    {/* Visual user drop out representation */}
                                    {!isCompleted && (
                                      <div className="pt-2 relative">
                                        
                                        {/* Drop circle line breaker */}
                                        <div className="absolute -right-[21px] md:-right-[29px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-500" />
                                        
                                        <div className="p-3 bg-rose-50 border border-rose-100/85 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-3xs">
                                          <AlertCircle size={14} className="text-rose-600 shrink-0" />
                                          <span>נקודת נשירה — לא היו אירועים נוספים בטרקר זה</span>
                                        </div>

                                      </div>
                                    )}

                                  </div>

                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}

                {/* Infinite scroll load trigger & indicator */}
                {filteredTrackers.length > 0 && (
                  <tr ref={observerRef}>
                    <td colSpan={6} className="py-6 text-center bg-slate-50/20 border-t border-slate-100">
                      <div className="flex flex-col items-center justify-center gap-2">
                        {visibleCount < filteredTrackers.length ? (
                          <button
                            type="button"
                            onClick={() => setVisibleCount(prev => Math.min(prev + 10, filteredTrackers.length))}
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100/40 font-bold text-xs bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 transition-all cursor-pointer shadow-3xs"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping shrink-0" />
                            <span>נטענו {Math.min(visibleCount, filteredTrackers.length)} משתמשים מתוך {filteredTrackers.length} • לחץ כאן או גלול מטה כדי לראות עוד</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 font-bold text-xs">
                            סוף הרשימה • נטענו כל {filteredTrackers.length} המשתמשים בארכיון המוצג
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

          {/* Bottom Total summary card */}
          <div className="p-5 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-400 font-bold flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>מציג {Math.min(visibleCount, filteredTrackers.length)} מתוך {filteredTrackers.length} טרקרים תואמים ({trackers.length} סה״כ)</span>
            <span>שרת הניטור פועל בהצלחה • מעקב ביצועי עמודים בזמן אמת</span>
          </div>

        </div>

      </div>
    </div>
  );
};
