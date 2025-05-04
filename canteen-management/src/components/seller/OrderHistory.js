import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}`, { status: newStatus });
      loadOrders(); // Reload orders to show updated status
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
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
          Order Management
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
            No orders found
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>
        Order Management
      </Typography>
      
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                      Order #{order._id}
                    </Typography>
                    <Typography color="textSecondary">
                      Customer: {order.userId?.username || 'Unknown'}
                    </Typography>
                    <Typography color="textSecondary">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
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
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                      <FormControl fullWidth style={{ marginBottom: '10px' }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={order.status}
                          label="Status"
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OrderHistory;
