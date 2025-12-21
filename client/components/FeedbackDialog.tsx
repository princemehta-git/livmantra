import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Rating,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (feedback: { rating: number; comment: string }) => void | Promise<void>;
};

export default function FeedbackDialog({ open, onClose, onSubmit }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setRating(null);
      setComment("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (rating === null) {
      alert("Please provide a rating");
      return;
    }
    if (onSubmit) {
      try {
        await onSubmit({ rating, comment });
        // Reset form only after successful submission
        setRating(null);
        setComment("");
        onClose();
      } catch (error) {
        // Error handling is done in the parent component
        console.error("Feedback submission error:", error);
      }
    } else {
      // Reset form even if no onSubmit handler
      setRating(null);
      setComment("");
      onClose();
    }
  };

  const handleClose = () => {
    setRating(null);
    setComment("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={false}
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: "rgba(10, 14, 39, 0.95)",
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(0, 255, 255, 0.3)",
          boxShadow: "0 0 50px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(138, 43, 226, 0.1)",
          position: "relative",
          overflow: "visible",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent)",
            animation: "shimmer 2s linear infinite",
            pointerEvents: "none",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Share Your Feedback
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": { color: "#00ffff" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, color: "rgba(255, 255, 255, 0.9)" }}>
            How would you rate your experience with the Body Checking Test?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Rating
              value={rating}
              onChange={(_, newValue) => {
                setRating(newValue);
                console.log("Rating changed to:", newValue);
              }}
              size="large"
              sx={{
                "& .MuiRating-iconEmpty": {
                  color: "rgba(255, 255, 255, 0.4)",
                  stroke: "rgba(255, 255, 255, 0.6)",
                  strokeWidth: 1,
                },
                "& .MuiRating-iconFilled": {
                  color: "#00ffff",
                  filter: "drop-shadow(0 0 6px rgba(0, 255, 255, 0.8))",
                },
                "& .MuiRating-iconHover": {
                  color: "rgba(0, 255, 255, 0.6)",
                  filter: "drop-shadow(0 0 4px rgba(0, 255, 255, 0.4))",
                  transition: "all 0.2s ease-in-out",
                },
                "& .MuiRating-icon": {
                  fontSize: "2.5rem",
                  transition: "all 0.2s ease-in-out",
                },
                cursor: "pointer",
              }}
            />
          </Box>
          {rating !== null && (
            <Typography variant="caption" sx={{ mt: 1, textAlign: "center", color: "rgba(255, 255, 255, 0.7)", display: "block" }}>
              You selected {rating} star{rating !== 1 ? "s" : ""}
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Tell us what you think... (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "rgba(255, 255, 255, 0.9)",
              "& fieldset": {
                borderColor: "rgba(0, 255, 255, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(0, 255, 255, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#00ffff",
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(255, 255, 255, 0.5)",
              opacity: 1,
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, position: "relative", zIndex: 1 }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ pointerEvents: "auto", zIndex: 2 }}>
          <Button
            onClick={handleClose}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 1,
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              textTransform: "none",
              pointerEvents: "auto",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.4)",
                bgcolor: "rgba(255, 255, 255, 0.05)",
                color: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            Cancel
          </Button>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          style={{ pointerEvents: "auto", zIndex: 2, position: "relative" }}
        >
          <Button
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Submit button clicked, rating:", rating);
              if (rating !== null) {
                handleSubmit();
              } else {
                alert("Please select a rating first");
              }
            }}
            disabled={rating === null}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 1,
              fontWeight: 700,
              background: rating !== null 
                ? "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)"
                : "rgba(255, 255, 255, 0.1)",
              color: rating !== null ? "#0a0e27" : "rgba(255, 255, 255, 0.3)",
              textTransform: "none",
              cursor: rating !== null ? "pointer" : "not-allowed",
              pointerEvents: rating !== null ? "auto" : "none",
              position: "relative",
              zIndex: 3,
              "&:hover:not(:disabled)": {
                background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
              },
              "&.Mui-disabled": {
                background: "rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 0.3)",
                cursor: "not-allowed",
                pointerEvents: "none",
              },
            }}
          >
            Submit Feedback {rating !== null && `(${rating}⭐)`}
          </Button>
        </motion.div>
      </DialogActions>
    </Dialog>
  );
}

