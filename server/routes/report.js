import express from "express";
import Transaction from "../models/Transaction.js";
import Agent from "../models/Agent.js";

const router = express.Router();

// Helper: YYYY-MM-DD (local)
function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

router.get("/report-data", async (req, res) => {
  try {
    // Use the real collection name from the Agent model
    const agentCollectionName = Agent.collection.name;

    // ---- Bar: total transaction amount per agent ----
    const barAgg = await Transaction.aggregate([
      {
        $group: {
          _id: "$agent_id",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
      {
        $lookup: {
          from: agentCollectionName,
          localField: "_id",
          foreignField: "_id",
          as: "agent",
        },
      },
      { $unwind: { path: "$agent", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          agent_id: "$_id",
          agent_name: {
            $cond: [
              { $ifNull: ["$agent", false] },
              { $concat: ["$agent.first_name", " ", "$agent.last_name"] },
              "Agent no longer active",
            ],
          },
          total: 1,
        },
      },
    ]);

    const agent_bar_data = barAgg.map((x) => ({
      agent: x.agent_name,
      total: Number(x.total || 0),
    }));

    // ---- Line: daily totals for past 14 days (including today) ----
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const start = new Date();
    start.setDate(start.getDate() - 13);
    start.setHours(0, 0, 0, 0);

    const lineAgg = await Transaction.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          total: 1,
        },
      },
    ]);

    // Fill missing days with 0
    const totalsByDay = new Map(
      lineAgg.map((d) => [d.date, Number(d.total || 0)])
    );

    const transaction_line_data = [];
    for (let i = 0; i < 14; i++) {
      const dt = new Date(start);
      dt.setDate(start.getDate() + i);
      const key = toYMD(dt);
      transaction_line_data.push({
        date: key,
        total: totalsByDay.get(key) || 0,
      });
    }

    return res.status(200).json({
      status: "ok",
      data: { agent_bar_data, transaction_line_data },
      message: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      data: null,
      message: "Failed to build report data",
    });
  }
});

export default router;