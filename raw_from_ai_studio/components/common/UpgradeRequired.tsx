import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export const UpgradeRequired: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden rtl" dir="rtl">
      {/* Background decorative blurry gradient blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-lg bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-8 md:p-12 text-center relative z-10">
        <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6 border border-amber-100">
          <AlertTriangle size={36} className="animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-4">
          שדרוג מערכת חובה
        </h1>
        
        <p className="text-slate-600 font-medium leading-relaxed mb-8">
          הגרסה בה אתה משתמש אינה נתמכת עוד עקב שדרוג תשתיות ושינוי ליבה במערכת מחשבון השקעות הנדל״ן. 
          כדי להמשיך להשתמש בכלים המתקדמים באופן תקין ומאובטח, אנא עברו לגרסה החדשה.
        </p>
        
        <a
          href="https://v2.diraleashkaa.co.il"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all w-full cursor-pointer"
        >
          <span>מעבר לגרסה החדשה</span>
          <ArrowRight size={20} className="stroke-[2.5]" />
        </a>
        
        <div className="mt-8 text-xs font-semibold text-slate-400 font-mono">
          SYS_UPGRADE_REQUIRED • גרסה קודמת v0.9.0
        </div>
      </div>
    </div>
  );
};
