import React from "react";
import { Box, Typography } from "@mui/material";

type DoshaCounts = {
  vata: number;
  pitta: number;
  kapha: number;
};

type Props = {
  counts?: DoshaCounts;
};

export default function StatsDashboard({ counts }: Props) {
  if (!counts) return null;

  const { vata, pitta, kapha } = counts;
  const total = vata + pitta + kapha;

  if (total === 0) return null;

  const vataPercent = Math.round((vata / total) * 100);
  const pittaPercent = Math.round((pitta / total) * 100);
  const kaphaPercent = Math.round((kapha / total) * 100);

  return (
    <Box
      sx={{
        p: 3,
        background: "rgba(0, 0, 0, 0.6)",
        border: "1px solid #00ffff",
        borderRadius: 2,
        mb: 4,
        fontFamily: "monospace",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent, #00ffff, transparent)",
          animation: "scanLine 3s linear infinite",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#00ffff",
          mb: 2,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 700,
        }}
      >
        SYSTEM STATS
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" sx={{ color: "#6366f1", fontWeight: 600 }}>
              VATA
            </Typography>
            <Typography variant="body2" sx={{ color: "#fff", fontFamily: "monospace" }}>
              {vataPercent}%
            </Typography>
          </Box>
          <Box
            sx={{
              height: 8,
              background: "rgba(99, 102, 241, 0.2)",
              borderRadius: 1,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${vataPercent}%`,
                background: "linear-gradient(90deg, #6366f1, #818cf8)",
                boxShadow: "0 0 10px #6366f1",
                transition: "width 1s ease",
              }}
            />
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" sx={{ color: "#ec4899", fontWeight: 600 }}>
              PITTA
            </Typography>
            <Typography variant="body2" sx={{ color: "#fff", fontFamily: "monospace" }}>
              {pittaPercent}%
            </Typography>
          </Box>
          <Box
            sx={{
              height: 8,
              background: "rgba(236, 72, 153, 0.2)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${pittaPercent}%`,
                background: "linear-gradient(90deg, #ec4899, #f472b6)",
                boxShadow: "0 0 10px #ec4899",
                transition: "width 1s ease",
              }}
            />
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" sx={{ color: "#10b981", fontWeight: 600 }}>
              KAPHA
            </Typography>
            <Typography variant="body2" sx={{ color: "#fff", fontFamily: "monospace" }}>
              {kaphaPercent}%
            </Typography>
          </Box>
          <Box
            sx={{
              height: 8,
              background: "rgba(16, 185, 129, 0.2)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${kaphaPercent}%`,
                background: "linear-gradient(90deg, #10b981, #34d399)",
                boxShadow: "0 0 10px #10b981",
                transition: "width 1s ease",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
