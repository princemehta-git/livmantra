import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

/**
 * Initialize database tables - creates missing tables if they don't exist
 */
export async function initializeDatabase() {
  try {
    // Check and create all tables if they don't exist
    await ensureUserTableExists();
    await ensureTestResponseTableExists();
    await ensureFeedbackTableExists();
    // Migrate user table to add new columns
    await migrateUserTable();
    console.log("✅ Database tables initialized");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

/**
 * Ensure user table exists, create it if it doesn't
 */
async function ensureUserTableExists() {
  try {
    await prisma.$queryRaw`SELECT 1 FROM user LIMIT 1`;
    console.log("✅ User table exists");
  } catch (error: any) {
    if (error.code === "P2021" || error.code === "P2010" || error.meta?.code === "1146" || error.message?.includes("does not exist") || error.message?.includes("doesn't exist")) {
      console.log("⚠️ User table not found, creating it...");
      try {
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS \`user\` (
            \`id\` VARCHAR(191) NOT NULL,
            \`name\` VARCHAR(191) NOT NULL,
            \`email\` VARCHAR(191) NOT NULL,
            \`phone\` VARCHAR(191) NOT NULL,
            \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
            \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
            PRIMARY KEY (\`id\`),
            UNIQUE KEY \`User_email_key\` (\`email\`)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log("✅ User table created successfully");
      } catch (createError: any) {
        if (createError.message?.includes("already exists") || createError.code === "42S01") {
          console.log("✅ User table already exists");
        } else {
          console.error("❌ Error creating user table:", createError);
          throw createError;
        }
      }
    } else {
      console.error("❌ Unexpected error checking user table:", error);
      throw error;
    }
  }
}

/**
 * Ensure testresponse table exists, create it if it doesn't
 */
async function ensureTestResponseTableExists() {
  try {
    await prisma.$queryRaw`SELECT 1 FROM testresponse LIMIT 1`;
    console.log("✅ TestResponse table exists");
  } catch (error: any) {
    if (error.code === "P2021" || error.code === "P2010" || error.meta?.code === "1146" || error.message?.includes("does not exist") || error.message?.includes("doesn't exist")) {
      console.log("⚠️ TestResponse table not found, creating it...");
      try {
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS \`testresponse\` (
            \`id\` VARCHAR(191) NOT NULL,
            \`userId\` VARCHAR(191) NOT NULL,
            \`type\` VARCHAR(191) NOT NULL,
            \`answers\` JSON NOT NULL,
            \`score\` DOUBLE PRECISION NULL,
            \`snapshot\` JSON NOT NULL,
            \`status\` VARCHAR(191) NOT NULL DEFAULT 'submitted',
            \`reportUrl\` VARCHAR(191) NULL,
            \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
            PRIMARY KEY (\`id\`),
            INDEX \`TestResponse_userId_idx\` (\`userId\`),
            CONSTRAINT \`TestResponse_userId_fkey\` FOREIGN KEY (\`userId\`) REFERENCES \`user\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log("✅ TestResponse table created successfully");
      } catch (createError: any) {
        if (createError.message?.includes("already exists") || createError.code === "42S01") {
          console.log("✅ TestResponse table already exists");
        } else {
          console.error("❌ Error creating testresponse table:", createError);
          throw createError;
        }
      }
    } else {
      console.error("❌ Unexpected error checking testresponse table:", error);
      throw error;
    }
  }
}

/**
 * Ensure feedback table exists, create it if it doesn't
 */
async function ensureFeedbackTableExists() {
  try {
    await prisma.$queryRaw`SELECT 1 FROM feedback LIMIT 1`;
    console.log("✅ Feedback table exists");
  } catch (error: any) {
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
        if (createError.message?.includes("already exists") || createError.code === "42S01") {
          console.log("✅ Feedback table already exists");
        } else {
          console.error("❌ Error creating feedback table:", createError);
          throw createError;
        }
      }
    } else {
      console.error("❌ Unexpected error checking feedback table:", error);
      throw error;
    }
  }
}

/**
 * Migrate user table to add new columns if they don't exist
 */
async function migrateUserTable() {
  try {
    const columns = [
      { name: "password", type: "VARCHAR(191) NULL" },
      { name: "isAdmin", type: "BOOLEAN NOT NULL DEFAULT FALSE" },
      { name: "dob", type: "DATETIME(3) NULL" },
      { name: "gender", type: "VARCHAR(191) NULL" },
      { name: "profileImage", type: "VARCHAR(191) NULL" },
      { name: "state", type: "VARCHAR(191) NULL" },
      { name: "nationality", type: "VARCHAR(191) NULL" },
    ];

    for (const column of columns) {
      try {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE \`user\` 
          ADD COLUMN IF NOT EXISTS \`${column.name}\` ${column.type}
        `);
        console.log(`✅ User table column '${column.name}' checked/added`);
      } catch (error: any) {
        // Column might already exist or there's a syntax issue with IF NOT EXISTS
        // Try without IF NOT EXISTS for MySQL compatibility
        if (error.message?.includes("Duplicate column") || error.code === "42S21") {
          console.log(`✅ User table column '${column.name}' already exists`);
        } else {
          // Try alternative syntax for MySQL
          try {
            const checkResult = await prisma.$queryRawUnsafe(`
              SELECT COUNT(*) as count 
              FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'user' 
              AND COLUMN_NAME = '${column.name}'
            `) as any[];
            
            if (checkResult[0]?.count === 0) {
              await prisma.$executeRawUnsafe(`
                ALTER TABLE \`user\` 
                ADD COLUMN \`${column.name}\` ${column.type}
              `);
              console.log(`✅ User table column '${column.name}' added`);
            } else {
              console.log(`✅ User table column '${column.name}' already exists`);
            }
          } catch (altError: any) {
            console.log(`⚠️ Could not add column '${column.name}': ${altError.message}`);
          }
        }
      }
    }
  } catch (error: any) {
    console.error("⚠️ Error migrating user table:", error.message);
    // Don't throw - allow app to continue even if migration fails
  }
}

