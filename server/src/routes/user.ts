import express from "express";
import { prisma } from "../db";
import { authenticateUser, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Get user's test history
router.get("/tests", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const tests = await prisma.testResponse.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        score: true,
        snapshot: true,
        status: true,
        reportUrl: true,
        createdAt: true,
        _count: {
          select: {
            feedbacks: true,
          },
        },
      },
    });

    return res.json({ tests });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// Get user profile
router.get("/profile", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isAdmin: true,
        dob: true,
        gender: true,
        profileImage: true,
        state: true,
        nationality: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// Update user profile
router.put("/profile", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { name, phone, dob, gender, state, nationality } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (dob !== undefined) updateData.dob = dob ? new Date(dob) : null;
    if (gender !== undefined) updateData.gender = gender;
    if (state !== undefined) updateData.state = state;
    if (nationality !== undefined) updateData.nationality = nationality;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isAdmin: true,
        dob: true,
        gender: true,
        profileImage: true,
        state: true,
        nationality: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

export default router;

