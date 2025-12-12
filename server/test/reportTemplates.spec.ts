import { loadTemplates, mergeReportWithTemplates } from "../src/services/reportTemplates";

describe("Report Templates Service", () => {
  describe("loadTemplates", () => {
    it("should load templates from JSON file", () => {
      const templates = loadTemplates();
      expect(templates).toBeDefined();
      expect(templates.body).toBeDefined();
      expect(templates.prakriti).toBeDefined();
      expect(templates.vikriti).toBeDefined();
      expect(templates.modifiers).toBeDefined();
    });

    it("should cache templates after first load", () => {
      const templates1 = loadTemplates();
      const templates2 = loadTemplates();
      expect(templates1).toBe(templates2); // Same reference (cached)
    });
  });

  describe("mergeReportWithTemplates", () => {
    it("should merge body type template", () => {
      const result = {
        bodyType: "Ectomorph",
        bodyTypeDetailed: {
          primary: "Ectomorph",
          modifier: null,
          countsA: { vata: 4, pitta: 2, kapha: 0 },
        },
        prakriti: "Vata",
        prakritiDetailed: {
          primary: "Vata",
          modifier: null,
          countsB: { vata: 8, pitta: 3, kapha: 1 },
        },
        vikriti: "Vata",
        vikritiDetailed: {
          summary: "Vata",
          imbalances: [{ dosha: "Vata", count: 9, level: "dominant" }],
          countsC: { vata: 9, pitta: 6, kapha: 3 },
          report_recommendation: "Strong single imbalance",
        },
        shortEmotionalLine: "Your system feels restless",
        score: 40,
      };

      const merged = mergeReportWithTemplates(result);
      expect(merged.bodyParagraph).toContain("Ectomorph");
      expect(merged.bodyCommonFeeling).toBeDefined();
      expect(merged.bodyTip).toBeDefined();
    });

    it("should include body modifier line when present", () => {
      const result = {
        bodyType: "Mesomorph",
        bodyTypeDetailed: {
          primary: "Mesomorph",
          modifier: "Vata",
          countsA: { vata: 2, pitta: 4, kapha: 0 },
        },
        prakriti: "Pitta",
        prakritiDetailed: {
          primary: "Pitta",
          modifier: null,
          countsB: { vata: 3, pitta: 8, kapha: 1 },
        },
        vikriti: "Pitta",
        vikritiDetailed: {
          summary: "Pitta",
          imbalances: [{ dosha: "Pitta", count: 8, level: "dominant" }],
          countsC: { vata: 3, pitta: 8, kapha: 7 },
          report_recommendation: "Strong single imbalance",
        },
        shortEmotionalLine: "Your system is heated",
        score: 50,
      };

      const merged = mergeReportWithTemplates(result);
      expect(merged.bodyModifierLine).toBeDefined();
      expect(merged.bodyModifierLine).toContain("Vata");
    });

    it("should handle dual vikriti correctly", () => {
      const result = {
        bodyType: "Ectomorph",
        bodyTypeDetailed: {
          primary: "Ectomorph",
          modifier: null,
          countsA: { vata: 4, pitta: 2, kapha: 0 },
        },
        prakriti: "Vata",
        prakritiDetailed: {
          primary: "Vata",
          modifier: null,
          countsB: { vata: 8, pitta: 3, kapha: 1 },
        },
        vikriti: "Vata-Pitta",
        vikritiDetailed: {
          summary: "Vata-Pitta",
          imbalances: [
            { dosha: "Vata", count: 8, level: "dominant" },
            { dosha: "Pitta", count: 8, level: "dominant" },
          ],
          countsC: { vata: 8, pitta: 8, kapha: 2 },
          report_recommendation: "Dual imbalance",
        },
        shortEmotionalLine: "Restless and heated",
        score: 30,
      };

      const merged = mergeReportWithTemplates(result);
      expect(merged.vikritiParagraph).toBeDefined();
      expect(merged.vikritiParagraph).toContain("Vata");
      expect(merged.vikritiParagraph).toContain("Pitta");
    });

    it("should use fallback for missing templates", () => {
      const result = {
        bodyType: "UnknownType",
        bodyTypeDetailed: {
          primary: "UnknownType" as any,
          modifier: null,
          countsA: { vata: 2, pitta: 2, kapha: 2 },
        },
        prakriti: "Vata",
        prakritiDetailed: {
          primary: "Vata",
          modifier: null,
          countsB: { vata: 6, pitta: 4, kapha: 2 },
        },
        vikriti: "Balanced",
        vikritiDetailed: {
          summary: "Balanced",
          imbalances: [],
          countsC: { vata: 6, pitta: 6, kapha: 6 },
          report_recommendation: "Balanced",
        },
        shortEmotionalLine: "You're well balanced",
        score: 80,
      };

      const merged = mergeReportWithTemplates(result);
      expect(merged.bodyParagraph).toContain("UnknownType");
      expect(merged.bodyParagraph).toContain("paid report");
    });

    it("should handle canonical vikriti keys for dual types", () => {
      const result1 = {
        bodyType: "Ectomorph",
        bodyTypeDetailed: {
          primary: "Ectomorph",
          modifier: null,
          countsA: { vata: 4, pitta: 2, kapha: 0 },
        },
        prakriti: "Vata",
        prakritiDetailed: {
          primary: "Vata",
          modifier: null,
          countsB: { vata: 8, pitta: 3, kapha: 1 },
        },
        vikriti: "Pitta-Vata",
        vikritiDetailed: {
          summary: "Pitta-Vata",
          imbalances: [
            { dosha: "Pitta", count: 8, level: "dominant" },
            { dosha: "Vata", count: 8, level: "dominant" },
          ],
          countsC: { vata: 8, pitta: 8, kapha: 2 },
          report_recommendation: "Dual imbalance",
        },
        shortEmotionalLine: "Heated and restless",
        score: 30,
      };

      const merged1 = mergeReportWithTemplates(result1);
      expect(merged1.vikritiParagraph).toBeDefined();
    });
  });
});

