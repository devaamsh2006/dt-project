import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { Container, Typography, Card, CardContent, Grid, Button, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import QRCode from 'react-qr-code';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQR = (order) => {
    setSelectedOrder(order);
    setQrDialogOpen(true);
  };

  const handleCloseQR = () => {
    setQrDialogOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography>Loading orders...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container>
        <Typography variant="h4" style={{ margin: '20px 0' }}>
          Order History
        </Typography>
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="200px"
          bgcolor="#f5f5f5"
          borderRadius={2}
          p={3}
        >
          <Typography variant="h6" color="textSecondary">
            No orders found. Place an order to see it here!
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>
        Order History
      </Typography>
      
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order #{order._id}
                </Typography>
                <Typography color="textSecondary">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </Typography>
                <Typography color="textSecondary">
                  Status: {order.status}
                </Typography>
                <Typography variant="body1" style={{ marginTop: '10px' }}>
                  Items:
                </Typography>
                {order.items.map((item, index) => (
                  <Typography key={index}>
                    {item.productId?.name || 'Unknown Product'} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                ))}
                <Typography variant="h6" style={{ marginTop: '10px' }}>
                  Total: ${order.total.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewQR(order)}
                  style={{ marginTop: '10px' }}
                >
                  View QR Code
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={qrDialogOpen} onClose={handleCloseQR}>
        <DialogTitle>Order QR Code</DialogTitle>
        <DialogContent style={{ padding: '20px', textAlign: 'center' }}>
          {selectedOrder && (
            <>
              <QRCode value={selectedOrder._id} />
              <Typography style={{ marginTop: '20px' }}>
                Order ID: {selectedOrder._id}
              </Typography>
              <Typography style={{ marginTop: '10px' }}>
                Show this QR code to the seller to collect your order
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default OrderHistory;
