import React from 'react';
import NgoRoleView from '../../components/NgoRoleView';
import { INITIAL_SURPLUS_ITEMS } from '../../data/mockData';
import { motion } from 'framer-motion';

export default function NgoDashboard() {
  // Filter to edible items for demo mode
  const edibleItems = INITIAL_SURPLUS_ITEMS.filter(i => i.verdict === 'EDIBLE');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <NgoRoleView
        surplusItems={edibleItems}
        isFertilizer={false}
      />
    </motion.div>
  );
}
