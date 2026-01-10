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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Divider,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Send,
  AttachFile,
  InsertDriveFile,
  Close,
  Search,
  Message as MessageIcon,
} from "@mui/icons-material";
import AdminRoute from "../../components/AdminRoute";
import AdminHeader from "../../components/AdminHeader";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../lib/socket";
import { useNotifications } from "../../hooks/useNotifications";
import UserDetailsDialog from "../../components/UserDetailsDialog";
import {
  getAdminConversations,
  getMessages,
  sendMessage,
  markConversationAsRead,
  getAdminUnreadCount,
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
  lastMessageAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  };
  messages?: Message[];
}

export default function AdminMessagesPage() {
  const { admin } = useAuth();
  const socket = useSocket();
  const { showNotification, requestPermission } = useNotifications();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConversations();
    loadUnreadCount();
    requestPermission();
  }, []);

  useEffect(() => {
    if (socket) {
      // Join admin room
      socket.emit("join-conversation", "admin");

      // Listen for new messages
      socket.on("new-message", (message: Message) => {
        if (selectedConversation && (message.conversationId === selectedConversation.id || !message.conversationId)) {
          // Check if message already exists to prevent duplicates
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === message.id);
            if (exists) return prev;
            return [...prev, message];
          });
          scrollToBottom();
        }
        // Reload conversations to update last message
        loadConversations();
        loadUnreadCount();
      });

      // Listen for message notifications
      socket.on("message-notification", (data: { conversationId: string; message: Message }) => {
        loadConversations();
        loadUnreadCount();

        // Show notification
        showNotification({
          title: "New Message",
          body: `New message from user`,
          onClick: () => {
            window.focus();
            if (data.conversationId !== selectedConversation?.id) {
              // Find and select the conversation
              const conv = conversations.find((c) => c.id === data.conversationId);
              if (conv) {
                handleSelectConversation(conv);
              }
            }
          },
        });
      });

      return () => {
        socket.off("new-message");
        socket.off("message-notification");
      };
    }
  }, [socket, selectedConversation, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      const response = await getAdminConversations({ search, limit: 50 });
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await getAdminUnreadCount();
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages([]);

    try {
      const response = await getMessages(conversation.id);
      console.log("Loaded messages for conversation:", conversation.id, "Count:", response.data.messages?.length || 0);
      setMessages(response.data.messages || []);

      // Mark as read
      if (conversation.unreadCount > 0) {
        await markConversationAsRead(conversation.id);
        if (socket) {
          socket.emit("mark-read", { conversationId: conversation.id });
        }
        loadConversations();
        loadUnreadCount();
      }

      // Join conversation room
      if (socket) {
        socket.emit("join-conversation", conversation.id);
      }

      scrollToBottom();
    } catch (error: any) {
      console.error("Error loading messages:", error);
      console.error("Error response:", error.response?.data);
      alert(error.response?.data?.error || "Failed to load messages");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);

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
    if ((!messageText.trim() && !selectedFile) || !selectedConversation) return;

    setSending(true);
    try {
      const response = await sendMessage(
        {
          conversationId: selectedConversation.id,
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

      if (socket) {
        socket.emit("send-message", {
          conversationId: selectedConversation.id,
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

      loadConversations();
    } catch (error: any) {
      console.error("Error sending message:", error);
      alert(error.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";
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

  const filteredConversations = conversations.filter((conv) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      conv.user.name.toLowerCase().includes(searchLower) ||
      conv.user.email.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <AdminRoute>
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
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <Box
        sx={{
          minHeight: "100vh",
          background: "#0a0e27",
          position: "relative",
        }}
      >
        <AdminHeader />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: "#00ffff",
              fontWeight: 800,
              mb: 3,
              textTransform: "uppercase",
            }}
          >
            Messages {unreadCount > 0 && `(${unreadCount} unread)`}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, height: "75vh" }}>
            {/* Conversations List */}
            <Card
              sx={{
                width: "350px",
                background: "rgba(10, 14, 39, 0.9)",
                border: "1px solid rgba(0, 255, 255, 0.3)",
                borderRadius: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 255, 255, 0.3)" }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "#00ffff" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(0, 255, 255, 0.3)",
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, overflowY: "auto" }}>
                {filteredConversations.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      No conversations found
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {filteredConversations.map((conv, index) => (
                      <React.Fragment key={conv.id}>
                        <ListItem
                          button
                          onClick={() => handleSelectConversation(conv)}
                          selected={selectedConversation?.id === conv.id}
                          sx={{
                            bgcolor:
                              selectedConversation?.id === conv.id
                                ? "rgba(0, 255, 255, 0.1)"
                                : "transparent",
                            "&:hover": {
                              bgcolor: "rgba(0, 255, 255, 0.05)",
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Badge
                              badgeContent={conv.unreadCount}
                              color="error"
                              invisible={conv.unreadCount === 0}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: "#00ffff",
                                  color: "#0a0e27",
                                }}
                                src={conv.user.profileImage ? `${API_BASE.replace("/api", "")}${conv.user.profileImage}` : undefined}
                              >
                                {conv.user.name[0].toUpperCase()}
                              </Avatar>
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography sx={{ color: "#fff", fontWeight: conv.unreadCount > 0 ? 700 : 400 }}>
                                  {conv.user.name}
                                </Typography>
                                {conv.lastMessageAt && (
                                  <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                                    {formatTime(conv.lastMessageAt)}
                                  </Typography>
                                )}
                              </Box>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "rgba(255, 255, 255, 0.6)",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {conv.user.email}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < filteredConversations.length - 1 && <Divider sx={{ bgcolor: "rgba(0, 255, 255, 0.1)" }} />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Box>
            </Card>

            {/* Chat Area */}
            <Card
              sx={{
                flex: 1,
                background: "rgba(10, 14, 39, 0.9)",
                border: "1px solid rgba(0, 255, 255, 0.3)",
                borderRadius: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {selectedConversation ? (
                <>
                  {/* Header */}
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: "1px solid rgba(0, 255, 255, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <IconButton
                      onClick={() => setUserDetailsOpen(true)}
                      sx={{
                        p: 0,
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                        transition: "transform 0.2s",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "#00ffff",
                          color: "#0a0e27",
                          cursor: "pointer",
                          width: 56,
                          height: 56,
                        }}
                        src={
                          selectedConversation.user.profileImage
                            ? `${API_BASE.replace("/api", "")}${selectedConversation.user.profileImage}`
                            : undefined
                        }
                      >
                        {selectedConversation.user.name[0].toUpperCase()}
                      </Avatar>
                    </IconButton>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                        {selectedConversation.user.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        {selectedConversation.user.email}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Messages */}
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
                          No messages yet. Start the conversation!
                        </Typography>
                      </Box>
                    ) : (
                      messages.map((message) => {
                        const isAdmin = message.senderType === "admin";
                        return (
                          <Box
                            key={message.id}
                            sx={{
                              display: "flex",
                              justifyContent: isAdmin ? "flex-end" : "flex-start",
                              gap: 1,
                            }}
                          >
                            {!isAdmin && (
                              <Avatar
                                sx={{
                                  bgcolor: "#00ffff",
                                  color: "#0a0e27",
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                {selectedConversation.user.name[0].toUpperCase()}
                              </Avatar>
                            )}
                            <Box sx={{ maxWidth: "70%", display: "flex", flexDirection: "column", gap: 0.5 }}>
                              <Paper
                                sx={{
                                  p: 1.5,
                                  bgcolor: isAdmin ? "#00ffff" : "rgba(0, 255, 255, 0.2)",
                                  color: isAdmin ? "#0a0e27" : "#fff",
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
                            {isAdmin && (
                              <Avatar
                                sx={{
                                  bgcolor: "#8a2be2",
                                  color: "#fff",
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                A
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

                  {/* Input */}
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
                    <IconButton onClick={() => fileInputRef.current?.click()} sx={{ color: "#00ffff" }}>
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
                      }}
                    >
                      {sending ? <CircularProgress size={20} /> : <Send />}
                    </Button>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <MessageIcon sx={{ fontSize: 64, color: "rgba(0, 255, 255, 0.3)", mb: 2 }} />
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Select a conversation to start chatting
                    </Typography>
                  </Box>
                </Box>
              )}
            </Card>
          </Box>
        </Container>

        {/* User Details Dialog */}
        {selectedConversation && (
          <UserDetailsDialog
            open={userDetailsOpen}
            onClose={() => setUserDetailsOpen(false)}
            userId={selectedConversation.user.id}
            userName={selectedConversation.user.name}
            userEmail={selectedConversation.user.email}
            userProfileImage={selectedConversation.user.profileImage}
          />
        )}
      </Box>
    </AdminRoute>
  );
}

