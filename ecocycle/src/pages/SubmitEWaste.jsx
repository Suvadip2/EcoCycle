import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { submitEWaste } from "../services/api";
import "../styles/SubmitEWaste.css";

function SubmitEWaste({ setCurrentPage }) {
  const { currentUser } = useAuth();

  const [form, setForm] = useState({
    deviceName: "",
    category: "",
    quantity: "",
    condition: "",
    weight: "",
    description: "",
    pickupAddress: "",
    pickupCity: "",
    pickupPincode: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.deviceName.trim()) {
      newErrors.deviceName = "Device name is required.";
    }

    if (!form.category) {
      newErrors.category = "Please select a category.";
    }

    if (!form.quantity || Number(form.quantity) < 1) {
      newErrors.quantity = "Quantity must be at least 1.";
    }

    if (!form.condition) {
      newErrors.condition = "Please select the condition.";
    }

    if (!form.weight || Number(form.weight) <= 0) {
      newErrors.weight = "Weight must be greater than 0.";
    }

    if (!form.pickupAddress.trim()) {
      newErrors.pickupAddress =
        "Pickup address is required.";
    }

    if (!form.pickupCity.trim()) {
      newErrors.pickupCity =
        "Pickup city is required.";
    }

    if (!/^\d{6}$/.test(form.pickupPincode)) {
      newErrors.pickupPincode =
        "Pincode must be exactly 6 digits.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");

    if (!validateForm()) {
      return;
    }

    if (!currentUser?.email) {
      setErrors({
        submit: "Please login before submitting e-waste.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        deviceName: form.deviceName.trim(),
        category: form.category,
        quantity: Number(form.quantity),
        condition: form.condition,
        weight: Number(form.weight),
        description: form.description.trim(),
        status: "Pending",
        userEmail: currentUser.email,
        pickupAddress: form.pickupAddress.trim(),
        pickupCity: form.pickupCity.trim(),
        pickupPincode: form.pickupPincode,
      };

      await submitEWaste(payload);
      setCurrentPage("myRequests");

      setForm({
        deviceName: "",
        category: "",
        quantity: "",
        condition: "",
        weight: "",
        description: "",
        pickupAddress: "",
        pickupCity: "",
        pickupPincode: "",
      });

      setErrors({});
    } catch (error) {
      console.error(
        "E-waste submission error:",
        error
      );

      setErrors({
        submit:
          error.message ||
          "Unable to submit e-waste request.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-page">
      <div className="submit-container">

        <div className="submit-heading">
          <h2>Submit E-Waste</h2>
          <p>
            Provide details about the electronic waste
            you want to recycle.
          </p>
        </div>

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {errors.submit && (
          <div className="error-message">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-intro">
            <h2>Device Information</h2>
            <p>
              Enter the details of the electronic waste.
            </p>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>Device Name</label>

              <input
                type="text"
                name="deviceName"
                value={form.deviceName}
                onChange={handleChange}
                placeholder="e.g. Old Laptop"
              />

              {errors.deviceName && (
                <span className="field-error">
                  {errors.deviceName}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Category</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">
                  Select Category
                </option>

                <option value="Computers">
                  Computers
                </option>

                <option value="Mobile Devices">
                  Mobile Devices
                </option>

                <option value="Home Appliances">
                  Home Appliances
                </option>

                <option value="Accessories">
                  Accessories
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

              {errors.category && (
                <span className="field-error">
                  {errors.category}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Quantity</label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 2"
              />

              {errors.quantity && (
                <span className="field-error">
                  {errors.quantity}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Condition</label>

              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
              >
                <option value="">
                  Select Condition
                </option>

                <option value="Working">
                  Working
                </option>

                <option value="Partially Working">
                  Partially Working
                </option>

                <option value="Not Working">
                  Not Working
                </option>
              </select>

              {errors.condition && (
                <span className="field-error">
                  {errors.condition}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Weight (Kg)</label>

              <input
                type="number"
                name="weight"
                min="0.1"
                step="0.1"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g. 2.5"
              />

              {errors.weight && (
                <span className="field-error">
                  {errors.weight}
                </span>
              )}
            </div>

          </div>

          <div className="form-group full-width">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add any additional information..."
              rows="4"
            />
          </div>

          <div className="form-intro">
            <h2>Pickup Location</h2>
            <p>
              Enter the location where the e-waste
              should be collected.
            </p>
          </div>

          <div className="form-grid">

            <div className="form-group full-width">
              <label>Pickup Address</label>

              <input
                type="text"
                name="pickupAddress"
                value={form.pickupAddress}
                onChange={handleChange}
                placeholder="Enter complete pickup address"
              />

              {errors.pickupAddress && (
                <span className="field-error">
                  {errors.pickupAddress}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>City</label>

              <input
                type="text"
                name="pickupCity"
                value={form.pickupCity}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
              />

              {errors.pickupCity && (
                <span className="field-error">
                  {errors.pickupCity}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Pincode</label>

              <input
                type="text"
                name="pickupPincode"
                value={form.pickupPincode}
                onChange={handleChange}
                placeholder="e.g. 400001"
                maxLength="6"
              />

              {errors.pickupPincode && (
                <span className="field-error">
                  {errors.pickupPincode}
                </span>
              )}
            </div>

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                setCurrentPage("dashboard")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit E-Waste"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default SubmitEWaste;