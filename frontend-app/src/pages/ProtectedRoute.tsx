import { Navigate, Outlet } from 'react-router-dom';

// Replace this with actual auth logic (e.g., context or token check)
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return Boolean(token);
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
