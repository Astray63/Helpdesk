const request = require('supertest');
const app = require('../src/app');
const { syncDatabase } = require('../src/models');

/**
 * Tests d'intégration pour les routes d'authentification
 */

describe('Auth Routes', () => {
  // Avant tous les tests, synchronise la base de données (force: true = reset)
  beforeAll(async () => {
    await syncDatabase(true);
  });

  describe('POST /auth/register', () => {
    it('devrait créer un nouvel utilisateur avec succès', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('devrait échouer si l\'email existe déjà', async () => {
      // Premier utilisateur
      await request(app)
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
          name: 'User 1',
        });

      // Tentative de doublon
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password456',
          name: 'User 2',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('devrait échouer si des champs sont manquants', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'incomplete@example.com',
          // Manque password et name
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait échouer si le mot de passe est trop court', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'short@example.com',
          password: '123',
          name: 'Short Password',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait échouer si l\'email est invalide', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Invalid Email',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      // Créer un utilisateur pour les tests de login
      await request(app)
        .post('/auth/register')
        .send({
          email: 'login@example.com',
          password: 'password123',
          name: 'Login User',
        });
    });

    it('devrait connecter un utilisateur avec succès', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
    });

    it('devrait échouer avec un email incorrect', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('devrait échouer avec un mot de passe incorrect', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('devrait échouer si des champs sont manquants', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          // Manque password
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /auth/me', () => {
    let token;

    beforeAll(async () => {
      // Créer et connecter un utilisateur
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'me@example.com',
          password: 'password123',
          name: 'Me User',
        });
      
      token = response.body.data.token;
    });

    it('devrait récupérer les informations de l\'utilisateur connecté', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('me@example.com');
    });

    it('devrait échouer sans token', async () => {
      const response = await request(app)
        .get('/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('devrait échouer avec un token invalide', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
