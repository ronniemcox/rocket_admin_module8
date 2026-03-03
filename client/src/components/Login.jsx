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
      const res = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        localStorage.setItem("isLoggedIn", "true");
        showNotice("success", "Login successful!", 7000);

        // let user see it briefly, then go home
        window.setTimeout(() => navigate("/"), 800);
      } else {
        showNotice("danger", "Login failed. Please try again.", 7000);
        window.setTimeout(() => navigate("/unauthorized"), 400);
      }
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