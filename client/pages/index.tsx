import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  PlayArrow,
  AutoAwesome,
  Speed,
  Shield,
  MedicalServices,
  AccessTime,
  CreditCard,
  Fingerprint,
  Psychology,
  Nature,
  Warning,
  CheckCircle,
  Cancel,
  Lock,
  AutoStories,
  PersonAdd,
  ArrowForward,
  PsychologyOutlined,
  Favorite,
  Timeline,
} from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { user } = useAuth();

  const handleStartTest = () => {
    if (user) {
      router.push("/test");
    } else {
      router.push("/login");
    }
  };

  return (
    <Box 
      sx={{ 
        overflowX: "hidden",
        background: "#0a0e27",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Animated grid background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          opacity: 0.4,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      
      {/* Glowing orbs */}
      <Box
        sx={{
          position: "fixed",
          top: "20%",
          left: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: 0,
          pointerEvents: "none",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "fixed",
          bottom: "20%",
          right: "10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />

      <Header />
      
      {/* Hero Section */}
      <Box
        id="hero"
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: { xs: "85vh", md: "90vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 6, sm: 8, md: 12 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, width: "100%" }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* Left Side - Logo and Tagline */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: { xs: 280, sm: 350, md: 450, lg: 500 },
                        height: { xs: 112, sm: 140, md: 180, lg: 200 },
                      }}
                    >
                      <Image
                        src="/logo.png"
                        alt="LivMantra Logo"
                        fill
                        style={{
                          objectFit: "contain",
                        }}
                        priority
                      />
                    </Box>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" },
                        fontWeight: 700,
                        lineHeight: 1.4,
                        textAlign: "center",
                        background: "linear-gradient(90deg, #00ffff 0%, #8a2be2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "0.02em",
                      }}
                    >
                      Your Personal AI Health Coach
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      <Chip
                        icon={<MedicalServices sx={{ color: "#00ffff" }} />}
                        label="Designed by Doctors. Built around you."
                        sx={{
                          px: 2,
                          py: 3,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          fontWeight: 600,
                          background: "rgba(0, 255, 255, 0.1)",
                          border: "1px solid rgba(0, 255, 255, 0.3)",
                          color: "#00ffff",
                          "& .MuiChip-icon": {
                            color: "#00ffff",
                          },
                        }}
                      />
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>

            {/* Right Side - Main Content */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Box sx={{ textAlign: "center", width: "100%" }}>
                  {/* Main Heading */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Typography
                      variant="h1"
                      sx={{ 
                        fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem" },
                        fontWeight: 400,
                        color: "#ffffff",
                        mb: 3,
                        lineHeight: 1.1,
                        fontFamily: "serif",
                      }}
                    >
                      Understand your body, mind & behaviour.{" "}
                      <Box
                        component="span"
                        sx={{
                          fontStyle: "italic",
                          color: "#00ffff",
                        }}
                      >
                        Get Daily Guidance that fits your life.
                      </Box>
                    </Typography>
                  </motion.div>
                  
                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontWeight: 300,
                          fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                          maxWidth: "800px",
                          mx: "auto",
                          lineHeight: 1.6,
                          textAlign: "center",
                        }}
                      >
                        No more random health advice
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontWeight: 300,
                          fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                          maxWidth: "800px",
                          mx: "auto",
                          lineHeight: 1.6,
                          textAlign: "center",
                        }}
                      >
                        Just Clarity.
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>

            {/* Bottom Section - Button and Features (Centered below both columns) */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: { xs: 4, md: 6 } }}>
                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleStartTest}
                      endIcon={<ArrowForward sx={{ fontSize: { xs: 18, md: 20 } }} />}
                      sx={{
                        px: { xs: 3, sm: 5, md: 8 },
                        py: { xs: 1.5, sm: 2, md: 3 },
                        fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                        fontWeight: 600,
                        background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                        color: "#0a0e27",
                        borderRadius: "50px",
                        border: { xs: "1.5px solid #00ffff", md: "2px solid #00ffff" },
                        boxShadow: { xs: "0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(138, 43, 226, 0.2)", md: "0 0 40px rgba(0, 255, 255, 0.6), inset 0 0 30px rgba(138, 43, 226, 0.2)" },
                        textTransform: "none",
                        width: { xs: "90%", sm: "auto" },
                        maxWidth: { xs: "100%", sm: "none" },
                        whiteSpace: { xs: "normal", sm: "nowrap" },
                        lineHeight: { xs: 1.4, sm: 1.5 },
                        "& .MuiButton-endIcon": {
                          ml: { xs: 1, md: 1.5 },
                        },
                        "&:hover": {
                          background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                          boxShadow: { xs: "0 0 40px rgba(0, 255, 255, 0.7), inset 0 0 25px rgba(138, 43, 226, 0.25)", md: "0 0 60px rgba(0, 255, 255, 0.9), inset 0 0 40px rgba(138, 43, 226, 0.3)" },
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Start Free Body & Mind Assessment
                    </Button>
                  </Box>
                </motion.div>

                {/* Features List */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: { xs: 1.5, sm: 2, md: 3 },
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.9375rem" },
                      fontWeight: 500,
                      px: { xs: 1, sm: 0 },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, whiteSpace: "nowrap", flexShrink: 0 }}>
                      <MedicalServices sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, color: "#00ffff", flexShrink: 0 }} />
                      <span>Designed by doctors</span>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, whiteSpace: "nowrap", flexShrink: 0 }}>
                      <CreditCard sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, color: "#00ffff", flexShrink: 0 }} />
                      <span>Free</span>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, whiteSpace: "nowrap", flexShrink: 0 }}>
                      <AccessTime sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, color: "#00ffff", flexShrink: 0 }} />
                      <span>Takes 10-12 minutes</span>
                    </Box>
                  </Box>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Philosophy Section */}
      <Box sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 }, background: "rgba(10, 14, 39, 0.3)" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* Left Side - Main Content */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: "#00ffff",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    fontSize: "0.875rem",
                    display: "block",
                    mb: 2,
                  }}
                >
                  OUR PHILOSOPHY
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2rem", md: "3rem" },
                    fontWeight: 700,
                    color: "#ffffff",
                    mb: 4,
                    fontFamily: "serif",
                  }}
                >
                  LivMantra starts with understanding.
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: { xs: "1rem", md: "1.125rem" },
                      lineHeight: 1.8,
                      mb: 3,
                    }}
                  >
                    Before suggesting food, exercise, or routines, LivMantra learns how you function.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: { xs: "1rem", md: "1.125rem" },
                      lineHeight: 1.8,
                      mb: 2,
                    }}
                  >
                    Through doctor-designed assessments, it understands:
                  </Typography>
                  <Box sx={{ pl: 3, mb: 3, position: "relative" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "2px",
                        background: "linear-gradient(180deg, #00ffff 0%, rgba(0, 255, 255, 0.3) 100%)",
                      }}
                    />
                    <List sx={{ py: 0 }}>
                      {[
                        "Your body's natural patterns",
                        "Your response to stress and recovery",
                        "Your behavioural tendencies",
                      ].map((text, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#00ffff",
                                mt: 1,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{
                                  color: "rgba(255, 255, 255, 0.8)",
                                  fontSize: { xs: "1rem", md: "1.125rem" },
                                  lineHeight: 1.8,
                                }}
                              >
                                {text}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: { xs: "1rem", md: "1.125rem" },
                      lineHeight: 1.8,
                      mb: 3,
                    }}
                  >
                    It then translates this into simple daily actions you can actually follow.
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* Right Side - Feature Steps */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Box sx={{ position: "relative" }}>
                  {/* Connecting Line */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: { xs: 24, md: 28 },
                      top: 0,
                      bottom: 0,
                      width: "2px",
                      background: "linear-gradient(180deg, rgba(0, 255, 255, 0.3) 0%, rgba(0, 255, 255, 0.1) 100%)",
                      display: { xs: "none", md: "block" },
                    }}
                  />
                  
                  {[
                    {
                      icon: <PsychologyOutlined sx={{ fontSize: { xs: 32, md: 40 } }} />,
                      title: "Understand",
                      description: "Deep analysis of your unique biology.",
                    },
                    {
                      icon: <Timeline sx={{ fontSize: { xs: 32, md: 40 } }} />,
                      title: "Personalise",
                      description: "Tailoring plans to your Health.",
                    },
                    {
                      icon: <Favorite sx={{ fontSize: { xs: 32, md: 40 } }} />,
                      title: "Guide",
                      description: "Simple actions. Daily clarity.",
                    },
                  ].map((step, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 3,
                        mb: { xs: 4, md: 5 },
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 48, md: 56 },
                          height: { xs: 48, md: 56 },
                          borderRadius: "50%",
                          background: "rgba(0, 255, 255, 0.1)",
                          border: "2px solid rgba(0, 255, 255, 0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#00ffff",
                          flexShrink: 0,
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Box sx={{ flex: 1, pt: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            color: "#ffffff",
                            fontWeight: 600,
                            mb: 1,
                            fontSize: { xs: "1.25rem", md: "1.5rem" },
                          }}
                        >
                          {step.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontSize: { xs: "0.9375rem", md: "1rem" },
                            lineHeight: 1.6,
                          }}
                        >
                          {step.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Bottom Section - Icon Pointers (Centered below both columns) */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: { xs: 4, md: 6 } }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: { xs: 1.5, sm: 2, md: 3 },
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.9375rem" },
                      fontWeight: 500,
                      px: { xs: 1, sm: 0 },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, whiteSpace: "nowrap", flexShrink: 0 }}>
                      <CheckCircle sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, color: "#00ffff", flexShrink: 0 }} />
                      <span>No pressure</span>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, whiteSpace: "nowrap", flexShrink: 0 }}>
                      <Shield sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, color: "#00ffff", flexShrink: 0 }} />
                      <span>No overload</span>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, whiteSpace: "nowrap", flexShrink: 0 }}>
                      <Fingerprint sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, color: "#00ffff", flexShrink: 0 }} />
                      <span>No one-size-fits-all plans</span>
                    </Box>
                  </Box>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Philosophy Section */}
      <Box id="philosophy" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 }, background: "rgba(10, 14, 39, 0.5)" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Why it fails */}
          <Box sx={{ mb: { xs: 8, md: 12 } }}>
            <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
              <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Card
                    sx={{
                      p: { xs: 3, md: 4 },
                      background: "rgba(10, 14, 39, 0.8)",
                      border: "1px solid rgba(255, 0, 0, 0.3)",
                      borderRadius: 2,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: -16,
                        left: -16,
                        width: 96,
                        height: 96,
                        background: "radial-gradient(circle, rgba(255, 0, 0, 0.1) 0%, transparent 70%)",
                        borderRadius: "50%",
                      }}
                    />
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                        <Warning sx={{ color: "#ff4444", fontSize: 24 }} />
                        <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: 500, fontFamily: "serif" }}>
                          The Reality of Generic Advice
                        </Typography>
                      </Box>
                      <List>
                        {[
                          "Some people burn energy very fast, while others store it easily.",
                          "Some react to stress immediately, others shut down quietly.",
                          "Most plans assume everyone's body works the exact same way.",
                        ].map((text, idx) => (
                          <ListItem key={idx} sx={{ px: 0, py: 1.5 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: "#ff6666",
                                  mt: 1,
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={text}
                              primaryTypographyProps={{
                                sx: { color: "rgba(255, 255, 255, 0.8)", fontSize: "1rem" },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />
                      <Typography
                        sx={{
                          color: "#ffffff",
                          fontWeight: 500,
                          fontStyle: "italic",
                          fontSize: "1.1rem",
                        }}
                      >
                        "Following the same advice creates confusion, guilt, and inconsistency — not better health."
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: "#00ffff",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      fontSize: "0.875rem",
                      display: "block",
                      mb: 2,
                    }}
                  >
                    The Problem
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: "2rem", md: "2.5rem" },
                      fontWeight: 400,
                      color: "#ffffff",
                      mb: 3,
                      fontFamily: "serif",
                    }}
                  >
                    Why generic health advice doesn't work for most people
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "1.125rem",
                      lineHeight: 1.7,
                      mb: 3,
                    }}
                  >
                    Most health plans rely on a one-size-fits-all approach. But in real life, our bodies are vastly different metabolically, emotionally, and physically.
                  </Typography>
                  <Box
                    sx={{
                      background: "rgba(0, 255, 255, 0.1)",
                      borderLeft: "4px solid #00ffff",
                      p: 3,
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#00ffff",
                        fontWeight: 500,
                        fontSize: "1.125rem",
                      }}
                    >
                      Your body isn't broken. It's just different.
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Box>

          {/* What LivMantra does differently */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ textAlign: "center", maxWidth: "800px", mx: "auto", mb: 8 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: "#00ffff",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    fontSize: "0.875rem",
                    display: "block",
                    mb: 2,
                  }}
                >
                  The LivMantra Approach
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2rem", md: "2.5rem" },
                    fontWeight: 400,
                    color: "#ffffff",
                    mb: 2,
                    fontFamily: "serif",
                  }}
                >
                  LivMantra starts with understanding — not forcing change
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "1.125rem",
                    lineHeight: 1.7,
                  }}
                >
                  As a personal AI-guided health coach, we first help you understand how your system works before asking you to change anything.
                </Typography>
              </Box>
            </motion.div>

            <Grid 
              container 
              spacing={{ xs: 3, md: 4 }}
              sx={{
                px: { xs: 2, sm: 0 },
                justifyContent: "center",
              }}
            >
              {[
                {
                  icon: <Fingerprint sx={{ fontSize: { xs: 28, md: 32 } }} />,
                  title: "Decode Your Body",
                  description: "We help you identify your body type, your natural constitution, and your current imbalance.",
                  subtext: "So you know what's happening — and why.",
                },
                {
                  icon: <Psychology sx={{ fontSize: { xs: 28, md: 32 } }} />,
                  title: "Understand Your Mind",
                  description: "Your personality influences your discipline, stress response, consistency, and motivation.",
                  subtext: "Your plan is shaped around your nature — not against it.",
                },
                {
                  icon: <Nature sx={{ fontSize: { xs: 28, md: 32 } }} />,
                  title: "Guide You",
                  description: "Instead of strict rules, we use personalised daily rhythms and simple, realistic structures.",
                  subtext: "Not a diet. Not a challenge. Ongoing, personalised guidance.",
                },
              ].map((card, idx) => (
                <Grid item xs={12} sm={12} md={4} key={idx} sx={{ display: "flex", justifyContent: "center" }}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    style={{ width: "100%" }}
                  >
                    <Card
                      sx={{
                        p: { xs: 3, md: 4 },
                        width: "100%",
                        maxWidth: { xs: "100%", sm: "400px" },
                        height: "100%",
                        background: "rgba(0, 255, 255, 0.05)",
                        border: "1px solid rgba(0, 255, 255, 0.2)",
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "rgba(0, 255, 255, 0.5)",
                          boxShadow: "0 0 30px rgba(0, 255, 255, 0.3)",
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 48, md: 56 },
                          height: { xs: 48, md: 56 },
                          background: "rgba(0, 255, 255, 0.1)",
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#00ffff",
                          mb: 3,
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "#ffffff",
                          fontWeight: 700,
                          mb: 2,
                          fontSize: { xs: "1.25rem", md: "1.5rem" },
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          mb: 2,
                          lineHeight: 1.6,
                          fontSize: { xs: "0.9375rem", md: "1rem" },
                        }}
                      >
                        {card.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#00ffff",
                          fontWeight: 500,
                          fontSize: { xs: "0.8125rem", md: "0.875rem" },
                        }}
                      >
                        {card.subtext}
                      </Typography>
                    </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          </Box>
        </Container>
      </Box>

      {/* Offerings Section */}
      <Box id="offerings" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 }, background: "rgba(0, 0, 0, 0.3)" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Free Assessment Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card
              sx={{
                p: { xs: 3, sm: 4, md: 6 },
                mb: { xs: 6, md: 12 },
                mx: { xs: 2, sm: 0 },
                background: "rgba(10, 14, 39, 0.9)",
                border: "2px solid rgba(0, 255, 255, 0.3)",
                borderRadius: 3,
                boxShadow: "0 0 40px rgba(0, 255, 255, 0.2)",
                transform: { md: "translateY(-32px)" },
                width: { xs: "calc(100% - 32px)", sm: "100%" },
              }}
            >
              <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Chip
                    icon={<Lock sx={{ fontSize: 16 }} />}
                    label="Trusted & Secure"
                    sx={{
                      mb: 3,
                      background: "rgba(0, 255, 255, 0.1)",
                      border: "1px solid rgba(0, 255, 255, 0.3)",
                      color: "#00ffff",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: "1.75rem", md: "2.25rem" },
                      fontWeight: 400,
                      color: "#ffffff",
                      mb: 2,
                      fontFamily: "serif",
                    }}
                  >
                    Start with a free, doctor-designed assessment
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "1.125rem",
                      mb: 4,
                      lineHeight: 1.7,
                    }}
                  >
                    Get a complete picture of your health profile in simple, human language — so it actually makes sense.
                  </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartTest}
              endIcon={<AutoAwesome sx={{ color: "#ffd700", fontSize: { xs: 18, md: 20 } }} />}
              sx={{
                px: { xs: 3, sm: 4, md: 5 },
                py: { xs: 1.5, sm: 2, md: 2.5 },
                background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                color: "#0a0e27",
                borderRadius: "12px",
                fontWeight: 600,
                textTransform: "none",
                fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                width: { xs: "100%", sm: "auto" },
                whiteSpace: { xs: "normal", sm: "nowrap" },
                lineHeight: { xs: 1.4, sm: 1.5 },
                "& .MuiButton-endIcon": {
                  ml: { xs: 1, md: 1.5 },
                },
                "&:hover": {
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  boxShadow: "0 0 30px rgba(0, 255, 255, 0.6)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Start Free Body & Mind Assessment
            </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      p: { xs: 3, md: 4 },
                      background: "rgba(0, 255, 255, 0.05)",
                      border: "1px solid rgba(0, 255, 255, 0.2)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#ffffff",
                        fontWeight: 700,
                        mb: 3,
                        pb: 2,
                        borderBottom: "1px solid rgba(0, 255, 255, 0.2)",
                      }}
                    >
                      What you'll receive:
                    </Typography>
                    <List>
                      {[
                        { title: "Your Body Type", desc: "How your system is built" },
                        { title: "Your Innate Constitution", desc: "Your natural tendencies" },
                        { title: "Your Current Imbalance", desc: "What's off right now" },
                        { title: "Your Personality Style", desc: "How you form habits & handle stress" },
                      ].map((item, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 2 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <CheckCircle sx={{ color: "#00ffff", fontSize: 24 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: "1rem" }}>
                                {item.title}
                              </Typography>
                            }
                            secondary={
                              <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.875rem" }}>
                                {item.desc}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>
              </Grid>
            </Card>
          </motion.div>

          {/* What Happens Next */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  fontWeight: 400,
                  color: "#ffffff",
                  mb: 3,
                  fontFamily: "serif",
                }}
              >
                What happens next?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "1.125rem",
                  maxWidth: "700px",
                  mx: "auto",
                  lineHeight: 1.7,
                }}
              >
                Once you understand your body and mind, your personal AI-guided health coach helps you turn insight into action.
                <br />
                <Box component="span" sx={{ color: "#ffffff", fontWeight: 600 }}>
                  No pressure. No forced subscription. You choose when you're ready.
                </Box>
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <Grid 
                container 
                spacing={{ xs: 3, md: 4 }} 
                sx={{ 
                  maxWidth: "900px", 
                  width: "100%",
                  px: { xs: 2, sm: 0 },
                  justifyContent: "center",
                }}
              >
                <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                <Card
                  sx={{
                    p: { xs: 3, md: 4 },
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "450px", md: "100%" },
                    height: "100%",
                    background: "rgba(138, 43, 226, 0.1)",
                    border: "1px solid rgba(138, 43, 226, 0.3)",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "rgba(138, 43, 226, 0.5)",
                      boxShadow: "0 0 30px rgba(138, 43, 226, 0.3)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 48, md: 56 },
                      height: { xs: 48, md: 56 },
                      background: "rgba(138, 43, 226, 0.2)",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#8a2be2",
                      mb: 3,
                    }}
                  >
                    <AutoStories sx={{ fontSize: { xs: 24, md: 28 } }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#ffffff",
                      fontWeight: 400,
                      mb: 2,
                      fontFamily: "serif",
                      fontSize: { xs: "1.25rem", md: "1.5rem" },
                    }}
                  >
                    15-Day Personal Reset Plan
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      lineHeight: 1.6,
                      minHeight: { xs: "auto", md: "48px" },
                      fontSize: { xs: "0.9375rem", md: "1rem" },
                    }}
                  >
                    A self-guided, AI-generated plan based on your unique reports.
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                <Card
                    sx={{
                      p: { xs: 3, md: 4 },
                      width: "100%",
                      maxWidth: { xs: "100%", sm: "450px", md: "100%" },
                      height: "100%",
                      background: "rgba(0, 255, 255, 0.1)",
                      border: "2px solid rgba(0, 255, 255, 0.4)",
                      borderRadius: 2,
                      position: "relative",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "rgba(0, 255, 255, 0.6)",
                        boxShadow: "0 0 30px rgba(0, 255, 255, 0.4)",
                      },
                    }}
                  >
                <Chip
                  label="Recommended"
                  sx={{
                    position: "absolute",
                    top: { xs: 12, md: 16 },
                    right: { xs: 12, md: 16 },
                    background: "#00ffff",
                    color: "#0a0e27",
                    fontWeight: 700,
                    fontSize: { xs: "0.625rem", md: "0.75rem" },
                    textTransform: "uppercase",
                    height: { xs: 24, md: 32 },
                  }}
                />
                <Box
                  sx={{
                    width: { xs: 48, md: 56 },
                    height: { xs: 48, md: 56 },
                    background: "rgba(0, 255, 255, 0.2)",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#00ffff",
                    mb: 3,
                  }}
                >
                  <PersonAdd sx={{ fontSize: { xs: 24, md: 28 } }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#ffffff",
                    fontWeight: 400,
                    mb: 2,
                    fontFamily: "serif",
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                  }}
                >
                  30-Day Guided Personal Care
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 1.6,
                    minHeight: { xs: "auto", md: "48px" },
                    fontSize: { xs: "0.9375rem", md: "1rem" },
                  }}
                >
                  An AI-generated plan plus a doctor consultation — adjusted for medical conditions and real-life constraints.
                </Typography>
              </Card>
              </Grid>
              </Grid>
            </Box>

            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: "0.875rem",
                mt: 6,
              }}
            >
              You'll see full details only after completing the free assessment.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Audience Section */}
      <Box id="audience" sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 }, background: "rgba(10, 14, 39, 0.5)" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem" },
                fontWeight: 400,
                color: "#ffffff",
                textAlign: "center",
                mb: { xs: 6, md: 8 },
                fontFamily: "serif",
              }}
            >
              Who LivMantra Is For
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Grid 
                container 
                spacing={{ xs: 3, md: 4 }} 
                sx={{ 
                  maxWidth: "1000px", 
                  width: "100%",
                  px: { xs: 2, sm: 0 },
                  justifyContent: "center",
                }}
              >
                {/* Is For You */}
                <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                <Card
                  sx={{
                    p: { xs: 3, md: 4 },
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "500px" },
                    height: "100%",
                    background: "rgba(0, 255, 255, 0.05)",
                    border: "1px solid rgba(0, 255, 255, 0.2)",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#ffffff",
                      fontWeight: 400,
                      mb: 3,
                      pb: 2,
                      borderBottom: "1px solid rgba(0, 255, 255, 0.2)",
                      fontFamily: "serif",
                      fontSize: "1.5rem",
                    }}
                  >
                    LivMantra is for you if…
                  </Typography>
                  <List>
                    {[
                      "You're tired of conflicting health advice",
                      "You want clarity before taking action",
                      "You prefer sustainable habits over extremes",
                      "You respect science and human individuality",
                    ].map((text, i) => (
                      <ListItem key={i} sx={{ px: 0, py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              background: "rgba(0, 255, 255, 0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <CheckCircle sx={{ color: "#00ffff", fontSize: 16 }} />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography sx={{ color: "#ffffff", fontWeight: 500, fontSize: "1rem" }}>
                              {text}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>

              {/* Is Not For You */}
              <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                <Card
                  sx={{
                    p: { xs: 3, md: 4 },
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "500px" },
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontWeight: 400,
                      mb: 3,
                      pb: 2,
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                      fontFamily: "serif",
                      fontSize: "1.5rem",
                    }}
                  >
                    LivMantra may not be for you if…
                  </Typography>
                  <List>
                    {[
                      "You're looking for instant fixes or shortcuts",
                      "You want aggressive detoxes or hype-based plans",
                      "You believe the same routine works for everyone",
                    ].map((text, i) => (
                      <ListItem key={i} sx={{ px: 0, py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              background: "rgba(255, 255, 255, 0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Cancel sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 16 }} />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "1rem" }}>
                              {text}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
              </Grid>
            </Box>

            {/* Quote Section */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 6, md: 8 } }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem", lg: "2.25rem" },
                      fontWeight: 400,
                      color: "#ffffff",
                      textAlign: "center",
                      fontFamily: "serif",
                      maxWidth: "800px",
                      mx: "auto",
                      lineHeight: 1.4,
                    }}
                  >
                    You don't need discipline.
                    <br />
                    You need direction that makes sense.
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Our Principle Section */}
      <Box sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 }, background: "rgba(10, 14, 39, 0.5)" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: "center", maxWidth: "900px", mx: "auto" }}>
              {/* Heading */}
              <Typography
                variant="overline"
                sx={{
                  color: "#00ffff",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  fontSize: "0.875rem",
                  display: "block",
                  mb: 3,
                  textTransform: "uppercase",
                }}
              >
                OUR PRINCIPLE
              </Typography>

              {/* Main Statement */}
              <Box sx={{ mb: { xs: 4, md: 6 } }}>
                <Typography
                  variant="h2"
                  component="div"
                  sx={{
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" },
                    fontWeight: 400,
                    color: "#ffffff",
                    textAlign: "center",
                    fontFamily: "serif",
                    lineHeight: 1.2,
                  }}
                >
                  Health should feel clear,
                  <br />
                  not complicated.
                </Typography>
              </Box>

              {/* Core Principles */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "center",
                  alignItems: "center",
                  gap: { xs: 1, sm: 2, md: 3 },
                  mb: { xs: 6, md: 8 },
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
                    fontWeight: 500,
                    color: "#ffffff",
                    fontFamily: "sans-serif",
                  }}
                >
                  Ethical
                </Typography>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#ffffff",
                    display: { xs: "none", sm: "block" },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
                    fontWeight: 500,
                    color: "#ffffff",
                    fontFamily: "sans-serif",
                  }}
                >
                  Personal
                </Typography>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#ffffff",
                    display: { xs: "none", sm: "block" },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
                    fontWeight: 500,
                    color: "#ffffff",
                    fontFamily: "sans-serif",
                  }}
                >
                  Sustainable
                </Typography>
              </Box>

              {/* Supporting Text */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: { xs: "0.9375rem", sm: "1rem", md: "1.125rem" },
                    color: "rgba(255, 255, 255, 0.8)",
                    mb: 1,
                    fontFamily: "sans-serif",
                  }}
                >
                  Designed by doctors. Guided by science.
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.9375rem", sm: "1rem", md: "1.125rem" },
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "sans-serif",
                  }}
                >
                  Built around people — not algorithms alone.
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "header", "footer"])),
    },
  };
};
