import { Server, Socket } from "socket.io";
import { verifyToken } from "../middleware/auth";
import { prisma } from "../db";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  isAdmin?: boolean;
  user?: any;
}

export function initializeSocketIO(io: Server) {
  // Authentication middleware for Socket.io
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return next(new Error("Authentication error: Invalid token"));
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

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.userId = user.id;
      socket.isAdmin = user.isAdmin || false;
      socket.user = user;

      next();
    } catch (error) {
      console.error("Socket auth error:", error);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId} (Admin: ${socket.isAdmin})`);

    // Join user-specific room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Join admin room if admin
    if (socket.isAdmin) {
      socket.join("admin");
      console.log(`Admin ${socket.userId} joined admin room`);
    }

    // Handle joining conversation
    socket.on("join-conversation", async (conversationId: string) => {
      try {
        // Verify user has access to this conversation
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
        });

        if (!conversation) {
          socket.emit("error", { message: "Conversation not found" });
          return;
        }

        // Check if user is admin or owns the conversation
        if (socket.isAdmin || conversation.userId === socket.userId) {
          socket.join(`conversation:${conversationId}`);
          console.log(`User ${socket.userId} joined conversation ${conversationId}`);
        } else {
          socket.emit("error", { message: "Unauthorized" });
        }
      } catch (error) {
        console.error("Error joining conversation:", error);
        socket.emit("error", { message: "Error joining conversation" });
      }
    });

    // Handle sending message (message already created via API, just broadcast it)
    socket.on("send-message", async (data: { conversationId: string; messageId?: string; content?: string; attachmentUrl?: string; attachmentType?: string }) => {
      try {
        const { conversationId, messageId } = data;

        // Verify conversation exists and user has access
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
        });

        if (!conversation) {
          socket.emit("error", { message: "Conversation not found" });
          return;
        }

        // Check authorization
        if (!socket.isAdmin && conversation.userId !== socket.userId) {
          socket.emit("error", { message: "Unauthorized" });
          return;
        }

        // If messageId provided, fetch the message from database
        let message = null;
        if (messageId) {
          const dbMessage = await prisma.message.findUnique({
            where: { id: messageId },
            include: {
              conversation: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      profileImage: true,
                    },
                  },
                },
              },
            },
          });
          if (dbMessage) {
            // Ensure conversationId is included in the message object
            message = {
              ...dbMessage,
              conversationId: dbMessage.conversationId,
            };
          }
        }

        // If no message found, create a basic message object from data
        if (!message) {
          message = {
            id: messageId || "temp",
            conversationId,
            senderId: socket.userId!,
            senderType: socket.isAdmin ? "admin" : "user",
            content: data.content || null,
            attachmentUrl: data.attachmentUrl || null,
            attachmentType: data.attachmentType || null,
            isRead: false,
            createdAt: new Date(),
            conversation: {
              userId: conversation.userId,
              user: await prisma.user.findUnique({
                where: { id: conversation.userId },
                select: {
                  id: true,
                  name: true,
                  email: true,
                  profileImage: true,
                },
              }),
            },
          } as any;
        }

        // Emit to conversation room
        io.to(`conversation:${conversationId}`).emit("new-message", message);

        // Notify recipient
        if (socket.isAdmin) {
          // Admin sent message, notify user
          io.to(`user:${conversation.userId}`).emit("message-notification", {
            conversationId,
            message,
          });
        } else {
          // User sent message, notify admins
          io.to("admin").emit("message-notification", {
            conversationId,
            message,
          });
        }

        console.log(`Message broadcasted in conversation ${conversationId} by ${socket.userId}`);
      } catch (error) {
        console.error("Error broadcasting message:", error);
        socket.emit("error", { message: "Error broadcasting message" });
      }
    });

    // Handle typing indicator
    socket.on("typing", (data: { conversationId: string; isTyping: boolean }) => {
      socket.to(`conversation:${data.conversationId}`).emit("typing", {
        userId: socket.userId,
        isTyping: data.isTyping,
      });
    });

    // Handle marking messages as read
    socket.on("mark-read", async (data: { conversationId: string }) => {
      try {
        const { conversationId } = data;

        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
        });

        if (!conversation) {
          return;
        }

        // Check authorization
        if (!socket.isAdmin && conversation.userId !== socket.userId) {
          return;
        }

        // Mark all unread messages as read
        await prisma.message.updateMany({
          where: {
            conversationId,
            isRead: false,
            senderType: socket.isAdmin ? "user" : "admin", // Mark messages from the other party
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

        // Notify other party
        socket.to(`conversation:${conversationId}`).emit("messages-read", { conversationId });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
}

