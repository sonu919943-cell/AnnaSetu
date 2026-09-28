import React from 'react';
import { ArrowRight, Leaf, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-12">
      <section className="relative pt-6 pb-12 px-4 lg:px-8 overflow-hidden rounded-3xl bg-gradient-to-b from-darkbg-800 via-darkbg-900 to-darkbg-900 border border-annagreen-500/20 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-annagreen-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-saffron-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-5xl mx-auto text-center relative z-10 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-annagreen-500/15 border border-annagreen-500/30 text-annagreen-300 text-xs font-semibold tracking-wide">
            <Leaf className="w-3.5 h-3.5 text-annagreen-400" /> SIH 2026 Innovation Brief · Food Loss & Waste Reduction
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Bridging Food Surplus from <br />
            <span className="bg-gradient-to-r from-annagreen-400 via-emerald-300 to-saffron-400 bg-clip-text text-transparent">
              Plate to Purpose
            </span> Before It Spoils
          </h1>

          <p className="max-w-3xl mx-auto text-slate-300 text-base md:text-lg leading-relaxed">
            AnnaSetu is an AI-powered platform for institutional kitchens that predicts food surplus before it’s cooked, verifies freshness in real time, matches edible meals to nearby verified NGOs in <span className="text-emerald-400 font-semibold">&lt;200ms</span>, and routes spoiled waste to Bio-CNG.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-2xl bg-darkbg-800/80 border border-red-500/20 text-left flex items-start gap-4 shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-red-400">78M</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">India’s Food Waste Crisis</p>
                <p className="text-sm font-bold text-white mt-0.5">78 Million Tonnes Wasted Annually</p>
                <p className="text-xs text-slate-400">Institutional kitchens lose 10-15% of food budget</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-2xl bg-darkbg-800/80 border border-saffron-500/20 text-left flex items-start gap-4 shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-saffron-500/10 border border-saffron-500/30 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-saffron-400">₹1.55L</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Annual Financial Loss</p>
                <p className="text-sm font-bold text-white mt-0.5">₹1.55 Lakh Crore Value Dumped</p>
                <p className="text-xs text-slate-400">Fines up to ₹25,000/day under SWM Rules 2016</p>
              </div>
            </motion.div>
          </div>

          <div className="pt-6">
            <Link
              to="/login"
              className="inline-flex px-6 py-3.5 rounded-xl bg-gradient-to-r from-annagreen-600 to-annagreen-500 hover:from-annagreen-500 hover:to-annagreen-400 text-white font-bold text-sm shadow-xl shadow-annagreen-900/40 ring-1 ring-annagreen-300/40 transition-all items-center gap-2 transform hover:-translate-y-0.5"
            >
              Log in to Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
