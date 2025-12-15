import React from "react";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function Header() {
  const router = useRouter();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(10, 14, 39, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 255, 255, 0.2)",
        boxShadow: "0 0 20px rgba(0, 255, 255, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => router.push("/")}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <AutoAwesome 
                  sx={{ 
                    mr: 1, 
                    fontSize: "2rem",
                    color: "#00ffff",
                    filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))",
                  }} 
                />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 900,
                    fontSize: "1.5rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  LivMantra
                </Typography>
              </Box>
            </Box>
          </motion.div>
          <Box sx={{ display: "flex", gap: 2 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => router.push("/test")}
                sx={{
                  color: "#00ffff",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 0,
                  border: "1px solid rgba(0, 255, 255, 0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.85rem",
                  "&:hover": { 
                    bgcolor: "rgba(0, 255, 255, 0.1)",
                    borderColor: "rgba(0, 255, 255, 0.5)",
                    boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Tests
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                onClick={() => router.push("/test")}
                sx={{
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  color: "#0a0e27",
                  fontWeight: 700,
                  px: 4,
                  py: 1,
                  borderRadius: 0,
                  border: "1px solid #00ffff",
                  boxShadow: "0 0 20px rgba(0, 255, 255, 0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.85rem",
                  "&:hover": { 
                    background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                    boxShadow: "0 0 30px rgba(0, 255, 255, 0.6)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Start
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}


