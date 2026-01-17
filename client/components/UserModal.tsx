import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import PhoneInput from "./PhoneInput";

type Props = {
  open: boolean;
  onClose: (data?: { name: string; email: string; phone: string }) => void;
};

export default function UserModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }
    const user = { name, email, phone };
    localStorage.setItem("livmantra_user", JSON.stringify(user));
    onClose(user);
  };

  return (
      <Dialog 
      open={open} 
      onClose={() => onClose()}
      PaperProps={{
        sx: {
          borderRadius: 0,
          background: "rgba(10, 14, 39, 0.95)",
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(0, 255, 255, 0.3)",
          boxShadow: "0 0 50px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(138, 43, 226, 0.1)",
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
            }}
          >
            Player Registration
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 1,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Enter your details to begin the mission
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: "400px" }}>
            <TextField
              autoFocus
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 0,
                  bgcolor: "rgba(0, 255, 255, 0.05)",
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "rgba(0, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00ffff",
                    borderWidth: 2,
                    boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#00ffff",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#ffffff",
                },
              }}
            />
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 0,
                  bgcolor: "rgba(0, 255, 255, 0.05)",
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "rgba(0, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00ffff",
                    borderWidth: 2,
                    boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#00ffff",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#ffffff",
                },
              }}
            />
            <PhoneInput
              label="Phone"
              value={phone}
              onChange={setPhone}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 0,
                  bgcolor: "rgba(0, 255, 255, 0.05)",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={() => onClose()}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 0,
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "0.85rem",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(255, 255, 255, 0.9)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="contained" 
              onClick={submit}
              sx={{
                px: 4,
                py: 1,
                borderRadius: 0,
                fontWeight: 700,
                background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                color: "#0a0e27",
                border: "2px solid #00ffff",
                boxShadow: "0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(138, 43, 226, 0.2)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "0.9rem",
                "&:hover": {
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  boxShadow: "0 0 50px rgba(0, 255, 255, 0.8), inset 0 0 30px rgba(138, 43, 226, 0.3)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Start Mission
            </Button>
          </motion.div>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
}


