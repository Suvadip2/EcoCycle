import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import "../styles/Auth.css";

function Login({ setCurrentPage }) {
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

      if (user?.role === "USER") {
        login(user);
        setCurrentPage("dashboard");
        return;
      }

      setError("Invalid email or password.");
    } catch (error) {
      setError(error.message || "Invalid email or password.");
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h2>User Login</h2>
        <p>Login to manage your e-waste requests.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <button type="submit">Login</button>
        </form>

        <p>Don't have an account?</p>

        <button
          type="button"
          onClick={() => setCurrentPage("register")}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Login;