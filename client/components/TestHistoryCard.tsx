import React from "react";
import { useRouter } from "next/router";
import { Card, Box, Typography, Chip, Button } from "@mui/material";
import { motion } from "framer-motion";
import { ArrowForward, CalendarToday } from "@mui/icons-material";

interface TestHistoryCardProps {
  test: {
    id: string;
    type: string;
    score?: number | null;
    snapshot?: any;
    createdAt: string;
    status?: string;
  };
}

export default function TestHistoryCard({ test }: TestHistoryCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isPersonalityTest = test.type === "PERSONALITY";
  const testTitle = isPersonalityTest ? "PERSONALITY TEST" : "BBA TEST";
  const testColor = isPersonalityTest ? "#8a2be2" : "#00ffff";
  const bodyType = test.snapshot?.bodyType || "Unknown";
  const personalityName = test.snapshot?.personalityName || null;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          p: { xs: 1.5, sm: 2.5, md: 3 },
          background: "rgba(10, 14, 39, 0.8)",
          border: `1px solid ${isPersonalityTest ? "rgba(138, 43, 226, 0.2)" : "rgba(0, 255, 255, 0.2)"}`,
          borderRadius: 0,
          backdropFilter: "blur(10px)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: isPersonalityTest ? "rgba(138, 43, 226, 0.5)" : "rgba(0, 255, 255, 0.5)",
            boxShadow: isPersonalityTest
              ? "0 0 30px rgba(138, 43, 226, 0.3)"
              : "0 0 30px rgba(0, 255, 255, 0.3)",
          },
        }}
        onClick={() => router.push(`/result/${test.id}`)}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: { xs: 1, sm: 1.5, md: 2 } }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: testColor,
                fontWeight: 700,
                mb: { xs: 0.5, sm: 0.75, md: 1 },
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: { xs: "0.7rem", sm: "0.875rem", md: "1.25rem" },
              }}
            >
              {testTitle}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 0.75, md: 1 }, mb: { xs: 0.5, sm: 0.75, md: 1 } }}>
              <CalendarToday sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: { xs: 12, sm: 14, md: 16 } }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                }}
              >
                {formatDate(test.createdAt)}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={test.status || "Completed"}
            size="small"
            sx={{
              background: isPersonalityTest ? "rgba(138, 43, 226, 0.2)" : "rgba(0, 255, 255, 0.2)",
              color: testColor,
              border: `1px solid ${isPersonalityTest ? "rgba(138, 43, 226, 0.3)" : "rgba(0, 255, 255, 0.3)"}`,
              fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
              height: { xs: "20px", sm: "24px", md: "auto" },
              "& .MuiChip-label": {
                px: { xs: 0.75, sm: 1, md: 1.5 },
              },
            }}
          />
        </Box>

        <Box sx={{ mb: { xs: 1, sm: 1.5, md: 2 } }}>
          {isPersonalityTest ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  mb: 0.5,
                  fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                }}
              >
                Personality Type
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.875rem", md: "1rem" },
                  lineHeight: 1.3,
                }}
              >
                {personalityName || "Unknown"}
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  mb: 0.5,
                  fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.875rem" },
                }}
              >
                Body Type
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.875rem", md: "1rem" },
                }}
              >
                {bodyType}
              </Typography>
            </>
          )}
        </Box>

        <Button
          endIcon={<ArrowForward sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" } }} />}
          sx={{
            color: testColor,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.85rem" },
            px: { xs: 1, sm: 1.5, md: 2 },
            py: { xs: 0.5, sm: 0.75, md: 1 },
            "&:hover": {
              background: isPersonalityTest
                ? "rgba(138, 43, 226, 0.1)"
                : "rgba(0, 255, 255, 0.1)",
            },
          }}
        >
          View Details
        </Button>
      </Card>
    </motion.div>
  );
}

