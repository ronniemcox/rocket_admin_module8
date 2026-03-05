import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import reportRoutes from "./routes/report.js";
import records from "./routes/record.js";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transaction.js";
import sessionRoutes from "./routes/session.js";

const PORT = process.env.PORT || 5050;
const app = express();

// IMPORTANT: required for cookies + credentials
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/", reportRoutes);
app.use("/record", records);
app.use("/", authRoutes);
app.use("/", transactionRoutes);
app.use("/", sessionRoutes);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});