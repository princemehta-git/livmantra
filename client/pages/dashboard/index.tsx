import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { PlayArrow, Person, Assessment } from "@mui/icons-material";
import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardVideoBackground from "../../components/DashboardVideoBackground";
import BodyTypeOverview from "../../components/BodyTypeOverview";
import TestHistoryCard from "../../components/TestHistoryCard";
import { useAuth } from "../../contexts/AuthContext";
import { getUserTests } from "../../lib/api";
import Header from "../../components/Header";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const response = await getUserTests();
      setTests(response.data.tests || []);
    } catch (error) {
      console.error("Error loading tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const latestTest = tests[0];
  const latestSnapshot = latestTest?.snapshot;

  const profileCompletion = () => {
    let completed = 0;
    const fields = ["name", "email", "phone", "dob", "gender", "state", "nationality", "profileImage"];
    fields.forEach((field) => {
      if (user?.[field as keyof typeof user]) completed++;
    });
    return Math.round((completed / fields.length) * 100);
  };

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

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  color: "#00ffff",
                  fontWeight: 800,
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.5rem" },
                }}
              >
                Welcome, {user?.name}!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  mb: { xs: 2, sm: 2.5, md: 3 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                }}
              >
                Your personalized health dashboard
              </Typography>

              <Box sx={{ 
                display: "flex", 
                gap: { xs: 0.75, sm: 1.5, md: 2 }, 
                justifyContent: "center", 
                mb: { xs: 2, sm: 3, md: 4 },
                flexDirection: { xs: "row", sm: "row" },
                flexWrap: "wrap",
                px: { xs: 0.5, sm: 0 },
              }}>
                <Button
                  variant="contained"
                  startIcon={<PlayArrow sx={{ fontSize: { xs: "0.875rem", sm: "1.25rem", md: "1.5rem" } }} />}
                  onClick={() => router.push("/test")}
                  sx={{
                    background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                    color: "#0a0e27",
                    fontWeight: 700,
                    px: { xs: 1.5, sm: 3, md: 4 },
                    py: { xs: 0.6, sm: 1, md: 1.5 },
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.875rem" },
                    flex: { xs: "1 1 auto", sm: "0 0 auto" },
                    minWidth: { xs: "auto", sm: "auto" },
                    "&:hover": {
                      background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                      boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)",
                    },
                  }}
                >
                  Take New Test
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Person sx={{ fontSize: { xs: "0.875rem", sm: "1.25rem", md: "1.5rem" } }} />}
                  onClick={() => router.push("/dashboard/profile")}
                  sx={{
                    color: "#00ffff",
                    borderColor: "rgba(0, 255, 255, 0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    px: { xs: 1.5, sm: 3, md: 4 },
                    py: { xs: 0.6, sm: 1, md: 1.5 },
                    fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.875rem" },
                    flex: { xs: "1 1 auto", sm: "0 0 auto" },
                    minWidth: { xs: "auto", sm: "auto" },
                    "&:hover": {
                      borderColor: "#00ffff",
                      background: "rgba(0, 255, 255, 0.1)",
                    },
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>
          </motion.div>

          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: "row", sm: "row", md: "row" },
            gap: { xs: 1, sm: 2, md: 3 },
            mb: { xs: 2, sm: 3, md: 4 },
            flexWrap: { xs: "wrap", sm: "nowrap", md: "nowrap" },
          }}>
            {/* Body Type Overview */}
            <Box sx={{ 
              flex: { xs: "1 1 100%", sm: "1 1 40%", md: "0 0 33.333%" },
              minWidth: { xs: "100%", sm: "auto", md: "auto" },
            }}>
              <BodyTypeOverview snapshot={latestSnapshot} />
            </Box>

            {/* Stats Cards */}
            <Box sx={{ 
              flex: { xs: "1 1 100%", sm: "1 1 60%", md: "0 0 66.666%" },
              display: "flex",
              flexDirection: { xs: "row", sm: "row" },
              flexWrap: "nowrap",
              gap: { xs: 0.75, sm: 2 },
              minWidth: { xs: "100%", sm: "auto", md: "auto" },
            }}>
              <Card
                sx={{
                  p: { xs: 1, sm: 2.5, md: 3 },
                  background: "rgba(10, 14, 39, 0.8)",
                  border: "1px solid rgba(0, 255, 255, 0.3)",
                  borderRadius: 0,
                  backdropFilter: "blur(10px)",
                  flex: { xs: "1 1 50%", sm: "1 1 50%" },
                  minWidth: 0,
                  maxWidth: { xs: "50%", sm: "none" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 0.75, sm: 1.5, md: 2 } }}>
                  <Assessment sx={{ color: "#00ffff", mr: 0.5, fontSize: { xs: "0.875rem", sm: "1.5rem", md: "1.75rem" } }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: { xs: "0.6rem", sm: "0.8rem", md: "0.875rem" },
                      whiteSpace: "nowrap",
                    }}
                  >
                    Total Tests
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    color: "#00ffff",
                    fontWeight: 800,
                    fontSize: { xs: "1rem", sm: "2rem", md: "2.5rem" },
                    lineHeight: 1.2,
                  }}
                >
                  {tests.length}
                </Typography>
              </Card>

              <Card
                sx={{
                  p: { xs: 1, sm: 2.5, md: 3 },
                  background: "rgba(10, 14, 39, 0.8)",
                  border: "1px solid rgba(0, 255, 255, 0.3)",
                  borderRadius: 0,
                  backdropFilter: "blur(10px)",
                  flex: { xs: "1 1 50%", sm: "1 1 50%" },
                  minWidth: 0,
                  maxWidth: { xs: "50%", sm: "none" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 0.75, sm: 1.5, md: 2 } }}>
                  <Person sx={{ color: "#8a2be2", mr: 0.5, fontSize: { xs: "0.875rem", sm: "1.5rem", md: "1.75rem" } }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: { xs: "0.6rem", sm: "0.8rem", md: "0.875rem" },
                      whiteSpace: "nowrap",
                    }}
                  >
                    Profile Completion
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    color: "#8a2be2",
                    fontWeight: 800,
                    fontSize: { xs: "1rem", sm: "2rem", md: "2.5rem" },
                    lineHeight: 1.2,
                  }}
                >
                  {profileCompletion()}%
                </Typography>
              </Card>
            </Box>
          </Box>

          {/* Test History */}
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h5"
              sx={{
                color: "#00ffff",
                fontWeight: 700,
                mb: { xs: 2, sm: 2.5, md: 3 },
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              }}
            >
              Test History
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: { xs: 2, sm: 3, md: 4 } }}>
                <CircularProgress sx={{ color: "#00ffff", size: { xs: 30, sm: 40 } }} />
              </Box>
            ) : tests.length === 0 ? (
              <Card
                sx={{
                  p: { xs: 2.5, sm: 3, md: 4 },
                  background: "rgba(10, 14, 39, 0.8)",
                  border: "1px solid rgba(0, 255, 255, 0.3)",
                  borderRadius: 0,
                  textAlign: "center",
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: "rgba(255, 255, 255, 0.6)", 
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                  }}
                >
                  No tests yet. Take your first test to get started!
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PlayArrow sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }} />}
                  onClick={() => router.push("/test")}
                  sx={{
                    background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                    color: "#0a0e27",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 0.75, sm: 1, md: 1.5 },
                    fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                  }}
                >
                  Take Test
                </Button>
              </Card>
            ) : (
              <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: "row", sm: "row" },
                flexWrap: "wrap",
                gap: { xs: 1.5, sm: 2, md: 3 },
              }}>
                {tests.map((test) => (
                  <Box 
                    key={test.id}
                    sx={{
                      flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(33.333% - 16px)" },
                      minWidth: 0,
                    }}
                  >
                    <TestHistoryCard test={test} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}

