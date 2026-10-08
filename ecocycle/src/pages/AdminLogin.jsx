import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { loginUser } from "../services/api";
import "../styles/Auth.css";

function AdminLogin({ setCurrentPage }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      const user = await loginUser(email, password);

      if (user?.role === "ADMIN") {
        login(user);
        setCurrentPage("admin");
        return;
      }

      setError("You do not have admin access.");
    } catch (error) {
      setError(error.message || "Invalid admin credentials.");
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h2>Admin Login</h2>
        <p>Login to manage EcoCycle.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <label>Admin Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
          />

          <button type="submit">Admin Login</button>
        </form>

        <button
          type="button"
          className="auth-secondary-button"
          onClick={() => setCurrentPage("adminRegister")}
        >
          Register as Admin
        </button>

        <button
          type="button"
          className="auth-secondary-button"
          onClick={() => setCurrentPage("home")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;