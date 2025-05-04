import React from 'react';
import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Add, QrCode } from '@mui/icons-material';

const SellerDashboard = () => {
  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>
        Seller Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Manage Products
            </Typography>
            <Button
              component={Link}
              to="/seller/products"
              variant="contained"
              color="primary"
              startIcon={<Add />}
            >
              Manage Menu Items
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Scan Orders
            </Typography>
            <Button
              component={Link}
              to="/seller/scanner"
              variant="contained"
              color="secondary"
              startIcon={<QrCode />}
            >
              Open QR Scanner
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SellerDashboard;
