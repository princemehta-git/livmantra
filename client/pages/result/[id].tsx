import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getResult, mergeReport } from "../../lib/api";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import VpkResultCard from "../../components/VpkResultCard";
import Header from "../../components/Header";

export default function ResultPage() {
  const router = useRouter();
  const { id } = router.query;
  const [result, setResult] = useState<any>(null);
  const [mergedReport, setMergedReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getResult(String(id))
      .then((r) => {
        setResult(r.data.result);
        // Use merged report from backend if available
        if (r.data.mergedReport) {
          setMergedReport(r.data.mergedReport);
        } else if (r.data.result?.snapshot) {
          // Fallback: try to merge on frontend if backend didn't provide it
          mergeReport(r.data.result.snapshot)
            .then((mergeRes) => {
              setMergedReport(mergeRes.data.mergedReport);
            })
            .catch((err) => {
              console.warn("Failed to merge report on frontend:", err);
              // Continue without merged report
            });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load result");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box>
        <Header />
        <Container sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading your results...</Typography>
        </Container>
      </Box>
    );
  }

  if (error || !result) {
    return (
      <Box>
        <Header />
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Typography color="error">{error || "Result not found"}</Typography>
        </Container>
      </Box>
    );
  }

  const snapshot = result.snapshot;

  return (
    <Box>
      <Header />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <VpkResultCard snapshot={snapshot} mergedReport={mergedReport} />
      </Container>
    </Box>
  );
}

