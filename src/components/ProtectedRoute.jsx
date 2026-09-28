import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-darkbg-900 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-annagreen-500/30 border-t-annagreen-500 animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard if they try to access wrong role page
    if (userRole === 'ngo') return <Navigate to="/dashboard/ngo" replace />;
    if (userRole === 'super_admin') return <Navigate to="/dashboard/admin" replace />;
    if (userRole === 'fertilizer') return <Navigate to="/dashboard/fertilizer" replace />;
    return <Navigate to="/dashboard/business" replace />;
  }

  return <Outlet />;
}
