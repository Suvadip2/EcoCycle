import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteUser, getAllUsers } from "../services/api";
import "../styles/AdminUsers.css";

function AdminUsers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const list = await getAllUsers();
        setUsers(list || []);
      } catch (error) {
        console.error("Failed to load users:", error);
        setError("Unable to load users.");
      }
    };

    loadUsers();
  }, []);

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Delete the account for ${user.name} (${user.email})? Their personal request details will be removed while aggregate recycling totals are retained.`
    );

    if (!confirmed) {
      return;
    }

    setDeleteError("");
    setAdminPassword("");
    setUserToDelete(user);
  };

  const confirmDelete = async (event) => {
    event.preventDefault();
    if (!userToDelete || !adminPassword) {
      return;
    }

    setDeleteError("");
    setError("");
    setDeletingUserId(userToDelete.id);

    const deletingId = userToDelete.id;

    try {
      await deleteUser(deletingId, currentUser.email, adminPassword);
      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser.id !== deletingId)
      );
      setUserToDelete(null);
      setAdminPassword("");
    } catch (error) {
      console.error("Failed to delete user:", error);
      setDeleteError(
        error instanceof TypeError
          ? "Unable to reach the backend. Make sure the backend server is running."
          : error.message || "Unable to delete user."
      );
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <h2>Admin Users</h2>
          <p>
            View registered users and their account details.
          </p>
        </div>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div className="table-wrapper">
        <table className="request-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Registration Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="empty-table"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>{user.phone}</td>

                  <td>{user.role}</td>

                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString()
                      : "Not recorded"}
                  </td>

                  <td>
                    {user.role === "ADMIN" ? (
                      <span>Protected</span>
                    ) : (
                      <button
                        type="button"
                        className="small-button danger"
                        onClick={() => handleDelete(user)}
                        disabled={deletingUserId === user.id}
                      >
                        {deletingUserId === user.id ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {userToDelete && (
        <div className="delete-modal-backdrop">
          <form
            className="delete-modal"
            onSubmit={confirmDelete}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
          >
            <h2 id="delete-user-title">Confirm account deletion</h2>
            <p>
              Enter your admin password to delete {userToDelete.name}'s account.
            </p>

            <label htmlFor="admin-password">Admin password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
              required
              autoFocus
            />

            {deleteError && (
              <p className="error-message" role="alert">
                {deleteError}
              </p>
            )}

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-cancel"
                onClick={() => {
                  setUserToDelete(null);
                  setAdminPassword("");
                  setDeleteError("");
                }}
                disabled={deletingUserId !== null}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="small-button danger"
                disabled={deletingUserId !== null || !adminPassword}
              >
                {deletingUserId !== null ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;