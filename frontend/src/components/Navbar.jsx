import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Composant de barre de navigation
 */
const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Helpdesk
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/" className="navbar-link">
                Mes Tickets
              </Link>
              <Link to="/new-ticket" className="navbar-link">
                Nouveau Ticket
              </Link>
              {isAdmin() && (
                <Link to="/admin" className="navbar-link">
                  Admin Dashboard
                </Link>
              )}
              <span className="navbar-user">
                {user.name} {isAdmin() && '(Admin)'}
              </span>
              <button onClick={handleLogout} className="navbar-button">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Connexion
              </Link>
              <Link to="/register" className="navbar-link">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
