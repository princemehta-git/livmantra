/**
 * Example usage of the report generator
 */

import { generateReport, generateHumanReadableReport } from "./reportGenerator";

// Example: 35 answers
const exampleAnswers = [
  1, 2, 1, 2, 3, 1, // Body section (Q1-Q6)
  2, 2, 1, 2, 3, 1, 2, 3, 2, 1, 2, 3, // Prakriti section (Q7-Q18)
  1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2 // Vikriti section (Q19-Q35)
];

try {
  // Generate machine-readable JSON
  const report = generateReport(exampleAnswers);
  console.log("JSON Output:");
  console.log(JSON.stringify(report, null, 2));

  // Generate human-readable report
  const humanReport = generateHumanReadableReport(report);
  console.log("\nHuman-Readable Report:");
  console.log(humanReport);
} catch (error) {
  console.error("Error:", error);
}

