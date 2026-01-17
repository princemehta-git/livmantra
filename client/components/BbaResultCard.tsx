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
import FeedbackIcon from "@mui/icons-material/Feedback";
import ShareIcon from "@mui/icons-material/Share";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SectionProgress from "./SectionProgress";
import StatsDashboard from "./StatsDashboard";
import ParticleExplosion from "./ParticleExplosion";
import AchievementBadge from "./AchievementBadge";
import FeedbackDialog from "./FeedbackDialog";
import ShareDialog from "./ShareDialog";
import { submitFeedback } from "../lib/api";
import { playSoundEffect } from "../lib/audioUtils";

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
    whatQuietlyDrainsYou?: string;
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
    whatQuietlyDrainsYou: string;
    howStressShowsUpInBehavior: string;
    earlySignsYourMindGives: string;
    anchors: string[];
    anchorsTitle: string;
    anchorsIntro?: string;
    closingMessage: string;
  } | null;
  vikritiCodeReport: {
    title: string;
    subtitle: string;
    whatsHappening: string;
    whyFeelingLikeThis: string;
    commonSymptoms: string[];
    commonSymptomsIntro?: string;
    commonSymptomsClosing?: string;
    earlyWarningsTitle: string;
    earlyWarnings: string;
    whatYourBodyNeeds: string[];
    whatYourBodyNeedsIntro?: string;
    whatYourBodyNeedsClosing?: string;
    whatNotToDo?: string[];
    whatNotToDoIntro?: string;
    whatNotToDoClosing?: string;
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
  resultId?: string;
  userId?: string;
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

// Map code to combined type name (e.g., "Aero–Pyro" for dual types)
const getCombinedTypeNameForCode = (code?: string): string | null => {
  if (!code) return null;
  
  const prefix = code[0];
  const n = parseInt(code.slice(1), 10);
  if (Number.isNaN(n)) return null;

  // V0 → no clear imbalance → return null
  if (prefix === "V" && n === 0) return null;

  const elements = getElementsForCode(code);
  if (elements.length === 0) return null;

  // Map elements to type names
  const typeNames: string[] = [];
  for (const el of elements) {
    if (el === "air") typeNames.push("Aero");
    else if (el === "fire") typeNames.push("Pyro");
    else if (el === "earth") typeNames.push("Geo");
  }

  // Join multiple types with en dash
  return typeNames.length > 0 ? typeNames.join("–") : null;
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
          userSelect: "none",
          WebkitUserSelect: "none",
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

export default function BbaResultCard({ snapshot, mergedReport, currentSection = 0, onSectionChange, resultId, userId }: Props) {
  const hasEnhancedData =
    snapshot.bodyTypeDetailed || snapshot.prakritiDetailed || snapshot.vikritiDetailed;

  const bodyType = snapshot.bodyTypeDetailed?.primary || snapshot.bodyType;
  const prakriti = snapshot.prakritiDetailed?.primary || snapshot.prakriti;
  const vikritiSummary = snapshot.vikritiDetailed?.summary || snapshot.vikriti;

  const handleNext = () => {
    if (currentSection < 2 && onSectionChange) {
      playSoundEffect();
      onSectionChange(currentSection + 1);
    }
  };

  const handleBack = () => {
    if (currentSection > 0 && onSectionChange) {
      playSoundEffect();
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
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [feedbackShown, setFeedbackShown] = useState(false);
  const bodyVideoRef = React.useRef<HTMLVideoElement>(null);
  const dnaVideoRef = React.useRef<HTMLVideoElement>(null);
  const energyVideoRef = React.useRef<HTMLVideoElement>(null);
  const reportContainerRef = React.useRef<HTMLDivElement>(null);

  // Copy protection: intercept copy events and replace with custom message
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      // Check if the copy event originated from within the report container
      const target = e.target as Node;
      if (reportContainerRef.current && reportContainerRef.current.contains(target)) {
        e.preventDefault();
        
        // Get home URL
        const homeUrl = typeof window !== "undefined" ? window.location.origin : "";
        const customMessage = `Hi I gave free test at ${homeUrl}`;
        
        // Set clipboard content
        if (e.clipboardData) {
          e.clipboardData.setData("text/plain", customMessage);
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(customMessage).catch((err) => {
            console.error("Failed to write to clipboard:", err);
          });
        }
      }
    };

    // Add event listener
    document.addEventListener("copy", handleCopy);

    // Cleanup
    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

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
    if (currentSection === 2 && energyVideoRef.current) {
      energyVideoRef.current.play().catch((err) => console.log("Energy video play error:", err));
    }
  }, [currentSection]);

  // Auto-show feedback popup after 20 seconds when user reaches the last section
  useEffect(() => {
    if (!feedbackShown && currentSection === 2) {
      // User has seen all three reports (currentSection is 2, meaning they're on the last one)
      // Wait 20 seconds after reaching the last section, then show feedback popup
      const timer = setTimeout(() => {
        if (!feedbackShown) {
          setShowFeedbackDialog(true);
          setFeedbackShown(true);
        }
      }, 20000); // 20 seconds

      return () => clearTimeout(timer);
    }
  }, [currentSection, feedbackShown]);

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

  const handleContactUs = () => {
    // Helper function to map dosha to Aero/Pyro/Geo
    const doshaToType = (dosha: string): string => {
      const doshaLower = dosha.toLowerCase();
      if (doshaLower.includes("vata")) return "Aero";
      if (doshaLower.includes("pitta")) return "Pyro";
      if (doshaLower.includes("kapha")) return "Geo";
      return dosha;
    };
    
    // Helper function to map body type to Aero/Pyro/Geo
    const bodyTypeToType = (bodyType: string): string => {
      const bodyTypeLower = bodyType.toLowerCase();
      if (bodyTypeLower.includes("ectomorph")) return "Aero";
      if (bodyTypeLower.includes("mesomorph")) return "Pyro";
      if (bodyTypeLower.includes("endomorph")) return "Geo";
      return bodyType;
    };
    
    // Get body type in Aero/Pyro/Geo format
    const bodyTypeName = getTypeNameForCode(snapshot.bodyCode) || 
                        (snapshot.bodyType ? bodyTypeToType(snapshot.bodyType) : null) ||
                        snapshot.bodyType || 
                        "Unknown";
    
    // Get natural nature (prakriti) in Aero/Pyro/Geo format
    const naturalNatureName = getTypeNameForCode(snapshot.prakritiCode) || 
                              (snapshot.prakriti ? doshaToType(snapshot.prakriti) : null) ||
                              snapshot.prakriti || 
                              "Unknown";
    
    // Determine imbalance - check if it's dual imbalance
    let imbalanceText = "Unknown";
    if (snapshot.vikritiDetailed?.imbalances && snapshot.vikritiDetailed.imbalances.length > 0) {
      const imbalances = snapshot.vikritiDetailed.imbalances;
      if (imbalances.length > 1) {
        // Dual imbalance - combine the dosha names
        const doshaNames = imbalances.map(imb => doshaToType(imb.dosha));
        imbalanceText = doshaNames.join("-") + " Dual Imbalance";
      } else if (imbalances.length === 1) {
        // Single imbalance
        imbalanceText = doshaToType(imbalances[0].dosha);
      }
    } else if (snapshot.vikritiCode) {
      // Fallback to vikritiCode if detailed not available
      // Check if it's a dual imbalance code (codes with multiple elements)
      const elements = getElementsForCode(snapshot.vikritiCode);
      if (elements.length > 1) {
        const elementNames = elements.map(el => 
          el === "air" ? "Aero" : el === "fire" ? "Pyro" : "Geo"
        );
        imbalanceText = elementNames.join("-") + " Dual Imbalance";
      } else if (elements.length === 1) {
        imbalanceText = elements[0] === "air" ? "Aero" : elements[0] === "fire" ? "Pyro" : "Geo";
      } else {
        // Try to get from vikriti summary string
        const vikritiName = getTypeNameForCode(snapshot.vikritiCode);
        if (vikritiName) {
          imbalanceText = vikritiName;
        } else if (snapshot.vikriti) {
          imbalanceText = doshaToType(snapshot.vikriti);
        }
      }
    } else if (snapshot.vikriti) {
      // Last fallback - use vikriti string directly
      imbalanceText = doshaToType(snapshot.vikriti);
    }
    
    // Build WhatsApp message
    const message = `Hi, I completed the *_Body Behaviour Analysis (BBA) Test_* and here are my results:

*My Body Type:* ${bodyTypeName}
*My Natural Nature:* ${naturalNatureName}
*My Imbalance:* ${imbalanceText}

Please provide me:
• Detailed diet plan
• Exercise recommendations
• 14 days body reset plan`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp number - update this with your actual WhatsApp business number
    // Format: country code + number without + or 0 (e.g., 919876543210 for +91 9876543210)
    const whatsappNumber = "918055079055"; // TODO: Replace with actual WhatsApp number
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  // Get counts for stats dashboard
  const statsCounts = snapshot.prakritiDetailed?.countsB || snapshot.bodyTypeDetailed?.countsA || snapshot.vikritiDetailed?.countsC;

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
          Body Type Detected
        </Typography> */}
        <Box sx={{ textAlign: "center", mb: 1.5 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontSize: { xs: "1rem", md: "1.2rem" },
              mb: 0.75,
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
            {currentSection === 1 && "Innate Constitution OVERVIEW"}
            {currentSection === 2 && "Current Imbalance Overview"}
          </Typography>
          {(() => {
            // Helper function to map dosha to Aero/Pyro/Geo
            const doshaToType = (dosha: string): string => {
              const doshaLower = dosha.toLowerCase();
              if (doshaLower.includes("vata")) return "Aero";
              if (doshaLower.includes("pitta")) return "Pyro";
              if (doshaLower.includes("kapha")) return "Geo";
              return dosha;
            };
            
            // Helper function to map body type to Aero/Pyro/Geo
            const bodyTypeToType = (bodyType: string): string => {
              const bodyTypeLower = bodyType.toLowerCase();
              if (bodyTypeLower.includes("ectomorph")) return "Aero";
              if (bodyTypeLower.includes("mesomorph")) return "Pyro";
              if (bodyTypeLower.includes("endomorph")) return "Geo";
              return bodyType;
            };
            
            let typeName: string | null = null;
            
            if (currentSection === 0) {
              // Body Type section
              const currentCode = snapshot.bodyCode;
              typeName = getCombinedTypeNameForCode(currentCode) || 
                        (snapshot.bodyType ? bodyTypeToType(snapshot.bodyType) : null) ||
                        (snapshot.bodyTypeDetailed?.primary ? bodyTypeToType(snapshot.bodyTypeDetailed.primary) : null);
            } else if (currentSection === 1) {
              // Prakriti section
              const currentCode = snapshot.prakritiCode;
              typeName = getCombinedTypeNameForCode(currentCode) || 
                        (snapshot.prakriti ? doshaToType(snapshot.prakriti) : null) ||
                        (snapshot.prakritiDetailed?.primary ? doshaToType(snapshot.prakritiDetailed.primary) : null);
            } else if (currentSection === 2) {
              // Vikriti/Imbalance section - always show PRIMARY type only, not combined
              // Priority: Use primary imbalance from vikritiDetailed.imbalances[0]
              if (snapshot.vikritiDetailed?.imbalances && snapshot.vikritiDetailed.imbalances.length > 0) {
                // Always use the first/primary imbalance type only
                typeName = doshaToType(snapshot.vikritiDetailed.imbalances[0].dosha);
              } else {
                // Fallback: try to get from vikritiCode (single type only)
                const currentCode = snapshot.vikritiCode;
                typeName = getTypeNameForCode(currentCode);
                
                // Additional fallback: try to get from vikritiCode elements if available (primary only)
                if (!typeName && snapshot.vikritiCode) {
                  const elements = getElementsForCode(snapshot.vikritiCode);
                  if (elements.length > 0) {
                    const primary = getPrimaryElement(elements);
                    if (primary === "air") typeName = "Aero";
                    else if (primary === "fire") typeName = "Pyro";
                    else if (primary === "earth") typeName = "Geo";
                  }
                }
                
                // Last fallback: use vikriti string directly
                if (!typeName && snapshot.vikriti) {
                  typeName = doshaToType(snapshot.vikriti);
                }
              }
            }
            
            if (!typeName) return null;
            
            // Get color based on type (for combined types, use the first type's color)
            const getTypeColor = (type: string) => {
              // Extract the first type from combined types (e.g., "Aero–Pyro" -> "Aero")
              const firstType = type.split("–")[0];
              
              switch (firstType) {
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

      {/* Achievement Badges - Tabs Layout */}
      <Grid container spacing={{ xs: 0.5, sm: 1.5 }} sx={{ mb: 1.5 }}>
        <Grid item xs={4} sm={4}>
          <AchievementBadge
            title="Body Type Detected"
            description="Primary type identified"
            unlocked={currentSection >= 0}
            isActive={currentSection === 0}
            icon="🔍"
            onClick={() => {
              if (onSectionChange) {
                playSoundEffect();
                setSectionChangeTrigger((prev) => prev + 1);
                onSectionChange(0);
              }
            }}
          />
        </Grid>
        <Grid item xs={4} sm={4}>
          <AchievementBadge
            title="Constitution Analyzed"
            description="Natural Nature decoded"
            unlocked={currentSection >= 1}
            isActive={currentSection === 1}
            icon="🧬"
            onClick={() => {
              if (onSectionChange) {
                playSoundEffect();
                setSectionChangeTrigger((prev) => prev + 1);
                onSectionChange(1);
              }
            }}
          />
        </Grid>
        <Grid item xs={4} sm={4}>
          <AchievementBadge
            title="Imbalance Detected"
            description="Imbalance analysis complete"
            unlocked={currentSection >= 2}
            isActive={currentSection === 2}
            icon="⚡"
            onClick={() => {
              if (onSectionChange) {
                playSoundEffect();
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
            p: { xs: 2, md: 2.5 },
            mt: 2,
            position: "relative",
          }}
        >
          <Box
            sx={{
              mb: 2,
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              px: { xs: 2, md: 2.5 },
              py: { xs: 2, md: 2.5 },
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
            <Box sx={{ position: "relative", zIndex: 2, userSelect: "none", WebkitUserSelect: "none" }}>

            {/* Intro paragraph, common feeling, tip, and distribution removed for Body Type */}

            {/* Body Code Report (B1-B9) */}
            {mergedReport?.bodyCodeReport && (
              <Box sx={{ mt: 2, pt: 2, borderTop: "2px solid rgba(99, 102, 241, 0.2)" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "#00ffff",
                    mb: 0.75,
                    fontSize: { xs: "1.3rem", md: "1.5rem" },
                    letterSpacing: "0.01em",
                    lineHeight: 1.3,
                  }}
                >
                  {mergedReport.bodyCodeReport.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(148, 163, 184, 0.7)",
                    mb: 2,
                    fontStyle: "italic",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                  }}
                >
                  {mergedReport.bodyCodeReport.subtitle}
                </Typography>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    {snapshot.bodyCode === "B1" ? "How your body actually feels, day to day" : "This is how your body feels, day to day"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      lineHeight: 1.65, 
                      mb: 0, 
                      color: "rgba(148, 163, 184, 0.85)", 
                      fontSize: "0.875rem", 
                      whiteSpace: "pre-line",
                    }}
                  >
                    {mergedReport.bodyCodeReport.howYourBodyLives}
                  </Typography>
                </Box>

                {(mergedReport.bodyCodeReport.howYourMindMoves || mergedReport.bodyCodeReport.howYourMindWorks) && (
                  <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                    <Typography
                      variant="h6"
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.75, 
                        color: "#ffffff", 
                        letterSpacing: "0.01em", 
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        lineHeight: 1.3,
                      }}
                    >
                      {snapshot.bodyCode === "B1" ? "How your mind really works" : "This is how your mind usually works"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ 
                        lineHeight: 1.65, 
                        mb: 0, 
                        color: "rgba(148, 163, 184, 0.85)", 
                        fontSize: "0.875rem", 
                        whiteSpace: "pre-line",
                      }}
                    >
                      {mergedReport.bodyCodeReport.howYourMindMoves || mergedReport.bodyCodeReport.howYourMindWorks}
                    </Typography>
                  </Box>
                )}

                {mergedReport.bodyCodeReport.whatQuietlyDrainsYou && (
                  <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                    <Typography
                      variant="h6"
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.75, 
                        color: "#ffffff", 
                        letterSpacing: "0.01em", 
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        lineHeight: 1.3,
                      }}
                    >
                      {snapshot.bodyCode === "B1" ? "What drains you without you realizing it" : "What quietly drains you"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ 
                        lineHeight: 1.65, 
                        mb: 0, 
                        color: "rgba(148, 163, 184, 0.85)", 
                        fontSize: "0.875rem", 
                        whiteSpace: "pre-line",
                      }}
                    >
                      {mergedReport.bodyCodeReport.whatQuietlyDrainsYou}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    How stress shows up physically
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      lineHeight: 1.65, 
                      mb: 0, 
                      color: "rgba(148, 163, 184, 0.85)", 
                      fontSize: "0.875rem", 
                      whiteSpace: "pre-line",
                    }}
                  >
                    {mergedReport.bodyCodeReport.howStressShowsUp}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    {snapshot.bodyCode === "B1" ? "Early signs your body gives you" : "Early signs your body gives"}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0, mt: 0.5 }}>
                    {mergedReport.bodyCodeReport.earlySignals.map((signal, idx) => (
                      <li key={idx} style={{ marginBottom: "0.5rem" }}>
                        <Typography
                          variant="body2"
                          sx={{ 
                            lineHeight: 1.6, 
                            color: "rgba(148, 163, 184, 0.85)", 
                            fontSize: "0.875rem" 
                          }}
                        >
                          {signal}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    {snapshot.bodyCode === "B1" ? "What helps you almost immediately" : "What can help you immediately"}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0, mt: 0.5 }}>
                    {mergedReport.bodyCodeReport.dailyAnchors.map((anchor, idx) => (
                      <li key={idx} style={{ marginBottom: "0.5rem" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            lineHeight: 1.6,
                            fontWeight: 500,
                            color: "rgba(148, 163, 184, 0.9)",
                            fontSize: "0.875rem",
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
                    mt: 2.5,
                    p: 2,
                    bgcolor: "rgba(0, 255, 255, 0.06)",
                    borderRadius: 1.5,
                    borderLeft: "3px solid #00ffff",
                  }}
                >
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
            p: { xs: 2, md: 2.5 },
            mt: 2,
            position: "relative",
          }}
        >
          <Box
            sx={{
              mb: 2,
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              px: { xs: 2, md: 2.5 },
              py: { xs: 2, md: 2.5 },
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
            <Box sx={{ position: "relative", zIndex: 2, userSelect: "none", WebkitUserSelect: "none" }}>

            {/* Strengths removed as per updated report requirements */}

            {/* Intro paragraph, tip, and distribution removed for Prakriti */}

            {/* Prakriti Code Report (P1-P9) */}
            {mergedReport?.prakritiCodeReport && (
              <Box sx={{ mt: 2, pt: 2, borderTop: "2px solid rgba(236, 72, 153, 0.2)" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "#ff9de6",
                    mb: 0.75,
                    fontSize: { xs: "1.3rem", md: "1.5rem" },
                    letterSpacing: "0.01em",
                    lineHeight: 1.3,
                  }}
                >
                  {mergedReport.prakritiCodeReport.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(148, 163, 184, 0.7)",
                    mb: 2,
                    fontStyle: "italic",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                  }}
                >
                  {mergedReport.prakritiCodeReport.subtitle}
                </Typography>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    This is how your inner world feels, day to day
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      lineHeight: 1.65, 
                      mb: 0, 
                      color: "rgba(148, 163, 184, 0.85)", 
                      fontSize: "0.875rem", 
                      whiteSpace: "pre-line",
                    }}
                  >
                    {mergedReport.prakritiCodeReport.yourNaturalNature}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    This is how you naturally think
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      lineHeight: 1.65, 
                      mb: 0, 
                      color: "rgba(148, 163, 184, 0.85)", 
                      fontSize: "0.875rem", 
                      whiteSpace: "pre-line",
                    }}
                  >
                    {mergedReport.prakritiCodeReport.howYouThinkAndRespond}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    What quietly drains you
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      lineHeight: 1.65, 
                      mb: 0, 
                      color: "rgba(148, 163, 184, 0.85)", 
                      fontSize: "0.875rem", 
                      whiteSpace: "pre-line",
                    }}
                  >
                    {mergedReport.prakritiCodeReport.whatQuietlyDrainsYou}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    How stress shows up in your behavior
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      lineHeight: 1.65, 
                      mb: 0, 
                      color: "rgba(148, 163, 184, 0.85)", 
                      fontSize: "0.875rem", 
                      whiteSpace: "pre-line",
                    }}
                  >
                    {mergedReport.prakritiCodeReport.howStressShowsUpInBehavior}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    Early signs your mind gives
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      lineHeight: 1.65, 
                      mb: 0, 
                      color: "rgba(148, 163, 184, 0.85)", 
                      fontSize: "0.875rem", 
                      whiteSpace: "pre-line",
                    }}
                  >
                    {mergedReport.prakritiCodeReport.earlySignsYourMindGives}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    What helps you feel stable quickly
                  </Typography>
                  {mergedReport.prakritiCodeReport.anchorsIntro && (
                    <Typography
                      variant="body2"
                      sx={{ 
                        lineHeight: 1.65, 
                        mb: 0.75, 
                        color: "rgba(148, 163, 184, 0.85)", 
                        fontSize: "0.875rem", 
                        whiteSpace: "pre-line",
                      }}
                    >
                      {mergedReport.prakritiCodeReport.anchorsIntro}
                    </Typography>
                  )}
                  <Box component="ul" sx={{ pl: 2, m: 0, mt: 0.5 }}>
                    {mergedReport.prakritiCodeReport.anchors.map((anchor, idx) => (
                      <li key={idx} style={{ marginBottom: "0.5rem" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            lineHeight: 1.6,
                            fontWeight: 500,
                            color: "rgba(148, 163, 184, 0.9)",
                            fontSize: "0.875rem",
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
                    mt: 2.5,
                    p: 2,
                    bgcolor: "rgba(236, 72, 153, 0.06)",
                    borderRadius: 1.5,
                    borderLeft: "3px solid #ff9de6",
                  }}
                >
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
            p: { xs: 2, md: 2.5 },
            mt: 2,
            position: "relative",
          }}
        >
          <Box
            sx={{
              mb: 2,
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              px: { xs: 2, md: 2.5 },
              py: { xs: 2, md: 2.5 },
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
            {/* Background Video - Energy Imbalance Human Body */}
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
                ref={energyVideoRef}
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
                    video.play().catch((err) => console.log("Energy video play error:", err));
                  }
                }}
              >
                <source src="/video/energy imbalance human body LV.mp4" type="video/mp4" />
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
              <ElementAura elements={vikritiElements} />
            </Box>
            
            {/* Content wrapper with relative positioning */}
            <Box sx={{ position: "relative", zIndex: 2, userSelect: "none", WebkitUserSelect: "none" }}>

            {/* Imbalance levels removed as per updated report requirements */}

            {/* Intro paragraph, quick tip, and distribution removed for Vikriti */}

            {/* Vikriti Code Report (V0 for balanced, I1-I9 for imbalances) */}
            {mergedReport?.vikritiCodeReport && (
              <Box sx={{ mt: 2, pt: 2, borderTop: "2px solid rgba(16, 185, 129, 0.2)" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "#4ade80",
                    mb: 0.75,
                    fontSize: { xs: "1.3rem", md: "1.5rem" },
                    letterSpacing: "0.01em",
                    lineHeight: 1.3,
                  }}
                >
                  {mergedReport.vikritiCodeReport.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(148, 163, 184, 0.7)",
                    mb: 2,
                    fontStyle: "italic",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                  }}
                >
                  {mergedReport.vikritiCodeReport.subtitle}
                </Typography>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    What's happening in your body right now
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      lineHeight: 1.65, 
                      mb: 0, 
                      color: "rgba(148, 163, 184, 0.85)", 
                      fontSize: "0.875rem",
                    }}
                  >
                    {mergedReport.vikritiCodeReport.whatsHappening}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    Why this is happening
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      lineHeight: 1.65, 
                      mb: 0, 
                      color: "rgba(148, 163, 184, 0.85)", 
                      fontSize: "0.875rem",
                    }}
                  >
                    {mergedReport.vikritiCodeReport.whyFeelingLikeThis}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    Common problems you may notice
                  </Typography>
                  {mergedReport.vikritiCodeReport.commonSymptomsIntro && (
                    <Typography
                      variant="body2"
                      sx={{ 
                        lineHeight: 1.65, 
                        mb: 0.75, 
                        color: "rgba(148, 163, 184, 0.85)", 
                        fontSize: "0.875rem",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {mergedReport.vikritiCodeReport.commonSymptomsIntro}
                    </Typography>
                  )}
                  <Box component="ul" sx={{ pl: 2, m: 0, mt: 0.5 }}>
                    {mergedReport.vikritiCodeReport.commonSymptoms.map((symptom, idx) => (
                      <li key={idx} style={{ marginBottom: "0.5rem" }}>
                        <Typography
                          variant="body2"
                          sx={{ 
                            lineHeight: 1.6, 
                            color: "rgba(148, 163, 184, 0.85)",
                            fontSize: "0.875rem",
                          }}
                        >
                          {symptom}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                  {mergedReport.vikritiCodeReport.commonSymptomsClosing && (
                    <Typography
                      variant="body2"
                      sx={{ 
                        lineHeight: 1.65, 
                        mt: 0.75, 
                        color: "rgba(148, 163, 184, 0.85)", 
                        fontSize: "0.875rem",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {mergedReport.vikritiCodeReport.commonSymptomsClosing}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    {mergedReport.vikritiCodeReport.earlyWarningsTitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ 
                      lineHeight: 1.65, 
                      mb: 0, 
                      color: "rgba(148, 163, 184, 0.85)", 
                      fontSize: "0.875rem",
                    }}
                  >
                    {mergedReport.vikritiCodeReport.earlyWarnings}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    What your body needs right now
                  </Typography>
                  {mergedReport.vikritiCodeReport.whatYourBodyNeedsIntro && (
                    <Typography
                      variant="body2"
                      sx={{ 
                        lineHeight: 1.65, 
                        mb: 0.75, 
                        color: "rgba(148, 163, 184, 0.85)", 
                        fontSize: "0.875rem",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {mergedReport.vikritiCodeReport.whatYourBodyNeedsIntro}
                    </Typography>
                  )}
                  <Box component="ul" sx={{ pl: 2, m: 0, mt: 0.5 }}>
                    {mergedReport.vikritiCodeReport.whatYourBodyNeeds.map((need, idx) => (
                      <li key={idx} style={{ marginBottom: "0.5rem" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            lineHeight: 1.6,
                            fontWeight: 500,
                            color: "rgba(148, 163, 184, 0.9)",
                            fontSize: "0.875rem",
                          }}
                        >
                          ✔ {need}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                  {mergedReport.vikritiCodeReport.whatYourBodyNeedsClosing && (
                    <Typography
                      variant="body2"
                      sx={{ 
                        lineHeight: 1.65, 
                        mt: 0.75, 
                        color: "rgba(148, 163, 184, 0.85)", 
                        fontSize: "0.875rem",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {mergedReport.vikritiCodeReport.whatYourBodyNeedsClosing}
                    </Typography>
                  )}
                </Box>

                {mergedReport.vikritiCodeReport.whatNotToDo && mergedReport.vikritiCodeReport.whatNotToDo.length > 0 && (
                  <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                    <Typography
                      variant="h6"
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.75, 
                        color: "#ffffff", 
                        letterSpacing: "0.01em", 
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        lineHeight: 1.3,
                      }}
                    >
                      What NOT to do right now
                    </Typography>
                    {mergedReport.vikritiCodeReport.whatNotToDoIntro && (
                      <Typography
                        variant="body2"
                        sx={{ 
                          lineHeight: 1.65, 
                          mb: 0.75, 
                          color: "rgba(148, 163, 184, 0.85)", 
                          fontSize: "0.875rem",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {mergedReport.vikritiCodeReport.whatNotToDoIntro}
                      </Typography>
                    )}
                    <Box component="ul" sx={{ pl: 2, m: 0, mt: 0.5 }}>
                      {mergedReport.vikritiCodeReport.whatNotToDo.map((item, idx) => (
                        <li key={idx} style={{ marginBottom: "0.5rem" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.6,
                              color: "rgba(148, 163, 184, 0.85)",
                              fontSize: "0.875rem",
                            }}
                          >
                            {item}
                          </Typography>
                        </li>
                      ))}
                    </Box>
                    {mergedReport.vikritiCodeReport.whatNotToDoClosing && (
                      <Typography
                        variant="body2"
                        sx={{ 
                          lineHeight: 1.65, 
                          mt: 0.75, 
                          color: "rgba(148, 163, 184, 0.85)", 
                          fontSize: "0.875rem",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {mergedReport.vikritiCodeReport.whatNotToDoClosing}
                      </Typography>
                    )}
                  </Box>
                )}

                <Box
                  sx={{
                    mt: 2.5,
                    p: 2,
                    bgcolor: "rgba(34, 197, 94, 0.06)",
                    borderRadius: 1.5,
                    borderLeft: "3px solid #4ade80",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 0.75, 
                      color: "#ffffff", 
                      letterSpacing: "0.01em", 
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    One important thing to remember
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.65,
                      fontStyle: "italic",
                      color: "rgba(148, 163, 184, 0.9)",
                      fontSize: "0.875rem",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {mergedReport.vikritiCodeReport.closingMessage}
                  </Typography>
                </Box>
              </Box>
            )}
            </Box>
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
          mt: 2,
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<ArrowBackIcon sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />}
          onClick={handleBackWithParticles}
          disabled={currentSection === 0}
          sx={{
            color: "#00ffff",
            borderColor: "#00ffff",
            px: { xs: 1.5, sm: 2 },
            py: { xs: 0.75, sm: 1 },
            fontSize: { xs: "0.7rem", sm: "0.85rem" },
            minWidth: { xs: "auto", sm: "auto" },
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
              ml: { xs: 1, sm: 2 },
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: 500,
              fontSize: { xs: "0.7rem", sm: "0.875rem" },
            }}
          >
            {currentSection + 1} / 3
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />}
          onClick={handleNextWithParticles}
          disabled={currentSection === 2}
          sx={{
            background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
            color: "#0a0e27",
            fontWeight: 700,
            px: { xs: 1.5, sm: 2 },
            py: { xs: 0.75, sm: 1 },
            fontSize: { xs: "0.7rem", sm: "0.85rem" },
            minWidth: { xs: "auto", sm: "auto" },
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
            mt: 2,
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
                startIcon={<WhatsAppIcon />}
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
              startIcon={<FeedbackIcon />}
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
              startIcon={<ShareIcon />}
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

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        testType="BBA"
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
        testType="BBA"
      />

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


