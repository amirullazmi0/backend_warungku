/*
  Warnings:

  - The primary key for the `stores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_storesId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_userId_fkey";

-- AlterTable
ALTER TABLE "stores" DROP CONSTRAINT "stores_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "accessToken" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "refreshToken" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "stores_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "userId" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "storesId" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "refreshToken" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "accessToken" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "id" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "wishList" (
    "id" VARCHAR(255) NOT NULL,
    "itemStoreId" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wishList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shoppingCart" (
    "id" VARCHAR(255) NOT NULL,
    "itemStoreId" VARCHAR(255) NOT NULL,
    "total" INTEGER NOT NULL,
    "reatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shoppingCart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wishList_id_key" ON "wishList"("id");

-- CreateIndex
CREATE UNIQUE INDEX "shoppingCart_id_key" ON "shoppingCart"("id");

-- AddForeignKey
ALTER TABLE "wishList" ADD CONSTRAINT "wishList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishList" ADD CONSTRAINT "wishList_itemStoreId_fkey" FOREIGN KEY ("itemStoreId") REFERENCES "itemStores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shoppingCart" ADD CONSTRAINT "shoppingCart_itemStoreId_fkey" FOREIGN KEY ("itemStoreId") REFERENCES "itemStores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
