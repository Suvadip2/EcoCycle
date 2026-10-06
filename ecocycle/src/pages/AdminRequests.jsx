import { useEffect, useState } from "react";
import {
  getAllEWaste,
  updateEWasteStatus,
  deleteEWaste,
} from "../services/api";

function AdminRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    let isActive = true;

    const loadRequests = async () => {
      try {
        const list = await getAllEWaste();
        if (isActive) {
          setRequests((list || []).filter((request) => request.status !== "Recycled"));
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

  const handleStatusChange = async (id, status) => {
    try {
      await updateEWasteStatus(id, status);

      setRequests((prev) =>
        status === "Recycled"
          ? prev.filter((item) => item.id !== id)
          : prev.map((item) =>
              item.id === id ? { ...item, status } : item
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

      {requests.length === 0 && (
        <p>No active e-waste requests. Recycled items are included in the aggregate impact totals.</p>
      )}

      {requests.map((request) => (
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
              "Rejected",
            ].map((status) => (
              <button
                key={status}
                type="button"
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