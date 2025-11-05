import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import TicketCard from '../components/TicketCard';
import './AdminDashboard.css';

/**
 * Page du tableau de bord administrateur
 */
const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas admin
    if (!isAdmin()) {
      navigate('/');
      return;
    }

    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getAllTickets();
      const ticketsList = response.data.tickets;
      setTickets(ticketsList);

      // Calcul des statistiques
      setStats({
        total: ticketsList.length,
        open: ticketsList.filter((t) => t.status === 'open').length,
        inProgress: ticketsList.filter((t) => t.status === 'in_progress').length,
        resolved: ticketsList.filter((t) => t.status === 'resolved').length,
        closed: ticketsList.filter((t) => t.status === 'closed').length,
      });
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Chargement du tableau de bord...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="admin-header">
        <div>
          <h1>Tableau de Bord Administrateur</h1>
          <p>Vue d'ensemble de tous les tickets du système</p>
        </div>
        <button 
          className="refresh-button" 
          onClick={fetchTickets}
          style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', height: 'fit-content' }}
        >
          Actualiser
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card open">
          <div className="stat-number">{stats.open}</div>
          <div className="stat-label">Ouverts</div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">En cours</div>
        </div>
        <div className="stat-card resolved">
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Résolus</div>
        </div>
        <div className="stat-card closed">
          <div className="stat-number">{stats.closed}</div>
          <div className="stat-label">Fermés</div>
        </div>
      </div>

      {/* Liste des tickets */}
      <div className="admin-tickets-section">
        <h2>Tous les tickets</h2>
        {tickets.length === 0 ? (
          <div className="empty-state">
            <p>Aucun ticket dans le système</p>
          </div>
        ) : (
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => handleTicketClick(ticket.id)}
                showUser={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
