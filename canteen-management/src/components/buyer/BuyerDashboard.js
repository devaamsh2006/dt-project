import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Container } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';

const BuyerDashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const { addToCart } = useCart();

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>
        Menu Items
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.imageUrl || 'https://via.placeholder.com/150'}
                alt={product.name}
                style={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ${product.price}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCart />}
                  onClick={() => addToCart(product)}
                  style={{ marginTop: '10px' }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BuyerDashboard;
