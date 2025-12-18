import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

type Props = {
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
  onClick?: () => void;
};

export default function AchievementBadge({ title, description, unlocked, icon, onClick }: Props) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={unlocked ? { scale: 0, rotate: -180 } : { opacity: 0.3 }}
      animate={unlocked ? { scale: 1, rotate: 0 } : { opacity: 0.3 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <Box
        onClick={handleClick}
        sx={{
          p: 2,
          background: unlocked ? "rgba(0, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
          border: `1px solid ${unlocked ? "#00ffff" : "rgba(255, 255, 255, 0.2)"}`,
          borderRadius: 2,
          textAlign: "center",
          filter: unlocked ? "none" : "grayscale(100%)",
          transition: "all 0.3s ease",
          cursor: onClick ? "pointer" : "default",
          position: "relative",
          "&:hover": onClick
            ? {
                boxShadow: unlocked 
                  ? "0 0 20px rgba(0, 255, 255, 0.5)" 
                  : "0 0 15px rgba(255, 255, 255, 0.3)",
                transform: "scale(1.05)",
                borderColor: unlocked ? "#00ffff" : "rgba(255, 255, 255, 0.4)",
                filter: unlocked ? "none" : "grayscale(70%)",
              }
            : {},
          "&:active": onClick
            ? {
                transform: "scale(0.98)",
              }
            : {},
        }}
      >
        <Typography variant="h4" sx={{ mb: 1 }}>
          {icon}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ color: unlocked ? "#00ffff" : "rgba(255, 255, 255, 0.5)", fontWeight: 600 }}
        >
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
          {description}
        </Typography>
      </Box>
    </motion.div>
  );
}
