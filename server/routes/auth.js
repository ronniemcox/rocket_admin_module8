import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * POST /register
 * Body: { first_name, last_name, email, password }
 * Creates a new user (plaintext password for this project).
 */
router.post("/register", async (req, res) => {
  try {
    const first_name = String(req.body.first_name ?? "").trim();
    const last_name = String(req.body.last_name ?? "").trim();
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        status: "error",
        data: null,
        message: "first_name, last_name, email, and password are required",
      });
    }

    // Prevent duplicate emails
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        status: "error",
        data: null,
        message: "A user with that email already exists",
      });
    }

    const user = await User.create({
      first_name,
      last_name,
      email,
      password, // plaintext per current module scope
    });

    return res.status(201).json({
      status: "ok",
      data: {
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      },
      message: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      data: null,
      message: err.message || "Server error",
    });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        data: null,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    // Basic credential check (hashing is extra mile; not required)
    if (!user || user.password !== password) {
      return res.status(401).json({
        status: "error",
        data: null,
        message: "Invalid credentials",
      });
    }

    return res.status(200).json({
      status: "ok",
      data: {
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      },
      message: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      data: null,
      message: err.message || "Server error",
    });
  }
});

export default router;