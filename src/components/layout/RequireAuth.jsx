// components/layout/RequireAuth.jsx.   chks whether user is logged in using is authenticated . if user  not login it redirects to login 
import { Navigate, useLocation } from 'react-router-dom';  
import { useAuth } from '../../hooks/useAuth';

// Wrap any protected route element with this. If not logged in,
// redirect to /login and remember where they were trying to go.
export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();   //getting currenturl/location 

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
