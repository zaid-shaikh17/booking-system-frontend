# Coworking Space Booking System — Frontend

React frontend for the coworking booking system. Pairs with the [backend repo](https://github.com/zaid-shaikh17/booking-system-backend), which handles the actual concurrency-safe booking logic — see that README for the technical deep dive.

## Features

- Auth (register/login) with protected routes
- Custom slot-grid calendar (built from scratch, not a library) showing open / booked / yours per hour
- Real-time-feeling booking flow: click an open slot, get an immediate confirmation or a graceful "slot just taken" conflict message
- One-click waitlist join when a race is lost on a slot
- Cancel booking directly from the grid

## Why a Custom Slot Grid

Off-the-shelf calendar libraries hide the exact moment a booking succeeds or fails. Building the grid from scratch made it possible to surface the backend's concurrency handling directly in the UI — losing a race to book a slot visibly prompts a waitlist option instead of silently failing.

## Stack

- React (Vite)
- React Router (protected layout pattern)
- Axios
- react-hot-toast

## Folder Structure

```
src/
├── context/       # AuthContext
├── services/      # api.js — single axios instance, JWT interceptor
├── components/
│   └── Calendar/  # SlotGrid — the core UI piece
├── pages/
├── layouts/       # ProtectedLayout — redirects unauthenticated users
```

## Running Locally

```
npm install
# .env: VITE_API_URL (defaults to http://localhost:4000/api)
npm run dev
```

## Demo Flow

1. Register / log in
2. Select a resource and date
3. Book an open slot — confirms instantly
4. Open a second session as a different user, try the same slot — get prompted to join the waitlist
5. Cancel the original booking — the waitlisted user is automatically promoted and emailed
