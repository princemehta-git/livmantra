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
    options: ["Hard to gain weight", "Easy to gain and lose", "Easy to gain but hard to lose"],
  },
  {
    text: "My body burns energy or fat / my metabolism is:",
    hint: "Quick energy vs sustained endurance",
    options: ["Very fast", "At a normal speed", "Slowly"],
  },
  {
    text: "My face shape is mostly:",
    hint: "Narrow, sharp, or round?",
    options: ["Long and narrow", "Sharp or well-defined", "Round and soft."],
  },
  {
    text: "Fat in my body:",
    hint: "Do you easily gain fat or stay lean?",
    options: ["Is very little, skinny", "Is balanced or average", "Builds up easily (belly, hips, thighs)"],
  },
  // Section B: Constitution (7-18)
  {
    text: "My hunger is usually:",
    hint: "Irregular, strong, or mild?",
    options: ["Irregular — sometimes hungry, sometimes not", "Strong — I feel hungry on time", "Mild — I don't feel very hungry any time of the day"],
  },
  {
    text: "My digestion is usually:",
    hint: "Your long-term digestion pattern",
    options: ["Gassy or bloated after meals", "Acidic or burning after meals or after long hour fasting", "Slow and heavy, feels heavy & lethargic after meals"],
  },
  {
    text: "My sleep is usually:",
    hint: "Light, normal, or deep sleeper?",
    options: ["Light and easily disturbed; and cannot sleep longer", "Normal, undisturbed and refreshing (feels fresh after getting up)", "Deep and long (I can sleep more than others), always refreshing"],
  },
  {
    text: "My energy during the day is:",
    hint: "Variable, intense, or steady?",
    options: ["Up and down, sometimes very energetic, other times totally drained and the circle continues.", "High and intense, very energetic throughout the day", "Slow but steady, work or move with slower pace but constant energy throughout the day"],
  },
  {
    text: "My skin is naturally:",
    hint: "Baseline skin type",
    options: ["Dry and rough, irrespective of seasons", "Warm or sensitive (triggered allergy or reactions very easily)", "Oily or thick (rarely face skin issues)"],
  },
  {
    text: "I usually feel:",
    hint: "Cold sensitive or heat sensitive?",
    options: ["Cold easily, even when others feel normal", "Hot easily, even when others feel normal", "Comfortable in most weather"],
  },
  {
    text: "My walking or talking style is:",
    hint: "Fast, confident, or slow?",
    options: ["Fast and restless", "Clear and direct, confident", "Slow and calm"],
  },
  {
    text: "Emotionally, I am usually:",
    hint: "Worry, anger, or calmness?",
    options: ["Worrying or overthinking, anxious over small matters", "Easily irritated angry or furious", "Calm and patient even in adverse situations, I rarely panic or express anger"],
  },
  {
    text: "My hair is usually (irrespective of seasons):",
    hint: "Dry, soft, or thick?",
    options: ["Dry or frizzy, less shiny", "Fine-stranded, thin or straight", "Thick, dense or oily, shiny"],
  },
  {
    text: "When making decisions, I am:",
    hint: "Confused, quick, or slow but sure?",
    options: ["Confused or change my mind often, difficult to reach any decision", "Quick and sharp, quite decisive", "Slow, take time to analyse situation and element of issues, but once conclude and decide on something, it's almost always permanent."],
  },
  {
    text: "My Toilet habit is usually:",
    hint: "Constipation, loose, or regular?",
    options: ["Hard or dry, need to put pressure to pass stool", "Loose to semi solid, not so well-formed", "Regular and well-formed, pass easily"],
  },
  {
    text: "My work style is / I work best with :",
    hint: "Ideas, goals, or consistency?",
    options: ["Creative and idea-based\n(I generate ideas from scratch and use creativity to design my own way of working.)", "Goal-focused and perfectionist\n(I focus on executing ideas efficiently and delivering the best possible results, with high\nquality and on time.)", "Steady and patient\n(I prefer using existing structures or systems and execute them consistently, calmly, and\nreliably to achieve results over time)"],
  },
  // Section C: Current Imbalance (19-35)
  {
    text: "Recently, my mood (emotional energy) has been:",
    hint: "Anxious? Irritated? Low?",
    options: ["Anxious or restless on even small issues or matter", "Irritated or angry quite easily, even on things which I could have ignored earlier", "Low or dull, doesn't feel like doing anything or involving in any matter or people.", "No major issues"],
  },
  {
    text: "Recently, After meals, I predominantly feels:",
    hint: "Gas, acidity, or heaviness?",
    options: ["Gassy or bloated", "Acidic or burning", "Heavy or constipated", "No major issues"],
  },
  {
    text: "My sleep recently has been:",
    hint: "Light, reduced, or heavy?",
    options: ["Take longer time to fall asleep, sleep breaks in between and not able to sleep longer", "Less sleep at night and feels hot at night.", "Sleeping for longer duration, yet feel dull", "No major issues, sleep well."],
  },
  {
    text: "My skin recently looks:",
    hint: "Dry, red, or oily?",
    options: ["Very dry or rough", "Red, quietly irritated, or acne-prone (very sensitive)", "Oily or dull", "No major issues"],
  },
  {
    text: "When stressed, I usually:",
    hint: "Overthink, anger, or withdrawal?",
    options: ["Overthink or worry and get anxious", "Get angry or react aggressively", "Shut down or withdraw and keep things within."],
  },
  {
    text: "My Physical energy right now feels:",
    hint: "Nervous, intense, or heavy?",
    options: ["Nervous or unstable (Energy feels restless, shaky, or inconsistent.)", "Strong but burns out fast (I have bursts of energy but get tired quickly).", "Slow or heavy (Energy feels low, sluggish, or hard to activate.)"],
  },
  {
    text: "My bowel movements recently are:",
    hint: "Dry? Loose? Heavy?",
    options: ["Stools are hard, dry, or not regular.", "Frequent, loose stools or sudden urgency.", "Digestion feels slow; stools are heavy or sluggish.", "Bowel movements feel normal and regular."],
  },
  {
    text: "My food cravings are mostly for:",
    hint: "Dry, spicy, or sweet?",
    options: ["Cold or dry foods (Salads, cold milk, biscuits, dry snacks, leftovers.)", "Spicy or salty foods (Chaat, pickles, namkeen, spicy curries, chips.)", "Sweet or heavy foods (Mithai, halwa, kheer, sweets, fried foods like puri or\npakora.)"],
  },
  {
    text: "My body symptoms recently include:",
    hint: "Dryness, heat, or heaviness?",
    options: ["Dryness or stiffness (Dry skin, dry lips, joint stiffness, or cracking)", "Heat or burning (Feeling hot, acidity, burning sensation, or inflammation.)", "Mucus or heaviness (Congestion, excess mucus, bloating, or heaviness in the\nbody.)", "No major issues (No noticeable or ongoing physical symptoms.)"],
  },
  {
    text: "Emotionally, I recently feel:",
    hint: "Overwhelmed, aggressive, or low?",
    options: ["emotionally sensitive and easily overloaded.", "I react quickly, often with irritation or frustration.", "numb, low, or disconnected emotionally.", "My emotions feel balanced and stable."],
  },
  {
    text: "My concentration recently is:",
    hint: "Too many thoughts, sharp but stressed, or foggy?",
    options: ["Distracted or jumpy (I lose focus easily and my attention shifts often.)", "Sharp but stressed (I can focus well, but I feel tense or pressured)", "Slow or foggy (My thinking feels dull, heavy, or unclear.)", "No major issues (My concentration feels normal and steady.)"],
  },
  {
    text: "In the last 30 days, my body has:",
    hint: "Weight loss, heat, or weight gain?",
    options: ["lost weight, or my body feels dry or depleted.", "been feeling warmer than usual or overheat easily.", "gained weight, feel bloated, or notice swelling", "No major changes"],
  },
  {
    text: "Recently, I am experiencing discomfort mostly in:",
    hint: "Joints, chest/stomach, or sinuses?",
    options: ["Joints or nerves (Pain, stiffness, tingling, or nerve discomfort.)", "Stomach or chest (Acidity, heartburn, or burning sensations.)", "Sinuses, chest, or heaviness (Congestion, mucus, pressure, or feeling heavy.)", "No noticeable or ongoing discomfort."],
  },
  {
    text: "My hunger in the last month has been:",
    hint: "Low, strong, or craving sweets?",
    options: ["Low or irregular (I don't feel hungry often, or my hunger comes and goes.)", "I feel hungry frequently and strongly.", "I crave food, especially sweets, due to emotions or stress.", "My hunger feels balanced and regular."],
  },
  {
    text: "My motivation right now feels:",
    hint: "Many ideas, urgency, or slow start?",
    options: ["Scattered (want to do many things, but my energy and focus are scattered, making it hard\nto start or complete anything)", "Urgent or competitive (I feel driven, pressured, or eager to act and achieve quickly.)", "Low or slow (I have little energy or motivation and prefer moving at a relaxed pace)"],
  },
  {
    text: "Recently, Weather affects me like this:",
    hint: "How weather impacts your body",
    options: ["I feel more dry in winter (winters are more hard to handle)", "I feel more irritated in summer (summers are more hard to handle)", "I feel heavy, dull and more uneasy in rainy season (Rain getting harder to handle)"],
  },
  {
    text: "My mind right now feels:",
    hint: "Mental state and clarity",
    options: ["Fast and jumping (Thoughts move quickly and shift from one idea to another)", "Sharp but heated (Thinking is clear but tense, pressured, or easily irritated.)", "Slow or stuck (My mind feels slow and kind of stuck.)"],
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
                  fontSize: { xs: "1.5rem", md: "2rem" },
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
                KNOW YOUR BODY NATURE & BEHAVIOR
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
                BBA Test
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

