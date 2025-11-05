const request = require('supertest');
const app = require('../src/app');
const { syncDatabase } = require('../src/models');

/**
 * Tests d'intégration pour les routes des tickets
 */

describe('Ticket Routes', () => {
  let userToken;
  let adminToken;
  let userId;
  let ticketId;

  // Avant tous les tests, créer un utilisateur et un admin
  beforeAll(async () => {
    await syncDatabase(true);

    // Créer un utilisateur standard
    const userResponse = await request(app)
      .post('/auth/register')
      .send({
        email: 'user@example.com',
        password: 'password123',
        name: 'Standard User',
      });
    
    userToken = userResponse.body.data.token;
    userId = userResponse.body.data.user.id;

    // Se connecter en tant qu'admin (créé automatiquement lors du sync)
    const adminResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@helpdesk.com',
        password: 'Admin123!',
      });
    
    adminToken = adminResponse.body.data.token;
  });

  describe('POST /tickets', () => {
    it('devrait créer un ticket avec succès', async () => {
      const response = await request(app)
        .post('/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Mon premier ticket',
          description: 'Description détaillée du problème',
          priority: 'high',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.ticket).toHaveProperty('id');
      expect(response.body.data.ticket.title).toBe('Mon premier ticket');
      expect(response.body.data.ticket.status).toBe('open');
      
      ticketId = response.body.data.ticket.id; // Sauvegarder pour les autres tests
    });

    it('devrait utiliser la priorité "medium" par défaut', async () => {
      const response = await request(app)
        .post('/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Ticket sans priorité',
          description: 'Description du ticket sans priorité',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.ticket.priority).toBe('medium');
    });

    it('devrait échouer si le titre est trop court', async () => {
      const response = await request(app)
        .post('/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'ab', // Moins de 3 caractères
          description: 'Description valide',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait échouer si la description est trop courte', async () => {
      const response = await request(app)
        .post('/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Titre valide',
          description: 'Court', // Moins de 10 caractères
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait échouer sans authentification', async () => {
      const response = await request(app)
        .post('/tickets')
        .send({
          title: 'Ticket non authentifié',
          description: 'Description du ticket',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /tickets', () => {
    it('devrait récupérer les tickets de l\'utilisateur', async () => {
      const response = await request(app)
        .get('/tickets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.tickets)).toBe(true);
      expect(response.body.data.tickets.length).toBeGreaterThan(0);
    });

    it('devrait récupérer tous les tickets pour un admin', async () => {
      const response = await request(app)
        .get('/tickets')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.tickets)).toBe(true);
      // L'admin voit les tickets avec les infos utilisateur
      expect(response.body.data.tickets[0]).toHaveProperty('user');
    });

    it('devrait échouer sans authentification', async () => {
      const response = await request(app)
        .get('/tickets');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /tickets/:id', () => {
    it('devrait récupérer un ticket par son ID', async () => {
      const response = await request(app)
        .get(`/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.ticket.id).toBe(ticketId);
    });

    it('devrait échouer si le ticket n\'existe pas', async () => {
      const response = await request(app)
        .get('/tickets/99999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('devrait permettre à un admin de voir n\'importe quel ticket', async () => {
      const response = await request(app)
        .get(`/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /tickets/:id', () => {
    it('devrait mettre à jour le titre et la description', async () => {
      const response = await request(app)
        .put(`/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Titre modifié',
          description: 'Description modifiée avec plus de détails',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.ticket.title).toBe('Titre modifié');
    });

    it('devrait échouer si un utilisateur essaie de changer le statut', async () => {
      const response = await request(app)
        .put(`/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: 'resolved',
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('devrait permettre à un admin de changer le statut', async () => {
      const response = await request(app)
        .put(`/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'in_progress',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.ticket.status).toBe('in_progress');
    });

    it('devrait échouer avec un statut invalide', async () => {
      const response = await request(app)
        .put(`/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'invalid_status',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /tickets/:id', () => {
    let ticketToDelete;

    beforeEach(async () => {
      // Créer un ticket à supprimer pour chaque test
      const response = await request(app)
        .post('/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Ticket à supprimer',
          description: 'Ce ticket sera supprimé',
        });
      
      ticketToDelete = response.body.data.ticket.id;
    });

    it('devrait supprimer un ticket avec succès', async () => {
      const response = await request(app)
        .delete(`/tickets/${ticketToDelete}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('devrait permettre à un admin de supprimer n\'importe quel ticket', async () => {
      const response = await request(app)
        .delete(`/tickets/${ticketToDelete}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('devrait échouer si le ticket n\'existe pas', async () => {
      const response = await request(app)
        .delete('/tickets/99999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
