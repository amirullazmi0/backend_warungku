-- AlterTable
ALTER TABLE "address" ALTER COLUMN "active" DROP NOT NULL,
ALTER COLUMN "jalan" DROP NOT NULL,
ALTER COLUMN "rt" DROP NOT NULL,
ALTER COLUMN "rw" DROP NOT NULL,
ALTER COLUMN "kodepos" DROP NOT NULL,
ALTER COLUMN "kelurahan" DROP NOT NULL,
ALTER COLUMN "kecamatan" DROP NOT NULL,
ALTER COLUMN "kota" DROP NOT NULL,
ALTER COLUMN "provinsi" DROP NOT NULL;