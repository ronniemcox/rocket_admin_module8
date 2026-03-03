import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    agent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, // creates createdAt automatically
  }
);

export default mongoose.model("Transaction", transactionSchema);