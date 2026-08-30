import React, { useState } from 'react';
import { ArrowRight, Utensils, Percent, Star, ChevronLeft, ChevronRight, Play, Award, Layers, ShieldCheck, CheckSquare, Clock, Edit3, Bike, TrendingUp, HelpCircle, Instagram, Facebook, Share2, Palette, Sparkles, Smartphone, LayoutDashboard, Sliders, Webhook } from 'lucide-react';
import { AppState } from '../types';
import { useApp } from '../context/AppContext';

interface LandingPageProps {
  onNavigate: (state: AppState) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const { companyName, companyLogo, brandCandidates, selectedBrandIndex, setSelectedBrandIndex } = useApp();

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Glow Effect Top Right */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      {/* Glow Effect Bottom Left */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      {/* Header / Navigation Bar */}
      <nav id="landing-navbar" className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-11 h-11 rounded-full overflow-hidden border border-[#22C55E]/40 flex items-center justify-center bg-[#0C1017]">
            <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-widest text-[#22C55E] leading-none text-base uppercase">{companyName}</span>
            <span className="text-[9px] text-[#9CA3AF] tracking-wider leading-none mt-1">SMART RESTAURANTS</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-300">
          <a href="#home" className="text-white border-b-2 border-[#22C55E] pb-1 font-semibold transition-all">Home</a>
          <a href="#features" className="hover:text-[#22C55E] transition-all">Features</a>
          <a href="#about" className="hover:text-[#22C55E] transition-all">About Us</a>
          <a href="#pricing" className="hover:text-[#22C55E] transition-all">Pricing</a>
        </div>

        <button 
          id="btn-get-started-nav"
          onClick={() => onNavigate('owner_signup')}
          className="bg-[#22C55E] hover:bg-[#1EAB52] text-black font-semibold px-6 py-2.5 rounded-full text-sm tracking-wide transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_4px_14px_rgba(34,197,94,0.3)]"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="w-full max-w-7xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        {/* Left Column Content */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1] mb-6">
            Use technology and data to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#10B981] drop-shadow-[0_2px_10px_rgba(34,197,94,0.15)]">
              streamline operations and delight customers.
            </span>
          </h1>

          <p id="hero-description" className="text-gray-400 text-lg sm:text-xl font-normal leading-relaxed max-w-xl mb-8">
            From orders to deliveries, manage everything in real-time with one easy-to-use platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
            {/* A Client Button */}
            <button
              id="btn-role-client"
              onClick={() => onNavigate('client_register')}
              className="bg-[#22C55E] hover:bg-[#1fbc59] text-black font-bold px-6 py-3.5 rounded-full flex items-center justify-between gap-6 transition-all duration-300 shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:-translate-y-0.5"
            >
              <span className="tracking-wide">A Client</span>
              <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white">
                <ArrowRight size={14} />
              </div>
            </button>

            {/* A Restaurant Owner Button */}
            <button
              id="btn-role-owner"
              onClick={() => onNavigate('owner_login')}
              className="border border-[#22C55E]/60 text-[#22C55E] hover:bg-[#22C55E]/10 font-bold px-8 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 text-center"
            >
              A Restaurant Owner
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 border-t border-gray-800/60 pt-6 w-full max-w-md">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-[#07090E] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar" referrerPolicy="no-referrer" />
              <img className="w-10 h-10 rounded-full border-2 border-[#07090E] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Avatar" referrerPolicy="no-referrer" />
              <img className="w-10 h-10 rounded-full border-2 border-[#07090E] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Avatar" referrerPolicy="no-referrer" />
              <img className="w-10 h-10 rounded-full border-2 border-[#07090E] object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Avatar" referrerPolicy="no-referrer" />
            </div>
            <div className="text-xs text-gray-400">
              Trusted by <span className="text-[#22C55E] font-semibold">500+</span> clients and <br />
              restaurant owners for their benefits correspondingly
            </div>
          </div>
        </div>

        {/* Right Column illustration (Ramen noodle + floating mini dishes) */}
        <div className="lg:col-span-6 flex items-center justify-center relative scale-95 lg:scale-100 py-10">
          {/* Main big glowing circular platform */}
          <div className="relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] rounded-full border border-dashed border-[#22C55E]/20 flex items-center justify-center p-6 bg-gradient-to-b from-[#111827]/30 to-[#030712]/30 shadow-[0_0_120px_rgba(34,197,94,0.04)]">
            
            {/* Center Bowl */}
            <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full overflow-hidden border-4 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)] group transition-transform duration-500 hover:scale-105">
              <img 
                src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80" 
                alt="Signature Ramen" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-[12px] uppercase tracking-widest text-[#22C55E] font-black bg-black/70 px-3 py-1 rounded-full">Supa Signature</span>
              </div>
            </div>

            {/* Rising Vapor Vectors */}
            <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none opacity-80">
              <svg className="w-12 h-16 text-[#22C55E]/30 animate-pulse" viewBox="0 0 100 200" fill="none">
                <path d="M30 180 C 40 140, 10 100, 30 60 C 45 30, 20 0, 35 -20" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
              <svg className="w-12 h-20 text-[#22C55E]/40" viewBox="0 0 100 200" fill="none">
                <path d="M50 190 C 20 130, 70 80, 40 30 C 50 10, 30 -10, 45 -40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Satellite Decorative Dish 1 - Dumplings (Top Left: 10 o'clock) */}
            <div className="absolute top-[5%] left-[2%] w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#22C55E]/30 shadow-lg hover:scale-110 transition-transform cursor-pointer">
              <img src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=150&q=80" alt="Dumplings" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>

            {/* Satellite Decorative Dish 2 - Sushi Roll (Top Right: 2 o'clock) */}
            <div className="absolute top-[5%] right-[2%] w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#22C55E]/30 shadow-lg hover:scale-110 transition-transform cursor-pointer">
              <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=150&q=80" alt="Sushi" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>

            {/* Satellite Decorative Dish 3 - Salad Stew (Mid Left: 9 o'clock) */}
            <div className="absolute left-[-15%] top-[1/2] -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#22C55E]/30 shadow-lg hover:scale-110 transition-transform cursor-pointer">
              <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80" alt="Stirfry" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>

            {/* Satellite Decorative Dish 4 - Fish Soup (Mid Right: 3 o'clock) */}
            <div className="absolute right-[-15%] top-[1/2] -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#22C55E]/30 shadow-lg hover:scale-110 transition-transform cursor-pointer">
              <img src="https://images.unsplash.com/photo-1560c00032-9efc50226a2a?auto=format&fit=crop&w=150&q=80" alt="Fish Bowl" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>

            {/* Satellite Decorative Dish 5 - Stir Fry (Bottom Center: 6 o'clock) */}
            <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#22C55E]/30 shadow-lg hover:scale-110 transition-transform cursor-pointer">
              <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=150&q=80" alt="Spicy Noodles" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>

            {/* Decorative Chopsticks overlay */}
            <div className="absolute bottom-[-5px] left-[5%] transform -rotate-12 pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
              <div className="w-48 h-1.5 bg-amber-900 rounded-full mb-1" />
              <div className="w-44 h-1 bg-amber-800 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* "How It Works" Section */}
      <section id="features" className="w-full max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">How It Works</h2>
        <div className="w-16 h-1 bg-[#22C55E] mx-auto mb-16 rounded-full" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector dashed green lines in desktop view */}
          <div className="hidden md:block absolute top-[120px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-[#22C55E]/20 -z-10" />

          {/* Card 1 */}
          <div className="bg-[#0C111C] border border-[#1F2937]/50 rounded-3xl p-8 hover:border-[#22C55E]/40 transition-all duration-300 flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full bg-[#22C55E] text-black font-extrabold text-sm flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              1
            </div>
            <div className="w-16 h-16 rounded-2xl bg-black/40 flex items-center justify-center mb-6 text-[#22C55E] group-hover:scale-110 transition-transform duration-300">
              <Utensils size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Register Your Restaurant</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Create your account and set up your restaurant by adding basic details and your menu.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0C111C] border border-[#1F2937]/50 rounded-3xl p-8 hover:border-[#22C55E]/40 transition-all duration-300 flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full bg-[#22C55E] text-black font-extrabold text-sm flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              2
            </div>
            <div className="w-16 h-16 rounded-2xl bg-black/40 flex items-center justify-center mb-6 text-[#22C55E] group-hover:scale-110 transition-transform duration-300">
              <Bike size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Manage Orders & Deliveries</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Receive orders, update their status, and track deliveries in real time from your dashboard.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0C111C] border border-[#1F2937]/50 rounded-3xl p-8 hover:border-[#22C55E]/40 transition-all duration-300 flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full bg-[#22C55E] text-black font-extrabold text-sm flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              3
            </div>
            <div className="w-16 h-16 rounded-2xl bg-black/40 flex items-center justify-center mb-6 text-[#22C55E] group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Monitor & Grow</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Track your performance with insights and reports to improve your restaurant operations.
            </p>
          </div>
        </div>
      </section>



      {/* Discover Great Food - Ambient Backdrop Glow Banner */}
      <section id="about" className="w-full max-w-7xl mx-auto px-6 py-12 z-10">
        <div className="bg-[#0C1018] border border-gray-800/80 rounded-[32px] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Neon Glow Circle Background */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#22C55E]/10 blur-[90px] pointer-events-none" />

          {/* Texts */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Discover Great Food
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed max-w-md">
              Browse a variety of restaurants and discover meals that match your taste — all in one place.
            </p>
            <button 
              onClick={() => onNavigate('client_register')} 
              className="text-[#22C55E] hover:text-emerald-400 font-bold flex items-center gap-2 transition-all hover:translate-x-1"
            >
              Learn more <span className="text-sm">→</span>
            </button>
          </div>

          {/* Side Image */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end z-10">
            <div className="relative w-full max-w-[420px] h-[240px] md:h-[280px] rounded-3xl overflow-hidden border-2 border-[#22C55E] shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <img 
                src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80" 
                alt="Excellent Food Buffet" 
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* "Why Choose Us" Grid */}
      <section id="why" className="w-full max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Why Choose Us</h2>
        <div className="w-16 h-1 bg-[#22C55E] mx-auto mb-16 rounded-full" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-[#0C111C]/60 border border-gray-800/80 rounded-2xl p-6 text-left hover:border-[#22C55E]/40 transition-all duration-300 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center mb-5 font-bold">
              <Edit3 size={18} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Simple to Use</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Manage your restaurant operations easily with a clean and intuitive interface designed for everyone.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0C111C]/60 border border-gray-800/80 rounded-2xl p-6 text-left hover:border-[#22C55E]/40 transition-all duration-300 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center mb-5 font-bold">
              <Clock size={18} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Real-Time Control</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stay updated with live order status, deliveries, and daily activities as they happen.
            </p>
          </div>

          {/* Card 3 - Clock item replicated as shown in visual screenshot */}
          <div className="bg-[#0C111C]/60 border border-gray-800/80 rounded-2xl p-6 text-left hover:border-[#22C55E]/40 transition-all duration-300 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center mb-5 font-bold">
              <Clock size={18} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Real-Time Control</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stay updated with live order status, deliveries, and daily activities as they happen.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#0C111C]/60 border border-gray-800/80 rounded-2xl p-6 text-left hover:border-[#22C55E]/40 transition-all duration-300 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center mb-5 font-bold">
              <Layers size={18} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">All-in-One System</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Handle orders, deliveries, and business operations in one centralized dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Brand Identity Selector Section */}
      <section id="brand-selector" className="w-full max-w-7xl mx-auto px-6 py-16 bg-[#0B0F19]/90 border border-gray-900 rounded-[32px] my-10 relative overflow-hidden text-left">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[95px] pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Palette size={14} /> Brand Experience Engine
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Explore and Select Our Brand Name & Logo
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
            We have crafted three elite brand candidate strategies with custom-designed vector branding logos. 
            Click any candidate below to instantly rebrand the entire application in real-time!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {brandCandidates.map((candidate, idx) => {
            const isSelected = selectedBrandIndex === idx;
            return (
              <div 
                key={candidate.name}
                onClick={() => setSelectedBrandIndex(idx)}
                className={`flex flex-col p-6 rounded-[24px] border transition-all duration-300 cursor-pointer text-left relative overflow-hidden group ${
                  isSelected 
                    ? 'bg-[#111827] border-emerald-500 shadow-[0_4px_24px_rgba(34,197,94,0.15)] ring-1 ring-emerald-500/50' 
                    : 'bg-[#0C111C]/45 border-gray-800/80 hover:border-gray-700 hover:bg-[#0C111C]/80'
                }`}
              >
                {/* Active Indicator Badge */}
                {isSelected && (
                  <div className="absolute right-4 top-4 bg-[#22C55E] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                    Selected
                  </div>
                )}

                {/* Logo Image */}
                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-800/80 bg-black/40 flex items-center justify-center p-0.5 mb-5 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={candidate.logoUrl} 
                    alt={candidate.name} 
                    className="w-full h-full object-cover rounded-full" 
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-2 mt-auto">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-emerald-500 block">
                    {candidate.tagline}
                  </span>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
                    {candidate.name}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    {candidate.description}
                  </p>
                  
                  <div className="pt-3 border-t border-gray-900 flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block">
                      Logo Design Concept:
                    </span>
                    <p className="text-[11px] text-gray-500 leading-normal italic">
                      {candidate.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Grid matching visually Screen 1 exactly */}
      <footer className="w-full bg-[#05070A] border-t border-gray-900 pt-16 pb-8 text-left z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 mb-12">
          
          {/* Logo & description column */}
          <div className="col-span-2 md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#22C55E]/30 flex items-center justify-center bg-[#0C111D]">
                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <span className="font-extrabold tracking-widest text-[#22C55E] text-base uppercase">{companyName}</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs mt-2 font-light leading-relaxed">
              Smart Tools for Smarter Restaurants.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4 mt-4">
              <a href="#instagram" className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#22C55E] hover:border-[#22C55E] transition-all">
                <Instagram size={15} />
              </a>
              <a href="#facebook" className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#22C55E] hover:border-[#22C55E] transition-all">
                <Facebook size={15} />
              </a>
              <a href="#tiktok" className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#22C55E] hover:border-[#22C55E] transition-all text-xs font-bold leading-none">
                T
              </a>
            </div>
          </div>

          {/* Support Columns */}
          <div className="col-span-1 md:col-span-2">
            <h5 className="font-semibold text-xs tracking-wider uppercase text-emerald-500 mb-4">Explore</h5>
            <ul className="flex flex-col gap-2 text-xs text-gray-400">
              <li><a href="#food" className="hover:text-white transition-all">Food Resources</a></li>
              <li><a href="#track" className="hover:text-white transition-all">Track Deliveries</a></li>
              <li><a href="#community" className="hover:text-white transition-all">Community Forum</a></li>
              <li><a href="#contact" className="hover:text-white transition-all">Contact Us</a></li>
              <li><a href="#question" className="hover:text-white transition-all">Ask Question</a></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3">
            <h5 className="font-semibold text-xs tracking-wider uppercase text-emerald-500 mb-4">Company</h5>
            <ul className="flex flex-col gap-2 text-xs text-gray-400">
              <li><a href="#about-us" className="hover:text-white transition-all">About Delicious</a></li>
              <li><a href="#team" className="hover:text-white transition-all">Meet the Team</a></li>
              <li><a href="#careers" className="hover:text-white transition-all">Careers News</a></li>
              <li><a href="#partner" className="hover:text-white transition-all">Partner program</a></li>
              <li><a href="#agreement" className="hover:text-white transition-all">User Agreement</a></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <h5 className="font-semibold text-xs tracking-wider uppercase text-emerald-500 mb-4">Support</h5>
            <ul className="flex flex-col gap-2 text-xs text-gray-400">
              <li><a href="#getstarted" className="hover:text-white transition-all">Getting Started</a></li>
              <li><a href="#help" className="hover:text-white transition-all">Help Center</a></li>
              <li><a href="#consulting" className="hover:text-white transition-all">Consulting Service</a></li>
              <li><a href="#contact-support" className="hover:text-white transition-all">Contact Us</a></li>
              <li><a href="#partners" className="hover:text-white transition-all">Our Partners</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-500">
          <span>&copy; 2026 {companyName.toUpperCase()}., Ltd. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-gray-400 transition-all">Privacy Policy</a>
            <a href="#terms" className="hover:text-gray-400 transition-all">Terms of Service</a>
            <a href="#cookie" className="hover:text-gray-400 transition-all">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
