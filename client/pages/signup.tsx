import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "next-i18next";
import Header from "../components/Header";
import PhoneInput from "../components/PhoneInput";

export default function SignupPage() {
  const router = useRouter();
  const { signup, googleLogin, user, loading } = useAuth();
  const { t } = useTranslation("auth");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/test-transition");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("signup.passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("signup.passwordTooShort"));
      return;
    }

    setSubmitting(true);

    try {
      await signup(name, email, phone, password);
      router.push("/test-transition");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("");
    setSubmitting(true);
    try {
      await googleLogin(credentialResponse.credential);
      router.push("/test-transition");
    } catch (err: any) {
      setError(err.message || "Google signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google signup failed");
  };

  if (loading) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0a0e27",
        position: "relative",
        overflow: "hidden",
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

      <Header />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              background: "rgba(10, 14, 39, 0.8)",
              border: "2px solid rgba(0, 255, 255, 0.3)",
              borderRadius: 0,
              p: 4,
              backdropFilter: "blur(20px)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "#00ffff",
                fontWeight: 800,
                mb: 1,
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {t("signup.title")}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "center",
                mb: 4,
              }}
            >
              {t("signup.subtitle")}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, bgcolor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label={t("signup.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
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
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.6)",
                  },
                }}
              />

              <TextField
                fullWidth
                label={t("signup.email")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
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
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.6)",
                  },
                }}
              />

              <TextField
                fullWidth
                label={t("signup.phone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
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
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.6)",
                  },
                }}
              />

              <TextField
                fullWidth
                label={t("signup.password")}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
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
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.6)",
                  },
                }}
              />

              <TextField
                fullWidth
                label={t("signup.confirmPassword")}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
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
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.6)",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={submitting}
                sx={{
                  py: 1.5,
                  mb: 2,
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  color: "#0a0e27",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  "&:hover": {
                    background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                    boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)",
                  },
                }}
              >
                {submitting ? t("signup.submitting") : t("signup.submit")}
              </Button>

              <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
                <Divider sx={{ flex: 1, borderColor: "rgba(0, 255, 255, 0.3)" }} />
                <Typography
                  variant="body2"
                  sx={{
                    px: 2,
                    color: "rgba(255, 255, 255, 0.6)",
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  {t("signup.or")}
                </Typography>
                <Divider sx={{ flex: 1, borderColor: "rgba(0, 255, 255, 0.3)" }} />
              </Box>

              <Box sx={{ display: "none", justifyContent: "center", mb: 2 }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                />
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  {t("signup.hasAccount")}{" "}
                  <Link
                    href="/login"
                    sx={{
                      color: "#00ffff",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {t("signup.loginLink")}
                  </Link>
                </Typography>
              </Box>
            </form>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["auth", "common", "header"])),
    },
  };
};