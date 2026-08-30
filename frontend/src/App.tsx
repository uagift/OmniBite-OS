import React from 'react';
import LandingPage from './components/LandingPage';
import LoginSignup from './components/LoginSignup';
import RestaurantSetupWizard from './components/RestaurantSetupWizard';
import AdminDashboard from './components/AdminDashboard';
import ClientAuth from './components/ClientAuth';
import ClientApp from './components/ClientApp';
import { useApp } from './context/AppContext';

export default function App() {
  const { currentAppState, setCurrentAppState, ownerUser, setOwnerUser } = useApp();

  // Route protection effect: redirect back to login if navigating to dashboard/setup while unauthenticated
  React.useEffect(() => {
    const protectedStates = ['dashboard', 'setup_step1', 'setup_step2', 'setup_step3'];
    if (protectedStates.includes(currentAppState) && !ownerUser?.isLoggedIn) {
      setCurrentAppState('owner_login');
    }
  }, [currentAppState, ownerUser, setCurrentAppState]);

  // Sync profile details if Login / Signup succeeds
  const handleLoginSuccess = (name: string, email: string) => {
    setOwnerUser({
      ...ownerUser,
      name,
      email,
      restaurantName: ownerUser?.restaurantName || 'Kigali Bites',
      logo: ownerUser?.logo || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=150&q=80',
      isLoggedIn: true,
    });
  };

  const handleAddCustomProduct = (newProduct: { name: string; price: string; category: string; image: string }) => {
    // Dynamic menu handling is now managed under our AppContext directly!
  };

  const accentColor = ownerUser?.brandAccentColor || '#22C55E';

  return (
    <div className="min-h-screen bg-[#07090D] relative flex flex-col font-sans transition-all selection:bg-[var(--brand-accent)] selection:text-black">
      
      {/* Global Brand Accent CSS Style Variables dynamically injected according to specifications */}
      <style>{`
        :root {
          --brand-accent: ${accentColor};
          --brand-accent-glow: ${accentColor}1A;
          --brand-accent-button: ${accentColor};
        }
      `}</style>
      
      {/* Prime Screen Router */}
      <div className="flex-1 w-full">
        {currentAppState === 'landing' && (
          <LandingPage onNavigate={setCurrentAppState} />
        )}

        {(currentAppState === 'owner_login' || currentAppState === 'owner_signup') && (
          <LoginSignup 
            currentView={currentAppState} 
            onNavigate={setCurrentAppState} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {(currentAppState === 'client_register' || currentAppState === 'client_login') && (
          <ClientAuth 
            onBack={() => setCurrentAppState('landing')}
          />
        )}

        {(currentAppState === 'setup_step1' || currentAppState === 'setup_step2' || currentAppState === 'setup_step3') && (
          <RestaurantSetupWizard
            currentStep={currentAppState as any}
            ownerName={ownerUser?.name || 'Jacques Kagabo'}
            ownerEmail={ownerUser?.email || 'jacqueskagabo1@gmail.com'}
            onNavigate={setCurrentAppState}
            onAddCustomProduct={handleAddCustomProduct}
          />
        )}

        {currentAppState === 'dashboard' && (
          <AdminDashboard />
        )}

        {/* Dynamic client ordering screens */}
        {(currentAppState === 'client_home' || 
          currentAppState === 'client_menu' || 
          currentAppState === 'client_tables' || 
          currentAppState === 'client_payment' || 
          currentAppState === 'client_orders') && (
          <ClientApp />
        )}
      </div>

    </div>
  );
}
