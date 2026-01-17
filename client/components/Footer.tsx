import React from "react";
import { Box, Container, Typography, Link, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import Logo from "./Logo";

export default function Footer() {
  const { t } = useTranslation("footer");
  
  // Helper function to get translation with fallback
  const getTranslation = (key: string, fallback: string) => {
    const translated = t(key);
    // If translation returns the key itself, use fallback
    return translated === key ? fallback : translated || fallback;
  };
  
  // Translations with fallbacks
  const translations = {
    description: getTranslation("description", "Your personal AI wellness coach combining modern medicine, Ayurveda, and behavioral psychology to help you achieve optimal health."),
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
        py: 8,
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
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ mb: 3 }}>
                <Logo
                  width={180}
                  height={72}
                  animated={false}
                />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
                {translations.description}
              </Typography>
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
  );
}


