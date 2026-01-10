import express from "express";
import { prisma } from "../db";
import { authenticateUser, authenticateAdmin, AuthRequest } from "../middleware/auth";
import { uploadMessageAttachment } from "../middleware/upload";
import path from "path";

const router = express.Router();

// Get or create user's conversation
router.get("/conversation", authenticateUser, async (req: AuthRequest, res) => {
  try {
    let conversation = await prisma.conversation.findUnique({
      where: { userId: req.userId! },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Create conversation if it doesn't exist
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: req.userId!,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    // Reverse messages to show oldest first
    if (conversation && conversation.messages) {
      conversation.messages.reverse();
    }

    console.log(`User ${req.userId} - Conversation ${conversation.id} has ${conversation.messages?.length || 0} messages`);
    return res.json({ conversation });
  } catch (error) {
    console.error("Error getting conversation:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Get messages for a conversation
router.get("/:conversationId", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Check authorization
    if (!req.isAdmin && conversation.userId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    console.log(`Fetched ${messages.length} messages for conversation ${conversationId}`);
    return res.json({ messages });
  } catch (error) {
    console.error("Error getting messages:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Send message (with optional file upload)
router.post("/", authenticateUser, (req: AuthRequest, res) => {
  uploadMessageAttachment(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { conversationId, content } = req.body;

      if (!conversationId) {
        return res.status(400).json({ error: "Conversation ID is required" });
      }

      // Verify conversation exists and user has access
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Check authorization
      if (!req.isAdmin && conversation.userId !== req.userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      let attachmentUrl: string | null = null;
      let attachmentType: string | null = null;

      if (req.file) {
        attachmentUrl = `/uploads/messages/${req.file.filename}`;
        const ext = path.extname(req.file.filename).toLowerCase();
        if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
          attachmentType = "image";
        } else {
          attachmentType = "document";
        }
      }

      const senderType = req.isAdmin ? "admin" : "user";
      console.log(`Creating message - userId: ${req.userId}, isAdmin: ${req.isAdmin}, senderType: ${senderType}`);
      
      const message = await prisma.message.create({
        data: {
          conversationId,
          senderId: req.userId!,
          senderType,
          content: content || null,
          attachmentUrl,
          attachmentType,
          isRead: false,
        },
      });
      
      console.log(`Message created - ID: ${message.id}, conversationId: ${message.conversationId}, senderType: ${message.senderType}, content: ${message.content?.substring(0, 50)}`);
      
      // Verify message was saved by fetching it back
      const verifyMessage = await prisma.message.findUnique({
        where: { id: message.id },
      });
      console.log(`Message verification - Found in DB: ${!!verifyMessage}`);

      // Update conversation
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageAt: new Date(),
          unreadCount: {
            increment: req.isAdmin ? 0 : 1,
          },
        },
      });

      return res.json({ message });
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ error: "Server error" });
    }
  });
});

// Mark message as read
router.put("/:messageId/read", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { messageId } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { conversation: true },
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check authorization
    if (!req.isAdmin && message.conversation.userId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Admin: Get all conversations
router.get("/admin/conversations", authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (search) {
      where.user = {
        OR: [
          { name: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
        ],
      };
    }

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { lastMessageAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.conversation.count({ where }),
    ]);

    return res.json({
      conversations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error getting admin conversations:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Admin: Get unread count
router.get("/admin/unread-count", authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const totalUnread = await prisma.conversation.aggregate({
      _sum: {
        unreadCount: true,
      },
    });

    return res.json({ unreadCount: totalUnread._sum.unreadCount || 0 });
  } catch (error) {
    console.error("Error getting unread count:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Mark all messages in conversation as read
router.put("/conversation/:conversationId/read", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Check authorization
    if (!req.isAdmin && conversation.userId !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Mark all unread messages from the other party as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        isRead: false,
        senderType: req.isAdmin ? "user" : "admin",
      },
      data: {
        isRead: true,
      },
    });

    // Reset unread count
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        unreadCount: 0,
      },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

