import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';

/**
 * Tests pour la page de connexion
 */
describe('Login Component', () => {
  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('devrait afficher le formulaire de connexion', () => {
    renderLogin();
    
    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
  });

  it('devrait afficher un lien vers l\'inscription', () => {
    renderLogin();
    
    expect(screen.getByText(/S'inscrire/i)).toBeInTheDocument();
  });

  it('devrait afficher les informations de compte de démonstration', () => {
    renderLogin();
    
    expect(screen.getByText(/Compte de démonstration/i)).toBeInTheDocument();
  });
});
