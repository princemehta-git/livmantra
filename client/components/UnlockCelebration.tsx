import React, { useEffect, useState } from "react";
import { Dialog, Box, Typography, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { EmojiEvents, LockOpen, Star } from "@mui/icons-material";

interface UnlockCelebrationProps {
  open: boolean;
  onClose: () => void;
  testName: string;
  onStartTest: () => void;
}

export default function UnlockCelebration({
  open,
  onClose,
  testName,
  onStartTest,
}: UnlockCelebrationProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(10, 14, 39, 0.95)",
          border: "2px solid #8a2be2",
          borderRadius: 0,
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 50px rgba(138, 43, 226, 0.8)",
        },
      }}
    >
      <Box sx={{ p: { xs: 3, sm: 4, md: 5 }, textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Animated Background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at center, rgba(138, 43, 226, 0.2) 0%, transparent 70%)",
            animation: "pulse 2s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 0.5 },
              "50%": { opacity: 1 },
            },
          }}
        />

        <AnimatePresence>
          {showContent && (
            <>
              {/* Lock Open Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <LockOpen
                  sx={{
                    fontSize: { xs: 64, sm: 80, md: 96 },
                    color: "#8a2be2",
                    filter: "drop-shadow(0 0 30px rgba(138, 43, 226, 0.8))",
                    mb: 2,
                  }}
                />
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: "#8a2be2",
                    fontWeight: 900,
                    mb: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  }}
                >
                  🎉 LEVEL UNLOCKED! 🎉
                </Typography>
              </motion.div>

              {/* Test Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#00ffff",
                    fontWeight: 700,
                    mb: 3,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                  }}
                >
                  {testName}
                </Typography>
              </motion.div>

              {/* Stars Animation */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                  >
                    <Star
                      sx={{
                        color: "#ffd700",
                        fontSize: { xs: 24, sm: 32, md: 40 },
                        filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))",
                      }}
                    />
                  </motion.div>
                ))}
              </Box>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    mb: 4,
                    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                  }}
                >
                  Congratulations! You've completed the first test.
                  <br />
                  Ready to discover your personality dimensions?
                </Typography>
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    onStartTest();
                    onClose();
                  }}
                  sx={{
                    background: "linear-gradient(135deg, #8a2be2 0%, #00ffff 100%)",
                    color: "#0a0e27",
                    fontWeight: 700,
                    px: { xs: 4, sm: 6, md: 8 },
                    py: { xs: 1, sm: 1.5, md: 2 },
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
                  Start {testName}
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Box>
    </Dialog>
  );
}
