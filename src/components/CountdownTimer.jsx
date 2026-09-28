import React, { useState, useEffect, useMemo } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

/**
 * CountdownTimer — Animated SVG radial countdown ring
 * 
 * Shows remaining time in a 30-minute NGO-exclusive window.
 * Color transitions: green (>15m) → amber (5–15m) → red (<5m) → EXPIRED
 * 
 * @param {{ createdAt: Date | { toDate: () => Date }, windowMinutes?: number }} props
 */
export default function CountdownTimer({ createdAt, windowMinutes = 30 }) {
  const expiryTime = useMemo(() => {
    const created = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
    return created.getTime() + windowMinutes * 60 * 1000;
  }, [createdAt, windowMinutes]);

  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, expiryTime - Date.now()));

  useEffect(() => {
    if (remainingMs <= 0) return;

    const interval = setInterval(() => {
      const newRemaining = Math.max(0, expiryTime - Date.now());
      setRemainingMs(newRemaining);
      if (newRemaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime, remainingMs]);

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isExpired = totalSeconds <= 0;

  // Progress fraction (1 = full, 0 = expired)
  const progress = Math.max(0, totalSeconds / (windowMinutes * 60));

  // Color logic: green → amber → red
  const getColor = () => {
    if (isExpired) return { stroke: '#ef4444', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
    if (minutes < 5)  return { stroke: '#ef4444', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
    if (minutes < 15) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { stroke: '#22c55e', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
  };

  const color = getColor();

  // SVG ring calculations
  const size = 64;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  if (isExpired) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${color.bg} border ${color.border}`}>
        <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
        <span className="text-xs font-bold text-red-400 uppercase tracking-wide">
          Window Expired
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${color.bg} border ${color.border}`}>
      {/* SVG Radial Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-700/40"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        {/* Digital timer inside ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[11px] font-mono font-extrabold ${color.text}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="flex flex-col">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${color.text}`}>
          NGO Window
        </span>
        <span className="text-[10px] text-slate-400">
          {minutes > 0 ? `${minutes}m ${seconds}s left` : `${seconds}s left`}
        </span>
      </div>
    </div>
  );
}
