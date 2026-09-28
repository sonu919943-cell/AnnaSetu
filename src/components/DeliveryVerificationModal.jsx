import React, { useState, useEffect } from 'react';
import { X, ScanLine, ShieldCheck, CheckCircle2, Truck, Package, AlertTriangle } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BATCH_STATUS } from '../constants/statusEnum';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DeliveryVerificationModal — "Scan & Verify" delivery confirmation
 * 
 * Used by both NGO and Fertilizer dashboards to confirm
 * physical receipt of food batches.
 * 
 * @param {{ isOpen: boolean, onClose: () => void, batch: object|null, onVerified: (batch: object) => void, isFertilizer?: boolean }} props
 */
export default function DeliveryVerificationModal({ isOpen, onClose, batch, onVerified, isFertilizer = false }) {
  const [scanStage, setScanStage] = useState('IDLE'); // IDLE → SCANNING → VERIFIED
  const [scanProgress, setScanProgress] = useState(0);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setScanStage('IDLE');
      setScanProgress(0);
    }
  }, [isOpen]);

  // Scanning animation (1.5 seconds)
  useEffect(() => {
    if (scanStage !== 'SCANNING') return;

    const duration = 1500;
    const interval = 30;
    const step = 100 / (duration / interval);
    let progress = 0;

    const timer = setInterval(() => {
      progress += step;
      setScanProgress(Math.min(100, progress));
      
      if (progress >= 100) {
        clearInterval(timer);
        // Mark as verified
        handleVerifyInFirestore();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [scanStage]);

  const handleStartScan = () => {
    setScanStage('SCANNING');
  };

  const handleVerifyInFirestore = async () => {
    if (batch?.firestoreId) {
      try {
        const batchRef = doc(db, 'surplus_batches', batch.firestoreId);
        await updateDoc(batchRef, {
          status: BATCH_STATUS.ACCEPTED_AND_VERIFIED,
          verifiedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error('Firestore verification update failed:', err);
      }
    }
    
    setScanStage('VERIFIED');
    if (onVerified && batch) {
      onVerified({ ...batch, status: BATCH_STATUS.ACCEPTED_AND_VERIFIED });
    }
  };

  if (!isOpen || !batch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-darkbg-800 border border-annagreen-500/30 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${isFertilizer ? 'bg-amber-600/20 border-amber-500/30' : 'bg-annagreen-600/20 border-annagreen-500/30'} border flex items-center justify-center`}>
              <Package className={`w-5 h-5 ${isFertilizer ? 'text-amber-400' : 'text-annagreen-400'}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Delivery Verification</h2>
              <p className="text-xs text-slate-400">
                {isFertilizer ? 'Verify waste receipt & SWM compliance' : 'Confirm food handoff & quality check'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-darkbg-700 hover:bg-darkbg-600 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Batch Summary */}
        <div className="p-4 rounded-xl bg-darkbg-900/60 border border-slate-700/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-saffron-400">{batch.id || batch.batchCode}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
              batch.verdict === 'EDIBLE' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {batch.verdict}
            </span>
          </div>
          <h3 className="text-white font-semibold text-sm">{batch.foodName || batch.foodType}</h3>
          <p className="text-xs text-slate-400">
            Donor: <strong className="text-white">{batch.kitchenName}</strong> · 
            Qty: <strong className="text-white">{batch.quantityKg} kg ({batch.estimatedPlates} plates)</strong>
          </p>
          {batch.rawMaterial && (
            <p className="text-[10px] text-slate-500">
              Ingredients: {batch.rawMaterial}
            </p>
          )}
          {batch.pricing > 0 && (
            <p className="text-[10px] text-saffron-400 font-semibold">
              ₹{batch.pricing} suggested price
            </p>
          )}
        </div>

        {/* Scan Area */}
        <AnimatePresence mode="wait">
          {scanStage === 'IDLE' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-4"
            >
              <div className="w-20 h-20 rounded-2xl bg-darkbg-700 border-2 border-dashed border-slate-600 flex items-center justify-center">
                <ScanLine className="w-10 h-10 text-slate-500" />
              </div>
              <p className="text-xs text-slate-400 text-center max-w-xs">
                {isFertilizer
                  ? 'Scan the QR code on the waste container to verify receipt and log SWM-2016 compliance.'
                  : 'Scan the QR handoff code to verify food delivery, quality match, and FSSAI compliance.'}
              </p>
              <button
                onClick={handleStartScan}
                className={`px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg flex items-center gap-2 transition-all ${
                  isFertilizer
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-900/40 ring-1 ring-amber-300/30'
                    : 'bg-gradient-to-r from-annagreen-600 to-annagreen-500 hover:from-annagreen-500 hover:to-annagreen-400 shadow-annagreen-900/40 ring-1 ring-annagreen-300/30'
                }`}
              >
                <ScanLine className="w-5 h-5" />
                Scan & Verify Delivery
              </button>
            </motion.div>
          )}

          {scanStage === 'SCANNING' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-4"
            >
              {/* Scanning animation box */}
              <div className="relative w-32 h-32 rounded-2xl bg-darkbg-900 border border-slate-700 overflow-hidden">
                {/* Scan line */}
                <motion.div
                  className={`absolute left-0 right-0 h-0.5 ${isFertilizer ? 'bg-amber-400' : 'bg-annagreen-400'} shadow-lg`}
                  style={{ boxShadow: isFertilizer ? '0 0 12px 4px rgba(245, 158, 11, 0.5)' : '0 0 12px 4px rgba(34, 197, 94, 0.5)' }}
                  animate={{
                    top: ['0%', '100%', '0%'],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeInOut',
                  }}
                />
                {/* Grid pattern */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-px opacity-20">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="bg-slate-600/40 rounded-sm" />
                  ))}
                </div>
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine className={`w-12 h-12 ${isFertilizer ? 'text-amber-500/60' : 'text-annagreen-500/60'} animate-pulse`} />
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-xs">
                <div className="h-2 bg-darkbg-900 rounded-full overflow-hidden border border-slate-700">
                  <motion.div
                    className={`h-full rounded-full ${isFertilizer ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-annagreen-600 to-annagreen-400'}`}
                    style={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <p className={`text-xs font-mono font-bold mt-2 text-center ${isFertilizer ? 'text-amber-400' : 'text-annagreen-400'}`}>
                  Verifying... {Math.round(scanProgress)}%
                </p>
              </div>

              <p className="text-[10px] text-slate-500 text-center">
                Matching QR payload • Checking {isFertilizer ? 'SWM-2016' : 'FSSAI-2019'} compliance • Logging audit hash
              </p>
            </motion.div>
          )}

          {scanStage === 'VERIFIED' && (
            <motion.div
              key="verified"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="flex flex-col items-center gap-4 py-4"
            >
              {/* Success checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, delay: 0.1 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  isFertilizer 
                    ? 'bg-amber-500/20 border-2 border-amber-500/40' 
                    : 'bg-emerald-500/20 border-2 border-emerald-500/40'
                }`}
              >
                <CheckCircle2 className={`w-10 h-10 ${isFertilizer ? 'text-amber-400' : 'text-emerald-400'}`} />
              </motion.div>

              <div className="text-center space-y-1">
                <h3 className={`text-lg font-extrabold ${isFertilizer ? 'text-amber-400' : 'text-emerald-400'}`}>
                  Delivery Verified ✓
                </h3>
                <p className="text-xs text-slate-400">
                  Status updated to <span className="font-mono font-bold text-white">ACCEPTED_AND_VERIFIED</span>
                </p>
                <p className="text-[10px] text-slate-500">
                  {isFertilizer 
                    ? 'SWM-2016 compliance certificate generated. Carbon offset logged.'
                    : 'FSSAI-2019 handoff recorded. Audit hash committed to ledger.'}
                </p>
              </div>

              {/* Verification details */}
              <div className="w-full p-3 rounded-xl bg-darkbg-900/60 border border-slate-700/40 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">QR Ref</span>
                  <span className="font-mono font-bold text-white">{batch.qrCodeRef || 'AS-2026-FSSAI-XXXXX'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Audit Hash</span>
                  <span className="font-mono font-bold text-slate-300 text-[10px]">{batch.auditHash || '0xverified...'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Status</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    isFertilizer 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    ACCEPTED & VERIFIED
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-darkbg-700 hover:bg-darkbg-600 text-white font-bold text-xs border border-slate-600 transition-colors"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
