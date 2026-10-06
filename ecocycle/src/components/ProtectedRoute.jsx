import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return null;
  }

  if (allowedRole && role !== allowedRole) {
    return null;
  }

  return children;
}

export default ProtectedRoute;
