import * as fs from "fs";
import * as path from "path";

export type PersonalityDimensionTemplate = {
  title: string;
  subtitle: string;
  section1: {
    title: string;
    content: string;
  };
  section2: {
    title: string;
    content: string;
  };
  section3: {
    title: string;
    content: string;
  };
  section4: {
    title: string;
    content: string;
  };
  section5: {
    title: string;
    content: string;
  };
  section6: {
    title: string;
    content: string;
  };
  section7: {
    title: string;
    content: string;
  };
  finalNote: {
    title: string;
    content: string;
  };
};

export type PersonalityTemplates = {
  personalityDimensions: {
    [key: string]: PersonalityDimensionTemplate;
  };
};

let templatesCache: PersonalityTemplates | null = null;

/**
 * Load personality templates from JSON file
 */
export function loadPersonalityTemplates(): PersonalityTemplates {
  // Always reload from file to ensure latest templates (cache can be cleared by restarting server)
  try {
    const templatesPath = path.join(__dirname, "../../data/templates.json");
    const fileContent = fs.readFileSync(templatesPath, "utf-8");
    const allTemplates = JSON.parse(fileContent) as any;
    const loadedTemplates = {
      personalityDimensions: allTemplates.personalityDimensions || {},
    };
    templatesCache = loadedTemplates;
    
    // Debug: Log available template keys for Habit dimension
    const habitKeys = Object.keys(loadedTemplates.personalityDimensions).filter((k) =>
      k.startsWith("Habit_")
    );
    if (habitKeys.length > 0) {
      console.log("Available Habit template keys:", habitKeys);
    }
    
    return loadedTemplates;
  } catch (error) {
    console.error("Error loading personality templates:", error);
    throw new Error("Failed to load personality report templates");
  }
}

/**
 * Generate template key for a dimension
 * Format: {DimensionName}_{Variant}_{PoleName}
 * Examples: "Mind_A_Reflective", "Mind_B_Balanced", "Mind_C_Expressive"
 */
function generateTemplateKey(
  dimensionName: string,
  variant: "A" | "B" | "C",
  leftPole: string,
  rightPole: string
): string {
  // Map dimension names to their template prefixes
  const dimensionMap: { [key: string]: string } = {
    "Mind Style": "Mind",
    "Stress Response": "Stress",
    "Health Discipline Style": "Discipline",
    "Social & Emotional Style": "Social",
    "Energy & Activity Style": "Energy",
    "Habit & Change Style": "Habit",
  };
  
  const dimensionPrefix = dimensionMap[dimensionName] || dimensionName.replace(/\s+/g, "").replace(/&/g, "");
  
  if (variant === "B") {
    return `${dimensionPrefix}_B_Balanced`;
  }
  
  if (variant === "A") {
    // Left pole dominant - get first word of left pole
    const poleName = leftPole.split(/\s+/)[0].split("-")[0]; // Handle hyphenated poles like "Consistency-Driven"
    return `${dimensionPrefix}_A_${poleName}`;
  }
  
  // Variant C - Right pole dominant
  const poleName = rightPole.split(/\s+/)[0].split("-")[0]; // Handle hyphenated poles
  return `${dimensionPrefix}_C_${poleName}`;
}

/**
 * Merge personality result with templates to create enriched report
 */
export function mergePersonalityReportWithTemplates(result: any): {
  code: string;
  personalityType: any;
  dimensions: Array<{
    dimensionResult: any;
    template: PersonalityDimensionTemplate | null;
  }>;
} {
  const templates = loadPersonalityTemplates();
  const dimensions = result.dimensions || [];

  const enrichedDimensions = dimensions.map((dim: any) => {
    const templateKey = generateTemplateKey(
      dim.dimensionName,
      dim.variant,
      dim.leftPole,
      dim.rightPole
    );

    const template = templates.personalityDimensions[templateKey] || null;

    // Debug logging (can be removed later)
    if (!template) {
      console.warn(`Template not found for key: "${templateKey}"`, {
        dimensionName: dim.dimensionName,
        variant: dim.variant,
        leftPole: dim.leftPole,
        rightPole: dim.rightPole,
        availableKeys: Object.keys(templates.personalityDimensions).filter((k) =>
          k.startsWith(templateKey.split("_")[0])
        ),
      });
    }

    return {
      dimensionResult: dim,
      template,
    };
  });

  return {
    code: result.code,
    personalityType: result.personalityType,
    dimensions: enrichedDimensions,
  };
}
