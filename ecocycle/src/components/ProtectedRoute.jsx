import { useAuth } from "../context/useAuth";

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
