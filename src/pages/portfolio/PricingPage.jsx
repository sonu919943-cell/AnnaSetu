import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingPage() {
  return (
    <div className="space-y-12 pb-12 pt-6">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          SaaS Pricing & ROI
        </h1>
        <p className="text-slate-400 text-lg">
          High-margin B2B SaaS model backed by automated biomass brokerage revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl bg-darkbg-800/90 border border-slate-700/60 hover:border-annagreen-500/40 transition-all flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Single Venue</span>
              <h3 className="text-2xl font-bold text-white mt-1">Starter</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white font-mono">₹3,000</span>
              <span className="text-sm text-slate-400 font-medium">/ mo</span>
            </div>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-annagreen-400 shrink-0" /> AI Surplus Forecasting</li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-annagreen-400 shrink-0" /> Quality Verification</li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-annagreen-400 shrink-0" /> Geo-Dispatch to NGOs</li>
            </ul>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-700/50 text-xs text-annagreen-400 font-semibold text-center">
            Avg Savings: ₹15,000 (5x ROI)
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-3xl bg-darkbg-800/95 border-2 border-annagreen-500 shadow-[0_0_30px_rgba(34,197,94,0.15)] relative flex flex-col justify-between transform md:-translate-y-4"
        >
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-l from-annagreen-500 to-annagreen-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-bl-xl rounded-tr-2xl">
            Most Popular
          </div>
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-saffron-300 uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> High Volume</span>
              <h3 className="text-2xl font-bold text-white mt-1">Pro</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-annagreen-400 font-mono">₹5,000</span>
              <span className="text-sm text-slate-400 font-medium">/ mo</span>
            </div>
            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-annagreen-400 shrink-0" /> Everything in Starter</li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-annagreen-400 shrink-0" /> &lt;200ms Priority Dispatch</li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-annagreen-400 shrink-0" /> Bio-CNG Integration</li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-annagreen-400 shrink-0" /> Exec Compliance Reports</li>
            </ul>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-700/50 text-xs text-saffron-300 font-bold text-center">
            Avg Savings: ₹32,000 (6.4x ROI)
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-3xl bg-darkbg-800/90 border border-saffron-500/30 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-saffron-400 uppercase tracking-wider">Secondary Revenue</span>
              <h3 className="text-2xl font-bold text-white mt-1">Biomass Brokerage</h3>
            </div>
            <p className="text-sm text-slate-300">
              Monetizing spoiled food waste diverted to Bio-CNG & BSFL.
            </p>
            <div className="p-4 rounded-xl bg-darkbg-900 border border-saffron-500/20 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Bio-CNG Rate:</span>
                <span className="text-saffron-300 font-bold">₹2.20/kg</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">BSFL Feed:</span>
                <span className="text-saffron-300 font-bold">₹3.00/kg</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Platform Take:</span>
                <span className="text-annagreen-400 font-bold">15% Fee</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-700/50 text-xs text-saffron-300 font-semibold text-center">
            Adds ₹1.2L+ / year in brokerage
          </div>
        </motion.div>
      </div>
    </div>
  );
}
