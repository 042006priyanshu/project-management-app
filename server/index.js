import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import projectRoutes from "./routes/project.js";
import teamRoutes from "./routes/teams.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8700;

/* ✅ Middlewares */

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));
app.disable("x-powered-by");

/* ✅ Database Connection */

const connect = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.log("❌ MongoDB error:", error);
  }
};

/* ✅ Routes */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/team", teamRoutes);

/* ✅ Error Handler */

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({
    success: false,
    status,
    message,
  });
});

/* ✅ Start Server */

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  connect();
});
