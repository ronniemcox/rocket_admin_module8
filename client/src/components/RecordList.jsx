import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { useNotice } from "../context/NoticeContext";

const RecordRow = ({ record, onRequestDelete }) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle">
      {(record.first_name || "") + " " + (record.last_name || "")}
    </td>

    <td className="p-4 align-middle">{record.region ?? ""}</td>
    <td className="p-4 align-middle">{record.rating ?? ""}</td>
    <td className="p-4 align-middle">{record.fee ?? ""}</td>
    <td className="p-4 align-middle">{record.sales ?? 0}</td>

    <td className="p-4 align-middle">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${record._id}`}
        >
          Edit
        </Link>

        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          type="button"
          onClick={() => onRequestDelete(record)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const navigate = useNavigate();
  const { showNotice } = useNotice();

  const [records, setRecords] = useState([]);

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch("http://localhost:5050/record/");
        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(text || response.statusText || "Failed to fetch agents");
        }

        const data = await response.json();
        setRecords(data);
      } catch (err) {
        console.error(err);
        showNotice("danger", err.message || "Failed to load agents.", 7000);
      }
    }

    getRecords();
  }, [showNotice]);

  function requestDelete(record) {
    setPendingDelete(record);
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    if (isDeleting) return;
    setShowDeleteModal(false);
    setPendingDelete(null);
  }

  async function confirmDelete() {
    if (!pendingDelete?._id) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:5050/record/${pendingDelete._id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || response.statusText || "Failed to delete agent");
      }

      setRecords((prev) => prev.filter((el) => el._id !== pendingDelete._id));
      showNotice("success", "Agent deleted successfully.", 7000);

      setShowDeleteModal(false);
      setPendingDelete(null);
    } catch (err) {
      console.error(err);
      showNotice("danger", err.message || "Failed to delete agent.", 7000);
      // keep modal open
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center p-4">
        <h3 className="text-lg font-semibold mb-0">Agent List</h3>
        <Button variant="primary" onClick={() => navigate("/create")}>
          Create Agent
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Region
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Rating
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Fee
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Sales
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="[&_tr:last-child]:border-0">
              {records.map((record) => (
                <RecordRow
                  key={record._id}
                  record={record}
                  onRequestDelete={requestDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton={!isDeleting}>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {pendingDelete ? (
            <>
              Are you sure you want to delete{" "}
              <strong>
                {pendingDelete.first_name} {pendingDelete.last_name}
              </strong>
              ?
              <div className="mt-2 text-muted" style={{ fontSize: 14 }}>
                This action cannot be undone.
              </div>
            </>
          ) : (
            "No agent selected."
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeDeleteModal}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={isDeleting || !pendingDelete}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}