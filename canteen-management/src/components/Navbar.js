import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login';

const Navbar = () => {
  const { user, logout, isSeller, isBuyer } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Canteen Management
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Buyer Links */}
            {isBuyer && (
              <>
                <Button color="inherit" component={Link} to="/buyer">
                  Menu
                </Button>
                <Button color="inherit" component={Link} to="/buyer/cart">
                  Cart
                </Button>
                <Button color="inherit" component={Link} to="/buyer/orders">
                  My Orders
                </Button>
              </>
            )}
            
            {/* Seller Links */}
            {isSeller && (
              <>
                <Button color="inherit" component={Link} to="/seller">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/seller/orders">
                  Orders
                </Button>
                <Button color="inherit" component={Link} to="/seller/products">
                  Products
                </Button>
              </>
            )}

            {/* Authentication */}
            {user ? (
              <>
                <Avatar
                  sx={{ cursor: 'pointer', bgcolor: 'secondary.main' }}
                  onClick={handleProfileClick}
                >
                  {user.username[0].toUpperCase()}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem disabled>
                    {user.username} ({user.role})
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" onClick={() => setLoginOpen(true)}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Login open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Navbar;
