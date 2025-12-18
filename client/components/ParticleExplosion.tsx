import React from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

type Props = {
  trigger: boolean;
};

export default function ParticleExplosion({ trigger }: Props) {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: i % 3 === 0 ? "#00ffff" : i % 3 === 1 ? "#8a2be2" : "#ec4899",
  }));

  if (!trigger) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: `${(Math.random() - 0.5) * 400}px`,
            y: `${(Math.random() - 0.5) * 400}px`,
          }}
          transition={{
            duration: 1.5,
            delay: particle.delay,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: 8,
            height: 8,
            background: particle.color,
            borderRadius: "50%",
            boxShadow: `0 0 10px ${particle.color}`,
          }}
        />
      ))}
    </Box>
  );
}
