import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { EmojiEvents, AutoAwesome, Star } from "@mui/icons-material";
import { BodyTypeResult, PrakritiResult } from "../lib/bodyTypeCalculator";

interface SectionCelebrationProps {
  open: boolean;
  onClose: () => void;
  level: number;
  sectionName: string;
  bodyTypeHint?: BodyTypeResult | null;
  prakritiHint?: PrakritiResult | null;
  isLastSection?: boolean;
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
    // Create audio context for sound generation
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a pleasant success sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    // Fallback if audio context is not available
    console.log("Audio not available");
  }
};

const getBodyTypeColor = (bodyType: string): string => {
  switch (bodyType) {
    case "Ectomorph":
      return "#6366f1";
    case "Mesomorph":
      return "#ec4899";
    case "Endomorph":
      return "#10b981";
    default:
      return "#00ffff";
  }
};

const getDoshaColor = (dosha: string): string => {
  switch (dosha) {
    case "Vata":
      return "#00ffff";
    case "Pitta":
      return "#ff6b6b";
    case "Kapha":
      return "#51cf66";
    default:
      return "#00ffff";
  }
};

export default function SectionCelebration({
  open,
  onClose,
  level,
  sectionName,
  bodyTypeHint,
  prakritiHint,
  isLastSection = false,
  onSubmit,
  allQuestionsAnswered = false,
}: SectionCelebrationProps) {
  const [sparkles, setSparkles] = useState<Array<{ delay: number; x: number; y: number }>>([]);
  const [confetti, setConfetti] = useState<Array<{ delay: number; x: number; color: string }>>([]);

  useEffect(() => {
    if (open) {
      // Play sound
      playCelebrationSound();

      // Generate sparkles
      const newSparkles = Array.from({ length: 30 }, (_, i) => ({
        delay: Math.random() * 0.5,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setSparkles(newSparkles);

      // Generate confetti
      const colors = ["#00ffff", "#8a2be2", "#ff6b6b", "#51cf66", "#ffd700", "#ff69b4"];
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        delay: Math.random() * 0.8,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setConfetti(newConfetti);

      // Auto-close after 5 seconds only if not last section
      if (!isLastSection) {
        const timer = setTimeout(() => {
          onClose();
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [open, onClose]);

  const hintText = bodyTypeHint
    ? `Your body type appears to be ${bodyTypeHint.primary}${bodyTypeHint.modifier ? ` with ${bodyTypeHint.modifier} influence` : ""}`
    : prakritiHint
    ? `Your constitution appears to be ${prakritiHint.primary}${prakritiHint.modifier ? ` with ${prakritiHint.modifier} influence` : ""}`
    : null;

  const hintColor = bodyTypeHint
    ? getBodyTypeColor(bodyTypeHint.primary)
    : prakritiHint
    ? getDoshaColor(prakritiHint.primary)
    : "#00ffff";

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
          width: "90%",
          maxWidth: 600,
          background: "linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(20, 25, 50, 0.95) 100%)",
          border: "2px solid rgba(0, 255, 255, 0.5)",
          borderRadius: 4,
          boxShadow: "0 0 50px rgba(0, 255, 255, 0.5), inset 0 0 30px rgba(138, 43, 226, 0.2)",
          p: 6,
          textAlign: "center",
          overflow: "hidden",
          zIndex: 1300,
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
                fontSize: 120,
                color: "#ffd700",
                filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))",
                mb: 2,
              }}
            />
          </motion.div>

          {/* Level Complete Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2rem", md: "3rem" },
                mb: 1,
                background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 50%, #ffd700 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradient 2s ease infinite",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Level {level} Complete!
            </Typography>
          </motion.div>

          {/* Section Name */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                mb: 4,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {sectionName}
            </Typography>
          </motion.div>

          {/* Stars Animation */}
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            sx={{ display: "flex", justifyContent: "center", gap: "8px", mb: 3 }}
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
                    fontSize: 40,
                    color: "#ffd700",
                    filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))",
                  }}
                />
              </motion.div>
            ))}
          </Box>

          {/* Body Type Hint */}
          {hintText && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${hintColor}15, ${hintColor}05)`,
                  border: `2px solid ${hintColor}40`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <AutoAwesome
                  sx={{
                    fontSize: 32,
                    color: hintColor,
                    mb: 1,
                    filter: `drop-shadow(0 0 10px ${hintColor}80)`,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: hintColor,
                    fontWeight: 700,
                    mb: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Hint Unlocked!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 500,
                  }}
                >
                  {hintText}
                </Typography>
              </Box>
            </motion.div>
          )}

          {/* Continue/Submit Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={isLastSection && onSubmit ? onSubmit : onClose}
              variant="contained"
              size="large"
              disabled={isLastSection && !allQuestionsAnswered}
              sx={{
                mt: 4,
                px: 6,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                color: "#0a0e27",
                borderRadius: 2,
                border: "2px solid #00ffff",
                boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                "&:hover": {
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  boxShadow: "0 0 50px rgba(0, 255, 255, 0.8)",
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  opacity: 0.6,
                },
                transition: "all 0.3s ease",
              }}
            >
              {isLastSection ? "Submit" : "Continue Mission"}
            </Button>
          </motion.div>
        </motion.div>
      </Box>
    </Modal>
  );
}

