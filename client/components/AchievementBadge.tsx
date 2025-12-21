import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

type Props = {
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
  onClick?: () => void;
  isActive?: boolean;
};

export default function AchievementBadge({ title, description, unlocked, icon, onClick, isActive = false }: Props) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={unlocked ? { scale: 0, rotate: -180 } : {}}
      animate={unlocked ? { scale: 1, rotate: 0 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <Box
        onClick={handleClick}
        sx={{
          p: { xs: 1, sm: 2 },
          background: isActive && unlocked 
            ? "rgba(0, 255, 255, 0.2)" 
            : unlocked 
            ? "rgba(0, 255, 255, 0.1)" 
            : "rgba(255, 255, 255, 0.05)",
          border: isActive && unlocked
            ? `2px solid #00ffff`
            : `1px solid ${unlocked ? "#00ffff" : "rgba(255, 255, 255, 0.2)"}`,
          borderRadius: { xs: 1, sm: 2 },
          textAlign: "center",
          filter: unlocked ? "none" : "grayscale(100%)",
          transition: "all 0.3s ease",
          cursor: onClick ? "pointer" : "default",
          position: "relative",
          opacity: isActive ? 1 : unlocked ? 0.7 : 0.5,
          boxShadow: isActive && unlocked
            ? "0 0 15px rgba(0, 255, 255, 0.4)"
            : "none",
          "&:hover": onClick
            ? {
                boxShadow: unlocked 
                  ? "0 0 20px rgba(0, 255, 255, 0.5)" 
                  : "0 0 15px rgba(255, 255, 255, 0.3)",
                transform: { xs: "scale(1.02)", sm: "scale(1.05)" },
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
        <Typography variant="h4" sx={{ mb: { xs: 0.5, sm: 1 }, fontSize: { xs: "1.5rem", sm: "2.125rem" } }}>
          {icon}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ 
            color: unlocked ? "#00ffff" : "rgba(255, 255, 255, 0.5)", 
            fontWeight: 600,
            fontSize: { xs: "0.7rem", sm: "0.875rem" },
            lineHeight: { xs: 1.2, sm: 1.4 },
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: "rgba(255, 255, 255, 0.7)",
            display: { xs: "none", sm: "block" },
            fontSize: { xs: "0.65rem", sm: "0.75rem" },
          }}
        >
          {description}
        </Typography>
      </Box>
    </motion.div>
  );
}
