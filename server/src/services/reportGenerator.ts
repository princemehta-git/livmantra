/**
 * Report Generator for 35-question VPK Test
 * 
 * Sections:
 * - Body Type: Q1-Q6 (indices 0-5)
 * - Prakriti: Q7-Q18 (indices 6-17)
 * - Vikriti: Q19-Q35 (indices 18-34)
 */

export type DoshaCode = 1 | 2 | 3; // 1=Vata, 2=Pitta, 3=Kapha

export type DoshaCounts = {
  V: number; // Vata count
  P: number; // Pitta count
  K: number; // Kapha count
};

export type ReportOutput = {
  body: {
    code: string; // B1-B9
    primary: DoshaCode;
    modifier: DoshaCode | null;
    counts: DoshaCounts;
  };
  prakriti: {
    code: string; // P1-P9
    primary: DoshaCode;
    modifier: DoshaCode | null;
    counts: DoshaCounts;
  };
  vikriti: {
    code: string; // V0 (balanced) or I1-I9 (imbalances)
    counts: DoshaCounts;
  };
};

/**
 * Compute counts of 1 (Vata), 2 (Pitta), 3 (Kapha) in an array
 */
function computeCounts(arr: DoshaCode[]): DoshaCounts {
  const counts: DoshaCounts = { V: 0, P: 0, K: 0 };
  arr.forEach((v) => {
    if (v === 1) counts.V++;
    else if (v === 2) counts.P++;
    else if (v === 3) counts.K++;
  });
  return counts;
}

/**
 * Tie-break function using earliest-question precedence
 * Returns the dosha that reaches the tied count first when scanning from start to end
 */
function tieBreakEarliestPrecedence(
  section: DoshaCode[],
  tiedDoshas: DoshaCode[],
  targetCount: number
): DoshaCode {
  // Build running counts for each tied dosha
  const runningCounts: Record<DoshaCode, number> = { 1: 0, 2: 0, 3: 0 };
  
  for (let i = 0; i < section.length; i++) {
    const answer = section[i];
    if (tiedDoshas.includes(answer)) {
      runningCounts[answer]++;
      if (runningCounts[answer] === targetCount) {
        // This dosha reached the target count first
        return answer;
      }
    }
  }
  
  // Fallback: Vata (1) > Pitta (2) > Kapha (3)
  if (tiedDoshas.includes(1)) return 1;
  if (tiedDoshas.includes(2)) return 2;
  return 3;
}

/**
 * Determine primary and modifier dosha for Body/Prakriti sections
 */
function determinePrimaryAndModifier(
  counts: DoshaCounts,
  section: DoshaCode[]
): { primary: DoshaCode; modifier: DoshaCode | null } {
  // Get all doshas with their counts
  const doshas: Array<{ dosha: DoshaCode; count: number }> = [
    { dosha: 1, count: counts.V },
    { dosha: 2, count: counts.P },
    { dosha: 3, count: counts.K },
  ];

  // Find highest count
  const maxCount = Math.max(counts.V, counts.P, counts.K);
  
  // Find all doshas with the highest count (for tie-break)
  const tiedPrimary = doshas.filter((d) => d.count === maxCount);
  
  let primary: DoshaCode;
  if (tiedPrimary.length === 1) {
    primary = tiedPrimary[0].dosha;
  } else {
    // Tie-break: dosha that reaches the count first wins
    primary = tieBreakEarliestPrecedence(section, tiedPrimary.map((d) => d.dosha), maxCount);
  }

  // Determine modifier (second-highest count)
  const remainingDoshas = doshas.filter((d) => d.dosha !== primary);
  const secondMaxCount = Math.max(...remainingDoshas.map((d) => d.count));
  
  if (secondMaxCount === 0) {
    return { primary, modifier: null };
  }

  const tiedModifier = remainingDoshas.filter((d) => d.count === secondMaxCount);
  let modifier: DoshaCode | null = null;
  
  if (tiedModifier.length === 1) {
    modifier = tiedModifier[0].dosha;
  } else if (tiedModifier.length > 1) {
    // Tie-break for modifier
    modifier = tieBreakEarliestPrecedence(section, tiedModifier.map((d) => d.dosha), secondMaxCount);
  }

  return { primary, modifier };
}

/**
 * Map Body primary + modifier to code (B1-B9)
 */
function mapBodyToCode(primary: DoshaCode, modifier: DoshaCode | null): string {
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
function mapPrakritiToCode(primary: DoshaCode, modifier: DoshaCode | null): string {
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
 * Determine Vikriti code (V0 for balanced, I1-I9 for imbalances) based on counts
 */
function determineVikritiCode(
  counts: DoshaCounts,
  section: DoshaCode[]
): string {
  const V = counts.V;
  const P = counts.P;
  const K = counts.K;

  // Rule 1: Single dosha >= 7 AND strictly highest
  if (V >= 7 && V > P && V > K) return "I1";
  if (P >= 7 && P > V && P > K) return "I2";
  if (K >= 7 && K > V && K > P) return "I3";

  // Rule 2: Two doshas >= 6 each
  if (V >= 6 && P >= 6) {
    if (V > P) return "I4";
    if (P > V) return "I5";
    // Tie: use tie-break
    const dominant = tieBreakEarliestPrecedence(section, [1, 2], V);
    return dominant === 1 ? "I4" : "I5";
  }
  if (P >= 6 && K >= 6) {
    if (P > K) return "I6";
    if (K > P) return "I7";
    // Tie: use tie-break
    const dominant = tieBreakEarliestPrecedence(section, [2, 3], P);
    return dominant === 2 ? "I6" : "I7";
  }
  if (V >= 6 && K >= 6) {
    if (V > K) return "I8";
    if (K > V) return "I9";
    // Tie: use tie-break
    const dominant = tieBreakEarliestPrecedence(section, [1, 3], V);
    return dominant === 1 ? "I8" : "I9";
  }

  // Rule 3: All doshas <= 5
  if (V <= 5 && P <= 5 && K <= 5) return "V0";

  // Fallback: Highest dosha
  if (V >= P && V >= K) return "I1";
  if (P >= V && P >= K) return "I2";
  return "I3";
}

/**
 * Main report generator function
 */
export function generateReport(answers: number[]): ReportOutput {
  // Validation
  if (!Array.isArray(answers) || answers.length !== 35) {
    throw new Error("answers must be an array of exactly 35 integers");
  }

  // Validate all values are 1, 2, 3, or 4 (some Section C questions have 4 options)
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] !== 1 && answers[i] !== 2 && answers[i] !== 3 && answers[i] !== 4) {
      throw new Error(`Invalid answer value at index ${i}: must be 1, 2, 3, or 4`);
    }
  }

  // Convert to DoshaCode type
  const answersTyped = answers as DoshaCode[];

  // Section segmentation
  const bodySection = answersTyped.slice(0, 6); // Q1-Q6 (indices 0-5)
  const prakritiSection = answersTyped.slice(6, 18); // Q7-Q18 (indices 6-17)
  const vikritiSection = answersTyped.slice(18, 35); // Q19-Q35 (indices 18-34)

  // Compute counts
  const bodyCounts = computeCounts(bodySection);
  const prakritiCounts = computeCounts(prakritiSection);
  const vikritiCounts = computeCounts(vikritiSection);

  // Determine Body results
  const bodyResult = determinePrimaryAndModifier(bodyCounts, bodySection);
  const bodyCode = mapBodyToCode(bodyResult.primary, bodyResult.modifier);

  // Determine Prakriti results
  const prakritiResult = determinePrimaryAndModifier(prakritiCounts, prakritiSection);
  const prakritiCode = mapPrakritiToCode(prakritiResult.primary, prakritiResult.modifier);

  // Determine Vikriti code
  const vikritiCode = determineVikritiCode(vikritiCounts, vikritiSection);

  return {
    body: {
      code: bodyCode,
      primary: bodyResult.primary,
      modifier: bodyResult.modifier,
      counts: bodyCounts,
    },
    prakriti: {
      code: prakritiCode,
      primary: prakritiResult.primary,
      modifier: prakritiResult.modifier,
      counts: prakritiCounts,
    },
    vikriti: {
      code: vikritiCode,
      counts: vikritiCounts,
    },
  };
}

/**
 * Generate human-readable report text
 * Note: This requires the Body Type, Prakriti, and Vikriti libraries
 * For now, we'll create a structured format that can be filled with actual library content
 */
export function generateHumanReadableReport(report: ReportOutput): string {
  let output = "";

  // BODY MODULE block
  output += "BODY MODULE\n";
  output += `Code: ${report.body.code}\n`;
  output += `Primary Dosha: ${report.body.primary === 1 ? "Vata" : report.body.primary === 2 ? "Pitta" : "Kapha"}\n`;
  if (report.body.modifier) {
    output += `Modifier: ${report.body.modifier === 1 ? "Vata" : report.body.modifier === 2 ? "Pitta" : "Kapha"}\n`;
  }
  output += `Counts: V=${report.body.counts.V}, P=${report.body.counts.P}, K=${report.body.counts.K}\n`;
  output += `[Paste matching ${report.body.code} text from Body Type library]\n\n`;

  // PRAKRITI MODULE block
  output += "PRAKRITI MODULE\n";
  output += `Code: ${report.prakriti.code}\n`;
  output += `Primary Dosha: ${report.prakriti.primary === 1 ? "Vata" : report.prakriti.primary === 2 ? "Pitta" : "Kapha"}\n`;
  if (report.prakriti.modifier) {
    output += `Modifier: ${report.prakriti.modifier === 1 ? "Vata" : report.prakriti.modifier === 2 ? "Pitta" : "Kapha"}\n`;
  }
  output += `Counts: V=${report.prakriti.counts.V}, P=${report.prakriti.counts.P}, K=${report.prakriti.counts.K}\n`;
  output += `[Paste matching ${report.prakriti.code} text from Prakriti library]\n\n`;

  // VIKRITI MODULE block
  output += "VIKRITI MODULE\n";
  output += `Code: ${report.vikriti.code}\n`;
  output += `Counts: V=${report.vikriti.counts.V}, P=${report.vikriti.counts.P}, K=${report.vikriti.counts.K}\n`;
  output += `[Paste matching ${report.vikriti.code} text from Vikriti library]\n\n`;

  // Footer
  output += "— [Clinic name]\n";

  return output;
}

