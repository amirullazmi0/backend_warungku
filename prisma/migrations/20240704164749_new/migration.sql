/*
  Warnings:

  - Added the required column `userId` to the `shoppingCart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shoppingCart" ADD COLUMN     "userId" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "shoppingCart" ADD CONSTRAINT "shoppingCart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
