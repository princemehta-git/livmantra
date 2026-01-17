// Personality Test Scoring Service
// Calculates variants and generates 6-letter personality code

export type DimensionVariant = "A" | "B" | "C";

export type DimensionResult = {
  dimensionIndex: number;
  dimensionName: string;
  leftPole: string;
  rightPole: string;
  leftScore: number;
  rightScore: number;
  variant: DimensionVariant;
  code: string;
};

export type PersonalityType = {
  id: number;
  family: string;
  name: string;
  descriptor: string;
  code: string;
};

export type PersonalityResultSnapshot = {
  code: string; // 6-letter code (e.g., "R-C-F-I-A-B")
  dimensions: DimensionResult[];
  personalityType: PersonalityType | null;
  personalityName?: string; // Generated name (e.g., "Adaptive Navigators – Thoughtful Connector")
  score?: number;
};

// 18 Core Personalities
const PERSONALITY_TYPES: PersonalityType[] = [
  {
    id: 1,
    family: "Calm Thinkers",
    name: "Calm Adaptive Thinker",
    descriptor: "Thoughtful, steady, flexible in real life",
    code: "R-C-F-I-A-B",
  },
  {
    id: 2,
    family: "Calm Thinkers",
    name: "Grounded Reflective Planner",
    descriptor: "Calm, structured, dependable",
    code: "R-C-S-I-R-C",
  },
  {
    id: 3,
    family: "Calm Thinkers",
    name: "Quiet Consistent Builder",
    descriptor: "Stable mind, steady habits",
    code: "R-C-S-I-R-M",
  },
  {
    id: 4,
    family: "Calm Thinkers",
    name: "Insightful Solo Navigator",
    descriptor: "Deep thinker, values space and rhythm",
    code: "R-C-F-I-R-B",
  },
  {
    id: 5,
    family: "Calm Thinkers",
    name: "Gentle Routine Keeper",
    descriptor: "Calm, disciplined, predictable",
    code: "R-C-S-I-A-C",
  },
  {
    id: 6,
    family: "Calm Thinkers",
    name: "Balanced Inner Harmonizer",
    descriptor: "Emotionally steady, well-balanced",
    code: "R-C-B-I-B-B",
  },
  {
    id: 7,
    family: "Adaptive Navigators",
    name: "Balanced Life Navigator",
    descriptor: "Flexible, stable across situations",
    code: "B-B-B-B-B-B",
  },
  {
    id: 8,
    family: "Adaptive Navigators",
    name: "Practical Flexible Planner",
    descriptor: "Realistic, adaptable, health-oriented",
    code: "B-C-F-B-A-B",
  },
  {
    id: 9,
    family: "Adaptive Navigators",
    name: "Steady Social Balancer",
    descriptor: "Emotionally aware, socially flexible",
    code: "B-B-F-P-B-B",
  },
  {
    id: 10,
    family: "Adaptive Navigators",
    name: "Mindful Energy Manager",
    descriptor: "Balances activity and rest",
    code: "B-C-B-B-R-B",
  },
  {
    id: 11,
    family: "Adaptive Navigators",
    name: "Adaptive Habit Shaper",
    descriptor: "Builds habits with awareness",
    code: "B-B-F-B-B-M",
  },
  {
    id: 12,
    family: "Adaptive Navigators",
    name: "Calm-Action Integrator",
    descriptor: "Calm inside, active outside",
    code: "B-C-B-B-A-C",
  },
  {
    id: 13,
    family: "Dynamic Energizers",
    name: "Dynamic Expressive Explorer",
    descriptor: "Energetic, expressive, interest-driven",
    code: "E-R-F-P-A-M",
  },
  {
    id: 14,
    family: "Dynamic Energizers",
    name: "Passion-Driven Connector",
    descriptor: "Social, emotional, inspiration-led",
    code: "E-R-F-P-B-M",
  },
  {
    id: 15,
    family: "Dynamic Energizers",
    name: "High-Energy Action Starter",
    descriptor: "Active, enthusiastic, fast-moving",
    code: "E-R-B-P-A-B",
  },
  {
    id: 16,
    family: "Dynamic Energizers",
    name: "Creative Momentum Seeker",
    descriptor: "Thrives on novelty and movement",
    code: "E-B-F-P-A-M",
  },
  {
    id: 17,
    family: "Dynamic Energizers",
    name: "Expressive Habit Starter",
    descriptor: "Starts strong, needs variety",
    code: "E-R-F-B-A-M",
  },
  {
    id: 18,
    family: "Dynamic Energizers",
    name: "Vibrant Social Energizer",
    descriptor: "People-focused, lively, engaging",
    code: "E-B-B-P-A-B",
  },
];

// Dimension metadata
const DIMENSIONS = [
  {
    index: 0,
    name: "Mind Style",
    leftPole: "Reflective",
    rightPole: "Expressive",
    leftQuestions: [0, 1, 2, 3], // Q1-Q4 (0-indexed: 0-3)
    rightQuestions: [4, 5, 6, 7], // Q5-Q8 (0-indexed: 4-7)
  },
  {
    index: 1,
    name: "Stress Response",
    leftPole: "Composed",
    rightPole: "Reactive",
    leftQuestions: [8, 9, 10, 11], // Q9-Q12 (0-indexed: 8-11)
    rightQuestions: [12, 13, 14, 15], // Q13-Q16 (0-indexed: 12-15)
  },
  {
    index: 2,
    name: "Health Discipline Style",
    leftPole: "Structured",
    rightPole: "Flexible",
    leftQuestions: [16, 17, 18, 19], // Q17-Q20 (0-indexed: 16-19)
    rightQuestions: [20, 21, 22, 23], // Q21-Q24 (0-indexed: 20-23)
  },
  {
    index: 3,
    name: "Social & Emotional Style",
    leftPole: "Inner-focused",
    rightPole: "People-focused",
    leftQuestions: [24, 25, 26, 27], // Q25-Q28 (0-indexed: 24-27)
    rightQuestions: [28, 29, 30, 31], // Q29-Q32 (0-indexed: 28-31)
  },
  {
    index: 4,
    name: "Energy & Activity Style",
    leftPole: "Active",
    rightPole: "Relaxed",
    leftQuestions: [32, 33, 34, 35], // Q33-Q36 (0-indexed: 32-35)
    rightQuestions: [36, 37, 38, 39], // Q37-Q40 (0-indexed: 36-39)
  },
  {
    index: 5,
    name: "Habit & Change Style",
    leftPole: "Consistency-Driven",
    rightPole: "Motivation-Driven",
    leftQuestions: [40, 41, 42, 43], // Q41-Q44 (0-indexed: 40-43)
    rightQuestions: [44, 45, 46, 47], // Q45-Q48 (0-indexed: 44-47)
  },
];

/**
 * Calculate variant for a dimension based on left and right pole scores
 * Variant A: Left pole score ≥ 5 points higher than right pole
 * Variant C: Right pole score ≥ 5 points higher than left pole
 * Variant B: Difference < 5 points (balanced)
 */
function calculateVariant(leftScore: number, rightScore: number): DimensionVariant {
  const difference = Math.abs(leftScore - rightScore);
  
  if (difference < 5) {
    return "B"; // Balanced
  }
  
  if (leftScore >= rightScore + 5) {
    return "A"; // Left pole dominant
  }
  
  return "C"; // Right pole dominant
}

/**
 * Generate code letter based on variant
 * Variant B → "B"
 * Variant A → First letter of left pole
 * Variant C → First letter of right pole
 */
function generateCodeLetter(
  variant: DimensionVariant,
  leftPole: string,
  rightPole: string
): string {
  if (variant === "B") {
    return "B";
  }
  
  if (variant === "A") {
    return leftPole.charAt(0).toUpperCase();
  }
  
  return rightPole.charAt(0).toUpperCase();
}

/**
 * Calculate dimension result
 */
function calculateDimensionResult(
  dimension: typeof DIMENSIONS[0],
  answers: number[]
): DimensionResult {
  // Sum left pole questions
  const leftScore = dimension.leftQuestions.reduce((sum, qIndex) => {
    return sum + (answers[qIndex] || 0);
  }, 0);
  
  // Sum right pole questions
  const rightScore = dimension.rightQuestions.reduce((sum, qIndex) => {
    return sum + (answers[qIndex] || 0);
  }, 0);
  
  // Calculate variant
  const variant = calculateVariant(leftScore, rightScore);
  
  // Generate code letter
  const code = generateCodeLetter(variant, dimension.leftPole, dimension.rightPole);
  
  return {
    dimensionIndex: dimension.index,
    dimensionName: dimension.name,
    leftPole: dimension.leftPole,
    rightPole: dimension.rightPole,
    leftScore,
    rightScore,
    variant,
    code,
  };
}

/**
 * Determine Core Group based on Mind, Stress, and Energy dimensions
 * Step 1 of personality naming system
 */
function determineCoreGroup(
  mindVariant: DimensionVariant,
  stressVariant: DimensionVariant,
  energyVariant: DimensionVariant
): "Calm Thinkers" | "Adaptive Navigators" | "Dynamic Energizers" {
  // Count variants: A (calm/reflective), B (balanced), C (expressive/energetic)
  const variants = [mindVariant, stressVariant, energyVariant];
  const aCount = variants.filter((v) => v === "A").length;
  const cCount = variants.filter((v) => v === "C").length;
  const bCount = variants.filter((v) => v === "B").length;

  // If 2+ are A (calm/reflective) → Calm Thinkers
  if (aCount >= 2) {
    return "Calm Thinkers";
  }

  // If 2+ are C (expressive/energetic) → Dynamic Energizers
  if (cCount >= 2) {
    return "Dynamic Energizers";
  }

  // Otherwise (mostly B or mixed) → Adaptive Navigators
  return "Adaptive Navigators";
}

/**
 * Determine Functional Role based on Social, Discipline, and Habits dimensions
 * Step 2 of personality naming system
 * Checks roles in priority order, returns first match
 */
function determineFunctionalRole(
  socialVariant: DimensionVariant,
  disciplineVariant: DimensionVariant,
  habitsVariant: DimensionVariant
): string {
  // Count balanced dimensions
  const balancedCount = [socialVariant, disciplineVariant, habitsVariant].filter(
    (v) => v === "B"
  ).length;

  // Store boolean checks to avoid TypeScript narrowing issues
  const socialIsC = socialVariant === "C";
  const socialIsA = socialVariant === "A";
  const disciplineIsC = disciplineVariant === "C";
  const disciplineIsA = disciplineVariant === "A";
  const habitsIsC = habitsVariant === "C";
  const habitsIsA = habitsVariant === "A";

  // Check roles in priority order
  // 1. Connector: Social=C (People) AND Habits=C (Motivated)
  if (socialIsC && habitsIsC) {
    return "Connector";
  }

  // 2. Explorer: Discipline=C (Flexible)
  if (disciplineIsC) {
    return "Explorer";
  }

  // 3. Planner: Discipline=A (Structured)
  if (disciplineIsA) {
    return "Planner";
  }

  // 4. Builder: Habits=A (Consistency) AND Social=A (Inner)
  if (habitsIsA && socialIsA) {
    return "Builder";
  }

  // 5. Starter: Habits=C (Motivated)
  if (habitsIsC) {
    return "Starter";
  }

  // 6. Relationship Builder: Social=C (People) AND Habits=A (Consistency)
  if (socialIsC && habitsIsA) {
    return "Relationship Builder";
  }

  // 7. Social Energizer: Social=C (People) AND Discipline=C (Flexible)
  // Note: This logically can't match if we reach here (Explorer would have matched first)
  // but we check it anyway per the priority order
  if (socialIsC && disciplineIsC) {
    return "Social Energizer";
  }

  // 8. Quiet Builder: Social=A (Inner) AND Habits=A (Consistency)
  // (Already covered by Builder above, but keeping for completeness)
  if (socialIsA && habitsIsA) {
    return "Quiet Builder";
  }

  // 9. Insight Seeker: Social=A (Inner) AND Discipline=A (Structured)
  if (socialIsA && disciplineIsA) {
    return "Insight Seeker";
  }

  // 10. Inner Balancer: Social=A (Inner) AND 2+ are B
  if (socialIsA && balancedCount >= 2) {
    return "Inner Balancer";
  }

  // 11. Momentum Driver: Habits=C (Motivated) AND Discipline=C (Flexible)
  // Note: This logically can't match if we reach here (Explorer would have matched first)
  // but we check it anyway per the priority order
  if (habitsIsC && disciplineIsC) {
    return "Momentum Driver";
  }

  // 12. Sustainer: Steady + balanced energy (not directly in Social+Discipline+Habits)
  // This would need Energy dimension, but since we don't have it here, we'll skip

  // Default fallback: Balancer (2+ dimensions are B OR no specific match)
  if (balancedCount >= 2) {
    return "Balancer";
  }

  // Final fallback
  return "Balancer";
}

/**
 * Determine Mind Word based on Mind dimension variant
 * Step 3 of personality naming system
 */
function determineMindWord(mindVariant: DimensionVariant): "Thoughtful" | "Adaptive" | "Expressive" {
  if (mindVariant === "A") {
    return "Thoughtful"; // Reflective
  }
  if (mindVariant === "B") {
    return "Adaptive"; // Balanced
  }
  return "Expressive"; // Expressive
}

/**
 * Generate personality name using 3-step plug-and-play system
 * Format: [CORE GROUP] – [MIND WORD] [ROLE]
 */
function generatePersonalityName(dimensions: DimensionResult[]): string {
  // Extract variants by dimension index
  const mindDim = dimensions.find((d) => d.dimensionIndex === 0);
  const stressDim = dimensions.find((d) => d.dimensionIndex === 1);
  const disciplineDim = dimensions.find((d) => d.dimensionIndex === 2);
  const socialDim = dimensions.find((d) => d.dimensionIndex === 3);
  const energyDim = dimensions.find((d) => d.dimensionIndex === 4);
  const habitsDim = dimensions.find((d) => d.dimensionIndex === 5);

  if (!mindDim || !stressDim || !disciplineDim || !socialDim || !energyDim || !habitsDim) {
    return "Unknown Personality";
  }

  // Step 1: Determine Core Group (Mind + Stress + Energy)
  const coreGroup = determineCoreGroup(mindDim.variant, stressDim.variant, energyDim.variant);

  // Step 2: Determine Functional Role (Social + Discipline + Habits)
  const role = determineFunctionalRole(socialDim.variant, disciplineDim.variant, habitsDim.variant);

  // Step 3: Determine Mind Word (Mind only)
  const mindWord = determineMindWord(mindDim.variant);

  // Assemble final name: [CORE GROUP] – [MIND WORD] [ROLE]
  return `${coreGroup} – ${mindWord} ${role}`;
}

/**
 * Match personality code to one of the 18 personality types
 */
function matchPersonalityType(code: string): PersonalityType | null {
  // Normalize code (remove spaces, ensure uppercase)
  const normalizedCode = code.replace(/\s+/g, "").toUpperCase();
  
  // Try exact match first
  const exactMatch = PERSONALITY_TYPES.find(
    (pt) => pt.code.replace(/\s+/g, "").toUpperCase() === normalizedCode
  );
  
  if (exactMatch) {
    return exactMatch;
  }
  
  // If no exact match, return null (could implement fuzzy matching later)
  return null;
}

/**
 * Main scoring function for Personality Test
 */
export function scorePersonality(answers: number[]): PersonalityResultSnapshot {
  // Validation
  if (!answers || answers.length !== 48) {
    throw new Error("answers must be length 48");
  }
  
  // Validate values are between 1 and 7
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] < 1 || answers[i] > 7) {
      throw new Error(`Invalid answer value at index ${i}: must be between 1 and 7`);
    }
  }
  
  // Calculate results for each dimension
  const dimensions = DIMENSIONS.map((dim) => calculateDimensionResult(dim, answers));
  
  // Generate 6-letter code
  const code = dimensions.map((d) => d.code).join("-");
  
  // Match to personality type
  const personalityType = matchPersonalityType(code);

  // Generate personality name using 3-step naming system
  const personalityName = generatePersonalityName(dimensions);

  // Calculate overall score (average of all answers, normalized to 0-100)
  const totalScore = answers.reduce((sum, val) => sum + val, 0);
  const averageScore = totalScore / answers.length;
  const normalizedScore = (averageScore / 7) * 100;

  return {
    code,
    dimensions,
    personalityType,
    personalityName,
    score: Math.round(normalizedScore * 100) / 100, // Round to 2 decimal places
  };
}
