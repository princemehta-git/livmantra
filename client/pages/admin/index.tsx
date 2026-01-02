import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Rating,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import { Search, Visibility, Login as LoginIcon } from "@mui/icons-material";
import AdminRoute from "../../components/AdminRoute";
import { useAuth } from "../../contexts/AuthContext";
import { getAdminUsers, getAdminStats, impersonateUser, getAdminFeedback } from "../../lib/api";

export default function AdminPanelPage() {
  const router = useRouter();
  const { admin, adminLogin, impersonateUser: handleImpersonate } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    if (admin) {
      loadStats();
    }
  }, [admin]);

  useEffect(() => {
    if (admin && tabValue === 0) {
      loadData();
    }
  }, [admin, page, search, tabValue]);

  useEffect(() => {
    if (admin && tabValue === 1) {
      loadFeedback();
    }
  }, [admin, tabValue, feedbackPage]);

  const loadStats = async () => {
    try {
      const statsRes = await getAdminStats();
      setStats(statsRes.data);
    } catch (error: any) {
      console.error("Error loading stats:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const usersRes = await getAdminUsers({ page, limit: 50, search });
      setUsers(usersRes.data.users || []);
    } catch (error: any) {
      console.error("Error loading data:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFeedback = async () => {
    setFeedbackLoading(true);
    try {
      const feedbackRes = await getAdminFeedback({ page: feedbackPage, limit: 50 });
      setFeedback(feedbackRes.data.feedback || []);
    } catch (error: any) {
      console.error("Error loading feedback:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      }
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminLogin(email, password);
    } catch (err: any) {
      setError(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleLoginAsUser = async (userId: string) => {
    try {
      await handleImpersonate(userId);
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Failed to login as user");
    }
  };

  if (!admin) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#0a0e27",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Card
            sx={{
              p: 4,
              background: "rgba(10, 14, 39, 0.8)",
              border: "2px solid rgba(0, 255, 255, 0.3)",
              borderRadius: 0,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "#00ffff",
                fontWeight: 800,
                mb: 3,
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              Admin Login
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  color: "#0a0e27",
                  fontWeight: 700,
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Card>
        </Container>
      </Box>
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
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: "#00ffff",
              fontWeight: 800,
              mb: 4,
              textTransform: "uppercase",
            }}
          >
            Admin Dashboard
          </Typography>

          {/* Stats Cards */}
          {stats && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    p: 3,
                    background: "rgba(10, 14, 39, 0.8)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    borderRadius: 0,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}>
                    Total Users
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#00ffff", fontWeight: 800 }}>
                    {stats.totalUsers}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    p: 3,
                    background: "rgba(10, 14, 39, 0.8)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    borderRadius: 0,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}>
                    Total Tests
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#8a2be2", fontWeight: 800 }}>
                    {stats.totalTests}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    p: 3,
                    background: "rgba(10, 14, 39, 0.8)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    borderRadius: 0,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}>
                    Total Feedback
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#ff6b6b", fontWeight: 800 }}>
                    {stats.totalFeedback}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    p: 3,
                    background: "rgba(10, 14, 39, 0.8)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    borderRadius: 0,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}>
                    Recent Users (7d)
                  </Typography>
                  <Typography variant="h4" sx={{ color: "#00ffff", fontWeight: 800 }}>
                    {stats.recentUsers}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Tabs */}
          <Box sx={{ mb: 3, borderBottom: 1, borderColor: "rgba(0, 255, 255, 0.3)" }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => {
                setTabValue(newValue);
                if (newValue === 1) {
                  loadFeedback();
                }
              }}
              sx={{
                "& .MuiTab-root": {
                  color: "rgba(255, 255, 255, 0.6)",
                  "&.Mui-selected": {
                    color: "#00ffff",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#00ffff",
                },
              }}
            >
              <Tab label="Users" />
              <Tab label="Feedback" />
            </Tabs>
          </Box>

          {/* Users Tab */}
          {tabValue === 0 && (
            <>
              {/* Search */}
              <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search users by name, email, or phone..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  InputProps={{
                    startAdornment: <Search sx={{ color: "rgba(255, 255, 255, 0.5)", mr: 1 }} />,
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

              {/* Users Table */}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress sx={{ color: "#00ffff" }} />
                </Box>
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{
                    background: "rgba(10, 14, 39, 0.8)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    borderRadius: 0,
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Name</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Email</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Phone</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Tests</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell sx={{ color: "#fff" }}>{user.name}</TableCell>
                          <TableCell sx={{ color: "#fff" }}>{user.email}</TableCell>
                          <TableCell sx={{ color: "#fff" }}>{user.phone}</TableCell>
                          <TableCell sx={{ color: "#fff" }}>
                            <Chip
                              label={user._count?.tests || 0}
                              size="small"
                              sx={{
                                background: "rgba(0, 255, 255, 0.2)",
                                color: "#00ffff",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleViewUser(user.id)}
                                sx={{ color: "#00ffff" }}
                              >
                                <Visibility />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleLoginAsUser(user.id)}
                                sx={{ color: "#8a2be2" }}
                              >
                                <LoginIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}

          {/* Feedback Tab */}
          {tabValue === 1 && (
            <>
              {feedbackLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress sx={{ color: "#00ffff" }} />
                </Box>
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{
                    background: "rgba(10, 14, 39, 0.8)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    borderRadius: 0,
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>User</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Email</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Rating</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Comment</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Test Type</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {feedback.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} sx={{ color: "#fff", textAlign: "center", py: 4 }}>
                            No feedback available
                          </TableCell>
                        </TableRow>
                      ) : (
                        feedback.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell sx={{ color: "#fff" }}>{item.user?.name || "N/A"}</TableCell>
                            <TableCell sx={{ color: "#fff" }}>{item.user?.email || "N/A"}</TableCell>
                            <TableCell>
                              <Rating
                                value={item.rating}
                                readOnly
                                size="small"
                                sx={{
                                  "& .MuiRating-iconFilled": {
                                    color: "#00ffff",
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "#fff",
                                maxWidth: 300,
                              }}
                            >
                              <Tooltip
                                title={item.comment || "No comment"}
                                arrow
                                placement="top"
                                sx={{
                                  "& .MuiTooltip-tooltip": {
                                    maxWidth: 400,
                                    whiteSpace: "pre-wrap",
                                  },
                                }}
                              >
                                <Typography
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    cursor: item.comment ? "help" : "default",
                                  }}
                                >
                                  {item.comment || "No comment"}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell sx={{ color: "#fff" }}>
                              {item.testResponse?.type || "N/A"}
                            </TableCell>
                            <TableCell sx={{ color: "#fff" }}>
                              {new Date(item.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </Container>
      </Box>
    </AdminRoute>
  );
}

