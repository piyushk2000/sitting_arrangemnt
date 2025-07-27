import { useState, useEffect } from 'react';
import SeatCanvas, { Seat } from '../components/SeatCanvas';

export default function SeatBookingPage() {
  const [labelPrefix, setLabelPrefix] = useState<string>('A');
  const [startCount, setStartCount] = useState<number>(1);
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // whenever prefix or seats list changes, find highest number for that prefix
  useEffect(() => {
    const nums = seats
      .filter(s => s.label.startsWith(labelPrefix))
      .map(s => parseInt(s.label.slice(labelPrefix.length), 10))
      .filter(n => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    setStartCount(max + 1);
  }, [labelPrefix, seats]);

  // bump and set seats
  const handleSeatsUpdate = (updated: Seat[]) => {
    setSeats(updated);
    const nums = updated
      .filter(s => s.label.startsWith(labelPrefix))
      .map(s => parseInt(s.label.slice(labelPrefix.length), 10))
      .filter(n => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
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
            readOnly
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
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => {
            setSelectionMode(m => !m);
            if (selectionMode) setSelectedIds([]);
          }}
        >
          {selectionMode ? 'Cancel Selection' : 'Select Seats'}
        </button>
        <button
          style={{ marginLeft: 8 }}
          disabled={!selectedIds.length}
          onClick={() => {
            if (selectedIds.length) {
              handleSeatsUpdate(
                seats.filter(s => !selectedIds.includes(s.id))
              );
              setSelectedIds([]);
            }
          }}
        >
          Delete Selected ({selectedIds.length})
        </button>
      </div>
      <div style={{ marginBottom: 12, fontStyle: 'italic', color: '#555' }}>
        {selectionMode
          ? 'Selection Mode: click a seat on the canvas to highlight, then use "Delete Selected".'
          : mode === 'edit'
          ? 'Edit Mode: click on the canvas to add new seats.'
          : 'View Mode: click on seats to book/unbook them.'}
      </div>
      <div style={{ flex: 1, height: 'calc(100% - 40px)' }}>
        <SeatCanvas
          mode={mode}
          backgroundImage={bgUrl!}
          seats={seats}
          onSeatsUpdate={handleSeatsUpdate}
          labelPrefix={labelPrefix}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onSelectSeats={setSelectedIds}
        />
      </div>
    </div>
  );
}

