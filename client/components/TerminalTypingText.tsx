import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

type Props = {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
};

export default function TerminalTypingText({ text, speed = 50, onComplete, className }: Props) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 500);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <Box component="span" sx={{ fontFamily: "monospace" }} className={className}>
      {displayedText}
      {showCursor && (
        <Box
          component="span"
          sx={{
            display: "inline-block",
            width: "8px",
            height: "1em",
            background: "#00ff00",
            marginLeft: "2px",
            animation: "blink 1s infinite",
          }}
        />
      )}
    </Box>
  );
}




