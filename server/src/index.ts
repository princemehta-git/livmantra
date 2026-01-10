import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();

import authRoutes from "./routes/auth";
import testRoutes from "./routes/test";
import adminRoutes from "./routes/admin";
import userRoutes from "./routes/user";
import messageRoutes from "./routes/messages";
import { chatAssistant } from "./services/openai";
import { initializeDatabase } from "./db";
import path from "path";
import { initializeSocketIO } from "./services/socketService";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  },
});

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);

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
    // Initialize Socket.io service
    initializeSocketIO(io);

    httpServer.listen(port, () => {
      console.log(`Server running on ${port}`);
      console.log(`Socket.io server initialized`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });

export { io };


