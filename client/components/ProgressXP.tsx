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
    <Box 
      sx={{ 
        mb: 4,
        p: 3,
        borderRadius: 3,
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
        border: "1px solid rgba(99, 102, 241, 0.2)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
          Progress: {current}/{total}
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Chip 
            label={`Level ${level}`} 
            size="small" 
            sx={{
              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              color: "white",
              fontWeight: 700,
              boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.3)",
            }}
          />
          <Typography variant="body1" sx={{ fontWeight: 600, color: "#6366f1" }}>
            XP: {xp}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ position: "relative", height: 12, borderRadius: 6, overflow: "hidden", bgcolor: "#e2e8f0" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
            borderRadius: 6,
            boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.4)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
            animation: "shimmer 2s infinite",
          }}
        />
      </Box>
      <Typography variant="caption" sx={{ mt: 1, display: "block", textAlign: "right", color: "#64748b", fontWeight: 600 }}>
        {percent}% Complete
      </Typography>
    </Box>
  );
}


