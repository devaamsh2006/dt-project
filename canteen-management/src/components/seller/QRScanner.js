import React, { useState, useRef } from 'react';
import { Container, Typography, Paper, Button, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../../config';

const QRScanner = () => {
  const [scannedOrders, setScannedOrders] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const canvasRef = useRef();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setResult(null);
      
      // Create an image element to load the file
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Draw the image to canvas
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Get the image data for QR detection
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Use jsQR to detect QR code
      const code = window.jsQR(
        imageData.data,
        imageData.width,
        imageData.height
      );

      if (code) {
        await handleOrderId(code.data);
      } else {
        setResult({
          status: 'error',
          message: 'No QR code found in the image. Please try another image.'
        });
      }

      // Clean up
      URL.revokeObjectURL(img.src);
    } catch (error) {
      console.error('Error processing image:', error);
      setResult({
        status: 'error',
        message: 'Failed to process the image. Please try again.'
      });
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleOrderId = async (orderId) => {
    try {
      setLoading(true);

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

      // Mark order as served using PATCH request
      await axios.patch(`${API_URL}/orders/${orderId}`, { status: 'completed' });
      setScannedOrders({ ...scannedOrders, [orderId]: true });

      setResult({
        orderId,
        status: 'new_order',
        message: 'Order found and marked as completed!',
        details: {
          orderId: order._id,
          items: order.items.map(item => ({
            name: item.productId?.name || 'Unknown Product',
            quantity: item.quantity,
            price: item.price
          })),
          timestamp: new Date(order.createdAt).toLocaleString(),
          total: order.total
        }
      });
    } catch (error) {
      console.error('Error processing order:', error);
      let errorMessage = 'Failed to process order';
      
      if (error.response?.status === 404) {
        errorMessage = 'Invalid QR code. Please try another image.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setResult({
        status: 'error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
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
            onChange={handleFileUpload}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
            style={{ marginBottom: '20px' }}
          >
            {loading ? 'Processing...' : 'Upload QR Code Image'}
          </Button>

          {loading && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          )}

          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
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
                Order ID: {result.details.orderId}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Time: {result.details.timestamp}
              </Typography>
              <Typography variant="subtitle1">Items:</Typography>
              {result.details.items.map((item, index) => (
                <Typography key={index}>
                  - {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              ))}
              <Typography variant="h6" style={{ marginTop: '10px' }}>
                Total: ${result.details.total.toFixed(2)}
              </Typography>
            </>
          )}
        </Paper>
      )}

      {result && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setResult(null);
          }}
          style={{ marginTop: '20px' }}
        >
          Scan Another QR Code
        </Button>
      )}
    </Container>
  );
};

export default QRScanner;
