import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Tracking from './pages/Tracking';
import QuoteCalculator from './pages/QuoteCalculator';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
// import StaffDashboard from './pages/StaffDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Dashboard Router
const DashboardRouter = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminDashboard />;}
  // } else if (user?.role === 'staff') {
  //   return <StaffDashboard />;
  // } 
  else {
    return <CustomerDashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background-secondary">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/tracking/:trackingNumber" element={<Tracking />} />
            <Route path="/quote" element={<QuoteCalculator />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;