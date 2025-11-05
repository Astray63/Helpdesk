import React from 'react';
import './TicketCard.css';

/**
 * Composant carte de ticket
 */
const TicketCard = ({ ticket, onClick, showUser = false }) => {
  // Couleurs selon la priorité
  const getPriorityClass = (priority) => {
    const classes = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      urgent: 'priority-urgent',
    };
    return classes[priority] || 'priority-medium';
  };

  // Labels selon le statut
  const getStatusLabel = (status) => {
    const labels = {
      open: 'Ouvert',
      in_progress: 'En cours',
      resolved: 'Résolu',
      closed: 'Fermé',
    };
    return labels[status] || status;
  };

  // Labels selon la priorité
  const getPriorityLabel = (priority) => {
    const labels = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute',
      urgent: 'Urgente',
    };
    return labels[priority] || priority;
  };

  // Format de date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="ticket-card" onClick={onClick}>
      <div className="ticket-header">
        <h3 className="ticket-title">{ticket.title}</h3>
        <span className={`priority-badge ${getPriorityClass(ticket.priority)}`}>
          {getPriorityLabel(ticket.priority)}
        </span>
      </div>

      <p className="ticket-description">
        {ticket.description.length > 100
          ? `${ticket.description.substring(0, 100)}...`
          : ticket.description}
      </p>

      <div className="ticket-footer">
        <span className={`status-badge status-${ticket.status}`}>
          {getStatusLabel(ticket.status)}
        </span>
        {showUser && ticket.user && (
          <span className="ticket-user">{ticket.user.name}</span>
        )}
        <span className="ticket-date">{formatDate(ticket.createdAt)}</span>
      </div>
    </div>
  );
};

export default TicketCard;
