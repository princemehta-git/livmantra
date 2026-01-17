import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Container, Card, Typography, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { Lock, ArrowBack } from "@mui/icons-material";
import Header from "../components/Header";

interface TestLockedPageProps {
  testType: "BBA" | "PERSONALITY";
  resultId: string;
  testName: string;
}

export default function TestLockedPage() {
  const router = useRouter();
  const { testType, resultId, testName } = router.query;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!resultId || !testType) {
      // If no result ID, redirect to dashboard
      router.push("/dashboard");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/result/${resultId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resultId, testType, router]);

  const testColor = testType === "BBA" ? "#00ffff" : "#8a2be2";
  const testGradient = testType === "BBA" 
    ? "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)"
    : "linear-gradient(135deg, #8a2be2 0%, #00ffff 100%)";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0a0e27",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Header />
      <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 1.5, sm: 2, md: 3 }, position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              background: "rgba(10, 14, 39, 0.95)",
              border: `2px solid ${testColor}`,
              borderRadius: 0,
              textAlign: "center",
              backdropFilter: "blur(20px)",
              boxShadow: `0 0 50px ${testColor}40`,
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Lock
                sx={{
                  fontSize: { xs: 64, sm: 80, md: 96 },
                  color: testColor,
                  mb: 2,
                  filter: `drop-shadow(0 0 30px ${testColor}80)`,
                }}
              />
            </motion.div>

            <Typography
              variant="h4"
              sx={{
                color: testColor,
                fontWeight: 900,
                mb: 1,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
              }}
            >
              Test Already Completed
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                mb: 3,
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
              }}
            >
              You have already completed the {testName || (testType === "BBA" ? "Body Behaviour Analysis" : "Personality")} test.
            </Typography>

            <Box
              sx={{
                background: `rgba(${testType === "BBA" ? "0, 255, 255" : "138, 43, 226"}, 0.1)`,
                border: `1px solid ${testColor}40`,
                borderRadius: 0,
                p: 3,
                mb: 4,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  mb: 2,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Redirecting to your results in...
              </Typography>
              <motion.div
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    color: testColor,
                    fontWeight: 900,
                    fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
                    textShadow: `0 0 30px ${testColor}80`,
                  }}
                >
                  {countdown}
                </Typography>
              </motion.div>
            </Box>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                onClick={() => router.push(`/result/${resultId}`)}
                sx={{
                  background: testGradient,
                  color: "#0a0e27",
                  fontWeight: 700,
                  px: { xs: 4, sm: 6, md: 8 },
                  py: { xs: 1.5, sm: 2, md: 2.5 },
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                  border: `2px solid ${testColor}`,
                  boxShadow: `0 0 30px ${testColor}60`,
                  "&:hover": {
                    background: testGradient,
                    boxShadow: `0 0 50px ${testColor}80`,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                View Results Now
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => router.push("/dashboard")}
                sx={{
                  borderColor: testColor,
                  color: testColor,
                  fontWeight: 700,
                  px: { xs: 4, sm: 6, md: 8 },
                  py: { xs: 1.5, sm: 2, md: 2.5 },
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                  "&:hover": {
                    borderColor: testColor,
                    background: `${testColor}20`,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Back to Dashboard
              </Button>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
