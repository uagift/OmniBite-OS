import React, { useState } from 'react';
import { User, Lock, Mail, ChevronRight, CheckSquare, Eye, EyeOff, Shield } from 'lucide-react';
import { AppState } from '../types';
import { useApp } from '../context/AppContext';

interface LoginSignupProps {
  currentView: 'owner_login' | 'owner_signup' | 'client_register';
  onNavigate: (state: AppState) => void;
  onLoginSuccess: (ownerName: string, ownerEmail: string) => void;
}

export default function LoginSignup({ currentView, onNavigate, onLoginSuccess }: LoginSignupProps) {
  const { companyName, companyLogo } = useApp();

  // Login States
  const [loginEmail, setLoginEmail] = useState('jacqueskagabo1@gmail.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Signup States
  const [firstName, setFirstName] = useState('Jacques');
  const [lastName, setLastName] = useState('Kagabo');
  const [signupEmail, setSignupEmail] = useState('jacqueskagabo1@gmail.com');
  const [signupPassword, setSignupPassword] = useState('password123');
  const [signupRePassword, setSignupRePassword] = useState('password123');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupRePassword, setShowSignupRePassword] = useState(false);

  // Client Register States
  const [clientFirstName, setClientFirstName] = useState('');
  const [clientLastName, setClientLastName] = useState('');
  const [clientEmailPhone, setClientEmailPhone] = useState('');
  const [clientBankAccount, setClientBankAccount] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [clientConfirmPassword, setClientConfirmPassword] = useState('');
  const [clientRemember, setClientRemember] = useState(true);
  const [clientAgree, setClientAgree] = useState(true);
  const [showClientPassword, setShowClientPassword] = useState(false);
  const [showClientConfirmPassword, setShowClientConfirmPassword] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');

  // Common Handler
  const handleOwnerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const registeredEmail = localStorage.getItem('supa_owner_reg_email') || 'jacqueskagabo1@gmail.com';
    const registeredPassword = localStorage.getItem('supa_owner_reg_password') || 'password123';

    if (loginEmail === registeredEmail && loginPassword === registeredPassword) {
      setErrorMessage('');
      onLoginSuccess(firstName || 'Jacques KAGABO', loginEmail);
      onNavigate('dashboard');
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  const handleOwnerSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupRePassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    // Register credentials
    localStorage.setItem('supa_owner_reg_email', signupEmail);
    localStorage.setItem('supa_owner_reg_password', signupPassword);
    
    setErrorMessage('');
    onLoginSuccess(`${firstName} ${lastName}`, signupEmail);
    onNavigate('dashboard');
  };

  const handleClientRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Client success, goes straight to dashboard inside Client context if mock
    onLoginSuccess(`${clientFirstName || 'Guest'} ${clientLastName || 'Client'}`, clientEmailPhone || 'client@gmail.com');
    onNavigate('dashboard');
  };

  if (currentView === 'client_register') {
    // Screen 7: Client Register with POS image
    return (
      <div className="min-h-screen bg-[#07090D] flex items-center justify-center p-4 sm:p-6 md:p-12 font-sans">
        <div className="w-full max-w-5xl rounded-[24px] overflow-hidden bg-[#0C121D] border border-gray-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.6)] grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
          
          {/* Left Column POS Graphical representation */}
          <div className="md:col-span-5 relative bg-[#1E293B] min-h-[300px] md:min-h-full overflow-hidden select-none">
            <img 
              className="absolute inset-0 w-full h-full object-cover brightness-[0.75]" 
              src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=600&q=80" 
              alt="Restaurant POS Terminal" 
              referrerPolicy="no-referrer"
            />
            {/* Soft Green Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-transparent to-[#22C55E]/10" />
            
            {/* Corner floating branding info */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md bg-black/40 border border-white/5 text-left">
              <span className="text-[10px] text-[#22C55E] tracking-widest uppercase font-black">Supa Retail POS</span>
              <p className="text-white text-xs font-bold mt-1">Smart transactions & integrated client accounts built for high-scale restaurants.</p>
            </div>
          </div>

          {/* Right Column Form */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center text-left">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="text-xs text-gray-500 hover:text-white flex items-center gap-1.5 mb-6 self-start transition-colors cursor-pointer"
            >
              ← Back to Home
            </button>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 id="client-reg-title" className="text-2xl sm:text-3xl font-black text-white tracking-tight">Enter New Client</h2>
                <p className="text-xs text-[#9CA3AF] mt-1">For business, band or celebrity.</p>
              </div>
              
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#22C55E]/50 flex items-center justify-center bg-black/40">
                  <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-xs font-bold text-white tracking-widest uppercase">{companyName}</span>
              </div>
            </div>

            <form onSubmit={handleClientRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">First name</label>
                  <input
                    type="text"
                    required
                    value={clientFirstName}
                    onChange={(e) => setClientFirstName(e.target.value)}
                    placeholder="e.g. Jacques"
                    className="w-full bg-[#111827] text-white rounded-lg px-4 py-2.5 text-sm border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 focus:ring-1 focus:ring-[#22C55E]/30"
                  />
                </div>
                {/* Last Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Last name</label>
                  <input
                    type="text"
                    required
                    value={clientLastName}
                    onChange={(e) => setClientLastName(e.target.value)}
                    placeholder="e.g. Kagabo"
                    className="w-full bg-[#111827] text-white rounded-lg px-4 py-2.5 text-sm border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 focus:ring-1 focus:ring-[#22C55E]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email or Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email or phone number</label>
                  <input
                    type="text"
                    required
                    value={clientEmailPhone}
                    onChange={(e) => setClientEmailPhone(e.target.value)}
                    placeholder="e.g. jacques@gmail.com"
                    className="w-full bg-[#111827] text-white rounded-lg px-4 py-2.5 text-sm border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 focus:ring-1 focus:ring-[#22C55E]/30"
                  />
                </div>
                {/* Bank account number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Bank account Number</label>
                  <input
                    type="text"
                    required
                    value={clientBankAccount}
                    onChange={(e) => setClientBankAccount(e.target.value)}
                    placeholder="e.g. 100029302910"
                    className="w-full bg-[#111827] text-white rounded-lg px-4 py-2.5 text-sm border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 focus:ring-1 focus:ring-[#22C55E]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showClientPassword ? "text" : "password"}
                      required
                      value={clientPassword}
                      onChange={(e) => setClientPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#111827] text-white rounded-lg pl-4 pr-10 py-2.5 text-sm border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 focus:ring-1 focus:ring-[#22C55E]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowClientPassword(!showClientPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
                    >
                      {showClientPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showClientConfirmPassword ? "text" : "password"}
                      required
                      value={clientConfirmPassword}
                      onChange={(e) => setClientConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#111827] text-white rounded-lg pl-4 pr-10 py-2.5 text-sm border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 focus:ring-1 focus:ring-[#22C55E]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowClientConfirmPassword(!showClientConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
                    >
                      {showClientConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end text-xs mb-1">
                <a href="#reset" className="text-sky-400 hover:underline">Forgot password?</a>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2 mt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-400 select-none">
                  <input
                    type="checkbox"
                    checked={clientRemember}
                    onChange={(e) => setClientRemember(e.target.checked)}
                    className="mt-0.5 rounded border-gray-800 text-[#22C55E] focus:ring-1 focus:ring-[#22C55E]"
                  />
                  <span>Remember me</span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-400 select-none">
                  <input
                    type="checkbox"
                    required
                    checked={clientAgree}
                    onChange={(e) => setClientAgree(e.target.checked)}
                    className="mt-0.5 rounded border-gray-800 text-[#22C55E] focus:ring-1 focus:ring-[#22C55E]"
                  />
                  <span>
                    I agree to all the <span className="text-sky-400">Terms</span> and <span className="text-sky-400">Privacy policy</span>
                  </span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#22C55E] hover:bg-[#1fbc59] text-black font-extrabold text-sm py-3 rounded-lg transition-all shadow-[0_4px_12px_rgba(34,197,94,0.25)] hover:-translate-y-0.5 cursor-pointer"
                >
                  Create Client
                </button>
                
                {/* Social Login */}
                <button
                  type="button"
                  className="w-full bg-transparent border border-gray-800 hover:bg-gray-800/40 text-gray-300 font-semibold text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  {/* Google SVG Logo */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.2 10.2v3.7h6.2c-.3 1.5-1.7 4.5-6.2 4.5-3.9 0-7-3.2-7-7.2s3.1-7.2 7-7.2c2.2 0 3.7.9 4.5 1.7L19.4 3C17.6 1.3 15.1.3 12.2.3 5.4.3.0 5.7.0 12.3S5.4 24.3 12.2 24.3c7.1 0 11.8-5 11.8-12 0-.8-.1-1.4-.2-2.1H12.2z" />
                  </svg>
                  Sign-in client with google
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-900 pt-6 mt-6 gap-4">
              <span className="text-[11px] text-[#9CA3AF]">
                Already have an account? <span onClick={() => onNavigate('owner_login')} className="text-[#22C55E] font-bold cursor-pointer hover:underline">Sign In</span>
              </span>
              
              {/* App badges */}
              <div className="flex items-center gap-3">
                <a href="#play" className="bg-black hover:bg-black/80 px-2.5 py-1 rounded-md border border-gray-800 flex items-center gap-2 select-none">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,5.277L16.27,12L3,18.723V5.277 M1.5,2.463v19.074c0,0.51,0.41,0.92,0.92,0.92c0.23,0,0.45-0.09,0.62-0.24l13.91-9.96 c0.36-0.26,0.44-0.77,0.18-1.13c-0.05-0.07-0.11-0.12-0.18-0.17L3.04,1.153c-0.45-0.32-1.07-0.21-1.39,0.24 C1.55,1.573,1.5,1.813,1.5,2.463z" />
                  </svg>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[7px] text-gray-400 uppercase">GET IT ON</span>
                    <span className="text-[10px] font-bold text-white">Google Play</span>
                  </div>
                </a>

                <a href="#store" className="bg-black hover:bg-black/80 px-2.5 py-1 rounded-md border border-gray-800 flex items-center gap-2 select-none">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71,19.5C17.88,20.74,17,21.95,15.66,21.97C14.32,22,13.88,21.18,12.37,21.18c-1.5,0-2,.8-3.29.83c-1.35.03-2.33-1.3-3.17-2.5C4.2,17,2.83,12.18,4.56,9.15c.86-1.5,2.4-2.45,4.07-2.48c1.27-.03,2.47.85,3.25.85s2.2-.1,3.75.05c1.45.06,2.77.58,3.63,1.35c-1.2,1-1.95,2.4-1.95,3.9c0,1.8,1.1,3.4,2.9,4.2c-.3,1-1,2.5-1.5,3.5 M15.97,4.17c.8-1,1.3-2.4,1.3-3.8c-1.2.05-2.7.8-3.5,1.8c-.7.8-1.3,2.2-1.3,3.6c1.35.1,2.7-.6,3.5-1.6" />
                  </svg>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[7px] text-gray-400 uppercase font-light">Download on the</span>
                    <span className="text-[10px] font-bold text-white">App Store</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Dual Pane for Owner Login (Screen 2) & Owner Signup (Screen 3)
  const isLoginMode = currentView === 'owner_login';

  return (
    <div className="min-h-screen bg-[#07090D] flex items-center justify-center p-4 sm:p-6 md:p-12 font-sans relative overflow-hidden">
      
      {/* Background graphic nodes */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-[#22C55E]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#22C55E]/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-4xl rounded-[32px] overflow-hidden bg-[#0C111C] border border-gray-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.65)] grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
        
        {/* Left Green Pane with Custom Capsule Sliders */}
        <div className="relative bg-[#22C55E] p-8 md:p-12 flex flex-col justify-between text-left select-none overflow-hidden min-h-[200px] md:min-h-full">
          {/* Geometrical Chevron Shape */}
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-emerald-200/20 via-transparent to-transparent rotate-12 pointer-events-none" />
          
          <div className="z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-black/20 flex items-center justify-center bg-black/10">
                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover animate-pulse" referrerPolicy="no-referrer" />
              </div>
              <span className="text-black font-extrabold tracking-widest text-xs uppercase">{companyName}</span>
            </div>
            
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="bg-black/10 hover:bg-black/20 text-black border border-black/15 font-extrabold text-[10px] px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-all cursor-pointer"
            >
              ← Back to Home
            </button>
          </div>

          {/* Interactive Notch Tab Box representing Split menu in screenshot */}
          <div className="z-10 relative flex flex-col items-start gap-4">
            
            {isLoginMode ? (
              <div className="flex flex-col items-start gap-3">
                {/* Active Capsule button */}
                <button
                  onClick={() => onNavigate('owner_login')}
                  className="bg-black text-white text-xs font-black px-6 py-2.5 rounded-full shadow-lg block select-none"
                >
                  LOGIN
                </button>
                {/* Non active line */}
                <button
                  onClick={() => onNavigate('owner_signup')}
                  className="text-black/60 hover:text-black hover:font-bold text-xs uppercase tracking-widest pl-4 transition-all"
                >
                  SIGN UP
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3">
                {/* Non active line */}
                <button
                  onClick={() => onNavigate('owner_login')}
                  className="text-black/60 hover:text-black hover:font-bold text-xs uppercase tracking-widest pl-4 transition-all"
                >
                  LOGIN
                </button>
                {/* Active Capsule button */}
                <button
                  onClick={() => onNavigate('owner_signup')}
                  className="bg-black text-white text-xs font-black px-6 py-2.5 rounded-full shadow-lg block select-none"
                >
                  SIGN UP
                </button>
              </div>
            )}
            
            <p className="text-black font-extrabold text-2xl tracking-tight leading-tight mt-6 max-w-[200px]">
              Ready to take your food business online?
            </p>
          </div>

          <div className="z-10 text-[10px] text-black/50 font-black tracking-widest uppercase">
            CO. 2026 {companyName} INC.
          </div>
        </div>

        {/* Right Pane (Form Controls) */}
        <div className="bg-[#08090C] p-8 md:p-12 flex flex-col justify-center text-left">
          
          {/* Mode 1: Login */}
          {isLoginMode ? (
            <div className="w-full">
              {/* User badge with green halo */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#22C55E]/15 border-2 border-[#22C55E]/40 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <User className="text-[#22C55E]" size={28} />
                </div>
              </div>

              <h2 className="text-xl font-bold text-center text-white tracking-widest uppercase mb-8">LOGIN</h2>

              <form onSubmit={handleOwnerLoginSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 mb-4 animate-pulse">
                    <span className="shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-black font-extrabold text-[10px]">!</span>
                    <span>{errorMessage}</span>
                  </div>
                )}
                {/* Email address field */}
                <div className="border-b border-gray-800 pb-2 flex items-center gap-3 focus-within:border-[#22C55E] transition-all">
                  <Mail className="text-gray-500" size={18} />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Email"
                    className="bg-transparent text-white w-full text-sm focus:outline-none placeholder-gray-600 font-medium"
                  />
                </div>

                {/* Password field */}
                <div className="border-b border-gray-800 pb-2 flex items-center gap-3 focus-within:border-[#22C55E] transition-all relative">
                  <Lock className="text-gray-500" size={18} />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    className="bg-transparent text-white w-full pr-8 text-sm focus:outline-none placeholder-gray-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <a href="#forgot" className="text-gray-500 hover:text-white">Forgot password?</a>
                  <button
                    type="submit"
                    className="bg-[#10705E] hover:bg-emerald-600 text-white font-extrabold px-6 py-2 rounded-full shadow-[0_4px_10px_rgba(22,163,74,0.3)] transition-all flex items-center gap-1 hover:-translate-y-0.5"
                  >
                    Login
                  </button>
                </div>
              </form>

              {/* Bottom footer text */}
              <div className="text-center mt-8 text-xs text-gray-400">
                Don't have an account?{' '}
                <span onClick={() => onNavigate('owner_signup')} className="text-sky-400 font-extrabold cursor-pointer hover:underline">
                  Sign Up
                </span>
              </div>
            </div>
          ) : (
            
            /* Mode 2: Sign-up */
            <div className="w-full">
              <h2 className="text-3xl font-black text-white mb-6">Sign Up</h2>

              <form onSubmit={handleOwnerSignupSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 mb-4 animate-pulse">
                    <span className="shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-black font-extrabold text-[10px]">!</span>
                    <span>{errorMessage}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Jacques"
                      className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 text-xs border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600"
                    />
                  </div>
                  {/* Last Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Kagabo"
                      className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 text-xs border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2.5 text-xs border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full bg-[#111827] text-white rounded-lg pl-3.5 pr-10 py-2.5 text-xs border border-gray-800/80 focus:outline-none focus:border-[#22C55E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
                    >
                      {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Re-enter password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Re-enter password</label>
                  <div className="relative">
                    <input
                      type={showSignupRePassword ? "text" : "password"}
                      required
                      value={signupRePassword}
                      onChange={(e) => setSignupRePassword(e.target.value)}
                      className="w-full bg-[#111827] text-white rounded-lg pl-3.5 pr-10 py-2.5 text-xs border border-gray-800/80 focus:outline-none focus:border-[#22C55E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupRePassword(!showSignupRePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
                    >
                      {showSignupRePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-400 select-none pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-gray-800 text-[#22C55E] focus:ring-1 focus:ring-[#22C55E]"
                  />
                  <span>
                    I agree to the <span className="text-sky-400 cursor-pointer">Terms of Service</span>
                  </span>
                </label>

                {/* Sign-up Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#22C55E] hover:bg-[#1fbc59] text-black font-extrabold text-xs py-3 rounded-lg transition-all shadow-[0_4px_12px_rgba(34,197,94,0.2)] hover:-translate-y-0.5 cursor-pointer text-center"
                >
                  SIGN UP
                </button>
              </form>

              {/* Already have an account? */}
              <div className="text-center mt-6 text-xs text-gray-400">
                Already have an account?{' '}
                <span onClick={() => onNavigate('owner_login')} className="text-[#22C55E] font-bold cursor-pointer hover:underline">
                  Sign In
                </span>
              </div>
            </div>
          )}

          {/* Social login buttons at the footer of BOTH screens */}
          <div className="border-t border-gray-900 mt-6 pt-6 flex flex-col items-center gap-3">
            <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wide">Or Login with</span>
            <div className="grid grid-cols-2 gap-3 w-full">
              {/* Google Pill button */}
              <button
                type="button"
                className="bg-[#111827] hover:bg-gray-800/80 border border-gray-800 text-xs font-semibold py-2 px-4 rounded-full flex items-center justify-center gap-2 text-gray-300 transition-all"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.2 10.2v3.7h6.2c-.3 1.5-1.7 4.5-6.2 4.5-3.9 0-7-3.2-7-7.2s3.1-7.2 7-7.2c2.2 0 3.7.9 4.5 1.7L19.4 3C17.6 1.3 15.1.3 12.2.3 5.4.3.0 5.7.0 12.3S5.4 24.3 12.2 24.3c7.1 0 11.8-5 11.8-12 0-.8-.1-1.4-.2-2.1H12.2z" />
                </svg>
                Google
              </button>

              {/* Facebook Pill button */}
              <button
                type="button"
                className="bg-[#111827] hover:bg-gray-800/80 border border-gray-800 text-xs font-semibold py-2 px-4 rounded-full flex items-center justify-center gap-2 text-gray-300 transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
