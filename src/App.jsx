import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedLayout from './layouts/ProtectedLayout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import BookingPage from './pages/BookingPage/BookingPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<BookingPage />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}