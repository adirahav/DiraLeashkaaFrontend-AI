import React from 'react';
import { StringInput, YearOfBirth, Button, PasswordInput, EmailInput } from '../formFields';
import { Card } from '../common/Card';
import { useSplash } from '../../hooks/useSplash';
import { useStore } from '../../store/store';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  buttonText,
  buttonIcon,
  initialData,
  variant = 'wizard',
}) => {
  const { getPhrase } = useSplash();
  const isLoading = useStore((state) => state.isLoading);
  const currentYear = new Date().getFullYear();

  const hasChanges = !initialData || (
    formData.fullname !== initialData.fullname ||
    formData.email !== initialData.email ||
    formData.password !== initialData.password ||
    formData.yearOfBirth !== initialData.yearOfBirth
  );

  // Dirty-state errors: only shown when the field has a value
  const nameError = formData.fullname && formData.fullname.trim().length < 2
    ? getPhrase('signup_fullname_error', 'Please enter a valid full name')
    : '';

  const passwordError = formData.password && formData.password.length < 8
    ? getPhrase('signup_password_error', 'Password must be at least 8 characters')
    : '';

  const birthYearError = (() => {
    if (!formData.yearOfBirth) return '';
    if (formData.yearOfBirth.length < 4)
      return getPhrase('signup_year_of_birth_error', 'Please enter a 4-digit year');
    const age = currentYear - parseInt(formData.yearOfBirth);
    if (age < 18) return getPhrase('signup_year_of_birth_error', 'Must be at least 18 years old');
    if (age > 120) return getPhrase('signup_year_of_birth_error', 'Please enter a valid birth year');
    return '';
  })();

  const isFormValid =
    formData.fullname?.trim().length >= 2 &&
    (isEmailReadOnly || EMAIL_REGEX.test(formData.email?.trim() ?? '')) &&
    (isPasswordReadOnly || formData.password?.length >= 8) &&
    formData.yearOfBirth?.length === 4 &&
    !birthYearError;

  const resolvedButtonText = buttonText ?? getPhrase('wizard_next_button', 'Continue to Next Step');

  const formFields = (
    <div className="flex flex-col gap-5 text-right">
      <StringInput
        label={getPhrase('signup_fullname_label', 'Full Name')}
        value={formData.fullname}
        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
        placeholder={getPhrase('signup_fullname_placeholder', 'Enter your full name')}
        error={nameError}
        required
      />

      <EmailInput
        label={getPhrase('signup_email_label', 'Email')}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder={getPhrase('signup_email_placeholder', 'example@mail.com')}
        required
        disabled={isEmailReadOnly}
      />

      {!isPasswordReadOnly && (
        <PasswordInput
          label={getPhrase('signup_password_label', 'Password (minimum 8 characters)')}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder={getPhrase('signup_password_placeholder', 'Choose a secure password')}
          error={passwordError}
          required
        />
      )}

      <YearOfBirth
        label={getPhrase('signup_year_of_birth_hint', 'Year of Birth')}
        value={formData.yearOfBirth}
        onChange={(val) => setFormData({ ...formData, yearOfBirth: val })}
        error={birthYearError}
        tooltip={getPhrase('signup_year_of_birth_tooltip', 'Your birth year is used to calculate the maximum mortgage horizon. Registration is available for ages 18 to 120.')}
        placeholder={getPhrase('signup_year_of_birth_placeholder', `e.g. ${currentYear - 30}`)}
      />
    </div>
  );

  const actionButton = showNextButton && onClick && (
    <Button
      onClick={onClick}
      disabled={!isFormValid || !hasChanges || isLoading}
      className={variant === 'profile' ? 'px-12 py-4 text-lg shadow-xl shadow-blue-200' : 'mt-4 py-4'}
      icon={buttonIcon}
      iconSize={20}
    >
      {resolvedButtonText}
    </Button>
  );

  if (variant === 'profile') {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {formFields}
      {actionButton}
    </div>
  );
};
