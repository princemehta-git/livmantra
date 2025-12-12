import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth";
import testRoutes from "./routes/test";
import { chatAssistant } from "./services/openai";

const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

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
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});


