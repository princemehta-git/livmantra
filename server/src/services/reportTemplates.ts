import * as fs from "fs";
import * as path from "path";

export type Templates = {
  body: {
    [key: string]: {
      paragraph: string;
      commonFeeling: string;
      tip: string;
    };
  };
  modifiers: {
    [key: string]: {
      [key: string]: string;
    };
  };
  prakriti: {
    [key: string]: {
      paragraph: string;
      strengths: string[];
      tip: string;
    };
  };
  prakritiModifiers: {
    [key: string]: {
      [key: string]: string;
    };
  };
  vikriti: {
    [key: string]: {
      paragraph: string;
      quickTip: string;
      empathyLine: string;
    };
  };
  paidPreview: {
    text: string;
    features: string[];
  };
  bodyCodeReports?: {
    [key: string]: {
      title: string;
      subtitle: string;
      howYourBodyLives: string;
      howYourMindMoves?: string;
      howYourMindWorks?: string;
      howStressShowsUp: string;
      earlySignals: string[];
      dailyAnchors: string[];
      closingMessage: string;
    };
  };
  prakritiCodeReports?: {
    [key: string]: {
      title: string;
      subtitle: string;
      yourNaturalNature: string;
      howYouThinkAndRespond: string;
      yourSuperpowers: string[];
      whenThisGetsTooMuch: string;
      lifeStageAndSeasonSensitivity: string;
      anchors: string[];
      anchorsTitle: string;
      closingMessage: string;
    };
  };
  vikritiCodeReports?: {
    [key: string]: {
      title: string;
      subtitle: string;
      whatsHappening: string;
      whyFeelingLikeThis: string;
      commonSymptoms: string[];
      earlyWarningsTitle: string;
      earlyWarnings: string;
      whatYourBodyNeeds: string[];
      closingMessage: string;
    };
  };
};

let templatesCache: Templates | null = null;

/**
 * Load templates from JSON file
 */
export function loadTemplates(): Templates {
  if (templatesCache) {
    return templatesCache;
  }

  try {
    const templatesPath = path.join(__dirname, "../../data/templates.json");
    const fileContent = fs.readFileSync(templatesPath, "utf-8");
    templatesCache = JSON.parse(fileContent) as Templates;
    return templatesCache;
  } catch (error) {
    console.error("Error loading templates:", error);
    throw new Error("Failed to load report templates");
  }
}

/**
 * Get canonical dual vikriti key (handles both orders)
 */
function getCanonicalVikritiKey(summary: string): string {
  if (summary.includes("Vata") && summary.includes("Pitta")) {
    return "Vata-Pitta";
  }
  if (summary.includes("Pitta") && summary.includes("Kapha")) {
    return "Pitta-Kapha";
  }
  if (summary.includes("Vata") && summary.includes("Kapha")) {
    return "Vata-Kapha";
  }
  return summary;
}

/**
 * Merge result with templates to create enriched report
 */
export function mergeReportWithTemplates(result: any): {
  bodyParagraph: string;
  bodyModifierLine: string | null;
  bodyCommonFeeling: string;
  bodyTip: string;
  prakritiParagraph: string;
  prakritiModifierLine: string | null;
  prakritiStrengths: string[];
  prakritiTip: string;
  vikritiParagraph: string;
  vikritiQuickTip: string;
  vikritiEmpathyLine: string;
  paidPreviewText: string;
  bodyCodeReport: {
    title: string;
    subtitle: string;
    howYourBodyLives: string;
    howYourMindMoves?: string;
    howYourMindWorks?: string;
    howStressShowsUp: string;
    earlySignals: string[];
    dailyAnchors: string[];
    closingMessage: string;
  } | null;
  prakritiCodeReport: {
    title: string;
    subtitle: string;
    yourNaturalNature: string;
    howYouThinkAndRespond: string;
    yourSuperpowers: string[];
    whenThisGetsTooMuch: string;
    lifeStageAndSeasonSensitivity: string;
    anchors: string[];
    anchorsTitle: string;
    closingMessage: string;
  } | null;
  vikritiCodeReport: {
    title: string;
    subtitle: string;
    whatsHappening: string;
    whyFeelingLikeThis: string;
    commonSymptoms: string[];
    earlyWarningsTitle: string;
    earlyWarnings: string;
    whatYourBodyNeeds: string[];
    closingMessage: string;
  } | null;
} {
  const templates = loadTemplates();
  const bodyType = result.bodyTypeDetailed?.primary || result.bodyType;
  const prakriti = result.prakritiDetailed?.primary || result.prakriti;
  const vikritiSummary = result.vikritiDetailed?.summary || result.vikriti;

  // Body type content
  const bodyTemplate = templates.body[bodyType] || {
    paragraph: `You show ${bodyType} tendencies — more details in paid report.`,
    commonFeeling: "Your body type influences how you feel and function.",
    tip: "Maintain balance through appropriate diet and lifestyle.",
  };

  // Body modifier (body-type-specific)
  const bodyModifier = result.bodyTypeDetailed?.modifier || null;
  let bodyModifierLine: string | null = null;
  if (bodyModifier && bodyType) {
    const bodyModifierMap = templates.modifiers[bodyType];
    if (bodyModifierMap && bodyModifierMap[bodyModifier]) {
      bodyModifierLine = bodyModifierMap[bodyModifier];
    } else {
      bodyModifierLine = `Your body type has a ${bodyModifier} modifier.`;
    }
  }

  // Prakriti content
  const prakritiTemplate = templates.prakriti[prakriti] || {
    paragraph: `You show ${prakriti} constitution tendencies — more details in paid report.`,
    strengths: ["Your natural constitution influences your strengths"],
    tip: "Work with your natural constitution for optimal health.",
  };

  // Prakriti modifier (prakriti-specific)
  const prakritiModifier = result.prakritiDetailed?.modifier || null;
  let prakritiModifierLine: string | null = null;
  if (prakritiModifier && prakriti) {
    const prakritiModifierMap = templates.prakritiModifiers[prakriti];
    if (prakritiModifierMap && prakritiModifierMap[prakritiModifier]) {
      prakritiModifierLine = prakritiModifierMap[prakritiModifier];
    } else {
      prakritiModifierLine = `Your constitution has a ${prakritiModifier} modifier.`;
    }
  }

  // Vikriti content
  const canonicalVikritiKey = getCanonicalVikritiKey(vikritiSummary);
  const vikritiTemplate = templates.vikriti[canonicalVikritiKey] || {
    paragraph: result.shortEmotionalLine || "No significant imbalance detected.",
    quickTip: "Maintain balanced routines and lifestyle practices.",
    empathyLine: result.shortEmotionalLine || "You're well balanced.",
  };

  // Paid preview
  const paidPreviewText = templates.paidPreview?.text || "72-hour reset • 14-day meal plan • 14-day movement plan";

  // Body code report (B1-B9)
  let bodyCodeReport = null;
  const bodyCode = result.bodyCode;
  if (bodyCode && templates.bodyCodeReports && templates.bodyCodeReports[bodyCode]) {
    bodyCodeReport = templates.bodyCodeReports[bodyCode];
  }

  // Prakriti code report (P1-P9)
  let prakritiCodeReport = null;
  const prakritiCode = result.prakritiCode;
  if (prakritiCode && templates.prakritiCodeReports && templates.prakritiCodeReports[prakritiCode]) {
    prakritiCodeReport = templates.prakritiCodeReports[prakritiCode];
  }

  // Vikriti code report (V0-V9)
  let vikritiCodeReport = null;
  const vikritiCode = result.vikritiCode;
  if (vikritiCode && templates.vikritiCodeReports && templates.vikritiCodeReports[vikritiCode]) {
    vikritiCodeReport = templates.vikritiCodeReports[vikritiCode];
  }

  return {
    bodyParagraph: bodyTemplate.paragraph,
    bodyModifierLine,
    bodyCommonFeeling: bodyTemplate.commonFeeling,
    bodyTip: bodyTemplate.tip,
    prakritiParagraph: prakritiTemplate.paragraph,
    prakritiModifierLine,
    prakritiStrengths: prakritiTemplate.strengths,
    prakritiTip: prakritiTemplate.tip,
    vikritiParagraph: vikritiTemplate.paragraph,
    vikritiQuickTip: vikritiTemplate.quickTip,
    vikritiEmpathyLine: vikritiTemplate.empathyLine || result.shortEmotionalLine,
    paidPreviewText,
    bodyCodeReport,
    prakritiCodeReport,
    vikritiCodeReport,
  };
}

