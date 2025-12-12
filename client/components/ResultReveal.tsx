import React from "react";
import { Box, Typography, Paper, Chip, Divider } from "@mui/material";
import { motion } from "framer-motion";

// Enhanced type definitions matching backend
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

// Backward compatible type
type ResultSnapshot = {
  bodyType: string;
  prakriti: string;
  vikriti: string;
  shortEmotionalLine: string;
  score?: number;
  // New enriched fields (optional for backward compatibility)
  bodyTypeDetailed?: BodyTypeDetailed;
  prakritiDetailed?: PrakritiDetailed;
  vikritiDetailed?: VikritiDetailed;
  reportId?: number | null;
  debug?: { rawImbalance: number };
};

type Props = {
  snapshot: ResultSnapshot;
};

const getLevelColor = (level: "dominant" | "secondary" | "mild"): string => {
  switch (level) {
    case "dominant":
      return "#ef4444"; // red
    case "secondary":
      return "#f59e0b"; // amber
    case "mild":
      return "#10b981"; // green
    default:
      return "#6b7280";
  }
};

const getDoshaColor = (dosha: string): string => {
  switch (dosha.toLowerCase()) {
    case "vata":
      return "#6366f1"; // indigo
    case "pitta":
      return "#ec4899"; // pink
    case "kapha":
      return "#10b981"; // green
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

export default function ResultReveal({ snapshot }: Props) {
  const hasEnhancedData =
    snapshot.bodyTypeDetailed || snapshot.prakritiDetailed || snapshot.vikritiDetailed;

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
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#6366f1",
                mb: 1,
              }}
            >
              Body Type
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: hasEnhancedData
                    ? getBodyTypeColor(snapshot.bodyTypeDetailed?.primary || snapshot.bodyType)
                    : "#1e293b",
                }}
              >
                {snapshot.bodyTypeDetailed?.primary || snapshot.bodyType}
              </Typography>
              {snapshot.bodyTypeDetailed?.modifier && (
                <Chip
                  label={`${snapshot.bodyTypeDetailed.modifier} modifier`}
                  size="small"
                  sx={{
                    backgroundColor: getDoshaColor(snapshot.bodyTypeDetailed.modifier),
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
            {snapshot.bodyTypeDetailed && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Distribution: Vata {snapshot.bodyTypeDetailed.countsA.vata} • Pitta{" "}
                {snapshot.bodyTypeDetailed.countsA.pitta} • Kapha{" "}
                {snapshot.bodyTypeDetailed.countsA.kapha}
              </Typography>
            )}
          </Box>

          {/* Prakriti Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#ec4899",
                mb: 1,
              }}
            >
              Prakriti (Constitution)
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: hasEnhancedData
                    ? getDoshaColor(snapshot.prakritiDetailed?.primary || snapshot.prakriti)
                    : "#1e293b",
                }}
              >
                {snapshot.prakritiDetailed?.primary || snapshot.prakriti}
              </Typography>
              {snapshot.prakritiDetailed?.modifier && (
                <Chip
                  label={`${snapshot.prakritiDetailed.modifier} modifier`}
                  size="small"
                  sx={{
                    backgroundColor: getDoshaColor(snapshot.prakritiDetailed.modifier),
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
            {snapshot.prakritiDetailed && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Distribution: Vata {snapshot.prakritiDetailed.countsB.vata} • Pitta{" "}
                {snapshot.prakritiDetailed.countsB.pitta} • Kapha{" "}
                {snapshot.prakritiDetailed.countsB.kapha}
              </Typography>
            )}
          </Box>

          {/* Vikriti Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#10b981",
                mb: 1,
              }}
            >
              Vikriti (Imbalance)
            </Typography>
            {snapshot.vikritiDetailed ? (
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#1e293b",
                    mb: 2,
                  }}
                >
                  {snapshot.vikritiDetailed.summary}
                </Typography>

                {/* Imbalance Details */}
                {snapshot.vikritiDetailed.imbalances.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Imbalance Levels:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
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

                {/* Counts */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Distribution: Vata {snapshot.vikritiDetailed.countsC.vata} • Pitta{" "}
                  {snapshot.vikritiDetailed.countsC.pitta} • Kapha{" "}
                  {snapshot.vikritiDetailed.countsC.kapha}
                </Typography>

                {/* Report Recommendation */}
                {snapshot.vikritiDetailed.report_recommendation && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "rgba(99, 102, 241, 0.05)",
                      borderLeft: "4px solid #6366f1",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary" }}>
                      {snapshot.vikritiDetailed.report_recommendation}
                    </Typography>
                  </Box>
                )}

                {/* Report ID */}
                {snapshot.reportId && (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={`Recommended Report: #${snapshot.reportId}`}
                      sx={{
                        backgroundColor: "#6366f1",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                )}
              </Box>
            ) : (
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
                {snapshot.vikriti}
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
          <Typography variant="body1" sx={{ fontStyle: "italic", fontSize: "1.1rem", lineHeight: 1.8 }}>
            {snapshot.shortEmotionalLine}
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
          {/* <Box
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
            {snapshot.debug && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Raw imbalance: {snapshot.debug.rawImbalance}
              </Typography>
            )}
          </Box> */}
        </motion.div>
      )}
    </Box>
  );
}
