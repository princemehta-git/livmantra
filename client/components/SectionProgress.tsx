import React from "react";
import { Box, Typography } from "@mui/material";

type Props = {
  currentSection: number;
  totalSections: number;
};

export default function SectionProgress({ currentSection, totalSections }: Props) {
  const progress = ((currentSection + 1) / totalSections) * 100;

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="caption" sx={{ color: "#00ffff", fontFamily: "monospace", fontWeight: 600 }}>
          PROGRESS: {currentSection + 1}/{totalSections}
        </Typography>
        <Typography variant="caption" sx={{ color: "#00ffff", fontFamily: "monospace", fontWeight: 600 }}>
          {Math.round(progress)}%
        </Typography>
      </Box>
      <Box
        sx={{
          height: 6,
          background: "rgba(0, 255, 255, 0.1)",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(0, 255, 255, 0.2)",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #00ffff, #8a2be2)",
            boxShadow: "0 0 20px #00ffff",
            transition: "width 0.5s ease",
          },
        }}
      />
    </Box>
  );
}
