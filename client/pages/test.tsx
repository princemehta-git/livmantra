import React, { useEffect, useState } from "react";
import UserModal from "../components/UserModal";
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
// Section A: Body Type (1-5), Section B: Constitution (6-20), Section C: Current Imbalance (21-35)
const QUESTIONS_DATA = [
  // Section A: Body Type (1-5)
  {
    text: "What is your natural body frame? (outward overall look)",
    hint: "Your overall shape — slim, medium, or broad",
    options: ["Slim or light", "Medium or athletic", "Broad or sturdy or solid build"],
  },
  {
    text: "How do your muscles naturally feel or look?",
    hint: "Muscle bulk & firmness — lean, toned, or soft",
    options: ["Lean, less bulky", "Firm, toned and well-built", "Soft, more rounded"],
  },
  {
    text: "How does your body store fat typically?",
    hint: "Do you easily gain fat or stay lean?",
    options: ["I gain very little fat", "Fat is stored evenly all over the body", "I put on fat easily, especially around belly or hips"],
  },
  {
    text: "What is your bone structure like? (inner bony structure)",
    hint: "Wrist/ankle size, bone heaviness — small, medium, or heavy bones",
    options: ["Small/light", "Medium", "Large/heavy"],
  },
  {
    text: "How would you describe your natural strength/stamina?",
    hint: "Quick energy vs sustained endurance",
    options: ["Quick but gets tired fast", "Strong and steady", "Slow but lasts long"],
  },
  // Section B: Constitution (6-20)
  {
    text: "How does your natural weight behave?",
    hint: "Long-term tendency — gain easily or stay lean?",
    options: ["Even if I eat well, I don't gain weight easily", "My weight can change up or down quite easily", "I gain weight quickly and find it harder to lose"],
  },
  {
    text: "How is your digestion generally?",
    hint: "Your long-term digestion pattern",
    options: ["Easily get Gas/bloating", "Usually Strong, regular", "Digestion is Slow & usually feels heavy"],
  },
  {
    text: "What is your natural appetite like?",
    hint: "Irregular, strong, or mild?",
    options: ["It changes a lot — sometimes strong, sometimes weak", "Strong and I feel hungry on time", "Mild and steady, not too strong"],
  },
  {
    text: "What does your face shape look like naturally?",
    hint: "Narrow, sharp, or round?",
    options: ["Narrow or longer face", "More Angular or defined face", "Round or softer face"],
  },
  {
    text: "How do you usually sleep (long-term)?",
    hint: "Light, normal, or deep sleeper?",
    options: ["Light sleep — I wake up easily", "Mostly good and refreshing", "Deep longer sleep — can sleep even longer"],
  },
  {
    text: "How is your energy throughout the day?",
    hint: "Variable, intense, or steady?",
    options: ["Up and down — sometimes high, sometimes low", "High and focused", "Steady and calm, even if a bit slow"],
  },
  {
    text: "How does your skin feels naturally?",
    hint: "Baseline skin type",
    options: ["Dry/rough", "Warm/sensitive", "Oily/thick"],
  },
  {
    text: "How do you handle temperature naturally?",
    hint: "Cold sensitive or heat sensitive?",
    options: ["Feel cold quickly", "Feel hot quickly", "Mostly Comfortable in any temperature"],
  },
  {
    text: "How do you naturally walk/talk?",
    hint: "Fast, confident, or slow?",
    options: ["Fast or a bit restless", "Clear & confident", "Slow & relaxed"],
  },
  {
    text: "How do you generally react emotionally?",
    hint: "Worry, anger, or calmness?",
    options: ["I worry or overthink", "I get irritated or angry quickly", "I stay calm and steady mostly"],
  },
  {
    text: "What is your natural hair type?",
    hint: "Dry, soft, or thick?",
    options: ["Dry, frizzy, or thin", "Straight and soft", "Thick, wavy, or a bit oily"],
  },
  {
    text: "How do you usually make decisions?",
    hint: "Confused, quick, or slow but sure?",
    options: ["I take time — sometimes confused", "Quick and sharp decisions", "Slow but sure decisions"],
  },
  {
    text: "How are your bowel movements generally?",
    hint: "Constipation, loose, or regular?",
    options: ["Hard or dry stools, constipation tendency", "Sometimes loose stools", "Regular and well-formed"],
  },
  {
    text: "What is your natural thinking style?",
    hint: "Creative, analytical, or stable?",
    options: ["Creative, imaginative", "Logical, perfectionist", "Steady, practical"],
  },
  {
    text: "How would you describe your long-term working style?",
    hint: "Ideas, goals, or consistency?",
    options: ["Idea-oriented, Self-driven", "Goal or perfection-oriented, driven by purpose", "Consistent/steady worker following system"],
  },
  // Section C: Current Imbalance (21-35)
  {
    text: "Recently, how has your mood been?",
    hint: "Anxious? Irritated? Low?",
    options: ["A bit anxious or fidgety", "Easily irritated or angry", "Low energy or not motivated"],
  },
  {
    text: "Recently, how has your digestion felt?",
    hint: "Gas, acidity, or heaviness?",
    options: ["Gas/bloating", "Burning/acidity", "Heavy/slow"],
  },
  {
    text: "Lately, how has your sleep been?",
    hint: "Light, reduced, or heavy?",
    options: ["Light sleep or waking up often", "Sleeping less with a heated feeling", "Sleeping more and feeling dull"],
  },
  {
    text: "Recently, how is your skin behaving?",
    hint: "Dry, red, or oily?",
    options: ["Dry or rough", "Red/sensitive, getting pimples", "Oily/ looking dull"],
  },
  {
    text: "Lately, how do you react under stress?",
    hint: "Overthink, anger, or withdrawal?",
    options: ["I worry a lot or overthink", "I react quickly or get angry", "I withdraw and become quiet"],
  },
  {
    text: "Recently, how is your energy?",
    hint: "Nervous, intense, or heavy?",
    options: ["Nervous energy — up and down", "Intense but it burns out quickly", "Slow and heavy energy"],
  },
  {
    text: "Recently, how are your bowel movements?",
    hint: "Dry? Loose? Heavy?",
    options: ["Dry/irregular", "Loose/urgent", "Heavy/sluggish"],
  },
  {
    text: "Lately, what foods do you crave most?",
    hint: "Dry, spicy, or sweet?",
    options: ["Dry/cold", "Spicy/salty", "Sweet/heavy (oily or fried)"],
  },
  {
    text: "In the past few days, what body feeling do you notice the most?",
    hint: "Dryness, heat, or heaviness?",
    options: ["Dry/stiff", "Heat/burning/irritation", "Heavy/mucus/swelling"],
  },
  {
    text: "Recently, how have your emotions felt?",
    hint: "Overwhelmed, aggressive, or low?",
    options: ["I feel overwhelmed or sensitive", "I react quickly or get aggressive", "I feel low or disconnected"],
  },
  {
    text: "Recently, how is your focus?",
    hint: "Too many thoughts, sharp but stressed, or foggy?",
    options: ["Scattered. Hard to Focus, too many thoughts", "Sharp focus but bit stressed or tensed", "Slow thinking or brain fog"],
  },
  {
    text: "In the past few weeks, what physical changes have you noticed?",
    hint: "Weight loss, heat, or weight gain?",
    options: ["More Dryness/weight loss", "Feeling More heat in the body", "Heaviness/weight gain/water retention"],
  },
  {
    text: "Recently, where do you feel most discomfort?",
    hint: "Joints, chest/stomach, or sinuses?",
    options: ["Joints/nerves—dryness or stiffness", "Chest/stomach—burning or heat", "Sinus/heaviness—heaviness or mucus"],
  },
  {
    text: "Recently, how is your hunger?",
    hint: "Low, strong, or craving sweets?",
    options: ["Low/irregular", "Strong", "Sweet cravings or emotional eating"],
  },
  {
    text: "Lately, how is your motivation for work or life, in general?",
    hint: "Many ideas, urgency, or slow start?",
    options: ["too Many ideas but hard to start", "Strong and competitive Urgency", "Low drive or very slow to start"],
  },
];

export default function TestPage() {
  const router = useRouter();
  const total = 35;
  const questions = QUESTIONS_DATA;
  const { language, changeLanguage } = useLanguage();

  const [openModal, setOpenModal] = useState(false);
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
    
    // Section A completed (after question 5, index 4)
    // Check that all questions in section A (0-4) are answered
    if (index === 4 && !completedSections.has(1)) {
      const sectionAComplete = nxt.slice(0, 5).every(a => a !== 0);
      if (sectionAComplete) {
        setCompletedSections(new Set([...completedSections, 1]));
        setCelebrationLevel(1);
        setCelebrationSection("Body Type Assessment");
        setShowCelebration(true);
        return; // Don't advance index yet, wait for celebration
      }
    }
    
    // Section B completed (after question 20, index 19)
    // Check that all questions in section B (5-19) are answered
    if (index === 19 && !completedSections.has(2)) {
      const sectionBComplete = nxt.slice(5, 20).every(a => a !== 0);
      if (sectionBComplete) {
        setCompletedSections(new Set([...completedSections, 2]));
        setCelebrationLevel(2);
        setCelebrationSection("Constitution Analysis");
        setShowCelebration(true);
        return; // Don't advance index yet, wait for celebration
      }
    }
    
    // Section C completed (after question 35, index 34)
    // Check that all questions in section C (20-34) are answered
    if (index === 34 && !completedSections.has(3)) {
      const sectionCComplete = nxt.slice(20, 35).every(a => a !== 0);
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
          top: "20%",
          left: "10%",
          width: "400px",
          height: "400px",
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
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />

      <Header />
      <Container maxWidth="md" sx={{ py: 6, position: "relative", zIndex: 1 }}>
        <UserModal
          open={openModal}
          onClose={(u) => {
            setOpenModal(false);
            if (u) setUser(u);
          }}
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
          <Box sx={{ mb: 6, textAlign: "center" }}>
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
                  fontSize: { xs: "2.5rem", md: "4rem" },
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 50%, #00ffff 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "gradient 3s ease infinite",
                  letterSpacing: "-0.03em",
                  textShadow: "0 0 40px rgba(0, 255, 255, 0.3)",
                  mb: 2,
                }}
              >
                Bio Check MODE
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
                  fontSize: { xs: "0.9rem", md: "1.1rem" },
                  mb: 1,
                }}
              >
                NMBT Test
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "rgba(255, 255, 255, 0.5)",
                  fontWeight: 400,
                  fontSize: { xs: "0.85rem", md: "1rem" },
                }}
              >
                Discover your body type and dosha constitution
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

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
          <Box sx={{ mt: 4, mb: 4, textAlign: "center" }}>
            <Typography 
              variant="body2" 
              sx={{
                display: "inline-block",
                px: 3,
                py: 1.5,
                borderRadius: 0,
                bgcolor: "rgba(0, 255, 255, 0.1)",
                border: "1px solid rgba(0, 255, 255, 0.3)",
                color: "#00ffff",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "0.85rem",
                boxShadow: "0 0 15px rgba(0, 255, 255, 0.2)",
              }}
            >
              Mission Phase:{" "}
              {index < 5
                ? "Body Type Analysis (1-5)"
                : index < 20
                ? "Constitution Scan (6-20)"
                : "Imbalance Detection (21-35)"}
            </Typography>
          </Box>
        </motion.div>

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap", justifyContent: "center" }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                disabled={index === 0}
                onClick={() => setIndex(Math.max(0, index - 1))}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 0,
                  borderWidth: 2,
                  borderColor: "rgba(0, 255, 255, 0.3)",
                  color: "#00ffff",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.9rem",
                  "&:hover": {
                    borderWidth: 2,
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
                  px: 4,
                  py: 1.5,
                  borderRadius: 0,
                  borderWidth: 2,
                  borderColor: "rgba(0, 255, 255, 0.3)",
                  color: "#00ffff",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.9rem",
                  "&:hover": {
                    borderWidth: 2,
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
                  px: 5,
                  py: 1.5,
                  borderRadius: 0,
                  fontSize: "1rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #00ffff 0%, #8a2be2 100%)",
                  color: "#0a0e27",
                  border: "2px solid #00ffff",
                  boxShadow: "0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(138, 43, 226, 0.2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
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

      </Container>
    </Box>
  );
}

