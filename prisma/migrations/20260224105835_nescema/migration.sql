/*
  Warnings:

  - You are about to drop the column `order` on the `Subject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,examTypeId,stageId]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `examTypeId` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Subject_name_stageId_key` ON `Subject`;

-- AlterTable
ALTER TABLE `Subject` DROP COLUMN `order`,
    ADD COLUMN `examTypeId` VARCHAR(191) NOT NULL,
    MODIFY `stageId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Subject_name_examTypeId_stageId_key` ON `Subject`(`name`, `examTypeId`, `stageId`);

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_examTypeId_fkey` FOREIGN KEY (`examTypeId`) REFERENCES `ExamType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
