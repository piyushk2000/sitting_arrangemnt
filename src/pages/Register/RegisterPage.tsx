import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    console.log('Register attempt:', { name, email, password });
    // TODO: register user; then:
    navigate('/login');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 360,
        mx: 'auto',
        mt: 8,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        boxShadow: 1,
        borderRadius: 1
      }}
    >
      <Typography variant="h5" textAlign="center">Register</Typography>
      <TextField
        label="Name"
        required
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <TextField
        label="Email"
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <TextField
        label="Confirm Password"
        type="password"
        required
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
      />
      <Button type="submit" variant="contained">Register</Button>
      <Typography variant="body2" textAlign="center">
        Already have an account?{' '}
        <Link component={RouterLink} to="/login">Login</Link>
      </Typography>
    </Box>
  );
}
