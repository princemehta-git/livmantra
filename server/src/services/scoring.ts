// versioned VPK scoring service
// Enhanced scoring with modifiers, detailed vikriti analysis, and report mapping

/**
 * Thresholds:
 * - >=8: dominant imbalance
 * - >=6: secondary imbalance
 * - >=4: mild imbalance
 * Tie-break order for vikriti: Pitta > Vata > Kapha (deterministic)
 * Tie-break order for body/prakriti: Vata(1) > Pitta(2) > Kapha(3)
 */

export type DoshaCounts = {
  vata: number;
  pitta: number;
  kapha: number;
};

export type BodyTypeResult = {
  primary: "Ectomorph" | "Mesomorph" | "Endomorph";
  modifier: "Vata" | "Pitta" | "Kapha" | null;
  countsA: DoshaCounts;
};

export type PrakritiResult = {
  primary: "Vata" | "Pitta" | "Kapha";
  modifier: "Vata" | "Pitta" | "Kapha" | null;
  countsB: DoshaCounts;
};

export type VikritiImbalance = {
  dosha: "Vata" | "Pitta" | "Kapha";
  count: number;
  level: "dominant" | "secondary" | "mild";
};

export type VikritiDetailed = {
  summary: string;
  imbalances: VikritiImbalance[];
  countsC: DoshaCounts;
  report_recommendation: string;
};

// Backward compatible type (kept for existing clients)
export type VPKResultSnapshot = {
  bodyType: "Endomorph" | "Ectomorph" | "Mesomorph";
  prakriti: "Vata" | "Pitta" | "Kapha";
  vikriti: string;
  modifier?: string;
  shortEmotionalLine: string;
  score?: number;
  // New enriched fields
  bodyTypeDetailed?: BodyTypeResult;
  prakritiDetailed?: PrakritiResult;
  vikritiDetailed?: VikritiDetailed;
  reportId?: number | null;
  debug?: { rawImbalance: number };
  // Module codes
  bodyCode?: string; // B1-B9
  prakritiCode?: string; // P1-P9
  vikritiCode?: string; // V0-V9
};

/**
 * Compute counts of 1 (vata), 2 (pitta), 3 (kapha) in an array
 */
export function computeCounts(arr: number[]): DoshaCounts {
  const counts: DoshaCounts = { vata: 0, pitta: 0, kapha: 0 };
  arr.forEach((v) => {
    if (v === 1) counts.vata++;
    else if (v === 2) counts.pitta++;
    else if (v === 3) counts.kapha++;
  });
  return counts;
}

/**
 * Determine body type with modifier from Section A (somatotype)
 * Modifier is always the second-highest dosha count
 */
export function determineBodyTypeWithModifier(
  countsA: DoshaCounts
): BodyTypeResult {
  // Determine primary (tie-break: Vata > Pitta > Kapha)
  let primary: "Ectomorph" | "Mesomorph" | "Endomorph";
  if (countsA.vata >= countsA.pitta && countsA.vata >= countsA.kapha) {
    primary = "Ectomorph";
  } else if (countsA.pitta >= countsA.vata && countsA.pitta >= countsA.kapha) {
    primary = "Mesomorph";
  } else {
    primary = "Endomorph";
  }

  // Modifier = second-highest count if >= 1
  const sorted = [
    { dosha: "Vata" as const, count: countsA.vata },
    { dosha: "Pitta" as const, count: countsA.pitta },
    { dosha: "Kapha" as const, count: countsA.kapha },
  ].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    // Tie-break: Vata > Pitta > Kapha
    const order: Record<string, number> = { Vata: 0, Pitta: 1, Kapha: 2 };
    return order[a.dosha] - order[b.dosha];
  });

  let modifier: "Vata" | "Pitta" | "Kapha" | null = null;
  if (sorted[1].count >= 1) {
    modifier = sorted[1].dosha;
  }

  return { primary, modifier, countsA };
}

/**
 * Determine prakriti with modifier from Section B
 */
export function determinePrakritiWithModifier(
  countsB: DoshaCounts
): PrakritiResult {
  // Determine primary (tie-break: Vata > Pitta > Kapha)
  let primary: "Vata" | "Pitta" | "Kapha";
  if (countsB.vata >= countsB.pitta && countsB.vata >= countsB.kapha) {
    primary = "Vata";
  } else if (countsB.pitta >= countsB.vata && countsB.pitta >= countsB.kapha) {
    primary = "Pitta";
  } else {
    primary = "Kapha";
  }

  // Modifier = second-highest if >= 1
  const sorted = [
    { dosha: "Vata" as const, count: countsB.vata },
    { dosha: "Pitta" as const, count: countsB.pitta },
    { dosha: "Kapha" as const, count: countsB.kapha },
  ].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    const order: Record<string, number> = { Vata: 0, Pitta: 1, Kapha: 2 };
    return order[a.dosha] - order[b.dosha];
  });

  let modifier: "Vata" | "Pitta" | "Kapha" | null = null;
  if (sorted[1].count >= 1) {
    modifier = sorted[1].dosha;
  }

  return { primary, modifier, countsB };
}

/**
 * Determine detailed vikriti from Section C with levels and imbalances
 * Tie-break order for vikriti: Pitta > Vata > Kapha (deterministic)
 */
export function determineVikritiDetailed(
  countsC: DoshaCounts
): VikritiDetailed {
  // Sort with stable tie-break: Pitta > Vata > Kapha
  const sorted = [
    { dosha: "Vata" as const, count: countsC.vata },
    { dosha: "Pitta" as const, count: countsC.pitta },
    { dosha: "Kapha" as const, count: countsC.kapha },
  ].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    // Tie-break: Pitta > Vata > Kapha
    const order: Record<string, number> = { Pitta: 0, Vata: 1, Kapha: 2 };
    return order[a.dosha] - order[b.dosha];
  });

  const top = sorted[0];
  const second = sorted[1];
  const third = sorted[2];

  const imbalances: VikritiImbalance[] = [];
  let summary: string;
  let report_recommendation: string;

  // Determine levels for each dosha
  const getLevel = (count: number): "dominant" | "secondary" | "mild" | null => {
    if (count >= 8) return "dominant";
    if (count >= 6) return "secondary";
    if (count >= 4) return "mild";
    return null;
  };

  // Add imbalances with levels
  sorted.forEach((item) => {
    const level = getLevel(item.count);
    if (level) {
      imbalances.push({ dosha: item.dosha, count: item.count, level });
    }
  });

  // Determine summary and recommendation
  if (top.count >= 8 && second.count >= 8) {
    // Dual dominant
    summary = `${top.dosha}-${second.dosha}`;
    report_recommendation = `Strong dual imbalance: ${top.dosha} (${top.count}) and ${second.dosha} (${second.count}) both dominant`;
  } else if (top.count >= 8) {
    // Single dominant
    summary = top.dosha;
    report_recommendation = `Strong single imbalance: ${top.dosha} (${top.count}) dominant`;
  } else if (top.count >= 6 && second.count >= 6) {
    // Dual mild
    summary = `${top.dosha}-${second.dosha} (mild)`;
    report_recommendation = `Mild dual imbalance: ${top.dosha} (${top.count}) and ${second.dosha} (${second.count}) both secondary`;
  } else if (top.count >= 6) {
    // Single secondary (mild dominant)
    summary = `${top.dosha} (mild)`;
    report_recommendation = `Mild imbalance: ${top.dosha} (${top.count}) secondary`;
  } else if (top.count >= 4) {
    // Single mild
    summary = `${top.dosha} (mild)`;
    report_recommendation = `Very mild imbalance: ${top.dosha} (${top.count}) mild`;
  } else {
    // Balanced
    summary = "Balanced";
    report_recommendation = "All doshas within balanced range (all < 4)";
  }

  return {
    summary,
    imbalances,
    countsC,
    report_recommendation,
  };
}

/**
 * Map vikriti summary to report ID (1-9)
 * Returns null for Balanced or mild-only cases
 */
export function mapVikritiToReportId(
  vikritiSummary: string,
  countsC: DoshaCounts
): number | null {
  // For dual types, determine which is dominant
  if (vikritiSummary === "Vata") return 1;
  if (vikritiSummary === "Pitta") return 2;
  if (vikritiSummary === "Kapha") return 3;

  // Dual types - handle both orderings (e.g., "Vata-Pitta" or "Pitta-Vata")
  const isVataPitta = vikritiSummary.includes("Vata") && vikritiSummary.includes("Pitta");
  const isPittaKapha = vikritiSummary.includes("Pitta") && vikritiSummary.includes("Kapha");
  const isVataKapha = vikritiSummary.includes("Vata") && vikritiSummary.includes("Kapha");

  if (isVataPitta) {
    if (countsC.vata > countsC.pitta) return 4;
    if (countsC.pitta > countsC.vata) return 5;
    // Tie: use tie-break order (Pitta > Vata) -> Pitta dominant
    return 5;
  }

  if (isPittaKapha) {
    if (countsC.pitta > countsC.kapha) return 6;
    if (countsC.kapha > countsC.pitta) return 7;
    // Tie: use tie-break order (Pitta > Kapha) -> Pitta dominant
    return 6;
  }

  if (isVataKapha) {
    if (countsC.vata > countsC.kapha) return 8;
    if (countsC.kapha > countsC.vata) return 9;
    // Tie: use tie-break order (Vata > Kapha) -> Vata dominant
    return 8;
  }

  // Balanced or mild-only -> no report
  return null;
}

/**
 * Compute balance score with enhanced thresholds
 * Keeps backward compatibility but scales down for strong imbalances
 */
export function computeBalanceScore(countsC: DoshaCounts): {
  score: number;
  rawImbalance: number;
} {
  const imbalance =
    Math.abs(countsC.vata - countsC.pitta) +
    Math.abs(countsC.pitta - countsC.kapha) +
    Math.abs(countsC.vata - countsC.kapha);

  let raw = Math.max(0, 100 - imbalance * 2);

  // Scale down for strong imbalances
  const maxCount = Math.max(countsC.vata, countsC.pitta, countsC.kapha);
  if (maxCount >= 10) {
    raw = Math.min(raw, 30);
  } else if (maxCount >= 9) {
    raw = Math.min(raw, 40);
  } else if (maxCount >= 8) {
    raw = Math.min(raw, 50);
  }

  const score = Math.max(0, Math.min(100, raw));

  return { score, rawImbalance: imbalance };
}

/**
 * Convert dosha name to numeric code: Vata=1, Pitta=2, Kapha=3
 */
function doshaNameToCode(dosha: "Vata" | "Pitta" | "Kapha"): 1 | 2 | 3 {
  if (dosha === "Vata") return 1;
  if (dosha === "Pitta") return 2;
  return 3;
}

/**
 * Convert body type to dosha code: Ectomorph=Vata=1, Mesomorph=Pitta=2, Endomorph=Kapha=3
 */
function bodyTypeToDoshaCode(bodyType: "Ectomorph" | "Mesomorph" | "Endomorph"): 1 | 2 | 3 {
  if (bodyType === "Ectomorph") return 1;
  if (bodyType === "Mesomorph") return 2;
  return 3;
}

/**
 * Map Body primary + modifier to code (B1-B9)
 */
function mapBodyToCode(primary: 1 | 2 | 3, modifier: 1 | 2 | 3 | null): string {
  if (primary === 1) {
    if (modifier === null || modifier === 1) return "B1"; // Vata only
    if (modifier === 2) return "B2"; // Vata + Pitta
    return "B3"; // Vata + Kapha
  }
  if (primary === 2) {
    if (modifier === null || modifier === 2) return "B4"; // Pitta only
    if (modifier === 1) return "B5"; // Pitta + Vata
    return "B6"; // Pitta + Kapha
  }
  // primary === 3 (Kapha)
  if (modifier === null || modifier === 3) return "B7"; // Kapha only
  if (modifier === 1) return "B8"; // Kapha + Vata
  return "B9"; // Kapha + Pitta
}

/**
 * Map Prakriti primary + modifier to code (P1-P9)
 */
function mapPrakritiToCode(primary: 1 | 2 | 3, modifier: 1 | 2 | 3 | null): string {
  if (primary === 1) {
    if (modifier === null || modifier === 1) return "P1"; // Vata only
    if (modifier === 2) return "P2"; // Vata + Pitta
    return "P3"; // Vata + Kapha
  }
  if (primary === 2) {
    if (modifier === null || modifier === 2) return "P4"; // Pitta only
    if (modifier === 1) return "P5"; // Pitta + Vata
    return "P6"; // Pitta + Kapha
  }
  // primary === 3 (Kapha)
  if (modifier === null || modifier === 3) return "P7"; // Kapha only
  if (modifier === 1) return "P8"; // Kapha + Vata
  return "P9"; // Kapha + Pitta
}

/**
 * Tie-break function using earliest-question precedence for Vikriti
 * Returns the dosha code that reaches the tied count first when scanning from start to end
 */
function tieBreakEarliestPrecedenceVikriti(
  section: number[],
  tiedDoshas: (1 | 2 | 3)[],
  targetCount: number
): 1 | 2 | 3 {
  const runningCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  
  for (let i = 0; i < section.length; i++) {
    const answer = section[i];
    if (tiedDoshas.includes(answer as 1 | 2 | 3)) {
      runningCounts[answer]++;
      if (runningCounts[answer] === targetCount) {
        return answer as 1 | 2 | 3;
      }
    }
  }
  
  // Fallback: Vata (1) > Pitta (2) > Kapha (3)
  if (tiedDoshas.includes(1)) return 1;
  if (tiedDoshas.includes(2)) return 2;
  return 3;
}

/**
 * Determine Vikriti code (V0-V9) based on counts
 */
function determineVikritiCode(countsC: DoshaCounts, sectionC: number[]): string {
  const V = countsC.vata;
  const P = countsC.pitta;
  const K = countsC.kapha;

  // Rule 1: Single dosha >= 7 AND strictly highest
  if (V >= 7 && V > P && V > K) return "V1";
  if (P >= 7 && P > V && P > K) return "V2";
  if (K >= 7 && K > V && K > P) return "V3";

  // Rule 2: Two doshas >= 6 each
  if (V >= 6 && P >= 6) {
    if (V > P) return "V4";
    if (P > V) return "V5";
    // Tie: use tie-break
    const dominant = tieBreakEarliestPrecedenceVikriti(sectionC, [1, 2], V);
    return dominant === 1 ? "V4" : "V5";
  }
  if (P >= 6 && K >= 6) {
    if (P > K) return "V6";
    if (K > P) return "V7";
    // Tie: use tie-break
    const dominant = tieBreakEarliestPrecedenceVikriti(sectionC, [2, 3], P);
    return dominant === 2 ? "V6" : "V7";
  }
  if (V >= 6 && K >= 6) {
    if (V > K) return "V8";
    if (K > V) return "V9";
    // Tie: use tie-break
    const dominant = tieBreakEarliestPrecedenceVikriti(sectionC, [1, 3], V);
    return dominant === 1 ? "V8" : "V9";
  }

  // Rule 3: All doshas <= 5
  if (V <= 5 && P <= 5 && K <= 5) return "V0";

  // Fallback: Highest dosha
  if (V >= P && V >= K) return "V1";
  if (P >= V && P >= K) return "V2";
  return "V3";
}

/**
 * Generate short emotional line based on vikriti summary
 */
export function generateShortEmotionalLine(vikritiSummary: string): string {
  const templates: Record<string, string> = {
    Vata: "Your system feels restless and needs grounding.",
    Pitta: "Your system is heated — cool and calm routines will help.",
    Kapha: "Your system feels heavy — warmth, movement and light foods will help.",
  };

  if (vikritiSummary === "Vata") return templates.Vata;
  if (vikritiSummary === "Pitta") return templates.Pitta;
  if (vikritiSummary === "Kapha") return templates.Kapha;

  // Dual types - combine phrases
  if (vikritiSummary.includes("Vata-Pitta") || vikritiSummary.includes("Pitta-Vata")) {
    return "Restless and heated — ground + cool.";
  }
  if (vikritiSummary.includes("Vata-Kapha") || vikritiSummary.includes("Kapha-Vata")) {
    return "Restless yet heavy — ground + move.";
  }
  if (vikritiSummary.includes("Pitta-Kapha") || vikritiSummary.includes("Kapha-Pitta")) {
    return "Heated and heavy — cool + move.";
  }

  // Mild or balanced
  if (vikritiSummary.includes("(mild)")) {
    return "You're mostly balanced with gentle shifts needed.";
  }

  return "You're well balanced — maintain your current routines.";
}

/**
 * Main scoring function - enhanced with modifiers, detailed vikriti, and report mapping
 */
export function scoreVPK(answers: number[]): VPKResultSnapshot {
  // Validation
  if (!answers || answers.length !== 35) {
    throw new Error("answers must be length 35");
  }

  // Validate values are 1, 2, or 3
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] !== 1 && answers[i] !== 2 && answers[i] !== 3) {
      throw new Error(`Invalid answer value at index ${i}: must be 1, 2, or 3`);
    }
  }

  // Section segmentation
  const sectionA = answers.slice(0, 5); // Body Type (Q1-Q5)
  const sectionB = answers.slice(5, 20); // Prakriti (Q6-Q20)
  const sectionC = answers.slice(20, 35); // Vikriti (Q21-Q35)

  // Compute counts
  const countsA = computeCounts(sectionA);
  const countsB = computeCounts(sectionB);
  const countsC = computeCounts(sectionC);

  // Determine results
  const bodyTypeResult = determineBodyTypeWithModifier(countsA);
  const prakritiResult = determinePrakritiWithModifier(countsB);
  const vikritiDetailed = determineVikritiDetailed(countsC);

  // Map to report ID
  const reportId = mapVikritiToReportId(vikritiDetailed.summary, countsC);

  // Compute score
  const { score, rawImbalance } = computeBalanceScore(countsC);

  // Generate emotional line
  const shortEmotionalLine = generateShortEmotionalLine(vikritiDetailed.summary);

  // Backward compatible fields
  const bodyType = bodyTypeResult.primary;
  const prakriti = prakritiResult.primary;
  const vikriti = vikritiDetailed.summary;

  // Compute module codes
  const bodyPrimaryCode = bodyTypeToDoshaCode(bodyType);
  const bodyModifierCode = bodyTypeResult.modifier ? doshaNameToCode(bodyTypeResult.modifier) : null;
  const bodyCode = mapBodyToCode(bodyPrimaryCode, bodyModifierCode);

  const prakritiPrimaryCode = doshaNameToCode(prakriti);
  const prakritiModifierCode = prakritiResult.modifier ? doshaNameToCode(prakritiResult.modifier) : null;
  const prakritiCode = mapPrakritiToCode(prakritiPrimaryCode, prakritiModifierCode);

  const vikritiCode = determineVikritiCode(countsC, sectionC);

  return {
    // Backward compatible
    bodyType,
    prakriti,
    vikriti,
    shortEmotionalLine,
    score,
    // New enriched fields
    bodyTypeDetailed: bodyTypeResult,
    prakritiDetailed: prakritiResult,
    vikritiDetailed,
    reportId,
    debug: { rawImbalance },
    // Module codes
    bodyCode,
    prakritiCode,
    vikritiCode,
  };
}
