import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/login');
  }

  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? '?';

  return (
    <nav className="navbar">
      <span className="navbar-brand">CoworkBook</span>

      {user && (
        <div className="navbar-user" ref={menuRef}>
          <button className="avatar" onClick={() => setOpen((o) => !o)}>
            {initial}
          </button>

          {open && (
            <div className="user-menu">
              <div className="user-menu-info">
                <span className="user-menu-name">{user.name}</span>
                <span className="user-menu-email">{user.email}</span>
              </div>
              <button className="user-menu-logout" onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}