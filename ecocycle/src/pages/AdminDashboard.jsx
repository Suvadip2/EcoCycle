import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getAllUsers,
  getAllEWaste,
} from "../services/api";
import "../styles/AdminDashboard.css";

function AdminDashboard({ setCurrentPage }) {
  const { currentUser, logout } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    recycledRequests: 0,
    pickupScheduled: 0,
    totalWeight: 0,
  });

  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [users, requests] = await Promise.all([
          getAllUsers(),
          getAllEWaste(),
        ]);

        const userList = users || [];
        const requestList = requests || [];

        const pendingRequests = requestList.filter(
          (item) => item.status === "Pending"
        ).length;

        const acceptedRequests = requestList.filter(
          (item) => item.status === "Accepted"
        ).length;

        const recycledRequests = requestList.filter(
          (item) => item.status === "Recycled"
        ).length;

        const pickupScheduled = requestList.filter(
          (item) => item.status === "Pickup Scheduled"
        ).length;

        const totalWeight = requestList.reduce(
          (total, item) => total + Number(item.weight || 0),
          0
        );

        setStats({
          totalUsers: userList.length,
          totalRequests: requestList.length,
          pendingRequests,
          acceptedRequests,
          recycledRequests,
          pickupScheduled,
          totalWeight,
        });

        const latestRequests = requestList
          .slice()
          .sort((left, right) => {
            if (left.id == null || right.id == null) {
              return 0;
            }

            return Number(right.id) - Number(left.id);
          })
          .slice(0, 4);

        setRecentRequests(latestRequests);
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

  const recycledPercent = Math.min(
    100,
    Math.round(
      (stats.recycledRequests /
        Math.max(1, stats.totalRequests)) *
        100
    )
  );

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
            Monitor EcoCycle activities, manage requests,
            and track recycling performance.
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
              👥
            </div>

            <div>
              <span>Total Users</span>
              <h3>{stats.totalUsers}</h3>
              <small>Registered users</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon blue">
              📋
            </div>

            <div>
              <span>Total Requests</span>
              <h3>{stats.totalRequests}</h3>
              <small>All e-waste requests</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon orange">
              ⏳
            </div>

            <div>
              <span>Pending</span>
              <h3>{stats.pendingRequests}</h3>
              <small>Awaiting processing</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon purple">
              ♻️
            </div>

            <div>
              <span>Recycled</span>
              <h3>{stats.recycledRequests}</h3>
              <small>Successfully recycled</small>
            </div>
          </div>
        </div>
      </section>

      <div className="admin-secondary-stats">
        <div className="secondary-card">
          <div className="secondary-icon">
            ⚖️
          </div>

          <div>
            <span>Total E-Waste Collected</span>

            <strong>
              {stats.totalWeight.toFixed(1)} Kg
            </strong>
          </div>
        </div>

        <div className="secondary-card">
          <div className="secondary-icon">
            🚚
          </div>

          <div>
            <span>Pickup Scheduled</span>

            <strong>
              {stats.pickupScheduled}
            </strong>
          </div>
        </div>

        <div className="secondary-card">
          <div className="secondary-icon">
            🌱
          </div>

          <div>
            <span>Estimated CO₂ Saved</span>

            <strong>
              {(stats.totalWeight * 2.5).toFixed(1)} Kg
            </strong>
          </div>
        </div>
      </div>

      <div className="admin-content-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <div>
              <h2>Recycling Progress</h2>
              <p>
                Current request distribution
              </p>
            </div>

            <span className="panel-badge">
              {recycledPercent}%
            </span>
          </div>

          <div className="progress-container">
            <div className="progress-label">
              <span>
                Recycling completion
              </span>

              <strong>
                {recycledPercent}%
              </strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${recycledPercent}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="status-breakdown">
            <div>
              <span className="dot pending"></span>

              <span>Pending</span>

              <strong>
                {stats.pendingRequests}
              </strong>
            </div>

            <div>
              <span className="dot accepted"></span>

              <span>Accepted</span>

              <strong>
                {stats.acceptedRequests}
              </strong>
            </div>

            <div>
              <span className="dot recycled"></span>

              <span>Recycled</span>

              <strong>
                {stats.recycledRequests}
              </strong>
            </div>
          </div>
        </div>

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
            <h2>Recent Activity</h2>

            <p>
              Latest activity in the EcoCycle system
            </p>
          </div>

          <button
            className="view-all-button"
            onClick={() =>
              setCurrentPage("adminRequests")
            }
          >
            View All
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

          {recentRequests.length === 0 ? (
            <div className="activity-row">
              <span>No requests yet</span>
              <span>—</span>
              <span>—</span>
              <span>—</span>
              <span>—</span>
            </div>
          ) : (
            recentRequests.map((request) => {
              const statusClass = {
                Accepted: "accepted-status",
                Pending: "pending-status",
                "Pickup Scheduled":
                  "pickup-status",
                Collected:
                  "accepted-status",
                Recycled:
                  "recycled-status",
                Rejected:
                  "pending-status",
              }[request.status] ||
                "pending-status";

              return (
                <div
                  className="activity-row"
                  key={request.id}
                >
                  <span>
                    #{request.id}
                  </span>

                  <span>
                    {request.userName ||
                      request.userEmail ||
                      "EcoCycle User"}
                  </span>

                  <span>
                    {request.deviceName}
                  </span>

                  <span
                    className={`status ${statusClass}`}
                  >
                    {request.status}
                  </span>

                  <span>
                    {request.createdAt
                      ? new Date(
                          request.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              );
            })
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