-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "notIncludedItems" TEXT[] DEFAULT ARRAY[]::TEXT[];
