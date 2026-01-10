import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db";

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
  isAdmin?: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export function generateToken(userId: string, isAdmin: boolean = false): string {
  return jwt.sign({ userId, isAdmin }, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): { userId: string; isAdmin: boolean } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; isAdmin: boolean };
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
      res.status(401).json({ error: "User not found" });
      return;
    }

    req.userId = user.id;
    req.user = user;
    req.isAdmin = user.isAdmin || false;
    console.log(`authenticateUser - userId: ${user.id}, isAdmin from DB: ${user.isAdmin}, req.isAdmin: ${req.isAdmin}`);
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
}

export async function authenticateAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !decoded.isAdmin) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });

    if (!user || !user.isAdmin) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    req.userId = user.id;
    req.user = user;
    req.isAdmin = true;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
}

export async function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (decoded) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
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

      if (user) {
        req.userId = user.id;
        req.user = user;
        req.isAdmin = user.isAdmin || false;
      }
    }

    next();
  } catch (error) {
    // Continue without auth if there's an error
    next();
  }
}

