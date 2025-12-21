-- Create Feedback table
-- Run this SQL in your MySQL database (phpMyAdmin or MySQL client)

CREATE TABLE IF NOT EXISTS `feedback` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `resultId` VARCHAR(191) NOT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Feedback_userId_idx` (`userId`),
  INDEX `Feedback_resultId_idx` (`resultId`),
  CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Feedback_resultId_fkey` FOREIGN KEY (`resultId`) REFERENCES `testresponse` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

