import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";

type Props = {
  qIndex: number;
  text: string;
  options: string[];
  onAnswer: (val: number) => void;
  selected?: number;
};

export default function QuestionCard({
  qIndex,
  text,
  options,
  onAnswer,
  selected,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        sx={{ 
          mb: 3,
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(99, 102, 241, 0.1)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              px: 2,
              py: 0.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              mb: 3,
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: "white",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              Q{qIndex + 1}
            </Typography>
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              my: 3,
              fontWeight: 600,
              color: "#1e293b",
              lineHeight: 1.6,
            }}
          >
            {text}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1, 2, 3].map((val) => (
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
                    px: 3,
                    py: 2,
                    borderRadius: 2,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    ...(selected === val
                      ? {
                          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                          color: "white",
                          boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.2)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                            boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.4), 0 10px 10px -5px rgba(99, 102, 241, 0.2)",
                          },
                        }
                      : {
                          borderColor: "#e2e8f0",
                          color: "#475569",
                          borderWidth: 2,
                          "&:hover": {
                            borderColor: "#6366f1",
                            bgcolor: "rgba(99, 102, 241, 0.05)",
                            borderWidth: 2,
                          },
                        }),
                    transition: "all 0.3s ease",
                  }}
                >
                  {options[val - 1] || `Option ${val}`}
                </Button>
              </motion.div>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

