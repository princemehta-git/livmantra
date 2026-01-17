import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { Dashboard, Logout, Login, AdminPanelSettings, Message } from "@mui/icons-material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "next-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const router = useRouter();
  const { user, admin, logout, adminLogout } = useAuth();
  const { t } = useTranslation("header");
  const [logoError, setLogoError] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/logo16_9.svg");

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
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
        <Toolbar 
          sx={{ 
            justifyContent: "space-between", 
            py: { xs: 0.5, sm: 1 },
            px: 0,
            minHeight: { xs: 56, sm: 72, md: 80 },
            flexWrap: { xs: "nowrap", sm: "nowrap" },
          }}
        >
          <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/")}
            >
              <Box
                sx={{
                  position: "relative",
                  height: { xs: 40, sm: 56, md: 64 },
                  width: { xs: 140, sm: 190, md: 220 },
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {!logoError ? (
                  <Image
                    src={logoSrc}
                    alt="LivMantra Logo"
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: "center center",
                    }}
                    priority
                    onError={() => {
                      // Try PNG fallback if SVG fails
                      if (logoSrc === "/logo16_9.svg") {
                        setLogoSrc("/logo16_9.png");
                      } else {
                        // Both SVG and PNG failed
                        setLogoError(true);
                      }
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: "80%",
                        height: "80%",
                        background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#0a0e27",
                          fontWeight: 800,
                          fontSize: "1rem",
                        }}
                      >
                        LM
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </motion.div>
          </Box>
          <Box 
            sx={{ 
              display: "flex", 
              gap: { xs: 0.5, sm: 1.5, md: 2 }, 
              alignItems: "center",
              flexShrink: 0,
              ml: { xs: 1, sm: 2 },
            }}
          >
            {user && (
              <>
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
                      "& .MuiButton-startIcon": {
                        margin: { xs: 0, sm: "0 4px 0 0" },
                      },
                      "&:hover": { 
                        bgcolor: "rgba(0, 255, 255, 0.1)",
                        borderColor: "rgba(0, 255, 255, 0.5)",
                        boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                      {t("dashboard")}
                    </Box>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => router.push("/dashboard/contact")}
                    startIcon={<Message sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }} />}
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
                      "& .MuiButton-startIcon": {
                        margin: { xs: 0, sm: "0 4px 0 0" },
                      },
                      "&:hover": { 
                        bgcolor: "rgba(0, 255, 255, 0.1)",
                        borderColor: "rgba(0, 255, 255, 0.5)",
                        boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                      {t("Chat")}
                    </Box>
                  </Button>
                </motion.div>
              </>
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
                    {t("admin")}
                  </Box>
                </Button>
              </motion.div>
            )}

            {user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={logout}
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
                    {t("logout")}
                  </Box>
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/login")}
                  startIcon={<Login sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }} />}
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
                    {t("login")}
                  </Box>
                </Button>
              </motion.div>
            )}

            <Box sx={{ display: "none" }}>
              <LanguageSwitcher />
            </Box>

            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                onClick={() => router.push(user ? "/test" : "/login")}
                sx={{
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  color: "#0a0e27",
                  fontWeight: 700,
                  px: { xs: 1, sm: 3, md: 4 },
                  py: { xs: 0.4, sm: 0.75, md: 1 },
                  minWidth: { xs: "auto", sm: "auto" },
                  borderRadius: 0,
                  border: "1px solid #00ffff",
                  boxShadow: "0 0 20px rgba(0, 255, 255, 0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.85rem" },
                  "&:hover": { 
                    background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                    boxShadow: "0 0 30px rgba(0, 255, 255, 0.6)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {user ? t("test") : t("start")}
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}


