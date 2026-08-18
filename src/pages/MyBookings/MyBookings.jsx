import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './MyBookings.css';
import { useNavigate, Link } from 'react-router-dom';

function formatDate(d) {
  return new Date(d).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

function formatTime(d) {
  return new Date(d).toLocaleTimeString([], { hour: 'numeric' });
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await api.get('/bookings/my');
      setBookings(res.data.bookings);
      setWaitlist(res.data.waitlist);
    } catch {
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    try {
      await api.delete(`/bookings/${id}`);
      toast.success('Booking cancelled');
      fetchData();
    } catch {
      toast.error('Failed to cancel');
    }
  }

  if (loading) return <p className="loading-text">Loading your bookings…</p>;

  return (
    <>
    <Link to='/' className='my-booking-link'>⬅︎ Back to Booking Page</Link>
    <div className="my-bookings-page">
      <h1>My bookings</h1>

      {bookings.length === 0 && waitlist.length === 0 && (
        <p className="empty-state">No upcoming bookings yet.</p>
      )}

      {bookings.length > 0 && (
        <section>
          <h2 className="section-label">Confirmed</h2>
          <ul className="booking-list">
            {bookings.map((b) => (
              <li key={b._id} className="booking-row">
                <div className="booking-info">
                  <span className="booking-resource">{b.resourceId?.name ?? 'Resource'}</span>
                  <span className="booking-datetime">
                    {formatDate(b.startTime)} · {formatTime(b.startTime)} – {formatTime(b.endTime)}
                  </span>
                </div>
                <button className="cancel-link" onClick={() => handleCancel(b._id)}>
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {waitlist.length > 0 && (
        <section>
          <h2 className="section-label wait">Waitlisted</h2>
          <ul className="booking-list">
            {waitlist.map((w) => (
              <li key={w._id} className="booking-row waitlisted">
                <div className="booking-info">
                  <span className="booking-resource">{w.resourceId?.name ?? 'Resource'}</span>
                  <span className="booking-datetime">
                    {formatDate(w.startTime)} · {formatTime(w.startTime)} – {formatTime(w.endTime)}
                  </span>
                </div>
                <span className="waitlist-tag">Waiting</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
    </>
  );
}