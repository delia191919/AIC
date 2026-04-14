import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AvalancheFormPage from './pages/AvalancheFormPage';
import ValidationPanel from './pages/ValidationPanel';
import AvalancheDetailsPage from './pages/AvalancheDetailsPage';
import AvalancheEditPage from './pages/AvalancheEditPage';
import ConditionsDetailsPage from './pages/ConditionsDetailsPage';
import SearchPage from './pages/SearchPage';
import UserManagementPanel from './pages/UserManagementPanel';
import MeteoPage from './pages/MeteoPage';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import { connectWebSocket } from './services/websocketService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotifications } from './context/NotificationContext';

// Protected Route Component
const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, isAdmin, isExpert, loading } = useAuth();

  if (loading) return <div className="container py-20 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (roleRequired === 'ADMIN' && !isAdmin) return <Navigate to="/" />;
  if (roleRequired === 'EXPERT' && !isExpert) return <Navigate to="/" />;
  if (roleRequired === 'ADMIN_OR_EXPERT' && !isAdmin && !isExpert) return <Navigate to="/" />;

  return children;
};

let stompClient = null;

function App() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const token = user?.token || user?.accessToken;
    // Dacă utilizatorul e logat și nu avem deja un client conectat corect
    if (user && token && !stompClient) {
      stompClient = connectWebSocket(user, addNotification);
    }

    return () => {
      if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
      }
    };
  }, [user?.token, user?.accessToken]);

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} />
      <Navbar />
      <main className="container pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Add more routes here as we build the pages */}
          <Route path="/add-avalanche" element={
            <ProtectedRoute>
              <AvalancheFormPage />
            </ProtectedRoute>
          } />

          <Route path="/validation" element={
            <ProtectedRoute roleRequired="EXPERT">
              <ValidationPanel />
            </ProtectedRoute>
          } />

          <Route path="/avalanche/:id" element={<AvalancheDetailsPage />} />
          <Route path="/avalanche/edit/:id" element={
            <ProtectedRoute roleRequired="ADMIN_OR_EXPERT">
              <AvalancheEditPage />
            </ProtectedRoute>
          } />
          <Route path="/conditions/:id" element={<ConditionsDetailsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/meteo" element={<MeteoPage />} />

          {/* Protected Routes */}
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly>
              <UserManagementPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
