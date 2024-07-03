/*
  Warnings:

  - You are about to drop the column `desc` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `stores` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storesId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_userId_fkey";

-- DropIndex
DROP INDEX "users_fullName_key";

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "desc" TEXT;

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "desc",
DROP COLUMN "name",
DROP COLUMN "userId",
ADD COLUMN     "Bio" TEXT,
ADD COLUMN     "accessToken" VARCHAR(250),
ADD COLUMN     "fullName" VARCHAR(255) NOT NULL,
ADD COLUMN     "password" VARCHAR(250) NOT NULL,
ADD COLUMN     "refreshToken" VARCHAR(250);

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "storesId" VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
