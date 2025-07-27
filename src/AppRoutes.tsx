import { Routes, Route } from 'react-router-dom';
import DummyPage1 from './pages/DummyPage1';
import DummyPage2 from './pages/DummyPage2';
import DummyPage3 from './pages/DummyPage3';
import SeatBookingPage from './pages/SeatBookingPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DummyPage1 />} />
      <Route path="/page2" element={<DummyPage2 />} />
      <Route path="/page3" element={<DummyPage3 />} />
      <Route path="/seat-booking" element={<SeatBookingPage />} />
    </Routes>
  );
}
