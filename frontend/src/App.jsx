import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AvalancheFormPage from './pages/AvalancheFormPage';
import ValidationPanel from './pages/ValidationPanel';
import AvalancheDetailsPage from './pages/AvalancheDetailsPage';
import ConditionsDetailsPage from './pages/ConditionsDetailsPage';
import SearchPage from './pages/SearchPage';
import UserManagementPanel from './pages/UserManagementPanel';
import MeteoPage from './pages/MeteoPage';
import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, isAdmin, isExpert, loading } = useAuth();

  if (loading) return <div className="container py-20 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (roleRequired === 'ADMIN' && !isAdmin) return <Navigate to="/" />;
  if (roleRequired === 'EXPERT' && !isExpert) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <div className="min-h-screen">
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
