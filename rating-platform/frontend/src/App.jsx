import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { useAuth } from './hooks/useAuth';


import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';


import AdminDashboard from './components/Admin/Dashboard';
import CreateUser from './components/Admin/CreateUser';
import CreateStore from './components/Admin/CreateStore';
import UserList from './components/Admin/UserList';
import StoreList from './components/Admin/StoreList';


import UserDashboard from './components/User/UserDashboard';
import StoreListUser from './components/User/StoreListUser';
import UserPasswordChange from './components/User/PasswordChange';

import OwnerDashboard from './components/StoreOwner/OwnerDashboard';
import OwnerPasswordChange from './components/StoreOwner/PasswordChange';


const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
   
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'store_owner':
        return <Navigate to="/owner/dashboard" replace />;
      default:
        return <Navigate to="/user/dashboard" replace />;
    }
  }

  return children;
};


const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (user) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'store_owner':
        return <Navigate to="/owner/dashboard" replace />;
      default:
        return <Navigate to="/user/dashboard" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

        
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-user"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-store"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateStore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StoreList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/stores"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <StoreListUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/change-password"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserPasswordChange />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['store_owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/change-password"
            element={
              <ProtectedRoute allowedRoles={['store_owner']}>
                <OwnerPasswordChange />
              </ProtectedRoute>
            }
          />

        
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;