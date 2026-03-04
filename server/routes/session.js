import express from "express";
import crypto from "crypto";
import Session from "../models/Session.js";
import User from "../models/User.js";

const router = express.Router();

function newToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * POST /session
 * Body: { user_id }
 * Creates a session, saves to Mongo, sets cookie, returns token + user
 */
router.post("/session", async (req, res) => {
  try {
    const user_id = String(req.body.user_id || "").trim();
    if (!user_id) {
      return res.status(400).json({
        status: "error",
        data: null,
        message: "user_id is required",
      });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        data: null,
        message: "User not found",
      });
    }

    const token = newToken();

    await Session.create({ user_id: user._id, token });

    // httpOnly cookie so JS can’t read it (good security practice)
    res.cookie("session_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 24h
    });

    return res.status(201).json({
      status: "ok",
      data: {
        token,
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
      message: "Failed to create session",
    });
  }
});

/**
 * GET /validate_token?token=...
 * Validates token against DB
 */
router.get("/validate_token", async (req, res) => {
  try {
    const token = String(req.query.token || "").trim();
    if (!token) {
      return res.status(400).json({
        status: "error",
        data: null,
        message: "token query parameter is required",
      });
    }

    const session = await Session.findOne({ token }).populate(
      "user_id",
      "first_name last_name email"
    );

    if (!session || !session.user_id) {
      return res.status(401).json({
        status: "error",
        data: null,
        message: "Invalid token",
      });
    }

    return res.status(200).json({
      status: "ok",
      data: {
        valid: true,
        user: {
          id: session.user_id._id,
          first_name: session.user_id.first_name,
          last_name: session.user_id.last_name,
          email: session.user_id.email,
        },
      },
      message: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      data: null,
      message: "Failed to validate token",
    });
  }
});

/**
 * POST /logout
 * Deletes session from DB + clears cookie
 */
router.post("/logout", async (req, res) => {
  try {
    const token =
      String(req.cookies?.session_token || "").trim() ||
      String(req.body?.token || "").trim();

    if (token) {
      await Session.deleteOne({ token });
    }

    res.clearCookie("session_token", { sameSite: "lax" });

    return res.status(200).json({
      status: "ok",
      data: { logged_out: true },
      message: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      data: null,
      message: "Failed to logout",
    });
  }
});

export default router;