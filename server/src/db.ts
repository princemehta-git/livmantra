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
    
    const pushOutput = execSync("npx prisma db push --skip-generate --accept-data-loss", {
      cwd: path.join(__dirname, ".."),
      stdio: "pipe",
      env: { ...process.env },
      encoding: "utf-8",
    });
    
    const outputStr = pushOutput.toString();
    console.log("✅ Database schema synced successfully");
    console.log(outputStr);
  } catch (pushError: any) {
    const pushErrorOutput = pushError.stdout?.toString() || pushError.stderr?.toString() || pushError.message || "";
    console.error("❌ Failed to sync database schema:", pushErrorOutput);
    throw new Error(`Failed to sync database schema: ${pushErrorOutput}`);
  }
}

