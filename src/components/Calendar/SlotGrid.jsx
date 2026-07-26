import { useMemo } from 'react';
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

export default function SlotGrid({ date, bookings, currentUserId, onSelectSlot, onCancel }) {
  const slots = useMemo(() => generateSlots(date), [date]);

  function getSlotInfo(slot) {
    const match = bookings.find(b =>
      new Date(b.startTime).getTime() === slot.start.getTime()
    );
    if (!match) return { status: 'open' };
    if (String(match.userId) === String(currentUserId)) return { status: 'yours', bookingId: match._id };
    return { status: 'booked' };
  }

  return (
    <div className="slot-grid">
      {slots.map((slot) => {
        const { status, bookingId } = getSlotInfo(slot);
        return (
          <div key={slot.start.toISOString()} className={`slot slot-${status}`}>
            <button
              disabled={status === 'booked'}
              onClick={() => status === 'open' && onSelectSlot(slot)}
            >
              {slot.start.toLocaleTimeString([], { hour: 'numeric' })}
              <span className="slot-status">{status}</span>
            </button>
            {status === 'yours' && (
              <button className="cancel-btn" onClick={() => onCancel(bookingId)}>
                Cancel
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}