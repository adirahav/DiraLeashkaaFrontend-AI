import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/common/Card';
import { Logo } from '../components/animations/Logo';
import { Screen } from '../types';
import { UserPersonalInfo } from '../components/layout/UserPersonalInfo';
import { UserFinancialDetails } from '../components/layout/UserFinancialDetails';
import { UserConsent } from '../components/layout/UserConsent';
import { TERMS_CONTENT } from '../constants/termsContent';
import { ScreenHeader } from '../components/common/ScreenHeader';

interface RegisterProps {
  onNavigate: (screen: Screen) => void;
  initialStep?: number;
}

export const SignupPage: React.FC<RegisterProps> = ({ onNavigate, initialStep = 1 }) => {
  const [step, setStep] = useState(initialStep);

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    yearOfBirth: '',
    equity: '',
    incomes: '',
    commitments: '',
    additionalFundingSources: [],
    termsOfUseAccept: ''
  });

  const isStep3Valid = !!formData.termsOfUseAccept;

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    
    if (isStep3Valid) {
      if (formData.fullname === 'WRONG') {
        setServerError('אירעה שגיאת שרת בעת הרישום. נא לנסות שוב מאוחר יותר.');
        return;
      }
      onNavigate('HOME');
    }
  };

  const stepVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" }
    })
  };

  const [direction, setDirection] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleNext = () => {
    setServerError(null);
    if (step === 1 && formData.fullname === 'WRONG') {
      setServerError('אירעה שגיאת שרת בעת אימות הנתונים. נא לנסות שוב.');
      return;
    }
    setDirection(1);
    nextStep();
  };

  const handlePrev = () => {
    setDirection(-1);
    setServerError(null);
    prevStep();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl z-10"
      >
        <Card className="w-full">
          <div className="flex flex-col items-center mb-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Logo size={64} className="mb-4" showText={true} />
            </motion.div>
            <div className="w-full text-right">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
                <ScreenHeader 
                  title="יצירת חשבון השקעות" 
                  subtitle="נשמח להכיר אותך כדי להתאים לך נכסים"
                  className="text-center md:text-right"
                />
                <motion.div 
                  key={step}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="self-center md:self-auto px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm whitespace-nowrap bg-blue-100 text-blue-700"
                  aria-live="polite"
                >
                  שלב {step} מתוך 3
                </motion.div>
              </div>
              
              <div 
                className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner p-0.5"
                role="progressbar"
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={3}
                aria-label={`שלב ${step} מתוך 3`}
              >
                <motion.div 
                  className="h-full rounded-full shadow-sm bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                ></motion.div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden min-h-[400px]">
            {serverError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium text-center shadow-sm"
              >
                {serverError}
              </motion.div>
            )}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                {step === 1 && (
                  <UserPersonalInfo
                    formData={formData}
                    setFormData={setFormData}
                    onClick={handleNext}
                    buttonText="המשך לשלב הבא"
                    variant="wizard"
                  />
                )}
                {step === 2 && (
                  <UserFinancialDetails
                    formData={formData}
                    setFormData={setFormData}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    nextButtonText="המשך לשלב הבא"
                    prevButtonText="חזור לשלב הקודם"
                    variant="wizard"
                  />
                )}
                {step === 3 && (
                  <UserConsent
                    content={TERMS_CONTENT}
                    showCheckbox={true}
                    showButtons={true}
                    checkboxLabel="קראתי, הבנתי ואני מאשר/ת את תנאי השימוש ומדיניות הפרטיות במערכת *"
                    checked={!!formData.termsOfUseAccept}
                    onChange={(checked) => setFormData({ ...formData, termsOfUseAccept: checked ? new Date().toISOString() : '' })}
                    onSubmit={handleSubmit}
                    onPrev={handlePrev}
                    isValid={isStep3Valid}
                    prevButtonText="חזור"
                    nextButtonText="סיום ופתיחת החשבון"
                    contentClassName="p-6 bg-blue-50 rounded-3xl max-h-80 overflow-y-auto text-sm text-blue-800 border border-blue-100 shadow-inner leading-relaxed scrollbar-thin scrollbar-thumb-blue-200"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-slate-50">
            <span className="text-slate-400 font-medium">כבר יש לך פרופיל פעיל? </span>
            <button 
              onClick={() => onNavigate('LOGIN')}
              className="text-blue-600 font-black hover:text-blue-700 transition-colors border-b-2 border-blue-100 hover:border-blue-600 pb-0.5"
            >
              התחבר כאן
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
