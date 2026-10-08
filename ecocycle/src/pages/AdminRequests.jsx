import { useEffect, useState } from "react";
import {
  getAllEWaste,
  getAllUsers,
  updateEWasteStatus,
  deleteEWaste,
} from "../services/api";
import "../styles/AdminRequests.css";

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadRequests = async () => {
      try {
        const [list, users] = await Promise.all([
          getAllEWaste(),
          getAllUsers(),
        ]);
        if (isActive) {
          const userNames = new Map(
            (users || []).map((user) => [
              user.email.trim().toLowerCase(),
              user.name,
            ])
          );
          setRequests((list || []).map((request) => ({
            ...request,
            userName: userNames.get(
              request.userEmail?.trim().toLowerCase()
            ) || "",
          })));
        }
      } catch (error) {
        console.error("Failed to load requests:", error);
      }
    };

    loadRequests();
    const interval = setInterval(loadRequests, 3000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, []);

  const categories = [...new Set(
    requests.map((request) => request.category).filter(Boolean)
  )].sort((left, right) => left.localeCompare(right));
  const statuses = [...new Set(
    requests.map((request) => request.status).filter(Boolean)
  )].sort((left, right) => left.localeCompare(right));
  const normalizedSearch = search.trim().toLowerCase();
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      !normalizedSearch ||
      [
        request.userName,
        request.userEmail,
        request.deviceName,
        request.category,
        String(request.id),
      ].some((value) =>
        String(value || "").toLowerCase().includes(normalizedSearch)
      );

    return matchesSearch &&
      (!category || request.category === category) &&
      (!status || request.status === status);
  });

  const handleStatusChange = async (id, status) => {
    try {
      const updatedRequest = await updateEWasteStatus(id, status);

      setRequests((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updatedRequest,
                userName: item.userName,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEWaste(id);

      setRequests((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  };

  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <h2>Admin Requests</h2>
          <p>
            Review, update, and manage all e-waste submissions.
          </p>
        </div>
      </div>

      <div className="request-filters">
        <label>
          Search
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by user, email, device, category or ID"
          />
        </label>

        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All Categories</option>
            {categories.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>

        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All Statuses</option>
            {statuses.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>

        <button
          type="button"
          className="small-button"
          onClick={() => {
            setSearch("");
            setCategory("");
            setStatus("");
          }}
        >
          Clear Filters
        </button>
      </div>

      {filteredRequests.length === 0 ? (
        <p>
          {requests.length === 0
            ? "No e-waste requests found."
            : "No requests match the selected search and filters."}
        </p>
      ) : filteredRequests.map((request) => (
        <div
          className="admin-request-card"
          key={request.id}
        >
          <div className="request-header">
            <strong>#{request.id}</strong>
            <span>{request.deviceName}</span>
          </div>

          <div className="request-meta">
            <p>
              <strong>User:</strong>{" "}
              {request.userName ||
                request.userEmail ||
                "EcoCycle User"}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {request.category}
            </p>

            <p>
              <strong>Weight:</strong>{" "}
              {request.weight} Kg
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {request.status}
            </p>

            <p>
              <strong>Pickup Address:</strong>{" "}
              {request.pickupAddress ||
                "Not provided"}
            </p>

            <p>
              <strong>Pickup City:</strong>{" "}
              {request.pickupCity ||
                "Not provided"}
            </p>

            <p>
              <strong>Pincode:</strong>{" "}
              {request.pickupPincode ||
                "Not provided"}
            </p>
          </div>

          <div className="status-actions">
            {[
              "Pending",
              "Accepted",
              "Pickup Scheduled",
              "Collected",
              "Recycled",
            ].map((status) => (
              <button
                key={status}
                type="button"
                disabled={request.status === status}
                className={
                  request.status === status
                    ? "status-chip active"
                    : "status-chip"
                }
                onClick={() =>
                  handleStatusChange(
                    request.id,
                    status
                  )
                }
              >
                {status}
              </button>
            ))}

            <button
              type="button"
              className="small-button danger"
              onClick={() =>
                handleDelete(request.id)
              }
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminRequests;