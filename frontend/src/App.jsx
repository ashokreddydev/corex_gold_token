import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BuyPage from './pages/BuyPage';
import RedeemPage from './pages/RedeemPage';
import MintPage from './pages/MintPage';
import BurnPage from './pages/BurnPage';
import HistoryPage from './pages/HistoryPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

// Theme configuration
const antTheme = {
  token: {
    colorPrimary: '#FFD700',
    borderRadius: 8,
  },
};

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ConfigProvider theme={antTheme}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute isAuthenticated={!!user}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/redeem" element={<RedeemPage />} />
            <Route path="/mint" element={<MintPage />} />
            <Route path="/burn" element={<BurnPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute isAuthenticated={!!user} isAdmin={user?.role === 'admin'}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
