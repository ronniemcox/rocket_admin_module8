import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
   <td className="p-4 align-middle">
     {(props.record.first_name || "") + " " + (props.record.last_name || "")}
   </td>

  <td className="p-4 align-middle">
  {props.record.region ?? ""}
  </td>

  <td className="p-4 align-middle">
  {props.record.rating ?? ""}
  </td>

  <td className="p-4 align-middle">
  {props.record.fee ?? ""}
  </td>

  <td className="p-4 align-middle">
  {props.record.sales ?? 0}
  </td>

  <td className="p-4 align-middle">
   <div className="flex gap-2">
    <Link
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
      to={`/edit/${props.record._id}`}
    >
      Edit
    </Link>

    <button
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
      type="button"
      onClick={() => props.deleteRecord(props.record._id)}
    >
      Delete
    </button>
    </div>
  </td>
  </tr>
);

export default function RecordList() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
    return;
  }, [records.length]);

  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // This method will map out the records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
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
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Region
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Rating
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Fee
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Sales
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {recordList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
