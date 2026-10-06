import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllEWaste, getAllUsers } from "../services/api";
import { calculateCo2Saved } from "../utils/environmentalImpact";
import "../styles/AdminDashboard.css";

function AdminDashboard({ setCurrentPage }) {
  const { currentUser, logout } = useAuth();

  const [stats, setStats] = useState({
    collectedWeight: 0,
    co2Saved: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [users, requests] = await Promise.all([
          getAllUsers(),
          getAllEWaste(),
        ]);
        const requestList = requests || [];
        const activeUsers = new Map(
          (users || [])
            .filter((user) => user.role === "USER")
            .map((user) => [user.email.trim().toLowerCase(), user])
        );
        const collectedWeight = requestList
          .filter((item) =>
            ["Collected", "Recycled"].includes(item.status)
          )
          .reduce(
            (total, item) => total + Number(item.weight || 0),
          0
        );

        setStats({
          collectedWeight,
          co2Saved: calculateCo2Saved(requestList),
        });

        const activity = requestList
          .filter((request) =>
            request.status !== "Recycled" &&
            activeUsers.has(request.userEmail?.trim().toLowerCase())
          )
          .sort((left, right) => Number(right.id) - Number(left.id))
          .slice(0, 5)
          .map((request) => ({
            ...request,
            userName: activeUsers.get(
              request.userEmail.trim().toLowerCase()
            ).name,
          }));

        setRecentActivity(activity);
      } catch (error) {
        console.error(
          "Failed to load admin dashboard:",
          error
        );
      }
    };

    // Load immediately
    loadDashboard();

    // Automatically update every 3 seconds
    const interval = setInterval(loadDashboard, 3000);

    // Stop polling when leaving the page
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    setCurrentPage("home");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-welcome">
        <div>
          <span className="admin-label">
            ADMIN PANEL
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Track total e-waste collected and estimated CO₂ savings.
          </p>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">👨‍💼</div>

          <div>
            <strong>{currentUser?.name}</strong>
            <span>{currentUser?.email}</span>
          </div>
        </div>
      </div>

      <section className="admin-section">
        <div className="section-heading">
          <div>
            <h2>Overview</h2>
            <p>
              Current EcoCycle system statistics
            </p>
          </div>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon green">
              ⚖️
            </div>

            <div>
              <span>Total E-Waste Collected</span>
              <h3>{stats.collectedWeight.toFixed(1)} Kg</h3>
              <small>Collected or recycled</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon purple">
              🌱
            </div>

            <div>
              <span>Estimated CO₂ Saved</span>
              <h3>{stats.co2Saved.toFixed(1)} Kg</h3>
              <small>From recycled e-waste</small>
            </div>
          </div>
        </div>
      </section>

      <div className="admin-content-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage EcoCycle</p>
            </div>

            <span>⚡</span>
          </div>

          <div className="admin-actions">
            <button
              onClick={() =>
                setCurrentPage("adminRequests")
              }
            >
              <span>📋</span>

              <div>
                <strong>
                  Manage Requests
                </strong>

                <small>
                  Review and update requests
                </small>
              </div>

              <b>→</b>
            </button>

            <button
              onClick={() =>
                setCurrentPage("adminUsers")
              }
            >
              <span>👥</span>

              <div>
                <strong>
                  Manage Users
                </strong>

                <small>
                  View registered users
                </small>
              </div>

              <b>→</b>
            </button>

            <button
              onClick={() =>
                setCurrentPage("adminRequests")
              }
            >
              <span>🚚</span>

              <div>
                <strong>
                  Pickup Management
                </strong>

                <small>
                  Manage scheduled pickups
                </small>
              </div>

              <b>→</b>
            </button>
          </div>
        </div>
      </div>

      <section className="admin-section">
        <div className="section-heading">
          <div>
            <h2>Recent User Activity</h2>
            <p>Latest requests from active user accounts</p>
          </div>

          <button
            className="view-all-button"
            onClick={() => setCurrentPage("adminRequests")}
          >
            View Requests
          </button>
        </div>

        <div className="activity-table">
          <div className="activity-header">
            <span>Request</span>
            <span>User</span>
            <span>Device</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          {recentActivity.length === 0 ? (
            <div className="activity-row">
              <span>No recent activity</span>
              <span>—</span>
              <span>—</span>
              <span>—</span>
              <span>—</span>
            </div>
          ) : (
            recentActivity.map((request) => (
              <div className="activity-row" key={request.id}>
                <span>#{request.id}</span>
                <span>{request.userName}</span>
                <span>{request.deviceName}</span>
                <span>{request.status}</span>
                <span>
                  {request.createdAt
                    ? new Date(request.createdAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="admin-bottom">
        <div>
          <strong>
            Logged in as Administrator
          </strong>

          <span>
            You have full access to EcoCycle
            management.
          </span>
        </div>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;