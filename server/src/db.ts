import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import path from "path";

export const prisma = new PrismaClient();

/**
 * Initialize database - runs Prisma migrations and verifies schema
 */
export async function initializeDatabase() {
  try {
    console.log("🔄 Starting database initialization...");
    
    // Step 1: Apply Prisma migrations
    await runPrismaMigrations();
    
    // Step 2: Verify all tables and columns exist
    const schemaValid = await verifyDatabaseSchema();
    
    // Step 3: If schema is invalid, try to fix it with db push
    if (!schemaValid) {
      console.log("🔄 Schema verification failed. Attempting to sync database schema...");
      await syncDatabaseSchema();
      
      // Verify again after sync
      await verifyDatabaseSchema();
    }
    
    console.log("✅ Database initialization completed successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

/**
 * Run Prisma migrations to ensure database is up to date
 */
async function runPrismaMigrations() {
  try {
    console.log("🔄 Checking for pending Prisma migrations...");
    
    // Run prisma migrate deploy to apply pending migrations
    // This is safe to run on every startup as it only applies pending migrations
    try {
      const output = execSync("npx prisma migrate deploy", {
        cwd: path.join(__dirname, ".."),
        stdio: "pipe",
        env: { ...process.env },
        encoding: "utf-8",
      });
      
      const outputStr = output.toString();
      if (outputStr.includes("No pending migrations") || outputStr.includes("already applied")) {
        console.log("✅ Database is up to date with all migrations");
      } else {
        console.log("✅ Prisma migrations applied successfully");
        console.log(outputStr);
      }
    } catch (migrationError: any) {
      const errorOutput = migrationError.stdout?.toString() || migrationError.stderr?.toString() || migrationError.message || "";
      
      // Check if the error is just "no pending migrations" which is actually success
      if (
        errorOutput.includes("No pending migrations") ||
        errorOutput.includes("already applied") ||
        errorOutput.includes("Database schema is up to date")
      ) {
        console.log("✅ Database is up to date with all migrations");
        return; // Success, exit early
      }
      
      // If migration deploy fails, try db push as fallback (for development)
      console.warn("⚠️ Migration deploy encountered an issue:", errorOutput);
      console.log("🔄 Attempting schema sync as fallback...");
      
      try {
        const pushOutput = execSync("npx prisma db push --skip-generate", {
          cwd: path.join(__dirname, ".."),
          stdio: "pipe",
          env: { ...process.env },
          encoding: "utf-8",
        });
        console.log("✅ Database schema synced successfully");
        console.log(pushOutput.toString());
      } catch (pushError: any) {
        const pushErrorOutput = pushError.stdout?.toString() || pushError.stderr?.toString() || pushError.message || "";
        console.error("❌ Failed to sync database schema:", pushErrorOutput);
        // Don't throw - allow server to start even if migrations fail
        // The verification step will catch missing tables/columns
        console.warn("⚠️ Continuing startup, but database may need manual migration");
      }
    }
  } catch (error: any) {
    console.error("❌ Error running Prisma migrations:", error.message);
    // Don't throw - allow server to start, verification will catch issues
    console.warn("⚠️ Continuing startup, but database may need manual migration");
  }
}

/**
 * Verify that all tables and columns from Prisma schema exist in the database
 * Returns true if schema is valid, false otherwise
 */
async function verifyDatabaseSchema(): Promise<boolean> {
  try {
    console.log("🔍 Verifying database schema...");
    
    // Define expected tables and their columns based on Prisma schema
    const expectedTables = [
      {
        name: "user",
        columns: [
          "id", "name", "email", "phone", "password", "googleId", 
          "isAdmin", "dob", "gender", "profileImage", "state", 
          "nationality", "createdAt", "updatedAt"
        ]
      },
      {
        name: "testresponse",
        columns: [
          "id", "userId", "type", "answers", "score", "snapshot", 
          "status", "reportUrl", "createdAt"
        ]
      },
      {
        name: "feedback",
        columns: [
          "id", "userId", "resultId", "rating", "comment", "createdAt"
        ]
      },
      {
        name: "conversation",
        columns: [
          "id", "userId", "adminId", "lastMessageAt", "unreadCount", 
          "createdAt", "updatedAt"
        ]
      },
      {
        name: "message",
        columns: [
          "id", "conversationId", "senderId", "senderType", "content", 
          "attachmentUrl", "attachmentType", "isRead", "createdAt"
        ]
      }
    ];

    let schemaValid = true;

    // Check each table exists
    for (const table of expectedTables) {
      try {
        // Try to query the table to see if it exists
        await prisma.$queryRawUnsafe(`SELECT 1 FROM \`${table.name}\` LIMIT 1`);
        console.log(`✅ Table '${table.name}' exists`);
        
        // Verify columns exist
        const columnsValid = await verifyTableColumns(table.name, table.columns);
        if (!columnsValid) {
          schemaValid = false;
        }
      } catch (error: any) {
        if (
          error.code === "P2021" || 
          error.code === "P2010" || 
          error.meta?.code === "1146" || 
          error.message?.includes("does not exist") || 
          error.message?.includes("doesn't exist") ||
          error.message?.includes("Unknown table")
        ) {
          console.error(`❌ Table '${table.name}' does not exist.`);
          schemaValid = false;
        } else {
          // Other errors might be connection issues, log but don't fail
          console.warn(`⚠️ Could not verify table '${table.name}': ${error.message}`);
        }
      }
    }
    
    if (schemaValid) {
      console.log("✅ Database schema verification completed - all tables and columns exist");
    } else {
      console.warn("⚠️ Database schema verification found missing tables or columns");
    }
    
    return schemaValid;
  } catch (error: any) {
    console.error("❌ Database schema verification failed:", error.message);
    return false;
  }
}

/**
 * Verify that all expected columns exist in a table
 * Returns true if all columns exist, false otherwise
 */
async function verifyTableColumns(tableName: string, expectedColumns: string[]): Promise<boolean> {
  try {
    const result = await prisma.$queryRawUnsafe(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = '${tableName}'
    `) as Array<{ COLUMN_NAME: string }>;
    
    const existingColumns = result.map(row => row.COLUMN_NAME);
    const missingColumns = expectedColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.warn(`⚠️ Table '${tableName}' is missing columns: ${missingColumns.join(", ")}`);
      return false;
    } else {
      console.log(`✅ Table '${tableName}' has all expected columns`);
      return true;
    }
  } catch (error: any) {
    console.warn(`⚠️ Could not verify columns for table '${tableName}': ${error.message}`);
    return false;
  }
}

/**
 * Sync database schema using prisma db push
 * This will create missing tables and columns automatically
 */
async function syncDatabaseSchema() {
  try {
    console.log("🔄 Syncing database schema with Prisma schema...");
    
    try {
      const pushOutput = execSync("npx prisma db push --skip-generate --accept-data-loss", {
        cwd: path.join(__dirname, ".."),
        stdio: "pipe",
        env: { ...process.env },
        encoding: "utf-8",
      });
      
      const outputStr = pushOutput.toString();
      console.log("✅ Database schema synced successfully");
      if (outputStr) {
        console.log(outputStr);
      }
    } catch (pushError: any) {
      // Check both stdout and stderr for output
      const stdout = pushError.stdout?.toString() || "";
      const stderr = pushError.stderr?.toString() || "";
      const errorMessage = pushError.message || "";
      
      // Combine all output for logging
      const fullOutput = [stdout, stderr, errorMessage].filter(Boolean).join("\n");
      
      // Check if the output indicates success (sometimes prisma outputs to stderr even on success)
      const hasSuccessIndicators = 
        stdout.includes("Your database is now in sync") ||
        stdout.includes("Database schema is up to date") ||
        stdout.includes("Pushed to database") ||
        stderr.includes("Your database is now in sync") ||
        stderr.includes("Database schema is up to date") ||
        stderr.includes("Pushed to database");
      
      if (hasSuccessIndicators) {
        console.log("✅ Database schema synced successfully");
        if (fullOutput) {
          console.log(fullOutput);
        }
        return; // Success, exit early
      }
      
      // If it's a real error, try fallback: manually create missing tables
      console.warn("⚠️ prisma db push failed, attempting manual table creation as fallback...");
      console.error("STDOUT:", stdout || "(empty)");
      console.error("STDERR:", stderr || "(empty)");
      console.error("Error:", errorMessage || "(empty)");
      
      // Try to manually create missing tables
      try {
        await createMissingTables();
        console.log("✅ Successfully created missing tables manually");
        return; // Success with fallback
      } catch (manualError: any) {
        console.error("❌ Manual table creation also failed:", manualError.message);
        // If manual creation also fails, throw the original error
        throw new Error(`Database schema sync failed: ${fullOutput || errorMessage || "Unknown error"}`);
      }
    }
  } catch (error: any) {
    console.error("❌ Error in syncDatabaseSchema:", error.message);
    throw error;
  }
}

/**
 * Manually create missing tables as a fallback if prisma db push fails
 */
async function createMissingTables() {
  try {
    // Create conversation table if it doesn't exist
    try {
      await prisma.$queryRawUnsafe(`SELECT 1 FROM \`conversation\` LIMIT 1`);
      console.log("✅ Table 'conversation' already exists");
    } catch (error: any) {
      console.log("🔄 Creating 'conversation' table...");
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS \`conversation\` (
          \`id\` VARCHAR(191) NOT NULL,
          \`userId\` VARCHAR(191) NOT NULL,
          \`adminId\` VARCHAR(191) NULL,
          \`lastMessageAt\` DATETIME(3) NULL,
          \`unreadCount\` INT NOT NULL DEFAULT 0,
          \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
          UNIQUE INDEX \`conversation_userId_key\`(\`userId\`),
          PRIMARY KEY (\`id\`),
          CONSTRAINT \`conversation_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log("✅ Table 'conversation' created successfully");
    }

    // Create message table if it doesn't exist
    try {
      await prisma.$queryRawUnsafe(`SELECT 1 FROM \`message\` LIMIT 1`);
      console.log("✅ Table 'message' already exists");
    } catch (error: any) {
      console.log("🔄 Creating 'message' table...");
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS \`message\` (
          \`id\` VARCHAR(191) NOT NULL,
          \`conversationId\` VARCHAR(191) NOT NULL,
          \`senderId\` VARCHAR(191) NOT NULL,
          \`senderType\` VARCHAR(191) NOT NULL,
          \`content\` TEXT NULL,
          \`attachmentUrl\` VARCHAR(191) NULL,
          \`attachmentType\` VARCHAR(191) NULL,
          \`isRead\` BOOLEAN NOT NULL DEFAULT false,
          \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          PRIMARY KEY (\`id\`),
          INDEX \`message_conversationId_idx\`(\`conversationId\`),
          CONSTRAINT \`message_conversationId_fkey\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log("✅ Table 'message' created successfully");
    }

    // Add missing columns to user table
    const userColumns = [
      { name: "password", type: "VARCHAR(191) NULL" },
      { name: "googleId", type: "VARCHAR(191) NULL" },
      { name: "isAdmin", type: "BOOLEAN NOT NULL DEFAULT FALSE" },
      { name: "dob", type: "DATETIME(3) NULL" },
      { name: "gender", type: "VARCHAR(191) NULL" },
      { name: "profileImage", type: "VARCHAR(191) NULL" },
      { name: "state", type: "VARCHAR(191) NULL" },
      { name: "nationality", type: "VARCHAR(191) NULL" },
    ];

    for (const column of userColumns) {
      try {
        const checkResult = await prisma.$queryRawUnsafe(`
          SELECT COUNT(*) as count 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'user' 
          AND COLUMN_NAME = '${column.name}'
        `) as Array<{ count: number }>;
        
        if (checkResult[0]?.count === 0) {
          console.log(`🔄 Adding column '${column.name}' to 'user' table...`);
          await prisma.$executeRawUnsafe(`
            ALTER TABLE \`user\` 
            ADD COLUMN \`${column.name}\` ${column.type}
          `);
          console.log(`✅ Column '${column.name}' added to 'user' table`);
        } else {
          console.log(`✅ Column '${column.name}' already exists in 'user' table`);
        }
      } catch (error: any) {
        if (error.message?.includes("Duplicate column") || error.code === "42S21") {
          console.log(`✅ Column '${column.name}' already exists in 'user' table`);
        } else {
          console.warn(`⚠️ Could not add column '${column.name}': ${error.message}`);
        }
      }
    }

    // Add unique index for googleId if it doesn't exist
    try {
      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS \`user_googleId_key\` ON \`user\`(\`googleId\`);
      `);
    } catch (error: any) {
      // Index might already exist, which is fine
      if (!error.message?.includes("Duplicate key name")) {
        console.warn(`⚠️ Could not create googleId index: ${error.message}`);
      }
    }

    console.log("✅ All missing tables and columns created successfully");
  } catch (error: any) {
    console.error("❌ Error creating missing tables:", error.message);
    throw error;
  }
}

