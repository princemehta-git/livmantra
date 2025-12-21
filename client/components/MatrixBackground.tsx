import React from "react";
import { Box } from "@mui/material";

export default function MatrixBackground() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        opacity: 0.1,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 255, 0.03) 2px,
              rgba(0, 255, 255, 0.03) 4px
            )
          `,
        },
      }}
    />
  );
}

export function FilmGrainOverlay() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 100,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
        opacity: 0.15,
        animation: "filmGrain 0.5s steps(10) infinite",
        mixBlendMode: "overlay",
      }}
    />
  );
}


