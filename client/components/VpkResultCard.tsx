import React, { useState } from "react";
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
} from "@mui/material";
import { motion } from "framer-motion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LockIcon from "@mui/icons-material/Lock";

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
};

type Props = {
  snapshot: ResultSnapshot;
  mergedReport?: MergedReport | null;
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

export default function VpkResultCard({ snapshot, mergedReport }: Props) {
  const hasEnhancedData =
    snapshot.bodyTypeDetailed || snapshot.prakritiDetailed || snapshot.vikritiDetailed;

  const bodyType = snapshot.bodyTypeDetailed?.primary || snapshot.bodyType;
  const prakriti = snapshot.prakritiDetailed?.primary || snapshot.prakriti;
  const vikritiSummary = snapshot.vikritiDetailed?.summary || snapshot.vikriti;

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

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Your LivMantra Snapshot
        </Typography>
      </motion.div>

      {/* Body Type Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper
          sx={{
            p: 4,
            mt: 3,
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(99, 102, 241, 0.1)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 700,
                color: "#6366f1",
                mb: 1,
              }}
            >
              Body Type: {bodyType}
              {snapshot.bodyTypeDetailed?.modifier && ` (${snapshot.bodyTypeDetailed.modifier} as modifier)`}
            </Typography>

            {/* Body Paragraph */}
            {useMergedReport && mergedReport?.bodyParagraph ? (
              <ExpandableParagraph text={mergedReport.bodyParagraph} />
            ) : (
              <Typography variant="body1" sx={{ lineHeight: 1.8, userSelect: "text" }}>
                You show {bodyType} tendencies — more details in paid report.
              </Typography>
            )}

            {/* Common Feeling */}
            {useMergedReport && mergedReport?.bodyCommonFeeling && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ fontStyle: "italic", color: "text.secondary" }}
                >
                  Common feeling: {mergedReport.bodyCommonFeeling}
                </Typography>
              </Box>
            )}

            {/* Tip */}
            {useMergedReport && mergedReport?.bodyTip && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={mergedReport.bodyTip}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    color: "#6366f1",
                    fontWeight: 600,
                  }}
                />
              </Box>
            )}

            {/* Distribution */}
            {snapshot.bodyTypeDetailed && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Distribution: Vata {snapshot.bodyTypeDetailed.countsA.vata} • Pitta{" "}
                {snapshot.bodyTypeDetailed.countsA.pitta} • Kapha{" "}
                {snapshot.bodyTypeDetailed.countsA.kapha}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Prakriti Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 700,
                color: "#ec4899",
                mb: 1,
              }}
            >
              Prakriti (Constitution): {prakriti}
              {snapshot.prakritiDetailed?.modifier && ` (${snapshot.prakritiDetailed.modifier} as modifier)`}
            </Typography>

            {/* Prakriti Paragraph */}
            {useMergedReport && mergedReport?.prakritiParagraph ? (
              <ExpandableParagraph text={mergedReport.prakritiParagraph} />
            ) : (
              <Typography variant="body1" sx={{ lineHeight: 1.8, userSelect: "text" }}>
                You show {prakriti} constitution tendencies — more details in paid report.
              </Typography>
            )}

            {/* Strengths */}
            {useMergedReport && mergedReport?.prakritiStrengths && mergedReport.prakritiStrengths.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Strengths:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {mergedReport.prakritiStrengths.map((strength, idx) => (
                    <li key={idx}>
                      <Typography variant="body2" sx={{ lineHeight: 1.8, userSelect: "text" }}>
                        {strength}
                      </Typography>
                    </li>
                  ))}
                </Box>
              </Box>
            )}

            {/* Tip */}
            {useMergedReport && mergedReport?.prakritiTip && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={mergedReport.prakritiTip}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(236, 72, 153, 0.1)",
                    color: "#ec4899",
                    fontWeight: 600,
                  }}
                />
              </Box>
            )}

            {/* Distribution */}
            {snapshot.prakritiDetailed && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Distribution: Vata {snapshot.prakritiDetailed.countsB.vata} • Pitta{" "}
                {snapshot.prakritiDetailed.countsB.pitta} • Kapha{" "}
                {snapshot.prakritiDetailed.countsB.kapha}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Vikriti Section */}
          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 700,
                color: "#10b981",
                mb: 1,
              }}
            >
              Vikriti (Imbalance): {vikritiSummary}
            </Typography>

            {/* Imbalance Levels */}
            {snapshot.vikritiDetailed && snapshot.vikritiDetailed.imbalances.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Imbalance Levels:
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {snapshot.vikritiDetailed.imbalances.map((imbalance, idx) => (
                    <Chip
                      key={idx}
                      label={`${imbalance.dosha}: ${imbalance.count} (${imbalance.level})`}
                      size="small"
                      sx={{
                        backgroundColor: getLevelColor(imbalance.level),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Vikriti Paragraph */}
            {useMergedReport && mergedReport?.vikritiParagraph ? (
              <ExpandableParagraph text={mergedReport.vikritiParagraph} />
            ) : (
              <Typography variant="body1" sx={{ lineHeight: 1.8, userSelect: "text" }}>
                {snapshot.shortEmotionalLine || "No significant imbalance detected."}
              </Typography>
            )}

            {/* Quick Tip */}
            {useMergedReport && mergedReport?.vikritiQuickTip && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={mergedReport.vikritiQuickTip}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    color: "#10b981",
                    fontWeight: 600,
                  }}
                />
              </Box>
            )}

            {/* Distribution */}
            {snapshot.vikritiDetailed && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Distribution: Vata {snapshot.vikritiDetailed.countsC.vata} • Pitta{" "}
                {snapshot.vikritiDetailed.countsC.pitta} • Kapha{" "}
                {snapshot.vikritiDetailed.countsC.kapha}
              </Typography>
            )}
          </Box>
        </Paper>
      </motion.div>

      {/* Emotional Line */}
      <motion.div
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
      </motion.div>

      {/* Score Section */}
      {snapshot.score !== undefined && (
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
      )}

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
            background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
            color: "white",
            boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
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
                color: "#6366f1",
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
    </Box>
  );
}

