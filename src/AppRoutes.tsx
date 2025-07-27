import { Routes, Route } from 'react-router-dom';
import SeatBookingPage from './pages/SeatBookingPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/seat-booking" element={<SeatBookingPage />} />
    </Routes>
  );
}
