import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Canteen Management
        </Typography>
        
        {/* Buyer Links */}
        <Button color="inherit" component={Link} to="/buyer">
          Menu
        </Button>
        <Button color="inherit" component={Link} to="/buyer/cart">
          Cart
        </Button>
        <Button color="inherit" component={Link} to="/buyer/orders">
          Order History
        </Button>
        
        {/* Seller Links */}
        <Button color="inherit" component={Link} to="/seller">
          Seller Dashboard
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
