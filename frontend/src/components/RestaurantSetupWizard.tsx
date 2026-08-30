import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Plus, Eye, CheckSquare, Upload, ArrowRight, UserPlus, FileText,
  Heart, ThumbsUp, MapPin, RotateCcw, Sparkles, Palette, Check, Smartphone, Flame, Coffee, Trophy
} from 'lucide-react';
import { AppState } from '../types';
import { useApp } from '../context/AppContext';

interface RestaurantSetupWizardProps {
  currentStep: 'setup_step1' | 'setup_step2' | 'setup_step3';
  ownerName: string;
  ownerEmail: string;
  onNavigate: (state: AppState) => void;
  onAddCustomProduct: (product: { name: string; price: string; category: string; image: string }) => void;
}

// Five beautifully stylized Unsplash branding assets & logos for live rendering
const LOGO_PRESETS = [
  { name: 'Le Gourmet', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&h=150&q=80', tagline: 'FINE MODERN BISTRO' },
  { name: 'Organica', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&h=150&q=80', tagline: 'GREEN GARDEN ESCAPE' },
  { name: 'Sunrise Roast', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=150&h=150&q=80', tagline: 'GOLDEN BREWS & BAKERY' },
  { name: 'Tandoor Spicy', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=150&h=150&q=80', tagline: 'FIERY CLAY SKEWERS' },
  { name: 'Lounge Bar', url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=150&h=150&q=80', tagline: 'ROYAL BREWS & NIGHTS' },
];

// Premium accent colors for interactive brand selectors
const BRAND_COLORS = [
  { color: '#22C55E', name: 'Emerald', glow: 'shadow-[0_0_12px_rgba(34,197,94,0.3)] bg-[#22C55E]' },
  { color: '#EC4899', name: 'Rose', glow: 'shadow-[0_0_12px_rgba(236,72,153,0.3)] bg-[#EC4899]' },
  { color: '#F59E0B', name: 'Amber', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)] bg-[#F59E0B]' },
  { color: '#3B82F6', name: 'Sapphire', glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)] bg-[#3B82F6]' },
  { color: '#8B5CF6', name: 'Amethyst', glow: 'shadow-[0_0_12px_rgba(139,92,246,0.3)] bg-[#8B5CF6]' },
];

export default function RestaurantSetupWizard({
  currentStep,
  ownerName,
  ownerEmail,
  onNavigate,
  onAddCustomProduct,
}: RestaurantSetupWizardProps) {
  const { ownerUser, setOwnerUser, addRestaurant, setActiveRestaurantId } = useApp();

  // Step 1 states
  const [restaurantName, setRestaurantName] = useState(ownerUser?.restaurantName || 'Supa Bites Kigali');
  const [completeName, setCompleteName] = useState(ownerUser?.restaurantCompleteName || 'Supa Bites Kigali Ltd');
  const [restaurantPhone, setRestaurantPhone] = useState(ownerUser?.restaurantPhone || '788000000');
  const [ownerPhone, setOwnerPhone] = useState(ownerUser?.ownerPhone || '788111111');
  const [ownerNameInput, setOwnerNameInput] = useState(ownerUser?.name || ownerName || 'Jacques Kagabo');
  const [ownerEmailInput, setOwnerEmailInput] = useState(ownerUser?.email || ownerEmail || 'jacqueskagabo1@gmail.com');

  // Live Brand Customization states
  const [brandAccentColor, setBrandAccentColor] = useState(ownerUser?.brandAccentColor || '#22C55E');
  const [restaurantLogo, setRestaurantLogo] = useState(ownerUser?.logo || LOGO_PRESETS[0].url);
  const [restaurantDescription, setRestaurantDescription] = useState(ownerUser?.description || 'Authentic local delicacies paired with modern culinary mastery.');
  const [locationName, setLocationName] = useState(ownerUser?.location || 'Nyarugenge, Kigali');
  const [isSyncing, setIsSyncing] = useState(false);

  // Auto brand synchronizer trigger on editing values
  useEffect(() => {
    setIsSyncing(true);
    const timeoutId = setTimeout(() => {
      setOwnerUser({
        ...ownerUser,
        name: ownerNameInput,
        email: ownerEmailInput,
        restaurantName: restaurantName,
        restaurantCompleteName: completeName,
        restaurantPhone,
        ownerPhone,
        logo: restaurantLogo,
        description: restaurantDescription,
        location: locationName,
        brandAccentColor: brandAccentColor,
      });

      // Synchronize back to standard nearby restaurants list
      addRestaurant({
        id: 'rest-active-setup',
        name: restaurantName,
        description: restaurantDescription,
        logo: restaurantLogo,
        rating: 154,
        location: locationName,
        brandAccentColor: brandAccentColor,
      });

      // Highlight this restaurant for client views
      setActiveRestaurantId('rest-active-setup');
      setIsSyncing(false);
    }, 450);

    return () => clearTimeout(timeoutId);
  }, [
    restaurantName, 
    completeName, 
    restaurantPhone, 
    ownerPhone, 
    ownerNameInput, 
    ownerEmailInput, 
    brandAccentColor, 
    restaurantLogo, 
    restaurantDescription, 
    locationName
  ]);

  // Step 2 states
  const [restaurantType, setRestaurantType] = useState('Restaurant');
  const [cuisineType, setCuisineType] = useState('African');
  const [fromTime, setFromTime] = useState('14:00');
  const [toTime, setToTime] = useState('02:00');
  const [imagesUploaded, setImagesUploaded] = useState<string[]>([]);

  // Step 3 states
  const [activeTab, setActiveTab] = useState<'Drink' | 'Starter' | 'Appetizer' | 'Dessert' | 'Main'>('Drink');
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuIngredients, setMenuIngredients] = useState('');
  const [menuImageUrl, setMenuImageUrl] = useState('');

  const currentStepNum = currentStep === 'setup_step1' ? 1 : currentStep === 'setup_step2' ? 2 : 3;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('setup_step2');
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('setup_step3');
  };

  const handleAddMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName || !menuPrice) {
      alert('Please fill at least name and price!');
      return;
    }
    // Add real item to parent storefront state
    onAddCustomProduct({
      name: menuName,
      price: menuPrice.startsWith('$') || menuPrice.toLowerCase().includes('rwf') ? menuPrice : `${menuPrice} RWF`,
      category: activeTab,
      image: menuImageUrl || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=150&q=80',
    });

    // Reset fields & transition
    setMenuName('');
    setMenuPrice('');
    setMenuIngredients('');
    setMenuImageUrl('');
    
    // Jump to dashboard
    onNavigate('dashboard');
  };

  // Helper trigger to skip or jump step in preview mode
  const jumpToStep = (num: number) => {
    if (num === 1) onNavigate('setup_step1');
    else if (num === 2) onNavigate('setup_step2');
    else onNavigate('setup_step3');
  };

  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col font-sans text-white">
      {/* Top Wizard Header bar (Screen 4 Layout) */}
      <header className="w-full bg-[#0C121D] border-b border-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#22C55E]/30 flex items-center justify-center bg-black/40">
            <span className="text-[#22C55E] text-base font-black">S</span>
          </div>
          <span className="font-extrabold tracking-widest text-sm text-white select-none">SUPA MENU</span>
        </div>

        {/* User identification badge at header right */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs text-gray-400 font-bold hidden sm:inline">SETUP PORTAL ACTIVE</span>
          </div>
          
          <div className="flex items-center gap-3 border-l border-gray-800 pl-6">
            <div className="text-right">
              <span className="block text-xs font-bold text-white">{ownerNameInput}</span>
              <span className="block text-[10px] text-gray-500">{ownerEmailInput}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1F2937] border border-gray-700 flex items-center justify-center text-xs font-black text-[#22C55E]">
              JK
            </div>
          </div>
        </div>
      </header>

      {/* Main Wizard Layout */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Steps Roadmap (Screens 4/5/6 left pane) */}
        <section className="md:col-span-4 bg-[#0C121D] border border-gray-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          {/* Subtle decoration lines */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#22C55E] via-emerald-800 to-transparent" />

          <h3 className="text-base font-black text-gray-100 tracking-tight mb-6 mt-1 flex items-center gap-2">
            <span className="text-emerald-500">1.</span> Create your restaurant profile
          </h3>

          <div className="space-y-6 relative">
            
            {/* Step 1 roadmap marker */}
            <div 
              onClick={() => jumpToStep(1)}
              className={`flex gap-4 items-start select-none cursor-pointer group border-l-2 pl-4 py-1 transition-all ${
                currentStepNum === 1 ? 'border-[#22C55E]' : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                currentStepNum === 1
                  ? 'bg-[#22C55E] text-black shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                  : 'bg-[#111827] text-gray-400 border border-gray-800'
              }`}>
                1
              </div>
              <div className="text-left">
                <span className={`block text-xs font-bold ${currentStepNum === 1 ? 'text-[#22C55E]' : 'text-gray-400'}`}>Restaurant Information</span>
                <span className="text-[10px] text-gray-500 mt-1 block leading-relaxed">Restaurant name, address, Details, owner details</span>
              </div>
            </div>

            {/* Step 2 roadmap marker */}
            <div 
              onClick={() => jumpToStep(2)}
              className={`flex gap-4 items-start select-none cursor-pointer group border-l-2 pl-4 py-1 transition-all ${
                currentStepNum === 2 ? 'border-[#22C55E]' : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                currentStepNum === 2
                  ? 'bg-[#22C55E] text-black shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                  : 'bg-[#111827] text-gray-400 border border-gray-800'
              }`}>
                2
              </div>
              <div className="text-left">
                <span className={`block text-xs font-bold ${currentStepNum === 2 ? 'text-[#22C55E]' : 'text-gray-400'}`}>Restaurant Type & Timing</span>
                <span className="text-[10px] text-gray-500 mt-1 block leading-relaxed">Establishment & cuisine type, opening hours</span>
              </div>
            </div>

            {/* Step 3 roadmap marker */}
            <div 
              onClick={() => jumpToStep(3)}
              className={`flex gap-4 items-start select-none cursor-pointer group border-l-2 pl-4 py-1 transition-all ${
                currentStepNum === 3 ? 'border-[#22C55E]' : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                currentStepNum === 3
                  ? 'bg-[#22C55E] text-black shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                  : 'bg-[#111827] text-gray-400 border border-gray-800'
              }`}>
                3
              </div>
              <div className="text-left">
                <span className={`block text-xs font-bold ${currentStepNum === 3 ? 'text-[#22C55E]' : 'text-gray-400'}`}>Create your menu</span>
                <span className="text-[10px] text-gray-500 mt-1 block leading-relaxed">Menu, restaurant, food images</span>
              </div>
            </div>

          </div>

          <div className="border-t border-gray-900 mt-8 pt-4 space-y-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs text-[#22C55E] hover:text-[#1abc50] font-semibold transition-all text-left flex items-center gap-1.5 cursor-pointer"
            >
              <span>Skip Wizard and open Dashboard</span>
              <ArrowRight size={10} />
            </button>
            <button
              onClick={() => onNavigate('landing')}
              className="text-xs text-rose-500 hover:text-rose-450 transition-all text-left flex items-center gap-1.5 cursor-pointer block"
            >
              <span>← Cancel Setup & Back to Home</span>
            </button>
          </div>
        </section>

        {/* Right Column Step Form Card (Screens 4/5/6 forms) */}
        <section className="md:col-span-8 bg-[#0C121D] border border-gray-800/80 rounded-2xl p-6 md:p-8 shadow-xl text-left">
          
          {/* STEP 1 FORM (Screen 4 with Live Branding Simulator) */}
          {currentStep === 'setup_step1' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* BRANDING CONTROL PANEL (Left 7 Columns) */}
              <div className="lg:col-span-7 space-y-6">
                <form onSubmit={handleNextStep1} className="space-y-6">
                  
                  {/* General restaurant name cards */}
                  <div className="bg-[#111827]/40 border border-gray-900 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                      <h4 className="text-xs font-bold text-[#22C55E] tracking-wider uppercase flex items-center gap-1.5">
                        <Sparkles size={14} className="text-[#22C55E] animate-pulse" />
                        Restaurant Information
                      </h4>
                      {isSyncing && (
                        <span className="text-[9px] text-[#22C55E] font-medium animate-pulse">
                          Syncing active draft...
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {/* Restaurant Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                          Display Restaurant Name
                        </label>
                        <input
                          type="text"
                          required
                          value={restaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
                          placeholder="e.g. Supa Bites Kigali"
                          className="w-full bg-[#111827] text-white rounded-lg px-4 py-2.5 text-sm border border-gray-800/80 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      
                      {/* Restaurant Complete Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                          Company Registered Name (Ltd)
                        </label>
                        <input
                          type="text"
                          required
                          value={completeName}
                          onChange={(e) => setCompleteName(e.target.value)}
                          placeholder="e.g. Supa Bites Kigali Ltd"
                          className="w-full bg-[#111827] text-white rounded-lg px-4 py-2.5 text-sm border border-gray-800/80 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      {/* Tagline / Description */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                          Short Description & Tagline
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={restaurantDescription}
                          onChange={(e) => setRestaurantDescription(e.target.value)}
                          placeholder="e.g. Authentic local delicacies paired with modern culinary..."
                          className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 text-xs border border-gray-800/80 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Brand Personalization: Custom Color & Logo Preset selects */}
                  <div className="bg-[#111827]/40 border border-gray-900 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-[#22C55E] tracking-wider uppercase flex items-center gap-1.5 border-b border-gray-900 pb-3">
                      <Palette size={14} /> Brand Identity & Aesthetics
                    </h4>

                    {/* Color selection pills */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        Choose Brand Primary Accent Color
                      </span>
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {BRAND_COLORS.map((c) => {
                          const isColorSelected = brandAccentColor.toLowerCase() === c.color.toLowerCase();
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => setBrandAccentColor(c.color)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${
                                isColorSelected 
                                  ? 'border-white text-white' 
                                  : 'border-transparent text-gray-400 bg-gray-950/40 hover:text-white'
                              }`}
                            >
                              <span className={`w-3.5 h-3.5 rounded-full block border border-white/20 ${c.glow}`} />
                              <span>{c.name}</span>
                              {isColorSelected && <Check size={12} className="text-white ml-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Logo selection presets */}
                    <div className="space-y-2.5 pt-1.5">
                      <div className="flex justify-between items-center">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                          Select Logo Concept Preset
                        </span>
                        <span className="text-[9px] text-[#22C55E] font-medium">Auto-renders live</span>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2">
                        {LOGO_PRESETS.map((preset) => {
                          const isPresetSelected = restaurantLogo === preset.url;
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setRestaurantLogo(preset.url);
                                setRestaurantDescription(preset.name + '! ' + preset.tagline + ' - ' + restaurantDescription.split(' - ').pop());
                              }}
                              className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                                isPresetSelected 
                                  ? 'bg-[#1e293b]/50 border-emerald-500' 
                                  : 'bg-[#111827] border-gray-950 hover:border-gray-800'
                              }`}
                            >
                              <img 
                                src={preset.url} 
                                alt={preset.name} 
                                className="w-10 h-10 rounded-full object-cover border border-gray-800" 
                                referrerPolicy="no-referrer"
                              />
                              <span className="text-[8px] font-medium text-gray-400 text-center truncate w-full mt-1.5">
                                {preset.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Manual text block fallback for custom Logo URL */}
                      <div className="pt-2">
                        <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          - Or enter Custom Logo URL:
                        </label>
                        <input
                          type="text"
                          value={restaurantLogo}
                          onChange={(e) => setRestaurantLogo(e.target.value)}
                          placeholder="Paste image URL here..."
                          className="w-full bg-[#111827] text-white rounded-lg px-3 py-1 w-full text-[11px] border border-gray-800 focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rest owner contact info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-[10px] font-bold text-[#22C55E] tracking-wider mb-2 uppercase">Restaurant Call Line</h4>
                      <div className="flex items-center bg-[#111827] rounded-lg border border-gray-800/80 px-3 py-1.5">
                        <span className="text-[#22C55E] text-xs font-bold tracking-wide mr-2">+250</span>
                        <div className="w-[1px] h-4 bg-gray-800 mr-2" />
                        <input
                          type="tel"
                          required
                          value={restaurantPhone}
                          onChange={(e) => setRestaurantPhone(e.target.value)}
                          placeholder="788 000 000"
                          className="bg-transparent text-white w-full text-xs focus:outline-none placeholder-gray-600"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-[#22C55E] tracking-wider mb-2 uppercase">Physical Location Area</h4>
                      <div className="flex items-center bg-[#111827] rounded-lg border border-gray-800/80 px-3 py-1.5">
                        <MapPin size={13} className="text-[#22C55E] mr-2 shrink-0" />
                        <input
                          type="text"
                          required
                          value={locationName}
                          onChange={(e) => setLocationName(e.target.value)}
                          placeholder="e.g. Nyarugenge, Kigali"
                          className="bg-transparent text-white w-full text-xs focus:outline-none placeholder-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-[#22C55E] tracking-wide mb-2 uppercase">Registered Proprietor Details</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={ownerNameInput}
                        onChange={(e) => setOwnerNameInput(e.target.value)}
                        placeholder="Owner full name"
                        className="w-full bg-[#111827] text-white rounded-lg px-3 py-2 text-xs border border-gray-800/80 focus:outline-none focus:border-[#22C55E]"
                      />
                      <input
                        type="email"
                        required
                        value={ownerEmailInput}
                        onChange={(e) => setOwnerEmailInput(e.target.value)}
                        placeholder="Owner Registered Email"
                        className="w-full bg-[#111827] text-white rounded-lg px-3 py-2 text-xs border border-gray-800/80 focus:outline-none focus:border-[#22C55E]"
                      />
                    </div>
                  </div>

                  {/* Proceed step */}
                  <div className="pt-4 flex justify-between items-center">
                    <p className="text-[10px] text-gray-500 italic max-w-xs">
                      * All choices are saved instantly. Your brand is synced live to client nearby search terminals!
                    </p>
                    <button
                      type="submit"
                      className="bg-[#22C55E] hover:bg-[#1EAB52] text-black font-extrabold px-8 py-3 rounded-lg text-xs tracking-wider uppercase transition-all flex items-center gap-1 hover:-translate-y-0.5"
                    >
                      <span>Next Page (Timing)</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </form>
              </div>

              {/* HIGH-FIDELITY LIVE SMARTPHONE SIMULATOR (Right 5 Columns) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                
                {/* Visual smartphone wrapper */}
                <div className="w-[280px] h-[540px] rounded-[38px] bg-black border-[10px] border-zinc-800 relative shadow-2xl flex flex-col overflow-hidden text-left ring-2 ring-emerald-500/10 hover:ring-emerald-500/30 transition-all duration-300">
                  
                  {/* Dynamic device color accent shadow beam */}
                  <div 
                    className="absolute inset-x-0 top-0 h-64 opacity-25 filter blur-[35px] pointer-events-none transition-colors duration-1000"
                    style={{ backgroundColor: brandAccentColor }} 
                  />

                  {/* Top Notch of Smartphone */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-zinc-800 rounded-b-xl z-50 flex items-center justify-around px-2 text-[8px] text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                    <div className="w-8 h-1 bg-zinc-950 rounded-full" />
                  </div>

                  {/* Internal Status Bar indicators */}
                  <div className="px-5 pt-5 pb-2 flex justify-between items-center text-[9px] text-gray-400 font-mono z-40 bg-zinc-950/80">
                    <span>17:21</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[7px]">5G</span>
                      <div className="w-2.5 h-1.5 bg-gray-500 rounded-sm relative">
                        <div className="absolute top-0.5 -right-0.5 w-0.5 h-0.5 bg-gray-500 rounded-r-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Core Smartphone screen viewer body */}
                  <div className="flex-1 overflow-y-auto bg-[#07090D] p-3 text-white flex flex-col space-y-4 font-sans select-none scrollbar-none relative pb-6">
                    
                    {/* Header banner brand logo mock */}
                    <div className="flex items-center justify-between py-1 bg-zinc-950/40 p-2.5 rounded-xl border border-gray-900">
                      <div className="flex items-center gap-1.5">
                        <img 
                          src={restaurantLogo} 
                          alt="logo mock" 
                          className="w-5.5 h-5.5 rounded-full object-cover inline-block border border-gray-800"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] font-extrabold uppercase tracking-wide truncate max-w-[110px]" style={{ color: brandAccentColor }}>
                          {restaurantName}
                        </span>
                      </div>
                      <div className="w-3 h-3 rounded-full flex items-center justify-center text-[7px]" style={{ backgroundColor: brandAccentColor + '20', color: brandAccentColor }}>
                        ♥
                      </div>
                    </div>

                    {/* MOCK CLIENT COMPONENT 1: Nearby Discovery Card */}
                    <div className="space-y-1">
                      <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block px-1">
                        1. Nearby discovery view list
                      </span>
                      
                      <div className="bg-[#0C111C]/90 border border-gray-900 rounded-[18px] overflow-hidden p-2 flex gap-2.5 shadow-sm">
                        <div className="w-16 h-16 rounded-[12px] overflow-hidden shrink-0 border border-gray-900 relative">
                          <img src={restaurantLogo} alt="pic" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute bottom-1 left-1 bg-black/80 px-1 py-0.5 rounded-[4px] text-[6px] font-bold text-gray-300">
                            ★ 4.9
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <h5 className="text-[10.5px] font-black text-white truncate leading-snug">{restaurantName}</h5>
                            <p className="text-[8.5px] text-gray-500 truncate line-clamp-1 mt-0.5">{locationName}</p>
                            <p className="text-[7.5px] text-gray-400 line-clamp-1 leading-normal mt-0.5">{restaurantDescription}</p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-1 mt-1 border-t border-gray-900">
                            <span className="text-[7.5px] text-gray-500 font-medium">9.1 km nearby</span>
                            <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#22C55E]" style={{ color: brandAccentColor }}>
                              Open
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MOCK CLIENT COMPONENT 2: Single Restaurant Menu Header */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block px-1">
                        2. Restaurant menu portal header
                      </span>

                      <div className="bg-[#0C111C]/90 border border-gray-950 rounded-[20px] overflow-hidden relative shadow-lg">
                        
                        {/* Immersive backdrop header preview banner */}
                        <div className="h-16 w-full relative overflow-hidden bg-gray-900">
                          <img src={restaurantLogo} alt="header bg" className="w-full h-full object-cover blur-xs opacity-60" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0C111C] to-black/30" />
                          
                          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/75 px-1.5 py-0.5 rounded-full text-[6px] text-gray-300">
                            <span>← Menu</span>
                          </div>
                        </div>

                        {/* Branding content layer */}
                        <div className="px-3.5 pb-3.5 -mt-6 relative z-10">
                          {/* Round floating brand icon */}
                          <div className="w-12 h-12 rounded-full border-2 border-zinc-950 overflow-hidden shadow-lg bg-zinc-900 mb-2">
                            <img src={restaurantLogo} alt="floating logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>

                          <span className="text-[7px] font-black tracking-widest uppercase block mb-0.5" style={{ color: brandAccentColor }}>
                            {cuisineType.toUpperCase() || 'AFRICAN'} • SMART KITCHEN
                          </span>
                          <h4 className="text-xs font-black text-white">{restaurantName}</h4>
                          <p className="text-[8px] text-gray-400 font-light mt-1 pl-0.5 line-clamp-2 leading-relaxed">
                            {restaurantDescription}
                          </p>

                          <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2 border-t border-gray-950/70 text-center">
                            <div className="bg-zinc-950/60 p-1 rounded-md">
                              <span className="block text-[6px] text-gray-500 uppercase">Opening</span>
                              <span className="text-[8px] font-extrabold text-gray-300">{fromTime}</span>
                            </div>
                            <div className="bg-zinc-950/60 p-1 rounded-md">
                              <span className="block text-[6px] text-gray-500 uppercase">Closes</span>
                              <span className="text-[8px] font-extrabold text-gray-300">{toTime}</span>
                            </div>
                            <div className="bg-zinc-950/60 p-1 rounded-md">
                              <span className="block text-[6px] text-gray-500 uppercase">Status</span>
                              <span className="text-[8px] font-extrabold text-emerald-500" style={{ color: brandAccentColor }}>ACTIVE</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MOCK CLIENT COMPONENT 3: Tableside Smart Checkout button mock */}
                    <div className="bg-zinc-950/80 border border-gray-900 rounded-2xl p-2 md:p-3 text-center space-y-1.5 pt-2">
                      <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block">
                        3. Ordering and call service style
                      </span>
                      
                      <div className="flex gap-2">
                        <button 
                          className="flex-1 py-1 px-2 text-[8px] rounded-lg text-black font-extrabold uppercase tracking-wide hover:opacity-90 active:scale-95 transition-all text-center"
                          style={{ backgroundColor: brandAccentColor }}
                        >
                          Checkout - MoMo
                        </button>
                        <button 
                          className="px-2.5 py-1 text-[8.5px] rounded-lg font-bold border"
                          style={{ borderColor: brandAccentColor + '40', color: brandAccentColor }}
                        >
                          Call Waiter
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Simulated Smartphone Home indicator bar */}
                  <div className="h-6.5 bg-zinc-950 flex items-center justify-center z-50">
                    <div className="w-16 h-1 bg-gray-500 rounded-full" />
                  </div>
                </div>

                <div className="mt-4 text-center px-4">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-[#22C55E] px-3 py-1 rounded-full text-[10px] font-semibold">
                    <Smartphone size={12} className="text-[#22C55E]" />
                    Real-time Phone Simulator Active
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 leading-relaxed max-w-[240px]">
                    Edits made to name, description, colors and logos immediately sync and propagate through our nearby client systems.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* STEP 2 FORM (Screen 5) */}
          {currentStep === 'setup_step2' && (
            <form onSubmit={handleNextStep2} className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-[#22C55E] tracking-wider mb-4 uppercase">
                  Restaurant Type (Restaurant, Pub, Hotel, Coffeeshop, other)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Restaurant Type dropdown */}
                  <div className="relative">
                    <select
                      value={restaurantType}
                      onChange={(e) => setRestaurantType(e.target.value)}
                      className="w-full bg-[#111827] text-white rounded-lg px-4 py-2.5 text-sm border border-gray-800/80 focus:outline-none focus:border-[#22C55E] appearance-none"
                    >
                      <option value="Restaurant">Restaurant</option>
                      <option value="Pub">Pub</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Coffeeshop">Coffeeshop</option>
                      <option value="other">Other</option>
                    </select>
                    {/* custom arrow indicator */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                  </div>

                  {/* Select Cuisine layout */}
                  <div className="relative">
                    <select
                      value={cuisineType}
                      onChange={(e) => setCuisineType(e.target.value)}
                      className="w-full bg-[#111827] text-white rounded-lg px-4 py-2.5 text-sm border border-gray-800/80 focus:outline-none focus:border-[#22C55E] appearance-none"
                    >
                      <option value="African">African</option>
                      <option value="Continental">Continental</option>
                      <option value="Italian">Italian</option>
                      <option value="Asian">Asian</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#22C55E] tracking-wider mb-4 uppercase">Opening Hours</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center bg-[#111827] rounded-lg border border-gray-800/80 px-4 py-2.5">
                    <span className="text-gray-500 text-xs mr-3">From</span>
                    <input
                      type="text"
                      required
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      className="bg-transparent text-white w-full text-sm focus:outline-none text-center font-bold"
                    />
                  </div>
                  
                  <div className="flex items-center bg-[#111827] rounded-lg border border-gray-800/80 px-4 py-2.5">
                    <span className="text-gray-500 text-xs mr-3">To</span>
                    <input
                      type="text"
                      required
                      value={toTime}
                      onChange={(e) => setToTime(e.target.value)}
                      className="bg-transparent text-white w-full text-sm focus:outline-none text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#22C55E] tracking-wider mb-4 uppercase">Upload Images &amp; Logos</h4>
                <div className="border border-dashed border-gray-800 hover:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center bg-[#111827]/40 text-center cursor-pointer transition-all">
                  <Upload className="text-gray-500 mb-3" size={24} />
                  <span className="text-xs font-bold text-gray-300">Choose Images</span>
                  <span className="text-[10px] text-gray-500 mt-1">JPEG, PNG formats up to 5MB</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('setup_step1')}
                  className="border border-gray-800 text-gray-400 font-extrabold px-6 py-3 rounded-lg text-xs uppercase"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-[#22C55E] hover:bg-[#1EAB52] text-black font-extrabold px-8 py-3 rounded-lg text-xs tracking-wider uppercase transition-all flex items-center gap-1 hover:-translate-y-0.5"
                >
                  <span>Continue</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 FORM (Screen 6) */}
          {currentStep === 'setup_step3' && (
            <form onSubmit={handleAddMenuSubmit} className="space-y-6">
              {/* Category tabs horizontal (Screen 6 tab styling) */}
              <div className="flex flex-wrap items-center gap-2 pb-4">
                {(['Drink', 'Starter', 'Appetizer', 'Dessert', 'Main'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 rounded-lg text-xs font-black tracking-wide transition-all ${
                      activeTab === tab
                        ? 'bg-[#1D5E3A] text-white shadow-lg'
                        : 'bg-[#1F2937]/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-5">
                {/* Underline input fields like Screen 6 */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Name</label>
                  <input
                    type="text"
                    required
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    placeholder="Menu Name"
                    className="w-full bg-transparent text-white border-b border-gray-800 focus:border-[#22C55E] pb-2 text-sm focus:outline-none placeholder-gray-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Price</label>
                  <input
                    type="text"
                    required
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(e.target.value)}
                    placeholder="RWF"
                    className="w-full bg-transparent text-white border-b border-gray-800 focus:border-[#22C55E] pb-2 text-sm focus:outline-none placeholder-gray-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Menu Description</label>
                  <input
                    type="text"
                    required
                    value={menuIngredients}
                    onChange={(e) => setMenuIngredients(e.target.value)}
                    placeholder="Ingredients"
                    className="w-full bg-transparent text-white border-b border-gray-800 focus:border-[#22C55E] pb-2 text-sm focus:outline-none placeholder-gray-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Image URL</label>
                  <input
                    type="text"
                    value={menuImageUrl}
                    onChange={(e) => setMenuImageUrl(e.target.value)}
                    placeholder="Upload Image / Enter image URL"
                    className="w-full bg-transparent text-white border-b border-gray-800 focus:border-[#22C55E] pb-2 text-sm focus:outline-none placeholder-gray-600 font-bold"
                  />
                </div>
              </div>

              {/* Step 3 buttons: Add Clients/Add menu and plus button exactly like Screen 6 */}
              <div className="pt-6 flex justify-between items-center bg-[#070A0F] p-4 rounded-xl border border-gray-900 mt-6">
                <button
                  type="submit"
                  className="bg-transparent border border-emerald-500/50 hover:bg-emerald-500/10 text-[#22C55E] py-2 px-6 rounded-lg text-xs font-black transition-all"
                >
                  Add Clients
                </button>

                <button
                  type="submit"
                  className="w-12 h-12 rounded-xl bg-[#22C55E] hover:bg-[#1fbc59] text-black font-black flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                >
                  <Plus size={24} />
                </button>
              </div>
            </form>
          )}

        </section>
      </main>
    </div>
  );
}
