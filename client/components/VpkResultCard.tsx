import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Button,
  Collapse,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SectionProgress from "./SectionProgress";
import StatsDashboard from "./StatsDashboard";
import ParticleExplosion from "./ParticleExplosion";
import AchievementBadge from "./AchievementBadge";

// Enhanced type definitions
type DoshaCounts = {
  vata: number;
  pitta: number;
  kapha: number;
};

type BodyTypeDetailed = {
  primary: "Ectomorph" | "Mesomorph" | "Endomorph";
  modifier: "Vata" | "Pitta" | "Kapha" | null;
  countsA: DoshaCounts;
};

type PrakritiDetailed = {
  primary: "Vata" | "Pitta" | "Kapha";
  modifier: "Vata" | "Pitta" | "Kapha" | null;
  countsB: DoshaCounts;
};

type VikritiImbalance = {
  dosha: "Vata" | "Pitta" | "Kapha";
  count: number;
  level: "dominant" | "secondary" | "mild";
};

type VikritiDetailed = {
  summary: string;
  imbalances: VikritiImbalance[];
  countsC: DoshaCounts;
  report_recommendation: string;
};

type MergedReport = {
  bodyParagraph: string;
  bodyModifierLine: string | null;
  bodyCommonFeeling: string;
  bodyTip: string;
  prakritiParagraph: string;
  prakritiModifierLine: string | null;
  prakritiStrengths: string[];
  prakritiTip: string;
  vikritiParagraph: string;
  vikritiQuickTip: string;
  vikritiEmpathyLine: string;
  paidPreviewText: string;
  bodyCodeReport: {
    title: string;
    subtitle: string;
    howYourBodyLives: string;
    howYourMindMoves?: string;
    howYourMindWorks?: string;
    howStressShowsUp: string;
    earlySignals: string[];
    dailyAnchors: string[];
    closingMessage: string;
  } | null;
  prakritiCodeReport: {
    title: string;
    subtitle: string;
    yourNaturalNature: string;
    howYouThinkAndRespond: string;
    yourSuperpowers: string[];
    whenThisGetsTooMuch: string;
    lifeStageAndSeasonSensitivity: string;
    anchors: string[];
    anchorsTitle: string;
    closingMessage: string;
  } | null;
  vikritiCodeReport: {
    title: string;
    subtitle: string;
    whatsHappening: string;
    whyFeelingLikeThis: string;
    commonSymptoms: string[];
    earlyWarningsTitle: string;
    earlyWarnings: string;
    whatYourBodyNeeds: string[];
    closingMessage: string;
  } | null;
};

type ResultSnapshot = {
  bodyType: string;
  prakriti: string;
  vikriti: string;
  shortEmotionalLine: string;
  score?: number;
  bodyTypeDetailed?: BodyTypeDetailed;
  prakritiDetailed?: PrakritiDetailed;
  vikritiDetailed?: VikritiDetailed;
  reportId?: number | null;
  debug?: { rawImbalance: number };
  // Optional elemental codes from backend (B1-9, P1-9, V0-9)
  bodyCode?: string;
  prakritiCode?: string;
  vikritiCode?: string;
};

type Props = {
  snapshot: ResultSnapshot;
  mergedReport?: MergedReport | null;
  currentSection?: number; // 0: Body Type, 1: Prakriti, 2: Vikriti
  onSectionChange?: (section: number) => void;
};

const getLevelColor = (level: "dominant" | "secondary" | "mild"): string => {
  switch (level) {
    case "dominant":
      return "#ef4444";
    case "secondary":
      return "#f59e0b";
    case "mild":
      return "#10b981";
    default:
      return "#6b7280";
  }
};

const getDoshaColor = (dosha: string): string => {
  switch (dosha.toLowerCase()) {
    case "vata":
      return "#6366f1";
    case "pitta":
      return "#ec4899";
    case "kapha":
      return "#10b981";
    default:
      return "#6b7280";
  }
};

const getBodyTypeColor = (bodyType: string): string => {
  switch (bodyType) {
    case "Ectomorph":
      return "#6366f1";
    case "Mesomorph":
      return "#ec4899";
    case "Endomorph":
      return "#10b981";
    default:
      return "#6b7280";
  }
};

type ElementKind = "air" | "fire" | "earth";

// Map B_/P_/V_ codes to elemental themes
const getElementsForCode = (code?: string): ElementKind[] => {
  if (!code) return [];

  const prefix = code[0];
  const n = parseInt(code.slice(1), 10);
  if (Number.isNaN(n)) return [];

  // V0 → no clear imbalance → no aura
  if (prefix === "V" && n === 0) return [];

  const mapNumber = (num: number): ElementKind[] => {
    switch (num) {
      case 1:
        return ["air"];
      case 2:
        return ["air", "fire"];
      case 3:
        return ["air", "earth"];
      case 4:
        return ["fire"];
      case 5:
        return ["fire", "air"];
      case 6:
        return ["fire", "earth"];
      case 7:
        return ["earth"];
      case 8:
        return ["earth", "air"];
      case 9:
        return ["earth", "fire"];
      default:
        return [];
    }
  };

  if (prefix === "B" || prefix === "P" || prefix === "V") {
    return mapNumber(n);
  }

  return [];
};

function ElementAura({ elements }: { elements: ElementKind[] }) {
  if (!elements.length) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        inset: -24,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.9,
      }}
    >
      {elements.includes("air") && (
        <Box
          sx={{
            position: "absolute",
            top: "-20%",
            left: "-15%",
            width: "160%",
            height: "80%",
            background:
              "radial-gradient(circle at 5% 10%, rgba(56,189,248,0.55), transparent 55%), radial-gradient(circle at 80% 0%, rgba(129,140,248,0.4), transparent 60%)",
            filter: "blur(22px)",
            animation: "aeroFlow 20s ease-in-out infinite",
            mixBlendMode: "screen",
          }}
        />
      )}
      {false && elements.includes("fire") && (
        <>
          <Box
            sx={{
              position: "absolute",
              bottom: "-20%",
              right: "-15%",
              width: "150%",
              height: "80%",
              background:
                "radial-gradient(circle at 100% 100%, rgba(248,113,113,0.6), transparent 60%), radial-gradient(circle at 60% 120%, rgba(251,191,36,0.5), transparent 65%)",
              filter: "blur(26px)",
              animation: "pyroWave 18s ease-in-out infinite",
              mixBlendMode: "screen",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "-5%",
              right: "5%",
              width: "60%",
              height: "40%",
              background:
                "radial-gradient(circle at 50% 0%, rgba(252,211,77,0.6), transparent 70%)",
              filter: "blur(20px)",
              animation: "pyroWave 24s ease-in-out infinite reverse",
              mixBlendMode: "screen",
            }}
          />
        </>
      )}
      {elements.includes("earth") && (
        <Box
          sx={{
            position: "absolute",
            bottom: "-10%",
            left: "10%",
            width: "130%",
            height: "70%",
            background:
              "radial-gradient(circle at 50% 120%, rgba(16,185,129,0.55), transparent 65%), linear-gradient(to top, rgba(15,118,110,0.55), rgba(15,23,42,0.0))",
            filter: "blur(24px)",
            animation: "geoDrift 26s ease-in-out infinite",
            mixBlendMode: "screen",
          }}
        />
      )}
    </Box>
  );
}

const getPrimaryElement = (elements: ElementKind[]): ElementKind | null => {
  if (!elements.length) return null;
  if (elements.includes("fire")) return "fire";
  if (elements.includes("air")) return "air";
  if (elements.includes("earth")) return "earth";
  return elements[0] || null;
};

// Map code to display type name (Aero/Pyro/Geo)
const getTypeNameForCode = (code?: string): string | null => {
  if (!code) return null;
  
  const prefix = code[0];
  const n = parseInt(code.slice(1), 10);
  if (Number.isNaN(n)) return null;

  // V0 → no clear imbalance → return null
  if (prefix === "V" && n === 0) return null;

  const elements = getElementsForCode(code);
  const primary = getPrimaryElement(elements);
  
  switch (primary) {
    case "air":
      return "Aero";
    case "fire":
      return "Pyro";
    case "earth":
      return "Geo";
    default:
      return null;
  }
};

// Truncate text to approximately 2-3 lines (roughly 200 characters)
const TRUNCATE_LENGTH = 200;

function ExpandableParagraph({
  text,
  title,
}: {
  text: string;
  title?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = text.length > TRUNCATE_LENGTH;
  const displayText = shouldTruncate && !expanded ? text.substring(0, TRUNCATE_LENGTH) + "..." : text;

  return (
    <Box>
      {title && (
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      <Typography
        variant="body1"
        sx={{
          lineHeight: 1.8,
          color: "text.primary",
          userSelect: "text",
          WebkitUserSelect: "text",
        }}
        title="From LivMantra free template"
      >
        {displayText}
      </Typography>
      {shouldTruncate && (
        <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ p: 0.5 }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Typography
            variant="caption"
            sx={{ cursor: "pointer", color: "primary.main" }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Read less" : "Read more"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default function VpkResultCard({ snapshot, mergedReport, currentSection = 0, onSectionChange }: Props) {
  const hasEnhancedData =
    snapshot.bodyTypeDetailed || snapshot.prakritiDetailed || snapshot.vikritiDetailed;

  const bodyType = snapshot.bodyTypeDetailed?.primary || snapshot.bodyType;
  const prakriti = snapshot.prakritiDetailed?.primary || snapshot.prakriti;
  const vikritiSummary = snapshot.vikritiDetailed?.summary || snapshot.vikriti;

  const handleNext = () => {
    if (currentSection < 2 && onSectionChange) {
      onSectionChange(currentSection + 1);
    }
  };

  const handleBack = () => {
    if (currentSection > 0 && onSectionChange) {
      onSectionChange(currentSection - 1);
    }
  };

  // Elemental themes per section (minimal, neon-on-dark)
  const bodyElements = getElementsForCode(snapshot.bodyCode);
  const prakritiElements = getElementsForCode(snapshot.prakritiCode);
  const vikritiElements = getElementsForCode(snapshot.vikritiCode);

  const [cursorElement, setCursorElement] = useState<ElementKind | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [sectionChangeTrigger, setSectionChangeTrigger] = useState(0);
  const bodyVideoRef = React.useRef<HTMLVideoElement>(null);
  const dnaVideoRef = React.useRef<HTMLVideoElement>(null);

  // Trigger particles on section change
  useEffect(() => {
    if (sectionChangeTrigger > 0) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentSection, sectionChangeTrigger]);

  // Ensure videos play when section changes
  useEffect(() => {
    if (currentSection === 0 && bodyVideoRef.current) {
      bodyVideoRef.current.play().catch((err) => console.log("Body video play error:", err));
    }
    if (currentSection === 1 && dnaVideoRef.current) {
      dnaVideoRef.current.play().catch((err) => console.log("DNA video play error:", err));
    }
  }, [currentSection]);

  const handleNextWithParticles = () => {
    setSectionChangeTrigger((prev) => prev + 1);
    handleNext();
  };

  const handleBackWithParticles = () => {
    setSectionChangeTrigger((prev) => prev + 1);
    handleBack();
  };

  const makeSectionMouseHandlers = (elements: ElementKind[]) => {
    const primary = getPrimaryElement(elements);
    if (!primary) {
      return {
        onMouseMove: undefined,
        onMouseLeave: undefined,
      };
    }
    return {
      onMouseMove: (e: React.MouseEvent) => {
        setCursorElement(primary);
        setCursorPos({ x: e.clientX, y: e.clientY });
      },
      onMouseLeave: () => {
        setCursorElement((prev) => (prev === primary ? null : prev));
      },
    };
  };

  // Use merged report if available, otherwise fallback to basic display
  const useMergedReport = mergedReport !== null && mergedReport !== undefined;

  const handleCTAClick = () => {
    // TODO: Implement payment flow
    if (snapshot.reportId) {
      console.log("CTA clicked for reportId:", snapshot.reportId);
      // Navigate to payment page or open payment modal
      alert(`Unlock full report for ₹99 (Report ID: ${snapshot.reportId})`);
    } else {
      alert("Full report not available for this result.");
    }
  };

  // Get counts for stats dashboard
  const statsCounts = snapshot.prakritiDetailed?.countsB || snapshot.bodyTypeDetailed?.countsA || snapshot.vikritiDetailed?.countsC;

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <ParticleExplosion trigger={showParticles} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
            letterSpacing: "-0.03em",
            textShadow: "0 0 30px rgba(0, 255, 255, 0.3)",
          }}
        >
          Body Detected
        </Typography> */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontSize: { xs: "1.1rem", md: "1.4rem" },
              mb: 1,
              background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 50%, #00ffff 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradient 3s ease infinite",
              textShadow: "0 0 40px rgba(0, 255, 255, 0.35)",
              fontFamily: "monospace",
            }}
          >
            {currentSection === 0 && "BODY TYPE OVERVIEW"}
            {currentSection === 1 && "PRAKRITI (CONSTITUTION) OVERVIEW"}
            {currentSection === 2 && "VIKRITI (IMBALANCE) OVERVIEW"}
          </Typography>
          {(() => {
            const currentCode = currentSection === 0 ? snapshot.bodyCode : 
                               currentSection === 1 ? snapshot.prakritiCode : 
                               snapshot.vikritiCode;
            const typeName = getTypeNameForCode(currentCode);
            if (!typeName) return null;
            
            // Get color based on type
            const getTypeColor = (type: string) => {
              switch (type) {
                case "Aero":
                  return { color: "#38bdf8", border: "rgba(56, 189, 248, 0.3)", bg: "rgba(56, 189, 248, 0.1)" };
                case "Pyro":
                  return { color: "#f87171", border: "rgba(248, 113, 113, 0.3)", bg: "rgba(248, 113, 113, 0.1)" };
                case "Geo":
                  return { color: "#10b981", border: "rgba(16, 185, 129, 0.3)", bg: "rgba(16, 185, 129, 0.1)" };
                default:
                  return { color: "#00ff00", border: "rgba(0, 255, 0, 0.3)", bg: "rgba(0, 255, 0, 0.1)" };
              }
            };
            
            const colors = getTypeColor(typeName);
            
            return (
              <Typography
                variant="caption"
                sx={{
                  color: colors.color,
                  fontFamily: "monospace",
                  display: "inline-block",
                  px: 2,
                  py: 0.5,
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 1,
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                TYPE: {typeName}
              </Typography>
            );
          })()}
        </Box>
      </motion.div>

      {/* Progress Tracker */}
      <SectionProgress currentSection={currentSection} totalSections={3} />

      {/* Stats Dashboard - Hidden */}
      {/* {statsCounts && <StatsDashboard counts={statsCounts} />} */}

      {/* Achievement Badges */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4}>
          <AchievementBadge
            title="Body Detected"
            description="Primary type identified"
            unlocked={currentSection >= 0}
            icon="🔍"
            onClick={() => {
              if (onSectionChange) {
                setSectionChangeTrigger((prev) => prev + 1);
                onSectionChange(0);
              }
            }}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <AchievementBadge
            title="Constitution Analyzed"
            description="Prakriti decoded"
            unlocked={currentSection >= 1}
            icon="🧬"
            onClick={() => {
              if (onSectionChange) {
                setSectionChangeTrigger((prev) => prev + 1);
                onSectionChange(1);
              }
            }}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <AchievementBadge
            title="Imbalance Detected"
            description="Vikriti analysis complete"
            unlocked={currentSection >= 2}
            icon="⚡"
            onClick={() => {
              if (onSectionChange) {
                setSectionChangeTrigger((prev) => prev + 1);
                onSectionChange(2);
              }
            }}
          />
        </Grid>
      </Grid>

      {/* Body Type Section */}
      {currentSection === 0 && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            mt: 3,
            position: "relative",
          }}
        >
          <Box
            sx={{
              mb: 3,
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              px: { xs: 2.5, md: 3 },
              py: { xs: 2.5, md: 3 },
              background: "rgba(15, 23, 42, 0.92)",
              border: "1px solid rgba(148, 163, 184, 0.25)",
              ...(bodyElements.includes("air") && {
                animation: "airWobble 18s ease-in-out infinite",
              }),
              ...(bodyElements.includes("fire") && {
                animation: "fireCrumple 22s ease-in-out infinite",
                boxShadow:
                  "0 0 32px rgba(248,113,113,0.55), 0 0 18px rgba(250,204,21,0.35)",
                borderColor: "rgba(248,113,113,0.6)",
              }),
              ...(bodyElements.includes("earth") && {
                animation: "earthPulse 20s ease-in-out infinite",
                boxShadow: "0 0 28px rgba(16,185,129,0.45)",
                borderColor: "rgba(16,185,129,0.55)",
              }),
              ...(getPrimaryElement(bodyElements) && {
                cursor: "none",
              }),
            }}
            {...makeSectionMouseHandlers(bodyElements)}
          >
            {/* Background Video - Human Body Structure */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                overflow: "hidden",
              }}
            >
              <video
                ref={bodyVideoRef}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.4,
                  filter: "grayscale(0.25) brightness(0.45) contrast(1.2) saturate(0.9)",
                  transition: "opacity 0.8s ease-in-out",
                  pointerEvents: "none",
                }}
                onLoadedData={(e) => {
                  // Ensure video plays
                  const video = e.target as HTMLVideoElement;
                  if (video) {
                    video.play().catch((err) => console.log("Body video play error:", err));
                  }
                }}
              >
                <source src="/video/Human Body Structure LV.mp4" type="video/mp4" />
              </video>
            </Box>
            
            {/* Elegant overlay gradient for better text readability */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, rgba(10, 14, 39, 0.65) 0%, rgba(15, 23, 42, 0.55) 50%, rgba(10, 14, 39, 0.65) 100%)",
                zIndex: 1,
                pointerEvents: "none",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "radial-gradient(circle at 50% 50%, transparent 0%, rgba(10, 14, 39, 0.25) 100%)",
                },
              }}
            />
            
            {/* ElementAura positioned relative to parent container */}
            <Box sx={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
              <ElementAura elements={bodyElements} />
            </Box>
            
            {/* Content wrapper with relative positioning */}
            <Box sx={{ position: "relative", zIndex: 2 }}>

            {/* Intro paragraph, common feeling, tip, and distribution removed for Body Type */}

            {/* Body Code Report (B1-B9) */}
            {mergedReport?.bodyCodeReport && (
              <Box sx={{ mt: 4, pt: 4, borderTop: "2px solid rgba(99, 102, 241, 0.2)" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#00ffff",
                    mb: 1,
                  }}
                >
                  {mergedReport.bodyCodeReport.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(226, 232, 240, 0.7)",
                    mb: 3,
                    fontStyle: "italic",
                  }}
                >
                  {mergedReport.bodyCodeReport.subtitle}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    How Your Body Lives
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, mb: 2, color: "rgba(226, 232, 240, 0.9)" }}
                  >
                    {mergedReport.bodyCodeReport.howYourBodyLives}
                  </Typography>
                </Box>

                {(mergedReport.bodyCodeReport.howYourMindMoves || mergedReport.bodyCodeReport.howYourMindWorks) && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                    >
                      How Your Mind {mergedReport.bodyCodeReport.howYourMindMoves ? "Moves" : "Works"}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ lineHeight: 1.8, mb: 2, color: "rgba(226, 232, 240, 0.9)" }}
                    >
                      {mergedReport.bodyCodeReport.howYourMindMoves || mergedReport.bodyCodeReport.howYourMindWorks}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    How Stress Shows Up {mergedReport.bodyCodeReport.howYourMindMoves ? "for You" : "in You"}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, mb: 2, color: "rgba(226, 232, 240, 0.9)" }}
                  >
                    {mergedReport.bodyCodeReport.howStressShowsUp}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    Your Body's Early Signals
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    {mergedReport.bodyCodeReport.earlySignals.map((signal, idx) => (
                      <li key={idx}>
                        <Typography
                          variant="body1"
                          sx={{ lineHeight: 1.8, color: "rgba(226, 232, 240, 0.9)" }}
                        >
                          {signal}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    Daily Anchors
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    {mergedReport.bodyCodeReport.dailyAnchors.map((anchor, idx) => (
                      <li key={idx}>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.8,
                            fontWeight: 500,
                            color: "rgba(226, 232, 240, 0.95)",
                          }}
                        >
                          ✔ {anchor}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "rgba(0, 255, 255, 0.06)",
                    borderRadius: 2,
                    borderLeft: "4px solid #00ffff",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      fontStyle: "italic",
                      color: "rgba(226, 232, 240, 0.95)",
                    }}
                  >
                    {mergedReport.bodyCodeReport.closingMessage}
                  </Typography>
                </Box>
              </Box>
            )}
            </Box>
          </Box>
        </Box>
      </motion.div>
      )}

      {/* Prakriti Section */}
      {currentSection === 1 && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            mt: 3,
            position: "relative",
          }}
        >
          <Box
            sx={{
              mb: 3,
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              px: { xs: 2.5, md: 3 },
              py: { xs: 2.5, md: 3 },
              background: "rgba(15, 23, 42, 0.92)",
              border: "1px solid rgba(148, 163, 184, 0.25)",
              ...(prakritiElements.includes("air") && {
                animation: "airWobble 20s ease-in-out infinite",
              }),
              ...(prakritiElements.includes("fire") && {
                animation: "fireCrumple 24s ease-in-out infinite",
                boxShadow:
                  "0 0 30px rgba(248,113,113,0.5), 0 0 16px rgba(250,204,21,0.3)",
                borderColor: "rgba(248,113,113,0.6)",
              }),
              ...(prakritiElements.includes("earth") && {
                animation: "earthPulse 22s ease-in-out infinite",
                boxShadow: "0 0 26px rgba(16,185,129,0.4)",
                borderColor: "rgba(16,185,129,0.55)",
              }),
              ...(getPrimaryElement(prakritiElements) && {
                cursor: "none",
              }),
            }}
            {...makeSectionMouseHandlers(prakritiElements)}
          >
            {/* Background Video - Human DNA */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                overflow: "hidden",
              }}
            >
              <video
                ref={dnaVideoRef}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.4,
                  filter: "grayscale(0.25) brightness(0.45) contrast(1.2) saturate(0.9)",
                  transition: "opacity 0.8s ease-in-out",
                  pointerEvents: "none",
                }}
                onLoadedData={(e) => {
                  // Ensure video plays
                  const video = e.target as HTMLVideoElement;
                  if (video) {
                    video.play().catch((err) => console.log("DNA video play error:", err));
                  }
                }}
              >
                <source src="/video/Human DNA LV.mp4" type="video/mp4" />
              </video>
            </Box>
            
            {/* Elegant overlay gradient for better text readability */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, rgba(10, 14, 39, 0.65) 0%, rgba(15, 23, 42, 0.55) 50%, rgba(10, 14, 39, 0.65) 100%)",
                zIndex: 1,
                pointerEvents: "none",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "radial-gradient(circle at 50% 50%, transparent 0%, rgba(10, 14, 39, 0.25) 100%)",
                },
              }}
            />
            
            {/* ElementAura positioned relative to parent container */}
            <Box sx={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
              <ElementAura elements={prakritiElements} />
            </Box>
            
            {/* Content wrapper with relative positioning */}
            <Box sx={{ position: "relative", zIndex: 2 }}>

            {/* Strengths removed as per updated report requirements */}

            {/* Intro paragraph, tip, and distribution removed for Prakriti */}

            {/* Prakriti Code Report (P1-P9) */}
            {mergedReport?.prakritiCodeReport && (
              <Box sx={{ mt: 4, pt: 4, borderTop: "2px solid rgba(236, 72, 153, 0.2)" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#ff9de6",
                    mb: 1,
                  }}
                >
                  {mergedReport.prakritiCodeReport.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(226, 232, 240, 0.7)",
                    mb: 3,
                    fontStyle: "italic",
                  }}
                >
                  {mergedReport.prakritiCodeReport.subtitle}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    Your Natural Nature
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, mb: 2, color: "rgba(226, 232, 240, 0.9)" }}
                  >
                    {mergedReport.prakritiCodeReport.yourNaturalNature}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    How You Think & Respond
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, mb: 2, color: "rgba(226, 232, 240, 0.9)" }}
                  >
                    {mergedReport.prakritiCodeReport.howYouThinkAndRespond}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    Your Superpowers
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    {mergedReport.prakritiCodeReport.yourSuperpowers.map((power, idx) => (
                      <li key={idx}>
                        <Typography
                          variant="body1"
                          sx={{ lineHeight: 1.8, color: "rgba(226, 232, 240, 0.9)" }}
                        >
                          {power}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    When This Gets Too Much
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, mb: 2, color: "rgba(226, 232, 240, 0.9)" }}
                  >
                    {mergedReport.prakritiCodeReport.whenThisGetsTooMuch}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    Life-Stage & Season Sensitivity
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, mb: 2, color: "rgba(226, 232, 240, 0.9)" }}
                  >
                    {mergedReport.prakritiCodeReport.lifeStageAndSeasonSensitivity}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    {mergedReport.prakritiCodeReport.anchorsTitle}
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    {mergedReport.prakritiCodeReport.anchors.map((anchor, idx) => (
                      <li key={idx}>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.8,
                            fontWeight: 500,
                            color: "rgba(226, 232, 240, 0.95)",
                          }}
                        >
                          ✔ {anchor}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "rgba(236, 72, 153, 0.08)",
                    borderRadius: 2,
                    borderLeft: "4px solid #ff9de6",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      fontStyle: "italic",
                      color: "rgba(226, 232, 240, 0.95)",
                    }}
                  >
                    {mergedReport.prakritiCodeReport.closingMessage}
                  </Typography>
                </Box>
              </Box>
            )}
            </Box>
          </Box>
        </Box>
      </motion.div>
      )}

      {/* Vikriti Section */}
      {currentSection === 2 && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            mt: 3,
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              px: { xs: 2.5, md: 3 },
              py: { xs: 2.5, md: 3 },
              background: "rgba(15, 23, 42, 0.92)",
              border: "1px solid rgba(148, 163, 184, 0.25)",
              ...(vikritiElements.includes("air") && {
                animation: "airWobble 16s ease-in-out infinite",
              }),
              ...(vikritiElements.includes("fire") && {
                animation: "fireCrumple 20s ease-in-out infinite",
                boxShadow:
                  "0 0 34px rgba(248,113,113,0.6), 0 0 20px rgba(250,204,21,0.4)",
                borderColor: "rgba(248,113,113,0.7)",
              }),
              ...(vikritiElements.includes("earth") && {
                animation: "earthPulse 24s ease-in-out infinite",
                boxShadow: "0 0 30px rgba(16,185,129,0.5)",
                borderColor: "rgba(16,185,129,0.65)",
              }),
              ...(getPrimaryElement(vikritiElements) && {
                cursor: "none",
              }),
            }}
            {...makeSectionMouseHandlers(vikritiElements)}
          >
            <ElementAura elements={vikritiElements} />

            {/* Imbalance levels removed as per updated report requirements */}

            {/* Intro paragraph, quick tip, and distribution removed for Vikriti */}

            {/* Vikriti Code Report (V0-V9) */}
            {mergedReport?.vikritiCodeReport && (
              <Box sx={{ mt: 4, pt: 4, borderTop: "2px solid rgba(16, 185, 129, 0.2)" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#4ade80",
                    mb: 1,
                  }}
                >
                  {mergedReport.vikritiCodeReport.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(226, 232, 240, 0.7)",
                    mb: 3,
                    fontStyle: "italic",
                  }}
                >
                  {mergedReport.vikritiCodeReport.subtitle}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    What's Happening in Your System Right Now
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, mb: 2, color: "rgba(226, 232, 240, 0.9)" }}
                  >
                    {mergedReport.vikritiCodeReport.whatsHappening}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    Why You May Be Feeling Like This
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, mb: 2, color: "rgba(226, 232, 240, 0.9)" }}
                  >
                    {mergedReport.vikritiCodeReport.whyFeelingLikeThis}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    Common Symptoms You Might Notice
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    {mergedReport.vikritiCodeReport.commonSymptoms.map((symptom, idx) => (
                      <li key={idx}>
                        <Typography
                          variant="body1"
                          sx={{ lineHeight: 1.8, color: "rgba(226, 232, 240, 0.9)" }}
                        >
                          {symptom}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    {mergedReport.vikritiCodeReport.earlyWarningsTitle}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, mb: 2, color: "rgba(226, 232, 240, 0.9)" }}
                  >
                    {mergedReport.vikritiCodeReport.earlyWarnings}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#e5e7eb", letterSpacing: "0.03em" }}
                  >
                    What Your Body Needs Immediately
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    {mergedReport.vikritiCodeReport.whatYourBodyNeeds.map((need, idx) => (
                      <li key={idx}>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.8,
                            fontWeight: 500,
                            color: "rgba(226, 232, 240, 0.95)",
                          }}
                        >
                          ✔ {need}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "rgba(34, 197, 94, 0.08)",
                    borderRadius: 2,
                    borderLeft: "4px solid #4ade80",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      fontStyle: "italic",
                      color: "rgba(226, 232, 240, 0.95)",
                    }}
                  >
                    {mergedReport.vikritiCodeReport.closingMessage}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </motion.div>
      )}

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackWithParticles}
          disabled={currentSection === 0}
          sx={{
            color: "#00ffff",
            borderColor: "#00ffff",
            "&:hover": {
              borderColor: "#00ffff",
              backgroundColor: "rgba(0, 255, 255, 0.1)",
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
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: currentSection === index ? 32 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentSection === index ? "#00ffff" : "rgba(255, 255, 255, 0.3)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => onSectionChange && onSectionChange(index)}
            />
          ))}
          <Typography
            variant="body2"
            sx={{
              ml: 2,
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: 500,
            }}
          >
            {currentSection + 1} / 3
          </Typography>
        </Box>

        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNextWithParticles}
          disabled={currentSection === 2}
          sx={{
            background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
            color: "#0a0e27",
            fontWeight: 700,
            "&:hover": {
              background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
              boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
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

      {/* Emotional Line - Hidden */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Paper
          sx={{
            p: 4,
            mt: 3,
            background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
            color: "white",
            boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.3), 0 10px 10px -5px rgba(99, 102, 241, 0.2)",
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontStyle: "italic", fontSize: "1.1rem", lineHeight: 1.8, userSelect: "text" }}
          >
            {useMergedReport && mergedReport?.vikritiEmpathyLine
              ? mergedReport.vikritiEmpathyLine
              : snapshot.shortEmotionalLine}
          </Typography>
        </Paper>
      </motion.div> */}

      {/* Score Section - Hidden */}
      {/* {snapshot.score !== undefined && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Box
            sx={{
              mt: 4,
              textAlign: "center",
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#6366f1" }}>
              Balance Score: {snapshot.score.toFixed(1)}/100
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {snapshot.score >= 70
                ? "Well balanced"
                : snapshot.score >= 50
                ? "Moderate balance"
                : "Needs attention"}
            </Typography>
          </Box>
        </motion.div>
      )} */}

      {/* CTA Banner - Sticky */}
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
            p: 3,
            background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
            color: "white",
            boxShadow:
              "0 -10px 30px rgba(0, 0, 0, 0.6), 0 0 35px rgba(0, 255, 255, 0.4)",
            zIndex: 1000,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Unlock full report for ₹99
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {useMergedReport && mergedReport?.paidPreviewText
                  ? mergedReport.paidPreviewText
                  : "72-hour reset plan • 14-day meal plan • 14-day movement plan"}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={handleCTAClick}
              startIcon={<LockIcon />}
              sx={{
                backgroundColor: "white",
                color: "#0f172a",
                fontWeight: 700,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
              }}
            >
              Get Full Report
            </Button>
          </Box>
        </Paper>
      </motion.div>

      {cursorElement && cursorPos && (
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
            ...(cursorElement === "fire" && {
              background:
                "radial-gradient(circle, rgba(252,211,77,0.95) 0%, rgba(248,113,113,0.8) 45%, transparent 70%)",
              boxShadow:
                "0 0 25px rgba(248,113,113,0.9), 0 0 40px rgba(250,204,21,0.7)",
            }),
            ...(cursorElement === "air" && {
              background:
                "radial-gradient(circle, rgba(191,219,254,0.9) 0%, rgba(56,189,248,0.7) 40%, transparent 70%)",
              boxShadow:
                "0 0 24px rgba(56,189,248,0.9), 0 0 40px rgba(129,140,248,0.6)",
            }),
            ...(cursorElement === "earth" && {
              background:
                "radial-gradient(circle, rgba(209,250,229,0.95) 0%, rgba(16,185,129,0.75) 40%, transparent 70%)",
              boxShadow:
                "0 0 22px rgba(16,185,129,0.9), 0 0 36px rgba(45,212,191,0.7)",
            }),
          }}
        />
      )}
    </Box>
  );
}


