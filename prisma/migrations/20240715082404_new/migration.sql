/*
  Warnings:

  - The primary key for the `wishList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `wishList` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `wishList` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `wishList` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "wishList_id_key";

-- AlterTable
ALTER TABLE "wishList" DROP CONSTRAINT "wishList_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD CONSTRAINT "wishList_pkey" PRIMARY KEY ("itemStoreId", "userId");
