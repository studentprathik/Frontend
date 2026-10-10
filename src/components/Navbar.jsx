import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Compass, 
  PlusCircle, 
  FolderKanban, 
  Bell, 
  UserCircle, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-container">
      <div className="navbar-inner max-w-7xl">
        <Link to="/dashboard" className="brand-logo" onClick={closeMenu}>
          <div className="logo-icon-wrap">
            <Users size={22} className="logo-icon" />
          </div>
          <div className="logo-text-group">
            <span className="logo-title">Project Team Finder</span>
            <span className="logo-subtitle">Student Collaboration</span>
          </div>
        </Link>

        {user && (
          <>
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className={`nav-links ${mobileMenuOpen ? 'nav-open' : ''}`}>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/projects"
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                onClick={closeMenu}
              >
                Find Projects
              </NavLink>

              <NavLink
                to="/create-project"
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                onClick={closeMenu}
              >
                Create Project
              </NavLink>

              <NavLink
                to="/my-projects"
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                onClick={closeMenu}
              >
                My Projects
              </NavLink>

              <NavLink
                to="/requests"
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                onClick={closeMenu}
              >
                Requests
              </NavLink>

              <div className="nav-user-actions">
                <Link to="/profile" className="user-profile-badge" onClick={closeMenu}>
                  <div className="user-avatar-circle">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="user-details-mini">
                    <span className="user-name-text">{user.name}</span>
                    <span className="user-dept-text">{user.department}</span>
                  </div>
                </Link>

                <button
                  type="button"
                  className="btn-logout"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
