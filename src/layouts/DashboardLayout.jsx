import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  UtensilsCrossed, Sparkles, LogOut, LayoutDashboard, 
  ScanLine, Map, Trash2, Heart, BarChart3, Settings,
  Users, Menu, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout() {
  const { userRole, logout, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const businessLinks = [
    { name: 'Overview', path: '/dashboard/business', icon: LayoutDashboard },
    { name: 'AI Scan', path: '/dashboard/business/scan', icon: ScanLine },
    { name: 'Matching', path: '/dashboard/business/matching', icon: Map },
    { name: 'Spoiled Waste', path: '/dashboard/business/spoiled', icon: Trash2 },
  ];

  const ngoLinks = [
    { name: 'Incoming Requests', path: '/dashboard/ngo', icon: LayoutDashboard },
    { name: 'Verified Claims', path: '/dashboard/ngo/claims', icon: Heart },
  ];

  const adminLinks = [
    { name: 'Platform Impact', path: '/dashboard/admin', icon: BarChart3 },
    { name: 'User Management', path: '/dashboard/admin/users', icon: Users },
    { name: 'Monetization', path: '/dashboard/admin/monetization', icon: Settings },
  ];

  const fertilizerLinks = [
    { name: 'Incoming Waste', path: '/dashboard/fertilizer', icon: LayoutDashboard },
    { name: 'Processed (SWM)', path: '/dashboard/fertilizer/processed', icon: Heart }, // or Factory
  ];

  let navLinks = [];
  if (userRole === 'business') navLinks = businessLinks;
  else if (userRole === 'ngo') navLinks = ngoLinks;
  else if (userRole === 'super_admin') navLinks = adminLinks;
  else if (userRole === 'fertilizer') navLinks = fertilizerLinks;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      
      {/* Desktop Left Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-40 transition-transform duration-300 shadow-sm`}>
        <div className="p-6">
          {/* Brand Lockup */}
          <div className="flex items-center gap-2">
            <img 
              src="/image-removebg-preview.png" 
              alt="AnnaSetu Logo" 
              className="h-10"
            />
            <div>
              <p className="text-[10px] font-bold text-saffron-600 uppercase tracking-wide">
                {userRole === 'super_admin' ? 'Admin Portal' : userRole === 'ngo' ? 'NGO Portal' : userRole === 'fertilizer' ? 'Bio-Processor Portal' : 'Donor Portal'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (location.pathname.startsWith(link.path) && link.path !== '/dashboard/business');
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-annagreen-50 text-annagreen-600 border border-annagreen-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-annagreen-600' : 'text-slate-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="px-3 py-2 mb-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 truncate font-medium">
            {currentUser?.email}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <img 
          src="/image-removebg-preview.png" 
          alt="AnnaSetu Logo" 
          className="h-8"
        />
        <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-500">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 w-full min-h-screen pt-16 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-2 py-2 pb-safe flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path || (location.pathname.startsWith(link.path) && link.path !== '/dashboard/business');
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive ? 'text-annagreen-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110 drop-shadow-sm' : ''}`} />
              <span className="text-[9px] font-bold tracking-wide">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
