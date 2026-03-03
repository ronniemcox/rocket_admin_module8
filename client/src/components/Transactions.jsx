import { useEffect, useMemo, useState } from "react";
import { Card, Form, Button, Table, Modal } from "react-bootstrap";
import { useNotice } from "../context/NoticeContext";

export default function Transactions() {
  const { showNotice } = useNotice();

  const [transactions, setTransactions] = useState([]);
  const [agents, setAgents] = useState([]);

  const [amount, setAmount] = useState("");
  const [agentId, setAgentId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Helpers
  const selectedAgentLabel = useMemo(() => {
    const a = agents.find((x) => x._id === agentId);
    if (!a) return "";
    return `${a._id} - ${a.first_name} ${a.last_name}`;
  }, [agents, agentId]);

  // Load last 10 transactions
  async function loadTransactions() {
    try {
      const res = await fetch("http://localhost:5050/transaction-data");
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to load transactions");
      }
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showNotice("danger", err.message || "Failed to load transactions.", 7000);
    }
  }

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load agents for dropdown
  useEffect(() => {
    async function loadAgents() {
      try {
        const res = await fetch("http://localhost:5050/record/");
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Failed to load agents");
        }
        const data = await res.json();
        setAgents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        showNotice("danger", err.message || "Failed to load agents.", 7000);
      }
    }

    loadAgents();
  }, [showNotice]);

  const canSubmit = useMemo(() => {
    const n = Number(amount);
    return agentId && Number.isFinite(n) && n > 0 && !isSubmitting;
  }, [amount, agentId, isSubmitting]);

  // Validate inputs and open modal
  function onSubmit(e) {
    e.preventDefault();

    const n = Number(amount);

    if (!agentId) {
      showNotice("danger", "Please select an agent.", 7000);
      return;
    }
    if (!Number.isFinite(n) || n <= 0) {
      showNotice("danger", "Amount must be a positive number.", 7000);
      return;
    }

    setShowConfirmModal(true);
  }

  function closeModal() {
    if (isSubmitting) return;
    setShowConfirmModal(false);
  }

  // Confirm handler: actually post
  async function confirmSubmit() {
    const n = Number(amount);

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5050/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: n, agent_id: agentId }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to submit transaction");
      }

      showNotice("success", "Transaction submitted successfully.", 7000);

      // Reset form
      setAmount("");
      setAgentId("");

      // Close modal
      setShowConfirmModal(false);

      // Refresh list
      await loadTransactions();
    } catch (err) {
      console.error(err);
      showNotice("danger", err.message || "Failed to submit transaction.", 7000);
      // keep modal open to retry or cancel
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-4">
      <h2 className="mb-4">Transaction Management</h2>

      <div className="d-flex gap-4 flex-wrap">
        {/* Transactions List */}
        <Card style={{ flex: 1, minWidth: 420 }}>
          <Card.Body>
            <Card.Title>Last 10 Transactions</Card.Title>
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Agent</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id || t._id}>
                      <td>{t.date ? new Date(t.date).toLocaleString() : ""}</td>
                      <td>{t.amount}</td>
                      <td>{t.agent_full_name || ""}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Transaction Form */}
        <Card style={{ width: 360 }}>
          <Card.Body>
            <Card.Title>Create Transaction</Card.Title>

            <Form className="mt-3" onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter a positive amount"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Agent</Form.Label>
                <Form.Select
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                >
                  <option value="">Select an agent...</option>
                  {agents.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a._id} - {a.first_name} {a.last_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="primary" disabled={!canSubmit}>
                Submit Transaction
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>

      {/* CONFIRM SUBMIT MODAL */}
      <Modal show={showConfirmModal} onHide={closeModal} centered>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>Confirm Transaction</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>
            Are you sure you want to submit this transaction?
            <div className="mt-3">
              <div>
                <strong>Amount:</strong> {amount}
              </div>
              <div className="mt-1">
                <strong>Agent:</strong> {selectedAgentLabel || agentId}
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}