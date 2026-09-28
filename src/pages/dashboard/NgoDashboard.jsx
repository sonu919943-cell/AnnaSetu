import React from 'react';
import NgoRoleView from '../../components/NgoRoleView';
import { INITIAL_SURPLUS_ITEMS } from '../../data/mockData';
import { motion } from 'framer-motion';

export default function NgoDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <NgoRoleView
        surplusItems={INITIAL_SURPLUS_ITEMS}
        onScanQrCode={() => {
          alert('QR Scan Verified! Hand-off completed.');
        }}
      />
    </motion.div>
  );
}
