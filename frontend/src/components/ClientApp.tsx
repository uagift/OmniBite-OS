import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, Utensils, Compass, MapPin, ThumbsUp, Check, Plus, Minus, 
  Calendar, DollarSign, AlertCircle, X, ChevronRight, CreditCard, Sparkles, 
  History, LogOut, ArrowLeft, Smartphone, Loader2
} from 'lucide-react';
import { MenuItem } from '../types';

export default function ClientApp() {
  const {
    restaurants,
    menuItems,
    tables,
    orders,
    cart,
    clientUser,
    activeRestaurantId,
    selectedTableId,
    currentAppState,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartQuantity,
    setClientUser,
    setActiveRestaurantId,
    setSelectedTableId,
    setCurrentAppState,
    placeOrder,
    companyName,
    companyLogo,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('Mains');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // Secure Payment page states
  const [momoPhone, setMomoPhone] = useState<string>(clientUser?.phone || '');
  const [saveMomoPhone, setSaveMomoPhone] = useState<boolean>(true);
  const [paymentStep, setPaymentStep] = useState<
    'step1_entry' | 'step2_waiting' | 'step3a_success' | 'step3b_failed' | 'step3c_timeout'
  >('step1_entry');
  
  // Track payment step in a ref to safely read it in timers without functional updater nested side-effects
  const paymentStepRef = React.useRef(paymentStep);
  React.useEffect(() => {
    paymentStepRef.current = paymentStep;
  }, [paymentStep]);

  const [countdown, setCountdown] = useState<number>(60);
  const [failedReason, setFailedReason] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [placedOrderId, setPlacedOrderId] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Countdown timer for MTN Mobile Money approval prompt (Step 2)
  React.useEffect(() => {
    let intervalId: any;
    if (paymentStep === 'step2_waiting') {
      intervalId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setPaymentStep('step3c_timeout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(60);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentStep]);

  // Handle Log Out
  const handleLogout = () => {
    setClientUser(null);
    setCurrentAppState('landing');
  };

  // Helper: Gets active restaurant details
  const activeRestaurant = restaurants.find((r) => r.id === activeRestaurantId) || restaurants[0];
  const accentColor = activeRestaurant?.brandAccentColor || '#22C55E';

  // Helper: Filter menu items for current restaurant
  const availableItems = menuItems.filter((item) => item.isAvailable);
  const categoriedItems = availableItems.filter((item) => item.category === activeCategory);

  // Helper: Get orders of this client
  const clientOrders = orders.filter(
    (o) => o.clientPhone === (clientUser?.phone || '0780000000') || o.clientName === (clientUser?.name || '')
  );

  // Sorting restaurants by Likes (most liked)
  const sortedRestaurants = [...restaurants].sort((a, b) => b.rating - a.rating);

  // Subtotal Calc
  const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  // Cart action wrapper to open sidebar on add
  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    setIsCartOpen(true);
  };

  // Init checkout - ensure table is selected first!
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    if (!selectedTableId) {
      setCurrentAppState('client_tables');
    } else {
      setPaymentStep('step1_entry');
      setCurrentAppState('client_payment');
    }
  };

  // MTN MoMo submit handler with secure frontend mock simulation
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!momoPhone || momoPhone.trim().length < 8) {
      setValidationError('Please specify a valid MTN Mobile Money phone number.');
      return;
    }

    // Pre-fill / save number back to profile if requested
    if (saveMomoPhone && clientUser) {
      setClientUser({
        ...clientUser,
        phone: momoPhone,
      });
    }

    // Set countdown and transition to WAITING/PENDING screen (Step 2)
    setCountdown(60);
    setPaymentStep('step2_waiting');

    // Simulate direct MTN API callback after 3 seconds:
    // 70% success, 15% failure, 15% timeout
    setTimeout(async () => {
      // If the user cancelled manually, we abort simulation
      if (paymentStepRef.current !== 'step2_waiting') return;

      const rollChance = Math.random() * 100;
      if (rollChance < 70) {
        // 70% chance of success
        const txId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
        setTransactionId(txId);

        // Place order in application state
        const orderId = await placeOrder(momoPhone);
        if (orderId) {
          setPlacedOrderId(orderId);
        }
        setPaymentStep('step3a_success');
      } else if (rollChance < 85) {
        // 15% failure
        const failReasons = [
          'You cancelled the payment',
          'Insufficient balance',
          'Request timed out',
        ];
        const chosenReason = failReasons[Math.floor(Math.random() * failReasons.length)];
        setFailedReason(chosenReason);
        setPaymentStep('step3b_failed');
      } else {
        // 15% timeout
        setPaymentStep('step3c_timeout');
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#07090D] text-white flex flex-col font-sans relative pb-24">
      
      {/* Dynamic CSS Overrides for Active Theme Customization */}
      <style>{`
        .text-\\[\\#22C55E\\] { color: ${accentColor} !important; }
        .bg-\\[\\#22C55E\\] { background-color: ${accentColor} !important; }
        .border-\\[\\#22C55E\\] { border-color: ${accentColor} !important; }
        .shadow-\\[\\#22C55E\\]\\/10 { --tw-shadow-color: ${accentColor}1A !important; }
        .shadow-\\[0_4px_12px_rgba\\(34\\,197\\,94\\,0\\.25\\)\\] { box-shadow: 0 4px 12px ${accentColor}40 !important; }
        .shadow-\\[0_5px_15px_rgba\\(34\\,197\\,94\\,0\\.3\\)\\] { box-shadow: 0 5px 15px ${accentColor}4D !important; }
        .shadow-\\[0_0_8px_rgba\\(34\\,197\\,94\\,0\\.4\\)\\] { box-shadow: 0 0 8px ${accentColor}66 !important; }
        .hover\\:border-\\[\\#22C55E\\]\\/30:hover { border-color: ${accentColor}4D !important; }
        .hover\\:border-\\[\\#22C55E\\]\\/40:hover { border-color: ${accentColor}66 !important; }
        .bg-\\[\\#22C55E\\]\\/10 { background-color: ${accentColor}1A !important; }
        .bg-\\[\\#22C55E\\]\\/15 { background-color: ${accentColor}26 !important; }
        .bg-\\[\\#22C55E\\]\\/20 { background-color: ${accentColor}33 !important; }
        .bg-\\[\\#22C55E\\]\\/5 { background-color: ${accentColor}0D !important; }
        .border-\\[\\#22C55E\\]\\/20 { border-color: ${accentColor}33 !important; }
        .border-\\[\\#22C55E\\]\\/30 { border-color: ${accentColor}4D !important; }
        .border-\\[\\#22C55E\\]\\/50 { border-color: ${accentColor}80 !important; }
        .text-\\[\\#22C55E\\]\\/20 { color: ${accentColor}33 !important; }
        .hover\\:bg-\\[\\#22C55E\\]:hover { background-color: ${accentColor} !important; }
        .hover\\:text-\\[\\#22C55E\\]:hover { color: ${accentColor} !important; }
        .group:hover .group-hover\\:text-\\[\\#22C55E\\] { color: ${accentColor} !important; }
        .focus\\:border-\\[\\#22C55E\\]:focus { border-color: ${accentColor} !important; }
        .focus\\:ring-\\[\\#22C55E\\]\\/30:focus { --tw-ring-color: ${accentColor}4D !important; }
        .hover\\:bg-\\[\\#1fbc59\\]:hover { background-color: ${accentColor}E6 !important; }
        .hover\\:bg-\\[\\#1EAB52\\]:hover { background-color: ${accentColor}E6 !important; }
      `}</style>
      
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-[#0C111C]/90 backdrop-blur-md border-b border-gray-900 px-4 py-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Client Name */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full overflow-hidden border border-[#22C55E]/30 flex items-center justify-center bg-[#0C111D]`}>
              <img src={activeRestaurant?.logo || companyLogo} alt={activeRestaurant?.name || companyName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="text-left">
              <h1 className="text-sm font-black text-white tracking-widest leading-none uppercase">{activeRestaurant?.name || companyName}</h1>
              <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">
                Client: <span className="text-[#22C55E] normal-case">{clientUser?.name || 'Guest User'}</span>
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="hidden sm:flex items-center gap-2 bg-[#111827] border border-gray-800 p-1 rounded-full text-xs font-semibold">
            <button
              onClick={() => setCurrentAppState('client_home')}
              className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
                currentAppState === 'client_home' || currentAppState === 'client_menu'
                  ? 'bg-[#22C55E] text-black font-extrabold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setCurrentAppState('client_tables')}
              className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
                currentAppState === 'client_tables'
                  ? 'bg-[#22C55E] text-black font-extrabold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Tables {selectedTableId && `(${selectedTableId})`}
            </button>
            <button
              onClick={() => setCurrentAppState('client_orders')}
              className={`px-4 py-2 rounded-full cursor-pointer transition-all relative ${
                currentAppState === 'client_orders'
                  ? 'bg-[#22C55E] text-black font-extrabold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              My Orders {clientOrders.length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {clientOrders.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Actions / Mobile Cart button */}
          <div className="flex items-center gap-3">
            {/* Cart trigger button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-xl border border-gray-800 bg-[#111827] text-gray-300 hover:text-white hover:border-[#22C55E]/30 transition-all relative cursor-pointer"
              title="Open Shopping Bag"
            >
              <ShoppingBag size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#22C55E] text-black text-[10px] flex items-center justify-center font-extrabold shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>

            {/* Log Out */}
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl border border-gray-800 bg-red-950/20 text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all cursor-pointer"
              title="Log Out Client"
            >
              <LogOut size={16} />
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE NAV BAR (Only shows on mobile screens) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0C111C] border-t border-gray-900 grid grid-cols-3 text-center py-2.5 text-[11px] font-bold shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => setCurrentAppState('client_home')}
          className={`flex flex-col items-center gap-1 ${
            currentAppState === 'client_home' || currentAppState === 'client_menu' ? 'text-[#22C55E]' : 'text-gray-500'
          }`}
        >
          <Compass size={18} />
          <span>Restaurants</span>
        </button>
        <button
          onClick={() => setCurrentAppState('client_tables')}
          className={`flex flex-col items-center gap-1 ${
            currentAppState === 'client_tables' ? 'text-[#22C55E]' : 'text-gray-500'
          }`}
        >
          <MapPin size={18} />
          <span>Tables</span>
        </button>
        <button
          onClick={() => setCurrentAppState('client_orders')}
          className={`flex flex-col items-center gap-1 relative ${
            currentAppState === 'client_orders' ? 'text-[#22C55E]' : 'text-gray-500'
          }`}
        >
          {clientOrders.length > 0 && (
            <span className="absolute top-0 right-7 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center font-bold">
              {clientOrders.length}
            </span>
          )}
          <History size={18} />
          <span>My Orders</span>
        </button>
      </div>

      {/* CLIENT ROUTEs VIEWS CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-6 sm:px-6">
        
        {/* VIEW 2: RESTAURANT DISCOVERY HOME */}
        {currentAppState === 'client_home' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-950/40 to-black/20 border border-gray-800 p-6 sm:p-8 rounded-[28px] text-left relative overflow-hidden">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full bg-[#22C55E]/10 blur-[80px] pointer-events-none" />
              <span className="bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                ⚡ Premium Smart Ordering
              </span>
              <h2 className="text-2xl sm:text-3.5xl font-black text-white tracking-tight mt-3">
                Order directly from your Table
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm max-w-md mt-2 font-normal leading-relaxed">
                Connect your phone, pick your favorite restaurant, choose your seat table, and pay safely using MTN MoMo.
              </p>
            </div>

            <div className="text-left mt-8">
              <h3 className="text-lg font-bold text-white tracking-tight">Available Nearby Restaurants</h3>
              <p className="text-gray-500 text-xs mt-1">Sorted by most loved and liked currently</p>
            </div>

            {/* RESTAURANT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedRestaurants.map((r) => (
                <div 
                  key={r.id}
                  onClick={() => {
                    setActiveRestaurantId(r.id);
                    setCurrentAppState('client_menu');
                  }}
                  className="bg-[#0C111C] border border-gray-800/80 rounded-[22px] overflow-hidden hover:border-[#22C55E]/40 transition-all duration-300 group cursor-pointer flex flex-col text-left"
                >
                  <div className="h-44 w-full relative overflow-hidden bg-gray-900 border-b border-gray-900">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={r.logo} 
                      alt={r.name} 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Likes badge */}
                    <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-[#22C55E] flex items-center gap-1 border border-[#22C55E]/20">
                      <ThumbsUp size={10} />
                      <span>{r.rating} Liked</span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-gray-300">
                      <MapPin size={11} className="text-[#22C55E]" />
                      <span>{r.location}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-base text-white group-hover:text-[#22C55E] transition-colors">{r.name}</h4>
                      <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed font-light">{r.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-900 flex items-center justify-between text-[11px] font-extrabold text-[#22C55E] uppercase tracking-wider">
                      <span>View Full Menu</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: RESTAURANT MENU VIEW */}
        {currentAppState === 'client_menu' && (
          <div className="space-y-6">
            
            {/* Header / Back Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-900 pb-5 text-left">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentAppState('client_home')}
                  className="p-2 rounded-xl border border-gray-800 hover:border-gray-700 bg-[#0C111C] hover:text-[#22C55E] transition-all cursor-pointer"
                  title="Back to Restaurants"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{activeRestaurant.name}</h2>
                  <p className="text-xs text-gray-400 mt-1">{activeRestaurant.location} • Smart Digitized Menu</p>
                </div>
              </div>

              {/* Table assignment indicator */}
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#111827] border border-gray-800 text-xs font-semibold">
                <div className={`w-2 h-2 rounded-full ${selectedTableId ? 'bg-[#22C55E] animate-pulse' : 'bg-amber-500'}`} />
                <span>
                  {selectedTableId 
                    ? `Ordering for: Table ${selectedTableId}` 
                    : 'No Table Selected Yet'
                  }
                </span>
                {!selectedTableId && (
                  <button 
                    onClick={() => setCurrentAppState('client_tables')}
                    className="text-[#22C55E] hover:underline ml-1 cursor-pointer font-bold"
                  >
                    Choose seat
                  </button>
                )}
              </div>
            </div>

            {/* Category selection bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['Drinks', 'Mains', 'Desserts'].map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-[#22C55E] text-black shadow-[0_4px_12px_rgba(34,197,94,0.25)]'
                        : 'bg-[#0C111C] border border-gray-800/80 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* MENU ITEMS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {categoriedItems.map((item) => {
                const cartQty = cart.find((c) => c.id === item.id)?.quantity || 0;
                return (
                  <div 
                    key={item.id}
                    className="bg-[#0C111C] border border-gray-805 rounded-[22px] p-4 flex gap-4 text-left items-start relative hover:border-gray-800/80 transition-all"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-900 border border-gray-900 shrink-0">
                      <img 
                        className="w-full h-full object-cover" 
                        src={item.image} 
                        alt={item.name} 
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between h-24">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-white line-clamp-1">{item.name}</h4>
                          <span className="text-[#22C55E] font-black text-xs">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed font-light">
                          {item.description}
                        </p>
                      </div>

                      {/* Add Button Controller */}
                      <div className="flex items-center justify-between pt-1 border-t border-gray-900 mt-1">
                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                          {item.stock && item.stock < 10 ? `Low Stock: ${item.stock}` : 'Available'}
                        </span>

                        {cartQty > 0 ? (
                          <div className="flex items-center gap-2 bg-[#111827] border border-gray-800 px-1.5 py-1 rounded-lg">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="w-5 h-5 rounded-md text-gray-400 hover:text-white flex items-center justify-center cursor-pointer hover:bg-gray-800"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="text-xs font-bold text-white px-1">{cartQty}</span>
                            <button 
                              onClick={() => addToCart(item)}
                              className="w-5 h-5 rounded-md text-[#22C55E] hover:text-white flex items-center justify-center cursor-pointer hover:bg-gray-800"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-[#22C55E]/10 hover:bg-[#22C55E] border border-[#22C55E]/20 text-[#22C55E] hover:text-black font-extrabold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                          >
                            Add To Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 5: TABLE SELECTION PAGE */}
        {currentAppState === 'client_tables' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center pt-2">
              <span className="text-2xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full font-black uppercase tracking-wider">
                Step 2 of Ordering
              </span>
              <h2 className="text-2xl sm:text-3.5xl font-black text-white tracking-tight mt-3">Select Active Diners Table</h2>
              <p className="text-gray-400 text-xs mt-1.5 max-w-md mx-auto leading-relaxed">
                Choose the physical table location matching your seat. Your food and billing transaction will map directly to this identifier.
              </p>
            </div>

            {/* TABLES GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              {tables.map((t) => {
                const isSelected = selectedTableId === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      if (t.status === 'Occupied') return;
                      setSelectedTableId(t.id);
                    }}
                    className={`border p-6 rounded-[22px] flex flex-col items-center justify-center text-center cursor-pointer transition-all select-none group ${
                      isSelected
                        ? 'bg-[#123820] border-[#22C55E] shadow-[0_8px_20px_rgba(34,197,94,0.15)]Scale'
                        : t.status === 'Occupied'
                        ? 'bg-[#181111]/80 border-red-900/30 text-gray-400 opacity-60'
                        : 'bg-[#0C111C] border-gray-850 hover:border-gray-800'
                    }`}
                  >
                    {/* Circle icon label */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${
                      isSelected 
                        ? 'bg-[#22C55E]/20 text-[#22C55E]' 
                        : t.status === 'Occupied'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-gray-800/50 text-gray-400'
                    }`}>
                      <Utensils size={18} />
                    </div>

                    <span className="font-extrabold text-sm text-white tracking-tight leading-none">{t.id}</span>
                    <span className="text-[10px] text-gray-500 mt-2 font-medium">{t.location}</span>

                    <div className="mt-4">
                      {isSelected ? (
                        <span className="bg-[#22C55E] text-black text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Check size={9} strokeWidth={3} /> Chosen Seat
                        </span>
                      ) : t.status === 'Occupied' ? (
                        <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] tracking-wide font-black uppercase px-2.5 py-0.5 rounded-full">
                          Occupied
                        </span>
                      ) : (
                        <span className="bg-gray-850 text-gray-400 text-[9px] tracking-wide font-black uppercase px-2.5 py-0.5 rounded-full group-hover:bg-gray-800">
                          Select Table
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back to Browse / Proceed to Payment action */}
            <div className="pt-6 flex justify-center gap-3">
              <button
                onClick={() => setCurrentAppState('client_menu')}
                className="bg-[#0C111C] hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white px-6 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                Back To Menu Catalog
              </button>
              
              <button
                onClick={() => {
                  if (selectedTableId) {
                    setCurrentAppState('client_payment');
                  }
                }}
                disabled={!selectedTableId}
                className={`px-8 py-3 rounded-xl text-xs font-extrabold text-center transition-all cursor-pointer ${
                  selectedTableId
                    ? 'bg-[#22C55E] hover:bg-[#1fbc59] text-black shadow-lg hover:-translate-y-0.5'
                    : 'bg-gray-850 text-gray-600 border border-gray-900 cursor-not-allowed'
                }`}
              >
                Proceed to MTN Payment
              </button>
            </div>
          </div>
        )}

        {/* VIEW 6: MTN PAYMENTS SCREEN */}
        {currentAppState === 'client_payment' && (() => {
          const subtotalRwf = Math.round(subtotal * 1300);
          const formatRwf = (val: number) => val.toLocaleString() + ' RWF';
          return (
            <div className="max-w-md mx-auto space-y-6">
              
              {/* STEP 1: Phone Entry Screen */}
              {paymentStep === 'step1_entry' && (
                <div className="bg-[#0C111C] border border-gray-800/80 rounded-[28px] p-6 text-left space-y-5 shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full bg-[#22C55E]/5 blur-[80px] pointer-events-none" />
                  
                  <div className="flex items-center gap-3 border-b border-gray-900 pb-4 justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-md">
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">💳 MTN MoMo (Secure)</h3>
                        <p className="text-[10px] text-gray-400">Step 1 — Phone Entry Screen</p>
                      </div>
                    </div>

                    {/* Back Link */}
                    <button 
                      onClick={() => setCurrentAppState('client_tables')}
                      className="text-xs text-gray-400 hover:text-white cursor-pointer transition-colors font-semibold"
                    >
                      Change Table
                    </button>
                  </div>

                  {validationError && (
                    <div className="text-xs text-red-100 bg-red-950/40 border border-red-900/40 p-3 rounded-xl flex items-center gap-2 font-semibold">
                      <AlertCircle size={14} className="shrink-0 text-red-400" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* Clean Order Summary Card */}
                  <div className="bg-[#111827] border border-gray-950/40 p-4 rounded-2xl text-xs space-y-3 shadow-inner">
                    <div className="flex justify-between items-center border-b border-black/20 pb-1.5">
                      <span className="font-black text-gray-400 uppercase text-[9px] tracking-wider block">
                        Order Summary ({activeRestaurant.name})
                      </span>
                      <span className="text-[10px] text-[#22C55E] font-bold">
                        Table {selectedTableId}
                      </span>
                    </div>
                    
                    <div className="max-h-24 overflow-y-auto space-y-2 font-medium">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-gray-300">
                          <span>
                            {item.menuItem.name} <span className="text-[#22C55E] text-2xs font-extrabold">x{item.quantity}</span>
                          </span>
                          <span className="font-mono text-gray-400">
                            {formatRwf(Math.round(item.menuItem.price * item.quantity * 1300))}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-black/20 pt-2 flex justify-between font-black text-xs text-white">
                      <span>Total Amount Invoice</span>
                      <span className="text-[#22C55E] text-sm">{formatRwf(subtotalRwf)}</span>
                    </div>
                  </div>

                  {/* FORM INPUT FOR SECURE MOBILE MONEY PHONES */}
                  <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5 flex items-center justify-between">
                        <span>MTN Mobile Money Phone Number</span>
                        <span className="text-[9px] text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded uppercase font-black">MoMo Pay</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={momoPhone}
                        onChange={(e) => setMomoPhone(e.target.value)}
                        placeholder="e.g. 0788123456"
                        className="w-full bg-[#111827] text-white rounded-xl px-4 py-3 text-xs border border-gray-800 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 focus:ring-1 focus:ring-[#22C55E]/30"
                      />
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-2 pt-1 font-medium">
                      <input
                        type="checkbox"
                        id="savePhoneCheck"
                        checked={saveMomoPhone}
                        onChange={(e) => setSaveMomoPhone(e.target.checked)}
                        className="w-4 h-4 rounded bg-[#111827] border-gray-800 text-[#22C55E] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <label htmlFor="savePhoneCheck" className="text-xs text-gray-400 select-none cursor-pointer">
                        Save this number for future payments
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#22C55E] hover:bg-[#1EAB52] text-black font-black py-4 rounded-xl text-xs transition-all shadow-[0_5px_15px_rgba(34,197,94,0.3)] hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                    >
                      <CreditCard size={14} strokeWidth={3} />
                      <span>Pay {formatRwf(subtotalRwf)}</span>
                    </button>
                    
                    <p className="text-center text-[10px] text-gray-500 max-w-[280px] mx-auto leading-normal">
                      You will receive a payment prompt on your phone from MTN
                    </p>
                  </form>
                </div>
              )}

              {/* STEP 2: Waiting / Pending Screen */}
              {paymentStep === 'step2_waiting' && (
                <div className="bg-[#0C111C] border border-gray-800/80 rounded-[32px] p-8 text-center py-12 space-y-6 shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full bg-[#22C55E]/5 blur-[60px] pointer-events-none" />
                  
                  {/* Animated phone icon with pulse effect */}
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#22C55E]/10 animate-ping opacity-60" />
                    <div className="absolute inset-2 rounded-full bg-[#22C55E]/15 animate-pulse" />
                    <div className="relative w-14 h-14 rounded-full bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 flex items-center justify-center shadow-lg">
                      <Smartphone size={24} className="animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-black text-lg text-white tracking-tight">Check your phone</h3>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                      MTN is sending you a payment approval prompt. Enter your MTN PIN on your phone to confirm.
                    </p>
                  </div>

                  {/* Countdown timer and Spinning Loader */}
                  <div className="bg-[#111827] border border-gray-950/40 p-4 rounded-xl max-w-xs mx-auto flex items-center justify-between gap-4 shadow-inner">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="text-[#22C55E] animate-spin shrink-0" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Awaiting response...</span>
                    </div>
                    <div className="bg-[#0C111C] px-3.5 py-1 rounded-full border border-gray-800">
                      <span className="font-mono text-xs font-black text-amber-500">{countdown}s</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setPaymentStep('step1_entry');
                      }}
                      className="text-xs text-gray-500 hover:text-red-400 font-semibold underline transition-colors cursor-pointer"
                    >
                      Cancel Payment
                    </button>
                    <p className="text-[9px] text-gray-600 mt-3">
                      ⚠️ No PIN field. No code field. Nothing sensitive.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 3a: Success Screen */}
              {paymentStep === 'step3a_success' && (
                <div className="bg-[#0C111C] border border-gray-800/80 rounded-[32px] p-8 text-center py-10 space-y-6 shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 border-2 border-[#22C55E] text-[#22C55E] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse">
                    <Check size={32} strokeWidth={3} />
                  </div>

                  <div className="space-y-1">
                    <span className="bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-inner">
                      Cleared Securely
                    </span>
                    <h3 className="font-black text-xl text-white mt-4 tracking-tight">Payment confirmed!</h3>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                      Your transaction cleared successfully! High-quality kitchen dispatchers are rolling out your ordered meals right now.
                    </p>
                  </div>

                  {/* Order summary table */}
                  <div className="bg-[#111827] border border-gray-950/40 p-4 rounded-xl text-xs space-y-2 max-w-xs mx-auto text-left shadow-inner">
                    <div className="flex justify-between border-b border-gray-950 pb-1.5 text-[9px] font-black uppercase tracking-wider text-gray-500">
                      <span>Transaction Invoice Details</span>
                      <span className="text-[#22C55E]">Success</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>MTN Tx ID:</span>
                      <span className="font-bold text-white font-mono">{transactionId}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Order ID:</span>
                      <span className="font-bold text-white font-mono">{placedOrderId || 'ORD-SYNCING'}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Diners Table:</span>
                      <span className="font-bold text-[#22C55E] font-mono">Table {selectedTableId}</span>
                    </div>
                    <div className="border-t border-black/20 pt-1.5 flex justify-between text-gray-300">
                      <span>Total Amount Paid:</span>
                      <span className="font-black text-[#22C55E] font-mono">{formatRwf(subtotalRwf)}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-2 max-w-xs mx-auto">
                    <button
                      onClick={() => {
                        setPaymentStep('step1_entry');
                        clearCart();
                        setCurrentAppState('client_orders');
                      }}
                      className="w-full bg-[#22C55E] hover:bg-[#1fbc59] text-black font-extrabold py-3.5 rounded-xl text-xs transition-with-shadow shadow-md cursor-pointer"
                    >
                      Track my order
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3b: Failed Screen */}
              {paymentStep === 'step3b_failed' && (
                <div className="bg-[#0C111C] border border-gray-800/80 rounded-[32px] p-8 text-center py-10 space-y-6 shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 text-red-500 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <X size={32} strokeWidth={3} />
                  </div>

                  <div className="space-y-2">
                    <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      Tx Aborted
                    </span>
                    <h3 className="font-black text-xl text-white tracking-tight">Payment Failed</h3>
                    <p className="text-xs text-red-400 font-bold bg-red-950/25 border border-red-950/40 p-3 rounded-lg max-w-xs mx-auto">
                      "{failedReason || 'Connection rejected'}"
                    </p>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed pt-1">
                      No amount has been debited. Please check your MTN MoMo wallet balance and try again.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col gap-2 max-w-xs mx-auto">
                    <button
                      onClick={() => {
                        setPaymentStep('step1_entry');
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-extrabold py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => {
                        setPaymentStep('step1_entry');
                        setMomoPhone('');
                      }}
                      className="w-full bg-[#111827] hover:bg-gray-800 border border-gray-800 text-xs text-gray-300 hover:text-white py-3 rounded-xl transition-all cursor-pointer font-bold"
                    >
                      Change payment number
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3c: Timeout Screen */}
              {paymentStep === 'step3c_timeout' && (
                <div className="bg-[#0C111C] border border-gray-800/80 rounded-[32px] p-8 text-center py-10 space-y-6 shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse">
                    <AlertCircle size={32} />
                  </div>

                  <div className="space-y-2">
                    <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      Request Timeout
                    </span>
                    <h3 className="font-black text-xl text-white tracking-tight">No response from MTN</h3>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                      The network connection response limit of 60 seconds was exceeded without receiving confirmation.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col gap-2 max-w-xs mx-auto">
                    <button
                      onClick={() => {
                        setPaymentStep('step1_entry');
                      }}
                      className="w-full bg-[#22C55E] hover:bg-[#1EAB52] text-black font-extrabold py-3.5 rounded-xl text-xs transition-shadow shadow-md cursor-pointer"
                    >
                      Retry Payment
                    </button>
                    <button
                      onClick={() => {
                        setPaymentStep('step1_entry');
                        setCurrentAppState('client_menu');
                      }}
                      className="w-full bg-[#111827] hover:bg-gray-800 border border-gray-800 text-xs text-gray-300 hover:text-white py-3 rounded-xl transition-all cursor-pointer font-bold"
                    >
                      Cancel Checkout
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })()}

        {/* VIEW 7: MY PAST ORDERS LIST */}
        {currentAppState === 'client_orders' && (
          <div className="max-w-2xl mx-auto space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-gray-900 pb-5">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Dynamic Order Tracking</h2>
                <p className="text-xs text-gray-400 mt-1">Real-time status synced directly with owner dispatchers</p>
              </div>

              <span className="text-3xs bg-[#111827] border border-gray-800 text-gray-400 px-3 py-1.5 rounded-full font-bold">
                Total Orders: {clientOrders.length}
              </span>
            </div>

            {clientOrders.length === 0 ? (
              <div className="bg-[#0C111C] border border-gray-850 rounded-[28px] p-12 text-center py-16 space-y-5">
                <div className="w-12 h-12 rounded-full bg-gray-800/40 text-gray-500 flex items-center justify-center mx-auto">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">No active orders placed yet</h4>
                  <p className="text-xs text-gray-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    Make your first purchase, select a diners table and clear with MoMo to initiate automatic tracking here.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentAppState('client_home')}
                  className="bg-[#22C55E] hover:bg-[#1EAB52] text-black font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-md inline-block"
                >
                  Order Spicy Food Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {clientOrders.map((ord) => {
                  return (
                    <div
                      key={ord.id}
                      className="bg-[#0C111C] border border-gray-805 rounded-2xl p-5 hover:border-gray-800 transition-all text-xs space-y-4"
                    >
                      {/* Top Header info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-950 pb-3 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white">{ord.restaurantName}</span>
                          <span className="text-gray-500">•</span>
                          <span className="font-bold text-gray-300 font-mono">{ord.id}</span>
                        </div>

                        {/* Status layout */}
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 font-light text-2xs">
                            {new Date(ord.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          <span className={`px-3 py-1 rounded-full text-3xs font-black uppercase border select-none ${
                            ord.status === 'Pending'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                              : ord.status === 'Preparing'
                              ? 'bg-[#1D4ED8]/10 border-[#1D4ED8]/20 text-[#22D55E]'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          }`}>
                            {ord.status === 'Pending' ? 'Pending' : ord.status === 'Preparing' ? 'Preparing' : 'Served (Done)'}
                          </span>
                        </div>
                      </div>

                      {/* Items details */}
                      <div className="space-y-1.5 py-1 text-gray-300">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{it.name} <span className="text-gray-500 text-3xs">x{it.quantity}</span></span>
                            <span className="font-mono text-gray-400">${(it.price * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Summary cost */}
                      <div className="bg-[#111827] border border-gray-950/40 p-3 rounded-xl flex items-center justify-between font-bold">
                        <span className="text-gray-400 text-3xs uppercase font-black tracking-wide">
                          Paid using MTN MobileMoney • Table {ord.tableId}
                        </span>
                        <span className="text-[#22C55E] text-sm font-black">${ord.total.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* FLOATING CART SIDEBAR (Slides in from the right) */}
      <div className={`fixed inset-0 z-50 transition-all ${isCartOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        {/* Backdrop overlay */}
        <div 
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
        />

        {/* Drawer container body */}
        <div className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0C111C] border-l border-gray-900 shadow-[25px_0_60px_rgba(0,0,0,0.8)] p-6 flex flex-col justify-between transition-transform duration-350 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div>
            <div className="flex items-center justify-between border-b border-gray-900 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-[#22C55E]" size={18} />
                <h3 className="font-bold text-base text-white">Your Order Bag</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full bg-[#111827] border border-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Cart content scroll list */}
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-3.5">
                <div className="w-12 h-12 rounded-full border border-gray-805 bg-gray-900/40 flex items-center justify-center text-gray-500 mx-auto">
                  <ShoppingBag size={18} />
                </div>
                <h4 className="font-bold text-sm text-white">Shopping bag is empty</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Browse categorized menus in the main restaurant list and add delicious local food items.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div 
                    key={item.id}
                    className="flex justify-between items-center p-3 border border-gray-850 rounded-xl bg-[#111827] gap-3"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-12 h-12 rounded-lg bg-gray-900 overflow-hidden border border-gray-900 shrink-0">
                        <img className="w-full h-full object-cover" src={item.menuItem.image} alt={item.menuItem.name} referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-white line-clamp-1">{item.menuItem.name}</h5>
                        <p className="text-[#22C55E] text-2xs font-extrabold mt-1">${item.menuItem.price.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="w-6 h-6 rounded-md bg-gray-850 border border-gray-800 hover:border-gray-700 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-xs font-bold text-white font-mono w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => addToCart(item.menuItem)}
                        className="w-6 h-6 rounded-md bg-gray-850 border border-gray-800 hover:border-gray-700 flex items-center justify-center text-gray-450 hover:text-white cursor-pointer"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subtotal Checkout parameters */}
          {cart.length > 0 && (
            <div className="border-t border-gray-900 pt-5 space-y-4">
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Supa Tax / Service Fee</span>
                  <span className="font-bold text-[#22C55E]">FREE</span>
                </div>
                <div className="flex justify-between font-black text-sm text-white pt-2 border-t border-gray-950">
                  <span>Total Amount</span>
                  <span className="text-[#22C55E] font-mono">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Table assignment warning prompt */}
              {!selectedTableId ? (
                <div className="bg-amber-950/10 border border-amber-900/30 p-2.5 rounded-xl flex items-start gap-2 text-left">
                  <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-[10px] text-gray-400 leading-normal">
                    You have not chosen your seat Table yet. Proceeding will navigate to Table Selector first.
                  </span>
                </div>
              ) : (
                <div className="bg-[#123820] border border-[#22C55E]/20 p-2.5 rounded-xl flex items-center justify-between text-[10px] text-white">
                  <span className="font-medium text-gray-300">Set Diner Table Position:</span>
                  <span className="font-black text-[#22C55E] uppercase border border-[#22C55E]/30 bg-black/30 px-2 py-0.5 rounded-full">
                    Table {selectedTableId}
                  </span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#22C55E] hover:bg-[#1fbc59] text-black font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Proceed To Checkout</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
