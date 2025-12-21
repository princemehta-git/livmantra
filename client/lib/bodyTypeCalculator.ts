// Client-side utility to calculate body type from partial answers
// This mirrors the server-side logic for real-time hints

export type DoshaCounts = {
  vata: number;
  pitta: number;
  kapha: number;
};

export type BodyTypeResult = {
  primary: "Ectomorph" | "Mesomorph" | "Endomorph";
  modifier: "Vata" | "Pitta" | "Kapha" | null;
};

export type PrakritiResult = {
  primary: "Vata" | "Pitta" | "Kapha";
  modifier: "Vata" | "Pitta" | "Kapha" | null;
};

function computeCounts(arr: number[]): DoshaCounts {
  const counts: DoshaCounts = { vata: 0, pitta: 0, kapha: 0 };
  arr.forEach((v) => {
    if (v === 1) counts.vata++;
    else if (v === 2) counts.pitta++;
    else if (v === 3) counts.kapha++;
  });
  return counts;
}

/**
 * Determine body type from Section A (questions 1-6)
 */
export function calculateBodyType(answers: number[]): BodyTypeResult | null {
  if (answers.length < 6) return null;
  
  const sectionA = answers.slice(0, 6);
  // Check if all questions are answered
  if (sectionA.some(a => a === 0)) return null;
  
  const counts = computeCounts(sectionA);
  
  // Determine primary (tie-break: Vata > Pitta > Kapha)
  let primary: "Ectomorph" | "Mesomorph" | "Endomorph";
  if (counts.vata >= counts.pitta && counts.vata >= counts.kapha) {
    primary = "Ectomorph";
  } else if (counts.pitta >= counts.vata && counts.pitta >= counts.kapha) {
    primary = "Mesomorph";
  } else {
    primary = "Endomorph";
  }

  // Modifier = second-highest count if >= 1
  const sorted = [
    { dosha: "Vata" as const, count: counts.vata },
    { dosha: "Pitta" as const, count: counts.pitta },
    { dosha: "Kapha" as const, count: counts.kapha },
  ].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    const order: Record<string, number> = { Vata: 0, Pitta: 1, Kapha: 2 };
    return order[a.dosha] - order[b.dosha];
  });

  let modifier: "Vata" | "Pitta" | "Kapha" | null = null;
  if (sorted[1].count >= 1) {
    modifier = sorted[1].dosha;
  }

  return { primary, modifier };
}

/**
 * Determine prakriti from Section B (questions 7-18)
 */
export function calculatePrakriti(answers: number[]): PrakritiResult | null {
  if (answers.length < 18) return null;
  
  const sectionB = answers.slice(6, 18);
  // Check if all questions are answered
  if (sectionB.some(a => a === 0)) return null;
  
  const counts = computeCounts(sectionB);
  
  // Determine primary (tie-break: Vata > Pitta > Kapha)
  let primary: "Vata" | "Pitta" | "Kapha";
  if (counts.vata >= counts.pitta && counts.vata >= counts.kapha) {
    primary = "Vata";
  } else if (counts.pitta >= counts.vata && counts.pitta >= counts.kapha) {
    primary = "Pitta";
  } else {
    primary = "Kapha";
  }

  // Modifier = second-highest count if >= 1
  const sorted = [
    { dosha: "Vata" as const, count: counts.vata },
    { dosha: "Pitta" as const, count: counts.pitta },
    { dosha: "Kapha" as const, count: counts.kapha },
  ].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    const order: Record<string, number> = { Vata: 0, Pitta: 1, Kapha: 2 };
    return order[a.dosha] - order[b.dosha];
  });

  let modifier: "Vata" | "Pitta" | "Kapha" | null = null;
  if (sorted[1].count >= 1) {
    modifier = sorted[1].dosha;
  }

  return { primary, modifier };
}

