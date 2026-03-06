import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading"); // loading | ok | fail

  useEffect(() => {
    async function validate() {
      const token = localStorage.getItem("session_token") || "";

      // Session 7 + 11: if no token, redirect to login
      if (!token) {
        localStorage.removeItem("username");
        setStatus("fail");
        return;
      }

      try {
        // Session 8-10: validate token against DB using /validate_token
        const res = await fetch(
          `http://localhost:5050/validate_token?token=${encodeURIComponent(
            token
          )}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          localStorage.removeItem("session_token");
          localStorage.removeItem("username");
          setStatus("fail");
          return;
        }

        const data = await res.json().catch(() => null);

        // Session 12: valid token -> allow route (home/admin pages)
        if (data?.status === "ok" && data?.data?.valid) {
          setStatus("ok");
          return;
        }

        // invalid response shape or invalid token
        localStorage.removeItem("session_token");
        localStorage.removeItem("username");
        setStatus("fail");
      } catch (err) {
        console.error(err);
        localStorage.removeItem("session_token");
        localStorage.removeItem("username");
        setStatus("fail");
      }
    }

    validate();
  }, []);

  if (status === "loading") {
    return <div className="p-4">Validating session...</div>;
  }

  if (status === "fail") {
    return <Navigate to="/login" replace />;
  }

  return children;
}