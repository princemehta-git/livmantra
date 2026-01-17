import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { CheckCircle, RadioButtonUnchecked, Lock } from "@mui/icons-material";

interface TestRoadmapProps {
  hasBBATest: boolean;
  hasPersonalityTest: boolean;
  onBBAClick: () => void;
  onPersonalityClick: () => void;
}

export default function TestRoadmap({
  hasBBATest,
  hasPersonalityTest,
  onBBAClick,
  onPersonalityClick,
}: TestRoadmapProps) {
  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 2 },
        mb: { xs: 2, sm: 3, md: 4 },
        overflow: "hidden",
      }}
    >
      {/* Horizontal Road Line */}
      <Box
        sx={{
          position: "absolute",
          left: { xs: "22.5%", sm: "20%", md: "25%" },
          right: { xs: "22.5%", sm: "20%", md: "25%" },
          top: { xs: 28, sm: 32, md: 36 },
          height: "3px",
          background: hasBBATest
            ? "linear-gradient(90deg, #00ffff 0%, rgba(0, 255, 255, 0.5) 50%, rgba(138, 43, 226, 0.3) 100%)"
            : "linear-gradient(90deg, rgba(0, 255, 255, 0.3) 0%, rgba(138, 43, 226, 0.3) 100%)",
          borderRadius: "2px",
          zIndex: 0,
          boxShadow: hasBBATest ? "0 0 20px rgba(0, 255, 255, 0.5)" : "none",
          transition: "all 0.5s ease",
        }}
      />

      {/* Road Dots */}
      <Box
        sx={{
          position: "absolute",
          left: { xs: "22.5%", sm: "20%", md: "25%" },
          right: { xs: "22.5%", sm: "20%", md: "25%" },
          top: { xs: 26, sm: 30, md: 34 },
          height: "7px",
          display: "flex",
          justifyContent: "space-between",
          zIndex: 1,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: hasBBATest && i < 3 ? "#00ffff" : "rgba(255, 255, 255, 0.2)",
              boxShadow: hasBBATest && i < 3 ? "0 0 8px rgba(0, 255, 255, 0.8)" : "none",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          position: "relative",
          zIndex: 2,
          gap: { xs: 1, sm: 2, md: 4 },
        }}
      >
        {/* Test 1: BBA */}
        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: "45%", sm: "40%", md: "35%" },
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: "100%" }}
          >
          <Box
            sx={{
              textAlign: "center",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={onBBAClick}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                sx={{
                  width: { xs: 56, sm: 64, md: 72 },
                  height: { xs: 56, sm: 64, md: 72 },
                  borderRadius: "50%",
                  background: hasBBATest
                    ? "linear-gradient(135deg, #00ffff 0%, rgba(0, 255, 255, 0.8) 100%)"
                    : "rgba(255, 255, 255, 0.1)",
                  border: hasBBATest
                    ? "3px solid #00ffff"
                    : "3px solid rgba(255, 255, 255, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: { xs: 1, sm: 1.5 },
                  boxShadow: hasBBATest
                    ? "0 0 30px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.3)"
                    : "0 0 10px rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                {hasBBATest ? (
                  <CheckCircle
                    sx={{
                      color: "#0a0e27",
                      fontSize: { xs: 40, sm: 48, md: 56 },
                      fontWeight: 900,
                    }}
                  />
                ) : (
                  <RadioButtonUnchecked
                    sx={{
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: { xs: 40, sm: 48, md: 56 },
                    }}
                  />
                )}
              </Box>
            </motion.div>
            <Typography
              variant="h6"
              sx={{
                color: hasBBATest ? "#00ffff" : "rgba(255, 255, 255, 0.7)",
                fontWeight: 700,
                mb: { xs: 0.5, sm: 0.75 },
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
              }}
            >
              Level 1
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
                mb: { xs: 0.5, sm: 0.75 },
              }}
            >
              BBA Test
            </Typography>
            {hasBBATest && (
              <Typography
                variant="body2"
                sx={{
                  color: "#00ffff",
                  fontWeight: 600,
                  fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                }}
              >
                ✓ COMPLETE
              </Typography>
            )}
          </Box>
          </motion.div>
        </Box>

        {/* Test 2: Personality */}
        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: "45%", sm: "40%", md: "35%" },
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ width: "100%" }}
          >
          <Box
            sx={{
              textAlign: "center",
              cursor: hasBBATest ? "pointer" : "not-allowed",
              position: "relative",
              opacity: hasBBATest ? 1 : 0.6,
            }}
            onClick={hasBBATest ? onPersonalityClick : undefined}
          >
            <motion.div
              whileHover={hasBBATest ? { scale: 1.1 } : {}}
              whileTap={hasBBATest ? { scale: 0.95 } : {}}
            >
              <Box
                sx={{
                  width: { xs: 56, sm: 64, md: 72 },
                  height: { xs: 56, sm: 64, md: 72 },
                  borderRadius: "50%",
                  background: !hasBBATest
                    ? "rgba(138, 43, 226, 0.2)"
                    : hasPersonalityTest
                    ? "linear-gradient(135deg, #8a2be2 0%, rgba(138, 43, 226, 0.8) 100%)"
                    : "linear-gradient(135deg, rgba(138, 43, 226, 0.4) 0%, rgba(138, 43, 226, 0.2) 100%)",
                  border: !hasBBATest
                    ? "3px solid #8a2be2"
                    : hasPersonalityTest
                    ? "3px solid #8a2be2"
                    : "3px solid rgba(138, 43, 226, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: { xs: 1, sm: 1.5 },
                  boxShadow: hasPersonalityTest
                    ? "0 0 30px rgba(138, 43, 226, 0.6), inset 0 0 20px rgba(138, 43, 226, 0.3)"
                    : !hasBBATest
                    ? "0 0 20px rgba(138, 43, 226, 0.4)"
                    : "0 0 15px rgba(138, 43, 226, 0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                {!hasBBATest ? (
                  <Lock
                    sx={{
                      color: "#8a2be2",
                      fontSize: { xs: 32, sm: 40, md: 48 },
                      filter: "drop-shadow(0 0 10px rgba(138, 43, 226, 0.8))",
                    }}
                  />
                ) : hasPersonalityTest ? (
                  <CheckCircle
                    sx={{
                      color: "#fff",
                      fontSize: { xs: 40, sm: 48, md: 56 },
                      fontWeight: 900,
                    }}
                  />
                ) : (
                  <RadioButtonUnchecked
                    sx={{
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: { xs: 40, sm: 48, md: 56 },
                    }}
                  />
                )}
              </Box>
            </motion.div>
            <Typography
              variant="h6"
              sx={{
                color: !hasBBATest
                  ? "#8a2be2"
                  : hasPersonalityTest
                  ? "#8a2be2"
                  : "rgba(255, 255, 255, 0.7)",
                fontWeight: 700,
                mb: { xs: 0.5, sm: 0.75 },
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
              }}
            >
              Level 2
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
                mb: { xs: 0.5, sm: 0.75 },
              }}
            >
              Personality
            </Typography>
            {!hasBBATest ? (
              <Typography
                variant="body2"
                sx={{
                  color: "#8a2be2",
                  fontWeight: 600,
                  fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                }}
              >
                🔒 LOCKED
              </Typography>
            ) : hasPersonalityTest ? (
              <Typography
                variant="body2"
                sx={{
                  color: "#8a2be2",
                  fontWeight: 600,
                  fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                }}
              >
                ✓ COMPLETE
              </Typography>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontWeight: 600,
                  fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                }}
              >
                READY
              </Typography>
            )}
          </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
