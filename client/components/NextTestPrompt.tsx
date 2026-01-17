import React from "react";
import { Card, Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { ArrowForward, Psychology } from "@mui/icons-material";

interface NextTestPromptProps {
  onStartTest: () => void;
}

export default function NextTestPrompt({ onStartTest }: NextTestPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          background: "linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(0, 255, 255, 0.1) 100%)",
          border: "2px solid rgba(138, 43, 226, 0.5)",
          borderRadius: 0,
          backdropFilter: "blur(10px)",
          mb: { xs: 3, sm: 4, md: 5 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.2), transparent)",
            animation: "shimmer 3s infinite",
            "@keyframes shimmer": {
              "0%": { left: "-100%" },
              "100%": { left: "100%" },
            },
          },
        }}
      >
        <Box sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Psychology
              sx={{
                fontSize: { xs: 48, sm: 64, md: 80 },
                color: "#8a2be2",
                filter: "drop-shadow(0 0 20px rgba(138, 43, 226, 0.8))",
                mb: 2,
              }}
            />
          </motion.div>

          <Typography
            variant="h4"
            sx={{
              color: "#8a2be2",
              fontWeight: 900,
              mb: { xs: 1, sm: 1.5 },
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
            }}
          >
            🎯 Next Mission Available!
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              mb: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
            }}
          >
            You've unlocked the Personality Test!
            <br />
            Discover your personality dimensions across 6 key areas.
          </Typography>

          <Button
            variant="contained"
            endIcon={<ArrowForward sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />}
            onClick={onStartTest}
            sx={{
              background: "linear-gradient(135deg, #8a2be2 0%, #00ffff 100%)",
              color: "#0a0e27",
              fontWeight: 700,
              px: { xs: 4, sm: 6, md: 8 },
              py: { xs: 1.5, sm: 2, md: 2.5 },
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              border: "2px solid #8a2be2",
              boxShadow: "0 0 30px rgba(138, 43, 226, 0.6)",
              "&:hover": {
                background: "linear-gradient(135deg, #8a2be2 0%, #00ffff 100%)",
                boxShadow: "0 0 50px rgba(138, 43, 226, 0.8)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Start Personality Test
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
}
