import React from "react";
import { Box } from "@mui/material";

interface DashboardVideoBackgroundProps {
  videoSrc?: string;
}

export default function DashboardVideoBackground({ 
  videoSrc = "/video/Human Body Structure LV.mp4" 
}: DashboardVideoBackgroundProps) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, rgba(10, 14, 39, 0.7), rgba(10, 14, 39, 0.9))",
          zIndex: 1,
        },
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.4,
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </Box>
  );
}

