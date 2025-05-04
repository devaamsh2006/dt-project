import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { Container, Typography, Card, CardContent, Grid, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import QRCode from 'react-qr-code';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders');
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
                    {item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
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
