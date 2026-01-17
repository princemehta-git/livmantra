import React from "react";
import { Box, Typography, Card } from "@mui/material";
import { motion } from "framer-motion";
import { CheckCircle, RadioButtonUnchecked, Lock } from "@mui/icons-material";

interface TestTimelineProps {
  hasBBATest: boolean;
  hasPersonalityTest: boolean;
  onBBAClick: () => void;
  onPersonalityClick: () => void;
}

export default function TestTimeline({
  hasBBATest,
  hasPersonalityTest,
  onBBAClick,
  onPersonalityClick,
}: TestTimelineProps) {
  return (
    <Card
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        background: "rgba(10, 14, 39, 0.8)",
        border: "1px solid rgba(0, 255, 255, 0.3)",
        borderRadius: 0,
        backdropFilter: "blur(10px)",
        mb: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#00ffff",
          fontWeight: 700,
          mb: { xs: 2, sm: 2.5, md: 3 },
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
        }}
      >
        Test Progress
      </Typography>

      <Box sx={{ position: "relative" }}>
        {/* Timeline Line */}
        <Box
          sx={{
            position: "absolute",
            left: { xs: 20, sm: 24, md: 28 },
            top: { xs: 28, sm: 32, md: 36 },
            bottom: { xs: 28, sm: 32, md: 36 },
            width: "2px",
            background: hasBBATest
              ? "linear-gradient(180deg, #00ffff 0%, rgba(0, 255, 255, 0.3) 100%)"
              : "rgba(138, 43, 226, 0.3)",
            zIndex: 0,
          }}
        />

        {/* Test 1: BBA Test */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              mb: { xs: 3, sm: 4, md: 5 },
              cursor: "pointer",
              position: "relative",
              zIndex: 1,
            }}
            onClick={onBBAClick}
          >
            <Box
              sx={{
                mr: { xs: 2, sm: 2.5, md: 3 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 40, sm: 48, md: 56 },
                height: { xs: 40, sm: 48, md: 56 },
                flexShrink: 0,
              }}
            >
              {hasBBATest ? (
                <CheckCircle
                  sx={{
                    color: "#00ffff",
                    fontSize: { xs: 40, sm: 48, md: 56 },
                    filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))",
                  }}
                />
              ) : (
                <RadioButtonUnchecked
                  sx={{
                    color: "rgba(255, 255, 255, 0.3)",
                    fontSize: { xs: 40, sm: 48, md: 56 },
                  }}
                />
              )}
            </Box>
            <Box sx={{ flex: 1, pt: { xs: 0.5, sm: 0.75, md: 1 } }}>
              <Typography
                variant="h6"
                sx={{
                  color: hasBBATest ? "#00ffff" : "rgba(255, 255, 255, 0.7)",
                  fontWeight: 700,
                  mb: { xs: 0.5, sm: 0.75, md: 1 },
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1.125rem" },
                }}
              >
                Step 1: Body Behavior Analysis (BBA)
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                  mb: { xs: 0.5, sm: 0.75, md: 1 },
                }}
              >
                Discover your body type and constitution through comprehensive analysis
              </Typography>
              {hasBBATest && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#00ffff",
                    fontWeight: 600,
                    fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                  }}
                >
                  ✓ Completed
                </Typography>
              )}
            </Box>
          </Box>
        </motion.div>

        {/* Test 2: Personality Test */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              cursor: hasBBATest ? "pointer" : "not-allowed",
              position: "relative",
              zIndex: 1,
              opacity: hasBBATest ? 1 : 0.6,
            }}
            onClick={hasBBATest ? onPersonalityClick : undefined}
          >
            <Box
              sx={{
                mr: { xs: 2, sm: 2.5, md: 3 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 40, sm: 48, md: 56 },
                height: { xs: 40, sm: 48, md: 56 },
                flexShrink: 0,
              }}
            >
              {!hasBBATest ? (
                <Lock
                  sx={{
                    color: "#8a2be2",
                    fontSize: { xs: 40, sm: 48, md: 56 },
                    filter: "drop-shadow(0 0 10px rgba(138, 43, 226, 0.5))",
                  }}
                />
              ) : hasPersonalityTest ? (
                <CheckCircle
                  sx={{
                    color: "#00ffff",
                    fontSize: { xs: 40, sm: 48, md: 56 },
                    filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))",
                  }}
                />
              ) : (
                <RadioButtonUnchecked
                  sx={{
                    color: "rgba(255, 255, 255, 0.3)",
                    fontSize: { xs: 40, sm: 48, md: 56 },
                  }}
                />
              )}
            </Box>
            <Box sx={{ flex: 1, pt: { xs: 0.5, sm: 0.75, md: 1 } }}>
              <Typography
                variant="h6"
                sx={{
                  color: hasBBATest
                    ? hasPersonalityTest
                      ? "#00ffff"
                      : "rgba(255, 255, 255, 0.7)"
                    : "#8a2be2",
                  fontWeight: 700,
                  mb: { xs: 0.5, sm: 0.75, md: 1 },
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1.125rem" },
                }}
              >
                Step 2: Personality Test
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                  mb: { xs: 0.5, sm: 0.75, md: 1 },
                }}
              >
                Explore your personality dimensions across 6 key areas
              </Typography>
              {!hasBBATest ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#8a2be2",
                    fontWeight: 600,
                    fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                  }}
                >
                  🔒 Complete Step 1 to unlock
                </Typography>
              ) : hasPersonalityTest ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#00ffff",
                    fontWeight: 600,
                    fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                  }}
                >
                  ✓ Completed
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontWeight: 600,
                    fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                  }}
                >
                  Ready to start
                </Typography>
              )}
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Card>
  );
}
