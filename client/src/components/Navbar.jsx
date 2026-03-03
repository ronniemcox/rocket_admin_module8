import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Notification from "./Notification";
import { useNotice } from "../context/NoticeContext";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const { notice, showNotice } = useNotice();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    showNotice("success", "Logged out.", 7000);
    navigate("/login");
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

      <div>
        {isLoggedIn && (
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}