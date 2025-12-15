import express from "express";
import { prisma } from "../db";
import { scoreVPK } from "../services/scoring";
import { mergeReportWithTemplates } from "../services/reportTemplates";

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const { user, testType, answers } = req.body;
    if (!user || !answers) return res.status(400).json({ error: "invalid body" });

    // Validate answers if VPK test
    if (testType === "VPK") {
      if (!Array.isArray(answers) || answers.length !== 35) {
        return res.status(400).json({ error: "answers must be an array of length 35" });
      }
      const invalidValues = answers.filter((a: number) => a !== 1 && a !== 2 && a !== 3);
      if (invalidValues.length > 0) {
        return res.status(400).json({ error: "answers must contain only values 1, 2, or 3" });
      }
    }

    // find or create user
    let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: { name: user.name, email: user.email, phone: user.phone },
      });
    } else {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { name: user.name, phone: user.phone },
      });
    }

    // scoring
    let snapshot;
    if (testType === "VPK") {
      snapshot = scoreVPK(answers);
    } else {
      snapshot = { message: "unknown test" };
    }

    // save TestResponse
    const saved = await prisma.testResponse.create({
      data: {
        userId: dbUser.id,
        type: testType,
        answers: answers as any,
        score: snapshot.score as any,
        snapshot: snapshot as any,
      },
    });

    return res.json({ id: saved.id, snapshot });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

router.get("/result/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.testResponse.findUnique({ where: { id } });
    if (!result) return res.status(404).json({ error: "not found" });
    
    // Merge templates with result if snapshot exists
    let mergedReport = null;
    if (result.snapshot) {
      try {
        mergedReport = mergeReportWithTemplates(result.snapshot as any);
      } catch (err) {
        console.error("Error merging templates:", err);
        // Continue without merged report if template merge fails
      }
    }
    
    return res.json({ result, mergedReport });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// Merge report endpoint
router.post("/mergeReport", async (req, res) => {
  try {
    const { snapshot } = req.body;
    if (!snapshot) {
      return res.status(400).json({ error: "snapshot is required" });
    }
    
    const mergedReport = mergeReportWithTemplates(snapshot);
    return res.json({ mergedReport });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

export default router;


