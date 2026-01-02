import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth";
import testRoutes from "./routes/test";
import adminRoutes from "./routes/admin";
import userRoutes from "./routes/user";
import { chatAssistant } from "./services/openai";
import { initializeDatabase } from "./db";
import path from "path";

const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.post("/api/chat", async (req, res) => {
  const { userId, mode, message } = req.body;
  try {
    const r = await chatAssistant(userId || null, mode || "general", message || "");
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "chat error" });
  }
});

const port = process.env.PORT || 4000;

// Initialize database tables on server start
initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });


