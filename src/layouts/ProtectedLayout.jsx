import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar/Navbar';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}