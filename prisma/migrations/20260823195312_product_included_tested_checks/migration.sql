-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "includedItems" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "testedChecks" TEXT[] DEFAULT ARRAY[]::TEXT[];
