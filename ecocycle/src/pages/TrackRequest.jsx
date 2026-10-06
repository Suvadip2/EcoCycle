import { useEffect, useState } from "react";
import { getEWasteById } from "../services/api";
import "../styles/TrackRequest.css";

function TrackRequest({ requestId, setCurrentPage }) {
  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedId = sessionStorage.getItem("selectedRequestId");

    const finalRequestId =
      requestId || (savedId ? Number(savedId) : null);

    console.log("Track Request ID:", finalRequestId);

    if (!finalRequestId) {
      setError("No request selected.");
      setLoading(false);
      return;
    }

    const loadRequest = async () => {
      try {
        const item = await getEWasteById(Number(finalRequestId));

        console.log("Request received:", item);

        setRequest(item);
        setError("");
        setLoading(false);
      } catch (error) {
        console.error("Request loading error:", error);
        setError("Request not found.");
        setLoading(false);
      }
    };

    loadRequest();

    const interval = setInterval(loadRequest, 3000);

    return () => clearInterval(interval);
  }, [requestId]);

  if (loading) {
    return (
      <div className="track-page">
        <h2>Loading request...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="track-page">
        <div className="track-heading">
          <h2>Track Request</h2>
          <p>
            Track the current status of your e-waste request.
          </p>
        </div>

        <p className="track-error">
          {error}
        </p>

        <button
          type="button"
          className="track-back-button"
          onClick={() => setCurrentPage("myRequests")}
        >
          Back to My Requests
        </button>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="track-page">
        <h2>Request not found.</h2>

        <button
          type="button"
          className="track-back-button"
          onClick={() => setCurrentPage("myRequests")}
        >
          Back to My Requests
        </button>
      </div>
    );
  }

  const statuses = [
    "Pending",
    "Accepted",
    "Pickup Scheduled",
    "Collected",
    "Recycled",
  ];

  const currentIndex = statuses.indexOf(
    request.status
  );

  return (
    <div className="track-page">

      <div className="track-heading">
        <h2>Track Request</h2>
        <p>
          Track the current status of your e-waste request.
        </p>
      </div>

      <div className="track-details">

        <h3>
          Request #{request.id}
        </h3>

        <div className="track-info">

          <div>
            <span>Device</span>
            <strong>{request.deviceName}</strong>
          </div>

          <div>
            <span>Category</span>
            <strong>{request.category}</strong>
          </div>

          <div>
            <span>Quantity</span>
            <strong>{request.quantity}</strong>
          </div>

          <div>
            <span>Weight</span>
            <strong>{request.weight} Kg</strong>
          </div>

          <div>
            <span>Condition</span>
            <strong>{request.condition}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{request.status}</strong>
          </div>

        </div>

      </div>

      {/* STATUS TRACKER */}

      <div className="track-status">

        <h3>Request Progress</h3>

        <div className="track-progress">
          {statuses.map((status, index) => {
            const completed =
              index <= currentIndex;
            const isCurrent =
              index === currentIndex;

            return (
              <div
                key={status}
                className={[
                  "track-progress-step",
                  completed ? "completed" : "",
                  isCurrent ? "current" : "",
                ].filter(Boolean).join(" ")}
              >
                <div className="track-progress-marker">
                  {completed ? "✓" : "○"}
                </div>
                <span className="track-progress-label">{status}</span>
              </div>
            );
          })}

        </div>

      </div>

      <button
        type="button"
        className="track-back-button"
        onClick={() =>
          setCurrentPage("myRequests")
        }
      >
        Back to My Requests
      </button>

    </div>
  );
}

export default TrackRequest;