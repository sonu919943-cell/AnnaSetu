import React from 'react';
import NgoRoleView from '../../components/NgoRoleView';
import { INITIAL_SURPLUS_ITEMS } from '../../data/mockData';
import { motion } from 'framer-motion';

export default function FertilizerDashboard() {
  // Filter for spoiled items for demo mode
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
      />
    </motion.div>
  );
}
