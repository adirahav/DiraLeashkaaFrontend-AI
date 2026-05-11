
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../components/common/Card';
import { StringInput, Button, PasswordInput, EmailInput } from '../components/formFields';
import { Logo } from '../components/animations/Logo';
import { Screen } from '../types';

interface LoginProps {
  onNavigate: (screen: Screen) => void;
  onLogin: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{username?: string; password?: string; general?: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {username?: string; password?: string; general?: string} = {};
    
    if (!username) {
      newErrors.username = 'נא להזין שם משתמש';
    } else if (!/\S+@\S+\.\S+/.test(username)) {
      newErrors.username = 'נא להזין כתובת אימייל תקינה';
    }
    
    if (!password) newErrors.password = 'נא להזין סיסמה';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Simulate server request
    setTimeout(() => {
      setIsLoading(false);
      if (password === 'WRONG') {
        setErrors({ general: 'שגיאת שרת: פרטי ההתחברות אינם נכונים או שהמשתמש חסום' });
      } else {
        onLogin(username);
      }
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md z-10"
      >
        <Card className="w-full">
          <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Logo size={64} className="mb-4" showText={true} />
            </motion.div>
            <div className="text-center">
              <motion.h1 
                variants={itemVariants}
                className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2 tracking-tight"
              >
                ברוכים השבים
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-slate-500 font-medium"
              >
                התחברו כדי לנהל את השקעות הנדל״ן שלכם
              </motion.p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 text-right">
            {errors.general && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm font-bold text-center mb-2"
              >
                {errors.general}
              </motion.div>
            )}
            <motion.div variants={itemVariants}>
              <EmailInput
                label="אימייל (שם משתמש)"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username || errors.general) setErrors({...errors, username: '', general: ''});
                }}
                placeholder="הכנס את כתובת האימייל שלך"
                error={errors.username}
                required
                disabled={isLoading}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <PasswordInput
                label="סיסמה"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password || errors.general) setErrors({...errors, password: '', general: ''});
                }}
                placeholder="הכנס את הסיסמה שלך"
                error={errors.password}
                required
                disabled={isLoading}
              />
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileHover={{ x: -5 }}
              type="button"
              onClick={() => onNavigate('FORGOT_PASSWORD')}
              className="text-blue-600 text-sm font-bold hover:underline self-start mr-1"
              disabled={isLoading}
            >
              שכחתי סיסמה?
            </motion.button>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="submit" 
                className="mt-4 py-4 w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>מתחבר...</span>
                  </div>
                ) : 'התחברות למערכת'}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mt-6 text-slate-500 font-medium">
              עדיין אין לך חשבון?{' '}
              <button 
                type="button"
                onClick={() => onNavigate('REGISTER')}
                className="text-blue-600 font-black hover:underline"
              >
                הירשם עכשיו
              </button>
            </motion.div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
