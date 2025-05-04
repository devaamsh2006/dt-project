import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { useCart } from '../../context/CartContext';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Delete } from '@mui/icons-material';
import QRCode from 'react-qr-code';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, getTotal } = useCart();
  const [showQR, setShowQR] = useState(false);
  const [orderId, setOrderId] = useState(null);



  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        alert('Your cart is empty');
        return;
      }

      const orderData = {
        items: cartItems.map(item => ({
          name: item.name,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price),
          productId: item._id
        })),
        total: parseFloat(getTotal())
      };

      console.log('Sending order data:', orderData);
      const response = await axios.post(`${API_URL}/orders`, orderData);
      console.log('Order response:', response.data);

      const order = response.data;
      setOrderId(order._id);
      setShowQR(true);
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Failed to create order: ${error.response.data.message || 'Unknown error'}`);
      } else {
        alert('Failed to create order. Please check your connection and try again.');
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>
        Shopping Cart
      </Typography>
      
      <List>
        {cartItems.map((item) => (
          <ListItem key={item._id}>
            <ListItemText
              primary={item.name}
              primary={item.name}
              secondary={`Quantity: ${item.quantity || 1} | $${(item.price * (item.quantity || 1)).toFixed(2)}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => removeFromCart(item._id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" style={{ margin: '20px 0' }}>
        Total: ${getTotal()}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCheckout}
        disabled={cartItems.length === 0}
      >
        Checkout
      </Button>

      <Dialog open={showQR} onClose={() => setShowQR(false)}>
        <DialogTitle>Order QR Code</DialogTitle>
        <DialogContent style={{ padding: '20px', textAlign: 'center' }}>
          {orderId && (
            <>
              <QRCode value={orderId} />
              <Typography style={{ marginTop: '20px' }}>
                Order ID: {orderId}
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

export default Cart;
