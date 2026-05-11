
import React, { useState } from 'react';
import { Screen } from './types';
import { Login } from './screens/Login';
import { SignupPage } from './screens/SignupPage';
import { ProfilePage } from './screens/ProfilePage';
import { TermsOfUsePage } from './screens/TermsOfUsePage';
import { AccessibilityStatementPage } from './screens/AccessibilityStatementPage';
import { ContactUsPage } from './screens/ContactUsPage';
import { HomePage } from './screens/HomePage';
import { PropertyPage } from './screens/PropertyPage';
import { ForgotPassword } from './screens/ForgotPassword';
import { CalculatorsPage } from './screens/CalculatorsPage';
import { MaxPriceCalculator } from './screens/MaxPriceCalculator';
import { CompareCalculator } from './screens/CompareCalculator';
import { AccessibilityMenu } from './components/common/AccessibilityMenu';
import { Footer } from './components/common/Footer';
import { Header } from './components/common/Header';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  const [userName] = useState('ישראל');
  const [userEmail, setUserEmail] = useState('');
  const [showTour, setShowTour] = useState(false);
  const [isResultsMode, setIsResultsMode] = useState(false);

  const navigate = (screen: Screen) => {
    if (screen === 'LOGIN') {
      setUserEmail('');
      setShowTour(false);
    }
    setCurrentScreen(screen);
    setIsResultsMode(false);
    window.scrollTo(0, 0);
  };

  const handleLogin = (email: string) => {
    setUserEmail(email);
    navigate('HOME');
    if (email === 'tour@gmail.com') {
      // Tour will be triggered in HomePage/HomeWelcome
    }
  };

  const showNavigation = currentScreen !== 'LOGIN' && 
                        currentScreen !== 'REGISTER' && 
                        currentScreen !== 'FORGOT_PASSWORD';

  const renderScreen = () => {
    switch (currentScreen) {
      case 'LOGIN':
        return <Login onNavigate={navigate} onLogin={handleLogin} />;
      case 'REGISTER':
        return <SignupPage onNavigate={navigate} />;
      case 'PROFILE':
      case 'PERSONAL_DETAILS':
        return <ProfilePage onNavigate={navigate} mode="PERSONAL" />;
      case 'FINANCIAL_DATA':
        return <ProfilePage onNavigate={navigate} mode="FINANCIAL" />;
      case 'TERMS':
        return <TermsOfUsePage onNavigate={navigate} />;
      case 'ACCESSIBILITY_STATEMENT':
        return <AccessibilityStatementPage onNavigate={navigate} />;
      case 'CONTACT_US':
        return <ContactUsPage />;
      case 'HOME':
        return <HomePage onNavigate={navigate} userEmail={userEmail} showTour={showTour} setShowTour={setShowTour} />;
      case 'PROPERTY':
        return <PropertyPage onNavigate={navigate} showTour={showTour} setShowTour={setShowTour} userEmail={userEmail} onResultsModeChange={setIsResultsMode} />;
      case 'FORGOT_PASSWORD':
        return <ForgotPassword onNavigate={navigate} />;
      case 'CALCULATORS':
        return <CalculatorsPage onNavigate={navigate} />;
      case 'MAX_PRICE':
        return <MaxPriceCalculator onNavigate={navigate} />;
      case 'COMPARE_PROPERTIES':
        return <CompareCalculator onNavigate={navigate} />;
      default:
        return <Login onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 max-w-full">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[200] bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
      >
        דלג לתוכן המרכזי
      </a>
      
      {showNavigation && !isResultsMode && <Header onNavigate={navigate} userName={userName} currentScreen={currentScreen} />}

      <div id="app-content" className="flex-1 flex flex-col">
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {renderScreen()}
        </main>

        {showNavigation && !isResultsMode && (
          <Footer onNavigate={navigate} />
        )}
      </div>

      <AccessibilityMenu />
    </div>
  );
};

export default App;
