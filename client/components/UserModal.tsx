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
          borderRadius: 4,
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
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
              fontWeight: 800,
              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Tell us about you
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            We'll use this to personalize your results
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
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#6366f1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6366f1",
                    borderWidth: 2,
                  },
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
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#6366f1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6366f1",
                    borderWidth: 2,
                  },
                },
              }}
            />
            <TextField
              label="Phone"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#6366f1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6366f1",
                    borderWidth: 2,
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => onClose()}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              color: "#64748b",
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={submit}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.2)",
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.4), 0 10px 10px -5px rgba(99, 102, 241, 0.2)",
              },
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
}


