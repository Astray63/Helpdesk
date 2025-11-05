import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import './TicketForm.css';

/**
 * Page de création d'un nouveau ticket
 */
const NewTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation côté client
    if (formData.title.length < 3) {
      setError('Le titre doit contenir au moins 3 caractères');
      return;
    }

    if (formData.description.length < 10) {
      setError('La description doit contenir au moins 10 caractères');
      return;
    }

    setLoading(true);

    try {
      await ticketService.createTicket(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1 className="form-title">Nouveau Ticket</h1>
        <p className="form-subtitle">Décrivez votre problème ou votre demande</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label htmlFor="title">Titre du ticket *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Résumé du problème"
              disabled={loading}
              maxLength="200"
            />
            <small>{formData.title.length}/200 caractères</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description détaillée *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Décrivez le problème en détail..."
              rows="8"
              disabled={loading}
              maxLength="5000"
            />
            <small>{formData.description.length}/5000 caractères</small>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priorité</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Annuler
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Création...' : 'Créer le ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;
