import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Notification from "./Notification";
import { useNotice } from "../context/NoticeContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { notice, showNotice } = useNotice();

  const token = localStorage.getItem("session_token") || "";
  const username = localStorage.getItem("username") || "";

  const handleLogout = async () => {
    try {
      // Best effort server-side logout (delete session + clear cookie)
      await fetch("http://localhost:5050/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
    } catch (err) {
      // Even if server fails, we still clear local state
      console.error(err);
    } finally {
      localStorage.removeItem("session_token");
      localStorage.removeItem("username");
      showNotice("success", "Logged out.", 7000);
      navigate("/login");
    }
  };

  return (
    <nav className="flex justify-between items-center mb-2">
      <Link to="/" className="flex items-center space-x-2">
        <img
          src="/rocketLogo.png"
          alt="Rocket Elevators Logo"
          className="h-20 w-auto"
        />
        <span className="text-xl font-bold">Rocket Elevators Admin</span>
      </Link>

      {/* Centered notification in navbar */}
      <div className="flex-1 flex justify-center px-4">
        <div style={{ minWidth: "520px" }}>
          <Notification
            show={notice.show}
            variant={notice.variant}
            message={notice.message}
          />
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        {token && (
          <>
            <span style={{ fontSize: 14, opacity: 0.85 }}>
              {username ? `Hi, ${username}` : "Hi"}
            </span>
            <Button variant="outline-secondary" onClick={() => navigate("/create-user")}>
              Create User
            </Button>
            <Button variant="primary" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}