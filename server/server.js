import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transaction.js";
const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/", authRoutes);
app.use("/", transactionRoutes);
// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
