import React from "react";
import { Dialog, Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Person, ArrowForward } from "@mui/icons-material";

interface ProfileCompletionModalProps {
  open: boolean;
  onClose: () => void;
  onCompleteProfile: () => void;
  missingFields: string[];
}

export default function ProfileCompletionModal({
  open,
  onClose,
  onCompleteProfile,
  missingFields,
}: ProfileCompletionModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(10, 14, 39, 0.95)",
          border: "2px solid #ff6b6b",
          borderRadius: 0,
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 50px rgba(255, 107, 107, 0.6)",
        },
      }}
    >
      <Box sx={{ p: { xs: 3, sm: 4, md: 5 }, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Person
            sx={{
              fontSize: { xs: 64, sm: 80, md: 96 },
              color: "#ff6b6b",
              filter: "drop-shadow(0 0 30px rgba(255, 107, 107, 0.8))",
              mb: 2,
            }}
          />
        </motion.div>

        <Typography
          variant="h4"
          sx={{
            color: "#ff6b6b",
            fontWeight: 900,
            mb: 1,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
          }}
        >
          Profile Incomplete
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            mb: 3,
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
          }}
        >
          Please complete your profile before taking the Personality Test.
        </Typography>

        <Box
          sx={{
            background: "rgba(255, 107, 107, 0.1)",
            border: "1px solid rgba(255, 107, 107, 0.3)",
            borderRadius: 0,
            p: 2,
            mb: 3,
            textAlign: "left",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#ff6b6b",
              fontWeight: 600,
              mb: 1,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            Missing Fields:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, color: "rgba(255, 255, 255, 0.7)" }}>
            {missingFields.map((field, idx) => (
              <li key={idx} style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                {field}
              </li>
            ))}
          </Box>
        </Box>

        <Button
          variant="contained"
          endIcon={<ArrowForward sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />}
          onClick={() => {
            onCompleteProfile();
            onClose();
          }}
          sx={{
            background: "linear-gradient(135deg, #ff6b6b 0%, #8a2be2 100%)",
            color: "#fff",
            fontWeight: 700,
            px: { xs: 4, sm: 6, md: 8 },
            py: { xs: 1.5, sm: 2, md: 2.5 },
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
            border: "2px solid #ff6b6b",
            boxShadow: "0 0 30px rgba(255, 107, 107, 0.6)",
            "&:hover": {
              background: "linear-gradient(135deg, #ff6b6b 0%, #8a2be2 100%)",
              boxShadow: "0 0 50px rgba(255, 107, 107, 0.8)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Complete Profile
        </Button>
      </Box>
    </Dialog>
  );
}
