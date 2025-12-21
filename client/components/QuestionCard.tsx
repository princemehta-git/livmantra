import React from "react";
import { Card, CardContent, Typography, Button, Box, Tooltip, IconButton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Language } from "../hooks/useLanguage";

type Props = {
  qIndex: number;
  text: string;
  options: string[];
  hint?: string;
  onAnswer: (val: number) => void;
  selected?: number;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
};

export default function QuestionCard({
  qIndex,
  text,
  options,
  hint,
  onAnswer,
  selected,
  language = "en",
  onLanguageChange,
}: Props) {
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
        <CardContent sx={{ p: 3 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  px: 3,
                  py: 1,
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
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Question {qIndex + 1}
                </Typography>
              </Box>
              {onLanguageChange && (
                <ToggleButtonGroup
                  value={language}
                  exclusive
                  onChange={(_, newLang) => {
                    if (newLang !== null) {
                      onLanguageChange(newLang);
                    }
                  }}
                  size="small"
                  sx={{
                    "& .MuiToggleButton-root": {
                      color: "#00ffff",
                      borderColor: "rgba(0, 255, 255, 0.3)",
                      bgcolor: "rgba(0, 255, 255, 0.1)",
                      px: 1.5,
                      py: 0.5,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 0,
                      "&.Mui-selected": {
                        bgcolor: "rgba(0, 255, 255, 0.3)",
                        color: "#0a0e27",
                        borderColor: "rgba(0, 255, 255, 0.6)",
                        "&:hover": {
                          bgcolor: "rgba(0, 255, 255, 0.4)",
                        },
                      },
                      "&:hover": {
                        bgcolor: "rgba(0, 255, 255, 0.2)",
                        borderColor: "rgba(0, 255, 255, 0.5)",
                      },
                    },
                  }}
                >
                  <ToggleButton value="en">EN</ToggleButton>
                  <ToggleButton value="hi">HI</ToggleButton>
                </ToggleButtonGroup>
              )}
            </Box>
          </motion.div>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, my: 2 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                color: "#ffffff",
                lineHeight: 1.5,
                flex: 1,
                fontSize: { xs: "1.1rem", md: "1.3rem" },
              }}
            >
              {text}
            </Typography>
            {hint && (
              <Tooltip
                title={hint}
                arrow
                placement="top"
                PopperProps={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, 8],
                      },
                    },
                  ],
                }}
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "rgba(15, 23, 42, 0.95)",
                      backdropFilter: "blur(10px)",
                      color: "#f1f5f9",
                      fontSize: "0.95rem",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                      maxWidth: 300,
                      "& .MuiTooltip-arrow": {
                        color: "rgba(15, 23, 42, 0.95)",
                      },
                    },
                  },
                }}
              >
                <IconButton
                  size="small"
                  sx={{
                    color: "#00ffff",
                    bgcolor: "rgba(0, 255, 255, 0.1)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    width: 32,
                    height: 32,
                    borderRadius: 0,
                    "&:hover": {
                      bgcolor: "rgba(0, 255, 255, 0.2)",
                      borderColor: "rgba(0, 255, 255, 0.6)",
                      boxShadow: "0 0 15px rgba(0, 255, 255, 0.4)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <InfoOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {options.map((option, idx) => {
              const val = idx + 1; // Option values are 1-indexed (1, 2, 3, or 4)
              return (
                <motion.div
                  key={val}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant={selected === val ? "contained" : "outlined"}
                    onClick={() => onAnswer(val)}
                    fullWidth
                    sx={{
                      textAlign: "left",
                      justifyContent: "flex-start",
                      px: 2.5,
                      py: 1.8,
                      borderRadius: 0,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      textTransform: "none",
                      ...(selected === val
                        ? {
                            background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                            color: "#0a0e27",
                            border: "2px solid #00ffff",
                            boxShadow: "0 0 25px rgba(0, 255, 255, 0.5), inset 0 0 15px rgba(138, 43, 226, 0.2)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                              boxShadow: "0 0 35px rgba(0, 255, 255, 0.7), inset 0 0 20px rgba(138, 43, 226, 0.3)",
                              transform: "translateY(-2px)",
                            },
                          }
                        : {
                            borderColor: "rgba(0, 255, 255, 0.3)",
                            color: "rgba(255, 255, 255, 0.8)",
                            borderWidth: 2,
                            bgcolor: "rgba(0, 255, 255, 0.05)",
                            "&:hover": {
                              borderColor: "rgba(0, 255, 255, 0.6)",
                              bgcolor: "rgba(0, 255, 255, 0.15)",
                              boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
                              borderWidth: 2,
                              color: "#00ffff",
                            },
                          }),
                      transition: "all 0.3s ease",
                    }}
                  >
                    {option}
                  </Button>
                </motion.div>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

