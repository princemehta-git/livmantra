import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  Button,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ArrowBack, Login as LoginIcon } from "@mui/icons-material";
import AdminRoute from "../../../components/AdminRoute";
import { useAuth } from "../../../contexts/AuthContext";
import { getAdminUserDetails, impersonateUser } from "../../../lib/api";

export default function AdminUserDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { impersonateUser: handleImpersonate } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      const response = await getAdminUserDetails(id as string);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAsUser = async () => {
    try {
      await handleImpersonate(id as string);
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Failed to login as user");
    }
  };

  if (loading) {
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
        <CircularProgress sx={{ color: "#00ffff" }} />
      </Box>
    );
  }

  if (!user) {
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
        <Typography sx={{ color: "#fff" }}>User not found</Typography>
      </Box>
    );
  }

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const profileImageUrl = user.profileImage
    ? `${API_BASE}${user.profileImage}`
    : null;

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
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push("/admin")}
            sx={{
              color: "#00ffff",
              mb: 3,
            }}
          >
            Back to Admin Panel
          </Button>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                color: "#00ffff",
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              User Details
            </Typography>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={handleLoginAsUser}
              sx={{
                background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                color: "#0a0e27",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Login as User
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* User Info */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 3,
                  background: "rgba(10, 14, 39, 0.8)",
                  border: "1px solid rgba(0, 255, 255, 0.3)",
                  borderRadius: 0,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#00ffff",
                    fontWeight: 700,
                    mb: 3,
                    textTransform: "uppercase",
                  }}
                >
                  Profile Information
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Name
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#fff" }}>
                    {user.name}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#fff" }}>
                    {user.email}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Phone
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#fff" }}>
                    {user.phone}
                  </Typography>
                </Box>

                {user.dob && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Date of Birth
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#fff" }}>
                      {new Date(user.dob).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}

                {user.gender && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Gender
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#fff" }}>
                      {user.gender}
                    </Typography>
                  </Box>
                )}

                {user.state && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      State
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#fff" }}>
                      {user.state}
                    </Typography>
                  </Box>
                )}

                {user.nationality && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                      Nationality
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#fff" }}>
                      {user.nationality}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Created At
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#fff" }}>
                    {new Date(user.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Card>
            </Grid>

            {/* Stats */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 3,
                  background: "rgba(10, 14, 39, 0.8)",
                  border: "1px solid rgba(0, 255, 255, 0.3)",
                  borderRadius: 0,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#00ffff",
                    fontWeight: 700,
                    mb: 3,
                    textTransform: "uppercase",
                  }}
                >
                  Statistics
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Total Tests
                      </Typography>
                      <Typography variant="h4" sx={{ color: "#00ffff", fontWeight: 800 }}>
                        {user._count?.tests || 0}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Total Feedback
                      </Typography>
                      <Typography variant="h4" sx={{ color: "#8a2be2", fontWeight: 800 }}>
                        {user._count?.feedbacks || 0}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Tests */}
            <Grid item xs={12}>
              <Card
                sx={{
                  p: 3,
                  background: "rgba(10, 14, 39, 0.8)",
                  border: "1px solid rgba(0, 255, 255, 0.3)",
                  borderRadius: 0,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#00ffff",
                    fontWeight: 700,
                    mb: 3,
                    textTransform: "uppercase",
                  }}
                >
                  Test Results ({user.tests?.length || 0})
                </Typography>

                {user.tests && user.tests.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Date</TableCell>
                          <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Type</TableCell>
                          <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Score</TableCell>
                          <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Result Type</TableCell>
                          <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {user.tests.map((test: any) => (
                          <TableRow key={test.id}>
                            <TableCell sx={{ color: "#fff" }}>
                              {new Date(test.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell sx={{ color: "#fff" }}>{test.type}</TableCell>
                            <TableCell sx={{ color: "#fff" }}>
                              {test.score?.toFixed(1) || "N/A"}
                            </TableCell>
                            <TableCell sx={{ color: "#fff" }}>
                              {test.type === "PERSONALITY"
                                ? test.snapshot?.personalityName || "N/A"
                                : test.snapshot?.bodyType || "N/A"}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                onClick={() => router.push(`/result/${test.id}`)}
                                sx={{ color: "#00ffff" }}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    No tests found
                  </Typography>
                )}
              </Card>
            </Grid>

            {/* Feedback */}
            {user.feedbacks && user.feedbacks.length > 0 && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    p: 3,
                    background: "rgba(10, 14, 39, 0.8)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    borderRadius: 0,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#00ffff",
                      fontWeight: 700,
                      mb: 3,
                      textTransform: "uppercase",
                    }}
                  >
                    Feedback ({user.feedbacks.length})
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {user.feedbacks.map((feedback: any) => (
                      <Box
                        key={feedback.id}
                        sx={{
                          p: 2,
                          background: "rgba(0, 255, 255, 0.05)",
                          border: "1px solid rgba(0, 255, 255, 0.2)",
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>
                            Rating: {feedback.rating}/5
                          </Typography>
                          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        {feedback.comment && (
                          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                            {feedback.comment}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </AdminRoute>
  );
}

