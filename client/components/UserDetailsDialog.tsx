import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Grid,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { Close, Person, Email, Phone, CalendarToday, LocationOn, Assessment } from "@mui/icons-material";
import { useRouter } from "next/router";
import { getAdminUserDetails } from "../lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface UserDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userEmail: string;
  userProfileImage: string | null;
}

export default function UserDetailsDialog({
  open,
  onClose,
  userId,
  userName,
  userEmail,
  userProfileImage,
}: UserDetailsDialogProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && userId) {
      loadUserDetails();
    }
  }, [open, userId]);

  const loadUserDetails = async () => {
    setLoading(true);
    try {
      const response = await getAdminUserDetails(userId);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error loading user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: "#0a0e27",
          border: "1px solid rgba(0, 255, 255, 0.3)",
          borderRadius: 0,
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#00ffff",
          fontWeight: 700,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0, 255, 255, 0.3)",
        }}
      >
        User Details
        <Button onClick={onClose} sx={{ color: "#00ffff", minWidth: "auto" }}>
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#00ffff" }} />
          </Box>
        ) : user ? (
          <Box>
            {/* User Profile Section */}
            <Box sx={{ display: "flex", gap: 3, mb: 4, alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#00ffff",
                  color: "#0a0e27",
                  fontSize: "2rem",
                }}
                src={userProfileImage ? `${API_BASE.replace("/api", "")}${userProfileImage}` : undefined}
              >
                {userName[0].toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ color: "#00ffff", fontWeight: 700, mb: 1 }}>
                  {user.name}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Email sx={{ color: "rgba(0, 255, 255, 0.6)", fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Phone sx={{ color: "rgba(0, 255, 255, 0.6)", fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                        {user.phone}
                      </Typography>
                    </Box>
                  </Grid>
                  {user.dob && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <CalendarToday sx={{ color: "rgba(0, 255, 255, 0.6)", fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                          {formatDate(user.dob)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {user.gender && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Person sx={{ color: "rgba(0, 255, 255, 0.6)", fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                          {user.gender}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {user.state && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <LocationOn sx={{ color: "rgba(0, 255, 255, 0.6)", fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                          {user.state}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {user.nationality && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <LocationOn sx={{ color: "rgba(0, 255, 255, 0.6)", fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                          {user.nationality}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>

            <Divider sx={{ bgcolor: "rgba(0, 255, 255, 0.2)", my: 3 }} />

            {/* Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    p: 2,
                    background: "rgba(0, 255, 255, 0.1)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    borderRadius: 0,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ color: "#00ffff", fontWeight: 800 }}>
                    {user._count?.tests || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Total Tests
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card
                  sx={{
                    p: 2,
                    background: "rgba(138, 43, 226, 0.1)",
                    border: "1px solid rgba(138, 43, 226, 0.3)",
                    borderRadius: 0,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ color: "#8a2be2", fontWeight: 800 }}>
                    {user._count?.feedbacks || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Feedbacks
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Tests Section */}
            <Card
              sx={{
                p: 3,
                background: "rgba(10, 14, 39, 0.8)",
                border: "1px solid rgba(0, 255, 255, 0.3)",
                borderRadius: 0,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Assessment sx={{ color: "#00ffff" }} />
                <Typography variant="h6" sx={{ color: "#00ffff", fontWeight: 700 }}>
                  Test History
                </Typography>
              </Box>

              {user.tests && user.tests.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Date</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Type</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Score</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Body Type</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ color: "#00ffff", fontWeight: 700 }}>Action</TableCell>
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
                            {test.snapshot?.bodyType || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={test.status || "submitted"}
                              size="small"
                              sx={{
                                background: "rgba(0, 255, 255, 0.2)",
                                color: "#00ffff",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              onClick={() => {
                                router.push(`/result/${test.id}`);
                                onClose();
                              }}
                              sx={{
                                color: "#00ffff",
                                "&:hover": {
                                  bgcolor: "rgba(0, 255, 255, 0.1)",
                                },
                              }}
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
                <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center", py: 2 }}>
                  No tests found
                </Typography>
              )}
            </Card>
          </Box>
        ) : (
          <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center", py: 4 }}>
            Failed to load user details
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: "1px solid rgba(0, 255, 255, 0.3)", p: 2 }}>
        <Button onClick={onClose} sx={{ color: "#00ffff" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

