import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TicketCard from '../components/TicketCard';

/**
 * Tests pour le composant TicketCard
 */
describe('TicketCard Component', () => {
  const mockTicket = {
    id: 1,
    title: 'Test Ticket',
    description: 'Ceci est une description de test pour le ticket',
    priority: 'high',
    status: 'open',
    createdAt: '2024-01-01T12:00:00.000Z',
  };

  it('devrait afficher les informations du ticket', () => {
    render(
      <BrowserRouter>
        <TicketCard ticket={mockTicket} onClick={() => {}} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Ticket')).toBeInTheDocument();
    expect(screen.getByText(/Ceci est une description/i)).toBeInTheDocument();
  });

  it('devrait afficher le badge de priorité correct', () => {
    render(
      <BrowserRouter>
        <TicketCard ticket={mockTicket} onClick={() => {}} />
      </BrowserRouter>
    );

    expect(screen.getByText('Haute')).toBeInTheDocument();
  });

  it('devrait afficher le badge de statut correct', () => {
    render(
      <BrowserRouter>
        <TicketCard ticket={mockTicket} onClick={() => {}} />
      </BrowserRouter>
    );

    expect(screen.getByText('Ouvert')).toBeInTheDocument();
  });

  it('devrait afficher les informations utilisateur si showUser est true', () => {
    const ticketWithUser = {
      ...mockTicket,
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      },
    };

    render(
      <BrowserRouter>
        <TicketCard ticket={ticketWithUser} onClick={() => {}} showUser={true} />
      </BrowserRouter>
    );

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });
});
