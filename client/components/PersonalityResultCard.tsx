import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Divider, Button, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { EmojiEvents, Psychology, TrendingUp, ArrowBack, ArrowForward, Feedback, Share, WhatsApp } from "@mui/icons-material";
import { DIMENSIONS } from "../data/personalityQuestions";
import ParticleExplosion from "./ParticleExplosion";
import { playSoundEffect } from "../lib/audioUtils";
import FeedbackDialog from "./FeedbackDialog";
import ShareDialog from "./ShareDialog";
import { submitFeedback } from "../lib/api";

interface PersonalityResultCardProps {
  snapshot: any;
  mergedReport?: any;
  resultId?: string;
  userId?: string;
}

export default function PersonalityResultCard({
  snapshot,
  mergedReport,
  resultId,
  userId,
}: PersonalityResultCardProps) {
  const [currentDimension, setCurrentDimension] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [sectionChangeTrigger, setSectionChangeTrigger] = useState(0);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [showCursor, setShowCursor] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [feedbackMandatory, setFeedbackMandatory] = useState(false);
  const reportContainerRef = React.useRef<HTMLDivElement>(null);

  if (!snapshot) {
    return null;
  }

  const { code, dimensions, personalityType, personalityName, score } = snapshot;
  const enrichedDimensions = mergedReport?.dimensions || [];

  // Trigger particles on dimension change
  useEffect(() => {
    if (sectionChangeTrigger > 0) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentDimension, sectionChangeTrigger]);

  const handleDimensionChange = (newDimension: number) => {
    playSoundEffect();
    setSectionChangeTrigger((prev) => prev + 1);
    setCurrentDimension(newDimension);
  };

  // Auto-show feedback when user has scrolled ~80% of the Habit tab (near end)
  useEffect(() => {
    const container = reportContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (feedbackShown || currentDimension !== 5) return;

      const containerTop = container.offsetTop;
      const containerHeight = container.scrollHeight || 1;
      const scrollPosition = window.scrollY + window.innerHeight;
      const progress = Math.max(
        0,
        Math.min((scrollPosition - containerTop) / containerHeight, 1)
      );

      if (progress >= 0.8) {
        setFeedbackShown(true);
        setFeedbackMandatory(true);
        setShowFeedbackDialog(true);
      }
    };

    handleScroll(); // check immediately in case user reloads near the end
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentDimension, feedbackShown]);

  const handleContactUs = () => {
    // Build WhatsApp message for personality test
    const personalityTypeName = personalityName || personalityType || "Unknown";
    const dimensionNames = ["MIND", "STRESS", "HEALTH", "SOCIAL", "ENERGY", "HABIT"];
    const currentDim = enrichedDimensions[currentDimension];
    const currentDimName = currentDim ? dimensionNames[currentDim.dimensionResult.dimensionIndex] || "Unknown" : "Unknown";
    
    const message = `Hi, I completed the *_Personality Test_* and here are my results:

*My Personality Type:* ${personalityTypeName}
*Current Dimension:* ${currentDimName}
*Personality Code:* ${code || "N/A"}

Please provide me:
• Detailed diet plan
• Exercise recommendations
• Sleep scheduling guidance
• Emotional training plan
• Daily routine mapping
• Expert doctor consultation`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp number - same as BBA
    const whatsappNumber = "918055079055";
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  // Color mapping for dimensions
  const getDimensionColor = (dimensionIndex: number) => {
    const colors = [
      "#00ffff", // Mind Style
      "#ff69b4", // Stress Response (pink - second)
      "#ff6b6b", // Health Discipline
      "#51cf66", // Social & Emotional
      "#ffd700", // Energy & Activity
      "#8a2be2", // Habit & Change (purple - last)
    ];
    return colors[dimensionIndex] || "#00ffff";
  };

  // Get variant color
  const getVariantColor = (variant: string) => {
    switch (variant) {
      case "A":
        return "#00ffff"; // Left pole dominant
      case "C":
        return "#8a2be2"; // Right pole dominant
      case "B":
        return "#51cf66"; // Balanced
      default:
        return "#ffffff";
    }
  };

  return (
    <Box
      ref={reportContainerRef}
      sx={{
        position: "relative",
      }}
    >
      <ParticleExplosion trigger={showParticles} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          sx={{
            background: "rgba(10, 14, 39, 0.9)",
            border: "2px solid rgba(0, 255, 255, 0.3)",
            borderRadius: 0,
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 50px rgba(0, 255, 255, 0.2), inset 0 0 30px rgba(138, 43, 226, 0.1)",
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
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          {/* Personality Name Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <EmojiEvents
                sx={{
                  fontSize: { xs: 48, sm: 64, md: 80 },
                  color: "#ffd700",
                  filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))",
                  mb: 2,
                }}
              />
            </motion.div>
            {personalityName && (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: "#00ffff",
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.25rem" },
                  lineHeight: 1.2,
                }}
              >
                {personalityName}
              </Typography>
            )}
            {personalityType && (
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  mt: 1,
                }}
              >
                {personalityType.descriptor}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 4, borderColor: "rgba(0, 255, 255, 0.2)" }} />

          {/* Dimension Reports Navigation */}
          <Box sx={{ mb: 4 }}>
            

            {/* Dimension Tabs - Box Style Buttons (Like BBA AchievementBadge) */}
            <Grid container spacing={{ xs: 0.5, sm: 1 }} sx={{ mb: 3 }}>
              {enrichedDimensions.map((item: any, idx: number) => {
                const dim = item.dimensionResult;
                const dimColor = getDimensionColor(dim.dimensionIndex);
                const isActive = currentDimension === idx;
                const dimensionNames = [
                  "MIND", "STRESS", "HEALTH", "SOCIAL", "ENERGY", "HABIT"
                ];
                
                return (
                  <Grid item xs={6} sm={4} md={2} key={idx}>
                    <motion.div
                      initial={isActive ? { scale: 0, rotate: -180 } : {}}
                      animate={isActive ? { scale: 1, rotate: 0 } : {}}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <Box
                        onClick={() => handleDimensionChange(idx)}
                        onMouseMove={(e) => {
                          setCursorPos({ x: e.clientX, y: e.clientY });
                          setShowCursor(true);
                        }}
                        onMouseLeave={() => setShowCursor(false)}
                        sx={{
                          p: { xs: 1.5, sm: 2 },
                          background: isActive
                            ? `${dimColor}20`
                            : `${dimColor}10`,
                          border: isActive
                            ? `2px solid ${dimColor}`
                            : `1px solid ${dimColor}40`,
                          borderRadius: { xs: 1, sm: 2 },
                          textAlign: "center",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          position: "relative",
                          opacity: isActive ? 1 : 0.7,
                          boxShadow: isActive
                            ? `0 0 20px ${dimColor}40`
                            : "none",
                          "&:hover": {
                            boxShadow: `0 0 25px ${dimColor}50`,
                            transform: { xs: "scale(1.02)", sm: "scale(1.05)" },
                            borderColor: dimColor,
                            opacity: 1,
                          },
                          "&:active": {
                            transform: "scale(0.98)",
                          },
                        }}
                      >
                        {/* Colored Dot */}
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: dimColor,
                            boxShadow: `0 0 12px ${dimColor}`,
                            mx: "auto",
                            mb: 1,
                          }}
                        />
                        
                        {/* Dimension Name */}
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: isActive ? dimColor : "rgba(255, 255, 255, 0.7)",
                            fontWeight: isActive ? 700 : 600,
                            fontSize: { xs: "0.85rem", sm: "1rem", md: "1.1rem" },
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            fontFamily: "monospace",
                            mb: 0.5,
                            lineHeight: { xs: 1.2, sm: 1.4 },
                          }}
                        >
                          {dimensionNames[dim.dimensionIndex] || dim.dimensionName.split(" ")[0]}
                        </Typography>
                        
                        {/* Letter Code Below */}
                        <Typography
                          variant="caption"
                          sx={{
                            color: isActive ? dimColor : "rgba(255, 255, 255, 0.5)",
                            fontSize: { xs: "0.65rem", sm: "0.75rem" },
                            fontFamily: "monospace",
                            display: { xs: "none", sm: "block" },
                          }}
                        >
                          {dim.code}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>

            {/* Current Dimension Report */}
            {enrichedDimensions[currentDimension] && (
              <DimensionReport
                dimensionData={enrichedDimensions[currentDimension]}
                dimensionIndex={currentDimension}
                totalDimensions={enrichedDimensions.length}
                onPrevious={() => handleDimensionChange(Math.max(0, currentDimension - 1))}
                onNext={() =>
                  handleDimensionChange(
                    Math.min(enrichedDimensions.length - 1, currentDimension + 1)
                  )
                }
                onMouseMove={(e) => {
                  setCursorPos({ x: e.clientX, y: e.clientY });
                  setShowCursor(true);
                }}
                onMouseLeave={() => setShowCursor(false)}
              />
            )}
          </Box>

          {/* Consultation CTA Banner - Sticky */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Paper
              sx={{
                position: "sticky",
                bottom: 0,
                mt: 4,
                p: 2,
                background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                color: "white",
                boxShadow:
                  "0 -10px 30px rgba(0, 0, 0, 0.6), 0 0 35px rgba(0, 255, 255, 0.4)",
                zIndex: 1000,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5 }}>
                <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.8, 
                      fontSize: { xs: "1.2rem", sm: "1.4rem" }, 
                      lineHeight: 1.3,
                      color: "#0f172a",
                      textShadow: "0 1px 2px rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    Need Expert Guidance for Healthier Body and Mind
                  </Typography>
                  <Box 
                    sx={{ 
                      display: "grid", 
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                      gap: { xs: 0.3, sm: 0.4 },
                      fontSize: { xs: "0.75rem", sm: "0.8rem" }
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#0f172a",
                          mt: 0.5,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "#0f172a", fontSize: "inherit", lineHeight: 1.4 }}>
                        <strong style={{ color: "#0f172a", fontWeight: 700 }}>Diet Plan</strong> – tailored to your needs
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#0f172a",
                          mt: 0.5,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "#0f172a", fontSize: "inherit", lineHeight: 1.4 }}>
                        <strong style={{ color: "#0f172a", fontWeight: 700 }}>Workout Plan</strong> – safe, effective movement
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#0f172a",
                          mt: 0.5,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "#0f172a", fontSize: "inherit", lineHeight: 1.4 }}>
                        <strong style={{ color: "#0f172a", fontWeight: 700 }}>Sleep Scheduling</strong> – deep, quality sleep
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#0f172a",
                          mt: 0.5,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "#0f172a", fontSize: "inherit", lineHeight: 1.4 }}>
                        <strong style={{ color: "#0f172a", fontWeight: 700 }}>Emotional Training</strong> – calm, healthy mind
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#0f172a",
                          mt: 0.5,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "#0f172a", fontSize: "inherit", lineHeight: 1.4 }}>
                        <strong style={{ color: "#0f172a", fontWeight: 700 }}>Daily Routine Mapping</strong> – habit alignment
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#0f172a",
                          mt: 0.5,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "#0f172a", fontSize: "inherit", lineHeight: 1.4 }}>
                        <strong style={{ color: "#0f172a", fontWeight: 700 }}>Expert Doctor Consultation</strong> – medication & suppliment
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "#0f172a", 
                        fontSize: { xs: "0.85rem", sm: "0.9rem" },
                        fontWeight: 600,
                      }}
                    >
                      Only @
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: "#0f172a", 
                        fontSize: { xs: "1.1rem", sm: "1.25rem" },
                        fontWeight: 800,
                        lineHeight: 1,
                      }}
                    >
                      ₹2,499/-
                    </Typography>
                  </Box>
                </Box>
                <Box
                  component={motion.div}
                  animate={{
                    scale: [1, 1.03, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={handleContactUs}
                    startIcon={<WhatsApp />}
                    sx={{
                      backgroundColor: "#0f172a",
                      color: "#ffffff",
                      fontWeight: 700,
                      px: 2.5,
                      py: 1,
                      fontSize: "0.9rem",
                      borderRadius: "8px",
                      border: "2px solid #ffffff",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)",
                      animation: "contactButtonGlow 2.5s ease-in-out infinite",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)",
                        animation: "contactButtonShimmer 3s infinite",
                      },
                      "&:hover": {
                        backgroundColor: "#1e293b",
                        borderColor: "#ffffff",
                        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.4), 0 3px 6px rgba(0, 0, 0, 0.3)",
                        transform: "translateY(-1px)",
                      },
                      "& .MuiButton-startIcon": {
                        transition: "transform 0.3s ease",
                        color: "#ffffff",
                      },
                      "&:hover .MuiButton-startIcon": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    Contact Us
                  </Button>
                </Box>
              </Box>
            </Paper>
          </motion.div>

          {/* Feedback and Share Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 3,
                mb: 2,
                flexWrap: "wrap",
                position: "relative",
                zIndex: 1001,
              }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  startIcon={<Feedback />}
                  onClick={() => setShowFeedbackDialog(true)}
                  disabled={false}
                  sx={{
                    color: "#00ffff",
                    borderColor: "#00ffff",
                    px: 3,
                    py: 1.5,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    pointerEvents: "auto",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#00ffff",
                      backgroundColor: "rgba(0, 255, 255, 0.1)",
                      boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
                    },
                    "&.Mui-disabled": {
                      borderColor: "rgba(0, 255, 255, 0.3)",
                      color: "rgba(0, 255, 255, 0.3)",
                    },
                  }}
                >
                  Feedback
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={() => setShowShareDialog(true)}
                  sx={{
                    color: "#8a2be2",
                    borderColor: "#8a2be2",
                    px: 3,
                    py: 1.5,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "#8a2be2",
                      backgroundColor: "rgba(138, 43, 226, 0.1)",
                      boxShadow: "0 0 20px rgba(138, 43, 226, 0.3)",
                    },
                  }}
                >
                  Share
                </Button>
              </motion.div>
            </Box>
          </motion.div>

          
          </CardContent>
        </Card>
      </motion.div>

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={showFeedbackDialog}
        onClose={() => {
          setShowFeedbackDialog(false);
          setFeedbackMandatory(false);
        }}
        testType="PERSONALITY"
        mandatory={feedbackMandatory}
        onSubmit={async (feedback) => {
          if (!resultId || !userId) {
            alert("Unable to submit feedback: Missing result ID or user ID");
            return;
          }
          try {
            await submitFeedback({
              userId,
              resultId,
              rating: feedback.rating,
              comment: feedback.comment,
            });
            alert("Thank you for your feedback!");
            setFeedbackMandatory(false);
          } catch (error: any) {
            console.error("Error submitting feedback:", error);
            alert(error.response?.data?.error || "Failed to submit feedback. Please try again.");
          }
        }}
      />

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        testType="PERSONALITY"
      />

      {/* Cursor Effect */}
      {showCursor && cursorPos && (
        <Box
          sx={{
            position: "fixed",
            top: cursorPos.y,
            left: cursorPos.x,
            width: 28,
            height: 28,
            transform: "translate(-50%, -50%)",
            borderRadius: "999px",
            pointerEvents: "none",
            zIndex: 2000,
            mixBlendMode: "screen",
            animation: "cursorPulse 1.4s ease-in-out infinite",
            background: (() => {
              const currentDim = enrichedDimensions[currentDimension];
              if (!currentDim) return "radial-gradient(circle, rgba(0, 255, 255, 0.9) 0%, transparent 70%)";
              const dimColor = getDimensionColor(currentDim.dimensionResult.dimensionIndex);
              return `radial-gradient(circle, ${dimColor}90 0%, ${dimColor}60 40%, transparent 70%)`;
            })(),
            boxShadow: (() => {
              const currentDim = enrichedDimensions[currentDimension];
              if (!currentDim) return "0 0 24px rgba(0, 255, 255, 0.9)";
              const dimColor = getDimensionColor(currentDim.dimensionResult.dimensionIndex);
              return `0 0 24px ${dimColor}90, 0 0 40px ${dimColor}60`;
            })(),
          }}
        />
      )}
    </Box>
  );
}

// Dimension Report Component
function DimensionReport({
  dimensionData,
  dimensionIndex,
  totalDimensions,
  onPrevious,
  onNext,
  onMouseMove,
  onMouseLeave,
}: {
  dimensionData: any;
  dimensionIndex: number;
  totalDimensions: number;
  onPrevious: () => void;
  onNext: () => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}) {
  const { dimensionResult, template } = dimensionData;
  const dimColor = getDimensionColor(dimensionResult.dimensionIndex);

  if (!template) {
    return (
      <Card
        sx={{
          background: "rgba(10, 14, 39, 0.6)",
          border: `1px solid ${dimColor}40`,
          borderRadius: 0,
          p: { xs: 2, sm: 3 },
        }}
      >
        <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
          Report template not available for this dimension.
        </Typography>
      </Card>
    );
  }

  const sections = [
    template.section1,
    template.section2,
    template.section3,
    template.section4,
    template.section5,
    template.section6,
    template.section7,
  ];

  return (
    <motion.div
      key={dimensionIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          p: { xs: 2, md: 2.5 },
          mt: 2,
          position: "relative",
        }}
      >
        <Box
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          sx={{
            mb: 2,
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            px: { xs: 2, md: 2.5 },
            py: { xs: 2, md: 2.5 },
            background: "rgba(15, 23, 42, 0.92)",
            border: `1px solid ${dimColor}40`,
            boxShadow: `0 0 28px ${dimColor}30`,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: `0 0 35px ${dimColor}50`,
              borderColor: `${dimColor}60`,
            },
          }}
        >
          {/* Content wrapper */}
          <Box sx={{ position: "relative", zIndex: 2, userSelect: "none", WebkitUserSelect: "none" }}>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{
                  color: dimColor,
                  fontWeight: 900,
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2rem" },
                }}
              >
                {template.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                }}
              >
                {template.subtitle}
              </Typography>
            </Box>

            {/* Sections */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {sections.map((section, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      pb: 2,
                      borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: dimColor,
                        fontWeight: 700,
                        mb: 0.75,
                        fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                        letterSpacing: "0.01em",
                        lineHeight: 1.3,
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(148, 163, 184, 0.85)",
                        lineHeight: 1.65,
                        fontSize: "0.875rem",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {section.content}
                    </Typography>
                  </Box>
                </motion.div>
              ))}

              {/* Final Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <Box
                  sx={{
                    mt: 2.5,
                    p: 2,
                    bgcolor: `${dimColor}15`,
                    borderRadius: 1.5,
                    borderLeft: `3px solid ${dimColor}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: dimColor,
                      fontWeight: 700,
                      mb: 0.75,
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      letterSpacing: "0.01em",
                      lineHeight: 1.3,
                    }}
                  >
                    {template.finalNote.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.65,
                      fontStyle: "italic",
                      color: "rgba(148, 163, 184, 0.9)",
                      whiteSpace: "pre-line",
                      fontSize: "0.875rem",
                    }}
                  >
                    {template.finalNote.content}
                  </Typography>
                </Box>
              </motion.div>
            </Box>

            {/* Navigation */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<ArrowBack sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />}
                onClick={onPrevious}
                disabled={dimensionIndex === 0}
                sx={{
                  color: dimColor,
                  borderColor: dimColor,
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.75, sm: 1 },
                  fontSize: { xs: "0.7rem", sm: "0.85rem" },
                  minWidth: { xs: "auto", sm: "auto" },
                  "&:hover": {
                    borderColor: dimColor,
                    backgroundColor: `${dimColor}20`,
                  },
                  "&.Mui-disabled": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                Back
              </Button>

              {/* Page Indicator */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                {Array.from({ length: totalDimensions }).map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: dimensionIndex === index ? 32 : 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: dimensionIndex === index ? dimColor : "rgba(255, 255, 255, 0.3)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (onPrevious && onNext) {
                        if (index < dimensionIndex) {
                          onPrevious();
                        } else if (index > dimensionIndex) {
                          onNext();
                        }
                      }
                    }}
                  />
                ))}
                <Typography
                  variant="body2"
                  sx={{
                    ml: { xs: 1, sm: 2 },
                    color: "rgba(255, 255, 255, 0.7)",
                    fontWeight: 500,
                    fontSize: { xs: "0.7rem", sm: "0.875rem" },
                  }}
                >
                  {dimensionIndex + 1} / {totalDimensions}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="small"
                endIcon={<ArrowForward sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />}
                onClick={onNext}
                disabled={dimensionIndex === totalDimensions - 1}
                sx={{
                  background: `linear-gradient(135deg, ${dimColor} 0%, ${dimColor}80 100%)`,
                  color: "#0a0e27",
                  fontWeight: 700,
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.75, sm: 1 },
                  fontSize: { xs: "0.7rem", sm: "0.85rem" },
                  minWidth: { xs: "auto", sm: "auto" },
                  "&:hover": {
                    background: `linear-gradient(135deg, ${dimColor} 0%, ${dimColor}80 100%)`,
                    boxShadow: `0 0 20px ${dimColor}50`,
                  },
                  "&.Mui-disabled": {
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

// Helper function to get dimension color
function getDimensionColor(dimensionIndex: number): string {
  const colors = [
    "#00ffff", // Mind Style
    "#ff69b4", // Stress Response (swapped with Habit - now pink)
    "#ff6b6b", // Health Discipline
    "#51cf66", // Social & Emotional
    "#ffd700", // Energy & Activity
    "#8a2be2", // Habit & Change (swapped with Stress - now purple)
  ];
  return colors[dimensionIndex] || "#00ffff";
}
