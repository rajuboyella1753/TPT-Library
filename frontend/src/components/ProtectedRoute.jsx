import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. Token lekapothe Login ki pampali
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role match avvakapothe (unauthorized access)
  if (!allowedRoles.includes(user.role)) {
    alert("You don't have permission to access this page!");
    return <Navigate to="/login" replace />;
  }

  // 3. Anni correct ga unte page chupinchali
  return children;
};

export default ProtectedRoute;