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
import PersonalityOverview from "../../components/PersonalityOverview";
import TestHistoryCard from "../../components/TestHistoryCard";
import TestRoadmap from "../../components/TestRoadmap";
import UnlockCelebration from "../../components/UnlockCelebration";
import NextTestPrompt from "../../components/NextTestPrompt";
import ProfileCompletionModal from "../../components/ProfileCompletionModal";
import { useAuth } from "../../contexts/AuthContext";
import { getUserTests } from "../../lib/api";
import Header from "../../components/Header";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnlockCelebration, setShowUnlockCelebration] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const loadTests = async () => {
    try {
      const response = await getUserTests();
      const newTests = response.data.tests || [];
      const previousTests = tests;
      setTests(newTests);
      
      // Check if user just completed BBA test (show celebration)
      const hasBBATest = newTests.some((test: any) => test.type === "BBA");
      const hasPersonalityTest = newTests.some((test: any) => test.type === "PERSONALITY");
      const hadBBATest = previousTests.some((test: any) => test.type === "BBA");
      
      // Show celebration if BBA is newly completed (wasn't there before, but is now)
      if (hasBBATest && !hadBBATest && !hasPersonalityTest) {
        // Small delay to make it feel natural
        setTimeout(() => {
          setShowUnlockCelebration(true);
        }, 500);
      }
    } catch (error) {
      console.error("Error loading tests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
    
    // Check if profile is required from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("profileRequired") === "true") {
      setShowProfileModal(true);
      // Clean up URL
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  const latestBBATest = tests.find((test: any) => test.type === "BBA");
  const latestPersonalityTest = tests.find((test: any) => test.type === "PERSONALITY");
  const latestBBASnapshot = latestBBATest?.snapshot;
  const latestPersonalitySnapshot = latestPersonalityTest?.snapshot;
  const hasBBATest = tests.some((test: any) => test.type === "BBA");
  const hasPersonalityTest = tests.some((test: any) => test.type === "PERSONALITY");

  const profileCompletion = () => {
    let completed = 0;
    const fields = ["name", "email", "phone", "dob", "gender", "state", "nationality", "profileImage"];
    fields.forEach((field) => {
      if (user?.[field as keyof typeof user]) completed++;
    });
    return Math.round((completed / fields.length) * 100);
  };

  const isProfileComplete = () => {
    const requiredFields = ["name", "email", "phone", "dob", "gender", "state", "nationality"];
    return requiredFields.every((field) => {
      const value = user?.[field as keyof typeof user];
      return value !== null && value !== undefined && value !== "";
    });
  };

  const getMissingFields = () => {
    const fieldLabels: { [key: string]: string } = {
      name: "Full Name",
      email: "Email",
      phone: "Phone Number",
      dob: "Date of Birth",
      gender: "Gender",
      state: "State",
      nationality: "Nationality",
    };
    const requiredFields = ["name", "email", "phone", "dob", "gender", "state", "nationality"];
    return requiredFields
      .filter((field) => {
        const value = user?.[field as keyof typeof user];
        return !value || value === "";
      })
      .map((field) => fieldLabels[field] || field);
  };

  const handlePersonalityTestClick = () => {
    if (hasPersonalityTest) {
      // Already completed - redirect to locked page
      const personalityTest = tests.find((test: any) => test.type === "PERSONALITY");
      if (personalityTest) {
        router.push(`/test-locked?testType=PERSONALITY&resultId=${personalityTest.id}&testName=Personality Test`);
      }
      return;
    }

    if (!isProfileComplete()) {
      setShowProfileModal(true);
      return;
    }

    router.push("/personality-test");
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
          {/* Unlock Celebration Modal */}
          <UnlockCelebration
            open={showUnlockCelebration}
            onClose={() => setShowUnlockCelebration(false)}
            testName="Personality Test"
            onStartTest={() => {
              if (isProfileComplete()) {
                router.push("/personality-test");
              } else {
                setShowProfileModal(true);
              }
            }}
          />

          {/* Profile Completion Modal */}
          <ProfileCompletionModal
            open={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            onCompleteProfile={() => router.push("/dashboard/profile")}
            missingFields={getMissingFields()}
          />

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

              {/* Test Buttons - Gamified */}
              <Box sx={{ 
                display: "flex", 
                gap: { xs: 1, sm: 1.5, md: 2 }, 
                justifyContent: "center", 
                mb: { xs: 3, sm: 4, md: 5 },
                flexDirection: { xs: "column", sm: "row" },
                px: { xs: 1, sm: 0 },
              }}>
                <Button
                  variant="contained"
                  startIcon={<PlayArrow sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }} />}
                  onClick={() => {
                    if (hasBBATest) {
                      const bbaTest = tests.find((test: any) => test.type === "BBA");
                      if (bbaTest) {
                        router.push(`/test-locked?testType=BBA&resultId=${bbaTest.id}&testName=Body Behaviour Analysis`);
                      }
                    } else {
                      router.push("/test");
                    }
                  }}
                  sx={{
                    background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                    color: "#0a0e27",
                    fontWeight: 700,
                    px: { xs: 3, sm: 4, md: 6 },
                    py: { xs: 1, sm: 1.5, md: 2 },
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                    border: "2px solid #00ffff",
                    boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                      boxShadow: "0 0 50px rgba(0, 255, 255, 0.8)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {hasBBATest 
                    ? "✓ Level 1: BBA Test" 
                    : "Level 1: BBA Test"}
                </Button>
                <Button
                  variant={hasBBATest && !hasPersonalityTest ? "contained" : "outlined"}
                  startIcon={<Assessment sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }} />}
                  onClick={handlePersonalityTestClick}
                  disabled={!hasBBATest}
                  sx={{
                    background: hasBBATest && !hasPersonalityTest
                      ? "linear-gradient(135deg, #8a2be2 0%, #00ffff 100%)"
                      : "transparent",
                    color: hasPersonalityTest 
                      ? "#00ffff" 
                      : hasBBATest 
                      ? "#0a0e27" 
                      : "#8a2be2",
                    fontWeight: 700,
                    px: { xs: 3, sm: 4, md: 6 },
                    py: { xs: 1, sm: 1.5, md: 2 },
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                    border: hasPersonalityTest 
                      ? "2px solid #00ffff" 
                      : hasBBATest 
                      ? "2px solid #8a2be2" 
                      : "2px solid #8a2be2",
                    boxShadow: hasBBATest && !hasPersonalityTest ? "0 0 30px rgba(138, 43, 226, 0.5)" : hasPersonalityTest ? "0 0 30px rgba(0, 255, 255, 0.5)" : "none",
                    opacity: hasBBATest ? 1 : 0.6,
                    position: "relative",
                    "&:hover": {
                      background: hasPersonalityTest
                        ? "rgba(0, 255, 255, 0.1)"
                        : hasBBATest
                        ? "linear-gradient(135deg, #8a2be2 0%, #00ffff 100%)"
                        : "transparent",
                      boxShadow: hasBBATest && !hasPersonalityTest ? "0 0 50px rgba(138, 43, 226, 0.8)" : hasPersonalityTest ? "0 0 50px rgba(0, 255, 255, 0.8)" : "none",
                      transform: hasBBATest ? "translateY(-2px)" : "none",
                    },
                    "&:disabled": {
                      borderColor: "#8a2be2",
                      color: "#8a2be2",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {hasPersonalityTest 
                    ? "✓ Level 2: Personality Test" 
                    : hasBBATest 
                    ? "Level 2: Personality Test" 
                    : "🔒 Locked - Complete Level 1"}
                </Button>
              </Box>
            </Box>
          </motion.div>

          {/* Next Test Prompt - Show after BBA completion */}
          {hasBBATest && !hasPersonalityTest && (
            <NextTestPrompt 
              onStartTest={() => {
                if (isProfileComplete()) {
                  router.push("/personality-test");
                } else {
                  setShowProfileModal(true);
                }
              }} 
            />
          )}

          {/* Test Roadmap - Horizontal Gamified */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <TestRoadmap
              hasBBATest={hasBBATest}
              hasPersonalityTest={hasPersonalityTest}
              onBBAClick={() => {
                if (hasBBATest) {
                  const bbaTest = tests.find((test: any) => test.type === "BBA");
                  if (bbaTest) {
                    router.push(`/test-locked?testType=BBA&resultId=${bbaTest.id}&testName=Body Behaviour Analysis`);
                  }
                } else {
                  router.push("/test");
                }
              }}
              onPersonalityClick={handlePersonalityTestClick}
            />
          </motion.div>

          {/* Overview Section */}
          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 2, md: 3 },
            mb: { xs: 2, sm: 3, md: 4 },
          }}>
            {/* Body Type Overview */}
            {latestBBASnapshot && (
              <Box sx={{ 
                flex: { xs: "1 1 100%", sm: "1 1 50%" },
                minWidth: { xs: "100%", sm: "auto" },
              }}>
                <BodyTypeOverview snapshot={latestBBASnapshot} />
              </Box>
            )}

            {/* Personality Overview */}
            {latestPersonalitySnapshot && (
              <Box sx={{ 
                flex: { xs: "1 1 100%", sm: "1 1 50%" },
                minWidth: { xs: "100%", sm: "auto" },
              }}>
                <PersonalityOverview snapshot={latestPersonalitySnapshot} />
              </Box>
            )}
          </Box>

          {/* Stats Cards */}
          <Box sx={{ 
            display: "flex",
            flexDirection: { xs: "row", sm: "row" },
            flexWrap: "nowrap",
            gap: { xs: 0.75, sm: 2 },
            mb: { xs: 2, sm: 3, md: 4 },
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

