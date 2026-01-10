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
import { Search, Visibility, Login as LoginIcon, Message, TrendingUp, Star, Assessment, People } from "@mui/icons-material";
import AdminRoute from "../../components/AdminRoute";
import AdminHeader from "../../components/AdminHeader";
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
        <AdminHeader />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#00ffff",
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              Admin Dashboard
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Message />}
                onClick={() => router.push("/admin/messages")}
                sx={{
                  bgcolor: "#00ffff",
                  color: "#0a0e27",
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  textTransform: "uppercase",
                  "&:hover": {
                    bgcolor: "#00cccc",
                  },
                }}
              >
                Messages
              </Button>
            </Box>
          </Box>

          {/* Stats Cards */}
          {stats && (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      p: 3,
                      background: "rgba(10, 14, 39, 0.8)",
                      border: "1px solid rgba(0, 255, 255, 0.3)",
                      borderRadius: 0,
                      "&:hover": {
                        borderColor: "rgba(0, 255, 255, 0.6)",
                        boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Total Users
                      </Typography>
                      <People sx={{ color: "#00ffff", fontSize: 20 }} />
                    </Box>
                    <Typography variant="h4" sx={{ color: "#00ffff", fontWeight: 800, mb: 0.5 }}>
                      {stats.totalUsers}
                    </Typography>
                    {stats.usersLast7Days > 0 && (
                      <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        +{stats.usersLast7Days} in last 7 days
                      </Typography>
                    )}
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      p: 3,
                      background: "rgba(10, 14, 39, 0.8)",
                      border: "1px solid rgba(138, 43, 226, 0.3)",
                      borderRadius: 0,
                      "&:hover": {
                        borderColor: "rgba(138, 43, 226, 0.6)",
                        boxShadow: "0 0 20px rgba(138, 43, 226, 0.2)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Total Tests
                      </Typography>
                      <Assessment sx={{ color: "#8a2be2", fontSize: 20 }} />
                    </Box>
                    <Typography variant="h4" sx={{ color: "#8a2be2", fontWeight: 800, mb: 0.5 }}>
                      {stats.totalTests}
                    </Typography>
                    {stats.testsLast7Days > 0 && (
                      <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        +{stats.testsLast7Days} in last 7 days
                      </Typography>
                    )}
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      p: 3,
                      background: "rgba(10, 14, 39, 0.8)",
                      border: "1px solid rgba(255, 107, 107, 0.3)",
                      borderRadius: 0,
                      "&:hover": {
                        borderColor: "rgba(255, 107, 107, 0.6)",
                        boxShadow: "0 0 20px rgba(255, 107, 107, 0.2)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Total Feedback
                      </Typography>
                      <Star sx={{ color: "#ff6b6b", fontSize: 20 }} />
                    </Box>
                    <Typography variant="h4" sx={{ color: "#ff6b6b", fontWeight: 800, mb: 0.5 }}>
                      {stats.totalFeedback}
                    </Typography>
                    {stats.averageRating > 0 && (
                      <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        Avg Rating: {stats.averageRating.toFixed(1)}/5
                      </Typography>
                    )}
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      p: 3,
                      background: "rgba(10, 14, 39, 0.8)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      borderRadius: 0,
                      "&:hover": {
                        borderColor: "rgba(16, 185, 129, 0.6)",
                        boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Today's Activity
                      </Typography>
                      <TrendingUp sx={{ color: "#10b981", fontSize: 20 }} />
                    </Box>
                    <Typography variant="h4" sx={{ color: "#10b981", fontWeight: 800, mb: 0.5 }}>
                      {stats.testsToday || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      {stats.usersToday || 0} new users today
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              {/* Additional Analytics Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      p: 3,
                      background: "rgba(10, 14, 39, 0.8)",
                      border: "1px solid rgba(0, 255, 255, 0.3)",
                      borderRadius: 0,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#00ffff", fontWeight: 700, mb: 2 }}>
                      Test Types Breakdown
                    </Typography>
                    {stats.testTypesBreakdown && stats.testTypesBreakdown.length > 0 ? (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {stats.testTypesBreakdown.map((item: any, index: number) => {
                          const percentage = stats.totalTests > 0 
                            ? ((item.count / stats.totalTests) * 100).toFixed(1)
                            : 0;
                          return (
                            <Box key={index}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>
                                  {item.type || "Unknown"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                                  {item.count} ({percentage}%)
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  height: 8,
                                  background: "rgba(0, 255, 255, 0.2)",
                                  borderRadius: 1,
                                  overflow: "hidden",
                                }}
                              >
                                <Box
                                  sx={{
                                    height: "100%",
                                    width: `${percentage}%`,
                                    background: "linear-gradient(90deg, #00ffff, #8a2be2)",
                                    transition: "width 0.5s ease",
                                  }}
                                />
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        No test data available
                      </Typography>
                    )}
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      p: 3,
                      background: "rgba(10, 14, 39, 0.8)",
                      border: "1px solid rgba(138, 43, 226, 0.3)",
                      borderRadius: 0,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#8a2be2", fontWeight: 700, mb: 2 }}>
                      Growth Metrics
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                            User Growth Rate (7d/30d)
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#00ffff", fontWeight: 600 }}>
                            {stats.userGrowthRate || 0}%
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            background: "rgba(0, 255, 255, 0.2)",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              height: "100%",
                              width: `${Math.min(stats.userGrowthRate || 0, 100)}%`,
                              background: "linear-gradient(90deg, #00ffff, #10b981)",
                              transition: "width 0.5s ease",
                            }}
                          />
                        </Box>
                      </Box>
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                            Test Growth Rate (7d/30d)
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#8a2be2", fontWeight: 600 }}>
                            {stats.testGrowthRate || 0}%
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            background: "rgba(138, 43, 226, 0.2)",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              height: "100%",
                              width: `${Math.min(stats.testGrowthRate || 0, 100)}%`,
                              background: "linear-gradient(90deg, #8a2be2, #00ffff)",
                              transition: "width 0.5s ease",
                            }}
                          />
                        </Box>
                      </Box>
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                            Average Rating
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Star sx={{ color: "#ffd700", fontSize: 16 }} />
                            <Typography variant="body2" sx={{ color: "#ffd700", fontWeight: 600 }}>
                              {stats.averageRating ? stats.averageRating.toFixed(2) : "0.00"}/5
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            background: "rgba(255, 215, 0, 0.2)",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              height: "100%",
                              width: `${stats.averageRating ? (stats.averageRating / 5) * 100 : 0}%`,
                              background: "linear-gradient(90deg, #ffd700, #ff6b6b)",
                              transition: "width 0.5s ease",
                            }}
                          />
                        </Box>
                      </Box>
                      {stats.feedbackWithComments > 0 && (
                        <Box>
                          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 0.5 }}>
                            Feedback with Comments
                          </Typography>
                          <Typography variant="h6" sx={{ color: "#00ffff", fontWeight: 700 }}>
                            {stats.feedbackWithComments} / {stats.totalFeedback}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </>
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
              <Tab label="Analytics" />
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

          {/* Analytics Tab */}
          {tabValue === 2 && stats && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card
                  sx={{
                    p: 3,
                    background: "rgba(10, 14, 39, 0.8)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    borderRadius: 0,
                  }}
                >
                  <Typography variant="h5" sx={{ color: "#00ffff", fontWeight: 700, mb: 3 }}>
                    Detailed Analytics
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ color: "#00ffff", fontWeight: 600, mb: 2 }}>
                          Activity Summary
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                              Tests Today
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#00ffff", fontWeight: 700 }}>
                              {stats.testsToday || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                              Users Today
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#10b981", fontWeight: 700 }}>
                              {stats.usersToday || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                              Tests (Last 7 Days)
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#8a2be2", fontWeight: 700 }}>
                              {stats.testsLast7Days || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                              Tests (Last 30 Days)
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#8a2be2", fontWeight: 700 }}>
                              {stats.testsLast30Days || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                              Users (Last 7 Days)
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#00ffff", fontWeight: 700 }}>
                              {stats.usersLast7Days || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                              Users (Last 30 Days)
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#00ffff", fontWeight: 700 }}>
                              {stats.usersLast30Days || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                              Recent Tests (7d)
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#8a2be2", fontWeight: 700 }}>
                              {stats.recentTests || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                              Recent Feedback (7d)
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#ff6b6b", fontWeight: 700 }}>
                              {stats.recentFeedback || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ color: "#8a2be2", fontWeight: 600, mb: 2 }}>
                          Engagement Metrics
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {stats.totalTests > 0 && stats.totalUsers > 0 && (
                            <Box>
                              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 0.5 }}>
                                Tests per User
                              </Typography>
                              <Typography variant="h6" sx={{ color: "#00ffff", fontWeight: 700 }}>
                                {(stats.totalTests / stats.totalUsers).toFixed(2)}
                              </Typography>
                            </Box>
                          )}
                          {stats.totalFeedback > 0 && stats.totalTests > 0 && (
                            <Box>
                              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 0.5 }}>
                                Feedback Rate
                              </Typography>
                              <Typography variant="h6" sx={{ color: "#ff6b6b", fontWeight: 700 }}>
                                {((stats.totalFeedback / stats.totalTests) * 100).toFixed(1)}%
                              </Typography>
                            </Box>
                          )}
                          {stats.feedbackWithComments > 0 && stats.totalFeedback > 0 && (
                            <Box>
                              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 0.5 }}>
                                Comment Rate
                              </Typography>
                              <Typography variant="h6" sx={{ color: "#ffd700", fontWeight: 700 }}>
                                {((stats.feedbackWithComments / stats.totalFeedback) * 100).toFixed(1)}%
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </AdminRoute>
  );
}

