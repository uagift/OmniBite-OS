import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ClientAuthProps {
  onBack: () => void;
}

export default function ClientAuth({ onBack }: ClientAuthProps) {
  const { setClientUser, setCurrentAppState, companyName, companyLogo } = useApp();
  const [isLogin, setIsLogin] = useState(false); // register by default or toggle

  // Register state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !address) {
      setError('Please fill out all fields.');
      return;
    }

    if (!phone.match(/^(\+?250|0)7[8239]\d{7}$/)) {
      // Basic Rwanda mobile validation or standard
      // Accept any valid phone structure, but guide them nicely
    }

    setClientUser({
      name,
      email,
      phone,
      address
    });

    setCurrentAppState('client_home');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password.');
      return;
    }

    // Set a dummy user if logging in
    setClientUser({
      name: 'Guest Client',
      email: loginEmail,
      phone: '+250 788 123 456',
      address: 'Kigali, Kimihurura Sector 12',
    });

    setCurrentAppState('client_home');
  };

  return (
    <div className="min-h-screen bg-[#07090D] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background radial soft light blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-[#22C55E]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#22C55E]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0C111C] border border-gray-800/80 rounded-[32px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.55)] z-10 transition-all">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-6 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Landing</span>
        </button>

        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#22C55E]/40 flex items-center justify-center bg-black/40">
              <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="text-sm font-bold text-white tracking-widest uppercase">{companyName} CLIENT</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isLogin ? 'Welcome Back!' : 'Create Client Account'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isLogin ? 'Login to browse menus and order in seconds' : 'Register to unlock instant local dining table orders'}
          </p>
        </div>

        {error && (
          <div className="mb-4 text-xs font-semibold text-red-400 bg-red-950/20 border border-red-900/40 p-3 rounded-xl">
            {error}
          </div>
        )}

        {isLogin ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#111827] text-white rounded-xl pl-10 pr-4 py-2.5 text-xs border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 focus:ring-1 focus:ring-[#22C55E]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111827] text-white rounded-xl pl-10 pr-4 py-2.5 text-xs border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 focus:ring-1 focus:ring-[#22C55E]/30"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#22C55E] hover:bg-[#1EAB52] text-black font-extrabold text-xs py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(34,197,94,0.2)] hover:-translate-y-0.5 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Login to Account</span>
              <ArrowRight size={14} />
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chantal Uwimbabazi"
                  className="w-full bg-[#111827] text-white rounded-xl pl-10 pr-4 py-2.5 text-xs border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 focus:ring-1 focus:ring-[#22C55E]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chantal@example.com"
                  className="w-full bg-[#111827] text-white rounded-xl pl-10 pr-4 py-2.5 text-xs border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 focus:ring-1 focus:ring-[#22C55E]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">MTN Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0788123456"
                  className="w-full bg-[#111827] text-white rounded-xl pl-10 pr-4 py-2.5 text-xs border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 focus:ring-1 focus:ring-[#22C55E]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Nyarugenge Close, KN 12 Ave"
                  className="w-full bg-[#111827] text-white rounded-xl pl-10 pr-4 py-2.5 text-xs border border-gray-800/80 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 focus:ring-1 focus:ring-[#22C55E]/30"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#22C55E] hover:bg-[#1EAB52] text-black font-extrabold text-xs py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(34,197,94,0.2)] hover:-translate-y-0.5 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Register & Start</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        <div className="text-center mt-6 border-t border-gray-900 pt-5">
          <p className="text-xs text-gray-500">
            {isLogin ? "Don't have an account yet?" : 'Already registered?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#22C55E] font-bold ml-1 hover:underline cursor-pointer focus:outline-none"
            >
              {isLogin ? 'Register New Client' : 'Login Here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
