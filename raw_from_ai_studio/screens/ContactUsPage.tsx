import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { Dropdown } from '../components/formFields/Dropdown';
import { Textarea } from '../components/formFields/Textarea';
import { Button } from '../components/formFields/Button';
import { Card } from '../components/common/Card';
import { Notification } from '../components/common/Notification';
import { Mail, Send } from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const [subject, setSubject] = useState('choose');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({});
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const newErrors: { subject?: string; message?: string } = {};
    if (subject === 'choose') {
      newErrors.subject = 'אנא בחר נושא פנייה';
    }

    if (!message.trim()) {
      newErrors.message = 'אנא הזן הודעה';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      if (subject.includes('app_error')) {
        setNotification({
          type: 'error',
          message: 'אירעה שגיאת שרת בעת שליחת ההודעה. אנא נסה שוב מאוחר יותר.', 
        });
        setLoading(false);
        return;
      }

      setSubject('choose');
      setMessage('');
      setErrors({});
      setLoading(false);
      setNotification({
        type: 'success',
        message: 'ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.', 
      });
    }, 1000);
  };

  const isFormIncomplete = subject === 'choose' || !message.trim();

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
          icon={<Mail />} 
          title="צור קשר" 
          variant="indigo"
        />

        <div className="space-y-6">
          <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <Card className="p-6">
              <div className="flex flex-col gap-5 text-right">
                <Dropdown
                  label="נושא"
                  value={subject}
                  onChange={(val) => {
                    setSubject(val);
                    if (errors.subject) setErrors(prev => ({ ...prev, subject: undefined }));
                  }}
                  error={errors.subject}
                  options={[
                    { value: 'choose', label: 'בחר' },
                    { value: 'app_error', label: 'שגיאה באפליקציה' },
                    { value: 'registration', label: 'רישום' },
                    { value: 'suggestion', label: 'הצעת יעול' },
                    { value: 'else', label: 'אחר' },
                  ]}
                />

                <Textarea
                  label="הודעה"
                  value={message}
                  onChange={(val) => {
                    setMessage(val);
                    if (errors.message) setErrors(prev => ({ ...prev, message: undefined }));
                  }}
                  placeholder="כתוב כאן את הודעתך..."
                  minHeight="150px"
                  error={errors.message}
                />
              </div>
            </Card>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleSubmit} 
              loading={loading}
              disabled={isFormIncomplete || loading}
              className={`px-12 py-4 text-lg shadow-xl ${isFormIncomplete || loading ? 'opacity-50 cursor-not-allowed' : 'shadow-indigo-100 font-bold'}`}
              icon={Send}
              iconSize={20}
            >
              שלח
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUsPage;
