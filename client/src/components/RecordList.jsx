import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useNotice } from "../context/NoticeContext";

const RecordRow = ({ record, onDelete }) => (
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
          onClick={() => onDelete(record._id)}
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

  // Fetch records
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

  // Delete record (with notices)
  async function deleteRecord(id) {
    try {
      const response = await fetch(`http://localhost:5050/record/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || response.statusText || "Failed to delete agent");
      }

      setRecords((prev) => prev.filter((el) => el._id !== id));
      showNotice("success", "Agent deleted successfully.", 7000);
    } catch (err) {
      console.error(err);
      showNotice("danger", err.message || "Failed to delete agent.", 7000);
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
                  onDelete={deleteRecord}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}