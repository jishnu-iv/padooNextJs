/*
  Warnings:

  - Added the required column `topicId` to the `ExamAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ExamAttempt` ADD COLUMN `topicId` VARCHAR(191) NOT NULL;
