import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <BookOpen size={24} />
          <span>Kursyk</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/courses" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500 }}>Каталог</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 500 }}>
                <User size={18} />
                <span>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2" style={{ padding: '0.25rem 0.5rem' }}>
                <LogOut size={16} />
                <span>Вийти</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-secondary">Вхід</Link>
              <Link to="/register" className="btn btn-primary">Реєстрація</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
