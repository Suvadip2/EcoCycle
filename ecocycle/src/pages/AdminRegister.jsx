import { useState } from "react";
import { registerAdmin } from "../services/api";
import "../styles/Auth.css";

function AdminRegister({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrors({});
    setSuccess("");

    const nextErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = "Name is required.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.adminCode.trim()) {
      nextErrors.adminCode = "Admin Code is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      await registerAdmin({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        adminCode: formData.adminCode,
      });

      setSuccess("Admin account created. Redirecting to Admin Login...");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        adminCode: "",
      });
      setTimeout(() => setCurrentPage("adminLogin"), 1200);
    } catch (error) {
      setErrors({
        form: error.message || "Admin registration failed. Please try again.",
      });
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h2>Admin Registration</h2>
        <p>Create an EcoCycle administrator account.</p>

        {errors.form && <p className="error-message">{errors.form}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleRegister}>
          <label htmlFor="admin-name">Full Name</label>
          <input
            id="admin-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="field-error">{errors.name}</p>}

          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
          />
          {errors.password && <p className="field-error">{errors.password}</p>}

          <label htmlFor="admin-confirm-password">Confirm Password</label>
          <input
            id="admin-confirm-password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="field-error">{errors.confirmPassword}</p>
          )}

          <label htmlFor="admin-code">Admin Code</label>
          <input
            id="admin-code"
            type="password"
            name="adminCode"
            value={formData.adminCode}
            onChange={handleChange}
            placeholder="Enter your Admin Code"
            autoComplete="off"
          />
          {errors.adminCode && (
            <p className="field-error">{errors.adminCode}</p>
          )}

          <button type="submit">Create Admin Account</button>
        </form>

        <button
          type="button"
          className="auth-secondary-button"
          onClick={() => setCurrentPage("adminLogin")}
        >
          Back to Admin Login
        </button>
      </div>
    </div>
  );
}

export default AdminRegister;
