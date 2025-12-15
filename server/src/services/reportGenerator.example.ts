/**
 * Example usage of the report generator
 */

import { generateReport, generateHumanReadableReport } from "./reportGenerator";

// Example: 35 answers
const exampleAnswers = [
  1, 2, 1, 2, 3, // Body section (Q1-Q5)
  2, 2, 1, 2, 3, 1, 2, 3, 2, 1, // Prakriti section (Q6-Q20)
  1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1 // Vikriti section (Q21-Q35)
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

