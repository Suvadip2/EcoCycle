import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { getUserEWaste } from "../services/api";
import "../styles/Dashboard.css";

function UserDashboard({ setCurrentPage }) {
  const { currentUser, logout } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    recycled: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!currentUser?.email) return;

      try {
        const requests = await getUserEWaste(currentUser.email);

        const list = requests || [];

        setStats({
          total: list.length,

          pending: list.filter(
            (item) => item.status === "Pending"
          ).length,

          accepted: list.filter(
            (item) => item.status === "Accepted"
          ).length,

          recycled: list.filter(
            (item) => item.status === "Recycled"
          ).length,
        });
      } catch (error) {
        console.error("Failed to load dashboard statistics:", error);
      }
    };

    loadStats();
  }, [currentUser?.email]);

  const handleLogout = () => {
    logout();
    setCurrentPage("home");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>User Dashboard</h1>
          <p>Welcome back, {currentUser?.name}!</p>
          <span>
            Manage your e-waste recycling requests from here.
          </span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div>
            <h3>{stats.total}</h3>
            <p>Total Requests</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div>
            <h3>{stats.pending}</h3>
            <p>Pending Requests</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div>
            <h3>{stats.accepted}</h3>
            <p>Accepted Requests</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">♻️</div>
          <div>
            <h3>{stats.recycled}</h3>
            <p>Recycled Items</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Quick Actions</h2>

        <div className="action-grid">
          <button
            className="action-card"
            onClick={() => setCurrentPage("submitEWaste")}
          >
            <span>♻️</span>
            <strong>Submit E-Waste</strong>
            <small>Submit a new recycling request</small>
          </button>

          <button
            className="action-card"
            onClick={() => setCurrentPage("myRequests")}
          >
            <span>📋</span>
            <strong>My Requests</strong>
            <small>View your submitted requests</small>
          </button>

          <button
            className="action-card"
            onClick={() => setCurrentPage("trackRequest")}
          >
            <span>📦</span>
            <strong>Track Request</strong>
            <small>Track your recycling request</small>
          </button>

          <button
            className="action-card"
            onClick={() => setCurrentPage("environmentalImpact")}
          >
            <span>🌱</span>
            <strong>Environmental Impact</strong>
            <small>See your environmental contribution</small>
          </button>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Account Information</h2>

        <div className="user-info-card">
          <div>
            <strong>Name</strong>
            <p>{currentUser?.name}</p>
          </div>

          <div>
            <strong>Email</strong>
            <p>{currentUser?.email}</p>
          </div>

          <div>
            <strong>Role</strong>
            <p>{currentUser?.role}</p>
          </div>
        </div>
      </div>

      <div className="logout-section">
        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;