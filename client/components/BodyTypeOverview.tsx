import React from "react";
import { Box, Card, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { AutoAwesome } from "@mui/icons-material";

interface BodyTypeOverviewProps {
  snapshot?: any;
}

// Mapping functions to convert to Aero/Pyro/Geo
const mapToElement = (value: string): string => {
  // Body type mapping: Ectomorph -> Aero, Mesomorph -> Pyro, Endomorph -> Geo
  if (value === "Ectomorph" || value === "Vata") return "Aero";
  if (value === "Mesomorph" || value === "Pitta") return "Pyro";
  if (value === "Endomorph" || value === "Kapha") return "Geo";
  
  // Handle combined types (e.g., "Vata-Pitta" -> "Aero-Pyro")
  if (value.includes("-")) {
    return value
      .split("-")
      .map((v) => mapToElement(v.trim()))
      .join("-");
  }
  
  // Handle combined types with spaces
  if (value.includes(" ")) {
    return value
      .split(" ")
      .map((v) => mapToElement(v.trim()))
      .join(" ");
  }
  
  return value; // Return as-is if no mapping found
};

export default function BodyTypeOverview({ snapshot }: BodyTypeOverviewProps) {
  if (!snapshot) {
    return null;
  }

  const bodyType = mapToElement(snapshot.bodyType || "Unknown");
  const prakriti = mapToElement(snapshot.prakriti || "Unknown");
  const vikriti = mapToElement(snapshot.vikriti || "Unknown");

  const getBodyTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      Aero: "#00ffff",
      Pyro: "#8a2be2",
      Geo: "#ff6b6b",
    };
    // Check if it contains any of the elements
    if (type.includes("Aero")) return "#00ffff";
    if (type.includes("Pyro")) return "#8a2be2";
    if (type.includes("Geo")) return "#ff6b6b";
    return colors[type] || "#00ffff";
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
          border: "2px solid rgba(0, 255, 255, 0.3)",
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
            background: "linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent)",
            animation: "shimmer 2s linear infinite",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 2, sm: 2.5, md: 3 } }}>
          <AutoAwesome sx={{ color: "#00ffff", mr: 1, fontSize: { xs: 20, sm: 24, md: 32 } }} />
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
            Body Type Overview
          </Typography>
        </Box>

        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "row", sm: "row", md: "row" },
          gap: { xs: 1, sm: 1.5, md: 2 },
          flexWrap: { xs: "wrap", sm: "nowrap", md: "nowrap" },
          alignItems: "stretch",
        }}>
          <Box sx={{ 
            flex: { xs: "1 1 auto", sm: "1 1 33.333%", md: "1 1 33.333%" }, 
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "rgba(255, 255, 255, 0.6)", 
                mb: 0.5,
                fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                lineHeight: { xs: "1.2", sm: "1.3", md: "1.4" },
                minHeight: { xs: "2rem", sm: "2.25rem", md: "2.5rem" },
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              Body Type Analysis
            </Typography>
            <Chip
              label={bodyType}
              sx={{
                background: getBodyTypeColor(bodyType),
                color: "#0a0e27",
                fontWeight: 700,
                fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                px: { xs: 1, sm: 1.25, md: 1.5 },
                py: { xs: 0.75, sm: 1, md: 1.25 },
                height: { xs: "28px", sm: "32px", md: "36px" },
                width: "100%",
                justifyContent: "center",
                "& .MuiChip-label": {
                  padding: 0,
                },
              }}
            />
          </Box>

          <Box sx={{ 
            flex: { xs: "1 1 auto", sm: "1 1 33.333%", md: "1 1 33.333%" }, 
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "rgba(255, 255, 255, 0.6)", 
                mb: 0.5,
                fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                lineHeight: { xs: "1.2", sm: "1.3", md: "1.4" },
                minHeight: { xs: "2rem", sm: "2.25rem", md: "2.5rem" },
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              Innate Constitution
            </Typography>
            <Chip
              label={prakriti}
              sx={{
                background: "rgba(138, 43, 226, 0.3)",
                color: "#8a2be2",
                border: "1px solid rgba(138, 43, 226, 0.5)",
                fontWeight: 600,
                fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                px: { xs: 1, sm: 1.25, md: 1.5 },
                py: { xs: 0.75, sm: 1, md: 1.25 },
                height: { xs: "28px", sm: "32px", md: "36px" },
                width: "100%",
                justifyContent: "center",
                "& .MuiChip-label": {
                  padding: 0,
                },
              }}
            />
          </Box>

          <Box sx={{ 
            flex: { xs: "1 1 auto", sm: "1 1 33.333%", md: "1 1 33.333%" }, 
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "rgba(255, 255, 255, 0.6)", 
                mb: 0.5,
                fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                lineHeight: { xs: "1.2", sm: "1.3", md: "1.4" },
                minHeight: { xs: "2rem", sm: "2.25rem", md: "2.5rem" },
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              Current Imbalance
            </Typography>
            <Chip
              label={vikriti}
              sx={{
                background: "rgba(255, 107, 107, 0.3)",
                color: "#ff6b6b",
                border: "1px solid rgba(255, 107, 107, 0.5)",
                fontWeight: 600,
                fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                px: { xs: 1, sm: 1.25, md: 1.5 },
                py: { xs: 0.75, sm: 1, md: 1.25 },
                height: { xs: "28px", sm: "32px", md: "36px" },
                width: "100%",
                justifyContent: "center",
                "& .MuiChip-label": {
                  padding: 0,
                },
              }}
            />
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
}

