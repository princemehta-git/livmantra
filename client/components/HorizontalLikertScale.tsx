import React, { useState } from "react";
import { Box, Tooltip, Typography, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { LIKERT_SCALE_OPTIONS } from "../data/personalityQuestions";
import { playSoundEffect } from "../lib/audioUtils";

type Props = {
  selected?: number;
  onSelect: (value: number) => void;
};

export default function HorizontalLikertScale({ selected, onSelect }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Calculate size for each dot (larger at ends, smaller in middle)
  const getDotSize = (index: number) => {
    const middleIndex = 3; // 0-indexed middle (4th dot)
    const distanceFromMiddle = Math.abs(index - middleIndex);
    // Responsive base sizes
    const baseSize = isMobile ? 14 : 16;
    const sizeIncrement = isMobile ? 3 : 4;
    return baseSize + distanceFromMiddle * sizeIncrement;
  };

  // Calculate color for each dot (purple to green gradient)
  const getDotColor = (index: number) => {
    // 0 = Strongly Disagree (purple), 6 = Strongly Agree (green/cyan)
    // Create smooth gradient: purple -> grey -> green
    if (index === 0 || index === 1) {
      // Strongly Disagree, Disagree - Purple
      return "#8a2be2";
    } else if (index === 2) {
      // Slightly Disagree - Light purple
      return "#a855f7";
    } else if (index === 3) {
      // Neutral - Grey
      return "#888888";
    } else if (index === 4) {
      // Slightly Agree - Light green/cyan
      return "#22d3ee";
    } else {
      // Agree, Strongly Agree - Green/Cyan
      return "#00ffff";
    }
  };

  // Get label for specific dots
  const getLabel = (index: number) => {
    if (index === 3) return "Neutral";
    // On mobile, show labels below first and last dots
    if (isMobile) {
      if (index === 0) return "Strongly Disagree";
      if (index === 6) return "Strongly Agree";
    }
    return null;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 1.5, sm: 2 },
        py: { xs: 2, sm: 3 },
        px: { xs: 0.5, sm: 1, md: 2 }, // Reduced padding on mobile
        width: "100%",
        overflow: "hidden", // Prevent horizontal overflow
      }}
    >
      {/* Main scale container - dots in one row with labels aligned */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start", // Align from top
          justifyContent: "center",
          width: "100%",
          maxWidth: { xs: "100%", sm: "650px", md: "750px" },
          position: "relative",
          gap: { xs: 0, sm: 0.75, md: 1.5 }, // No gap on mobile since labels are below
          px: { xs: 0, sm: 0 }, // No horizontal padding needed
        }}
      >
        {/* Left label: Strongly Disagree - only show on desktop, aligned with dots center */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" }, // Hide on mobile
            alignItems: "center",
            height: { sm: "32px" }, // Match the dot container height to align with dot centers
            justifyContent: "flex-end",
            flexShrink: 0, // Prevent shrinking
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#8a2be2",
              fontWeight: 700,
              fontSize: { sm: "0.75rem", md: "0.85rem" },
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              textAlign: "right",
              lineHeight: 1,
            }}
          >
            Strongly Disagree
          </Typography>
        </Box>

        {/* Dots container - align all dots on same horizontal line */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start", // Align from top so all dots start at same position
            justifyContent: "space-between",
            flex: 1,
            position: "relative",
            gap: { xs: 0.25, sm: 0.5, md: 1 }, // Reduced gap on mobile
            minWidth: 0, // Allow shrinking
          }}
        >
          {LIKERT_SCALE_OPTIONS.map((option, index) => {
            const isSelected = selected === option.value;
            const isHovered = hoveredIndex === index;
            const dotSize = getDotSize(index);
            const dotColor = getDotColor(index);
            const label = getLabel(index);

            return (
              <Tooltip
                key={option.value}
                title={option.label}
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "rgba(10, 14, 39, 0.95)",
                      color: "#00ffff",
                      border: "1px solid rgba(0, 255, 255, 0.3)",
                      borderRadius: 0,
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      fontWeight: 600,
                      padding: { xs: "6px 10px", sm: "8px 12px" },
                      boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    },
                  },
                  arrow: {
                    sx: {
                      color: "rgba(10, 14, 39, 0.95)",
                      "&::before": {
                        border: "1px solid rgba(0, 255, 255, 0.3)",
                      },
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    cursor: "pointer",
                    position: "relative",
                    flex: 1,
                    maxWidth: { xs: "32px", sm: "40px", md: "50px" }, // Smaller on mobile
                    padding: { xs: "0 2px", sm: "0" }, // Reduced padding on mobile
                    paddingBottom: label ? { xs: "0", sm: "0" } : { xs: "8px", sm: "4px" }, // Only add bottom padding if no label
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    playSoundEffect();
                    onSelect(option.value);
                  }}
                >
                  {/* Dot - all dots align on same horizontal line */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: { xs: "28px", sm: "32px" }, // Fixed height ensures all dots align
                      width: "100%",
                      flexShrink: 0, // Prevent shrinking
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      style={{
                        width: `${dotSize}px`,
                        height: `${dotSize}px`,
                        borderRadius: "50%",
                        border: isSelected
                          ? `3px solid ${dotColor}`
                          : `2px solid ${dotColor}`,
                        backgroundColor: isSelected ? dotColor : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        position: "relative",
                        flexShrink: 0,
                        boxShadow: isSelected
                          ? `0 0 ${dotSize}px ${dotColor}, inset 0 0 ${dotSize / 2}px rgba(0, 0, 0, 0.2)`
                          : isHovered
                          ? `0 0 ${dotSize / 2}px ${dotColor}`
                          : "none",
                        transition: "all 0.3s ease",
                      }}
                    >
                    {/* Checkmark for selected state */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        style={{
                          color: "#0a0e27",
                          fontSize: `${dotSize * 0.5}px`,
                          fontWeight: 900,
                          lineHeight: 1,
                        }}
                      >
                        ✓
                      </motion.div>
                    )}
                    </motion.div>
                  </Box>

                  {/* Label below the dot */}
                  {label && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: isSelected ? dotColor : index === 0 || index === 6 
                          ? (index === 0 ? "#8a2be2" : "#00ffff") 
                          : "rgba(255, 255, 255, 0.6)",
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: { xs: "0.55rem", sm: "0.7rem" }, // Smaller on mobile for end labels
                        textAlign: "center",
                        textTransform: "uppercase",
                        letterSpacing: { xs: "0.02em", sm: "0.05em" },
                        whiteSpace: "nowrap",
                        transition: "all 0.3s ease",
                        textShadow: isSelected
                          ? `0 0 8px ${dotColor}`
                          : "none",
                        marginTop: { xs: "12px", sm: "16px" }, // Increased spacing to push text down
                      }}
                    >
                      {label}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* Right label: Strongly Agree - only show on desktop, aligned with dots center */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" }, // Hide on mobile
            alignItems: "center",
            height: { sm: "32px" }, // Match the dot container height to align with dot centers
            justifyContent: "flex-start",
            flexShrink: 0, // Prevent shrinking
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#00ffff",
              fontWeight: 700,
              fontSize: { sm: "0.75rem", md: "0.85rem" },
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              textAlign: "left",
              lineHeight: 1,
            }}
          >
            Strongly Agree
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
