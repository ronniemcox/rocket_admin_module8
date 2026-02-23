import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="max-w-md">
      <h2 className="text-xl font-bold mb-2">Access Denied</h2>
      <p className="mb-4">Login failed. Please try again.</p>

      <Link className="underline" to="/login">
        Return to Login
      </Link>
    </div>
  );
}