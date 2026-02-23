import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

import Agent from "../models/Agent.js";
import validateAgent from "../middleware/validateAgent.js";

const router = express.Router();

// GET all agents (records collection) - leave as-is (Mongo driver)
router.get("/", async (req, res) => {
  try {
    const collection = await db.collection("records");
    const results = await collection.find({}).toArray();
    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error fetching records");
  }
});

// GET one agent by id - leave as-is (Mongo driver)
router.get("/:id", async (req, res) => {
  try {
    const collection = await db.collection("records");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) return res.status(404).send("Not found");
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error fetching record");
  }
});

// CREATE agent (Mongoose schema + route-level validation middleware)
router.post("/", validateAgent, async (req, res) => {
  try {
    const agent = await Agent.create(req.body);
    return res.status(201).json(agent);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// UPDATE agent (Mongoose schema + route-level validation middleware)
router.patch("/:id", validateAgent, async (req, res) => {
  try {
    const updated = await Agent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE agent - leave as-is (Mongo driver)
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = await db.collection("records");
    const result = await collection.deleteOne(query);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error deleting record");
  }
});

export default router;