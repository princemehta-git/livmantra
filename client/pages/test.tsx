import React, { useEffect, useState } from "react";
import UserModal from "../components/UserModal";
import DisclaimerModal from "../components/DisclaimerModal";
import QuestionCard from "../components/QuestionCard";
import ProgressXP from "../components/ProgressXP";
import Header from "../components/Header";
import SectionCelebration from "../components/SectionCelebration";
import { submitTest } from "../lib/api";
import { useRouter } from "next/router";
import { Button, Container, Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { calculateBodyType, calculatePrakriti } from "../lib/bodyTypeCalculator";
import { useLanguage } from "../hooks/useLanguage";
import { QUESTIONS_HINDI } from "../data/translations";

// VPK Test Questions - 35 Questions total
// Section A: Body Type (1-6), Section B: Constitution (7-18), Section C: Current Imbalance (19-35)
const QUESTIONS_DATA = [
  // Section A: Body Type (1-6)
  {
    text: "When I look in the mirror, my body looks:",
    hint: "Your overall shape — slim, medium, or broad",
    options: ["Lean & slim", "Average & balanced", "Broad & heavy-set"],
  },
  {
    text: "When I touch or feel my muscles, they feel:",
    hint: "Muscle bulk & firmness — lean, toned, or soft",
    options: ["Lean, not very muscular", "Firm and toned", "Soft but bulky"],
  },
  {
    text: "My weight through life has been:",
    hint: "Do you easily gain fat or stay lean?",
    options: ["Hard to gain weight", "Easy to gain and lose", "Very easy to gain"],
  },
  {
    text: "My body burns energy:",
    hint: "Quick energy vs sustained endurance",
    options: ["Very fast", "At a normal speed", "Slowly"],
  },
  {
    text: "My face shape is mostly:",
    hint: "Narrow, sharp, or round?",
    options: ["Long and narrow", "Sharp or well-defined", "Round and soft"],
  },
  {
    text: "Fat in my body:",
    hint: "Do you easily gain fat or stay lean?",
    options: ["Is very little", "Is balanced", "Builds up easily (belly, hips, thighs)"],
  },
  // Section B: Constitution (7-18)
  {
    text: "My hunger is usually:",
    hint: "Irregular, strong, or mild?",
    options: ["Irregular — sometimes hungry, sometimes not", "Strong — I feel hungry on time", "Mild — I don't feel very hungry"],
  },
  {
    text: "My digestion is usually:",
    hint: "Your long-term digestion pattern",
    options: ["Gassy or bloated", "Acidic or burning", "Slow and heavy"],
  },
  {
    text: "My sleep is usually:",
    hint: "Light, normal, or deep sleeper?",
    options: ["Light and easily disturbed", "Normal and refreshing", "Deep and long"],
  },
  {
    text: "My energy during the day is:",
    hint: "Variable, intense, or steady?",
    options: ["Up and down", "High and intense", "Slow but steady"],
  },
  {
    text: "My skin is naturally:",
    hint: "Baseline skin type",
    options: ["Dry and rough", "Warm or sensitive", "Oily or thick"],
  },
  {
    text: "I usually feel:",
    hint: "Cold sensitive or heat sensitive?",
    options: ["Cold easily", "Hot easily", "Comfortable in most weather"],
  },
  {
    text: "My walking or talking style is:",
    hint: "Fast, confident, or slow?",
    options: ["Fast and restless", "Clear and direct", "Slow and calm"],
  },
  {
    text: "Emotionally, I am usually:",
    hint: "Worry, anger, or calmness?",
    options: ["Worrying or overthinking", "Easily irritated", "Calm and patient"],
  },
  {
    text: "My hair is usually:",
    hint: "Dry, soft, or thick?",
    options: ["Dry or frizzy", "Fine or straight", "Thick or oily"],
  },
  {
    text: "When making decisions, I am:",
    hint: "Confused, quick, or slow but sure?",
    options: ["Confused or change my mind often", "Quick and sharp", "Slow but very sure"],
  },
  {
    text: "My bowel habit is usually:",
    hint: "Constipation, loose, or regular?",
    options: ["Hard or dry", "Loose sometimes", "Regular and well-formed"],
  },
  {
    text: "My work style is:",
    hint: "Ideas, goals, or consistency?",
    options: ["Creative and idea-based", "Goal-focused and perfectionist", "Steady and patient"],
  },
  // Section C: Current Imbalance (19-35)
  {
    text: "Recently, my mood has been:",
    hint: "Anxious? Irritated? Low?",
    options: ["Anxious or restless", "Irritated or angry", "Low or dull", "No major issues"],
  },
  {
    text: "My digestion recently feels:",
    hint: "Gas, acidity, or heaviness?",
    options: ["Gassy or bloated", "Acidic or burning", "Heavy or constipated", "No major issues"],
  },
  {
    text: "My sleep recently has been:",
    hint: "Light, reduced, or heavy?",
    options: ["Light or broken", "Less sleep or heat at night", "Too much sleep or dull", "No major issues"],
  },
  {
    text: "My skin recently looks:",
    hint: "Dry, red, or oily?",
    options: ["Very dry or rough", "Red, irritated, or acne-prone", "Oily or dull", "No major issues"],
  },
  {
    text: "When stressed, I usually:",
    hint: "Overthink, anger, or withdrawal?",
    options: ["Overthink or worry", "Get angry or react", "Shut down or withdraw"],
  },
  {
    text: "My energy right now feels:",
    hint: "Nervous, intense, or heavy?",
    options: ["Nervous or unstable", "Strong but burns out fast", "Slow or heavy"],
  },
  {
    text: "My bowel movements recently are:",
    hint: "Dry? Loose? Heavy?",
    options: ["Dry or irregular", "Loose or urgent", "Slow or heavy", "No major issues"],
  },
  {
    text: "My food cravings are mostly for:",
    hint: "Dry, spicy, or sweet?",
    options: ["Cold or dry foods", "Spicy or salty foods", "Sweet or heavy foods"],
  },
  {
    text: "My body symptoms recently include:",
    hint: "Dryness, heat, or heaviness?",
    options: ["Dryness or stiffness", "Heat or burning", "Mucus or heaviness", "No major issues"],
  },
  {
    text: "Emotionally, I recently feel:",
    hint: "Overwhelmed, aggressive, or low?",
    options: ["Over-sensitive or overwhelmed", "Easily reactive", "Emotionally dull", "No major issues"],
  },
  {
    text: "My concentration recently is:",
    hint: "Too many thoughts, sharp but stressed, or foggy?",
    options: ["Distracted or jumpy", "Sharp but stressed", "Slow or foggy", "No major issues"],
  },
  {
    text: "In the last 30 days, my body has:",
    hint: "Weight loss, heat, or weight gain?",
    options: ["Lost weight or become dry", "Felt overheated", "Gained weight or felt swollen", "No major changes"],
  },
  {
    text: "I feel discomfort mostly in:",
    hint: "Joints, chest/stomach, or sinuses?",
    options: ["Joints or nerves", "Stomach or chest (burning)", "Sinuses, chest, or heaviness", "No major issues"],
  },
  {
    text: "My hunger in the last month has been:",
    hint: "Low, strong, or craving sweets?",
    options: ["Low or irregular", "Very strong", "Emotional or sweet-based", "Normal"],
  },
  {
    text: "My motivation right now feels:",
    hint: "Many ideas, urgency, or slow start?",
    options: ["Scattered", "Urgent or competitive", "Low or slow"],
  },
  {
    text: "Weather affects me like this:",
    hint: "How weather impacts your body",
    options: ["I feel dry in winter", "I feel irritated in summer", "I feel heavy in rainy season"],
  },
  {
    text: "My mind right now feels:",
    hint: "Mental state and clarity",
    options: ["Fast and jumping", "Sharp but heated", "Slow or stuck"],
  },
];

export default function TestPage() {
  const router = useRouter();
  const total = 35;
  const questions = QUESTIONS_DATA;
  const { language, changeLanguage } = useLanguage();

  const [openModal, setOpenModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone: string;
  } | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(total).fill(0));
  const [submitting, setSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState(1);
  const [celebrationSection, setCelebrationSection] = useState("");
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  useEffect(() => {
    const raw = localStorage.getItem("livmantra_user");
    if (!raw) {
      setOpenModal(true);
    } else {
      setUser(JSON.parse(raw));
      // Show disclaimer when user info exists
      setShowDisclaimer(true);
    }
    const savedAnswers = localStorage.getItem("livmantra_answers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("livmantra_answers", JSON.stringify(answers));
  }, [answers]);

  const onAnswer = (val: number) => {
    const nxt = [...answers];
    nxt[index] = val;
    setAnswers(nxt);
    
    // Check if a section is completed
    const newIndex = index + 1;
    
    // Section A completed (after question 6, index 5)
    // Check that all questions in section A (0-5) are answered
    if (index === 5 && !completedSections.has(1)) {
      const sectionAComplete = nxt.slice(0, 6).every(a => a !== 0);
      if (sectionAComplete) {
        setCompletedSections(new Set([...completedSections, 1]));
        setCelebrationLevel(1);
        setCelebrationSection("Body Type Assessment");
        setShowCelebration(true);
        return; // Don't advance index yet, wait for celebration
      }
    }
    
    // Section B completed (after question 18, index 17)
    // Check that all questions in section B (6-17) are answered
    if (index === 17 && !completedSections.has(2)) {
      const sectionBComplete = nxt.slice(6, 18).every(a => a !== 0);
      if (sectionBComplete) {
        setCompletedSections(new Set([...completedSections, 2]));
        setCelebrationLevel(2);
        setCelebrationSection("Constitution Analysis");
        setShowCelebration(true);
        return; // Don't advance index yet, wait for celebration
      }
    }
    
    // Section C completed (after question 35, index 34)
    // Check that all questions in section C (18-34) are answered
    if (index === 34 && !completedSections.has(3)) {
      const sectionCComplete = nxt.slice(18, 35).every(a => a !== 0);
      if (sectionCComplete) {
        setCompletedSections(new Set([...completedSections, 3]));
        setCelebrationLevel(3);
        setCelebrationSection("Imbalance Detection");
        setShowCelebration(true);
        return; // Don't advance index yet, wait for celebration
      }
    }
    
    if (index < total - 1) {
      setIndex(newIndex);
    }
  };
  
  const handleCelebrationClose = () => {
    setShowCelebration(false);
    // Advance to next question after celebration
    if (index < total - 1) {
      setIndex(index + 1);
    }
  };

  const onSubmit = async () => {
    if (!user) {
      alert("Please provide your information first");
      setOpenModal(true);
      return;
    }

    const missing = answers.some((a) => a === 0);
    if (missing && !confirm("You have unanswered questions. Submit anyway?"))
      return;

    const payload = { user, testType: "VPK", answers };
    setSubmitting(true);
    try {
      const r = await submitTest(payload);
      const id = r.data.id;
      localStorage.removeItem("livmantra_answers");
      router.push(`/result/${id}`);
    } catch (err) {
      console.error(err);
      alert("Submit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[index];
  const currentQHindi = QUESTIONS_HINDI[index];
  
  // Get translated question based on language
  const getTranslatedQuestion = () => {
    if (language === "hi" && currentQHindi) {
      return {
        text: currentQHindi.text,
        hint: currentQHindi.hint,
        options: currentQHindi.options,
      };
    }
    return currentQ;
  };
  
  const translatedQ = getTranslatedQuestion();
  
  // Calculate hints for celebration
  const bodyTypeHint = calculateBodyType(answers);
  const prakritiHint = calculatePrakriti(answers);
  
  // Determine which hint to show based on completed section
  const getHintForLevel = () => {
    if (celebrationLevel === 1) {
      return { bodyTypeHint, prakritiHint: null };
    } else if (celebrationLevel === 2) {
      return { bodyTypeHint: null, prakritiHint };
    }
    return { bodyTypeHint: null, prakritiHint: null };
  };
  
  const { bodyTypeHint: displayBodyHint, prakritiHint: displayPrakritiHint } = getHintForLevel();

  return (
    <Box 
      sx={{ 
        overflowX: "hidden",
        background: "#0a0e27",
        minHeight: "100vh",
        position: "relative",
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
          backgroundSize: { xs: "30px 30px", md: "50px 50px" },
          opacity: 0.4,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      
      {/* Glowing orbs */}
      <Box
        sx={{
          position: "fixed",
          top: "20%",
          left: "10%",
          width: { xs: "200px", md: "400px" },
          height: { xs: "200px", md: "400px" },
          background: "radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, transparent 70%)",
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
          bottom: "20%",
          right: "10%",
          width: { xs: "250px", md: "500px" },
          height: { xs: "250px", md: "500px" },
          background: "radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />

      <Header />
      <Container maxWidth="md" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1.5, sm: 2, md: 3 }, position: "relative", zIndex: 1 }}>
        <UserModal
          open={openModal}
          onClose={(u) => {
            setOpenModal(false);
            if (u) {
              setUser(u);
              // Show disclaimer after user info is submitted
              setShowDisclaimer(true);
            }
          }}
        />
        
        <DisclaimerModal
          open={showDisclaimer && !openModal}
          onClose={() => {
            setShowDisclaimer(false);
            setDisclaimerAccepted(true);
          }}
          autoCloseTime={15}
        />
        
        <SectionCelebration
          open={showCelebration}
          onClose={handleCelebrationClose}
          level={celebrationLevel}
          sectionName={celebrationSection}
          bodyTypeHint={displayBodyHint}
          prakritiHint={displayPrakritiHint}
          isLastSection={celebrationLevel === 3}
          onSubmit={onSubmit}
          allQuestionsAnswered={!answers.some((a) => a === 0)}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography 
                variant="h2" 
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2rem", md: "3rem" },
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 50%, #00ffff 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "gradient 3s ease infinite",
                  letterSpacing: "-0.03em",
                  textShadow: "0 0 40px rgba(0, 255, 255, 0.3)",
                  mb: 1,
                }}
              >
                KNOW YOUR BODY
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 300,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontSize: { xs: "0.8rem", md: "0.95rem" },
                  mb: 0.5,
                }}
              >
                NMBT Test
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "rgba(255, 255, 255, 0.5)",
                  fontWeight: 400,
                  fontSize: { xs: "0.8rem", md: "0.9rem" },
                }}
              >
                Discover your body type and natural constitution
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {disclaimerAccepted && !showDisclaimer && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <ProgressXP current={answers.filter(Boolean).length} total={total} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Box sx={{ mt: 2, mb: 2, textAlign: "center", px: { xs: 1, sm: 0 } }}>
                <Typography 
                  variant="body2" 
                  sx={{
                    display: "inline-block",
                    px: { xs: 1.5, sm: 2.5 },
                    py: { xs: 0.75, sm: 1 },
                    borderRadius: 0,
                    bgcolor: "rgba(0, 255, 255, 0.1)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    color: "#00ffff",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: { xs: "0.65rem", sm: "0.8rem" },
                    boxShadow: "0 0 15px rgba(0, 255, 255, 0.2)",
                    lineHeight: 1.4,
                  }}
                >
                  Mission Phase:{" "}
                  {index < 6
                    ? "Body Type Analysis (1-6)"
                    : index < 18
                    ? "Constitution Scan (7-18)"
                    : "Imbalance Detection (19-35)"}
                </Typography>
              </Box>
            </motion.div>
          </>
        )}

        {disclaimerAccepted && !showDisclaimer && (
          <>
            <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
            >
              <QuestionCard
                qIndex={index}
                text={translatedQ.text}
                options={translatedQ.options}
                hint={translatedQ.hint}
                onAnswer={onAnswer}
                selected={answers[index] || undefined}
                language={language}
                onLanguageChange={changeLanguage}
              />
            </motion.div>
          </AnimatePresence>
          </>
        )}

        {disclaimerAccepted && !showDisclaimer && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 }, mt: 2, flexWrap: "wrap", justifyContent: "center", px: { xs: 1, sm: 0 } }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                disabled={index === 0}
                onClick={() => setIndex(Math.max(0, index - 1))}
                sx={{
                  px: { xs: 1.5, sm: 4 },
                  py: { xs: 0.75, sm: 1.5 },
                  borderRadius: 0,
                  borderWidth: { xs: 1.5, sm: 2 },
                  borderColor: "rgba(0, 255, 255, 0.3)",
                  color: "#00ffff",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: { xs: "0.65rem", sm: "0.9rem" },
                  minWidth: { xs: "70px", sm: "auto" },
                  "&:hover": {
                    borderWidth: { xs: 1.5, sm: 2 },
                    borderColor: "rgba(0, 255, 255, 0.6)",
                    bgcolor: "rgba(0, 255, 255, 0.1)",
                    boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
                  },
                  "&:disabled": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                ← Back
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                disabled={index === total - 1}
                onClick={() => setIndex(Math.min(total - 1, index + 1))}
                sx={{
                  px: { xs: 1.5, sm: 4 },
                  py: { xs: 0.75, sm: 1.5 },
                  borderRadius: 0,
                  borderWidth: { xs: 1.5, sm: 2 },
                  borderColor: "rgba(0, 255, 255, 0.3)",
                  color: "#00ffff",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: { xs: "0.65rem", sm: "0.9rem" },
                  minWidth: { xs: "70px", sm: "auto" },
                  "&:hover": {
                    borderWidth: { xs: 1.5, sm: 2 },
                    borderColor: "rgba(0, 255, 255, 0.6)",
                    bgcolor: "rgba(0, 255, 255, 0.1)",
                    boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
                  },
                  "&:disabled": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Next →
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                onClick={onSubmit}
                disabled={submitting || answers.some((a) => a === 0)}
                sx={{
                  px: { xs: 2, sm: 5 },
                  py: { xs: 0.9, sm: 1.5 },
                  borderRadius: 0,
                  fontSize: { xs: "0.7rem", sm: "1rem" },
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  color: "#0a0e27",
                  border: { xs: "1.5px solid #00ffff", sm: "2px solid #00ffff" },
                  boxShadow: "0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(138, 43, 226, 0.2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                    boxShadow: "0 0 50px rgba(0, 255, 255, 0.8), inset 0 0 30px rgba(138, 43, 226, 0.3)",
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
            </motion.div>
              </Box>
            </motion.div>
          </>
        )}

      </Container>
    </Box>
  );
}

