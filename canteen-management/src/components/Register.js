import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Register = ({ open, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const result = await register(username, password);
    if (result.success) {
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Register</DialogTitle>
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
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Register</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Register;
