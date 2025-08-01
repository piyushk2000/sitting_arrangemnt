import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // TODO: add real auth; then:
    navigate('/seat-booking');
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
      <Typography variant="h5" textAlign="center">Login</Typography>
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
      <Button type="submit" variant="contained">Login</Button>
      <Typography variant="body2" textAlign="center">
        Don't have an account?{' '}
        <Link component={RouterLink} to="/register">Register</Link>
      </Typography>
    </Box>
  );
}
