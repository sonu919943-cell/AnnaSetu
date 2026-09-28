import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import PortfolioLayout from './layouts/PortfolioLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Portfolio Pages
import HomePage from './pages/portfolio/HomePage';
import FeaturesPage from './pages/portfolio/FeaturesPage';
import HowItWorksPage from './pages/portfolio/HowItWorksPage';
import PricingPage from './pages/portfolio/PricingPage';

// Auth & Dashboard Pages
import LoginPage from './pages/LoginPage';
import BusinessDashboard from './pages/dashboard/BusinessDashboard';
import NgoDashboard from './pages/dashboard/NgoDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import FertilizerDashboard from './pages/dashboard/FertilizerDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Portfolio Routes */}
          <Route element={<PortfolioLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Route>

          {/* Public Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            {/* Business / Kitchen Routes */}
            <Route element={<ProtectedRoute allowedRoles={['business']} />}>
              <Route path="/dashboard/business" element={<BusinessDashboard />} />
              <Route path="/dashboard/business/scan" element={<BusinessDashboard />} />
              <Route path="/dashboard/business/matching" element={<BusinessDashboard />} />
              <Route path="/dashboard/business/spoiled" element={<BusinessDashboard />} />
            </Route>

            {/* NGO Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ngo']} />}>
              <Route path="/dashboard/ngo" element={<NgoDashboard />} />
              <Route path="/dashboard/ngo/claims" element={<NgoDashboard />} />
            </Route>

            {/* Fertilizer / Bio-Processor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['fertilizer']} />}>
              <Route path="/dashboard/fertilizer" element={<FertilizerDashboard />} />
              <Route path="/dashboard/fertilizer/processed" element={<FertilizerDashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/admin/monetization" element={<AdminDashboard />} />
              <Route path="/dashboard/admin/users" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
