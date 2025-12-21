import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  autoCloseTime?: number; // in seconds
};

export default function DisclaimerModal({ open, onClose, autoCloseTime = 15 }: Props) {
  const [timeRemaining, setTimeRemaining] = useState(autoCloseTime);

  useEffect(() => {
    if (!open) {
      setTimeRemaining(autoCloseTime);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, autoCloseTime, onClose]);

  const progress = (timeRemaining / autoCloseTime) * 100;

  return (
    <Dialog 
      open={open} 
      onClose={() => {}} // Prevent closing by clicking outside
      PaperProps={{
        sx: {
          borderRadius: 0,
          background: "rgba(10, 14, 39, 0.95)",
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(0, 255, 255, 0.3)",
          boxShadow: "0 0 50px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(138, 43, 226, 0.1)",
          position: "relative",
          overflow: "hidden",
          maxWidth: "500px",
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
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 50%, #00ffff 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradient 3s ease infinite",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              textAlign: "center",
            }}
          >
            Your Truth Zone
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              component="div"
              sx={{
                mb: 3,
              }}
            >
              <Box 
                component="span" 
                sx={{ 
                  display: "block", 
                  mb: 2, 
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  color: "#00ffff",
                  textShadow: "0 0 20px rgba(0, 255, 255, 0.6)",
                  letterSpacing: "0.05em",
                }}
              >
                Be BRUTALLY honest!
              </Box>
              <Box 
                component="span" 
                sx={{ 
                  display: "block", 
                  mb: 2, 
                  fontSize: "1.3rem", 
                  color: "rgba(255, 255, 255, 0.95)",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                }}
              >
                No one is watching — you're completely anonymous
              </Box>
              <Box 
                component="span" 
                sx={{ 
                  display: "block", 
                  fontSize: "1.4rem", 
                  color: "#8a2be2",
                  fontWeight: 700,
                  textShadow: "0 0 25px rgba(138, 43, 226, 0.7)",
                  letterSpacing: "0.04em",
                }}
              >
                So drop the mask, be real — ZERO shame!
              </Box>
            </Typography>
            
            <Box sx={{ mt: 3, mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 0,
                  bgcolor: "rgba(0, 255, 255, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(90deg, #00ffff 0%, #8a2be2 100%)",
                    boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  mt: 1,
                  display: "block",
                  fontSize: "0.75rem",
                }}
              >
                Auto-closing in {timeRemaining}s
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, justifyContent: "center" }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="contained" 
              onClick={onClose}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 0,
                fontWeight: 700,
                background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                color: "#0a0e27",
                border: "2px solid #00ffff",
                boxShadow: "0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(138, 43, 226, 0.2)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "1rem",
                "&:hover": {
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  boxShadow: "0 0 50px rgba(0, 255, 255, 0.8), inset 0 0 30px rgba(138, 43, 226, 0.3)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              OK, I Agree
            </Button>
          </motion.div>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
}

