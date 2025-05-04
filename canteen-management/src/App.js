import React from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import BuyerDashboard from './components/buyer/BuyerDashboard';
import SellerDashboard from './components/seller/SellerDashboard';
import Cart from './components/buyer/Cart';
import OrderHistory from './components/buyer/OrderHistory';
import SellerOrderHistory from './components/seller/OrderHistory';
import ProductManagement from './components/seller/ProductManagement';
import QRScanner from './components/seller/QRScanner';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/buyer" replace />} />
              
              {/* Buyer Routes */}
              <Route path="/buyer" element={<BuyerDashboard />} />
              <Route 
                path="/buyer/cart" 
                element={
                  <ProtectedRoute allowedRole="buyer">
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/buyer/orders" 
                element={
                  <ProtectedRoute allowedRole="buyer">
                    <OrderHistory />
                  </ProtectedRoute>
                } 
              />

              {/* Seller Routes */}
              <Route 
                path="/seller" 
                element={
                  <ProtectedRoute allowedRole="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seller/orders" 
                element={
                  <ProtectedRoute allowedRole="seller">
                    <SellerOrderHistory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seller/products" 
                element={
                  <ProtectedRoute allowedRole="seller">
                    <ProductManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seller/scanner" 
                element={
                  <ProtectedRoute allowedRole="seller">
                    <QRScanner />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
