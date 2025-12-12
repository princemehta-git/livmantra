import React, { useEffect, useState } from "react";
import UserModal from "../components/UserModal";
import QuestionCard from "../components/QuestionCard";
import ProgressXP from "../components/ProgressXP";
import Header from "../components/Header";
import { submitTest } from "../lib/api";
import { useRouter } from "next/router";
import { Button, Container, Box, Typography } from "@mui/material";

// VPK Test Questions - 36 Questions total
// Section A: Somatotype (1-6), Section B: Prakriti (7-18), Section C: Vikriti (19-36)
const QUESTION_TEMPLATES = [
  "My natural body frame is:",
  "My muscle build is naturally:",
  "My weight pattern through life:",
  "My metabolism feels:",
  "My face shape tends to be:",
  "My fat storage pattern:",
  "My appetite is usually:",
  "My digestion pattern is:",
  "My sleep nature is:",
  "My energy pattern is:",
  "My skin type is naturally:",
  "I usually feel:",
  "My walking/talking style is:",
  "My emotional style is:",
  "My hair type is:",
  "My decision-making is:",
  "My bowel pattern is usually:",
  "My working style is:",
  "Recently my mood has been:",
  "My digestion recently feels:",
  "My recent sleep pattern:",
  "My skin recently looks:",
  "Under stress, I tend to:",
  "My current energy is:",
  "My recent bowel movements are:",
  "My food cravings are mostly for:",
  "My current body symptoms include:",
  "My emotional stability recently is:",
  "My concentration recently is:",
  "Physical changes in last 30 days:",
  "I currently feel the most discomfort in:",
  "My hunger pattern in last 30 days:",
  "My motivation currently feels:",
  "My body's response to weather:",
  "My mental pace right now:",
  "I currently experience more:",
];

const OPTIONS = [
  // Section A: Somatotype (1-6)
  ["Thin, narrow, delicate", "Medium, well-proportioned", "Broad, wide, solid"],
  ["Low muscle, lean", "Good muscle, athletic", "Soft muscle, bulky"],
  ["Hard to gain weight", "Gain/lose weight easily", "Gain weight very easily"],
  ["Fast", "Moderate", "Slow"],
  ["Long, narrow", "Square, defined", "Round, soft"],
  ["Very little fat gain", "Moderate, balanced", "Store fat easily (belly/hips)"],
  // Section B: Prakriti (7-18)
  ["Irregular, varies day to day", "Strong and sharp", "Mild and steady"],
  ["Gas, bloating easily", "Acidity, burning", "Heavy, slow digestion"],
  ["Light, easily disturbed", "Moderate, refreshing", "Deep and long"],
  ["Variable — ups and downs", "High, intense, focused", "Steady, slow but consistent"],
  ["Dry, rough", "Warm, sensitive", "Oily, thick"],
  ["Cold easily", "Hot easily", "Comfortable in most temperatures"],
  ["Fast, restless", "Clear, direct", "Slow, calm"],
  ["Worrying, overthinking", "Irritable, angry", "Calm, steady"],
  ["Dry, frizzy, thin", "Straight, fine", "Thick, wavy, oily"],
  ["Indecisive, confused", "Quick, sharp", "Slow but sure"],
  ["Dry, hard (constipation tendency)", "Loose stools at times", "Regular, well-formed"],
  ["Creative, idea-oriented", "Goal-driven, perfectionist", "Patient, consistent"],
  // Section C: Vikriti (19-36)
  ["Anxious or fidgety", "Irritated or angry", "Low, dull, unmotivated"],
  ["Gas, bloating", "Acidity, burning", "Heavy, slow"],
  ["Light, broken", "Reduced sleep, heat", "Oversleeping, dullness"],
  ["Dry, rough", "Red, irritated, acne", "Oily, dull"],
  ["Overthink or fear the worst", "Get angry or react", "Shut down or withdraw"],
  ["Nervous or fluctuating", "Intense but quickly burning", "Slow, heavy"],
  ["Dry, variable", "Loose or urgent", "Slow, heavy"],
  ["Dry or cold foods", "Spicy or salty foods", "Sweet, heavy foods"],
  ["Dryness, stiffness", "Heat, acidity, inflammation", "Mucus, swelling, heaviness"],
  ["Over-sensitive, overwhelmed", "Reactive, aggressive", "Detached, unmotivated"],
  ["Distracted, racing thoughts", "Sharp but stressed", "Slow, foggy"],
  ["Weight loss or dryness", "Heat-related symptoms", "Weight gain, water retention"],
  ["Joints, nerves, dryness", "Stomach, chest (heat/burning)", "Sinuses, lungs, digestion (heaviness)"],
  ["Low appetite, irregular", "Intense hunger", "Emotional/sweet cravings"],
  ["Scattered", "Competitive, urgent", "Low, slow"],
  ["Gets dry in winter", "Gets irritated in summer", "Gets heavy in monsoon"],
  ["Fast, jumping", "Sharp but heated", "Slow or stuck"],
  ["Anxiety, restlessness", "Irritation, heat", "Lethargy, heaviness"],
];

export default function TestPage() {
  const router = useRouter();
  const total = 36;
  const questions = QUESTION_TEMPLATES.map((q, i) => ({
    text: q,
    options: OPTIONS[i] || ["Option 1", "Option 2", "Option 3"],
  }));

  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone: string;
  } | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(total).fill(0));
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}>
      <Header />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <UserModal
          open={openModal}
          onClose={(u) => {
            setOpenModal(false);
            if (u) setUser(u);
          }}
        />

        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            VPK Test
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Discover your body type and dosha constitution
          </Typography>
        </Box>

        <ProgressXP current={answers.filter(Boolean).length} total={total} />

        <QuestionCard
          qIndex={index}
          text={currentQ.text}
          options={currentQ.options}
          onAnswer={onAnswer}
          selected={answers[index] || undefined}
        />

        <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            variant="outlined"
            disabled={index === 0}
            onClick={() => setIndex(Math.max(0, index - 1))}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              borderWidth: 2,
              fontWeight: 600,
              "&:hover": {
                borderWidth: 2,
                bgcolor: "rgba(99, 102, 241, 0.05)",
              },
            }}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            disabled={index === total - 1}
            onClick={() => setIndex(Math.min(total - 1, index + 1))}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              borderWidth: 2,
              fontWeight: 600,
              "&:hover": {
                borderWidth: 2,
                bgcolor: "rgba(99, 102, 241, 0.05)",
              },
            }}
          >
            Next
          </Button>
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={submitting}
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.2)",
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.4), 0 10px 10px -5px rgba(99, 102, 241, 0.2)",
              },
            }}
          >
            {submitting ? "Submitting..." : "Submit Test"}
          </Button>
        </Box>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography 
            variant="body2" 
            sx={{
              display: "inline-block",
              px: 3,
              py: 1,
              borderRadius: 2,
              bgcolor: "rgba(99, 102, 241, 0.1)",
              color: "#6366f1",
              fontWeight: 600,
            }}
          >
            Section:{" "}
            {index < 6
              ? "Somatotype (1-6)"
              : index < 18
              ? "Prakriti (7-18)"
              : "Vikriti (19-36)"}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

