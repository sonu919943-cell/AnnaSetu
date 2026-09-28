import AdminDashboardComponent from '../../components/AdminDashboard';
import MonetizationSection from '../../components/MonetizationSection';
import UserManagement from '../../components/UserManagement';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function AdminDashboard() {
  const location = useLocation();
  const showMonetization = location.pathname.includes('/monetization');
  const showUsers = location.pathname.includes('/users');

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-16"
    >
      {showUsers ? (
        <UserManagement />
      ) : showMonetization ? (
        <MonetizationSection />
      ) : (
        <AdminDashboardComponent />
      )}
    </motion.div>
  );
}
