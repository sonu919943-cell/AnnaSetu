import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import KitchenDashboard from '../../components/KitchenDashboard';
import AiQualityScanView from '../../components/AiQualityScanView';
import NgoMatchingView from '../../components/NgoMatchingView';
import SpoiledRoutingView from '../../components/SpoiledRoutingView';
import SurplusLogModal from '../../components/SurplusLogModal';
import { INITIAL_SURPLUS_ITEMS } from '../../data/mockData';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BusinessDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedKitchenId, setSelectedKitchenId] = useState('k1');
  const [surplusItems, setSurplusItems] = useState(INITIAL_SURPLUS_ITEMS);
  const [activeItem, setActiveItem] = useState(INITIAL_SURPLUS_ITEMS[0]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSubmitBatch = (newBatch) => {
    setSurplusItems(prev => [newBatch, ...prev]);
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

  const handleConfirmNgoDispatch = (item, ngo) => {
    setSurplusItems(prev => prev.map(i => i.id === item.id ? {
      ...i,
      status: 'Edible-Matched',
      assignedNgo: ngo.name,
      matchedEta: `${ngo.etaMins} mins`
    } : i));
    showToast(`${ngo.name} accepted the pickup! QR Code Handoff generated.`, 'success');
  };

  const handleConfirmSpoiledRouting = (item, processor) => {
    setSurplusItems(prev => prev.map(i => i.id === item.id ? {
      ...i,
      status: 'Spoiled-Routed',
      assignedProcessor: processor.name,
      matchedEta: 'Collected for Bio-CNG'
    } : i));
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
