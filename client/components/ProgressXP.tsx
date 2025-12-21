import React from "react";
import { LinearProgress, Typography, Box, Chip } from "@mui/material";
import { motion } from "framer-motion";

export default function ProgressXP({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const percent = Math.round((current / total) * 100);
  const xp = current * 10;
  const level = Math.floor(xp / 100) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box 
        sx={{ 
          mb: 2,
          p: { xs: 1.5, sm: 2.5 },
          borderRadius: 0,
          background: "rgba(10, 14, 39, 0.6)",
          border: "1px solid rgba(0, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 30px rgba(0, 255, 255, 0.1), inset 0 0 20px rgba(138, 43, 226, 0.05)",
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
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", mb: 2, alignItems: { xs: "flex-start", sm: "center" }, flexWrap: "wrap", gap: { xs: 1, sm: 2 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 900, 
              color: "#00ffff",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: { xs: "0.9rem", md: "1.1rem" },
            }}
          >
            Mission Progress: {current}/{total}
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 10px rgba(0, 255, 255, 0.4)",
                  "0 0 20px rgba(0, 255, 255, 0.6)",
                  "0 0 10px rgba(0, 255, 255, 0.4)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Chip 
                label={`Level ${level}`} 
                size="small" 
                sx={{
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  color: "#0a0e27",
                  fontWeight: 900,
                  fontSize: { xs: "0.7rem", sm: "0.85rem" },
                  borderRadius: 0,
                  border: "1px solid rgba(0, 255, 255, 0.5)",
                  boxShadow: "0 0 20px rgba(0, 255, 255, 0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              />
            </motion.div>
          </Box>
        </Box>
        <Box sx={{ position: "relative", height: 16, borderRadius: 0, overflow: "hidden", bgcolor: "rgba(0, 255, 255, 0.1)", border: "1px solid rgba(0, 255, 255, 0.2)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #00ffff 0%, #8a2be2 50%, #00ffff 100%)",
              backgroundSize: "200% 100%",
              boxShadow: "0 0 20px rgba(0, 255, 255, 0.6), inset 0 0 10px rgba(138, 43, 226, 0.3)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              animation: "shimmer 2s infinite",
            }}
          />
        </Box>
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 1.5, 
            display: "block", 
            textAlign: "right", 
            color: "rgba(255, 255, 255, 0.6)", 
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: "0.75rem",
          }}
        >
          {percent}% Complete
        </Typography>
      </Box>
    </motion.div>
  );
}


