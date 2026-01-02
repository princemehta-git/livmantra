import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db";
import { generateToken, authenticateAdmin, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return res.status(500).json({ error: "admin credentials not configured" });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ error: "invalid admin credentials" });
    }

    // Find or create admin user
    let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    
    if (!adminUser) {
      // Create admin user if doesn't exist
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      adminUser = await prisma.user.create({
        data: {
          name: "Admin",
          email: adminEmail,
          phone: "0000000000",
          password: hashedPassword,
          isAdmin: true,
        },
      });
    } else if (!adminUser.isAdmin) {
      // Update existing user to admin
      adminUser = await prisma.user.update({
        where: { id: adminUser.id },
        data: { isAdmin: true },
      });
    }

    const token = generateToken(adminUser.id, true);

    return res.json({
      token,
      admin: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        isAdmin: true,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// Get all users with pagination
router.get("/users", authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = req.query.search as string || "";
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
          _count: {
            select: {
              tests: true,
              feedbacks: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// Get user details with all tests and feedback
router.get("/users/:id", authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        tests: {
          orderBy: { createdAt: "desc" },
          include: {
            feedbacks: true,
          },
        },
        feedbacks: {
          orderBy: { createdAt: "desc" },
          include: {
            testResponse: {
              select: {
                id: true,
                type: true,
                createdAt: true,
              },
            },
          },
        },
        _count: {
          select: {
            tests: true,
            feedbacks: true,
          },
        },
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

// Impersonate user (get token for user)
router.post("/impersonate/:id", authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
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

    const token = generateToken(user.id, user.isAdmin || false);

    return res.json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// Get dashboard statistics
router.get("/stats", authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const [totalUsers, totalTests, totalFeedback, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.testResponse.count(),
      prisma.feedback.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    return res.json({
      totalUsers,
      totalTests,
      totalFeedback,
      recentUsers,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// Get all feedback with pagination
router.get("/feedback", authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          testResponse: {
            select: {
              id: true,
              type: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.feedback.count(),
    ]);

    return res.json({
      feedback,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

export default router;

