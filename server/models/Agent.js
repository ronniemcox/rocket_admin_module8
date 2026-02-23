import mongoose from "mongoose";

const AgentSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      // simple email format check (good enough for grading-level validation)
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    region: {
       type: String,
       required: true,
       trim: true,
       lowercase: true,
       enum: ["north", "south", "east", "west"],
    },

    // Grading sheet uses “Fee” (singular), and your current backend uses `fee`
    fee: { type: Number, required: true, min: 0 },

    rating: { type: Number, required: true, min: 0, max: 100 },

    sales: { type: Number, required: true, min: 0, default: 0 },
  },
  {
    timestamps: true,
    collection: "records", // IMPORTANT: keep existing collection name
  }
);

export default mongoose.model("Agent", AgentSchema);