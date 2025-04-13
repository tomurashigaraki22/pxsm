import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import PaymentCallback from './pages/PaymentCallback';
import AgentSignup from './pages/AgentSignup';
import AgentLogin from './pages/AgentLogin';
import AgentDashboard from './pages/AgentDashboard';
import AgentSubscription from './pages/AgentSubscription';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          
          {/* Agent routes */}
          <Route path="/agent-signup" element={
            <PublicRoute>
              <AgentSignup />
            </PublicRoute>
          } />
          <Route path="/agent-login" element={
            <PublicRoute>
              <AgentLogin />
            </PublicRoute>
          } />
          <Route path="/agent-subscription" element={<AgentSubscription />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/payment-callback" element={
            <ProtectedRoute>
              <PaymentCallback />
            </ProtectedRoute>
          } />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
