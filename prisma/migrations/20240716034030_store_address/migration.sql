/*
  Warnings:

  - You are about to drop the column `address` on the `stores` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stores" DROP COLUMN "address",
ADD COLUMN     "addressId" VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE "storeAddress" (
    "addressId" VARCHAR(255) NOT NULL,
    "storeId" VARCHAR(255) NOT NULL,

    CONSTRAINT "storeAddress_pkey" PRIMARY KEY ("addressId","storeId")
);

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storeAddress" ADD CONSTRAINT "storeAddress_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storeAddress" ADD CONSTRAINT "storeAddress_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
