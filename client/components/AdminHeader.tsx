import React from "react";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
} from "@mui/material";
import { Home, Logout, AdminPanelSettings, Dashboard } from "@mui/icons-material";
import Logo from "./Logo";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function AdminHeader() {
  const router = useRouter();
  const { admin, adminLogout, user, logout } = useAuth();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(10, 14, 39, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(138, 43, 226, 0.3)",
        boxShadow: "0 0 20px rgba(138, 43, 226, 0.2)",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
        <Toolbar 
          sx={{ 
            justifyContent: "space-between", 
            py: { xs: 0.5, sm: 1 },
            px: 0,
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <Logo
              width={180}
              height={72}
              onClick={() => router.push("/")}
              animated={true}
              sx={{
                height: { xs: 48, sm: 64, md: 72 },
                width: { xs: 120, sm: 160, md: 180 },
              }}
            />
          </Box>
          <Box 
            sx={{ 
              display: "flex", 
              gap: { xs: 0.5, sm: 1, md: 1.5 }, 
              alignItems: "center",
              flexShrink: 0,
              ml: { xs: 1, sm: 2 },
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => router.push("/")}
                startIcon={<Home sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }} />}
                sx={{
                  color: "#00ffff",
                  fontWeight: 600,
                  px: { xs: 0.75, sm: 1.5, md: 2 },
                  py: { xs: 0.4, sm: 0.75, md: 1 },
                  minWidth: { xs: "auto", sm: "auto" },
                  borderRadius: 0,
                  border: "1px solid rgba(0, 255, 255, 0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.85rem" },
                  "&:hover": { 
                    bgcolor: "rgba(0, 255, 255, 0.1)",
                    borderColor: "rgba(0, 255, 255, 0.5)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Home
                </Box>
              </Button>
            </motion.div>

            {user && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/dashboard")}
                  startIcon={<Dashboard sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }} />}
                  sx={{
                    color: "#00ffff",
                    fontWeight: 600,
                    px: { xs: 0.75, sm: 1.5, md: 2 },
                    py: { xs: 0.4, sm: 0.75, md: 1 },
                    minWidth: { xs: "auto", sm: "auto" },
                    borderRadius: 0,
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.85rem" },
                    "&:hover": { 
                      bgcolor: "rgba(0, 255, 255, 0.1)",
                      borderColor: "rgba(0, 255, 255, 0.5)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    Dashboard
                  </Box>
                </Button>
              </motion.div>
            )}

            {admin && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/admin")}
                  startIcon={<AdminPanelSettings sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }} />}
                  sx={{
                    color: "#8a2be2",
                    fontWeight: 600,
                    px: { xs: 0.75, sm: 1.5, md: 2 },
                    py: { xs: 0.4, sm: 0.75, md: 1 },
                    minWidth: { xs: "auto", sm: "auto" },
                    borderRadius: 0,
                    border: "1px solid rgba(138, 43, 226, 0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.85rem" },
                    "&:hover": { 
                      bgcolor: "rgba(138, 43, 226, 0.1)",
                      borderColor: "rgba(138, 43, 226, 0.5)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    Admin Home
                  </Box>
                </Button>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={admin ? adminLogout : logout}
                startIcon={<Logout sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }} />}
                sx={{
                  color: "#00ffff",
                  fontWeight: 600,
                  px: { xs: 0.75, sm: 1.5, md: 2 },
                  py: { xs: 0.4, sm: 0.75, md: 1 },
                  minWidth: { xs: "auto", sm: "auto" },
                  borderRadius: 0,
                  border: "1px solid rgba(0, 255, 255, 0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.85rem" },
                  "&:hover": { 
                    bgcolor: "rgba(0, 255, 255, 0.1)",
                    borderColor: "rgba(0, 255, 255, 0.5)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Logout
                </Box>
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}



