import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    region: "",
    fee: "",
    rating: "",
    sales: 0,
  });

  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString();
      if (!id) return;

      setIsNew(false);

      const response = await fetch(`http://localhost:5050/record/${id}`);
      if (!response.ok) {
        console.error("Error fetching record");
        return;
      }

      const record = await response.json();
      if (!record) {
        navigate("/");
        return;
      }

      setForm(record);
    }

    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const agent = { ...form };

    try {
      let response;

      if (isNew) {
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(agent),
        });
      } else {
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(agent),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save agent");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        region: "",
        fee: "",
        rating: "",
        sales: "",
      });
      navigate("/");
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create / Update Agent</h3>

      <form onSubmit={onSubmit} className="border rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.first_name}
            onChange={(e) => updateForm({ first_name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.last_name}
            onChange={(e) => updateForm({ last_name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.email}
            onChange={(e) => updateForm({ email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Region</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.region}
            onChange={(e) => updateForm({ region: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Fee</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.fee}
            onChange={(e) => updateForm({ fee: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Rating</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.rating}
            onChange={(e) => updateForm({ rating: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Sales</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.sales}
            onChange={(e) => updateForm({ sales: e.target.value })}
          />
        </div>

        <input
          type="submit"
          value="Save Agent"
          className="mt-4 px-4 py-2 border rounded cursor-pointer hover:bg-slate-100"
        />
      </form>
    </>
  );
}