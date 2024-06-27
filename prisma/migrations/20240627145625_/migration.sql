-- CreateTable
CREATE TABLE "users" (
    "email" VARCHAR(100) NOT NULL,
    "fullName" VARCHAR(200) NOT NULL,
    "images" VARCHAR(255),
    "password" VARCHAR(250) NOT NULL,
    "address" TEXT,
    "refreshToken" VARCHAR(250),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rolesName" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "roles" (
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "desc" TEXT,
    "address" TEXT,
    "logo" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userEmail" VARCHAR(100) NOT NULL,
    "itemStoreId" VARCHAR(255),

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itemStores" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "total" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "desc" TEXT,
    "images" JSON[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itemStores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" VARCHAR(255) NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "itemStoreId" VARCHAR(255) NOT NULL,
    "userEmail" VARCHAR(100) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_fullName_key" ON "users"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "stores_id_key" ON "stores"("id");

-- CreateIndex
CREATE UNIQUE INDEX "itemStores_id_key" ON "itemStores"("id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_id_key" ON "transactions"("id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_rolesName_fkey" FOREIGN KEY ("rolesName") REFERENCES "roles"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_itemStoreId_fkey" FOREIGN KEY ("itemStoreId") REFERENCES "itemStores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_itemStoreId_fkey" FOREIGN KEY ("itemStoreId") REFERENCES "itemStores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
