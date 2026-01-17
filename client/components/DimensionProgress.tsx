import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { motion } from "framer-motion";
import { DIMENSIONS } from "../data/personalityQuestions";

type Props = {
  currentDimension: number;
  dimensionProgress: Map<number, number>; // dimension -> answered count (0-8)
};

export default function DimensionProgress({
  currentDimension,
  dimensionProgress,
}: Props) {
  return (
    <Box
      sx={{
        mb: 3,
        p: { xs: 1.5, sm: 2.5 },
        borderRadius: 0,
        background: "rgba(10, 14, 39, 0.6)",
        border: "1px solid rgba(0, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 0 30px rgba(0, 255, 255, 0.1), inset 0 0 20px rgba(138, 43, 226, 0.05)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 900,
          color: "#00ffff",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontSize: { xs: "0.9rem", md: "1.1rem" },
          mb: 2,
        }}
      >
        Dimensions Progress
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {DIMENSIONS.map((dimension, idx) => {
          const answered = dimensionProgress.get(idx) || 0;
          const progress = (answered / 8) * 100;
          const isComplete = answered === 8;
          const isCurrent = currentDimension === idx;

          return (
            <motion.div
              key={dimension.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Box
                sx={{
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: 0,
                  border: isCurrent
                    ? `2px solid ${dimension.color}`
                    : isComplete
                    ? `1px solid ${dimension.color}80`
                    : "1px solid rgba(0, 255, 255, 0.2)",
                  bgcolor: isCurrent
                    ? `${dimension.color}15`
                    : isComplete
                    ? `${dimension.color}08`
                    : "transparent",
                  boxShadow: isCurrent
                    ? `0 0 20px ${dimension.color}40`
                    : isComplete
                    ? `0 0 10px ${dimension.color}20`
                    : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isCurrent ? dimension.color : "rgba(255, 255, 255, 0.8)",
                        fontWeight: isCurrent ? 700 : 600,
                        fontSize: { xs: "0.7rem", sm: "0.85rem" },
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {dimension.name}
                    </Typography>
                    {isCurrent && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: dimension.color,
                            boxShadow: `0 0 10px ${dimension.color}`,
                          }}
                        />
                      </motion.div>
                    )}
                    {isComplete && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: dimension.color,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isCurrent ? dimension.color : "rgba(255, 255, 255, 0.6)",
                      fontWeight: 600,
                      fontSize: { xs: "0.65rem", sm: "0.75rem" },
                    }}
                  >
                    {answered}/8
                  </Typography>
                </Box>
                <Box sx={{ position: "relative", height: 8, borderRadius: 0, overflow: "hidden" }}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: "rgba(0, 255, 255, 0.1)",
                    }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: isComplete
                        ? `linear-gradient(90deg, ${dimension.color}, ${dimension.color}80)`
                        : `linear-gradient(90deg, ${dimension.color}, ${dimension.color}60)`,
                      boxShadow: isComplete
                        ? `0 0 10px ${dimension.color}40`
                        : `0 0 5px ${dimension.color}20`,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: "0.65rem",
                    }}
                  >
                    {dimension.leftPole}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: "0.65rem",
                    }}
                  >
                    {dimension.rightPole}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
}
