import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CircularProgress,
  Avatar,
  IconButton,
  Paper,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { Send, AttachFile, Image as ImageIcon, InsertDriveFile, Close } from "@mui/icons-material";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardVideoBackground from "../../components/DashboardVideoBackground";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../lib/socket";
import { useNotifications } from "../../hooks/useNotifications";
import {
  getUserConversation,
  sendMessage,
  markConversationAsRead,
} from "../../lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface Message {
  id: string;
  conversationId?: string;
  senderId: string;
  senderType: string;
  content: string | null;
  attachmentUrl: string | null;
  attachmentType: string | null;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  userId: string;
  unreadCount: number;
  messages: Message[];
}

export default function ContactPage() {
  const { user } = useAuth();
  const socket = useSocket();
  const { showNotification, requestPermission } = useNotifications();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConversation();
    requestPermission();
  }, []);

  useEffect(() => {
    if (socket && conversation) {
      // Join conversation room
      socket.emit("join-conversation", conversation.id);

      // Listen for new messages
      socket.on("new-message", (message: Message) => {
        // Check if message already exists to prevent duplicates
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });
        scrollToBottom();

        // Show notification if message is from admin
        if (message.senderType === "admin") {
          showNotification({
            title: "New Message from Admin",
            body: message.content || "You received a new message",
            onClick: () => {
              window.focus();
            },
          });
        }
      });

      // Listen for typing indicators
      socket.on("typing", (data: { userId: string; isTyping: boolean }) => {
        // Handle typing indicator if needed
      });

      // Listen for messages read
      socket.on("messages-read", () => {
        // Update read status if needed
      });

      return () => {
        socket.off("new-message");
        socket.off("typing");
        socket.off("messages-read");
      };
    }
  }, [socket, conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversation = async () => {
    try {
      const response = await getUserConversation();
      const conv = response.data.conversation;
      console.log("Loaded conversation:", conv);
      console.log("Messages count:", conv.messages?.length || 0);
      setConversation(conv);
      setMessages(conv.messages || []);
      
      // Mark conversation as read when loading
      if (conv.unreadCount > 0) {
        await markConversationAsRead(conv.id);
        if (socket) {
          socket.emit("mark-read", { conversationId: conv.id });
        }
      }
    } catch (error: any) {
      console.error("Error loading conversation:", error);
      console.error("Error response:", error.response?.data);
      alert(error.response?.data?.error || "Failed to load conversation");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      const validDocTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const validTypes = [...validImageTypes, ...validDocTypes];

      if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx)$/i)) {
        alert("Please select an image (jpg, png, gif) or document (pdf, doc, docx)");
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !selectedFile) || !conversation) return;

    setSending(true);
    try {
      const response = await sendMessage(
        {
          conversationId: conversation.id,
          content: messageText.trim() || undefined,
        },
        selectedFile || undefined
      );

      const newMessage = response.data.message;
      // Don't add to state here - let socket handle it to avoid duplicates
      setMessageText("");
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Emit via socket to broadcast (message already created via API)
      if (socket) {
        socket.emit("send-message", {
          conversationId: conversation.id,
          messageId: newMessage.id,
          content: newMessage.content,
          attachmentUrl: newMessage.attachmentUrl,
          attachmentType: newMessage.attachmentType,
        });
      } else {
        // If socket not available, add directly
        setMessages((prev) => [...prev, newMessage]);
        scrollToBottom();
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      alert(error.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getAttachmentUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${API_BASE.replace("/api", "")}${url}`;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Box
          sx={{
            minHeight: "100vh",
            background: "#0a0e27",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "#00ffff" }} />
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Box
        sx={{
          minHeight: "100vh",
          background: "#0a0e27",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <DashboardVideoBackground />
        <Header />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, py: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "#00ffff",
                fontWeight: 800,
                mb: 3,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Contact Admin
            </Typography>

            <Card
              sx={{
                background: "rgba(10, 14, 39, 0.9)",
                border: "1px solid rgba(0, 255, 255, 0.3)",
                borderRadius: 0,
                height: "70vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Messages Area */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {messages.length === 0 ? (
                  <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      No messages yet. Start a conversation!
                    </Typography>
                  </Box>
                ) : (
                  messages.map((message) => {
                    const isUser = message.senderType === "user";
                    return (
                      <Box
                        key={message.id}
                        sx={{
                          display: "flex",
                          justifyContent: isUser ? "flex-end" : "flex-start",
                          gap: 1,
                        }}
                      >
                        {!isUser && (
                          <Avatar
                            sx={{
                              bgcolor: "#00ffff",
                              color: "#0a0e27",
                              width: 32,
                              height: 32,
                            }}
                          >
                            A
                          </Avatar>
                        )}
                        <Box
                          sx={{
                            maxWidth: "70%",
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          <Paper
                            sx={{
                              p: 1.5,
                              bgcolor: isUser ? "#00ffff" : "rgba(0, 255, 255, 0.2)",
                              color: isUser ? "#0a0e27" : "#fff",
                              borderRadius: 1,
                            }}
                          >
                            {message.content && (
                              <Typography variant="body2" sx={{ mb: message.attachmentUrl ? 1 : 0 }}>
                                {message.content}
                              </Typography>
                            )}
                            {message.attachmentUrl && (
                              <Box sx={{ mt: message.content ? 1 : 0 }}>
                                {message.attachmentType === "image" ? (
                                  <img
                                    src={getAttachmentUrl(message.attachmentUrl) || ""}
                                    alt="Attachment"
                                    style={{
                                      maxWidth: "100%",
                                      maxHeight: "200px",
                                      borderRadius: "4px",
                                    }}
                                  />
                                ) : (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      p: 1,
                                      bgcolor: "rgba(0, 0, 0, 0.2)",
                                      borderRadius: 1,
                                    }}
                                  >
                                    <InsertDriveFile />
                                    <a
                                      href={getAttachmentUrl(message.attachmentUrl) || ""}
                                      download
                                      style={{ color: "inherit", textDecoration: "none" }}
                                    >
                                      <Typography variant="body2">Download File</Typography>
                                    </a>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </Paper>
                          <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", px: 1 }}>
                            {formatTime(message.createdAt)}
                          </Typography>
                        </Box>
                        {isUser && (
                          <Avatar
                            sx={{
                              bgcolor: "#8a2be2",
                              color: "#fff",
                              width: 32,
                              height: 32,
                            }}
                          >
                            {user?.name?.[0]?.toUpperCase() || "U"}
                          </Avatar>
                        )}
                      </Box>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* File Preview */}
              {selectedFile && (
                <Box sx={{ p: 2, borderTop: "1px solid rgba(0, 255, 255, 0.2)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        style={{ maxHeight: "60px", borderRadius: "4px" }}
                      />
                    ) : (
                      <InsertDriveFile sx={{ color: "#00ffff" }} />
                    )}
                    <Typography variant="body2" sx={{ color: "#fff", flex: 1 }}>
                      {selectedFile.name}
                    </Typography>
                    <IconButton size="small" onClick={handleRemoveFile} sx={{ color: "#00ffff" }}>
                      <Close />
                    </IconButton>
                  </Box>
                </Box>
              )}

              {/* Input Area */}
              <Box
                sx={{
                  p: 2,
                  borderTop: "1px solid rgba(0, 255, 255, 0.2)",
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-end",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ color: "#00ffff" }}
                >
                  <AttachFile />
                </IconButton>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(0, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00ffff",
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={(!messageText.trim() && !selectedFile) || sending}
                  sx={{
                    bgcolor: "#00ffff",
                    color: "#0a0e27",
                    minWidth: "auto",
                    px: 2,
                    "&:hover": {
                      bgcolor: "#00cccc",
                    },
                    "&:disabled": {
                      bgcolor: "rgba(0, 255, 255, 0.3)",
                      color: "rgba(255, 255, 255, 0.5)",
                    },
                  }}
                >
                  {sending ? <CircularProgress size={20} /> : <Send />}
                </Button>
              </Box>
            </Card>
          </motion.div>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}

