import express from "express";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../db";
import { generateToken, authenticateUser, AuthRequest } from "../middleware/auth";
import { uploadSingle } from "../middleware/upload";
import path from "path";

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

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

// Google OAuth login/signup
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: "idToken is required" });
    }

    if (!client) {
      return res.status(500).json({ error: "Google OAuth not configured" });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email || !googleId) {
      return res.status(400).json({ error: "Invalid Google account" });
    }

    // Check if user exists by googleId
    let user = await prisma.user.findUnique({ where: { googleId } });

    if (user) {
      // User exists with this googleId, login
      const token = generateToken(user.id, user.isAdmin || false);
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        dob: user.dob,
        gender: user.gender,
        profileImage: user.profileImage || picture || null,
        state: user.state,
        nationality: user.nationality,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Update profile image if Google provides one and user doesn't have one
      if (picture && !user.profileImage) {
        await prisma.user.update({
          where: { id: user.id },
          data: { profileImage: picture },
        });
        userData.profileImage = picture;
      }

      return res.json({ token, user: userData });
    }

    // Check if user exists by email (link Google account)
    user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // User exists with this email, link Google account
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          // Update profile image if Google provides one and user doesn't have one
          profileImage: user.profileImage || picture || null,
          // Update name if user name is missing or default
          name: user.name || name,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          password: true,
          googleId: true,
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
      user = updatedUser;

      const token = generateToken(updatedUser.id, updatedUser.isAdmin || false);
      const userData = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
        dob: updatedUser.dob,
        gender: updatedUser.gender,
        profileImage: updatedUser.profileImage,
        state: updatedUser.state,
        nationality: updatedUser.nationality,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };

      return res.json({ token, user: userData });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: name || "User",
        email,
        phone: "", // Empty string for Google users, can be updated later
        googleId,
        profileImage: picture || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        password: true,
        googleId: true,
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

    const token = generateToken(newUser.id, newUser.isAdmin || false);
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      isAdmin: newUser.isAdmin,
      dob: newUser.dob,
      gender: newUser.gender,
      profileImage: newUser.profileImage,
      state: newUser.state,
      nationality: newUser.nationality,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return res.json({ token, user: userData });
  } catch (err) {
    console.error("Google OAuth error:", err);
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


