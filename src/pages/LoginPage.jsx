import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, ArrowRight, Lock, Mail, AlertTriangle, Factory } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('business'); // 'business' or 'ngo'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      
      // The ProtectedRoute will auto-redirect them to the right dashboard based on their role
      // We'll just push to a generic dashboard route and let the logic handle it
      navigate('/dashboard/business');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkbg-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-annagreen-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-saffron-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <img 
            src="/image-removebg-preview.png" 
            alt="AnnaSetu Logo" 
            className="h-16 mx-auto mb-4 drop-shadow-md"
          />
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-2">Sign in to your AnnaSetu portal</p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8">
          
          {/* Role Tabs */}
          <div className="flex p-1.5 bg-slate-100/80 rounded-xl mb-6 gap-1 shadow-inner border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('business')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === 'business' 
                  ? 'bg-white text-annagreen-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              Business
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ngo')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === 'ngo' 
                  ? 'bg-white text-saffron-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              NGO
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fertilizer')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === 'fertilizer' 
                  ? 'bg-white text-amber-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              Bio-Processor
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-annagreen-500 focus:ring-2 focus:ring-annagreen-500/20 transition-all shadow-sm"
                  placeholder="name@organization.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 ml-1">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-annagreen-500 focus:ring-2 focus:ring-annagreen-500/20 transition-all shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-annagreen-500 to-annagreen-600 hover:from-annagreen-600 hover:to-annagreen-700 text-white font-bold text-sm shadow-lg shadow-annagreen-500/30 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-500">
            <p>Admin? Please log in via the Business portal.</p>
            <p className="mt-2 text-annagreen-600">Default demo: Any email/password will work if Firebase is bypassed.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
