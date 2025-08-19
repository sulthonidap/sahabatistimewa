/*
  Warnings:

  - You are about to drop the column `content` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `psychologistId` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `reports` table. All the data in the column will be lost.
  - Added the required column `period` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportType` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `therapistId` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `reports_psychologistId_fkey`;

-- DropIndex
DROP INDEX `reports_psychologistId_fkey` ON `reports`;

-- AlterTable
ALTER TABLE `reports` DROP COLUMN `content`,
    DROP COLUMN `psychologistId`,
    DROP COLUMN `title`,
    ADD COLUMN `period` VARCHAR(191) NOT NULL,
    ADD COLUMN `recommendations` VARCHAR(191) NULL,
    ADD COLUMN `reportType` VARCHAR(191) NOT NULL,
    ADD COLUMN `summary` VARCHAR(191) NULL,
    ADD COLUMN `therapistId` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('DRAFT', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'REVIEWED') NOT NULL DEFAULT 'DRAFT';

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_therapistId_fkey` FOREIGN KEY (`therapistId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
