import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Alert,
  Box,
  Typography
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Register from './Register';

const Login = ({ open, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registerOpen, setRegisterOpen] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(username, password);
    if (result.success) {
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError(result.message);
    }
  };

  const handleRegisterClick = () => {
    setRegisterOpen(true);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Login</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              autoFocus
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Box textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Button
                  color="primary"
                  onClick={handleRegisterClick}
                  sx={{ textTransform: 'none' }}
                >
                  Register here
                </Button>
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">Login</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Register open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </>
  );
};

export default Login;
