/*
  Warnings:

  - You are about to drop the column `images` on the `itemStores` table. All the data in the column will be lost.
  - You are about to drop the column `itemStoreId` on the `stores` table. All the data in the column will be lost.
  - Added the required column `storeId` to the `itemStores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_addressId_fkey";

-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_itemStoreId_fkey";

-- AlterTable
ALTER TABLE "itemStores" DROP COLUMN "images",
ADD COLUMN     "storeId" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "itemStoreId",
ALTER COLUMN "addressId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "itemStoreImages" (
    "id" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "itemStoreId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itemStoreImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "itemStoreImages_id_key" ON "itemStoreImages"("id");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itemStores" ADD CONSTRAINT "itemStores_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itemStoreImages" ADD CONSTRAINT "itemStoreImages_itemStoreId_fkey" FOREIGN KEY ("itemStoreId") REFERENCES "itemStores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
