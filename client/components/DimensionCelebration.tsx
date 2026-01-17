import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { EmojiEvents, AutoAwesome, Star } from "@mui/icons-material";
import { DIMENSIONS } from "../data/personalityQuestions";

interface DimensionCelebrationProps {
  open: boolean;
  onClose: () => void;
  dimensionIndex: number;
  isLastDimension?: boolean;
  onSubmit?: () => void;
  allQuestionsAnswered?: boolean;
}

// Sparkle particle component
const Sparkle: React.FC<{ delay: number; x: number; y: number }> = ({ delay, x, y }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
        x: [0, (Math.random() - 0.5) * 200],
        y: [0, (Math.random() - 0.5) * 200],
      }}
      transition={{
        duration: 1.5,
        delay,
        ease: "easeOut",
      }}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: "8px",
        height: "8px",
        background: "radial-gradient(circle, #00ffff, #8a2be2)",
        borderRadius: "50%",
        boxShadow: "0 0 10px rgba(0, 255, 255, 0.8)",
      }}
    />
  );
};

// Confetti particle
const Confetti: React.FC<{ delay: number; x: number; color: string }> = ({ delay, x, color }) => {
  const height = typeof window !== "undefined" ? window.innerHeight : 800;
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, height + 100],
        rotate: [0, 360],
        x: [0, (Math.random() - 0.5) * 100],
      }}
      transition={{
        duration: 2,
        delay,
        ease: "easeIn",
      }}
      style={{
        position: "fixed",
        left: `${x}%`,
        top: "-10px",
        width: "12px",
        height: "12px",
        background: color,
        borderRadius: "2px",
      }}
    />
  );
};

// Sound effect player
const playCelebrationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    console.log("Audio not available");
  }
};

export default function DimensionCelebration({
  open,
  onClose,
  dimensionIndex,
  isLastDimension = false,
  onSubmit,
  allQuestionsAnswered = false,
}: DimensionCelebrationProps) {
  const [sparkles, setSparkles] = useState<Array<{ delay: number; x: number; y: number }>>([]);
  const [confetti, setConfetti] = useState<Array<{ delay: number; x: number; color: string }>>([]);

  const dimension = DIMENSIONS[dimensionIndex];
  const dimensionColor = dimension?.color || "#00ffff";

  useEffect(() => {
    if (open) {
      playCelebrationSound();

      const newSparkles = Array.from({ length: 30 }, (_, i) => ({
        delay: Math.random() * 0.5,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setSparkles(newSparkles);

      const colors = ["#00ffff", "#8a2be2", "#ff6b6b", "#51cf66", "#ffd700", "#ff69b4"];
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        delay: Math.random() * 0.8,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setConfetti(newConfetti);

      if (!isLastDimension) {
        const timer = setTimeout(() => {
          onClose();
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [open, onClose, isLastDimension]);

  if (!dimension) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: "95%", sm: "90%" },
          maxWidth: 600,
          background: "linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(20, 25, 50, 0.95) 100%)",
          border: `2px solid ${dimensionColor}80`,
          borderRadius: { xs: 2, sm: 4 },
          boxShadow: `0 0 50px ${dimensionColor}50, inset 0 0 30px ${dimensionColor}20`,
          p: { xs: 2, sm: 4 },
          textAlign: "center",
          overflow: "hidden",
          zIndex: 1300,
          maxHeight: "90vh",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Confetti */}
        <AnimatePresence>
          {confetti.map((c, i) => (
            <Confetti key={i} delay={c.delay} x={c.x} color={c.color} />
          ))}
        </AnimatePresence>

        {/* Sparkles */}
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
          <AnimatePresence>
            {sparkles.map((s, i) => (
              <Sparkle key={i} delay={s.delay} x={s.x} y={s.y} />
            ))}
          </AnimatePresence>
        </Box>

        {/* Content */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Trophy Icon */}
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
          >
            <EmojiEvents
              sx={{
                fontSize: { xs: 50, sm: 80 },
                color: "#ffd700",
                filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))",
                mb: { xs: 0.5, sm: 1 },
              }}
            />
          </motion.div>

          {/* Dimension Complete Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.25rem" },
                mb: { xs: 0.5, sm: 1 },
                background: `linear-gradient(135deg, ${dimensionColor} 0%, #8a2be2 50%, #ffd700 100%)`,
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradient 2s ease infinite",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                lineHeight: 1.2,
              }}
            >
              Dimension Complete!
            </Typography>
          </motion.div>

          {/* Dimension Name */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Typography
              variant="h5"
              sx={{
                color: dimensionColor,
                mb: { xs: 1, sm: 2 },
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.3rem" },
                lineHeight: 1.2,
              }}
            >
              {dimension.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                mb: { xs: 1, sm: 1.5 },
                fontSize: { xs: "0.75rem", sm: "0.9rem" },
              }}
            >
              {dimension.leftPole} ↔ {dimension.rightPole}
            </Typography>
          </motion.div>

          {/* Stars Animation */}
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            sx={{ display: "flex", justifyContent: "center", gap: "6px", mb: { xs: 1.5, sm: 2 } }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 + i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <Star
                  sx={{
                    fontSize: { xs: 20, sm: 28 },
                    color: "#ffd700",
                    filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))",
                  }}
                />
              </motion.div>
            ))}
          </Box>

          {/* Continue/Submit Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={isLastDimension && onSubmit ? onSubmit : onClose}
              variant="contained"
              size="large"
              disabled={isLastDimension && !allQuestionsAnswered}
              sx={{
                mt: { xs: 1, sm: 2 },
                px: { xs: 3, sm: 5 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: "0.75rem", sm: "0.9rem" },
                fontWeight: 700,
                background: `linear-gradient(135deg, ${dimensionColor} 0%, #8a2be2 100%)`,
                color: "#0a0e27",
                borderRadius: 2,
                border: `2px solid ${dimensionColor}`,
                boxShadow: `0 0 30px ${dimensionColor}50`,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  background: `linear-gradient(135deg, ${dimensionColor} 0%, #8a2be2 100%)`,
                  boxShadow: `0 0 50px ${dimensionColor}80`,
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  opacity: 0.6,
                },
                transition: "all 0.3s ease",
              }}
            >
              {isLastDimension ? "Submit" : "Continue Mission"}
            </Button>
          </motion.div>
        </motion.div>
      </Box>
    </Modal>
  );
}
