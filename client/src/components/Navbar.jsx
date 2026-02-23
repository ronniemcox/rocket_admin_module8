import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center mb-6">
      <Link to="/" className="flex items-center space-x-2">
        <img
          src="/rocketLogo.png"
          alt="Rocket Elevators Logo"
          className="h-20 w-auto"
        />
        <span className="text-xl font-bold">Rocket Elevators Admin</span>
      </Link>

      <div className="space-x-4">
        {isLoggedIn && (
          <>
            <Link to="/" className="hover:underline">
              Agents
            </Link>

            <Link to="/create" className="hover:underline">
              Create Agent
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}