import React from "react";
import { Box, Container, Typography, Link, Grid, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { FitnessCenter, ArrowForward } from "@mui/icons-material";
import { useRouter } from "next/router";
import Logo from "./Logo";

export default function Footer() {
  const { t } = useTranslation("footer");
  const router = useRouter();
  
  // Helper function to get translation with fallback
  const getTranslation = (key: string, fallback: string) => {
    const translated = t(key);
    // If translation returns the key itself, use fallback
    return translated === key ? fallback : translated || fallback;
  };
  
  // Translations with fallbacks
  const translations = {
    description: getTranslation("description", "Your Personal AI health coach!"),
    quickLinks: getTranslation("quickLinks", "Quick Links"),
    home: getTranslation("home", "Home"),
    freeTests: getTranslation("freeTests", "Free Tests"),
    healthScore: getTranslation("healthScore", "Health Score"),
    aiCoach: getTranslation("aiCoach", "AI Coach"),
    contact: getTranslation("contact", "Contact"),
    supportEmail: getTranslation("supportEmail", "support@livmantra.com"),
    copyright: getTranslation("copyright", "© 2026 LivMantra. All rights reserved."),
  };
  
  return (
    <Box
      component="footer"
      sx={{
        background: "rgba(10, 14, 39, 0.9)",
        color: "white",
        mt: 12,
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(0, 255, 255, 0.2)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent, #00ffff, #8a2be2, transparent)",
          boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
        },
      }}
    >
      {/* Credibility Section */}
      <Box
        sx={{
          borderBottom: "1px solid rgba(0, 255, 255, 0.1)",
          py: { xs: 8, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  display: "inline-flex",
                  p: 2,
                  borderRadius: "50%",
                  background: "rgba(0, 255, 255, 0.1)",
                  border: "1px solid rgba(0, 255, 255, 0.2)",
                  mb: 4,
                }}
              >
                <FitnessCenter sx={{ fontSize: 32, color: "#00ffff" }} />
              </Box>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                  fontWeight: 400,
                  color: "#ffffff",
                  mb: 3,
                  fontFamily: "serif",
                }}
              >
                Designed by doctors. Built for real life.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  color: "rgba(255, 255, 255, 0.7)",
                  maxWidth: "800px",
                  mx: "auto",
                  mb: 4,
                  lineHeight: 1.7,
                }}
              >
                LivMantra is created by experienced doctors who believe health should feel understandable, habits should feel realistic, and guidance should feel humane.
              </Typography>
              <Typography
                variant="overline"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "rgba(255, 255, 255, 0.5)",
                  textTransform: "uppercase",
                  display: "block",
                }}
              >
                Follows the philosophy of{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#ffffff",
                    borderBottom: "1px solid rgba(0, 255, 255, 0.3)",
                    pb: 0.5,
                    mx: 0.5,
                  }}
                >
                  My Expert Doctor Health Clinic
                </Box>
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box
        sx={{
          background: "rgba(0, 0, 0, 0.3)",
          py: { xs: 8, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  fontWeight: 400,
                  color: "#ffffff",
                  mb: 4,
                  lineHeight: 1.4,
                }}
              >
                The first step is not changing everything.
                <br />
                It's understanding yourself.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push("/test")}
                endIcon={<ArrowForward sx={{ fontSize: { xs: 18, md: 20 } }} />}
                sx={{
                  px: { xs: 3, sm: 4, md: 5 },
                  py: { xs: 1.5, sm: 2, md: 2.5 },
                  background: "#ffffff",
                  color: "#0a0e27",
                  borderRadius: "50px",
                  fontWeight: 700,
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                  textTransform: "none",
                  mb: 3,
                  width: { xs: "90%", sm: "auto" },
                  maxWidth: { xs: "100%", sm: "none" },
                  whiteSpace: { xs: "normal", sm: "nowrap" },
                  lineHeight: { xs: 1.4, sm: 1.5 },
                  "& .MuiButton-endIcon": {
                    ml: { xs: 1, md: 1.5 },
                  },
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.9)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 20px rgba(255, 255, 255, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Start Free Body & Mind Assessment
              </Button>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "0.875rem",
                }}
              >
                No spam. No pressure. Just clarity.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Main Footer Content */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", md: "flex-start" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Logo width={200} height={80} animated={false} />
                <Typography
                  variant="h6"
                  sx={{
                    opacity: 0.9,
                    lineHeight: 1.6,
                    textAlign: { xs: "center", md: "left" },
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    background: "linear-gradient(90deg, #00ffff 0%, #8a2be2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {translations.description}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                {translations.quickLinks}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  { href: "/", label: translations.home },
                  { href: "/test", label: translations.freeTests },
                  { href: "#", label: translations.healthScore },
                  { href: "#", label: translations.aiCoach },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    sx={{
                      textDecoration: "none",
                      color: "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#00ffff",
                        transform: "translateX(4px)",
                        textShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                      },
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                {translations.contact}
              </Typography>
              <Link
                href={`mailto:${translations.supportEmail}`}
                sx={{
                  textDecoration: "none",
                  color: "rgba(255, 255, 255, 0.8)",
                  opacity: 0.8,
                  mb: 2,
                  display: "block",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#00ffff",
                    textShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                    opacity: 1,
                  },
                }}
              >
                {translations.supportEmail}
              </Link>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>
                {translations.copyright}
              </Typography>
            </motion.div>
          </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Copyright */}
      <Box
        sx={{
          py: 3,
          background: "rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          borderTop: "1px solid rgba(0, 255, 255, 0.1)",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "0.75rem",
          }}
        >
          © {new Date().getFullYear()} LivMantra. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}


