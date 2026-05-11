
import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/formFields';
import { Screen } from '../types';
import { SectionHeader } from '../components/common/SectionHeader';
import { User, Wallet, Save, ArrowRight } from 'lucide-react';
import { UserFinancialDetails } from '../components/layout/UserFinancialDetails';
import { UserPersonalInfo } from '../components/layout/UserPersonalInfo';
import { Notification } from '../components/common/Notification';

interface ProfilePageProps {
  onNavigate: (screen: Screen) => void;
  mode?: 'PERSONAL' | 'FINANCIAL';
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, mode = 'PERSONAL' }) => {
  const currentYear = new Date().getFullYear();
  
  const initialData = {
    fullname: 'ישראל ישראלי',
    email: 'israel@example.com',
    password: '••••••••',
    yearOfBirth: '1990',
    equity: '500,000',
    incomes: '15,000',
    commitments: '2,000',
    additionalFundingSources: [] as any[],
    lastUpdated: '03.04.2026',
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Validation Helpers (aligned with UserPersonalInfo requirements)
  const getBirthYearError = () => {
    if (!formData.yearOfBirth) return '';
    if (formData.yearOfBirth.length < 4) return 'נא להזין שנה בת 4 ספרות';
    const year = parseInt(formData.yearOfBirth);
    const age = currentYear - year;
    if (age < 18) return `השירות מיועד למשתמשים מעל גיל 18 (שנת ${currentYear - 18} ומטה)`;
    if (age > 120) return 'נא להזין שנת לידה הגיונית (עד גיל 120)';
    return '';
  };

  const getPasswordError = () => ''; // Password is readonly here
  const getEmailError = () => {
    if (!formData.email) return '';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'אימייל לא תקין';
    return '';
  };
  const getNameError = () => {
    if (!formData.fullname) return '';
    return '';
  };

  const getEquityError = () => {
    return '';
  };

  const getIncomesError = () => {
    return '';
  };

  const getCommitmentsError = () => {
    return '';
  };


  const validate = () => {
    const newErrors: Record<string, string> = {};
    const birthError = getBirthYearError();
    const emailError = getEmailError();
    const nameError = getNameError();
    const equityError = getEquityError();
    const incomesError = getIncomesError();
    const commitmentsError = getCommitmentsError();

    if (nameError) newErrors.fullname = nameError;
    if (emailError) newErrors.email = emailError;
    if (birthError) newErrors.yearOfBirth = birthError;
    if (equityError) newErrors.equity = equityError;
    if (incomesError) newErrors.incomes = incomesError;
    if (commitmentsError) newErrors.commitments = commitmentsError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    setIsSaving(true);
    setNotification(null);

    // Simulate API call
    setTimeout(() => {
      const equityValue = formData.equity.toString().replace(/,/g, '');
      
      if (equityValue === '999') {
        setNotification({
          type: 'error',
          message: 'אירעה שגיאה בעת שמירת הנתונים. נא לנסות שוב מאוחר יותר.'
        });
        setIsSaving(false);
        return;
      }

      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
      setFormData(prev => ({ ...prev, lastUpdated: formattedDate }));
      setIsSaving(false);
      setNotification({
        type: 'success',
        message: 'השינויים נשמרו בהצלחה במערכת!'
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right relative" dir="rtl">
      {/* Global Notification */}
      <Notification
        isVisible={!!notification}
        type={notification?.type || 'success'}
        message={notification?.message || ''}
        onClose={() => setNotification(null)}
      />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <SectionHeader 
          icon={mode === 'PERSONAL' ? <User /> : <Wallet />} 
          title={mode === 'PERSONAL' ? 'פרטים אישיים' : 'נתונים כלכליים'} 
          variant={mode === 'PERSONAL' ? 'blue' : 'teal'} 
        />

        <div className="space-y-6">
          {/* Personal Info Section */}
          {mode === 'PERSONAL' && (
            <UserPersonalInfo
              formData={formData}
              initialData={initialData}
              setFormData={setFormData}
              isEmailReadOnly={true}
              isPasswordReadOnly={true}
              onClick={handleSave}
              buttonText={isSaving ? 'שומר...' : 'שמור שינויים'}
              buttonIcon={Save}
              variant="profile"
            />
          )}

          {/* Financial Info Section */}
          {mode === 'FINANCIAL' && (
            <UserFinancialDetails
              formData={formData}
              initialData={initialData}
              setFormData={setFormData}
              showAdditionalFunding={true}
              onNext={handleSave}
              nextButtonText={isSaving ? 'שומר...' : 'שמור שינויים'}
              buttonIcon={Save}
              variant="profile"
            />
          )}
        </div>
      </main>
    </div>
  );
};
