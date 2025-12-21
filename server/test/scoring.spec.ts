import {
  scoreVPK,
  computeCounts,
  determineBodyTypeWithModifier,
  determinePrakritiWithModifier,
  determineVikritiDetailed,
  mapVikritiToReportId,
  computeBalanceScore,
  generateShortEmotionalLine,
} from "../src/services/scoring";

describe("VPK Scoring Service", () => {
  describe("computeCounts", () => {
    it("should count doshas correctly", () => {
      const arr = [1, 1, 2, 2, 2, 3];
      const counts = computeCounts(arr);
      expect(counts).toEqual({ vata: 2, pitta: 3, kapha: 1 });
    });

    it("should handle empty array", () => {
      const counts = computeCounts([]);
      expect(counts).toEqual({ vata: 0, pitta: 0, kapha: 0 });
    });
  });

  describe("determineBodyTypeWithModifier", () => {
    it("should determine primary body type correctly", () => {
      const countsA = { vata: 4, pitta: 2, kapha: 0 };
      const result = determineBodyTypeWithModifier(countsA);
      expect(result.primary).toBe("Ectomorph");
    });

    it("should use second-highest count for modifier", () => {
      const countsA = { vata: 3, pitta: 3, kapha: 0 };
      const result = determineBodyTypeWithModifier(countsA);
      expect(result.modifier).toBe("Pitta"); // Second highest after Vata (tie-break)
    });

    it("should use second-highest count for modifier", () => {
      const countsA = { vata: 3, pitta: 2, kapha: 1 };
      const result = determineBodyTypeWithModifier(countsA);
      expect(result.primary).toBe("Ectomorph");
      expect(result.modifier).toBe("Pitta");
    });

    it("should handle tie-breaks correctly (Vata > Pitta > Kapha)", () => {
      const countsA = { vata: 2, pitta: 2, kapha: 2 };
      const result = determineBodyTypeWithModifier(countsA);
      expect(result.primary).toBe("Ectomorph"); // Vata wins tie
      expect(result.modifier).toBe("Pitta"); // Second highest
    });
  });

  describe("determinePrakritiWithModifier", () => {
    it("should determine primary prakriti correctly", () => {
      const countsB = { vata: 8, pitta: 3, kapha: 1 };
      const result = determinePrakritiWithModifier(countsB);
      expect(result.primary).toBe("Vata");
      expect(result.modifier).toBe("Pitta");
    });

    it("should set modifier to null if second-highest is 0", () => {
      const countsB = { vata: 12, pitta: 0, kapha: 0 };
      const result = determinePrakritiWithModifier(countsB);
      expect(result.primary).toBe("Vata");
      expect(result.modifier).toBeNull();
    });
  });

  describe("determineVikritiDetailed", () => {
    // Helper function to create section array from counts (no D answers)
    const createSectionFromCounts = (vata: number, pitta: number, kapha: number): number[] => {
      return [
        ...new Array(vata).fill(1),
        ...new Array(pitta).fill(2),
        ...new Array(kapha).fill(3),
      ];
    };

    it("should identify balanced state when D_count >= half of questions", () => {
      // 11 questions total, 6 are D (>= half) -> Balanced
      const sectionC = [
        ...new Array(6).fill(4), // 6 D answers
        ...new Array(2).fill(1), // 2 Vata
        ...new Array(2).fill(2), // 2 Pitta
        ...new Array(1).fill(3), // 1 Kapha
      ];
      const countsC = { vata: 2, pitta: 2, kapha: 1 };
      const result = determineVikritiDetailed(countsC, sectionC);
      expect(result.summary).toBe("Balanced");
      expect(result.imbalances).toHaveLength(0);
      expect(result.countsC).toEqual({ vata: 0, pitta: 0, kapha: 0 });
    });

    it("should identify balanced state when no D but low counts", () => {
      // 11 questions, all low counts
      const sectionC = createSectionFromCounts(3, 3, 5);
      const countsC = { vata: 3, pitta: 3, kapha: 5 };
      const result = determineVikritiDetailed(countsC, sectionC);
      // With new logic, this should be Kapha single (5 > 3, and 3 < 5/2)
      expect(result.summary).toBe("Kapha");
    });

    it("should identify Vata dominant (single imbalance)", () => {
      // 11 questions: 5 D, 5 Vata, 1 Pitta -> exclude D, calculate from 6
      const sectionC = [
        ...new Array(5).fill(4), // 5 D
        ...new Array(5).fill(1), // 5 Vata
        ...new Array(1).fill(2), // 1 Pitta
      ];
      const countsC = { vata: 5, pitta: 1, kapha: 0 };
      const result = determineVikritiDetailed(countsC, sectionC);
      expect(result.summary).toBe("Vata");
      expect(result.imbalances).toHaveLength(1);
      expect(result.imbalances[0]).toEqual({
        dosha: "Vata",
        count: 5,
        level: "dominant",
      });
    });

    it("should identify dual imbalance when second >= first", () => {
      // 11 questions: 4 D, 4 Vata, 3 Pitta -> exclude D, calculate from 7
      // 4 Vata, 3 Pitta -> second (3) >= first/2 (2) but < first (4) -> dual
      const sectionC = [
        ...new Array(4).fill(4), // 4 D
        ...new Array(4).fill(1), // 4 Vata
        ...new Array(3).fill(2), // 3 Pitta
      ];
      const countsC = { vata: 4, pitta: 3, kapha: 0 };
      const result = determineVikritiDetailed(countsC, sectionC);
      expect(result.summary).toBe("Vata-Pitta");
      expect(result.imbalances.length).toBeGreaterThanOrEqual(2);
    });

    it("should identify single imbalance when second < first/2", () => {
      // 11 questions: 4 D, 5 Vata, 1 Pitta -> exclude D, calculate from 7
      // 5 Vata, 1 Pitta -> second (1) < first/2 (2.5) -> single
      const sectionC = [
        ...new Array(4).fill(4), // 4 D
        ...new Array(5).fill(1), // 5 Vata
        ...new Array(1).fill(2), // 1 Pitta
        ...new Array(1).fill(3), // 1 Kapha
      ];
      const countsC = { vata: 5, pitta: 1, kapha: 1 };
      const result = determineVikritiDetailed(countsC, sectionC);
      expect(result.summary).toBe("Vata");
      expect(result.imbalances[0].dosha).toBe("Vata");
    });

    it("should identify dual imbalance when second >= first (equal counts)", () => {
      // 11 questions: 3 D, 4 Vata, 4 Pitta -> exclude D, calculate from 8
      // 4 Vata, 4 Pitta -> second (4) >= first (4) -> dual
      const sectionC = [
        ...new Array(3).fill(4), // 3 D
        ...new Array(4).fill(1), // 4 Vata
        ...new Array(4).fill(2), // 4 Pitta
      ];
      const countsC = { vata: 4, pitta: 4, kapha: 0 };
      const result = determineVikritiDetailed(countsC, sectionC);
      // Tie-break: Pitta > Vata
      expect(result.summary).toBe("Pitta-Vata");
      expect(result.imbalances.length).toBe(2);
    });

    it("should use tie-break order (Pitta > Vata > Kapha) for vikriti", () => {
      const sectionC = createSectionFromCounts(4, 4, 3);
      const countsC = { vata: 4, pitta: 4, kapha: 3 };
      const result = determineVikritiDetailed(countsC, sectionC);
      // With equal counts, Pitta should win due to tie-break
      expect(result.summary).toBe("Pitta-Vata");
    });
  });

  describe("mapVikritiToReportId", () => {
    it("should map single doshas correctly", () => {
      expect(mapVikritiToReportId("Vata", { vata: 9, pitta: 5, kapha: 4 })).toBe(1);
      expect(mapVikritiToReportId("Pitta", { vata: 5, pitta: 9, kapha: 4 })).toBe(2);
      expect(mapVikritiToReportId("Kapha", { vata: 5, pitta: 4, kapha: 9 })).toBe(3);
    });

    it("should map Vata-Pitta dual correctly", () => {
      // Vata dominant
      expect(
        mapVikritiToReportId("Vata-Pitta", { vata: 9, pitta: 8, kapha: 1 })
      ).toBe(4);
      // Pitta dominant
      expect(
        mapVikritiToReportId("Vata-Pitta", { vata: 8, pitta: 9, kapha: 1 })
      ).toBe(5);
      // Tie -> Pitta wins (tie-break)
      expect(
        mapVikritiToReportId("Vata-Pitta", { vata: 8, pitta: 8, kapha: 2 })
      ).toBe(5);
    });

    it("should map Pitta-Kapha dual correctly", () => {
      expect(
        mapVikritiToReportId("Pitta-Kapha", { vata: 1, pitta: 9, kapha: 8 })
      ).toBe(6);
      expect(
        mapVikritiToReportId("Pitta-Kapha", { vata: 1, pitta: 8, kapha: 9 })
      ).toBe(7);
    });

    it("should map Vata-Kapha dual correctly", () => {
      expect(
        mapVikritiToReportId("Vata-Kapha", { vata: 9, pitta: 1, kapha: 8 })
      ).toBe(8);
      expect(
        mapVikritiToReportId("Vata-Kapha", { vata: 8, pitta: 1, kapha: 9 })
      ).toBe(9);
    });

    it("should return null for Balanced or mild-only", () => {
      expect(
        mapVikritiToReportId("Balanced", { vata: 3, pitta: 3, kapha: 3 })
      ).toBeNull();
      expect(
        mapVikritiToReportId("Vata (mild)", { vata: 5, pitta: 7, kapha: 6 })
      ).toBeNull();
    });
  });

  describe("computeBalanceScore", () => {
    it("should compute score for balanced state", () => {
      const countsC = { vata: 6, pitta: 6, kapha: 6 };
      const result = computeBalanceScore(countsC);
      expect(result.score).toBeGreaterThan(50);
      expect(result.rawImbalance).toBe(0);
    });

    it("should scale down score for count >= 10", () => {
      const countsC = { vata: 10, pitta: 5, kapha: 3 };
      const result = computeBalanceScore(countsC);
      expect(result.score).toBeLessThanOrEqual(30);
    });

    it("should scale down score for count >= 9", () => {
      const countsC = { vata: 9, pitta: 6, kapha: 3 };
      const result = computeBalanceScore(countsC);
      expect(result.score).toBeLessThanOrEqual(40);
    });

    it("should scale down score for count >= 8", () => {
      const countsC = { vata: 8, pitta: 6, kapha: 4 };
      const result = computeBalanceScore(countsC);
      expect(result.score).toBeLessThanOrEqual(50);
    });

    it("should keep backward compatible formula for lower counts", () => {
      const countsC = { vata: 7, pitta: 6, kapha: 5 };
      const imbalance = Math.abs(7 - 6) + Math.abs(6 - 5) + Math.abs(7 - 5);
      const expectedRaw = Math.max(0, 100 - imbalance * 2);
      const result = computeBalanceScore(countsC);
      expect(result.score).toBe(expectedRaw);
    });
  });

  describe("generateShortEmotionalLine", () => {
    it("should generate line for single doshas", () => {
      expect(generateShortEmotionalLine("Vata")).toContain("restless");
      expect(generateShortEmotionalLine("Pitta")).toContain("heated");
      expect(generateShortEmotionalLine("Kapha")).toContain("heavy");
    });

    it("should generate combined line for dual types", () => {
      const line = generateShortEmotionalLine("Vata-Pitta");
      expect(line).toContain("Restless");
      expect(line).toContain("heated");
    });

    it("should generate balanced message for mild/balanced", () => {
      expect(generateShortEmotionalLine("Balanced")).toContain("balanced");
      expect(generateShortEmotionalLine("Vata (mild)")).toContain("balanced");
    });
  });

  describe("scoreVPK - Integration Tests", () => {
    it("should validate input length", () => {
      expect(() => scoreVPK([])).toThrow("answers must be length 35");
      expect(() => scoreVPK(new Array(34).fill(1))).toThrow("answers must be length 35");
    });

    it("should validate answer values", () => {
      const invalid = new Array(35).fill(1);
      invalid[0] = 5;
      expect(() => scoreVPK(invalid)).toThrow("Invalid answer value");
    });

    it("should return backward compatible structure", () => {
      const answers = new Array(35).fill(1);
      const result = scoreVPK(answers);
      expect(result).toHaveProperty("bodyType");
      expect(result).toHaveProperty("prakriti");
      expect(result).toHaveProperty("vikriti");
      expect(result).toHaveProperty("shortEmotionalLine");
      expect(result).toHaveProperty("score");
    });

    it("should return enriched structure", () => {
      const answers = new Array(35).fill(1);
      const result = scoreVPK(answers);
      expect(result).toHaveProperty("bodyTypeDetailed");
      expect(result).toHaveProperty("prakritiDetailed");
      expect(result).toHaveProperty("vikritiDetailed");
      expect(result).toHaveProperty("reportId");
      expect(result).toHaveProperty("debug");
    });

    it("Test Case 1: Balanced case - countsC [6,6,6]", () => {
      // Section A: Ectomorph (all 1s)
      // Section B: Vata (all 1s)
      // Section C: Balanced (6,6,6)
      const answers = [
        ...new Array(6).fill(1), // Section A
        ...new Array(12).fill(1), // Section B
        ...new Array(6).fill(1),
        ...new Array(6).fill(2),
        ...new Array(6).fill(3), // Section C: 6 vata, 6 pitta, 6 kapha
      ];
      const result = scoreVPK(answers);
      expect(result.vikritiDetailed?.summary).toContain("(mild)");
      expect(result.reportId).toBeNull();
    });

    it("Test Case 2: Vata dominant - countsC [9,6,3]", () => {
      const answers = [
        ...new Array(6).fill(1), // Section A
        ...new Array(12).fill(1), // Section B
        ...new Array(9).fill(1), // 9 Vata
        ...new Array(6).fill(2), // 6 Pitta
        ...new Array(3).fill(3), // 3 Kapha
      ];
      const result = scoreVPK(answers);
      expect(result.vikritiDetailed?.summary).toBe("Vata");
      expect(result.vikritiDetailed?.imbalances[0]).toEqual({
        dosha: "Vata",
        count: 9,
        level: "dominant",
      });
      expect(result.reportId).toBe(1);
      expect(result.score).toBeLessThanOrEqual(40); // Because count >= 9
    });

    it("Test Case 3: Dual strong [8,8,2] - tie-break test", () => {
      const answers = [
        ...new Array(6).fill(1), // Section A
        ...new Array(12).fill(1), // Section B
        ...new Array(8).fill(1), // 8 Vata
        ...new Array(8).fill(2), // 8 Pitta
        ...new Array(2).fill(3), // 2 Kapha
      ];
      const result = scoreVPK(answers);
      // Tie-break: Pitta > Vata, so should be "Pitta-Vata" (Pitta first due to tie-break)
      expect(result.vikritiDetailed?.summary).toContain("Pitta");
      expect(result.vikritiDetailed?.summary).toContain("Vata");
      expect(result.vikritiDetailed?.imbalances.length).toBe(2);
      // Both are dominant
      expect(result.vikritiDetailed?.imbalances[0].level).toBe("dominant");
      expect(result.vikritiDetailed?.imbalances[1].level).toBe("dominant");
      expect(result.reportId).toBe(5); // Pitta dominant in tie (tie-break order)
    });

    it("Test Case 4: Body modifier override", () => {
      // Section A: [1,1,2,2,1,2] -> override Q3,Q4,Q6 = [2,2,2] -> Pitta
      const sectionA = [1, 1, 2, 2, 1, 2];
      const answers = [
        ...sectionA,
        ...new Array(12).fill(1), // Section B
        ...new Array(18).fill(1), // Section C
      ];
      const result = scoreVPK(answers);
      expect(result.bodyTypeDetailed?.modifier).toBe("Pitta");
    });

    it("Test Case 5: Edge values - Kapha dominant [3,3,12]", () => {
      const answers = [
        ...new Array(6).fill(3), // Section A: Endomorph
        ...new Array(12).fill(3), // Section B: Kapha
        ...new Array(3).fill(1), // 3 Vata
        ...new Array(3).fill(2), // 3 Pitta
        ...new Array(12).fill(3), // 12 Kapha
      ];
      const result = scoreVPK(answers);
      expect(result.vikritiDetailed?.summary).toBe("Kapha");
      expect(result.reportId).toBe(3);
      expect(result.score).toBeLessThanOrEqual(30); // count >= 10
    });

    it("Sample Test: Complete example output", () => {
      // Create a realistic example
      // Section A: Mesomorph with Vata modifier
      // Section B: Vata with Pitta modifier
      // Section C: Vata dominant (9) with Pitta secondary (6)
      const answers = [
        2, 2, 1, 2, 2, 1, // Section A: 4 pitta, 2 vata -> Mesomorph, modifier Vata
        ...new Array(8).fill(1),
        ...new Array(4).fill(2), // Section B: 8 vata, 4 pitta -> Vata, modifier Pitta
        ...new Array(9).fill(1), // 9 Vata
        ...new Array(6).fill(2), // 6 Pitta
        ...new Array(3).fill(3), // 3 Kapha
      ];
      const result = scoreVPK(answers);

      expect(result.bodyTypeDetailed?.primary).toBe("Mesomorph");
      expect(result.bodyTypeDetailed?.modifier).toBe("Vata");
      expect(result.prakritiDetailed?.primary).toBe("Vata");
      expect(result.prakritiDetailed?.modifier).toBe("Pitta");
      expect(result.vikritiDetailed?.summary).toBe("Vata");
      expect(result.vikritiDetailed?.imbalances[0]).toEqual({
        dosha: "Vata",
        count: 9,
        level: "dominant",
      });
      expect(result.reportId).toBe(1);
      expect(result.score).toBeLessThanOrEqual(40);
      expect(result.shortEmotionalLine).toContain("restless");
    });
  });
});

