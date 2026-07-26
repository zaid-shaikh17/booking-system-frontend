import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  console.log('ProtectedLayout ran:', { user, loading });
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}