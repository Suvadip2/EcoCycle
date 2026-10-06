import { useState } from "react";
import { registerUser } from "../services/api";
import "../styles/Auth.css";

function Register({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (formData.password.length < 6) {
      nextErrors.password =
        "Password must be at least 6 characters.";
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      nextErrors.phone =
        "Phone number must contain 10 digits.";
    }

    return nextErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setErrors({});
    setSuccess("");

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      });

      setTimeout(() => {
        setCurrentPage("login");
      }, 1200);
    } catch (error) {
      setErrors({
        form:
          error.message ||
          "Registration failed. Please try again.",
      });
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h2>Create EcoCycle Account</h2>

        <p>
          Register to submit and track e-waste.
        </p>

        {errors.form && (
          <p className="error-message">
            {errors.form}
          </p>
        )}

        {success && (
          <p className="success-message">
            {success}
          </p>
        )}

        <form onSubmit={handleRegister}>
          <label>Full Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          {errors.name && (
            <p className="field-error">
              {errors.name}
            </p>
          )}

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          {errors.email && (
            <p className="field-error">
              {errors.email}
            </p>
          )}

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
          />

          {errors.password && (
            <p className="field-error">
              {errors.password}
            </p>
          )}

          <label>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />

          {errors.confirmPassword && (
            <p className="field-error">
              {errors.confirmPassword}
            </p>
          )}

          <label>Phone Number</label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10 digit phone number"
          />

          {errors.phone && (
            <p className="field-error">
              {errors.phone}
            </p>
          )}

          <button type="submit">
            Register
          </button>
        </form>

        <button
          type="button"
          onClick={() =>
            setCurrentPage("login")
          }
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Register;