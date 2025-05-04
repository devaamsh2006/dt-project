import React, { useState, useRef } from 'react';
import { Container, Typography, Paper, Button, Box } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../../config';

const QRScanner = () => {
  const [scannedOrders, setScannedOrders] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFileInput = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      // For testing purposes, let's use a real order ID from our database
      const testOrderId = '6817bc40bfabdbc5376a4b8f';
      await handleOrderId(testOrderId);
    } catch (error) {
      console.error('Error reading QR code:', error);
      setResult({
        status: 'error',
        message: 'Failed to read QR code. Please try again.'
      });
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleOrderId = async (orderId) => {
    try {
      // Check if order was already scanned
      if (scannedOrders[orderId]) {
        setResult({
          orderId,
          status: 'already_served',
          message: 'This order has already been served!'
        });
        return;
      }

      // Fetch order details from backend
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      const order = response.data;

      // Mark order as served
      await axios.put(`${API_URL}/orders/${orderId}`, { status: 'completed' });
      setScannedOrders({ ...scannedOrders, [orderId]: true });

      setResult({
        orderId,
        status: 'new_order',
        message: 'Order found and marked as completed!',
        details: {
          orderId: order._id,
          items: order.items,
          timestamp: new Date(order.createdAt).toLocaleString(),
          total: order.total
        }
      });
    } catch (error) {
      console.error('Error processing order:', error);
      setResult({
        status: 'error',
        message: error.response?.data?.message || 'Failed to process order'
      });
    }
  };

  const handleError = (err) => {
    console.error('Error:', err);
    setResult({
      status: 'error',
      message: 'An error occurred while scanning. Please try again.'
    });
  };

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>
        QR Code Scanner
      </Typography>

      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <Box textAlign="center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Upload QR Code Image'}
          </Button>
        </Box>
      </Paper>

      {result && (
        <Paper style={{ 
          padding: '20px', 
          backgroundColor: 
            result.status === 'already_served' ? '#ffebee' : 
            result.status === 'error' ? '#fff3e0' : '#e8f5e9' 
        }}>
          <Typography variant="h6" gutterBottom>
            {result.message}
          </Typography>
          
          {result.details && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Order ID: {result.orderId}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Time: {result.details.timestamp}
              </Typography>
              <Typography variant="subtitle1">Items:</Typography>
              {result.details.items.map((item, index) => (
                <Typography key={index}>
                  - {item.name} x {item.quantity}
                </Typography>
              ))}
            </>
          )}
        </Paper>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => setResult(null)}
        style={{ marginTop: '20px' }}
      >
        Clear Result
      </Button>
    </Container>
  );
};

export default QRScanner;
