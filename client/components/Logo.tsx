import React, { useState } from "react";
import Image from "next/image";
import { Box, BoxProps, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface LogoProps extends Omit<BoxProps, "component"> {
  width?: number;
  height?: number;
  showText?: boolean;
  onClick?: () => void;
  animated?: boolean;
}

export default function Logo({
  width = 200,
  height = 80,
  showText = true,
  onClick,
  animated = true,
  sx,
  ...props
}: LogoProps) {
  const sources = ["/logo16_9.svg", "/logo.png"];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const logoContent = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: onClick ? "pointer" : "default",
        ...sx,
      }}
      onClick={onClick}
      {...props}
    >
      {!imageError ? (
        <Box
          sx={{
            position: "relative",
            width: width,
            height: height,
            flexShrink: 0,
          }}
        >
          <Image
            src={sources[sourceIndex]}
            alt="LivMantra Logo"
            fill
            style={{
              objectFit: "contain",
            }}
            priority
            onError={() => {
              if (sourceIndex < sources.length - 1) {
                setSourceIndex(sourceIndex + 1);
              } else {
                setImageError(true);
              }
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: width,
            height: height,
          }}
        >
          <Box
            sx={{
              width: height * 0.8,
              height: height * 0.8,
              background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#0a0e27",
                fontWeight: 800,
                fontSize: `${height * 0.3}px`,
              }}
            >
              LM
            </Typography>
          </Box>
          {showText && (
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
                fontWeight: 800,
                fontSize: `${height * 0.4}px`,
                letterSpacing: "0.05em",
              }}
            >
              LivMantra
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );

  if (animated && onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {logoContent}
      </motion.div>
    );
  }

  return logoContent;
}

