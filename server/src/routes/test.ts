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
      const invalidValues = answers.filter((a: number) => a !== 1 && a !== 2 && a !== 3 && a !== 4);
      if (invalidValues.length > 0) {
        return res.status(400).json({ error: "answers must contain only values 1, 2, 3, or 4" });
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

// Submit feedback endpoint
router.post("/feedback", async (req, res) => {
  try {
    const { userId, resultId, rating, comment } = req.body;
    
    if (!userId || !resultId || !rating) {
      return res.status(400).json({ error: "userId, resultId, and rating are required" });
    }

    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "rating must be between 1 and 5" });
    }

    // Verify that the result exists and belongs to the user
    const result = await prisma.testResponse.findUnique({
      where: { id: resultId },
    });

    if (!result) {
      return res.status(404).json({ error: "result not found" });
    }

    if (result.userId !== userId) {
      return res.status(403).json({ error: "result does not belong to this user" });
    }

    // Ensure feedback table exists before trying to save
    try {
      await prisma.$queryRaw`SELECT 1 FROM feedback LIMIT 1`;
    } catch (error: any) {
      // If table doesn't exist (error code P2010 or 1146), create it
      if (error.code === "P2021" || error.code === "P2010" || error.meta?.code === "1146" || error.message?.includes("does not exist") || error.message?.includes("doesn't exist")) {
        console.log("⚠️ Feedback table not found, creating it...");
        try {
          await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS \`feedback\` (
              \`id\` VARCHAR(191) NOT NULL,
              \`userId\` VARCHAR(191) NOT NULL,
              \`resultId\` VARCHAR(191) NOT NULL,
              \`rating\` INT NOT NULL,
              \`comment\` TEXT NULL,
              \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
              PRIMARY KEY (\`id\`),
              INDEX \`Feedback_userId_idx\` (\`userId\`),
              INDEX \`Feedback_resultId_idx\` (\`resultId\`),
              CONSTRAINT \`Feedback_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`user\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
              CONSTRAINT \`Feedback_resultId_fkey\` FOREIGN KEY (\`resultId\`) REFERENCES \`testresponse\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
          `);
          console.log("✅ Feedback table created successfully");
        } catch (createError: any) {
          // If table creation fails, check if it's because table already exists
          if (createError.message?.includes("already exists") || createError.code === "42S01") {
            console.log("✅ Feedback table already exists");
          } else {
            console.error("❌ Error creating feedback table:", createError);
            throw createError;
          }
        }
      } else {
        throw error;
      }
    }

    // Save feedback
    const feedback = await prisma.feedback.create({
      data: {
        userId,
        resultId,
        rating,
        comment: comment || null,
      },
    });

    return res.json({ success: true, feedback });
  } catch (err) {
    console.error("Error saving feedback:", err);
    return res.status(500).json({ error: "server error" });
  }
});

export default router;


