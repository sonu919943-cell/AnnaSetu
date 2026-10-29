import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-darkbg-900 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-annagreen-500/30 border-t-annagreen-500 animate-spin"></div>
      </div>
    );
  }

  // a) If no currentUser, navigate to /login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // b) If allowedRoles is provided but currentUser.role is not in the array, redirect
  const role = currentUser.role;
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    if (role === 'ngo') return <Navigate to="/dashboard/ngo" replace />;
    if (role === 'fertilizer') return <Navigate to="/dashboard/fertilizer" replace />;
    if (role === 'super_admin') return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/dashboard/business" replace />;
  }

  // c) Otherwise, return children
  return children ? children : <Outlet />;
}
