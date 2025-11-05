import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import './TicketDetail.css';

/**
 * Page de détail d'un ticket
 */
const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
  });

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getTicketById(id);
      setTicket(response.data.ticket);
      setFormData({
        title: response.data.ticket.title,
        description: response.data.ticket.description,
        priority: response.data.ticket.priority,
        status: response.data.ticket.status,
      });
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await ticketService.updateTicket(id, formData);
      setIsEditing(false);
      fetchTicket();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      try {
        await ticketService.deleteTicket(id);
        navigate('/');
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: 'Ouvert',
      in_progress: 'En cours',
      resolved: 'Résolu',
      closed: 'Fermé',
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute',
      urgent: 'Urgente',
    };
    return labels[priority] || priority;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/')} className="back-button">
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Retour à la liste
      </button>

      <div className="detail-card">
        {error && <div className="error-message">{error}</div>}

        {!isEditing ? (
          <>
            <div className="detail-header">
              <h1>{ticket.title}</h1>
              <div className="badges">
                <span className={`priority-badge priority-${ticket.priority}`}>
                  {getPriorityLabel(ticket.priority)}
                </span>
                <span className={`status-badge status-${ticket.status}`}>
                  {getStatusLabel(ticket.status)}
                </span>
              </div>
            </div>

            <div className="detail-meta">
              {ticket.user && (
                <p>
                  <strong>Créé par :</strong> {ticket.user.name} ({ticket.user.email})
                </p>
              )}
              <p>
                <strong>Créé le :</strong>{' '}
                {new Date(ticket.createdAt).toLocaleString('fr-FR')}
              </p>
              <p>
                <strong>Modifié le :</strong>{' '}
                {new Date(ticket.updatedAt).toLocaleString('fr-FR')}
              </p>
            </div>

            <div className="detail-content">
              <h2>Description</h2>
              <p className="description-text">{ticket.description}</p>
            </div>

            <div className="detail-actions">
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                Modifier
              </button>
              <button className="delete-button" onClick={handleDelete}>
                Supprimer
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="edit-form">
            <h2>Modifier le ticket</h2>

            <div className="form-group">
              <label htmlFor="title">Titre</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priorité</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            {isAdmin() && (
              <div className="form-group">
                <label htmlFor="status">Statut (Admin seulement)</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="open">Ouvert</option>
                  <option value="in_progress">En cours</option>
                  <option value="resolved">Résolu</option>
                  <option value="closed">Fermé</option>
                </select>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Annuler
              </button>
              <button type="submit" className="submit-button">
                Enregistrer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
