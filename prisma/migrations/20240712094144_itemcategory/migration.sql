-- CreateTable
CREATE TABLE "category" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itemStoreCategory" (
    "itemStoreId" VARCHAR(255) NOT NULL,
    "categoryId" VARCHAR(255) NOT NULL,

    CONSTRAINT "itemStoreCategory_pkey" PRIMARY KEY ("itemStoreId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- AddForeignKey
ALTER TABLE "itemStoreCategory" ADD CONSTRAINT "itemStoreCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itemStoreCategory" ADD CONSTRAINT "itemStoreCategory_itemStoreId_fkey" FOREIGN KEY ("itemStoreId") REFERENCES "itemStores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
