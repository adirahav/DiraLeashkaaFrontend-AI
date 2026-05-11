import React from 'react';
import { StringInput, YearOfBirth, Button, PasswordInput, EmailInput } from '../formFields';
import { Card } from '../common/Card';

interface UserPersonalInfoProps {
  formData: any;
  setFormData: (data: any) => void;
  onClick?: () => void;
  isEmailReadOnly?: boolean;
  isPasswordReadOnly?: boolean;
  showNextButton?: boolean;
  buttonText?: string;
  buttonIcon?: React.ElementType;
  initialData?: any;
  variant?: 'wizard' | 'profile';
}

export const UserPersonalInfo: React.FC<UserPersonalInfoProps> = ({
  formData,
  setFormData,
  onClick,
  isEmailReadOnly = false,
  isPasswordReadOnly = false,
  showNextButton = true,
  buttonText = "המשך לשלב הבא",
  buttonIcon,
  initialData,
  variant = 'wizard'
}) => {
  const currentYear = new Date().getFullYear();

  // Check if any relevant field has changed compared to initialData (if provided)
  const hasChanges = !initialData || (
    formData.fullname !== initialData.fullname ||
    formData.email !== initialData.email ||
    formData.password !== initialData.password ||
    formData.yearOfBirth !== initialData.yearOfBirth
  );

  // Validation Helpers
  const getBirthYearError = () => {
    if (!formData.yearOfBirth) return '';
    if (formData.yearOfBirth.length < 4) return 'נא להזין שנה בת 4 ספרות';
    const year = parseInt(formData.yearOfBirth);
    const age = currentYear - year;
    if (age < 18) return `השירות מיועד למשתמשים מעל גיל 18 (שנת ${currentYear - 18} ומטה)`;
    if (age > 120) return 'נא להזין שנת לידה הגיונית (עד גיל 120)';
    return '';
  };

  const getPasswordError = () => {
    if (!formData.password) return '';
    if (formData.password.length < 8) return 'הסיסמה חייבת להכיל לפחות 8 תווים';
    return '';
  };

  const getEmailError = () => {
    if (!formData.email) return '';
    if (!formData.email.includes('@') || !formData.email.includes('.')) return 'כתובת אימייל לא תקינה';
    return '';
  };

  const getNameError = () => {
    if (!formData.fullname) return '';
    if (formData.fullname.trim().length < 2) return 'נא להזין שם מלא תקין';
    return '';
  };

  // Internal validation logic
  const isValid = 
    formData.fullname?.trim().length >= 2 && 
    getNameError() === '' &&
    formData.email?.includes('@') && 
    (isEmailReadOnly || getEmailError() === '') &&
    (isPasswordReadOnly || (formData.password?.length >= 8 && getPasswordError() === '')) &&
    formData.yearOfBirth?.length === 4 &&
    getBirthYearError() === '';

  const formFields = (
    <div className="flex flex-col gap-5 text-right">
      <StringInput
        label="שם מלא"
        value={formData.fullname}
        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
        placeholder="הכנס שם מלא (למשל: ישראל ישראלי)"
        error={getNameError()}
        required
      />

      <EmailInput
        label="אימייל"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="example@mail.com"
        error={getEmailError()}
        required
        disabled={isEmailReadOnly}
      />

      <PasswordInput
        label="סיסמה (מינימום 8 תווים)"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="בחר סיסמה מאובטחת"
        error={getPasswordError()}
        required
        disabled={isPasswordReadOnly}
      />

      <YearOfBirth
        label="שנת לידה"
        value={formData.yearOfBirth}
        onChange={(val) => setFormData({ ...formData, yearOfBirth: val })}
        error={getBirthYearError()}
        tooltip="שנת הלידה משמשת לחישוב אופק המשכנתא המקסימלי (עד גיל 80). המערכת מאפשרת רישום מגיל 18 ועד 120 בלבד."
        placeholder={`הזן שנת לידה (למשל: ${currentYear - 30})`}
      />
    </div>
  );

  const actionButton = showNextButton && onClick && (
    <Button 
      onClick={onClick} 
      disabled={!isValid || !hasChanges} 
      className={variant === 'profile' ? "px-12 py-4 text-lg shadow-xl shadow-blue-200" : "mt-4 py-4"}
      icon={buttonIcon} 
      iconSize={20}
    >
      {buttonText}
    </Button>
  );

  if (variant === 'profile') {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-500">
        <Card className="p-6">
          {formFields}
        </Card>
        {actionButton && (
          <div className="flex justify-center">
            {actionButton}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500">
      {formFields}
      {actionButton}
    </div>
  );
};
