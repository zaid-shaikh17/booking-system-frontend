// pages/BookingPage.jsx
import { useState, useEffect } from "react";
import api from "../services/api";
import SlotGrid from "../components/Calendar/SlotGrid";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function BookingPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [resourceId, setResourceId] = useState(null);
  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/resources").then((res) => {
      setResources(res.data);
      if (res.data[0]) setResourceId(res.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (resourceId) refetchAvailability();
  }, [resourceId, date]);

  async function refetchAvailability() {
    setLoading(true);
    try {
      const res = await api.get("/bookings/availability", {
        params: { resourceId, date: date.toISOString() },
      });
      setBookings(res.data);
    } catch (err) {
      toast.error("Failed to load availability");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectSlot(slot) {
    try {
      await api.post("/bookings", {
        resourceId,
        startTime: slot.start,
        endTime: slot.end,
      });
      toast.success("Booked!");
    } catch (err) {
      if (err.response?.status === 409) {
        toast((t) => (
          <span>
            Slot taken.{" "}
            <button
              onClick={async () => {
                await api.post("/bookings/waitlist", {
                  resourceId,
                  startTime: slot.start,
                  endTime: slot.end,
                });
                toast.dismiss(t.id);
                toast.success("You're on the waitlist!");
                refetchAvailability();
              }}
            >
              Join waitlist
            </button>
          </span>
        ));
      }
    } finally {
      refetchAvailability(); // always refresh, success or failure
    }
  }

  async function handleCancel(bookingId) {
    try {
      await api.delete(`/bookings/${bookingId}`);
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error("Failed to cancel booking");
    } finally {
      refetchAvailability();
    }
  }

  return (
    <div className="booking-page">
      <select
        value={resourceId ?? ""}
        onChange={(e) => setResourceId(e.target.value)}
      >
        {resources.map((r) => (
          <option key={r._id} value={r._id}>
            {r.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={date.toISOString().slice(0, 10)}
        onChange={(e) => setDate(new Date(e.target.value))}
      />

      {loading ? (
        <p>Loading slots...</p>
      ) : (
        <SlotGrid
          date={date}
          bookings={bookings}
          currentUserId={user?.id}
          onSelectSlot={handleSelectSlot}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
