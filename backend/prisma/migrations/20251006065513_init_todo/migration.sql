/*
  Warnings:

  - You are about to drop the column `completed` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Todo` DROP COLUMN `completed`,
    DROP COLUMN `dueDate`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `done` BOOLEAN NOT NULL DEFAULT false;
