import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useNotice } from "../context/NoticeContext";

export default function CreateUser() {
  const { showNotice } = useNotice();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      showNotice("danger", "All fields are required.", 7000);
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:5050/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg =
          data?.message || data?.error || "Failed to create user.";
        throw new Error(msg);
      }

      showNotice("success", "User created successfully.", 7000);

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.error(err);
      showNotice("danger", err.message || "Failed to create user.", 7000);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mt-4" style={{ maxWidth: 520 }}>
      <h2 className="mb-3">Create User</h2>

      <Card>
        <Card.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                value={form.first_name}
                onChange={(e) => updateForm({ first_name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                value={form.last_name}
                onChange={(e) => updateForm({ last_name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => updateForm({ email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) => updateForm({ password: e.target.value })}
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? "Creating..." : "Create User"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}