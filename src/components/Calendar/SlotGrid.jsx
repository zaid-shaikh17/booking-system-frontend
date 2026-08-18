import { useMemo, useRef, useEffect, useState } from 'react';
import './SlotGrid.css';

function generateSlots(date, startHour = 9, endHour = 18) {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    const start = new Date(date);
    start.setHours(h, 0, 0, 0);
    const end = new Date(start);
    end.setHours(h + 1);
    slots.push({ start, end });
  }
  return slots;
}

function formatHour(date) {
  return date.toLocaleTimeString([], { hour: 'numeric' }).replace(' ', '');
}

export default function SlotGrid({ date, bookings, currentUserId, onSelectSlot, onCancel }) {
  const slots = useMemo(() => generateSlots(date), [date]);
  const prevStatuses = useRef({});
  const [changedKeys, setChangedKeys] = useState({});

function getSlotInfo(slot) {
  const match = bookings.find(
    (b) => new Date(b.startTime).getTime() === slot.start.getTime()
  );
  if (!match) {
    if (slot.start < new Date()) return { status: 'past' };
    return { status: 'open' };
  }
  if (String(match.userId) === String(currentUserId)) {
    return { status: 'yours', bookingId: match._id };
  }
  return { status: 'booked' };
}

  useEffect(() => {
    const changed = {};
    slots.forEach((slot) => {
      const key = slot.start.toISOString();
      const { status } = getSlotInfo(slot);
      if (prevStatuses.current[key] && prevStatuses.current[key] !== status) {
        changed[key] = true;
      }
      prevStatuses.current[key] = status;
    });
    setChangedKeys(changed);
    const timeout = setTimeout(() => setChangedKeys({}), 450);
    return () => clearTimeout(timeout);
  }, [bookings]);

  return (
    <div className="board">
      {slots.map((slot) => {
        const key = slot.start.toISOString();
        const { status, bookingId } = getSlotInfo(slot);
        return (
          <div
            key={key}
            className="slat"
            data-status={status}
            data-just-changed={changedKeys[key] ? 'true' : 'false'}
          >
            <button
              className="slat-btn"
              disabled={status !== 'open'}
              onClick={() => status === 'open' && onSelectSlot(slot)}
            >
              <span className="slat-time">{formatHour(slot.start)}</span>
              <span className="slat-status">{status}</span>
            </button>
            {status === 'yours' && (
              <button className="slat-cancel" onClick={() => onCancel(bookingId)}>
                Cancel
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}