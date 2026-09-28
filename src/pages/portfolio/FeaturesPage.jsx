import React from 'react';
import { ShieldCheck, Utensils, Heart, RefreshCw, BarChart3, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturesPage() {
  const features = [
    {
      icon: CloudRain,
      title: 'AI Demand Forecasting',
      desc: 'Predict surplus before cooking using calendar events and weather data, reducing over-preparation by 12-15%.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      icon: ShieldCheck,
      title: 'Real-time FSSAI Scanning',
      desc: 'Computer vision and thermal logs ensure food is edible and within the 2-4 hr decay window before dispatch.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      icon: RefreshCw,
      title: '<200ms Geo-Matching',
      desc: 'Automated dispatch connects edible surplus to nearby verified NGO shelters with guaranteed capacity.',
      color: 'text-saffron-400',
      bg: 'bg-saffron-500/10'
    },
    {
      icon: Heart,
      title: 'NGO Recipient App',
      desc: 'NGOs receive instant push alerts, can claim meals within 10 minutes, and track live ETA.',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10'
    },
    {
      icon: Utensils,
      title: 'Bio-CNG Diversion',
      desc: 'Spoiled food is locked from human consumption and automatically routed to Bio-CNG for carbon credits.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    {
      icon: BarChart3,
      title: 'Cryptographic Audit Trail',
      desc: '100% digital, immutable QR handoff records for SWM-2016 and FSSAI compliance reporting.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="space-y-12 pb-12 pt-6">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Next-Generation Features
        </h1>
        <p className="text-slate-400 text-lg">
          Everything you need to automate food waste reduction and compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl glass-card glass-card-hover border border-annagreen-500/20"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-white/5 ${feat.bg}`}>
              <feat.icon className={`w-6 h-6 ${feat.color}`} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
