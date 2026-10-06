import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserEWaste, deleteEWaste } from "../services/api";
import RequestTable from "../components/RequestTable";

function MyRequests({ setCurrentPage, setSelectedRequestId }) {
  const { currentUser } = useAuth();

  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      if (!currentUser?.email) return;

      try {
        const list = await getUserEWaste(currentUser.email);

        setRequests(list || []);
        setError("");
      } catch (error) {
        console.error("Failed to load requests:", error);
        setError("Unable to load your requests.");
      }
    };

    loadRequests();

    const interval = setInterval(loadRequests, 3000);

    return () => clearInterval(interval);
  }, [currentUser?.email]);

  const handleDelete = async (id) => {
    try {
      await deleteEWaste(id);

      setRequests((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
      setError("Unable to delete the request.");
    }
  };

  const handleView = (request) => {
    console.log("================================");
    console.log("VIEW BUTTON CLICKED");
    console.log("Request:", request);
    console.log("Request ID:", request.id);
    console.log("================================");

    // Save selected request ID in React state
    setSelectedRequestId(request.id);

    sessionStorage.setItem(
      "selectedRequestId",
      String(request.id)
    );

    console.log(
      "Saved selectedRequestId:",
      sessionStorage.getItem("selectedRequestId")
    );

    // Open Track Request page
    setCurrentPage("trackRequest");
  };

  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <h2>My Requests</h2>
          <p>
            View and manage all of your submitted e-waste requests.
          </p>
        </div>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <RequestTable
        requests={requests}
        canDelete={true}
        onView={handleView}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default MyRequests;