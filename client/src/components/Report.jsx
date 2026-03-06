import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useNotice } from "../context/NoticeContext";

export default function Report() {
  const { showNotice } = useNotice();

  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5050/report-data", {
          credentials: "include",
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Failed to load report data");
        }

        const payload = await res.json().catch(() => null);
        if (payload?.status !== "ok") {
          throw new Error(payload?.message || "Report endpoint returned error");
        }

        setBarData(payload?.data?.agent_bar_data || []);
        setLineData(payload?.data?.transaction_line_data || []);
      } catch (err) {
        console.error(err);
        showNotice("danger", err.message || "Failed to load report.", 7000);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [showNotice]);

  return (
    <div className="mt-4">
      <h2 className="mb-4">Reports</h2>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Total Transaction Amount per Agent</Card.Title>
          <div style={{ width: "100%", height: 320 }}>
            {loading ? (
              <div className="p-3">Loading...</div>
            ) : (
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="agent" interval={0} angle={-15} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Daily Transaction Totals (Last 14 Days)</Card.Title>
          <div style={{ width: "100%", height: 320 }}>
            {loading ? (
              <div className="p-3">Loading...</div>
            ) : (
              <ResponsiveContainer>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}