import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

type Props = {
  encrypted?: boolean;
  children: React.ReactNode;
  unlockKey: string;
};

export default function EncryptedSection({ encrypted = false, children, unlockKey }: Props) {
  const [unlocked, setUnlocked] = useState(!encrypted);

  if (unlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Box
      onClick={() => setUnlocked(true)}
      sx={{
        p: 4,
        background: "rgba(0, 0, 0, 0.8)",
        border: "2px dashed #ff0000",
        borderRadius: 2,
        cursor: "pointer",
        position: "relative",
        fontFamily: "monospace",
        minHeight: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "#00ff00",
          boxShadow: "0 0 20px rgba(0, 255, 0, 0.5)",
          transform: "scale(1.02)",
        },
        "&::before": {
          content: '"> DECRYPTING..."',
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#00ff00",
          fontSize: "1.2rem",
          textShadow: "0 0 10px #00ff00",
          animation: "blink 1s infinite",
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "#ff0000",
          textAlign: "center",
          fontFamily: "monospace",
          userSelect: "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        [ENCRYPTED]
        <br />
        Click to decrypt section {unlockKey}
      </Typography>
    </Box>
  );
}


