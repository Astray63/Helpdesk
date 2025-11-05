import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import TicketCard from '../components/TicketCard';
import './TicketsList.css';

/**
 * Page de liste des tickets
 */
const TicketsList = () => {
  const { isAdmin } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, open, in_progress, resolved, closed

  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getAllTickets();
      setTickets(response.data.tickets);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Chargement des tickets...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{isAdmin() ? 'Tous les Tickets' : 'Mes Tickets'}</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="refresh-button" 
            onClick={fetchTickets}
            style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Actualiser
          </button>
          <button className="create-button" onClick={() => navigate('/new-ticket')}>
            Nouveau Ticket
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filtres */}
      <div className="filters">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tous ({tickets.length})
        </button>
        <button
          className={`filter-button ${filter === 'open' ? 'active' : ''}`}
          onClick={() => setFilter('open')}
        >
          Ouverts ({tickets.filter((t) => t.status === 'open').length})
        </button>
        <button
          className={`filter-button ${filter === 'in_progress' ? 'active' : ''}`}
          onClick={() => setFilter('in_progress')}
        >
          En cours ({tickets.filter((t) => t.status === 'in_progress').length})
        </button>
        <button
          className={`filter-button ${filter === 'resolved' ? 'active' : ''}`}
          onClick={() => setFilter('resolved')}
        >
          Résolus ({tickets.filter((t) => t.status === 'resolved').length})
        </button>
        <button
          className={`filter-button ${filter === 'closed' ? 'active' : ''}`}
          onClick={() => setFilter('closed')}
        >
          Fermés ({tickets.filter((t) => t.status === 'closed').length})
        </button>
      </div>

      {/* Liste des tickets */}
      {filteredTickets.length === 0 ? (
        <div className="empty-state">
          <p>Aucun ticket trouvé</p>
          <button className="create-button" onClick={() => navigate('/new-ticket')}>
            Créer votre premier ticket
          </button>
        </div>
      ) : (
        <div className="tickets-grid">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => handleTicketClick(ticket.id)}
              showUser={isAdmin()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsList;
