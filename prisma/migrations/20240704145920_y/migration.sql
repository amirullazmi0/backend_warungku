/*
  Warnings:

  - You are about to drop the column `Bio` on the `stores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stores" DROP COLUMN "Bio",
ADD COLUMN     "bio" TEXT;
