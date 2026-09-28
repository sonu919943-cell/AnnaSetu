import React from 'react';
import { Utensils, Zap, ShieldCheck, RefreshCw, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorksPage() {
  const steps = [
    { num: '01', title: 'Data Logging', desc: 'Kitchen staff inputs meal prep time, weight & photo', icon: Utensils, color: 'text-emerald-400' },
    { num: '02', title: 'AI Prediction', desc: 'Forecasts surplus before cooking using calendar/weather', icon: Zap, color: 'text-amber-400' },
    { num: '03', title: 'FSSAI Quality Scan', desc: 'Grades edibility & 2-4hr decay window in seconds', icon: ShieldCheck, color: 'text-emerald-400' },
    { num: '04', title: 'Smart Dispatch', desc: '<200ms match to nearby NGOs; bio-route for spoiled', icon: RefreshCw, color: 'text-saffron-400' },
    { num: '05', title: 'Live Tracking', desc: 'Real-time ETA, route optimization & claim window timer', icon: Users, color: 'text-emerald-400' },
    { num: '06', title: 'Digital Audit Trail', desc: '100% compliant QR handoff records for FSSAI/SWM', icon: Award, color: 'text-emerald-300' },
  ];

  return (
    <div className="space-y-12 pb-12 pt-6">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          How AnnaSetu Works
        </h1>
        <p className="text-slate-400 text-lg">
          A seamless, automated lifecycle from the kitchen to the recipient.
        </p>
      </div>

      <div className="relative">
        {/* Connecting line for desktop */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-annagreen-500/50 to-transparent -translate-x-1/2"></div>
        
        <div className="space-y-8 relative">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-6 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 w-full">
                <div className="p-6 rounded-3xl glass-card border border-annagreen-500/20 text-center md:text-left">
                  <span className="text-4xl font-extrabold text-white/10 block mb-2">{step.num}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-300">{step.desc}</p>
                </div>
              </div>
              
              <div className="w-16 h-16 rounded-full bg-darkbg-900 border-4 border-darkbg-800 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] z-10 hidden md:flex">
                <step.icon className={`w-6 h-6 ${step.color}`} />
              </div>
              
              <div className="flex-1 hidden md:block"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
