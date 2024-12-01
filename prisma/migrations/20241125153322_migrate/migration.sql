-- CreateEnum
CREATE TYPE "rolesUser" AS ENUM ('user', 'super');

-- CreateTable
CREATE TABLE "customer_user" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(200) NOT NULL,
    "images" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "accessToken" VARCHAR(255),
    "refreshToken" VARCHAR(255),
    "lastActive" TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rolesName" "rolesUser" NOT NULL DEFAULT 'user',
    "addressId" UUID,

    CONSTRAINT "customer_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_address" (
    "id" UUID NOT NULL,
    "active" BOOLEAN,
    "jalan" VARCHAR(255),
    "rt" VARCHAR(255),
    "rw" VARCHAR(255),
    "kodepos" VARCHAR(255),
    "kelurahan" VARCHAR(255),
    "kecamatan" VARCHAR(255),
    "kota" VARCHAR(255),
    "provinsi" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_customer_address" (
    "addressId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "user_customer_address_pkey" PRIMARY KEY ("addressId","userId")
);

-- CreateTable
CREATE TABLE "wishlist" (
    "itemStoreId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "wishlist_pkey" PRIMARY KEY ("itemStoreId","userId")
);

-- CreateTable
CREATE TABLE "shopping_cart_customer" (
    "id" UUID NOT NULL,
    "itemStoreId" UUID NOT NULL,
    "qty" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "reatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shopping_cart_customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_user_id_key" ON "customer_user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_user_email_key" ON "customer_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customer_address_id_key" ON "customer_address"("id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_cart_customer_id_key" ON "shopping_cart_customer"("id");

-- AddForeignKey
ALTER TABLE "customer_user" ADD CONSTRAINT "customer_user_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "customer_address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_customer_address" ADD CONSTRAINT "user_customer_address_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "customer_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_customer_address" ADD CONSTRAINT "user_customer_address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "customer_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "customer_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart_customer" ADD CONSTRAINT "shopping_cart_customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "customer_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
