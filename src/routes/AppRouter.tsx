import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PlayerPage } from '@/pages/player/PlayerPage';
import { LoginPage } from '@/pages/admin/LoginPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { EventDetailPage } from '@/pages/admin/EventDetailPage';
import { useUser } from '@/context/UserContext';
import { Loader2 } from 'lucide-react';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Player Routes */}
      <Route path="/event/:eventId" element={<PlayerPage />} />
      <Route path="/player/:eventId" element={<PlayerPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/event/:eventId"
        element={
          <ProtectedRoute>
            <EventDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Root redirect - can be customized based on default behavior */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      
      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

