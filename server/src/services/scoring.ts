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
  if (!answers || answers.length !== 36) {
    throw new Error("answers must be length 36");
  }

  // Validate values are 1, 2, or 3
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] !== 1 && answers[i] !== 2 && answers[i] !== 3) {
      throw new Error(`Invalid answer value at index ${i}: must be 1, 2, or 3`);
    }
  }

  // Section segmentation
  const sectionA = answers.slice(0, 6); // somatotype
  const sectionB = answers.slice(6, 18); // prakriti
  const sectionC = answers.slice(18, 36); // vikriti

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
  };
}
