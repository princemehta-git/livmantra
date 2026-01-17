import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  PlayArrow,
  AutoAwesome,
  Speed,
  Shield,
} from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation("common");

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
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 }, width: "100%" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box 
                  sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center",
                    mb: { xs: 3, md: 4 },
                    width: "100%",
                    mx: "auto",
                  }}
                >
                  <Logo
                    width={560}
                    height={224}
                    animated={false}
                    sx={{
                      width: { xs: "320px", sm: "440px", md: "560px" },
                      height: { xs: "128px", sm: "176px", md: "224px" },
                      mx: "auto",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  />
                </Box>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontWeight: 300,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1.1rem" },
                    mb: { xs: 4, md: 6 },
                    px: { xs: 2, sm: 0 },
                  }}
                >
                  {t("personalAIHealthCoach", { defaultValue: "Personal AI Health Coach" })}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push("/test")}
                  startIcon={<PlayArrow />}
                  sx={{
                    px: { xs: 4, sm: 5, md: 6 },
                    py: { xs: 1.5, sm: 2, md: 2.5 },
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                    color: "#0a0e27",
                    borderRadius: 0,
                    border: { xs: "1.5px solid #00ffff", md: "2px solid #00ffff" },
                    boxShadow: "0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(138, 43, 226, 0.2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    width: { xs: "90%", sm: "auto" },
                    maxWidth: { xs: "300px", sm: "none" },
                    "&:hover": {
                      background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                      boxShadow: "0 0 50px rgba(0, 255, 255, 0.8), inset 0 0 30px rgba(138, 43, 226, 0.3)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {t("buttons.start")}
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Grid */}
      <Box sx={{ position: "relative", zIndex: 1, py: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              { 
                icon: <AutoAwesome sx={{ fontSize: 48 }} />, 
                title: t("aiCoach", { defaultValue: "AI COACH" }),
                glow: "rgba(0, 255, 255, 0.3)",
              },
              { 
                icon: <Speed sx={{ fontSize: 48 }} />, 
                title: t("fastResults", { defaultValue: "FAST RESULTS" }),
                glow: "rgba(138, 43, 226, 0.3)",
              },
              { 
                icon: <Shield sx={{ fontSize: 48 }} />, 
                title: t("secure", { defaultValue: "SECURE" }),
                glow: "rgba(0, 255, 255, 0.3)",
              },
            ].map((feature, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                >
                  <Card
                    sx={{
                      p: 4,
                      background: "rgba(10, 14, 39, 0.6)",
                      border: "1px solid rgba(0, 255, 255, 0.2)",
                      borderRadius: 0,
                      backdropFilter: "blur(10px)",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: `linear-gradient(90deg, transparent, ${feature.glow}, transparent)`,
                        animation: "shimmer 2s linear infinite",
                      },
                      "&:hover": {
                        borderColor: "rgba(0, 255, 255, 0.5)",
                        boxShadow: `0 0 30px ${feature.glow}`,
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box
                      sx={{
                        color: "#00ffff",
                        mb: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#00ffff",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontSize: "0.9rem",
                      }}
                    >
                      {feature.title}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>



      {/* CTA Section */}
      <Box sx={{ position: "relative", zIndex: 1, py: 12 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/test")}
              startIcon={<PlayArrow />}
              sx={{
                px: { xs: 4, sm: 6, md: 8 },
                py: { xs: 1.5, sm: 2.5, md: 3 },
                fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.2rem" },
                fontWeight: 700,
                background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                color: "#0a0e27",
                borderRadius: 0,
                border: { xs: "1.5px solid #00ffff", md: "2px solid #00ffff" },
                boxShadow: "0 0 40px rgba(0, 255, 255, 0.6), inset 0 0 30px rgba(138, 43, 226, 0.2)",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                width: { xs: "90%", sm: "auto" },
                maxWidth: { xs: "300px", sm: "none" },
                "&:hover": {
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  boxShadow: "0 0 60px rgba(0, 255, 255, 0.9), inset 0 0 40px rgba(138, 43, 226, 0.3)",
                  transform: "translateY(-3px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {t("launchSystem", { defaultValue: "Launch System" })}
            </Button>
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
