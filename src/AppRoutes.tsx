import { Routes, Route, Navigate } from 'react-router-dom';
import SeatBookingPage from './pages/SeatBooking/SeatBookingPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/seat-booking" element={<SeatBookingPage />} />
    </Routes>
  );
}
