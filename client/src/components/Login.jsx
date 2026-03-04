import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useNotice } from "../context/NoticeContext";

export default function Login() {
  const navigate = useNavigate();
  const { showNotice } = useNotice();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1) Login (existing endpoint)
      const res = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        showNotice("danger", "Login failed. Please try again.", 7000);
        window.setTimeout(() => navigate("/unauthorized"), 400);
        return;
      }

      // Expect login to return user info (or user_id)
      const loginData = await res.json().catch(() => null);

      const userId =
        loginData?.data?.user?.id ||
        loginData?.user?._id ||
        loginData?.user_id ||
        loginData?._id;

      if (!userId) {
        showNotice(
          "danger",
          "Login succeeded but user_id was not returned by the server.",
          7000
        );
        return;
      }

      // 2) Create session (POST /session) -> saves to Mongo + sets cookie + returns token
      const sessionRes = await fetch("http://localhost:5050/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user_id: userId }),
      });

      if (!sessionRes.ok) {
        const text = await sessionRes.text().catch(() => "");
        showNotice(
          "danger",
          text || "Login succeeded but session creation failed.",
          7000
        );
        return;
      }

      const sessionData = await sessionRes.json().catch(() => null);

      const token = sessionData?.data?.token;
      if (!token) {
        showNotice("danger", "Session created but token was missing.", 7000);
        return;
      }

      // Store token locally for /validate_token?token=... calls (cookie is still set by server)
      localStorage.setItem("session_token", token);

      // Store minimal user display info for navbar
      const user =
        sessionData?.data?.user ||
        loginData?.data?.user ||
        loginData?.user ||
        null;

      if (user) {
        const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
        localStorage.setItem("username", fullName || user.email || "User");
      } else {
        localStorage.setItem("username", "User");
      }

      showNotice("success", "Login successful!", 7000);
      window.setTimeout(() => navigate("/"), 400);
    } catch (err) {
      console.error(err);
      showNotice("danger", "Server error. Please try again.", 7000);
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-bold mb-3">Login</h2>

      <Form onSubmit={handleSubmit} className="mt-3">
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="loginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign in
        </Button>
      </Form>
    </div>
  );
}