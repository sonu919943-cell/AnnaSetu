import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Sparkles, LogIn, Home, Star, PlayCircle, DollarSign } from 'lucide-react';

export default function PortfolioLayout() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Features', path: '/features', icon: Star },
    { name: 'How It Works', path: '/how-it-works', icon: PlayCircle },
    { name: 'Pricing', path: '/pricing', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-darkbg-900 text-slate-100 flex flex-col font-sans pb-16 md:pb-0">
      {/* Desktop Top Navbar & Mobile Top Navbar (Login only on mobile) */}
      <header className="sticky top-0 z-40 bg-darkbg-900/80 backdrop-blur-xl border-b border-annagreen-500/10 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Lockup */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/image-removebg-preview.png" 
              alt="AnnaSetu Logo" 
              className="h-9 sm:h-11 transition-transform group-hover:scale-105 drop-shadow-sm"
            />
            <div className="hidden sm:block">
              <span className="px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase rounded-full bg-saffron-100 text-saffron-600 border border-saffron-200 flex items-center w-fit gap-1 mt-0.5">
                <Sparkles className="w-2.5 h-2.5" /> SIH 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center bg-darkbg-800/50 p-1.5 rounded-2xl border border-slate-700/50 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === link.path
                    ? 'bg-darkbg-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-darkbg-700/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Login Button */}
          <Link
            to="/login"
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-annagreen-600 to-annagreen-500 hover:from-annagreen-500 hover:to-annagreen-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-annagreen-900/40 ring-1 ring-annagreen-300/30 transition-all flex items-center gap-2 hover:scale-105"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-darkbg-900/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 pb-safe flex items-center justify-around">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const IconComponent = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive ? 'text-annagreen-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <IconComponent className={`w-5 h-5 mb-1 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : ''}`} />
              <span className="text-[9px] font-bold tracking-wide">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <footer className="hidden md:block border-t border-slate-800 bg-darkbg-950 py-6 px-4 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">AnnaSetu</span>
            <span>· FSSAI-2019 & SWM-2016 Compliant Food Surplus Recovery Platform</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Smart India Hackathon (SIH 2026) Interactive Demo Prototype
          </p>
        </div>
      </footer>
    </div>
  );
}
