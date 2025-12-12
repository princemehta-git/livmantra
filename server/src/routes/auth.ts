import express from "express";
import { prisma } from "../db";

const router = express.Router();

router.post("/guest", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone)
      return res.status(400).json({ error: "missing fields" });

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { name, email, phone } });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name, phone },
      });
    }

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

export default router;


