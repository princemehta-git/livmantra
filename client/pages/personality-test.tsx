import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { Button, Container, Box, Typography, Card, Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { getUserTests, submitTest } from "../lib/api";
import Header from "../components/Header";
import PersonalityQuestionCard from "../components/PersonalityQuestionCard";
import PersonalityProgressXP from "../components/PersonalityProgressXP";
import DimensionProgress from "../components/DimensionProgress";
import DimensionCelebration from "../components/DimensionCelebration";
import DisclaimerModal from "../components/DisclaimerModal";
import { PERSONALITY_QUESTIONS, DIMENSIONS } from "../data/personalityQuestions";
import { Lock } from "@mui/icons-material";

const TOTAL_QUESTIONS = 48;

export default function PersonalityTestPage() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(TOTAL_QUESTIONS).fill(0));
  const [submitting, setSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedDimensions, setCompletedDimensions] = useState<Set<number>>(new Set());
  const [testUnlocked, setTestUnlocked] = useState(false);
  const [checkingUnlock, setCheckingUnlock] = useState(true);
  const [dimensionProgress, setDimensionProgress] = useState<Map<number, number>>(new Map());

  const currentQuestion = PERSONALITY_QUESTIONS[index];
  const currentDimension = Math.floor(index / 8);
  const answeredCount = answers.filter((a) => a !== 0).length;

  // Check if test is unlocked (user has completed BBA test) and profile is complete
  useEffect(() => {
    const checkUnlock = async () => {
      if (authUser) {
        try {
          const response = await getUserTests();
          const tests = response.data.tests || [];
          const hasBBATest = tests.some((test: any) => test.type === "BBA");
          const hasPersonalityTest = tests.some((test: any) => test.type === "PERSONALITY");
          
          // Check if already completed - redirect to locked page
          if (hasPersonalityTest) {
            const personalityTest = tests.find((test: any) => test.type === "PERSONALITY");
            if (personalityTest) {
              router.push(`/test-locked?testType=PERSONALITY&resultId=${personalityTest.id}&testName=Personality Test`);
              return;
            }
          }

          // Check profile completion
          const requiredFields = ["name", "email", "phone", "dob", "gender", "state", "nationality"];
          const isProfileComplete = requiredFields.every((field) => {
            const value = authUser[field as keyof typeof authUser];
            return value !== null && value !== undefined && value !== "";
          });

          if (!isProfileComplete) {
            // Redirect to dashboard with profile modal
            router.push("/dashboard?profileRequired=true");
            return;
          }

          setTestUnlocked(hasBBATest);
          if (hasBBATest && !disclaimerAccepted) {
            // Use setTimeout to avoid setState during render
            setTimeout(() => {
              setShowDisclaimer(true);
            }, 0);
          }
        } catch (error) {
          console.error("Error checking unlock:", error);
        } finally {
          setCheckingUnlock(false);
        }
      } else {
        setCheckingUnlock(false);
      }
    };

    checkUnlock();
  }, [authUser, disclaimerAccepted, router]);

  // Load saved answers from localStorage
  useEffect(() => {
    if (testUnlocked) {
      const savedAnswers = localStorage.getItem("livmantra_personality_answers");
      if (savedAnswers) {
        try {
          const parsedAnswers = JSON.parse(savedAnswers);
          if (Array.isArray(parsedAnswers) && parsedAnswers.length === TOTAL_QUESTIONS) {
            setAnswers(parsedAnswers);
            updateDimensionProgress(parsedAnswers);
          }
        } catch (e) {
          console.error("Error loading saved answers:", e);
        }
      }
    }
  }, [testUnlocked]);

  // Update dimension progress
  const updateDimensionProgress = (ans: number[]) => {
    const progress = new Map<number, number>();
    for (let dim = 0; dim < 6; dim++) {
      const startIdx = dim * 8;
      const endIdx = startIdx + 8;
      const answered = ans.slice(startIdx, endIdx).filter((a) => a !== 0).length;
      progress.set(dim, answered);
    }
    setDimensionProgress(progress);
  };

  // Save answers to localStorage
  useEffect(() => {
    if (testUnlocked && answers.some((a) => a !== 0)) {
      localStorage.setItem("livmantra_personality_answers", JSON.stringify(answers));
      updateDimensionProgress(answers);
    }
  }, [answers, testUnlocked]);

  const onAnswer = (val: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = val;
    setAnswers(newAnswers);

    const currentDim = Math.floor(index / 8);
    const questionInDim = index % 8;

    // Check if dimension is completed (all 8 questions answered)
    if (questionInDim === 7) {
      const dimStart = currentDim * 8;
      const dimEnd = dimStart + 8;
      const dimAnswers = newAnswers.slice(dimStart, dimEnd);
      const allAnswered = dimAnswers.every((a) => a !== 0);

      if (allAnswered && !completedDimensions.has(currentDim)) {
        setCompletedDimensions(new Set([...completedDimensions, currentDim]));
        setShowCelebration(true);
        return; // Don't advance yet, wait for celebration
      }
    }

    // Advance to next question
    if (index < TOTAL_QUESTIONS - 1) {
      setIndex(index + 1);
    }
  };

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    if (index < TOTAL_QUESTIONS - 1) {
      setIndex(index + 1);
    }
  };

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
    setShowDisclaimer(false);
  };

  const onSubmit = async () => {
    if (answers.some((a) => a === 0)) {
      return;
    }

    setSubmitting(true);
    try {
      const userData = authUser
        ? {
            name: authUser.name,
            email: authUser.email,
            phone: authUser.phone,
          }
        : null;

      const response = await submitTest({
        user: userData,
        testType: "PERSONALITY",
        answers: answers,
      });

      // Clear localStorage
      localStorage.removeItem("livmantra_personality_answers");

      // Redirect to result page
      router.push(`/result/${response.data.id}`);
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Failed to submit test. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  if (checkingUnlock) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#0a0e27",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: "#00ffff" }}>Loading...</Typography>
      </Box>
    );
  }

  if (!testUnlocked) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#0a0e27",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
          <Card
            sx={{
              p: 4,
              background: "rgba(10, 14, 39, 0.8)",
              border: "1px solid rgba(0, 255, 255, 0.3)",
              borderRadius: 0,
            }}
          >
            <Lock sx={{ fontSize: 64, color: "#8a2be2", mb: 2 }} />
            <Typography
              variant="h4"
              sx={{
                color: "#00ffff",
                fontWeight: 700,
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Test Locked
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                mb: 3,
              }}
            >
              Complete the Body Behaviour Analysis (BBA) test first to unlock the Personality Test.
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/dashboard")}
              sx={{
                background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                color: "#0a0e27",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Go to Dashboard
            </Button>
          </Card>
        </Container>
      </Box>
    );
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
      <Header />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 2, sm: 3, md: 4 } }}>
        <DisclaimerModal
          open={showDisclaimer}
          onAccept={handleDisclaimerAccept}
          onClose={() => {
            setShowDisclaimer(false);
            // If disclaimer is closed without accepting, still allow test to proceed
            if (!disclaimerAccepted) {
              setDisclaimerAccepted(true);
            }
          }}
        />

        <DimensionCelebration
          open={showCelebration}
          onClose={handleCelebrationClose}
          dimensionIndex={currentDimension}
          isLastDimension={currentDimension === 5}
          onSubmit={onSubmit}
          allQuestionsAnswered={!answers.some((a) => a === 0)}
        />

        {!showDisclaimer && (
          <>
            <PersonalityProgressXP current={answeredCount} total={TOTAL_QUESTIONS} />

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 2, md: 3 },
                mb: 3,
              }}
            >
              <Box sx={{ flex: { xs: "1", md: "2" } }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <PersonalityQuestionCard
                      question={currentQuestion}
                      onAnswer={onAnswer}
                      selected={answers[index] || undefined}
                    />
                  </motion.div>
                </AnimatePresence>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    onClick={goBack}
                    disabled={index === 0}
                    sx={{
                      color: "#00ffff",
                      borderColor: "rgba(0, 255, 255, 0.3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      px: { xs: 2, sm: 3 },
                      py: { xs: 0.75, sm: 1 },
                      fontSize: { xs: "0.7rem", sm: "0.85rem", md: "1rem" },
                      borderWidth: { xs: "1.5px", sm: "2px" },
                      "&:hover": {
                        borderColor: "#00ffff",
                        bgcolor: "rgba(0, 255, 255, 0.1)",
                        borderWidth: { xs: "1.5px", sm: "2px" },
                      },
                      "&:disabled": {
                        opacity: 0.3,
                      },
                    }}
                    variant="outlined"
                  >
                    ← Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={submitting || answers.some((a) => a === 0)}
                    sx={{
                      px: { xs: 3, sm: 4, md: 5 },
                      py: { xs: 0.75, sm: 1 },
                      borderRadius: 0,
                      fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" },
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                      color: "#0a0e27",
                      border: { xs: "1.5px solid #00ffff", sm: "2px solid #00ffff" },
                      boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      "&:hover": {
                        background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                        boxShadow: "0 0 50px rgba(0, 255, 255, 0.8)",
                        transform: "translateY(-2px)",
                      },
                      "&:disabled": {
                        opacity: 0.6,
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit Mission"}
                  </Button>
                </Box>
              </Box>

              <Box sx={{ flex: { xs: "1", md: "1" } }}>
                <DimensionProgress
                  currentDimension={currentDimension}
                  dimensionProgress={dimensionProgress}
                />
              </Box>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "test"])),
    },
  };
};
