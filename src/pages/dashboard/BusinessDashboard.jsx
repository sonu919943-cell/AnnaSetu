import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import KitchenDashboard from '../../components/KitchenDashboard';
import AiQualityScanView from '../../components/AiQualityScanView';
import NgoMatchingView from '../../components/NgoMatchingView';
import SpoiledRoutingView from '../../components/SpoiledRoutingView';
import SurplusLogModal from '../../components/SurplusLogModal';
import { INITIAL_SURPLUS_ITEMS } from '../../data/mockData';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { BATCH_STATUS, NGO_WINDOW_MS } from '../../constants/statusEnum';

export default function BusinessDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [selectedKitchenId, setSelectedKitchenId] = useState('k1');
  const [liveBatches, setLiveBatches] = useState([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [activeItem, setActiveItem] = useState(INITIAL_SURPLUS_ITEMS[0]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Track active 30-min promotion timers to clean up on unmount
  const promotionTimers = useRef(new Map());

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ─── Firestore Real-Time Listener ───
  // Fetches ALL surplus_batches ordered by creation time (latest first)
  useEffect(() => {
    let unsubscribe = () => {};

    try {
      const q = query(
        collection(db, 'surplus_batches'),
        orderBy('createdAt', 'desc')
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const batches = snapshot.docs.map(d => ({
          firestoreId: d.id,
          id: d.data().batchCode || d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() || new Date(),
        }));
        setLiveBatches(batches);
        setIsLoadingLive(false);
      }, (error) => {
        console.error('Business dashboard Firestore listener error:', error);
        setIsLoadingLive(false);
      });
    } catch (err) {
      console.error('Business dashboard query setup error:', err);
      setIsLoadingLive(false);
    }

    return () => {
      unsubscribe();
      // Clear all promotion timers on unmount
      promotionTimers.current.forEach(timer => clearTimeout(timer));
      promotionTimers.current.clear();
    };
  }, []);

  // Merge live Firestore batches with demo data (demo as fallback)
  const surplusItems = liveBatches.length > 0
    ? [...liveBatches, ...INITIAL_SURPLUS_ITEMS]
    : INITIAL_SURPLUS_ITEMS;

  // ─── 30-Minute NGO Window Promotion Timer ───
  const startNgoPromotionTimer = (firestoreId) => {
    // Don't start duplicate timers
    if (promotionTimers.current.has(firestoreId)) return;

    const timerId = setTimeout(async () => {
      try {
        const batchRef = doc(db, 'surplus_batches', firestoreId);
        await updateDoc(batchRef, { 
          status: BATCH_STATUS.PENDING_FERTILIZER 
        });
        showToast('30-min NGO window expired. Batch now available to Fertilizer companies.', 'amber');
      } catch (err) {
        console.error('30-min timer promotion failed:', err);
      }
      promotionTimers.current.delete(firestoreId);
    }, NGO_WINDOW_MS);

    promotionTimers.current.set(firestoreId, timerId);
  };

  // ─── Handlers ───
  const handleSubmitBatch = (newBatch) => {
    // newBatch already written to Firestore by SurplusLogModal
    // Update local active item for the scan view navigation
    setActiveItem(newBatch);
    setIsLogModalOpen(false);
    navigate('/dashboard/business/scan');
    showToast(`Batch ${newBatch.id} logged! Running AI Quality Verification...`);
  };

  const handleStartVerification = (item) => {
    setActiveItem(item);
    navigate('/dashboard/business/scan');
  };

  const handleProceedToMatching = (item) => {
    setActiveItem(item);
    navigate('/dashboard/business/matching');
  };

  const handleProceedToSpoiledRouting = (item) => {
    setActiveItem(item);
    navigate('/dashboard/business/spoiled');
  };

  // Called by AiQualityScanView after scan completes and writes to Firestore
  const handleScanComplete = (item, verdict) => {
    if (verdict === 'EDIBLE' && item.firestoreId) {
      // Start the 30-minute NGO-exclusive window timer
      startNgoPromotionTimer(item.firestoreId);
      showToast(`AI Verdict: EDIBLE (Score: ${item.freshnessScore}/100). NGO 30-min window started.`, 'success');
    } else if (verdict === 'SPOILED') {
      showToast(`AI Verdict: SPOILED (Score: ${item.freshnessScore}/100). Routed to Bio-Processors.`, 'amber');
    }
  };

  const handleConfirmNgoDispatch = (item, ngo) => {
    showToast(`${ngo.name} accepted the pickup! QR Code Handoff generated.`, 'success');
  };

  const handleConfirmSpoiledRouting = (item, processor) => {
    showToast(`Batch diverted to ${processor.name}. SWM Certificate generated!`, 'amber');
  };

  const renderContent = () => {
    const path = location.pathname;
    
    if (path.includes('/scan')) {
      return (
        <AiQualityScanView
          item={activeItem}
          onProceedToMatching={handleProceedToMatching}
          onProceedToSpoiledRouting={handleProceedToSpoiledRouting}
          onBackToDashboard={() => navigate('/dashboard/business')}
          onScanComplete={handleScanComplete}
        />
      );
    }
    
    if (path.includes('/matching')) {
      return (
        <NgoMatchingView
          item={activeItem}
          onConfirmDispatch={handleConfirmNgoDispatch}
          onBackToDashboard={() => navigate('/dashboard/business')}
        />
      );
    }
    
    if (path.includes('/spoiled')) {
      return (
        <SpoiledRoutingView
          item={activeItem}
          onConfirmRouting={handleConfirmSpoiledRouting}
          onBackToDashboard={() => navigate('/dashboard/business')}
        />
      );
    }
    
    return (
      <KitchenDashboard
        surplusItems={surplusItems}
        onOpenLogModal={() => setIsLogModalOpen(true)}
        onStartVerification={handleStartVerification}
        onViewDetails={(item) => {
          setActiveItem(item);
          if (item.verdict === 'SPOILED') {
            navigate('/dashboard/business/spoiled');
          } else {
            navigate('/dashboard/business/matching');
          }
        }}
        selectedKitchenId={selectedKitchenId}
        setSelectedKitchenId={setSelectedKitchenId}
      />
    );
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 md:right-8 z-50"
          >
            <div className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 backdrop-blur-md ${
              toastMessage.type === 'amber'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-400/30'
                : toastMessage.type === 'info'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 ring-1 ring-blue-400/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-400/30'
            }`}>
              <Bell className="w-4 h-4 animate-pulse" />
              <span>{toastMessage.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>

      <SurplusLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSubmitBatch={handleSubmitBatch}
      />
    </div>
  );
}
