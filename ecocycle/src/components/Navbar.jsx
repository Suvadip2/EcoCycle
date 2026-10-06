import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar({ setCurrentPage }) {
  const { currentUser, isLoggedIn, role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentPage("home");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => setCurrentPage("home")}>
        EcoCycle
      </div>

      <div className="nav-links">
        <button type="button" onClick={() => setCurrentPage("home")}>Home</button>
        <button type="button" onClick={() => setCurrentPage("about")}>About</button>
        <button type="button" onClick={() => setCurrentPage("categories")}>Categories</button>

        {!isLoggedIn && (
          <>
            <button type="button" onClick={() => setCurrentPage("login")}>Login</button>
            <button type="button" onClick={() => setCurrentPage("register")}>Register</button>
            <button type="button" onClick={() => setCurrentPage("adminLogin")}>Admin Login</button>
          </>
        )}

        {isLoggedIn && role === "USER" && (
          <>
            <button type="button" onClick={() => setCurrentPage("dashboard")}>Dashboard</button>
            <button type="button" onClick={() => setCurrentPage("submitEWaste")}>Submit</button>
            <button type="button" onClick={() => setCurrentPage("myRequests")}>My Requests</button>
            <button type="button" className="nav-logout" onClick={handleLogout}>Logout</button>
          </>
        )}

        {isLoggedIn && role === "ADMIN" && (
          <>
            <button type="button" onClick={() => setCurrentPage("admin")}>Admin</button>
            <button type="button" onClick={() => setCurrentPage("adminRequests")}>Requests</button>
            <button type="button" onClick={() => setCurrentPage("adminUsers")}>Users</button>
            <button type="button" className="nav-logout" onClick={handleLogout}>Logout</button>
          </>
        )}

        {currentUser && <span className="welcome-tag">{currentUser.name}</span>}
      </div>
    </nav>
  );
}

export default Navbar;