import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ConsumerDashboard from './pages/ConsumerDashboard';
import APIManagement from './pages/APIManagement';
import APIDetails from './pages/APIDetails';
import Billing from './pages/Billing';
import Marketplace from './pages/Marketplace';
import ApiPlayground from './pages/ApiPlayground';
import Usage from './pages/Usage';
import Subscriptions from './pages/Subscriptions';
import UserManagement from './pages/UserManagement';
import ApiDocs from './pages/ApiDocs';

const queryClient = new QueryClient();

function PrivateRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" />;
}

// Role-based dashboard component
function RoleBasedDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'api_owner':
      return <Dashboard />;
    case 'consumer':
      return <ConsumerDashboard />;
    default:
      return <Dashboard />;
  }
}

function App() {
  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><RoleBasedDashboard /></PrivateRoute>} />
            <Route path="/apis" element={<PrivateRoute><APIManagement /></PrivateRoute>} />
            <Route path="/apis/:id" element={<PrivateRoute><APIDetails /></PrivateRoute>} />
            <Route path="/apis/:id/docs" element={<PrivateRoute><ApiDocs /></PrivateRoute>} />
            <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
            {/* Admin routes */}
            <Route path="/admin/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
            <Route path="/admin/apis" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/billing" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/analytics" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            {/* Consumer routes */}
            <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
            <Route path="/playground" element={<PrivateRoute><ApiPlayground /></PrivateRoute>} />
            <Route path="/my-subscriptions" element={<PrivateRoute><Subscriptions /></PrivateRoute>} />
            <Route path="/usage" element={<PrivateRoute><Usage /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ToastProvider>
  );
}

export default App;