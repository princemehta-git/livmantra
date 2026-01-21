import React from "react";
import { Box, Card, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { Insights } from "@mui/icons-material";

interface PersonalityOverviewProps {
  snapshot?: any;
}

export default function PersonalityOverview({ snapshot }: PersonalityOverviewProps) {
  if (!snapshot) {
    return null;
  }

  const personalityName = snapshot.personalityName || "Unknown";
  const personalityCode = snapshot.code || "N/A";
  const personalityType = snapshot.personalityType;

  // Color mapping for dimensions (matching PersonalityResultCard)
  const getDimensionColor = (dimensionIndex: number) => {
    const colors = [
      "#00ffff", // Dimension 0: Mind Style
      "#ff69b4", // Dimension 1: Stress Response (pink)
      "#ff6b6b", // Dimension 2: Health Discipline
      "#51cf66", // Dimension 3: Social & Emotional
      "#ffd700", // Dimension 4: Energy & Activity
      "#8a2be2", // Dimension 5: Habit & Change (purple)
    ];
    return colors[dimensionIndex] || "#00ffff";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          background: "rgba(10, 14, 39, 0.8)",
          border: "2px solid rgba(138, 43, 226, 0.3)",
          borderRadius: 0,
          backdropFilter: "blur(20px)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.5), transparent)",
            animation: "shimmer 2s linear infinite",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Insights sx={{ color: "#00ffff", mr: 1, fontSize: { xs: 20, sm: 24, md: 32 } }} />
          <Typography
            variant="h5"
            sx={{
              color: "#00ffff",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontSize: { xs: "0.875rem", sm: "1.125rem", md: "1.5rem" },
            }}
          >
            Personality Overview
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              mb: { xs: 0.75, sm: 1, md: 1.5 },
              fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
            }}
          >
            Your Personality Type
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#00ffff",
              fontWeight: 700,
              mb: { xs: 1, sm: 1.5, md: 2 },
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1.125rem" },
              lineHeight: 1.3,
            }}
          >
            {personalityName}
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 1.5, sm: 2, md: 2.5 } }}>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              mb: { xs: 0.75, sm: 1, md: 1.5 },
              fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
            }}
          >
            Personality Code
          </Typography>
          <Box sx={{ 
            display: "flex", 
            gap: { xs: 1, sm: 1.5, md: 2 },
            flexWrap: { xs: "wrap", sm: "nowrap", md: "nowrap" },
          }}>
            {personalityCode.split("-").map((letter: string, idx: number) => {
              const dimColor = getDimensionColor(idx);
              const dimensionNames = [
                "MIND", "STRESS", "HEALTH", "SOCIAL", "ENERGY", "HABIT"
              ];
              const dimensionName = dimensionNames[idx] || `DIM ${idx + 1}`;
              
              return (
                <Box key={idx} sx={{ 
                  flex: { xs: "1 1 auto", sm: "1 1 auto", md: "1 1 auto" }, 
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 0.75, md: 1 },
                }}>
                  {/* Dimension Name */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: dimColor,
                      fontWeight: 600,
                      fontSize: { xs: "0.55rem", sm: "0.65rem", md: "0.7rem" },
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      textAlign: "center",
                      lineHeight: 1.2,
                    }}
                  >
                    {dimensionName}
                  </Typography>
                  
                  {/* Code Chip */}
                  <Chip
                    label={letter}
                    sx={{
                      background: `${dimColor}30`,
                      color: dimColor,
                      border: `1px solid ${dimColor}50`,
                      fontWeight: 700,
                      fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                      px: { xs: 1, sm: 1.25, md: 1.5 },
                      py: { xs: 0.75, sm: 1, md: 1.25 },
                      height: { xs: "28px", sm: "32px", md: "36px" },
                      width: "100%",
                      justifyContent: "center",
                      borderRadius: "8px",
                      "& .MuiChip-label": {
                        padding: 0,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>

        {personalityType && (
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                mb: { xs: 0.75, sm: 1, md: 1.5 },
                fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
              }}
            >
              Family
            </Typography>
            <Chip
              label={personalityType.family}
              sx={{
                background: "rgba(138, 43, 226, 0.2)",
                color: "#8a2be2",
                border: "1px solid rgba(138, 43, 226, 0.4)",
                fontWeight: 600,
                fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                height: { xs: 28, sm: 32, md: 36 },
              }}
            />
          </Box>
        )}
      </Card>
    </motion.div>
  );
}
