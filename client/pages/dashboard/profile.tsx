import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  Card,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import ProtectedRoute from "../../components/ProtectedRoute";
import ProfileImageUpload from "../../components/ProfileImageUpload";
import PhoneInput from "../../components/PhoneInput";
import CountryAutocomplete from "../../components/CountryAutocomplete";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile } from "../../lib/api";
import Header from "../../components/Header";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [state, setState] = useState("");
  const [nationality, setNationality] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setDob(user.dob ? new Date(user.dob).toISOString().split("T")[0] : "");
      setGender(user.gender || "");
      setState(user.state || "");
      setNationality(user.nationality || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const response = await updateProfile({
        name,
        phone,
        dob: dob || undefined,
        gender: gender || undefined,
        state: state || undefined,
        nationality: nationality || undefined,
      });
      updateUser(response.data.user);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const profileImageUrl = user?.profileImage
    ? `${API_BASE}${user.profileImage}`
    : null;

  return (
    <ProtectedRoute>
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

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "#00ffff",
                fontWeight: 800,
                mb: 4,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Edit Profile
            </Typography>

            <Card
              sx={{
                p: 4,
                background: "rgba(10, 14, 39, 0.8)",
                border: "2px solid rgba(0, 255, 255, 0.3)",
                borderRadius: 0,
                backdropFilter: "blur(20px)",
              }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 3, bgcolor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3, bgcolor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                  Profile updated successfully! Redirecting...
                </Alert>
              )}

              <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
                <ProfileImageUpload
                  currentImage={profileImageUrl}
                  onUploadSuccess={() => setSuccess(true)}
                />
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      sx={{
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
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <PhoneInput
                      value={phone}
                      onChange={setPhone}
                      label="Phone"
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
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
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      sx={{
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
                    >
                      <MenuItem value="">Select Gender</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                      <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      sx={{
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
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CountryAutocomplete
                      value={nationality}
                      onChange={setNationality}
                      label="Nationality"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    sx={{
                      background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                      color: "#0a0e27",
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      "&:hover": {
                        background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                        boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)",
                      },
                    }}
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => router.push("/dashboard")}
                    sx={{
                      color: "#00ffff",
                      borderColor: "rgba(0, 255, 255, 0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      "&:hover": {
                        borderColor: "#00ffff",
                        background: "rgba(0, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            </Card>
          </motion.div>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}

