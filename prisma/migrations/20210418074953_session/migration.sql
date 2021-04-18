/*
  Warnings:

  - The primary key for the `session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sid` on the `session` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `session` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[uid]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uid` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Session.sid_unique` ON `session`;

-- AlterTable
ALTER TABLE `session` DROP PRIMARY KEY,
    DROP COLUMN `sid`,
    ADD COLUMN     `uid` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Session.uid_unique` ON `Session`(`uid`);
