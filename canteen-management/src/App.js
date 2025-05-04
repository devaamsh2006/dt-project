import React from 'react';
import { CartProvider } from './context/CartContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import BuyerDashboard from './components/buyer/BuyerDashboard';
import SellerDashboard from './components/seller/SellerDashboard';
import Cart from './components/buyer/Cart';
import OrderHistory from './components/buyer/OrderHistory';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <div className="App">
          <Navbar />
          <Routes>
          <Route path="/" element={<Navigate to="/buyer" replace />} />
          <Route path="/buyer" element={<BuyerDashboard />} />
          <Route path="/buyer/cart" element={<Cart />} />
          <Route path="/buyer/orders" element={<OrderHistory />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<ProductManagement />} />
          <Route path="/seller/scanner" element={<QRScanner />} />
          </Routes>
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
