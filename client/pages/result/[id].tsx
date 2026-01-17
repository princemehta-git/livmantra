import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getResult, mergeReport } from "../../lib/api";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import BbaResultCard from "../../components/BbaResultCard";
import PersonalityResultCard from "../../components/PersonalityResultCard";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import HackingSequenceLoader from "../../components/HackingSequenceLoader";
import MatrixBackground, { FilmGrainOverlay } from "../../components/MatrixBackground";
import TerminalTypingText from "../../components/TerminalTypingText";

// Shared audio unlock - unlock audio when page loads (navigation is user interaction)
const AUDIO_FILE_PATH = "/audio/techy-sound.mp3";
let audioUnlocked = false;

const unlockAudio = async () => {
  if (audioUnlocked) return;
  try {
    const testAudio = new Audio(AUDIO_FILE_PATH);
    testAudio.volume = 0.01;
    await testAudio.play();
    console.log("✅ Audio unlocked on page load");
    audioUnlocked = true;
    testAudio.pause();
    testAudio.currentTime = 0;
  } catch (error) {
    console.log("⚠️ Audio unlock on page load failed, will unlock on click");
  }
};

export default function ResultPage() {
  const router = useRouter();
  const { id } = router.query;
  const [result, setResult] = useState<any>(null);
  const [mergedReport, setMergedReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0); // 0: Body Type, 1: Prakriti, 2: Vikriti
  const [showHackingLoader, setShowHackingLoader] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  // Unlock audio immediately when page loads (navigation is user interaction)
  useEffect(() => {
    unlockAudio();
  }, []);

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
        setDataReady(true);
        // Keep loading true until hacking sequence completes
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load result");
        setLoading(false);
        setShowHackingLoader(false);
      });
  }, [id]);

  const handleHackingComplete = () => {
    setShowHackingLoader(false);
    setLoading(false);
  };

  const snapshot = result?.snapshot;

  return (
    <Box
      sx={{
        overflowX: "hidden",
        background: "#0a0e27",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Hacking Sequence Loader */}
      {showHackingLoader && dataReady && (
        <HackingSequenceLoader 
          onComplete={handleHackingComplete} 
          testType={result?.type || "BBA"}
        />
      )}

      {/* Matrix Background */}
      <MatrixBackground />

      {/* Film Grain Overlay */}
      <FilmGrainOverlay />

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
          top: "15%",
          left: "8%",
          width: "380px",
          height: "380px",
          background:
            "radial-gradient(circle, rgba(0, 255, 255, 0.18) 0%, transparent 70%)",
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
          bottom: "15%",
          right: "8%",
          width: "460px",
          height: "460px",
          background:
            "radial-gradient(circle, rgba(138, 43, 226, 0.18) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />

      <Header />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          py: { xs: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          {loading && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#00ffff" }} />
              <Typography
                sx={{ mt: 3, color: "rgba(255, 255, 255, 0.7)" }}
                variant="h6"
              >
                Preparing Body Detection...
              </Typography>
            </Box>
          )}

          {!loading && (error || !snapshot) && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#ff6b6b",
                }}
              >
                {error || "Result not found"}
              </Typography>
              <Typography
                sx={{ color: "rgba(255, 255, 255, 0.7)", maxWidth: 480, mx: "auto" }}
              >
                We couldn&apos;t load this report. Please go back and retake the test
                to generate a fresh snapshot.
              </Typography>
            </Box>
          )}

          {!loading && snapshot && (
            <>
              {result?.type === "PERSONALITY" ? (
                <>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography
                      variant="h2"
                      component="h1"
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: "2rem", md: "2.8rem" },
                        background:
                          "linear-gradient(135deg, #00ffff 0%, #8a2be2 50%, #00ffff 100%)",
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        animation: "gradient 3s ease infinite",
                        letterSpacing: "-0.03em",
                        textShadow: "0 0 40px rgba(0, 255, 255, 0.35)",
                        mb: 1,
                        fontFamily: "monospace",
                      }}
                    >
                      {!showHackingLoader ? (
                        "PERSONALITY ANALYSIS COMPLETE"
                      ) : (
                        <TerminalTypingText text="PERSONALITY ANALYSIS COMPLETE" speed={100} />
                      )}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: 300,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontSize: { xs: "0.8rem", md: "0.9rem" },
                        fontFamily: "monospace",
                      }}
                    >
                      {!showHackingLoader && "> Discover your personality dimensions"}
                    </Typography>
                  </Box>

                  <Container maxWidth="lg" sx={{ px: { xs: 0, md: 2 } }}>
                    <PersonalityResultCard 
                      snapshot={snapshot} 
                      mergedReport={mergedReport}
                      resultId={result?.id}
                      userId={result?.userId}
                    />
                  </Container>
                </>
              ) : (
                <>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography
                      variant="h2"
                      component="h1"
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: "2rem", md: "2.8rem" },
                        background:
                          "linear-gradient(135deg, #00ffff 0%, #8a2be2 50%, #00ffff 100%)",
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        animation: "gradient 3s ease infinite",
                        letterSpacing: "-0.03em",
                        textShadow: "0 0 40px rgba(0, 255, 255, 0.35)",
                        mb: 1,
                        fontFamily: "monospace",
                      }}
                    >
                      {!showHackingLoader ? (
                        result?.type === "PERSONALITY" ? "PERSONALITY ANALYSIS COMPLETED" : "BODY DECODING COMPLETED"
                      ) : (
                        <TerminalTypingText 
                          text={result?.type === "PERSONALITY" ? "PERSONALITY ANALYSIS COMPLETED" : "BODY DECODING COMPLETED"} 
                          speed={100} 
                        />
                      )}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: 300,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontSize: { xs: "0.8rem", md: "0.9rem" },
                        fontFamily: "monospace",
                      }}
                    >
                      {!showHackingLoader && (
                        result?.type === "PERSONALITY" 
                          ? "> Discover your personality dimensions & traits"
                          : "> Know your body nature & behavior"
                      )}
                    </Typography>
                  </Box>

                  <Container maxWidth="lg" sx={{ px: { xs: 0, md: 2 } }}>
                    <BbaResultCard 
                      snapshot={snapshot} 
                      mergedReport={mergedReport}
                      currentSection={currentSection}
                      onSectionChange={setCurrentSection}
                      resultId={result?.id}
                      userId={result?.userId}
                    />
                  </Container>
                </>
              )}
            </>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

