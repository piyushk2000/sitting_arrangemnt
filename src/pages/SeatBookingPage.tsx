import { useState } from 'react';
import SeatCanvas, { Seat } from '../components/SeatCanvas';

export default function SeatBookingPage() {
  const [labelPrefix, setLabelPrefix] = useState<string>('A');
  const [startCount, setStartCount] = useState<number>(1);
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);

  // update seats and bump startCount to next unused number
  const handleSeatsUpdate = (updated: Seat[]) => {
    setSeats(updated);
    const nums = updated
      .map(s => parseInt(s.label.replace(labelPrefix, ''), 10))
      .filter(n => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : startCount - 1;
    setStartCount(max + 1);
  };

  return (
    <div style={{ padding: 16, height: '100vh', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 12 }}>
        <label>
          Prefix:{' '}
          <input
            value={labelPrefix}
            onChange={e => setLabelPrefix(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: 16 }}>
          Start Count:{' '}
          <input
            type="number"
            value={startCount}
            onChange={e => setStartCount(Number(e.target.value))}
            style={{ width: 60 }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) setBgUrl(URL.createObjectURL(file));
          }}
        />
        <button onClick={() => setMode(m => (m === 'edit' ? 'view' : 'edit'))}>
          Switch to {mode === 'edit' ? 'View' : 'Edit'} Mode
        </button>
      </div>
      <div style={{ flex: 1, height: 'calc(100% - 40px)' }}>
        <SeatCanvas
          mode={mode}
          backgroundImage={bgUrl}
          seats={seats}
          onSeatsUpdate={handleSeatsUpdate}
          labelPrefix={labelPrefix}
          labelStart={startCount}
        />
      </div>
    </div>
  );
}
