
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Circle, Text } from 'react-konva';
import useImage from 'use-image';

export type Seat = {
  id: string;
  label: string;
  x: number;  // percent
  y: number;  // percent
  isBooked: boolean;
};

type Props = {
  mode: 'edit' | 'view';
  backgroundImage: string | null;
  seats: Seat[];
  onSeatsUpdate: (updated: Seat[]) => void;
  labelPrefix: string;
  labelStart: number;
};

export default function SeatCanvas({
  mode,
  backgroundImage,
  seats,
  onSeatsUpdate,
  labelPrefix,
  labelStart,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [img] = useImage(backgroundImage || '');
  const [dims, setDims] = useState({ width: 800, height: 600 });
  const [localSeats, setLocalSeats] = useState<Seat[]>(seats);

  // sync incoming seats
  useEffect(() => setLocalSeats(seats), [seats]);

  // resize handler
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDims({ width: rect.width, height: rect.height });
      }
    };
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, []);

  // utils
  const percentToPx = (p: number, dim: number) => (p / 100) * dim;
  const pxToPercent = (x: number, dim: number) => (x / dim) * 100;

  // label generation using provided prefix & start count
  const countRef = useRef(labelStart);
  useEffect(() => {
    countRef.current = labelStart;
  }, [labelStart]);
  const genLabel = () => `${labelPrefix}${countRef.current++}`;

  // events
  const handleClick = (_: any) => {
    if (mode !== 'edit') return;
    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    if (!pos || !img) return;
    // account for pan & zoom: convert pointer back into image space
    const { x: stageX, y: stageY } = stage.position();
    const scale = stage.scaleX();
    const realX = (pos.x - stageX) / scale;
    const realY = (pos.y - stageY) / scale;
    const xPct = pxToPercent(realX, dims.width);
    const yPct = pxToPercent(realY, dims.height);

    const newSeat: Seat = {
      id: `${Date.now()}`,
      label: genLabel(),
      x: xPct,
      y: yPct,
      isBooked: false
    };
    const updated = [...localSeats, newSeat];
    setLocalSeats(updated);
    onSeatsUpdate(updated);
  };

  const handleDelete = (id: string) => {
    const updated = localSeats.filter(s => s.id !== id);
    setLocalSeats(updated);
    onSeatsUpdate(updated);
  };

  const handleDragEnd = (e: any, seat: Seat) => {
    const { x, y } = e.target.position();
    const updated = localSeats.map(s =>
      s.id === seat.id
        ? { ...s, x: pxToPercent(x, dims.width), y: pxToPercent(y, dims.height) }
        : s
    );
    setLocalSeats(updated);
    onSeatsUpdate(updated);
  };

  const handleSeatClick = (s: Seat) => {
    if (mode !== 'view') return;
    const updated = localSeats.map(se =>
      se.id === s.id ? { ...se, isBooked: !se.isBooked } : se
    );
    setLocalSeats(updated);
    onSeatsUpdate(updated);
  };

  // zoom & pan
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.02;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    stage.scale({ x: newScale, y: newScale });
    stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
    stage.batchDraw();
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Stage
        width={dims.width}
        height={dims.height}
        onClick={handleClick}
        onWheel={handleWheel}
        draggable
        ref={stageRef}
      >
        <Layer>
          {img && (
            <KonvaImage
              image={img}
              width={dims.width}
              height={dims.height}
            />
          )}
          {localSeats.map(seat => {
            const cx = percentToPx(seat.x, dims.width);
            const cy = percentToPx(seat.y, dims.height);
            return (
              <React.Fragment key={seat.id}>
                <Circle
                  x={cx}
                  y={cy}
                  radius={12}
                  fill={seat.isBooked ? 'red' : 'green'}
                  strokeEnabled={false}
                  draggable={mode === 'edit'}
                  onDragEnd={e => handleDragEnd(e, seat)}
                  onContextMenu={e => {
                    e.evt.preventDefault();
                    if (mode === 'edit') handleDelete(seat.id);
                  }}
                  onClick={() => handleSeatClick(seat)}
                  onMouseEnter={e => {
                    const shape = (e.target as any);
                    shape.stroke('yellow');
                    shape.draw();
                  }}
                  onMouseLeave={e => {
                    const shape = (e.target as any);
                    shape.strokeEnabled(false);
                    shape.draw();
                  }}
                />
                <Text
                  x={cx - 10}
                  y={cy - 6}
                  text={seat.label}
                  fontSize={12}
                  fill="white"
                />
              </React.Fragment>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
