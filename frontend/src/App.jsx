import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import TicketsList from './pages/TicketsList';
import NewTicket from './pages/NewTicket';
import TicketDetail from './pages/TicketDetail';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <TicketsList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/new-ticket"
                element={
                  <PrivateRoute>
                    <NewTicket />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tickets/:id"
                element={
                  <PrivateRoute>
                    <TicketDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
