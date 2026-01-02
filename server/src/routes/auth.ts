import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db";
import { generateToken, authenticateUser, AuthRequest } from "../middleware/auth";
import { uploadSingle } from "../middleware/upload";
import path from "path";

const router = express.Router();

// Guest endpoint (keep for backward compatibility)
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

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "missing fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "password must be at least 6 characters" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
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

    const token = generateToken(user.id, user.isAdmin || false);

    return res.json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "missing fields" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const token = generateToken(user.id, user.isAdmin || false);

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      dob: user.dob,
      gender: user.gender,
      profileImage: user.profileImage,
      state: user.state,
      nationality: user.nationality,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.json({ token, user: userData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// Get current user
router.get("/me", authenticateUser, async (req: AuthRequest, res) => {
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

// Update profile
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

// Upload profile image
router.post("/upload", authenticateUser, (req: AuthRequest, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "no file uploaded" });
    }

    try {
      const filePath = `/uploads/profiles/${req.file.filename}`;

      const user = await prisma.user.update({
        where: { id: req.userId },
        data: { profileImage: filePath },
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

      return res.json({ user, imageUrl: filePath });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "server error" });
    }
  });
});

export default router;


