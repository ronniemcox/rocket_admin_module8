import express from "express";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Agent from "../models/Agent.js";

const router = express.Router();

/*
GET /transaction-data
Return last 10 transactions
Sorted newest first
Include agent full name
If agent was deleted, show "Agent no longer active"
*/
router.get("/transaction-data", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("agent_id", "first_name last_name");

    const formatted = transactions.map((t) => {
      const agentName = t.agent_id
        ? `${t.agent_id.first_name} ${t.agent_id.last_name}`
        : "Agent no longer active";

      return {
        id: t._id,
        date: t.createdAt,
        amount: t.amount,
        agent_full_name: agentName,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

/*
POST /transaction
Body: { amount, agent_id }
*/
router.post("/transaction", async (req, res) => {
  try {
    const { amount, agent_id } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }

    if (!mongoose.Types.ObjectId.isValid(agent_id)) {
      return res.status(400).json({ error: "Invalid agent ID" });
    }

    const agent = await Agent.findById(agent_id);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    await Transaction.create({
      agent_id,
      amount,
    });

    // Update agent sales
    agent.sales += amount;
    await agent.save();

    res.status(201).json({ message: "Transaction created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

export default router;