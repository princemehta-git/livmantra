import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { getUserTests } from "../lib/api";
import Header from "../components/Header";

export default function TestTransitionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [checkingTests, setCheckingTests] = useState(true);

  useEffect(() => {
    const checkUserTests = async () => {
      if (authLoading) return;

      // If user is not authenticated, redirect to login
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        // Check if user has any tests
        const response = await getUserTests();
        const tests = response.data.tests || [];
        
        // If user already has tests, redirect to dashboard
        if (tests.length > 0) {
          router.push("/dashboard");
          return;
        }

        // User is first-time, proceed with transition
        setCheckingTests(false);
      } catch (error) {
        console.error("Error checking tests:", error);
        // On error, still proceed with transition
        setCheckingTests(false);
      }
    };

    checkUserTests();
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!checkingTests && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/test");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [checkingTests, countdown, router]);

  if (authLoading || checkingTests) {
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0a0e27",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated grid background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          opacity: 0.4,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Header />

      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 80px)",
          py: 8,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%" }}
        >
          <Box
            sx={{
              background: "rgba(10, 14, 39, 0.9)",
              border: "2px solid rgba(0, 255, 255, 0.3)",
              borderRadius: 0,
              p: { xs: 4, md: 6 },
              backdropFilter: "blur(20px)",
              textAlign: "center",
            }}
          >
            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: "#00ffff",
                  fontWeight: 800,
                  mb: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                }}
              >
                Welcome to Your Journey!
              </Typography>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  mb: 4,
                  fontWeight: 500,
                  fontSize: { xs: "1.1rem", md: "1.5rem" },
                }}
              >
                We're landing you to your first BBA test
              </Typography>
            </motion.div>

            {/* Countdown Circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 120, md: 150 },
                  height: { xs: 120, md: 150 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={(5 - countdown) * 20}
                  size={150}
                  thickness={4}
                  sx={{
                    position: "absolute",
                    color: "rgba(0, 255, 255, 0.3)",
                    "& .MuiCircularProgress-circle": {
                      strokeLinecap: "round",
                    },
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={(5 - countdown) * 20}
                  size={150}
                  thickness={4}
                  sx={{
                    color: "#00ffff",
                    position: "absolute",
                    "& .MuiCircularProgress-circle": {
                      strokeLinecap: "round",
                    },
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    color: "#00ffff",
                    fontWeight: 800,
                    fontSize: { xs: "3rem", md: "4rem" },
                  }}
                >
                  {countdown}
                </Typography>
              </Box>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Box
                sx={{
                  background: "rgba(0, 255, 255, 0.05)",
                  border: "1px solid rgba(0, 255, 255, 0.2)",
                  p: 4,
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#00ffff",
                    fontWeight: 700,
                    mb: 2,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontSize: { xs: "1rem", md: "1.25rem" },
                  }}
                >
                  What is BBA Test?
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: 1.8,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  The Body Behaviour Analysis (BBA) test is a comprehensive assessment that helps
                  you understand your body type, constitution, and current imbalances. Through 35
                  carefully crafted questions, you'll discover insights about your physical
                  characteristics, energy patterns, and overall well-being.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    background: "rgba(138, 43, 226, 0.1)",
                    border: "1px solid rgba(138, 43, 226, 0.3)",
                    p: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: { xs: "0.85rem", md: "0.9rem" },
                    }}
                  >
                    <strong style={{ color: "#8a2be2" }}>35 Questions</strong> covering body type,
                    constitution, and imbalances
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    background: "rgba(0, 255, 255, 0.1)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    p: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: { xs: "0.85rem", md: "0.9rem" },
                    }}
                  >
                    <strong style={{ color: "#00ffff" }}>Personalized Results</strong> based on
                    your unique body characteristics
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.5)",
                  mt: 4,
                  fontStyle: "italic",
                }}
              >
                Preparing your test experience...
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "header"])),
    },
  };
};
