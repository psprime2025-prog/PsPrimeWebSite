-- AlterTable
ALTER TABLE "SellRequest" ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];
