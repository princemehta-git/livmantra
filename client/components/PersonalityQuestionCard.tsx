import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { PersonalityQuestion } from "../data/personalityQuestions";
import HorizontalLikertScale from "./HorizontalLikertScale";

type Props = {
  question: PersonalityQuestion;
  onAnswer: (val: number) => void;
  selected?: number;
};

export default function PersonalityQuestionCard({
  question,
  onAnswer,
  selected,
}: Props) {
  const currentDimension = question.dimension;
  const questionNumInDimension = question.questionIndex + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          mb: 2,
          background: "rgba(10, 14, 39, 0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0, 255, 255, 0.2)",
          borderRadius: 0,
          boxShadow: "0 0 30px rgba(0, 255, 255, 0.1), inset 0 0 20px rgba(138, 43, 226, 0.05)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent)",
            animation: "shimmer 2s linear infinite",
          },
          "&:hover": {
            borderColor: "rgba(0, 255, 255, 0.4)",
            boxShadow: "0 0 40px rgba(0, 255, 255, 0.2), inset 0 0 30px rgba(138, 43, 226, 0.1)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Dimension Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              mb: 2,
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                px: { xs: 2, sm: 3 },
                py: { xs: 0.75, sm: 1 },
                borderRadius: 0,
                background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                border: "1px solid rgba(0, 255, 255, 0.5)",
                boxShadow: "0 0 20px rgba(0, 255, 255, 0.4)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#0a0e27",
                  fontWeight: 900,
                  fontSize: { xs: "0.7rem", sm: "0.85rem", md: "0.9rem" },
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {question.dimensionName} - Question {questionNumInDimension}/8
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: question.pole === "left" ? "#00ffff" : "#8a2be2",
                  fontWeight: 600,
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {question.pole === "left" ? question.leftPole : question.rightPole}
              </Typography>
            </Box>
          </Box>

          {/* Question Text */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#ffffff",
                lineHeight: 1.5,
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.3rem" },
              }}
            >
              {question.text}
            </Typography>
          </Box>

          {/* 7-Point Horizontal Likert Scale */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <HorizontalLikertScale selected={selected} onSelect={onAnswer} />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
