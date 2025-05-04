import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const ProductManagement = () => {
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

  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', imageUrl: '' });

  const handleOpen = (product = null) => {
    if (product) {
      setEditProduct(product);
      setFormData({ name: product.name, price: product.price, imageUrl: product.imageUrl || '' });
    } else {
      setEditProduct(null);
      setFormData({ name: '', price: '', imageUrl: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditProduct(null);
    setFormData({ name: '', price: '' });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.imageUrl) {
      alert('Please fill in all fields');
      return;
    }

    if (editProduct) {
      try {
        await axios.put(`${API_URL}/products/${editProduct._id}`, {
          name: formData.name,
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl
        });
        await loadProducts(); // Reload products after update
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product');
      }
    } else {
      try {
        await axios.post(`${API_URL}/products`, {
          name: formData.name,
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl
        });
        await loadProducts(); // Reload products after adding
      } catch (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product');
      }
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      await loadProducts(); // Reload products after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>
        Manage Menu Items
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpen()}
        style={{ marginBottom: '20px' }}
      >
        Add New Item
      </Button>

      <List>
        {products.map((product) => (
          <ListItem key={product._id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <ListItemText
                primary={product.name}
                secondary={`$${product.price.toFixed(2)}`}
              />
            </div>
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleOpen(product)} style={{ marginRight: '8px' }}>
                <Edit />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(product._id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editProduct ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            helperText="Enter a valid image URL (e.g., https://example.com/image.jpg)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editProduct ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductManagement;
