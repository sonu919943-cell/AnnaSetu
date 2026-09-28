import React from 'react';
import NgoRoleView from '../../components/NgoRoleView';
import { INITIAL_SURPLUS_ITEMS } from '../../data/mockData';
import { motion } from 'framer-motion';

export default function FertilizerDashboard() {
  // Filter for spoiled items
  const spoiledItems = INITIAL_SURPLUS_ITEMS.filter(i => i.verdict === 'SPOILED');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <NgoRoleView
        surplusItems={spoiledItems}
        isFertilizer={true}
        onScanQrCode={() => {
          alert('QR Scan Verified! SWM-2016 certificate logged.');
        }}
      />
    </motion.div>
  );
}
